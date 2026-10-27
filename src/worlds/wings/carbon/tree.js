// The big tree of the life wing, grown in code: a flared trunk, limbs that fork three times (radius by
// Leonardo's rule, bending toward the light), merged into one mesh; thousands of leaves as one instanced
// mesh that sways in the wind; and the air it breathes: CO2 molecules drifting into the crown and O2
// drifting out while the sun shines (at night only a little CO2 comes out: respiration).
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { taperedTube, paint } from './kit.js'
import { rng } from './structures.js'

function barkTexture() {
  return paint(256, 512, (g, w, h) => {
    g.fillStyle = '#6b5442'
    g.fillRect(0, 0, w, h)
    const r = rng(9)
    for (let i = 0; i < 260; i++) {
      const x = r() * w
      const y = r() * h
      const len = 30 + r() * 120
      g.strokeStyle = r() < 0.5 ? `rgba(40,28,20,${0.25 + r() * 0.4})` : `rgba(150,120,95,${0.15 + r() * 0.25})`
      g.lineWidth = 1 + r() * 4
      g.beginPath()
      g.moveTo(x, y)
      g.bezierCurveTo(x + (r() - 0.5) * 10, y + len * 0.3, x + (r() - 0.5) * 10, y + len * 0.7, x + (r() - 0.5) * 8, y + len)
      g.stroke()
    }
  }, { repeat: [2, 3] })
}

function leafTexture() {
  return paint(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.translate(w / 2, h / 2)
    g.rotate(-Math.PI / 4)
    const grad = g.createLinearGradient(-50, 0, 50, 0)
    grad.addColorStop(0, '#5b9a3c')
    grad.addColorStop(0.5, '#86c25a')
    grad.addColorStop(1, '#4e8a34')
    g.fillStyle = grad
    g.beginPath()
    g.moveTo(-58, 0)
    g.bezierCurveTo(-30, -30, 30, -28, 58, 0)
    g.bezierCurveTo(30, 28, -30, 30, -58, 0)
    g.fill()
    g.strokeStyle = 'rgba(230,255,200,0.55)'
    g.lineWidth = 2.2
    g.beginPath()
    g.moveTo(-56, 0)
    g.lineTo(56, 0)
    g.stroke()
    g.lineWidth = 1
    for (let i = -3; i <= 3; i++) {
      if (!i) continue
      g.beginPath()
      g.moveTo(i * 13, 0)
      g.lineTo(i * 13 + 10, -16)
      g.moveTo(i * 13, 0)
      g.lineTo(i * 13 + 10, 16)
      g.stroke()
    }
  })
}

/** The tree: { group, crown: [Vector3] (leaf-cluster centres, for the breathing molecules), update(t) }. */
export function buildTree({ light = false, seed = 4, scale = 1, leaves = light ? 5200 : 15000, shadows = !light, leafSize = 0.34 } = {}) {
  const rand = rng(seed)
  const group = new THREE.Group()
  const geos = []
  const tips = []
  const up = new THREE.Vector3(0, 1, 0)
  const jitter = k => new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(k)
  const branch = (start, dir, length, r0, depth) => {
    const pts = [start.clone()]
    const d = dir.clone()
    let p = start.clone()
    const segs = 4
    for (let i = 1; i <= segs; i++) {
      d.add(jitter(0.32)).addScaledVector(up, 0.12 + depth * 0.02).normalize()
      p = p.clone().addScaledVector(d, length / segs)
      pts.push(p)
    }
    const r1 = Math.max(0.018, r0 * 0.58)
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    geos.push(taperedTube(curve, r0, r1, { radial: depth >= 2 ? 12 : 7, segments: depth >= 2 ? 14 : 6 }))
    if (depth === 0) {
      tips.push(p.clone())
      // two little twigs carry leaves too
      tips.push(curve.getPointAt(0.6).add(jitter(0.6)))
      return
    }
    const n = depth >= 2 ? 3 : 2 + (rand() < 0.7 ? 1 : 0)
    for (let i = 0; i < n; i++) {
      const at = curve.getPointAt(0.55 + rand() * 0.42)
      const side = new THREE.Vector3().crossVectors(d, jitter(1).add(up.clone().multiplyScalar(0.01))).normalize()
      const cd = d.clone().applyAxisAngle(side, 0.45 + rand() * 0.45).applyAxisAngle(d, (i / n) * Math.PI * 2 + rand())
      branch(at, cd, length * (0.62 + rand() * 0.18), r1 * (0.75 + rand() * 0.2), depth - 1)
    }
  }
  // the trunk, with a flare where it meets the ground
  const trunkTop = new THREE.Vector3(0.15, 3.6, -0.1)
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(0.05, 1.2, 0.05), new THREE.Vector3(0.12, 2.5, -0.05), trunkTop,
  ])
  geos.push(taperedTube(trunkCurve, 0.62, 0.42, { radial: 20, segments: 24, flare: u => 1 + 0.75 * Math.exp(-u * 14) }))
  // roots showing at the surface
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + rand() * 0.4
    const pts = [new THREE.Vector3(Math.cos(a) * 0.3, 0.25, Math.sin(a) * 0.3), new THREE.Vector3(Math.cos(a) * 1.0, 0.02, Math.sin(a) * 1.0), new THREE.Vector3(Math.cos(a) * 1.7, -0.12, Math.sin(a) * 1.7)]
    geos.push(taperedTube(pts, 0.2, 0.05, { radial: 8, segments: 8 }))
  }
  const limbs = 6
  for (let k = 0; k < limbs; k++) {
    const a = (k / limbs) * Math.PI * 2 + rand() * 0.5
    const dir = new THREE.Vector3(Math.cos(a), 0.55 + rand() * 0.45, Math.sin(a)).normalize()
    branch(trunkTop.clone().addScaledVector(up, -rand() * 0.6), dir, 3.9 + rand() * 1.0, 0.29, 3)
  }
  // a leader going up the middle
  branch(trunkTop.clone(), new THREE.Vector3(0.05, 1, 0.02).normalize(), 3.6, 0.3, 3)
  const wood = new THREE.Mesh(mergeGeometries(geos), new THREE.MeshStandardMaterial({ map: barkTexture(), color: '#a8876c', roughness: 0.92 }))
  wood.castShadow = shadows
  wood.receiveShadow = shadows
  group.add(wood)

  // the leaves: cards with a leaf drawn on them, clustered round the twigs' tips
  const leafGeo = new THREE.PlaneGeometry(leafSize, leafSize)
  const leafMat = new THREE.MeshStandardMaterial({ map: leafTexture(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.72, metalness: 0 })
  const wind = { uTime: { value: 0 } }
  leafMat.onBeforeCompile = sh => {
    sh.uniforms.uTime = wind.uTime
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          float ph = ip.x * 0.7 + ip.z * 0.9 + ip.y * 0.3;
          transformed.x += sin(uTime * 1.7 + ph) * 0.05 * (0.5 + uv.y);
          transformed.z += cos(uTime * 1.3 + ph * 1.3) * 0.04 * (0.5 + uv.y);
        #endif`)
  }
  leafMat.customProgramCacheKey = () => 'carbon-leaves'
  const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, leaves)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const c = new THREE.Color()
  const per = Math.ceil(leaves / tips.length)
  let n = 0
  for (const tip of tips) {
    for (let i = 0; i < per && n < leaves; i++) {
      const off = new THREE.Vector3(rand() - 0.5, (rand() - 0.35) * 0.8, rand() - 0.5).normalize().multiplyScalar(Math.pow(rand(), 0.55) * 1.35)
      const p = tip.clone().add(off)
      e.set(rand() * Math.PI, rand() * Math.PI * 2, rand() * Math.PI)
      q.setFromEuler(e)
      const s = 0.8 + rand() * 0.6
      m4.compose(p, q, new THREE.Vector3(s, s, s))
      leafMesh.setMatrixAt(n, m4)
      c.setHSL(0.24 + rand() * 0.07, 0.45 + rand() * 0.2, 0.32 + rand() * 0.16)
      leafMesh.setColorAt(n, c)
      n++
    }
  }
  leafMesh.count = n
  leafMesh.castShadow = shadows
  leafMesh.receiveShadow = shadows
  leafMesh.computeBoundingSphere()
  group.add(leafMesh)
  group.scale.setScalar(scale)
  return {
    group,
    crown: tips.map(t => t.clone().multiplyScalar(scale)),
    update(t) {
      wind.uTime.value = t
    },
  }
}

// ---- the breathing: CO2 in, O2 out ----
const CPK = { C: '#3d4149', O: '#ef3a2f' }

/** Molecules drifting between the air round the tree and its crown. setDay(k) blends day (k = 1:
 *  photosynthesis, CO2 in and O2 out, many) and night (k = 0: respiration only, a few CO2 out). */
export function breathing({ crown, centre = new THREE.Vector3(), count = 16, light = false, scale = 0.3 }) {
  const rand = rng(21)
  const group = new THREE.Group()
  const seg = light ? 10 : 16
  const sphere = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7))
  const stick = new THREE.CylinderGeometry(1, 1, 1, 8)
  const mat = el => new THREE.MeshPhysicalMaterial({ color: CPK[el], roughness: 0.3, clearcoat: light ? 0 : 0.8, emissive: CPK[el], emissiveIntensity: el === 'O' ? 0.22 : 0.08 })
  const total = count * 2 // half CO2 slots, half O2 slots
  const oMesh = new THREE.InstancedMesh(sphere, mat('O'), total * 2)
  const cMesh = new THREE.InstancedMesh(sphere, mat('C'), count)
  const sMesh = new THREE.InstancedMesh(stick, new THREE.MeshPhysicalMaterial({ color: '#e8edf5', roughness: 0.35, clearcoat: 0.5 }), count * 4 + count * 2)
  for (const m of [oMesh, cMesh, sMesh]) {
    m.frustumCulled = false
    m.castShadow = false
    group.add(m)
  }
  const R = { C: 0.4 * scale * 0.95, O: 0.37 * scale * 0.95 }
  const dCO = 1.16 * scale
  const dOO = 1.21 * scale
  const stickR = 0.085 * scale
  // each molecule: kind, path from a to b, progress, speed, tumble
  const mols = []
  const outer = () => {
    const a = rand() * Math.PI * 2
    const r = 9 + rand() * 4
    return new THREE.Vector3(centre.x + Math.cos(a) * r, 1.5 + rand() * 9, centre.z + Math.sin(a) * r)
  }
  const leafPoint = () => crown[(rand() * crown.length) | 0].clone().add(new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5))
  let day = 1
  const spawn = (m, first = false) => {
    // in daylight (photosynthesis) CO2 goes into the leaves and O2 comes out; in the dark only the
    // tree's respiration is left: a few O2 go in and CO2 comes out
    const photo = rand() < day
    m.inward = m.kind === 'CO2' ? photo : !photo
    m.active = photo || rand() < 0.3
    m.a = m.inward ? outer() : leafPoint()
    m.b = m.inward ? leafPoint() : outer()
    m.mid = m.a.clone().lerp(m.b, 0.5).add(new THREE.Vector3((rand() - 0.5) * 3, 1 + rand() * 2, (rand() - 0.5) * 3))
    m.u = first ? rand() : 0
    m.speed = (0.05 + rand() * 0.035) * (photo ? 1 : 0.6)
    m.spin = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize()
    m.rate = 0.5 + rand() * 1.2
    m.q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6, rand() * 6, rand() * 6))
  }
  for (let i = 0; i < count; i++) {
    for (const kind of ['CO2', 'O2']) {
      const m = { kind }
      spawn(m, true)
      mols.push(m)
    }
  }
  const m4 = new THREE.Matrix4()
  const qq = new THREE.Quaternion()
  const tmp = new THREE.Vector3()
  const p = new THREE.Vector3()
  const one = new THREE.Vector3()
  const xAxis = new THREE.Vector3(1, 0, 0)
  const UP = new THREE.Vector3(0, 1, 0)
  const side = new THREE.Vector3(0, 0, 1)
  const hide = new THREE.Matrix4().makeScale(0, 0, 0)
  const curve = (m, u, out) => {
    // a quadratic Bezier from a through mid to b
    const s = 1 - u
    return out.set(0, 0, 0).addScaledVector(m.a, s * s).addScaledVector(m.mid, 2 * s * u).addScaledVector(m.b, u * u)
  }
  const ball = (mesh, i, at, r) => mesh.setMatrixAt(i, m4.compose(at, qq.identity(), one.setScalar(r)))
  const bond = (i, a, b, off, k) => {
    const d = tmp.subVectors(b, a)
    const l = d.length()
    qq.setFromUnitVectors(UP, d.normalize())
    const mid = a.clone().add(b).multiplyScalar(0.5).add(off)
    sMesh.setMatrixAt(i, m4.compose(mid, qq, one.set(stickR * k, l, stickR * k)))
  }
  return {
    group,
    setDay(k) {
      day = k
    },
    update(dt) {
      let oi = 0
      let ci = 0
      let si = 0
      for (const m of mols) {
        m.u += dt * m.speed
        if (m.u >= 1) spawn(m)
        m.q.multiply(qq.setFromAxisAngle(m.spin, dt * m.rate))
        curve(m, m.u, p)
        // grow in at the start, shrink into (or out of) the leaves
        const k = Math.min(1, m.u * 6, (1 - m.u) * 6) * (m.active ? 1 : 0)
        const axis = xAxis.clone().applyQuaternion(m.q)
        const offs = side.clone().applyQuaternion(m.q).multiplyScalar(stickR * 1.5 * k)
        if (m.kind === 'CO2') {
          const o1 = p.clone().addScaledVector(axis, -dCO * k)
          const o2 = p.clone().addScaledVector(axis, dCO * k)
          ball(cMesh, ci++, p, R.C * k)
          ball(oMesh, oi++, o1, R.O * k)
          ball(oMesh, oi++, o2, R.O * k)
          for (const [a, b] of [[o1, p], [p, o2]]) {
            bond(si++, a, b, offs, k)
            bond(si++, a, b, offs.clone().multiplyScalar(-1), k)
          }
        } else {
          const o1 = p.clone().addScaledVector(axis, (-dOO / 2) * k)
          const o2 = p.clone().addScaledVector(axis, (dOO / 2) * k)
          ball(oMesh, oi++, o1, R.O * k)
          ball(oMesh, oi++, o2, R.O * k)
          bond(si++, o1, o2, offs, k)
          bond(si++, o1, o2, offs.clone().multiplyScalar(-1), k)
        }
      }
      for (; oi < oMesh.count; oi++) oMesh.setMatrixAt(oi, hide)
      for (; si < sMesh.count; si++) sMesh.setMatrixAt(si, hide)
      oMesh.instanceMatrix.needsUpdate = true
      cMesh.instanceMatrix.needsUpdate = true
      sMesh.instanceMatrix.needsUpdate = true
    },
  }
}
