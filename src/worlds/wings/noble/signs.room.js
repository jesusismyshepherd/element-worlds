// The workshop itself: a brick room at night, 15 m by 18.5 m under a 5.4 m ceiling of dark beams, a
// floor of old varnished planks, enamel lamps hanging low over the work places, the doorway to the hall
// in the south wall, and the glass-bender's corner (a rack of tubing and a ribbon burner's row of blue
// flames). The neon is the light: the lamps are dim and warm.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random, hdr } from './kit.js'

export const ROOM = { x0: -7.5, x1: 7.5, z0: -12.5, z1: 6, h: 5.4 }
/** The doorway in the south wall, round the arch back to the hall. */
export const DOOR = { width: 4.5, height: 4.85 }

/** A height map as a tangent-space normal map. */
function normalMap(heights, w, h, strength) {
  return canvasTex(w, h, (g) => {
    const img = g.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const hl = heights[y * w + ((x - 1 + w) % w)]
        const hr = heights[y * w + ((x + 1) % w)]
        const hu = heights[((y - 1 + h) % h) * w + x]
        const hd = heights[((y + 1) % h) * w + x]
        const nx = (hl - hr) * strength
        const ny = (hd - hu) * strength
        const l = Math.hypot(nx, ny, 1)
        const i = (y * w + x) * 4
        img.data[i] = (nx / l * 0.5 + 0.5) * 255
        img.data[i + 1] = (ny / l * 0.5 + 0.5) * 255
        img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { srgb: false, repeat: true })
}

/** Old bricks in running bond: 8 a row, 20 rows (1.8 m by 1.5 m of wall). */
function brickTextures(light) {
  const w = light ? 256 : 512
  const h = light ? 250 : 500
  const bw = w / 8
  const bh = h / 20
  const mortar = Math.max(2, Math.round(w / 170))
  const rnd = random(11)
  const heights = new Float32Array(w * h)
  const tones = Array.from({ length: 20 * 9 }, () => 0.75 + rnd() * 0.5)
  const burnt = Array.from({ length: 20 * 9 }, () => (rnd() < 0.12 ? 0.55 : 1))
  const map = canvasTex(w, h, (g) => {
    const img = g.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      const row = Math.floor(y / bh)
      const shift = row % 2 ? bw / 2 : 0
      const yy = y - row * bh
      for (let x = 0; x < w; x++) {
        const xs = (x + shift) % w
        const col = Math.floor(xs / bw)
        const xx = xs - col * bw
        const joint = yy < mortar || xx < mortar
        const k = row * 9 + col
        const speck = rnd() * 0.18
        let r
        let gg
        let b
        if (joint) {
          r = 44 + speck * 40
          gg = 40 + speck * 36
          b = 38 + speck * 34
          heights[y * w + x] = 0
        } else {
          const t = tones[k] * burnt[k] * (0.9 + speck)
          const edge = Math.min(xx - mortar, bw - xx, yy - mortar, bh - yy) / (bh * 0.5)
          r = 120 * t
          gg = 58 * t
          b = 44 * t
          heights[y * w + x] = Math.min(1, 0.6 + edge * 0.8) - speck * 0.4
        }
        const i = (y * w + x) * 4
        img.data[i] = r
        img.data[i + 1] = gg
        img.data[i + 2] = b
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true })
  return { map, normalMap: normalMap(heights, w, h, 3.2), size: [1.8, 1.5] }
}

/** Varnished planks, 15 cm wide, in a 2.4 m square. */
function plankTextures(light) {
  const s = light ? 256 : 512
  const pw = s / 16
  const rnd = random(23)
  const heights = new Float32Array(s * s)
  const rows = Array.from({ length: 16 }, () => {
    const cuts = [rnd() * s]
    while (cuts.length < 3) cuts.push((cuts[cuts.length - 1] + s * (0.35 + rnd() * 0.3)) % s)
    return { cuts, tone: 0.8 + rnd() * 0.35, seed: rnd() * 100 }
  })
  const map = canvasTex(s, s, (g) => {
    const img = g.createImageData(s, s)
    for (let x = 0; x < s; x++) {
      const col = Math.floor(x / pw)
      const xx = x - col * pw
      const P = rows[col]
      for (let y = 0; y < s; y++) {
        const cut = P.cuts.some(c => Math.abs(((y - c + s) % s)) < 1.5)
        const seam = xx < 1.5 || cut
        const grain = 0.5 + 0.5 * Math.sin((xx * 0.9 + Math.sin(y * 0.045 + P.seed) * 3 + P.seed) * 1.7)
        const t = P.tone * (0.82 + grain * 0.18) * (0.95 + rnd() * 0.06)
        const i = (y * s + x) * 4
        img.data[i] = seam ? 22 : 74 * t
        img.data[i + 1] = seam ? 16 : 48 * t
        img.data[i + 2] = seam ? 12 : 32 * t
        img.data[i + 3] = 255
        heights[y * s + x] = seam ? 0 : 0.8 + grain * 0.05
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true })
  return { map, normalMap: normalMap(heights, s, s, 2.5), size: 2.4 }
}

/** A flat wall piece from (a0, y0) to (a1, y1) in its own plane, UVs in metres of brick. */
function wallPiece(a0, a1, y0, y1, size) {
  const g = new THREE.PlaneGeometry(a1 - a0, y1 - y0)
  const uv = g.attributes.uv
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + (a0 + a1) / 2) / size[0], (pos.getY(i) + (y0 + y1) / 2) / size[1])
  }
  g.translate((a0 + a1) / 2, (y0 + y1) / 2, 0)
  return g
}

/** The workshop; `tint` (a gas's glow colour, or null) shades its lamplight and its fill toward that
 *  gas, so each gas's room feels its own. */
export function workshopRoom({ light, tint = null }) {
  const toward = (base, k) => (tint ? new THREE.Color(base).lerp(new THREE.Color(tint), k) : new THREE.Color(base))
  const group = new THREE.Group()
  const { x0, x1, z0, z1, h } = ROOM
  const bricks = brickTextures(light)
  const wallMat = new THREE.MeshStandardMaterial({ map: bricks.map, normalMap: bricks.normalMap, normalScale: new THREE.Vector2(1.1, 1.1), roughness: 0.92, color: '#b8a8a0' })
  const planks = plankTextures(light)
  planks.map.repeat.set(1 / planks.size, 1 / planks.size)
  planks.normalMap.repeat.copy(planks.map.repeat)
  const floorMat = new THREE.MeshStandardMaterial({ map: planks.map, normalMap: planks.normalMap, roughness: 0.55, metalness: 0.05, color: '#c9b8a8' })
  // shared plain materials for everything in the room (one shader program for all of them)
  const mats = {
    dark: new THREE.MeshStandardMaterial({ color: '#23252c', roughness: 0.55, metalness: 0.45 }),
    metal: new THREE.MeshStandardMaterial({ color: '#8b919c', roughness: 0.35, metalness: 0.85 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b8904a', roughness: 0.32, metalness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ color: '#5a3d2a', roughness: 0.7, metalness: 0.02 }),
    top: new THREE.MeshStandardMaterial({ color: '#3b3330', roughness: 0.8, metalness: 0.05 }),
    beam: new THREE.MeshStandardMaterial({ color: '#2a201a', roughness: 0.85 }),
    black: new THREE.MeshStandardMaterial({ color: '#0e0f13', roughness: 0.5, metalness: 0.2 }),
    paper: new THREE.MeshStandardMaterial({ color: '#e7e1d2', roughness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe3f0', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.28, depthWrite: false }),
    floor: floorMat,
    wall: wallMat,
  }

  // the floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  // planks in world metres: shift the UVs to start at the room's corner
  const fuv = floor.geometry.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fuv.getX(i) * (x1 - x0), fuv.getY(i) * (z1 - z0))
  group.add(floor)

  // the walls: north, west, east whole; south round the doorway
  const add = (geo, x, z, rotY) => {
    const m = new THREE.Mesh(geo, wallMat)
    m.position.set(x, 0, z)
    m.rotation.y = rotY
    group.add(m)
    return m
  }
  // (a wall turned by +90 degrees runs its x along -z, one turned by -90 degrees along +z)
  add(wallPiece(x0, x1, 0, h, bricks.size), 0, z0, 0)
  add(wallPiece(-z1, -z0, 0, h, bricks.size), x0, 0, Math.PI / 2)
  add(wallPiece(z0, z1, 0, h, bricks.size), x1, 0, -Math.PI / 2)
  const dw = DOOR.width / 2
  add(wallPiece(-x1, -dw, 0, h, bricks.size), 0, z1, Math.PI)
  add(wallPiece(dw, -x0, 0, h, bricks.size), 0, z1, Math.PI)
  add(wallPiece(-dw, dw, DOOR.height, h, bricks.size), 0, z1, Math.PI)
  // the dark passage behind the doorway (only the arch's portal is seen through it)
  const passage = new THREE.Mesh(new THREE.PlaneGeometry(DOOR.width + 0.4, DOOR.height + 0.3), new THREE.MeshBasicMaterial({ color: '#040408' }))
  passage.position.set(0, DOOR.height / 2, z1 + 0.6)
  passage.rotation.y = Math.PI
  group.add(passage)
  // a skirting of dark wood all round
  const skirt = (len, x, z, rotY) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.14, 0.03), mats.beam)
    m.position.set(x, 0.07, z)
    m.rotation.y = rotY
    group.add(m)
  }
  skirt(x1 - x0, 0, z0 + 0.015, 0)
  skirt(z1 - z0, x0 + 0.015, (z0 + z1) / 2, Math.PI / 2)
  skirt(z1 - z0, x1 - 0.015, (z0 + z1) / 2, Math.PI / 2)
  skirt(x1 - dw - 0.1, (x1 + dw) / 2 + 0.05, z1 - 0.015, 0)
  skirt(x1 - dw - 0.1, -(x1 + dw) / 2 - 0.05, z1 - 0.015, 0)

  // the ceiling and its beams
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshStandardMaterial({ color: '#17130f', roughness: 0.95 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, h, (z0 + z1) / 2)
  group.add(ceil)
  for (let z = z1 - 1.6; z > z0 + 0.5; z -= 3) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.32, 0.24), mats.beam)
    beam.position.set(0, h - 0.16, z)
    group.add(beam)
  }

  // hanging enamel lamps: dim and warm (only some carry a light, to keep the count of lights small)
  const shadeGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0.03, 0.2), new THREE.Vector2(0.06, 0.19), new THREE.Vector2(0.1, 0.12), new THREE.Vector2(0.24, 0.0),
    new THREE.Vector2(0.255, -0.01),
  ], 28)
  const shadeMat = new THREE.MeshStandardMaterial({ color: '#2e4a3c', roughness: 0.45, metalness: 0.3, side: THREE.DoubleSide })
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff2d8', emissive: toward('#ffd49a', 0.3), emissiveIntensity: 2.4 })
  const lights = []
  const lamp = (x, z, drop, withLight) => {
    const y = h - drop
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drop, 5), mats.black)
    cord.position.set(x, h - drop / 2, z)
    const shade = new THREE.Mesh(shadeGeo, shadeMat)
    shade.position.set(x, y - 0.2, z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), bulbMat)
    bulb.position.set(x, y - 0.15, z)
    group.add(cord, shade, bulb)
    if (withLight) {
      const l = new THREE.PointLight(toward('#ffcf95', 0.32), 7, 9, 2)
      l.position.set(x, y - 0.3, z)
      group.add(l)
      lights.push(l)
    }
  }
  lamp(-5.1, -2.8, 1.25, true) // over the filling bench
  lamp(0, -9.8, 1.4, !light) // over the sign-maker's desk
  lamp(-5.2, 3.3, 1.3, !light) // over the glass-bender's table
  lamp(3.6, 2.4, 1.5, false)

  // the glass-bender's corner: a rack of tubing on the wall and a table with a ribbon burner
  const rack = new THREE.Group()
  for (const y of [1.15, 1.55]) {
    for (const z of [1.3, 4.6]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), mats.dark)
      arm.position.set(x0 + 0.11, y, z)
      rack.add(arm)
    }
  }
  const rodGeo = new THREE.CylinderGeometry(0.008, 0.008, 3.8, 8)
  for (let i = 0; i < 9; i++) {
    const rod = new THREE.Mesh(rodGeo, mats.glass)
    rod.rotation.x = Math.PI / 2
    rod.position.set(x0 + 0.06 + (i % 3) * 0.035, i < 5 ? 1.18 : 1.58, 2.95)
    rod.renderOrder = 3
    rack.add(rod)
  }
  group.add(rack)
  const table = new THREE.Group()
  const tTop = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.06, 0.8, 2, 0.02), mats.top)
  tTop.position.y = 0.9
  table.add(tTop)
  for (const [lx, lz] of [[-1, -0.32], [1, -0.32], [-1, 0.32], [1, 0.32]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 0.06), mats.dark)
    leg.position.set(lx, 0.44, lz)
    table.add(leg)
  }
  const burner = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.07), mats.metal)
  burner.position.set(0, 0.97, 0)
  table.add(burner)
  const flameGeo = new THREE.ConeGeometry(0.012, 0.07, 6)
  const flames = new THREE.InstancedMesh(flameGeo, new THREE.MeshBasicMaterial({ color: hdr('#5b8cff', 2.2), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }), 22)
  const fm = new THREE.Matrix4()
  for (let i = 0; i < 22; i++) flames.setMatrixAt(i, fm.makeTranslation(-0.42 + i * 0.04, 1.04, 0))
  table.add(flames)
  // a bent tube waiting on the table, and a pattern drawing under it
  const pattern = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6), mats.paper)
  pattern.rotation.x = -Math.PI / 2
  pattern.position.set(0.55, 0.932, 0.05)
  table.add(pattern)
  table.position.set(-5.3, 0, 3.4)
  table.rotation.y = Math.PI / 2
  group.add(table)

  // a faint fill so nothing is pitch black
  const fill = new THREE.HemisphereLight(toward('#5a6488', 0.45), '#2a1c16', light ? 1.1 : 0.8)
  group.add(fill)

  let flicker = 0
  return {
    group,
    mats,
    lights,
    update(dt, t) {
      // the burner's flames dance a little
      flicker += dt
      if (flicker > 0.05) {
        flicker = 0
        for (let i = 0; i < 22; i++) {
          const s = 0.85 + 0.3 * Math.abs(Math.sin(t * 13 + i * 1.7))
          fm.makeScale(1, s, 1).setPosition(-0.42 + i * 0.04, 1.03 + 0.035 * s, 0)
          flames.setMatrixAt(i, fm)
        }
        flames.instanceMatrix.needsUpdate = true
      }
    },
  }
}
