// The graphene row of the gallery: the peel stack (sticky tape lifts the top sheet off graphite and it
// floats free), Physics (graphene's π bands over the Brillouin zone, cones touching at the six K
// points), Chemistry (sp² bonds and the p orbitals that merge into π clouds), Electronics (a transistor
// that cannot switch fully off, and one with a gap that can), Materials (a 1 m² hammock holding a 4 kg
// cat) and the frontier: two sheets you twist against each other until the magic-angle moiré appears.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { ballStick, glowMat, plinth, taperedTube, easeInOut, easeOut, smooth, clamp, paint, UP } from './kit.js'
import { graphiteStack, inHexagon, GRAPHENE, rng, TAU } from './structures.js'
import { HONEY_GLSL } from './honeycomb.js'

const ACCENT = '#7fd4ff'
const GOLD = '#ffd166'
const SQ3 = Math.sqrt(3)
const lerp = (a, b, t) => a + (b - a) * t

// ---------------------------------------------------------------- the peel stack
/** Four graphene sheets stacked as graphite (ABAB, 3.35 Å apart). use(): a strip of sticky tape comes
 *  down, takes the top sheet with it, and the sheet floats free and glows: graphene. Again: it settles
 *  back. onFree() is called when the sheet comes away (the floor ripples). */
export function peelStack({ light, onFree }) {
  const scale = 0.15
  const layers = graphiteStack(4, inHexagon(6.2))
  const gap = GRAPHENE.layer * scale
  const base = 0.98
  const group = new THREE.Group()
  group.add(plinth({ radius: 1.3, height: 0.75, light }))
  const toWorld = p => [p[1] * scale, 0, -p[0] * scale]
  const atomMat = new THREE.MeshPhysicalMaterial({ color: '#5b6271', roughness: 0.28, metalness: 0.6, clearcoat: light ? 0 : 0.5, emissive: ACCENT, emissiveIntensity: 0.1 })
  const bondMat = glowMat('#62c4ff', 0.95)
  const plateMat = new THREE.MeshBasicMaterial({ color: '#2a6fae', transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
  const plateGeo = new THREE.CircleGeometry(6.6 * scale, 6).rotateX(-Math.PI / 2).rotateY(Math.PI / 6)
  for (let k = 0; k < 3; k++) {
    const L = layers[k]
    const bs = ballStick({ atoms: L.atoms.map(toWorld), bonds: L.bonds, atomR: 0.058, bondR: 0.017, atomMat, bondMat, seg: light ? 10 : 14 })
    bs.group.position.y = base + k * gap
    const plate = new THREE.Mesh(plateGeo, plateMat)
    plate.position.y = base + k * gap - 0.004
    group.add(bs.group, plate)
  }
  // the top sheet: its own materials (it glows when free) and instance matrices that can ripple
  const top = layers[3]
  const p0 = top.atoms.map(toWorld)
  const topAtom = atomMat.clone()
  const topBond = glowMat('#62c4ff', 0.95)
  const bsTop = ballStick({ atoms: p0, bonds: top.bonds, atomR: 0.058, bondR: 0.017, atomMat: topAtom, bondMat: topBond, seg: light ? 10 : 14 })
  const topPlateMat = plateMat.clone()
  const topPlate = new THREE.Mesh(plateGeo, topPlateMat)
  topPlate.position.y = -0.004
  const sheet = new THREE.Group()
  sheet.add(bsTop.group, topPlate)
  const topY = base + 3 * gap
  sheet.position.y = topY
  group.add(sheet)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const sc = new THREE.Vector3()
  const va = new THREE.Vector3()
  const vb = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const wave = (p, t, amp) => amp * (Math.sin(p[0] * 2.6 + t * 1.7) * 0.6 + Math.sin(p[2] * 2.1 - t * 1.3) * 0.4)
  const ripple = (t, amp) => {
    p0.forEach((p, i) => {
      m4.compose(va.set(p[0], wave(p, t, amp), p[2]), q.identity(), sc.setScalar(0.058))
      bsTop.atomMesh.setMatrixAt(i, m4)
    })
    top.bonds.forEach(([i, j], k) => {
      va.set(p0[i][0], wave(p0[i], t, amp), p0[i][2])
      vb.set(p0[j][0], wave(p0[j], t, amp), p0[j][2])
      dir.subVectors(vb, va)
      const l = dir.length()
      q.setFromUnitVectors(UP, dir.normalize())
      m4.compose(va.add(vb).multiplyScalar(0.5), q, sc.set(0.017, l, 0.017))
      bsTop.bondMesh.setMatrixAt(k, m4)
    })
    bsTop.atomMesh.instanceMatrix.needsUpdate = true
    bsTop.bondMesh.instanceMatrix.needsUpdate = true
  }

  // the sticky tape: an amber strip hovering over the stack, curled at its ends
  const tapeGeo = new THREE.PlaneGeometry(2.5, 0.6, 48, 1).rotateX(-Math.PI / 2)
  const tapeBase = tapeGeo.getAttribute('position').array.slice()
  const tapeMat = new THREE.MeshPhysicalMaterial({
    color: '#f6d27c', roughness: 0.18, transparent: true, opacity: 0.5, side: THREE.DoubleSide, clearcoat: light ? 0 : 1,
    depthWrite: false, emissive: '#ffcf70', emissiveIntensity: 0.18,
  })
  const tape = new THREE.Mesh(tapeGeo, tapeMat)
  tape.renderOrder = 6
  group.add(tape)
  const curl = k => {
    const a = tapeGeo.getAttribute('position')
    for (let i = 0; i < a.count; i++) {
      const x = tapeBase[i * 3]
      a.setY(i, k * 0.32 * Math.pow(Math.abs(x) / 1.25, 2.2))
    }
    a.needsUpdate = true
    tapeGeo.computeVertexNormals()
  }
  const idleY = topY + 1.0
  curl(1)
  tape.position.y = idleY

  let state = 'stacked'
  let t = 0
  let sheetY = topY
  let glow = 0
  let amp = 0
  let tapeCurl = 1
  let flash = 0
  const freeY = topY + 0.85
  return {
    group,
    get free() {
      return state === 'free'
    },
    use() {
      if (state === 'stacked') {
        state = 'peeling'
        t = 0
        return 'peel'
      }
      if (state === 'free') {
        state = 'returning'
        t = 0
        return 'back'
      }
      return false
    },
    update(dt, time) {
      t += dt
      let tapeY = tape.position.y
      let tapeTilt = 0
      if (state === 'peeling') {
        if (t < 0.9) {
          const u = easeInOut(t / 0.9)
          tapeY = lerp(idleY, topY + 0.075, u)
          tapeCurl = 1 - u
        } else if (t < 1.25) {
          tapeY = topY + 0.075
          tapeCurl = 0
          flash = Math.sin(((t - 0.9) / 0.35) * Math.PI)
        } else if (t < 2.8) {
          const u = easeInOut((t - 1.25) / 1.55)
          tapeY = topY + 0.075 + u * 0.85
          sheetY = topY + u * 0.85
          tapeTilt = Math.sin(u * Math.PI) * 0.1
          glow = u * 0.4
        } else if (t < 4.0) {
          const u = easeInOut((t - 2.8) / 1.2)
          if (t - dt < 2.8) onFree?.()
          tapeY = lerp(topY + 0.925, idleY + 0.45, u)
          tapeCurl = u
          sheetY = lerp(topY + 0.85, freeY, u)
          glow = 0.4 + 0.6 * u
          amp = u
        } else {
          state = 'free'
          tapeY = idleY + 0.45
        }
      } else if (state === 'returning') {
        const u = easeInOut(Math.min(1, t / 1.8))
        sheetY = lerp(freeY, topY, u)
        glow = 1 - u
        amp = 1 - u
        tapeY = lerp(idleY + 0.45, idleY, u)
        if (t >= 1.8) {
          state = 'stacked'
          sheet.rotation.y = 0
          ripple(0, 0)
        }
      } else if (state === 'free') {
        tapeY = idleY + 0.45 + Math.sin(time * 0.7) * 0.04
      } else {
        tapeY = idleY + Math.sin(time * 0.7) * 0.04
      }
      flash = Math.max(0, flash - dt * 0.5)
      tape.position.y = tapeY
      tape.rotation.z = tapeTilt
      curl(tapeCurl)
      const bob = state === 'free' ? Math.sin(time * 0.9) * 0.05 : 0
      sheet.position.y = sheetY + bob
      if (state === 'free' || state === 'returning' || (state === 'peeling' && t > 2.8)) {
        sheet.rotation.y += dt * 0.12 * amp
        ripple(time, 0.07 * amp)
      }
      topBond.emissiveIntensity = 0.95 + glow * 2.6 + flash
      topAtom.emissiveIntensity = 0.1 + glow * 0.9
      topAtom.emissive.set(glow > 0.05 ? '#bdeeff' : ACCENT)
      topPlateMat.opacity = 0.14 + glow * 0.3
      tapeMat.emissiveIntensity = 0.18 + flash * 0.8
    },
  }
}

// ---------------------------------------------------------------- physics: the Dirac cones
/** Graphene's π bands over the Brillouin zone (tight binding, Wallace 1947): E = ±t·√(3 + f(k)),
 *  the valence band below, the conduction band above, touching only at the six K points, where they
 *  are cones. pulse(): rings run out from the K points along the cones (the energy rises linearly). */
export function diracBands({ light }) {
  const group = new THREE.Group()
  group.add(plinth({ radius: 1.75, height: 0.45, light }))
  const kS = 0.56
  const eS = 0.3
  const KR = (4 * Math.PI) / (3 * SQ3) // |K| in units of 1/a, a = C–C distance
  const nK = light ? 30 : 54
  const CONE = 0.62 // how far each cone reaches past its K point
  const n = Math.ceil(((KR + CONE + 0.04) / KR) * nK)
  const ns = light ? 72 : 144
  const energy = (kx, ky) => Math.sqrt(Math.max(0, 3 + 2 * Math.cos(SQ3 * ky) + 4 * Math.cos((SQ3 / 2) * ky) * Math.cos(1.5 * kx)))
  const uniforms = { uTime: { value: 0 }, uPulse: { value: -1 } }
  const band = sign => {
    const pos = []
    const kk = []
    const idx = []
    for (let i = 0; i <= n; i++) {
      const r = (i * KR) / nK
      for (let j = 0; j <= ns; j++) {
        const phi = (j / ns) * TAU
        const kx = r * Math.cos(phi)
        const ky = r * Math.sin(phi)
        const e = sign * energy(kx, ky)
        pos.push(kx * kS, e * eS, ky * kS)
        kk.push(kx, ky, e)
      }
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < ns; j++) {
        const a = i * (ns + 1) + j
        const b = a + ns + 1
        idx.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aK', new THREE.Float32BufferAttribute(kk, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        ...uniforms,
        uLow: { value: new THREE.Color(sign > 0 ? '#ff9a3c' : '#2fd0ff') },
        uHigh: { value: new THREE.Color(sign > 0 ? '#ffe7a6' : '#2a3fb8') },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aK;
        varying vec3 vK; varying vec3 vN; varying vec3 vV;
        void main() {
          vK = aK;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vV = normalize(cameraPosition - w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uLow; uniform vec3 uHigh; uniform float uTime; uniform float uPulse;
        varying vec3 vK; varying vec3 vN; varying vec3 vV;
        const float KR = ${KR.toFixed(6)};
        const float MR = ${(KR * Math.sqrt(3) / 2).toFixed(6)};
        const float CONE = ${CONE.toFixed(3)};
        float kdist(vec2 k) {
          float d = 1e9;
          for (int i = 0; i < 6; i++) {
            float a = 0.5235988 + float(i) * 1.0471976;
            d = min(d, length(k - KR * vec2(cos(a), sin(a))));
          }
          return d;
        }
        void main() {
          // the first Brillouin zone (a hexagon with the K points at its corners) and a whole cone round each corner
          vec2 k = vK.xy;
          float hx = max(abs(k.x), max(abs(dot(k, vec2(0.5, 0.8660254))), abs(dot(k, vec2(-0.5, 0.8660254)))));
          float kd0 = kdist(k);
          if (hx > MR && kd0 > CONE) discard;
          float e = abs(vK.z) / 3.0;
          vec3 base = mix(uLow, uHigh, pow(e, 0.75));
          vec3 N = normalize(vN);
          if (!gl_FrontFacing) N = -N;
          vec3 V = normalize(vV);
          float diff = 0.4 + 0.6 * abs(dot(N, normalize(vec3(0.3, 1.0, 0.6))));
          float fres = pow(1.0 - abs(dot(N, V)), 3.0);
          // lines of equal energy (every t/4): circles round the K points, triangles further out
          float ce = abs(vK.z) * 4.0;
          float w = fwidth(ce);
          float lines = 1.0 - smoothstep(0.0, w * 1.6, abs(fract(ce + 0.5) - 0.5));
          float kd = kdist(vK.xy);
          float tip = exp(-kd * kd * 70.0);
          float ring = uPulse >= 0.0 ? exp(-pow((kd - uPulse * 0.75) * 9.0, 2.0)) * exp(-uPulse * 0.5) : 0.0;
          vec3 col = base * (diff * 0.5 + lines * 0.55 + fres * 0.5) + vec3(1.0) * (tip * 1.6 + ring * 2.2);
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    })
    return new THREE.Mesh(g, mat)
  }
  const tilt = new THREE.Group()
  tilt.position.y = 1.45
  tilt.rotation.z = -0.32 // the top leans toward the walkway (+x)
  group.add(tilt)
  const model = new THREE.Group()
  tilt.add(model)
  model.add(band(1), band(-1))
  // the Brillouin zone's edge at E = 0, through the six K points, and the points themselves
  const corner = i => new THREE.Vector3(Math.cos(Math.PI / 6 + (i * Math.PI) / 3) * KR * kS, 0, Math.sin(Math.PI / 6 + (i * Math.PI) / 3) * KR * kS)
  const edgeMat = glowMat('#ffffff', 1.4)
  for (let i = 0; i < 6; i++) {
    const a = corner(i)
    const b = corner((i + 1) % 6)
    const d = b.clone().sub(a)
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, d.length(), 6), edgeMat)
    stick.position.copy(a).addScaledVector(d, 0.5)
    stick.quaternion.setFromUnitVectors(UP, d.normalize())
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), glowMat('#ffffff', 3))
    dot.position.copy(a)
    model.add(stick, dot)
  }
  const kLabel = makeText('K', { size: 0.16, color: '#ffffff' })
  kLabel.position.copy(corner(0)).add(new THREE.Vector3(0.12, 0.12, 0.12))
  model.add(kLabel)
  // an energy axis beside it
  const axis = new THREE.Group()
  axis.position.set(0, 0, -1.95)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.9, 8), glowMat('#cfe6ff', 1.2))
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 12), glowMat('#cfe6ff', 1.2))
  head.position.y = 1.0
  const eLabel = makeText('E', { size: 0.16, color: '#cfe6ff' })
  eLabel.position.set(0, 1.18, 0)
  const zero = makeText('0', { size: 0.1, color: '#cfe6ff' })
  zero.position.set(-0.1, 0, 0)
  axis.add(shaft, head, eLabel, zero)
  tilt.add(axis)
  return {
    group,
    update(dt, t) {
      model.rotation.y += dt * 0.09
      kLabel.rotation.y = -model.rotation.y
      uniforms.uTime.value = t
      if (uniforms.uPulse.value >= 0) {
        uniforms.uPulse.value += dt
        if (uniforms.uPulse.value > 7) uniforms.uPulse.value = -1
      }
    },
    pulse() {
      uniforms.uPulse.value = 0
    },
  }
}

// ---------------------------------------------------------------- chemistry: sp² and π
/** One hexagon of graphene with the first atoms of its neighbours: σ bonds in the plane (120°) and a
 *  p orbital standing across it on every atom. show(): the p orbitals merge into the π clouds above
 *  and below the sheet, then part again. */
export function piOrbitals({ light }) {
  const group = new THREE.Group()
  group.add(plinth({ radius: 1.3, height: 0.6, light }))
  const s = 0.5
  const ringR = 1.42 * s
  const model = new THREE.Group()
  model.position.y = 1.5
  model.rotation.x = 0.32
  const turn = new THREE.Group()
  turn.add(model)
  group.add(turn)
  const inner = []
  const outer = []
  for (let k = 0; k < 6; k++) {
    const a = Math.PI / 6 + (k * Math.PI) / 3
    inner.push([Math.cos(a) * ringR, 0, Math.sin(a) * ringR])
    outer.push([Math.cos(a) * ringR * 2, 0, Math.sin(a) * ringR * 2])
  }
  const ringBonds = inner.map((_, k) => [k, (k + 1) % 6])
  const atomMat = new THREE.MeshPhysicalMaterial({ color: '#5d6472', roughness: 0.3, metalness: 0.5, clearcoat: light ? 0 : 0.6, emissive: ACCENT, emissiveIntensity: 0.12 })
  const bondMat = glowMat('#8fdcff', 1.3)
  const bs = ballStick({ atoms: [...inner, ...outer], bonds: [...ringBonds, ...inner.map((_, k) => [k, k + 6])], atomR: 0.15, bondR: 0.04, atomMat, bondMat, seg: light ? 12 : 22 })
  model.add(bs.group)
  // p orbitals: a teardrop lobe up (one phase, blue) and down (the other, orange) on each ring atom
  const prof = []
  for (let i = 0; i <= 24; i++) {
    const u = i / 24
    prof.push(new THREE.Vector2(0.2 * Math.pow(Math.sin(Math.PI * u), 0.8) * Math.sqrt(0.3 + 0.7 * u), u * 0.62))
  }
  const lobeGeo = new THREE.LatheGeometry(prof, light ? 16 : 28)
  const lobeMat = c => new THREE.MeshPhysicalMaterial({ color: c, transparent: true, opacity: 0.4, roughness: 0.2, depthWrite: false, emissive: c, emissiveIntensity: 0.35, side: THREE.DoubleSide })
  const upMat = lobeMat('#4aa8ff')
  const downMat = lobeMat('#ff8a5c')
  const lobes = []
  for (const p of inner) {
    for (const [mat, sgn] of [[upMat, 1], [downMat, -1]]) {
      const lobe = new THREE.Mesh(lobeGeo, mat)
      lobe.position.set(p[0], 0, p[2])
      lobe.scale.y = sgn
      lobe.renderOrder = 3
      model.add(lobe)
      lobes.push(lobe)
    }
  }
  // the π clouds: rings above and below
  const cloudGeo = new THREE.TorusGeometry(ringR, 0.2, 20, 90).rotateX(Math.PI / 2)
  const cloudUp = new THREE.Mesh(cloudGeo, lobeMat('#4aa8ff'))
  const cloudDown = new THREE.Mesh(cloudGeo, lobeMat('#ff8a5c'))
  cloudUp.position.y = 0.3
  cloudDown.position.y = -0.3
  cloudUp.scale.y = cloudDown.scale.y = 0.55
  cloudUp.material.opacity = cloudDown.material.opacity = 0
  cloudUp.renderOrder = cloudDown.renderOrder = 3
  model.add(cloudUp, cloudDown)
  // the angle between two bonds at one atom
  const at = new THREE.Vector3(...inner[0])
  const d1 = new THREE.Vector3(...inner[1]).sub(at).normalize()
  const d2 = new THREE.Vector3(...inner[5]).sub(at).normalize()
  const arcPts = []
  for (let i = 0; i <= 20; i++) arcPts.push(at.clone().addScaledVector(d1.clone().lerp(d2, i / 20).normalize(), 0.3))
  const arc = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arcPts), 30, 0.012, 6), glowMat(GOLD, 2.4))
  const ang = makeText('120°', { size: 0.11, color: GOLD })
  ang.position.copy(at).addScaledVector(d1.clone().add(d2).normalize(), 0.5).add(new THREE.Vector3(0, 0.06, 0))
  ang.rotation.x = -Math.PI / 2
  model.add(arc, ang)
  let merge = 0
  let hold = 0
  return {
    group,
    update(dt) {
      turn.rotation.y += dt * 0.12
      hold = Math.max(0, hold - dt)
      merge += ((hold > 0 ? 1 : 0) - merge) * Math.min(1, dt * 1.6)
      const k = smooth(clamp(merge, 0, 1))
      upMat.opacity = downMat.opacity = 0.4 * (1 - k) + 0.05
      for (const l of lobes) l.scale.x = l.scale.z = 1 + k * 0.4
      cloudUp.material.opacity = cloudDown.material.opacity = 0.42 * k
    },
    show(seconds = 9) {
      hold = seconds
    },
  }
}

// ---------------------------------------------------------------- electronics: the transistor
/** A graphene field-effect transistor on a silicon chip: source and drain in gold, the honeycomb
 *  channel between them, a gate across it. use() sweeps the gate voltage: plain graphene's current
 *  dips but never stops (no band gap); the next sweep is bilayer graphene in an electric field,
 *  whose gap lets the current stop. */
export function grapheneTransistor({ light, words }) {
  const group = new THREE.Group()
  const stone = new THREE.MeshPhysicalMaterial({ color: '#121a3c', roughness: 0.22, clearcoat: light ? 0 : 0.8 })
  const table = new THREE.Mesh(new RoundedBoxGeometry(2.4, 0.85, 1.4, 3, 0.05), stone)
  table.position.y = 0.425
  const tableEdge = new THREE.Mesh(new RoundedBoxGeometry(2.42, 0.02, 1.42, 2, 0.01), glowMat(ACCENT, 2))
  tableEdge.position.y = 0.8
  group.add(table, tableEdge)
  const chip = new THREE.Group()
  chip.position.set(0, 0.95, -0.05)
  chip.rotation.x = 0.42
  group.add(chip)
  const wedge = new THREE.Mesh(new RoundedBoxGeometry(2.05, 0.3, 0.9, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#1b2246', roughness: 0.5, metalness: 0.5 }))
  wedge.position.set(0, 0.86, -0.2)
  wedge.rotation.x = 0.42
  group.add(wedge)
  const sub = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.14, 1.1, 2, 0.02), new THREE.MeshPhysicalMaterial({ color: '#2a2142', roughness: 0.25, metalness: 0.3, clearcoat: light ? 0 : 1 }))
  sub.position.y = 0.07
  const oxide = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.02, 1.06), new THREE.MeshPhysicalMaterial({ color: '#6a55b5', roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.75, clearcoat: light ? 0 : 1 }))
  oxide.position.y = 0.15
  chip.add(sub, oxide)
  const gold = new THREE.MeshStandardMaterial({ color: '#e7b84f', roughness: 0.22, metalness: 1 })
  for (const x of [-0.75, 0.75]) {
    const pad = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.1, 0.9, 2, 0.02), gold)
    pad.position.set(x, 0.21, 0)
    chip.add(pad)
  }
  // the channel: graphene, drawn with the honeycomb shader
  const chanU = { uTime: { value: 0 }, uFlow: { value: 1 } }
  const chanMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: chanU,
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uFlow;
      varying vec2 vP;
      ${HONEY_GLSL}
      void main() {
        vec2 ink = honeyInk(vP, 0.032, 0.06, 0.16);
        float flow = 0.6 + 0.4 * sin(vP.x * 18.0 - uTime * 6.0 * uFlow);
        vec3 c = vec3(0.35, 0.8, 1.0) * (ink.x * 0.9 + ink.y * 1.4) * (0.5 + 0.8 * uFlow * flow);
        float a = clamp(ink.x + ink.y + 0.12, 0.0, 1.0);
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }`,
  })
  const channel = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.62), chanMat)
  channel.rotation.x = -Math.PI / 2
  channel.position.y = 0.165
  chip.add(channel)
  // the gate: a thin insulating layer and a gold bar across the middle
  const dielectric = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.82), new THREE.MeshPhysicalMaterial({ color: '#dfe9ff', roughness: 0.1, transparent: true, opacity: 0.35, depthWrite: false }))
  dielectric.position.y = 0.19
  const gate = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.09, 0.9, 2, 0.02), gold)
  gate.position.y = 0.25
  chip.add(dielectric, gate)
  const W = words()
  for (const [text, x, z] of [[W.source, -0.75, 0.62], [W.drain, 0.75, 0.62], [W.gate, 0, 0.62]]) {
    const t = makeText(text, { size: 0.075, color: '#cfd9ff', font: 'medium' })
    t.position.set(x, 0.155, z)
    t.rotation.x = -Math.PI / 2
    chip.add(t)
  }
  // electrons running from source to drain
  const count = light ? 36 : 64
  const eMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 10, 8), glowMat('#c9f3ff', 3), count)
  const rand = rng(11)
  const lanes = Array.from({ length: count }, () => ({ z: (rand() - 0.5) * 0.5, ph: rand(), sp: 0.8 + rand() * 0.4, y: 0.2 + rand() * 0.012 }))
  chip.add(eMesh)
  // the current meter: a glass tube filling with light
  const meter = new THREE.Group()
  meter.position.set(1.32, 0.85, -0.35)
  group.add(meter)
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.95, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: '#cfe6ff', transparent: true, opacity: 0.18, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false }))
  tube.position.y = 0.5
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 20), glowMat('#7fe0ff', 2.4))
  const capB = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24), gold)
  capB.position.y = 0.025
  const capT = capB.clone()
  capT.position.y = 0.975
  const iLabel = makeText('I', { size: 0.14, color: '#7fe0ff' })
  iLabel.position.set(0, 1.12, 0)
  const offMark = makeText('0', { size: 0.07, color: '#cfd9ff' })
  offMark.position.set(-0.17, 0.05, 0)
  meter.add(tube, fill, capB, capT, iLabel, offMark)
  // the gate knob on the front
  const knob = new THREE.Group()
  knob.position.set(0, 0.55, 0.71)
  group.add(knob)
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.06, 32), new THREE.MeshStandardMaterial({ color: '#2b3256', metalness: 0.8, roughness: 0.35 }))
  dial.rotation.x = Math.PI / 2
  const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.02), glowMat(GOLD, 2))
  pointer.position.set(0, 0.05, 0.04)
  knob.add(dial, pointer)
  const vgLabel = makeText(W.gateVoltage, { size: 0.06, color: '#cfd9ff' })
  vgLabel.position.set(0, 0.36, 0.712)
  group.add(vgLabel)
  const modeText = makeText(W.modes[0], { size: 0.075, color: GOLD, font: 'medium' })
  modeText.position.set(0, 1.78, -0.35)
  group.add(modeText)

  let mode = 0 // 0 plain graphene, 1 bilayer in a field (a gap)
  let vg = 1
  let sweep = -1
  let onEnd = null
  const current = v => (mode === 0 ? Math.sqrt(0.2 * 0.2 + v * v) / Math.sqrt(0.2 * 0.2 + 1) : clamp((Math.abs(v) - 0.32) / 0.68, 0, 1))
  let I = current(vg)
  const m4 = new THREE.Matrix4()
  return {
    group,
    get busy() {
      return sweep >= 0
    },
    get mode() {
      return mode
    },
    use(done) {
      if (sweep >= 0) return false
      sweep = 0
      onEnd = done
      modeText.text = W.modes[mode]
      modeText.sync()
      return true
    },
    update(dt, t) {
      if (sweep >= 0) {
        sweep += dt
        // +1 down to 0, wait there, on to -1, back to +1
        if (sweep < 2.2) vg = 1 - easeInOut(sweep / 2.2)
        else if (sweep < 4.2) vg = 0
        else if (sweep < 5.6) vg = -easeInOut((sweep - 4.2) / 1.4)
        else if (sweep < 7.2) vg = -1 + 2 * easeInOut((sweep - 5.6) / 1.6)
        else {
          sweep = -1
          vg = 1
          const finished = mode
          mode = 1 - mode
          onEnd?.(finished)
        }
      }
      I += (current(vg) - I) * Math.min(1, dt * 6)
      fill.scale.y = Math.max(0.001, I * 0.9)
      fill.position.y = 0.05 + (I * 0.9) / 2
      knob.rotation.z = -vg * 2.2
      chanU.uTime.value = t
      chanU.uFlow.value = I
      const shown = Math.round(count * I)
      lanes.forEach((l, i) => {
        l.ph = (l.ph + dt * l.sp * (0.25 + 0.75 * I) * 0.55) % 1
        const visible = i < shown
        const x = -0.55 + l.ph * 1.1
        m4.makeScale(visible ? 1 : 0.0001, visible ? 1 : 0.0001, visible ? 1 : 0.0001).setPosition(x, l.y, l.z)
        eMesh.setMatrixAt(i, m4)
      })
      eMesh.instanceMatrix.needsUpdate = true
    },
  }
}

// ---------------------------------------------------------------- materials: the hammock and the cat
function catTexture() {
  return paint(256, 256, (g, w, h) => {
    g.fillStyle = '#d98a3f'
    g.fillRect(0, 0, w, h)
    // the belly (round the middle of u) is cream
    const belly = g.createLinearGradient(0, 0, w, 0)
    belly.addColorStop(0.28, 'rgba(244,214,170,0)')
    belly.addColorStop(0.42, 'rgba(244,214,170,1)')
    belly.addColorStop(0.58, 'rgba(244,214,170,1)')
    belly.addColorStop(0.72, 'rgba(244,214,170,0)')
    g.fillStyle = belly
    g.fillRect(0, 0, w, h)
    // tabby stripes across the back
    const r = rng(5)
    for (let y = 6; y < h; y += 15 + r() * 8) {
      g.strokeStyle = `rgba(150,78,26,${0.55 + r() * 0.3})`
      g.lineWidth = 4 + r() * 4
      for (const side of [0, w]) {
        g.beginPath()
        g.moveTo(side - w * 0.32, y + r() * 4)
        g.bezierCurveTo(side - w * 0.12, y - 5, side + w * 0.12, y + 6, side + w * 0.32, y + r() * 4)
        g.stroke()
      }
    }
  }, { repeat: [1, 1] })
}

/** A 1 m² hammock of graphene (the Nobel committee's example) with a sleeping 4 kg cat in it.
 *  nudge(): the cat flicks an ear and stretches a little, the net glows. */
export function hammockCat({ light, words }) {
  const group = new THREE.Group()
  // a round stage 0.5 m high, so the cat sleeps near eye level
  const top = 0.5
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.46, top - 0.06, 64), new THREE.MeshPhysicalMaterial({ color: '#141c40', roughness: 0.22, clearcoat: light ? 0 : 0.8 }))
  dais.position.y = 0.06 + (top - 0.06) / 2
  const daisFoot = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.52, 0.06, 64), new THREE.MeshStandardMaterial({ color: '#3a4470', roughness: 0.42, metalness: 0.85 }))
  daisFoot.position.y = 0.03
  const daisRing = new THREE.Mesh(new THREE.TorusGeometry(1.405, 0.015, 6, 120), glowMat(ACCENT, 2))
  daisRing.rotation.x = Math.PI / 2
  daisRing.position.y = top - 0.04
  group.add(dais, daisFoot, daisRing)
  const metal = new THREE.MeshStandardMaterial({ color: '#2b3358', roughness: 0.35, metalness: 0.85 })
  const postH = 1.32
  for (const x of [-0.98, 0.98]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, postH, 16), metal)
    post.position.set(x, top + postH / 2, 0)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), glowMat(ACCENT, 1.8))
    cap.position.set(x, top + postH, 0)
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.7), metal)
    foot.position.set(x, top + 0.02, 0)
    group.add(post, cap, foot)
  }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.035, 0.05), metal)
  rail.position.set(0, top + 0.03, 0)
  group.add(rail)
  // the net: 1 m by 1 m, sagging, hung from two spreader bars
  const sway = new THREE.Group()
  const hangY = top + postH - 0.02
  sway.position.y = hangY
  group.add(sway)
  const net = new THREE.PlaneGeometry(1, 1, 36, 36).rotateX(-Math.PI / 2)
  const np = net.getAttribute('position')
  const barY = -0.3
  const sagAt = (x, z) => barY - 0.22 * (1 - 4 * x * x) - 0.045 * (1 - 4 * z * z) * (1 - 4 * x * x) - 0.05 * Math.exp(-(x * x + z * z) / 0.03)
  for (let i = 0; i < np.count; i++) np.setY(i, sagAt(np.getX(i), np.getZ(i)))
  net.computeVertexNormals()
  const netU = { uTime: { value: 0 }, uGlow: { value: 0 } }
  const netMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: netU,
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uGlow;
      varying vec2 vP;
      ${HONEY_GLSL}
      void main() {
        vec2 ink = honeyInk(vP, 0.024, 0.07, 0.15);
        float edge = smoothstep(0.5, 0.47, max(abs(vP.x), abs(vP.y)));
        vec3 c = vec3(0.45, 0.85, 1.0) * (ink.x * 1.6 + ink.y * 2.0) * (1.0 + uGlow * 1.5);
        float a = clamp((ink.x + ink.y) * 0.95 + 0.07, 0.0, 1.0) * edge;
        gl_FragColor = vec4(c * (0.8 + 0.2 * sin(uTime * 1.3 + vP.x * 6.0)), a);
        #include <colorspace_fragment>
      }`,
  })
  const netMesh = new THREE.Mesh(net, netMat)
  netMesh.renderOrder = 5
  sway.add(netMesh)
  for (const x of [-0.5, 0.5]) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.08, 12), metal)
    bar.rotation.x = Math.PI / 2
    bar.position.set(x, barY, 0)
    sway.add(bar)
    // ropes from the bar's ends to the top of the post
    for (const z of [-0.54, 0.54]) {
      const a = new THREE.Vector3(x, barY, z)
      const b = new THREE.Vector3(Math.sign(x) * 0.98, 0.0, 0)
      const d = b.clone().sub(a)
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, d.length(), 6), new THREE.MeshStandardMaterial({ color: '#cfd6ea', roughness: 0.6 }))
      rope.position.copy(a).addScaledVector(d, 0.5)
      rope.quaternion.setFromUnitVectors(UP, d.normalize())
      sway.add(rope)
    }
  }
  // the cat, curled up asleep in the middle of the net (a ginger tabby, 4 kg)
  const cat = new THREE.Group()
  cat.position.set(0, sagAt(0, 0) + 0.005, 0)
  cat.rotation.y = Math.PI
  sway.add(cat)
  const fur = new THREE.MeshPhysicalMaterial({ map: catTexture(), roughness: 0.78, sheen: light ? 0 : 1, sheenColor: new THREE.Color('#ffd8a8'), sheenRoughness: 0.5 })
  const furPlain = new THREE.MeshPhysicalMaterial({ color: '#d98a3f', roughness: 0.78, sheen: light ? 0 : 1, sheenColor: new THREE.Color('#ffd8a8'), sheenRoughness: 0.5 })
  const cream = new THREE.MeshPhysicalMaterial({ color: '#f4d9b0', roughness: 0.8, sheen: light ? 0 : 0.8, sheenColor: new THREE.Color('#fff2dc') })
  const pink = new THREE.MeshStandardMaterial({ color: '#e7958f', roughness: 0.6 })
  const darkM = new THREE.MeshStandardMaterial({ color: '#2a1a12', roughness: 0.5 })
  const ring = (a0, a1, r, y, steps = 16) => {
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r))
    }
    return pts
  }
  const D = Math.PI / 180
  // the body: a thick curl from the haunch (back) round to the chest, fuller at the haunch
  const bodyPts = ring(205 * D, -25 * D, 0.11, 0.085, 20)
  const body = new THREE.Mesh(taperedTube(bodyPts, 0.1, 0.082, { radial: light ? 18 : 28, segments: light ? 30 : 48, flare: u => 1 + 0.12 * Math.sin(u * Math.PI) }), fur)
  body.scale.y = 0.95
  cat.add(body)
  const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 18), fur)
  haunch.position.set(Math.cos(205 * D) * 0.11, 0.075, Math.sin(205 * D) * 0.11)
  haunch.scale.set(1.05, 0.85, 1.1)
  cat.add(haunch)
  // the head rests where the curl closes, on its front paws
  const headG = new THREE.Group()
  headG.position.set(Math.cos(-90 * D) * 0.135, 0.12, Math.sin(-90 * D) * 0.135)
  headG.rotation.y = Math.PI / 2 - 0.25
  cat.add(headG)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 28, 20), furPlain)
  head.scale.set(1.05, 0.9, 1.0)
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.034, 18, 14), cream)
  muzzle.position.set(0.05, -0.016, 0)
  muzzle.scale.set(0.8, 0.7, 1.15)
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), pink)
  nose.position.set(0.078, -0.004, 0)
  headG.add(head, muzzle, nose)
  for (const zs of [-1, 1]) {
    // ears: rounded cones with pink insides
    const ear = new THREE.Group()
    ear.position.set(-0.005, 0.05, zs * 0.034)
    ear.rotation.set(zs * 0.35, 0, -0.15)
    const outerEar = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.05, 16), furPlain)
    outerEar.position.y = 0.02
    const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.034, 12), pink)
    innerEar.position.set(0.008, 0.016, 0)
    ear.add(outerEar, innerEar)
    headG.add(ear)
    // closed eyes: little arcs
    const lid = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0025, 6, 12, Math.PI), darkM)
    lid.position.set(0.055, 0.016, zs * 0.026)
    lid.rotation.set(0, Math.PI / 2 + zs * 0.35, Math.PI)
    headG.add(lid)
    // whiskers
    const pts = []
    for (let k = 0; k < 3; k++) {
      const y = -0.014 + k * 0.008
      pts.push(new THREE.Vector3(0.07, y, zs * 0.02), new THREE.Vector3(0.1, y - 0.01 + k * 0.006, zs * (0.085 + k * 0.006)))
    }
    headG.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#ffffff' })))
    // front paws under the chin
    const paw = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.05, 6, 12), cream)
    paw.rotation.z = Math.PI / 2
    paw.position.set(0.035, -0.06, zs * 0.028)
    headG.add(paw)
  }
  const ears = headG.children.filter(c => c.isGroup)
  // the tail wraps round the outside of the curl
  const tailPts = ring(205 * D, 205 * D - 250 * D, 0.2, 0.035, 26).map((p, i) => p.setY(0.035 + Math.sin(i / 26 * Math.PI) * 0.01))
  const tail = new THREE.Mesh(taperedTube(tailPts, 0.03, 0.015, { radial: 14, segments: 40 }), fur)
  cat.add(tail)
  cat.traverse(o => o.isMesh && (o.castShadow = true))
  // its label: the numbers of the example
  const label = makeText('1 m²  ·  0,77 mg', { size: 0.1, color: '#cfe6ff' })
  label.position.set(0, top + 0.006, 0.95)
  label.rotation.x = -Math.PI / 2
  const catLabel = makeText(words().catLabel, { size: 0.085, color: GOLD })
  catLabel.position.set(0, top + 0.006, 1.13)
  catLabel.rotation.x = -Math.PI / 2
  group.add(label, catLabel)
  let twitch = 0
  let glowT = 0
  return {
    group,
    update(dt, t) {
      sway.rotation.x = Math.sin(t * 0.8) * 0.035
      const breath = Math.sin(t * 1.9)
      body.scale.y = 0.95 + breath * 0.02
      haunch.scale.y = 0.85 + breath * 0.02
      headG.position.y = 0.12 + breath * 0.002
      twitch = Math.max(0, twitch - dt)
      const tw = twitch > 0 ? Math.sin(twitch * 30) * 0.3 * Math.min(1, twitch) : 0
      if (ears[0]) ears[0].rotation.x = -0.35 + tw
      tail.rotation.y = twitch > 0 ? Math.sin(twitch * 6) * 0.06 : 0
      glowT = Math.max(0, glowT - dt * 0.3)
      netU.uGlow.value = glowT
      netU.uTime.value = t
    },
    nudge() {
      twitch = 1.6
      glowT = 1
    },
  }
}

// ---------------------------------------------------------------- frontier: the moiré
/** Two graphene sheets, one over the other, the top one twisted by θ: the moiré appears, with a period
 *  a / (2 sin(θ/2)) (a = 0.246 nm), 52 lattice constants at the magic angle of 1.1°. The bright spots
 *  are where atoms sit on atoms (AA stacking), where the electrons gather at the magic angle. */
export const MOIRE_ANGLES = [0, 10, 5, 3, 2, 1.1]

export function moireDisc({ light, radius = 1.7 }) {
  const group = new THREE.Group()
  const bond = 0.0155 // drawn: a = 2.7 cm, the 1.1° moiré about 1.4 m across
  const a = bond * SQ3
  const G = [[1, -1 / SQ3], [0, 2 / SQ3], [-1, -1 / SQ3]].map(([x, y]) => new THREE.Vector2(x, y).multiplyScalar((2 * Math.PI) / a))
  const uniforms = {
    uTheta: { value: 0 },
    uBond: { value: bond },
    uR: { value: radius },
    uMagic: { value: 0 },
    uTime: { value: 0 },
    uG0: { value: G[0] },
    uG1: { value: G[1] },
    uG2: { value: G[2] },
  }
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTheta; uniform float uBond; uniform float uR; uniform float uMagic; uniform float uTime;
      uniform vec2 uG0; uniform vec2 uG1; uniform vec2 uG2;
      varying vec2 vP;
      ${HONEY_GLSL}
      void main() {
        float r = length(vP);
        float c = cos(uTheta);
        float s = sin(uTheta);
        vec2 p2 = mat2(c, -s, s, c) * vP; // where this point falls in the top sheet's own frame
        vec2 A = honeyInk(vP, uBond, 0.075, 0.17);
        vec2 B = honeyInk(p2, uBond, 0.075, 0.17);
        float ia = max(A.x, A.y);
        float ib = max(B.x, B.y);
        // stacking registry: 1 where atoms sit on atoms (AA), -1/2 in the AB and BA regions
        vec2 u = vP - p2;
        float g = (cos(dot(uG0, u)) + cos(dot(uG1, u)) + cos(dot(uG2, u))) / 3.0;
        float aa = smoothstep(0.35, 1.0, g);
        float sAA = clamp((g + 0.5) / 1.5, 0.0, 1.0);
        float k = smoothstep(0.05, 0.6, uTheta * 57.29578);
        vec3 bg = vec3(0.012, 0.018, 0.05);
        vec3 col = bg + vec3(0.2, 0.62, 1.0) * ia * 0.22 + vec3(1.0, 0.68, 0.28) * ib * 0.22;
        float spot = sAA * sAA * sAA;
        col += k * (vec3(1.0, 0.82, 0.5) * spot * (0.42 + 0.55 * uMagic * (0.85 + 0.15 * sin(uTime * 3.0))) + vec3(0.1, 0.25, 0.6) * (1.0 - sAA) * 0.06);
        col += (1.0 - k) * vec3(0.05, 0.07, 0.12);
        float edge = smoothstep(uR, uR - 0.02, r);
        gl_FragColor = vec4(col * edge, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const disc = new THREE.Mesh(new THREE.CircleGeometry(radius, 128), mat)
  const tilt = new THREE.Group()
  tilt.position.y = 2.05
  tilt.rotation.x = -0.72
  tilt.add(disc)
  group.add(tilt)
  // the two rims: the lower sheet's fixed (blue), the upper sheet's turning (gold, with a handle)
  const rimLow = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.04, 0.03, 10, 160), glowMat('#5fc6ff', 1.1))
  const rimTop = new THREE.Group()
  const rimTopRing = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.1, 0.028, 10, 160), glowMat(GOLD, 1.1))
  rimTopRing.position.z = 0.03
  rimTop.add(rimTopRing)
  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 16), glowMat(GOLD, 2.6))
  handle.position.set(0, radius + 0.1, 0.05)
  rimTop.add(handle)
  for (let i = 0; i < 36; i++) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, i % 9 === 0 ? 0.1 : 0.05, 0.01), glowMat('#5fc6ff', 1.4))
    const ang = (i / 36) * TAU
    tick.position.set(Math.sin(ang) * (radius + 0.13), Math.cos(ang) * (radius + 0.13), 0)
    tick.rotation.z = -ang
    tilt.add(tick)
  }
  tilt.add(rimLow, rimTop)
  // its stand
  const metal = new THREE.MeshStandardMaterial({ color: '#2b3358', roughness: 0.35, metalness: 0.85 })
  const back = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.16, radius + 0.16, 0.06, 96), new THREE.MeshPhysicalMaterial({ color: '#0e1430', roughness: 0.3, metalness: 0.4 }))
  back.rotation.x = Math.PI / 2
  back.position.z = -0.05
  tilt.add(back)
  for (const x of [-0.5, 0.5]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.6, 16), metal)
    leg.position.set(x, 0.8, -0.55)
    leg.rotation.x = 0.25
    group.add(leg)
  }
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.08, 48), metal)
  foot.position.set(0, 0.04, -0.4)
  group.add(foot)
  let theta = 0
  let from = 0
  let to = 0
  let tt = 1
  let step = 0
  return {
    group,
    get angle() {
      return MOIRE_ANGLES[step]
    },
    get busy() {
      return tt < 1
    },
    twist() {
      if (tt < 1) return null
      step = (step + 1) % MOIRE_ANGLES.length
      from = theta
      to = MOIRE_ANGLES[step]
      tt = 0
      return to
    },
    update(dt, t) {
      if (tt < 1) {
        tt = Math.min(1, tt + dt / 1.8)
        theta = from + (to - from) * easeInOut(tt)
      }
      uniforms.uTheta.value = (theta * Math.PI) / 180
      const magic = Math.exp(-Math.pow((theta - 1.1) / 0.25, 2))
      uniforms.uMagic.value += (magic - uniforms.uMagic.value) * Math.min(1, dt * 3)
      uniforms.uTime.value = t
      rimTop.rotation.z = (theta * Math.PI) / 180 // the true turn: a tiny twist, a huge pattern
    },
  }
}
