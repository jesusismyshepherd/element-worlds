// A stage for picture rooms (docs/knowledge/picture-rooms.md): a window factory at dusk in winter, its big
// doors open onto a snowy yard where snow is falling. It is the cold laboratory's hall (stages/coldlab.js:
// painted block walls, a concrete floor, steel trusses and strip lights, ribbed steel doors, a fenced
// apron, far hills, the sky's last glow) without the frosted pipes, with the yard and the land beyond
// under snow, dark spruces along the far edge and flakes drifting down past the doors. Walking inside the
// hall (x0..x1, z0..z1) and, through the doors, the yard. For the scene: everything coldLabStage gives
// (`mats`, `pipeRun`, `puffs`, `solids`, `env`, `cameraBounds`), plus `setSnow(k)` (0 none to 1 heavy: how
// many of the yard's flakes fall), `flakes({ x0,
// x1, z0, z1, y1, count })` (more falling snow somewhere else, a porch; its `k` is 0 to 1, how many fall) and `snowMaterial`. Snow, like
// the stage's other big pale things, stays mid-toned: pure white blooms the whole view white
// (picture-rooms.md, "Traps met").
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { coldLabStage } from './coldlab.js'

/** A soft round flake (shared by every cloud of flakes). */
function flakeTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.45, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export function glazingStage({ light = false, x0 = -10, x1 = 10, z0 = -6, z1 = 8, h = 5.5, door = { at: 0, width: 6, height: 4.2 }, yard = { x0: -14, x1: 14, depth: 30 }, glow = [-0.5, -1] } = {}) {
  const base = coldLabStage({ light, x0, x1, z0, z1, h, door, yard, glow })
  const group = base.group
  const T = 0.3
  const textures = []
  const geos = []
  const mats = []

  // a window factory has no frosted pipes: hide the ones the cold laboratory runs along its west wall
  group.traverse(o => {
    if (o.isMesh && o.geometry?.type === 'TubeGeometry' && o.material === base.frost) o.visible = false
  })

  // ---- snow over the yard and the land beyond (mid-toned: the dusk light makes it bright enough) ----
  const snowMaterial = new THREE.MeshStandardMaterial({ color: '#8a96b0', roughness: 1, emissive: '#1b2238', emissiveIntensity: 0.35 })
  mats.push(snowMaterial)
  {
    const yw = yard.x1 - yard.x0
    const geo = new THREE.PlaneGeometry(yw, yard.depth)
    geos.push(geo)
    const apron = new THREE.Mesh(geo, snowMaterial)
    apron.rotation.x = -Math.PI / 2
    apron.position.set((yard.x0 + yard.x1) / 2, 0.012, z0 - T - yard.depth / 2 + T / 2)
    group.add(apron)
    const farMat = new THREE.MeshStandardMaterial({ color: '#4a5572', roughness: 1 })
    mats.push(farMat)
    const far = new THREE.Mesh(new THREE.CircleGeometry(285, 48), farMat)
    geos.push(far.geometry)
    far.rotation.x = -Math.PI / 2
    far.position.y = -0.008
    group.add(far)
  }

  // ---- spruces along the far edge of the yard and out over the land ----
  {
    const rnd = random(41)
    const treeMat = new THREE.MeshStandardMaterial({ color: '#1d3a2c', roughness: 0.9 })
    const capMat = new THREE.MeshStandardMaterial({ color: '#8f9bb5', roughness: 1, emissive: '#1b2238', emissiveIntensity: 0.3 })
    mats.push(treeMat, capMat)
    const body = new THREE.ConeGeometry(1.25, 3.4, 7)
    const cap = new THREE.ConeGeometry(0.9, 1.5, 7)
    geos.push(body, cap)
    const n = light ? 36 : 70
    const trees = new THREE.InstancedMesh(body, treeMat, n)
    const caps = new THREE.InstancedMesh(cap, capMat, n)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const yz0 = z0 - yard.depth
    for (let i = 0; i < n; i++) {
      const x = yard.x0 - 22 + rnd() * (yard.x1 - yard.x0 + 44)
      const z = yz0 - 2 - rnd() * 40
      const s = 0.8 + rnd() * 1.1
      m.compose(new THREE.Vector3(x, 1.7 * s, z), q, new THREE.Vector3(s, s, s))
      trees.setMatrixAt(i, m)
      m.compose(new THREE.Vector3(x, 2.6 * s + 0.2, z), q, new THREE.Vector3(s * 0.95, s * 0.7, s * 0.95))
      caps.setMatrixAt(i, m)
    }
    group.add(trees, caps)
  }

  // ---- falling snow: clouds of flakes in boxes ----
  const map = flakeTex()
  textures.push(map)
  const clouds = []
  /** Flakes falling through a box: `count`, from `y1` down to the floor, drifting a little in the wind. */
  function flakes({ x0: bx0, x1: bx1, z0: bz0, z1: bz1, y1 = 8, count = 600, size = 0.075, seed = 3 }) {
    const n = light ? Math.round(count / 2.4) : count
    const rnd = random(seed)
    const pos = new Float32Array(n * 3)
    const seeds = []
    for (let i = 0; i < n; i++) seeds.push({ x: rnd(), y: rnd(), z: rnd(), s: 0.55 + rnd() * 0.6, ph: rnd() * 6.28 })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geos.push(geo)
    const mat = new THREE.PointsMaterial({ color: '#dfe7f7', size, map, transparent: true, opacity: 0.85, depthWrite: false, sizeAttenuation: true })
    mats.push(mat)
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.raycast = () => {}
    group.add(pts)
    const c = { k: 1, n, pts, seeds, pos, geo, bx0, bx1, bz0, bz1, y1 }
    clouds.push(c)
    return c
  }
  const yardSnow = flakes({ x0: yard.x0 - 4, x1: yard.x1 + 4, z0: z0 - yard.depth, z1: z0 - 0.4, y1: 9, count: 900, seed: 3 })
  yardSnow.k = 0.7
  const baseUpdate = base.update
  function updateFlakes(t) {
    for (const c of clouds) {
      const live = Math.round(c.n * Math.min(1, c.k))
      for (let i = 0; i < c.n; i++) {
        const s = c.seeds[i]
        const fall = (((s.y - t * 0.09 * s.s) % 1) + 1) % 1
        c.pos[i * 3] = c.bx0 + s.x * (c.bx1 - c.bx0) + Math.sin(t * 0.6 + s.ph) * 0.35 + (1 - fall) * 1.2
        c.pos[i * 3 + 1] = i < live ? 0.05 + fall * c.y1 : -50
        c.pos[i * 3 + 2] = c.bz0 + s.z * (c.bz1 - c.bz0) + Math.cos(t * 0.5 + s.ph) * 0.3
      }
      c.geo.attributes.position.needsUpdate = true
    }
  }

  return {
    ...base,
    snowMaterial,
    flakes: opts => {
      const c = flakes(opts)
      c.k = opts.k ?? 1
      return c
    },
    /** 0 (no snow) to 1 (heavy): how many of the yard's flakes fall. */
    setSnow(k) {
      yardSnow.k = Math.max(0, Math.min(1, k))
    },
    update(t) {
      baseUpdate(t)
      updateFlakes(t)
    },
    dispose() {
      base.dispose()
      textures.forEach(t => t.dispose())
      geos.forEach(g => g.dispose())
      mats.forEach(m => m.dispose())
    },
  }
}
