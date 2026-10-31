// A stage for picture rooms (docs/knowledge/picture-rooms.md): a hydrogen filling station at dusk beside a
// small railway in the flat country of Lower Saxony. A paved forecourt (walked on) with a raised island
// for the dispenser under a lit canopy; a bus lane along its north edge behind a guard rail; beyond it a
// low platform with a shelter, lamps and a station clock, and a railway line with no overhead wires (its
// trains bring their own fuel); flat fields all round, hedges and trees, wind turbines on the horizon with
// red lights blinking, the station's little office to the east, and a dusk sky glowing low in the
// north-west with the first stars above. Big surfaces mid-toned: pale ones bloom to white.
//
// For the scene: DEPOT (where the parts are, metres), ROUTE (the bus's road: in from the west, along the
// lane past the island, out to the east; points on the ground), `mats` (shared plain materials), `sign(text,
// size)` (white 3D letters with a dark outline), `canopyLights` (the point lights under the canopy, to dim
// or tint). Walking inside DEPOT.yard; `floor` lifts the walker onto the island.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { box, circle } from '../../../engine/collide.js'
import { makeText } from '../../../engine/text.js'

const TAU = Math.PI * 2

/** Where the station's parts are (metres). North is -z; the lane and the railway run along x. */
export const DEPOT = {
  yard: { x0: -15, x1: 14.4, z0: -5.15, z1: 11 }, // the forecourt walked on
  lane: { z: -7.1, half: 1.95 }, // the bus lane: its middle line and half its width
  rail: { z: -13.3, gauge: 1.435 },
  platform: { x0: -27, x1: 4.5, z0: -11.55, z1: -9.3, h: 0.55 },
  island: { x0: 5.8, x1: 11.2, z0: -4.95, z1: -3.0, h: 0.15 },
  canopy: { x0: 3.4, x1: 13.6, z0: -9.9, z1: -2.3, h: 5.4 },
  office: { x0: 14.7, x1: 20.7, z0: -2.4, z1: 6.4 },
}

// the bus's road, from far in the south-west, along the lane and away to the south-east (y = 0)
export const ROUTE = [
  [-44, 190], [-44, 60], [-42, 16], [-36, -2.5], [-26, -6.6], [-16, DEPOT.lane.z], [0, DEPOT.lane.z],
  [16, DEPOT.lane.z], [26, -6.6], [36, -2.5], [42, 16], [44, 60], [44, 190],
].map(([x, z]) => new THREE.Vector3(x, 0, z))

const C = c => new THREE.Color(c)

/** A strip of ground following a curve (a road), `width` wide, lying at height y; uv: u across, v along (m). */
function ribbon(curve, width, y, segments) {
  const pos = []
  const uv = []
  const idx = []
  const len = curve.getLength()
  for (let i = 0; i <= segments; i++) {
    const u = i / segments
    const p = curve.getPointAt(u)
    const t = curve.getTangentAt(u)
    const nx = -t.z
    const nz = t.x
    const l = Math.hypot(nx, nz) || 1
    for (const s of [-1, 1]) {
      pos.push(p.x + (s * nx * width) / 2 / l, y, p.z + (s * nz * width) / 2 / l)
      uv.push((s + 1) / 2, u * len)
    }
    if (i < segments) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  // whichever way it was wound, its normals point up
  const n = geo.attributes.normal
  for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0)
  return geo
}

/**
 * The station. `light`: fewer stars, trees and lamps (phones). `sign`: the letters on the canopy's front
 * (language-free: "H2").
 */
export function depotStage({ light = false, sign: canopySign = 'H2' } = {}) {
  const D = DEPOT
  const group = new THREE.Group()
  const disposers = []
  const textures = []
  const updates = []
  const solids = []
  const tex = t => (textures.push(t), t)

  // ---- materials (mid-toned) ----
  const mats = {
    concrete: null,
    asphalt: null,
    kerb: new THREE.MeshStandardMaterial({ color: '#8a8d90', roughness: 0.9 }),
    steel: new THREE.MeshStandardMaterial({ color: '#9aa3ad', roughness: 0.35, metalness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2f38', roughness: 0.6, metalness: 0.3 }),
    white: new THREE.MeshStandardMaterial({ color: '#c3c8cc', roughness: 0.55 }),
    green: new THREE.MeshStandardMaterial({ color: '#3a9a45', roughness: 0.5, emissive: '#2c8a3a', emissiveIntensity: 0.35 }),
    glass: new THREE.MeshStandardMaterial({ color: '#9fc4d8', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.28, depthWrite: false }),
    lamp: new THREE.MeshBasicMaterial({ color: '#ffe0a8' }),
    panel: new THREE.MeshBasicMaterial({ color: '#aab8c8' }),
    leaf: new THREE.MeshStandardMaterial({ color: '#2f4a2a', roughness: 1 }),
    bark: new THREE.MeshStandardMaterial({ color: '#4a3a2c', roughness: 1 }),
  }

  // ---- the sky: deep blue overhead, the last glow low in the north-west, the first stars ----
  const glowDir = new THREE.Vector3(-0.55, 0, -0.84).normalize()
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uGlowDir: { value: glowDir },
        uZenith: { value: C('#0b1434') },
        uMid: { value: C('#1f2f63') },
        uHorizon: { value: C('#4a5288') },
        uGlow: { value: C('#ff9a5c') },
        uRose: { value: C('#c46a86') },
        uStars: { value: light ? 0.7 : 1 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uGlowDir; uniform vec3 uZenith; uniform vec3 uMid; uniform vec3 uHorizon;
        uniform vec3 uGlow; uniform vec3 uRose; uniform float uStars;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 c = h > 0.12 ? mix(uMid, uZenith, smoothstep(0.12, 0.8, h)) : mix(uHorizon, uMid, smoothstep(-0.02, 0.12, h));
          // the glow where the sun went down: orange at the horizon, rose above it, fading round the sky
          vec3 level = normalize(vec3(d.x, 0.0, d.z) + vec3(1e-4));
          float toward = max(dot(level, uGlowDir), 0.0);
          float low = 1.0 - smoothstep(0.0, 0.32, max(h, 0.0));
          c = mix(c, uRose, pow(toward, 2.0) * low * 0.55);
          c = mix(c, uGlow, pow(toward, 5.0) * (1.0 - smoothstep(0.0, 0.12, max(h, 0.0))) * 0.85);
          if (h < 0.0) c = mix(c, uHorizon * 0.5, clamp(-h * 6.0, 0.0, 1.0));
          // stars, away from the glow
          if (h > 0.05) {
            vec3 q = floor(d * 170.0);
            float n = hash(q);
            float star = step(0.9968, n) * (0.4 + 0.6 * hash(q + 7.0));
            c += vec3(star) * smoothstep(0.08, 0.45, h) * (1.0 - toward * 0.8) * 1.3 * uStars;
          }
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  sky.frustumCulled = false
  group.add(sky)

  // ---- the ground: fields all round, a grass verge, the paved forecourt ----
  const rnd = random(17)
  const fieldTex = tex(
    canvasTex(512, 512, (g, w) => {
      // strips of field: young wheat, ploughed earth, stubble, pasture
      const tints = ['#3c5530', '#4a4232', '#5a5a38', '#35502e', '#46553a']
      let y = 0
      while (y < w) {
        const hgt = 30 + rnd() * 70
        g.fillStyle = tints[Math.floor(rnd() * tints.length)]
        g.fillRect(0, y, w, hgt)
        // furrows
        g.strokeStyle = 'rgba(0,0,0,0.12)'
        for (let k = 0; k < hgt; k += 5) {
          g.beginPath()
          g.moveTo(0, y + k)
          g.lineTo(w, y + k + 2)
          g.stroke()
        }
        y += hgt
        g.fillStyle = '#2e4428'
        g.fillRect(0, y, w, 3)
        y += 3
      }
    }, { repeat: true }),
  )
  fieldTex.repeat.set(5, 5)
  const fields = new THREE.Mesh(new THREE.CircleGeometry(400, 64), new THREE.MeshStandardMaterial({ map: fieldTex, roughness: 1 }))
  fields.rotation.x = -Math.PI / 2
  fields.rotation.z = 0.35
  fields.position.y = -0.03
  fields.receiveShadow = true
  group.add(fields)

  const grassTex = tex(
    canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#3d5833'
      g.fillRect(0, 0, w, w)
      for (let i = 0; i < 1800; i++) {
        g.fillStyle = rnd() < 0.5 ? 'rgba(25,45,20,0.4)' : 'rgba(95,130,70,0.35)'
        g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 2 + rnd() * 5)
      }
    }, { repeat: true }),
  )
  grassTex.repeat.set(14, 10)
  const verge = new THREE.Mesh(new THREE.PlaneGeometry(70, 50), new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }))
  verge.rotation.x = -Math.PI / 2
  verge.position.set(0, -0.015, 0)
  verge.receiveShadow = true
  group.add(verge)

  // the forecourt: square concrete slabs with dark joints
  const slabTex = tex(
    canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#5d6064'
      g.fillRect(0, 0, w, w)
      for (let i = 0; i < 5000; i++) {
        const v = 70 + rnd() * 40
        g.fillStyle = `rgba(${v},${v + 2},${v + 5},0.35)`
        g.fillRect(rnd() * w, rnd() * w, 2, 2)
      }
      g.strokeStyle = 'rgba(25,28,32,0.8)'
      g.lineWidth = 3
      for (let k = 0; k <= 4; k++) {
        g.beginPath()
        g.moveTo(0, (k * w) / 4)
        g.lineTo(w, (k * w) / 4)
        g.moveTo((k * w) / 4, 0)
        g.lineTo((k * w) / 4, w)
        g.stroke()
      }
    }, { repeat: true }),
  )
  const yw = D.yard.x1 - D.yard.x0
  const yd = D.yard.z1 - D.yard.z0
  slabTex.repeat.set(yw / 8, yd / 8)
  mats.concrete = new THREE.MeshStandardMaterial({ map: slabTex, roughness: 0.9 })
  const yard = new THREE.Mesh(new THREE.PlaneGeometry(yw, yd), mats.concrete)
  yard.rotation.x = -Math.PI / 2
  yard.position.set((D.yard.x0 + D.yard.x1) / 2, 0, (D.yard.z0 + D.yard.z1) / 2)
  yard.receiveShadow = true
  group.add(yard)

  // ---- the road: the bus's lane past the forecourt, curving away south at both ends ----
  const asphaltTex = tex(
    canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#34373d'
      g.fillRect(0, 0, w, w)
      for (let i = 0; i < 4000; i++) {
        const v = 40 + rnd() * 50
        g.fillStyle = `rgba(${v},${v},${v + 4},0.5)`
        g.fillRect(rnd() * w, rnd() * w, 1.5, 1.5)
      }
      // the edge lines along both sides (u across the road, 0 and 1)
      g.fillStyle = '#c9c9c0'
      g.fillRect(6, 0, 6, w)
      g.fillRect(w - 12, 0, 6, w)
    }, { repeat: true }),
  )
  asphaltTex.wrapS = THREE.ClampToEdgeWrapping
  asphaltTex.repeat.set(1, 1 / 4)
  mats.asphalt = new THREE.MeshStandardMaterial({ map: asphaltTex, roughness: 0.85 })
  const route = new THREE.CatmullRomCurve3(ROUTE, false, 'centripetal')
  const road = new THREE.Mesh(ribbon(route, D.lane.half * 2 + 0.3, 0.005, 260), mats.asphalt)
  road.receiveShadow = true
  group.add(road)
  // the kerb along the forecourt's north edge, and along the platform side
  for (const [z, x0, x1] of [[D.yard.z0 + 0.06, D.yard.x0, D.yard.x1], [D.lane.z - D.lane.half - 0.08, -22, 22]]) {
    const k = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.14, 0.16), mats.kerb)
    k.position.set((x0 + x1) / 2, 0.07, z)
    group.add(k)
  }

  // the guard rail between the forecourt and the lane (not in front of the island)
  {
    const posts = []
    const beams = []
    for (const [x0, x1] of [[D.yard.x0, D.island.x0 - 0.3], [D.island.x1 + 0.3, D.yard.x1]]) {
      beams.push([x0, x1])
      for (let x = x0; x <= x1 + 0.01; x += 2) posts.push(x)
    }
    const postGeo = new THREE.BoxGeometry(0.1, 0.75, 0.1)
    const pm = new THREE.InstancedMesh(postGeo, mats.steel, posts.length)
    const o = new THREE.Object3D()
    posts.forEach((x, i) => {
      o.position.set(x, 0.375, D.yard.z0 + 0.22)
      o.updateMatrix()
      pm.setMatrixAt(i, o.matrix)
    })
    group.add(pm)
    for (const [x0, x1] of beams) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.3, 0.06), mats.steel)
      beam.position.set((x0 + x1) / 2, 0.6, D.yard.z0 + 0.15)
      group.add(beam)
    }
  }
  // the forecourt's edges: the lane (north), hedges west and south, the office and a fence east
  solids.push(box((D.yard.x0 + D.yard.x1) / 2, D.yard.z0 - 0.25, yw + 2, 0.5))
  solids.push(box(D.yard.x0 - 0.35, (D.yard.z0 + D.yard.z1) / 2, 0.7, yd + 2))
  solids.push(box(D.yard.x1 + 0.35, (D.yard.z0 + D.yard.z1) / 2, 0.7, yd + 2))
  solids.push(box((D.yard.x0 + D.yard.x1) / 2, D.yard.z1 + 0.35, yw + 2, 0.7))

  // ---- the island under the canopy: a raised kerbed slab ----
  {
    const I = D.island
    const slab = new THREE.Mesh(new RoundedBoxGeometry(I.x1 - I.x0, I.h, I.z1 - I.z0, 2, 0.04), mats.kerb)
    slab.position.set((I.x0 + I.x1) / 2, I.h / 2, (I.z0 + I.z1) / 2)
    slab.receiveShadow = true
    group.add(slab)
    // yellow and black stripes on its ends
    const stripeTex = tex(
      canvasTex(128, 32, (g, w, h) => {
        g.fillStyle = '#e0b21c'
        g.fillRect(0, 0, w, h)
        g.fillStyle = '#1d1f24'
        for (let x = -h; x < w; x += 32) {
          g.beginPath()
          g.moveTo(x, h)
          g.lineTo(x + 16, h)
          g.lineTo(x + 16 + h, 0)
          g.lineTo(x + h, 0)
          g.fill()
        }
      }),
    )
    for (const x of [I.x0 - 0.005, I.x1 + 0.005]) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(I.z1 - I.z0, I.h), new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.7 }))
      s.position.set(x, I.h / 2, (I.z0 + I.z1) / 2)
      s.rotation.y = x < I.x0 ? -Math.PI / 2 : Math.PI / 2
      group.add(s)
    }
  }
  const floor = (x, z) => {
    const I = D.island
    return x > I.x0 && x < I.x1 && z > I.z0 && z < I.z1 ? I.h : 0
  }

  // ---- the canopy: a white roof on two pillars, a green band round its edge, lit from below ----
  const canopyLights = []
  {
    const K = D.canopy
    const cx = (K.x0 + K.x1) / 2
    const cz = (K.z0 + K.z1) / 2
    const w = K.x1 - K.x0
    const d = K.z1 - K.z0
    // its underside mid-grey: a pale one under the lamps bloomed white
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w, 0.42, d), new THREE.MeshStandardMaterial({ color: '#7d848b', roughness: 0.7 }))
    roof.position.set(cx, K.h + 0.21, cz)
    roof.castShadow = true
    group.add(roof)
    const band = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.62, d + 0.12), mats.green)
    band.position.set(cx, K.h + 0.31, cz)
    group.add(band)
    // the letters on its front (facing the forecourt) and on its west end
    const front = makeText(canopySign, { size: 0.48, color: '#ffffff', outlineWidth: 0.02, outlineColor: '#11331a' })
    front.position.set(cx, K.h + 0.31, K.z1 + 0.08)
    group.add(front)
    const end = makeText(canopySign, { size: 0.48, color: '#ffffff', outlineWidth: 0.02, outlineColor: '#11331a' })
    end.position.set(K.x0 - 0.08, K.h + 0.31, cz)
    end.rotation.y = -Math.PI / 2
    group.add(end)
    // light panels in its underside
    const panelGeo = new THREE.PlaneGeometry(1.6, 0.5)
    for (const x of [-3, 0, 3]) {
      for (const z of [-2, 0.8]) {
        const p = new THREE.Mesh(panelGeo, mats.panel)
        p.rotation.x = Math.PI / 2
        p.position.set(cx + x, K.h - 0.005, cz + z)
        group.add(p)
      }
    }
    // the pillars, on the island
    for (const x of [D.island.x0 + 0.6, D.island.x1 - 0.6]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, K.h, 20), mats.white)
      p.position.set(x, K.h / 2, (D.island.z0 + D.island.z1) / 2)
      p.castShadow = true
      group.add(p)
      solids.push(circle(x, (D.island.z0 + D.island.z1) / 2, 0.3))
    }
    for (const [x, z] of light ? [[cx, cz + 1.2]] : [[cx - 2.5, cz + 1.4], [cx + 2.5, cz - 0.6]]) {
      const l = new THREE.PointLight('#eef4ff', light ? 18 : 11, 16, 1.6)
      l.position.set(x, K.h - 1.3, z)
      group.add(l)
      canopyLights.push(l)
    }
  }

  // ---- the platform: a low paved strip with its white edge line, a shelter, a bench, lamps, a clock ----
  {
    const P = D.platform
    const deck = new THREE.Mesh(new THREE.BoxGeometry(P.x1 - P.x0, P.h, P.z1 - P.z0), mats.kerb)
    deck.position.set((P.x0 + P.x1) / 2, P.h / 2, (P.z0 + P.z1) / 2)
    deck.receiveShadow = true
    group.add(deck)
    const top = new THREE.Mesh(new THREE.PlaneGeometry(P.x1 - P.x0, P.z1 - P.z0), mats.concrete)
    top.rotation.x = -Math.PI / 2
    top.position.set((P.x0 + P.x1) / 2, P.h + 0.002, (P.z0 + P.z1) / 2)
    group.add(top)
    const line = new THREE.Mesh(new THREE.PlaneGeometry(P.x1 - P.x0, 0.1), new THREE.MeshStandardMaterial({ color: '#d8d8cc', roughness: 0.6 }))
    line.rotation.x = -Math.PI / 2
    line.position.set((P.x0 + P.x1) / 2, P.h + 0.004, P.z0 + 0.6)
    group.add(line)
    // the shelter: a steel frame, a glass back, a roof
    const sx = -15
    const shelter = new THREE.Group()
    shelter.position.set(sx, P.h, P.z1 - 0.5)
    group.add(shelter)
    for (const x of [-1.8, 1.8]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.08), mats.dark)
      post.position.set(x, 1.2, 0)
      shelter.add(post)
    }
    const back = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.1), mats.glass)
    back.position.set(0, 1.15, 0.02)
    const sroof = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.1, 1.5), mats.dark)
    sroof.position.set(0, 2.45, -0.55)
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: '#7a5a3c', roughness: 0.8 }))
    bench.position.set(0, 0.45, -0.35)
    shelter.add(back, sroof, bench)
    // lamps along the platform
    const lampXs = light ? [-21, 2] : [-21, -12.4, 2]
    lampXs.forEach((x, i) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.2, 10), mats.dark)
      pole.position.set(x, P.h + 2.1, P.z1 - 0.3)
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.8), mats.dark)
      arm.position.set(x, P.h + 4.15, P.z1 - 0.65)
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.25), mats.dark)
      head.position.set(x, P.h + 4.1, P.z1 - 1.0)
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2), mats.lamp)
      glow.rotation.x = Math.PI / 2
      glow.position.set(x, P.h + 4.04, P.z1 - 1.0)
      group.add(pole, arm, head, glow)
      if (i < 2) {
        const l = new THREE.PointLight('#ffcf8a', light ? 9 : 7, 11, 1.6)
        l.position.set(x, P.h + 3.7, P.z1 - 1.0)
        group.add(l)
      }
    })
    // the station clock on its post, two faces, at a quarter to nine in the evening
    const clockTex = tex(
      canvasTex(256, 256, (g, w) => {
        const c = w / 2
        g.fillStyle = '#f2f2ee'
        g.beginPath()
        g.arc(c, c, c - 4, 0, TAU)
        g.fill()
        g.strokeStyle = '#1b1d22'
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * TAU
          const r0 = i % 5 ? c - 18 : c - 34
          g.lineWidth = i % 5 ? 3 : 9
          g.beginPath()
          g.moveTo(c + Math.sin(a) * r0, c - Math.cos(a) * r0)
          g.lineTo(c + Math.sin(a) * (c - 10), c - Math.cos(a) * (c - 10))
          g.stroke()
        }
        const hand = (a, len, wdt, col = '#1b1d22') => {
          g.strokeStyle = col
          g.lineWidth = wdt
          g.beginPath()
          g.moveTo(c - Math.sin(a) * 20, c + Math.cos(a) * 20)
          g.lineTo(c + Math.sin(a) * len, c - Math.cos(a) * len)
          g.stroke()
        }
        hand(((8 + 45 / 60) / 12) * TAU, c * 0.5, 13)
        hand((45 / 60) * TAU, c * 0.78, 9)
        hand((20 / 60) * TAU, c * 0.7, 3, '#c0262d')
      }),
    )
    const clock = new THREE.Group()
    clock.position.set(-11, P.h, P.z1 - 0.4)
    group.add(clock)
    const cpost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.9, 10), mats.dark)
    cpost.position.y = 1.45
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 32), mats.dark)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 3.2
    clock.add(cpost, rim)
    for (const s of [1, -1]) {
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.38, 32), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.6, emissive: '#ffffff', emissiveMap: clockTex, emissiveIntensity: 0.35 }))
      face.position.set(0, 3.2, s * 0.065)
      if (s < 0) face.rotation.y = Math.PI
      clock.add(face)
    }
  }

  // ---- the railway: ballast, sleepers, two rails; no overhead wires ----
  {
    const R = D.rail
    const len = 240
    const ballast = new THREE.Mesh(new THREE.BoxGeometry(len, 0.3, 3.2), new THREE.MeshStandardMaterial({ color: '#5a5650', roughness: 1 }))
    ballast.position.set(0, 0.15, R.z)
    ballast.receiveShadow = true
    group.add(ballast)
    const n = light ? 140 : 260
    const sleepers = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 0.14, 2.6), new THREE.MeshStandardMaterial({ color: '#77736c', roughness: 0.9 }), n)
    const o = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      o.position.set(-n * 0.3 + i * 0.6, 0.35, R.z)
      o.updateMatrix()
      sleepers.setMatrixAt(i, o.matrix)
    }
    sleepers.receiveShadow = true
    group.add(sleepers)
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.15, 0.07), mats.steel)
      rail.position.set(0, 0.49, R.z + (s * R.gauge) / 2)
      group.add(rail)
    }
  }

  // ---- the office: a small white building with a lit shop window facing the forecourt ----
  {
    const O = D.office
    const w = O.x1 - O.x0
    const d = O.z1 - O.z0
    const hut = new THREE.Mesh(new THREE.BoxGeometry(w, 3.4, d), mats.white)
    hut.position.set((O.x0 + O.x1) / 2, 1.7, (O.z0 + O.z1) / 2)
    hut.castShadow = true
    hut.receiveShadow = true
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.3, d + 0.4), mats.dark)
    roof.position.set((O.x0 + O.x1) / 2, 3.55, (O.z0 + O.z1) / 2)
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, d), mats.green)
    fascia.position.set(O.x0 - 0.06, 3.1, (O.z0 + O.z1) / 2)
    const win = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.7), new THREE.MeshBasicMaterial({ color: '#e8c98a' }))
    win.rotation.y = -Math.PI / 2
    win.position.set(O.x0 - 0.01, 1.55, (O.z0 + O.z1) / 2 + 0.9)
    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshStandardMaterial({ color: '#3a4250', roughness: 0.5 }))
    door.rotation.y = -Math.PI / 2
    door.position.set(O.x0 - 0.01, 1.1, O.z0 + 1.2)
    group.add(hut, roof, fascia, win, door)
    // shelves inside the window, dark against the light
    for (const y of [1.0, 1.5, 2.0]) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 3.6), mats.dark)
      shelf.position.set(O.x0 + 0.08, y, (O.z0 + O.z1) / 2 + 0.9)
      group.add(shelf)
    }
  }

  // ---- hedges along the west and south, a fence to the east, trees beyond ----
  {
    const hedgeTex = tex(
      canvasTex(256, 128, (g, w, h) => {
        g.fillStyle = '#2b4426'
        g.fillRect(0, 0, w, h)
        for (let i = 0; i < 900; i++) {
          g.fillStyle = rnd() < 0.5 ? 'rgba(20,35,18,0.6)' : 'rgba(70,100,55,0.45)'
          g.beginPath()
          g.arc(rnd() * w, rnd() * h, 2 + rnd() * 5, 0, TAU)
          g.fill()
        }
      }, { repeat: true }),
    )
    const hedgeMat = new THREE.MeshStandardMaterial({ map: hedgeTex, roughness: 1 })
    const Y = D.yard
    for (const [x, z, w, d] of [
      [Y.x0 - 0.6, (Y.z0 + Y.z1) / 2 + 0.3, 1.0, Y.z1 - Y.z0 + 0.6],
      [(Y.x0 + Y.x1) / 2, Y.z1 + 0.6, Y.x1 - Y.x0 + 2.2, 1.0],
      [Y.x1 + 0.6, (D.office.z1 + Y.z1) / 2 + 0.3, 1.0, Y.z1 - D.office.z1 + 0.6],
    ]) {
      const m = hedgeMat.clone()
      m.map = hedgeTex.clone()
      m.map.repeat.set(Math.max(w, d) / 3, 1)
      textures.push(m.map)
      disposers.push(() => m.dispose())
      const hedge = new THREE.Mesh(new RoundedBoxGeometry(w, 1.5, d, 3, 0.35), m)
      hedge.position.set(x, 0.75, z)
      hedge.receiveShadow = true
      group.add(hedge)
    }
    // a low fence between the lane and the office
    const fence = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, D.office.z0 - Y.z0), mats.steel)
    fence.position.set(Y.x1 + 0.3, 0.55, (Y.z0 + D.office.z0) / 2)
    group.add(fence)
    // trees in clumps round the fields
    const spots = []
    const tr = random(41)
    for (const [cx, cz, n] of [[-24, 4, 6], [-21, 22, 5], [8, 24, 6], [26, 14, 5], [-36, -22, 7], [14, -24, 8], [-6, -26, 6], [34, -18, 6], [-30, 34, 4]]) {
      for (let i = 0; i < (light ? Math.ceil(n / 2) : n); i++) spots.push([cx + (tr() - 0.5) * 9, cz + (tr() - 0.5) * 7, 0.8 + tr() * 0.6])
    }
    const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mats.leaf, spots.length)
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.18, 1, 6), mats.bark, spots.length)
    const o = new THREE.Object3D()
    spots.forEach(([x, z, s], i) => {
      o.position.set(x, 2.2 * s, z)
      o.rotation.set(0, tr() * TAU, 0)
      o.scale.set(2.2 * s, 2.6 * s, 2.2 * s)
      o.updateMatrix()
      crowns.setMatrixAt(i, o.matrix)
      o.position.set(x, 1.1 * s, z)
      o.scale.set(s, 2.2 * s, s)
      o.updateMatrix()
      trunks.setMatrixAt(i, o.matrix)
    })
    crowns.castShadow = true
    group.add(crowns, trunks)
  }

  // ---- wind turbines on the horizon, turning slowly, red lights blinking on top ----
  {
    const sil = new THREE.MeshBasicMaterial({ color: '#2c3458', fog: false })
    const red = new THREE.MeshBasicMaterial({ color: '#ff3b30', fog: false })
    const spots = light
      ? [[-150, -200, 1], [60, -230, 0.9], [-260, 40, 1.1], [220, -120, 1]]
      : [[-150, -200, 1], [-90, -240, 0.85], [60, -230, 0.9], [130, -190, 1.05], [-260, 40, 1.1], [-240, -90, 0.95], [220, -120, 1], [250, 60, 0.9]]
    const reds = []
    const rotors = []
    spots.forEach(([x, z, s], i) => {
      const t = new THREE.Group()
      t.position.set(x, 0, z)
      t.scale.setScalar(s)
      t.lookAt(0, 0, 0)
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 2.2, 80, 10), sil)
      tower.position.y = 40
      const nac = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.8, 7), sil)
      nac.position.set(0, 81, -0.5)
      const rotor = new THREE.Group()
      rotor.position.set(0, 81, 3.2)
      const hub = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 8), sil)
      rotor.add(hub)
      for (let k = 0; k < 3; k++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(2.4, 42, 0.4).translate(0, 21, 0), sil)
        blade.rotation.z = (k / 3) * TAU
        rotor.add(blade)
      }
      rotor.rotation.z = i * 1.3
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 6), red)
      lamp.position.set(0, 83.2, -1.5)
      t.add(tower, nac, rotor, lamp)
      group.add(t)
      reds.push(lamp)
      rotors.push({ rotor, speed: 0.55 + (i % 3) * 0.12, phase: i * 1.3 })
    })
    updates.push(t => {
      // the lights blink together, as wind farms' do
      const on = (t % 1.5) < 0.75
      for (const r of reds) r.visible = on
      for (const r of rotors) r.rotor.rotation.z = r.speed * t + r.phase
    })
  }

  // ---- light: the sky's blue, the last of the sunset, the lamps ----
  const hemi = new THREE.HemisphereLight('#8193cc', '#2a2c28', 1.3)
  const dusk = new THREE.DirectionalLight('#ffb48a', 0.9)
  dusk.position.copy(glowDir).multiplyScalar(40).setY(14)
  dusk.castShadow = true
  dusk.shadow.mapSize.set(2048, 2048)
  dusk.shadow.camera.left = dusk.shadow.camera.bottom = -22
  dusk.shadow.camera.right = dusk.shadow.camera.top = 22
  dusk.shadow.camera.near = 1
  dusk.shadow.camera.far = 90
  dusk.shadow.bias = -0.0005
  dusk.shadow.normalBias = 0.03
  group.add(hemi, dusk, dusk.target)

  /** White letters with a dark outline (labels and signs). */
  const sign = (text, size, { color = '#eef4ff', maxWidth = 4, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(text, { size, color, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#0b1020' })

  return {
    group,
    solids,
    floor,
    mats,
    sign,
    route,
    canopyLights,
    env: {
      background: C('#3a4478'),
      fog: new THREE.Fog('#353f6e', 34, 170),
      exposure: 1.0,
      envIntensity: 0.15,
      bloom: { strength: 0.5, radius: 0.45, threshold: 0.86 },
      fov: 60,
      shadows: true,
    },
    cameraBounds: { minX: D.yard.x0 + 0.3, maxX: D.yard.x1 - 0.3, minY: 0.4, maxY: 12, minZ: D.yard.z0 + 0.3, maxZ: D.yard.z1 - 0.3 },
    update(t) {
      for (const u of updates) u(t)
    },
    dispose() {
      for (const t of textures) t.dispose()
      disposers.forEach(f => f())
    },
  }
}
