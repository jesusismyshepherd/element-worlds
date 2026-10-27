// Solids of a walking world, on the ground plane (x, z) with a height range [y0, y1]. A walker is a
// circle between its feet and its head. A solid whose top is no higher than a step above the feet is
// ground to stand on (a stair, a plinth), any other one in the walker's height range is a wall.
// Rotation follows three.js: a box with rot = r is a mesh with rotation.y = r.

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

export function box(x, z, w, d, { rot = 0, y0 = 0, y1 = 50 } = {}) {
  return { kind: 'box', x, z, hw: w / 2, hd: d / 2, cos: Math.cos(rot), sin: Math.sin(rot), y0, y1 }
}

export function circle(x, z, r, { y0 = 0, y1 = 50 } = {}) {
  return { kind: 'circle', x, z, r, y0, y1 }
}

/** The four walls of a rectangular room (inside x0..x1, z0..z1), `t` thick, with openings
 *  [{ side: 'n'|'s'|'e'|'w', at, width }] for doors. */
export function roomWalls(x0, x1, z0, z1, openings = [], t = 1) {
  const out = []
  const side = (name, a0, a1, make) => {
    const gaps = openings.filter(o => o.side === name).map(o => [o.at - o.width / 2, o.at + o.width / 2])
      .sort((p, q) => p[0] - q[0])
    let from = a0
    for (const [g0, g1] of gaps) {
      if (g0 > from) out.push(make(from, g0))
      from = Math.max(from, g1)
    }
    if (from < a1) out.push(make(from, a1))
  }
  side('n', x0 - t, x1 + t, (a, b) => box((a + b) / 2, z0 - t / 2, b - a, t))
  side('s', x0 - t, x1 + t, (a, b) => box((a + b) / 2, z1 + t / 2, b - a, t))
  side('w', z0, z1, (a, b) => box(x0 - t / 2, (a + b) / 2, t, b - a))
  side('e', z0, z1, (a, b) => box(x1 + t / 2, (a + b) / 2, t, b - a))
  return out
}

const toLocal = (s, x, z) => {
  const dx = x - s.x
  const dz = z - s.z
  return [dx * s.cos - dz * s.sin, dx * s.sin + dz * s.cos]
}

function inside(s, x, z, margin = 0) {
  if (s.kind === 'circle') return Math.hypot(x - s.x, z - s.z) < s.r + margin
  const [lx, lz] = toLocal(s, x, z)
  return Math.abs(lx) < s.hw + margin && Math.abs(lz) < s.hd + margin
}

/** Push the walker at p (x, z changed in place) out of every wall it overlaps. */
export function pushOut(p, radius, feet, head, solids, step = 0.35) {
  for (let pass = 0; pass < 3; pass++) {
    let moved = false
    for (const s of solids) {
      if (s.y1 <= feet + step || s.y0 >= head) continue
      if (s.kind === 'circle') {
        const dx = p.x - s.x
        const dz = p.z - s.z
        const d = Math.hypot(dx, dz)
        const min = s.r + radius
        if (d >= min) continue
        if (d < 1e-6) p.x += min
        else {
          p.x += (dx / d) * (min - d)
          p.z += (dz / d) * (min - d)
        }
        moved = true
        continue
      }
      const [lx, lz] = toLocal(s, p.x, p.z)
      const cx = clamp(lx, -s.hw, s.hw)
      const cz = clamp(lz, -s.hd, s.hd)
      const ox = lx - cx
      const oz = lz - cz
      const d = Math.hypot(ox, oz)
      let nx
      let nz
      let push
      if (d > 1e-6) {
        if (d >= radius) continue
        nx = ox / d
        nz = oz / d
        push = radius - d
      } else {
        const px = s.hw - Math.abs(lx)
        const pz = s.hd - Math.abs(lz)
        if (px < pz) {
          nx = Math.sign(lx) || 1
          nz = 0
          push = px + radius
        } else {
          nx = 0
          nz = Math.sign(lz) || 1
          push = pz + radius
        }
      }
      p.x += (nx * s.cos + nz * s.sin) * push
      p.z += (-nx * s.sin + nz * s.cos) * push
      moved = true
    }
    if (!moved) break
  }
}

/** The ground under (x, z) for feet at `feet`: the world's floor, or the top of a solid no higher than
 *  a step above the feet. */
export function groundAt(x, z, feet, solids, floor, step = 0.35) {
  let g = floor ? floor(x, z) : 0
  for (const s of solids) {
    if (s.y1 > g && s.y1 <= feet + step && inside(s, x, z)) g = s.y1
  }
  return g
}
