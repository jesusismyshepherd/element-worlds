// Neon tubes in 3D: a round glass tube swept along the strokes of tubeFont.js (corners bent round as a
// glass bender bends them, open ends closed by round caps), and a sign made of them that lights glyph
// by glyph. One material per glyph, all of the same kind, so they share one shader program; when lit
// the glyph's emissive takes the gas's colour (the engine's bloom makes the glow). In the light mode
// (no bloom) a wider, faint additive tube round each glyph stands in for the glow.
import * as THREE from 'three'
import { layoutText } from './tubeFont.js'

/** A stroke's points with its corners rounded (a quadratic bend of `fillet` units each side). */
export function rounded(pts, closed, fillet) {
  const p = []
  for (const q of pts) {
    const last = p[p.length - 1]
    if (!last || Math.hypot(q[0] - last[0], q[1] - last[1]) > 1e-4) p.push(q)
  }
  if (closed && p.length > 2 && Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]) < 1e-4) p.pop()
  const n = p.length
  if (n < 3) return p
  const out = []
  for (let i = 0; i < n; i++) {
    if (!closed && (i === 0 || i === n - 1)) {
      out.push(p[i])
      continue
    }
    const a = p[(i - 1 + n) % n]
    const b = p[i]
    const c = p[(i + 1) % n]
    const ux = b[0] - a[0]
    const uy = b[1] - a[1]
    const lu = Math.hypot(ux, uy)
    const vx = c[0] - b[0]
    const vy = c[1] - b[1]
    const lv = Math.hypot(vx, vy)
    if ((ux * vx + uy * vy) / (lu * lv) > 0.97) {
      out.push(b) // nearly straight (the points of an arc): kept as they are
      continue
    }
    const d = Math.min(fillet, lu * 0.45, lv * 0.45)
    const p0 = [b[0] - (ux / lu) * d, b[1] - (uy / lu) * d]
    const p2 = [b[0] + (vx / lv) * d, b[1] + (vy / lv) * d]
    for (let j = 0; j <= 5; j++) {
      const t = j / 5
      const s = 1 - t
      out.push([s * s * p0[0] + 2 * s * t * b[0] + t * t * p2[0], s * s * p0[1] + 2 * s * t * b[1] + t * t * p2[1]])
    }
  }
  return out
}

/** Appends a tube along a planar stroke (z = 0) to the arrays: rings of `radial` vertices, outward
 *  facing, with round caps on open ends. */
function sweep(pts, closed, radius, radial, pos, nor, idx) {
  const n = pts.length
  if (n < 2) return
  const T = pts.map((_, i) => {
    const a = closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)]
    const b = closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)]
    const tx = b[0] - a[0]
    const ty = b[1] - a[1]
    const l = Math.hypot(tx, ty) || 1
    return [tx / l, ty / l]
  })
  const ring = (cx, cy, t, k, push) => {
    // k: 0 on the tube, >0 rings of a cap pulled along `push` (-1 back, +1 forward); returns its first index
    const first = pos.length / 3
    const phi = (k * Math.PI) / 6
    for (let j = 0; j < radial; j++) {
      const th = (j / radial) * Math.PI * 2
      const nx = -t[1] * Math.cos(th)
      const ny = t[0] * Math.cos(th)
      const nz = Math.sin(th)
      const dx = nx * Math.cos(phi) + t[0] * push * Math.sin(phi)
      const dy = ny * Math.cos(phi) + t[1] * push * Math.sin(phi)
      const dz = nz * Math.cos(phi)
      pos.push(cx + dx * radius, cy + dy * radius, dz * radius)
      nor.push(dx, dy, dz)
    }
    return first
  }
  const tip = (cx, cy, t, push) => {
    pos.push(cx + t[0] * push * radius, cy + t[1] * push * radius, 0)
    nor.push(t[0] * push, t[1] * push, 0)
    return pos.length / 3 - 1
  }
  const quad = (r0, r1) => {
    for (let j = 0; j < radial; j++) {
      const a = r0 + j
      const b = r1 + j
      const c = r1 + ((j + 1) % radial)
      const d = r0 + ((j + 1) % radial)
      idx.push(a, c, b, a, d, c)
    }
  }
  const rings = pts.map((p, i) => ring(p[0], p[1], T[i], 0, 0))
  for (let i = 0; i < n - 1; i++) quad(rings[i], rings[i + 1])
  if (closed) quad(rings[n - 1], rings[0])
  else {
    // the start cap, behind the first ring: tip, then two rings, then the tube
    const s = pts[0]
    const c1 = ring(s[0], s[1], T[0], 1, -1)
    const c2 = ring(s[0], s[1], T[0], 2, -1)
    const t0 = tip(s[0], s[1], T[0], -1)
    quad(c1, rings[0])
    quad(c2, c1)
    for (let j = 0; j < radial; j++) idx.push(t0, c2 + ((j + 1) % radial), c2 + j)
    // the end cap
    const e = pts[n - 1]
    const e1 = ring(e[0], e[1], T[n - 1], 1, 1)
    const e2 = ring(e[0], e[1], T[n - 1], 2, 1)
    const t1 = tip(e[0], e[1], T[n - 1], 1)
    quad(rings[n - 1], e1)
    quad(e1, e2)
    for (let j = 0; j < radial; j++) idx.push(e2 + j, e2 + ((j + 1) % radial), t1)
  }
}

/** One BufferGeometry of tubes along strokes ([{ pts, closed }] in units, scaled by `scale`). */
export function tubeGeometry(strokes, { scale = 1, radius = 0.02, radial = 8, fillet = 0.35 } = {}) {
  const pos = []
  const nor = []
  const idx = []
  for (const st of strokes) {
    const pts = rounded(st.pts, st.closed, fillet).map(([x, y]) => [x * scale, y * scale])
    sweep(pts, st.closed, radius, radial, pos, nor, idx)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setIndex(idx)
  g.computeBoundingSphere()
  return g
}

// unlit tubing is clear glass: dark, with highlights (a light grey reads as a lit white tube)
const GLASS = '#3c424f'

/** How strongly a colour should glow so every gas looks about as bright: a white glow (krypton) has
 *  three times the luminance of neon's red and would bloom far wider at the same emissive intensity. */
export function glowNorm(c) {
  const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b // linear
  return Math.min(1.2, Math.max(0.6, Math.sqrt(0.35 / Math.max(lum, 0.05))))
}

/** A sign of bent tubes: `text` in tubeFont, capitals `cap` metres tall, standing on y = 0 at its
 *  baseline, centred on x = 0 (or from x = 0 with align 'left'), facing +z, held `standoff` metres in
 *  front of a wall at z = 0 by small posts. Each glyph lights on its own: setGlow(i, k), k 0..1. */
export function neonSign({
  text = '', cap = 0.6, radius = 0.016, light = false, color = '#ff5a3c', glass = GLASS, standoff = 0.06, posts = true,
  // (without bloom, a strong emissive washes every gas to white under tone mapping: the light mode
  // keeps it lower and lets the halo carry the colour)
  postMat = null, maxWidth = Infinity, align = 'center', emissive = light ? 1.2 : 3.2, radial = light ? 6 : 10,
} = {}) {
  const group = new THREE.Group()
  const holder = new THREE.Group()
  holder.position.z = standoff
  group.add(holder)
  const glow = new THREE.Color(color)
  const glassC = new THREE.Color(glass)
  const postMaterial = postMat ?? new THREE.MeshStandardMaterial({ color: '#2a2d35', roughness: 0.6, metalness: 0.4 })
  const postGeo = new THREE.CylinderGeometry(1, 1, 1, 8).rotateX(Math.PI / 2)
  let glyphs = []
  let width = 0
  let scale = cap / 6
  let postsMesh = null

  const clear = () => {
    for (const g of glyphs) {
      holder.remove(g.mesh)
      g.mesh.geometry.dispose()
      g.mat.dispose()
      if (g.halo) {
        holder.remove(g.halo)
        g.halo.geometry.dispose()
        g.halo.material.dispose()
      }
    }
    glyphs = []
    if (postsMesh) {
      group.remove(postsMesh)
      postsMesh.dispose()
      postsMesh = null
    }
  }

  const build = txt => {
    clear()
    const lay = layoutText(txt)
    scale = cap / 6
    if (lay.width * scale > maxWidth) scale = maxWidth / lay.width
    width = lay.width * scale
    const x0 = align === 'center' ? -width / 2 : 0
    holder.position.x = x0
    const r = radius * (scale / (cap / 6)) ** 0.5
    const postAt = []
    for (const gl of lay.glyphs) {
      if (!gl.strokes.length) continue
      const geo = tubeGeometry(gl.strokes, { scale, radius: r, radial })
      const mat = new THREE.MeshStandardMaterial({ color: glassC.clone(), roughness: 0.12, metalness: 0.1, emissive: glow.clone(), emissiveIntensity: 0 })
      const mesh = new THREE.Mesh(geo, mat)
      holder.add(mesh)
      let halo = null
      if (light) {
        halo = new THREE.Mesh(
          tubeGeometry(gl.strokes, { scale, radius: r * 3.2, radial: 6 }),
          new THREE.MeshBasicMaterial({ color: glow.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
        )
        halo.renderOrder = 4
        holder.add(halo)
      }
      glyphs.push({ ch: gl.ch, mesh, mat, halo, k: 0, c: glow.clone() })
      if (posts) {
        // two posts a stroke, at a third and two thirds of its points
        for (const st of gl.strokes) {
          const p = st.pts
          if (p.length < 2) continue
          for (const f of p.length > 3 ? [0.25, 0.75] : [0.5]) {
            const q = p[Math.min(p.length - 1, Math.floor(f * (p.length - 1)))]
            postAt.push([q[0] * scale + x0, q[1] * scale])
          }
        }
      }
    }
    if (postAt.length) {
      postsMesh = new THREE.InstancedMesh(postGeo, postMaterial, postAt.length)
      const m = new THREE.Matrix4()
      const s = new THREE.Vector3(r * 0.45, r * 0.45, standoff)
      const q = new THREE.Quaternion()
      postAt.forEach(([x, y], i) => postsMesh.setMatrixAt(i, m.compose(new THREE.Vector3(x, y, standoff / 2), q, s)))
      group.add(postsMesh)
    }
    for (let i = 0; i < glyphs.length; i++) apply(i)
  }

  const apply = i => {
    const g = glyphs[i]
    g.mat.emissive.copy(g.c)
    g.mat.emissiveIntensity = g.k * emissive * glowNorm(g.c)
    g.mat.color.copy(glassC).lerp(g.c, g.k * 0.5)
    if (g.halo) {
      g.halo.material.color.copy(g.c)
      g.halo.material.opacity = g.k * 0.3
    }
  }

  build(text)
  return {
    group,
    get width() {
      return width
    },
    get height() {
      return cap
    },
    get count() {
      return glyphs.length
    },
    setText(txt) {
      build(txt)
    },
    setColor(c) {
      glow.set(c)
      for (let i = 0; i < glyphs.length; i++) {
        glyphs[i].c.copy(glow)
        apply(i)
      }
    },
    /** One glyph in its own colour (a coated tube). */
    setGlyphColor(i, c) {
      if (!glyphs[i]) return
      glyphs[i].c.set(c)
      apply(i)
    },
    /** Glyph i's glow, 0 (dark glass) to 1 (lit). */
    setGlow(i, k) {
      if (!glyphs[i]) return
      glyphs[i].k = k
      apply(i)
    },
    setAll(k) {
      for (let i = 0; i < glyphs.length; i++) {
        glyphs[i].k = k
        apply(i)
      }
    },
    glow: i => glyphs[i]?.k ?? 0,
    dispose() {
      clear()
      postGeo.dispose()
    },
  }
}
