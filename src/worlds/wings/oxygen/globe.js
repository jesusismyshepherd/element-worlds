// Where our oxygen comes from: the Earth as a globe (the real coastlines, Natural Earth 1:110m; forests,
// deserts and ice placed where they are), clouds and a thin blue rim of atmosphere. Using it lights the
// forests and every green land, with O2 molecules rising from them; again, the ocean's phytoplankton
// (where the sea is green with it: coasts, cold seas, the equator's upwelling), with O2 rising from the
// sea. A bar on the screen shows the split: about half and half.
import * as THREE from 'three'
import { makeText } from '../../../engine/text.js'
import { LAND } from './earthLand.js'
import { standingScreen, glowMat, hdr, makeNoise, damp, random, canvasTex } from './kit.js'

const W = 1024
const H = 512

/** The land as a mask (1 on land) on an equirectangular grid W x H, and a blurred copy (near a coast). */
function landMask() {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#000'
  g.fillRect(0, 0, W, H)
  g.fillStyle = '#fff'
  for (const ring of LAND) {
    g.beginPath()
    let lon = ring[0]
    let lat = ring[1]
    g.moveTo(((lon / 5 + 180) / 360) * W, ((90 - lat / 5) / 180) * H)
    for (let i = 2; i < ring.length; i += 2) {
      lon += ring[i]
      lat += ring[i + 1]
      g.lineTo(((lon / 5 + 180) / 360) * W, ((90 - lat / 5) / 180) * H)
    }
    g.closePath()
    g.fill('evenodd')
  }
  const sharp = g.getImageData(0, 0, W, H).data
  const blurC = document.createElement('canvas')
  blurC.width = W
  blurC.height = H
  const bg = blurC.getContext('2d')
  bg.filter = 'blur(10px)'
  bg.drawImage(c, 0, 0)
  const blur = bg.getImageData(0, 0, W, H).data
  const land = new Uint8Array(W * H)
  const near = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) {
    land[i] = sharp[i * 4] > 127 ? 1 : 0
    near[i] = blur[i * 4] / 255
  }
  return { land, near }
}

// deserts, roughly where they are: [lon0, lon1, lat0, lat1]
const DESERTS = [
  [-17, 35, 15, 31], [35, 60, 14, 32], [55, 72, 24, 38], [68, 76, 24, 30], [56, 118, 37, 48],
  [114, 142, -32, -19], [-118, -102, 24, 36], [12, 25, -29, -17], [-71, -68, -27, -18], [-70, -64, -48, -38],
]
const inBox = (lon, lat, [a, b, c, d]) => lon >= a && lon <= b && lat >= c && lat <= d

function earthTextures() {
  const { land, near } = landMask()
  const noise = makeNoise(77)
  const color = new Uint8ClampedArray(W * H * 4)
  const greenGlow = new Uint8ClampedArray(W * H * 4)
  const seaGlow = new Uint8ClampedArray(W * H * 4)
  const mix = (a, b, t) => a + (b - a) * t
  for (let y = 0; y < H; y++) {
    const lat = 90 - ((y + 0.5) / H) * 180
    const alat = Math.abs(lat)
    for (let x = 0; x < W; x++) {
      const lon = ((x + 0.5) / W) * 360 - 180
      const i = y * W + x
      const n = noise.fbm2(x / 40, y / 40, 4)
      const fine = noise.n2(x / 6, y / 6)
      let r
      let g
      let b
      let leaf = 0
      let plankton = 0
      if (land[i]) {
        const ice = lat < -60 || alat > 72 || (lat > 59 && lon > -74 && lon < -12)
        let desert = 0
        for (const box of DESERTS) if (inBox(lon, lat, box)) desert = Math.max(desert, 1)
        desert *= THREE.MathUtils.smoothstep(n, 0.3, 0.55)
        if (ice) {
          ;[r, g, b] = [236, 241, 247]
        } else {
          // tropical forest, temperate, boreal, tundra
          const tropic = 1 - THREE.MathUtils.smoothstep(alat, 10, 22)
          const boreal = THREE.MathUtils.smoothstep(alat, 48, 56) * (1 - THREE.MathUtils.smoothstep(alat, 64, 70))
          const tundra = THREE.MathUtils.smoothstep(alat, 63, 70)
          r = mix(70, 32, tropic)
          g = mix(104, 86, tropic)
          b = mix(52, 38, tropic)
          r = mix(r, 42, boreal)
          g = mix(g, 74, boreal)
          b = mix(b, 50, boreal)
          r = mix(r, 120, tundra)
          g = mix(g, 118, tundra)
          b = mix(b, 98, tundra)
          r = mix(r, 205, desert)
          g = mix(g, 176, desert)
          b = mix(b, 122, desert)
          const k = 0.85 + n * 0.3 + (fine - 0.5) * 0.08
          r *= k
          g *= k
          b *= k
          leaf = (tropic * 1 + boreal * 0.8 + (1 - tropic) * (1 - boreal) * (1 - tundra) * 0.6) * (1 - desert)
        }
      } else {
        const shelf = near[i]
        const depth = 1 - shelf
        r = mix(30, 8, depth)
        g = mix(96, 34, depth)
        b = mix(140, 82, depth)
        // phytoplankton: green seas near coasts, in cold waters, and along the equator's upwelling
        const cold = THREE.MathUtils.smoothstep(alat, 38, 55) * (1 - THREE.MathUtils.smoothstep(alat, 70, 78))
        const upwell = (1 - THREE.MathUtils.smoothstep(alat, 0, 5)) * (lon < -80 || lon > 160 ? 1 : 0.4)
        plankton = Math.min(1, shelf * 1.6 + cold * 0.8 + upwell * 0.7) * THREE.MathUtils.smoothstep(noise.fbm2(x / 18 + 50, y / 18, 4), 0.35, 0.7)
        r = mix(r, 20, plankton * 0.4)
        g = mix(g, 110, plankton * 0.4)
        b = mix(b, 105, plankton * 0.4)
      }
      color.set([r, g, b, 255], i * 4)
      greenGlow.set([40 * leaf, 255 * leaf, 70 * leaf, 255], i * 4)
      seaGlow.set([30 * plankton, 255 * plankton, 190 * plankton, 255], i * 4)
    }
  }
  const tex = data => {
    const t = canvasTex(W, g => g.putImageData(new ImageData(data, W, H), 0, 0), { height: H })
    t.anisotropy = 8
    return t
  }
  // clouds: belts at the equator and in the westerlies, little over the deserts' latitudes
  const clouds = new Uint8ClampedArray(W * H * 4)
  for (let y = 0; y < H; y++) {
    const lat = 90 - ((y + 0.5) / H) * 180
    const alat = Math.abs(lat)
    const belt = 0.45 * Math.exp(-((lat / 8) ** 2)) + 0.55 * Math.exp(-(((alat - 55) / 12) ** 2)) + 0.15
    for (let x = 0; x < W; x++) {
      const n = noise.fbm2(x / 16 + 300, y / 7, 6)
      const a = THREE.MathUtils.smoothstep(n + belt * 0.32, 0.6, 0.9) * 0.85
      clouds.set([255, 255, 255, 255 * a], (y * W + x) * 4)
    }
  }
  return { color: tex(color), green: tex(greenGlow), sea: tex(seaGlow), clouds: tex(clouds), land }
}

export function globeExhibit({ color, light, words, level }) {
  const group = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.08 })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.5, 48), white)
  base.position.y = 0.25
  base.castShadow = base.receiveShadow = true
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.03, 8, 64), glowMat(color, 1.8))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.5
  group.add(base, ring)
  // a slim meridian arc holds it, as on a desk globe
  const steel = new THREE.MeshStandardMaterial({ color: '#c7cdd6', roughness: 0.25, metalness: 1 })
  const R = 0.9
  const cy = 1.75
  const holder = new THREE.Mesh(new THREE.TorusGeometry(R + 0.1, 0.02, 8, 80, Math.PI * 1.1), steel)
  holder.position.y = cy
  holder.rotation.z = -Math.PI * 0.55 + 0.41
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, cy - R - 0.5, 12), steel)
  stem.position.y = 0.5 + (cy - R - 0.5) / 2
  group.add(holder, stem)

  const tex = earthTextures()
  const tilt = new THREE.Group()
  tilt.position.y = cy
  tilt.rotation.z = (23.4 * Math.PI) / 180
  group.add(tilt)
  const spinner = new THREE.Group()
  tilt.add(spinner)
  const earthMat = new THREE.MeshStandardMaterial({ map: tex.color, roughness: 0.75, metalness: 0, emissive: '#ffffff', emissiveMap: tex.green, emissiveIntensity: 0 })
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), earthMat)
  earth.castShadow = true
  spinner.add(earth)
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', alphaMap: tex.clouds, transparent: true, opacity: 0.7, roughness: 1, depthWrite: false })
  // an alpha map reads the green channel: the cloud texture is white with alpha, so draw alpha into it
  cloudMat.alphaMap = null
  cloudMat.map = tex.clouds
  const cloudShell = new THREE.Mesh(new THREE.SphereGeometry(R * 1.012, 72, 48), cloudMat)
  cloudShell.renderOrder = 2
  spinner.add(cloudShell)
  // the atmosphere: a thin blue rim, brightest at the edge
  const rimMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {},
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0);
        gl_FragColor = vec4(vec3(0.35, 0.65, 1.0) * f * 1.6, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const rim = new THREE.Mesh(new THREE.SphereGeometry(R * 1.045, 64, 40), rimMat)
  rim.renderOrder = 3
  tilt.add(rim)

  // O2 molecules rising from where they are made
  const count = light ? 20 : 44
  const rnd = random(2024)
  const o2Mat = new THREE.MeshStandardMaterial({ color: '#ff4a3c', emissive: '#ff3020', emissiveIntensity: 0.6, roughness: 0.3, transparent: true })
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 12, 8), o2Mat, count * 2)
  atoms.frustumCulled = false
  group.add(atoms)
  const bubbles = Array.from({ length: count }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), age: 0, life: 2 }))
  const m4 = new THREE.Matrix4()
  const v = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const one = new THREE.Vector3(1, 1, 1)
  const isLand = local => {
    // the texture's u runs with longitude from -180 at u = 0; a sphere's u = 0 is at -x... three's
    // SphereGeometry puts u = 0.5 on +x going round toward -z, so longitude = atan2(-z, x)
    const lon = Math.atan2(-local.z, local.x) * (180 / Math.PI)
    const lat = Math.asin(THREE.MathUtils.clamp(local.y / local.length(), -1, 1)) * (180 / Math.PI)
    const x = Math.floor(((lon + 180) / 360) * W) % W
    const y = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H))
    return tex.land[y * W + x] === 1
  }
  let mode = null
  let glow = 0
  let spawnWait = 0
  const spawn = () => {
    const b = bubbles.find(x => !x.on)
    if (!b) return
    // a point on the side facing the reader, on land or sea as the mode asks
    for (let tries = 0; tries < 30; tries++) {
      v.set(rnd() * 2 - 1, rnd() * 1.6 - 0.8, rnd() * 0.9 + 0.1).normalize()
      // v is in the group's frame; find it on the turning globe
      v2.copy(v).multiplyScalar(R)
      spinner.updateWorldMatrix(true, false)
      const local = spinner.worldToLocal(group.localToWorld(v2.clone().add(new THREE.Vector3(0, cy, 0))))
      const onLand = isLand(local)
      if ((mode === 'land' && onLand) || (mode === 'ocean' && !onLand)) {
        b.on = true
        b.age = 0
        b.life = 2.2 + rnd() * 1.2
        b.p.copy(v).multiplyScalar(R * 1.02).setY(b.p.y + cy)
        b.v.copy(v).multiplyScalar(0.14).add(new THREE.Vector3(0, 0.12, 0))
        b.q.setFromEuler(new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6))
        return
      }
    }
  }

  // the screen with the split bar
  const scr = standingScreen(
    { width: 2.1, height: 1.2, color, title: words.title, big: '', small: '', smallY: -0.3, titleSize: 0.12 },
    { top: 1.5, tilt: 0.2 },
  )
  scr.group.position.set(1.8, 0, 0.7)
  scr.group.rotation.y = -0.5
  group.add(scr.group)
  const bar = new THREE.Group()
  bar.position.y = 0.02
  scr.content.add(bar)
  const halves = {}
  ;[['land', '#4fd16a', -1], ['ocean', '#33c6e8', 1]].forEach(([id, c, s]) => {
    const m = new THREE.MeshBasicMaterial({ color: hdr(c, 1.2), transparent: true, opacity: 0.55 })
    const half = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.2), m)
    half.position.set(s * 0.37, 0, 0.002)
    const name = makeText(id === 'land' ? words.land : words.ocean, { size: 0.095, color: hdr('#ffffff', 1.3) })
    name.position.set(s * 0.37, 0.19, 0)
    const pct = makeText('50%', { size: 0.11, color: hdr('#0b1030', 1) })
    pct.position.set(s * 0.37, 0, 0.004)
    bar.add(half, name, pct)
    halves[id] = m
  })
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  const turn = to => {
    mode = to
    earthMat.emissiveMap = mode === 'land' ? tex.green : tex.sea
    earthMat.needsUpdate = true
    glow = 0
    return mode
  }
  return {
    group,
    screen: scr,
    get mode() {
      return mode
    },
    next: () => turn(mode === 'land' ? 'ocean' : 'land'),
    /** The half of the world shown, for the others in a room (src/net/shared.js). */
    state() {
      return { mode }
    },
    /** Someone else turned it: the same half glows here (a newcomer's at once). */
    setState({ mode: to = null } = {}, live = false) {
      if ((to !== 'land' && to !== 'ocean') || to === mode) return
      turn(to)
      if (!live) glow = 1
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t) {
      spinner.rotation.y = t * 0.12
      cloudShell.rotation.y = t * 0.02
      glow = damp(glow, mode ? 1 : 0, 2, dt)
      earthMat.emissiveIntensity = glow * (0.55 + Math.sin(t * 2.2) * 0.12)
      for (const [id, m] of Object.entries(halves)) m.opacity = damp(m.opacity, mode === id ? 1 : 0.45, 4, dt)
      if (mode) {
        spawnWait -= dt
        while (spawnWait < 0) {
          spawn()
          spawnWait += light ? 0.16 : 0.08
        }
      }
      bubbles.forEach((b, i) => {
        if (b.on) {
          b.age += dt
          if (b.age > b.life) b.on = false
          b.p.addScaledVector(b.v, dt)
        }
        const k = b.on ? Math.min(1, b.age * 3) * (1 - Math.max(0, (b.age - b.life + 0.6) / 0.6)) : 0
        for (let s = 0; s < 2; s++) {
          v.set(s ? 0.026 : -0.026, 0, 0).applyQuaternion(b.q).add(b.p)
          atoms.setMatrixAt(i * 2 + s, m4.compose(v, b.q, one.setScalar(Math.max(0.0001, k))))
        }
      })
      atoms.instanceMatrix.needsUpdate = true
    },
  }
}
