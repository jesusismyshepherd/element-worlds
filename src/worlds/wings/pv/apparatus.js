// The Periodic Videos rooms' apparatus, each with what it does when used: built for sodium first (docs/pv/Na.md)
// and meant to be used again (the courtyard bowl takes any alkali metal; the screen and the card any element).
// Every part is a group whose y = 0 is the surface it stands on and whose +x faces the visitor. The parts
// that change give their state (state / setState) for everyone in a room to share (src/net/shared.js).
import * as THREE from 'three'
import { canvasTex, clamp, lerp, smooth, random } from '../noble/kit.js'
import { edgeGlass } from '../../common/props.js'
import { particles, flame } from './fx.js'

const ease = v => v * v * (3 - 2 * v)

// a tap's target, larger than a small thing itself: never drawn, but hit by a tap (common/taps.js)
const HIT = new THREE.MeshBasicMaterial({ visible: false })
export const hitMesh = geo => new THREE.Mesh(geo, HIT)

/** A metal that shines when freshly cut and goes dull in the air (tarnish 0..1 sets it). */
function freshMetal() {
  const mat = new THREE.MeshStandardMaterial({ color: '#eef1f5', metalness: 1, roughness: 0.12 })
  const shine = new THREE.Color('#eef1f5')
  const dull = new THREE.Color('#e4dfd2')
  return {
    mat,
    tarnish(k) {
      mat.color.copy(shine).lerp(dull, k)
      mat.metalness = 1 - k
      mat.roughness = lerp(0.12, 0.88, k)
    },
  }
}

// ---- the oil tin: a rod of sodium under oil, lifted onto paper and cut ----

/** lift() takes a rod out of the tin onto the paper (a new one once the last is too short to cut), cut()
 *  slices its end; `can`, `rod` and `knife` are the things to tap. */
export function oilTin() {
  const group = new THREE.Group()
  const tinMat = new THREE.MeshStandardMaterial({ color: '#6c6a40', metalness: 0.55, roughness: 0.5, side: THREE.DoubleSide })
  const tin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.26, 28, 1, true), tinMat)
  tin.position.y = 0.13
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.11, 28), tinMat)
  bottom.rotation.x = -Math.PI / 2
  bottom.position.y = 0.004
  const labelTex = canvasTex(256, 64, (g, w, h) => {
    g.fillStyle = '#e8e2c8'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#d9822b'
    g.fillRect(14, 10, 44, 44)
    g.fillStyle = '#3a3a2a'
    g.fillRect(72, 18, 150, 7)
    g.fillRect(72, 34, 110, 6)
  })
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.1112, 0.1112, 0.09, 28, 1, true, -0.6, 2.2), new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.8 }))
  label.position.y = 0.11
  const oil = new THREE.Mesh(new THREE.CircleGeometry(0.106, 28), new THREE.MeshStandardMaterial({ color: '#b98a2e', transparent: true, opacity: 0.6, roughness: 0.05 }))
  oil.rotation.x = -Math.PI / 2
  oil.position.y = 0.215
  const can = new THREE.Group()
  can.add(tin, bottom, label, oil)
  group.add(can)

  // the rod: crusted white outside; its cut end shines
  const crust = new THREE.MeshStandardMaterial({ color: '#dcd7c8', roughness: 0.95 })
  const ROD = 0.36
  const rod = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.047, ROD, 20), crust)
  body.position.y = ROD / 2
  const endMetal = freshMetal()
  endMetal.tarnish(1)
  const end = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), endMetal.mat)
  end.rotation.x = Math.PI / 2
  end.position.y = 0.0005
  rod.add(body, end)
  const inTin = { p: new THREE.Vector3(0, 0.03, 0), r: new THREE.Euler(0, 0, 0) }
  // on the paper: lying along +z, its cut end toward -z
  const onPaper = { p: new THREE.Vector3(0.05, 0.047, 0.3), r: new THREE.Euler(-Math.PI / 2, 0, 0) }
  rod.position.copy(inTin.p)
  group.add(rod)

  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.62), new THREE.MeshStandardMaterial({ color: '#cfccc1', roughness: 0.95 }))
  paper.rotation.x = -Math.PI / 2
  paper.position.set(0.08, 0.002, 0.52)
  group.add(paper)

  // the knife, resting on the paper
  const knife = new THREE.Group()
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.003), new THREE.MeshStandardMaterial({ color: '#cfd4da', metalness: 1, roughness: 0.25 }))
  blade.position.x = 0.1
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.028, 0.02), new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.6 }))
  handle.position.x = -0.06
  // a thin blade lying flat is hard to tap: a larger target round it
  const knifeHit = hitMesh(new THREE.BoxGeometry(0.36, 0.07, 0.05))
  knifeHit.position.x = 0.03
  knife.add(blade, handle, knifeHit)
  const knifeRest = { p: new THREE.Vector3(0.18, 0.012, 0.74), r: new THREE.Euler(Math.PI / 2, 0, 0.3) }
  knife.position.copy(knifeRest.p)
  knife.rotation.copy(knifeRest.r)
  group.add(knife)

  const slices = []
  const fresh = [{ m: endMetal, age: 99 }]
  // in: the rod in the tin; lift: coming out; out: on the paper; cut: the knife at work
  let phase = 'in'
  let t = 0
  let cut = 0
  let rods = 0 // rods lifted out of the tin, for the others in a room
  // the tin holds two kilos: a rod gives this many slices, then the next one comes out
  const CUTS = 15
  const SLICE = 0.016
  const lengthOf = n => ROD - SLICE * n
  const short = () => slices.length >= CUTS

  // a new rod, still in the tin
  function newRod() {
    body.scale.y = 1
    body.position.y = ROD / 2
    for (const s of slices.splice(0)) {
      group.remove(s.mesh)
      s.mesh.geometry.dispose()
    }
    fresh.length = 1
    phase = 'in'
  }

  // a slice off the rod's end: the rod one slice shorter, its end new; `done`, already lying aside and dull
  function slice(done = false) {
    const m = freshMetal()
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.014, 20), [crustSide(), m.mat, m.mat])
    s.position.set(0.05, 0.047, onPaper.p.z + 0.007)
    s.rotation.x = Math.PI / 2
    group.add(s)
    const one = { mesh: s, t: 0, n: slices.length }
    slices.push(one)
    fresh.push({ m, age: done ? 99 : 0 })
    const length = lengthOf(slices.length)
    body.scale.y = length / ROD
    body.position.y = length / 2
    rod.position.z = onPaper.p.z + SLICE * slices.length
    fresh[0].age = done ? 99 : 0
    if (done) {
      one.t = 1
      s.rotation.x = 0
      s.position.set(0.16, 0.007, 0.36 + (one.n % 4) * 0.1)
    }
  }

  /** Take a rod out of the tin onto the paper: the first, or a new one once the last is too short. */
  function lift() {
    if (phase === 'lift' || phase === 'cut') return false
    if (phase === 'out') {
      if (!short()) return false
      newRod()
    }
    phase = 'lift'
    t = 0
    rods++
    return true
  }

  /** Cut a slice off the rod lying on the paper. */
  function cutSlice() {
    if (phase !== 'out' || short()) return false
    phase = 'cut'
    t = 0
    cut = 0
    return true
  }

  function update(dt) {
    t += dt
    if (phase === 'lift') {
      const k = ease(clamp(t / 1.1))
      rod.position.lerpVectors(inTin.p, onPaper.p, k)
      rod.position.y += Math.sin(k * Math.PI) * 0.25
      rod.rotation.x = lerp(inTin.r.x, onPaper.r.x, k)
      if (t >= 1.1) {
        phase = 'out'
        t = 0
      }
    } else if (phase === 'cut') {
      // the knife comes over the rod's end, goes down, a slice falls off, the knife goes back
      const over = new THREE.Vector3(0.05, 0.14, onPaper.p.z + 0.024)
      const down = over.clone().setY(0.045)
      if (t < 0.35) {
        const k = ease(t / 0.35)
        knife.position.lerpVectors(knifeRest.p, over, k)
        knife.rotation.set(lerp(knifeRest.r.x, 0, k), lerp(knifeRest.r.y, Math.PI / 2, k), lerp(knifeRest.r.z, 0, k))
      } else if (t < 0.6) knife.position.lerpVectors(over, down, ease((t - 0.35) / 0.25))
      else if (!cut) {
        cut = 1
        slice()
      } else if (t < 1.0) knife.position.lerpVectors(down, over, ease((t - 0.6) / 0.4))
      else if (t < 1.35) {
        const k = ease((t - 1.0) / 0.35)
        knife.position.lerpVectors(over, knifeRest.p, k)
        knife.rotation.set(lerp(0, knifeRest.r.x, k), lerp(Math.PI / 2, knifeRest.r.y, k), lerp(0, knifeRest.r.z, k))
      } else phase = 'out'
    }
    // a slice tips over and slides aside, showing its fresh face up
    for (const s of slices) {
      if (s.t >= 1) continue
      s.t = Math.min(1, s.t + dt * 1.6)
      const k = ease(s.t)
      s.mesh.rotation.x = lerp(Math.PI / 2, 0, k)
      s.mesh.position.x = lerp(0.05, 0.16, k)
      s.mesh.position.z = lerp(onPaper.p.z + 0.007, 0.36 + (s.n % 4) * 0.1, k)
      s.mesh.position.y = lerp(0.047, 0.007, k)
    }
    // the shine holds a moment, then the air dulls it
    for (const f of fresh) {
      f.age += dt
      f.m.tarnish(smooth(1.4, 7, f.age))
    }
  }
  let crustMat = null
  const crustSide = () => (crustMat ??= crust)
  // the slices on the rod now, a cut under way counted as done (it ends there by itself on every screen)
  const cutsNow = () => slices.length + (phase === 'cut' && !cut ? 1 : 0)

  const api = {
    group,
    can,
    rod,
    knife,
    lift,
    cut: cutSlice,
    update,
    get busy() {
      return phase === 'lift' || phase === 'cut'
    },
    /** The rod is still in the tin (none lifted out yet). */
    get inTin() {
      return phase === 'in'
    },
    /** The rod on the paper has given all its slices: the next comes out of the tin. */
    get short() {
      return phase === 'out' && short()
    },
    get cuts() {
      return slices.length
    },
    state() {
      return { rods, n: cutsNow() }
    },
    /** Someone else lifted a rod or cut a slice: it plays here too (live; returns true when it did); a
     *  newcomer sees the rod and its slices as they are. An older state, { n } (cuts in all, the first
     *  lifting the rod), is read as the rod it left. */
    setState(s = {}, live = false) {
      let n = Math.max(0, Math.floor(Number(s.n) || 0))
      let r = Math.floor(Number(s.rods))
      if (!Number.isFinite(r)) {
        r = n ? Math.ceil(n / CUTS) : 0
        n = n ? n - CUTS * (r - 1) : 0
      }
      r = Math.max(0, r)
      n = r ? Math.min(n, CUTS) : 0
      if (r === rods && n === cutsNow()) return false
      if (live && !api.busy) {
        if (r === rods + 1 && n === 0 && lift()) return true
        if (r === rods && n === slices.length + 1 && cutSlice()) return true
      }
      // as it stands, at once
      rods = r
      newRod()
      knife.position.copy(knifeRest.p)
      knife.rotation.copy(knifeRest.r)
      rod.position.copy(inTin.p)
      rod.rotation.copy(inTin.r)
      if (!r) return false
      rod.position.copy(onPaper.p)
      rod.rotation.copy(onPaper.r)
      for (let i = 0; i < n; i++) slice(true)
      phase = 'out'
      return false
    },
  }
  return api
}

// ---- the courtyard bowl: an alkali metal dropped into water ----

const LUMPS = {
  small: { r: 0.011, ignite: null, life: 5.5, speed: 0.11, bubbles: 35 },
  medium: { r: 0.018, ignite: 4.2, life: 10, speed: 0.15, bubbles: 70 },
  large: { r: 0.028, ignite: 2.4, bang: 5.2, life: 6, speed: 0.22, bubbles: 120 },
}

/** A stoneware bowl of water on a surface, three lumps on a tile beside it (`lumps`, to tap) and a bottle
 *  of indicator (`bottle`). drop(size) carries that lump over and drops it in (false while one runs);
 *  indicator() lets a drop fall from the dropper and turns the water pink once it holds an alkali;
 *  on.{ splash, flame, bang, done, pop, pink } are called back. */
export function courtyardBowl({ light = false, flameColor = '#ffb21e', on = {} } = {}) {
  const group = new THREE.Group()
  const R = 0.17
  const profile = [[0.0, 0.0], [R - 0.015, 0.0], [R, 0.012], [R + 0.004, 0.1], [R - 0.004, 0.112], [R - 0.016, 0.106], [R - 0.02, 0.016], [0.0, 0.016]]
    .map(([x, y]) => new THREE.Vector2(x, y))
  const glaze = new THREE.MeshStandardMaterial({ color: '#c9c0a9', roughness: 0.6 })
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(profile, 40), glaze)
  bowl.castShadow = true
  group.add(bowl)
  const WATER_Y = 0.088
  const waterMat = new THREE.MeshStandardMaterial({ color: '#b9c9d0', transparent: true, opacity: 0.82, roughness: 0.06, metalness: 0.15 })
  const water = new THREE.Mesh(new THREE.CircleGeometry(R - 0.018, 40), waterMat)
  water.rotation.x = -Math.PI / 2
  water.position.y = WATER_Y
  group.add(water)
  const clear = new THREE.Color('#b9c9d0')
  const pink = new THREE.Color('#ff6fb0')
  let pinkness = 0
  let pinkTo = 0

  // long tongs on the surface beside it
  const steel = new THREE.MeshStandardMaterial({ color: '#b8bec6', metalness: 1, roughness: 0.3 })
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.008, 0.008), steel)
    arm.position.set(0.02, 0.006, 0.3 + s * 0.008)
    arm.rotation.y = s * 0.03
    group.add(arm)
  }

  // the three lumps waiting on a white tile, small to large: tap one to drop it in (a fresh one of the
  // same size is back on the tile once the last has reacted)
  const tile = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.006, 0.27), new THREE.MeshStandardMaterial({ color: '#f1efe8', roughness: 0.5 }))
  tile.position.set(0.08, 0.003, -0.37)
  group.add(tile)
  const dullMetal = new THREE.MeshStandardMaterial({ color: '#d6d8d2', metalness: 0.55, roughness: 0.42, flatShading: true })
  const TRAY = { small: -0.28, medium: -0.35, large: -0.445 }
  const lumps = {}
  for (const [size, z] of Object.entries(TRAY)) {
    const r = LUMPS[size].r
    const geo = new THREE.IcosahedronGeometry(1, 1)
    const p = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      v.multiplyScalar(1 + 0.12 * Math.sin(v.x * 9 + v.y * 5 + r * 300) * Math.cos(v.z * 7))
      p.setXYZ(i, v.x * 1.15, v.y * 0.8, v.z)
    }
    geo.computeVertexNormals()
    const m = new THREE.Mesh(geo, dullMetal)
    m.scale.setScalar(r)
    const hit = hitMesh(new THREE.SphereGeometry(Math.max(0.03, r * 1.5), 10, 8))
    const g = new THREE.Group()
    g.add(m, hit)
    g.position.set(0.08, 0.006 + r * 0.75, z)
    group.add(g)
    lumps[size] = g
  }

  // the indicator (phenolphthalein) in a small brown dropper bottle, on the tongs' far side
  const bottle = new THREE.Group()
  const brown = new THREE.MeshStandardMaterial({ color: '#6b3b16', roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.88 })
  const bBody = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.062, 18), brown)
  bBody.position.y = 0.031
  const bLabel = new THREE.Mesh(new THREE.CylinderGeometry(0.0245, 0.0245, 0.026, 18, 1, true), new THREE.MeshStandardMaterial({ color: '#f4f1e6', roughness: 0.8 }))
  bLabel.position.y = 0.03
  const bNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.012, 12), brown)
  bNeck.position.y = 0.067
  // the dropper: a glass tube and a red rubber bulb; it rises, goes over the bowl and lets one drop fall
  const dropper = new THREE.Group()
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0025, 0.07, 8), new THREE.MeshStandardMaterial({ color: '#e8f0f4', transparent: true, opacity: 0.6, roughness: 0.1 }))
  tube.position.y = -0.035
  const bulbTop = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 10), new THREE.MeshStandardMaterial({ color: '#7a1f1f', roughness: 0.55 }))
  bulbTop.scale.y = 1.35
  bulbTop.position.y = 0.012
  dropper.add(tube, bulbTop)
  const DROPPER_HOME = new THREE.Vector3(0, 0.08, 0)
  dropper.position.copy(DROPPER_HOME)
  const bottleHit = hitMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.13, 10))
  bottleHit.position.y = 0.06
  bottle.add(bBody, bLabel, bNeck, dropper, bottleHit)
  bottle.position.set(0.04, 0, 0.47)
  group.add(bottle)
  const theDrop = new THREE.Mesh(new THREE.SphereGeometry(0.004, 8, 6), new THREE.MeshStandardMaterial({ color: '#f4f8ff', transparent: true, opacity: 0.8, roughness: 0.05 }))
  theDrop.visible = false
  group.add(theDrop)
  // the dropper's way: over the bowl's middle (in the bottle's frame), the drop's fall below it
  const OVER = new THREE.Vector3(-0.02, 0.32, -0.45)
  let ind = null

  const lumpMetal = new THREE.MeshStandardMaterial({ color: '#e8ecf0', metalness: 1, roughness: 0.15, emissive: '#ff7a1a', emissiveIntensity: 0 })
  const lump = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), lumpMetal)
  lump.visible = false
  group.add(lump)
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), new THREE.MeshStandardMaterial({ color: '#ffb35a', emissive: '#ff6a10', emissiveIntensity: 3 }))
  bead.visible = false
  group.add(bead)

  const n = light ? 0.4 : 1
  const bubbles = particles({ max: Math.round(220 * n), color: '#ffffff', soft: 0.2, gravity: -0.15, drag: 2 })
  const sparks = particles({ max: Math.round(260 * n), color: '#ffa53a', boost: 3, additive: true, soft: 0.3, gravity: 4.5, drag: 0.6 })
  const smoke = particles({ max: Math.round(90 * n), color: '#dcdcdc', soft: 0.5, gravity: -0.35, drag: 1.4, grow: 2.6, fadeIn: 0.12 })
  group.add(bubbles.points, sparks.points, smoke.points)
  const fire = flame({ color: flameColor, height: 0.16, light })
  group.add(fire.group)
  const flash = light ? null : new THREE.PointLight('#ffb35a', 0, 6, 2)
  if (flash) {
    flash.position.y = 0.3
    group.add(flash)
  }

  const rnd = random(11)
  let run = null
  let used = false
  let jolt = 0
  let drops = 0 // lumps dropped, and the last one's size, for the others in a room
  let last = 'medium'

  // carried from the tile up over the bowl (CARRY s), then let go from the tongs' height
  const CARRY = 0.6
  const ABOVE = new THREE.Vector3(0.02, 0.42, 0.04)
  const from = new THREE.Vector3()
  function drop(size) {
    if (run || ind) return false
    const L = LUMPS[size] ?? LUMPS.medium
    drops++
    last = LUMPS[size] ? size : 'medium'
    run = { L, size, t: -0.45 - CARRY, x: 0, z: 0, a: rnd() * 6.28, lit: false, banged: false, popped: false }
    from.copy(lumps[last].position)
    lump.visible = true
    lump.scale.setScalar(L.r)
    lump.position.copy(from)
    lumpMetal.emissiveIntensity = 0
    lumpMetal.color.set('#e8ecf0')
    return true
  }

  // the dropper goes over the bowl and lets one drop fall; the water turns pink where it lands
  function dropIndicator() {
    ind = { t: 0, landed: false }
    theDrop.visible = false
  }

  function end() {
    lump.visible = false
    fire.set(0)
    const was = run
    run = null
    used = true
    on.done?.(was?.size)
  }

  function update(dt, t, camera, viewHeight) {
    if (run) {
      const r = run
      r.t += dt
      const L = r.L
      if (r.t < -0.45) {
        // carried from the tile up over the bowl
        const k = ease(clamp((r.t + 0.45 + CARRY) / CARRY))
        lump.position.lerpVectors(from, ABOVE, k)
        lump.position.y += Math.sin(k * Math.PI) * 0.08
      } else if (r.t < 0) {
        // falling from the tongs
        const k = ease(clamp(1 + r.t / 0.45))
        lump.position.set(lerp(0.02, 0, k), lerp(0.42, WATER_Y + L.r * 0.4, k), lerp(0.04, 0, k))
        if (r.t + dt >= 0) on.splash?.()
      } else {
        // skating on its own fizz, turning this way and that, kept inside the rim
        r.a += (rnd() - 0.5) * dt * 9
        const v = L.speed * (0.7 + 0.6 * rnd())
        r.x += Math.cos(r.a) * v * dt
        r.z += Math.sin(r.a) * v * dt
        const d = Math.hypot(r.x, r.z)
        const lim = R - 0.035
        if (d > lim) {
          r.x *= lim / d
          r.z *= lim / d
          r.a += Math.PI * (0.6 + 0.4 * rnd())
        }
        const left = L.bang ? 1 : clamp(1 - r.t / L.life)
        const s = L.r * Math.cbrt(Math.max(0.05, left))
        lump.position.set(r.x, WATER_Y + s * 0.45 + Math.sin(t * 40) * 0.001, r.z)
        lump.scale.setScalar(s)
        // melted into a bright bead within a second
        lumpMetal.roughness = lerp(0.15, 0.05, clamp(r.t))
        const rate = L.bubbles * (L.bang ? 1 + r.t / L.bang : left) * n
        for (let i = 0; i < rate * dt; i++) {
          const q = rnd() * 6.28
          bubbles.emit(r.x + Math.cos(q) * s * 1.2, WATER_Y + 0.002, r.z + Math.sin(q) * s * 1.2, Math.cos(q) * 0.05, 0.03 + rnd() * 0.05, Math.sin(q) * 0.05, 0.3 + rnd() * 0.4, 0.006 + rnd() * 0.008)
        }
        if (r.t > 1.5 && rnd() < dt * 3 * n) smoke.emit(r.x, WATER_Y + 0.02, r.z, 0, 0.12, 0, 1.8, 0.035)
        if (L.ignite && !r.lit && r.t >= L.ignite) {
          r.lit = true
          on.flame?.(r.size)
        }
        if (r.lit) {
          fire.group.position.set(r.x, WATER_Y + s * 0.6, r.z)
          fire.set(r.size === 'large' ? 1.25 : clamp((L.life - r.t) / 1.2) * 1)
          lumpMetal.emissiveIntensity = 1.6
          lumpMetal.color.set('#ffd9a8')
          if (rnd() < dt * (r.size === 'large' ? 14 : 3) * n) {
            const q = rnd() * 6.28
            sparks.emit(r.x, WATER_Y + 0.02, r.z, Math.cos(q) * 0.6, 0.9 + rnd() * 0.6, Math.sin(q) * 0.6, 0.35 + rnd() * 0.3, 0.012)
          }
        }
        if (L.bang && !r.banged && r.t >= L.bang) {
          // the bang: a spray of sparks, a puff of smoke, a flash, a bead of molten metal thrown out
          r.banged = true
          for (let i = 0; i < 170 * n; i++) {
            const q = rnd() * 6.28
            const up = 0.25 + rnd() * 0.75
            const sp = 1.6 + rnd() * 2.6
            sparks.emit(r.x, WATER_Y + 0.02, r.z, Math.cos(q) * sp * (1 - up * 0.5), sp * up, Math.sin(q) * sp * (1 - up * 0.5), 0.45 + rnd() * 0.5, 0.012 + rnd() * 0.008)
          }
          for (let i = 0; i < 26 * n; i++) {
            const q = rnd() * 6.28
            smoke.emit(r.x + Math.cos(q) * 0.05, WATER_Y + 0.05, r.z + Math.sin(q) * 0.05, Math.cos(q) * 0.35, 0.25 + rnd() * 0.45, Math.sin(q) * 0.35, 2.2 + rnd() * 1.5, 0.08 + rnd() * 0.1)
          }
          if (flash) flash.intensity = 10
          jolt = 1
          bead.visible = true
          bead.userData = { x: r.x, y: WATER_Y + 0.05, z: r.z, vx: 0.9, vy: 1.6, vz: -0.25, cool: 0 }
          on.bang?.()
          end()
        } else if (!L.bang && r.t >= L.life) {
          if (r.lit) {
            for (let i = 0; i < 24 * n; i++) {
              const q = rnd() * 6.28
              sparks.emit(r.x, WATER_Y + 0.02, r.z, Math.cos(q) * 0.7, 0.6 + rnd() * 0.8, Math.sin(q) * 0.7, 0.3 + rnd() * 0.3, 0.01)
            }
            on.pop?.()
          }
          end()
        }
      }
    }
    // the bead thrown out lands on the surface and cools from orange to grey
    if (bead.visible) {
      const b = bead.userData
      if (b.y > 0.012) {
        b.vy -= 9.8 * dt
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.z += b.vz * dt
        if (b.y <= 0.012) b.y = 0.012
      } else {
        b.cool += dt
        bead.material.emissiveIntensity = 3 * clamp(1 - b.cool / 4)
        if (b.cool > 12) bead.visible = false
      }
      bead.position.set(b.x, b.y, b.z)
    }
    // the lump being dropped is missing from the tile until it has reacted
    for (const [size, g] of Object.entries(lumps)) g.visible = !(run && size === (LUMPS[run.size] ? run.size : 'medium'))
    // the indicator: the dropper rises and goes over the bowl (0.7 s), a drop falls (0.35 s), it goes back
    if (ind) {
      ind.t += dt
      const go = ease(clamp(ind.t / 0.7))
      const back = ease(clamp((ind.t - 1.25) / 0.6))
      dropper.position.lerpVectors(DROPPER_HOME, OVER, go * (1 - back))
      dropper.position.y += Math.sin(go * Math.PI) * 0.05 * (1 - back)
      if (ind.t >= 0.7 && !ind.landed) {
        // from the dropper's tip down to the water
        const k = clamp((ind.t - 0.7) / 0.35)
        theDrop.visible = true
        theDrop.position.copy(OVER).add(bottle.position)
        theDrop.position.y = lerp(OVER.y - 0.075, WATER_Y, k * k)
        if (k >= 1) {
          ind.landed = true
          theDrop.visible = false
          pinkTo = 1
          on.pink?.()
        }
      }
      if (ind.t >= 1.85) {
        dropper.position.copy(DROPPER_HOME)
        ind = null
      }
    }
    if (flash) flash.intensity *= Math.exp(-dt * 9)
    jolt *= Math.exp(-dt * 8)
    bowl.position.y = jolt * 0.01 * Math.sin(t * 60)
    pinkness += (pinkTo - pinkness) * Math.min(1, dt * 1.2)
    waterMat.color.copy(clear).lerp(pink, pinkness)
    fire.update(dt, t)
    bubbles.update(dt, camera, viewHeight)
    sparks.update(dt, camera, viewHeight)
    smoke.update(dt, camera, viewHeight)
  }

  return {
    group,
    lumps,
    bottle,
    drop,
    /** A drop of indicator: false before any lump has reacted, once it is pink, or while something runs. */
    indicator() {
      if (!used || pinkTo || ind || run) return false
      dropIndicator()
      return true
    },
    update,
    get busy() {
      return !!run || !!ind
    },
    /** A lump is on the water, fizzing. */
    get fizzing() {
      return !!run && run.t > 0
    },
    get used() {
      return used
    },
    get pink() {
      return pinkTo > 0 || !!ind
    },
    state() {
      return { n: drops, size: last, pink: pinkTo > 0 || !!ind }
    },
    /** Someone else dropped a lump (live: it falls here too; returns true when it did) or added the
     *  indicator (live: the drop falls here too); a newcomer finds the water as it is. */
    setState({ n = 0, size, pink: p = false } = {}, live = false) {
      n = Math.max(0, Math.floor(Number(n) || 0))
      const played = live && n === drops + 1 && !!LUMPS[size] && drop(size)
      drops = n
      if (LUMPS[size]) last = size
      if (n > 0 && !played) used = true
      if (p && !pinkTo && !ind) {
        if (live && !run) dropIndicator()
        else {
          pinkTo = 1
          if (!live) pinkness = 1
        }
      }
      return played
    },
  }
}

// ---- the salt window: a plate of sodium chloride that cracks at right angles ----

// the cracks on the plate, in its own frame (metres from its centre): straight runs meeting at 90°
const CRACKS = [
  [[-0.08, 0.022], [0.05, 0.022]],
  [[-0.028, 0.022], [-0.028, 0.08]],
  [[-0.028, -0.08], [-0.028, 0.022]],
  [[-0.028, -0.034], [0.08, -0.034]],
  [[0.036, -0.08], [0.036, -0.034]],
  [[0.05, 0.022], [0.05, 0.08]],
  [[-0.08, -0.052], [-0.028, -0.052]],
]

export function saltWindow({ light = false } = {}) {
  const group = new THREE.Group()
  // the cell: a short glass tube on two small supports, the salt plate at its near end (facing +x)
  const glass = edgeGlass({ color: '#dbe6ff', edge: 0.5, base: 0.03 })
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.16, 28, 1, true), glass)
  tube.rotation.z = Math.PI / 2
  tube.position.set(-0.08, 0.1, 0)
  const dark = new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.6 })
  // the cell, the thing to tap (the lattice rising above it is not)
  const cell = new THREE.Group()
  group.add(cell)
  for (const x of [-0.13, -0.03]) {
    const sup = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.045, 0.08), dark)
    sup.position.set(x, 0.022, 0)
    cell.add(sup)
  }
  const plateMat = new THREE.MeshStandardMaterial({ color: '#eef6ff', transparent: true, opacity: 0.38, roughness: 0.04, metalness: 0.1 })
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.16, 0.16), plateMat)
  plate.position.set(0.006, 0.1, 0)
  cell.add(tube, plate)

  const crackMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#cfe3ff', emissiveIntensity: 0.4, roughness: 0.5 })
  const cracks = CRACKS.map(([[u0, v0], [u1, v1]]) => {
    const len = Math.hypot(u1 - u0, v1 - v0)
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.0135, 0.0016, 1), crackMat)
    // u runs along z, v along y on the plate's face
    const horiz = Math.abs(v1 - v0) < 1e-6
    m.rotation.x = horiz ? 0 : Math.PI / 2
    m.userData = { u0, v0, u1, v1, len }
    m.visible = false
    plate.add(m)
    return m
  })

  // the lattice inside: Na+ and Cl- on a cube, rising out of the window once it has cracked
  const N = 4
  const a = 0.03
  const na = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0042, 12, 8), new THREE.MeshStandardMaterial({ color: '#ab5cf2', roughness: 0.35, emissive: '#3a1660', emissiveIntensity: 0.4 }), 32)
  const cl = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0075, 14, 10), new THREE.MeshStandardMaterial({ color: '#31d843', roughness: 0.35, emissive: '#0b4a12', emissiveIntensity: 0.4 }), 32)
  const m4 = new THREE.Matrix4()
  let ia = 0
  let ib = 0
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
    m4.makeTranslation((i - 1.5) * a, (j - 1.5) * a, (k - 1.5) * a)
    if ((i + j + k) % 2) na.setMatrixAt(ia++, m4)
    else cl.setMatrixAt(ib++, m4)
  }
  // the cube's grid between neighbouring ions, so the stacking reads as cubes from any side
  const edges = []
  const c = i => (i - 1.5) * a
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N - 1; k++) {
    edges.push(c(i), c(j), c(k), c(i), c(j), c(k + 1))
    edges.push(c(i), c(k), c(j), c(i), c(k + 1), c(j))
    edges.push(c(k), c(i), c(j), c(k + 1), c(i), c(j))
  }
  const grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(edges, 3)), new THREE.LineBasicMaterial({ color: '#c8d2ea', transparent: true, opacity: 0.55 }))
  const lattice = new THREE.Group()
  lattice.add(na, cl, grid)
  lattice.position.set(0.05, 0.32, 0)
  lattice.visible = false
  group.add(lattice)

  let t = 0
  let state = 'whole'
  let api = null
  function update(dt, time) {
    t += dt
    if (state !== 'whole') {
      cracks.forEach((m, i) => {
        const k = ease(clamp((t - i * 0.12) / 0.35))
        const { u0, v0, u1, v1, len } = m.userData
        m.visible = k > 0
        m.scale.z = Math.max(1e-3, len * k)
        const u = lerp(u0, u1, k / 2)
        const v = lerp(v0, v1, k / 2)
        m.position.set(0.0001, v, u)
      })
      const g = ease(clamp((t - 1.1) / 0.9))
      lattice.visible = g > 0
      lattice.scale.setScalar(Math.max(1e-3, g * 1.6))
      lattice.rotation.y = 0.6 + time * 0.25
      lattice.rotation.x = 0.28
    }
  }
  api = {
    group,
    cell,
    /** Crack the window, or put in a new one once it has cracked. */
    act() {
      if (state === 'whole') {
        state = 'cracked'
        t = 0
        return 'crack'
      }
      // a new window
      state = 'whole'
      for (const m of cracks) m.visible = false
      lattice.visible = false
      return 'new'
    },
    update,
    get cracked() {
      return state !== 'whole'
    },
    state() {
      return { cracked: state !== 'whole' }
    },
    /** Someone else cracked it (live: it cracks here, returns true) or put in a new one; a newcomer sees
     *  the cracks and the lattice at once. */
    setState({ cracked = false } = {}, live = false) {
      if (!!cracked === (state !== 'whole')) return false
      const r = api.act()
      if (r === 'crack' && !live) t = 99
      return live && r === 'crack'
    },
  }
  return api
}

// ---- the salt lamp: a lump of rock salt with a bulb inside ----

export function saltLamp({ light = false } = {}) {
  const group = new THREE.Group()
  const geo = new THREE.IcosahedronGeometry(0.1, 3)
  const p = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const bump = 1 + 0.14 * Math.sin(v.x * 41 + v.y * 13) * Math.cos(v.z * 37 - v.y * 7) + 0.06 * Math.sin(v.y * 90)
    v.multiplyScalar(bump)
    v.y = v.y * 1.4 + 0.14
    p.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({ color: '#f0a774', roughness: 0.55, emissive: '#ff7a2e', emissiveIntensity: 0, flatShading: true })
  const rock = new THREE.Mesh(geo, mat)
  rock.position.y = 0.05
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.05, 0.17), new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: 0.7 }))
  base.position.y = 0.025
  group.add(rock, base)
  // its cord runs to a switch lying on the table in front, then over the edge
  const cordMat = new THREE.MeshStandardMaterial({ color: '#f2eee4', roughness: 0.6 })
  const cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0.07, 0.012, 0.04], [0.11, 0.005, 0.07], [0.15, 0.008, 0.09], [0.22, 0.004, 0.13], [0.3, 0.004, 0.15], [0.32, -0.3, 0.16]].map(a => new THREE.Vector3(...a))), 40, 0.0035, 6), cordMat)
  const switchBox = new THREE.Group()
  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.02, 0.032), cordMat)
  shell.position.y = 0.01
  // the rocker tips one way for on, the other for off; a small orange window shows it on
  const rocker = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.02), new THREE.MeshStandardMaterial({ color: '#3a3530', roughness: 0.5 }))
  rocker.position.y = 0.022
  const pilot = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.003, 0.012), new THREE.MeshStandardMaterial({ color: '#5a3a20', emissive: '#ff8a2e', emissiveIntensity: 0 }))
  pilot.position.set(-0.021, 0.0205, 0)
  const switchHit = hitMesh(new THREE.BoxGeometry(0.09, 0.05, 0.07))
  switchHit.position.y = 0.02
  switchBox.add(shell, rocker, pilot, switchHit)
  switchBox.position.set(0.15, 0, 0.09)
  switchBox.rotation.y = -0.5
  group.add(cord, switchBox)
  const bulb = light ? null : new THREE.PointLight('#ff9a52', 0, 4, 2)
  if (bulb) {
    bulb.position.y = 0.3
    group.add(bulb)
  }
  let on = false
  let k = 0
  return {
    group,
    rock,
    switcher: switchBox,
    act() {
      on = !on
      return on
    },
    get on() {
      return on
    },
    state() {
      return { on }
    },
    /** Someone else switched it (live: it glows up here, returns true); a newcomer's at once. */
    setState({ on: o = false } = {}, live = false) {
      if (!!o === on) return false
      on = !!o
      if (!live) k = on ? 1 : 0
      return live
    },
    update(dt) {
      k += ((on ? 1 : 0) - k) * Math.min(1, dt * 4)
      rocker.rotation.z += ((on ? 0.28 : -0.28) - rocker.rotation.z) * Math.min(1, dt * 18)
      pilot.material.emissiveIntensity = on ? 2 : 0
      mat.emissiveIntensity = 1.5 * k
      if (bulb) bulb.intensity = 3.2 * k
    },
  }
}

// ---- the professor's card: a folded card standing on the desk ----

export function noteCard({ big = 'Na', small = '' } = {}) {
  const tex = canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = '#fbf7ea'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#23326b'
    g.font = '700 84px Outfit, Nunito, sans-serif'
    g.textAlign = 'center'
    g.fillText(big, w / 2, h * 0.62)
    g.font = '500 26px Outfit, Nunito, sans-serif'
    g.fillText(small, w / 2, h * 0.9)
  })
  const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })
  const back = new THREE.MeshStandardMaterial({ color: '#fbf7ea', roughness: 0.85 })
  const group = new THREE.Group()
  const W = 0.16
  const H = 0.1
  for (const s of [1, -1]) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(W, H), s > 0 ? face : back)
    leaf.rotation.order = 'YXZ'
    leaf.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2
    leaf.rotation.x = -0.32
    leaf.position.set(s * 0.016, H * 0.47, 0)
    group.add(leaf)
  }
  return { group }
}

// ---- the screen by the door: the video's title card in the room's own drawing ----

export function videoScreen({ name, symbol, Z, line, color = '#ffb21e' }) {
  const tex = canvasTex(1024, 576, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#111a44')
    grd.addColorStop(1, '#070b22')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    // the element's tile
    g.fillStyle = '#f7f3e8'
    g.fillRect(70, 110, 300, 340)
    g.fillStyle = '#1d2a5c'
    g.font = '700 54px Outfit, Nunito, sans-serif'
    g.textAlign = 'left'
    g.fillText(String(Z), 96, 175)
    g.textAlign = 'center'
    g.font = '700 170px Outfit, Nunito, sans-serif'
    g.fillText(symbol, 220, 360)
    g.font = '600 40px Outfit, Nunito, sans-serif'
    g.fillText(name, 220, 425)
    // the series and a play button
    g.textAlign = 'left'
    g.fillStyle = '#ffffff'
    g.font = '700 64px Outfit, Nunito, sans-serif'
    g.fillText('Periodic Videos', 430, 200)
    g.fillStyle = '#a9b6e8'
    g.font = '500 34px Outfit, Nunito, sans-serif'
    g.fillText('University of Nottingham', 432, 250)
    g.fillStyle = color
    g.beginPath()
    g.arc(520, 370, 62, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#111a44'
    g.beginPath()
    g.moveTo(500, 335)
    g.lineTo(500, 405)
    g.lineTo(560, 370)
    g.closePath()
    g.fill()
    g.fillStyle = '#ffffff'
    // as large as fits beside the button (German and Polish lines are longer)
    let px = 38
    do g.font = `600 ${px--}px Outfit, Nunito, sans-serif`
    while (g.measureText(line).width > w - 640 && px > 18)
    g.fillText(line, 610, 383)
  })
  const group = new THREE.Group()
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.12, 1.26, 0.07), new THREE.MeshStandardMaterial({ color: '#15171c', roughness: 0.4, metalness: 0.3 }))
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.114), new THREE.MeshBasicMaterial({ map: tex }))
  face.position.z = 0.036
  group.add(bezel, face)
  return { group }
}
