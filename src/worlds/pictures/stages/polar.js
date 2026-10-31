// A stage for picture rooms (docs/knowledge/picture-rooms.md): an Antarctic ice shelf on a clear spring day,
// flat snow to the horizon under a deep blue sky, the sun low (a polar sun never climbs high), long blue
// shadows and the snow carved by the wind into sastrugi, low ridges all lying the same way. Route flags on
// bamboo poles, as Antarctic stations mark their ways, and far off a research station of modules on legs
// (`station`: { x, z, rot } or null), like Halley VI on the Brunt Ice Shelf. Walking inside a circle of
// `radius`; the snow goes on to the horizon.
//
// `sun`: a direction toward the sun (it is normalised); its elevation sets how warm and long the light is.
// `wind`: the angle (radians, atan2(z, x)) the sastrugi run along. `flags`: [[x, z], ...] route flags.
// setNacreous(k): mother-of-pearl clouds (polar stratospheric clouds lit by a low sun) high in the sky,
// from 0 (none) to 1. Surfaces are mid-toned: fresh snow drawn as white blooms the whole view white.
import * as THREE from 'three'
import { canvasTex, random, smooth } from '../../wings/noble/kit.js'
import { circle } from '../../../engine/collide.js'
import { motes, ringWall } from '../kit.js'

const TAU = Math.PI * 2

export function polarStage({ radius = 14, light = false, sun = [0.5, 0.3, 0.8], wind = -0.5, flags = [], station = { x: -70, z: -150, rot: 0.25 } } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const sunDir = new THREE.Vector3(...sun).normalize()
  const el = Math.asin(sunDir.y)

  // ---- the sky: deep blue overhead, pale at the horizon, warm round the low sun ----
  const skyU = {
    uSunDir: { value: sunDir.clone() },
    uZenith: { value: new THREE.Color('#174aa8') },
    uHorizon: { value: new THREE.Color('#a9c6ea') },
    uGlow: { value: new THREE.Color('#ffc98a') },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(900, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGlow;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = max(d.y, 0.0);
          // a clear polar sky turns deep blue only a little above the horizon
          vec3 c = mix(uHorizon, uZenith, pow(h, 0.3));
          // below the horizon: the snow's own glare
          if (d.y < 0.0) c = mix(uHorizon, uHorizon * 0.9, clamp(-d.y * 6.0, 0.0, 1.0));
          float s = clamp(dot(d, uSunDir), -1.0, 1.0);
          c += uGlow * (pow(max(s, 0.0), 8.0) * 0.28 + pow(max(s, 0.0), 90.0) * 0.45);
          c += uGlow * 0.18 * pow(max(s, 0.0), 2.0) * (1.0 - clamp(h * 4.0, 0.0, 1.0));
          // the sun's disc and its short rays (the boards' sun)
          float a = acos(s);
          float disc = 1.0 - smoothstep(0.03, 0.036, a);
          vec3 t1 = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
          vec3 t2 = cross(t1, uSunDir);
          float ang = atan(dot(d, t2), dot(d, t1));
          float ray = pow(abs(cos(ang * 6.0)), 40.0) * smoothstep(0.045, 0.052, a) * (1.0 - smoothstep(0.075, 0.09, a));
          vec3 sunC = vec3(2.6, 2.1, 1.4);
          c = mix(c, sunC, disc);
          c += sunC * 0.4 * ray;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  group.add(sky)

  // ---- the snow: wind streaks lying one way, brighter crests, faint blue hollows ----
  const snowTex = canvasTex(1024, 1024, (g, w) => {
    g.fillStyle = '#d6dfeb'
    g.fillRect(0, 0, w, w)
    const rnd = random(7517)
    // long soft streaks along the wind (the texture is turned to the wind below)
    for (let i = 0; i < 900; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const len = 30 + rnd() * 160
      const v = rnd()
      g.strokeStyle = v < 0.55 ? `rgba(150,170,205,${0.08 + rnd() * 0.12})` : `rgba(255,255,255,${0.12 + rnd() * 0.2})`
      g.lineWidth = 1.5 + rnd() * 6
      g.lineCap = 'round'
      g.beginPath()
      g.moveTo(x, y)
      g.quadraticCurveTo(x + len * 0.5, y + (rnd() - 0.5) * 8, x + len, y + (rnd() - 0.5) * 6)
      g.stroke()
    }
    // fine grain
    for (let i = 0; i < 9000; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(140,160,200,${0.08 + rnd() * 0.1})` : `rgba(255,255,255,${0.2 + rnd() * 0.3})`
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd())
    }
  }, { repeat: true })
  snowTex.repeat.set(70, 70)
  snowTex.rotation = wind
  disposers.push(() => snowTex.dispose())
  const snowMat = new THREE.MeshStandardMaterial({ map: snowTex, color: '#c7d1df', roughness: 0.92, metalness: 0 })
  const snow = new THREE.Mesh(new THREE.CircleGeometry(860, 96).rotateX(-Math.PI / 2), snowMat)
  snow.receiveShadow = true
  group.add(snow)

  // sastrugi: low ridges carved by the wind, all lying along it, kept off the middle where the room walks
  const SAS = light ? 260 : 700
  const ridge = new THREE.SphereGeometry(1, 14, 6, 0, TAU, 0, Math.PI / 2)
  {
    // a sharper windward end: the ridges are teardrops in plan
    const p = ridge.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      p.setY(i, p.getY(i) * (1 - 0.35 * Math.max(0, x)))
      p.setZ(i, p.getZ(i) * (1 - 0.45 * Math.max(0, x)))
    }
    ridge.computeVertexNormals()
  }
  const sastrugi = new THREE.InstancedMesh(ridge, snowMat, SAS)
  sastrugi.castShadow = !light
  sastrugi.receiveShadow = true
  {
    const o = new THREE.Object3D()
    const rnd = random(311)
    let n = 0
    for (let tries = 0; n < SAS && tries < SAS * 4; tries++) {
      const a = rnd() * TAU
      const r = radius - 3 + Math.pow(rnd(), 0.7) * 120
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      // the walkable middle stays smooth; the ridges begin near its edge
      if (Math.hypot(x, z) < radius - 2.5) continue
      o.position.set(x, -0.02, z)
      o.rotation.set(0, -wind + (rnd() - 0.5) * 0.25, 0)
      const L = 0.8 + rnd() * 2.6
      o.scale.set(L, 0.06 + rnd() * 0.16, 0.25 + rnd() * 0.45)
      o.updateMatrix()
      sastrugi.setMatrixAt(n++, o.matrix)
    }
    sastrugi.count = n
  }
  group.add(sastrugi)

  // ---- route flags on bamboo poles ----
  const solids = ringWall(radius)
  if (flags.length) {
    const bamboo = new THREE.MeshStandardMaterial({ color: '#b58f52', roughness: 0.8 })
    const cloth = new THREE.MeshStandardMaterial({ color: '#23262c', roughness: 0.9, side: THREE.DoubleSide })
    const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.024, 2.0, 6).translate(0, 1.0, 0), bamboo, flags.length)
    const flagGeo = new THREE.PlaneGeometry(0.34, 0.22, 6, 1).translate(0.17, 1.86, 0)
    const cloths = []
    const o = new THREE.Object3D()
    flags.forEach(([x, z], i) => {
      o.position.set(x, 0, z)
      o.rotation.set(0, 0, 0)
      o.updateMatrix()
      poles.setMatrixAt(i, o.matrix)
      const f = new THREE.Mesh(flagGeo.clone(), cloth)
      f.position.set(x, 0, z)
      f.rotation.y = -wind + Math.PI
      group.add(f)
      cloths.push({ f, base: f.geometry.attributes.position.array.slice(), ph: i * 1.7 })
      solids.push(circle(x, z, 0.08))
    })
    poles.castShadow = !light
    group.add(poles)
    group.userData.flags = cloths
  }

  // ---- a research station far off: modules on legs, joined in a line ----
  if (station) {
    const st = new THREE.Group()
    st.position.set(station.x, 0, station.z)
    st.rotation.y = station.rot
    const blue = new THREE.MeshStandardMaterial({ color: '#3f6fae', roughness: 0.55, metalness: 0.2 })
    const red = new THREE.MeshStandardMaterial({ color: '#b8392e', roughness: 0.55, metalness: 0.2 })
    const steel = new THREE.MeshStandardMaterial({ color: '#59606c', roughness: 0.6, metalness: 0.5 })
    const legs = []
    for (let i = 0; i < 8; i++) {
      const mid = i === 4
      const x = (i - 3.5) * 11.5
      const w = mid ? 11 : 9
      const h = mid ? 7.4 : 4.6
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 6.4), mid ? red : blue)
      m.position.set(x, 4.2 + h / 2, 0)
      st.add(m)
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) legs.push([x + sx * (w / 2 - 0.8), sz * 2.6])
      if (i < 7) {
        const link = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.0), steel)
        link.position.set(x + 5.75, 4.2 + 1.6, 0)
        st.add(link)
      }
    }
    const legGeo = new THREE.CylinderGeometry(0.3, 0.3, 4.2, 6).translate(0, 2.1, 0)
    const skiGeo = new THREE.BoxGeometry(2.6, 0.25, 0.9)
    const legMesh = new THREE.InstancedMesh(legGeo, steel, legs.length)
    const skiMesh = new THREE.InstancedMesh(skiGeo, steel, legs.length)
    const o = new THREE.Object3D()
    legs.forEach(([x, z], i) => {
      o.position.set(x, 0, z)
      o.updateMatrix()
      legMesh.setMatrixAt(i, o.matrix)
      o.position.y = 0.12
      o.updateMatrix()
      skiMesh.setMatrixAt(i, o.matrix)
      o.position.y = 0
    })
    st.add(legMesh, skiMesh)
    group.add(st)
  }

  // ---- mother-of-pearl clouds: polar stratospheric clouds, lit from below the horizon's edge ----
  const pearlTex = canvasTex(512, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const rnd = random(902)
    for (let i = 0; i < 14; i++) {
      const x = w * (0.15 + 0.7 * rnd())
      const y = h * (0.4 + 0.25 * rnd())
      const rx = w * (0.12 + 0.2 * rnd())
      const ry = h * (0.1 + 0.12 * rnd())
      // bands of colour across each lens, as a soap film's
      const grd = g.createLinearGradient(x, y - ry, x, y + ry)
      const hues = ['rgba(255,140,200,', 'rgba(120,220,255,', 'rgba(170,255,170,', 'rgba(255,230,140,', 'rgba(200,150,255,']
      const k = Math.floor(rnd() * hues.length)
      for (let j = 0; j < 5; j++) grd.addColorStop(j / 4, hues[(k + j) % hues.length] + (j === 0 || j === 4 ? '0)' : '0.55)'))
      g.fillStyle = grd
      g.beginPath()
      g.ellipse(x, y, rx, ry, (rnd() - 0.5) * 0.2, 0, TAU)
      g.fill()
    }
  })
  disposers.push(() => pearlTex.dispose())
  const pearlMat = new THREE.MeshBasicMaterial({ map: pearlTex, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })
  const pearls = new THREE.Group()
  for (const [a, e, d, w] of [[2.2, 0.32, 520, 260], [2.8, 0.22, 560, 300], [1.5, 0.27, 540, 220], [3.6, 0.36, 500, 200]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.4), pearlMat)
    m.position.set(Math.cos(a) * Math.cos(e) * d, Math.sin(e) * d, Math.sin(a) * Math.cos(e) * d)
    m.lookAt(0, m.position.y * 0.5, 0)
    m.renderOrder = -6
    pearls.add(m)
  }
  pearls.visible = false
  group.add(pearls)

  // drifting snow low over the surface
  const drift = motes({ count: 260, radius: radius + 6, y0: 0.05, y1: 1.4, color: '#ffffff', size: 0.035, opacity: 0.5, speed: 0.35, light })
  group.add(drift.group)

  // ---- light: a low warm sun, a cool blue sky, the snow throwing light back up ----
  // (a strong sun over a weaker blue fill: the shadows stay blue and the sunlit snow warm)
  const warm = smooth(0.05, 0.6, el)
  const hemi = new THREE.HemisphereLight('#8fb2ee', '#d5dde8', 0.72)
  const sunLight = new THREE.DirectionalLight(new THREE.Color('#ffcf9a').lerp(new THREE.Color('#fff4e2'), warm), 3.4)
  sunLight.position.copy(sunDir).multiplyScalar(60)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  const S = radius + 6
  sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -S
  sunLight.shadow.camera.right = sunLight.shadow.camera.top = S
  sunLight.shadow.camera.near = 1
  sunLight.shadow.camera.far = 140
  sunLight.shadow.bias = -0.0004
  sunLight.shadow.normalBias = 0.04
  group.add(hemi, sunLight, sunLight.target)

  return {
    group,
    solids,
    sunDir,
    sunLight,
    snowMaterial: snowMat,
    env: {
      background: new THREE.Color('#9fbadb'),
      fog: new THREE.Fog('#a8c0de', 80, 700),
      exposure: 0.95,
      envIntensity: 0.3,
      bloom: { strength: 0.42, radius: 0.5, threshold: 0.9 },
      fov: 62,
      far: 2000,
      shadows: true,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 16, minZ: -radius - 1, maxZ: radius + 1 },
    /** Mother-of-pearl clouds high in the sky, 0 (none) to 1. */
    setNacreous(k) {
      pearlMat.opacity = 0.8 * k
      pearls.visible = k > 0.01
    },
    update(t) {
      drift.update(t)
      // the flags flutter in the wind
      for (const c of group.userData.flags ?? []) {
        const p = c.f.geometry.attributes.position
        for (let i = 0; i < p.count; i++) {
          const x = c.base[i * 3]
          p.setZ(i, c.base[i * 3 + 2] + Math.sin(t * 7 + x * 14 + c.ph) * 0.05 * x)
        }
        p.needsUpdate = true
      }
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
