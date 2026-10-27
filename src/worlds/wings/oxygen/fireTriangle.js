// The fire triangle round the campfire: three glowing sides on the floor (fuel, heat, oxygen), each
// with a stone post and its sign. Taking a side away does it for real: the logs are pulled out to a
// woodpile (fuel), a bucket of water drowns the fire in steam (heat), an iron lid comes down over it
// (oxygen). Putting the side back undoes it; when all three are there again the fire lights up.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { hdr, glowMat, label, Particles, softDot, damp, smooth, ease, random } from './kit.js'

export const SIDES = ['oxygen', 'fuel', 'heat']
export const SIDE_COLOR = { fuel: '#ffb347', heat: '#ff5a36', oxygen: '#7fc8ff' }

export function fireTriangle({ fire, stoneMat, words, R = 3.4 }) {
  const group = new THREE.Group()
  const s60 = Math.sin(Math.PI / 3)
  const A = new THREE.Vector2(0, -R)
  const B = new THREE.Vector2(-R * s60, R / 2)
  const C = new THREE.Vector2(R * s60, R / 2)
  const edges = { oxygen: [B, C], fuel: [A, B], heat: [A, C] }
  const rnd = random(3)
  const sides = {}

  for (const id of SIDES) {
    const [p, q] = edges[id]
    const mid = p.clone().add(q).multiplyScalar(0.5)
    const n = mid.clone().normalize() // outward
    const len = p.distanceTo(q)
    const ang = Math.atan2(n.x, n.y) // turns local -z (away from the reader) onto -n
    const color = SIDE_COLOR[id]
    // the glowing side on the floor
    const barMat = glowMat(color, 1.2, { roughness: 0.3 })
    const bar = new THREE.Mesh(new RoundedBoxGeometry(len - 0.1, 0.05, 0.12, 2, 0.02), barMat)
    bar.position.set(mid.x, 0.03, mid.y)
    bar.rotation.y = ang
    group.add(bar)
    // its word on the floor just inside the side, read from outside
    const floorText = new THREE.Group()
    floorText.position.set(mid.x - n.x * 0.36, 0.012, mid.y - n.y * 0.36)
    floorText.rotation.y = ang
    const ft = makeText(words.sides[id].toUpperCase(), { size: 0.28, color: hdr(color, 1.4), anchorX: 'center' })
    ft.rotation.x = -Math.PI / 2
    floorText.add(ft)
    group.add(floorText)
    // the post with its icon, just outside the side
    const post = new THREE.Group()
    post.position.set(mid.x + n.x * 0.42, 0, mid.y + n.y * 0.42)
    post.rotation.y = ang
    group.add(post)
    // knee high, so the fire is seen over it
    const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.55, 0.36, 3, 0.06), stoneMat)
    pillar.position.y = 0.275
    pillar.castShadow = pillar.receiveShadow = true
    const capMat = glowMat(color, 1.2)
    const cap = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.05, 0.42, 2, 0.02), capMat)
    cap.position.y = 0.565
    post.add(pillar, cap)
    // the sign on the post's outer face (the post's +z points out of the triangle, to the reader)
    const sign = label(words.labels[id], { size: 0.075, color, maxWidth: 0.9 })
    sign.position.set(0, 0.33, 0.19)
    post.add(sign)
    // the icon
    const icon = new THREE.Group()
    icon.position.y = 0.82
    post.add(icon)
    const iconMats = []
    if (id === 'fuel') {
      const wood = new THREE.MeshStandardMaterial({ color: '#7a5233', roughness: 0.8 })
      const end = new THREE.MeshStandardMaterial({ color: '#c79a62', roughness: 0.7 })
      ;[[-0.07, 0], [0.07, 0], [0, 0.1]].forEach(([x, y]) => {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.32, 14, 1), [wood, end, end])
        l.rotation.z = Math.PI / 2
        l.rotation.y = 0.4
        l.position.set(0, y, x)
        icon.add(l)
      })
      iconMats.push(wood, end)
    } else if (id === 'heat') {
      const fl = new THREE.Mesh(
        new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.09, 0.04), new THREE.Vector2(0.11, 0.12), new THREE.Vector2(0.08, 0.22), new THREE.Vector2(0.03, 0.3), new THREE.Vector2(0, 0.34)], 24),
        new THREE.MeshStandardMaterial({ color: '#ff7a2e', emissive: '#ff5a1a', emissiveIntensity: 1.6, roughness: 0.4 }),
      )
      fl.position.y = -0.12
      icon.add(fl)
      iconMats.push(fl.material)
    } else {
      const red = new THREE.MeshPhysicalMaterial({ color: '#f2302b', roughness: 0.25, clearcoat: 1, emissive: '#f2302b', emissiveIntensity: 0.15 })
      for (const sx of [-1, 1]) {
        const a = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), red)
        a.position.x = sx * 0.085
        icon.add(a)
      }
      const st = new THREE.MeshStandardMaterial({ color: '#e9eef7' })
      for (const y of [-0.022, 0.022]) {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8), st)
        b.rotation.z = Math.PI / 2
        b.position.y = y
        icon.add(b)
      }
      iconMats.push(red)
    }
    icon.traverse(o => o.isMesh && (o.castShadow = true))
    const spot = mid.clone().addScaledVector(n, 1.45)
    sides[id] = { id, on: true, bar, barMat, capMat, icon, iconMats, color: new THREE.Color(color), floorText: ft, spot, mid, n, ang, post, k: 1 }
  }
  // glowing nodes at the corners
  for (const v of [A, B, C]) {
    const node = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24), glowMat('#ffd7a0', 2))
    node.position.set(v.x, 0.03, v.y)
    group.add(node)
  }

  // ---- what each side's removal does ----
  // fuel: the logs slide out to a woodpile beside the fuel post
  const pile = sides.fuel.mid.clone().addScaledVector(sides.fuel.n, 1.0)
  // heat: a bucket tips water over the fire; steam
  const bucket = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: '#8b8f96', roughness: 0.45, metalness: 0.85, transparent: true, opacity: 0 })
  const pail = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.32, 24, 1, true), metal)
  pail.material.side = THREE.DoubleSide
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), metal)
  bottom.rotation.x = Math.PI / 2
  bottom.position.y = -0.16
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.012, 6, 24, Math.PI), metal)
  handle.position.y = 0.16
  bucket.add(pail, bottom, handle)
  bucket.position.set(0, 1.9, 0.6)
  bucket.visible = false
  group.add(bucket)
  const drops = new Particles(70, { map: softDot(32, 0, true), additive: false, renderOrder: 7 })
  const steam = new Particles(40, { map: softDot(64), additive: false, renderOrder: 7 })
  const spark = new Particles(40, { map: softDot(32, 0, true) })
  group.add(drops.points, steam.points, spark.points)
  // oxygen: an iron lid comes down over the pit
  const lidMat = new THREE.MeshStandardMaterial({ color: '#3a3936', roughness: 0.55, metalness: 0.8 })
  const lid = new THREE.Group()
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.08, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), lidMat)
  dome.scale.y = 0.75
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.04, 8, 48), lidMat)
  rim.rotation.x = Math.PI / 2
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), lidMat)
  knob.position.y = 0.84
  lid.add(dome, rim, knob)
  lid.traverse(o => o.isMesh && (o.castShadow = true))
  lid.position.y = 4.2
  lid.visible = false
  group.add(lid)

  let anim = null // { id, take, t }
  const wanted = () => SIDES.every(id => sides[id].on)
  let relightAt = -1

  return {
    group,
    sides,
    spots: Object.fromEntries(SIDES.map(id => [id, sides[id].spot])),
    get complete() {
      return wanted()
    },
    missing() {
      return SIDES.filter(id => !sides[id].on)
    },
    /** Take a side away or put it back. Returns false while one is still moving. */
    toggle(id) {
      if (anim) return false
      const s = sides[id]
      s.on = !s.on
      anim = { id, take: !s.on, t: 0 }
      if (!s.on) {
        // the fire dies its own way: drowned fast, smothered in a moment, starved slowly
        fire.setLevel(0, id === 'heat' ? 3 : id === 'oxygen' ? 1.3 : 0.7)
      } else if (wanted()) relightAt = 0.9
      return s.on ? 'give' : 'take'
    },
    update(dt, t, camera, renderer) {
      for (const id of SIDES) {
        const s = sides[id]
        s.k = damp(s.k, s.on ? 1 : 0, 4, dt)
        s.barMat.emissiveIntensity = 0.1 + 1.1 * s.k
        s.barMat.color.copy(s.color).multiplyScalar(0.35 + 0.65 * s.k)
        s.capMat.emissiveIntensity = 0.15 + 1.05 * s.k
        s.icon.position.y = 0.82 - (1 - s.k) * 0.1
        s.icon.rotation.y = t * 0.6 + s.ang
        for (const m of s.iconMats) if (m.emissive) m.emissiveIntensity = (id === 'heat' ? 1.6 : 0.15) * (0.25 + 0.75 * s.k)
        s.floorText.fillOpacity = 0.35 + 0.65 * s.k
      }
      if (relightAt >= 0) {
        relightAt -= dt
        if (relightAt < 0) {
          fire.setLevel(1, 1.6)
          fire.whoomph(1)
          for (let i = 0; i < 26; i++) {
            spark.spawn({ x: (Math.random() - 0.5) * 0.3, y: 0.25, z: (Math.random() - 0.5) * 0.3, vx: (Math.random() - 0.5) * 2.4, vy: 1 + Math.random() * 2.5, vz: (Math.random() - 0.5) * 2.4, life: 0.5 + Math.random() * 0.6, size: 0.04, r: 1.8, g: 1.1, b: 0.4 })
          }
        }
      }
      if (anim) {
        anim.t += dt
        const a = anim
        if (a.id === 'fuel') {
          const k = ease(Math.min(1, a.t / 1.4))
          const out = a.take ? k : 1 - k
          fire.logs.position.set(pile.x * out, 0, pile.y * out)
          fire.logs.scale.setScalar(1 - out * 0.35)
          if (a.t >= 1.4) anim = null
        } else if (a.id === 'heat') {
          if (a.take) {
            bucket.visible = true
            const show = Math.min(1, a.t / 0.4) * (1 - smooth(2.4, 2.9, a.t))
            metal.opacity = show
            bucket.rotation.x = -smooth(0.5, 1.1, a.t) * 2.1
            if (a.t > 0.9 && a.t < 1.7) {
              for (let i = 0; i < 3; i++) {
                drops.spawn({ x: (Math.random() - 0.5) * 0.3, y: 1.7, z: 0.3 + (Math.random() - 0.5) * 0.2, vx: (Math.random() - 0.5) * 0.6, vy: -0.5, vz: -0.5 - Math.random() * 0.4, life: 0.9, size: 0.035, alpha: 0.85, r: 0.75, g: 0.88, b: 1.0 })
              }
            }
            if (a.t > 1.1 && a.t < 2.6) {
              for (let i = 0; i < 2; i++) steam.spawn({ x: (Math.random() - 0.5) * 0.9, y: 0.3, z: (Math.random() - 0.5) * 0.9, vx: (Math.random() - 0.5) * 0.3, vy: 0.8 + Math.random() * 0.7, vz: (Math.random() - 0.5) * 0.3, life: 2.5, size: 0.3, alpha: 0, r: 0.9, g: 0.92, b: 0.95 })
            }
            if (a.t >= 3) {
              bucket.visible = false
              anim = null
            }
          } else {
            // heat back: a strike of sparks
            if (a.t < 0.05) {
              for (let i = 0; i < 30; i++) spark.spawn({ x: 0.5, y: 0.6, z: 0.4, vx: -1.5 + (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.3) * 1.5, vz: -1 + (Math.random() - 0.5), life: 0.4 + Math.random() * 0.4, size: 0.035, r: 1.8, g: 1.2, b: 0.5 })
            }
            if (a.t > 0.5) anim = null
          }
        } else if (a.id === 'oxygen') {
          lid.visible = true
          const k = ease(Math.min(1, a.t / 1.3))
          const down = a.take ? k : 1 - k
          lid.position.y = 0.06 + (1 - down) * 4.2
          if (!a.take && a.t >= 1.3) lid.visible = false
          if (a.t >= 1.3) anim = null
        }
      }
      drops.step(dt, (p, d) => {
        p.vy -= 9.8 * d
        if (p.y < 0.1) p.alpha = 0
      }, camera, renderer)
      steam.step(dt, (p, d, k) => {
        p.size = 0.3 + k * 1.4
        p.alpha = Math.sin(k * Math.PI) * 0.35
      }, camera, renderer)
      spark.step(dt, (p, d, k) => {
        p.vy -= 3 * d
        p.alpha = 1 - k
      }, camera, renderer)
    },
  }
}
