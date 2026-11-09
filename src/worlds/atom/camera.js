// The electron camera: an old plate camera on a tripod, its lens on the nucleus. A tap takes a photo: the
// flash fires and a dot appears where the electron was found this time (src/worlds/atom/views.js photoOf).
// Its front faces +z before it is turned to the nucleus (Object3D.lookAt turns +z to the target).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export function electronCamera({ color = '#7fd4ff', light = false } = {}) {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: '#2a3152', roughness: 0.35, metalness: 0.75 })
  const leather = new THREE.MeshStandardMaterial({ color: '#141a33', roughness: 0.8, metalness: 0.1 })
  const brass = new THREE.MeshStandardMaterial({ color: '#d7b46a', roughness: 0.3, metalness: 0.9 })
  const trim = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6 })

  // the tripod
  const head = new THREE.Vector3(0, 1.22, 0)
  const legGeo = new THREE.CylinderGeometry(0.022, 0.03, 1, 8)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6
    const foot = new THREE.Vector3(Math.cos(a) * 0.48, 0, Math.sin(a) * 0.48)
    const leg = new THREE.Mesh(legGeo, metal)
    const mid = head.clone().add(foot).multiplyScalar(0.5)
    leg.position.copy(mid)
    leg.scale.y = head.distanceTo(foot)
    leg.lookAt(foot)
    leg.rotateX(Math.PI / 2)
    group.add(leg)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), trim)
    tip.position.copy(foot).setY(0.03)
    group.add(tip)
  }
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), metal)
  knob.position.copy(head)
  group.add(knob)

  // the body (it turns to the nucleus; the tripod stays)
  const body = new THREE.Group()
  body.position.set(0, 1.42, 0)
  group.add(body)
  const box = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.34, 0.3, 3, 0.04), leather)
  body.add(box)
  for (const y of [-0.17, 0.17]) {
    const band = new THREE.Mesh(new RoundedBoxGeometry(0.48, 0.03, 0.32, 2, 0.012), brass)
    band.position.y = y
    body.add(band)
  }
  // the bellows and the lens, forward along +z
  const bellows = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.16, 4, 3, true), leather)
  bellows.rotation.set(Math.PI / 2, Math.PI / 4, 0)
  bellows.position.z = 0.23
  body.add(bellows)
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.16, 28), metal)
  barrel.rotation.x = Math.PI / 2
  barrel.position.z = 0.38
  body.add(barrel)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.097, 0.012, 8, 32), trim)
  ring.position.z = 0.46
  body.add(ring)
  const glassMat = new THREE.MeshStandardMaterial({ color: '#0d1a3a', roughness: 0.05, metalness: 0.2, emissive: color, emissiveIntensity: 0.25 })
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.088, 28), glassMat)
  glass.position.z = 0.462
  body.add(glass)
  // the flash on top: a dish and its bulb
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), metal)
  stem.position.set(-0.12, 0.25, 0)
  body.add(stem)
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.03, 0.05, 24, 1, true), new THREE.MeshStandardMaterial({ color: '#cfd6ea', roughness: 0.2, metalness: 1, side: THREE.DoubleSide }))
  dish.position.set(-0.12, 0.36, 0.02)
  dish.rotation.x = Math.PI / 2 - 0.25
  body.add(dish)
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff2d6', emissiveIntensity: 0.4 })
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 14, 10), bulbMat)
  bulb.position.set(-0.12, 0.36, 0.035)
  body.add(bulb)
  // the shutter button: the thing to press
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16), new THREE.MeshStandardMaterial({ color: '#ff5a55', emissive: '#ff5a55', emissiveIntensity: 1.2 }))
  button.position.set(0.14, 0.185, 0.04)
  body.add(button)

  const flashLight = new THREE.PointLight('#fff4e0', 0, 16, 1.6)
  flashLight.position.set(-0.12, 1.8, 0.2)
  group.add(flashLight)

  let flashT = -1
  let pressT = -1
  return {
    group,
    body,
    /** Point the lens at a place (world coordinates). */
    aim(target) {
      group.updateMatrixWorld(true)
      body.lookAt(target)
    },
    fire(t) {
      flashT = t
      pressT = t
    },
    update(t) {
      const f = flashT < 0 ? 0 : Math.max(0, 1 - (t - flashT) / 0.35)
      bulbMat.emissiveIntensity = 0.4 + f * 30
      flashLight.intensity = light ? 0 : f * f * 40
      glassMat.emissiveIntensity = 0.25 + f * 2
      const p = pressT < 0 ? 0 : Math.max(0, 1 - (t - pressT) / 0.18)
      button.position.y = 0.185 - p * 0.012
    },
  }
}
