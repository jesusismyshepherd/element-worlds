// A stage for picture rooms (docs/knowledge/picture-rooms.md): the deep sea floor, about 3000 m down, where
// no sunlight has ever come. Near darkness and cold, marine snow (dead plankton and specks) drifting down
// through the lamps, a soft grey-brown mud floor with little burrows, pink sea cucumbers, a glowing
// jellyfish drifting past, and a submarine cable lying across the floor into the dark both ways. A small
// yellow research submersible (an ROV, on its tether) hovers by the spawn and lights the way with its
// lamps; the scene's stations are lit by lamp posts that stand on the floor (landers' work lamps).
// Walking inside a circle of `radius`; the fog hides where the floor ends. Every big surface mid-toned
// (it is dark, but a nearly black floor shows nothing), so what glows stands out.
// Exports `abyssStage({ radius, light, lamps, rov, lift, bulge })` -> { group, solids, env, cameraBounds, cableZ(x),
// cableCurve, cableMat, rov, update(t, camera), dispose } and `cableZ`.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { ringWall } from '../kit.js'
import { circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** Where the cable lies across the floor: z at a given x (a slow S-bend, never a ruled line). */
export const cableZ = x => -7.4 + 0.55 * Math.sin(x * 0.33 + 0.5)

let dotTex = null
/** A soft round dot (the snow's sprite). */
function dot() {
  if (dotTex) return dotTex
  dotTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.4, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false })
  dotTex.userData.shared = true
  return dotTex
}

/** Marine snow: specks sinking slowly through a cylinder of water, each fading out when near the eye
 *  (a speck a hand away is a halo as big as the screen) and where the cylinder ends. */
function marineSnow({ count, radius, height, color, size, light }) {
  const n = light ? Math.round(count / 2.5) : count
  const base = new Float32Array(n * 3)
  const seed = new Float32Array(n)
  const rnd = random(31)
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * radius
    base.set([Math.cos(a) * r, rnd() * height, Math.sin(a) * r], i * 3)
    seed[i] = rnd() * 100
  }
  const pos = new Float32Array(n * 3)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uMap: { value: dot() }, uColor: { value: new THREE.Color(color) }, uSize: { value: size }, uScale: { value: 450 } },
    vertexShader: /* glsl */ `
      uniform float uSize; uniform float uScale;
      varying float vFade;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float d = -mv.z;
        vFade = smoothstep(0.7, 2.6, d) * (1.0 - smoothstep(14.0, 24.0, d));
        gl_PointSize = uSize * uScale / max(d, 0.1);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform vec3 uColor;
      varying float vFade;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a * vFade * 0.75;
        gl_FragColor = vec4(uColor * a, a);
      }`,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  points.raycast = () => {}
  return {
    points,
    update(t) {
      mat.uniforms.uScale.value = (typeof window === 'undefined' ? 900 : window.innerHeight * Math.min(window.devicePixelRatio || 1, 2)) / 2
      for (let i = 0; i < n; i++) {
        const s = seed[i]
        pos[i * 3] = base[i * 3] + Math.sin(t * 0.15 + s) * 0.35
        pos[i * 3 + 1] = height - ((height - base[i * 3 + 1] + t * (0.07 + (s % 3) * 0.02)) % height)
        pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.12 + s * 1.3) * 0.35
      }
      geo.attributes.position.needsUpdate = true
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}

/** The mud: grey-brown, flecked, with burrows, worm tracks and the odd pale shell. */
function mudTexture() {
  const rnd = random(7)
  return canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#6f736a'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 3200; i++) {
      const v = 95 + rnd() * 60
      g.fillStyle = `rgba(${v},${v + 4},${v - 6},${0.18 + rnd() * 0.3})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * w, 1 + rnd() * 4, 0, TAU)
      g.fill()
    }
    // burrows: a dark pit with a pale rim
    for (let i = 0; i < 26; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const r = 3 + rnd() * 5
      g.fillStyle = 'rgba(190,190,176,0.35)'
      g.beginPath()
      g.arc(x, y, r + 2.5, 0, TAU)
      g.fill()
      g.fillStyle = 'rgba(38,42,40,0.85)'
      g.beginPath()
      g.arc(x, y, r, 0, TAU)
      g.fill()
    }
    // tracks of something that crawled by
    g.strokeStyle = 'rgba(60,64,58,0.45)'
    g.lineWidth = 3
    for (let i = 0; i < 9; i++) {
      let x = rnd() * w
      let y = rnd() * w
      let a = rnd() * TAU
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 14; k++) {
        a += (rnd() - 0.5) * 0.7
        x += Math.cos(a) * 12
        y += Math.sin(a) * 12
        g.lineTo(x, y)
      }
      g.stroke()
    }
  }, { repeat: true })
}

/** A rubber-black cable skin with a faint spiral lay. */
function cableTexture() {
  return canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = '#2c3036'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(150,160,170,0.35)'
    g.lineWidth = 3
    for (let i = -2; i < 6; i++) {
      g.beginPath()
      g.moveTo(i * 16, 0)
      g.lineTo(i * 16 + 42, h)
      g.stroke()
    }
  }, { repeat: true })
}

export function abyssStage({ radius = 12, light = false, lamps = [], rov = { x: -3.3, y: 1.45, z: 5.6, yaw: -0.5 }, lift = null, bulge = null } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const updates = []
  const solids = ringWall(radius)

  // the dark all round
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(70, 24, 12),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          gl_FragColor = vec4(0.0012, 0.0044, 0.0103, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  dome.raycast = () => {}
  group.add(dome)

  // the floor
  const mud = mudTexture()
  mud.repeat.set(12, 12)
  disposers.push(() => mud.dispose())
  const floorMat = new THREE.MeshStandardMaterial({ map: mud, roughness: 1 })
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.raycast = () => {}
  group.add(floor)
  // low mounds of mud round the edge
  const moundMat = new THREE.MeshStandardMaterial({ color: '#656a62', roughness: 1 })
  const rnd = random(19)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU + rnd() * 0.3
    const r = radius + 2 + rnd() * 5
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10), moundMat)
    m.scale.set(2.6 + rnd() * 3, 0.5 + rnd() * 0.6, 2 + rnd() * 2)
    m.position.set(Math.cos(a) * r, -0.15, Math.sin(a) * r)
    m.rotation.y = a
    m.raycast = () => {}
    group.add(m)
  }

  // the cable across the floor, into the dark both ways
  const cablePts = []
  // `lift`: { x, y, flat, fall }, where the cable rises to a repeater's axis (flat either side of x) and settles back
  const rise = x => {
    if (!lift) return 0.06
    const d = Math.max(0, Math.abs(x - lift.x) - lift.flat) / lift.fall
    const k = d >= 1 ? 0 : 1 - d * d * (3 - 2 * d)
    return 0.06 + (lift.y - 0.06) * k
  }
  // `bulge`: { x, dz, w }, where the cable swings out towards the visitor round a station
  const zAt = x => cableZ(x) + (bulge ? bulge.dz * Math.exp(-(((x - bulge.x) / bulge.w) ** 2)) : 0)
  for (let x = -radius - 10; x <= radius + 10.01; x += lift ? 0.5 : 2) cablePts.push(new THREE.Vector3(x, rise(x), zAt(x)))
  const cableCurve = new THREE.CatmullRomCurve3(cablePts)
  const cableTex = cableTexture()
  cableTex.repeat.set(1, 60)
  disposers.push(() => cableTex.dispose())
  const cableMat = new THREE.MeshStandardMaterial({ map: cableTex, roughness: 0.75, metalness: 0.1 })
  const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, lift ? 480 : 160, 0.07, 10), cableMat)
  cable.raycast = () => {}
  group.add(cable)

  // sea cucumbers ("sea pigs") crawling over the mud
  const pink = new THREE.MeshStandardMaterial({ color: '#c98a90', roughness: 0.7 })
  const pinkDark = new THREE.MeshStandardMaterial({ color: '#a86a72', roughness: 0.8 })
  const cukes = [[-5.4, 2.6, 0.3], [4.7, 3.2, -0.9], [-8.2, -3.8, 1.8], [8.6, -4.6, 2.6], [1.6, -3.4, 0.6], [-1.9, 8.3, 2.2]]
  for (const [x, z, a] of cukes) {
    const c = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.34, 6, 12), pink)
    body.rotation.z = Math.PI / 2
    body.position.y = 0.13
    body.scale.set(1, 1, 0.9)
    c.add(body)
    for (let i = 0; i < 3; i++) {
      for (const s of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), pinkDark)
        leg.position.set(-0.14 + i * 0.14, 0.05, s * 0.09)
        c.add(leg)
      }
    }
    // the tuft of feelers at the front, and the little sail on its back
    const sail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), pinkDark)
    sail.position.set(0.1, 0.27, 0)
    c.add(sail)
    c.position.set(x, 0, z)
    c.rotation.y = a
    c.traverse(o => (o.raycast = () => {}))
    group.add(c)
  }

  // a jellyfish drifting past, glowing blue
  const jellies = []
  const jellyMat = new THREE.MeshBasicMaterial({ color: '#4d7bff', transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const rimMat = new THREE.MeshBasicMaterial({ color: '#9ad4ff', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending })
  const tentMat = new THREE.LineBasicMaterial({ color: '#7fb0ff', transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
  for (const [cx, cz, y, r, sz, ph] of [[-1.8, -10.2, 2.7, 4.2, 0.55, 0], [9.5, 1.5, 3.5, 3.2, 0.4, 2.4]]) {
    const j = new THREE.Group()
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 10, 0, TAU, 0, Math.PI / 2), jellyMat)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.025, 6, 24), rimMat)
    rim.rotation.x = Math.PI / 2
    j.add(bell, rim)
    const tents = []
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * TAU
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(10 * 3), 3))
      const line = new THREE.Line(geo, tentMat)
      line.frustumCulled = false
      j.add(line)
      tents.push({ geo, a })
    }
    j.scale.setScalar(sz * 2)
    j.traverse(o => (o.raycast = () => {}))
    group.add(j)
    jellies.push({ j, bell, rim, tents, cx, cz, y, r, ph, sz })
  }
  updates.push(t => {
    for (const q of jellies) {
      const a = t * 0.06 + q.ph
      q.j.position.set(q.cx + Math.cos(a) * q.r, q.y + Math.sin(t * 0.5 + q.ph) * 0.18, q.cz + Math.sin(a) * q.r * 0.6)
      q.j.rotation.y = -a
      const pulse = Math.sin(t * 1.6 + q.ph)
      q.bell.scale.set(1 + pulse * 0.07, 0.75 - pulse * 0.12, 1 + pulse * 0.07)
      q.rim.scale.set(1 + pulse * 0.07, 1, 1 + pulse * 0.07)
      for (const { geo, a: ta } of q.tents) {
        const p = geo.attributes.position
        for (let i = 0; i < 10; i++) {
          const f = i / 9
          p.setXYZ(i, Math.cos(ta) * 0.42 * (1 - f * 0.5) + Math.sin(t * 1.1 + ta * 3 + f * 5) * 0.06 * f, -f * 1.4 - 0.02, Math.sin(ta) * 0.42 * (1 - f * 0.5) + Math.cos(t * 0.9 + ta * 2 + f * 4) * 0.06 * f)
        }
        p.needsUpdate = true
      }
    }
  })

  // the submersible
  const robot = new THREE.Group()
  {
    const yellow = new THREE.MeshStandardMaterial({ color: '#e8b820', roughness: 0.5, metalness: 0.1 })
    const foam = new THREE.MeshStandardMaterial({ color: '#ee9a1c', roughness: 0.7 })
    const steel = new THREE.MeshStandardMaterial({ color: '#2d3239', roughness: 0.5, metalness: 0.5 })
    const grey = new THREE.MeshStandardMaterial({ color: '#7d858f', roughness: 0.45, metalness: 0.5 })
    const body = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.45, 0.8, 3, 0.07), yellow)
    const top = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.3, 0.9, 3, 0.09), foam)
    top.position.y = 0.38
    robot.add(body, top)
    for (const s of [-1, 1]) {
      const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 8), steel)
      skid.rotation.x = Math.PI / 2
      skid.position.set(s * 0.5, -0.38, 0)
      robot.add(skid)
      for (const zz of [-0.4, 0.4]) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 6), steel)
        strut.position.set(s * 0.5, -0.27, zz)
        robot.add(strut)
      }
      // a thruster at each rear corner, one pushing sideways
      const th = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 14, 1, true), steel)
      th.rotation.x = Math.PI / 2
      th.position.set(s * 0.45, 0.02, 0.55)
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), grey)
      hub.rotation.x = Math.PI / 2
      hub.position.copy(th.position)
      const vt = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.26, 14, 1, true), steel)
      vt.position.set(s * 0.3, 0.38, 0)
      robot.add(th, hub, vt)
    }
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 10), new THREE.MeshStandardMaterial({ color: '#0c141c', roughness: 0.1, metalness: 0.7 }))
    dome.position.set(0, 0.05, -0.43)
    robot.add(dome)
    // lamps at the front, shining forward and a little down
    const lampMat = new THREE.MeshStandardMaterial({ color: '#fff6dd', emissive: '#fff0c8', emissiveIntensity: 2.4 })
    for (const s of [-1, 1]) {
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.12, 14), steel)
      housing.rotation.x = Math.PI / 2
      housing.position.set(s * 0.38, -0.02, -0.45)
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.085, 14), lampMat)
      lens.position.set(s * 0.38, -0.02, -0.512)
      lens.rotation.y = Math.PI
      robot.add(housing, lens)
    }
    // the arm, reaching forward and down
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), grey)
    shoulder.position.set(0.3, -0.25, -0.45)
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), grey)
    up.position.set(0.3, -0.3, -0.7)
    up.rotation.x = Math.PI / 2 + 0.3
    const low = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), grey)
    low.position.set(0.3, -0.56, -0.95)
    low.rotation.x = 0.5
    robot.add(shoulder, up, low)
    for (const s of [-1, 1]) {
      const claw = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.03), steel)
      claw.position.set(0.3 + s * 0.03, -0.77, -1.05)
      robot.add(claw)
    }
    // the tether, up into the dark
    const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 40, 5), steel)
    tether.position.set(0, 20.4, 0.5)
    robot.add(tether)
    robot.traverse(o => (o.raycast = () => {}))
    // the lamps' beams in the murk, and their light on the mud
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color('#b8dcff') } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying float vAlong;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vV = normalize(-mv.xyz);
          vAlong = clamp(-position.y / 7.0, 0.0, 1.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying vec3 vN; varying vec3 vV; varying float vAlong;
        void main() {
          float f = pow(clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0), 2.0);
          gl_FragColor = vec4(uColor, f * (1.0 - vAlong) * 0.16);
        }`,
    })
    for (const s of [-1, 1]) {
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 1.1, 7, 20, 1, true), beamMat)
      beam.geometry.translate(0, -3.5, 0)
      beam.rotation.x = Math.PI / 2 + 0.2
      beam.position.set(s * 0.38, -0.02, -0.5)
      robot.add(beam)
      const spot = new THREE.SpotLight('#e8f2ff', light ? 60 : 90, 22, 0.5, 0.7, 1.6)
      spot.position.set(s * 0.38, -0.02, -0.5)
      spot.target.position.set(s * 0.38 + s * 1.2, -3.5, -9)
      robot.add(spot, spot.target)
    }
  }
  robot.position.set(rov.x, rov.y, rov.z)
  robot.rotation.y = rov.yaw
  group.add(robot)
  solids.push(circle(rov.x, rov.z, 0.8))
  updates.push(t => {
    robot.position.y = rov.y + Math.sin(t * 0.7) * 0.05
    robot.rotation.y = rov.yaw + Math.sin(t * 0.23) * 0.05
    robot.rotation.z = Math.sin(t * 0.5) * 0.015
  })

  // work lamps on posts (the stations' light): a pole, a lamp head, a warm point light
  const poleMat = new THREE.MeshStandardMaterial({ color: '#3a4048', roughness: 0.5, metalness: 0.5 })
  const headMat = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffe3aa', emissiveIntensity: 1.3 })
  const haloMat = new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending })
  for (const l of lamps) {
    const h = l.height ?? 2.1
    const post = new THREE.Group()
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, h, 8), poleMat)
    pole.position.y = h / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.07, 14), poleMat)
    foot.position.y = 0.035
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.16, 14), headMat)
    head.position.y = h + 0.05
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), haloMat)
    halo.position.y = h + 0.05
    post.add(pole, foot, head, halo)
    post.position.set(l.x, 0, l.z)
    post.traverse(o => (o.raycast = () => {}))
    group.add(post)
    solids.push(circle(l.x, l.z, 0.18))
    if (!(light && l.optional)) {
      const p = new THREE.PointLight('#ffe9c8', l.intensity ?? 16, l.distance ?? 11, 1.7)
      p.position.set(l.x, h - 0.1, l.z)
      group.add(p)
    }
  }
  group.add(new THREE.HemisphereLight('#3a6a92', '#10161c', light ? 0.7 : 0.55))

  // marine snow
  const snow = marineSnow({ count: 900, radius: radius + 3, height: 9, color: '#bfd8e8', size: 0.05, light })
  group.add(snow.points)

  return {
    group,
    solids,
    cableZ: zAt,
    cableCurve,
    cableMat,
    rov: robot,
    env: {
      background: new THREE.Color('#040e1a'),
      fog: new THREE.Fog('#040e1a', 5, 24),
      exposure: 1.1,
      envIntensity: 0.05,
      bloom: { strength: 0.6, radius: 0.55, threshold: 0.8 },
      fov: 62,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 7, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      for (const u of updates) u(t)
      snow.update(t)
    },
    dispose() {
      snow.dispose()
      disposers.forEach(f => f())
    },
  }
}
