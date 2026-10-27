import { test } from 'node:test'
import assert from 'node:assert/strict'
import { box, circle, roomWalls, pushOut, groundAt } from './collide.js'

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`)

test('a walker is pushed out of a circle and out of a box', () => {
  const p = { x: 0.5, z: 0 }
  pushOut(p, 0.3, 0, 1.5, [circle(0, 0, 0.5)])
  near(Math.hypot(p.x, p.z), 0.8)
  const q = { x: 1.2, z: 0 }
  pushOut(q, 0.3, 0, 1.5, [box(0, 0, 2, 2)])
  near(q.x, 1.3)
})

test('a rotated box is solid along its own axes', () => {
  // a 4 x 1 box turned a quarter: it now runs along z
  const s = box(0, 0, 4, 1, { rot: Math.PI / 2 })
  const p = { x: 0, z: 1.5 }
  pushOut(p, 0.3, 0, 1.5, [s])
  near(p.z, 1.5)
  const q = { x: 0.6, z: 1 }
  pushOut(q, 0.3, 0, 1.5, [s])
  near(q.x, 0.8)
})

test('a low solid is a step, not a wall; a high one is a wall', () => {
  const step = box(0, 0, 2, 2, { y1: 0.3 })
  const p = { x: 0.5, z: 0 }
  pushOut(p, 0.3, 0, 1.5, [step])
  near(p.x, 0.5)
  near(groundAt(0.5, 0, 0, [step], null), 0.3)
  near(groundAt(0.5, 0, 0, [box(0, 0, 2, 2, { y1: 1 })], null), 0)
})

test('room walls leave the doors open', () => {
  const walls = roomWalls(-8, 8, -8, 8, [{ side: 's', at: 0, width: 3 }])
  const inDoor = { x: 0, z: 8.2 }
  pushOut(inDoor, 0.3, 0, 1.5, walls)
  near(inDoor.z, 8.2)
  const atWall = { x: 4, z: 8.2 }
  pushOut(atWall, 0.3, 0, 1.5, walls)
  near(atWall.z, 7.7)
})
