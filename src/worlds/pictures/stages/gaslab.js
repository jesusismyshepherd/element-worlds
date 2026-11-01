// A stage for picture rooms (docs/knowledge/picture-rooms.md): a Victorian teaching laboratory by gaslight,
// University College London in the 1890s. Glazed brick walls (dark green to the height of the dado, cream
// above), wide worn floorboards, a plaster ceiling with a cornice, tall sash windows onto Gower Street at
// night (terraced fronts, gas lamps, wet cobbles), shelves of reagent bottles, gas mantles on wall brackets
// (a warm greenish-white, the room's only light besides what the scene lights), a door that stays shut.
// Every big surface mid-toned: pale ones bloom to white under the mantles. Walking inside x0..x1, z0..z1.
// The scene adds its own benches and apparatus; `mats` are shared plain materials (teak, brass, glass, iron,
// white paint, mercury), `onWall(obj, side, at, y)` stands a thing on a wall facing into the room, and
// `mantle({ side, at, y, light })` hangs a gas mantle (`light`: it carries a real light). `shelves` stands
// bottles on shelves along one wall. Other rooms of the 1890s (Ramsay's neon, argon and xenon; Curie's)
// can use it. Exports `GAS` (the mantles' light colour).
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { roomWalls } from '../../../engine/collide.js'

export const GAS = '#ffe6b0'

function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** Glazed bricks (9 by 3 inches, 0.225 by 0.075 m) in running bond, four bricks and eight courses to the
 *  tile (0.9 by 0.6 m): `tint` the glaze, joints a shade darker, a faint shine and the odd flaw. */
function brickTex(light, tint, seed) {
  const bw = light ? 48 : 96
  const bh = bw / 3
  const rnd = random(seed)
  const base = new THREE.Color(tint)
  return canvasTex(bw * 4, bh * 8, (g, w, h) => {
    g.fillStyle = '#2b2a24'
    g.fillRect(0, 0, w, h)
    for (let r = 0; r < 8; r++) {
      const shift = r % 2 ? bw / 2 : 0
      for (let c = -1; c < 5; c++) {
        const k = 0.9 + rnd() * 0.2
        g.fillStyle = `rgb(${Math.round(base.r * 255 * k)},${Math.round(base.g * 255 * k)},${Math.round(base.b * 255 * k)})`
        g.fillRect(c * bw + shift + 1.5, r * bh + 1.5, bw - 3, bh - 3)
        // the glaze's sheen: a light edge along the top of each brick, and a crazed speck or two
        g.fillStyle = 'rgba(255,255,255,0.13)'
        g.fillRect(c * bw + shift + 3, r * bh + 2.5, bw - 6, 2)
        if (rnd() < 0.25) {
          g.fillStyle = 'rgba(30,30,24,0.28)'
          g.fillRect(c * bw + shift + rnd() * bw, r * bh + rnd() * bh, 1.5, 1.5)
        }
      }
    }
  }, { repeat: true })
}

/** Wide, worn floorboards (UVs in metres, 4 m to the tile): 0.2 m boards of varied lengths, dark with age. */
function boardsTex(light) {
  const s = light ? 256 : 512
  const rnd = random(23)
  const per = s / 20
  return canvasTex(s, s, g => {
    g.fillStyle = '#1e140c'
    g.fillRect(0, 0, s, s)
    for (let c = 0; c < 20; c++) {
      let y = -rnd() * s
      while (y < s) {
        const len = s * (0.3 + rnd() * 0.5)
        const v = 0.8 + rnd() * 0.3
        for (const dy of [0, s]) {
          g.fillStyle = `rgb(${Math.round(104 * v)},${Math.round(74 * v)},${Math.round(48 * v)})`
          g.fillRect(c * per + 1, y - dy + 1, per - 2, len - 2)
          for (let k = 0; k < 5; k++) {
            g.fillStyle = `rgba(${rnd() < 0.5 ? '40,26,14' : '150,112,76'},${0.08 + rnd() * 0.1})`
            g.fillRect(c * per + 2 + rnd() * (per - 5), y - dy + 2, 1 + rnd() * 2, len - 4)
          }
        }
        y += len
      }
    }
  }, { repeat: true })
}

/** Gower Street at night through a window: sky, the terrace opposite with a few lit windows, gas lamps,
 *  the wet cobbles below with their reflections. */
function streetTex(seed) {
  const rnd = random(seed)
  return canvasTex(256, 320, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.55)
    sky.addColorStop(0, '#0a0e1c')
    sky.addColorStop(1, '#2a2c3e')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    // the terrace opposite: dark fronts with chimney pots, a few windows lit warm
    let x = -10
    while (x < w) {
      const bw = 46 + rnd() * 20
      const top = h * (0.18 + rnd() * 0.12)
      g.fillStyle = '#12121c'
      g.fillRect(x, top, bw, h * 0.6 - top)
      g.fillRect(x + bw * 0.2, top - 10, 7, 10)
      g.fillRect(x + bw * 0.6, top - 8, 7, 8)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          g.fillStyle = rnd() < 0.3 ? 'rgba(255,208,130,0.9)' : 'rgba(40,44,64,0.8)'
          g.fillRect(x + 8 + c * (bw * 0.45), top + 12 + r * 30, 11, 17)
        }
      }
      x += bw
    }
    // the street, a wet dark surface
    const st = g.createLinearGradient(0, h * 0.58, 0, h)
    st.addColorStop(0, '#1b1a22')
    st.addColorStop(1, '#0b0b10')
    g.fillStyle = st
    g.fillRect(0, h * 0.58, w, h * 0.42)
    // gas lamps: a post, a lantern, a halo, and its streak on the wet cobbles
    for (const lx of [w * 0.2, w * 0.78]) {
      g.fillStyle = '#0a0a10'
      g.fillRect(lx - 2, h * 0.36, 4, h * 0.24)
      const halo = g.createRadialGradient(lx, h * 0.34, 0, lx, h * 0.34, 46)
      halo.addColorStop(0, 'rgba(255,236,170,1)')
      halo.addColorStop(0.15, 'rgba(255,214,120,0.7)')
      halo.addColorStop(1, 'rgba(255,170,70,0)')
      g.fillStyle = halo
      g.fillRect(lx - 50, h * 0.34 - 50, 100, 100)
      const streak = g.createLinearGradient(0, h * 0.6, 0, h)
      streak.addColorStop(0, 'rgba(255,200,110,0.55)')
      streak.addColorStop(1, 'rgba(255,170,70,0)')
      g.fillStyle = streak
      g.fillRect(lx - 7, h * 0.6, 14, h * 0.4)
    }
    // cobbles
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(90,90,110,${0.1 + rnd() * 0.2})`
      g.fillRect(rnd() * w, h * 0.6 + rnd() * h * 0.4, 4 + rnd() * 6, 2)
    }
  })
}

/** Reagent bottles: an amber, a blue and a clear one, in stoppered glass. One instanced mesh per kind. */
function bottles(group, { x0, x1, z, ys, depth, light, mats, seed }) {
  const rnd = random(seed)
  const geo = new THREE.LatheGeometry([[0, 0], [0.05, 0], [0.055, 0.02], [0.055, 0.17], [0.03, 0.21], [0.02, 0.25], [0.028, 0.255], [0.028, 0.27], [0, 0.27]].map(([a, b]) => new THREE.Vector2(a, b)), light ? 10 : 14)
  const kinds = [
    new THREE.MeshStandardMaterial({ color: '#7a4a1a', roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0.88 }),
    new THREE.MeshStandardMaterial({ color: '#2a5a8a', roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0.8 }),
    mats.glass,
  ]
  const per = 0.14
  const n = Math.floor((x1 - x0) / per)
  const lists = [[], [], []]
  for (const y of ys) for (let i = 0; i < n; i++) if (rnd() < 0.86) lists[Math.floor(rnd() * 3)].push([x0 + (i + 0.5) * per, y, z + (rnd() - 0.5) * depth, 0.8 + rnd() * 0.35])
  const dummy = new THREE.Object3D()
  lists.forEach((list, k) => {
    const im = new THREE.InstancedMesh(geo, kinds[k], Math.max(1, list.length))
    list.forEach(([x, y, zz, s], i) => {
      dummy.position.set(x, y, zz)
      dummy.scale.set(s, 0.8 + (s - 0.8) * 1.4, s)
      dummy.updateMatrix()
      im.setMatrixAt(i, dummy.matrix)
    })
    im.count = list.length
    group.add(im)
  })
  // the planks the bottles stand on
  for (const y of ys) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 0.1, 0.04, depth + 0.12), mats.teak)
    plank.position.set((x0 + x1) / 2, y - 0.02, z)
    group.add(plank)
  }
}

/** A flat piece of wall from (a0, y0) to (a1, y1) in its own plane, UVs in metres. */
function wallPiece(a0, a1, y0, y1) {
  const geo = new THREE.PlaneGeometry(a1 - a0, y1 - y0)
  const uv = geo.attributes.uv
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) + (a0 + a1) / 2, pos.getY(i) + (y0 + y1) / 2)
  geo.translate((a0 + a1) / 2, (y0 + y1) / 2, 0)
  return geo
}

/**
 * The laboratory. `mantles`: [{ side: 'w' | 'e' | 'n' | 's', at, y, light }]; `windows`: [{ side, at, width }]
 * onto the street; `door`: { side, at } (shut); `shelves`: { x0, x1, ys } of bottles on the back (north)
 * wall. `dado` is the height of the green (m).
 */
export function gaslabStage({ light = false, x0 = -6.5, x1 = 6.5, z0 = -6.5, z1 = 6.5, h = 4.4, dado = 1.5, mantles = [], pendants = [], windows = [], door = null, shelves = null } = {}) {
  const group = new THREE.Group()
  const textures = []
  const fw = x1 - x0
  const fd = z1 - z0
  const soft = softTex()
  textures.push(soft)
  const shine = canvasTex(256, 128, (g, w, hh) => {
    const grd = g.createLinearGradient(0, 0, 0, hh)
    grd.addColorStop(0, '#16140f')
    grd.addColorStop(0.45, '#5a5240')
    grd.addColorStop(0.55, '#3a3426')
    grd.addColorStop(1, '#0c0b08')
    g.fillStyle = grd
    g.fillRect(0, 0, w, hh)
    for (const [x, y, r] of [[0.1, 0.4, 10], [0.28, 0.36, 7], [0.5, 0.42, 12], [0.72, 0.38, 8], [0.9, 0.44, 10]]) {
      const c = g.createRadialGradient(x * w, y * hh, 0, x * w, y * hh, r)
      c.addColorStop(0, 'rgba(255,244,214,1)')
      c.addColorStop(1, 'rgba(255,200,110,0)')
      g.fillStyle = c
      g.fillRect(x * w - r, y * hh - r, r * 2, r * 2)
    }
    g.fillStyle = '#34405e'
    g.fillRect(w * 0.62, hh * 0.2, w * 0.07, hh * 0.24)
  }, { mipmaps: false })
  shine.mapping = THREE.EquirectangularReflectionMapping
  textures.push(shine)
  const mats = {
    teak: new THREE.MeshStandardMaterial({ color: '#7a5030', roughness: 0.55, metalness: 0.05 }),
    darkTeak: new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.3, metalness: 0.9, envMap: shine, envMapIntensity: 1.2 }),
    iron: new THREE.MeshStandardMaterial({ color: '#3a3c40', roughness: 0.5, metalness: 0.6, envMap: shine, envMapIntensity: 0.6 }),
    paint: new THREE.MeshStandardMaterial({ color: '#a8a28e', roughness: 0.6, metalness: 0.05 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe6ea', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.3, depthWrite: false, envMap: shine, envMapIntensity: 1.1 }),
    mercury: new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.1, metalness: 1, envMap: shine, envMapIntensity: 1.3 }),
  }

  // the floor
  const fl = boardsTex(light)
  fl.repeat.set(1 / 4, 1 / 4)
  textures.push(fl)
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  const fuv = floorGeo.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fuv.getX(i) * fw, fuv.getY(i) * fd)
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: fl, roughness: 0.6, metalness: 0.05, color: '#d8cdbd' }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)

  // the walls: green glazed brick to the dado, a darker band, cream glazed brick above
  const green = brickTex(light, '#3c6a52', 11)
  green.repeat.set(1 / 0.9, 1 / 0.6)
  const cream = brickTex(light, '#a89c78', 19)
  cream.repeat.set(1 / 0.9, 1 / 0.6)
  textures.push(green, cream)
  const greenMat = new THREE.MeshStandardMaterial({ map: green, roughness: 0.28, metalness: 0.02 })
  const creamMat = new THREE.MeshStandardMaterial({ map: cream, roughness: 0.32, metalness: 0.02 })
  const bandMat = new THREE.MeshStandardMaterial({ color: '#22402f', roughness: 0.3 })
  const addWall = (a0, a1, y0, y1, mat, x, z, rotY) => {
    const m = new THREE.Mesh(wallPiece(a0, a1, y0, y1), mat)
    m.position.set(x, 0, z)
    m.rotation.y = rotY
    group.add(m)
  }
  const sides = [[x0, x1, z0, 0], [-x1, -x0, z1, Math.PI], [-z1, -z0, x0, Math.PI / 2], [z0, z1, x1, -Math.PI / 2]]
  sides.forEach(([a0, a1, p, rot], i) => {
    const x = i < 2 ? 0 : p
    const z = i < 2 ? p : 0
    addWall(a0, a1, 0, dado, greenMat, x, z, rot)
    addWall(a0, a1, dado, dado + 0.1, bandMat, x, z, rot)
    addWall(a0, a1, dado + 0.1, h, creamMat, x, z, rot)
  })
  // skirting and a plaster cornice
  const skirt = (len, x, z, rotY) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 0.03), mats.darkTeak)
    m.position.set(x, 0.08, z)
    m.rotation.y = rotY
    group.add(m)
    const c = new THREE.Mesh(new THREE.BoxGeometry(len, 0.14, 0.12), mats.paint)
    c.position.set(x, h - 0.07, z)
    c.rotation.y = rotY
    group.add(c)
  }
  skirt(fw, (x0 + x1) / 2, z0 + 0.015, 0)
  skirt(fw, (x0 + x1) / 2, z1 - 0.015, 0)
  skirt(fd, x0 + 0.015, (z0 + z1) / 2, Math.PI / 2)
  skirt(fd, x1 - 0.015, (z0 + z1) / 2, Math.PI / 2)

  const onWall = (obj, side, at, y, out = 0.03) => {
    if (side === 'w') obj.position.set(x0 + out, y, at), (obj.rotation.y = Math.PI / 2)
    else if (side === 'e') obj.position.set(x1 - out, y, at), (obj.rotation.y = -Math.PI / 2)
    else if (side === 's') obj.position.set(at, y, z1 - out), (obj.rotation.y = Math.PI)
    else obj.position.set(at, y, z0 + out)
    group.add(obj)
    return obj
  }

  // the ceiling: plaster, a shade darker than the walls
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: '#58544a', roughness: 0.95 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  // iron roof ties across the room, painted dark
  for (const z of [z0 + fd * 0.3, z0 + fd * 0.7]) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.18, 0.14), mats.iron)
    tie.position.set((x0 + x1) / 2, h - 0.2, z)
    group.add(tie)
  }

  // gas mantles on brackets: a brass arm, a glass globe, the mantle's glow
  const mantleGlow = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color(GAS).multiplyScalar(1.7), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const mantleHalo = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffc870').multiplyScalar(0.9), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })
  const mantleCore = new THREE.MeshBasicMaterial({ color: new THREE.Color(GAS).multiplyScalar(1.6) })
  const globeMat = new THREE.MeshStandardMaterial({ color: '#f4ecd6', roughness: 0.25, transparent: true, opacity: 0.35, depthWrite: false })
  const lights = []
  const glows = []
  for (const m of mantles) {
    const arm = new THREE.Group()
    const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8), mats.brass)
    bracket.rotation.x = Math.PI / 2
    bracket.position.set(0, 0, 0.17)
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 14), mats.brass)
    plate.rotation.x = Math.PI / 2
    const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.028, 0.08, 10), mats.brass)
    burner.position.set(0, 0.04, 0.34)
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), mantleCore)
    core.position.set(0, 0.14, 0.34)
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), globeMat)
    globe.position.set(0, 0.15, 0.34)
    const glow = new THREE.Sprite(mantleGlow)
    glow.position.set(0, 0.14, 0.34)
    glow.scale.setScalar(0.55)
    const halo = new THREE.Sprite(mantleHalo)
    halo.position.set(0, 0.14, 0.34)
    halo.scale.setScalar(1.7)
    arm.add(bracket, plate, burner, core, globe, glow, halo)
    onWall(arm, m.side, m.at, m.y, 0.01)
    glows.push({ glow, halo, seed: Math.random() * 100 })
    if (m.light) {
      const pl = new THREE.PointLight(GAS, m.light, 12, 1.5)
      arm.localToWorld(pl.position.set(0, 0.14, 0.4))
      group.worldToLocal(pl.position)
      group.add(pl)
      lights.push({ pl, base: m.light, seed: Math.random() * 100 })
    }
  }

  // gas pendants hanging from the ceiling over the benches: a brass rod, a globe, a mantle
  for (const pd of pendants) {
    const g = new THREE.Group()
    const y = pd.y ?? 3.1
    const rodM = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, h - y, 8), mats.brass)
    rodM.position.y = (h + y) / 2
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.08, 12), mats.brass)
    cup.position.y = y + 0.02
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), mantleCore)
    core.position.y = y - 0.08
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), globeMat)
    globe.position.y = y - 0.1
    const glow = new THREE.Sprite(mantleGlow)
    glow.position.y = y - 0.09
    glow.scale.setScalar(0.7)
    const halo = new THREE.Sprite(mantleHalo)
    halo.position.y = y - 0.09
    halo.scale.setScalar(2.2)
    g.add(rodM, cup, core, globe, glow, halo)
    g.position.set(pd.x, 0, pd.z)
    group.add(g)
    glows.push({ glow, halo, seed: Math.random() * 100 })
    if (pd.light) {
      const pl = new THREE.PointLight(GAS, pd.light, 11, 1.4)
      pl.position.set(pd.x, y - 0.1, pd.z)
      group.add(pl)
      lights.push({ pl, base: pd.light, seed: Math.random() * 100 })
    }
  }

  // sash windows onto the street: white frames, glazing bars, a deep sill
  for (const [i, wdw] of windows.entries()) {
    const ww = wdw.width ?? 1.3
    const wh = 2.1
    const win = new THREE.Group()
    const tex = streetTex(5 + i * 13)
    textures.push(tex)
    const view = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ map: tex }))
    view.position.z = 0.005
    win.add(view)
    const bar = (w, hh, x, y, d = 0.07) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mats.paint)
      b.position.set(x, y, d / 2)
      win.add(b)
    }
    bar(ww + 0.16, 0.08, 0, wh / 2 + 0.04)
    bar(ww + 0.16, 0.08, 0, -wh / 2 - 0.04)
    bar(0.08, wh + 0.16, -ww / 2 - 0.04, 0)
    bar(0.08, wh + 0.16, ww / 2 + 0.04, 0)
    bar(ww, 0.08, 0, 0.02, 0.09)
    for (const gx of [-ww / 6, ww / 6]) bar(0.025, wh, gx, 0, 0.05)
    for (const gy of [-wh / 3.2, wh / 3.2, -wh / 6.4 + 0.02]) bar(ww, 0.025, 0, gy, 0.05)
    const sill = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.4, 0.06, 0.3), mats.paint)
    sill.position.set(0, -wh / 2 - 0.1, 0.12)
    win.add(sill)
    onWall(win, wdw.side, wdw.at, 2.15, 0.01)
  }

  if (door) {
    const d = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.3, 0.07), mats.darkTeak)
    frame.position.y = 1.15
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.07), mats.teak)
    leaf.position.set(0, 1.1, 0.03)
    for (const [yy, hh] of [[0.55, 0.7], [1.55, 0.8]]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.68, hh, 0.02), mats.darkTeak)
      panel.position.set(0, yy, 0.07)
      d.add(panel)
    }
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), mats.brass)
    knob.position.set(-0.36, 1.0, 0.11)
    d.add(frame, leaf, knob)
    onWall(d, door.side, door.at, 0, 0.02)
  }

  if (shelves) bottles(group, { ...shelves, z: z0 + 0.2, depth: 0.22, light, mats, seed: 77 })

  const dust = motes({ count: 160, radius: Math.min(fw, fd) / 2, y0: 0.4, y1: h - 0.4, color: '#ffe8bc', size: 0.02, opacity: 0.2, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  // warm light from above, the floor's brown from below
  group.add(new THREE.HemisphereLight('#6a5c48', '#2a1c12', light ? 0.7 : 0.55))

  return {
    group,
    mats,
    shine,
    soft,
    onWall,
    solids: roomWalls(x0, x1, z0, z1),
    env: {
      background: new THREE.Color('#0a0907'),
      fog: new THREE.Fog('#0c0a08', 14, 36),
      exposure: 1.0,
      envIntensity: 0.18,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.85 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.35, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
      // the gas flickers a little, all of it together and each mantle by itself
      for (const g of glows) {
        const k = 1 + Math.sin(t * 7 + g.seed) * 0.025 + Math.sin(t * 13.3 + g.seed * 2) * 0.02
        g.glow.scale.setScalar(0.55 * k)
        g.halo.scale.setScalar(1.7 * k)
      }
      for (const l of lights) l.pl.intensity = l.base * (1 + Math.sin(t * 7 + l.seed) * 0.03 + Math.sin(t * 13.3 + l.seed * 2) * 0.02)
    },
    dispose: () => textures.forEach(tx => tx.dispose()),
  }
}

