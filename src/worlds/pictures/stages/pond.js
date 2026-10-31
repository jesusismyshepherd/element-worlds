// A stage for picture rooms (docs/knowledge/picture-rooms.md): a pond on a summer evening, seen at a pond
// skater's size (everything about 200 times bigger than life). You stand on the water itself, held up by its
// skin: a soft surface that dents wherever something stands on it and rings out when it is touched. Reeds
// rise like tree trunks, each with the little rise of water that climbs a wet stem; a lily pad lies like a
// green field (a step up, to stand on); a dragonfly the size of a plane passes overhead now and then; the far
// bank's trees under a dusk sky with its first stars, the last glow in the west. The water is mid-toned (a
// pale floor washes the room out under the bloom).
//
// The scene says where the water dents: `dimple(i, x1, z1, x2, z2, radius, depth)` (a dent along a segment,
// so a lying leg or a paper clip's wire dents along its length; up to 16; depth 0 removes it) and
// `ripple(x, z, amp)` sends rings out. The dents' shape is the same in the shader and in `heightAt(x, z)`,
// so the scene can rest a foot at the bottom of its dimple. `boil(k)` stirs the whole pond (0 to 1), for a
// what-if. `pad` is the lily pad ({ x, z, r, top }).
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'
import { circle } from '../../../engine/collide.js'

const C = c => new THREE.Color(c)
const NSEG = 16
const SKY = { zenith: C('#0a1634'), mid: C('#1a3b5e'), horizon: C('#3b7a80'), glow: C('#f0a066') }
// the last light of the sun, just set in the west (a unit vector toward it)
const SUN_DIR = new THREE.Vector3(-0.82, 0.06, -0.57).normalize()

/** The pond. `radius`: where the walker stays inside; `pad`: the lily pad's place and size. */
export function pondStage({ radius = 13, light = false, level = 0.1, pad = { x: 8.6, z: -2.4, r: 5.4 } } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const keep = (...xs) => xs.forEach(x => disposers.push(() => x.dispose()))

  // ---- the sky: navy above, teal at the horizon, the west still glowing, the first stars ----
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uZenith: { value: SKY.zenith },
      uMid: { value: SKY.mid },
      uHorizon: { value: SKY.horizon },
      uGlow: { value: SKY.glow },
      uSun: { value: SUN_DIR },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uZenith; uniform vec3 uMid; uniform vec3 uHorizon; uniform vec3 uGlow; uniform vec3 uSun;
      varying vec3 vDir;
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 c = h > 0.0 ? mix(uHorizon, uMid, smoothstep(0.0, 0.32, h)) : uHorizon * 0.8;
        c = h > 0.0 ? mix(c, uZenith, smoothstep(0.25, 0.95, h)) : c;
        // the west still warm where the sun went down
        float s = max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0);
        float low = 1.0 - smoothstep(0.0, 0.3, abs(h));
        c += uGlow * pow(s, 6.0) * low * 0.42;
        // the first stars, high up
        if (h > 0.18) {
          vec3 q = floor(d * 170.0);
          float n = hash(q);
          float star = step(0.9962, n) * (0.45 + 0.55 * hash(q + 3.0));
          c += vec3(star) * smoothstep(0.18, 0.55, h) * 1.25;
        }
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(420, 48, 24), skyMat)
  sky.renderOrder = -10
  group.add(sky)
  keep(sky.geometry, skyMat)

  // ---- the far bank: a dark line of round trees and bushes all round ----
  {
    const r = random(41)
    const n = light ? 70 : 140
    const geo = new THREE.SphereGeometry(1, 14, 8)
    // instance colours multiply the material's: white here
    const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 })
    const bank = new THREE.InstancedMesh(geo, mat, n)
    const o = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.05
      const d = 150 + r() * 40
      const s = 12 + r() * 22
      o.position.set(Math.cos(a) * d, -s * 0.25 + r() * 6, Math.sin(a) * d)
      o.scale.set(s * (1.1 + r() * 0.7), s * (0.55 + r() * 0.35), s)
      o.rotation.y = r() * 3
      o.updateMatrix()
      bank.setMatrixAt(i, o.matrix)
      bank.setColorAt(i, C('#1d4238').multiplyScalar(0.75 + r() * 0.5))
    }
    group.add(bank)
    keep(geo, mat)
  }

  // ---- the pond's floor, deep below: dark mud, seen faintly through the water ----
  {
    const floor = new THREE.Mesh(new THREE.CircleGeometry(500, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#0a2226' }))
    floor.position.y = -6
    group.add(floor)
    keep(floor.geometry, floor.material)
  }

  // ---- the water: a skin that dents where things stand and rings where they touch ----
  const segA = Array.from({ length: NSEG }, () => new THREE.Vector4())
  const segB = Array.from({ length: NSEG }, () => new THREE.Vector4())
  const rip = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 99, 0))
  const waterU = {
    uSegA: { value: segA },
    uSegB: { value: segB },
    uRip: { value: rip },
    uTime: { value: 0 },
    uBoil: { value: 0 },
    uLevel: { value: level },
    uWater: { value: C('#1f5a62') },
    uDeep: { value: C('#123c44') },
    uRim: { value: C('#bff6ec') },
    uSkyTop: { value: SKY.mid.clone().lerp(SKY.zenith, 0.4) },
    uSkyHorizon: { value: SKY.horizon.clone() },
    uGlow: { value: SKY.glow.clone() },
    uSun: { value: SUN_DIR },
    fogColor: { value: new THREE.Color() },
    fogNear: { value: 1 },
    fogFar: { value: 2000 },
    fogDensity: { value: 0.00025 },
  }
  const DIMPLES = /* glsl */ `
    #define NSEG ${NSEG}
    uniform vec4 uSegA[NSEG]; uniform vec4 uSegB[NSEG];
    // the nearest point of segment s to p
    vec2 nearestOn(vec2 p, vec4 s) {
      vec2 ab = s.zw - s.xy;
      float L = dot(ab, ab);
      float t = L > 1e-6 ? clamp(dot(p - s.xy, ab) / L, 0.0, 1.0) : 0.0;
      return s.xy + ab * t;
    }
    // the dents' height at p (negative), and its slope in g
    float dents(vec2 p, out vec2 g) {
      float h = 0.0;
      g = vec2(0.0);
      for (int i = 0; i < NSEG; i++) {
        vec4 b = uSegB[i];
        if (b.y <= 0.0) continue;
        vec2 dv = p - nearestOn(p, uSegA[i]);
        float q = dot(dv, dv) / (b.x * b.x);
        if (q > 9.0) continue;
        float e = b.y * exp(-q);
        h -= e;
        g += 2.0 * e * dv / (b.x * b.x);
      }
      return h;
    }`
  const waterMat = new THREE.ShaderMaterial({
    fog: true,
    transparent: true,
    depthWrite: false,
    uniforms: waterU,
    vertexShader: /* glsl */ `
      ${DIMPLES}
      uniform float uLevel;
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vec2 g;
        wp.y = uLevel + dents(wp.xz, g);
        vWorld = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      ${DIMPLES}
      uniform vec4 uRip[8];
      uniform float uTime; uniform float uBoil; uniform float uLevel;
      uniform vec3 uWater; uniform vec3 uDeep; uniform vec3 uRim; uniform vec3 uSkyTop; uniform vec3 uSkyHorizon;
      uniform vec3 uGlow; uniform vec3 uSun;
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      float waves(vec2 p) {
        float t = uTime;
        float w = noise(p * 0.55 + vec2(t * 0.06, t * 0.03)) * 0.6 + noise(p * 1.6 - vec2(t * 0.11, -t * 0.05)) * 0.3;
        return w + uBoil * (noise(p * 1.7 + vec2(0.0, t * 1.4)) + 0.5 * noise(p * 3.9 - vec2(t * 1.8, 0.0)));
      }
      void main() {
        vec2 p = vWorld.xz;
        vec3 V = normalize(cameraPosition - vWorld);
        float dist = length(cameraPosition - vWorld);
        vec2 g;
        float hd = dents(p, g);
        // the evening breeze's small ripples, quieter far off
        float e = 0.06;
        float w0 = waves(p);
        float amp = (0.035 + uBoil * 0.045) * (1.0 - smoothstep(25.0, 120.0, dist));
        g += vec2(waves(p + vec2(e, 0.0)) - w0, waves(p + vec2(0.0, e)) - w0) / e * amp;
        // rings going out from where something touched the water
        float ring = 0.0;
        for (int i = 0; i < 8; i++) {
          vec4 r = uRip[i];
          if (r.z > 6.0 || r.w <= 0.0) continue;
          vec2 dv = p - r.xy;
          float d = length(dv) + 1e-4;
          float front = 0.25 + r.z * 1.4;
          float x = (d - front) / 0.5;
          float band = exp(-x * x);
          float k = r.w * exp(-r.z * 0.8) / (1.0 + d * 0.25);
          g += (dv / d) * k * band * cos((d - front) * 8.0) * 0.9;
          ring += k * band * max(0.0, sin((d - front) * 8.0));
        }
        vec3 N = normalize(vec3(-g.x, 1.0, -g.y));
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float fres = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
        vec3 R = reflect(-V, N);
        float ry = clamp(R.y, 0.0, 1.0);
        vec3 sky = mix(uSkyHorizon, uSkyTop, pow(ry, 0.55));
        float west = max(dot(normalize(vec3(R.x, 0.0, R.z) + 1e-4), normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0);
        sky += uGlow * pow(west, 8.0) * (1.0 - smoothstep(0.0, 0.35, ry)) * 0.45;
        vec3 base = mix(uWater, uDeep, smoothstep(30.0, 140.0, dist));
        vec3 c = mix(base, sky, clamp(fres * 0.85 + 0.1, 0.0, 1.0));
        // a dimple as the picture draws it: darker in its hollow, a bright rim where the skin bends most
        float slope = length(g);
        float hollow = smoothstep(0.015, 0.2, -hd);
        c *= 1.0 - 0.5 * hollow;
        c = mix(c, uRim, smoothstep(0.3, 0.9, slope) * (0.3 + 0.45 * (1.0 - hollow)) * (1.0 - smoothstep(12.0, 34.0, dist)));
        c += uRim * ring * 0.35;
        // the glint of the west's glow on the water
        c += uGlow * pow(max(dot(R, uSun), 0.0), 60.0) * 0.6;
        // the boiling what-if: pale foam and bubbles
        float foam = uBoil * smoothstep(0.62, 0.95, noise(p * 2.2 + vec2(uTime * 1.1, -uTime * 0.6)));
        c = mix(c, vec3(0.62, 0.8, 0.8), foam * 0.4);
        float alpha = mix(0.8, 1.0, clamp(fres * 1.5, 0.0, 1.0));
        gl_FragColor = vec4(c, alpha);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
  // a fine polar grid out to 16 m (where things dent), coarse beyond, sharing the seam's vertices
  const seg = light ? 300 : 560
  const near = new THREE.Mesh(new THREE.RingGeometry(0.0, 16, seg, light ? 70 : 130).rotateX(-Math.PI / 2), waterMat)
  const far = new THREE.Mesh(new THREE.RingGeometry(16, 480, seg, 16).rotateX(-Math.PI / 2), waterMat)
  for (const m of [near, far]) {
    m.renderOrder = -1
    m.frustumCulled = false
    m.raycast = () => {}
    group.add(m)
    keep(m.geometry)
  }
  keep(waterMat)

  // ---- reeds: green trunks rising out of sight, each with its rise of water round the foot ----
  const reedTex = canvasTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0)
    grd.addColorStop(0, '#2c4f2a')
    grd.addColorStop(0.45, '#5f8a48')
    grd.addColorStop(1, '#2a4a28')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    const r = random(5)
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '30,52,28' : '140,170,100'},${0.18 + r() * 0.2})`
      g.fillRect(r() * w, 0, 1 + r() * 2, h)
    }
  })
  reedTex.wrapS = reedTex.wrapT = THREE.RepeatWrapping
  reedTex.repeat.set(2, 14)
  const reedMat = new THREE.MeshStandardMaterial({ map: reedTex, roughness: 0.75 })
  const leafMat = new THREE.MeshStandardMaterial({ color: '#4c7a3e', roughness: 0.8, side: THREE.DoubleSide })
  const climbMat = new THREE.MeshStandardMaterial({ color: '#3d8b90', roughness: 0.08, metalness: 0.1, emissive: '#1a4e54', emissiveIntensity: 0.4, transparent: true, opacity: 0.8 })
  const headMat = new THREE.MeshStandardMaterial({ color: '#6a3b20', roughness: 0.9 })
  keep(reedTex, reedMat, leafMat, climbMat, headMat)
  const solids = ringWall(radius)
  /** A long reed leaf: a tapering strip rising from the foot and arching over. */
  function leafBlade(len, width, bend, rnd) {
    const n = 14
    const pos = []
    const idx = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const y = len * t * (1 - bend * 0.35 * t)
      const out = bend * len * 0.45 * t * t
      const w = width * (1 - t * 0.92)
      pos.push(-w / 2, y, out, w / 2, y, out)
      if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const m = new THREE.Mesh(geo, leafMat)
    m.rotation.y = rnd() * Math.PI * 2
    keep(geo)
    return m
  }
  const reeds = []
  function reed(x, z, r, h, rnd, { head = false, lean = 0 } = {}) {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.82, r, h, 14, 1, true).translate(0, h / 2, 0), reedMat)
    g.add(stem)
    keep(stem.geometry)
    // water climbs a wet stem: a little rise of the surface all round its foot
    const prof = []
    for (let i = 0; i <= 10; i++) {
      const t = i / 10
      prof.push(new THREE.Vector2(r + 0.02 + (1 - t) * (1 - t) * 0.55, level + t * t * 0.3 - 0.02))
    }
    const climb = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), climbMat)
    g.add(climb)
    keep(climb.geometry)
    if (head) {
      const hd = new THREE.Mesh(new THREE.CapsuleGeometry(r * 1.6, h * 0.16, 6, 12), headMat)
      hd.position.y = h * 0.84
      g.add(hd)
      keep(hd.geometry)
    }
    g.rotation.z = lean
    g.rotation.y = rnd() * 6
    group.add(g)
    reeds.push(g)
    return g
  }
  {
    const r = random(12)
    // the near ones, just outside where you walk: trunks into the dusk
    const near = light ? 10 : 16
    for (let i = 0; i < near; i++) {
      const a = (i / near) * Math.PI * 2 + r() * 0.25
      // leave the frame's side (+z) and the lily pad's side open
      const d = radius + 3 + r() * 9
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      if (z > 6 && Math.abs(x) < 8) continue
      if (Math.hypot(x - pad.x, z - pad.z) < pad.r + 2) continue
      const rr = 0.7 + r() * 0.7
      reed(x, z, rr, 90, r, { lean: (r() - 0.5) * 0.06 })
      solids.push(circle(x, z, rr + 0.3))
      if (r() < 0.8) {
        const leaf = leafBlade(30 + r() * 30, 1.6 + r() * 1.2, 0.5 + r() * 0.6, r)
        leaf.position.set(x, level, z)
        group.add(leaf)
      }
    }
    // far ones with their brown heads, along the banks as the picture has them
    const far = light ? 12 : 26
    for (let i = 0; i < far; i++) {
      const a = r() * Math.PI * 2
      const d = 60 + r() * 90
      reed(Math.cos(a) * d, Math.sin(a) * d, 0.9 + r() * 0.6, 26 + r() * 22, r, { head: r() < 0.75, lean: (r() - 0.5) * 0.18 })
    }
  }

  // ---- the lily pad: a green field with its veins, its notch, its rim turned up a little ----
  const PAD_TOP = 0.24
  const padTex = canvasTex(1024, 1024, (g, w) => {
    const c = w / 2
    const grd = g.createRadialGradient(c, c, 0, c, c, c)
    grd.addColorStop(0, '#4f8a3a')
    grd.addColorStop(0.75, '#3f7a34')
    grd.addColorStop(1, '#2f5f2a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    const r = random(77)
    // a mottle, then the veins from the middle out, forking
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '36,70,30' : '110,160,80'},${0.05 + r() * 0.1})`
      g.beginPath()
      g.ellipse(r() * w, r() * w, 4 + r() * 22, 3 + r() * 12, r() * 3, 0, Math.PI * 2)
      g.fill()
    }
    g.strokeStyle = 'rgba(150,200,110,0.55)'
    g.lineCap = 'round'
    const vein = (x, y, a, len, width, depth) => {
      const x2 = x + Math.cos(a) * len
      const y2 = y + Math.sin(a) * len
      g.lineWidth = width
      g.beginPath()
      g.moveTo(x, y)
      g.quadraticCurveTo(x + Math.cos(a + 0.12) * len * 0.5, y + Math.sin(a + 0.12) * len * 0.5, x2, y2)
      g.stroke()
      if (depth > 0) {
        vein(x2, y2, a - 0.32, len * 0.55, width * 0.6, depth - 1)
        vein(x2, y2, a + 0.32, len * 0.55, width * 0.6, depth - 1)
      }
    }
    for (let i = 0; i < 22; i++) vein(c, c, (i / 22) * Math.PI * 2, c * 0.55, 5, 2)
  })
  keep(padTex)
  const padMat = new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.45, metalness: 0.0, emissive: '#16330f', emissiveIntensity: 0.25 })
  const padSide = new THREE.MeshStandardMaterial({ color: '#5a2f2a', roughness: 0.7 })
  keep(padMat, padSide)
  {
    const notch = 0.3
    // the notch points away from the room's middle
    const out = Math.atan2(pad.z, pad.x)
    const top = new THREE.Mesh(new THREE.CircleGeometry(pad.r, 72, 0, Math.PI * 2 - notch).rotateX(-Math.PI / 2), padMat)
    // CircleGeometry's sector starts at +x and turns towards -z once laid flat: centre the gap on `out`
    top.rotation.y = -(out + notch / 2) + Math.PI * 2
    top.position.set(pad.x, PAD_TOP, pad.z)
    const side = new THREE.Mesh(new THREE.CylinderGeometry(pad.r, pad.r * 0.98, PAD_TOP - level + 0.06, 72, 1, true, 0, Math.PI * 2 - notch), padSide)
    side.rotation.y = top.rotation.y + Math.PI / 2
    side.position.set(pad.x, (PAD_TOP + level - 0.06) / 2, pad.z)
    // the rim, turned up a hand's breadth (at this size), reddish as a lily pad's edge often is
    const rim = new THREE.Mesh(new THREE.TorusGeometry(pad.r - 0.06, 0.09, 6, 96, Math.PI * 2 - notch), padSide)
    rim.rotation.x = -Math.PI / 2
    rim.rotation.z = -(out + notch / 2) + Math.PI * 2
    rim.position.set(pad.x, PAD_TOP + 0.04, pad.z)
    group.add(top, side, rim)
    keep(top.geometry, side.geometry, rim.geometry)
    // drops of water beading on the waxy leaf
    const beadMat = new THREE.MeshStandardMaterial({ color: '#d6f4f2', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.6, emissive: '#2a6a70', emissiveIntensity: 0.3 })
    const beadGeo = new THREE.SphereGeometry(1, 20, 12)
    keep(beadMat, beadGeo)
    const r = random(9)
    for (let i = 0; i < (light ? 4 : 9); i++) {
      const a = r() * Math.PI * 2
      const d = 1.5 + r() * (pad.r - 2.2)
      const s = 0.1 + r() * 0.22
      const b = new THREE.Mesh(beadGeo, beadMat)
      b.scale.set(s, s * 0.8, s)
      b.position.set(pad.x + Math.cos(a) * d, PAD_TOP + s * 0.7, pad.z + Math.sin(a) * d)
      group.add(b)
    }
  }
  solids.push(circle(pad.x, pad.z, pad.r - 0.1, { y0: 0, y1: PAD_TOP }))

  // ---- a dragonfly as big as a plane, passing over now and then ----
  const fly = new THREE.Group()
  {
    const body = new THREE.MeshStandardMaterial({ color: '#2a6cc0', roughness: 0.35, metalness: 0.35, emissive: '#0c2448', emissiveIntensity: 0.4 })
    const thoraxMat = new THREE.MeshStandardMaterial({ color: '#3b8a52', roughness: 0.4, metalness: 0.3, emissive: '#10301a', emissiveIntensity: 0.4 })
    const eyeMat = new THREE.MeshStandardMaterial({ color: '#2fb0b8', roughness: 0.2, metalness: 0.4, emissive: '#0e4a50', emissiveIntensity: 0.5 })
    const ringMat = new THREE.MeshStandardMaterial({ color: '#10141c', roughness: 0.6 })
    const wingTex = canvasTex(256, 64, (g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.fillStyle = 'rgba(210,235,255,0.28)'
      g.beginPath()
      g.ellipse(w / 2, h / 2, w / 2 - 2, h / 2 - 2, 0, 0, Math.PI * 2)
      g.fill()
      g.strokeStyle = 'rgba(40,60,80,0.55)'
      g.lineWidth = 1
      for (let i = 0; i < 26; i++) {
        g.beginPath()
        g.moveTo(4 + i * 9.5, 6)
        g.lineTo(4 + i * 9.5 + 3, h - 6)
        g.stroke()
      }
      g.beginPath()
      g.moveTo(4, h * 0.3)
      g.lineTo(w - 4, h * 0.35)
      g.stroke()
      g.fillStyle = 'rgba(30,30,40,0.8)'
      g.fillRect(w - 26, h * 0.22, 10, 8)
    })
    const wingMat = new THREE.MeshBasicMaterial({ map: wingTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true })
    keep(body, thoraxMat, eyeMat, ringMat, wingTex, wingMat)
    const add = (geo, mat, x, y, z, sx = 1, sy = 1, sz = 1) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.scale.set(sx, sy, sz)
      fly.add(m)
      keep(geo)
      return m
    }
    // nose along +z
    add(new THREE.SphereGeometry(1, 16, 12), thoraxMat, 0, 0, 0.6, 1.0, 1.1, 1.6)
    add(new THREE.SphereGeometry(1, 16, 12), eyeMat, -0.55, 0.25, 2.25, 0.75, 0.75, 0.75)
    add(new THREE.SphereGeometry(1, 16, 12), eyeMat, 0.55, 0.25, 2.25, 0.75, 0.75, 0.75)
    for (let i = 0; i < 9; i++) {
      const z = -1.2 - i * 0.95
      add(new THREE.CylinderGeometry(0.34 - i * 0.012, 0.36 - i * 0.012, 0.9, 10).rotateX(Math.PI / 2), body, 0, 0.05, z)
      add(new THREE.TorusGeometry(0.35 - i * 0.012, 0.05, 5, 14), ringMat, 0, 0.05, z - 0.47)
    }
    const wings = []
    for (const [z, len] of [[0.9, 7.6], [-0.3, 7.2]]) {
      for (const s of [-1, 1]) {
        const w = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.7).translate(len / 2, 0, 0).rotateX(-Math.PI / 2), wingMat)
        w.position.set(s * 0.6, 0.6, z)
        w.scale.x = s
        fly.add(w)
        keep(w.geometry)
        wings.push({ w, s, ph: z })
      }
    }
    fly.userData.wings = wings
    group.add(fly)
  }

  // midges and pollen in the still evening air
  const specks = motes({ count: 320, radius: radius + 5, y0: 0.4, y1: 9, color: '#e6fff6', size: 0.05, opacity: 0.55, speed: 0.1, light })
  group.add(specks.group)

  // ---- light: the evening sky's cool light all round, the west's last warmth low from one side ----
  group.add(new THREE.HemisphereLight('#a6dade', '#183634', 1.05))
  const west = new THREE.DirectionalLight('#ffcf9c', 1.0)
  west.position.copy(SUN_DIR).multiplyScalar(60).setY(26)
  group.add(west, west.target)

  // ---- what the scene asks for ----
  let ripN = 0
  /** A dent along x1,z1 to x2,z2 (a point when they are the same), `r` wide, `depth` deep (0 removes it). */
  const dimple = (i, x1, z1, x2, z2, r, depth) => {
    if (i < 0 || i >= NSEG) return
    segA[i].set(x1, z1, x2, z2)
    segB[i].set(Math.max(0.05, r), Math.max(0, depth), 0, 0)
  }
  /** The water's height at x, z (the dents' shape, as the shader draws it). */
  const heightAt = (x, z) => {
    let h = level
    for (let i = 0; i < NSEG; i++) {
      const b = segB[i]
      if (b.y <= 0) continue
      const s = segA[i]
      const abx = s.z - s.x
      const abz = s.w - s.y
      const L = abx * abx + abz * abz
      const t = L > 1e-6 ? Math.min(1, Math.max(0, ((x - s.x) * abx + (z - s.y) * abz) / L)) : 0
      const dx = x - (s.x + abx * t)
      const dz = z - (s.y + abz * t)
      h -= b.y * Math.exp(-(dx * dx + dz * dz) / (b.x * b.x))
    }
    return h
  }
  let tFly = 0
  const flyPath = t => {
    // a long loop round the pond about every 40 s, low enough to be seen over the reeds
    const a = t * 0.16 + 3.6
    return new THREE.Vector3(Math.cos(a) * 34 + 4, 17 + Math.sin(a * 2) * 3, Math.sin(a) * 24 - 4)
  }

  return {
    group,
    solids,
    level,
    pad: { ...pad, top: PAD_TOP },
    sunDir: SUN_DIR,
    env: {
      background: SKY.horizon.clone(),
      fog: new THREE.Fog(SKY.horizon.clone().lerp(SKY.mid, 0.25), 110, 520),
      exposure: 1.0,
      envIntensity: 0.15,
      bloom: { strength: 0.55, radius: 0.55, threshold: 0.82 },
      fov: 62,
    },
    cameraBounds: { minX: -radius - 2, maxX: radius + 2, minY: level + 0.35, maxY: 14, minZ: -radius - 2, maxZ: radius + 2 },
    dimple,
    heightAt,
    /** Rings going out from x, z (amp about 1 for a touch). */
    ripple(x, z, amp = 1) {
      rip[ripN % rip.length].set(x, z, 0, amp)
      ripN++
    },
    /** Stirs the whole pond, 0 to 1. */
    boil(k) {
      waterU.uBoil.value = Math.max(0, Math.min(1, k))
    },
    update(t, dt = 1 / 60) {
      waterU.uTime.value = t
      for (const r of rip) r.z += dt
      specks.update(t)
      // the dragonfly: along its loop, nose ahead, banking into the turn, wings a blur of beats
      tFly += dt
      const p = flyPath(tFly)
      const q = flyPath(tFly + 0.05)
      fly.position.copy(p)
      fly.lookAt(q)
      fly.rotateZ(-0.35)
      for (const { w, s, ph } of fly.userData.wings) w.rotation.z = s * (0.18 * Math.sin(t * 38 + ph * 2) + 0.05)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
