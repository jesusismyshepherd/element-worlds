// A stage for picture rooms (docs/knowledge/picture-rooms.md): a Spanish treasure galleon at anchor off the
// American coast on a moonlit night. Made of wood, rope, canvas and lantern light (never steel: iron's
// compass room is a research ship): a planked main deck, bulwarks with a rail, three masts with their sails
// furled on the yards, shrouds, a bowsprit; aft the castle, a roofed deck standing on posts, its front wide
// open, its back wall a bulkhead with the great cabin's lit stern windows, hung with lanterns. Round the
// ship a black sea with the full moon's glitter on it, a far low coast with a few lights of a port, and a
// second galleon under sail, its sails silver in the moonlight. The sea moves; the deck stays still (the
// outside rocks a little, as at anchor), so walking stays easy.
//
// The deck is walked inside `deck` (x0..x1 across, z0..z1 along; the bow is toward +z, the stern toward
// -z). The castle's roof is at 2.9 m: `cameraBounds.maxY` keeps the third-person camera under it.
// Gives `mats` (deck, wood, dark, rail, rope, canvas, iron, brass, tar), `lantern(x, y, z, size, lit)` (a
// hanging lantern with its glow; the light is in the stage), `rope(a, b, r, mat)`, `castle` { z0, z1,
// roof, x0, x1 }, `masts`, `onBulkhead(obj, x, y)` and `seaLevel`. Big surfaces stay mid-toned: a pale
// thing under the lanterns blooms over the view.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { nightSky } from '../../common/sky.js'
import { box, circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2
const V = (x, y, z) => new THREE.Vector3(x, y, z)

/** The sea at night: a long swell and wind waves in the normals only (the surface is flat), the sky and the
 *  moon mirrored in it by Fresnel's rule, fogged into the horizon's colour. */
function seaMaterial({ moonDir, horizon, top }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMoon: { value: moonDir.clone() },
      uHorizon: { value: new THREE.Color(horizon) },
      uTop: { value: new THREE.Color(top) },
      uDeep: { value: new THREE.Color('#01060d') },
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
      varying vec3 vWorld; varying vec2 vLocal;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      vec2 wave(vec2 p, float dir, float len, float a, float t) {
        vec2 d = vec2(cos(dir), sin(dir));
        float k = 6.2831853 / len;
        float w = sqrt(9.81 * k);
        return d * (a * k * cos(k * dot(d, p) - w * t));
      }
      void main() {
        vec2 p = vLocal;
        float t = uTime;
        vec2 g = vec2(0.0);
        g += wave(p, 0.55, 70.0, 0.5, t);
        g += wave(p, 0.85, 41.0, 0.4, t);
        g += wave(p, 0.2, 24.0, 0.3, t);
        g += wave(p, 1.3, 13.0, 0.22, t);
        g += wave(p, -0.4, 7.5, 0.14, t);
        g += wave(p, 2.1, 4.3, 0.1, t);
        g += wave(p, 0.95, 2.4, 0.07, t);
        float dist = length(vWorld - cameraPosition);
        float near = 1.0 - smoothstep(30.0, 160.0, dist);
        g += (vec2(noise(p * 1.7 + t * 0.6), noise(p * 1.7 - t * 0.5 + 9.0)) - 0.5) * 0.1 * near;
        g *= mix(0.45, 1.0, 1.0 - smoothstep(200.0, 900.0, dist));
        vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
        vec3 v = normalize(cameraPosition - vWorld);
        if (dot(n, v) < 0.02) n = normalize(n + v * (0.02 - dot(n, v)));
        vec3 r = reflect(-v, n);
        float fres = 0.02 + 0.98 * pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 5.0);
        vec3 sky = mix(uHorizon, uTop, smoothstep(0.0, 0.45, max(r.y, 0.0)));
        vec3 c = mix(uDeep, sky, fres);
        float m = max(dot(r, normalize(uMoon)), 0.0);
        c += vec3(0.85, 0.9, 1.0) * (pow(m, 1400.0) * 3.2 + pow(m, 160.0) * 0.28 + pow(m, 18.0) * 0.03);
        // the hull's own shadow and the lantern light on the water at its side
        float side = abs(vLocal.x) - 4.7;
        if (side > 0.0 && side < 3.0 && vLocal.y > -11.0 && vLocal.y < 8.5) c = mix(c, vec3(0.34, 0.27, 0.2), (1.0 - side / 3.0) * 0.22 * noise(p * vec2(1.4, 0.8) + t * 0.3));
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

/** Planks as a deck is laid: boards along the ship (the tile is 4 m a side, boards 25 cm wide), butt joints
 *  staggered, black pitch in the seams, a trenail at every joint. `tone` lightens or darkens the wood. */
function plankTexture(tone = 1, seed = 11) {
  return canvasTex(1024, 1024, (g, w) => {
    const rnd = random(seed)
    const boards = 16
    const bw = w / boards
    const shade = (r, gg, b, k = 1) => `rgb(${Math.round(r * k * tone)},${Math.round(gg * k * tone)},${Math.round(b * k * tone)})`
    g.fillStyle = '#17110c'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < boards; i++) {
      // the board's length: joints at two places, shifted board by board
      let y = -rnd() * w * 0.5
      while (y < w) {
        const len = w * (0.42 + rnd() * 0.4)
        const k = 0.78 + rnd() * 0.36
        g.fillStyle = shade(112, 84, 56, k)
        g.fillRect(i * bw + 2, y + 2, bw - 4, len - 4)
        // the grain: long faint lines and a few knots
        for (let s = 0; s < 9; s++) {
          g.strokeStyle = `rgba(${rnd() < 0.5 ? '40,26,14' : '170,134,92'},${0.1 + rnd() * 0.14})`
          g.lineWidth = 1 + rnd() * 1.4
          const x = i * bw + 4 + rnd() * (bw - 8)
          g.beginPath()
          g.moveTo(x, y + 4)
          g.bezierCurveTo(x + (rnd() - 0.5) * 6, y + len * 0.3, x + (rnd() - 0.5) * 6, y + len * 0.7, x + (rnd() - 0.5) * 3, y + len - 4)
          g.stroke()
        }
        if (rnd() < 0.35) {
          const kx = i * bw + bw / 2 + (rnd() - 0.5) * 12
          const ky = y + len * (0.2 + rnd() * 0.6)
          const grd = g.createRadialGradient(kx, ky, 0, kx, ky, 9)
          grd.addColorStop(0, 'rgba(32,20,10,0.7)')
          grd.addColorStop(1, 'rgba(32,20,10,0)')
          g.fillStyle = grd
          g.fillRect(kx - 9, ky - 9, 18, 18)
        }
        // trenails at the ends
        g.fillStyle = 'rgba(30,20,12,0.7)'
        for (const yy of [y + 9, y + len - 9]) {
          g.beginPath()
          g.arc(i * bw + bw * 0.3, yy, 2.2, 0, TAU)
          g.arc(i * bw + bw * 0.7, yy, 2.2, 0, TAU)
          g.fill()
        }
        y += len
      }
    }
    // salt and wear
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(20,14,8,0.07)' : 'rgba(200,170,130,0.06)'
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** A cylinder from a to b, as geometry placed in the ship's frame (for merging). */
function segGeo(a, b, r, sides = 5) {
  const len = a.distanceTo(b)
  const g = new THREE.CylinderGeometry(r, r, len, sides, 1)
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize())
  g.applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, V(1, 1, 1)))
  return g
}

export function galleonStage({
  light = false,
  deck = { x0: -4.4, x1: 4.4, z0: -6.4, z1: 7.8 },
  moon = [0.55, 0.3, -0.75],
  sway = 1,
} = {}) {
  const group = new THREE.Group()
  const disposers = []
  const SEA = -3.7
  const HX = deck.x1
  const CASTLE = { x0: -HX, x1: HX, z0: -11.2, z1: deck.z0, roof: 2.9 }
  const moonDir = new THREE.Vector3(...moon).normalize()
  const HORIZON = '#1b2650'
  const TOP = '#04060f'
  const solids = []

  // ---- materials ----
  const deckTex = plankTexture(1, 11)
  const woodTex = plankTexture(0.62, 29)
  disposers.push(() => deckTex.dispose(), () => woodTex.dispose())
  const canvasMap = canvasTex(256, 256, (g, w) => {
    const rnd = random(5)
    g.fillStyle = '#9a917f'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 700; i++) {
      g.strokeStyle = `rgba(${rnd() < 0.5 ? '70,62,48' : '200,190,168'},${0.06 + rnd() * 0.1})`
      g.lineWidth = 1
      const x = rnd() * w
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x + (rnd() - 0.5) * 6, w)
      g.stroke()
    }
  }, { repeat: true })
  disposers.push(() => canvasMap.dispose())
  const mats = {
    deck: new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.85, metalness: 0.02 }),
    wood: new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.8, metalness: 0.02 }),
    rail: new THREE.MeshStandardMaterial({ color: '#4a3524', roughness: 0.75, metalness: 0.03 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2018', roughness: 0.8, metalness: 0.05 }),
    rope: new THREE.MeshStandardMaterial({ color: '#7d6a4c', roughness: 0.95 }),
    canvas: new THREE.MeshStandardMaterial({ map: canvasMap, color: '#cfc6b2', roughness: 0.95 }),
    iron: new THREE.MeshStandardMaterial({ color: '#2b2d31', roughness: 0.55, metalness: 0.55 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b08a3c', roughness: 0.35, metalness: 0.85 }),
    tar: new THREE.MeshStandardMaterial({ color: '#16120e', roughness: 0.7 }),
    red: new THREE.MeshStandardMaterial({ color: '#8a2e22', roughness: 0.8 }),
  }
  const glow = glowTexture()
  disposers.push(() => glow.dispose())

  // ---- outside: the sky, the moon, the sea, the far coast, the other ship (they rock together; the ship does not) ----
  const outside = new THREE.Group()
  group.add(outside)
  const sky = nightSky({ stars: light ? 1600 : 3200, top: TOP, mid: '#0a1030', horizon: HORIZON })
  outside.add(sky)
  {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(10, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2f0e6').multiplyScalar(1.6), fog: false, toneMapped: false }))
    disc.position.copy(moonDir).multiplyScalar(820)
    disc.lookAt(0, 0, 0)
    disc.renderOrder = -8
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#9fb4ff', transparent: true, opacity: 0.5, depthWrite: false, fog: false }))
    halo.position.copy(disc.position)
    halo.scale.setScalar(150)
    halo.renderOrder = -9
    outside.add(disc, halo)
  }
  const seaMat = seaMaterial({ moonDir, horizon: HORIZON, top: '#152046' })
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000, 1, 1).rotateX(-Math.PI / 2), seaMat)
  sea.position.y = SEA
  sea.frustumCulled = false
  outside.add(sea)
  // a far, low coast to port-forward: hills as a dark ridge, a few lights of a harbour town
  {
    const rnd = random(303)
    const N = 120
    const W = 1000
    const geo = new THREE.PlaneGeometry(W, 70, N, 1)
    const p = geo.attributes.position
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const h = 7 + 9 * Math.sin(u * 5.1 + 0.6) + 5 * Math.sin(u * 13 + 2) + 3 * rnd() + 8 * Math.exp(-(((u - 0.72) / 0.12) ** 2))
      p.setY(i, SEA + Math.max(2, h) + 14 - 35)
      p.setY(i + N + 1, SEA - 6)
    }
    const hills = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#0a1428', fog: true }))
    // the coast lies about 520 m off, from straight ahead to the port beam
    hills.position.set(-380, 0, -360)
    hills.rotation.y = Math.atan2(380, 360) + Math.PI
    hills.frustumCulled = false
    outside.add(hills)
    const lights = new THREE.BufferGeometry()
    const pts = []
    for (let i = 0; i < 26; i++) {
      const u = 0.35 + rnd() * 0.22
      const x = (u - 0.5) * W
      pts.push(x, SEA + 7 + rnd() * 5, 0.5)
    }
    lights.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const town = new THREE.Points(lights, new THREE.PointsMaterial({ color: '#ffc87a', size: 3.2, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false, fog: false }))
    town.position.copy(hills.position)
    town.rotation.y = hills.rotation.y
    outside.add(town)
  }
  // the other galleon under sail, far off to starboard-forward, silver in the moon
  {
    const other = new THREE.Group()
    const hullMat = new THREE.MeshStandardMaterial({ color: '#1a120d', roughness: 0.8 })
    const sailMat = new THREE.MeshStandardMaterial({ color: '#8c93a0', emissive: '#4c5668', emissiveIntensity: 0.55, roughness: 0.9, side: THREE.DoubleSide })
    const hull = new THREE.Mesh(new RoundedBoxGeometry(5.2, 3, 22, 2, 0.5), hullMat)
    hull.position.set(0, SEA + 1.0, 0)
    other.add(hull)
    const castleBox = new THREE.Mesh(new THREE.BoxGeometry(5, 3.4, 7), hullMat)
    castleBox.position.set(0, SEA + 3.6, -7.5)
    other.add(castleBox)
    const fore = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.4, 4.5), hullMat)
    fore.position.set(0, SEA + 3, 8.5)
    other.add(fore)
    const sail = (x, y, z, w, h) => {
      const geo = new THREE.PlaneGeometry(w, h, 6, 4)
      const p = geo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) / (w / 2)
        const v = p.getY(i) / (h / 2)
        p.setZ(i, (1 - u * u) * (1 - v * v * 0.5) * 0.9)
      }
      geo.computeVertexNormals()
      const m = new THREE.Mesh(geo, sailMat)
      m.position.set(x, y, z)
      other.add(m)
    }
    const spars = []
    const mast = (z, h) => {
      spars.push(segGeo(V(0, SEA + 2, z), V(0, SEA + h, z), 0.28, 6))
    }
    mast(-6, 20)
    mast(1.5, 26)
    mast(9, 21)
    spars.push(segGeo(V(0, SEA + 6, 17), V(0, SEA + 14, 25), 0.2, 6))
    other.add(new THREE.Mesh(mergeGeometries(spars), hullMat))
    for (const [z, h] of [[-6, 20], [1.5, 26], [9, 21]]) {
      sail(0, SEA + h * 0.42, z, 12, h * 0.38)
      sail(0, SEA + h * 0.82, z, 8.5, h * 0.2)
    }
    // its lanterns
    for (const [y, z] of [[SEA + 6.2, -10.6], [SEA + 4.5, 10.4]]) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffc27a', transparent: true, opacity: 0.9, depthWrite: false }))
      s.position.set(0, y, z)
      s.scale.setScalar(5)
      other.add(s)
    }
    // far off, under sail: it drifts slowly along its course and back (see update)
    other.position.set(150, 0, -330)
    other.rotation.y = 1.75
    outside.add(other)
    group.userData.other = other
  }

  // ---- the hull and the deck ----
  const ship = new THREE.Group()
  group.add(ship)
  const deckW = HX * 2 + 0.6
  const deckL = deck.z1 - CASTLE.z0 + 0.6
  const deckMesh = new THREE.Mesh(new THREE.PlaneGeometry(deckW, deckL).rotateX(-Math.PI / 2), mats.deck)
  deckMesh.position.set(0, 0, (deck.z1 + CASTLE.z0) / 2)
  deckTex.repeat.set(deckW / 4, deckL / 4)
  deckMesh.receiveShadow = true
  ship.add(deckMesh)
  // the hull's sides and ends, from the deck down into the sea
  for (const s of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.3, -SEA + 1.2, deckL + 0.6), mats.dark)
    side.position.set(s * (HX + 0.15), (SEA - 1.2) / 2, (deck.z1 + CASTLE.z0) / 2)
    ship.add(side)
    // the wale: a paler band along the hull below the rail
    const wale = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, deckL + 0.6), mats.wood)
    wale.position.set(s * (HX + 0.15), -1.1, (deck.z1 + CASTLE.z0) / 2)
    ship.add(wale)
  }
  for (const z of [CASTLE.z0 - 0.15, deck.z1 + 0.15]) {
    const end = new THREE.Mesh(new THREE.BoxGeometry(deckW + 0.6, -SEA + 1.2, 0.3), mats.dark)
    end.position.set(0, (SEA - 1.2) / 2, z)
    ship.add(end)
  }

  // ---- merged helpers: ropes and rails are many thin parts, so one mesh each ----
  const ropeGeos = []
  const railGeos = []
  const rope = (a, b, r = 0.014) => ropeGeos.push(segGeo(a, b, r, 4))
  const spar = (a, b, r = 0.035) => railGeos.push(segGeo(a, b, r, 6))
  const woodBox = (x0, x1, y0, y1, z0, z1, mat = mats.wood) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat)
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    m.castShadow = !light
    m.receiveShadow = true
    ship.add(m)
    return m
  }

  // ---- bulwarks along the waist, with a cap rail; the bow closed ----
  for (const s of [-1, 1]) {
    const x = s * (HX - 0.12)
    woodBox(x - 0.12, x + 0.12, 0, 1.0, deck.z0, deck.z1, mats.wood)
    woodBox(x - 0.19, x + 0.19, 1.0, 1.08, deck.z0 - 0.1, deck.z1 + 0.1, mats.rail)
    solids.push(box(s * (HX + 0.1), (deck.z0 + deck.z1) / 2, 0.6, deck.z1 - deck.z0 + 2))
    // gun ports: dark squares on the inner face
    for (const z of [-3.2, -0.4, 2.4, 5.2]) {
      const port = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.55), mats.tar)
      port.position.set(x - s * 0.125, 0.52, z)
      port.rotation.y = s * Math.PI / 2
      ship.add(port)
    }
  }
  woodBox(-HX, HX, 0, 1.0, deck.z1 - 0.1, deck.z1 + 0.1)
  woodBox(-HX, HX, 1.0, 1.08, deck.z1 - 0.2, deck.z1 + 0.2, mats.rail)
  solids.push(box(0, deck.z1 + 0.3, deckW + 2, 0.8))

  // ---- the castle: a roof on posts, open to the deck, a bulkhead behind, side walls ----
  {
    const { x0, x1, z0, z1, roof } = CASTLE
    const roofMesh = woodBox(x0 - 0.2, x1 + 0.2, roof, roof + 0.18, z0 - 0.3, z1 + 0.2, mats.deck)
    roofMesh.material = mats.deck
    // the underside: beams every 1.2 m
    for (let x = x0 + 0.6; x < x1; x += 1.2) woodBox(x - 0.09, x + 0.09, roof - 0.14, roof, z0, z1, mats.rail)
    woodBox(x0, x1, roof - 0.2, roof, z1 - 0.12, z1 + 0.12, mats.rail)
    // the back bulkhead and the side walls
    woodBox(x0, x1, 0, roof, z0 - 0.15, z0 + 0.05, mats.wood)
    solids.push(box(0, z0 - 0.2, x1 - x0 + 2, 0.7))
    for (const s of [-1, 1]) {
      woodBox(s * HX - 0.12, s * HX + 0.12, 0, roof, z0, z1, mats.wood)
      solids.push(box(s * (HX + 0.1), (z0 + z1) / 2, 0.6, z1 - z0 + 1))
    }
    // posts at the front: two corners and one in the middle
    for (const x of [x0 + 0.3, 0.12, x1 - 0.3]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, roof, 10), mats.rail)
      post.position.set(x, roof / 2, z1 - 0.12)
      post.castShadow = !light
      ship.add(post)
      solids.push(circle(x, z1 - 0.12, 0.26))
    }
    // the rail round the roof: posts and two rails on its edges
    const top = roof + 0.18
    const ry = [top + 0.55, top + 0.95]
    const edge = [[x0, z1 + 0.1, x1, z1 + 0.1], [x0, z0 - 0.2, x1, z0 - 0.2], [x0, z0 - 0.2, x0, z1 + 0.1], [x1, z0 - 0.2, x1, z1 + 0.1]]
    for (const [ax, az, bx, bz] of edge) {
      for (const y of ry) spar(V(ax, y, az), V(bx, y, bz), 0.04)
      const n = Math.round(Math.hypot(bx - ax, bz - az) / 0.6)
      for (let i = 0; i <= n; i++) {
        const t = i / n
        spar(V(ax + (bx - ax) * t, top, az + (bz - az) * t), V(ax + (bx - ax) * t, ry[1], az + (bz - az) * t), 0.025)
      }
    }
    // the stern windows of the great cabin: lead lights, warm, in the left half of the bulkhead
    const paneTex = canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#ffd8a0'
      g.fillRect(0, 0, w, w)
      const grd = g.createRadialGradient(w / 2, w * 0.6, 10, w / 2, w * 0.6, w * 0.7)
      grd.addColorStop(0, 'rgba(255,240,200,0.9)')
      grd.addColorStop(1, 'rgba(200,120,50,0.25)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
      g.strokeStyle = '#2a1c10'
      g.lineWidth = 7
      for (let i = 0; i <= 2; i++) {
        g.beginPath()
        g.moveTo((i * w) / 2, 0)
        g.lineTo((i * w) / 2, w)
        g.moveTo(0, (i * w) / 2)
        g.lineTo(w, (i * w) / 2)
        g.stroke()
      }
    })
    disposers.push(() => paneTex.dispose())
    const paneMat = new THREE.MeshBasicMaterial({ map: paneTex, color: new THREE.Color('#ffffff').multiplyScalar(0.8), toneMapped: false })
    for (const x of [-3.3, -2.05, -0.8]) {
      const frame = new THREE.Mesh(new RoundedBoxGeometry(1.0, 1.28, 0.1, 2, 0.04), mats.rail)
      frame.position.set(x, 1.55, z0 + 0.06)
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 1.12), paneMat)
      pane.position.set(x, 1.55, z0 + 0.12)
      ship.add(frame, pane)
    }
  }

  // ---- masts: main, fore (in the waist and the bow), mizzen (standing on the castle roof) ----
  const masts = [
    { x: 1.5, z: -1.7, y0: 0, h: 13, r: 0.42, name: 'main' },
    { x: 2.3, z: 4.9, y0: 0, h: 11.5, r: 0.36, name: 'fore' },
    { x: 0.5, z: -9.4, y0: CASTLE.roof + 0.18, h: 8, r: 0.26, name: 'mizzen' },
  ]
  for (const m of masts) {
    const geo = new THREE.CylinderGeometry(m.r * 0.52, m.r, m.h, 14)
    const mesh = new THREE.Mesh(geo, mats.rail)
    mesh.position.set(m.x, m.y0 + m.h / 2, m.z)
    mesh.castShadow = !light
    ship.add(mesh)
    if (m.y0 === 0) solids.push(circle(m.x, m.z, m.r + 0.12))
    // a band of iron hoops and the pin rail round the foot
    for (const y of [m.y0 + 0.9, m.y0 + 1.6]) {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(m.r + 0.01, 0.03, 6, 20), mats.iron)
      hoop.rotation.x = Math.PI / 2
      hoop.position.set(m.x, y, m.z)
      ship.add(hoop)
    }
    // the top: a platform and the yards with their furled sails
    const topY = m.y0 + m.h * 0.62
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.12, 10), mats.rail)
    plat.position.set(m.x, topY, m.z)
    ship.add(plat)
    const yards = m.name === 'mizzen' ? [[m.y0 + m.h * 0.55, 5.4, 'lateen']] : [[m.y0 + m.h * 0.45, m.name === 'main' ? 7.4 : 6.0], [m.y0 + m.h * 0.78, m.name === 'main' ? 5.0 : 4.2]]
    for (const [y, len, kind] of yards) {
      const tilt = kind === 'lateen' ? 0.5 : 0
      const a = V(m.x - Math.cos(tilt) * len / 2 * (kind ? 0.55 : 1), y - Math.sin(tilt) * len / 2, m.z + (kind ? 0 : 0))
      const b = V(m.x + Math.cos(tilt) * len / 2 * (kind ? 1.45 : 1), y + Math.sin(tilt) * len / 2, m.z)
      const yard = new THREE.Mesh(segGeo(a, b, 0.09, 8), mats.rail)
      yard.castShadow = !light
      ship.add(yard)
      // the furled sail: a fat canvas roll along the yard, hanging a little below it
      const roll = segGeo(a.clone().lerp(b, 0.06).add(V(0, -0.22, 0)), b.clone().lerp(a, 0.06).add(V(0, -0.22, 0)), 0.2, 9)
      const rollMesh = new THREE.Mesh(roll, mats.canvas)
      rollMesh.castShadow = !light
      ship.add(rollMesh)
      // gaskets: ties round the roll
      const n = Math.round(len / 0.9)
      for (let i = 1; i < n; i++) {
        const p = a.clone().lerp(b, i / n).add(V(0, -0.22, 0))
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.016, 5, 12), mats.rope)
        tie.position.copy(p)
        tie.rotation.y = Math.PI / 2
        ship.add(tie)
      }
      // lifts from the yard's ends to the mast top
      rope(a.clone().lerp(b, 0.04), V(m.x, m.y0 + m.h * 0.96, m.z), 0.012)
      rope(b.clone().lerp(a, 0.04), V(m.x, m.y0 + m.h * 0.96, m.z), 0.012)
    }
    // shrouds: lines from the top to the rails, with ratlines across them
    if (m.name !== 'mizzen') {
      for (const s of [-1, 1]) {
        const anchors = [-1.0, -0.35, 0.3, 0.95].map(dz => V(s * (HX - 0.25), 1.08, m.z + dz))
        const high = V(m.x + s * 0.3, topY, m.z)
        for (const [i, a] of anchors.entries()) rope(a, high.clone().add(V(0, 0, (i - 1.5) * 0.12)), 0.016)
        for (let k = 0.18; k < 0.92; k += 0.085) {
          const p0 = anchors[0].clone().lerp(high.clone().add(V(0, 0, -0.18)), k)
          const p1 = anchors[3].clone().lerp(high.clone().add(V(0, 0, 0.18)), k)
          rope(p0, p1, 0.01)
        }
      }
    }
    // stays toward the bow and the stern
    if (m.name === 'main') rope(V(m.x, m.y0 + m.h * 0.96, m.z), V(masts[1].x, masts[1].y0 + masts[1].h * 0.9, masts[1].z), 0.016)
    if (m.name === 'fore') rope(V(m.x, m.y0 + m.h * 0.96, m.z), V(0, 3.0, deck.z1 + 5.2), 0.018)
    if (m.name === 'main') rope(V(m.x, m.y0 + m.h * 0.96, m.z), V(masts[2].x, masts[2].y0 + masts[2].h * 0.9, masts[2].z), 0.014)
  }
  // the bowsprit, rising over the bow beyond the frame
  spar(V(0.0, 1.2, deck.z1 - 0.5), V(0.0, 3.4, deck.z1 + 8.5), 0.16)
  rope(V(0, 3.4, deck.z1 + 8.5), V(masts[1].x, masts[1].y0 + masts[1].h * 0.8, masts[1].z), 0.012)
  rope(V(0, 3.4, deck.z1 + 8.5), V(-0.15, 0.9, deck.z1 - 0.3), 0.014)

  const ropeMesh = new THREE.Mesh(mergeGeometries(ropeGeos), mats.rope)
  const railMesh = new THREE.Mesh(mergeGeometries(railGeos), mats.rail)
  railMesh.castShadow = !light
  ship.add(ropeMesh, railMesh)

  // ---- small things on deck: a capstan, barrels, coiled rope, a grating, cannons ----
  const capstan = (x, z) => {
    const g = new THREE.Group()
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 1.0, 14), mats.rail)
    drum.position.y = 0.5
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.4, 0.14, 14), mats.wood)
    head.position.y = 1.05
    g.add(drum, head)
    for (let i = 0; i < 6; i++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 6), mats.rail)
      bar.rotation.z = Math.PI / 2
      bar.rotation.y = (i / 6) * Math.PI
      bar.position.y = 1.0
      g.add(bar)
    }
    g.position.set(x, 0, z)
    g.castShadow = !light
    ship.add(g)
    solids.push(circle(x, z, 0.5))
  }
  capstan(3.3, 0.9)
  const barrelGeo = new THREE.LatheGeometry([[0.0, 0], [0.26, 0], [0.31, 0.12], [0.34, 0.45], [0.31, 0.78], [0.26, 0.9], [0.0, 0.9]].map(([x, y]) => new THREE.Vector2(x, y)), 14)
  const barrel = (x, z, s = 1) => {
    const m = new THREE.Mesh(barrelGeo, mats.wood)
    m.scale.setScalar(s)
    m.position.set(x, 0, z)
    m.castShadow = !light
    ship.add(m)
    for (const y of [0.16, 0.45, 0.74]) {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.31 * s * (1 + (0.45 - Math.abs(y - 0.45)) * 0.12) , 0.012, 4, 16), mats.iron)
      hoop.rotation.x = Math.PI / 2
      hoop.position.set(x, y * s, z)
      ship.add(hoop)
    }
    solids.push(circle(x, z, 0.33 * s))
    return m
  }
  barrel(3.85, -3.2)
  barrel(3.5, -4.1)
  barrel(3.9, -4.8, 0.85)
  barrel(-3.9, 5.9)
  barrel(-3.45, 6.55, 0.9)
  // a coil of rope on the deck by the foremast
  {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.1, 6, 18), mats.rope)
    coil.rotation.x = Math.PI / 2
    coil.position.set(masts[1].x - 0.7, 0.1, masts[1].z + 0.5)
    ship.add(coil)
  }
  // a grating over the hatch in the waist (a lattice of slats, flat)
  {
    const g = new THREE.Group()
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.07), mats.rail)
      s.position.set(0, 0.04, -0.6 + i * 0.15)
      g.add(s)
    }
    for (let i = 0; i < 5; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 1.3), mats.rail)
      s.position.set(-0.6 + i * 0.3, 0.02, 0)
      g.add(s)
    }
    g.position.set(-0.1, 0, 1.5)
    ship.add(g)
  }
  // cannons on carriages at the ports of the waist (iron barrels on wooden trucks)
  const cannon = (s, z) => {
    const g = new THREE.Group()
    const barrelM = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1.5, 12).rotateX(Math.PI / 2), mats.iron)
    barrelM.position.set(0, 0.55, 0)
    const cascabel = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mats.iron)
    cascabel.position.set(0, 0.55, -0.82)
    const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 1.3), mats.rail)
    carriage.position.set(0, 0.3, -0.1)
    for (const dz of [-0.5, 0.4]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.66, 10).rotateZ(Math.PI / 2), mats.wood)
      wheel.position.set(0, 0.16, dz)
      g.add(wheel)
    }
    g.add(barrelM, cascabel, carriage)
    g.position.set(s * (HX - 0.7), 0, z)
    g.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2
    // the muzzle toward the port, the breech toward the room
    g.castShadow = !light
    ship.add(g)
    solids.push(box(s * (HX - 0.7), z, 1.5, 0.7))
  }
  for (const s of [-1, 1]) for (const z of [-3.2, 5.2]) cannon(s, z)

  // ---- lanterns: a brass-capped glass box with a flame, and its warm glow ----
  const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd49a').multiplyScalar(1.5), toneMapped: false })
  const flames = []
  function lantern(x, y, z, size = 1, lit = true) {
    const g = new THREE.Group()
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.17 * size, 0.14 * size, 8), mats.brass)
    cap.position.y = 0.2 * size
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * size, 0.12 * size, 0.06 * size, 8), mats.brass)
    base.position.y = -0.17 * size
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * size, 0.1 * size, 0.3 * size, 8), flameMat)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffb866', transparent: true, opacity: 0.7, depthWrite: false }))
    halo.scale.setScalar(1.7 * size)
    g.add(cap, base, glass, halo)
    g.position.set(x, y, z)
    ship.add(g)
    flames.push({ halo, phase: Math.random() * 10 })
    return g
  }
  // hung from the roof's beams: over the cabin and the hold, and one in the middle
  for (const x of [-4.05, 4.05]) {
    rope(V(x, CASTLE.roof - 0.14, CASTLE.z1 - 1.5), V(x, 2.62, CASTLE.z1 - 1.5), 0.012)
    lantern(x, 2.35, CASTLE.z1 - 1.5, 1.1)
  }
  rope(V(0.12, CASTLE.roof, CASTLE.z1 - 2.2), V(0.12, 2.3, CASTLE.z1 - 2.2), 0.012)
  lantern(0.12, 2.05, CASTLE.z1 - 2.2, 0.8)
  // on the masts, hung from hooks
  lantern(masts[0].x - 0.5, 2.25, masts[0].z + 0.55, 1.0)
  lantern(masts[1].x - 0.5, 2.25, masts[1].z + 0.55, 1.0)
  // the big stern lanterns on poles at the roof's back corners
  for (const s of [-1, 1]) {
    spar(V(s * (HX - 0.4), CASTLE.roof + 0.18, CASTLE.z0 + 0.3), V(s * (HX - 0.4), CASTLE.roof + 2.6, CASTLE.z0 + 0.3), 0.06)
    lantern(s * (HX - 0.4), CASTLE.roof + 2.9, CASTLE.z0 + 0.3, 1.9)
  }

  // ---- light: a moonlit night, lanterns on the deck ----
  const hemi = new THREE.HemisphereLight('#586a9c', '#1a1612', light ? 0.8 : 0.66)
  const moonLight = new THREE.DirectionalLight('#a9bbff', 0.62)
  moonLight.position.copy(moonDir).multiplyScalar(40)
  if (!light) {
    moonLight.castShadow = true
    moonLight.shadow.mapSize.set(2048, 2048)
    const c = moonLight.shadow.camera
    c.left = -14
    c.right = 14
    c.top = 14
    c.bottom = -14
    c.near = 1
    c.far = 90
    moonLight.shadow.bias = -0.0006
    moonLight.shadow.normalBias = 0.04
  }
  moonLight.target.position.set(0, 0, -1)
  group.add(hemi, moonLight, moonLight.target)
  const lamps = []
  const lamp = (x, y, z, intensity, dist = 11) => {
    const l = new THREE.PointLight('#ffb468', intensity, dist, 1.5)
    l.position.set(x, y, z)
    group.add(l)
    lamps.push({ l, base: intensity, phase: Math.random() * 10 })
    return l
  }
  lamp(-3.2, 2.3, CASTLE.z1 - 1.5, light ? 16 : 19)
  lamp(3.2, 2.3, CASTLE.z1 - 1.5, light ? 14 : 17)
  lamp(masts[0].x - 0.5, 2.3, masts[0].z + 0.5, light ? 11 : 13)
  lamp(masts[1].x - 0.5, 2.3, masts[1].z + 0.5, light ? 9 : 11)

  // the ropes and the rails and so on are built; the stage's free faces
  const cameraBounds = { minX: -HX + 0.1, maxX: HX - 0.1, minY: 0.35, maxY: CASTLE.roof - 0.1, minZ: CASTLE.z0 + 0.3, maxZ: deck.z1 }
  const swayAmt = sway
  const other = group.userData.other
  return {
    group,
    solids,
    mats,
    seaLevel: SEA,
    castle: CASTLE,
    masts,
    lantern,
    rope,
    glow,
    /** Hang `obj` on the back bulkhead at (x, y), facing the deck. */
    onBulkhead(obj, x, y) {
      obj.position.set(x, y, CASTLE.z0 + 0.06)
      group.add(obj)
      return obj
    },
    env: {
      background: new THREE.Color('#03050c'),
      fog: new THREE.Fog(HORIZON, 400, 2600),
      exposure: 1.0,
      envIntensity: 0.1,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.8 },
      fov: 60,
      far: 3000,
      shadows: !light,
    },
    cameraBounds,
    update(t) {
      sky.userData.update?.(t)
      seaMat.uniforms.uTime.value = t
      // at anchor: a slow roll and a long, shallow heave of the outside
      outside.rotation.z = swayAmt * 0.0075 * Math.sin((t * TAU) / 8.5)
      outside.rotation.x = swayAmt * 0.0035 * Math.sin((t * TAU) / 6.3 + 1.1)
      outside.position.y = swayAmt * 0.08 * Math.sin((t * TAU) / 7.4 + 0.4)
      // the other galleon glides along its course
      other.position.x = 110 + 70 * Math.sin(t * 0.03)
      other.position.y = Math.sin(t * 0.7) * 0.12
      for (const f of flames) f.halo.material.opacity = 0.62 + 0.1 * Math.sin(t * 7 + f.phase) + 0.05 * Math.sin(t * 13.3 + f.phase * 2)
      for (const l of lamps) l.l.intensity = l.base * (0.96 + 0.04 * Math.sin(t * 8.3 + l.phase) + 0.02 * Math.sin(t * 17.1 + l.phase))
    },
    dispose() {
      disposers.forEach(f => f())
      ropeMesh.geometry.dispose()
      railMesh.geometry.dispose()
    },
  }
}
