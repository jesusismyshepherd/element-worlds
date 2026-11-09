// Building DNA: a bench of the Molecule Lab (/lab/dna; registry.js BENCHES). A stub while it is being built
// (2026-11-09): the sky, a table and the bench's Bible passage. docs/knowledge/benches.md.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { nightSky } from '../../common/sky.js'
import { skyVerse } from '../../common/verse.js'

export async function build(ctx) {
  const { camera, canvas, light } = ctx
  const root = new THREE.Group()
  root.name = 'bench-dna'
  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 900 : 1800, horizon: '#1d2a5c' })
  root.add(sky)
  const verse = skyVerse(ctx, 'dna', { at: [0, 4.3, -9], width: 8, size: 0.3, opacity: 0.75 })
  root.add(verse.group)
  const table = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.5, 64), new THREE.MeshStandardMaterial({ color: '#18204a', roughness: 0.35, metalness: 0.5 }))
  table.position.y = 0.25
  root.add(table)
  root.add(new THREE.HemisphereLight('#dfe8ff', '#1a2050', 1.3))
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.target.set(0, 1.9, 0)
  return {
    mode: 'orbit',
    root,
    title: null,
    env: { background: new THREE.Color('#070b1c'), exposure: 1.05, envIntensity: 0.6, bloom: { strength: 0.55, radius: 0.45, threshold: 0.8 }, fov: 50 },
    attach() {
      camera.position.set(0, 3.3, 7.2)
      controls.target.set(0, 1.9, 0)
    },
    detach() {
      controls.dispose()
    },
    update(dt, t) {
      verse.face()
      sky.userData.update(t)
      controls.update()
    },
    dispose() {
      verse.dispose()
    },
  }
}
