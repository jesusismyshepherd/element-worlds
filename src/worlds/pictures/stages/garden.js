// A stage for picture rooms (docs/knowledge/picture-rooms.md): a formal French garden on a winter
// afternoon, as the Tuileries in Paris were in 1783. A wide gravel square roped off for an event, the
// crowd behind the ropes on three sides, lawn parterres edged with clipped box and cones of yew beyond
// them, groves of bare chestnut and lime trees in rows, a round basin, the long palace front with its
// domed middle pavilion at the east end (-z), the roofs of the city all round in the haze, and a high
// winter sky with a low sun. The sky is tall and open: a balloon can rise into it and drift far away.
//
// Walking inside the ropes (x0..x1, z0..z1). `sun`: the direction toward the sun (the afternoon sun of
// December is low, from the south-west: +x is south here, +z west, the palace east at -z). `crowd.cheer(k)` (0 to 1) sets how
// hard the crowd bobs and waves its hats; `crowd.look(x, z)` turns it toward a point. `mats`: plain
// materials for a scene's things (wood, darkWood, iron, brass, gold, rope, stone, cloth). Big surfaces stay
// mid-toned: pale ones bloom to white under a bright sky. Exports `bareTreeGeometry` (a leafless tree).
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { cloudTexture } from './meadow.js'
import { box } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** Raked gravel: a fawn ground with small stones, darker and lighter (UVs in metres, 4 m to the tile). */
function gravelTex(light) {
  const s = light ? 256 : 512
  const rnd = random(5)
  return canvasTex(s, s, g => {
    g.fillStyle = '#a99a7e'
    g.fillRect(0, 0, s, s)
    const n = light ? 2600 : 9000
    for (let i = 0; i < n; i++) {
      const x = rnd() * s
      const y = rnd() * s
      const r = 0.6 + rnd() * (s / 260)
      const v = rnd()
      g.fillStyle = v < 0.4 ? `rgba(110,96,74,${0.35 + rnd() * 0.3})` : v < 0.8 ? `rgba(214,204,182,${0.3 + rnd() * 0.3})` : `rgba(150,128,100,${0.4 + rnd() * 0.3})`
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          g.beginPath()
          g.arc(x + dx, y + dy, r, 0, TAU)
          g.fill()
        }
      }
    }
    // the rake's faint lines along the walk
    g.strokeStyle = 'rgba(90,78,60,0.06)'
    g.lineWidth = 2
    for (let y = 0; y < s; y += s / 32) {
      g.beginPath()
      g.moveTo(0, y + rnd() * 2)
      g.lineTo(s, y + rnd() * 2)
      g.stroke()
    }
  }, { repeat: true })
}

/** Winter lawn: a dull green with paler and browner patches (UVs in metres, 6 m to the tile). */
function lawnTex(light) {
  const s = light ? 128 : 256
  const rnd = random(9)
  return canvasTex(s, s, g => {
    g.fillStyle = '#5f7146'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 700; i++) {
      const x = rnd() * s
      const y = rnd() * s
      g.fillStyle = rnd() < 0.5 ? `rgba(122,128,80,${0.12 + rnd() * 0.15})` : `rgba(52,70,40,${0.15 + rnd() * 0.2})`
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          g.beginPath()
          g.ellipse(x + dx, y + dy, 2 + rnd() * 8, 1 + rnd() * 4, rnd() * Math.PI, 0, TAU)
          g.fill()
        }
      }
    }
  }, { repeat: true })
}

/** One bay of the palace front: two storeys of tall arched windows between pilasters, an attic window (a
 *  canvas 4 m wide by 16 m tall). */
function facadeTex() {
  return canvasTex(128, 512, (g, w, h) => {
    g.fillStyle = '#c7b89a'
    g.fillRect(0, 0, w, h)
    // courses of stone
    g.strokeStyle = 'rgba(120,104,80,0.25)'
    g.lineWidth = 1
    for (let y = 0; y < h; y += 12) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(w, y)
      g.stroke()
    }
    // pilasters at the bay's edges
    g.fillStyle = '#d3c6aa'
    g.fillRect(0, 0, 10, h)
    g.fillRect(w - 10, 0, 10, h)
    // a cornice between the storeys
    g.fillStyle = '#b1a283'
    g.fillRect(0, h * 0.47, w, 10)
    g.fillRect(0, h * 0.12, w, 8)
    const win = (y0, y1) => {
      const x0 = w * 0.3
      const x1 = w * 0.7
      g.fillStyle = '#3d4554'
      g.fillRect(x0, y0 + (x1 - x0) / 2, x1 - x0, y1 - y0 - (x1 - x0) / 2)
      g.beginPath()
      g.arc(w / 2, y0 + (x1 - x0) / 2, (x1 - x0) / 2, Math.PI, 0)
      g.fill()
      // glazing bars
      g.strokeStyle = 'rgba(200,190,170,0.7)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(w / 2, y0 + 4)
      g.lineTo(w / 2, y1)
      for (let y = y0 + (x1 - x0) / 2 + 14; y < y1; y += 18) {
        g.moveTo(x0, y)
        g.lineTo(x1, y)
      }
      g.stroke()
      // a stone surround
      g.strokeStyle = '#b5a587'
      g.lineWidth = 4
      g.strokeRect(x0 - 3, y0 + (x1 - x0) / 2, x1 - x0 + 6, y1 - y0 - (x1 - x0) / 2 + 2)
    }
    win(h * 0.55, h * 0.95)
    win(h * 0.16, h * 0.44)
    // the attic's small window
    g.fillStyle = '#4a4f5c'
    g.fillRect(w * 0.38, h * 0.02, w * 0.24, h * 0.07)
  })
}

/** The roofs of Paris all round, far off in the haze: stone houses with slate mansards and chimneys, a few
 *  domes and spires (transparent above). */
function skylineTex(light) {
  const w = light ? 1024 : 2048
  const h = 256
  const rnd = random(77)
  return canvasTex(w, h, g => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#a7a7ac'
    for (let x = 0; x < w; x += 5) {
      const y = h - 64 - Math.sin(x * 0.011) * 7 - rnd() * 9
      g.fillRect(x, y, 5, h - y)
    }
    // domes and spires
    for (const [cx, r] of [[w * 0.17, 22], [w * 0.47, 30], [w * 0.8, 18]]) {
      g.fillStyle = '#979aa2'
      g.fillRect(cx - r * 0.75, h - 112, r * 1.5, 52)
      g.beginPath()
      g.ellipse(cx, h - 112, r * 0.8, r, 0, Math.PI, 0)
      g.fill()
      g.fillRect(cx - 2, h - 112 - r - 14, 4, 14)
    }
    for (const cx of [w * 0.3, w * 0.33, w * 0.62, w * 0.93]) {
      g.fillStyle = '#93969e'
      g.fillRect(cx - 7, h - 118, 14, 60)
      g.beginPath()
      g.moveTo(cx - 8, h - 118)
      g.lineTo(cx, h - 166)
      g.lineTo(cx + 8, h - 118)
      g.fill()
    }
    let x = -8
    while (x < w) {
      const bw = 40 + rnd() * 60
      const top = h - 48 - rnd() * 30
      const stone = 178 + rnd() * 22
      g.fillStyle = `rgb(${stone},${stone - 6},${stone - 18})`
      g.fillRect(x, top, bw, h - top)
      g.fillStyle = rnd() < 0.5 ? '#7a8290' : '#6d7482'
      g.beginPath()
      g.moveTo(x - 2, top)
      g.lineTo(x + 5, top - 15)
      g.lineTo(x + bw - 5, top - 15)
      g.lineTo(x + bw + 2, top)
      g.fill()
      g.fillStyle = '#8f7a6c'
      for (let k = 0; k < 2; k++) g.fillRect(x + 6 + rnd() * (bw - 16), top - 24, 5, 10)
      g.fillStyle = 'rgba(80,86,100,0.6)'
      for (let wy = top + 7; wy < h - 10; wy += 14) for (let wx = x + 5; wx < x + bw - 6; wx += 10) g.fillRect(wx, wy, 4, 8)
      x += bw + 1
    }
  })
}

/** A leafless tree (a chestnut or a lime in December): a trunk that forks into limbs, branches and twigs,
 *  as one geometry about `height` tall. */
export function bareTreeGeometry(seed = 1, { height = 13, levels = 4, light = false } = {}) {
  const rnd = random(seed)
  const parts = []
  const up = new THREE.Vector3(0, 1, 0)
  const radial = light ? 4 : 5
  function limb(from, dir, len, r, level) {
    const to = from.clone().addScaledVector(dir, len)
    const geo = new THREE.CylinderGeometry(r * 0.68, r, len, radial, 1, true)
    geo.translate(0, len / 2, 0)
    geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir))
    geo.translate(from.x, from.y, from.z)
    parts.push(geo)
    if (level >= levels) return
    const n = level === 0 ? 4 + Math.floor(rnd() * 2) : 2 + Math.floor(rnd() * 2)
    const turn = rnd() * TAU
    for (let i = 0; i < n; i++) {
      const a = turn + (i / n) * TAU + (rnd() - 0.5) * 0.8
      // the first limbs spread wide, the twigs reach up and out
      const spread = level === 0 ? 0.55 + rnd() * 0.3 : 0.35 + rnd() * 0.4
      const d = dir.clone().multiplyScalar(Math.cos(spread)).add(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(Math.sin(spread)))
      d.y += 0.25
      d.normalize()
      const start = level === 0 ? from.clone().lerp(to, 0.82 + rnd() * 0.15) : from.clone().lerp(to, 0.45 + rnd() * 0.5)
      limb(start, d, len * (0.55 + rnd() * 0.2), r * 0.6, level + 1)
    }
  }
  limb(new THREE.Vector3(0, 0, 0), new THREE.Vector3((rnd() - 0.5) * 0.08, 1, (rnd() - 0.5) * 0.08).normalize(), height * 0.36, height * 0.022, 0)
  const merged = mergeGeometries(parts)
  for (const p of parts) p.dispose()
  return merged
}

/**
 * The garden. Returns { group, mats, solids, env, cameraBounds, sunDir, crowd, update, dispose }.
 */
export function gardenStage({ light = false, x0 = -11, x1 = 11, z0 = -13, z1 = 14, sun = [0.62, 0.2, 0.76], palaceZ = -150 } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const tex = t => (textures.push(t), t)
  const geo = g => (geos.push(g), g)
  const sunDir = new THREE.Vector3(...sun).normalize()
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2

  const mats = {
    wood: new THREE.MeshStandardMaterial({ color: '#7d5d3e', roughness: 0.8 }),
    darkWood: new THREE.MeshStandardMaterial({ color: '#4c3727', roughness: 0.8 }),
    iron: new THREE.MeshStandardMaterial({ color: '#3d4046', roughness: 0.55, metalness: 0.6 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b48d3e', roughness: 0.35, metalness: 0.8 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d2a23c', roughness: 0.35, metalness: 0.75, emissive: '#3a2604', emissiveIntensity: 0.4 }),
    rope: new THREE.MeshStandardMaterial({ color: '#a8916a', roughness: 0.95 }),
    stone: new THREE.MeshStandardMaterial({ color: '#b2a78f', roughness: 0.9 }),
    cloth: new THREE.MeshStandardMaterial({ color: '#8b7556', roughness: 0.95 }),
  }

  // ---- the sky: a high winter blue, hazy and warm toward the low sun, a little violet opposite ----
  const skyU = {
    uSun: { value: sunDir.clone() },
    uZen: { value: new THREE.Color('#2f5c9e') },
    uHor: { value: new THREE.Color('#c4bcbc') },
    uGlow: { value: new THREE.Color('#ffb36e') },
    uDusk: { value: new THREE.Color('#5b4a72') },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(900, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: 'varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: /* glsl */ `
        uniform vec3 uSun; uniform vec3 uZen; uniform vec3 uHor; uniform vec3 uGlow; uniform vec3 uDusk;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 c = h > 0.0 ? mix(uHor, uZen, pow(clamp(h, 0.0, 1.0), 0.42)) : uHor * 0.92;
          float s = clamp(dot(d, uSun), -1.0, 1.0);
          float near = max(s, 0.0);
          float low = 1.0 - clamp(h * 2.2, 0.0, 1.0);
          c += uGlow * (pow(near, 5.0) * 0.32 * low + pow(near, 40.0) * 0.45 + pow(near, 400.0) * 0.8);
          c = mix(c, uDusk, clamp(-s, 0.0, 1.0) * low * 0.28);
          float a = acos(s);
          c = mix(c, vec3(2.4, 2.0, 1.45), 1.0 - smoothstep(0.02, 0.026, a));
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  sky.frustumCulled = false
  group.add(sky)

  // a few soft clouds, warm on the sun's side
  const cTex = tex(cloudTexture(8))
  const cloudMat = new THREE.MeshBasicMaterial({ map: cTex, transparent: true, depthWrite: false, fog: false, color: '#f4e6dc', opacity: 0.75 })
  for (const [a, el, d, w] of [[0.4, 0.13, 600, 260], [1.3, 0.2, 640, 200], [2.5, 0.1, 620, 300], [3.6, 0.17, 600, 230], [4.6, 0.09, 640, 320], [5.5, 0.24, 620, 180]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.4), cloudMat)
    m.position.set(Math.cos(a) * Math.cos(el) * d, Math.sin(el) * d, Math.sin(a) * Math.cos(el) * d)
    m.lookAt(0, m.position.y * 0.5, 0)
    m.renderOrder = -9
    geo(m.geometry)
    group.add(m)
  }

  // ---- the ground: winter lawn everywhere, the gravel of the square and the walks over it ----
  const lawnT = tex(lawnTex(light))
  const lawnMat = new THREE.MeshStandardMaterial({ map: lawnT, color: '#b9c2a6', roughness: 1 })
  {
    const g = geo(new THREE.CircleGeometry(700, 48))
    const uv = g.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - 0.5) * 1400 / 6, (uv.getY(i) - 0.5) * 1400 / 6)
    const lawn = new THREE.Mesh(g, lawnMat)
    lawn.rotation.x = -Math.PI / 2
    lawn.position.y = -0.02
    lawn.receiveShadow = true
    group.add(lawn)
  }
  const gravelT = tex(gravelTex(light))
  const gravelMat = new THREE.MeshStandardMaterial({ map: gravelT, color: '#cfc5b0', roughness: 0.95 })
  const flat = (w, d, x, z, mat, y = 0) => {
    const g = geo(new THREE.PlaneGeometry(w, d))
    const uv = g.attributes.uv
    const k = mat === gravelMat ? 4 : 6
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w + x) / k, (uv.getY(i) * d - z) / k)
    const m = new THREE.Mesh(g, mat)
    m.rotation.x = -Math.PI / 2
    m.position.set(x, y, z)
    m.receiveShadow = true
    group.add(m)
    return m
  }
  // the square and the great walk to the palace, gravel; parterres of lawn on each side, gravel paths
  // between them
  flat(84, 40 - palaceZ + 6, 0, (40 + palaceZ - 6) / 2, gravelMat)
  const parterres = []
  for (const s of [-1, 1]) for (let i = 0; i < 7; i++) parterres.push({ x: s * 27, z: z0 - 45 + i * 13, w: 17, d: 10 })
  for (const p of parterres) flat(p.w, p.d, p.x, p.z, lawnMat, 0.012)

  // box borders round each parterre, cones of yew at their corners
  {
    const boxMat = new THREE.MeshStandardMaterial({ color: '#2f4a2c', roughness: 0.9 })
    const hedge = geo(new THREE.BoxGeometry(1, 1, 1))
    const n = parterres.length * 4
    const hedges = new THREE.InstancedMesh(hedge, boxMat, n)
    const yewGeo = geo(new THREE.ConeGeometry(0.75, 2.6, light ? 8 : 12, 1))
    yewGeo.translate(0, 1.5, 0)
    const yews = new THREE.InstancedMesh(yewGeo, new THREE.MeshStandardMaterial({ color: '#2a4329', roughness: 0.85 }), parterres.length * 4)
    const d = new THREE.Object3D()
    let k = 0
    let j = 0
    for (const p of parterres) {
      for (const [w, dd, x, z] of [[p.w, 0.45, p.x, p.z - p.d / 2], [p.w, 0.45, p.x, p.z + p.d / 2], [0.45, p.d, p.x - p.w / 2, p.z], [0.45, p.d, p.x + p.w / 2, p.z]]) {
        d.position.set(x, 0.2, z)
        d.rotation.set(0, 0, 0)
        d.scale.set(w, 0.4, dd)
        d.updateMatrix()
        hedges.setMatrixAt(k++, d.matrix)
      }
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        d.position.set(p.x + sx * p.w / 2, 0, p.z + sz * p.d / 2)
        d.scale.setScalar(1)
        d.updateMatrix()
        yews.setMatrixAt(j++, d.matrix)
      }
    }
    group.add(hedges, yews)
  }

  // ---- the round basin, its water still in winter ----
  {
    const bx = 0
    const bz = z0 - 22
    const r = 8
    const rim = new THREE.Mesh(geo(new THREE.TorusGeometry(r, 0.32, 8, 64)), mats.stone)
    rim.rotation.x = Math.PI / 2
    rim.position.set(bx, 0.28, bz)
    const water = new THREE.Mesh(geo(new THREE.CircleGeometry(r, 48)), new THREE.MeshStandardMaterial({ color: '#4d6176', roughness: 0.12, metalness: 0.55 }))
    water.rotation.x = -Math.PI / 2
    water.position.set(bx, 0.16, bz)
    group.add(rim, water)
  }

  // ---- the groves: bare trees in rows on both sides, beyond the parterres ----
  {
    const barkMat = new THREE.MeshStandardMaterial({ color: '#4f4238', roughness: 0.95 })
    const kinds = light ? [bareTreeGeometry(3, { light, levels: 3 }), bareTreeGeometry(8, { light, levels: 3 })] : [bareTreeGeometry(3), bareTreeGeometry(8), bareTreeGeometry(15, { height: 15 })]
    kinds.forEach(geo)
    const step = light ? 9 : 7
    const spots = []
    for (const s of [-1, 1]) {
      for (let x = 41; x < 92; x += step) {
        for (let z = palaceZ + 12; z < 70; z += step) {
          const shift = (Math.round((x - 41) / step) % 2) * step * 0.5
          spots.push([s * x, z + shift])
        }
      }
      // two rows along the walk toward the palace, past the square
      for (let z = palaceZ + 14; z < z0 - 22; z += step) {
        spots.push([s * 13, z])
        spots.push([s * 19, z + step / 2])
      }
    }
    const rnd = random(31)
    const lists = kinds.map(() => [])
    for (const [x, z] of spots) lists[Math.floor(rnd() * kinds.length)].push([x + (rnd() - 0.5) * 1.2, z + (rnd() - 0.5) * 1.2, 0.8 + rnd() * 0.35, rnd() * TAU])
    const d = new THREE.Object3D()
    kinds.forEach((g, i) => {
      const list = lists[i]
      const m = new THREE.InstancedMesh(g, barkMat, Math.max(1, list.length))
      list.forEach(([x, z, s, a], j) => {
        d.position.set(x, 0, z)
        d.rotation.set(0, a, 0)
        d.scale.setScalar(s)
        d.updateMatrix()
        m.setMatrixAt(j, d.matrix)
      })
      m.count = list.length
      group.add(m)
    })
  }

  // ---- the palace at the end of the walk: a long front, side pavilions, the domed middle pavilion ----
  {
    const ft = tex(facadeTex())
    ft.wrapS = THREE.RepeatWrapping
    const stone = new THREE.MeshStandardMaterial({ color: '#c3b597', roughness: 0.9 })
    const slate = new THREE.MeshStandardMaterial({ color: '#5d6573', roughness: 0.6, metalness: 0.15 })
    const block = (x, w, h, d, extraZ = 0) => {
      const front = new THREE.MeshStandardMaterial({ map: ft.clone(), color: '#d8cdb4', roughness: 0.9 })
      front.map.repeat.set(w / 4, 1)
      front.map.needsUpdate = true
      textures.push(front.map)
      const m = new THREE.Mesh(geo(new THREE.BoxGeometry(w, h, d)), [stone, stone, stone, stone, front, stone])
      m.position.set(x, h / 2, palaceZ + extraZ)
      group.add(m)
      // a slate mansard roof
      const shape = new THREE.Shape()
      shape.moveTo(-d / 2, 0)
      shape.lineTo(d / 2, 0)
      shape.lineTo(d / 2 - 1.6, h * 0.32)
      shape.lineTo(-d / 2 + 1.6, h * 0.32)
      shape.closePath()
      const rg = geo(new THREE.ExtrudeGeometry(shape, { depth: w, bevelEnabled: false }))
      rg.translate(0, 0, -w / 2)
      rg.rotateY(Math.PI / 2)
      const roof = new THREE.Mesh(rg, slate)
      roof.position.set(x, h, palaceZ + extraZ)
      group.add(roof)
      return m
    }
    block(0, 150, 15, 14)
    for (const s of [-1, 1]) block(s * 48, 20, 19, 18, 1)
    block(0, 26, 22, 20, 2)
    // the middle pavilion's square dome, and a lantern on top
    const dome = new THREE.Mesh(geo(new THREE.CylinderGeometry(4, 12, 9, 4, 1)), slate)
    dome.rotation.y = Math.PI / 4
    dome.position.set(0, 22 + 4.5, palaceZ + 2)
    dome.scale.set(1, 1, 0.82)
    const lantern = new THREE.Mesh(geo(new THREE.CylinderGeometry(1.2, 1.6, 4, 8)), slate)
    lantern.position.set(0, 33, palaceZ + 2)
    group.add(dome, lantern)
  }

  // ---- the city's roofs all round, far off ----
  {
    const skyline = tex(skylineTex(light))
    skyline.wrapS = THREE.RepeatWrapping
    skyline.repeat.set(3, 1)
    const ring = new THREE.Mesh(
      geo(new THREE.CylinderGeometry(260, 260, 36, 64, 1, true)),
      new THREE.MeshBasicMaterial({ map: skyline, transparent: true, alphaTest: 0.4, side: THREE.BackSide, fog: true, color: '#d8d6d6' }),
    )
    ring.position.set(0, 16, cz)
    group.add(ring)
  }

  // ---- the ropes round the square, on posts ----
  const solids = []
  {
    const P = 2.5
    const lines = [
      [x0 - 0.5, z1 + 0.5, x0 - 0.5, z0 - 0.5],
      [x0 - 0.5, z0 - 0.5, x1 + 0.5, z0 - 0.5],
      [x1 + 0.5, z0 - 0.5, x1 + 0.5, z1 + 0.5],
      [x1 + 0.5, z1 + 0.5, x0 - 0.5, z1 + 0.5],
    ]
    const posts = []
    const ropes = []
    for (const [ax, az, bx, bz] of lines) {
      const len = Math.hypot(bx - ax, bz - az)
      const n = Math.max(1, Math.round(len / P))
      for (let i = 0; i < n; i++) {
        const a = new THREE.Vector3(ax + ((bx - ax) * i) / n, 0.86, az + ((bz - az) * i) / n)
        const b = new THREE.Vector3(ax + ((bx - ax) * (i + 1)) / n, 0.86, az + ((bz - az) * (i + 1)) / n)
        posts.push(a)
        const mid = a.clone().lerp(b, 0.5)
        mid.y -= 0.16
        const t = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 8, 0.022, 4, false)
        ropes.push(t.toNonIndexed())
        t.dispose()
      }
      solids.push(box((ax + bx) / 2, (az + bz) / 2, Math.abs(bx - ax) + 0.4, Math.abs(bz - az) + 0.4))
    }
    const ropeGeo = geo(mergeGeometries(ropes))
    for (const r of ropes) r.dispose()
    group.add(new THREE.Mesh(ropeGeo, mats.rope))
    const postGeo = geo(new THREE.CylinderGeometry(0.05, 0.065, 0.94, 8))
    postGeo.translate(0, 0.47, 0)
    const pm = new THREE.InstancedMesh(postGeo, mats.darkWood, posts.length)
    const d = new THREE.Object3D()
    posts.forEach((p, i) => {
      d.position.set(p.x, 0, p.z)
      d.updateMatrix()
      pm.setMatrixAt(i, d.matrix)
    })
    pm.castShadow = true
    group.add(pm)
  }

  // ---- the crowd behind the ropes: coats and tricorn hats, gowns and bonnets ----
  const people = []
  const crowdMeshes = {}
  {
    const rnd = random(57)
    const cell = 0.78
    const bands = [
      [x0 - 5.2, x0 - 1.1, z0 - 1, z1 + 1],
      [x1 + 1.1, x1 + 5.2, z0 - 1, z1 + 1],
      [x0 - 1, x1 + 1, z0 - 4.2, z0 - 1.1],
      [x0 + 2, x1 - 2, z1 + 1.4, z1 + 3.6],
    ]
    const fillK = light ? 0.32 : 0.62
    for (const [ax, bx, az, bz] of bands) {
      for (let x = ax; x < bx; x += cell) {
        for (let z = az; z < bz; z += cell) {
          if (rnd() > fillK) continue
          // fuller near the rope
          const nearRope = Math.min(Math.abs(x - (x0 - 0.5)), Math.abs(x - (x1 + 0.5)), Math.abs(z - (z0 - 0.5)), Math.abs(z - (z1 + 0.5)))
          if (nearRope > 2.4 && rnd() < 0.35) continue
          const woman = rnd() < 0.42
          const child = rnd() < 0.1
          people.push({ x: x + (rnd() - 0.5) * cell * 0.7, z: z + (rnd() - 0.5) * cell * 0.7, s: (child ? 0.7 : 0.92 + rnd() * 0.16), woman, seed: rnd() * 100, coat: rnd(), skin: rnd(), hat: rnd() })
        }
      }
    }
    const coatGeo = geo(new THREE.LatheGeometry([[0, 0], [0.24, 0], [0.22, 0.5], [0.19, 0.95], [0.21, 1.22], [0.13, 1.36], [0, 1.38]].map(([r, y]) => new THREE.Vector2(r, y)), light ? 7 : 10))
    const gownGeo = geo(new THREE.LatheGeometry([[0, 0], [0.42, 0], [0.38, 0.25], [0.24, 0.85], [0.16, 1.0], [0.19, 1.2], [0.12, 1.32], [0, 1.34]].map(([r, y]) => new THREE.Vector2(r, y)), light ? 8 : 12))
    const headGeo = geo(new THREE.SphereGeometry(0.115, 10, 8))
    const tricornGeo = geo(new THREE.CylinderGeometry(0.21, 0.19, 0.08, 3))
    const bonnetGeo = geo(new THREE.SphereGeometry(0.15, 10, 6, 0, TAU, 0, Math.PI / 2))
    const mat = () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 })
    const men = people.filter(p => !p.woman)
    const women = people.filter(p => p.woman)
    crowdMeshes.coat = new THREE.InstancedMesh(coatGeo, mat(), Math.max(1, men.length))
    crowdMeshes.gown = new THREE.InstancedMesh(gownGeo, mat(), Math.max(1, women.length))
    crowdMeshes.head = new THREE.InstancedMesh(headGeo, mat(), Math.max(1, people.length))
    crowdMeshes.tricorn = new THREE.InstancedMesh(tricornGeo, mat(), Math.max(1, men.length))
    crowdMeshes.bonnet = new THREE.InstancedMesh(bonnetGeo, mat(), Math.max(1, women.length))
    const coats = ['#2f3b58', '#4a3a2c', '#545a60', '#3d4e3a', '#6a2a2e', '#2b2b2e', '#5c4a6a', '#7a6248']
    const gowns = ['#b9a98c', '#7f8fa8', '#a46d6d', '#c2b6a2', '#6f8a78', '#8c6f8e', '#9a8466']
    const skins = ['#e0b896', '#c99a78', '#edc7a6', '#a8775a']
    const c = new THREE.Color()
    let mi = 0
    let wi = 0
    people.forEach((p, i) => {
      if (p.woman) {
        p.body = ['gown', wi]
        p.top = ['bonnet', wi]
        crowdMeshes.gown.setColorAt(wi, c.set(gowns[Math.floor(p.coat * gowns.length)]))
        crowdMeshes.bonnet.setColorAt(wi, c.set(p.hat < 0.6 ? '#e8e2d4' : '#5a4636'))
        wi++
      } else {
        p.body = ['coat', mi]
        p.top = ['tricorn', mi]
        crowdMeshes.coat.setColorAt(mi, c.set(coats[Math.floor(p.coat * coats.length)]))
        crowdMeshes.tricorn.setColorAt(mi, c.set(p.hat < 0.85 ? '#1f1d1d' : '#3e3328'))
        mi++
      }
      p.head = i
      crowdMeshes.head.setColorAt(i, c.set(skins[Math.floor(p.skin * skins.length)]))
    })
    for (const m of Object.values(crowdMeshes)) {
      m.frustumCulled = false
      group.add(m)
    }
  }
  const look = { x: cx, z: cz }
  let cheer = 0
  const dummy = new THREE.Object3D()
  function poseCrowd(t) {
    for (const p of people) {
      const yaw = Math.atan2(look.x - p.x, look.z - p.z)
      const hop = cheer * Math.max(0, Math.sin(t * 5.2 + p.seed)) * 0.12 + Math.sin(t * 0.8 + p.seed) * 0.012
      dummy.position.set(p.x, hop, p.z)
      dummy.rotation.set(Math.sin(t * 0.6 + p.seed) * 0.03, yaw, 0)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      crowdMeshes[p.body[0]].setMatrixAt(p.body[1], dummy.matrix)
      const top = (p.woman ? 1.34 : 1.38) * p.s + hop
      dummy.position.set(p.x, top + 0.06 * p.s, p.z)
      dummy.updateMatrix()
      crowdMeshes.head.setMatrixAt(p.head, dummy.matrix)
      // a hat waved high when the crowd cheers
      const wave = cheer * (0.5 + 0.5 * Math.sin(t * 7 + p.seed * 3)) * (p.seed % 3 < 1.6 ? 1 : 0)
      dummy.position.set(p.x + Math.sin(yaw + Math.PI / 2) * wave * 0.25, top + 0.15 * p.s + wave * 0.42, p.z + Math.cos(yaw + Math.PI / 2) * wave * 0.25)
      dummy.rotation.set(0, yaw + wave * 2, wave * 0.5)
      dummy.updateMatrix()
      crowdMeshes[p.top[0]].setMatrixAt(p.top[1], dummy.matrix)
    }
    for (const m of Object.values(crowdMeshes)) m.instanceMatrix.needsUpdate = true
  }
  poseCrowd(0)

  // ---- light: the winter sky all round, the low sun ----
  const hemi = new THREE.HemisphereLight('#c3d0ea', '#6c5c46', light ? 1.15 : 0.95)
  group.add(hemi)
  const sunLight = new THREE.DirectionalLight('#ffd9ad', light ? 1.9 : 2.5)
  const centre = new THREE.Vector3(cx, 0, cz)
  sunLight.position.copy(centre).addScaledVector(sunDir, 60)
  sunLight.target.position.copy(centre)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  const reach = Math.max(x1 - x0, z1 - z0) / 2 + 8
  Object.assign(sunLight.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach, near: 1, far: 140 })
  sunLight.shadow.bias = -0.0004
  sunLight.shadow.normalBias = 0.04
  group.add(sunLight, sunLight.target)

  return {
    group,
    mats,
    solids,
    sunDir,
    sunLight,
    env: {
      background: new THREE.Color('#c4bcbc'),
      fog: new THREE.Fog('#bdb7ba', 60, 420),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.3, radius: 0.5, threshold: 0.93 },
      fov: 62,
      shadows: true,
      far: 2000,
    },
    cameraBounds: { minX: x0 - 0.2, maxX: x1 + 0.2, minY: 0.35, maxY: 40, minZ: z0 - 0.2, maxZ: z1 + 0.2 },
    crowd: {
      cheer: k => (cheer = Math.max(0, Math.min(1, k))),
      look: (x, z) => {
        look.x = x
        look.z = z
      },
    },
    update(t) {
      poseCrowd(t)
    },
    dispose() {
      for (const t of textures) t.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
