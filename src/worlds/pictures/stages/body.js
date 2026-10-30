// A stage for picture rooms (docs/knowledge/picture-rooms.md): inside the body, shrunk smaller than a cell,
// in the warm fluid between cells. A soft dome from deep violet overhead to plum at the horizon, glows in the
// distance as in the hall's pictures, a floor of rounded cells packed together, big soft cells round the
// edge and other fibres crossing far off in the haze, specks and ions drifting in the fluid. Surfaces are
// mid-toned (pale ones bloom to white). Walking inside a circle of `radius`.
// Also the ions every body room can use: `ionCloud(kind, max)` draws ions as round labelled balls that
// always face the eye (Na+ violet, K+ a deeper violet, Cl- green: tools/boards/lib/style.py), one draw call
// for every ion of a kind; `softGlow()` is a round glow for sprites and sparks.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes, ringWall } from '../kit.js'

const TAU = Math.PI * 2

// the ions in the game's colours (highlight, middle, dark), their labels and sizes (m, the ball's diameter;
// in proportion to the real ions: Na+ 102 pm, K+ 138 pm, Cl- 181 pm, drawn a little closer together)
export const ION_LOOK = {
  Na: { hi: '#f0e2ff', mid: '#ab5cf2', dark: '#4f1f8c', text: 'Na', sign: '+', size: 0.2 },
  K: { hi: '#d9c2ff', mid: '#7a2fc0', dark: '#2e0c5c', text: 'K', sign: '+', size: 0.25 },
  Cl: { hi: '#e0ffd8', mid: '#2fd23a', dark: '#0b6a16', text: 'Cl', sign: '−', size: 0.28 },
}

const ionTex = {}
/** An ion's face: a shaded ball with its symbol and charge (kept between rooms). */
export function ionTexture(kind) {
  if (ionTex[kind]) return ionTex[kind]
  const L = ION_LOOK[kind]
  const t = canvasTex(128, 128, (g, w) => {
    const c = w / 2
    const R = c - 3
    g.clearRect(0, 0, w, w)
    const grd = g.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.05, c, c, R)
    grd.addColorStop(0, L.hi)
    grd.addColorStop(0.45, L.mid)
    grd.addColorStop(1, L.dark)
    g.fillStyle = grd
    g.beginPath()
    g.arc(c, c, R, 0, TAU)
    g.fill()
    g.lineWidth = 3
    g.strokeStyle = 'rgba(20,6,40,0.85)'
    g.stroke()
    // the symbol, and its charge raised beside it
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = `800 ${L.text.length > 1 ? 44 : 54}px Outfit, Nunito, sans-serif`
    const tw = g.measureText(L.text).width
    g.lineWidth = 5
    g.strokeStyle = 'rgba(20,6,40,0.7)'
    g.fillStyle = '#ffffff'
    const x = c - 9
    g.strokeText(L.text, x, c + 4)
    g.fillText(L.text, x, c + 4)
    g.font = '800 40px Outfit, Nunito, sans-serif'
    g.strokeText(L.sign, x + tw / 2 + 12, c - 16)
    g.fillText(L.sign, x + tw / 2 + 12, c - 16)
  })
  t.userData.shared = true
  ionTex[kind] = t
  return t
}

/** Ions of one kind as balls that always face the eye: set(i, position, scale) for the first `count`. */
export function ionCloud(kind, max) {
  const base = new THREE.PlaneGeometry(1, 1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.index = base.index
  geo.setAttribute('position', base.attributes.position)
  geo.setAttribute('uv', base.attributes.uv)
  const pos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3)
  const scl = new THREE.InstancedBufferAttribute(new Float32Array(max), 1)
  pos.setUsage(THREE.DynamicDrawUsage)
  scl.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('iPos', pos)
  geo.setAttribute('iScale', scl)
  geo.instanceCount = 0
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { map: { value: null } }]),
    fog: true,
    vertexShader: /* glsl */ `
      attribute vec3 iPos;
      attribute float iScale;
      varying vec2 vUv;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(iPos, 1.0);
        mvPosition.xy += position.xy * iScale;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      varying vec2 vUv;
      #include <fog_pars_fragment>
      void main() {
        vec4 c = texture2D(map, vUv);
        if (c.a < 0.5) discard;
        gl_FragColor = vec4(c.rgb, 1.0);
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
  mat.uniforms.map.value = ionTexture(kind)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  const size = ION_LOOK[kind].size
  return {
    mesh,
    size,
    set(i, p, s = 1) {
      pos.setXYZ(i, p.x, p.y, p.z)
      scl.setX(i, size * s)
    },
    set count(n) {
      geo.instanceCount = n
      pos.needsUpdate = true
      scl.needsUpdate = true
    },
    dispose() {
      geo.dispose()
      base.dispose()
      mat.dispose()
    },
  }
}

let glowTex = null
/** A soft round glow, white in the middle (for sprites and sparks; kept between rooms). */
export function softGlow() {
  if (glowTex) return glowTex
  glowTex = canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.25, 'rgba(255,255,255,0.6)')
    grd.addColorStop(0.6, 'rgba(255,255,255,0.14)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  glowTex.userData.shared = true
  return glowTex
}

/** The floor: rounded cells packed side by side, a darker seam between them, a nucleus in each (seamless). */
function cellFloor(base, seam, seed) {
  const rnd = random(seed)
  return canvasTex(512, 512, (g, w) => {
    g.fillStyle = seam
    g.fillRect(0, 0, w, w)
    const n = 9
    const s = w / n
    const col = new THREE.Color()
    const cells = []
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        cells.push({
          x: (i + 0.5 + (rnd() - 0.5) * 0.45 + (j % 2) * 0.5) * s,
          y: (j + 0.5 + (rnd() - 0.5) * 0.45) * s,
          rx: s * (0.5 + rnd() * 0.12),
          ry: s * (0.44 + rnd() * 0.12),
          a: rnd() * Math.PI,
          l: (rnd() - 0.5) * 0.09,
          h: (rnd() - 0.5) * 0.03,
        })
      }
    }
    // each cell drawn again across the edges, so the tile repeats without a seam
    for (const dx of [-w, 0, w]) {
      for (const dy of [-w, 0, w]) {
        for (const c of cells) {
          const x = c.x + dx
          const y = c.y + dy
          if (x < -s || x > w + s || y < -s || y > w + s) continue
          col.set(base).offsetHSL(c.h, 0, c.l)
          const grd = g.createRadialGradient(x - c.rx * 0.25, y - c.ry * 0.3, 1, x, y, Math.max(c.rx, c.ry))
          grd.addColorStop(0, `#${col.clone().offsetHSL(0, 0, 0.035).getHexString()}`)
          grd.addColorStop(0.75, `#${col.getHexString()}`)
          grd.addColorStop(1, `#${col.clone().offsetHSL(0, 0, -0.05).getHexString()}`)
          g.fillStyle = grd
          g.beginPath()
          g.ellipse(x, y, c.rx * 0.95, c.ry * 0.95, c.a, 0, TAU)
          g.fill()
          g.fillStyle = `#${col.clone().offsetHSL(0.02, 0.02, -0.03).getHexString()}`
          g.beginPath()
          g.ellipse(x + c.rx * 0.18, y - c.ry * 0.12, c.rx * 0.18, c.ry * 0.15, c.a, 0, TAU)
          g.fill()
        }
      }
    }
  }, { repeat: true })
}

export function bodyStage({
  radius = 10,
  light = false,
  top = '#24143f',
  mid = '#4b1c4c',
  low = '#1c0d22',
  fog = '#3f1b45',
  floor = '#8a5274',
  seam = '#62304f',
  cells = '#9a5a82',
  ions = true,
} = {}) {
  const group = new THREE.Group()
  const disposers = []
  const updates = []
  const rnd = random(41)

  // the fluid all round: deep violet overhead, plum at the horizon, dark below
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uTop: { value: new THREE.Color(top) }, uMid: { value: new THREE.Color(mid) }, uLow: { value: new THREE.Color(low) } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uLow;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 c = h > 0.0 ? mix(uMid, uTop, pow(h, 0.7)) : mix(uMid, uLow, pow(-h, 0.5));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const dome = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16), domeMat)
  group.add(dome)
  disposers.push(() => {
    dome.geometry.dispose()
    domeMat.dispose()
  })

  // glows far off, as in the pictures: pink and violet, softly breathing
  const glows = []
  for (const [a, y, size, color, op] of [[-1.9, 9, 26, '#ff6fa8', 0.22], [-0.9, 14, 34, '#8a4ad8', 0.2], [0.3, 7, 24, '#ff8fbd', 0.18], [1.4, 12, 30, '#6a3cc8', 0.2], [2.5, 6, 22, '#ff6fa8', 0.16], [3.6, 11, 30, '#a24ad0', 0.18], [4.7, 8, 24, '#ff7ab0', 0.18], [5.6, 15, 34, '#5a34b8', 0.2]]) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softGlow(), color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.position.set(Math.cos(a) * 46, y, Math.sin(a) * 46)
    s.scale.setScalar(size)
    s.renderOrder = -5
    group.add(s)
    glows.push({ s, op, ph: a * 3 })
  }
  updates.push(t => {
    for (const g of glows) g.s.material.opacity = g.op * (0.85 + 0.15 * Math.sin(t * 0.35 + g.ph))
  })

  // the floor: cells packed side by side
  const floorTex = cellFloor(floor, seam, 7)
  floorTex.repeat.set(22, 22)
  disposers.push(() => floorTex.dispose())
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75, metalness: 0 }))
  ground.rotation.x = -Math.PI / 2
  group.add(ground)

  // big soft cells round the edge, sunk into the floor, a darker nucleus in each
  const cellMat = new THREE.MeshStandardMaterial({ color: cells, roughness: 0.6, emissive: '#3a1030', emissiveIntensity: 0.35 })
  const nucMat = new THREE.MeshStandardMaterial({ color: '#6a3a8a', roughness: 0.6, emissive: '#2a0e3a', emissiveIntensity: 0.4 })
  const blob = new THREE.SphereGeometry(1, 28, 16)
  const nCells = light ? 12 : 18
  for (let i = 0; i < nCells; i++) {
    const a = (i / nCells) * TAU + rnd() * 0.25
    const r = radius + 3.2 + rnd() * 4.5
    const sx = 2.4 + rnd() * 2.2
    const sy = 1.4 + rnd() * 1.6
    const sz = 2.0 + rnd() * 1.8
    const m = new THREE.Mesh(blob, cellMat)
    m.scale.set(sx, sy, sz)
    m.position.set(Math.cos(a) * r, sy * 0.35, Math.sin(a) * r)
    m.rotation.y = a + rnd()
    group.add(m)
    const nuc = new THREE.Mesh(blob, nucMat)
    nuc.scale.set(sx * 0.32, sy * 0.3, sz * 0.32)
    // on the side that faces the middle, so it shows
    nuc.position.set(Math.cos(a) * (r - sz * 0.62), sy * 0.62, Math.sin(a) * (r - sz * 0.62))
    group.add(nuc)
  }

  // other fibres crossing far off in the haze, at every height
  const fibreMat = new THREE.MeshStandardMaterial({ color: '#b0507e', roughness: 0.55, emissive: '#40102a', emissiveIntensity: 0.4 })
  const sheathMat = new THREE.MeshStandardMaterial({ color: '#c890aa', roughness: 0.5, emissive: '#3a1a2a', emissiveIntensity: 0.3 })
  const nFibres = light ? 5 : 8
  for (let i = 0; i < nFibres; i++) {
    const a = (i / nFibres) * TAU + 0.5
    const d = radius + 9 + rnd() * 10
    const c = new THREE.Vector3(Math.cos(a) * d, 2 + rnd() * 12, Math.sin(a) * d)
    const along = new THREE.Vector3(-Math.sin(a), (rnd() - 0.5) * 0.6, Math.cos(a)).normalize()
    const L = 26 + rnd() * 16
    const sag = new THREE.Vector3((rnd() - 0.5) * 6, (rnd() - 0.5) * 5, (rnd() - 0.5) * 6)
    const curve = new THREE.QuadraticBezierCurve3(c.clone().addScaledVector(along, -L / 2), c.clone().add(sag), c.clone().addScaledVector(along, L / 2))
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.35 + rnd() * 0.45, 10, false), i % 3 === 0 ? sheathMat : fibreMat)
    group.add(tube)
  }

  // specks drifting in the fluid
  const specks = motes({ count: 600, radius: radius + 6, y0: 0.1, y1: 10, color: '#ffd6ea', size: 0.05, opacity: 0.45, speed: 0.1, light })
  group.add(specks.group)
  updates.push(t => specks.update(t))

  // ions drifting overhead: the fluid between cells is mostly sodium and chloride, with a little potassium
  if (ions) {
    const drift = []
    const clouds = {}
    for (const [kind, n] of [['Na', light ? 12 : 22], ['Cl', light ? 9 : 16], ['K', light ? 2 : 4]]) {
      clouds[kind] = ionCloud(kind, n)
      group.add(clouds[kind].mesh)
      disposers.push(() => clouds[kind].dispose())
      for (let i = 0; i < n; i++) {
        const a = rnd() * TAU
        const r = radius + 1.5 + rnd() * 7
        drift.push({ kind, i, x: Math.cos(a) * r, y: 2.5 + rnd() * 7, z: Math.sin(a) * r, ph: rnd() * TAU, sp: 0.1 + rnd() * 0.15 })
      }
    }
    const p = new THREE.Vector3()
    updates.push(t => {
      for (const d of drift) {
        p.set(d.x + Math.sin(t * d.sp + d.ph) * 0.8, d.y + Math.sin(t * d.sp * 1.3 + d.ph * 2) * 0.4, d.z + Math.cos(t * d.sp * 0.9 + d.ph) * 0.8)
        clouds[d.kind].set(d.i, p)
      }
      for (const c of Object.values(clouds)) c.count = c.mesh.geometry.attributes.iPos.count
    })
  }

  // light: warm and soft from everywhere, a little stronger from above
  group.add(new THREE.HemisphereLight('#ffd0ec', '#3a1838', 1.0))
  const sun = new THREE.DirectionalLight('#ffe8f4', 0.85)
  sun.position.set(4, 14, 7)
  group.add(sun, sun.target)

  return {
    group,
    solids: ringWall(radius),
    env: {
      background: new THREE.Color(fog),
      fog: new THREE.Fog(fog, 11, 42),
      exposure: 1.0,
      envIntensity: 0.15,
      bloom: { strength: 0.5, radius: 0.55, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      for (const u of updates) u(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
