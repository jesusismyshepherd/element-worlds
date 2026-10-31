// A stage for picture rooms (docs/knowledge/picture-rooms.md): the young universe as hydrogen's picture
// "What were the very first atoms?" draws it, a horn widening from a white-hot point, made into a tunnel
// walked on a glass walkway that floats in space. Fog fills the horn. The scene sets it with
// `set({ temp, fog })`: a temperature in kelvin (gold-white when hottest, then orange, deep red near
// 3000 K) and how much of the fog is left (1 thick, 0 clear). Near the narrow end it always stays hot and
// thick (`hot`: the first minutes), whatever the scene sets. Past the horn's wide mouth a round terrace
// floats under the night sky: today. The fog is the room's own scene fog: thick while the camera is inside
// the horn, gone outside it, and the horn's skin shows the fog within to whoever looks from the terrace.
// The fog colours are kept mid-toned: a near-white fog under the bloom washes the whole view out (the polar
// stage's snow trap). `bays` widen the walkway beside a station; rails keep the visitor on it (low solids,
// so the camera passes over them), except along `open` stretches, where the scene puts its own (a station's
// rail); `cameraClear` keeps the third-person camera inside the horn. Hydrogen's `bigbang` was the first room.
import * as THREE from 'three'
import { canvasTex } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'

const TAU = Math.PI * 2
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// the fog's colour by temperature (log10 of kelvin): gold-white, orange, deep red; mid-toned on purpose
const RAMP = [
  [9, '#c99448'],
  [7, '#c77d36'],
  [5.5, '#bf6429'],
  [4.3, '#a84b22'],
  [3.7, '#8a361f'],
  [3.45, '#6e2a1c'],
].map(([l, c]) => [l, new THREE.Color(c)])
const NAVY = new THREE.Color('#0b1133')

/** The fog's colour at a temperature (K). */
export function fogColour(T, out = new THREE.Color()) {
  const l = Math.log10(Math.max(T, 1))
  if (l >= RAMP[0][0]) return out.copy(RAMP[0][1])
  for (let i = 1; i < RAMP.length; i++) {
    if (l >= RAMP[i][0]) {
      const [l0, c0] = RAMP[i - 1]
      const [l1, c1] = RAMP[i]
      return out.copy(c1).lerp(c0, (l - l1) / (l0 - l1))
    }
  }
  return out.copy(RAMP[RAMP.length - 1][1])
}

/** A soft, cloudy blob for the fog's drifting puffs. */
function puffTexture(seed = 3) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  return canvasTex(128, 128, (g, w) => {
    g.clearRect(0, 0, w, w)
    for (let i = 0; i < 14; i++) {
      const x = w * (0.3 + rnd() * 0.4)
      const y = w * (0.3 + rnd() * 0.4)
      const r = w * (0.16 + rnd() * 0.2)
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, 'rgba(255,255,255,0.32)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }
  })
}

/** A soft round glow. */
function glowTexture() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.25, 'rgba(255,255,255,0.55)')
    grd.addColorStop(0.6, 'rgba(255,255,255,0.12)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export function youngCosmosStage({
  light = false,
  pixelRatio = 1,
  axisY = 1.4,
  tipZ = 19.5,
  neckZ = 16,
  mouthZ = -15,
  r0 = 3.4,
  r1 = 9.4,
  bend = 0.85,
  walk = { width: 4, z0: 15.9 },
  bays = [],
  open = [],
  terrace = { z: -23.5, r: 8 },
  hot = { from: 6, to: 1, fog: 0.6 },
  rim = '#ffb35c',
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const solids = []

  /** The horn's radius at z (0 beyond its point). */
  const radiusAt = z => {
    if (z >= tipZ) return 0
    if (z > neckZ) {
      const k = (z - neckZ) / (tipZ - neckZ)
      return r0 * Math.pow(1 - k * k, 0.6)
    }
    const u = clamp((neckZ - z) / (neckZ - mouthZ))
    return r0 + (r1 - r0) * Math.pow(u, bend)
  }
  const tipOf = z => smooth(hot.to, hot.from, z)
  // the fog thins out toward the mouth and is gone just past it: a camera out on the terrace (or a station
  // view backed off toward the mouth) sees today's clear sky, whatever the fog inside
  const insideOf = z => smooth(mouthZ - 0.5, mouthZ + 3, z)

  // ---- what the scene sets, and what follows from it ----
  const state = { temp: 1e9, fog: 1, col: fogColour(1e9) }
  const hotCol = fogColour(1e9)
  const local = { F: 1, col: new THREE.Color() }
  /** The fog at z: how thick (0..1) and its colour, as the scene set it and the hot narrow end keeps it. */
  function fieldAt(z, out = local) {
    const tip = tipOf(z)
    out.F = insideOf(z) * Math.max(state.fog, tip * hot.fog)
    out.col.copy(state.col).lerp(hotCol, tip)
    return out
  }

  // ======== the sky: a dome and stars all round (the deck floats in space), hidden by the fog ========
  const skyUniforms = { uHaze: { value: 1 }, uFog: { value: new THREE.Color() }, uTime: { value: 0 }, uScale: { value: pixelRatio } }
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(900, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyUniforms,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uHaze; uniform vec3 uFog;
        varying vec3 vDir;
        void main() {
          float h = vDir.y;
          vec3 c = mix(vec3(0.012, 0.016, 0.05), vec3(0.004, 0.005, 0.02), smoothstep(-0.2, 0.9, abs(h)));
          // a faint band of the galaxy across the sky
          float band = exp(-pow(dot(vDir, normalize(vec3(0.35, 0.55, 0.76))) / 0.16, 2.0));
          float wisp = 0.6 + 0.4 * sin(vDir.x * 23.0 + vDir.z * 17.0) * sin(vDir.y * 19.0 - vDir.x * 7.0);
          c += vec3(0.05, 0.045, 0.07) * band * wisp;
          gl_FragColor = vec4(mix(c, uFog, uHaze), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  dome.renderOrder = -10
  dome.frustumCulled = false
  group.add(dome)
  {
    const n = light ? 1100 : 2600
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const size = new Float32Array(n)
    const phase = new Float32Array(n)
    const tint = ['#cfe0ff', '#fff4e0', '#ffd2b0', '#bcd2ff'].map(c => new THREE.Color(c))
    for (let i = 0; i < n; i++) {
      // all round, a little thicker along the galaxy's band
      const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      if (v.lengthSq() > 1 || v.lengthSq() < 1e-4) {
        i--
        continue
      }
      v.normalize().multiplyScalar(860)
      pos.set(v.toArray(), i * 3)
      const c = tint[(Math.random() * tint.length) | 0]
      col.set([c.r, c.g, c.b], i * 3)
      size[i] = Math.random() < 0.06 ? 2.6 + Math.random() * 1.6 : 0.8 + Math.random() * 1.4
      phase[i] = Math.random() * 100
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: skyUniforms,
      vertexShader: /* glsl */ `
        attribute float aSize; attribute float aPhase; attribute vec3 color;
        uniform float uTime; uniform float uScale;
        varying vec3 vColor; varying float vTw;
        void main() {
          vColor = color;
          vTw = 0.65 + 0.35 * sin(uTime * (0.6 + fract(aPhase) * 1.7) + aPhase);
          gl_PointSize = aSize * uScale * (0.85 + 0.3 * vTw);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uHaze;
        varying vec3 vColor; varying float vTw;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * (1.0 - uHaze);
          gl_FragColor = vec4(vColor * vTw * 1.4, a);
        }`,
    })
    const stars = new THREE.Points(geo, starMat)
    stars.frustumCulled = false
    stars.renderOrder = -9
    stars.raycast = () => {}
    group.add(stars)
  }

  // ======== the horn: a skin of revolution round the walkway, from its point to its wide mouth ========
  const hornUniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uCol: { value: new THREE.Color() },
      uHot: { value: hotCol.clone() },
      uNavy: { value: NAVY.clone() },
      uRim: { value: new THREE.Color(rim) },
      uF: { value: 1 },
      uTipMin: { value: hot.fog },
      uTip0: { value: hot.from },
      uTip1: { value: hot.to },
      uTime: { value: 0 },
    },
  ])
  const hornMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: true,
    uniforms: hornUniforms,
    vertexShader: /* glsl */ `
      #include <fog_pars_vertex>
      varying vec3 vWorld; varying vec3 vN; varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCol; uniform vec3 uHot; uniform vec3 uNavy; uniform vec3 uRim;
      uniform float uF; uniform float uTipMin; uniform float uTip0; uniform float uTip1; uniform float uTime;
      #include <fog_pars_fragment>
      varying vec3 vWorld; varying vec3 vN; varying vec2 vUv;
      void main() {
        float tip = smoothstep(uTip1, uTip0, vWorld.z);
        float F = max(uF, tip * uTipMin);
        vec3 col = mix(uCol, uHot, tip);
        vec3 V = normalize(cameraPosition - vWorld);
        float facing = clamp(abs(dot(normalize(vN), V)), 0.0, 1.0);
        float fres = pow(clamp(1.0 - facing, 0.0, 1.0), 3.0);
        // faint ribs along and round the horn, so its shape reads from inside
        float along = smoothstep(0.965, 1.0, abs(cos(vUv.x * 3.14159 * 16.0)));
        float round = smoothstep(0.97, 1.0, abs(cos(vUv.y * 3.14159 * 18.0)));
        float lines = max(along, round);
        vec3 c;
        float a;
        if (gl_FrontFacing) {
          // seen from outside: the fog within shows through the skin, the edge glows as the picture's outline
          c = mix(uNavy * 1.6, col * 1.05, F) + uRim * fres * 0.55;
          a = 0.1 + 0.62 * F * (0.55 + 0.45 * facing) + fres * 0.45;
        } else {
          // seen from inside: a faint glassy skin, its ribs and its edge
          c = mix(uRim * 0.7, col * 1.15, F * 0.7);
          a = 0.02 + fres * 0.22 * (1.0 - 0.6 * F) + lines * 0.035 * (1.0 - 0.5 * F);
        }
        gl_FragColor = vec4(c, clamp(a, 0.0, 0.92));
        #include <fog_fragment>
        #include <colorspace_fragment>
      }`,
  })
  {
    const NK = light ? 48 : 72
    const zs = []
    const NT = 14
    for (let i = 0; i <= NT; i++) zs.push(tipZ - (tipZ - neckZ) * Math.sin((i / NT) * (Math.PI / 2)))
    const NA = light ? 40 : 64
    for (let i = 1; i <= NA; i++) zs.push(neckZ - (neckZ - mouthZ) * (i / NA))
    const pos = []
    const uv = []
    const idx = []
    zs.forEach((z, j) => {
      const r = Math.max(radiusAt(z), 0.001)
      for (let k = 0; k <= NK; k++) {
        const a = (k / NK) * TAU
        pos.push(Math.cos(a) * r, axisY + Math.sin(a) * r, z)
        uv.push(k / NK, (tipZ - z) / (tipZ - mouthZ))
      }
    })
    for (let j = 0; j < zs.length - 1; j++) {
      for (let k = 0; k < NK; k++) {
        const a = j * (NK + 1) + k
        const b = (j + 1) * (NK + 1) + k
        idx.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const horn = new THREE.Mesh(geo, hornMat)
    horn.renderOrder = 3
    horn.raycast = () => {}
    group.add(horn)
  }
  // the mouth's rim, glowing as the picture's outline
  const rimMat = new THREE.MeshStandardMaterial({ color: rim, emissive: rim, emissiveIntensity: 1.3, roughness: 0.4 })
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r1, 0.07, 8, 160), rimMat)
    ring.position.set(0, axisY, mouthZ)
    group.add(ring)
  }
  // the white-hot point where it began
  const glow = glowTexture()
  textures.push(glow)
  const tipGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color('#fff0cf').multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  tipGlow.position.set(0, axisY, tipZ - 1.0)
  tipGlow.scale.setScalar(5.5)
  group.add(tipGlow)

  // ======== the fog's puffs: soft clouds drifting through the horn, off the walkway ========
  const puffTex = puffTexture()
  textures.push(puffTex)
  const puffs = []
  {
    const n = light ? 14 : 34
    let s = 7
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < n * 6 && puffs.length < n; i++) {
      const z = neckZ - 0.5 - rnd() * (neckZ - mouthZ - 1.5)
      const r = radiusAt(z) * (0.35 + rnd() * 0.5)
      const a = rnd() * TAU
      const x = Math.cos(a) * r
      const y = axisY + Math.sin(a) * r
      // keep the walkway's air clear: a big sprite at the eye fills the screen
      if (Math.abs(x) < walk.width / 2 + 1.2 && y < 3.6) continue
      const mat = new THREE.SpriteMaterial({ map: puffTex, color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, fog: false })
      const sp = new THREE.Sprite(mat)
      const size = 4 + rnd() * 4
      sp.scale.setScalar(size)
      sp.position.set(x, y, z)
      sp.material.rotation = rnd() * TAU
      sp.renderOrder = 2
      sp.raycast = () => {}
      group.add(sp)
      // lighter and darker than the fog round them, so the fog seems to churn
      puffs.push({ sp, base: sp.position.clone(), seed: rnd() * 100, spin: (rnd() - 0.5) * 0.06, shade: puffs.length % 3 === 0 ? 0.6 : 1.45 })
    }
  }

  // ======== the walkway, its bays and the terrace ========
  const halfW = walk.width / 2
  const zEnd = terrace ? terrace.z + terrace.r - 0.3 : mouthZ
  const gridTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#26304e'
    g.fillRect(0, 0, w, w)
    g.strokeStyle = 'rgba(120,200,255,0.35)'
    g.lineWidth = 2
    g.strokeRect(1, 1, w - 2, w - 2)
    g.strokeStyle = 'rgba(120,200,255,0.12)'
    g.beginPath()
    g.moveTo(w / 2, 0)
    g.lineTo(w / 2, w)
    g.moveTo(0, w / 2)
    g.lineTo(w, w / 2)
    g.stroke()
  }, { repeat: true })
  const gridGlow = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, w, w)
    g.strokeStyle = 'rgba(110,190,255,0.8)'
    g.lineWidth = 2
    g.strokeRect(1, 1, w - 2, w - 2)
  }, { repeat: true })
  textures.push(gridTex, gridGlow)
  const floorMat = new THREE.MeshStandardMaterial({ map: gridTex, emissive: '#ffffff', emissiveMap: gridGlow, emissiveIntensity: 0.16, roughness: 0.32, metalness: 0.35 })
  const slabMat = new THREE.MeshStandardMaterial({ color: '#1a2036', roughness: 0.5, metalness: 0.4 })
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#8fe3ff', emissive: '#8fe3ff', emissiveIntensity: 1.1, roughness: 0.4 })
  const railMat = new THREE.MeshStandardMaterial({ color: rim, emissive: rim, emissiveIntensity: 0.75, roughness: 0.35, metalness: 0.3 })
  const postMat = new THREE.MeshStandardMaterial({ color: '#3b4566', roughness: 0.45, metalness: 0.6 })
  /** A floor rectangle (x0..x1, z0..z1) at y = 0, its grid in metres. */
  function floorRect(x0, x1, z0, z1) {
    const w = x1 - x0
    const d = z1 - z0
    const geo = new THREE.PlaneGeometry(w, d)
    const uvs = geo.attributes.uv
    for (let i = 0; i < uvs.count; i++) uvs.setXY(i, (uvs.getX(i) * w + x0) / 2, (uvs.getY(i) * d + z0) / 2)
    const top = new THREE.Mesh(geo, floorMat)
    top.rotation.x = -Math.PI / 2
    top.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), slabMat)
    slab.position.set((x0 + x1) / 2, -0.075, (z0 + z1) / 2)
    group.add(top, slab)
  }
  const RAIL_H = 0.95
  const postGeo = new THREE.CylinderGeometry(0.025, 0.03, RAIL_H, 8)
  const posts = []
  /** A rail from a to b (points on the floor): posts, a glowing top, an edge light, and a low solid. */
  function rail(ax, az, bx, bz, { edge = true } = {}) {
    const len = Math.hypot(bx - ax, bz - az)
    if (len < 0.05) return
    const rot = Math.atan2(bx - ax, bz - az)
    const cx = (ax + bx) / 2
    const cz = (az + bz) / 2
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 8), railMat)
    top.rotation.set(Math.PI / 2, 0, 0)
    const holder = new THREE.Group()
    holder.add(top)
    holder.position.set(cx, RAIL_H, cz)
    holder.rotation.y = rot
    group.add(holder)
    if (edge) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, len), edgeMat)
      strip.position.set(cx, 0.02, cz)
      strip.rotation.y = rot
      group.add(strip)
    }
    const n = Math.max(1, Math.round(len / 1.6))
    for (let i = 0; i <= n; i++) posts.push([ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n])
    solids.push(box(cx, cz, 0.12, len + 0.1, { rot, y1: 1.0 }))
  }
  // the straight walkway, from behind the frame to the terrace
  floorRect(-halfW, halfW, zEnd, walk.z0)
  for (const side of [-1, 1]) {
    const cuts = [...bays, ...open].filter(b => b.side === side).map(b => [b.z0, b.z1]).sort((p, q) => q[0] - p[0])
    let from = walk.z0
    const x = side * halfW
    for (const [b0, b1] of cuts) {
      rail(x, from, x, b1)
      from = b0
    }
    rail(x, from, x, zEnd + (terrace ? 0.4 : 0))
  }
  rail(-halfW, walk.z0, halfW, walk.z0)
  for (const b of bays) {
    const xo = b.side * (halfW + b.depth)
    const x0 = Math.min(b.side * halfW, xo)
    const x1 = Math.max(b.side * halfW, xo)
    floorRect(x0, x1, b.z0, b.z1)
    rail(xo, b.z1, xo, b.z0)
    rail(b.side * halfW, b.z1, xo, b.z1)
    rail(b.side * halfW, b.z0, xo, b.z0)
  }
  if (terrace) {
    const { z: tz, r: tr } = terrace
    // a round lawn on a floating rock, a ring of rail round it but where the walkway comes in
    const lawnTex = canvasTex(512, 512, (g, w) => {
      g.fillStyle = '#3c5235'
      g.fillRect(0, 0, w, w)
      let s = 5
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
      for (let i = 0; i < 9000; i++) {
        const v = rnd()
        g.fillStyle = v < 0.5 ? `rgba(30,48,26,${0.25 + rnd() * 0.3})` : `rgba(96,122,72,${0.15 + rnd() * 0.25})`
        g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 2 + rnd() * 5)
      }
      // the gravel path from the walkway to the middle
      g.fillStyle = 'rgba(122,116,104,0.9)'
      g.fillRect(w * 0.5 - (halfW / tr) * (w / 2), w * 0.5, (halfW / tr) * w, w * 0.5)
      g.beginPath()
      g.arc(w / 2, w / 2, (2.4 / tr) * (w / 2), 0, TAU)
      g.fill()
    })
    textures.push(lawnTex)
    const lawn = new THREE.Mesh(new THREE.CircleGeometry(tr, 72), new THREE.MeshStandardMaterial({ map: lawnTex, roughness: 0.95 }))
    lawn.rotation.x = -Math.PI / 2
    lawn.position.set(0, 0.005, tz)
    group.add(lawn)
    const rockGeo = new THREE.CylinderGeometry(tr, tr * 0.18, 4.2, 48, 6, true)
    {
      const p = rockGeo.attributes.position
      const v = new THREE.Vector3()
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i)
        if (v.y > 2.0) continue
        const a = Math.atan2(v.z, v.x)
        const k = 1 + 0.12 * Math.sin(a * 5 + v.y * 2) + 0.07 * Math.sin(a * 11 - v.y * 3)
        p.setXYZ(i, v.x * k, v.y, v.z * k)
      }
      rockGeo.computeVertexNormals()
    }
    const rock = new THREE.Mesh(rockGeo, new THREE.MeshStandardMaterial({ color: '#4a3e35', roughness: 0.95, flatShading: true }))
    rock.position.set(0, -2.1, tz)
    group.add(rock)
    const edge = new THREE.Mesh(new THREE.TorusGeometry(tr, 0.05, 8, 140), edgeMat)
    edge.rotation.x = Math.PI / 2
    edge.position.set(0, 0.03, tz)
    group.add(edge)
    const gap = Math.asin(Math.min(1, (halfW + 0.05) / tr))
    const N = 40
    for (let i = 0; i < N; i++) {
      const a0 = Math.PI / 2 + gap + (i / N) * (TAU - 2 * gap)
      const a1 = Math.PI / 2 + gap + ((i + 1) / N) * (TAU - 2 * gap)
      const R = tr - 0.15
      rail(Math.cos(a0) * R, tz + Math.sin(a0) * R, Math.cos(a1) * R, tz + Math.sin(a1) * R, { edge: false })
    }
  }
  {
    const inst = new THREE.InstancedMesh(postGeo, postMat, posts.length)
    const o = new THREE.Object3D()
    posts.forEach(([x, z], i) => {
      o.position.set(x, RAIL_H / 2, z)
      o.updateMatrix()
      inst.setMatrixAt(i, o.matrix)
    })
    group.add(inst)
  }

  // ======== light: a fill that takes the fog's colour, and the stars' cool light ========
  const fill = new THREE.HemisphereLight('#ffffff', '#1a1020', 0.9)
  const star = new THREE.DirectionalLight('#c8d4ff', 0.55)
  star.position.set(8, 20, -10)
  group.add(fill, star, star.target)
  const fogObj = new THREE.FogExp2(hotCol.clone(), 0.1)
  const background = hotCol.clone()

  const fillSky = new THREE.Color()
  const NIGHT_FILL = new THREE.Color('#7c8bc4')
  const camTo = new THREE.Vector3()
  const puffField = { F: 0, col: new THREE.Color() }
  return {
    group,
    solids,
    radiusAt,
    fieldAt,
    axisY,
    mouthZ,
    halfW,
    mats: { rail: railMat, post: postMat, edge: edgeMat, floor: floorMat, rim: rimMat },
    glow,
    env: {
      background,
      fog: fogObj,
      exposure: 1.0,
      envIntensity: 0.15,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.82 },
      fov: 60,
      far: 2500,
    },
    cameraBounds: {
      minX: -r1 + 0.5,
      maxX: r1 - 0.5,
      minY: 0.35,
      maxY: axisY + r1 - 1,
      minZ: terrace ? terrace.z - terrace.r - 2 : mouthZ - 4,
      maxZ: walk.z0,
    },
    /** The share of the way from the player to the camera that stays inside the horn (with a margin). */
    cameraClear(from, to) {
      if (from.z < mouthZ + 0.5) return 1
      const n = 12
      for (let i = 1; i <= n; i++) {
        camTo.lerpVectors(from, to, i / n)
        if (camTo.z < mouthZ) break
        const r = radiusAt(camTo.z) - 0.45
        if (Math.hypot(camTo.x, camTo.y - axisY) > r) return (i - 1) / n
      }
      return 1
    },
    /** The scene's fog: a temperature (K) and how much of it is left (0 clear, 1 thick). */
    set({ temp, fog }) {
      if (temp != null) {
        state.temp = temp
        fogColour(temp, state.col)
      }
      if (fog != null) state.fog = clamp(fog)
    },
    update(t, camera) {
      const f = fieldAt(camera.position.z)
      const F = f.F
      fogObj.color.copy(f.col)
      fogObj.density = 0.0006 + 0.085 * Math.pow(F, 1.15)
      background.copy(NAVY).lerp(f.col, smooth(0, 0.55, F))
      skyUniforms.uHaze.value = smooth(0.03, 0.45, F)
      skyUniforms.uFog.value.copy(background)
      skyUniforms.uTime.value = t
      hornUniforms.uF.value = state.fog
      hornUniforms.uCol.value.copy(state.col)
      hornUniforms.uTime.value = t
      // the fill takes the fog's colour inside it, the night's outside
      fillSky.copy(NIGHT_FILL).lerp(f.col, smooth(0, 0.6, F))
      fill.color.copy(fillSky)
      fill.intensity = 0.75 + 0.15 * F
      tipGlow.material.opacity = 0.85 + Math.sin(t * 1.3) * 0.08
      const tmp = puffField
      for (const p of puffs) {
        const { sp, base, seed, spin, shade } = p
        sp.position.set(base.x + Math.sin(t * 0.07 + seed) * 0.8, base.y + Math.sin(t * 0.05 + seed * 2) * 0.5, base.z + Math.cos(t * 0.06 + seed) * 0.8)
        sp.material.rotation += spin * 0.016
        fieldAt(sp.position.z, tmp)
        sp.material.color.copy(tmp.col).multiplyScalar(shade)
        const near = smooth(2.5, 6, sp.position.distanceTo(camera.position))
        sp.material.opacity = 0.5 * tmp.F * near
        sp.visible = sp.material.opacity > 0.005
      }
    },
    dispose() {
      for (const tx of textures) tx.dispose()
    },
  }
}
