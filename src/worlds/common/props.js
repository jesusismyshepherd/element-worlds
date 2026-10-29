// Pieces the walking worlds share: wall panels (a station's screen), arches (doors to other worlds),
// a portal surface, and canvas textures.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../engine/text.js'

/** A screen for a station: frame, title, one big line and one small, glowing in `color`. Faces +z.
 *  Returns { group, setRead(bool) } (a read station's edge turns gold). */
export function wallPanel({ title, big = '', small = '', color = '#7fd4ff', width = 3.4, height = 2.3 }) {
  const group = new THREE.Group()
  const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, roughness: 0.4 })
  const edge = new THREE.Mesh(new RoundedBoxGeometry(width + 0.14, height + 0.14, 0.1, 3, 0.06), edgeMat)
  const face = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.16, 3, 0.05),
    new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.35, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.6 }),
  )
  face.position.z = 0.03
  group.add(edge, face)
  const t = makeText(title, { size: 0.25, color, maxWidth: width - 0.4, anchorY: 'top' })
  t.position.set(0, height / 2 - 0.22, 0.12)
  const b = makeText(big, { size: big.length > 14 ? 0.3 : 0.44, color: '#ffffff', maxWidth: width - 0.4 })
  b.position.set(0, -0.05, 0.12)
  const s = makeText(small, { font: 'body', size: 0.2, color: '#c9d4ff', maxWidth: width - 0.4, anchorY: 'top' })
  s.position.set(0, -0.42, 0.12)
  group.add(t, b, s)
  const gold = new THREE.Color('#ffd166')
  const base = new THREE.Color(color)
  return {
    group,
    setRead(read) {
      edgeMat.color.copy(read ? gold : base)
      edgeMat.emissive.copy(read ? gold : base)
    },
  }
}

/** A picture on the wall (a hall's picture board): the picture `url` (an SVG or image, 3:2) in a frame
 *  glowing in `color`, its `title` on a dark band over the bottom. Faces +z. Returns { group, setRead,
 *  update(t), dispose } (unread, the frame breathes, to draw you over; read, it turns gold). */
export function pictureBoard({ url, title, color = '#7fd4ff', width = 3.4, height = 2.3 }) {
  const group = new THREE.Group()
  const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, roughness: 0.4 })
  const edge = new THREE.Mesh(new RoundedBoxGeometry(width + 0.16, height + 0.16, 0.1, 3, 0.06), edgeMat)
  const tex = new THREE.TextureLoader().load(url)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  // the picture fills the frame (3:2 cut to the frame's shape from the middle)
  const aspect = width / height
  if (aspect < 1.5) {
    tex.repeat.set(aspect / 1.5, 1)
    tex.offset.set((1 - aspect / 1.5) / 2, 0)
  }
  const picture = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
  picture.position.z = 0.056
  const bandH = 0.5
  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(width, bandH),
    new THREE.MeshBasicMaterial({ color: '#0b0f24', transparent: true, opacity: 0.8, depthWrite: false }),
  )
  band.position.set(0, -height / 2 + bandH / 2, 0.06)
  const label = makeText(title, { size: title.length > 30 ? 0.19 : 0.23, color: '#ffffff', maxWidth: width - 0.3 })
  label.position.set(0, -height / 2 + bandH / 2, 0.07)
  group.add(edge, picture, band, label)
  const gold = new THREE.Color('#ffd166')
  const base = new THREE.Color(color)
  let read = false
  return {
    group,
    setRead(r) {
      read = r
      edgeMat.color.copy(r ? gold : base)
      edgeMat.emissive.copy(r ? gold : base)
      edgeMat.emissiveIntensity = 1.1
    },
    update(t) {
      if (!read) edgeMat.emissiveIntensity = 1.1 + Math.sin(t * 2.2) * 0.45
    },
    dispose() {
      tex.dispose()
    },
  }
}

/** An arch (a door to another world) `width` wide and `height` tall, its opening facing +z, with a
 *  glowing portal surface and a sign above. `closed` shows a dim barrier instead of a portal. */
export function arch({ width = 3.6, height = 4.4, color = '#7fd4ff', label = '', sub = '', closed = false, portal = 'swirl' }) {
  const group = new THREE.Group()
  const frameMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: closed ? 0.25 : 1.2, roughness: 0.35, metalness: 0.3 })
  const r = width / 2
  const post = height - r
  for (const side of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, post, 0.5), frameMat)
    p.position.set(side * (r + 0.15), post / 2, 0)
    group.add(p)
  }
  const top = new THREE.Mesh(new THREE.TorusGeometry(r + 0.15, 0.15, 10, 40, Math.PI), frameMat)
  top.position.y = post
  group.add(top)
  // the portal: an arch-shaped surface
  const shape = new THREE.Shape()
  shape.moveTo(-r, 0)
  shape.lineTo(-r, post)
  shape.absarc(0, post, r, Math.PI, 0, true)
  shape.lineTo(r, 0)
  shape.lineTo(-r, 0)
  const portalGeo = new THREE.ShapeGeometry(shape, 24)
  const mat = closed
    ? new THREE.MeshStandardMaterial({ color: '#30365a', transparent: true, opacity: 0.85, roughness: 0.6 })
    : portalMaterial(color, portal)
  const surface = new THREE.Mesh(portalGeo, mat)
  surface.position.z = -0.05
  group.add(surface)
  if (label) {
    const t = makeText(label, { size: 0.36, color: closed ? '#9aa3c7' : '#ffffff', maxWidth: width + 1.6, anchorY: 'bottom' })
    t.position.set(0, height + 0.35, 0.3)
    group.add(t)
  }
  if (sub) {
    const s = makeText(sub, { font: 'body', size: 0.22, color: closed ? '#9aa3c7' : color, maxWidth: width - 0.3 })
    s.position.set(0, post * 0.55, 0.05)
    group.add(s)
  }
  return { group, update: t => mat.uniforms && (mat.uniforms.uTime.value = t) }
}

/** A swirling portal (or a starry night, for the way back to the plaza). */
export function portalMaterial(color, kind = 'swirl') {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uStars: { value: kind === 'stars' ? 1 : 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor; uniform float uStars;
      varying vec2 vP;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec2 p = vP - vec2(0.0, 1.8);
        float r = length(p);
        float a = atan(p.y, p.x);
        vec3 c;
        if (uStars > 0.5) {
          // a small soft star in some cells of a grid, twinkling
          vec2 q = vP * 7.0;
          vec2 g = floor(q);
          vec2 off = vec2(hash(g + 1.7), hash(g + 9.2)) * 0.6 + 0.2;
          float d = length(fract(q) - off);
          float s = step(0.8, hash(g)) * smoothstep(0.07, 0.0, d) * (0.6 + 0.4 * sin(uTime * 2.0 + hash(g + 3.0) * 30.0));
          c = mix(vec3(0.02, 0.03, 0.09), vec3(0.12, 0.1, 0.3), clamp(vP.y / 4.0, 0.0, 1.0)) + vec3(s) * 1.4;
        } else {
          float swirl = sin(a * 3.0 + r * 3.2 - uTime * 1.6) * 0.5 + 0.5;
          c = mix(uColor * 0.35, uColor * 1.6, swirl * smoothstep(2.6, 0.2, r)) + uColor * 0.15;
        }
        gl_FragColor = vec4(c, 0.92);
        #include <colorspace_fragment>
      }`,
  })
}

/** A canvas as a texture (sRGB, mipmapped). draw(ctx, size). */
export function canvasTexture(size, draw, { repeat = 1 } = {}) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  draw(c.getContext('2d'), size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  if (repeat !== 1) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat, repeat)
  }
  return t
}
