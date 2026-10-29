// Effects the Periodic Videos rooms share: one small particle system (bubbles, sparks, smoke, steam), and a
// flame that stands on a point. Every room's chemistry is built from these (docs/knowledge/periodic-videos.md,
// "the kit"), so they stay generic: colours, sizes and lifetimes come from the caller.
import * as THREE from 'three'
import { canvasTex } from '../noble/kit.js'

const VERT = `
attribute float aSize;
attribute float aAlpha;
varying float vAlpha;
uniform float uScale;
void main() {
  vAlpha = aAlpha;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale / max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
}`
const FRAG = `
uniform vec3 uColor;
uniform float uBoost;
uniform float uSoft;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.5 - uSoft, 0.5, d)) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor * uBoost, a);
}`

/** A pool of round particles: emit(x, y, z, vx, vy, vz, life, size), update(dt, camera, viewHeight).
 *  gravity pulls down (m/s2), drag slows (1/s), grow widens a particle over its life (x times its size). */
export function particles({ max = 160, color = '#ffffff', boost = 1, additive = false, soft = 0.45, gravity = 0, drag = 0, grow = 0, fadeIn = 0.08 } = {}) {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(max * 3)
  const size = new Float32Array(max)
  const alpha = new Float32Array(max)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uBoost: { value: boost }, uScale: { value: 600 }, uSoft: { value: soft } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  points.renderOrder = 3
  const live = []
  function emit(x, y, z, vx, vy, vz, life, s) {
    if (live.length >= max) live.shift()
    live.push({ x, y, z, vx, vy, vz, life, max: life, s })
  }
  function update(dt, camera, viewHeight) {
    if (camera) mat.uniforms.uScale.value = viewHeight / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
    let n = 0
    for (let i = live.length - 1; i >= 0; i--) {
      const p = live[i]
      p.life -= dt
      if (p.life <= 0) {
        live.splice(i, 1)
        continue
      }
      const k = Math.exp(-drag * dt)
      p.vx *= k
      p.vz *= k
      p.vy = p.vy * k - gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
    }
    for (const p of live) {
      const age = 1 - p.life / p.max
      pos[n * 3] = p.x
      pos[n * 3 + 1] = p.y
      pos[n * 3 + 2] = p.z
      size[n] = p.s * (1 + grow * age)
      alpha[n] = Math.min(1, age / Math.max(1e-3, fadeIn)) * (1 - age)
      n++
    }
    geo.setDrawRange(0, n)
    geo.attributes.position.needsUpdate = true
    geo.attributes.aSize.needsUpdate = true
    geo.attributes.aAlpha.needsUpdate = true
  }
  return { points, emit, update, clear: () => (live.length = 0), get count() { return live.length }, dispose: () => { geo.dispose(); mat.dispose() } }
}

let flameTex = null
/** A flame standing on a point (a camera-facing teardrop, bright at the core): set(power 0..1), update(dt, t).
 *  With a light unless `light` (the weak devices' mode). */
export function flame({ color = '#ffb21e', core = '#fff1b8', height = 0.22, light = false } = {}) {
  flameTex ??= canvasTex(64, 128, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h * 0.72, 2, w / 2, h * 0.62, h * 0.55)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,255,255,0.75)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.beginPath()
    g.moveTo(w / 2, 0)
    g.bezierCurveTo(w * 0.95, h * 0.45, w, h * 0.95, w / 2, h)
    g.bezierCurveTo(0, h * 0.95, w * 0.05, h * 0.45, w / 2, 0)
    g.fill()
  })
  const group = new THREE.Group()
  const outer = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: new THREE.Color(color).multiplyScalar(1.25), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
  const inner = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: new THREE.Color(core).multiplyScalar(1.45), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
  outer.center.set(0.5, 0.05)
  inner.center.set(0.5, 0.05)
  group.add(outer, inner)
  const lamp = light ? null : new THREE.PointLight(color, 0, 3.5, 2)
  if (lamp) {
    lamp.position.y = height * 0.5
    group.add(lamp)
  }
  let power = 0
  let shown = 0
  group.visible = false
  return {
    group,
    set: p => {
      power = p
    },
    get power() {
      return power
    },
    update(dt, t) {
      shown += (power - shown) * Math.min(1, dt * 10)
      group.visible = shown > 0.02
      if (!group.visible) return
      const flick = 1 + 0.18 * Math.sin(t * 31) + 0.12 * Math.sin(t * 17.3 + 1.7)
      outer.scale.set(height * 0.55 * shown, height * shown * flick, 1)
      inner.scale.set(height * 0.28 * shown, height * 0.55 * shown * flick, 1)
      if (lamp) lamp.intensity = 0.7 * shown * flick
    },
  }
}
