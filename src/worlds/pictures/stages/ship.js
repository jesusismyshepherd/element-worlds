// A stage for picture rooms (docs/knowledge/picture-rooms.md): the open aft deck of a research ship at sea
// at night. A steel working deck (painted grey-green, its grid of tie-down sockets), bulwarks with a rail
// along both sides, an orange A-frame over the stern with a towing winch, and forward the white
// superstructure, its portholes and the bridge's band of lit windows high up, a mast with its lights and
// a turning radar. Round the ship a dark swell to the horizon, the moon's glitter on it, the ship's wake
// behind, stars overhead; the outside rocks gently while the deck stays put (so walking stays easy).
//
// The deck is walked inside `deck` (x0..x1 across, z0..z1 along; the bow is toward −z, the stern +z).
// `portholes`: [[x, y, lit], ...] on the deckhouse's aft face (lit or not; left out, by chance). `tow`: { x, far } a cable from the winch over the A-frame into the wake, towing something `far` metres
// behind (a light blinks on it), or null. `moon`: a direction toward the moon. `speed`: the ship's speed
// through the water (m/s), which runs the water and the wake past. Gives `mats` (deck, white, steel,
// dark, orange, brass, wood, rail), `wall` (the superstructure's aft face: { z, x0, x1 }) and
// `onWall(obj, x, y)` to hang things on it, and `seaLevel`. Big surfaces stay mid-toned: under the
// floodlights a white wall drawn white blooms over the view.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { nightSky } from '../../common/sky.js'
import { box, circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** The sea at night: a swell from a few long waves and wind waves (only in the normals: the surface is
 *  flat), the sky and the moon mirrored in it by Fresnel's rule, the water running past the ship and the
 *  wake behind its stern; fogged into the horizon's colour far off. */
function seaMaterial({ moonDir, horizon, top, sternZ, speed }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMoon: { value: moonDir.clone() },
      uHorizon: { value: new THREE.Color(horizon) },
      uTop: { value: new THREE.Color(top) },
      uDeep: { value: new THREE.Color('#01060d') },
      uStern: { value: sternZ },
      uSpeed: { value: speed },
      uDeck: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld; varying vec2 vLocal;
      void main() {
        vLocal = position.xz;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uMoon; uniform vec3 uHorizon; uniform vec3 uTop; uniform vec3 uDeep;
      uniform float uStern; uniform float uSpeed; uniform float uDeck;
      varying vec3 vWorld; varying vec2 vLocal;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      // one wave's slope: direction (radians), wavelength (m), steepness
      vec2 wave(vec2 p, float dir, float len, float a, float t) {
        vec2 d = vec2(cos(dir), sin(dir));
        float k = 6.2831853 / len;
        float w = sqrt(9.81 * k);
        return d * (a * k * cos(k * dot(d, p) - w * t));
      }
      void main() {
        // the water runs past the ship toward the stern (+z) as the ship goes ahead
        vec2 p = vLocal - vec2(0.0, uTime * uSpeed);
        float t = uTime;
        vec2 g = vec2(0.0);
        g += wave(p, 0.55, 95.0, 0.55, t);
        g += wave(p, 0.85, 52.0, 0.42, t);
        g += wave(p, 0.2, 31.0, 0.3, t);
        g += wave(p, 1.3, 17.0, 0.22, t);
        g += wave(p, -0.4, 9.5, 0.14, t);
        g += wave(p, 2.1, 5.3, 0.1, t);
        g += wave(p, 0.95, 2.9, 0.07, t);
        // fine ripples, fading with distance so they do not shimmer far off
        float dist = length(vWorld - cameraPosition);
        float near = 1.0 - smoothstep(30.0, 160.0, dist);
        g += (vec2(noise(p * 1.7 + t * 0.6), noise(p * 1.7 - t * 0.5 + 9.0)) - 0.5) * 0.1 * near;
        // far off the waves smooth out, as they do to the eye
        g *= mix(0.45, 1.0, 1.0 - smoothstep(200.0, 900.0, dist));
        vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
        vec3 v = normalize(cameraPosition - vWorld);
        if (dot(n, v) < 0.02) n = normalize(n + v * (0.02 - dot(n, v)));
        vec3 r = reflect(-v, n);
        float fres = 0.02 + 0.98 * pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 5.0);
        vec3 sky = mix(uHorizon, uTop, smoothstep(0.0, 0.45, max(r.y, 0.0)));
        vec3 c = mix(uDeep, sky, fres);
        // the moon's glitter path, and a softer sheen round it
        float m = max(dot(r, normalize(uMoon)), 0.0);
        c += vec3(0.85, 0.9, 1.0) * (pow(m, 1400.0) * 3.2 + pow(m, 160.0) * 0.28 + pow(m, 18.0) * 0.03);
        // the wake: churned water behind the stern, widening and fading; the Kelvin arms at about 19.5 degrees
        float behind = vLocal.y - uStern;
        if (behind > 0.0) {
          float w = 2.6 + behind * 0.09;
          float churn = smoothstep(w, w * 0.45, abs(vLocal.x)) * exp(-behind / 170.0);
          float foam = churn * (0.55 + 0.45 * noise(p * vec2(0.9, 0.35) + vec2(0.0, t * 0.2))) * smoothstep(0.0, 4.0, behind);
          float arm = abs(abs(vLocal.x) - behind * 0.354);
          float arms = exp(-arm * arm / (0.6 + behind * 0.02)) * exp(-behind / 90.0) * 0.5 * noise(p * 0.6);
          vec3 foamC = vec3(0.42, 0.5, 0.58) * (0.35 + 0.65 * exp(-behind / 25.0) * uDeck);
          c = mix(c, foamC, clamp(foam * 0.8 + arms, 0.0, 0.9));
        }
        // along the hull the water is stirred too
        float side = abs(vLocal.x) - 7.2;
        if (side > 0.0 && side < 3.0 && vLocal.y < uStern) c = mix(c, vec3(0.3, 0.37, 0.44) * (0.4 + 0.6 * uDeck), (1.0 - side / 3.0) * 0.35 * noise(p * vec2(1.4, 0.5)));
        // fogged into the horizon
        c = mix(c, uHorizon, smoothstep(250.0, 1700.0, dist));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
}

/** A soft round glow (the moon's halo, lamps seen from afar). */
function glowTexture() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.4)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export function shipStage({
  light = false,
  deck = { x0: -6.4, x1: 6.4, z0: -7.6, z1: 7.6 },
  tow = { x: 2.9, far: 160 },
  moon = [-0.5, 0.34, -0.8],
  speed = 2.4,
  sway = 1,
  portholes = [[-5.2, 1.8], [-4.1, 1.8], [4.1, 1.8], [5.2, 1.8]],
} = {}) {
  const group = new THREE.Group()
  const disposers = []
  const SEA = -3.0
  const HX = deck.x1 + 0.6 // the hull's side
  const WALL = deck.z0 - 0.4 // the superstructure's aft face
  const STERN = deck.z1 + 0.5
  const moonDir = new THREE.Vector3(...moon).normalize()
  const HORIZON = '#1b2650'
  const TOP = '#04060f'

  // ---- materials ----
  const deckTex = canvasTex(1024, 1024, (g, w) => {
    g.fillStyle = '#5b665f'
    g.fillRect(0, 0, w, w)
    const rnd = random(4127)
    // the non-skid paint's grain and wear
    for (let i = 0; i < 26000; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(30,38,34,${0.08 + rnd() * 0.12})` : `rgba(160,172,160,${0.05 + rnd() * 0.08})`
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2.5, 1 + rnd() * 2.5)
    }
    for (let i = 0; i < 40; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const r = 20 + rnd() * 90
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, `rgba(${rnd() < 0.5 ? '40,44,40' : '120,110,90'},${0.08 + rnd() * 0.1})`)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
    // the plates' weld seams (the tile is 8 m: a seam every 2 m one way, 4 m the other)
    g.strokeStyle = 'rgba(25,30,27,0.55)'
    g.lineWidth = 3
    for (let k = 0; k <= 4; k++) {
      g.beginPath()
      g.moveTo(0, (k * w) / 4)
      g.lineTo(w, (k * w) / 4)
      g.stroke()
    }
    for (let k = 0; k <= 2; k++) {
      g.beginPath()
      g.moveTo((k * w) / 2, 0)
      g.lineTo((k * w) / 2, w)
      g.stroke()
    }
    // the tie-down sockets a working deck has in a grid
    const step = w / 13
    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 13; j++) {
        const x = (i + 0.5) * step
        const y = (j + 0.5) * step
        g.fillStyle = 'rgba(140,150,140,0.45)'
        g.beginPath()
        g.arc(x, y, 4.5, 0, TAU)
        g.fill()
        g.fillStyle = 'rgba(30,36,33,0.75)'
        g.beginPath()
        g.arc(x, y, 2.8, 0, TAU)
        g.fill()
      }
    }
  }, { repeat: true })
  disposers.push(() => deckTex.dispose())
  const mats = {
    deck: new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.82, metalness: 0.15 }),
    white: new THREE.MeshStandardMaterial({ color: '#b3bac2', roughness: 0.6, metalness: 0.1 }),
    rail: new THREE.MeshStandardMaterial({ color: '#c6ccd2', roughness: 0.5, metalness: 0.2 }),
    hull: new THREE.MeshStandardMaterial({ color: '#1c2a48', roughness: 0.6, metalness: 0.2 }),
    steel: new THREE.MeshStandardMaterial({ color: '#7a828c', roughness: 0.45, metalness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#25292f', roughness: 0.6, metalness: 0.4 }),
    orange: new THREE.MeshStandardMaterial({ color: '#cf6e28', roughness: 0.55, metalness: 0.25 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b9893a', roughness: 0.32, metalness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ color: '#6e4a2e', roughness: 0.7, metalness: 0.05 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#c9a42a', roughness: 0.6, metalness: 0.1 }),
  }
  const glow = glowTexture()
  disposers.push(() => glow.dispose())

  // ---- outside: the sky, the moon, the sea (they rock together; the ship does not) ----
  const outside = new THREE.Group()
  group.add(outside)
  const sky = nightSky({ stars: light ? 1600 : 3200, top: TOP, mid: '#0a1030', horizon: HORIZON })
  outside.add(sky)
  {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2f0e6').multiplyScalar(1.6), fog: false, toneMapped: false }))
    disc.position.copy(moonDir).multiplyScalar(820)
    disc.lookAt(0, 0, 0)
    disc.renderOrder = -8
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#9fb4ff', transparent: true, opacity: 0.45, depthWrite: false, fog: false }))
    halo.position.copy(disc.position)
    halo.scale.setScalar(120)
    halo.renderOrder = -9
    outside.add(disc, halo)
  }
  const seaMat = seaMaterial({ moonDir, horizon: HORIZON, top: '#152046', sternZ: STERN, speed })
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000, 1, 1).rotateX(-Math.PI / 2), seaMat)
  sea.position.y = SEA
  sea.frustumCulled = false
  outside.add(sea)

  // ---- the hull and the deck ----
  const ship = new THREE.Group()
  group.add(ship)
  const deckW = HX * 2
  const deckL = STERN - WALL + 30
  const deckMesh = new THREE.Mesh(new THREE.PlaneGeometry(deckW, deckL).rotateX(-Math.PI / 2), mats.deck)
  deckMesh.position.set(0, 0, (STERN + WALL - 30) / 2)
  deckTex.repeat.set(deckW / 8, deckL / 8)
  deckMesh.receiveShadow = true
  ship.add(deckMesh)
  // the hull's sides and its stern, from the deck down into the sea
  for (const s of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.25, -SEA + 1.2, STERN - WALL + 60), mats.hull)
    side.position.set(s * (HX + 0.12), (SEA - 1.2) / 2, (STERN + WALL - 60) / 2)
    ship.add(side)
  }
  const transom = new THREE.Mesh(new THREE.BoxGeometry(deckW + 0.5, -SEA + 1.2, 0.25), mats.hull)
  transom.position.set(0, (SEA - 1.2) / 2, STERN + 0.12)
  ship.add(transom)
  // a white band along the hull at the deck's edge
  for (const s of [-1, 1]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.35, STERN - WALL + 60), mats.white)
    band.position.set(s * (HX + 0.12), -0.4, (STERN + WALL - 60) / 2)
    ship.add(band)
  }

  // ---- bulwarks and rails ----
  const solids = []
  const railGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 8)
  const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 6)
  const pipe = (a, b, r = 0.035, mat = mats.rail) => {
    const len = a.distanceTo(b)
    const m = new THREE.Mesh(r === 0.035 ? railGeo : new THREE.CylinderGeometry(r, r, 1, 8), mat)
    m.scale.y = len
    m.position.copy(a).add(b).multiplyScalar(0.5)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
    return m
  }
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  for (const s of [-1, 1]) {
    const x = s * (HX - 0.1)
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, STERN - WALL), mats.white)
    wall.position.set(x, 0.31, (STERN + WALL) / 2)
    wall.castShadow = !light
    wall.receiveShadow = true
    ship.add(wall)
    // a cap on the bulwark and the rail above it, on posts
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, STERN - WALL), mats.rail)
    cap.position.set(x, 0.645, (STERN + WALL) / 2)
    ship.add(cap)
    ship.add(pipe(V(x, 1.08, WALL), V(x, 1.08, STERN)))
    ship.add(pipe(V(x, 0.86, WALL), V(x, 0.86, STERN), 0.022))
    for (let z = WALL + 0.8; z < STERN; z += 1.6) {
      const post = new THREE.Mesh(postGeo, mats.rail)
      post.scale.y = 0.45
      post.position.set(x, 0.86, z)
      ship.add(post)
    }
    solids.push(box(s * (HX + 0.15), (STERN + WALL) / 2, 1.0, STERN - WALL + 2))
  }
  // the stern rail, low pipes on posts
  ship.add(pipe(V(-HX + 0.1, 1.05, STERN - 0.15), V(HX - 0.1, 1.05, STERN - 0.15)))
  ship.add(pipe(V(-HX + 0.1, 0.6, STERN - 0.15), V(HX - 0.1, 0.6, STERN - 0.15), 0.022))
  for (let x = -HX + 0.5; x < HX; x += 1.4) {
    const post = new THREE.Mesh(postGeo, mats.rail)
    post.scale.y = 1.05
    post.position.set(x, 0.525, STERN - 0.15)
    ship.add(post)
  }
  solids.push(box(0, STERN + 0.4, deckW + 2, 1.0))

  // ---- the A-frame over the stern, its blocks, a floodlight ----
  const AF = { x: 3.1, z: STERN - 0.35, h: 5.8, lean: 0.12 }
  const aframe = new THREE.Group()
  ship.add(aframe)
  const topZ = AF.z + Math.sin(AF.lean) * AF.h
  for (const s of [-1, 1]) {
    const leg = pipe(V(s * AF.x, 0, AF.z), V(s * AF.x, AF.h, topZ), 0.2, mats.orange)
    leg.castShadow = !light
    aframe.add(leg)
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.3, 0.7, 2, 0.05), mats.orange)
    foot.position.set(s * AF.x, 0.15, AF.z)
    aframe.add(foot)
    solids.push(circle(s * AF.x, AF.z, 0.42))
  }
  const beam = new THREE.Mesh(new RoundedBoxGeometry(AF.x * 2 + 0.6, 0.45, 0.45, 2, 0.06), mats.orange)
  beam.position.set(0, AF.h, topZ)
  beam.castShadow = !light
  aframe.add(beam)
  const blocks = []
  for (const x of [-1.4, AF.x - 0.4]) {
    const block = new THREE.Group()
    const sheave = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 24).rotateZ(Math.PI / 2), mats.steel)
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.5), mats.yellow)
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6), mats.steel)
    hook.position.y = 0.45
    block.add(sheave, cheek, hook)
    block.position.set(x, AF.h - 0.75, topZ)
    aframe.add(block)
    blocks.push(block)
  }
  const flood = (x, y, z) => {
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.28, 0.2, 2, 0.04), mats.dark)
    head.position.set(x, y, z)
    const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2d8').multiplyScalar(2.2), toneMapped: false }))
    lens.position.set(x, y, z - 0.105)
    lens.rotation.y = Math.PI
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#fff0d0', transparent: true, opacity: 0.35, depthWrite: false }))
    halo.position.set(x, y, z - 0.2)
    halo.scale.setScalar(1.1)
    ship.add(head, lens, halo)
  }
  flood(-1.0, AF.h - 0.32, topZ - 0.3)
  flood(1.0, AF.h - 0.32, topZ - 0.3)

  // ---- the winch and the tow over the stern ----
  let towLight = null
  let towFloat = null
  if (tow) {
    const W = { x: deck.x1 - 1.5, z: deck.z1 - 1.0 }
    const winch = new THREE.Group()
    winch.position.set(W.x, 0, W.z)
    ship.add(winch)
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.25, 1.3, 2, 0.04), mats.dark)
    base.position.y = 0.125
    winch.add(base)
    for (const s of [-1, 1]) {
      const plate = new THREE.Mesh(new RoundedBoxGeometry(0.1, 1.2, 1.1, 2, 0.03), mats.orange)
      plate.position.set(s * 0.6, 0.85, 0)
      winch.add(plate)
    }
    const wound = canvasTex(256, 64, (g, w, h) => {
      g.fillStyle = '#3b3f45'
      g.fillRect(0, 0, w, h)
      for (let y = 0; y < h; y += 4) {
        g.fillStyle = y % 8 ? 'rgba(160,165,170,0.5)' : 'rgba(20,22,25,0.6)'
        g.fillRect(0, y, w, 2)
      }
    })
    disposers.push(() => wound.dispose())
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.06, 28).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ map: wound, roughness: 0.5, metalness: 0.6 }))
    drum.position.y = 0.95
    winch.add(drum)
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 18).rotateZ(Math.PI / 2), mats.dark)
    motor.position.set(0.95, 0.75, 0)
    winch.add(motor)
    winch.userData.drum = drum
    group.userData.drum = drum
    solids.push(box(W.x, W.z, 2.0, 1.5))
    // the cable: from the drum up to the block, then down over the stern into the wake
    const blockAt = blocks[1].getWorldPosition(new THREE.Vector3()).add(V(0, -0.3, 0))
    const cableMat = new THREE.MeshStandardMaterial({ color: '#2d3136', roughness: 0.4, metalness: 0.7 })
    ship.add(pipe(V(W.x - 0.05, 1.37, W.z + 0.05), blockAt, 0.018, cableMat))
    const into = V(tow.x, SEA, STERN + 26)
    const curve = new THREE.QuadraticBezierCurve3(blockAt, V(tow.x, SEA + 0.5, STERN + 6), into)
    const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.02, 6, false), cableMat)
    ship.add(cable)
    // what it tows, far behind: a float with a blinking light
    towFloat = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.9, 4, 10).rotateX(Math.PI / 2), mats.yellow)
    towFloat.position.set(tow.x, SEA + 0.1, STERN + tow.far)
    outside.add(towFloat)
    towLight = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffd84a', transparent: true, opacity: 1, depthWrite: false, fog: false }))
    towLight.position.set(tow.x, SEA + 0.9, STERN + tow.far)
    towLight.scale.setScalar(3.2)
    outside.add(towLight)
  }

  // ---- the superstructure: a deckhouse, a deck above, the bridge, the mast ----
  const house = new THREE.Group()
  ship.add(house)
  const HW = Math.min(HX - 0.6, 6.4)
  const block = (x0, x1, y0, y1, z0, z1, mat = mats.white) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat)
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    m.receiveShadow = true
    house.add(m)
    return m
  }
  block(-HW, HW, 0, 3.0, WALL - 14, WALL)
  block(-HW + 0.5, HW - 0.5, 3.0, 5.7, WALL - 15, WALL - 1.3)
  block(-HW - 0.6, HW + 0.6, 5.7, 8.3, WALL - 13, WALL - 2.6)
  block(-HW - 0.7, HW + 0.7, 8.3, 8.5, WALL - 13.1, WALL - 2.4, mats.rail)
  // a rail round the open deck on the deckhouse's roof
  house.add(pipe(V(-HW + 0.1, 4.05, WALL - 0.1), V(HW - 0.1, 4.05, WALL - 0.1)))
  house.add(pipe(V(-HW + 0.1, 3.55, WALL - 0.1), V(HW - 0.1, 3.55, WALL - 0.1), 0.022))
  for (let x = -HW + 0.1; x <= HW; x += 1.6) {
    const post = new THREE.Mesh(postGeo, mats.rail)
    post.scale.y = 1.05
    post.position.set(x, 3.52, WALL - 0.1)
    house.add(post)
  }
  // portholes and windows: some lit, warm
  const winLit = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd9a0').multiplyScalar(0.85), toneMapped: false })
  const winDark = new THREE.MeshStandardMaterial({ color: '#141b26', roughness: 0.15, metalness: 0.6 })
  const rnd = random(77)
  const porthole = new THREE.CircleGeometry(0.2, 20)
  const ring = new THREE.TorusGeometry(0.22, 0.035, 6, 20)
  for (const [x, y, lit = rnd() < 0.5] of portholes) {
    const g = new THREE.Mesh(porthole, lit ? winLit : winDark)
    g.position.set(x, y, WALL + 0.01)
    const r = new THREE.Mesh(ring, mats.steel)
    r.position.set(x, y, WALL + 0.02)
    house.add(g, r)
  }
  for (let i = 0; i < 7; i++) {
    const x = -HW + 1.4 + i * ((2 * HW - 2.8) / 6)
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), rnd() < 0.55 ? winLit : winDark)
    w.position.set(x, 4.5, WALL - 1.3 + 0.01)
    house.add(w)
  }
  // the bridge's band of big windows, dimly lit (a bridge keeps its light low at night)
  const bridgeGlass = new THREE.MeshBasicMaterial({ color: new THREE.Color('#5d8f9e').multiplyScalar(0.75), toneMapped: false })
  for (let i = 0; i < 9; i++) {
    const x = -HW - 0.2 + 0.65 + i * ((2 * HW - 0.9) / 8)
    const w = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), bridgeGlass)
    w.position.set(x, 7.05, WALL - 2.6 + 0.01)
    w.rotation.x = -0.12
    house.add(w)
  }
  // a door in the deckhouse, closed
  const door = new THREE.Mesh(new RoundedBoxGeometry(0.95, 2.0, 0.08, 2, 0.08), mats.steel)
  door.position.set(0.7, 1.05, WALL + 0.04)
  house.add(door)
  // the mast with its lights, the radar turning
  const mastX = 0
  const mastZ = WALL - 8
  house.add(pipe(V(mastX, 8.5, mastZ), V(mastX, 14.5, mastZ), 0.12, mats.white))
  const radar = new THREE.Group()
  radar.position.set(mastX, 9.6, mastZ + 1.6)
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.5, 12), mats.white)
  const bar = new THREE.Mesh(new RoundedBoxGeometry(3.4, 0.22, 0.28, 2, 0.06), mats.white)
  bar.position.y = 0.35
  radar.add(ped, bar)
  house.add(radar)
  const navLights = []
  const navLight = (x, y, z, color, size = 1.0) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 1, depthWrite: false }))
    s.position.set(x, y, z)
    s.scale.setScalar(size)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2), toneMapped: false }))
    bulb.position.set(x, y, z)
    house.add(s, bulb)
    navLights.push(s)
    return s
  }
  // a ship restricted in its ability to manoeuvre (towing gear) shows red, white, red on its mast
  navLight(mastX, 14.6, mastZ, '#fff6e8', 1.4)
  navLight(mastX, 13.2, mastZ + 0.2, '#ff4a3a', 1.1)
  navLight(mastX, 12.4, mastZ + 0.2, '#fff6e8', 1.1)
  navLight(mastX, 11.6, mastZ + 0.2, '#ff4a3a', 1.1)
  // the stern light
  navLight(0, 1.6, STERN + 0.1, '#fff6e8', 0.6)
  // the funnel behind the bridge
  {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 4, 20), mats.white)
    f.position.set(0, 10.2, WALL - 11.5)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.04, 0.6, 20), mats.orange)
    band.position.set(0, 11.4, WALL - 11.5)
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 1.0, 0.4, 20), mats.dark)
    top.position.set(0, 12.3, WALL - 11.5)
    house.add(f, band, top)
  }
  solids.push(box(0, WALL - 1.5, deckW + 2, 3.0))
  // floodlights under the deck above, over the working deck
  flood(-5.8, 2.85, WALL + 0.25)
  flood(5.8, 2.85, WALL + 0.25)
  flood(-1.2, 5.45, WALL - 1.0)
  flood(1.2, 5.45, WALL - 1.0)

  // ---- small things on deck: bollards, life rings ----
  const bollard = (x, z) => {
    const g = new THREE.Group()
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.75, 0.08, 0.32, 2, 0.03), mats.dark)
    base.position.y = 0.04
    g.add(base)
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.42, 14), mats.dark)
      post.position.set(s * 0.22, 0.25, 0)
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 14), mats.dark)
      cap.position.set(s * 0.22, 0.47, 0)
      g.add(post, cap)
    }
    g.position.set(x, 0, z)
    g.rotation.y = Math.PI / 2
    ship.add(g)
    solids.push(box(x, z, 0.4, 0.8))
  }
  bollard(deck.x0 + 0.25, -2.8)
  bollard(deck.x1 - 0.25, -2.8)
  bollard(deck.x0 + 0.25, deck.z1 - 2.6)
  const ringMat = new THREE.MeshStandardMaterial({ color: '#e0582a', roughness: 0.6 })
  const ringStripe = new THREE.MeshStandardMaterial({ color: '#e6e6e0', roughness: 0.6 })
  for (const [s, z] of [[-1, 0.8], [1, -5.4]]) {
    const ringM = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.08, 10, 28), ringMat)
    ringM.position.set(s * (HX - 0.25), 0.82, z)
    ringM.rotation.y = Math.PI / 2
    ship.add(ringM)
    for (let k = 0; k < 4; k++) {
      const st = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.085, 10, 4, 0.22), ringStripe)
      st.position.copy(ringM.position)
      st.rotation.set(0, Math.PI / 2, (k / 4) * TAU)
      ship.add(st)
    }
  }

  // ---- light: a moonlit night, floodlights on the working deck ----
  const hemi = new THREE.HemisphereLight('#4f5f8f', '#121418', light ? 0.75 : 0.6)
  const moonLight = new THREE.DirectionalLight('#a9bbff', 0.45)
  moonLight.position.copy(moonDir).multiplyScalar(60)
  group.add(hemi, moonLight, moonLight.target)
  const lamps = []
  const spot = (from, to, intensity, angle, shadow) => {
    const s = new THREE.SpotLight('#ffe7c4', intensity, 30, angle, 0.65, 1.6)
    s.position.copy(from)
    s.target.position.copy(to)
    if (shadow && !light) {
      s.castShadow = true
      s.shadow.mapSize.set(1024, 1024)
      s.shadow.bias = -0.0005
      s.shadow.normalBias = 0.03
      s.shadow.camera.near = 1
      s.shadow.camera.far = 30
    }
    group.add(s, s.target)
    lamps.push(s)
    return s
  }
  spot(V(0, 5.4, WALL - 1.0), V(0, 0, (deck.z0 + deck.z1) / 2 + 2), light ? 52 : 62, 1.0, true)
  spot(V(0, AF.h - 0.3, topZ - 0.3), V(0, 0, deck.z1 - 7), light ? 40 : 48, 0.95, false)

  const cameraBounds = { minX: deck.x0 + 0.1, maxX: deck.x1 - 0.1, minY: 0.35, maxY: 7, minZ: deck.z0 + 0.1, maxZ: deck.z1 }
  const swayAmt = sway
  return {
    group,
    solids,
    mats,
    seaLevel: SEA,
    lamps,
    wall: { z: WALL, x0: -HW, x1: HW },
    stern: STERN,
    /** Hang `obj` on the superstructure's aft face at (x, y), facing the deck. */
    onWall(obj, x, y) {
      obj.position.set(x, y, WALL + 0.02)
      group.add(obj)
      return obj
    },
    env: {
      background: new THREE.Color('#03050c'),
      fog: new THREE.Fog(HORIZON, 400, 2600),
      exposure: 1.0,
      envIntensity: 0.08,
      bloom: { strength: 0.62, radius: 0.5, threshold: 0.78 },
      fov: 60,
      far: 3000,
      shadows: !light,
    },
    cameraBounds,
    update(t) {
      sky.userData.update?.(t)
      seaMat.uniforms.uTime.value = t
      seaMat.uniforms.uDeck.value = 1
      radar.rotation.y = t * 2.1
      // the outside rocks a little: the ship rolls and pitches in the swell
      outside.rotation.z = swayAmt * 0.0105 * Math.sin((t * TAU) / 9.5)
      outside.rotation.x = swayAmt * 0.005 * Math.sin((t * TAU) / 6.8 + 1.1)
      outside.position.y = swayAmt * 0.12 * Math.sin((t * TAU) / 7.6 + 0.4)
      if (towLight) towLight.material.opacity = Math.sin(t * 3.1) > 0.55 ? 1 : 0.15
      if (towFloat) towFloat.position.y = SEA + 0.1 + Math.sin(t * 1.3) * 0.15
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
