// The 3D side of the Explore page: one renderer and camera for every world, the frame loop, the
// switch between worlds (the address decides which: pages/Explore.jsx calls show), the player in the
// walking worlds and the light mode. A world is a module whose build(ctx, target) returns
// { mode: 'orbit' | 'walk', root, env, ... } (see docs/design.md, Architecture).
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { lightMode } from './quality.js'
import { Input } from './input.js'
import { Player } from './player.js'
import { loadWorld, worldKey } from '../worlds/registry.js'
import { ambience } from '../audio/sound.js'

const sleep = ms => new Promise(r => setTimeout(r, ms))

export class Engine {
  constructor(canvas, { store, i18n }) {
    this.canvas = canvas
    this.store = store
    this.i18n = i18n
    this.navigate = null
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    r.outputColorSpace = THREE.SRGBColorSpace
    r.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer = r
    this.light = lightMode(r)
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.light ? 1.5 : 2))
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.05, 4000)
    const pmrem = new THREE.PMREMGenerator(r)
    this.studio = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    this.input = new Input(canvas)
    this.player = new Player(this)
    if (!this.light) {
      this.composer = new EffectComposer(r)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.5, 0.85)
      this.composer.addPass(this.bloom)
      this.composer.addPass(new OutputPass())
    }
    this.world = null
    this.key = null
    this.token = 0
    this.time = 0
    this.frames = 0
    this.clock = new THREE.Clock()
    this.resize = this.resize.bind(this)
    this.observer = new ResizeObserver(this.resize)
    this.observer.observe(canvas)
    this.resize()
    store.set({ light: this.light })
    r.setAnimationLoop(() => this.frame())
    this.compiles = new Set() // shader compiles under way (compileFor)
    window.__ew = this // for the probes in tools/
  }

  /** What a world gets to build itself with. */
  context() {
    return {
      engine: this,
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      canvas: this.canvas,
      input: this.input,
      store: this.store,
      light: this.light,
      t: (k, o) => this.i18n.t(k, o),
      lang: () => this.i18n.resolvedLanguage || this.i18n.language,
      level: () => this.store.get().level,
      go: path => this.go(path),
    }
  }

  /** Go to an address (a door, the plaza's Enter): the page's router changes the address, and the
   *  address calls show. */
  go(path) {
    if (this.navigate) this.navigate(path)
  }

  /** Show the world for a target ({ kind: 'plaza' | 'atrium' | 'wing', symbol, wing, at }). */
  async show(target) {
    const key = worldKey(target)
    if (key === this.key && this.world) {
      this.world.retarget?.(target)
      return
    }
    const token = ++this.token
    const started = performance.now()
    this.store.set({ fading: true, error: null })
    let next
    const t0 = performance.now()
    let t1 = t0
    try {
      // a world built ahead (prewarm) is taken as it is
      const pre = this.pre?.key === key ? this.pre : null
      this.pre = null
      next = pre ? await pre.ready : null
      t1 = performance.now()
      if (!next) {
        const mod = await loadWorld(target)
        t1 = performance.now()
        if (token !== this.token) return
        next = await mod.build(this.context(), target, this.last ?? null)
      }
    } catch (err) {
      console.error(err)
      if (token === this.token) this.store.set({ fading: false, error: String(err?.message ?? err) })
      return
    }
    const wait = 320 - (performance.now() - started)
    if (this.world && wait > 0) await sleep(wait)
    if (token !== this.token) {
      next.dispose?.()
      return
    }
    const t2 = performance.now()
    // never dispose a world while any shaders are still being compiled (its own warm-up, or a wing
    // built ahead that may share materials with it): three.js keeps polling the materials and fails
    // on a disposed one ("reading 'isReady'", walking into an arch while its wing was being prepared)
    if (this.compiles.size) await Promise.all([...this.compiles])
    if (token !== this.token) {
      next.dispose?.()
      return
    }
    this.leave()
    this.enter(next, key, target)
    this.last = target
    this.lastTarget = target
    await this.warm()
    // how long each part of the switch took (probes read it: load the code, build, compile shaders)
    this.timings = { load: Math.round(t1 - t0), build: Math.round(t2 - t1), warm: Math.round(performance.now() - t2) }
    if (token === this.token) this.store.set({ fading: false })
  }

  /** Build a world ahead and compile its shaders in the background, so walking into it is quick
   *  (the first visit to a big wing spent 8 s compiling shaders on Windows; the browser keeps them for
   *  the next visits). The hall calls this when the player walks toward an arch. One at a time. */
  prewarm(target) {
    const key = worldKey(target)
    if (this.light || this.key === key || this.pre) return
    const pre = { key }
    pre.ready = (async () => {
      try {
        const mod = await loadWorld(target)
        const w = await mod.build(this.context(), target, this.lastTarget ?? null)
        // compile against the world's own lights, fog and environment, as it will be drawn
        const stage = new THREE.Scene()
        stage.environment = w.env?.environment === null ? null : w.env?.environment ?? this.studio
        stage.fog = w.env?.fog ?? null
        stage.add(w.root)
        await this.compileFor(stage)
        stage.remove(w.root)
        return w
      } catch (err) {
        console.warn('prewarm failed', err)
        return null
      }
    })()
    this.pre = pre
    // a prewarmed world nobody entered within a minute is let go
    setTimeout(async () => {
      if (this.pre !== pre) return
      this.pre = null
      const w = await pre.ready
      if (w) {
        w.dispose?.()
        disposeTree(w.root)
      }
    }, 60000)
  }

  /** Build the current world again (a new language: worlds write their words when built). */
  reload(target) {
    this.key = null
    return this.show(target)
  }

  enter(w, key, target) {
    this.world = w
    this.key = key
    this.scene.add(w.root)
    const env = w.env ?? {}
    this.scene.background = env.background ?? new THREE.Color('#0b0f24')
    this.scene.fog = env.fog ?? null
    this.scene.environment = env.environment === null ? null : env.environment ?? this.studio
    this.scene.environmentIntensity = env.envIntensity ?? 1
    this.renderer.toneMappingExposure = env.exposure ?? 1
    if (this.bloom) {
      const b = env.bloom
      this.bloom.enabled = b !== false
      if (b) Object.assign(this.bloom, { strength: b.strength ?? 0.5, radius: b.radius ?? 0.5, threshold: b.threshold ?? 0.85 })
    }
    // soft shadows where a world asks for them (computers only)
    this.renderer.shadowMap.enabled = !!env.shadows && !this.light
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.camera.fov = env.fov ?? 55
    this.camera.near = env.near ?? 0.05
    this.camera.far = env.far ?? 4000
    this.camera.updateProjectionMatrix()
    this.input.pointerLook = w.mode === 'walk'
    if (w.mode === 'walk') {
      this.player.mode = this.store.get().mode ?? 'third'
      this.player.place(w.spawn, w)
      this.player.setAvatar(w.avatar ?? null)
    } else this.player.setAvatar(null)
    w.attach?.(this)
    ambience(target.kind)
    this.store.set({
      world: { kind: target.kind, symbol: target.symbol ?? null, wing: target.wing ?? null },
      prompt: null,
      panel: null,
      title: w.title ?? null,
    })
  }

  leave() {
    const w = this.world
    if (!w) return
    w.detach?.(this)
    this.scene.remove(w.root)
    w.dispose?.()
    disposeTree(w.root)
    this.world = null
    this.key = null
  }

  /** Compile a scene's shaders as they will be drawn. With bloom the scene is drawn into the
   *  composer's buffer, linear and without tone mapping, and three.js makes those other programs than
   *  the screen's (sRGB, tone-mapped): compiling for the screen wasted half the work, and the real ones
   *  still compiled on the first frames (carbon's gallery: 92 programs, 9 s). The programs are chosen
   *  when compileAsync starts, so the target is set only around that call. */
  compileFor(scene) {
    const r = this.renderer
    const old = r.getRenderTarget()
    r.setRenderTarget(this.composer ? this.composer.readBuffer : null)
    let done
    try {
      done = r.compileAsync(scene, this.camera)
    } finally {
      r.setRenderTarget(old)
    }
    // every pending compile is known, so no world is disposed under one (show)
    const pending = done.catch(() => {}).then(() => this.compiles.delete(pending))
    this.compiles.add(pending)
    return done
  }

  /** Compile the new world's shaders before the fade comes up, so its first frames do not stall. */
  async warm() {
    try {
      await this.compileFor(this.scene)
    } catch {
      // older drivers: they compile on the first frame instead
    }
  }

  setMode(mode) {
    if (this.world?.mode === 'walk') this.player.setMode(mode, this.world)
    this.store.set({ mode })
  }

  use() {
    if (this.world?.mode === 'walk') this.player.use()
  }

  /** Put the walker somewhere (probes and screenshots): x, z in metres, yaw (0 looks along -z),
   *  pitch for first person. */
  teleport(x, z, yaw = this.player.yaw, pitch = this.player.pitch) {
    const p = this.player
    p.pos.set(x, p.pos.y, z)
    p.yaw = yaw
    p.pitch = pitch
    p.camOffset = 0
    p.camSnap = true
  }

  frame() {
    const dt = Math.min(this.clock.getDelta(), 1 / 20)
    this.time += dt
    const w = this.world
    if (w) {
      if (w.mode === 'walk') {
        if (this.input.took('KeyV')) this.setMode(this.store.get().mode === 'first' ? 'third' : 'first')
        if (this.input.took('KeyE')) this.player.use()
        if (this.input.took('KeyT')) w.talk?.()
        this.player.update(dt, w, this.input, this.time)
      }
      w.update?.(dt, this.time, this)
    }
    this.input.endFrame()
    if (this.composer) this.composer.render(dt)
    else this.renderer.render(this.scene, this.camera)
    this.frames++
  }

  resize() {
    const c = this.canvas
    const w = c.clientWidth || 1
    const h = c.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.composer?.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.world?.resize?.(w, h)
  }

  dispose() {
    this.token++
    this.renderer.setAnimationLoop(null)
    this.leave()
    this.observer.disconnect()
    this.input.dispose()
    this.composer?.dispose()
    this.studio.dispose()
    this.renderer.dispose()
    if (window.__ew === this) delete window.__ew
  }
}

/** Free a world's geometry, materials and textures (those not marked userData.shared). */
export function disposeTree(root) {
  root.traverse(o => {
    if (o.userData?.shared) return
    if (o.material?.isTroikaTextMaterial || o.isTroikaText) {
      o.dispose()
      return
    }
    o.geometry?.dispose?.()
    for (const m of [o.material].flat()) {
      if (!m || m.userData?.shared) continue
      for (const v of Object.values(m)) if (v?.isTexture && !v.userData?.shared) v.dispose()
      m.dispose?.()
    }
  })
}
