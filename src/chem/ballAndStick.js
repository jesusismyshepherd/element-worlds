// A molecule (molecules.js) as a ball-and-stick model, in the colours school model kits use (CPK:
// carbon dark grey, hydrogen white, oxygen red, nitrogen blue). Double bonds are two sticks side by
// side, triple bonds three. `scale` is metres per ångström.
import * as THREE from 'three'
import { element } from '../data/elements.js'

const COLOR = { H: '#f4f6fb', C: '#42464e', N: '#3a5cf5', O: '#f2302b', Ar: '#80d1e3' }
const RADIUS = { H: 0.28, C: 0.4, N: 0.38, O: 0.37, Ar: 0.62 } // drawn sizes, ångström

const colorOf = el => COLOR[el] ?? element(el)?.cpk ?? '#c0c6d6'
const UP = new THREE.Vector3(0, 1, 0)

export function ballAndStick(mol, { scale = 0.5, light = false, glow = 0, bondColor = '#dfe5f2' } = {}) {
  const group = new THREE.Group()
  group.name = `molecule-${mol.id}`
  const seg = light ? 12 : 22
  const sphere = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75))
  const mats = {}
  const matOf = el => {
    if (!mats[el]) {
      const c = new THREE.Color(colorOf(el))
      mats[el] = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2, emissive: c, emissiveIntensity: glow })
    }
    return mats[el]
  }
  const pos = mol.atoms.map(a => new THREE.Vector3(...a.p).multiplyScalar(scale))
  mol.atoms.forEach((a, i) => {
    const m = new THREE.Mesh(sphere, matOf(a.el))
    m.position.copy(pos[i])
    m.scale.setScalar((RADIUS[a.el] ?? 0.45) * scale)
    m.userData.atom = a.el
    group.add(m)
  })
  const stickR = 0.09 * scale
  const stick = new THREE.CylinderGeometry(stickR, stickR, 1, light ? 6 : 10)
  const bondMat = new THREE.MeshPhysicalMaterial({ color: bondColor, roughness: 0.4, clearcoat: 0.5 })
  for (const [i, j, order] of mol.bonds) {
    const a = pos[i]
    const b = pos[j]
    const dir = b.clone().sub(a)
    const len = dir.length()
    dir.normalize()
    // sideways, in the molecule's plane where there is one
    let side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 0, 1))
    if (side.lengthSq() < 1e-6) side = new THREE.Vector3().crossVectors(dir, UP)
    side.normalize()
    const gap = stickR * 2.6
    const offsets = order === 1 ? [0] : order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap]
    for (const off of offsets) {
      const c = new THREE.Mesh(stick, bondMat)
      c.position.copy(a).add(b).multiplyScalar(0.5).addScaledVector(side, off)
      c.quaternion.setFromUnitVectors(UP, dir)
      c.scale.y = len
      group.add(c)
    }
  }
  return group
}
