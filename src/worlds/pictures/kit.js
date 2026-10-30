// The pieces every picture room shares (docs/knowledge/picture-rooms.md): the picture's frame you came in
// by, standing in the scene as the way back; an easel with the picture and its story; motes drifting in
// the air or the water; a round edge to walk inside. Few kinds of material, so a room built from them
// compiles few shaders on its first visit and shares them with the next room.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { portalMaterial } from '../common/props.js'
import { makeText } from '../../engine/text.js'
import { box } from '../../engine/collide.js'

const GOLD = new THREE.Color('#ffd166')

/** The picture's frame, standing on the ground with its opening facing +z: a glowing frame round a
 *  swirl in the board's colour, its label above. Walking into it goes back to the hall. */
export function frameDoor({ color, label, width = 2.7, height = 2.4, lift = 0.25 }) {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.4, metalness: 0.2 })
  const t = 0.16
  const bars = [
    [width + 2 * t, t, 0, lift + height + t / 2],
    [width + 2 * t, t, 0, lift - t / 2],
    [t, height, -(width + t) / 2, lift + height / 2],
    [t, height, (width + t) / 2, lift + height / 2],
  ]
  for (const [w, h, x, y] of bars) {
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.18, 2, 0.05), mat)
    m.position.set(x, y, 0)
    group.add(m)
  }
  // two feet, so the frame stands like a picture leant on nothing
  for (const s of [-1, 1]) {
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.12, 0.9, 2, 0.04), mat)
    foot.position.set(s * (width + t) / 2, 0.06, 0)
    group.add(foot)
    const leg = new THREE.Mesh(new RoundedBoxGeometry(t, lift, 0.16, 2, 0.04), mat)
    leg.position.set(s * (width + t) / 2, lift / 2, 0)
    group.add(leg)
  }
  const portal = portalMaterial(color, 'swirl')
  // the swirl turns about (0, 1.8) of the surface's own coordinates: the geometry is moved, not the mesh
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(width, height).translate(0, lift + height / 2, 0), portal)
  surface.position.z = -0.02
  group.add(surface)
  if (label) {
    const text = makeText(label, { size: 0.26, color: '#ffffff', maxWidth: width + 1.4, anchorY: 'bottom' })
    text.position.set(0, lift + height + t + 0.18, 0.1)
    group.add(text)
  }
  return { group, update: time => (portal.uniforms.uTime.value = time) }
}

/** An easel with the picture on it (facing +z), where the picture's story is read. setRead(true) turns
 *  its frame gold. */
export function storyStand({ url, color, width = 1.2, height = 0.8 }) {
  const group = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.8 })
  const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, roughness: 0.4 })
  // an easel as a real one stands: two front legs leaning back, the picture resting on a ledge in front of
  // them (the legs stay behind it, never through it), a third leg propping them from behind
  const tilt = 0.22
  const ledgeAt = 0.8 // along the leaning legs
  const legLen = ledgeAt + height + 0.2
  const lean = new THREE.Group()
  lean.rotation.x = -tilt
  lean.position.z = 0.3 // the feet's middle under the stand's centre
  group.add(lean)
  const stick = (len, r = 0.026) => new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r, len, 8), wood)
  for (const x of [-0.42, 0.42]) {
    const leg = stick(legLen)
    leg.position.set(x, legLen / 2, -0.05)
    lean.add(leg)
  }
  const bar = stick(0.84, 0.018)
  bar.rotation.z = Math.PI / 2
  bar.position.set(0, 0.35, -0.05)
  lean.add(bar)
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.04, 0.14), wood)
  ledge.position.set(0, ledgeAt - 0.02, 0.02)
  lean.add(ledge)
  const board = new THREE.Group()
  const edge = new THREE.Mesh(new RoundedBoxGeometry(width + 0.08, height + 0.08, 0.05, 2, 0.02), edgeMat)
  const tex = new THREE.TextureLoader().load(url)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const picture = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
  picture.position.z = 0.03
  board.add(edge, picture)
  board.position.set(0, ledgeAt + (height + 0.08) / 2, 0.02)
  lean.add(board)
  // the back leg, from the front legs' top down to the floor behind
  const top = new THREE.Vector3(0, legLen, -0.05).applyAxisAngle(new THREE.Vector3(1, 0, 0), -tilt).add(lean.position)
  const foot = new THREE.Vector3(0, 0, top.z - 0.62)
  const back = stick(top.distanceTo(foot))
  back.position.copy(top).add(foot).multiplyScalar(0.5)
  back.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(foot).normalize())
  group.add(back)
  const base = new THREE.Color(color)
  let read = false
  return {
    group,
    setRead(r) {
      read = r
      edgeMat.color.copy(r ? GOLD : base)
      edgeMat.emissive.copy(r ? GOLD : base)
      edgeMat.emissiveIntensity = 1.1
    },
    // its frame breathes until the story is read, as the hall's boards do
    update(t) {
      if (!read) edgeMat.emissiveIntensity = 1.1 + Math.sin(t * 2.2) * 0.45
    },
    dispose: () => tex.dispose(),
  }
}

let dotTex = null
/** A soft round dot (shared by every room's motes, kept between rooms). */
function dot() {
  if (dotTex) return dotTex
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.4, 'rgba(255,255,255,0.5)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  dotTex = new THREE.CanvasTexture(c)
  dotTex.userData.shared = true
  return dotTex
}

/** Motes drifting in a cylinder (radius, from y0 to y1): dust in the air, plankton in the water. */
export function motes({ count = 400, radius = 12, y0 = 0.2, y1 = 8, color = '#ffffff', size = 0.06, opacity = 0.7, speed = 0.15, light = false }) {
  const n = light ? Math.round(count / 3) : count
  const pos = new Float32Array(n * 3)
  const seed = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * radius
    pos.set([Math.cos(a) * r, y0 + Math.random() * (y1 - y0), Math.sin(a) * r], i * 3)
    seed[i] = Math.random() * 100
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const base = pos.slice()
  const mat = new THREE.PointsMaterial({ color, size, map: dot(), transparent: true, opacity, depthWrite: false, sizeAttenuation: true })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  return {
    group: points,
    update(t) {
      for (let i = 0; i < n; i++) {
        const s = seed[i]
        pos[i * 3] = base[i * 3] + Math.sin(t * speed + s) * 0.3
        pos[i * 3 + 1] = y0 + ((base[i * 3 + 1] - y0 + t * speed * 0.4 + s) % (y1 - y0))
        pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * speed * 0.8 + s) * 0.3
      }
      geo.attributes.position.needsUpdate = true
    },
  }
}

/** A round edge to walk inside (radius r): a ring of thin boxes. */
export function ringWall(r, n = 36) {
  const solids = []
  const w = ((2 * Math.PI * r) / n) * 1.15
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    solids.push(box(Math.cos(a) * (r + 0.3), Math.sin(a) * (r + 0.3), w, 0.6, { rot: -a + Math.PI / 2 }))
  }
  return solids
}

/** Ease in and out (0..1). */
export const ease = v => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v))
