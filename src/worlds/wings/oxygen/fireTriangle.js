// The fire triangle round the campfire: three glowing sides on the floor (fuel, heat, oxygen), each
// with a knee-high stone post: a plaque on its top (an emblem, the word, a line at the reader's depth
// that also says when the side has been taken away) and its sign above it (logs, a live flame, O2). Taking a side away does it for real: the logs are pulled out to a
// woodpile (fuel), a bucket of water drowns the fire in steam (heat), an iron lid comes down over it
// (oxygen). Putting the side back undoes it; when all three are there again the fire lights up.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { hdr, glowMat, Particles, softDot, damp, smooth, ease, random, canvasTex, at } from './kit.js'
import { flameCard, FIRE } from './flame.js'

export const SIDES = ['oxygen', 'fuel', 'heat']
export const SIDE_COLOR = { fuel: '#ffb347', heat: '#ff5a36', oxygen: '#7fc8ff' }

export function fireTriangle({ fire, stoneMat, words, level = () => 'explorer', R = 3.4 }) {
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
    // the post: knee high (the fire is seen over it), with a plaque on its top tilted to the reader
    // and its sign above: a stack of logs, a live flame, the O2 molecule
    const post = new THREE.Group()
    post.position.set(mid.x + n.x * 0.42, 0, mid.y + n.y * 0.42)
    post.rotation.y = ang
    group.add(post)
    const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.55, 0.46, 3, 0.06), stoneMat)
    pillar.position.y = 0.275
    pillar.castShadow = pillar.receiveShadow = true
    const capMat = glowMat(color, 1.0)
    const cap = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.045, 0.52, 2, 0.02), capMat)
    cap.position.y = 0.57
    post.add(pillar, cap)
    // the plaque (the post's +z points out of the triangle, to the reader)
    const plaque = new THREE.Group()
    plaque.position.set(0, 0.71, 0.1)
    plaque.rotation.x = -0.85
    post.add(plaque)
    const frameMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 })
    const frame = new THREE.Mesh(new RoundedBoxGeometry(0.76, 0.34, 0.03, 2, 0.012), frameMat)
    const face = new THREE.Mesh(
      new RoundedBoxGeometry(0.73, 0.31, 0.034, 2, 0.01),
      new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.35, emissive: '#10173f', emissiveIntensity: 0.5 }),
    )
    face.position.z = 0.004
    const emblemMat = new THREE.MeshBasicMaterial({ map: emblem(id), transparent: true, color: hdr('#ffffff', 1.05) })
    const emb = new THREE.Mesh(new THREE.CircleGeometry(0.125, 48), emblemMat)
    emb.position.set(-0.225, 0, 0.023)
    const word = makeText(words.sides[id].toUpperCase(), { size: 0.074, color: hdr(color, 1.2), anchorX: 'left', align: 'left' })
    word.position.set(-0.075, 0.062, 0.023)
    const line = makeText('', { font: 'body', size: 0.036, color: hdr('#d6deff', 1.05), anchorX: 'left', anchorY: 'top', maxWidth: 0.42, lineHeight: 1.15, align: 'left' })
    line.position.set(-0.075, 0.012, 0.023)
    plaque.add(frame, face, emb, word, line)
    plaque.traverse(o => o.isMesh && (o.castShadow = true))
    // the sign above
    const icon = new THREE.Group()
    icon.position.set(0, 1.04, -0.1)
    post.add(icon)
    let flame = null
    if (id === 'fuel') {
      const bark = barkTexture()
      const rings = ringTexture()
      const woodMat = new THREE.MeshStandardMaterial({ map: bark, roughness: 0.85 })
      const endMat = new THREE.MeshStandardMaterial({ map: rings, roughness: 0.7 })
      const logGeo = new THREE.CylinderGeometry(0.068, 0.072, 0.32, 18, 1)
      logGeo.rotateX(Math.PI / 2) // the cut ends face the reader
      ;[[-0.075, -0.06], [0.075, -0.06], [0, 0.068]].forEach(([x, y], k) => {
        const l = new THREE.Mesh(logGeo, [woodMat, endMat, endMat])
        l.position.set(x, y, (k - 1) * 0.02)
        l.rotation.z = k * 1.3
        icon.add(l)
      })
    } else if (id === 'heat') {
      // a little fire of its own: embers and a live flame
      const bed = new THREE.Mesh(new THREE.CircleGeometry(0.13, 32), new THREE.MeshStandardMaterial({ color: '#2a1208', emissive: '#ff5a12', emissiveIntensity: 1.1, roughness: 0.8 }))
      bed.rotation.x = -Math.PI / 2
      bed.position.y = -0.17
      const coalMat = new THREE.MeshStandardMaterial({ color: '#1c120c', emissive: '#ff4a10', emissiveIntensity: 0.5, roughness: 0.9 })
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2
        const coal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.04, 0), coalMat)
        coal.position.set(Math.cos(a) * 0.075, -0.155, Math.sin(a) * 0.075)
        coal.rotation.set(k, k * 2, 0)
        icon.add(coal)
      }
      icon.add(bed)
      flame = flameCard({ w: 0.3, h: 0.5, colors: FIRE, seed: 9.3, turb: 0.9, gain: 1.35 })
      flame.mesh.position.y = -0.17
      icon.add(flame.mesh)
    } else {
      const red = new THREE.MeshPhysicalMaterial({ color: '#f2302b', roughness: 0.22, clearcoat: 1, emissive: '#f2302b', emissiveIntensity: 0.12 })
      for (const sx of [-1, 1]) {
        const a = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), red)
        a.position.x = sx * 0.095
        icon.add(a)
      }
      const st = new THREE.MeshStandardMaterial({ color: '#e9eef7', roughness: 0.35 })
      for (const y of [-0.024, 0.024]) {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.12, 10), st)
        b.rotation.z = Math.PI / 2
        b.position.y = y
        icon.add(b)
      }
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.009, 8, 64), glowMat(color, 1.4))
      ring.rotation.x = 1.2
      icon.add(ring)
    }
    icon.traverse(o => o.isMesh && !o.material?.transparent && (o.castShadow = true))
    const spot = mid.clone().addScaledVector(n, 1.45)
    sides[id] = { id, on: true, bar, barMat, capMat, frameMat, emblemMat, icon, flame, line, color: new THREE.Color(color), floorText: ft, spot, mid, n, ang, post, k: 1 }
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

  // each plaque's line: what the side is, at the reader's depth, or that it has been taken away
  const writeLine = s => {
    const text = at(s.on ? words.signs[s.id] : words.off, level())
    if (s.line.text !== text) {
      s.line.text = text
      s.line.sync()
    }
  }
  for (const id of SIDES) writeLine(sides[id])

  let anim = null // { id, take, t }
  const wanted = () => SIDES.every(id => sides[id].on)
  let relightAt = -1
  /** A side as it stands, without its animation: the logs, the lid and the fire where they end up. */
  const place = (id, on) => {
    const s = sides[id]
    s.on = on
    s.k = on ? 1 : 0
    writeLine(s)
    if (id === 'fuel') {
      fire.logs.position.set(on ? 0 : pile.x, 0, on ? 0 : pile.y)
      fire.logs.scale.setScalar(on ? 1 : 0.65)
    } else if (id === 'oxygen') {
      lid.visible = !on
      lid.position.y = on ? 4.2 : 0.06
    } else bucket.visible = false
  }

  const api = {
    group,
    sides,
    spots: Object.fromEntries(SIDES.map(id => [id, sides[id].spot])),
    get complete() {
      return wanted()
    },
    missing() {
      return SIDES.filter(id => !sides[id].on)
    },
    refresh() {
      for (const id of SIDES) writeLine(sides[id])
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
      writeLine(s)
      return s.on ? 'give' : 'take'
    },
    /** Which sides are there, for the others in a room (src/net/shared.js). */
    state() {
      return Object.fromEntries(SIDES.map(id => [id, sides[id].on]))
    },
    /** Someone else took a side away or put it back: it plays here (one change, nothing moving);
     *  otherwise, and for a newcomer, every side and the fire are put as they stand. */
    setState(s = {}, live = false) {
      const diff = SIDES.filter(id => typeof s[id] === 'boolean' && s[id] !== sides[id].on)
      if (!diff.length) return
      if (live && diff.length === 1 && !anim) return void api.toggle(diff[0])
      anim = null
      relightAt = -1
      for (const id of diff) place(id, s[id])
      fire.setLevel(wanted() ? 1 : 0, live ? 1.6 : 60)
    },
    update(dt, t, camera, renderer) {
      for (const id of SIDES) {
        const s = sides[id]
        s.k = damp(s.k, s.on ? 1 : 0, 4, dt)
        s.barMat.emissiveIntensity = 0.1 + 1.1 * s.k
        s.barMat.color.copy(s.color).multiplyScalar(0.35 + 0.65 * s.k)
        s.capMat.emissiveIntensity = 0.12 + 0.88 * s.k
        s.frameMat.emissiveIntensity = 0.15 + 0.75 * s.k
        s.emblemMat.opacity = 0.35 + 0.65 * s.k
        s.icon.position.y = 1.04 - (1 - s.k) * 0.12
        s.icon.scale.setScalar(0.8 + 0.2 * s.k)
        if (s.flame) {
          s.flame.update(t)
          s.flame.set(s.k * (0.9 + 0.1 * Math.sin(t * 9)))
        } else s.icon.rotation.y = Math.sin(t * 0.6 + s.ang) * 0.5
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
              for (let i = 0; i < 2; i++) steam.spawn({ x: (Math.random() - 0.5) * 0.9, y: 0.25, z: (Math.random() - 0.5) * 0.9, vx: (Math.random() - 0.5) * 0.35, vy: 1.0 + Math.random() * 0.9, vz: (Math.random() - 0.5) * 0.35, life: 2.6 + Math.random(), size: 0.2, alpha: 0, r: 0.5, g: 0.52, b: 0.56, k: Math.random() * 9 })
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
        p.size = 0.2 + k * 0.9
        p.alpha = Math.sin(k * Math.PI) * 0.22
        p.vx += Math.sin(t * 2 + p.k) * d * 0.4
        p.vy *= 1 - d * 0.3
      }, camera, renderer)
      spark.step(dt, (p, d, k) => {
        p.vy -= 3 * d
        p.alpha = 1 - k
      }, camera, renderer)
    },
  }
  return api
}

/** A round emblem for a side of the triangle, drawn on a canvas: logs end on (fuel), a flame (heat),
 *  the O2 molecule (oxygen), on a dark medallion ringed in the side's colour. */
function emblem(id) {
  return canvasTex(256, (g, s) => {
    const c = s / 2
    g.clearRect(0, 0, s, s)
    g.fillStyle = '#121838'
    g.beginPath()
    g.arc(c, c, c - 6, 0, Math.PI * 2)
    g.fill()
    g.lineWidth = 10
    g.strokeStyle = SIDE_COLOR[id]
    g.beginPath()
    g.arc(c, c, c - 11, 0, Math.PI * 2)
    g.stroke()
    if (id === 'fuel') {
      for (const [x, y] of [[c - 44, c + 30], [c + 44, c + 30], [c, c - 40]]) {
        g.fillStyle = '#5b3a22'
        g.beginPath()
        g.arc(x, y, 42, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#e2b274'
        g.beginPath()
        g.arc(x, y, 34, 0, Math.PI * 2)
        g.fill()
        g.strokeStyle = '#a8743c'
        g.lineWidth = 3
        for (const r of [7, 14, 21, 28]) {
          g.beginPath()
          g.arc(x, y, r, 0, Math.PI * 2)
          g.stroke()
        }
      }
    } else if (id === 'heat') {
      const tongue = (k, fill) => {
        g.fillStyle = fill
        g.beginPath()
        g.moveTo(c, c + 80 * k)
        g.bezierCurveTo(c - 66 * k, c + 74 * k, c - 70 * k, c - 4 * k, c - 26 * k, c - 46 * k)
        g.bezierCurveTo(c - 24 * k, c - 18 * k, c - 8 * k, c - 20 * k, c + 2 * k, c - 92 * k)
        g.bezierCurveTo(c + 44 * k, c - 52 * k, c + 74 * k, c + 6 * k, c + 54 * k, c + 50 * k)
        g.bezierCurveTo(c + 44 * k, c + 72 * k, c + 22 * k, c + 80 * k, c, c + 80 * k)
        g.fill()
      }
      const grad = g.createLinearGradient(0, c + 84, 0, c - 92)
      grad.addColorStop(0, '#ff3a10')
      grad.addColorStop(1, '#ffb347')
      tongue(1, grad)
      tongue(0.55, '#ffe08a')
    } else {
      for (const x of [c - 46, c + 46]) {
        const rg = g.createRadialGradient(x - 12, c - 12, 6, x, c, 36)
        rg.addColorStop(0, '#ff8f84')
        rg.addColorStop(1, '#c81e18')
        g.fillStyle = rg
        g.beginPath()
        g.arc(x, c, 34, 0, Math.PI * 2)
        g.fill()
      }
      g.fillStyle = '#eef3ff'
      g.fillRect(c - 13, c - 12, 26, 7)
      g.fillRect(c - 13, c + 5, 26, 7)
    }
  })
}

/** Bark: dark brown with long cracks. */
function barkTexture() {
  const rnd = random(31)
  return canvasTex(128, (g, s) => {
    g.fillStyle = '#4a3020'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 70; i++) {
      const x = rnd() * s
      g.strokeStyle = rnd() < 0.5 ? 'rgba(20,12,6,0.65)' : 'rgba(120,86,56,0.45)'
      g.lineWidth = 1 + rnd() * 2.5
      g.beginPath()
      g.moveTo(x, 0)
      g.bezierCurveTo(x + (rnd() - 0.5) * 12, s * 0.33, x + (rnd() - 0.5) * 12, s * 0.66, x + (rnd() - 0.5) * 8, s)
      g.stroke()
    }
  })
}

/** A cut log's end: pale wood with growth rings and a little bark round it. */
function ringTexture() {
  const rnd = random(47)
  return canvasTex(128, (g, s) => {
    const c = s / 2
    g.fillStyle = '#4a3020'
    g.fillRect(0, 0, s, s)
    g.fillStyle = '#d9a86a'
    g.beginPath()
    g.arc(c, c, c * 0.86, 0, Math.PI * 2)
    g.fill()
    for (let r = 4; r < c * 0.84; r += 4 + rnd() * 3) {
      g.strokeStyle = `rgba(150,96,48,${0.35 + rnd() * 0.35})`
      g.lineWidth = 1 + rnd()
      g.beginPath()
      g.arc(c + (rnd() - 0.5) * 2, c + (rnd() - 0.5) * 2, r, 0, Math.PI * 2)
      g.stroke()
    }
    g.fillStyle = '#7a4e2a'
    g.beginPath()
    g.arc(c, c, 3, 0, Math.PI * 2)
    g.fill()
  })
}
