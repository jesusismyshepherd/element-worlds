// The professor of the Periodic Videos rooms: a friendly figure in the game's own rounded style (the wild
// white hair, the glasses, a striped shirt and a tie), standing in his office corner. He turns his head to
// the visitor and gestures when he talks. What he says comes from the element's film only, retold and with
// the moment to watch him say it (<Symbol>.words.js `prof`): the game puts no words of its own in his mouth.
// The model faces +z; y = 0 is the floor.
import * as THREE from 'three'
import { canvasTex, random } from '../noble/kit.js'

export function professor({ light = false } = {}) {
  const group = new THREE.Group()
  const skin = new THREE.MeshStandardMaterial({ color: '#e9bc9e', roughness: 0.6 })
  const stripes = canvasTex(64, 64, (g, w, h) => {
    g.fillStyle = '#f4f6fb'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#8fa8d6'
    for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 3, h)
  }, { repeat: true })
  stripes.repeat.set(6, 3)
  const shirt = new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.75 })
  const trousers = new THREE.MeshStandardMaterial({ color: '#5a5f69', roughness: 0.8 })
  const shoes = new THREE.MeshStandardMaterial({ color: '#2a2422', roughness: 0.5 })
  const tieTex = canvasTex(32, 128, (g, w, h) => {
    g.fillStyle = '#26315f'
    g.fillRect(0, 0, w, h)
    const cs = ['#ff6b5e', '#f7d154', '#5aa9ff', '#7fd7a8', '#b38cff']
    for (let y = 4; y < h; y += 12) for (let x = 4; x < w; x += 12) {
      g.fillStyle = cs[(x + y) % cs.length]
      g.fillRect(x, y, 6, 6)
    }
  })
  const tieMat = new THREE.MeshStandardMaterial({ map: tieTex, roughness: 0.6 })
  const hairMat = new THREE.MeshStandardMaterial({ color: '#e6e7ea', roughness: 0.95 })
  const dark = new THREE.MeshStandardMaterial({ color: '#2b2d33', roughness: 0.4, metalness: 0.3 })

  // legs and shoes
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.72, 4, 12), trousers)
    leg.position.set(s * 0.1, 0.45, 0)
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.26), shoes)
    shoe.position.set(s * 0.1, 0.04, 0.04)
    group.add(leg, shoe)
  }
  // the body: shirt, tie, a belt
  const body = new THREE.Group()
  body.position.y = 0.92
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.34, 6, 16), shirt)
  torso.scale.set(1, 1, 0.72)
  torso.position.y = 0.3
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.05, 20), dark)
  belt.scale.z = 0.72
  belt.position.y = 0.06
  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.42, 0.02), tieMat)
  tie.position.set(0, 0.37, 0.15)
  tie.rotation.x = -0.12
  body.add(torso, belt, tie)
  group.add(body)
  // arms: from the shoulders, the right one gestures when he talks
  const arms = [-1, 1].map(s => {
    const shoulder = new THREE.Group()
    shoulder.position.set(s * 0.25, 0.58, 0)
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.5, 4, 10), shirt)
    upper.position.y = -0.3
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), skin)
    hand.position.y = -0.6
    shoulder.add(upper, hand)
    shoulder.rotation.z = s * 0.12
    body.add(shoulder)
    return shoulder
  })
  // the head: face, nose, eyes behind round glasses, and the hair
  const head = new THREE.Group()
  head.position.y = 0.92 + 0.84
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), skin)
  face.scale.set(0.92, 1.08, 0.95)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.1, 10), skin)
  neck.position.y = -0.14
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), skin)
  nose.position.set(0, -0.01, 0.125)
  head.add(face, neck, nose)
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), dark)
    eye.position.set(s * 0.045, 0.02, 0.112)
    const lens = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.006, 6, 18), dark)
    lens.position.set(s * 0.048, 0.02, 0.13)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.006, 0.12), dark)
    arm.position.set(s * 0.088, 0.025, 0.07)
    head.add(eye, lens, arm)
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.006, 0.006), dark)
  bridge.position.set(0, 0.025, 0.132)
  head.add(bridge)
  // the hair: a wild white halo round the top, sides and back of the head, never over the face
  const rnd = random(5)
  const puffs = []
  for (let i = 0; i < 70; i++) {
    const th = rnd() * Math.PI * 2
    const ph = Math.acos(1 - rnd() * 1.6)
    const d = new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th))
    if (d.z > 0.35 && d.y < 0.55) continue
    puffs.push({ p: d.multiplyScalar(0.15 + rnd() * 0.06), s: 0.05 + rnd() * 0.04 })
  }
  const hair = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, light ? 0 : 1), hairMat, puffs.length)
  const m4 = new THREE.Matrix4()
  puffs.forEach((h, i) => {
    m4.compose(h.p.clone().setY(h.p.y + 0.03), new THREE.Quaternion(), new THREE.Vector3(h.s, h.s, h.s))
    hair.setMatrixAt(i, m4)
  })
  head.add(hair)
  group.add(head)

  let talk = 0
  let headYaw = 0
  return {
    group,
    /** He has something to say: the right hand rises as he talks. */
    gesture() {
      talk = 2.4
    },
    update(dt, t, visitor) {
      body.scale.y = 1 + Math.sin(t * 1.6) * 0.008
      // he looks at the visitor when they are near, within what a head can turn
      let want = 0
      if (visitor) {
        const p = group.worldToLocal(visitor.clone())
        if (Math.hypot(p.x, p.z) < 6) want = Math.max(-0.9, Math.min(0.9, Math.atan2(p.x, p.z)))
      }
      headYaw += (want - headYaw) * Math.min(1, dt * 4)
      head.rotation.y = headYaw
      head.rotation.z = Math.sin(t * 0.9) * 0.03
      talk = Math.max(0, talk - dt)
      const k = Math.sin(Math.min(1, talk / 0.4) * Math.PI / 2) * (talk > 0 ? 1 : 0)
      arms[1].rotation.x = -k * (1.1 + Math.sin(t * 5) * 0.15)
      arms[1].rotation.z = 0.12 + k * 0.25
    },
  }
}
