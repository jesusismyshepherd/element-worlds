// A stage for Atomlings side by side (the Atomlings page): its own renderer, a soft studio light, a
// slow turn of the camera, each character idling and now and then waving.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createAtomling } from './atomling.js'
import { disposeTree } from '../engine/engine.js'
import { lightMode } from '../engine/quality.js'
import { makeText } from '../engine/text.js'

export class Lineup {
  constructor(canvas) {
    this.canvas = canvas
    const r = new THREE.WebGLRenderer({ canvas, antialias: true })
    r.outputColorSpace = THREE.SRGBColorSpace
    r.toneMapping = THREE.ACESFilmicToneMapping
    r.shadowMap.enabled = true
    r.shadowMap.type = THREE.PCFSoftShadowMap
    this.light = lightMode(r)
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.light ? 1.5 : 2))
    this.renderer = r
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#141a3a')
    const pmrem = new THREE.PMREMGenerator(r)
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    this.scene.environment = this.env
    this.scene.environmentIntensity = 0.75
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 200)
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = 1.55

    const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: '#161c40', roughness: 0.85 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)
    this.scene.add(new THREE.HemisphereLight('#c9d6ff', '#1a1f40', 0.9))
    const key = new THREE.DirectionalLight('#fff4e6', 2.2)
    key.position.set(4, 9, 7)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -14
    key.shadow.camera.right = 14
    key.shadow.camera.top = 6
    key.shadow.camera.bottom = -4
    key.shadow.bias = -0.0005
    this.scene.add(key)
    const rim = new THREE.DirectionalLight('#8fb4ff', 1.4)
    rim.position.set(-6, 5, -8)
    this.scene.add(rim)

    if (!this.light) {
      this.composer = new EffectComposer(r)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.4, 0.85))
      this.composer.addPass(new OutputPass())
    }
    this.cast = new THREE.Group()
    this.scene.add(this.cast)
    this.members = []
    this.clock = new THREE.Clock()
    this.time = 0
    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(canvas)
    this.resize()
    r.setAnimationLoop(() => this.frame())
    window.__lineup = this
  }

  /** Show these elements in a row, each with its name under it. */
  show(elements, nameOf) {
    disposeTree(this.cast)
    this.scene.remove(this.cast)
    this.cast = new THREE.Group()
    this.scene.add(this.cast)
    this.members = []
    const built = elements.map(el => createAtomling(el, { light: this.light }))
    const gap = 0.35
    const widths = built.map(a => a.body.radius * 2 + 0.55)
    let x = -(widths.reduce((s, w) => s + w, 0) + gap * (built.length - 1)) / 2
    built.forEach((a, i) => {
      x += widths[i] / 2
      a.root.position.set(x, 0, 0)
      a.root.rotation.y = -x * 0.03
      this.cast.add(a.root)
      const label = makeText(nameOf(elements[i]), { font: 'display', size: 0.11, color: '#dfe6ff', anchorY: 'top' })
      label.position.set(x, -0.02, a.body.radius + 0.3)
      label.rotation.x = -0.35
      this.cast.add(label)
      this.members.push({ a, nextWave: 1 + Math.random() * 6 })
      x += widths[i] / 2 + gap
    })
    const span = Math.max(3, -2 * (widths[0] / 2 - x)) // row width
    const tall = Math.max(...built.map(a => a.body.height + a.traits.hover)) + 0.3
    const fov = THREE.MathUtils.degToRad(this.camera.fov)
    const fitW = span / 2 / Math.tan(Math.atan(Math.tan(fov / 2) * this.camera.aspect)) * 1.08
    const fitH = tall / 2 / Math.tan(fov / 2) * 1.6
    const d = Math.max(fitW, fitH, 3)
    this.controls.target.set(0, tall * 0.42, 0)
    this.camera.position.set(0, tall * 0.42 + d * 0.22, d)
    this.controls.update()
  }

  frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.time += dt
    for (const m of this.members) {
      m.nextWave -= dt
      if (m.nextWave <= 0) {
        m.a.wave()
        m.nextWave = 5 + Math.random() * 8
      }
      m.a.update(dt, this.time, { speed: 0 })
    }
    this.controls.update()
    if (this.composer) this.composer.render(dt)
    else this.renderer.render(this.scene, this.camera)
  }

  resize() {
    const w = this.canvas.clientWidth || 1
    const h = this.canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.composer?.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.observer.disconnect()
    this.controls.dispose()
    disposeTree(this.scene)
    this.env.dispose()
    this.composer?.dispose()
    this.renderer.dispose()
    if (window.__lineup === this) delete window.__lineup
  }
}
