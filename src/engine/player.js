// The walker in the walking worlds (the atrium and the wings), in two modes:
// - 'third': you play the element's Atomling, seen from behind. Driven like the arena's creatures
//   (W forward, S back, A and D turn; the stick the same); a drag turns and tilts the view, which comes
//   back behind the character when you walk on.
// - 'first': you are the visitor (a ten-year-old's eye height); W and S walk, A and D step sideways, a
//   drag looks round. The Atomling stays where it was, turns to you and waves when you come close.
// Facing: yaw 0 looks along -z; a model faces +z, so it is turned by yaw + PI.
import * as THREE from 'three'
import { pushOut, groundAt } from './collide.js'

const GRAVITY = 20
const STEP = 0.35
export const VISITOR = { height: 1.45, eye: 1.32, radius: 0.28, walk: 1.7, run: 3.8, jump: 0.55, hover: 0 }

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const damp = (from, to, rate, dt) => to + (from - to) * Math.exp(-rate * dt)
const forward = yaw => [-Math.sin(yaw), -Math.cos(yaw)]

export class Player {
  constructor(engine) {
    this.engine = engine
    this.mode = 'third'
    this.pos = new THREE.Vector3()
    this.vy = 0
    this.grounded = true
    this.yaw = 0
    this.pitch = -0.08
    this.camOffset = 0
    this.camPitch = -0.3
    this.camDist = 4.2
    this.speed = 0
    this.avatar = null
    this.npc = null // where the Atomling stands while you walk in first person
    this.camPos = new THREE.Vector3()
    this.camSnap = true
    this.near = null
    this.doorWait = 0
  }

  body() {
    return this.mode === 'third' && this.avatar ? this.avatar.body : VISITOR
  }

  /** Put the walker at a spawn point { x, z, yaw }. */
  place(spawn, world) {
    const b = this.body()
    this.pos.set(spawn.x, 0, spawn.z)
    this.pos.y = groundAt(spawn.x, spawn.z, 50, world.solids ?? [], world.floor, 100)
    this.yaw = spawn.yaw ?? 0
    this.pitch = -0.08
    this.camOffset = 0
    this.vy = 0
    this.speed = 0
    this.camSnap = true
    this.doorWait = 1.2
    this.world = world
    this.npc = this.mode === 'first' ? this.hostSpot() : null
    if (this.avatar) this.avatar.root.position.copy(this.pos)
    this.camDist = clamp(b.height * 3.4, 3, 7)
  }

  /** Where the Atomling waits while you walk in first person: the world's spot for it, else in front
   *  of you, facing you. */
  hostSpot() {
    const h = this.world?.hostSpot
    if (h) return { x: h.x, z: h.z, y: h.y ?? 0, yaw: h.yaw ?? 0 }
    const [fx, fz] = forward(this.yaw)
    return { x: this.pos.x + fx * 2.5, z: this.pos.z + fz * 2.5, y: this.pos.y, yaw: this.yaw + Math.PI }
  }

  setAvatar(avatar) {
    this.avatar = avatar
    if (avatar && this.mode === 'first' && !this.npc) this.npc = this.hostSpot()
    if (avatar) {
      avatar.root.position.copy(this.pos)
      avatar.root.rotation.y = this.yaw + Math.PI
      this.camDist = clamp(avatar.body.height * 3.4, 3, 7)
    }
    this.applyMode()
  }

  setMode(mode, world) {
    if (mode === this.mode) return
    if (mode === 'first' && this.avatar) {
      // step out behind the Atomling, where the camera was, and let it stand there
      this.npc = { x: this.pos.x, z: this.pos.z, y: this.pos.y, yaw: this.yaw }
      const [fx, fz] = forward(this.yaw)
      const p = { x: this.pos.x - fx * 1.6, z: this.pos.z - fz * 1.6 }
      pushOut(p, VISITOR.radius, this.pos.y, this.pos.y + VISITOR.height, world?.solids ?? [], STEP)
      this.pos.x = p.x
      this.pos.z = p.z
      this.pitch = -0.12
    } else if (mode === 'third' && this.avatar) {
      // the Atomling comes to where you stand
      this.npc = null
      this.avatar.poof?.()
    }
    this.mode = mode
    this.camSnap = true
    this.applyMode()
  }

  applyMode() {
    if (this.avatar) this.avatar.root.visible = true
  }

  update(dt, world, input, time) {
    const cam = this.engine.camera
    const b = this.body()
    const look = input.takeLook()
    const wheel = input.takeWheel()
    const { forward: fw, side, run } = input.axes()
    this.doorWait = Math.max(0, this.doorWait - dt)

    // looking
    if (this.mode === 'first') {
      this.yaw -= look.dx * 0.0038
      this.pitch = clamp(this.pitch - look.dy * 0.0032, -1.25, 1.2)
    } else {
      this.camOffset -= look.dx * 0.0055
      this.camPitch = clamp(this.camPitch - look.dy * 0.004, -1.15, 0.2)
      if (wheel) this.camDist = clamp(this.camDist * (wheel > 0 ? 1.12 : 0.89), 1.8, 12)
      const idle = performance.now() - input.lastLook > 1400
      if (idle && !input.dragging && Math.abs(fw) > 0.1) this.camOffset = damp(this.camOffset, 0, 2.2, dt)
    }

    // moving
    let vx = 0
    let vz = 0
    const top = run ? b.run : b.walk
    if (this.mode === 'first') {
      const [fx, fz] = forward(this.yaw)
      const len = Math.min(1, Math.hypot(fw, side))
      if (len > 0.05) {
        const mx = fx * fw + fz * side
        const mz = fz * fw - fx * side
        const m = Math.hypot(mx, mz) || 1
        this.speed = damp(this.speed, top * len, 10, dt)
        vx = (mx / m) * this.speed
        vz = (mz / m) * this.speed
      } else this.speed = damp(this.speed, 0, 12, dt)
    } else {
      this.yaw += side * 2.6 * dt * (run ? 1.15 : 1)
      const want = fw >= 0 ? top * fw : b.walk * 0.6 * fw
      this.speed = damp(this.speed, want, 8, dt)
      const [fx, fz] = forward(this.yaw)
      vx = fx * this.speed
      vz = fz * this.speed
    }
    const solids = world.solids ?? []
    const p = { x: this.pos.x + vx * dt, z: this.pos.z + vz * dt }
    pushOut(p, b.radius, this.pos.y, this.pos.y + b.height, solids, STEP)
    this.pos.x = p.x
    this.pos.z = p.z

    // up and down
    const ground = groundAt(this.pos.x, this.pos.z, this.pos.y, solids, world.floor, STEP)
    if (input.took('Space') && this.grounded) {
      this.vy = Math.sqrt(2 * GRAVITY * b.jump)
      this.grounded = false
      this.avatar?.hop?.()
    }
    if (!this.grounded || this.vy > 0 || this.pos.y - ground > STEP) {
      this.vy -= GRAVITY * dt
      this.pos.y += this.vy * dt
      if (this.pos.y <= ground) {
        this.pos.y = ground
        this.vy = 0
        this.grounded = true
      } else this.grounded = false
    } else {
      this.pos.y = ground
      this.grounded = true
    }

    // the Atomling: played, or standing by
    const av = this.avatar
    if (av) {
      if (this.mode === 'third') {
        av.root.position.copy(this.pos)
        av.root.rotation.y = this.yaw + Math.PI
        av.update(dt, time, { speed: Math.abs(this.speed), run, grounded: this.grounded, turning: side })
      } else {
        const n = this.npc
        const dx = this.pos.x - n.x
        const dz = this.pos.z - n.z
        const d = Math.hypot(dx, dz)
        if (d < 7) n.yaw = damp(n.yaw, Math.atan2(-dx, -dz), 4, dt)
        av.root.position.set(n.x, n.y, n.z)
        av.root.rotation.y = n.yaw + Math.PI
        if (d < 2.6 && !n.waved) {
          n.waved = true
          av.wave?.()
        } else if (d > 4) n.waved = false
        av.update(dt, time, { speed: 0, run: false, grounded: true, turning: 0 })
      }
    }

    this.placeCamera(dt, world, b, cam)
    this.findNear(world)
    this.checkDoors(world)
  }

  placeCamera(dt, world, b, cam) {
    if (this.mode === 'first') {
      cam.position.set(this.pos.x, this.pos.y + b.eye, this.pos.z)
      cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ')
      this.camSnap = false
      return
    }
    const target = new THREE.Vector3(this.pos.x, this.pos.y + b.height * 0.8, this.pos.z)
    const yaw = this.yaw + this.camOffset
    const cp = Math.cos(this.camPitch)
    const want = new THREE.Vector3(
      target.x + Math.sin(yaw) * cp * this.camDist,
      target.y - Math.sin(this.camPitch) * this.camDist,
      target.z + Math.cos(yaw) * cp * this.camDist,
    )
    const bounds = world.cameraBounds
    if (bounds) {
      want.x = clamp(want.x, bounds.minX, bounds.maxX)
      want.y = clamp(want.y, bounds.minY, bounds.maxY)
      want.z = clamp(want.z, bounds.minZ, bounds.maxZ)
    }
    if (this.camSnap) this.camPos.copy(want)
    else this.camPos.lerp(want, 1 - Math.exp(-dt * 9))
    this.camSnap = false
    cam.position.copy(this.camPos)
    cam.lookAt(target)
  }

  /** The nearest thing to use within its reach, for the prompt (E, or the button). */
  findNear(world) {
    let best = null
    let bestD = Infinity
    for (const it of world.interactables ?? []) {
      const d = Math.hypot(it.x - this.pos.x, it.z - this.pos.z)
      if (d < (it.radius ?? 2) && d < bestD) {
        best = it
        bestD = d
      }
    }
    if (best !== this.near) {
      this.near = best
      this.engine.store.set({ prompt: best ? { id: best.id, label: best.label, verb: best.verb } : null })
    }
  }

  use() {
    this.near?.onUse?.()
  }

  checkDoors(world) {
    if (this.doorWait > 0) return
    for (const d of world.doors ?? []) {
      if (Math.hypot(d.x - this.pos.x, d.z - this.pos.z) < d.radius) {
        this.doorWait = 2
        this.engine.go(d.to)
        return
      }
    }
  }
}
