// The ozone layer in a column: the atmosphere to scale in a 5 m glass tube (1 m = 10 km), with Everest
// (8.8 km) and a jet at cruising height (11 km) for scale, and the ozone layer glowing between 15 and
// 35 km, O3 molecules (bent, 116.8 degrees) drifting in it. Tapping it sends a volley of the Sun's UV down
// the tube: UV-C is all stopped in the layer, UV-B nine times in ten, UV-A goes through to the ground;
// a counter says how many of each got through. It also sends rays to the real layer over the deck.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { standingScreen, glowMat, hdr, softDot, Particles, glass, NOISE_GLSL, random, label, hitShape } from './kit.js'
import { UV_THROUGH } from './oxygenData.js'

const H0 = 0.32 // the column's floor (0 km)
const PER_KM = 0.1 // metres per kilometre
const TOP = H0 + 50 * PER_KM
const R = 0.82

export const UV_KINDS = [
  { id: 'A', color: '#cbb4ff', pass: UV_THROUGH.A, stopFrom: 0, stopTo: 0 },
  { id: 'B', color: '#9466ff', pass: UV_THROUGH.B, stopFrom: 18, stopTo: 30 },
  { id: 'C', color: '#ff58d6', pass: UV_THROUGH.C, stopFrom: 24, stopTo: 35 },
]

export function ozoneColumn({ color, light, words, level }) {
  const group = new THREE.Group()
  const rnd = random(315)
  const white = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.08 })
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, H0, 56), white)
  plinth.position.y = H0 / 2
  plinth.castShadow = plinth.receiveShadow = true
  group.add(plinth)
  for (const y of [H0, TOP]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.04, 0.035, 10, 72), glowMat(color, 1.8))
    ring.rotation.x = Math.PI / 2
    ring.position.y = y
    group.add(ring)
  }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.1, R + 0.06, 0.16, 56), white)
  cap.position.y = TOP + 0.08
  cap.castShadow = true
  group.add(cap)
  // the sun lamp under the cap
  const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.3, 40), new THREE.MeshBasicMaterial({ color: hdr('#fff3c4', 3) }))
  lamp.rotation.x = Math.PI / 2
  lamp.position.y = TOP - 0.005
  group.add(lamp)

  // the air inside: blue near the ground, darker blue higher up (seen on the far inside wall)
  const airMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec3 vP;
      void main() {
        float km = (vP.y + ${((TOP - H0) / 2).toFixed(4)}) / ${PER_KM.toFixed(4)};
        vec3 low = vec3(0.2, 0.45, 0.95);
        vec3 high = vec3(0.012, 0.02, 0.1);
        vec3 c = mix(low, high, smoothstep(2.0, 48.0, km));
        float a = mix(0.82, 0.95, smoothstep(0.0, 50.0, km));
        gl_FragColor = vec4(c, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const air = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.02, R - 0.02, TOP - H0, 48, 1, true), airMat)
  air.position.y = (TOP + H0) / 2
  air.renderOrder = 1
  group.add(air)

  // the ozone layer: a glowing band, densest at 20 to 25 km
  const bandMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uFlash: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      ${NOISE_GLSL}
      uniform float uTime;
      uniform float uFlash;
      varying vec3 vP;
      void main() {
        float km = 25.0 + vP.y / ${PER_KM.toFixed(4)};
        float dens = smoothstep(15.0, 21.0, km) * (1.0 - smoothstep(26.0, 35.0, km));
        float n = snoise(vec3(vP.x * 3.0, vP.y * 2.0 - uTime * 0.15, vP.z * 3.0)) * 0.5 + 0.5;
        float a = dens * (0.13 + 0.15 * n) * (1.0 + uFlash * 1.6);
        vec3 c = mix(vec3(0.3, 0.3, 1.0), vec3(0.62, 0.32, 1.0), n) * a;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  for (const r of [R - 0.05, R * 0.55]) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.0, 48, 1, true), bandMat)
    band.position.y = H0 + 25 * PER_KM
    band.renderOrder = 3
    group.add(band)
  }

  // O3 molecules drifting in the layer: few and big enough to see their bent shape, turned to the reader
  const count = light ? 9 : 15
  const s = 0.115 // metres per angstrom here
  const half = (116.8 / 2) * (Math.PI / 180)
  const shape = [new THREE.Vector3(0, 0.4 * s, 0), new THREE.Vector3(-Math.sin(half) * 1.278 * s, (0.4 - Math.cos(half) * 1.278) * s, 0), new THREE.Vector3(Math.sin(half) * 1.278 * s, (0.4 - Math.cos(half) * 1.278) * s, 0)]
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 18, 12), new THREE.MeshStandardMaterial({ color: '#ff6a5c', emissive: '#ff4436', emissiveIntensity: 0.7, roughness: 0.3 }), count * 3)
  const stickMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 8), new THREE.MeshStandardMaterial({ color: '#f3ecff', emissive: '#c9a7ff', emissiveIntensity: 0.9 }), count * 2)
  atomMesh.renderOrder = stickMesh.renderOrder = 2
  group.add(atomMesh, stickMesh)
  const mols = Array.from({ length: count }, (_, i) => {
    const a = i * 2.39996
    const r = (0.25 + 0.75 * ((i * 0.618034) % 1)) * (R - 0.2)
    return {
      p: new THREE.Vector3(Math.cos(a) * r, H0 + (17 + ((i * 0.381966) % 1) * 16) * PER_KM, Math.sin(a) * r),
      q: new THREE.Quaternion(),
      spin: rnd() * 6.3,
      rate: (rnd() - 0.5) * 0.8,
      wob: rnd() * 6.3,
      v: new THREE.Vector3(rnd() - 0.5, (rnd() - 0.5) * 0.4, rnd() - 0.5).multiplyScalar(0.08),
      hit: 0,
    }
  })
  const Zax = new THREE.Vector3(0, 0, 1)
  const Xax = new THREE.Vector3(1, 0, 0)
  const qw = new THREE.Quaternion()
  let clock = 0
  const m4 = new THREE.Matrix4()
  const v1 = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const one = new THREE.Vector3()
  const qq = new THREE.Quaternion()
  const dq = new THREE.Quaternion()
  const Y = new THREE.Vector3(0, 1, 0)
  const pts = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
  const placeMols = dt => {
    clock += dt
    mols.forEach((m, i) => {
      m.p.addScaledVector(m.v, dt)
      const rr = Math.hypot(m.p.x, m.p.z)
      if (rr > R - 0.12) {
        m.v.x -= (m.p.x / rr) * 0.05
        m.v.z -= (m.p.z / rr) * 0.05
      }
      if (m.p.y < H0 + 16 * PER_KM) m.v.y = Math.abs(m.v.y)
      if (m.p.y > H0 + 34 * PER_KM) m.v.y = -Math.abs(m.v.y)
      // their bent side to the reader (+z), turning slowly in their own plane, a little wobble;
      // a molecule hit by UV spins up for a moment
      m.spin += m.rate * dt * (1 + m.hit * 8)
      m.q.setFromAxisAngle(Zax, m.spin).premultiply(qw.setFromAxisAngle(Xax, Math.sin(clock * 0.7 + m.wob) * 0.35))
      m.hit = Math.max(0, m.hit - dt * 2)
      shape.forEach((a, j) => pts[j].copy(a).applyQuaternion(m.q).add(m.p))
      pts.forEach((p, j) => atomMesh.setMatrixAt(i * 3 + j, m4.compose(p, qq.identity(), one.setScalar(1 + m.hit * 0.6))))
      for (let j = 0; j < 2; j++) {
        v1.subVectors(pts[j + 1], pts[0])
        const len = v1.length()
        qq.setFromUnitVectors(Y, v1.normalize())
        stickMesh.setMatrixAt(i * 2 + j, m4.compose(v2.addVectors(pts[0], pts[j + 1]).multiplyScalar(0.5), qq, one.set(1, len, 1)))
      }
    })
    atomMesh.instanceMatrix.needsUpdate = true
    stickMesh.instanceMatrix.needsUpdate = true
  }
  placeMols(0)

  // the ground at the bottom, a little sea of clouds, Everest and a jet, for scale
  const ground = new THREE.Mesh(new THREE.CircleGeometry(R - 0.03, 48), new THREE.MeshStandardMaterial({ color: '#4c7a52', roughness: 0.9 }))
  ground.rotation.x = -Math.PI / 2
  ground.position.y = H0 + 0.004
  const sea = new THREE.Mesh(new THREE.CircleGeometry(R - 0.03, 48, Math.PI * 0.15, Math.PI * 0.9), new THREE.MeshStandardMaterial({ color: '#2d6db5', roughness: 0.25 }))
  sea.rotation.x = -Math.PI / 2
  sea.position.y = H0 + 0.006
  group.add(ground, sea)
  const everest = new THREE.Mesh(new THREE.ConeGeometry(0.2, 8.85 * PER_KM, 7), new THREE.MeshStandardMaterial({ color: '#8d93a1', roughness: 0.8, flatShading: true }))
  everest.position.set(-0.32, H0 + (8.85 * PER_KM) / 2, 0.22)
  const snowcap = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.33, 7), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, flatShading: true }))
  snowcap.position.set(-0.32, H0 + 8.85 * PER_KM - 0.165 + 0.002, 0.22)
  group.add(everest, snowcap)
  const puffMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: 0.92 })
  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 2
    const r = 0.25 + rnd() * 0.45
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.06 + rnd() * 0.05, 12, 8), puffMat)
    puff.scale.y = 0.55
    puff.position.set(Math.cos(a) * r, H0 + (1.5 + rnd() * 3) * PER_KM, Math.sin(a) * r)
    group.add(puff)
  }
  const jet = new THREE.Group()
  const jetMat = new THREE.MeshStandardMaterial({ color: '#f4f6fa', roughness: 0.4, metalness: 0.2 })
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.11, 4, 8), jetMat)
  fus.rotation.z = Math.PI / 2
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.004, 0.13), jetMat)
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.035, 0.004), jetMat)
  tail.position.set(-0.06, 0.018, 0)
  jet.add(fus, wing, tail)
  jet.position.y = H0 + 11 * PER_KM
  group.add(jet)

  // the scale: a ruler with a tick every 10 km, and the layer's bracket
  const ruler = new THREE.Group()
  ruler.position.set(0, 0, R + 0.16)
  group.add(ruler)
  const rulerMat = new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 1.1) })
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.018, TOP - H0, 0.01), rulerMat)
  pole.position.set(0.58, (TOP + H0) / 2, 0)
  ruler.add(pole)
  for (let km = 0; km <= 50; km += 10) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.012, 0.01), rulerMat)
    tick.position.set(0.58 - 0.045, H0 + km * PER_KM, 0)
    const lab = label(`${km} ${words.km}`, { size: 0.09, anchorX: 'left' })
    lab.position.set(0.66, H0 + km * PER_KM, 0)
    ruler.add(tick, lab)
  }
  const bracketMat = new THREE.MeshBasicMaterial({ color: hdr('#b99cff', 1.6) })
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.02, 20 * PER_KM, 0.01), bracketMat)
  bracket.position.set(-0.6, H0 + 25 * PER_KM, 0)
  ruler.add(bracket)
  for (const km of [15, 35]) {
    const end = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.016, 0.01), bracketMat)
    end.position.set(-0.57, H0 + km * PER_KM, 0)
    ruler.add(end)
  }
  const layerLabel = label(words.layer, { size: 0.1, color: '#e2d6ff', anchorX: 'right', maxWidth: 0.8, align: 'right' })
  layerLabel.position.set(-0.66, H0 + 25 * PER_KM, 0)
  const everestLabel = label(words.everest, { size: 0.07, anchorX: 'right' })
  everestLabel.position.set(-0.66, H0 + 8.85 * PER_KM, 0)
  const jetLabel = label(words.jet, { size: 0.07, anchorX: 'right' })
  jetLabel.position.set(-0.66, H0 + 11 * PER_KM, 0)
  ruler.add(layerLabel, everestLabel, jetLabel)

  // the glass
  const tubeGeo = new THREE.CylinderGeometry(R, R, TOP - H0, 64, 1, true)
  const backGlass = new THREE.Mesh(tubeGeo, glass({ opacity: 0.02, edge: 0.3, side: THREE.BackSide }))
  const frontGlass = new THREE.Mesh(tubeGeo, glass({ opacity: 0.025, edge: 0.5 }))
  backGlass.position.y = frontGlass.position.y = (TOP + H0) / 2
  backGlass.renderOrder = 0
  frontGlass.renderOrder = 6
  group.add(backGlass, frontGlass)
  // the column to tap (an invisible, plainer copy of the glass: it sends the Sun's light down)
  const hit = hitShape(new THREE.CylinderGeometry(R + 0.1, R + 0.1, TOP - H0 + 0.3, 16))
  hit.position.y = (TOP + H0) / 2 + 0.1
  group.add(hit)

  // UV rays: thin streaks falling from the lamp
  const rayN = light ? 18 : 30
  const rayGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 6, 1, true)
  rayGeo.translate(0, 0.5, 0)
  const rays = new THREE.InstancedMesh(rayGeo, new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), rayN)
  rays.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(rayN * 3), 3)
  rays.renderOrder = 4
  rays.frustumCulled = false
  group.add(rays)
  const flashes = new Particles(light ? 20 : 40, { map: softDot(64), renderOrder: 5 })
  group.add(flashes.points)
  const kinds = UV_KINDS.map(k => ({ ...k, col: hdr(k.color, 1.5) }))
  let queue = []
  const live = []
  const passed = { A: 0, B: 0, C: 0 }
  const sent = { A: 0, B: 0, C: 0 }
  let wait = 0
  let flash = 0
  let runs = 0 // for the others in a room

  // the screen
  const scr = standingScreen(
    { width: 1.9, height: 1.3, color, title: words.title, big: words.big, small: '', bigSize: 0.17, bigY: 0.27, smallY: 0.13 },
    { top: 1.6, tilt: 0.2 },
  )
  scr.group.position.set(1.75, 0, 0.75)
  scr.group.rotation.y = -0.5
  group.add(scr.group)
  const rows = {}
  kinds.forEach((k, i) => {
    const y = -0.2 - i * 0.135
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), new THREE.MeshBasicMaterial({ color: k.col }))
    d.position.set(-0.6, y, 0.004)
    const name = makeText(words.kinds[k.id], { size: 0.09, color: hdr('#ffffff', 1.2), anchorX: 'left' })
    name.position.set(-0.52, y, 0)
    const val = makeText('', { size: 0.09, color: hdr(k.color, 1.5), anchorX: 'right' })
    val.position.set(0.75, y, 0)
    scr.content.add(d, name, val)
    rows[k.id] = val
  })
  const passLabel = makeText(words.passed, { size: 0.075, color: hdr('#c9d4ff', 1.2), anchorX: 'right' })
  passLabel.position.set(0.75, -0.075, 0)
  scr.content.add(passLabel)
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  const writeRows = () => {
    for (const k of kinds) {
      const text = sent[k.id] ? `${passed[k.id]} / ${sent[k.id]}` : '?'
      if (rows[k.id].text !== text) {
        rows[k.id].text = text
        rows[k.id].sync()
      }
    }
  }
  scr.set({ small: smallLine() })
  writeRows()

  const start = () => {
    if (queue.length || live.length) return false
    for (const k of kinds) {
      passed[k.id] = 0
      sent[k.id] = 0
    }
    // ten of each, shuffled; exactly one UV-B in ten gets through (the WHO's "about 90% absorbed")
    const list = []
    for (const k of kinds) {
      for (let i = 0; i < 10; i++) list.push({ kind: k, through: i < Math.round(k.pass * 10) })
    }
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
    }
    queue = list
    wait = 0
    runs++
    writeRows()
    return true
  }

  return {
    group,
    screen: scr,
    // the thing to tap
    column: hit,
    start,
    get busy() {
      return queue.length > 0 || live.length > 0
    },
    /** How many volleys were sent, for the others in a room (src/net/shared.js). */
    state() {
      return { n: runs }
    },
    /** Someone else sent the light down: it comes down here too (returns whether it did, so the sky
     *  sends its volley); a newcomer finds the screen's counts as a volley leaves them. (`playing` is
     *  the contract's `live`: here `live` is the rays in flight.) */
    setState({ n = 0 } = {}, playing = false) {
      const was = runs
      if (playing && n !== runs && start()) {
        runs = n
        return true
      }
      runs = n
      if (!playing && n > 0 && !was && !queue.length && !live.length) {
        for (const k of kinds) {
          sent[k.id] = 10
          passed[k.id] = Math.round(k.pass * 10)
        }
        writeRows()
      }
      return false
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t, camera, renderer) {
      airMat.uniforms.uTime.value = t
      bandMat.uniforms.uTime.value = t
      flash = Math.max(0, flash - dt * 1.5)
      bandMat.uniforms.uFlash.value = flash
      placeMols(dt)
      jet.position.x = Math.sin(t * 0.25) * 0.45
      jet.position.z = Math.cos(t * 0.25) * 0.45
      jet.rotation.y = -t * 0.25
      // launch the next ray
      wait -= dt
      if (queue.length && wait <= 0) {
        const r = queue.shift()
        const a = rnd() * Math.PI * 2
        const rr = Math.sqrt(rnd()) * (R - 0.15)
        const stopKm = r.through ? 0 : r.kind.stopFrom + rnd() * (r.kind.stopTo - r.kind.stopFrom)
        live.push({ ...r, x: Math.cos(a) * rr, z: Math.sin(a) * rr, y: TOP - 0.05, stopY: H0 + stopKm * PER_KM + 0.01, done: false })
        sent[r.kind.id]++
        writeRows()
        wait = 0.13
      }
      for (let i = live.length - 1; i >= 0; i--) {
        const r = live[i]
        if (!r.done) {
          r.y -= dt * 2.4
          if (r.y <= r.stopY) {
            r.y = r.stopY
            r.done = true
            r.fade = 0.35
            flashes.spawn({ x: r.x, y: r.y, z: r.z, life: 0.5, size: r.through ? 0.12 : 0.2, r: r.kind.col.r, g: r.kind.col.g, b: r.kind.col.b })
            if (r.through) passed[r.kind.id]++
            else {
              flash = Math.min(1, flash + 0.25)
              let best = null
              let bd = 1e9
              for (const m of mols) {
                const d = (m.p.x - r.x) ** 2 + (m.p.y - r.y) ** 2 + (m.p.z - r.z) ** 2
                if (d < bd) {
                  bd = d
                  best = m
                }
              }
              if (best) best.hit = 1
            }
            writeRows()
          }
        } else {
          r.fade -= dt
          if (r.fade <= 0) live.splice(i, 1)
        }
      }
      for (let i = 0; i < rayN; i++) {
        const r = live[i]
        if (!r) {
          rays.setMatrixAt(i, m4.makeScale(0, 0, 0))
          continue
        }
        const len = r.done ? Math.max(0.001, 0.35 * (r.fade / 0.35)) : Math.min(0.35, TOP - r.y)
        rays.setMatrixAt(i, m4.makeScale(1, len, 1).setPosition(r.x, r.y, r.z))
        rays.setColorAt(i, r.kind.col)
      }
      rays.instanceMatrix.needsUpdate = true
      rays.instanceColor.needsUpdate = true
      flashes.step(dt, (p, _dt, k) => {
        p.alpha = 1 - k
        p.size *= 1 + _dt * 2
      }, camera, renderer)
    },
  }
}
