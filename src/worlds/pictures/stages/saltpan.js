// A stage for picture rooms (docs/knowledge/picture-rooms.md): a salt works on a flat coast on a bright,
// windy afternoon, made for sodium's picture of Aveiro's salinas. A round platform of packed clay to walk
// on (an eira), cut straight by a canal (an esteiro) across its back; round it a grid of shallow pans
// divided by low clay walls, their water turquoise to pale mint (the paler, the saltier), white heaps of
// salt on the walls here and there; beyond, the lagoon, the sea on the left horizon, a dune with a
// red and white lighthouse, a green shore with white houses on the right; gulls, a few clouds, the sun
// ahead and to the right with the boards' short rays.
//
// Water everywhere is one shader (`water({ tint, alpha })` gives a scene its own pond with it): the
// colour of the water, the sky mirrored at a slant, the sun glittering on ripples that the wind drives.
// setWeather(k) (0 calm and hazy to 1 hot and windy): ripples, drifting specks, the sun a little dimmed
// when calm. Surfaces are mid-toned: pale ones bloom to white under the bright sky.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, clamp } from '../../wings/noble/kit.js'
import { ringWall } from '../kit.js'
import { cloudTexture } from './meadow.js'
import { box } from '../../../engine/collide.js'

const C = c => new THREE.Color(c)
const SKY = { top: C('#2a68ad'), mid: C('#5e9bd0'), horizon: C('#e7c9a0') }
// the sun: ahead (-z) and to the right, as in the picture, high enough to light the fronts a little
const SUN_DIR = new THREE.Vector3(0.52, 0.31, -0.76).normalize()

/** Where the walker may go: the platform (a disc of `radius` cut by the canal's near bank). */
function onPlatform(x, z, radius, nearBank) {
  return Math.hypot(x, z) < radius && z > nearBank
}

/** The water shader: the water's own colour (per vertex, or `uTint` for a pond), the sky mirrored by
 *  the Fresnel term, and the sun glittering on ripples that the wind moves. */
function waterShader(shared, { tint = null, alpha = 1 } = {}) {
  return new THREE.ShaderMaterial({
    fog: true,
    transparent: alpha < 1,
    depthWrite: alpha >= 1,
    uniforms: {
      ...shared,
      uTint: { value: new THREE.Color(tint ?? '#3c9fb2') },
      uUseTint: { value: tint ? 1 : 0 },
      uAlpha: { value: alpha },
      fogColor: { value: new THREE.Color() },
      fogNear: { value: 1 },
      fogFar: { value: 2000 },
      fogDensity: { value: 0.00025 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aTint;
      varying vec3 vWorld;
      varying vec3 vTint;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vTint = aTint;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDir; uniform vec3 uSunColor; uniform vec3 uSkyTop; uniform vec3 uSkyHorizon;
      uniform float uTime; uniform float uWind; uniform float uGlint;
      uniform vec3 uTint; uniform float uUseTint; uniform float uAlpha;
      varying vec3 vWorld;
      varying vec3 vTint;
      #include <fog_pars_fragment>
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      // ripples running with the wind (along +x, a little toward +z)
      float waves(vec2 p) {
        float t = uTime;
        float s = 0.35 + 1.4 * uWind;
        return noise(p * 2.1 - vec2(t * s, t * s * 0.3)) + 0.55 * noise(p * 5.3 - vec2(t * s * 1.6, -t * 0.4));
      }
      void main() {
        vec3 V = normalize(cameraPosition - vWorld);
        float dist = length(cameraPosition - vWorld);
        float e = 0.04;
        vec2 p = vWorld.xz;
        float h0 = waves(p);
        // ripples fade with distance (far away they would only shimmer)
        float amp = (0.05 + 0.22 * uWind) * (1.0 - smoothstep(25.0, 90.0, dist));
        vec3 N = normalize(vec3(-(waves(p + vec2(e, 0.0)) - h0) / e * amp, 1.0, -(waves(p + vec2(0.0, e)) - h0) / e * amp));
        float fres = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
        vec3 R = reflect(-V, N);
        vec3 sky = mix(uSkyHorizon, uSkyTop, pow(clamp(R.y, 0.0, 1.0), 0.6));
        vec3 base = mix(vTint, uTint, uUseTint);
        vec3 c = mix(base, sky, fres * 0.45);
        // the sun's glitter, sharp on the ripples
        float sp = pow(max(dot(R, uSunDir), 0.0), 420.0);
        c += uSunColor * sp * uGlint;
        gl_FragColor = vec4(c, mix(uAlpha, 1.0, fres * 0.6));
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
}

export function saltpanStage({ radius = 12, light = false, canal = { z: -9.8, width: 1.6 } } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const updates = []
  const nearBank = canal.z + canal.width / 2
  const farBank = canal.z - canal.width / 2
  let wind = 0.6
  const sunDir = SUN_DIR.clone()

  // ---- the sky: blue above, warm at the horizon, the sun with its short rays ----
  const skyU = {
    uSunDir: { value: sunDir },
    uTop: { value: SKY.top.clone() },
    uMid: { value: SKY.mid.clone() },
    uHorizon: { value: SKY.horizon.clone() },
    uSun: { value: 1 },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon; uniform float uSun;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = max(d.y, 0.0);
          vec3 c = mix(uMid, uTop, smoothstep(0.12, 0.85, h));
          c = mix(uHorizon, c, smoothstep(0.0, 0.16, h));
          if (d.y < 0.0) c = uHorizon * 0.92;
          float s = dot(d, uSunDir);
          // a warm glow round the sun, and the horizon warmer on its side
          c += vec3(1.0, 0.82, 0.55) * (pow(max(s, 0.0), 12.0) * 0.3 + pow(max(s, 0.0), 160.0) * 0.6) * uSun;
          // the disc and its short rays, as the boards draw the sun
          float a = acos(clamp(s, -1.0, 1.0));
          float disc = 1.0 - smoothstep(0.05, 0.056, a);
          vec3 t1 = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
          vec3 t2 = cross(t1, uSunDir);
          float ang = atan(dot(d, t2), dot(d, t1));
          float ray = pow(abs(cos(ang * 6.0)), 40.0) * smoothstep(0.066, 0.074, a) * (1.0 - smoothstep(0.1, 0.118, a));
          vec3 sunC = vec3(2.5, 1.95, 1.1);
          c = mix(c, sunC, disc * (0.55 + 0.45 * uSun));
          c += sunC * 0.45 * ray * uSun;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  sky.frustumCulled = false
  group.add(sky)

  // ---- the water shader's shared uniforms (every pond, the canal, the lagoon, the sea) ----
  const shared = {
    uSunDir: { value: sunDir },
    uSunColor: { value: new THREE.Color(1.0, 0.86, 0.62) },
    uSkyTop: { value: SKY.mid.clone() },
    uSkyHorizon: { value: SKY.horizon.clone().lerp(SKY.mid, 0.7) },
    uTime: { value: 0 },
    uWind: { value: wind },
    uGlint: { value: 7 },
  }
  const waterMats = []
  const water = opts => {
    const m = waterShader(shared, opts)
    waterMats.push(m)
    return m
  }
  const tinted = (geo, color) => {
    const c = new THREE.Color(color)
    const n = geo.attributes.position.count
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3)
    geo.setAttribute('aTint', new THREE.BufferAttribute(arr, 3))
    return geo
  }

  // ---- the clay: the platform you walk on, the pans' walls, their floors ----
  const clayTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#93765a'
    g.fillRect(0, 0, w, w)
    let s = 7
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 1400; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(118,92,68,${0.15 + rnd() * 0.2})` : v < 0.9 ? `rgba(160,134,104,${0.12 + rnd() * 0.18})` : 'rgba(215,215,208,0.3)'
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * w, 0.8 + rnd() * 3, 0.8 + rnd() * 2, rnd() * Math.PI, 0, Math.PI * 2)
      g.fill()
    }
    // fine cracks of dried clay
    g.strokeStyle = 'rgba(92,70,50,0.35)'
    g.lineWidth = 1
    for (let i = 0; i < 40; i++) {
      let x = rnd() * w
      let y = rnd() * w
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 5; k++) {
        x += (rnd() - 0.5) * 30
        y += (rnd() - 0.5) * 30
        g.lineTo(x, y)
      }
      g.stroke()
    }
  }, { repeat: true })
  disposers.push(() => clayTex.dispose())
  const platformMat = new THREE.MeshStandardMaterial({ map: clayTex, color: '#d2c4b2', roughness: 1 })
  const wallMat = new THREE.MeshStandardMaterial({ color: '#7f5f45', roughness: 1 })
  const floorMat = new THREE.MeshStandardMaterial({ color: '#5f4a37', roughness: 1 })

  // the platform: the disc on the near side of the canal
  {
    const pts = []
    const zc = nearBank
    const top = Math.acos(clamp(zc / radius, -1, 1)) // the arc's half angle, from +z
    const n = 96
    for (let i = 0; i <= n; i++) {
      const th = -top + (2 * top * i) / n
      pts.push(new THREE.Vector2(Math.sin(th) * radius, -Math.cos(th) * radius))
    }
    // drawn with y = -z: rotateX(-90°) maps the shape's y to the world's -z, faces up
    const shape = new THREE.Shape(pts)
    const geo = new THREE.ShapeGeometry(shape, 1)
    geo.rotateX(-Math.PI / 2)
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2.2, uv.getY(i) / 2.2)
    const platform = new THREE.Mesh(geo, platformMat)
    platform.receiveShadow = true
    group.add(platform)
    // its edge: a clay bank down to the pans' floor round the arc (a cylinder's angle is from +z, as here)
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.08, 0.22, 96, 1, true, -top, 2 * top), wallMat)
    skirt.position.y = -0.11
    group.add(skirt)
  }

  // the floor under every pan, out to the lagoon
  {
    const floor = new THREE.Mesh(new THREE.CircleGeometry(47, 64).rotateX(-Math.PI / 2), floorMat)
    floor.position.y = -0.13
    floor.receiveShadow = true
    group.add(floor)
  }

  // ---- the pans round about: a grid of shallow pools in low clay walls ----
  const CX = 5.6
  const CZ = 3.9
  const WALL = 0.34
  const PALETTE = ['#3ba3b6', '#3399b0', '#47b0bb', '#3ba3b6', '#5cbabc', '#7cc7bf', '#94d0c2', '#a4d6c6']
  const panGeos = []
  const wallGeos = []
  const edges = new Set()
  const heapSpots = []
  let seed = 41
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const zOff = CZ / 2
  for (let i = -9; i <= 9; i++) {
    for (let j = -12; j <= 12; j++) {
      const cx = i * CX
      const cz = j * CZ + zOff
      if (Math.hypot(cx, cz) > 43) continue
      const x0 = cx - CX / 2
      const x1 = cx + CX / 2
      const z0 = cz - CZ / 2
      const z1 = cz + CZ / 2
      // not on the platform (with a margin), not in the canal
      const nx = clamp(0, x0, x1)
      const nz = clamp(0, z0, z1)
      if (Math.hypot(nx, nz) < radius + 0.7 && z1 > nearBank - 0.2) continue
      if (z0 < nearBank + 0.3 && z1 > farBank - 0.3) continue
      const pick = PALETTE[Math.floor(rnd() * PALETTE.length)]
      const g = new THREE.PlaneGeometry(CX - WALL, CZ - WALL).rotateX(-Math.PI / 2)
      g.translate(cx, -0.05, cz)
      // a touch of light and dark between pans
      const tint = new THREE.Color(pick).multiplyScalar(0.92 + rnd() * 0.12)
      panGeos.push(tinted(g, tint))
      for (const [key, x, z, w, d] of [
        [`h${i},${j}`, cx, z0, CX + WALL, WALL],
        [`h${i},${j + 1}`, cx, z1, CX + WALL, WALL],
        [`v${i},${j}`, x0, cz, WALL, CZ + WALL],
        [`v${i + 1},${j}`, x1, cz, WALL, CZ + WALL],
      ]) {
        if (edges.has(key)) continue
        edges.add(key)
        const b = new THREE.BoxGeometry(w, 0.12, d)
        b.translate(x, -0.075, z)
        wallGeos.push(b)
      }
      if (rnd() < 0.18) heapSpots.push([x0 + (rnd() < 0.5 ? 0 : CX), z0 + rnd() * CZ])
    }
  }
  // the canal: a water strip from the lagoon to the lagoon, with its banks
  {
    // (to the bank where the pans end: farther, it would lie on the lagoon's water)
    const len = 2 * Math.sqrt(43.5 ** 2 - canal.z ** 2)
    const g = new THREE.PlaneGeometry(len, canal.width).rotateX(-Math.PI / 2)
    g.translate(0, -0.08, canal.z)
    panGeos.push(tinted(g, '#2f8fa2'))
    for (const z of [nearBank, farBank]) {
      const b = new THREE.BoxGeometry(len, 0.2, 0.3)
      b.translate(0, -0.06, z + (z === nearBank ? 0.15 : -0.15))
      wallGeos.push(b)
    }
  }
  const pans = new THREE.Mesh(mergeGeometries(panGeos), water())
  const walls = new THREE.Mesh(mergeGeometries(wallGeos), wallMat)
  walls.receiveShadow = true
  for (const g of [...panGeos, ...wallGeos]) g.dispose()
  group.add(pans, walls)

  // white heaps on the far walls, as the picture's
  const saltMat = new THREE.MeshStandardMaterial({ color: '#c9cdcf', roughness: 0.9 })
  {
    const heaps = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 9), saltMat, heapSpots.length)
    const o = new THREE.Object3D()
    heapSpots.forEach(([x, z], k) => {
      const s = 0.55 + rnd() * 0.6
      o.position.set(x, 0.04 + s * 0.6, z)
      o.scale.set(s * 0.8, s * 1.2, s * 0.8)
      o.rotation.y = rnd() * 3
      o.updateMatrix()
      heaps.setMatrixAt(k, o.matrix)
    })
    heaps.castShadow = true
    group.add(heaps)
  }

  // ---- beyond: the lagoon, the sea on the left, a dune with its lighthouse, a green shore ----
  {
    // the far water: lagoon teal near, the sea's deep blue ahead and to the left
    const geo = new THREE.RingGeometry(44, 400, 96, 12).rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    const tint = new Float32Array(pos.count * 3)
    const lagoon = C('#2c8798')
    const sea = C('#1e5e8e')
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const r = Math.hypot(x, z)
      // the azimuth from straight ahead (-z), positive to the right
      const az = Math.atan2(x, -z)
      const seaward = clamp((r - 120) / 50) * clamp((0.15 - az) / 0.35) * clamp((az + 2.2) / 0.4)
      c.copy(lagoon).lerp(sea, seaward)
      tint.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 3))
    const far = new THREE.Mesh(geo, water())
    far.position.y = -0.09
    group.add(far)
    // the bank where the pans end
    const bank = new THREE.Mesh(new THREE.RingGeometry(43.2, 44.6, 96).rotateX(-Math.PI / 2), wallMat)
    bank.position.y = -0.02
    group.add(bank)
  }
  const sandMat = new THREE.MeshStandardMaterial({ color: '#b9a37e', roughness: 1, side: THREE.DoubleSide })
  const landMat = new THREE.MeshStandardMaterial({ color: '#6c8a4f', roughness: 1, side: THREE.DoubleSide })
  /** A long low ridge along an arc (a dune, a shore) from r0 to r1, azimuths a0 to a1 from straight ahead
   *  (-z), positive to the right; its crest `h` high, tapering at the two ends. */
  const crestOf = (k, h) => h * Math.min(1, Math.min(k, 1 - k) * 8) * (0.75 + 0.25 * Math.sin(k * 23))
  const arcPiece = (r0, r1, a0, a1, h, mat) => {
    const n = 64
    const rows = [[r0, () => -0.2], [(r0 + r1) / 2, k => crestOf(k, h)], [r1, () => -0.2]]
    const pos = []
    const idx = []
    for (let i = 0; i <= n; i++) {
      const k = i / n
      const az = a0 + (a1 - a0) * k
      for (const [r, y] of rows) pos.push(Math.sin(az) * r, y(k), -Math.cos(az) * r)
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < 2; j++) {
        const a = i * 3 + j
        idx.push(a, a + 3, a + 1, a + 1, a + 3, a + 4)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, mat)
  }
  group.add(arcPiece(150, 168, -0.05, 1.25, 3.2, sandMat))
  group.add(arcPiece(170, 230, 0.35, 2.4, 9, landMat))
  group.add(arcPiece(205, 260, 2.4, 4.0, 6, landMat))
  // white houses with red roofs on the green shore (the picture's)
  {
    // on the shore's near slope: the ground there rises from the water's edge to the crest
    const spots = []
    const onSlope = (r0, rm, a0, a1, h, az, r) => ((r - r0) / (rm - r0)) * crestOf((az - a0) / (a1 - a0), h)
    for (let k = 0; k < (light ? 14 : 28); k++) {
      const az = 0.5 + rnd() * 1.7
      const r = 172 + rnd() * 6
      spots.push([Math.sin(az) * r, -Math.cos(az) * r, az, onSlope(170, 200, 0.35, 2.4, 9, az, r)])
    }
    for (let k = 0; k < (light ? 8 : 16); k++) {
      const az = 2.6 + rnd() * 1.3
      const r = 208 + rnd() * 6
      spots.push([Math.sin(az) * r, -Math.cos(az) * r, az, onSlope(205, 232.5, 2.4, 4.0, 6, az, r)])
    }
    const walls2 = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#d9d4c8', roughness: 0.9 }), spots.length)
    const roofs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.75, 0.5, 4).rotateY(Math.PI / 4), new THREE.MeshStandardMaterial({ color: '#b5462e', roughness: 0.8 }), spots.length)
    const o = new THREE.Object3D()
    spots.forEach(([x, z, az, y0], k) => {
      const w = 3.5 + rnd() * 3
      const h = 2.6 + rnd() * 2
      o.position.set(x, y0 + h / 2 - 0.3, z)
      o.rotation.set(0, -az, 0)
      o.scale.set(w, h, 3.2)
      o.updateMatrix()
      walls2.setMatrixAt(k, o.matrix)
      o.position.y = y0 + h - 0.3 + 0.6
      o.scale.set(w, 2.4, 3.2 * 1.4)
      o.updateMatrix()
      roofs.setMatrixAt(k, o.matrix)
    })
    group.add(walls2, roofs)
  }
  // the lighthouse at the lagoon's mouth: a tall tower in red and white bands
  {
    const bands = canvasTex(32, 256, (g, w, h) => {
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#c8c4bc' : '#b23a2a'
        g.fillRect(0, (i * h) / 8, w, h / 8)
      }
    })
    disposers.push(() => bands.dispose())
    const lh = new THREE.Group()
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.25, 15, 20), new THREE.MeshStandardMaterial({ map: bands, roughness: 0.8 }))
    tower.position.y = 7.5
    const gallery = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.3, 20), new THREE.MeshStandardMaterial({ color: '#3a3a3a', roughness: 0.6 }))
    gallery.position.y = 15.1
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.4, 16), new THREE.MeshStandardMaterial({ color: '#c8d6dc', roughness: 0.2, emissive: '#fff3c0', emissiveIntensity: 0.3 }))
    lantern.position.y = 16
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#b23a2a', roughness: 0.6 }))
    cap.position.y = 17.1
    lh.add(tower, gallery, lantern, cap)
    const az = -0.02
    lh.position.set(Math.sin(az) * 152, 1.5, -Math.cos(az) * 152)
    group.add(lh)
  }

  // a few clouds, high and white
  const cloudTex = cloudTexture(9)
  disposers.push(() => cloudTex.dispose())
  const cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: '#e8eef4', opacity: 0.8 })
  const clouds = []
  for (const [a, el, d, w] of [[-1.4, 0.17, 300, 70], [-0.6, 0.28, 320, 55], [1.6, 0.2, 310, 80], [2.6, 0.24, 300, 60], [3.8, 0.15, 320, 75], [-2.4, 0.22, 300, 60]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.4), cloudMat)
    clouds.push({ m, a, el, d, speed: 0.0025 + (clouds.length % 3) * 0.0012 })
    m.renderOrder = -5
    group.add(m)
  }
  // a cloud that can drift over the sun when the day is calm and hazy (setWeather)
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(70, 30), new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: '#f2f4f6', opacity: 0 }))
  veil.renderOrder = -4
  group.add(veil)

  // gulls wheeling overhead (the picture's dark birds)
  const gullMat = new THREE.MeshStandardMaterial({ color: '#3b4250', roughness: 0.8, side: THREE.DoubleSide })
  const wingGeo = new THREE.BufferGeometry()
  wingGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -0.12, 0, 0, 0.12, 0.75, 0.04, 0.02], 3))
  wingGeo.computeVertexNormals()
  const gulls = []
  for (let k = 0; k < (light ? 3 : 6); k++) {
    const b = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.3, 3, 6).rotateX(Math.PI / 2), gullMat)
    const l = new THREE.Mesh(wingGeo, gullMat)
    const r = new THREE.Mesh(wingGeo, gullMat)
    r.scale.x = -1
    b.add(body, l, r)
    group.add(b)
    gulls.push({ b, l, r, rad: 9 + k * 3.2, h: 9 + (k % 3) * 2.5, sp: 0.12 + (k % 2) * 0.05, ph: k * 1.7, cx: (k % 2 ? -4 : 6), cz: -10 - k })
  }

  // specks of salt and sand blown along by the wind
  const SPECKS = light ? 90 : 260
  const sp = new Float32Array(SPECKS * 3)
  const spBase = []
  for (let i = 0; i < SPECKS; i++) spBase.push([(rnd() - 0.5) * 2 * (radius + 6), 0.15 + rnd() * 3.5, (rnd() - 0.5) * 2 * (radius + 6), rnd() * 10])
  const specksGeo = new THREE.BufferGeometry()
  specksGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  const specks = new THREE.Points(specksGeo, new THREE.PointsMaterial({ color: '#fff6e0', size: 0.035, transparent: true, opacity: 0.6, depthWrite: false }))
  specks.frustumCulled = false
  group.add(specks)

  // ---- light ----
  const hemi = new THREE.HemisphereLight('#cfe2f4', '#8a6a4c', 1.35)
  const sun = new THREE.DirectionalLight('#fff0d6', 2.6)
  sun.position.copy(sunDir).multiplyScalar(40)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -(radius + 5)
  sun.shadow.camera.right = sun.shadow.camera.top = radius + 5
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 90
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  group.add(hemi, sun, sun.target)

  const background = SKY.horizon.clone()
  const fog = new THREE.Fog(SKY.horizon.clone().lerp(SKY.mid, 0.25), 80, 380)

  /** The weather: 0 calm and hazy, 1 hot and windy (ripples, specks, the sun's veil). */
  function setWeather(k) {
    wind = clamp(k)
    shared.uWind.value = wind
  }
  setWeather(wind)
  let veilK = 0

  updates.push((t, dt) => {
    shared.uTime.value = t
    // the veil drifts over the sun on a calm, hazy day and away on a hot one
    veilK += ((wind < 0.35 ? (0.35 - wind) / 0.35 : 0) - veilK) * Math.min(1, dt * 1.5)
    veil.material.opacity = 0.85 * veilK
    veil.position.copy(sunDir).multiplyScalar(260).add(new THREE.Vector3(-10 + 40 * (1 - veilK), 0, 0))
    veil.lookAt(0, veil.position.y * 0.5, 0)
    skyU.uSun.value = 1 - 0.55 * veilK
    sun.intensity = 2.6 * (1 - 0.35 * veilK)
    shared.uGlint.value = 7 * (1 - 0.6 * veilK)
    for (const c of clouds) {
      const a = c.a + t * c.speed
      c.m.position.set(Math.sin(a) * Math.cos(c.el) * c.d, Math.sin(c.el) * c.d, -Math.cos(a) * Math.cos(c.el) * c.d)
      c.m.lookAt(0, c.m.position.y * 0.5, 0)
    }
    for (const g of gulls) {
      const a = t * g.sp + g.ph
      const x = g.cx + Math.cos(a) * g.rad
      const z = g.cz + Math.sin(a) * g.rad
      g.b.position.set(x, g.h + Math.sin(a * 2) * 0.6, z)
      g.b.rotation.set(0, -a, Math.sin(a) * 0.15)
      const flap = Math.sin(t * 5 + g.ph) * 0.45
      g.l.rotation.z = flap
      g.r.rotation.z = -flap
    }
    const blow = 0.4 + 3.2 * wind
    const span = 2 * (radius + 6)
    for (let i = 0; i < SPECKS; i++) {
      const [bx, by, bz, s] = spBase[i]
      let x = bx + t * blow + s
      x = ((((x + span / 2) % span) + span) % span) - span / 2
      sp[i * 3] = x
      sp[i * 3 + 1] = by + Math.sin(t * 1.3 + s) * 0.15
      sp[i * 3 + 2] = bz + Math.sin(t * 0.7 + s) * 0.4
    }
    specksGeo.attributes.position.needsUpdate = true
  })

  const solids = [...ringWall(radius), box(0, canal.z, 2 * radius + 4, canal.width + 0.2)]

  return {
    group,
    solids,
    sunDir,
    sunLight: sun,
    mats: { clay: platformMat, wall: wallMat, floor: floorMat, salt: saltMat, sand: sandMat },
    /** A scene's own water (a pond, a stream): the stage's shader with its own colour. */
    // perVertex: the geometry's own colours (an `aTint` attribute) instead of one tint
    water: ({ tint = '#3c9fb2', alpha = 1, perVertex = false } = {}) => water({ tint: perVertex ? null : tint, alpha }),
    onPlatform: (x, z) => onPlatform(x, z, radius, nearBank),
    get wind() {
      return wind
    },
    setWeather,
    env: {
      background,
      fog,
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.45, radius: 0.5, threshold: 0.92 },
      fov: 62,
      shadows: true,
      far: 1200,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: nearBank + 0.4, maxZ: radius + 1 },
    update(t, dt = 1 / 60) {
      for (const u of updates) u(t, dt)
    },
    dispose() {
      disposers.forEach(f => f())
      for (const m of waterMats) m.dispose()
    },
  }
}
