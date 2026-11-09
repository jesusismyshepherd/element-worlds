// A stage for picture rooms (docs/knowledge/picture-rooms.md): a summit in late autumn, early on a cold
// morning, Mount Greylock in Massachusetts as silver's `snow` room has it. It is the meadow (stages/meadow.js:
// the sky that follows the sun, the hilltop falling away, far hills in the haze) dressed for November: brown
// frosted grass, no flowers, far hills gone grey-blue, bare trees, and the Veterans War Memorial Tower with
// its lamp on top. A long cloud deck can lie above it (`cloudDeck`), made of soft puffs that can each be
// turned to ice. For the scene: everything meadowStage gives (`setSun`, `solids`, `env`, `cameraBounds`),
// plus `tower` (where it stands), `trees`, and the exports `cloudDeck`, `bareTree`.
// Everything big and pale stays mid-toned: frost and cloud drawn white bloom the whole view white.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, random, lerp } from '../../wings/noble/kit.js'
import { circle } from '../../../engine/collide.js'
import { meadowStage, cloudTexture, hillHeight } from './meadow.js'

const C = c => new THREE.Color(c)

/** A bare tree as one geometry: a trunk and forking branches (a seeded shape), `h` metres tall, its foot at
 *  the origin. */
export function bareTree(seed = 1, h = 4.2) {
  const rnd = random(seed)
  const parts = []
  const up = new THREE.Vector3(0, 1, 0)
  const branch = (from, dir, len, r0, depth) => {
    const to = from.clone().addScaledVector(dir, len)
    const geo = new THREE.CylinderGeometry(r0 * 0.7, r0, len, 5, 1, false)
    geo.translate(0, len / 2, 0)
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir)
    geo.applyMatrix4(new THREE.Matrix4().compose(from, q, new THREE.Vector3(1, 1, 1)))
    parts.push(geo)
    if (depth <= 0) return
    const kids = depth > 2 ? 3 : 2
    for (let i = 0; i < kids; i++) {
      const spread = 0.45 + rnd() * 0.5
      const turn = (i / kids) * Math.PI * 2 + rnd() * 1.4
      const side = new THREE.Vector3(Math.cos(turn), 0, Math.sin(turn))
      const d = dir.clone().multiplyScalar(Math.cos(spread)).addScaledVector(side, Math.sin(spread)).normalize()
      d.y = Math.max(d.y, 0.12)
      d.normalize()
      branch(to.clone().addScaledVector(dir, -len * rnd() * 0.25), d, len * (0.62 + rnd() * 0.12), r0 * 0.6, depth - 1)
    }
  }
  const trunk = h * 0.34
  branch(new THREE.Vector3(0, 0, 0), new THREE.Vector3((rnd() - 0.5) * 0.1, 1, (rnd() - 0.5) * 0.1).normalize(), trunk, h * 0.028, 4)
  return mergeGeometries(parts)
}

/** A long deck of cloud above (x0..x1, z0..z1), its base at height `y`, `thick` metres deep: soft puffs,
 *  the lowest darkest. `set(k)` takes a function (x, z) -> 0..1 and turns the puffs there to ice (paler,
 *  brighter); `update(t)` moves them a little. */
export function cloudDeck({ x0 = -24, x1 = 24, z0 = -26, z1 = -8, y = 6.5, thick = 3, count = 90, light = false, seed = 7 } = {}) {
  const group = new THREE.Group()
  const rnd = random(seed)
  const tex = cloudTexture(9)
  const n = light ? Math.round(count / 2) : count
  const base = C('#8f9fba')
  const top = C('#b7c4da')
  const ice = C('#dbe8fb')
  const puffs = []
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + rnd() * 0.8) / n)
    const z = lerp(z0, z1, rnd())
    const lift = Math.pow(rnd(), 1.6)
    const w = 6 + rnd() * 5
    const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.88, color: base.clone() })
    const s = new THREE.Sprite(m)
    s.scale.set(w, w * (0.42 + rnd() * 0.12), 1)
    s.position.set(x, y + 0.7 + lift * thick, z)
    s.renderOrder = -3
    group.add(s)
    puffs.push({ s, m, x, z, lift, y0: s.position.y, ph: rnd() * 6.28, k: 0 })
  }
  const col = new THREE.Color()
  return {
    group,
    puffs,
    y,
    thick,
    set(f) {
      for (const p of puffs) p.k = Math.max(0, Math.min(1, f(p.x, p.z)))
    },
    update(t) {
      for (const p of puffs) {
        col.copy(base).lerp(top, p.lift)
        col.lerp(ice, p.k * 0.85)
        p.m.color.copy(col)
        p.s.position.y = p.y0 + Math.sin(t * 0.12 + p.ph) * 0.12
      }
    },
    dispose() {
      tex.dispose()
      for (const p of puffs) p.m.dispose()
    },
  }
}

export function greylockStage({ radius = 12, light = false, tower = { x: -9.5, z: -9 } } = {}) {
  const meadow = meadowStage({ radius, light })
  const group = meadow.group
  const solids = meadow.solids
  const disposers = []

  // a cold, low morning sun ahead on the right, set once (the stage's own `setSun` tints the whole meadow
  // for the day; the November colours go over it after)
  meadow.setSun(new THREE.Vector3(0.55, 0.34, -0.76).normalize())

  // ---- the ground: dry brown grass with frost ----
  const frostTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#7a6a47'
    g.fillRect(0, 0, w, w)
    const rnd = random(31)
    for (let i = 0; i < 1500; i++) {
      const v = rnd()
      g.fillStyle = v < 0.45 ? `rgba(86,66,40,${0.25 + rnd() * 0.3})` : v < 0.8 ? `rgba(168,148,98,${0.2 + rnd() * 0.25})` : `rgba(120,86,50,${0.2 + rnd() * 0.25})`
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * w, 3 + rnd() * 16, 2 + rnd() * 8, rnd() * Math.PI, 0, Math.PI * 2)
      g.fill()
    }
    g.lineWidth = 1.2
    for (let i = 0; i < 2400; i++) {
      const x = rnd() * w
      const y = rnd() * w
      g.strokeStyle = rnd() < 0.5 ? 'rgba(190,172,120,0.5)' : 'rgba(70,52,34,0.5)'
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (rnd() - 0.5) * 3, y - 4 - rnd() * 5)
      g.stroke()
    }
    // frost: pale crystals along the blades and a few white patches
    for (let i = 0; i < 1300; i++) {
      const x = rnd() * w
      const y = rnd() * w
      g.fillStyle = `rgba(214,228,240,${0.25 + rnd() * 0.4})`
      g.fillRect(x, y, 1 + rnd() * 3, 1 + rnd() * 2)
    }
    for (let i = 0; i < 26; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const r = 12 + rnd() * 28
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, 'rgba(206,222,238,0.38)')
      grd.addColorStop(1, 'rgba(206,222,238,0)')
      g.fillStyle = grd
      g.beginPath()
      g.arc(x, y, r, 0, Math.PI * 2)
      g.fill()
    }
  })
  frostTex.wrapS = frostTex.wrapT = THREE.RepeatWrapping
  frostTex.repeat.set(22, 22)
  disposers.push(() => frostTex.dispose())
  const hillMats = new Set()
  group.traverse(o => {
    if (o.isMesh && o.geometry?.type === 'RingGeometry') {
      o.material.map = frostTex
      o.material.color.set('#d8d8d0')
      o.material.needsUpdate = true
    } else if (o.isInstancedMesh && o.geometry?.type === 'IcosahedronGeometry') {
      o.visible = false // no flowers in November
    } else if (o.isInstancedMesh) {
      // the tufts: straw and frost instead of green
      const rnd = random(5)
      const c = new THREE.Color()
      for (let i = 0; i < o.count; i++) o.setColorAt(i, c.setHSL(0.1 + rnd() * 0.03, 0.3, 0.26 + rnd() * 0.12))
      o.instanceColor.needsUpdate = true
      o.material.color.set('#ffffff')
    } else if (o.isMesh && o.geometry?.type === 'SphereGeometry' && o.geometry.parameters.radius === 1 && o.scale.x > 10) {
      hillMats.add(o.material)
    }
  })
  // the far hills: bare woods and old snow in the haze (blue-grey, one shared material)
  for (const m of hillMats) m.color.set('#5d6b82')

  // ---- bare trees round the edge and a few near the top ----
  const barkMat = new THREE.MeshStandardMaterial({ color: '#4b4038', roughness: 1 })
  disposers.push(() => barkMat.dispose())
  const treeGeos = [bareTree(3, 4.6), bareTree(8, 4.0), bareTree(15, 5.2)]
  disposers.push(() => treeGeos.forEach(g => g.dispose()))
  const rnd = random(21)
  const trees = []
  const spots = [
    [-3.8, -10.4], [3.6, -10.8], [9.8, -7.4], [10.6, 0.5], [-10.4, 1.2], [-7.6, 7.8], [8.2, 7.2], [-1.8, 11.2], [6.8, -11.2], [-11, -4.6],
    [11.6, -3.4], [-5.8, -11.4], [3.4, 10.8], [-10.6, 6.2], [0.6, -12.2],
  ]
  for (const [x, z] of spots) {
    const m = new THREE.Mesh(treeGeos[Math.floor(rnd() * 3)], barkMat)
    const r = Math.hypot(x, z)
    m.position.set(x, hillHeight(r, radius), z)
    m.rotation.y = rnd() * 6.28
    m.scale.setScalar(0.85 + rnd() * 0.5)
    m.castShadow = true
    group.add(m)
    trees.push(m)
    solids.push(circle(x, z, 0.3))
  }

  // ---- the Veterans War Memorial Tower: grey granite, a gallery, a lamp on top ----
  const stoneTex = canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#8b8c90'
    g.fillRect(0, 0, w, h)
    const r2 = random(77)
    g.strokeStyle = 'rgba(40,42,48,0.4)'
    g.lineWidth = 2
    for (let y = 0; y < h; y += 32) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(w, y)
      g.stroke()
      for (let x = ((y / 32) % 2) * 32; x < w; x += 64) {
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x, y + 32)
        g.stroke()
      }
    }
    for (let i = 0; i < 900; i++) {
      g.fillStyle = r2() < 0.5 ? 'rgba(60,62,68,0.14)' : 'rgba(196,198,204,0.14)'
      g.fillRect(r2() * w, r2() * h, 2 + r2() * 6, 2 + r2() * 4)
    }
  })
  stoneTex.wrapS = THREE.RepeatWrapping
  stoneTex.repeat.set(4, 1)
  disposers.push(() => stoneTex.dispose())
  const stone = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.95 })
  const lamp = new THREE.MeshStandardMaterial({ color: '#fff0b8', emissive: '#ffd36a', emissiveIntensity: 2.1, roughness: 0.3 })
  const towerG = new THREE.Group()
  const H = 6.4
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.7, H, 28), stone)
  shaft.position.y = H / 2 + 0.3
  shaft.castShadow = true
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.25, 0.34, 28), stone)
  plinth.position.y = 0.17
  const step = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.95, 0.3, 28), stone)
  step.position.y = 0.45
  const gallery = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.62, 0.26, 28), stone)
  gallery.position.y = H + 0.34
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.46, 0.55, 20), stone)
  drum.position.y = H + 0.75
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16), lamp)
  globe.position.y = H + 1.28
  // the lamp's soft halo: a round glow
  const glowTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,236,170,1)')
    grd.addColorStop(0.35, 'rgba(255,214,120,0.45)')
    grd.addColorStop(1, 'rgba(255,200,100,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  disposers.push(() => glowTex.dispose())
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: '#ffe08a', transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }))
  halo.scale.set(2.2, 2.2, 1)
  halo.position.y = H + 1.28
  towerG.add(shaft, plinth, step, gallery, drum, globe, halo)
  towerG.position.set(tower.x, hillHeight(Math.hypot(tower.x, tower.z), radius), tower.z)
  group.add(towerG)
  solids.push(circle(tower.x, tower.z, 1.3))

  return {
    ...meadow,
    group,
    solids,
    tower: { x: tower.x, z: tower.z, height: H + 1.6 },
    trees,
    env: { ...meadow.env, exposure: 1.05, envIntensity: 0.3 },
    dispose() {
      meadow.dispose()
      disposers.forEach(f => f())
      stone.dispose()
      lamp.dispose()
    },
  }
}
