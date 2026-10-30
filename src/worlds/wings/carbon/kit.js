// Pieces both carbon wings are built from: lattices as instanced balls and sticks (one draw call per
// kind, however many atoms), station lecterns whose words follow the Explorer/Scientist switch, plinths,
// soft light beams, equations with real subscripts, tapered tubes, and a small animator.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText, FONTS } from '../../../engine/text.js'
import { Text } from 'troika-three-text'

export const UP = new THREE.Vector3(0, 1, 0)
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const smooth = t => t * t * (3 - 2 * t)
export const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = t => 1 - Math.pow(1 - t, 3)

export function glowMat(color, intensity = 1.5, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4, ...extra })
}

/** Atoms and bonds as two instanced meshes. atoms: [[x, y, z]] in metres; bonds: [[i, j, order?]];
 *  double bonds become two sticks side by side (spread across `side(i, j)`, default sideways). */
export function ballStick({ atoms, bonds, atomR = 0.15, bondR = 0.05, atomMat, bondMat, seg = 16, doubles = false, side = null }) {
  const group = new THREE.Group()
  const sphere = new THREE.SphereGeometry(1, seg, Math.max(6, Math.round(seg * 0.7)))
  const cyl = new THREE.CylinderGeometry(1, 1, 1, Math.max(6, Math.round(seg * 0.6)), 1, true)
  const am = new THREE.InstancedMesh(sphere, atomMat, atoms.length)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const s = new THREE.Vector3()
  const p = new THREE.Vector3()
  atoms.forEach((a, i) => {
    m.compose(p.set(a[0], a[1], a[2]), q.identity(), s.setScalar(atomR))
    am.setMatrixAt(i, m)
  })
  const sticks = []
  for (const [i, j, order = 1] of bonds) {
    const a = new THREE.Vector3(...atoms[i])
    const b = new THREE.Vector3(...atoms[j])
    if (doubles && order === 2) {
      const dir = b.clone().sub(a).normalize()
      let off = side ? side(i, j, a, b) : new THREE.Vector3().crossVectors(dir, UP)
      if (off.lengthSq() < 1e-6) off = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(1, 0, 0))
      off.normalize().multiplyScalar(bondR * 1.5)
      sticks.push([a.clone().add(off), b.clone().add(off)], [a.clone().sub(off), b.clone().sub(off)])
    } else sticks.push([a, b])
  }
  const bm = new THREE.InstancedMesh(cyl, bondMat, sticks.length)
  const dir = new THREE.Vector3()
  sticks.forEach(([a, b], k) => {
    dir.subVectors(b, a)
    const l = dir.length()
    q.setFromUnitVectors(UP, dir.normalize())
    m.compose(p.addVectors(a, b).multiplyScalar(0.5), q, s.set(bondR, l, bondR))
    bm.setMatrixAt(k, m)
  })
  am.computeBoundingSphere()
  bm.computeBoundingSphere()
  group.add(am, bm)
  return { group, atomMesh: am, bondMesh: bm }
}

/** A lectern station: a slim stand with a dark navy screen tilted toward the reader, a glowing edge,
 *  a title and a line or two. `set({ title, line })` rewrites it (the level switch). Faces +z. */
export function standSign({ title = '', line = '', color = '#7fd4ff', width = 1.4, height = 0.84, y = 1.0, tilt = 0.7, titleSize = 0.115, lineSize = 0.072 } = {}) {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: '#2a3156', roughness: 0.35, metalness: 0.8 })
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.06, 32), metal)
  foot.position.y = 0.03
  const post = new THREE.Mesh(new RoundedBoxGeometry(0.12, y - 0.1, 0.08, 2, 0.03), metal)
  post.position.y = (y - 0.1) / 2 + 0.04
  group.add(foot, post)
  const screen = new THREE.Group()
  screen.position.set(0, y, 0)
  screen.rotation.x = -tilt
  group.add(screen)
  const edgeMat = glowMat(color, 0.7)
  const edge = new THREE.Mesh(new RoundedBoxGeometry(width + 0.05, height + 0.05, 0.05, 3, 0.02), edgeMat)
  const face = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, 0.07, 3, 0.025),
    new THREE.MeshStandardMaterial({ color: '#0b1131', roughness: 0.3, metalness: 0.25, emissive: '#0d1640', emissiveIntensity: 0.7 }),
  )
  face.position.z = 0.012
  screen.add(edge, face)
  const t = makeText(title, { size: titleSize, color, maxWidth: width - 0.18, anchorY: 'top' })
  t.position.set(0, height / 2 - 0.09, 0.052)
  const l = makeText(line, { font: 'body', size: lineSize, color: '#dde6ff', maxWidth: width - 0.2, anchorY: 'top', lineHeight: 1.22 })
  l.position.set(0, height / 2 - 0.13 - titleSize * 1.15, 0.052)
  screen.add(t, l)
  // the body sits under the title however many lines the title takes
  const place = () => {
    const b = t.textRenderInfo?.blockBounds
    if (b) l.position.y = t.position.y - (b[3] - b[1]) - 0.05
  }
  t.addEventListener('synccomplete', place)
  const gold = new THREE.Color('#ffd166')
  const base = new THREE.Color(color)
  return {
    group,
    screen,
    set({ title: tt, line: ll }) {
      if (tt !== undefined && tt !== t.text) {
        t.text = tt
        t.sync()
      }
      if (ll !== undefined && ll !== l.text) {
        l.text = ll
        l.sync()
      }
    },
    setRead(read) {
      edgeMat.color.copy(read ? gold : base)
      edgeMat.emissive.copy(read ? gold : base)
    },
  }
}

/** A museum plinth: polished dark stone, a brushed metal foot and a glowing ring under its top edge. */
export function plinth({ radius = 1, height = 0.7, color = '#7fd4ff', sides = 48, light = false } = {}) {
  const g = new THREE.Group()
  const stone = new THREE.MeshPhysicalMaterial({ color: '#121a3c', roughness: 0.22, metalness: 0.15, clearcoat: light ? 0 : 0.8, clearcoatRoughness: 0.15 })
  const metal = new THREE.MeshStandardMaterial({ color: '#3a4470', roughness: 0.42, metalness: 0.85 })
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.02, height - 0.08, sides), stone)
  body.position.y = 0.08 + (height - 0.08) / 2
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.06, radius * 1.08, 0.08, sides), metal)
  foot.position.y = 0.04
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.004, 0.018, 6, Math.max(24, sides * 2)), glowMat(color, 2))
  ring.rotation.x = Math.PI / 2
  ring.position.y = height - 0.05
  const top = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.94, sides), new THREE.MeshStandardMaterial({ color: '#0d1430', roughness: 0.18, metalness: 0.3, emissive: color, emissiveIntensity: 0.05 }))
  top.rotation.x = -Math.PI / 2
  top.position.y = height + 0.002
  g.add(body, foot, ring, top)
  return g
}

/** A soft beam of light (a fake volumetric cone): brightest at the top, fading to the floor. */
export function beam({ top = 0.25, bottom = 1.6, height = 8, color = '#bfe6ff', opacity = 0.06 } = {}) {
  const geo = new THREE.CylinderGeometry(top, bottom, height, 40, 1, true)
  geo.translate(0, -height / 2, 0)
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } },
    vertexShader: /* glsl */ `
      varying float vH; varying vec3 vN; varying vec3 vV;
      void main() {
        vH = uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOpacity;
      varying float vH; varying vec3 vN; varying vec3 vV;
      void main() {
        float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
        float a = uOpacity * edge * smoothstep(0.0, 0.85, vH) * (0.35 + 0.65 * vH);
        gl_FragColor = vec4(uColor * a, a);
      }`,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.renderOrder = 5
  return mesh
}

/** A ceiling lamp can with a spot light under it, aimed at `target` (world). */
export function spotLamp(root, { x, y, z, tx, ty = 0, tz, color = '#e8f4ff', intensity = 260, angle = 0.32, penumbra = 0.6, beamOpacity = 0.05, light = false }) {
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.34, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#1d2340', roughness: 0.4, metalness: 0.8, side: THREE.DoubleSide }))
  can.position.set(x, y + 0.17, z)
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 20), new THREE.MeshBasicMaterial({ color }))
  lens.rotation.x = Math.PI / 2
  lens.position.set(x, y + 0.01, z)
  root.add(can, lens)
  const spot = new THREE.SpotLight(color, intensity, 0, angle, penumbra, 2)
  spot.position.set(x, y, z)
  spot.target.position.set(tx, ty, tz)
  root.add(spot, spot.target)
  if (beamOpacity > 0) {
    const h = Math.hypot(tx - x, ty - y, tz - z)
    const b = beam({ top: 0.14, bottom: Math.tan(angle) * h * 0.85, height: h, color, opacity: light ? beamOpacity * 0.6 : beamOpacity })
    b.position.set(x, y, z)
    const d = new THREE.Vector3(tx - x, ty - y, tz - z).normalize()
    b.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d)
    root.add(b)
  }
  return spot
}

/** Runs timed steps: run(seconds, step(t in 0..1), done). */
export function animator() {
  const list = []
  return {
    run(duration, step, done) {
      const a = { t: 0, duration: Math.max(1e-3, duration), step, done }
      list.push(a)
      step?.(0)
      return a
    },
    update(dt) {
      for (let i = list.length - 1; i >= 0; i--) {
        const a = list[i]
        a.t = Math.min(a.duration, a.t + dt)
        a.step?.(a.t / a.duration)
        if (a.t >= a.duration) {
          list.splice(i, 1)
          a.done?.()
        }
      }
    },
    get busy() {
      return list.length > 0
    },
  }
}

/** A row of chemistry: terms are { f: 'CO2', n: 6 } (a formula with an optional count in front),
 *  '+' or '>' (an arrow, drawn: the fonts have none) or { t: 'light' } (small words over the arrow).
 *  Centred once laid out; returns a Group. */
export function equation(terms, { size = 0.3, color = '#ffffff', arrowColor = color, font = 'display' } = {}) {
  const group = new THREE.Group()
  const items = []
  const piece = (text, scale = 1, dy = 0) => {
    const t = new Text()
    Object.assign(t, { text, font: FONTS[font] ?? font, color, anchorX: 'left', anchorY: 'middle', fontSize: size * scale })
    t.position.y = dy
    group.add(t)
    return t
  }
  for (const term of terms) {
    if (term === '+') items.push({ kind: 'text', parts: [{ t: piece('+'), gap: 0 }], pad: size * 0.35 })
    else if (term === '>') {
      const arrow = new THREE.Group()
      const mat = new THREE.MeshBasicMaterial({ color: arrowColor })
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(size * 1.5, size * 0.09, size * 0.02), mat)
      shaft.position.x = size * 0.75
      const head = new THREE.Mesh(new THREE.ConeGeometry(size * 0.2, size * 0.36, 3), mat)
      head.rotation.z = -Math.PI / 2
      head.position.x = size * 1.55
      arrow.add(shaft, head)
      group.add(arrow)
      items.push({ kind: 'arrow', obj: arrow, width: size * 1.75, pad: size * 0.35 })
    } else if (term.t) {
      const t = makeText(term.t, { size: size * 0.42, color: arrowColor, font: 'body' })
      t.userData.over = true
      group.add(t)
      items.push({ kind: 'over', t })
    } else {
      const parts = []
      if (term.n) parts.push({ t: piece(String(term.n)), gap: size * 0.12 })
      for (const m of term.f.matchAll(/([A-Z][a-z]?|\(|\))|(\d+)/g)) {
        if (m[1]) parts.push({ t: piece(m[1]), gap: 0 })
        else parts.push({ t: piece(m[2], 0.62, -size * 0.28), gap: 0 })
      }
      items.push({ kind: 'text', parts, pad: size * 0.35 })
    }
  }
  const texts = items.flatMap(i => (i.kind === 'text' ? i.parts.map(p => p.t) : []))
  let left = texts.length
  const layout = () => {
    let x = 0
    let lastArrow = null
    for (const it of items) {
      if (it.kind === 'over') {
        if (lastArrow) it.t.position.set(lastArrow.x + lastArrow.w / 2, size * 0.42, 0)
        continue
      }
      if (x > 0) x += it.pad
      if (it.kind === 'arrow') {
        it.obj.position.x = x
        lastArrow = { x, w: it.width }
        x += it.width
      } else {
        for (const p of it.parts) {
          p.t.position.x = x
          const b = p.t.textRenderInfo?.blockBounds
          x += (b ? b[2] - b[0] : size * 0.6) + p.gap
        }
      }
    }
    for (const c of group.children) c.position.x -= x / 2
    group.userData.width = x
  }
  for (const t of texts) {
    t.sync(() => {
      if (--left === 0) layout()
    })
  }
  if (!texts.length) layout()
  return group
}

/** A tube along points whose radius goes from r0 to r1 (branches, a tusk, a pencil line). */
export function taperedTube(points, r0, r1, { radial = 10, segments = null, closed = false, flare = null } = {}) {
  const curve = points instanceof THREE.Curve ? points : new THREE.CatmullRomCurve3(points, false, 'centripetal')
  const n = segments ?? Math.max(4, Math.round(curve.getLength() * 6))
  const frames = curve.computeFrenetFrames(n, closed)
  const pos = []
  const nor = []
  const uv = []
  const idx = []
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const P = curve.getPointAt(u)
    let r = r0 + (r1 - r0) * u
    if (flare) r *= flare(u)
    const N = frames.normals[i]
    const B = frames.binormals[i]
    for (let j = 0; j <= radial; j++) {
      const v = (j / radial) * Math.PI * 2
      const cx = -Math.cos(v)
      const cy = Math.sin(v)
      const nx = cx * N.x + cy * B.x
      const ny = cx * N.y + cy * B.y
      const nz = cx * N.z + cy * B.z
      pos.push(P.x + r * nx, P.y + r * ny, P.z + r * nz)
      nor.push(nx, ny, nz)
      uv.push(j / radial, u)
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j
      const b = (i + 1) * (radial + 1) + j
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  return g
}

/** When the prompt's words change while the walker stands at the same exhibit, show them at once. */
export function refreshPrompt(ctx, it) {
  if (ctx.engine.player.near === it) ctx.store.set({ prompt: { id: it.id, label: it.label, verb: it.verb } })
}

/** Every frame: the prompt follows an exhibit whose words changed by themselves (someone else in the
 *  room used it: src/net/shared.js). */
export function promptSync(ctx, list) {
  let last = ''
  return () => {
    const it = ctx.engine.player.near
    const key = it && list.includes(it) ? `${it.id}|${it.label}|${it.verb}` : ''
    if (key === last) return
    last = key
    if (key) refreshPrompt(ctx, it)
  }
}

/** Something that only happens (a pulse of light, a kick), shared in a room as a count
 *  (src/net/shared.js): the world calls did() after its visitor did it; get/set are its part of the
 *  world's `shared`, which plays it when someone else's count changes and only takes the count for a
 *  newcomer. */
export function happening(play) {
  let n = 0
  return {
    did() {
      n++
    },
    get: () => ({ n }),
    set(s, live) {
      const m = Math.max(0, Math.round(Number(s?.n) || 0))
      if (live && m !== n) play()
      n = m
    },
  }
}

/** Calls fn(level) now and whenever the Explorer/Scientist switch changes; returns the unsubscribe. */
export function onLevel(ctx, fn) {
  let last = ctx.level()
  fn(last)
  return ctx.store.subscribe(s => {
    if (s.level !== last) {
      last = s.level
      fn(last)
    }
  })
}

/** Picks the words for a level: { kid, sci } -> one of them. */
export const pick = (o, level) => (o && typeof o === 'object' && 'kid' in o ? (level === 'scientist' ? o.sci ?? o.kid : o.kid) : o)

/** A canvas texture that is drawn once (sRGB, mipmapped). */
export function paint(w, h, draw, { repeat = null, srgb = true } = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
  }
  return t
}

/** Where the third-person camera looks (the player's head) and how wide a channel to clear toward it:
 *  shared by every material made with nearFade; a world sets it each frame with keepPlayerInView. */
export const FADE = { uFadeTarget: { value: new THREE.Vector3() }, uFadeRadius: { value: 0 } }

/** Each frame: in third person, clear a channel between the camera and the player (radius `r`); in
 *  first person nothing (only what touches the camera dissolves). */
export function keepPlayerInView(ctx, avatar, r = 0.85) {
  const p = ctx.engine.player
  if (p.mode === 'third' && avatar) {
    FADE.uFadeTarget.value.set(p.pos.x, p.pos.y + (avatar.body.hover ?? 0) + avatar.body.height * 0.6, p.pos.z)
    FADE.uFadeRadius.value = r
  } else FADE.uFadeRadius.value = 0
}

/** Dissolve a material (dithered) where it stands between the third-person camera and the player, or
 *  within `near` metres of the camera, so bars of a tunnel or a cage never hide the player. Keeps any
 *  onBeforeCompile the material already has. */
export function nearFade(mat, near = 0.7) {
  const prev = mat.onBeforeCompile
  const prevKey = mat.customProgramCacheKey === THREE.Material.prototype.customProgramCacheKey ? null : mat.customProgramCacheKey.bind(mat)
  mat.onBeforeCompile = (sh, renderer) => {
    prev.call(mat, sh, renderer)
    Object.assign(sh.uniforms, FADE, { uFadeNear: { value: near } })
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vNfWorld;')
      .replace('#include <project_vertex>', `#include <project_vertex>
        #ifdef USE_INSTANCING
          vNfWorld = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        #else
          vNfWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif`)
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vNfWorld;\nuniform float uFadeNear;\nuniform vec3 uFadeTarget;\nuniform float uFadeRadius;')
      .replace('void main() {', `void main() {
        {
          float keep = smoothstep(uFadeNear * 0.4, uFadeNear, distance(vNfWorld, cameraPosition));
          if (uFadeRadius > 0.0) {
            vec3 ab = uFadeTarget - cameraPosition;
            float l2 = max(dot(ab, ab), 1e-4);
            vec3 ap = vNfWorld - cameraPosition;
            float t = dot(ap, ab) / l2;
            if (t > 0.0 && t < 1.0) {
              float d = length(ap - ab * t);
              // the channel narrows toward the player, so what stands right beside it stays
              float r = uFadeRadius * mix(1.0, 0.55, t);
              keep = min(keep, smoothstep(r * 0.6, r, d));
            }
          }
          if (keep < 1.0) {
            float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
            if (n > keep) discard;
          }
        }`)
  }
  mat.customProgramCacheKey = () => `${prevKey ? prevKey() : 'std'}|nf${near}`
  return mat
}
