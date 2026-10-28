// Keys, mouse and touch for the walking worlds. Keys are let go when the page loses focus (a held key
// drove on forever after Alt+Tab in the arena). A drag on the canvas looks round, two fingers pinch
// the third-person camera nearer or farther; the touch stick (ui/TouchStick.jsx) reports through
// `setStick`.

const MOVE_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight',
])

export class Input {
  constructor(canvas) {
    this.canvas = canvas
    this.keys = new Set()
    this.pressed = []
    this.look = { dx: 0, dy: 0 }
    this.wheel = 0
    this.stick = null
    this.dragging = false
    this.lastLook = -1e9
    this.enabled = true
    this.pointerLook = true // off in the plaza, whose orbit controls take the pointer
    this._drag = null
    this._fingers = new Map() // touches on the canvas: id -> { x, y }
    this._pinch = null // the distance between two fingers
    this.zoom = 1

    const typing = e => /INPUT|TEXTAREA|SELECT/.test(e.target?.tagName ?? '')
    this._down = e => {
      if (!this.enabled || typing(e) || e.ctrlKey || e.metaKey || e.altKey) return
      if (!e.repeat) this.pressed.push(e.code)
      this.keys.add(e.code)
      if (MOVE_KEYS.has(e.code)) e.preventDefault()
    }
    this._up = e => this.keys.delete(e.code)
    this._blur = () => this.release()
    this._hidden = () => document.hidden && this.release()
    const spread = () => {
      const [a, b] = [...this._fingers.values()]
      return Math.hypot(a.x - b.x, a.y - b.y)
    }
    this._pdown = e => {
      if (e.pointerType === 'touch' && this.enabled && this.pointerLook) {
        this._fingers.set(e.pointerId, { x: e.clientX, y: e.clientY })
        // a second finger: a pinch, not a look
        if (this._fingers.size === 2) {
          canvas.setPointerCapture?.(e.pointerId)
          this._drag = null
          this.dragging = false
          this._pinch = spread()
          return
        }
      }
      if (!this.enabled || !this.pointerLook || this._drag || this._pinch) return
      if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return
      this._drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 }
      canvas.setPointerCapture?.(e.pointerId)
    }
    this._pmove = e => {
      const f = this._fingers.get(e.pointerId)
      if (f) {
        f.x = e.clientX
        f.y = e.clientY
      }
      if (this._pinch && this._fingers.size >= 2) {
        const s = spread()
        // fingers apart bring the camera nearer
        if (s > 0) this.zoom *= this._pinch / s
        this._pinch = s
        this.lastLook = performance.now()
        return
      }
      const d = this._drag
      if (!d || d.id !== e.pointerId) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      d.x = e.clientX
      d.y = e.clientY
      d.moved += Math.abs(dx) + Math.abs(dy)
      if (d.moved > 4) {
        this.dragging = true
        // a finger moves farther than a mouse for the same turn
        const k = e.pointerType === 'touch' ? 1.6 : 1
        this.look.dx += dx * k
        this.look.dy += dy * k
        this.lastLook = performance.now()
      }
    }
    this._pup = e => {
      this._fingers.delete(e.pointerId)
      if (this._fingers.size < 2) this._pinch = null
      if (this._drag?.id !== e.pointerId) return
      this._drag = null
      this.dragging = false
    }
    this._wheel = e => {
      if (!this.enabled) return
      this.wheel += Math.sign(e.deltaY)
      e.preventDefault()
    }
    this._menu = e => e.preventDefault()

    window.addEventListener('keydown', this._down)
    window.addEventListener('keyup', this._up)
    window.addEventListener('blur', this._blur)
    document.addEventListener('visibilitychange', this._hidden)
    canvas.addEventListener('pointerdown', this._pdown)
    canvas.addEventListener('pointermove', this._pmove)
    canvas.addEventListener('pointerup', this._pup)
    canvas.addEventListener('pointercancel', this._pup)
    canvas.addEventListener('lostpointercapture', this._pup)
    canvas.addEventListener('wheel', this._wheel, { passive: false })
    canvas.addEventListener('contextmenu', this._menu)
  }

  release() {
    this.keys.clear()
    this.stick = null
    this._drag = null
    this.dragging = false
    this._fingers.clear()
    this._pinch = null
  }

  setStick(v) {
    this.stick = v
  }

  /** True once per press of `code` (taken from the queue). */
  took(code) {
    const i = this.pressed.indexOf(code)
    if (i < 0) return false
    this.pressed.splice(i, 1)
    return true
  }

  /** Movement wanted this frame: forward (-1..1), turn (-1..1, positive left), strafe, run. */
  axes() {
    const k = c => this.keys.has(c)
    let forward = (k('KeyW') || k('ArrowUp') ? 1 : 0) - (k('KeyS') || k('ArrowDown') ? 1 : 0)
    let side = (k('KeyA') || k('ArrowLeft') ? 1 : 0) - (k('KeyD') || k('ArrowRight') ? 1 : 0)
    let run = k('ShiftLeft') || k('ShiftRight')
    if (this.stick) {
      forward = this.stick.y
      side = -this.stick.x
      run = Math.hypot(this.stick.x, this.stick.y) > 0.92
    }
    return { forward, side, run }
  }

  takeLook() {
    const l = this.look
    this.look = { dx: 0, dy: 0 }
    return l
  }

  /** How much a pinch asks the camera's distance to change since the last frame (1: none). */
  takeZoom() {
    const z = this.zoom
    this.zoom = 1
    return z
  }

  takeWheel() {
    const w = this.wheel
    this.wheel = 0
    return w
  }

  endFrame() {
    this.pressed.length = 0
  }

  dispose() {
    const c = this.canvas
    window.removeEventListener('keydown', this._down)
    window.removeEventListener('keyup', this._up)
    window.removeEventListener('blur', this._blur)
    document.removeEventListener('visibilitychange', this._hidden)
    c.removeEventListener('pointerdown', this._pdown)
    c.removeEventListener('pointermove', this._pmove)
    c.removeEventListener('pointerup', this._pup)
    c.removeEventListener('pointercancel', this._pup)
    c.removeEventListener('lostpointercapture', this._pup)
    c.removeEventListener('wheel', this._wheel)
    c.removeEventListener('contextmenu', this._menu)
  }
}
