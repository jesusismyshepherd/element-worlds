// Hydrogen's picture "What engine puffs out only water?" as a room (docs/knowledge/picture-rooms.md). The
// picture shows the Space Shuttle at main engine start, its flames pale blue and its clouds steam, and a
// hydrogen bus dripping water with a close-up of its fuel cell. Here it is a hydrogen filling station at
// dusk beside a small railway in Lower Saxony (stages/depot.js), where a Coradia iLint, the first hydrogen
// train in passenger service, waits at the platform. Oxygen's magnet room already fires a rocket engine with
// a mix slider and oxygen's water room splits water; this room goes the other way: hydrogen and oxygen
// joined into water, quietly, for electricity. Each step is chosen by tapping its thing (the user,
// 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap; E opens the
// station's panel, whose buttons and slider do the same:
// - the giant fuel cell (west), cut open: tap the hydrogen bottle's valve and the air intake. On the
//   platinum each H2 splits; its protons cross the green membrane, its electrons cannot and go round the
//   wire through the bulb; at the far side the platinum splits O2 and each O takes two protons and two
//   electrons as water, which drips into a beaker. Close either and it stops once the gas left is used. A
//   road slider (flat to a steep hill): more current, more water; at Scientist level the voltmeter falls;
// - the bus (east): tap the nozzle to fill its roof tanks to 350 bar, tap the bus to drive a trip round its
//   route (a slider for how far) and back, water dripping from it; the measure on the island shows the water
//   it made, 9 litres for every kilogram of hydrogen; tap the measure to give the water to the flowers;
// - the train at the platform: tap it and the roof over its hydrogen tanks and fuel cell turns to glass,
//   its batteries glowing below, vapour rising;
// - hydrogen in space (a glass case by the west hedge): tap the Shuttle model and its three main engines
//   start, pale blue, steam rolling out; tap Apollo's fuel cell (real size) or the Apollo model and its
//   three cells send water up to the crew's drinking bag; tap the bag for the hydrogen bubbles of the first
//   flights.
// All of it is shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<exhibit>.tap does what a tap does, for the probes; parts.at.<thing>() gives a point to aim a real
// tap at (with parts.rayTo). Sources for the facts: the head of fuel.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, lerp, damp, fill, canvasTex } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { depotStage, DEPOT } from '../../stages/depot.js'
import { puffCloud } from '../../stages/coldlab.js'
import { softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { FUEL_WORDS } from './fuel.words.js'

export const WORDS = FUEL_WORDS

const TAU = Math.PI * 2
const V = (x, y, z) => new THREE.Vector3(x, y, z)
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
// 0 at a, 1 at b, eased
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const rand = (a, b) => a + Math.random() * (b - a)

// ---- the numbers the exhibits follow ----
// the bus: a 12 m fuel cell bus, its roof tanks at 350 bar, about 8 kg of hydrogen per 100 km
const TANK_MAX = 35 // kg
const BAR_MAX = 350
const PER_100 = 8 // kg per 100 km
const WATER_PER_KG = 9 // kg (L) of water per kg of hydrogen: 2.016 g of H2 give 18.015 g of H2O, 8.94
const MEASURE_MAX = 300 // L
const FILL_T = 5.5
const LAP_T = 14
const POUR_T = 2.6
// the fuel cell: the current density at the slider's top, and the cell's voltage under load (a straight
// line through typical PEM values: about 0.9 V at light load, about 0.6 V at 1.5 A/cm²)
const I_MAX = 1.5
const voltsAt = i => 0.95 - 0.22 * i
const OPEN_V = 0.98
const HHV_V = 1.48 // the voltage that would carry all of the reaction's heat (286 kJ/mol)
// the space case
const SHUTTLE_T = 7
const CELL_T = 6
const BUB_T = 4.5

/** A soft puff for steam and vapour (alpha only; the cloud tints it). */
function puffTexture() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,0.9)')
    grd.addColorStop(0.5, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A charge as a shaded ball with its sign (the picture's proton: red with +; electron: cyan with −). */
function chargeTexture(hi, mid, dark, sign) {
  return canvasTex(128, 128, (g, w) => {
    const c = w / 2
    const R = c - 3
    g.clearRect(0, 0, w, w)
    const grd = g.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.05, c, c, R)
    grd.addColorStop(0, hi)
    grd.addColorStop(0.5, mid)
    grd.addColorStop(1, dark)
    g.fillStyle = grd
    g.beginPath()
    g.arc(c, c, R, 0, TAU)
    g.fill()
    g.lineWidth = 4
    g.strokeStyle = 'rgba(10,12,30,0.8)'
    g.stroke()
    // the sign, drawn as bars (no font needed)
    g.fillStyle = '#ffffff'
    g.strokeStyle = 'rgba(10,12,30,0.6)'
    g.lineWidth = 3
    const bar = (x, y, bw, bh) => {
      g.fillRect(x - bw / 2, y - bh / 2, bw, bh)
      g.strokeRect(x - bw / 2, y - bh / 2, bw, bh)
    }
    bar(c, c, 62, 16)
    if (sign === '+') {
      g.fillRect(c - 8, c - 31, 16, 62)
      g.fillRect(c - 31, c - 8, 62, 16)
    }
  })
}

/** Balls that always face the eye, one draw call: set(i, x, y, z) for the first `count`. */
function badgeCloud(texture, max, size) {
  const base = new THREE.PlaneGeometry(1, 1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.index = base.index
  geo.setAttribute('position', base.attributes.position)
  geo.setAttribute('uv', base.attributes.uv)
  const pos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3)
  pos.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('iPos', pos)
  geo.instanceCount = 0
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { map: { value: null }, uSize: { value: size } }]),
    fog: true,
    vertexShader: /* glsl */ `
      attribute vec3 iPos;
      uniform float uSize;
      varying vec2 vUv;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(iPos, 1.0);
        mvPosition.xy += position.xy * uSize;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      varying vec2 vUv;
      #include <fog_pars_fragment>
      void main() {
        vec4 c = texture2D(map, vUv);
        if (c.a < 0.5) discard;
        gl_FragColor = vec4(c.rgb, 1.0);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
  mat.uniforms.map.value = texture
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  mesh.raycast = () => {}
  mesh.renderOrder = 2
  let n = 0
  return {
    mesh,
    begin() {
      n = 0
    },
    add(p) {
      if (n >= max) return
      pos.setXYZ(n++, p.x, p.y, p.z)
    },
    end() {
      geo.instanceCount = n
      pos.needsUpdate = true
    },
    dispose() {
      geo.dispose()
      base.dispose()
      mat.dispose()
    },
  }
}

/** Atoms as instanced balls of one colour: begin(), add(position, radius), end(). */
function atomCloud(geo, mat, max) {
  const mesh = new THREE.InstancedMesh(geo, mat, max)
  mesh.frustumCulled = false
  mesh.raycast = () => {}
  mesh.count = 0
  const m = new THREE.Matrix4()
  let n = 0
  return {
    mesh,
    begin() {
      n = 0
    },
    add(p, r) {
      if (n >= max) return
      m.makeScale(r, r, r).setPosition(p.x, p.y, p.z)
      mesh.setMatrixAt(n++, m)
    },
    end() {
      mesh.count = n
      mesh.instanceMatrix.needsUpdate = true
    },
  }
}

/** A point moving along a polyline at a steady speed. */
function polyline(points) {
  const lens = [0]
  for (let i = 1; i < points.length; i++) lens.push(lens[i - 1] + points[i].distanceTo(points[i - 1]))
  const total = lens[lens.length - 1]
  return {
    total,
    at(d, out) {
      if (d <= 0) return out.copy(points[0])
      if (d >= total) return out.copy(points[points.length - 1])
      let i = 1
      while (lens[i] < d) i++
      const k = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1)
      return out.copy(points[i - 1]).lerp(points[i], k)
    },
  }
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, lang, clickable }) {
  const stage = depotStage({ light })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const geos = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const glow = softGlow()
  const puffTex = puffTexture()
  textures.push(puffTex)
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const sign = stage.sign
  // things whose words follow the depth switch: [object, 'kid' | 'sci']
  const byLevel = []
  let shownLevel = null
  const tex = t => (textures.push(t), t)
  const hitBox = (w, h, d) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ghost)
  const world = obj => obj.getWorldPosition(new THREE.Vector3())
  /** A rod between two points (pipes, wires, posts). */
  const rod = (a, b, r, mat, parent) => {
    const len = a.distanceTo(b)
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mat)
    m.position.copy(a).add(b).multiplyScalar(0.5)
    m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize())
    parent.add(m)
    return m
  }
  const pipe = (pts, r, mat, parent) => {
    for (let i = 1; i < pts.length; i++) rod(pts[i - 1], pts[i], r, mat, parent)
    for (let i = 1; i < pts.length - 1; i++) {
      const j = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat)
      j.position.copy(pts[i])
      parent.add(j)
    }
  }
  const waterMat = new THREE.MeshStandardMaterial({ color: '#4fa6e0', emissive: '#1d5f94', emissiveIntensity: 0.45, roughness: 0.08, transparent: true, opacity: 0.82 })
  const copper = new THREE.MeshStandardMaterial({ color: '#c07a3a', roughness: 0.35, metalness: 0.85, emissive: '#5a2e10', emissiveIntensity: 0.25 })
  const ballGeo = new THREE.SphereGeometry(1, 16, 12)
  geos.push(ballGeo)

  // ======================================================================================================
  // the giant fuel cell, west of the arrival, cut open (local x across its layers, front +z)
  // ======================================================================================================
  const FC = { x: -6.5, z: -1.8 }
  const Y0 = 0.55 // the layers' foot (the top of the base)
  const Y1 = 3.15 // their top
  const TOP = 3.39 // the top bar's top
  const CH_A = { x0: -1.36, x1: -0.58, y0: Y0 + 0.12, y1: Y1 - 0.12, z0: -0.47, z1: 0.47 }
  const CH_C = { x0: 0.6, x1: 1.36, y0: Y0 + 0.12, y1: Y1 - 0.12, z0: -0.47, z1: 0.47 }
  const cellG = new THREE.Group()
  cellG.position.set(FC.x, 0, FC.z)
  root.add(cellG)
  const graphite = new THREE.MeshStandardMaterial({ color: '#4f5560', roughness: 0.55, metalness: 0.35 })
  const carbon = new THREE.MeshStandardMaterial({ color: '#17181d', roughness: 0.9 })
  const membraneMat = new THREE.MeshStandardMaterial({ color: '#46cf62', emissive: '#1f8a3a', emissiveIntensity: 0.45, roughness: 0.9, transparent: true, opacity: 0.5, depthWrite: false })
  const backMat = new THREE.MeshStandardMaterial({ color: '#1b2546', roughness: 0.8 })
  const platMat = new THREE.MeshStandardMaterial({ color: '#d8dde4', roughness: 0.2, metalness: 1, emissive: '#7f8a99', emissiveIntensity: 0.35 })
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(4.3, Y0, 1.5, 2, 0.05), mats.dark)
    base.position.y = Y0 / 2
    base.castShadow = true
    cellG.add(base)
    const H = Y1 - Y0
    const mid = (Y0 + Y1) / 2
    // the end plates, ridged on their inner faces (the channels the gas runs along)
    for (const s of [-1, 1]) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.4, H, 1.2), graphite)
      plate.position.set(s * 1.65, mid, 0)
      plate.castShadow = true
      cellG.add(plate)
      for (let k = 0; k < 9; k++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 1.14), graphite)
        rib.position.set(s * 1.41, Y0 + 0.25 + k * 0.28, 0)
        cellG.add(rib)
      }
      // the channel's back wall, dark so the molecules stand out
      const back = new THREE.Mesh(new THREE.PlaneGeometry(0.98, H), backMat)
      back.position.set(s * 0.96, mid, -0.59)
      cellG.add(back)
      // the catalyst layers: carbon dotted with platinum on the faces toward the gas
      const cat = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, 1.2), carbon)
      cat.position.set(s * 0.35, mid, 0)
      cellG.add(cat)
    }
    const dots = new THREE.InstancedMesh(ballGeo, platMat, 80)
    const o = new THREE.Object3D()
    for (let i = 0; i < 80; i++) {
      const s = i < 40 ? -1 : 1
      o.position.set(s * 0.452, rand(Y0 + 0.08, Y1 - 0.08), rand(-0.56, 0.56))
      o.scale.setScalar(rand(0.022, 0.036))
      o.updateMatrix()
      dots.setMatrixAt(i, o.matrix)
    }
    dots.raycast = () => {}
    cellG.add(dots)
    // the membrane, green as in the picture, see-through so the protons show inside it
    const mem = new THREE.Mesh(new THREE.BoxGeometry(0.5, H, 1.2), membraneMat)
    mem.position.set(0, mid, 0)
    mem.renderOrder = 3
    // a dark wall behind it too: through the see-through membrane the train's stripes showed as bands
    const memBack = new THREE.Mesh(new THREE.PlaneGeometry(0.5, H), new THREE.MeshStandardMaterial({ color: '#0f2a1c', roughness: 0.9 }))
    memBack.position.set(0, mid, -0.605)
    cellG.add(mem, memBack)
    // the top bar with the names of the layers, and the floor of each channel
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.7, TOP - Y1, 1.22), new THREE.MeshStandardMaterial({ color: '#202a4a', roughness: 0.6 }))
    bar.position.set(0, (Y1 + TOP) / 2, 0)
    cellG.add(bar)
    // copper collectors on the bar, from each catalyst out to the wire
    for (const s of [-1, 1]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.05, 0.12), copper)
      strip.position.set(s * 1.1, TOP + 0.025, 0)
      cellG.add(strip)
    }
    // a glass front over the two channels, hardly there
    const glass = edgeGlass({ color: '#dceeff', edge: 0.35, base: 0.025 })
    disposers.push(() => glass.dispose())
    for (const s of [-1, 1]) {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(1.0, H), glass)
      g.position.set(s * 0.96, mid, 0.6)
      g.renderOrder = 4
      cellG.add(g)
    }
    solids.push(box(FC.x, FC.z, 4.4, 1.6))
  }
  // a floodlight on a pole in front of it, so the cut face reads at dusk
  {
    // (front left, out of the arrival's line of sight and of the station view)
    const P = { x: -3.4, z: 1.6 }
    const face = Math.atan2(3.1, -1.6)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.6, 10), mats.dark)
    pole.position.set(P.x, 2.3, P.z)
    const head = new THREE.Group()
    head.position.set(P.x + 0.12, 4.55, P.z - 0.06)
    head.rotation.y = face
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.22, 0.3), mats.dark)
    const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.16), mats.lamp)
    lens.position.z = 0.152
    head.add(housing, lens)
    cellG.add(pole, head)
    const spot = new THREE.SpotLight('#ffe7c4', light ? 40 : 32, 14, 0.75, 0.6, 1.4)
    spot.position.set(P.x + 0.25, 4.5, P.z - 0.12)
    spot.target.position.set(-0.3, 1.6, 0)
    cellG.add(spot, spot.target)
    solids.push(circle(FC.x + P.x, FC.z + P.z, 0.15))
  }
  // the wire round the top, through the bulb, and its electrons' way
  const wireCurve = new THREE.CatmullRomCurve3([V(-1.65, TOP + 0.03, 0), V(-1.72, 3.95, 0), V(-1.2, 4.38, 0), V(-0.32, 4.52, 0), V(0, 4.54, 0), V(0.32, 4.52, 0), V(1.2, 4.38, 0), V(1.72, 3.95, 0), V(1.65, TOP + 0.03, 0)])
  {
    const tube = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 80, 0.035, 8, false), copper)
    cellG.add(tube)
  }
  const wirePts = wireCurve.getSpacedPoints(48)
  // the bulb on top
  const bulbGlassMat = new THREE.MeshStandardMaterial({ color: '#fff4d6', transparent: true, opacity: 0.35, roughness: 0.1, emissive: '#ffcc66', emissiveIntensity: 0, depthWrite: false })
  const filamentMat = new THREE.MeshStandardMaterial({ color: '#6a5a40', emissive: '#ffd27a', emissiveIntensity: 0 })
  const bulbGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffd27a', blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }))
  let bulbLight = null
  {
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.16, 16), mats.dark)
    socket.position.set(0, 4.56, 0)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16), bulbGlassMat)
    bulb.position.set(0, 4.86, 0)
    bulb.renderOrder = 4
    const fil = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 16), filamentMat)
    fil.position.set(0, 4.84, 0)
    bulbGlow.position.set(0, 4.86, 0.05)
    bulbGlow.scale.setScalar(0.01)
    cellG.add(socket, bulb, fil, bulbGlow)
    if (!light) {
      bulbLight = new THREE.PointLight('#ffd27a', 0, 6, 1.8)
      bulbLight.position.set(0, 4.86, 0.4)
      cellG.add(bulbLight)
    }
  }
  // the meters on the bar: the current (both depths) and, at Scientist level, the cell's voltage
  function meter(x) {
    const t = tex(canvasTex(256, 256))
    const g = new THREE.Group()
    g.position.set(x, TOP, 0.32)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), mats.dark)
    post.position.y = 0.06
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.06, 32), mats.dark)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.38
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.245, 40), new THREE.MeshStandardMaterial({ map: t, color: '#c9c4b6', emissive: '#ffffff', emissiveMap: t, emissiveIntensity: 0.12, roughness: 0.8 }))
    face.position.set(0, 0.38, 0.032)
    g.add(post, rim, face)
    cellG.add(g)
    let key = null
    return {
      group: g,
      draw(v01, top, bottom) {
        const k = `${Math.round(v01 * 200)}|${top}|${bottom}`
        if (k === key) return
        key = k
        t.userData.redraw((c, w) => {
          const m = w / 2
          c.clearRect(0, 0, w, w)
          c.fillStyle = '#f1ead8'
          c.beginPath()
          c.arc(m, m, m - 2, 0, TAU)
          c.fill()
          const a0 = Math.PI * 0.75
          const a1 = Math.PI * 2.25
          c.strokeStyle = '#2a2f38'
          for (let i = 0; i <= 10; i++) {
            const a = a0 + ((a1 - a0) * i) / 10
            c.lineWidth = i % 5 ? 3 : 6
            const r0 = i % 5 ? m - 26 : m - 34
            c.beginPath()
            c.moveTo(m + Math.cos(a) * r0, m + Math.sin(a) * r0)
            c.lineTo(m + Math.cos(a) * (m - 12), m + Math.sin(a) * (m - 12))
            c.stroke()
          }
          // a green band near the top of the scale
          c.strokeStyle = 'rgba(60,170,80,0.8)'
          c.lineWidth = 8
          c.beginPath()
          c.arc(m, m, m - 18, a0 + (a1 - a0) * 0.7, a1)
          c.stroke()
          const a = a0 + (a1 - a0) * clamp(v01)
          c.strokeStyle = '#c0262d'
          c.lineWidth = 6
          c.beginPath()
          c.moveTo(m - Math.cos(a) * 16, m - Math.sin(a) * 16)
          c.lineTo(m + Math.cos(a) * (m - 30), m + Math.sin(a) * (m - 30))
          c.stroke()
          c.fillStyle = '#2a2f38'
          c.beginPath()
          c.arc(m, m, 10, 0, TAU)
          c.fill()
          c.textAlign = 'center'
          c.fillStyle = '#1b1d22'
          let s = 30
          c.font = `700 ${s}px Outfit`
          while (s > 14 && c.measureText(top).width > w * 0.62) c.font = `700 ${--s}px Outfit`
          c.fillText(top, m, m + 62)
          c.font = '800 34px Outfit'
          c.fillText(bottom, m, m + 100)
        })
      },
    }
  }
  const amps = meter(0.95)
  const volts = meter(-0.95)
  byLevel.push([volts.group, 'sci'])
  // the hydrogen bottle (red shoulder, as hydrogen's are in Europe), its valve and the pipe to the cell
  const bottle = new THREE.Group()
  bottle.position.set(-2.5, 0, 0.12)
  cellG.add(bottle)
  const wheel = new THREE.Group()
  {
    const steel = new THREE.MeshStandardMaterial({ color: '#7a828c', roughness: 0.45, metalness: 0.6 })
    const red = new THREE.MeshStandardMaterial({ color: '#b8322f', roughness: 0.45, metalness: 0.3 })
    const brass = new THREE.MeshStandardMaterial({ color: '#b89a4a', roughness: 0.35, metalness: 0.9 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.45, 24), steel)
    body.position.y = 0.725
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 10, 0, TAU, 0, Math.PI / 2), red)
    shoulder.position.y = 1.45
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.14, 12), brass)
    neck.position.y = 1.72
    const valve = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.1), brass)
    valve.position.y = 1.82
    wheel.position.y = 1.93
    const rimW = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 8, 20), red)
    rimW.rotation.x = Math.PI / 2
    wheel.add(rimW)
    for (let k = 0; k < 3; k++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.015), red)
      sp.rotation.y = (k / 3) * Math.PI
      wheel.add(sp)
    }
    const label = sign('H2', 0.2)
    label.position.set(0, 0.95, 0.225)
    bottle.add(body, shoulder, neck, valve, wheel, label)
    pipe([V(-2.44, 1.82, 0.12), V(-2.2, 1.82, 0.12), V(-2.2, 2.9, 0.12), V(-1.86, 2.9, 0)], 0.035, steel, cellG)
    solids.push(circle(FC.x - 2.5, FC.z + 0.12, 0.3))
  }
  const bottleHit = hitBox(0.62, 2.15, 0.62)
  bottleHit.position.set(0, 1.07, 0)
  bottle.add(bottleHit)
  // the air intake: a box with a fan, a duct to the cell
  const airBox = new THREE.Group()
  airBox.position.set(2.5, 0, 0.1)
  cellG.add(airBox)
  const fan = new THREE.Group()
  {
    const shell = new THREE.Mesh(new RoundedBoxGeometry(0.66, 1.4, 0.74, 2, 0.05), new THREE.MeshStandardMaterial({ color: '#aab3ba', roughness: 0.5, metalness: 0.2 }))
    shell.position.y = 0.7
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.26, 32), mats.dark)
    disc.position.set(0, 0.86, 0.372)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 8, 32), mats.steel)
    ring.position.set(0, 0.86, 0.38)
    fan.position.set(0, 0.86, 0.39)
    for (let k = 0; k < 5; k++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.01).translate(0, 0.12, 0), mats.steel)
      blade.rotation.z = (k / 5) * TAU
      fan.add(blade)
    }
    // a grille of thin bars over it
    for (let k = -3; k <= 3; k++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.012, 0.012), mats.steel)
      b.position.set(0, 0.86 + k * 0.07, 0.4)
      airBox.add(b)
    }
    airBox.add(shell, disc, ring, fan)
    pipe([V(2.5, 1.4, 0.1), V(2.5, 2.9, 0.1), V(1.86, 2.9, 0)], 0.07, new THREE.MeshStandardMaterial({ color: '#aab3ba', roughness: 0.5 }), cellG)
    solids.push(box(FC.x + 2.5, FC.z + 0.1, 0.75, 0.85))
  }
  const airHit = hitBox(0.8, 1.6, 0.9)
  airHit.position.set(0, 0.8, 0)
  airBox.add(airHit)
  // the water's way out: a spout from the base into a beaker on the floor
  const beaker = { level: 0, shown: 0 }
  const beakerWater = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 1, 24).translate(0, 0.5, 0), waterMat)
  {
    pipe([V(1.0, 0.45, 0.7), V(1.0, 0.45, 0.95), V(1.0, 0.38, 0.98)], 0.03, mats.steel, cellG)
    const glassB = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.28, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#dfefff', transparent: true, opacity: 0.25, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false }))
    glassB.position.set(1.0, 0.14, 1.0)
    glassB.renderOrder = 4
    beakerWater.position.set(1.0, 0.01, 1.0)
    beakerWater.scale.y = 0.001
    cellG.add(glassB, beakerWater)
  }
  // the names: on the bar over each layer, under the catalysts, and (Scientist) on the end plates
  {
    const S = E.cell.signs
    for (const [x, text] of [[-0.97, S.h2], [0, S.membrane], [0.98, S.air]]) {
      const t = sign(text, 0.12, { maxWidth: 1.0 })
      t.position.set(x, (Y1 + TOP) / 2, 0.62)
      cellG.add(t)
    }
    for (const x of [-0.35, 0.35]) {
      const t = sign(S.platinum, 0.1, { maxWidth: 0.8, color: '#dfe6ee' })
      t.position.set(x, Y0 - 0.14, 0.76)
      cellG.add(t)
    }
    const w = sign(S.water, 0.11, { maxWidth: 0.7, color: '#bfe4ff' })
    w.position.set(1.55, Y0 - 0.14, 0.76)
    cellG.add(w)
    for (const [x, text] of [[-1.65, S.anode], [1.65, S.cathode]]) {
      const t = sign(text, 0.09, { maxWidth: 2.2 })
      t.position.set(x, (Y0 + Y1) / 2, 0.61)
      t.rotation.z = Math.PI / 2
      cellG.add(t)
      byLevel.push([t, 'sci'])
    }
  }

  // ---- the molecules, protons and electrons inside ----
  const NH2 = light ? 6 : 9
  const NO2 = light ? 4 : 6
  const hMat = new THREE.MeshStandardMaterial({ color: '#eef1f6', roughness: 0.35, emissive: '#8893a8', emissiveIntensity: 0.35 })
  const oMat = new THREE.MeshStandardMaterial({ color: '#e8403c', roughness: 0.35, emissive: '#8a1612', emissiveIntensity: 0.4 })
  const hAtoms = atomCloud(ballGeo, hMat, 110)
  const oAtoms = atomCloud(ballGeo, oMat, 70)
  const protonTex = tex(chargeTexture('#ffd6d2', '#ff5a55', '#8a1a18', '+'))
  const electronTex = tex(chargeTexture('#eafcff', '#5fd2f0', '#0d6a8a', '−'))
  const protonsC = badgeCloud(protonTex, 40, 0.17)
  const electronsC = badgeCloud(electronTex, 70, 0.17)
  const dropsC = atomCloud(ballGeo, waterMat, 10)
  cellG.add(hAtoms.mesh, oAtoms.mesh, protonsC.mesh, electronsC.mesh, dropsC.mesh)
  const R_H = 0.085
  const R_O = 0.12
  const h2s = [] // { p, v, ax, go }
  const o2s = []
  const sites = [] // O atoms on the cathode: { p, landed, used, gp, ge }
  const protons = [] // { a, b, t, dur, site, w }
  const electrons = [] // { path, d, site }
  const waters = [] // { p, v, ax, t }
  const drops = [] // { p, vy, grow }
  const randAxis = () => V(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize()
  const spawnIn = (list, ch, inletX, dir, scatter = false) => {
    const p = scatter ? V(rand(ch.x0, ch.x1), rand(ch.y0, ch.y1), rand(ch.z0, ch.z1)) : V(inletX, 2.9 + rand(-0.06, 0.06), rand(-0.08, 0.08))
    list.push({ p, v: V(dir * rand(0.35, 0.6), rand(-0.3, 0.05), rand(-0.2, 0.2)), ax: randAxis(), spin: rand(0.6, 1.4), go: null })
  }
  const wander = (m, ch, dt, pull) => {
    m.v.x += (rand(-1, 1) * 1.4 + pull) * dt
    m.v.y += rand(-1, 1) * 1.4 * dt
    m.v.z += rand(-1, 1) * 1.4 * dt
    const sp = m.v.length()
    if (sp > 0.45) m.v.multiplyScalar(0.45 / sp)
    m.p.addScaledVector(m.v, dt)
    for (const [k, lo, hi] of [['x', ch.x0, ch.x1], ['y', ch.y0, ch.y1], ['z', ch.z0, ch.z1]]) {
      if (m.p[k] < lo) (m.p[k] = lo), (m.v[k] = Math.abs(m.v[k]))
      if (m.p[k] > hi) (m.p[k] = hi), (m.v[k] = -Math.abs(m.v[k]))
    }
    m.ax.applyAxisAngle(V(0.3, 1, 0.2).normalize(), m.spin * dt)
  }
  // the cell's state (shared): the two gases, the road's steepness, the beaker
  let h2On = false
  let airOn = false
  let load = 0.35
  let cellMine = false
  let acc = 0
  let current = 0 // the bulb's and the ammeter's smoothed share (0..1)
  let flowT = 0 // seconds since the last electron went through the bulb
  let wentOnce = false
  let band = 'gentle'
  const bandOf = v => (v < 0.35 ? 'flat' : v < 0.7 ? 'gentle' : 'steep')
  const roadName = (v, lv) => (lv === 'scientist' ? `${nf(I_MAX * v, 2)} A/cm²` : E.cell.road[bandOf(v)])
  const cellPanel = lv => ({
    title: E.cell.title,
    color,
    blocks: [
      {
        slider: {
          label: at(E.cell.slider, lv),
          min: 0.1,
          max: 1,
          step: 0.05,
          value: load,
          onInput: v => slideLoad(v),
          format: v => roadName(v, lv),
          live: () => load,
        },
      },
      { buttons: [{ label: E.cell.buttons.h2, onClick: () => cellStep('h2') }, { label: E.cell.buttons.air, onClick: () => cellStep('air') }] },
      ...paras(E.cell.panel, lv),
    ],
  })
  function prefill() {
    h2s.length = 0
    o2s.length = 0
    sites.length = 0
    protons.length = 0
    electrons.length = 0
    waters.length = 0
    if (h2On) for (let i = 0; i < NH2; i++) spawnIn(h2s, CH_A, -1.4, 1, true)
    if (airOn) for (let i = 0; i < NO2; i++) spawnIn(o2s, CH_C, 1.4, -1, true)
  }
  function cellStep(step) {
    const lv = level()
    const S = E.cell.says
    if (step === 'h2') {
      h2On = !h2On
      play(h2On ? 'fizz' : 'tap', { order: 0.6 })
      if (h2On) say(at(airOn ? S.both : S.h2On, lv))
      else say(at(S.h2Off, lv))
    } else if (step === 'air') {
      airOn = !airOn
      play(airOn ? 'select' : 'tap')
      if (airOn) say(at(h2On ? S.both : S.airOn, lv))
      else say(at(S.airOff, lv))
    } else return
    cellMine = true
    share('cell')
  }
  let loadSending = false
  function slideLoad(v) {
    load = clamp(Math.round(v * 20) / 20, 0.1, 1)
    cellMine = true
    const b = bandOf(load)
    if (b !== band) {
      band = b
      if (b !== 'gentle') say(at(E.cell.says[b], level()))
    }
    if (loadSending) return
    loadSending = true
    later(0.25, () => {
      loadSending = false
      share('cell')
    })
  }
  ex.add({
    id: 'cell',
    x: FC.x,
    z: FC.z + 4.0,
    radius: 2.3,
    manual: true,
    label: E.cell.label,
    verb: () => {
      const h = E.cell.hints
      if (!h2On) return h.h2
      if (!airOn) return h.air
      return h.run
    },
    focus: focusOf(FC.x, 2.4, FC.z + 0.2, 5.3, 5.4),
    act: () => ctx.showPanel(cellPanel),
  })
  clickable(bottle, () => cellStep('h2'), { reach: 6 })
  clickable(airBox, () => cellStep('air'), { reach: 6 })

  // one reaction: an H2 splits at the anode; its protons cross, its electrons go round; an O at the cathode
  // takes two of each and leaves as water
  function freeSite() {
    let s = sites.find(q => !q.used)
    if (s) return s
    const m = o2s.filter(q => !q.go).sort((a, b) => a.p.x - b.p.x)[0]
    if (!m) return null
    const y = clamp(m.p.y, CH_C.y0 + 0.15, CH_C.y1 - 0.15)
    const z = clamp(m.p.z, -0.4, 0.4)
    m.go = { from: m.p.clone(), to: V(0.6, y, z), t: 0, dur: 0.45 }
    const a = { p: V(0.6, y + 0.12, z), landed: false, used: false, gp: 0, ge: 0, mol: m }
    const b = { p: V(0.6, y - 0.12, z), landed: false, used: false, gp: 0, ge: 0, mol: m }
    sites.push(a, b)
    return a
  }
  function startReaction() {
    const m = h2s.filter(q => !q.go).sort((a, b) => b.p.x - a.p.x)[0]
    if (!m) return false
    const site = freeSite()
    if (!site) return false
    site.used = true
    const y = clamp(m.p.y, CH_A.y0 + 0.1, CH_A.y1 - 0.1)
    const z = clamp(m.p.z, -0.4, 0.4)
    m.go = { from: m.p.clone(), to: V(-0.54, y, z), t: 0, dur: 0.4, site }
    return true
  }
  function split(m) {
    const site = m.go.site
    const y = m.go.to.y
    const z = m.go.to.z
    for (const s of [-1, 1]) {
      protons.push({ a: V(-0.44, y + s * 0.07, z), b: V(0.42, site.p.y + s * 0.07, site.p.z), t: 0, dur: rand(1.2, 1.6), site, w: rand(0, TAU) })
      const path = polyline([
        V(-0.5, y + s * 0.07, z + 0.05),
        V(-0.5, Y1 - 0.06, z * 0.4),
        V(-0.62, TOP + 0.07, 0),
        ...wirePts.map(p => p.clone().add(V(0, 0.07, 0))),
        V(0.62, TOP + 0.07, 0),
        V(0.52, Y1 - 0.06, site.p.z * 0.4),
        V(0.52, site.p.y + s * 0.07, site.p.z + 0.05),
      ])
      electrons.push({ path, d: s < 0 ? 0 : -0.12, site })
    }
  }
  const tmpA = new THREE.Vector3()
  const tmpB = new THREE.Vector3()
  updates.push((dt, t) => {
    const lv = level()
    // gas comes in while its valve is open
    if (h2On && h2s.length < NH2 && Math.random() < dt * 4) spawnIn(h2s, CH_A, -1.4, 1)
    if (airOn && o2s.length < NO2 && Math.random() < dt * 3) spawnIn(o2s, CH_C, 1.4, -1)
    for (const m of h2s) if (!m.go) wander(m, CH_A, dt, 0.12)
    for (const m of o2s) if (!m.go) wander(m, CH_C, dt, -0.12)
    // reactions at the slider's rate, while both gases are there
    const rate = (light ? 0.8 : 1) * (0.45 + 2.6 * load)
    acc = Math.min(1.5, acc + rate * dt)
    if (acc >= 1 && sites.filter(s => s.used).length < 10) {
      if (startReaction()) acc -= 1
    }
    // molecules on their way to the platinum
    for (let i = h2s.length - 1; i >= 0; i--) {
      const m = h2s[i]
      if (!m.go) continue
      m.go.t += dt
      const k = clamp(m.go.t / m.go.dur)
      m.p.lerpVectors(m.go.from, m.go.to, ease(k))
      if (k >= 1) {
        split(m)
        h2s.splice(i, 1)
        if (cellMine) play('electron')
      }
    }
    for (let i = o2s.length - 1; i >= 0; i--) {
      const m = o2s[i]
      if (!m.go) continue
      m.go.t += dt
      const k = clamp(m.go.t / m.go.dur)
      m.p.lerpVectors(m.go.from, m.go.to, ease(k))
      if (k >= 1) {
        for (const s of sites) if (s.mol === m) s.landed = true
        o2s.splice(i, 1)
      }
    }
    // protons through the membrane
    for (let i = protons.length - 1; i >= 0; i--) {
      const p = protons[i]
      p.t += dt
      if (p.t >= p.dur) {
        p.site.gp++
        protons.splice(i, 1)
      }
    }
    // electrons round the wire
    let onWire = 0
    for (let i = electrons.length - 1; i >= 0; i--) {
      const e = electrons[i]
      e.d += dt * 3.4
      if (e.d > 1.5 && e.d < e.path.total - 1.5) onWire++
      if (e.d >= e.path.total) {
        e.site.ge++
        electrons.splice(i, 1)
      }
    }
    // water where an O has its two protons and two electrons
    for (let i = sites.length - 1; i >= 0; i--) {
      const s = sites[i]
      if (s.landed && s.gp >= 2 && s.ge >= 2) {
        waters.push({ p: s.p.clone().add(V(0.08, 0, 0)), v: V(0.12, -0.35, rand(-0.05, 0.05)), ax: randAxis(), spin: rand(0.6, 1.4), t: 0 })
        sites.splice(i, 1)
      }
    }
    for (let i = waters.length - 1; i >= 0; i--) {
      const w = waters[i]
      w.t += dt
      if (w.p.y > CH_C.y0 + 0.05) {
        // drifting down the air channel
        w.v.x += (rand(-1, 1) * 0.8 + (1.0 - w.p.x) * 0.6) * dt
        w.v.y = Math.max(-0.5, w.v.y - 0.25 * dt)
        w.v.z += (rand(-1, 1) * 0.8 + (0.3 - w.p.z) * 0.5) * dt
        w.p.addScaledVector(w.v, dt)
        w.p.x = clamp(w.p.x, CH_C.x0 + 0.05, CH_C.x1)
        w.p.z = clamp(w.p.z, CH_C.z0, CH_C.z1)
        w.ax.applyAxisAngle(V(0.3, 1, 0.2).normalize(), w.spin * dt)
      } else {
        // out through the floor to the spout: a drop forms there
        waters.splice(i, 1)
        drops.push({ p: V(1.0, 0.36, 0.98), vy: 0, grow: 0 })
      }
    }
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]
      if (d.grow < 1) {
        d.grow = Math.min(1, d.grow + dt * 3)
        continue
      }
      d.vy -= 9.8 * dt
      d.p.y += d.vy * dt
      const surface = 0.01 + beaker.shown * 0.24
      if (d.p.y <= surface) {
        drops.splice(i, 1)
        beaker.level = Math.min(0.95, beaker.level + 0.012)
        if (cellMine && Math.random() < 0.3) play('pop')
      }
    }
    beaker.shown = damp(beaker.shown, beaker.level, 4, dt)
    beakerWater.scale.y = Math.max(0.001, beaker.shown * 0.24)
    // the first light: the find, the panel
    flowT = onWire > 0 ? 0 : flowT + dt
    const flowing = flowT < 1.2
    if (flowing && !wentOnce) {
      wentOnce = true
      if (cellMine) {
        say(at(E.cell.says.go, lv))
        play('discover')
        ex.discover('cell', cellPanel, 5)
      }
    }
    if (!flowing && !h2On && !airOn) wentOnce = false
    current = damp(current, flowing ? 0.25 + 0.75 * load : 0, 3, dt)
    const k = current
    bulbGlassMat.emissiveIntensity = k * 2.2
    filamentMat.emissiveIntensity = k * 7
    bulbGlow.material.opacity = clamp(k * 1.1)
    bulbGlow.scale.setScalar(0.2 + 1.4 * k)
    if (bulbLight) bulbLight.intensity = k * 3
    fan.rotation.z -= dt * (airOn ? 14 : 0)
    wheel.rotation.y = lerp(wheel.rotation.y, h2On ? Math.PI * 1.5 : 0, clamp(dt * 4))
    // the meters
    const sci = lv === 'scientist'
    const i = flowing ? I_MAX * load * (current / (0.25 + 0.75 * load || 1)) : 0
    const gases = h2s.length > 0 && (o2s.length > 0 || sites.length > 0)
    const v = i > 0.02 ? voltsAt(i) : gases ? OPEN_V : 0
    amps.draw(i / I_MAX, sci ? 'A/cm²' : E.cell.signs.meter, sci ? nf(i, 2) : '')
    volts.draw(v / 1.2, sci ? `V · ${nf(Math.round((v / HHV_V) * 100))}%` : '', nf(v, 2))
    // draw them all
    hAtoms.begin()
    oAtoms.begin()
    for (const m of h2s) {
      hAtoms.add(tmpA.copy(m.p).addScaledVector(m.ax, 0.075), R_H)
      hAtoms.add(tmpA.copy(m.p).addScaledVector(m.ax, -0.075), R_H)
    }
    for (const m of o2s) {
      oAtoms.add(tmpA.copy(m.p).addScaledVector(m.ax, 0.105), R_O)
      oAtoms.add(tmpA.copy(m.p).addScaledVector(m.ax, -0.105), R_O)
    }
    for (const s of sites) if (s.landed) oAtoms.add(s.p, R_O)
    for (const w of waters) {
      oAtoms.add(w.p, R_O)
      // the two hydrogens at about 104° (drawn, not measured)
      const side = tmpB.set(0, 1, 0).cross(w.ax).normalize()
      hAtoms.add(tmpA.copy(w.p).addScaledVector(w.ax, 0.09).addScaledVector(side, 0.12), R_H)
      hAtoms.add(tmpA.copy(w.p).addScaledVector(w.ax, 0.09).addScaledVector(side, -0.12), R_H)
    }
    hAtoms.end()
    oAtoms.end()
    protonsC.begin()
    for (const p of protons) {
      const k2 = clamp(p.t / p.dur)
      tmpA.lerpVectors(p.a, p.b, k2)
      tmpA.y += Math.sin(p.w + k2 * 9) * 0.05 * Math.sin(Math.PI * k2)
      tmpA.z += Math.cos(p.w + k2 * 7) * 0.05 * Math.sin(Math.PI * k2)
      protonsC.add(tmpA)
    }
    // protons waiting at the cathode for their oxygen
    for (const s of sites) for (let j = 0; j < Math.min(2, s.gp); j++) protonsC.add(tmpA.copy(s.p).add(V(-0.14, (j - 0.5) * 0.14, 0.06)))
    protonsC.end()
    electronsC.begin()
    for (const e of electrons) if (e.d >= 0) electronsC.add(e.path.at(e.d, tmpA))
    electronsC.end()
    dropsC.begin()
    for (const d of drops) dropsC.add(d.p, 0.04 * Math.max(0.2, d.grow))
    dropsC.end()
  })

  // ======================================================================================================
  // the bus, its pump on the island and the water measure
  // ======================================================================================================
  const route = stage.route
  const routeLen = route.getLength()
  const PARK_X = 7.5
  const LANE_Z = DEPOT.lane.z
  let uPark = 0.5
  {
    let a = 0.2
    let b = 0.8
    for (let i = 0; i < 40; i++) {
      const m = (a + b) / 2
      if (route.getPointAt(m).x < PARK_X) a = m
      else b = m
    }
    uPark = (a + b) / 2
  }
  const busG = new THREE.Group()
  root.add(busG)
  const busWheels = []
  const flap = new THREE.Group()
  const EXHAUST = V(0.2, 0.22, 1.05) // the water outlet under its right side (bus's own coordinates)
  const FILLER = V(2.4, 1.25, 1.36)
  {
    const white = new THREE.MeshStandardMaterial({ color: '#cdd4d8', roughness: 0.4, metalness: 0.1 })
    const green = new THREE.MeshStandardMaterial({ color: '#36a347', roughness: 0.45, emissive: '#1f6a2a', emissiveIntensity: 0.25 })
    const glassM = new THREE.MeshStandardMaterial({ color: '#141e2b', roughness: 0.12, metalness: 0.4, emissive: '#3a4c64', emissiveIntensity: 0.35 })
    const tyre = new THREE.MeshStandardMaterial({ color: '#15171b', roughness: 0.9 })
    const fairing = new THREE.MeshStandardMaterial({ color: '#b4bdc4', roughness: 0.45, metalness: 0.15 })
    const body = new THREE.Mesh(new RoundedBoxGeometry(12, 2.75, 2.55, 3, 0.12), white)
    body.position.y = 0.3 + 1.375
    body.castShadow = true
    busG.add(body)
    for (const s of [-1, 1]) {
      const band = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 0.38), green)
      band.position.set(0, 1.17, s * 1.279)
      if (s < 0) band.rotation.y = Math.PI
      const win = new THREE.Mesh(new THREE.PlaneGeometry(10.9, 1.12), glassM)
      win.position.set(-0.1, 2.0, s * 1.281)
      if (s < 0) win.rotation.y = Math.PI
      busG.add(band, win)
      for (let x = -5.3; x <= 5.3; x += 1.32) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.14, 0.02), white)
        post.position.set(x, 2.0, s * 1.287)
        busG.add(post)
      }
      // the wheel arches, dark
      for (const x of [3.35, -2.55]) {
        const arch = new THREE.Mesh(new THREE.CircleGeometry(0.6, 24), mats.dark)
        arch.position.set(x, 0.5, s * 1.279)
        if (s < 0) arch.rotation.y = Math.PI
        busG.add(arch)
      }
      // the tanks under the roof's fairing, their ends showing as ovals (as in the picture)
      for (const x of [-3.4, -1.55, 0.3, 2.15]) {
        const ov = new THREE.Mesh(new THREE.CircleGeometry(0.15, 20), new THREE.MeshStandardMaterial({ color: '#8e98a2', roughness: 0.5 }))
        ov.scale.x = 2.1
        ov.position.set(x, 3.25, s * 1.181)
        if (s < 0) ov.rotation.y = Math.PI
        busG.add(ov)
      }
    }
    // doors on the right (+z), the windscreen, the destination display, lights
    for (const x of [4.95, 0.9]) {
      const door = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 2.3), glassM)
      door.position.set(x, 1.5, 1.289)
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.3, 0.02), white)
      seam.position.set(x, 1.5, 1.293)
      busG.add(door, seam)
    }
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.8), glassM)
    screen.position.set(6.006, 1.95, 0)
    screen.rotation.y = Math.PI / 2
    const fband = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.38), green)
    fband.position.set(6.005, 0.85, 0)
    fband.rotation.y = Math.PI / 2
    const dest = makeText('H2', { size: 0.2, color: '#ffb347' })
    dest.position.set(6.02, 2.87, 0)
    dest.rotation.y = Math.PI / 2
    const rear = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.8), glassM)
    rear.position.set(-6.006, 2.25, 0)
    rear.rotation.y = -Math.PI / 2
    busG.add(screen, fband, dest, rear)
    const head = new THREE.MeshBasicMaterial({ color: '#fff6e0' })
    const tail = new THREE.MeshBasicMaterial({ color: '#ff3020' })
    for (const s of [-1, 1]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.36), head)
      hl.position.set(6.01, 0.72, s * 0.85)
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.16), tail)
      tl.position.set(-6.01, 0.85, s * 1.05)
      busG.add(hl, tl)
    }
    const roof = new THREE.Mesh(new RoundedBoxGeometry(7.4, 0.42, 2.35, 2, 0.14), fairing)
    roof.position.set(-0.6, 3.25, 0)
    roof.castShadow = true
    busG.add(roof)
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.32, 24).rotateX(Math.PI / 2)
    const hubGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.34, 12).rotateX(Math.PI / 2)
    geos.push(wheelGeo, hubGeo)
    for (const x of [3.35, -2.55]) {
      for (const s of [-1, 1]) {
        const wg = new THREE.Group()
        wg.position.set(x, 0.5, s * 1.12)
        const w = new THREE.Mesh(wheelGeo, tyre)
        const h = new THREE.Mesh(hubGeo, mats.steel)
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.35), mats.dark)
        wg.add(w, h, spoke)
        busG.add(wg)
        busWheels.push(wg)
      }
    }
    // the filler's flap, hinged at its front edge, and the receptacle behind it
    flap.position.set(FILLER.x + 0.17, FILLER.y, 1.283)
    const fl = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.3, 0.025, 2, 0.008), white)
    fl.position.x = -0.17
    flap.add(fl)
    const rec = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 12), mats.steel)
    rec.rotation.x = Math.PI / 2
    rec.position.set(FILLER.x, FILLER.y, 1.27)
    busG.add(flap, rec)
    // the water outlet under the right side
    const out = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 10), mats.steel)
    out.position.copy(EXHAUST).add(V(0, 0.06, 0))
    busG.add(out)
  }
  const placeBus = u => {
    const p = route.getPointAt(u)
    const tg = route.getTangentAt(u)
    busG.position.set(p.x, 0, p.z)
    busG.rotation.y = Math.atan2(-tg.z, tg.x)
  }
  placeBus(uPark)
  const busHit = hitBox(12.1, 3.5, 2.6)
  busHit.position.y = 1.75
  busG.add(busHit)

  // the pump on the island: a white cabinet, a green cap with "H2", a screen, the nozzle on its hose
  const PUMP = { x: 8.5, z: -3.95, y: DEPOT.island.h }
  const pumpG = new THREE.Group()
  pumpG.position.set(PUMP.x, PUMP.y, PUMP.z)
  root.add(pumpG)
  const pumpTex = tex(canvasTex(512, 400))
  {
    const cab = new THREE.Mesh(new RoundedBoxGeometry(1.0, 2.05, 0.6, 2, 0.05), mats.white)
    cab.position.y = 1.025
    cab.castShadow = true
    const cap = new THREE.Mesh(new RoundedBoxGeometry(1.06, 0.26, 0.66, 2, 0.05), mats.green)
    cap.position.y = 2.17
    const h2a = makeText('H2', { size: 0.17, color: '#ffffff' })
    h2a.position.set(0, 2.17, 0.335)
    const h2b = makeText('H2', { size: 0.17, color: '#ffffff' })
    h2b.position.set(0, 2.17, -0.335)
    h2b.rotation.y = Math.PI
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.66), new THREE.MeshBasicMaterial({ map: pumpTex, toneMapped: false, color: '#d8d8d8' }))
    face.position.set(0, 1.5, 0.302)
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.2), mats.dark)
    holster.position.set(0.56, 1.12, 0)
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 10), mats.dark)
    port.rotation.z = Math.PI / 2
    port.position.set(0.53, 1.85, 0)
    // the rule, on the pump's front under its screen
    const rule = sign(E.bus.signs.rule, 0.075, { maxWidth: 0.86, color: '#eef4ff' })
    rule.position.set(0, 0.9, 0.31)
    pumpG.add(cab, cap, h2a, h2b, face, holster, port, rule)
    solids.push(box(PUMP.x, PUMP.z, 1.15, 0.75))
  }
  // the nozzle and its hose
  const nozzle = new THREE.Group()
  {
    const grip = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.26, 0.12, 2, 0.03), mats.dark)
    grip.position.y = 0.1
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.2, 12), mats.steel)
    barrel.position.y = -0.11
    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.05), mats.green)
    lever.position.set(0, 0.08, 0.08)
    nozzle.add(grip, barrel, lever)
    root.add(nozzle)
  }
  const nozzleHit = hitBox(0.4, 0.6, 0.4)
  nozzle.add(nozzleHit)
  const REST = V(PUMP.x + 0.62, PUMP.y + 1.17, PUMP.z)
  const REST_Q = new THREE.Quaternion()
  const PLUG_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
  const PORT = V(PUMP.x + 0.6, PUMP.y + 1.85, PUMP.z)
  const plugAt = () => busG.localToWorld(FILLER.clone().add(V(0, 0, 0.2)))
  let hose = null
  let hoseKey = ''
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#1d2026', roughness: 0.7 })
  function drawHose() {
    const back = V(0, 0.24, 0).applyQuaternion(nozzle.quaternion).add(nozzle.position)
    const key = `${back.x.toFixed(3)},${back.y.toFixed(3)},${back.z.toFixed(3)}`
    if (key === hoseKey) return
    hoseKey = key
    const mid = PORT.clone().lerp(back, 0.5).add(V(0.3, -0.3, 0))
    const up = V(0, 0.18, 0).applyQuaternion(nozzle.quaternion)
    const curve = new THREE.CatmullRomCurve3([PORT.clone(), PORT.clone().add(V(0.18, -0.12, 0)), mid, back.clone().add(up), back])
    const geo = new THREE.TubeGeometry(curve, 28, 0.028, 8, false)
    if (hose) {
      hose.geometry.dispose()
      hose.geometry = geo
    } else {
      hose = new THREE.Mesh(geo, hoseMat)
      hose.raycast = () => {}
      root.add(hose)
    }
  }
  nozzle.position.copy(REST)
  nozzle.quaternion.copy(REST_Q)
  drawHose()

  // the water measure: a tall glass on a stand, marked in litres, with a tap over a planter of flowers
  const MEAS = { x: 7.15, z: -4.0, y0: DEPOT.island.h + 0.35, h: 2.4 }
  const measureG = new THREE.Group()
  measureG.position.set(MEAS.x, 0, MEAS.z)
  root.add(measureG)
  const measWater = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.195, 1, 28).translate(0, 0.5, 0), waterMat)
  const stream = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V(0, MEAS.y0 + 0.08, 0.3), V(0, MEAS.y0 + 0.1, 0.55), V(0, DEPOT.island.h + 0.3, 0.72)), 12, 0.022, 6, false), waterMat)
  {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.3, 0.35, 24), mats.dark)
    stand.position.y = DEPOT.island.h + 0.175
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, MEAS.h, 32, 1, true), edgeGlass({ color: '#dceeff', edge: 0.7, base: 0.06 }))
    disposers.push(() => tube.material.dispose())
    tube.position.y = MEAS.y0 + MEAS.h / 2
    tube.renderOrder = 4
    const capT = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 32), mats.steel)
    capT.rotation.x = Math.PI / 2
    capT.position.y = MEAS.y0 + MEAS.h
    measWater.position.y = MEAS.y0 + 0.01
    measWater.scale.y = 0.001
    // the scale beside it: a mark every 25 litres, a number every 50
    const scaleTex = tex(
      canvasTex(96, 768, (g, w, h) => {
        g.clearRect(0, 0, w, h)
        g.fillStyle = 'rgba(13,20,48,0.85)'
        g.fillRect(0, 0, w, h)
        g.strokeStyle = '#eef4ff'
        g.fillStyle = '#eef4ff'
        g.textAlign = 'left'
        g.font = '700 22px Outfit'
        for (let l = 0; l <= MEASURE_MAX; l += 25) {
          const y = h - 8 - (l / MEASURE_MAX) * (h - 16)
          g.lineWidth = l % 50 ? 2 : 4
          g.beginPath()
          g.moveTo(0, y)
          g.lineTo(l % 50 ? 20 : 34, y)
          g.stroke()
          if (l % 50 === 0) g.fillText(String(l), 40, y + 8)
        }
      }),
    )
    const scale = new THREE.Mesh(new THREE.PlaneGeometry(0.2, MEAS.h), new THREE.MeshBasicMaterial({ map: scaleTex, transparent: true, toneMapped: false, color: '#cfd6e0' }))
    scale.position.set(0.36, MEAS.y0 + MEAS.h / 2, 0.02)
    const unit = sign('L', 0.12)
    unit.position.set(0.36, MEAS.y0 + MEAS.h + 0.14, 0.02)
    // its name up the tube's left side (above it, the speech bubble would cover it in the station view)
    const title = sign(E.bus.signs.measure, 0.12, { maxWidth: MEAS.h })
    title.position.set(-0.3, MEAS.y0 + MEAS.h / 2, 0.05)
    title.rotation.z = Math.PI / 2
    // the tap at its foot, the planter in front
    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 10), mats.steel)
    tap.rotation.x = Math.PI / 2
    tap.position.set(0, MEAS.y0 + 0.08, 0.27)
    const tapH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.025), mats.green)
    tapH.position.set(0, MEAS.y0 + 0.13, 0.28)
    const planter = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.3, 0.38, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#7a4a32', roughness: 0.85 }))
    planter.position.set(0, DEPOT.island.h + 0.15, 0.72)
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.32), new THREE.MeshStandardMaterial({ color: '#3a2a1e', roughness: 1 }))
    soil.rotation.x = -Math.PI / 2
    soil.position.set(0, DEPOT.island.h + 0.29, 0.72)
    measureG.add(stand, tube, capT, measWater, scale, unit, title, tap, tapH, planter, soil)
    const petals = ['#f4d35e', '#ff9fb2', '#c9a7ff', '#f7f3e8', '#ff7a5c']
    for (let i = 0; i < 9; i++) {
      const x = -0.32 + (i % 5) * 0.16 + (i > 4 ? 0.08 : 0)
      const z = 0.64 + (i > 4 ? 0.14 : 0)
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 5), mats.leaf)
      stem.position.set(x, DEPOT.island.h + 0.38, z)
      const fl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.045, 0), new THREE.MeshStandardMaterial({ color: petals[i % petals.length], roughness: 0.6 }))
      fl.position.set(x, DEPOT.island.h + 0.48, z)
      measureG.add(stem, fl)
    }
    stream.visible = false
    measureG.add(stream)
    solids.push(circle(MEAS.x, MEAS.z, 0.34), box(MEAS.x, MEAS.z + 0.72, 0.9, 0.42))
  }
  const measHit = hitBox(0.6, MEAS.h + 0.5, 0.6)
  measHit.position.y = MEAS.y0 + MEAS.h / 2
  measureG.add(measHit)

  // drops falling from the bus's outlet and a little vapour, while it drives
  const busDrops = atomCloud(ballGeo, waterMat, 24)
  root.add(busDrops.mesh)
  const vapour = puffCloud(light ? 18 : 36, { map: puffTex })
  root.add(vapour.mesh)
  const busDropList = []
  const vapourList = []

  // ---- the bus's state (shared): the hydrogen in its tanks, the water in the measure, the next trip ----
  let tank = 3 // kg, as it came back from its morning
  let water = 0 // L in the measure
  let trip = 50 // km
  let shownTank = tank
  let shownWater = water
  let fillAnim = null // { t, from, mine }
  let lap = null // { t, km, kg, from, wFrom, mine }
  let pour = null // { t, from, mine }
  let fillN = 0
  let lapN = 0
  let pourN = 0
  let lastTrip = null // { km, kg, l }
  let busMine = false
  const needKg = (km = trip) => (km * PER_100) / 100
  const busy = () => !!(fillAnim || lap || pour)
  const busPanel = lv => ({
    title: E.bus.title,
    color,
    blocks: [
      {
        slider: {
          label: E.bus.slider,
          min: 25,
          max: 400,
          step: 25,
          value: trip,
          onInput: v => slideTrip(v),
          format: v => `${nf(v)} km`,
          live: () => trip,
        },
      },
      { buttons: [['fill', 'nozzle'], ['drive', 'bus'], ['empty', 'measure']].map(([k, s]) => ({ label: E.bus.buttons[k], onClick: () => busStep(s) })) },
      ...paras(E.bus.panel, lv),
    ],
  })
  function startFill(mine) {
    fillAnim = { t: 0, from: shownTank, mine }
    tank = TANK_MAX
    play('select')
  }
  function startLap(km, mine) {
    const kg = needKg(km)
    lap = { t: 0, km, kg, from: shownTank, wFrom: shownWater, mine }
    tank = Math.max(0, tank - kg)
    water = Math.min(MEASURE_MAX, water + kg * WATER_PER_KG)
    play('beam')
  }
  function startPour(mine) {
    pour = { t: 0, from: shownWater, mine }
    water = 0
    play('fizz', { order: 0.5 })
  }
  function busStep(step) {
    const lv = level()
    const S = E.bus.says
    if (busy()) return say(at(W.busy, lv))
    if (step === 'nozzle') {
      if (tank >= TANK_MAX - 0.05) return say(at(S.full, lv))
      fillN++
      startFill(true)
      say(at(S.fill, lv))
    } else if (step === 'bus') {
      const kg = needKg()
      if (tank + 1e-6 < kg) return say(fill(at(S.low, lv), { km: nf(trip), kg: nf(tank, 1) }))
      if (water + kg * WATER_PER_KG > MEASURE_MAX + 1e-6) return say(at(S.overflow, lv))
      lapN++
      startLap(trip, true)
      say(at(S.drive, lv))
    } else if (step === 'measure') {
      if (water < 0.5) return say(at(S.pourEmpty, lv))
      pourN++
      const l = water
      startPour(true)
      say(fill(at(S.pour, lv), { l: nf(l), kg: nf(l / WATER_PER_KG, 1) }))
    } else return
    busMine = true
    share('bus')
  }
  let tripSending = false
  function slideTrip(v) {
    trip = clamp(Math.round(v / 25) * 25, 25, 400)
    busMine = true
    if (tripSending) return
    tripSending = true
    later(0.25, () => {
      tripSending = false
      share('bus')
    })
  }
  ex.add({
    id: 'bus',
    x: 8.4,
    z: 0.0,
    radius: 2.7,
    manual: true,
    label: E.bus.label,
    verb: () => {
      const h = E.bus.hints
      if (fillAnim) return h.filling
      if (lap) return h.away
      if (pour) return h.pouring
      if (tank + 1e-6 < needKg()) return h.fill
      if (water + needKg() * WATER_PER_KG > MEASURE_MAX + 1e-6) return h.empty
      return h.drive
    },
    focus: focusOf(8.7, 1.75, -4.6, 4.8, 5.3),
    act: () => ctx.showPanel(busPanel),
  })
  clickable(nozzle, () => busStep('nozzle'), { reach: 6, when: () => !lap })
  clickable(pumpG, () => busStep('nozzle'), { reach: 6, when: () => !lap })
  clickable(busG, () => busStep('bus'), { reach: 10, when: () => !lap })
  clickable(measureG, () => busStep('measure'), { reach: 6 })

  // the pump's screen
  let pumpKey = ''
  function drawPump(lv) {
    const S = E.bus.board
    const sci = lv === 'scientist'
    const bar = (BAR_MAX * shownTank) / TANK_MAX
    const kmNow = lap ? lap.km * ease(clamp(lap.t / LAP_T)) : null
    const key = `${lv}|${shownTank.toFixed(1)}|${trip}|${lastTrip?.km}|${kmNow == null ? '' : Math.round(kmNow)}`
    if (key === pumpKey) return
    pumpKey = key
    pumpTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1430'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#2f8f3c'
      g.fillRect(0, 0, w, 56)
      g.fillStyle = '#ffffff'
      g.textAlign = 'left'
      g.font = '800 34px Outfit'
      g.fillText(`H₂ · ${S.title}`, 18, 40)
      // the pressure dial
      const cx = 118
      const cy = 200
      const R = 96
      const a0 = Math.PI * 0.75
      const a1 = Math.PI * 2.25
      g.strokeStyle = 'rgba(255,255,255,0.25)'
      g.lineWidth = 14
      g.beginPath()
      g.arc(cx, cy, R, a0, a1)
      g.stroke()
      g.strokeStyle = '#7ee86a'
      g.beginPath()
      g.arc(cx, cy, R, a0, a0 + (a1 - a0) * clamp(bar / BAR_MAX))
      g.stroke()
      g.fillStyle = '#ffffff'
      g.textAlign = 'center'
      g.font = '800 44px Outfit'
      g.fillText(nf(bar), cx, cy + 12)
      g.font = '600 22px Outfit'
      g.fillText('bar', cx, cy + 42)
      g.fillStyle = 'rgba(200,215,240,0.85)'
      let s = 22
      g.font = `600 ${s}px Outfit`
      while (s > 12 && g.measureText(S.pressure).width > 210) g.font = `600 ${--s}px Outfit`
      g.fillText(S.pressure, cx, cy + R + 34)
      // the numbers
      const X = 238
      const line = (text, y, size, col = '#ffffff', weight = 700) => {
        let z = size
        g.font = `${weight} ${z}px Outfit`
        while (z > 11 && g.measureText(text).width > w - X - 14) g.font = `${weight} ${--z}px Outfit`
        g.fillStyle = col
        g.fillText(text, X, y)
      }
      g.textAlign = 'left'
      line(S.tank, 98, 22, 'rgba(200,215,240,0.85)', 600)
      line(`${nf(shownTank, 1)} kg`, 136, 36, '#7ee86a', 800)
      if (lap) {
        line(S.driving, 186, 22, 'rgba(200,215,240,0.85)', 600)
        line(`${nf(kmNow)} km`, 222, 34, '#ffffff', 800)
      } else {
        line(S.next, 186, 22, 'rgba(200,215,240,0.85)', 600)
        line(`${nf(trip)} km`, 222, 34, '#ffffff', 800)
        line(fill(S.uses, { kg: nf(needKg(), 1) }), 256, 22, '#eef4ff', 600)
        line(fill(S.makes, { l: nf(needKg() * WATER_PER_KG) }), 286, 22, '#8fd0ff', 700)
      }
      if (lastTrip) line(fill(S.last, { km: nf(lastTrip.km), kg: nf(lastTrip.kg, 1), l: nf(lastTrip.l) }), 332, 20, 'rgba(200,215,240,0.85)', 600)
      if (sci) line(S.sci, 372, 18, '#ffd166', 600)
    })
  }
  updates.push((dt, t) => {
    const lv = level()
    const S = E.bus.says
    // filling: the nozzle goes to the bus, the tank rises, the nozzle comes back
    let plug = 0
    if (fillAnim) {
      fillAnim.t += dt
      const s = fillAnim.t
      plug = span(0, 1.1, s) * (1 - span(FILL_T - 0.9, FILL_T, s))
      shownTank = lerp(fillAnim.from, TANK_MAX, span(1.1, FILL_T - 1.0, s))
      if (s > 1.2 && s < FILL_T - 1 && Math.floor((s - dt) / 0.6) !== Math.floor(s / 0.6)) play('fizz', { order: 0.35 })
      if (s >= FILL_T) {
        if (fillAnim.mine) say(at(S.filled, lv))
        fillAnim = null
        shownTank = tank
      }
    }
    if (plug > 0 || fillAnim) {
      const target = plugAt()
      const ctrl = REST.clone().lerp(target, 0.5).add(V(0.1, 0.55, 0))
      const k = ease(plug)
      const a = REST.clone().lerp(ctrl, k)
      const b = ctrl.clone().lerp(target, k)
      nozzle.position.copy(a.lerp(b, k))
      nozzle.quaternion.slerpQuaternions(REST_Q, PLUG_Q, k)
    } else {
      nozzle.position.copy(REST)
      nozzle.quaternion.copy(REST_Q)
    }
    drawHose()
    flap.rotation.y = lerp(flap.rotation.y, fillAnim ? -1.8 : 0, clamp(dt * 5))
    // the trip: out to the east, round, and back in from the west; the measure rises as it parks
    let moving = false
    if (lap) {
      lap.t += dt
      const k = clamp(lap.t / LAP_T)
      const f = k * k * k * (k * (k * 6 - 15) + 10)
      let u = uPark + f
      if (u >= 1) u -= 1
      placeBus(clamp(u, 0, 1))
      const dist = f * routeLen
      for (const wg of busWheels) wg.rotation.z = -dist / 0.5
      moving = k > 0.01 && k < 0.99
      shownTank = lap.from - lap.kg * k
      shownWater = lerp(lap.wFrom, water, span(0.88, 1, k))
      if (k >= 1) {
        lastTrip = { km: lap.km, kg: lap.kg, l: lap.kg * WATER_PER_KG }
        if (lap.mine) {
          say(fill(at(S.back, lv), { km: nf(lap.km), kg: nf(lap.kg, 1), l: nf(lap.kg * WATER_PER_KG) }))
          play('discover')
          ex.discover('bus', busPanel, 6)
        }
        lap = null
        placeBus(uPark)
        shownTank = tank
        shownWater = water
      }
    }
    if (pour) {
      pour.t += dt
      const k = clamp(pour.t / POUR_T)
      shownWater = lerp(pour.from, 0, k)
      if (k >= 1) pour = null
    }
    stream.visible = !!pour
    if (!lap && !pour && !fillAnim) {
      shownTank = damp(shownTank, tank, 6, dt)
      shownWater = damp(shownWater, water, 6, dt)
    }
    measWater.scale.y = Math.max(0.001, (shownWater / MEASURE_MAX) * MEAS.h)
    // drops and vapour from the outlet while it drives near enough to see
    const outlet = busG.localToWorld(EXHAUST.clone())
    if (moving && outlet.length() < 70) {
      if (Math.random() < dt * 9) busDropList.push({ p: outlet.clone(), vy: 0 })
      if (Math.random() < dt * 6) vapourList.push({ p: outlet.clone().add(V(0, 0.1, 0)), t: 0, s: rand(0.3, 0.5) })
    }
    busDrops.begin()
    for (let i = busDropList.length - 1; i >= 0; i--) {
      const d = busDropList[i]
      d.vy -= 9.8 * dt
      d.p.y += d.vy * dt
      if (d.p.y < 0.02) busDropList.splice(i, 1)
      else busDrops.add(d.p, 0.035)
    }
    busDrops.end()
    let n = 0
    for (let i = vapourList.length - 1; i >= 0; i--) {
      const q = vapourList[i]
      q.t += dt
      if (q.t > 2.2) {
        vapourList.splice(i, 1)
        continue
      }
      const k = q.t / 2.2
      vapour.set(n++, q.p.x, q.p.y + k * 1.2, q.p.z + k * 0.4, q.s + k * 0.8, 0.9, 0.93, 0.97, 0.1 * Math.sin(Math.PI * k))
    }
    vapour.count = n
    drawPump(lv)
  })

  // ======================================================================================================
  // the train at the platform: a Coradia iLint, two cars, no wires above it
  // ======================================================================================================
  const TR = { z: DEPOT.rail.z, x0: -20, mid: 7, x1: 34, y0: 0.95, y1: 3.95, w: 2.86 }
  const trainG = new THREE.Group()
  root.add(trainG)
  const fairMat = new THREE.MeshStandardMaterial({ color: '#b9c1c8', roughness: 0.45, metalness: 0.15, transparent: true, opacity: 1 })
  const tankMat = new THREE.MeshStandardMaterial({ color: '#dfe8f0', roughness: 0.35, metalness: 0.2, emissive: '#4f8fd0', emissiveIntensity: 0 })
  const fcMat = new THREE.MeshStandardMaterial({ color: '#3fae4a', roughness: 0.45, emissive: '#2c8a3a', emissiveIntensity: 0 })
  const batMat = new THREE.MeshStandardMaterial({ color: '#d98a2c', roughness: 0.5, emissive: '#e07a1c', emissiveIntensity: 0 })
  const trainLabels = []
  const ROOF = { x0: -9, x1: -1 }
  {
    const white = new THREE.MeshStandardMaterial({ color: '#c8ced4', roughness: 0.4, metalness: 0.1 })
    const blue = new THREE.MeshStandardMaterial({ color: '#2f5f9e', roughness: 0.45 })
    const glassM = new THREE.MeshStandardMaterial({ color: '#141e2b', roughness: 0.12, metalness: 0.4, emissive: '#5a6a80', emissiveIntensity: 0.45 })
    const doorM = new THREE.MeshStandardMaterial({ color: '#244a80', roughness: 0.45 })
    const H = TR.y1 - TR.y0
    const car = (x0, x1, cab) => {
      const len = x1 - x0
      const cx = (x0 + x1) / 2
      const body = new THREE.Mesh(new RoundedBoxGeometry(len - 0.3, H, TR.w, 3, 0.2), white)
      body.position.set(cx, TR.y0 + H / 2, TR.z)
      body.castShadow = true
      trainG.add(body)
      for (const s of [-1, 1]) {
        const z = TR.z + s * (TR.w / 2 + 0.004)
        const band = new THREE.Mesh(new THREE.PlaneGeometry(len - 0.5, 0.5), blue)
        band.position.set(cx, TR.y0 + 0.32, z)
        const win = new THREE.Mesh(new THREE.PlaneGeometry(len - 1.6, 0.95), glassM)
        win.position.set(cx, TR.y0 + 1.5, z + s * 0.002)
        if (s < 0) band.rotation.y = win.rotation.y = Math.PI
        trainG.add(band, win)
        for (const f of [0.22, 0.72]) {
          const door = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.1), doorM)
          door.position.set(x0 + len * f, TR.y0 + 1.1, z + s * 0.004)
          if (s < 0) door.rotation.y = Math.PI
          const dw = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.8), glassM)
          dw.position.set(x0 + len * f, TR.y0 + 1.5, z + s * 0.006)
          if (s < 0) dw.rotation.y = Math.PI
          trainG.add(door, dw)
        }
      }
      if (cab) {
        const end = cab === 'left' ? x0 + 0.12 : x1 - 0.12
        const s = cab === 'left' ? -1 : 1
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.3), glassM)
        screen.position.set(end + s * 0.03, TR.y0 + 2.0, TR.z)
        screen.rotation.y = s * Math.PI / 2
        const nose = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.05), blue)
        nose.position.set(end + s * 0.03, TR.y0 + 0.62, TR.z)
        nose.rotation.y = s * Math.PI / 2
        trainG.add(screen, nose)
        const hl = new THREE.MeshBasicMaterial({ color: '#fff6e0' })
        for (const [dz, y] of [[-0.9, TR.y0 + 0.75], [0.9, TR.y0 + 0.75], [0, TR.y0 + 2.85]]) {
          const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.3), hl)
          lamp.position.set(end + s * 0.05, y, TR.z + dz)
          trainG.add(lamp)
        }
      }
      // bogies below
      for (const x of [x0 + 2.5, x1 - 2.5]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.42, 2.3), mats.dark)
        b.position.set(x, 0.72, TR.z)
        trainG.add(b)
      }
    }
    car(TR.x0, TR.mid, 'left')
    car(TR.mid, TR.x1, 'right')
    const gang = new THREE.Mesh(new THREE.BoxGeometry(0.5, H - 0.4, TR.w - 0.4), mats.dark)
    gang.position.set(TR.mid, TR.y0 + H / 2, TR.z)
    trainG.add(gang)
    // the roofs: a fairing over each car's tanks and fuel cell (the first car's can turn to glass)
    for (const [x0, x1, mat] of [[ROOF.x0, ROOF.x1, fairMat], [TR.mid + 8, TR.mid + 16, white]]) {
      const f = new THREE.Mesh(new RoundedBoxGeometry(x1 - x0, 0.9, 2.5, 2, 0.2), mat)
      f.position.set((x0 + x1) / 2, TR.y1 + 0.45, TR.z)
      f.renderOrder = 3
      trainG.add(f)
    }
    // under the first car's fairing: three hydrogen tanks and the fuel cell module
    for (const dz of [-0.75, 0, 0.75]) {
      const tk = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 3.4, 6, 16), tankMat)
      tk.rotation.z = Math.PI / 2
      tk.position.set(-5.9, TR.y1 + 0.42, TR.z + dz)
      trainG.add(tk)
    }
    const fc = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.6, 1.9, 2, 0.05), fcMat)
    fc.position.set(-2.4, TR.y1 + 0.34, TR.z)
    trainG.add(fc)
    // batteries under the floor
    for (const x of [-12.5, -6.5]) {
      const b = new THREE.Mesh(new RoundedBoxGeometry(2.8, 0.38, 1.9, 2, 0.04), batMat)
      b.position.set(x, TR.y0 - 0.2, TR.z)
      trainG.add(b)
    }
    const S = E.train.signs
    for (const [text, x, y, z] of [[S.tanks, -5.9, TR.y1 + 1.3, TR.z + 0.6], [S.cell, -2.3, TR.y1 + 1.3, TR.z + 0.6], [S.battery, -9.5, TR.y0 + 0.15, TR.z + TR.w / 2 + 0.25]]) {
      const l = sign(text, 0.26, { maxWidth: 4 })
      l.position.set(x, y, z)
      l.visible = false
      trainG.add(l)
      trainLabels.push(l)
    }
  }
  const trainHit = hitBox(TR.x1 - TR.x0, 3.7, TR.w)
  trainHit.position.set((TR.x0 + TR.x1) / 2, 2.4, TR.z)
  trainG.add(trainHit)
  const trainPuffs = puffCloud(light ? 14 : 28, { map: puffTex })
  root.add(trainPuffs.mesh)
  const trainPuffList = []
  let trainOpen = false
  let openK = 0
  let trainMine = false
  const trainPanel = lv => ({
    title: E.train.title,
    color,
    blocks: [{ buttons: [{ label: trainOpen ? E.train.buttons.close : E.train.buttons.open, onClick: () => trainStep() }] }, ...paras(E.train.panel, lv)],
  })
  function trainStep() {
    const lv = level()
    trainOpen = !trainOpen
    play(trainOpen ? 'select' : 'tap')
    say(at(trainOpen ? E.train.says.open : E.train.says.close, lv))
    trainMine = true
    if (trainOpen) ex.discover('train', trainPanel, 5)
    share('train')
  }
  ex.add({
    id: 'train',
    x: -1.6,
    z: -3.6,
    radius: 2.2,
    manual: true,
    label: E.train.label,
    verb: () => (trainOpen ? E.train.hints.close : E.train.hints.open),
    focus: focusOf(-5.0, 4.1, TR.z, 3.6, 6.0),
    act: () => ctx.showPanel(trainPanel),
  })
  clickable(trainG, () => trainStep(), { reach: 17 })
  updates.push((dt, t) => {
    openK = damp(openK, trainOpen ? 1 : 0, 3, dt)
    fairMat.opacity = 1 - 0.85 * openK
    fairMat.depthWrite = openK < 0.5
    const pulse = 0.75 + 0.25 * Math.sin(t * 3)
    tankMat.emissiveIntensity = 0.55 * openK * pulse
    fcMat.emissiveIntensity = 0.9 * openK * pulse
    batMat.emissiveIntensity = 0.8 * openK * pulse
    for (const l of trainLabels) l.visible = openK > 0.5
    // vapour rising from the fuel cell's vent while the roof is glass
    if (openK > 0.5 && Math.random() < dt * 3) trainPuffList.push({ p: V(-2.4 + rand(-0.6, 0.6), TR.y1 + 0.75, TR.z + rand(-0.4, 0.4)), t: 0, s: rand(0.3, 0.5) })
    let n = 0
    for (let i = trainPuffList.length - 1; i >= 0; i--) {
      const q = trainPuffList[i]
      q.t += dt
      if (q.t > 3) {
        trainPuffList.splice(i, 1)
        continue
      }
      const k = q.t / 3
      trainPuffs.set(n++, q.p.x + k * 0.6, q.p.y + k * 1.8, q.p.z, q.s + k * 0.9, 0.92, 0.94, 0.98, 0.22 * Math.sin(Math.PI * k))
    }
    trainPuffs.count = n
  })

  // ======================================================================================================
  // hydrogen in space: a glass case by the west hedge (local x along it, front +z, facing the forecourt)
  // ======================================================================================================
  const SP = { x: -12.6, z: 4.2 }
  const spaceG = new THREE.Group()
  spaceG.position.set(SP.x, 0, SP.z)
  spaceG.rotation.y = Math.PI / 2
  root.add(spaceG)
  const PL = 0.75 // the plinth's top
  const caseLight = []
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(4.5, PL, 1.4, 2, 0.04), new THREE.MeshStandardMaterial({ color: '#283044', roughness: 0.6 }))
    plinth.position.y = PL / 2
    plinth.castShadow = true
    const lid = new THREE.Mesh(new RoundedBoxGeometry(4.5, 0.14, 1.4, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#283044', roughness: 0.6 }))
    lid.position.y = 3.1
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.12), new THREE.MeshBasicMaterial({ color: '#b8ad98' }))
    strip.rotation.x = Math.PI / 2
    strip.position.set(0, 3.02, 0.45)
    spaceG.add(plinth, lid, strip)
    // a starry back wall, so the models read against night
    const starTex = tex(
      canvasTex(512, 256, (g, w, h) => {
        const grd = g.createLinearGradient(0, 0, 0, h)
        grd.addColorStop(0, '#060a1e')
        grd.addColorStop(1, '#16204a')
        g.fillStyle = grd
        g.fillRect(0, 0, w, h)
        for (let i = 0; i < 260; i++) {
          g.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`
          g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
        }
        // the Moon, small, top right
        g.fillStyle = '#d8d6cc'
        g.beginPath()
        g.arc(w * 0.86, h * 0.2, 16, 0, TAU)
        g.fill()
      }),
    )
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(4.36, 2.25), new THREE.MeshBasicMaterial({ map: starTex, toneMapped: false, color: '#9aa4c0' }))
    backWall.position.set(0, PL + 1.13, -0.66)
    spaceG.add(backWall)
    const glassC = edgeGlass({ color: '#dceeff', edge: 0.45, base: 0.03 })
    disposers.push(() => glassC.dispose())
    for (const [w, h, x, y, z, ry] of [[4.4, 2.25, 0, PL + 1.13, 0.68, 0], [1.36, 2.25, -2.2, PL + 1.13, 0, Math.PI / 2], [1.36, 2.25, 2.2, PL + 1.13, 0, Math.PI / 2]]) {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassC)
      g.position.set(x, y, z)
      g.rotation.y = ry
      g.renderOrder = 5
      spaceG.add(g)
    }
    for (const [x, z] of [[-2.2, 0.68], [2.2, 0.68], [-2.2, -0.68], [2.2, -0.68]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.25, 0.05), mats.steel)
      post.position.set(x, PL + 1.13, z)
      spaceG.add(post)
    }
    const plate = sign(E.space.signs.plate, 0.15, { maxWidth: 4 })
    plate.position.set(0, PL / 2 + 0.05, 0.71)
    spaceG.add(plate)
    if (!light) {
      const l = new THREE.PointLight('#fff1d6', 2.2, 4, 1.8)
      l.position.set(0, 2.75, 0.3)
      spaceG.add(l)
      caseLight.push(l)
    }
    // the case stands against the hedge: a solid for it
    solids.push(box(SP.x, SP.z, 1.5, 4.6))
  }
  // small labels along the plinth's front edge, under each thing
  for (const [x, key] of [[-1.45, 'shuttle'], [-0.05, 'cell'], [1.45, 'csm']]) {
    const l = sign(E.space.signs[key], 0.075, { maxWidth: 1.3, color: '#dfe6ee' })
    l.position.set(x, PL + 0.04, 0.6)
    l.rotation.x = -0.5
    spaceG.add(l)
  }

  // ---- the Space Shuttle on its pad (a model), its main engines and steam ----
  const shG = new THREE.Group()
  shG.position.set(-1.45, PL, -0.05)
  spaceG.add(shG)
  const flames = []
  const knots = []
  {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 0.78), new THREE.MeshStandardMaterial({ color: '#5d6168', roughness: 0.8 }))
    pad.position.y = 0.07
    const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.2), new THREE.MeshBasicMaterial({ color: '#0a0a0e' }))
    hole.rotation.x = -Math.PI / 2
    hole.position.set(0, 0.141, 0.2)
    shG.add(pad, hole)
    const orange = new THREE.MeshStandardMaterial({ color: '#c8682a', roughness: 0.85 })
    const srbM = new THREE.MeshStandardMaterial({ color: '#d9dde2', roughness: 0.5 })
    const et = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 1.22, 28), orange)
    et.position.y = 0.26 + 0.61
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.27, 28), orange)
    nose.position.y = 0.26 + 1.22 + 0.135
    shG.add(et, nose)
    for (const s of [-1, 1]) {
      const srb = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 18), srbM)
      srb.position.set(s * 0.19, 0.14 + 0.6, -0.02)
      const sn = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.11, 18), srbM)
      sn.position.set(s * 0.19, 0.14 + 1.2 + 0.055, -0.02)
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.06, 18), srbM)
      skirt.position.set(s * 0.19, 0.17, -0.02)
      shG.add(srb, sn, skirt)
    }
    // the orbiter on the front of the tank, nose up, its back to us
    const orb = new THREE.Group()
    orb.position.set(0, 0.36, 0.2)
    shG.add(orb)
    const white = new THREE.MeshStandardMaterial({ color: '#eceff3', roughness: 0.45 })
    const black = new THREE.MeshStandardMaterial({ color: '#1a1c22', roughness: 0.6 })
    const fus = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.9, 0.16, 2, 0.04), white)
    fus.position.y = 0.45
    const on = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.17, 18), white)
    on.position.y = 0.985
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), black)
    tip.position.y = 1.06
    const cockpit = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.05), black)
    cockpit.position.set(0, 0.88, 0.081)
    const bay = new THREE.Mesh(new THREE.PlaneGeometry(0.004, 0.5), black)
    bay.position.set(0, 0.5, 0.082)
    const wingShape = new THREE.Shape([new THREE.Vector2(-0.33, 0.03), new THREE.Vector2(-0.075, 0.55), new THREE.Vector2(0.075, 0.55), new THREE.Vector2(0.33, 0.03), new THREE.Vector2(0.075, 0), new THREE.Vector2(-0.075, 0)])
    const wings = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape, { depth: 0.02, bevelEnabled: false }), white)
    wings.position.z = -0.03
    const finShape = new THREE.Shape([new THREE.Vector2(0, 0.02), new THREE.Vector2(0, 0.3), new THREE.Vector2(0.17, 0.02)])
    const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(finShape, { depth: 0.014, bevelEnabled: false }), white)
    fin.rotation.y = -Math.PI / 2
    fin.position.set(0.007, 0.02, 0.07)
    orb.add(fus, on, tip, cockpit, bay, wings, fin)
    // its three main engines and their flames: pale blue, nearly see-through, with shock diamonds
    const bellM = new THREE.MeshStandardMaterial({ color: '#3a3f48', roughness: 0.4, metalness: 0.7 })
    const flameM = new THREE.MeshBasicMaterial({ color: '#7fc4ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const knotM = new THREE.MeshBasicMaterial({ color: '#dff2ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    for (const [x, z] of [[0, 0.03], [-0.042, -0.03], [0.042, -0.03]]) {
      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.08, 14, 1, true), bellM)
      bell.position.set(x, -0.04, z)
      const fl = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.22, 12, 1, true), flameM)
      fl.rotation.x = Math.PI
      fl.position.set(x, -0.19, z)
      orb.add(bell, fl)
      flames.push(fl)
      for (let k = 0; k < 3; k++) {
        const kn = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), knotM)
        kn.position.set(x, -0.12 - k * 0.045, z)
        orb.add(kn)
        knots.push(kn)
      }
    }
    flames.mat = flameM
    knots.mat = knotM
  }
  const shuttleHit = hitBox(0.95, 1.75, 0.8)
  shuttleHit.position.y = 0.87
  shG.add(shuttleHit)
  const steam = puffCloud(light ? 40 : 90, { map: puffTex })
  spaceG.add(steam.mesh)
  const steamSeed = Array.from({ length: light ? 40 : 90 }, () => [Math.random(), Math.random(), Math.random(), Math.random() < 0.5 ? -1 : 1])

  // ---- Apollo's fuel cell at real size, cut open on the 31 cells of its stack ----
  const afc = new THREE.Group()
  afc.position.set(-0.05, PL, 0.05)
  spaceG.add(afc)
  const stackMat = new THREE.MeshStandardMaterial({ color: '#7a6a58', roughness: 0.5, metalness: 0.5, emissive: '#ff8a3c', emissiveIntensity: 0 })
  const runLamp = new THREE.MeshStandardMaterial({ color: '#2a3a2a', emissive: '#4cff6a', emissiveIntensity: 0 })
  {
    const shell = new THREE.MeshStandardMaterial({ color: '#a8b4c0', roughness: 0.35, metalness: 0.7, side: THREE.DoubleSide })
    const cut = new THREE.MeshStandardMaterial({ color: '#3a4048', roughness: 0.6, side: THREE.DoubleSide })
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.05, 28), mats.dark)
    stand.position.y = 0.025
    const open = 0.9 // radians each side of the front left open
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.285, 0.78, 32, 1, true, open, TAU - 2 * open), shell)
    body.position.y = 0.05 + 0.39
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.285, 28, 10, 0, TAU, 0, Math.PI / 2), shell)
    dome.scale.y = 0.45
    dome.position.y = 0.05 + 0.78
    const floorD = new THREE.Mesh(new THREE.CircleGeometry(0.285, 28), cut)
    floorD.rotation.x = -Math.PI / 2
    floorD.position.y = 0.06
    afc.add(stand, body, dome, floorD)
    for (const a of [open, -open]) {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(0.285, 0.78), cut)
      wall.rotation.y = a - Math.PI / 2
      wall.position.set(Math.sin(a) * 0.1425, 0.05 + 0.39, Math.cos(a) * 0.1425)
      afc.add(wall)
    }
    const stack = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.22, 0.012, 28), stackMat, 31)
    const o = new THREE.Object3D()
    for (let i = 0; i < 31; i++) {
      o.position.set(0, 0.13 + i * 0.02, 0)
      o.updateMatrix()
      stack.setMatrixAt(i, o.matrix)
    }
    stack.raycast = () => {}
    afc.add(stack)
    // pipes round its foot, pumps behind, a lamp on top
    for (const y of [0.12, 0.24]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.018, 8, 36, TAU - 2 * open - 0.2), copper)
      ring.rotation.x = Math.PI / 2
      ring.rotation.z = Math.PI / 2 + open + 0.1
      ring.position.y = y
      afc.add(ring)
    }
    for (const a of [Math.PI * 0.8, Math.PI * 1.2]) {
      const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 14), mats.steel)
      pump.position.set(Math.sin(a) * 0.33, 0.2, Math.cos(a) * 0.33)
      afc.add(pump)
    }
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), runLamp)
    lamp.position.y = 0.05 + 0.78 + 0.14
    afc.add(lamp)
  }
  const afcHit = hitBox(0.75, 1.1, 0.75)
  afcHit.position.y = 0.55
  afc.add(afcHit)

  // ---- the Apollo command and service module (a model), its three fuel cells, the water to the bag ----
  const csm = new THREE.Group()
  csm.position.set(1.3, PL, -0.05)
  spaceG.add(csm)
  const cellsMat = new THREE.MeshStandardMaterial({ color: '#a8b4c0', roughness: 0.4, metalness: 0.6, emissive: '#ff8a3c', emissiveIntensity: 0 })
  const waterLine = tex(
    canvasTex(64, 16, (g, w, h) => {
      g.fillStyle = '#123a5a'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#8fd0ff'
      g.fillRect(0, 0, w / 3, h)
    }, { repeat: true }),
  )
  waterLine.repeat.set(8, 1)
  const lineMat = new THREE.MeshStandardMaterial({ map: waterLine, emissive: '#4fa6e0', emissiveMap: waterLine, emissiveIntensity: 0, roughness: 0.3 })
  const bagWater = new THREE.Mesh(new THREE.BoxGeometry(0.21, 1, 0.045).translate(0, 0.5, 0), waterMat)
  const bubbles = atomCloud(ballGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.4, transparent: true, opacity: 0.85 }), 16)
  const BAG = V(0.56, 0.5, 0.18) // the bag's foot, in the model's own coordinates
  {
    const silver = new THREE.MeshStandardMaterial({ color: '#c0c8d0', roughness: 0.3, metalness: 0.75, side: THREE.DoubleSide })
    const darkIn = new THREE.MeshStandardMaterial({ color: '#2a3038', roughness: 0.7, side: THREE.DoubleSide })
    const rodS = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.38, 8), mats.steel)
    rodS.position.y = 0.19
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 20), mats.dark)
    foot.position.y = 0.015
    const open = 0.75
    const sm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32, 1, true, open, TAU - 2 * open), silver)
    sm.position.y = 0.38 + 0.25
    const smIn = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.195, 0.5, 32, 1, true, open, TAU - 2 * open), darkIn)
    smIn.position.y = 0.38 + 0.25
    const capB = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), silver)
    capB.rotation.x = Math.PI / 2
    capB.position.y = 0.38
    const shelf = new THREE.Mesh(new THREE.CircleGeometry(0.19, 32), darkIn)
    shelf.rotation.x = -Math.PI / 2
    shelf.position.y = 0.38 + 0.36
    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.2, 20, 1, true), mats.steel)
    bell.position.y = 0.38 - 0.1
    const cm = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 32), silver)
    cm.position.y = 0.88 + 0.15
    const shield = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshStandardMaterial({ color: '#5a3a24', roughness: 0.8 }))
    shield.rotation.x = Math.PI / 2
    shield.position.y = 0.881
    const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), mats.steel)
    probe.position.y = 1.22
    csm.add(rodS, foot, sm, smIn, capB, shelf, bell, cm, shield, probe)
    // three fuel cells on the shelf (drawn a little big), two tanks below them
    for (const a of [-0.45, 0, 0.45]) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.11, 14), cellsMat)
      c.position.set(Math.sin(a) * 0.12, 0.38 + 0.36 + 0.055, Math.cos(a) * 0.12)
      csm.add(c)
    }
    for (const [a, col] of [[-0.3, '#e8ecef'], [0.3, '#9fc4e8']]) {
      const tk = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), new THREE.MeshStandardMaterial({ color: col, roughness: 0.4, metalness: 0.4 }))
      tk.position.set(Math.sin(a) * 0.11, 0.38 + 0.18, Math.cos(a) * 0.11)
      csm.add(tk)
    }
    // the water line: from the cells up into the command module, and out to the drinking bag
    const lineCurve = new THREE.CatmullRomCurve3([V(0, 0.8, 0.13), V(0, 0.86, 0.21), V(0.06, 0.98, 0.16), V(0.22, 1.04, 0.2), V(0.46, 1.0, 0.2), BAG.clone().add(V(0, 0.46, 0))])
    const line = new THREE.Mesh(new THREE.TubeGeometry(lineCurve, 40, 0.012, 6, false), lineMat)
    csm.add(line)
    // the drinking bag: clear plastic, its water, a mouthpiece
    const bag = new THREE.Group()
    bag.position.copy(BAG)
    const skin = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.4, 0.065, 2, 0.025), new THREE.MeshStandardMaterial({ color: '#e6f2ff', roughness: 0.15, transparent: true, opacity: 0.28, depthWrite: false }))
    skin.position.y = 0.2
    skin.renderOrder = 4
    bagWater.position.y = 0.01
    bagWater.scale.y = 0.001
    const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), mats.dark)
    mouth.position.y = 0.43
    bag.add(skin, bagWater, mouth, bubbles.mesh)
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.95, 6), mats.steel)
    hook.position.set(BAG.x + 0.16, 0.475, BAG.z)
    const hookFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), mats.dark)
    hookFoot.position.set(BAG.x + 0.16, 0.01, BAG.z)
    csm.add(bag, hook, hookFoot)
    const bl = sign(E.space.signs.bag, 0.06, { maxWidth: 0.6, color: '#bfe4ff' })
    bl.position.set(BAG.x, BAG.y + 0.55, BAG.z)
    csm.add(bl)
    csm.userData.bag = bag
  }
  const csmHit = hitBox(0.5, 1.3, 0.5)
  csmHit.position.y = 0.65
  csm.add(csmHit)
  const bagHit = hitBox(0.36, 0.55, 0.26)
  bagHit.position.copy(BAG).add(V(0, 0.22, 0))
  csm.add(bagHit)

  // ---- the space case's state (shared): firings, runs, the bag's water, the looks at its bubbles ----
  let shN = 0
  let cellN = 0
  let bubN = 0
  let bag = 0 // 0..1
  let bagShown = 0
  let shuttle = null // { t, mine }
  let run = null // { t, mine }
  let bubT = -1
  let spaceMine = false
  const spacePanel = lv => ({
    title: E.space.title,
    color,
    blocks: [{ buttons: ['shuttle', 'cell', 'bag'].map(k => ({ label: E.space.buttons[k], onClick: () => spaceStep(k) })) }, ...paras(E.space.panel, lv)],
  })
  function spaceStep(step) {
    const lv = level()
    const S = E.space.says
    if (step === 'shuttle') {
      if (shuttle) return say(at(W.busy, lv))
      shN++
      shuttle = { t: 0, mine: true }
      play('bang')
      say(at(S.shuttle, lv))
    } else if (step === 'cell') {
      if (run) return say(at(W.busy, lv))
      cellN++
      run = { t: 0, mine: true }
      bag = Math.min(1, bag + 0.34)
      play('beam')
      say(at(S.cell, lv))
    } else if (step === 'bag') {
      if (bag < 0.1) return say(at(S.bagEmpty, lv))
      bubN++
      bubT = 0
      play('pop')
      say(at(S.bag, lv))
    } else return
    spaceMine = true
    ex.discover('space', spacePanel, 8)
    share('space')
  }
  ex.add({
    id: 'space',
    x: SP.x + 3.6,
    z: SP.z,
    radius: 2.3,
    manual: true,
    label: E.space.label,
    verb: () => {
      const h = E.space.hints
      if (shN === 0) return h.shuttle
      if (bag < 0.1) return h.cell
      if (bubN === 0) return h.bag
      return h.any
    },
    focus: focusOf(SP.x + 0.05, 1.85, SP.z, 2.5, 4.7),
    act: () => ctx.showPanel(spacePanel),
  })
  clickable(shG, () => spaceStep('shuttle'), { reach: 5 })
  clickable(afc, () => spaceStep('cell'), { reach: 5 })
  clickable(csm, () => spaceStep('cell'), { reach: 5, accept: h => h.object !== bagHit })
  clickable(bagHit, () => spaceStep('bag'), { reach: 5 })
  updates.push((dt, t) => {
    // the Shuttle: engines on for five seconds, steam rolling out from under the pad
    let k = 0
    if (shuttle) {
      shuttle.t += dt
      const s = shuttle.t
      k = span(0.1, 0.5, s) * (1 - span(5.2, 5.8, s))
      if (s > SHUTTLE_T) shuttle = null
    }
    const flick = 0.8 + 0.2 * Math.sin(t * 43)
    flames.mat.opacity = 0.55 * k * flick
    knots.mat.opacity = 0.9 * k * flick
    for (const f of flames) f.scale.set(1, 0.85 + 0.25 * Math.sin(t * 37 + f.id), 1)
    let n = 0
    if (shuttle) {
      const s = shuttle.t
      const age = Math.min(s, SHUTTLE_T)
      const strength = span(0.2, 1.0, s) * (1 - span(5.5, SHUTTLE_T, s))
      for (const [a, b, c, side] of steamSeed) {
        const q = (a + age * (0.35 + 0.25 * b)) % 1
        if (q > age * 0.5 + 0.02) continue
        const x = Math.max(-2.05, -1.45 + side * (0.15 + q * (0.55 + 0.35 * c)))
        const y = PL + 0.12 + q * q * (0.9 + 0.5 * b)
        const z = -0.05 + (c - 0.5) * (0.4 + q * 0.6)
        steam.set(n++, x, y, z, 0.12 + q * 0.5, 0.92, 0.94, 0.97, 0.55 * Math.sin(Math.PI * q) * strength)
      }
    }
    steam.count = n
    // Apollo's cell running: its stack glows warm, the model's cells glow, water runs to the bag
    let r = 0
    if (run) {
      run.t += dt
      r = span(0, 0.6, run.t) * (1 - span(CELL_T - 0.8, CELL_T, run.t))
      if (run.t >= CELL_T) run = null
    }
    stackMat.emissiveIntensity = 0.65 * r * (0.85 + 0.15 * Math.sin(t * 5))
    runLamp.emissiveIntensity = 2.2 * r
    cellsMat.emissiveIntensity = 0.9 * r
    lineMat.emissiveIntensity = 1.2 * r
    waterLine.offset.x -= dt * 1.5 * r
    bagShown = run ? lerp(bagShown, bag, clamp(dt * 0.6)) : damp(bagShown, bag, 3, dt)
    bagWater.scale.y = Math.max(0.001, bagShown * 0.36)
    // the bubbles of hydrogen rising in the bag
    bubbles.begin()
    if (bubT >= 0) {
      bubT += dt
      for (let i = 0; i < 12; i++) {
        const q = (bubT * (0.25 + (i % 4) * 0.06) + i / 12) % 1
        const top = 0.01 + bagShown * 0.36
        bubbles.add(V(-0.08 + ((i * 37) % 16) / 100, 0.02 + q * top, (i % 3 - 1) * 0.01), 0.009 + (i % 3) * 0.004)
      }
      if (bubT > BUB_T) bubT = -1
    }
    bubbles.end()
  })

  // ======================================================================================================
  // words that follow the depth switch, the stage
  // ======================================================================================================
  updates.push((dt, t) => {
    const lv = level()
    if (lv !== shownLevel) {
      shownLevel = lv
      for (const [o, k] of byLevel) o.visible = depthOf(lv) === k
    }
    stage.update(t)
  })

  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())

  return {
    env: stage.env,
    solids,
    floor: stage.floor,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 9.1 },
    cameraPitchMax: 0.4,
    spawn: { x: 0, z: 6.6, yaw: 0 },
    hostSpot: { x: -2.3, z: 4.7, yaw: Math.atan2(-2.3, -1.9) },
    back: { x: 0, z: 9.7, rot: Math.PI },
    // the easel right of the arrival, off the stations' lines of sight
    stand: { x: 3.7, z: 4.5, rot: Math.atan2(-3.7, 2.1) },
    parts: {
      cell: {
        tap: step => cellStep(step), // 'h2' (the bottle) | 'air' (the intake)
        load: v => slideLoad(v), // the panel's slider (0.1 to 1)
        get state() {
          return { h2On, airOn, load, current, beaker: beaker.level, h2: h2s.length, o2: o2s.length, protons: protons.length, electrons: electrons.length, waters: waters.length }
        },
      },
      bus: {
        tap: step => busStep(step), // 'nozzle' | 'bus' | 'measure'
        trip: v => slideTrip(v), // the panel's slider (km)
        get busy() {
          return busy()
        },
        get state() {
          return { tank, water, trip, shownTank, shownWater, lastTrip, away: !!lap }
        },
      },
      train: {
        tap: () => trainStep(),
        get open() {
          return trainOpen
        },
      },
      space: {
        tap: step => spaceStep(step), // 'shuttle' | 'cell' | 'bag'
        get state() {
          return { shN, cellN, bubN, bag, busy: !!(shuttle || run) }
        },
      },
      at: {
        valve: () => world(bottle).add(V(0, 1.1, 0)),
        air: () => world(airBox).add(V(0, 0.85, 0)),
        nozzle: () => world(nozzle),
        pump: () => world(pumpG).add(V(0, 1.5, 0)),
        bus: () => busG.localToWorld(V(-2, 1.8, 1.2)),
        measure: () => world(measureG).add(V(0, MEAS.y0 + 1, 0.2)),
        train: () => V(-6, 2.6, TR.z + TR.w / 2),
        shuttle: () => world(shG).add(V(0, 0.8, 0.1)),
        apollo: () => world(afc).add(V(0, 0.5, 0)),
        csm: () => world(csm).add(V(0, 0.6, 0)),
        bag: () => world(bagHit),
      },
      rayTo,
    },
    panels: { cell: cellPanel, bus: busPanel, train: trainPanel, space: spacePanel },
    shared: {
      cell: {
        get: () => ({ h2: h2On, air: airOn, load: Math.round(load * 100) / 100, w: Math.round(beaker.level * 100) / 100 }),
        set: (s, liveSet) => {
          const h = !!s?.h2
          const a = !!s?.air
          cellMine = false
          if (liveSet) {
            if (h !== h2On) play(h ? 'fizz' : 'tap', { order: 0.5 })
            if (a !== airOn) play(a ? 'select' : 'tap')
          }
          h2On = h
          airOn = a
          load = clamp(Number(s?.load) || 0.35, 0.1, 1)
          band = bandOf(load)
          const w = clamp(Number(s?.w) || 0, 0, 0.95)
          if (!liveSet) {
            beaker.level = w
            beaker.shown = w
            prefill()
          } else beaker.level = Math.max(beaker.level, w)
        },
      },
      bus: {
        get: () => ({ tank: Math.round(tank * 10) / 10, water: Math.round(water), trip, fill: fillN, lap: lapN, km: lap ? lap.km : null, pour: pourN, age: lap ? Math.round(lap.t * 10) / 10 : null }),
        set: (s, liveSet, ago = 0) => {
          const tk = Number.isFinite(Number(s?.tank)) ? clamp(Number(s.tank), 0, TANK_MAX) : tank
          const wt = clamp(Number(s?.water) || 0, 0, MEASURE_MAX)
          const tr = clamp(Math.round((Number(s?.trip) || 50) / 25) * 25, 25, 400)
          const fN = Math.max(0, Math.round(Number(s?.fill) || 0))
          const lN = Math.max(0, Math.round(Number(s?.lap) || 0))
          const pN = Math.max(0, Math.round(Number(s?.pour) || 0))
          const km = s?.km == null ? null : clamp(Math.round(Number(s.km) / 25) * 25, 25, 400)
          busMine = false
          trip = tr
          if (liveSet && fN === fillN + 1 && !busy()) {
            fillN = fN
            startFill(false)
          } else if (liveSet && lN === lapN + 1 && km != null && !busy()) {
            lapN = lN
            startLap(km, false)
          } else if (liveSet && pN === pourN + 1 && !busy()) {
            pourN = pN
            startPour(false)
          } else {
            fillN = fN
            lapN = lN
            pourN = pN
            fillAnim = null
            pour = null
            const age = s?.age == null ? null : Number(s.age) + (Number(ago) || 0)
            if (km != null && age != null && age < LAP_T) {
              const kg = needKg(km)
              lap = { t: age, km, kg, from: tk + kg, wFrom: wt - kg * WATER_PER_KG, mine: false }
            } else {
              lap = null
              placeBus(uPark)
            }
            if (!liveSet) {
              shownTank = tk
              shownWater = wt
            }
          }
          tank = tk
          water = wt
        },
      },
      train: {
        get: () => ({ open: trainOpen }),
        set: (s, liveSet) => {
          const o = !!s?.open
          trainMine = false
          if (o !== trainOpen && liveSet) play(o ? 'select' : 'tap')
          trainOpen = o
          if (!liveSet) openK = o ? 1 : 0
        },
      },
      space: {
        get: () => ({ sh: shN, cell: cellN, bub: bubN, bag: Math.round(bag * 100) / 100 }),
        set: (s, liveSet) => {
          const sh = Math.max(0, Math.round(Number(s?.sh) || 0))
          const cn = Math.max(0, Math.round(Number(s?.cell) || 0))
          const bn = Math.max(0, Math.round(Number(s?.bub) || 0))
          spaceMine = false
          if (liveSet && sh === shN + 1 && !shuttle) {
            shuttle = { t: 0, mine: false }
            play('bang')
          }
          if (liveSet && cn === cellN + 1 && !run) {
            run = { t: 0, mine: false }
            play('beam')
          }
          if (liveSet && bn === bubN + 1) bubT = 0
          shN = sh
          cellN = cn
          bubN = bn
          bag = clamp(Number(s?.bag) || 0)
          if (!liveSet) {
            bagShown = bag
            shuttle = null
            run = null
            bubT = -1
          }
        },
      },
    },
    attach() {},
    detach() {},
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const c of [protonsC, electronsC, vapour, steam, trainPuffs]) c.dispose()
      for (const tx of textures) tx.dispose()
      for (const d of disposers) d()
      for (const g of geos) g.dispose()
      hose?.geometry.dispose()
    },
  }
}
