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
    try {
      const mod = await loadWorld(target)
      if (token !== this.token) return
      next = await mod.build(this.context(), target)
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
    this.leave()
    this.enter(next, key, target)
    await this.warm()
    if (token === this.token) this.store.set({ fading: false })
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

  /** Compile the new world's shaders before the fade comes up, so its first frames do not stall. */
  async warm() {
    try {
      await this.renderer.compileAsync(this.scene, this.camera)
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

  frame() {
    const dt = Math.min(this.clock.getDelta(), 1 / 20)
    this.time += dt
    const w = this.world
    if (w) {
      if (w.mode === 'walk') {
        if (this.input.took('KeyV')) this.setMode(this.store.get().mode === 'first' ? 'third' : 'first')
        if (this.input.took('KeyE')) this.player.use()
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
