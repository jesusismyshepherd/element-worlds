// An element's character, drawn from its traits (traits.js, the grammar in docs/design.md):
// a smooth body (a gumdrop on two feet for solids, a teardrop that floats for gases, a melting base for
// liquids), the symbol on its belly, a hoop of its outer electrons arranged like a Lewis dot diagram
// (four sides, singles first, then pairs) with hollow rings where an electron is missing, as many
// hands as bonds it forms (a metal holds out the electrons it gives), the nucleus and inner shells
// inside a see-through body, and its family's mark. All motion is procedural (update).
// Facing +z; the root stands on the ground at the character's feet.
import * as THREE from 'three'
import { makeText } from '../engine/text.js'
import { traitsOf } from './traits.js'
import { lewisSlots, lewisAngle } from '../chem/atom.js'
import { FLAME, HELMET, SIGNATURE, metalBody, mix } from './look.js'

const ELECTRON = new THREE.Color('#a8ecff')
const PROTON = new THREE.Color('#ff5a55')
const NEUTRON = new THREE.Color('#b9c6dc')

const PROFILES = {
  walk: [[0, 0], [0.3, 0.004], [0.43, 0.04], [0.49, 0.13], [0.5, 0.27], [0.485, 0.42], [0.45, 0.57], [0.385, 0.72], [0.29, 0.85], [0.16, 0.95], [0.05, 0.995], [0, 1]],
  float: [[0, 0], [0.05, 0.03], [0.16, 0.1], [0.32, 0.22], [0.45, 0.38], [0.5, 0.53], [0.47, 0.69], [0.38, 0.83], [0.23, 0.94], [0.08, 0.995], [0, 1]],
  slide: [[0, 0], [0.47, 0], [0.56, 0.025], [0.555, 0.08], [0.48, 0.17], [0.45, 0.3], [0.43, 0.46], [0.38, 0.64], [0.29, 0.8], [0.16, 0.93], [0.05, 0.995], [0, 1]],
}

function smoothProfile(pts, n = 44) {
  const curve = new THREE.CatmullRomCurve3(pts.map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'centripetal')
  return curve.getPoints(n).map(p => new THREE.Vector2(Math.max(0, p.x), Math.min(1, Math.max(0, p.y))))
}

function radiusAt(profile, y) {
  for (let i = 1; i < profile.length; i++) {
    const a = profile[i - 1]
    const b = profile[i]
    if (y >= a.y && y <= b.y) return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y || 1))
  }
  return 0
}

/** Points packed in a ball (a golden spiral, inside out), for the nucleus. */
function packBall(n, r) {
  const out = []
  for (let i = 0; i < n; i++) {
    const k = (i + 0.5) / n
    const rad = r * Math.cbrt(k)
    const y = 1 - 2 * ((i * 0.618034) % 1)
    const a = i * 2.399963
    const s = Math.sqrt(Math.max(0, 1 - y * y))
    out.push(new THREE.Vector3(Math.cos(a) * s * rad, y * rad, Math.sin(a) * s * rad))
  }
  return out
}

function materials(tr, light) {
  const isMetal = tr.material === 'metal'
  const realMetal = isMetal && tr.body !== '#c9ced8'
  const color = new THREE.Color(isMetal ? metalBody(tr.body, tr.accent, realMetal) : tr.body)
  const accent = new THREE.Color(tr.accent)
  // a metal wears its own colour (its CPK colour, the molecule models' one) on its helmet, gloves and boots
  const paint = (k = 1) => new THREE.MeshPhysicalMaterial({ color: accent.clone().multiplyScalar(k), metalness: 0.7, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 })
  const flame = FLAME[tr.symbol]
  const dark = color.clone().multiplyScalar(0.35)
  const metal = () => new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.26, clearcoat: 0.5, clearcoatRoughness: 0.25 })
  // Seen through glass, three.js multiplies by the base colour: a light base keeps the nucleus visible,
  // and the body's colour comes from absorption inside it (attenuationColor), deeper toward the middle.
  const clear = (strength = 0.6, glow = 0) => (light
    ? new THREE.MeshStandardMaterial({ color, roughness: 0.3, transparent: true, opacity: 0.5 + (1 - strength) * 0.3, depthWrite: false, emissive: color, emissiveIntensity: glow })
    : new THREE.MeshPhysicalMaterial({
      color: color.clone().lerp(new THREE.Color('#ffffff'), 0.3), roughness: 0.08, transmission: strength, thickness: 0.3,
      ior: tr.sparkle ? 2.0 : 1.2, dispersion: tr.sparkle ? 0.6 : 0, attenuationColor: color, attenuationDistance: 1.4,
      clearcoat: 1, clearcoatRoughness: 0.05, emissive: color, emissiveIntensity: glow,
    }))
  let body
  if (tr.material === 'metal') body = metal()
  else if (tr.material === 'noble') body = clear(0.9, 0.35)
  else if (tr.locomotion === 'float') body = clear(0.9, 0.06)
  else if (tr.material === 'metalloid') body = clear(0.55, 0.02)
  else body = clear(0.75, 0.02)
  const glow = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.6, roughness: 0.4 })
  return {
    body,
    half: tr.material === 'metalloid' ? new THREE.MeshPhysicalMaterial({ color: '#c3c9d4', metalness: 1, roughness: 0.28, clearcoat: 0.4 }) : null,
    limb: tr.material === 'metal' ? metal() : tr.limbs
      ? new THREE.MeshPhysicalMaterial({ color: tr.limbs, metalness: 0.45, roughness: 0.3, clearcoat: 0.6 })
      : new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6, sheen: 0.4 }),
    foot: isMetal ? paint(0.62) : new THREE.MeshStandardMaterial({ color: dark, roughness: 0.5 }),
    iris: new THREE.MeshStandardMaterial({ color: isMetal || tr.material === 'noble' ? accent.clone().multiplyScalar(0.7) : new THREE.Color(mix(tr.body, '#10122a', 0.55)), roughness: 0.3 }),
    eyeWhite: new THREE.MeshStandardMaterial({ color: '#e6ebf5', roughness: 0.45 }),
    pupil: new THREE.MeshStandardMaterial({ color: '#141626', roughness: 0.2 }),
    shine: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    mouth: new THREE.MeshStandardMaterial({ color: '#2a1620', roughness: 0.6 }),
    badge: new THREE.MeshStandardMaterial({ color: '#0f1430', roughness: 0.35, metalness: 0.2, transparent: true, opacity: 0.88 }),
    hoop: new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.55, roughness: 0.4, transparent: true, opacity: 0.85 }),
    electron: glow(ELECTRON),
    hollow: new THREE.MeshStandardMaterial({ color: ELECTRON, emissive: ELECTRON, emissiveIntensity: 0.35, transparent: true, opacity: 0.55 }),
    mark: tr.mark === 'flame' ? glow(new THREE.Color(flame ?? '#ff7a2e')) : tr.mark === 'nubs' ? new THREE.MeshStandardMaterial({ color: flame ?? '#e8eef7', emissive: flame ?? '#e8eef7', emissiveIntensity: 0.9, roughness: 0.35 }) : tr.mark === 'gem' ? glow(accent) : isMetal ? paint() : tr.mark === 'crest' ? new THREE.MeshPhysicalMaterial({ color: accent.clone().multiplyScalar(0.8), roughness: 0.3, clearcoat: 1 }) : new THREE.MeshPhysicalMaterial({ color: tr.material === 'metal' ? color.clone().multiplyScalar(0.55) : accent, metalness: tr.material === 'metal' ? 1 : 0.2, roughness: 0.3, clearcoat: 0.6 }),
    proton: new THREE.MeshStandardMaterial({ color: PROTON, emissive: PROTON, emissiveIntensity: 1.5, roughness: 0.35 }),
    neutron: new THREE.MeshStandardMaterial({ color: NEUTRON, emissive: NEUTRON, emissiveIntensity: 0.9, roughness: 0.35 }),
    tile: new THREE.MeshStandardMaterial({ color: '#f4f6ff', emissive: '#f4f6ff', emissiveIntensity: 0.25, roughness: 0.45 }),
    tileEdge: new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.6, roughness: 0.4 }),
    hand: isMetal ? paint(0.9) : new THREE.MeshPhysicalMaterial({ color: tr.limbs ?? color.clone().lerp(new THREE.Color('#ffffff'), 0.35), metalness: tr.limbs ? 0.45 : 0, roughness: 0.35, clearcoat: 0.5 }),
    aura: tr.radioactive ? new THREE.MeshBasicMaterial({ color: '#8dff6a', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide }) : null,
  }
}

export function createAtomling(el, { light = false, badge = true, arms: withArms = true, hoop: withHoop = true } = {}) {
  const tr = traitsOf(el)
  const H = tr.height
  const W = H * tr.width
  const walker = tr.locomotion === 'walk'
  const Hb = walker ? H * 0.9 : H
  const y0 = walker ? H * 0.1 : 0
  const profile = smoothProfile(PROFILES[tr.locomotion])
  const mats = materials(tr, light)

  const root = new THREE.Group()
  root.name = `atomling-${el.symbol}`
  const rig = new THREE.Group() // hover and bob
  root.add(rig)
  const body = new THREE.Group() // squash and stretch about the feet
  rig.add(body)

  // where a point on the body's surface is, and which way the surface faces there
  const surf = (yf, angle, out = 0) => {
    const r = radiusAt(profile, yf) * W + out
    return new THREE.Vector3(Math.sin(angle) * r, y0 + yf * Hb, Math.cos(angle) * r)
  }
  const normalAt = (yf, angle) => {
    const d = 0.01
    const dr = (radiusAt(profile, Math.min(1, yf + d)) - radiusAt(profile, Math.max(0, yf - d))) * W
    const dy = 2 * d * Hb
    return new THREE.Vector3(Math.sin(angle) * dy, -dr, Math.cos(angle) * dy).normalize()
  }
  const onSurface = (obj, yf, angle, out = 0) => {
    obj.position.copy(surf(yf, angle, out))
    const n = normalAt(yf, angle)
    obj.lookAt(obj.position.clone().add(n))
    return obj
  }

  // the body (a metalloid is half metal, half its colour)
  const seg = light ? 32 : 56
  if (tr.material === 'metalloid') {
    body.add(new THREE.Mesh(new THREE.LatheGeometry(profile, seg / 2, 0, Math.PI), mats.body))
    body.add(new THREE.Mesh(new THREE.LatheGeometry(profile, seg / 2, Math.PI, Math.PI), mats.half))
    body.children.forEach(m => m.scale.set(W, Hb, W))
    body.children.forEach(m => (m.position.y = y0))
  } else {
    const shell = new THREE.Mesh(new THREE.LatheGeometry(profile, seg), mats.body)
    shell.scale.set(W, Hb, W)
    shell.position.y = y0
    body.add(shell)
  }

  // inside a see-through body: the nucleus and the inner shells
  // the nucleus sits low in the middle, a little behind the centre: the face is in front of the upper body
  const coreY = y0 + Hb * (tr.locomotion === 'float' ? 0.47 : 0.42)
  const inside = new THREE.Group()
  inside.position.set(0, coreY, -W * 0.1)
  body.add(inside)
  const electrons = [] // { mesh index, ring, angle, speed }
  let nucleusMesh = null
  if (tr.translucent) {
    const { protons, neutrons } = tr.nucleus
    const total = Math.min(protons + neutrons, 70)
    const nucleonR = H * 0.042
    const nr = nucleonR * Math.cbrt(total) * 1.05
    const ball = packBall(total, Math.max(0, nr - nucleonR))
    // protons and neutrons mixed through the ball in their real proportion
    const share = protons / (protons + neutrons)
    const isProton = ball.map((_, i) => Math.floor((i + 1) * share) > Math.floor(i * share))
    const nGeo = new THREE.SphereGeometry(nucleonR, 12, 9)
    const m = new THREE.Matrix4()
    nucleusMesh = new THREE.Group()
    for (const [want, mat] of [[true, mats.proton], [false, mats.neutron]]) {
      const pts = ball.filter((_, i) => isProton[i] === want)
      if (!pts.length) continue
      const im = new THREE.InstancedMesh(nGeo, mat, pts.length)
      pts.forEach((p, i) => im.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)))
      nucleusMesh.add(im)
    }
    inside.add(nucleusMesh)
  }

  // the hoop of outer electrons
  const hoop = new THREE.Group()
  const noble = tr.full && tr.material === 'noble'
  const hoopR = noble ? W * 0.36 : W * 0.66
  if (noble) {
    hoop.position.set(0, y0 + Hb + H * 0.14, 0)
    hoop.rotation.x = 0.18
  } else {
    hoop.position.set(0, y0 + Hb * 0.36, 0)
    hoop.rotation.x = 0.32
  }
  hoop.add(new THREE.Mesh(new THREE.TorusGeometry(hoopR, H * 0.011, 8, 96).rotateX(Math.PI / 2), mats.hoop))
  if (withHoop) rig.add(hoop)
  const ring = new THREE.Group() // turns round the hoop, carrying electrons and places
  hoop.add(ring)
  const eR = H * 0.036
  const eGeo = new THREE.SphereGeometry(eR, 14, 10)
  const slotGeo = new THREE.TorusGeometry(eR * 0.95, eR * 0.22, 6, 18)
  let slots = []
  if (tr.electronsInHands) slots = []
  else if (tr.places) slots = lewisSlots(tr.valence, tr.places)
  else slots = new Array(Math.max(tr.valence, 0)).fill(true)
  const n = slots.length
  slots.forEach((filled, i) => {
    // pairs sit close together on each of the four sides
    const a = tr.places ? lewisAngle(i, tr.places) : (i / n) * Math.PI * 2
    const p = new THREE.Vector3(Math.sin(a) * hoopR, 0, Math.cos(a) * hoopR)
    const mesh = filled ? new THREE.Mesh(eGeo, mats.electron) : new THREE.Mesh(slotGeo, mats.hollow)
    mesh.position.copy(p)
    if (!filled) mesh.lookAt(0, 0, 0)
    ring.add(mesh)
  })

  // inner shells as small orbits round the nucleus (inside see-through bodies)
  const orbits = []
  if (tr.translucent && tr.inner.length) {
    tr.inner.forEach((count, k) => {
      const g = new THREE.Group()
      const r = H * (0.11 + k * 0.045)
      g.rotation.set(0.9 + k * 0.7, k * 1.3, 0.3 * k)
      const path = new THREE.Mesh(new THREE.TorusGeometry(r, H * 0.0035, 4, 64), mats.hollow)
      g.add(path)
      const shown = Math.min(count, 12)
      for (let i = 0; i < shown; i++) {
        const e = new THREE.Mesh(eGeo, mats.electron)
        e.scale.setScalar(0.55)
        const a = (i / shown) * Math.PI * 2
        e.position.set(Math.cos(a) * r, Math.sin(a) * r, 0)
        g.add(e)
      }
      inside.add(g)
      orbits.push({ g, speed: 1.6 / (k + 1) })
    })
  }

  // eyes, mouth, the symbol
  const face = new THREE.Group()
  body.add(face)
  const eyeY = tr.locomotion === 'float' ? 0.7 : 0.68
  const eyeA = 0.3
  const eS = H * 0.098
  const eyes = []
  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    onSurface(eye, eyeY, side * eyeA, -eS * 0.12)
    if (tr.eyes === 'serene') {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(eS * 0.62, eS * 0.13, 6, 20, Math.PI), mats.pupil)
      arc.position.z = eS * 0.18
      eye.add(arc)
    } else {
      const white = new THREE.Mesh(new THREE.SphereGeometry(eS, 20, 14), mats.eyeWhite)
      white.scale.set(0.85, tr.eyes === 'steady' ? 0.95 : 1.12, 0.32)
      const iris = new THREE.Mesh(new THREE.SphereGeometry(eS * (tr.eyes === 'eager' ? 0.66 : 0.6), 18, 12), mats.iris)
      iris.scale.set(0.9, 1.05, 0.26)
      iris.position.set(-side * eS * 0.06, -eS * 0.06, eS * 0.16)
      eye.add(iris)
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(eS * (tr.eyes === 'eager' ? 0.4 : 0.34), 14, 10), mats.pupil)
      pupil.scale.set(0.9, 1.05, 0.3)
      pupil.position.set(-side * eS * 0.06, -eS * 0.06, eS * 0.22)
      const shine = new THREE.Mesh(new THREE.SphereGeometry(eS * 0.17, 8, 6), mats.shine)
      shine.position.set(eS * 0.22, eS * 0.28, eS * 0.3)
      eye.add(white, pupil, shine)
      if (tr.eyes === 'sharp' || tr.eyes === 'steady') {
        const lid = new THREE.Mesh(new THREE.BoxGeometry(eS * 2.1, eS * 0.36, eS * 0.3), tr.eyes === 'sharp' ? mats.pupil : mats.foot)
        lid.position.set(0, eS * 0.98, eS * 0.15)
        lid.rotation.z = tr.eyes === 'sharp' ? side * 0.32 : 0
        eye.add(lid)
      }
    }
    face.add(eye)
    eyes.push(eye)
  }
  // a small smile: a curved tube under the eyes
  const smile = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-H * 0.05, H * 0.012, 0), new THREE.Vector3(0, -H * 0.03, 0), new THREE.Vector3(H * 0.05, H * 0.012, 0),
  )
  const mouth = new THREE.Mesh(new THREE.TubeGeometry(smile, 12, H * 0.009, 6), mats.mouth)
  onSurface(mouth, eyeY - 0.13, 0, H * 0.004)
  face.add(mouth)
  if (badge) {
    // its tile from the periodic table, worn on the belly: the symbol and the atomic number
    const ts = H * 0.17
    const tile = new THREE.Group()
    onSurface(tile, tr.locomotion === 'float' ? 0.32 : 0.22, 0, ts * 0.08)
    const edge = new THREE.Mesh(new THREE.BoxGeometry(ts * 1.08, ts * 1.08, ts * 0.06), mats.tileEdge)
    const card = new THREE.Mesh(new THREE.BoxGeometry(ts, ts, ts * 0.08), mats.tile)
    card.position.z = ts * 0.012
    const sym = makeText(el.symbol, { size: el.symbol.length > 1 ? ts * 0.5 : ts * 0.62, color: '#151a3d' })
    sym.position.set(0, -ts * 0.06, ts * 0.06)
    const num = makeText(String(el.z), { size: ts * 0.2, color: '#151a3d', anchorX: 'left', anchorY: 'top' })
    num.position.set(-ts * 0.42, ts * 0.44, ts * 0.06)
    tile.add(edge, card, sym, num)
    face.add(tile)
  }

  // hands: as many as bonds; a metal holds out the electrons it gives
  const arms = []
  const shoulder = (yf, side, spread, lift = 0) => ({ yf, side, spread, lift })
  const layout = {
    1: [shoulder(0.5, -1, 1.0)],
    2: [shoulder(0.5, -1, 1.0), shoulder(0.5, 1, 1.0)],
    3: [shoulder(0.5, -1, 1.0), shoulder(0.5, 1, 1.0), { top: true }],
    4: [shoulder(0.6, -1, 2.0), shoulder(0.6, 1, 2.0), shoulder(0.3, -1, 1.05), shoulder(0.3, 1, 1.05)],
  }[withArms ? tr.hands : 0] ?? []
  const armLen = H * 0.3
  const armR = H * 0.05
  const handR = H * 0.085
  const limbGeo = new THREE.CapsuleGeometry(armR, armLen, 4, 10)
  const handGeo = new THREE.SphereGeometry(handR, 16, 12).scale(1, 0.92, 0.8)
  layout.forEach((s, i) => {
    const pivot = new THREE.Group()
    const swing = new THREE.Group()
    pivot.add(swing)
    const limb = new THREE.Mesh(limbGeo, mats.limb)
    limb.position.y = -armLen / 2 - armR * 0.3
    const hand = new THREE.Mesh(handGeo, mats.hand)
    hand.position.y = -armLen - armR
    swing.add(limb, hand)
    if (tr.giving) {
      const gift = new THREE.Mesh(eGeo, mats.electron)
      gift.scale.setScalar(1.25)
      gift.position.set(0, -armLen - armR - handR * 0.9, handR * 0.5)
      swing.add(gift)
    }
    if (s.top) {
      // the third hand rises from the back of the head, clear of hats, crowns and caps
      pivot.position.copy(surf(0.84, Math.PI, -armR * 0.4))
      pivot.rotation.set(-1.15, 0, Math.PI)
    } else {
      const a = s.side * Math.PI / 2
      pivot.position.copy(surf(s.yf, a, -armR * 0.2))
    }
    body.add(pivot)
    // a hand at the side hangs out and down, a little forward; carbon's upper pair reaches up
    // (rotating about z by +a swings a hanging arm toward +x: a hand on the +x side turns by +spread)
    if (!s.top) {
      pivot.rotation.z = s.side * s.spread
      pivot.rotation.x = -0.18
    }
    arms.push({ pivot, swing, base: pivot.rotation.z, side: s.side ?? 0, top: !!s.top, lower: s.yf < 0.4 })
  })

  // feet (walkers), the melting base (liquids); floaters have none
  const feet = []
  if (walker) {
    const fGeo = new THREE.SphereGeometry(H * 0.085, 18, 12)
    for (const side of [-1, 1]) {
      const f = new THREE.Mesh(fGeo, mats.foot)
      f.scale.set(1, 0.62, 1.35)
      f.position.set(side * W * 0.2, H * 0.055, H * 0.02)
      rig.add(f)
      feet.push({ mesh: f, side })
    }
  }

  // the family's mark
  const mark = new THREE.Group()
  mark.position.y = y0 + Hb
  body.add(mark)
  if (tr.mark === 'flame') {
    const fl = new THREE.Mesh(new THREE.LatheGeometry(smoothProfile([[0, 0], [0.5, 0.18], [0.55, 0.38], [0.35, 0.7], [0, 1]], 16), 20), mats.mark)
    fl.scale.set(H * 0.16, H * 0.3, H * 0.16)
    fl.position.y = -H * 0.03
    mark.add(fl)
  } else if (tr.mark === 'nubs') {
    for (const side of [-1, 1]) {
      const nub = new THREE.Mesh(new THREE.SphereGeometry(H * 0.06, 14, 10), mats.mark)
      nub.position.set(side * W * 0.16, -H * 0.03, 0)
      mark.add(nub)
    }
  } else if (tr.mark === 'helmet' && SIGNATURE[el.symbol] !== 'crown' && SIGNATURE[el.symbol] !== 'bulb') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.42), mats.mark)
    cap.scale.set(W * 0.42, Hb * 0.26, W * 0.42)
    cap.position.y = -Hb * 0.235
    mark.add(cap)
    helmetStyle(mark, HELMET[el.group] ?? 'round', { H, W, Hb, mat: mats.mark })
  } else if (tr.mark === 'cap') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), mats.mark)
    cap.scale.set(W * 0.3, Hb * 0.16, W * 0.3)
    cap.position.y = -Hb * 0.1
    const pom = new THREE.Mesh(new THREE.SphereGeometry(H * 0.045, 12, 10), mats.mark)
    pom.position.y = Hb * 0.06
    mark.add(cap, pom)
  } else if (tr.mark === 'antenna') {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(H * 0.008, H * 0.008, H * 0.16, 6), mats.foot)
    stick.position.y = H * 0.06
    const ball = new THREE.Mesh(new THREE.SphereGeometry(H * 0.04, 12, 10), mats.hoop)
    ball.position.y = H * 0.15
    mark.add(stick, ball)
  } else if (tr.mark === 'crest') {
    for (let i = 0; i < 3; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(H * 0.045, H * (0.16 - i * 0.03), 10), mats.mark)
      spike.position.set(0, H * 0.04 - i * H * 0.03, -i * H * 0.075)
      spike.rotation.x = -0.35 - i * 0.25
      mark.add(spike)
    }
  } else if (tr.mark === 'gem') {
    // a tiara band round the head with a gem in front, glowing in its colour
    const bandY = 0.86
    const band = new THREE.Mesh(new THREE.TorusGeometry(radiusAt(profile, bandY) * W * 1.02, H * 0.018, 8, 48), mats.foot)
    band.rotation.x = Math.PI / 2
    band.position.y = y0 + bandY * Hb - (y0 + Hb)
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(H * 0.075), mats.mark)
    onSurface(gem, bandY, 0, H * 0.035)
    gem.position.y -= y0 + Hb
    gem.scale.set(1, 1.35, 0.65)
    mark.add(band, gem)
  } else if (tr.mark === 'curl') {
    const curl = new THREE.Mesh(new THREE.TorusGeometry(H * 0.05, H * 0.014, 8, 24, Math.PI * 1.6), mats.limb)
    curl.position.y = H * 0.04
    curl.rotation.y = Math.PI / 2
    mark.add(curl)
  }

  const extras = signature(SIGNATURE[el.symbol], { body, H, W, Hb, y0, surf })

  let aura = null
  if (mats.aura) {
    aura = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), mats.aura)
    aura.scale.set(W * 0.75, Hb * 0.7, W * 0.75)
    aura.position.y = y0 + Hb * 0.5
    body.add(aura)
  }

  // the shadow under it (the ground is not always lit to cast one)
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(W * 0.55, 32),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  root.add(shadow)

  root.traverse(o => {
    if (o.isMesh) o.castShadow = true
  })
  shadow.castShadow = false

  // ---- motion ----
  const st = { phase: 0, blink: 0, nextBlink: 2 + Math.random() * 3, wave: 0, hop: 0, poof: 0, flicker: 0 }
  const update = (dt, time, motion = {}) => {
    const speed = motion.speed ?? 0
    const moving = speed > 0.05
    const stride = walker ? H * 0.55 : H * 0.8
    st.phase += (speed / stride) * dt * Math.PI * 2
    const s = Math.sin(st.phase)
    const c = Math.cos(st.phase)
    const k = Math.min(1, speed / Math.max(0.3, tr.speeds.walk))

    // breathing, bob, hover
    const breathe = Math.sin(time * 2.1) * 0.018
    let lift = 0
    if (tr.locomotion === 'float') lift = tr.hover + Math.sin(time * 1.6) * H * 0.05
    else if (walker) lift = Math.abs(s) * H * 0.05 * k
    rig.position.y = lift
    body.scale.set(1 - breathe * 0.5, 1 + breathe, 1 - breathe * 0.5)
    if (tr.locomotion === 'slide') body.scale.set(1 + Math.sin(time * 3) * 0.03 + k * 0.04, 1 - Math.sin(time * 3) * 0.03 - k * 0.05, 1 + Math.cos(time * 3) * 0.03)
    body.rotation.z = walker ? s * 0.05 * k : Math.sin(time * 1.3) * 0.03
    body.rotation.x = tr.locomotion === 'float' ? 0.12 * k : 0.04 * k

    // feet step in turn
    for (const f of feet) {
      const ph = st.phase + (f.side > 0 ? Math.PI : 0)
      f.mesh.position.z = H * 0.02 + Math.sin(ph) * H * 0.12 * k
      f.mesh.position.y = H * 0.055 + Math.max(0, Math.cos(ph)) * H * 0.07 * k - lift
    }

    // arms swing opposite to the feet; at rest they sway a little
    for (const a of arms) {
      if (a.top) {
        a.swing.rotation.x = Math.sin(time * 2.4) * 0.15
        continue
      }
      a.swing.rotation.x = moving ? -a.side * s * 0.55 * k * (a.lower ? 0.6 : 1) : Math.sin(time * 1.7 + a.side) * 0.06
      a.pivot.rotation.z = a.base + (moving ? 0 : Math.sin(time * 1.1 + a.side) * 0.04)
    }

    // a wave with the first hand
    if (st.wave > 0 && arms.length) {
      st.wave = Math.max(0, st.wave - dt)
      const a = arms[0]
      const up = Math.min(1, (1.6 - st.wave) * 4, st.wave * 4)
      a.pivot.rotation.z = a.top ? a.base : a.base + a.side * (2.6 - a.base * a.side) * up
      a.swing.rotation.x = a.top ? Math.sin(time * 12) * 0.5 * up : 0
      a.swing.rotation.z = a.top ? 0 : Math.sin(time * 12) * 0.45 * up
    } else if (arms[0]) arms[0].swing.rotation.z = 0

    // blinking
    st.nextBlink -= dt
    if (st.nextBlink <= 0) {
      st.blink = 0.14
      st.nextBlink = 2.5 + Math.random() * 3.5
    }
    st.blink = Math.max(0, st.blink - dt)
    const lid = st.blink > 0 ? 0.12 : 1
    if (tr.eyes !== 'serene') for (const e of eyes) e.scale.y = lid

    // the electrons go round
    ring.rotation.y = time * (noble ? 0.6 : 0.9)
    for (const o of orbits) o.g.rotation.z = time * o.speed
    if (nucleusMesh) inside.rotation.y = time * 0.4

    // a hop: squash, then stretch
    if (st.hop > 0) {
      st.hop = Math.max(0, st.hop - dt)
      const t = 1 - st.hop / 0.5
      body.scale.y *= 1 + Math.sin(t * Math.PI) * 0.12
    }
    // appearing: a pop
    if (st.poof > 0) {
      st.poof = Math.max(0, st.poof - dt)
      const t = 1 - st.poof / 0.45
      root.scale.setScalar(Math.min(1, 0.2 + t * 1.1 - Math.max(0, t - 0.8) * 0.5))
    } else root.scale.setScalar(1)

    for (const x of extras) x(dt, time)
    if (mark.children.length && tr.mark === 'flame') mark.scale.set(1, 1 + Math.sin(time * 13) * 0.08 + Math.sin(time * 7.3) * 0.05, 1)
    if (aura) mats.aura.opacity = 0.08 + (Math.sin(time * 3.2) * 0.5 + 0.5) * 0.1
    if (tr.superheavy) {
      st.flicker -= dt
      if (st.flicker < -2 - Math.random() * 3) st.flicker = 0.12
      body.visible = !(st.flicker > 0 && Math.sin(time * 90) > 0)
    }
  }

  return {
    root,
    mats,
    traits: tr,
    body: {
      height: H, radius: Math.max(0.22, W * 0.45), eye: H * 0.82,
      walk: tr.speeds.walk, run: tr.speeds.run, jump: tr.jump, hover: tr.hover,
    },
    update,
    wave: () => {
      st.wave = 1.6
    },
    hop: () => {
      st.hop = 0.5
    },
    poof: () => {
      st.poof = 0.45
    },
  }
}

// ---- the second layer of looks (look.js) ----

/** A transition metal's helmet ornament, the same for its whole column. */
function helmetStyle(mark, style, { H, W, Hb, mat }) {
  const add = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.rotation.set(rx, ry, rz)
    mark.add(m)
    return m
  }
  const top = Hb * 0.02
  if (style === 'crest') add(new THREE.BoxGeometry(H * 0.03, H * 0.1, W * 0.42), 0, top + H * 0.03, -W * 0.02)
  else if (style === 'horns') for (const s of [-1, 1]) add(new THREE.ConeGeometry(H * 0.035, H * 0.15, 12), s * W * 0.2, top + H * 0.02, 0, 0, 0, -s * 0.6)
  else if (style === 'visor') add(new THREE.TorusGeometry(W * 0.4, H * 0.022, 8, 40, Math.PI), 0, -Hb * 0.06, 0, -0.22, 0, 0)
  else if (style === 'spike') add(new THREE.ConeGeometry(H * 0.04, H * 0.2, 14), 0, top + H * 0.08, 0)
  else if (style === 'plume') for (const a of [-0.5, 0, 0.5]) add(new THREE.BoxGeometry(H * 0.022, H * 0.15, H * 0.07), Math.sin(a) * H * 0.06, top + H * 0.05, -W * 0.05, 0, 0, a)
  else if (style === 'bolts') for (const s of [-1, 1]) add(new THREE.CylinderGeometry(H * 0.03, H * 0.03, H * 0.07, 12), s * W * 0.4, -Hb * 0.11, 0, 0, 0, Math.PI / 2)
  else if (style === 'band') add(new THREE.TorusGeometry(W * 0.36, H * 0.02, 8, 40), 0, -Hb * 0.08, 0, Math.PI / 2, 0, 0)
  else if (style === 'coin') add(new THREE.CylinderGeometry(H * 0.06, H * 0.06, H * 0.018, 24), 0, -Hb * 0.06, W * 0.4, Math.PI / 2 - 0.25, 0, 0)
  else if (style === 'drop') {
    const d = add(new THREE.SphereGeometry(H * 0.05, 16, 12), 0, top + H * 0.05, 0)
    d.scale.set(1, 1.5, 1)
  }
}

/** Objects from an element's story (look.js SIGNATURE). Returns update functions for the ones that move. */
function signature(kind, { body, H, W, Hb, y0, surf }) {
  if (!kind) return []
  const updates = []
  const m = (geo, color, opts = {}) => new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, clearcoat: 0.6, ...opts }))
  const glowMat = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.8 })
  const topY = y0 + Hb
  if (kind === 'balloon') {
    // helium: a party balloon on a string, bobbing above
    const g = new THREE.Group()
    const ball = m(new THREE.SphereGeometry(H * 0.2, 24, 18), '#ff4f7a', { clearcoat: 1, roughness: 0.15 })
    ball.scale.y = 1.15
    ball.position.set(W * 0.5, topY + H * 0.75, -W * 0.1)
    const knot = m(new THREE.ConeGeometry(H * 0.03, H * 0.05, 10), '#ff4f7a')
    knot.position.set(W * 0.5, topY + H * 0.52, -W * 0.1)
    knot.rotation.x = Math.PI
    const pts = [new THREE.Vector3(W * 0.5, topY + H * 0.5, -W * 0.1), new THREE.Vector3(W * 0.42, topY + H * 0.2, -W * 0.05), new THREE.Vector3(W * 0.3, y0 + Hb * 0.6, 0)]
    const string = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, H * 0.004, 4), new THREE.MeshBasicMaterial({ color: '#f2f2f2' }))
    g.add(ball, knot, string)
    body.add(g)
    updates.push((dt, t) => (g.rotation.z = Math.sin(t * 1.3) * 0.06))
  } else if (kind === 'crown') {
    // gold: a crown
    const g = new THREE.Group()
    const gold = { metalness: 1, roughness: 0.2 }
    g.add(m(new THREE.CylinderGeometry(W * 0.3, W * 0.32, H * 0.1, 32, 1, true), '#ffcc33', { ...gold, side: THREE.DoubleSide }))
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const spike = m(new THREE.ConeGeometry(H * 0.035, H * 0.1, 10), '#ffcc33', gold)
      spike.position.set(Math.sin(a) * W * 0.3, H * 0.09, Math.cos(a) * W * 0.3)
      const jewel = new THREE.Mesh(new THREE.SphereGeometry(H * 0.02, 10, 8), glowMat(i % 2 ? '#ff3355' : '#33aaff'))
      jewel.position.set(Math.sin(a) * W * 0.31, 0, Math.cos(a) * W * 0.31)
      g.add(spike, jewel)
    }
    g.position.y = topY - H * 0.04
    body.add(g)
  } else if (kind === 'bulb') {
    // tungsten: a light bulb with a glowing filament (its best-known job)
    const g = new THREE.Group()
    const glass = new THREE.Mesh(new THREE.SphereGeometry(H * 0.1, 20, 16), new THREE.MeshPhysicalMaterial({ color: '#fff6dc', transparent: true, opacity: 0.35, roughness: 0.05, emissive: '#ffd27a', emissiveIntensity: 0.4 }))
    glass.position.y = H * 0.16
    const base = m(new THREE.CylinderGeometry(H * 0.045, H * 0.05, H * 0.07, 16), '#b9bcc4', { metalness: 1, roughness: 0.3 })
    base.position.y = H * 0.05
    const fil = new THREE.Mesh(new THREE.TorusGeometry(H * 0.03, H * 0.006, 6, 16, Math.PI * 1.4), glowMat('#ffb347'))
    fil.position.y = H * 0.16
    g.add(base, glass, fil)
    g.position.y = topY - H * 0.02
    body.add(g)
    updates.push((dt, t) => (fil.material.emissiveIntensity = 1.6 + Math.sin(t * 7) * 0.2))
  } else if (kind === 'coil') {
    // copper: a coil of copper wire round its middle (wires carry electricity)
    const pts = []
    for (let i = 0; i <= 120; i++) {
      const k = i / 120
      const a = k * Math.PI * 2 * 5
      const yf = 0.32 + k * 0.16
      const p0 = surf(yf, 0)
      const r = Math.hypot(p0.x, p0.z) + H * 0.02
      pts.push(new THREE.Vector3(Math.sin(a) * r, y0 + yf * Hb, Math.cos(a) * r))
    }
    body.add(m(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, H * 0.012, 6), '#e0864f', { metalness: 1, roughness: 0.25 }))
  } else if (kind === 'magnet') {
    // iron: a horseshoe magnet on its back (iron is magnetic)
    const g = new THREE.Group()
    g.add(m(new THREE.TorusGeometry(H * 0.09, H * 0.035, 10, 24, Math.PI), '#e23b3b'))
    for (const s of [-1, 1]) {
      const leg = m(new THREE.BoxGeometry(H * 0.07, H * 0.1, H * 0.07), '#e23b3b')
      leg.position.set(s * H * 0.09, -H * 0.05, 0)
      const tip = m(new THREE.BoxGeometry(H * 0.072, H * 0.045, H * 0.072), '#d8dde6', { metalness: 1, roughness: 0.3 })
      tip.position.set(s * H * 0.09, -H * 0.12, 0)
      g.add(leg, tip)
    }
    g.position.copy(surf(0.5, Math.PI, H * 0.05))
    g.rotation.y = Math.PI
    body.add(g)
  } else if (kind === 'battery') {
    // lithium: a battery on its back (lithium-ion batteries)
    const g = new THREE.Group()
    g.add(m(new THREE.CylinderGeometry(H * 0.07, H * 0.07, H * 0.24, 20), '#2d6cdf', { metalness: 0.4 }))
    const band = m(new THREE.CylinderGeometry(H * 0.071, H * 0.071, H * 0.06, 20), '#c9ced8', { metalness: 1, roughness: 0.3 })
    band.position.y = H * 0.09
    const tip = m(new THREE.CylinderGeometry(H * 0.025, H * 0.025, H * 0.025, 12), '#c9ced8', { metalness: 1 })
    tip.position.y = H * 0.135
    g.add(band, tip)
    g.position.copy(surf(0.5, Math.PI, H * 0.07))
    g.rotation.z = 0.15
    body.add(g)
  } else if (kind === 'banana') {
    // potassium: a banana (bananas are rich in it)
    const pts = [-0.6, -0.3, 0, 0.3, 0.6].map(k => new THREE.Vector3(Math.sin(k) * H * 0.18, Math.cos(k) * H * 0.18 - H * 0.18, 0))
    const banana = m(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, H * 0.035, 10), '#ffd93b')
    banana.position.copy(surf(0.42, Math.PI / 2, H * 0.06))
    banana.rotation.set(0.3, 0, -0.5)
    body.add(banana)
  } else if (kind === 'leaf') {
    // magnesium: a leaf on its head (a magnesium atom sits at the heart of every chlorophyll)
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(H * 0.08, H * 0.08, 0, H * 0.2)
    shape.quadraticCurveTo(-H * 0.08, H * 0.08, 0, 0)
    const leaf = new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), new THREE.MeshStandardMaterial({ color: '#4cc94c', side: THREE.DoubleSide, roughness: 0.5 }))
    leaf.position.set(0, topY - H * 0.01, 0)
    leaf.rotation.set(-0.3, 0.4, 0.25)
    body.add(leaf)
    updates.push((dt, t) => (leaf.rotation.z = 0.25 + Math.sin(t * 2) * 0.08))
  } else if (kind === 'salt') {
    // sodium: a cube of salt, sodium chloride
    const cube = m(new THREE.BoxGeometry(H * 0.14, H * 0.14, H * 0.14), '#f4f6fb', { roughness: 0.2 })
    cube.position.copy(surf(0.42, Math.PI / 2, H * 0.09))
    cube.rotation.set(0.4, 0.5, 0.2)
    body.add(cube)
  } else if (kind === 'chip') {
    // silicon: a computer chip on its back
    const g = new THREE.Group()
    g.add(m(new THREE.BoxGeometry(H * 0.2, H * 0.2, H * 0.03), '#1f2430'))
    for (let i = -2; i <= 2; i++) {
      for (const s of [-1, 1]) {
        const pin = m(new THREE.BoxGeometry(H * 0.015, H * 0.05, H * 0.01), '#d9b75a', { metalness: 1 })
        pin.position.set(i * H * 0.035, s * H * 0.12, 0)
        const pin2 = pin.clone()
        pin2.rotation.z = Math.PI / 2
        pin2.position.set(s * H * 0.12, i * H * 0.035, 0)
        g.add(pin, pin2)
      }
    }
    g.position.copy(surf(0.5, Math.PI, H * 0.02))
    g.rotation.y = Math.PI
    body.add(g)
  } else if (kind === 'bone') {
    // calcium: a bone (our bones and teeth are made with it)
    const g = new THREE.Group()
    g.add(m(new THREE.CylinderGeometry(H * 0.025, H * 0.025, H * 0.22, 12), '#f3ead6'))
    for (const s of [-1, 1]) {
      for (const t of [-1, 1]) {
        const knob = m(new THREE.SphereGeometry(H * 0.035, 12, 10), '#f3ead6')
        knob.position.set(t * H * 0.025, s * H * 0.11, 0)
        g.add(knob)
      }
    }
    g.position.copy(surf(0.45, Math.PI / 2, H * 0.08))
    g.rotation.z = 0.6
    body.add(g)
  } else if (kind === 'match') {
    // phosphorus: a burning match (match heads are made with it), at its side
    const g = new THREE.Group()
    g.add(m(new THREE.CylinderGeometry(H * 0.012, H * 0.012, H * 0.25, 8), '#e9c99a'))
    const head = m(new THREE.SphereGeometry(H * 0.025, 10, 8), '#c23b22')
    head.position.y = H * 0.13
    head.scale.y = 1.4
    const fire = new THREE.Mesh(new THREE.SphereGeometry(H * 0.035, 10, 8), glowMat('#ffb030'))
    fire.position.y = H * 0.19
    fire.scale.y = 1.8
    g.add(head, fire)
    g.position.copy(surf(0.55, Math.PI / 2.4, H * 0.08))
    g.rotation.z = -0.4
    body.add(g)
    updates.push((dt, t) => fire.scale.set(1 + Math.sin(t * 17) * 0.1, 1.8 + Math.sin(t * 11) * 0.25, 1))
  } else if (kind === 'drop') {
    // hydrogen: a drop of water floating beside it (water is two hydrogens and an oxygen)
    const drop = m(new THREE.SphereGeometry(H * 0.08, 18, 14), '#59b4ff', { roughness: 0.05 })
    drop.scale.set(1, 1.35, 1)
    drop.position.set(W * 0.75, y0 + Hb * 0.85, 0)
    body.add(drop)
    updates.push((dt, t) => (drop.position.y = y0 + Hb * 0.85 + Math.sin(t * 2.2) * H * 0.04))
  }
  return updates
}
