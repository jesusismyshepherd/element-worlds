// Placeholder until this world is built.
import * as THREE from 'three'

export async function build() {
  const root = new THREE.Group()
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: '#334' }))
  floor.rotation.x = -Math.PI / 2
  root.add(floor, new THREE.HemisphereLight('#fff', '#223', 2))
  return { mode: 'walk', root, spawn: { x: 0, z: 5, yaw: 0 }, solids: [] }
}
