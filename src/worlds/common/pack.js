// Points filling a ball evenly: a nucleus's protons and neutrons (the atriums' big atom, the Atom Forge).
// Each point's direction comes from the R2 sequence (two independent low-discrepancy numbers, Roberts
// 2018), its depth from the cube root of its rank, so the ball fills evenly from the middle out. (A
// golden-angle spiral ties a point's height to its angle: every direction then lies on one curve, and a
// big nucleus drew as a crescent.)
import * as THREE from 'three'

const A1 = 0.7548776662466927
const A2 = 0.5698402909980532

/** n points in a ball of radius r, the first ones in the middle. */
export function packBall(n, r) {
  const out = []
  for (let i = 0; i < n; i++) {
    const rad = r * Math.cbrt((i + 0.5) / n)
    const y = 1 - 2 * ((0.5 + i * A1) % 1)
    const a = Math.PI * 2 * ((0.5 + i * A2) % 1)
    const s = Math.sqrt(Math.max(0, 1 - y * y))
    out.push(new THREE.Vector3(Math.cos(a) * s * rad, y * rad, Math.sin(a) * s * rad))
  }
  return out
}
