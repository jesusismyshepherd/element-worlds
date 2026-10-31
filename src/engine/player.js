// The walker in the walking worlds (the atrium and the wings), in two modes:
// - 'third': you play the element's Atomling, seen from behind. Driven like the arena's creatures
//   (W forward, S back, A and D turn; the stick the same); a drag turns and tilts the view, which comes
//   back behind the character when you walk on.
// - 'first': you are the visitor (a ten-year-old's eye height); driven the same way (W and S walk, A and
//   D turn; the user found stepping sideways awkward), a drag looks round. The Atomling stays where it
//   was, turns to you and waves when you come close.
// Third person tilts the camera round the Atomling from above to a little below it; tilted further up,
// the camera stays and looks up (the floor stopped it at 11 degrees before). A pinch (phones) or the
// wheel brings it nearer or farther.
// Using a station that has a `focus` ({ x, y, z, size }) in third person, the view eases into the
// Atomling's eyes and looks at it (the user, 2026-10-30: from behind, the details of a bench could not be
// seen); walking on, looking round by hand or closing the panel brings it back behind the Atomling.
// `dive(point, normal, then)` flies the view into a picture (a hall's doorway board), then calls `then`.
// Facing: yaw 0 looks along -z; a model faces +z, so it is turned by yaw + PI.
import * as THREE from 'three'
import { pushOut, groundAt, segmentFree } from './collide.js'

const GRAVITY = 20
const STEP = 0.35
export const VISITOR = { height: 1.45, eye: 1.32, radius: 0.28, walk: 1.7, run: 3.8, jump: 0.55, hover: 0 }
// how far past the lowest swing the third-person view may look up
const AIM_UP = 0.75
// on a phone the character stands nearer (a small screen made it a speck)
const touchScreen = () => typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches
const camDistFor = height => clamp(height * 3.4, 2.6, 7) * (touchScreen() ? 0.9 : 1)

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const damp = (from, to, rate, dt) => to + (from - to) * Math.exp(-rate * dt)
const wrap = a => Math.atan2(Math.sin(a), Math.cos(a))
const ease = k => k * k * (3 - 2 * k)
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
    this.camPitch = -0.17
    this.camDist = 4.2
    this.speed = 0
    this.avatar = null
    this.npc = null // where the Atomling stands while you walk in first person
    this.camPos = new THREE.Vector3()
    this.camSnap = true
    this.near = null
    this.doorWait = 0
    this.station = null // a station seen through the Atomling's eyes: { at, yaw, size, on, k }
    this.diving = null // flying into a doorway board's picture
  }

  body() {
    return this.mode === 'third' && this.avatar ? this.avatar.body : VISITOR
  }

  /** Put the walker at a spawn point { x, z, yaw } (with `y` and `pitch`: back where they stood before
   *  a reload, on the ground they stood on). */
  place(spawn, world) {
    const b = this.body()
    this.pos.set(spawn.x, 0, spawn.z)
    const had = Number.isFinite(spawn.y)
    this.pos.y = groundAt(spawn.x, spawn.z, had ? spawn.y + 0.3 : 50, world.solids ?? [], world.floor, had ? 0.6 : 100)
    this.yaw = spawn.yaw ?? 0
    this.pitch = Number.isFinite(spawn.pitch) ? spawn.pitch : -0.08
    this.camOffset = 0
    this.camPitch = -0.17
    this.vy = 0
    this.speed = 0
    this.camSnap = true
    this.doorWait = 1.2
    this.station = null
    this.diving = null
    this.world = world
    this.npc = this.mode === 'first' ? this.hostSpot() : null
    if (this.avatar) this.avatar.root.position.copy(this.pos)
    this.camDist = camDistFor(b.height)
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
      this.camDist = camDistFor(avatar.body.height)
    }
    this.applyMode()
  }

  setMode(mode, world) {
    if (mode === this.mode) return
    if (mode === 'first' && this.avatar) {
      // step out behind the Atomling, where the camera was, and let it stand there
      this.npc = { x: this.pos.x, z: this.pos.z, y: this.pos.y, yaw: this.yaw }
      // step back to where the camera was, unless a door is there (it would take you away at once):
      // then step in front instead, or stay
      const [fx, fz] = forward(this.yaw)
      const nearDoor = q => (world?.doors ?? []).some(d => Math.hypot(d.x - q.x, d.z - q.z) < d.radius + 0.7)
      let p = { x: this.pos.x - fx * 1.6, z: this.pos.z - fz * 1.6 }
      if (nearDoor(p)) p = { x: this.pos.x + fx * 1.2, z: this.pos.z + fz * 1.2 }
      if (nearDoor(p)) p = { x: this.pos.x, z: this.pos.z }
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
    this.doorWait = Math.max(this.doorWait, 0.8)
    this.applyMode()
  }

  applyMode() {
    if (this.avatar) this.avatar.root.visible = true
  }

  /** Into a picture: the view flies through `point` (on a board facing `normal`) and `then()` is called. */
  dive(point, normal, then) {
    if (this.diving) return
    const cam = this.engine.camera
    this.diving = { t: 0, from: cam.position.clone(), q0: cam.quaternion.clone(), point: point.clone(), normal: normal.clone().normalize(), then, done: false }
    this.station = null
    this.engine.store.set({ panel: null })
    this.avatar?.hop?.()
  }

  /** Look at a station through the Atomling's eyes (third person); the Atomling turns to it. */
  lookAtStation(f) {
    const yaw = Math.atan2(-(f.x - this.pos.x), -(f.z - this.pos.z))
    this.station = { at: new THREE.Vector3(f.x, f.y, f.z), yaw, size: f.size ?? 1, width: f.width ?? f.size ?? 1, on: true, k: this.station?.k ?? 0 }
  }

  update(dt, world, input, time) {
    const cam = this.engine.camera
    if (this.diving) {
      // slowly, then rushing into the picture
      const d = this.diving
      d.t += dt
      const k = Math.min(1, d.t / 0.95)
      cam.position.lerpVectors(d.from, d.point.clone().addScaledVector(d.normal, -0.4), k * k * k)
      const m = new THREE.Matrix4().lookAt(cam.position, d.point.clone().addScaledVector(d.normal, -3), cam.up)
      cam.quaternion.slerpQuaternions(d.q0, new THREE.Quaternion().setFromRotationMatrix(m), Math.min(1, k * 2.5))
      if (k >= 1 && !d.done) {
        d.done = true
        d.then?.()
      }
      return
    }
    const b = this.body()
    const look = input.takeLook()
    const wheel = input.takeWheel()
    const zoom = input.takeZoom()
    const { forward: fw, side, run } = input.axes()
    this.doorWait = Math.max(0, this.doorWait - dt)

    // looking
    if (this.mode === 'first') {
      this.yaw -= look.dx * 0.0038
      this.pitch = clamp(this.pitch - look.dy * 0.0032, -1.25, 1.2)
    } else {
      this.camOffset -= look.dx * 0.0055
      // the camera swings down to the world's cameraPitchMax (oxygen's ozone layer allows more); past
      // that it stays and looks up
      const swing = world.cameraPitchMax ?? 0.2
      this.camPitch = clamp(this.camPitch - look.dy * 0.004, -1.15, swing + AIM_UP)
      if (wheel) this.camDist = clamp(this.camDist * (wheel > 0 ? 1.12 : 0.89), 1.8, 12)
      if (zoom !== 1) this.camDist = clamp(this.camDist * zoom, 1.8, 12)
      const idle = performance.now() - input.lastLook > 1400
      if (idle && !input.dragging && Math.abs(fw) > 0.1) {
        this.camOffset = damp(this.camOffset, 0, 2.2, dt)
        // walking on, a view tilted up comes back down
        if (this.camPitch > swing) this.camPitch = damp(this.camPitch, swing, 2.2, dt)
      }
    }

    // a station seen through the Atomling's eyes: walking on, looking round by hand or closing its panel
    // gives the view back
    const st = this.station
    if (st) {
      const moved = Math.abs(fw) > 0.15 || Math.abs(side) > 0.15 || Math.abs(look.dx) + Math.abs(look.dy) > 2
      const panel = this.engine.store.get().panel
      if (panel) st.seen = true
      if (st.on && (moved || (st.seen && !panel) || this.mode !== 'third')) st.on = false
      st.k = damp(st.k, st.on ? 1 : 0, st.on ? 4 : 6, dt)
      if (st.on) this.yaw += wrap(st.yaw - this.yaw) * (1 - Math.exp(-6 * dt))
      if (!st.on && st.k < 0.01) this.station = null
    }

    // moving
    let vx = 0
    let vz = 0
    const top = run ? b.run : b.walk
    // both views drive alike: forward and back, A and D (the stick sideways) turn; the whole view turns
    // in first person, so it turns a little slower there
    this.yaw += side * (this.mode === 'first' ? 2.1 : 2.6) * dt * (run ? 1.15 : 1)
    const want = fw >= 0 ? top * fw : b.walk * 0.6 * fw
    this.speed = damp(this.speed, want, 8, dt)
    {
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
        // looking through its eyes, the Atomling itself is not in the way
        av.root.visible = !(this.station && this.station.k > 0.55)
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
    this.keepReading()
    this.checkDoors(world)
  }

  placeCamera(dt, world, b, cam) {
    if (this.mode === 'first') {
      cam.position.set(this.pos.x, this.pos.y + b.eye, this.pos.z)
      cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ')
      this.camSnap = false
      return
    }
    // the upper body, where it floats (helium hovers 1.38 m up: aimed at its feet' height, the view
    // looked at the floor under it and the Atomling sat at the top of the screen); a little above its
    // middle, so it stands a little low and the way ahead shows
    const target = new THREE.Vector3(this.pos.x, this.pos.y + (b.hover ?? 0) + b.height * 0.85, this.pos.z)
    this.camTarget = target
    const yaw = this.yaw + this.camOffset
    const swing = world.cameraPitchMax ?? 0.2
    const pitch = Math.min(this.camPitch, swing)
    const aim = Math.max(0, this.camPitch - swing)
    const cp = Math.cos(pitch)
    const want = new THREE.Vector3(
      target.x + Math.sin(yaw) * cp * this.camDist,
      target.y - Math.sin(pitch) * this.camDist,
      target.z + Math.cos(yaw) * cp * this.camDist,
    )
    // where the player wants to look: from the camera's place through the Atomling
    const looking = target.clone().sub(want).normalize()
    // a wall or a pillar between the Atomling and the camera: the camera comes in front of it
    // (and a world's own rule: carbon's tube keeps the camera on the player's side of its bars)
    if (world.solids?.length || world.cameraClear) {
      const free = Math.min(world.solids?.length ? segmentFree(world.solids, target, want) : 1, world.cameraClear?.(target, want) ?? 1)
      if (free < 1) want.lerpVectors(target, want, Math.max(free, 0.7 / this.camDist))
    }
    const before = want.y
    const ground = (world.floor ? world.floor(want.x, want.z) : 0) + 0.25
    if (want.y < ground) want.y = ground
    const bounds = world.cameraBounds
    if (bounds) {
      want.x = clamp(want.x, bounds.minX, bounds.maxX)
      want.y = clamp(want.y, bounds.minY, bounds.maxY)
      want.z = clamp(want.z, bounds.minZ, bounds.maxZ)
    }
    // coming in (something in the way) is quick, so the view never shows through a wall
    const nearer = want.distanceTo(target) < this.camPos.distanceTo(target) - 0.05
    if (this.camSnap) this.camPos.copy(want)
    else this.camPos.lerp(want, 1 - Math.exp(-dt * (nearer ? 24 : 9)))
    this.camSnap = false
    cam.position.copy(this.camPos)
    // held up by the floor while the player tilts up: look up the way they asked, from where the camera
    // is (the Atomling slides down the screen), instead of at its head from the floor
    this.lift = damp(this.lift ?? 0, clamp((want.y - before) / 1.2, 0, 1), 6, dt)
    if (this.lift > 0.01) cam.lookAt(target.clone().lerp(this.camPos.clone().addScaledVector(looking, this.camDist), this.lift))
    else cam.lookAt(target)
    // tilted past the lowest swing: the camera stays and looks up
    if (aim > 0.001) cam.rotateX(aim)
    // a station: into the Atomling's eyes, backed off along the line of sight only as far as the
    // station needs to fit in the view
    const st = this.station
    if (st && st.k > 0.001) {
      const k = ease(st.k)
      // its eyes, raised a little above what it looks at (a bench seen from the side shows nothing of
      // its top), no higher than a child's eyes
      const own = (b.hover ?? 0) + Math.max(b.height * 0.9, 0.95)
      const eye = new THREE.Vector3(this.pos.x, this.pos.y + Math.max(own, Math.min(st.at.y - this.pos.y + 0.35, 1.45)), this.pos.z)
      // a focus with a `width` also fits across a narrow screen (an upright phone)
      const fit = (Math.max(st.size, st.width / cam.aspect) / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2)) * 1.1
      const dist = eye.distanceTo(st.at)
      // backed off along the line of sight, but never downward: a focus above the eyes (a balloon, a sky)
      // pulled the eye down to the floor (the neon workshop, 2026-10-31)
      const away = eye.clone().sub(st.at)
      if (away.y < 0) away.y = 0
      if (dist < fit && away.lengthSq() > 1e-6) eye.addScaledVector(away.normalize(), fit - dist)
      if (bounds) {
        eye.x = clamp(eye.x, bounds.minX, bounds.maxX)
        eye.y = clamp(eye.y, bounds.minY, bounds.maxY)
        eye.z = clamp(eye.z, bounds.minZ, bounds.maxZ)
      }
      const q0 = cam.quaternion.clone()
      cam.position.lerpVectors(this.camPos, eye, k)
      const m = new THREE.Matrix4().lookAt(cam.position, st.at, cam.up)
      cam.quaternion.slerpQuaternions(q0, new THREE.Quaternion().setFromRotationMatrix(m), k)
    }
  }

  /** The nearest thing to use within its reach, for the prompt (E, or the button). Of two in reach, the
   *  one the walker faces wins: a station with a focus counts as farther the more it is off to the side
   *  (in a hall's corner, the side wall's board was a few centimetres nearer than the one in front). */
  findNear(world) {
    let best = null
    let bestD = Infinity
    const [fx, fz] = forward(this.yaw)
    for (const it of world.interactables ?? []) {
      const d = Math.hypot(it.x - this.pos.x, it.z - this.pos.z)
      if (d >= (it.radius ?? 2)) continue
      let score = d
      if (it.focus) {
        const ax = it.focus.x - this.pos.x
        const az = it.focus.z - this.pos.z
        const len = Math.hypot(ax, az) || 1
        score += (1 - (ax * fx + az * fz) / len) * 1.2
      }
      if (score < bestD) {
        best = it
        bestD = score
      }
    }
    if (best !== this.near) {
      this.near = best
      this.engine.store.set({ prompt: best ? { id: best.id, label: best.label, verb: best.verb } : null })
    }
  }

  use() {
    const it = this.near
    // the view goes to the station as it is used (its panel may open later, after the experiment)
    if (it?.focus && this.mode === 'third' && !this.station?.on) this.lookAtStation(it.focus)
    it?.onUse?.()
  }

  /** A panel belongs to where it was opened: it stays open while the walker moves about there (the
   *  stick and the keys keep working under it) and closes once they walk away. */
  keepReading() {
    const store = this.engine.store
    const panel = store.get().panel
    if (!panel) {
      this.reading = null
      return
    }
    if (this.reading?.panel !== panel) {
      if (this.reading && panel.make && panel.make === this.reading.panel.make) {
        // the same panel written again (a change of level): it stays where it was opened
        this.reading.panel = panel
      } else {
        const it = this.near
        this.reading = { panel, x: it?.x ?? this.pos.x, z: it?.z ?? this.pos.z, reach: (it?.radius ?? 2) * 1.5 + 1 }
        if (it?.focus && this.mode === 'third') this.lookAtStation(it.focus)
        // which exhibit it tells about: another one near is still offered (WalkHud)
        store.set({ panelFrom: it?.id ?? null })
      }
    }
    const r = this.reading
    if (Math.hypot(r.x - this.pos.x, r.z - this.pos.z) > r.reach) store.set({ panel: null })
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
