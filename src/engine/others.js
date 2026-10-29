// The others in my room, in the 3D (docs/knowledge/multiplayer.md): in a walking world, everyone who is
// in the same world as me walks there as its Atomling, with a ring in their colour at its feet and their
// name above; on the plaza, a name floats over the cube each of them has selected. I send where I stand
// (ten times a second while I move). A call puts a pillar of light where the caller stands; an emote
// floats up over the one who sent it.
import * as THREE from 'three'
import { room } from '../net/room.js'
import { createAtomling } from '../characters/atomling.js'
import { element } from '../data/elements.js'
import { makeText } from './text.js'

// about seven a second while I move (the others glide between), and only when someone else is in
// the same world to see it: the realtime channels of the free plan have a budget of messages
const SEND_MS = 150
const KEEP_MS = 2000
const STALE_MS = 8000

/** A little picture of an emoji, as a sprite (the 3D fonts have no emoji). */
function emojiSprite(emoji) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.font = '96px system-ui, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(emoji, 64, 70)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
  s.scale.setScalar(0.7)
  return s
}

export class Others {
  constructor(engine) {
    this.engine = engine
    this.avatars = new Map() // member id -> { av, ring, tag, holder, pose, at }
    this.marks = new Map() // member id -> plaza label
    this.poses = new Map() // member id -> last pose received
    this.beacons = []
    this.emotes = []
    this.lastSent = 0
    this.sent = null
    this.pendingCall = null
    room.on('pose', p => this.poses.set(p.from, { ...p, at: performance.now() }))
    room.on('emote', p => this.emote(p.from, p.e))
    room.on('call', p => this.called(p))
    room.on('members', () => this.prune())
    // the cube I have selected on the plaza, for the others' name labels
    let sel = engine.store.get().selected ?? null
    room.update({ sel })
    engine.store.subscribe(s => {
      if (s.selected === sel) return
      sel = s.selected
      room.update({ sel })
    })
  }

  /** A new world: the old one's avatars went with it. A call answered from elsewhere lands here. */
  enter(w) {
    this.avatars.clear()
    this.marks.clear()
    this.beacons = []
    this.emotes = []
    this.sent = null
    const call = this.pendingCall
    this.pendingCall = null
    if (call && call.path === location.pathname && w.mode === 'walk' && call.x != null) {
      this.engine.teleport(call.x + 1.2, call.z + 1.2)
      this.beacon(call)
    }
  }

  prune() {
    const ids = new Set(room.members.map(m => m.id))
    for (const [id, a] of this.avatars) {
      if (!ids.has(id)) this.drop(id, a)
    }
    for (const [id, l] of this.marks) {
      if (!ids.has(id)) {
        l.parent?.remove(l)
        l.dispose?.()
        this.marks.delete(id)
      }
    }
  }

  drop(id, a) {
    a.holder.parent?.remove(a.holder)
    a.tag.dispose?.()
    this.avatars.delete(id)
  }

  /** Someone called everyone to where they stand. */
  called(p) {
    const m = room.member(p.from)
    if (!m) return
    if (p.path === location.pathname) this.beacon({ ...p, color: m.color })
  }

  /** Answer a call from another world: go there, and stand by the caller on arrival. */
  answer(p) {
    this.pendingCall = p
    room.go?.(p.path)
  }

  beacon(p) {
    const w = this.engine.world
    if (!w || w.mode !== 'walk') return
    const color = new THREE.Color(room.member(p.from)?.color ?? p.color ?? '#ffd166')
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.7, 9, 32, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    )
    pillar.position.set(p.x, 4.5, p.z)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.05, 8, 48), new THREE.MeshBasicMaterial({ color }))
    ring.rotation.x = Math.PI / 2
    ring.position.set(p.x, 0.06, p.z)
    w.root.add(pillar, ring)
    this.beacons.push({ pillar, ring, until: performance.now() + 12000 })
  }

  emote(id, e) {
    const a = this.avatars.get(id)
    if (!a || !/^\p{Extended_Pictographic}/u.test(e ?? '')) return
    const s = emojiSprite(e)
    a.holder.add(s)
    s.position.y = a.top + 0.5
    this.emotes.push({ s, a, born: performance.now() })
  }

  /** My own emote: shown over my Atomling too (the others see it through the room). */
  sendEmote(e) {
    room.send('emote', { e })
    const av = this.engine.player.avatar
    if (!av || !this.engine.world || this.engine.world.mode !== 'walk') return
    const s = emojiSprite(e)
    s.position.set(0, av.body.height + (av.body.hover ?? 0) + 0.5, 0)
    av.root.add(s)
    this.emotes.push({ s, own: av.root, born: performance.now() })
  }

  /** Call everyone to where I stand (in a walking world), or to this page. */
  callHere() {
    const w = this.engine.world
    const p = this.engine.player.pos
    const walk = w?.mode === 'walk'
    room.send('call', { path: location.pathname, x: walk ? p.x : null, z: walk ? p.z : null })
    if (walk) this.beacon({ from: room.me?.id, x: p.x, z: p.z, color: room.me?.color })
  }

  update(dt, t) {
    const w = this.engine.world
    if (!room.active || !w) return
    const now = performance.now()
    // where I stand, while I walk, for whoever is here with me
    const watched = room.others().some(m => m.path === location.pathname)
    // someone has just come: show them where I am at once
    if (watched && !this.watched) this.sent = null
    this.watched = watched
    if (w.mode === 'walk' && watched) {
      const pl = this.engine.player
      const pose = { p: location.pathname, x: +pl.pos.x.toFixed(2), y: +pl.pos.y.toFixed(2), z: +pl.pos.z.toFixed(2), yaw: +pl.yaw.toFixed(3), s: +Math.abs(pl.speed).toFixed(2) }
      const moved = !this.sent || Math.abs(pose.x - this.sent.x) + Math.abs(pose.z - this.sent.z) + Math.abs(pose.y - this.sent.y) > 0.02 || Math.abs(pose.yaw - this.sent.yaw) > 0.02 || pose.s !== this.sent.s
      if ((moved && now - this.lastSent > SEND_MS) || now - this.lastSent > KEEP_MS) {
        room.send('pose', pose)
        this.sent = pose
        this.lastSent = now
      }
    }
    if (w.mode === 'walk') this.walkers(w, dt, t, now)
    else if (w.cubeTop) this.plazaMarks(w)

    // calls fade, emotes rise and fade
    this.beacons = this.beacons.filter(b => {
      const left = (b.until - now) / 12000
      if (left <= 0) {
        b.pillar.parent?.remove(b.pillar)
        b.ring.parent?.remove(b.ring)
        return false
      }
      b.pillar.material.opacity = 0.35 * Math.min(1, left * 3) * (0.8 + 0.2 * Math.sin(t * 5))
      b.ring.scale.setScalar(1 + 0.15 * Math.sin(t * 4))
      return true
    })
    this.emotes = this.emotes.filter(e => {
      const k = (now - e.born) / 2600
      if (k >= 1) {
        e.s.parent?.remove(e.s)
        e.s.material.map.dispose()
        return false
      }
      e.s.position.y += dt * 0.35
      e.s.material.opacity = Math.min(1, (1 - k) * 2.5)
      return true
    })
  }

  walkers(w, dt, t, now) {
    const here = location.pathname
    const cam = this.engine.camera
    for (const m of room.others()) {
      const pose = this.poses.get(m.id)
      const there = pose && pose.p === here && m.path === here && now - pose.at < STALE_MS
      let a = this.avatars.get(m.id)
      if (!there) {
        if (a) this.drop(m.id, a)
        continue
      }
      if (!a) {
        const el = element(this.engine.store.get().world?.symbol ?? 'C')
        const av = createAtomling(el, { light: this.engine.light })
        const holder = new THREE.Group()
        holder.add(av.root)
        const color = new THREE.Color(m.color ?? '#ffffff')
        const ring = new THREE.Mesh(new THREE.TorusGeometry(Math.max(0.45, av.body.height * 0.45), 0.045, 8, 48), new THREE.MeshBasicMaterial({ color }))
        ring.rotation.x = Math.PI / 2
        ring.position.y = 0.04
        holder.add(ring)
        const top = av.body.height + (av.body.hover ?? 0) + 0.35
        const tag = makeText(m.name ?? '', { size: 0.26, color: m.color ?? '#ffffff', outlineWidth: 0.025, outlineColor: '#0b0f24' })
        tag.position.y = top
        holder.add(tag)
        holder.position.set(pose.x, pose.y, pose.z)
        w.root.add(holder)
        av.poof?.()
        a = { av, holder, ring, tag, top, yaw: pose.yaw, name: m.name }
        this.avatars.set(m.id, a)
      }
      if (a.name !== m.name) {
        a.tag.text = m.name
        a.tag.sync()
        a.name = m.name
      }
      // glide to where they are, turn the short way round
      const k = 1 - Math.exp(-dt * 8)
      a.holder.position.x += (pose.x - a.holder.position.x) * k
      a.holder.position.y += (pose.y - a.holder.position.y) * k
      a.holder.position.z += (pose.z - a.holder.position.z) * k
      let dy = pose.yaw - a.yaw
      dy = Math.atan2(Math.sin(dy), Math.cos(dy))
      a.yaw += dy * k
      a.av.root.rotation.y = a.yaw + Math.PI
      a.av.update(dt, t, { speed: pose.s ?? 0, run: (pose.s ?? 0) > 3.5, grounded: true, turning: 0 })
      a.tag.quaternion.copy(cam.quaternion)
    }
  }

  plazaMarks(w) {
    const cam = this.engine.camera
    for (const m of room.others()) {
      let l = this.marks.get(m.id)
      const onPlaza = m.path === '/' && m.sel
      if (!onPlaza) {
        if (l) {
          l.parent?.remove(l)
          l.dispose?.()
          this.marks.delete(m.id)
        }
        continue
      }
      const at = w.cubeTop(m.sel)
      if (!at) continue
      if (!l) {
        l = makeText(m.name ?? '', { size: 0.7, color: m.color ?? '#ffffff', outlineWidth: 0.06, outlineColor: '#0b0f24' })
        w.root.add(l)
        this.marks.set(m.id, l)
      }
      l.position.copy(at)
      l.quaternion.copy(cam.quaternion)
    }
  }
}
