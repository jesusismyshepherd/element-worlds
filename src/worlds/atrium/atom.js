// The big atom at the centre of every atrium (and wherever a world wants one): the nucleus of the
// commonest isotope with its real count of protons and neutrons, and the electron shells (Bohr's
// model) with their real electron counts going round, the outer shell in the element's colour with
// the free places of its octet. Not to scale: a real nucleus is 100 000 times smaller than its atom.
import * as THREE from 'three'
import { nucleus, octetPlaces, valenceElectrons, lewisSlots, lewisAngle } from '../../chem/atom.js'

const PROTON = '#ff5a55'
const NEUTRON = '#b9c6dc'
const ELECTRON = '#a8ecff'

function packBall(n, r) {
  const out = []
  for (let i = 0; i < n; i++) {
    const k = (i + 0.5) / n
    const rad = r * Math.cbrt(k)
    const y = 1 - 2 * ((i * 0.618034) % 1)
    const a = i * 2.399963
    const s = Math.sqrt(Math.max(0, 1 - y * y))
    out.push(new THREE.Vector3(Math.cos(a) * s * rad, y * rad, Math.sin(a) * s * rad))
  }
  return out
}

/** { root, update(t), radius } for an element; `size` is the outer shell's radius in metres. */
export function bigAtom(el, { size = 3, accent = '#7fd4ff', light = false } = {}) {
  const root = new THREE.Group()
  const { protons, neutrons } = nucleus(el)
  const total = protons + neutrons
  const shells = el.shells
  const n = shells.length

  // the nucleus: protons and neutrons in their real proportion
  const nucleonR = Math.min(0.26, size * 0.085)
  const ball = packBall(total, nucleonR * Math.cbrt(total) * 1.02)
  const share = protons / total
  const geo = new THREE.SphereGeometry(nucleonR, light ? 10 : 16, light ? 8 : 12)
  const core = new THREE.Group()
  for (const [want, color, glow] of [[true, PROTON, 0.55], [false, NEUTRON, 0.3]]) {
    const pts = ball.filter((_, i) => Math.floor((i + 1) * share) > Math.floor(i * share) === want)
    if (!pts.length) continue
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: glow, roughness: 0.35, metalness: 0.05 })
    const im = new THREE.InstancedMesh(geo, mat, pts.length)
    const m = new THREE.Matrix4()
    pts.forEach((p, i) => im.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)))
    core.add(im)
  }
  root.add(core)
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(nucleonR * Math.cbrt(total) * 1.6, 24, 16),
    new THREE.MeshBasicMaterial({ color: PROTON, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  root.add(halo)

  // the shells: rings tilted against each other, inner ones small and quick, the outer one in colour
  const inner = Math.max(nucleonR * Math.cbrt(total) * 2.4, size * 0.28)
  const radii = shells.map((_, k) => (n === 1 ? size : inner + ((size - inner) * k) / (n - 1)))
  const eGeo = new THREE.SphereGeometry(Math.max(0.08, size * 0.05), 16, 12)
  const eMat = new THREE.MeshStandardMaterial({ color: ELECTRON, emissive: ELECTRON, emissiveIntensity: 2.2 })
  const outerMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 2.4 })
  const slotMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.6, transparent: true, opacity: 0.6 })
  const orbits = []
  shells.forEach((count, k) => {
    const outer = k === n - 1
    const tilt = new THREE.Group()
    tilt.rotation.set(Math.PI / 2 + (k % 2 ? 0.42 : -0.3) * (k / n), (k * 1.1) % Math.PI, k * 0.37)
    const ringMat = new THREE.MeshBasicMaterial({
      color: outer ? accent : '#a9c4ff', transparent: true, opacity: outer ? 0.8 : 0.45, depthWrite: false,
    })
    tilt.add(new THREE.Mesh(new THREE.TorusGeometry(radii[k], outer ? 0.045 : 0.028, 8, 180), ringMat))
    const spin = new THREE.Group()
    tilt.add(spin)
    // the outer shell of a main-group element shows its octet: electrons and free places
    const places = outer && valenceElectrons(el) === count ? octetPlaces(el) : null
    const lewis = places ? lewisSlots(count, places) : null
    const slots = places ?? count
    for (let i = 0; i < slots; i++) {
      const a = places ? lewisAngle(i, places) : (i / slots) * Math.PI * 2
      const filled = lewis ? lewis[i] : true
      const e = new THREE.Mesh(filled ? eGeo : new THREE.TorusGeometry(size * 0.03, size * 0.008, 6, 16), filled ? (outer ? outerMat : eMat) : slotMat)
      e.position.set(Math.cos(a) * radii[k], Math.sin(a) * radii[k], 0)
      if (filled && outer) e.scale.setScalar(1.35)
      spin.add(e)
    }
    root.add(tilt)
    orbits.push({ spin, speed: 0.9 / Math.sqrt(k + 1) })
  })

  return {
    root,
    radius: size,
    update(t) {
      for (const o of orbits) o.spin.rotation.z = t * o.speed
      core.rotation.y = t * 0.25
      core.rotation.x = Math.sin(t * 0.3) * 0.2
      halo.material.opacity = 0.07 + Math.sin(t * 2) * 0.02
    },
  }
}
