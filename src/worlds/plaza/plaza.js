// The plaza: the 118 element cubes laid out as the periodic table under a night sky. One instanced
// mesh draws every cube (lit from inside in its family's colour, glowing rims), one batched text draws
// every label. Hover lifts a cube, a click selects it (the camera frames it, the HUD shows its card),
// a second click or Enter goes inside. The HUD calls select, focusFamily, setTrend and enterSelected.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { BatchedText, Text } from 'troika-three-text'
import { ELEMENTS, FAMILY, element, nameOf, cellOf } from '../../data/elements.js'
import { CUBE, PITCH, TABLE, TRENDS, cubeSpot, spotOf, trendScale, scaleColor } from './layout.js'
import { nightSky } from '../common/sky.js'
import { FONTS } from '../../engine/text.js'
import { atriumPath, WINGS } from '../registry.js'
import { createAtomling } from '../../characters/atomling.js'
import { play } from '../../audio/sound.js'
import { verseText } from '../common/verse.js'

const N = ELEMENTS.length
const damp = (a, b, rate, dt) => b + (a - b) * Math.exp(-rate * dt)
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function cubeMaterial() {
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.34, metalness: 0.2, envMapIntensity: 0.55 })
  mat.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float aGlow; attribute float aDim;
        varying float vGlow; varying float vDim; varying vec2 vFaceUv;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vGlow = aGlow; vDim = aDim; vFaceUv = uv;`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying float vGlow; varying float vDim; varying vec2 vFaceUv;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 family = vColor.rgb;
        diffuseColor.rgb = mix(vec3(0.02, 0.025, 0.06), family, 0.16) * (1.0 - 0.55 * vDim);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float edge = max(abs(vFaceUv.x - 0.5), abs(vFaceUv.y - 0.5)) * 2.0;
        float rim = smoothstep(0.86, 0.985, edge);
        float inner = 0.035 + 0.11 * smoothstep(0.2, 0.97, edge);
        totalEmissiveRadiance += family * (rim * 1.25 + inner) * vGlow * (1.0 - 0.88 * vDim);`)
  }
  return mat
}

function softDisc(size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  r.addColorStop(0, 'rgba(255,255,255,0.9)')
  r.addColorStop(0.45, 'rgba(255,255,255,0.35)')
  r.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = r
  g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function textOf(text, { size, color = '#ffffff', anchorX = 'center', anchorY = 'middle', maxWidth = Infinity }) {
  const t = new Text()
  Object.assign(t, { text, font: FONTS.display, fontSize: size, color, anchorX, anchorY, maxWidth, textAlign: 'center' })
  return t
}

export async function build(ctx, target) {
  const { light, store, camera, canvas } = ctx
  const lang = ctx.lang()
  const root = new THREE.Group()
  root.name = 'plaza'

  const sky = nightSky({ pixelRatio: ctx.renderer.getPixelRatio(), stars: light ? 1400 : 2600 })
  root.add(sky)
  // behind the table, in starlight, the psalm of the heavens (src/content/scripture/): standing up from
  // the ground and leaning back to face the overview's steep view; a click on it opens it in a sheet
  const verse = verseText(ctx, 'plaza', { width: 44, size: 1.55, color: '#cfd8ff', citeColor: '#ffd98a', opacity: 0.8, lineHeight: 1.25 })
  verse.group.position.set(0, 6.2, TABLE.minZ - 13)
  verse.group.rotation.x = -1.0
  root.add(verse.group)

  // the plaza's floor, dark and glossy, with a pool of light under each cube
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(700, 96),
    new THREE.MeshStandardMaterial({ color: '#0a0d22', roughness: 0.3, metalness: 0.55, envMapIntensity: 0.25 }),
  )
  floor.rotation.x = -Math.PI / 2
  root.add(floor)

  const disc = softDisc()
  const pools = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(CUBE * 1.9, CUBE * 1.9),
    new THREE.MeshBasicMaterial({ map: disc, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32 }),
    N,
  )
  pools.renderOrder = 1

  // the cubes
  const geo = new RoundedBoxGeometry(CUBE, CUBE, CUBE, 3, 0.16)
  const glowAttr = new THREE.InstancedBufferAttribute(new Float32Array(N).fill(1), 1)
  const dimAttr = new THREE.InstancedBufferAttribute(new Float32Array(N), 1)
  glowAttr.setUsage(THREE.DynamicDrawUsage)
  dimAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('aGlow', glowAttr)
  geo.setAttribute('aDim', dimAttr)
  const cubes = new THREE.InstancedMesh(geo, cubeMaterial(), N)
  cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  cubes.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 120)
  root.add(cubes, pools)

  // per cube: where it stands, its height, lift, glow, dimming and colour (each eases to its target)
  const state = ELEMENTS.map((el, i) => {
    const { x, z } = cubeSpot(el)
    const family = new THREE.Color(FAMILY[el.family].color)
    cubes.setColorAt(i, family)
    pools.setColorAt(i, family)
    return {
      el, x, z, family,
      h: CUBE, hTo: CUBE, lift: 0, liftTo: 0, glow: 1, glowTo: 1, dim: 0, dimTo: 0,
      color: family.clone(), colorTo: family.clone(),
    }
  })

  // labels: number, symbol and name on the top face; symbol and name on the front
  const labels = new BatchedText()
  labels.font = FONTS.display
  const tops = []
  const fronts = []
  for (const s of state) {
    const name = nameOf(s.el, lang)
    const nameSize = name.length > 11 ? 0.24 : 0.3
    const top = {
      num: textOf(String(s.el.z), { size: 0.4, anchorX: 'left', anchorY: 'top' }),
      sym: textOf(s.el.symbol, { size: 1.25 }),
      name: textOf(name, { size: nameSize, maxWidth: 2.7, anchorY: 'bottom' }),
    }
    for (const t of Object.values(top)) {
      t.rotation.x = -Math.PI / 2
      labels.add(t)
    }
    const front = {
      sym: textOf(s.el.symbol, { size: 1.05 }),
      name: textOf(name, { size: nameSize * 0.85, maxWidth: 2.7 }),
    }
    labels.add(front.sym, front.name)
    tops.push(top)
    fronts.push(front)
  }
  root.add(labels)
  await new Promise(resolve => labels.sync(resolve))

  // markers in group 3 for the f-block rows ("57-71", "89-103")
  const marks = new THREE.Group()
  for (const [row, range, fam] of [[6, '57–71', 'lanthanide'], [7, '89–103', 'actinide']]) {
    const { x, z } = spotOf(3, row)
    const tile = new THREE.Mesh(
      new RoundedBoxGeometry(CUBE, 0.3, CUBE, 2, 0.1),
      new THREE.MeshStandardMaterial({ color: '#0d1130', emissive: FAMILY[fam].color, emissiveIntensity: 0.25, roughness: 0.4 }),
    )
    tile.position.set(x, 0.15, z)
    const t = textOf(range, { size: 0.5, color: FAMILY[fam].color })
    t.rotation.x = -Math.PI / 2
    t.position.set(x, 0.31, z)
    t.sync()
    marks.add(tile, t)
  }
  root.add(marks)

  // a golden star floats over the cubes whose element has worlds of its own
  const stars = []
  const starGeo = new THREE.OctahedronGeometry(0.42, 0)
  const starMat = new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffb703', emissiveIntensity: 1.6, roughness: 0.3, metalness: 0.4 })
  for (const sym of Object.keys(WINGS)) {
    const s = state.find(st => st.el.symbol === sym)
    if (!s) continue
    const star = new THREE.Mesh(starGeo, starMat)
    star.scale.set(1, 1.4, 1)
    root.add(star)
    stars.push({ star, s })
  }

  // light: a dim sky, a moon, the cubes' own glow
  root.add(new THREE.HemisphereLight('#5a6cff', '#090b1e', 0.4))
  const moon = new THREE.DirectionalLight('#c7d3ff', 0.8)
  moon.position.set(-40, 80, 30)
  root.add(moon)

  // the camera: an orbit round the table
  const controls = new OrbitControls(camera, canvas)
  controls.enabled = false
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 8
  controls.maxDistance = 160
  controls.maxPolarAngle = 1.38
  controls.screenSpacePanning = false
  controls.zoomToCursor = true
  // on a touch screen the table moves like a map: one finger pans, two zoom and turn
  if (window.matchMedia?.('(pointer: coarse)').matches) controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }
  const center = new THREE.Vector3((TABLE.minX + TABLE.maxX) / 2, 0, (TABLE.minZ + TABLE.maxZ) / 2)

  // the whole table in view: back off along a steep line until its four corners fit the screen
  // (a phone held upright gets as close as 150 m and the sides are panned to)
  const overview = () => {
    const up = THREE.MathUtils.degToRad(camera.aspect < 1 ? 66 : 58)
    const dir = new THREE.Vector3(0, Math.sin(up), Math.cos(up))
    const corners = [
      [TABLE.minX, TABLE.minZ], [TABLE.maxX, TABLE.minZ], [TABLE.minX, TABLE.maxZ], [TABLE.maxX, TABLE.maxZ],
    ].map(([x, z]) => new THREE.Vector3(x, CUBE, z))
    // fitted into the part of the screen the HUD leaves free (the view offset centres it there)
    const probe = camera.clone()
    probe.clearViewOffset()
    const free = ctx.engine.freeShare()
    let d = 30
    for (; d < 150; d *= 1.04) {
      probe.position.copy(center).addScaledVector(dir, d)
      probe.lookAt(center)
      probe.updateMatrixWorld()
      const fits = corners.every(c => {
        const v = c.clone().project(probe)
        return Math.abs(v.x) < 0.94 * free.w && Math.abs(v.y) < 0.86 * free.h
      })
      if (fits) break
    }
    // an upright phone starts closer, the sides a drag away: the whole table there is too small to read
    if (camera.aspect < 1) d *= 0.62
    return { target: center.clone(), position: center.clone().addScaledVector(dir, d) }
  }
  const closeUp = s => ({
    target: new THREE.Vector3(s.x, CUBE * 0.6, s.z + 0.5),
    position: new THREE.Vector3(s.x + 0.8, CUBE * 4.6, s.z + 10.5),
  })
  // bars read best from lower down, at an angle
  const trendView = () => {
    const v = overview()
    const d = v.position.distanceTo(v.target)
    return { target: v.target.clone().setY(3), position: v.target.clone().add(new THREE.Vector3(-0.32 * d, 0.5 * d, 0.85 * d)) }
  }

  let fly = null
  const flyTo = ({ target: to, position }, duration = 0.9) => {
    fly = { t: 0, duration, fromT: controls.target.clone(), fromP: camera.position.clone(), toT: to, toP: position }
    controls.enabled = false
  }

  // picking
  const ray = new THREE.Raycaster()
  const pointer = new THREE.Vector2(9, 9)
  let pointerIn = false
  let down = null
  let lastClick = { i: -1, at: 0 }
  let hover = -1
  let selected = -1
  let familyFocus = null
  let trend = null
  let entering = false

  const pick = () => {
    if (!pointerIn) return -1
    ray.setFromCamera(pointer, camera)
    const hit = ray.intersectObject(cubes, false)[0]
    return hit ? hit.instanceId : -1
  }

  const setHover = i => {
    if (i === hover) return
    hover = i
    canvas.style.cursor = i >= 0 ? 'pointer' : ''
    store.set({ hover: i >= 0 ? state[i].el.z : null })
  }

  // the selected element's Atomling pops up on its cube and waves
  // (a holder carries the size: the Atomling sets its own root's scale while it pops up)
  let host = null
  const hostLight = new THREE.PointLight('#fff1dc', 0, 12, 1.4)
  root.add(hostLight)
  const showHost = i => {
    if (host) {
      root.remove(host.holder)
      host.holder.traverse(o => {
        if (o.isMesh) o.geometry?.dispose()
      })
      host = null
    }
    if (i < 0) return
    const a = createAtomling(state[i].el, { light })
    const holder = new THREE.Group()
    holder.scale.setScalar(2.1)
    holder.add(a.root)
    a.poof()
    setTimeout(() => a.wave(), 500)
    root.add(holder)
    host = { a, i, holder }
  }

  const select = (z, { frame = true } = {}) => {
    const i = z == null ? -1 : z - 1
    if (i >= 0 && i !== selected) play('select')
    selected = i
    store.set({ selected: i >= 0 ? z : null })
    showHost(i)
    if (i >= 0 && frame) flyTo(closeUp(state[i]))
  }

  const enterSelected = () => {
    if (selected < 0 || entering) return
    entering = true
    play('enter')
    const s = state[selected]
    s.glowTo = 3
    flyTo({ target: new THREE.Vector3(s.x, CUBE * 0.5, s.z), position: new THREE.Vector3(s.x, CUBE * 0.5, s.z + CUBE / 2 + 1.2) }, 0.8)
    setTimeout(() => ctx.go(atriumPath(s.el.symbol)), 650)
  }

  const onMove = e => {
    const r = canvas.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    pointerIn = e.pointerType === 'mouse'
  }
  const onDown = e => {
    down = { x: e.clientX, y: e.clientY, at: performance.now() }
    if (fly) {
      fly = null
      controls.enabled = true
    }
  }
  const onUp = e => {
    if (!down) return
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
    const quick = performance.now() - down.at < 600
    down = null
    if (moved > 6 || !quick) return
    const r = canvas.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    pointerIn = true
    const i = pick()
    if (e.pointerType !== 'mouse') pointerIn = false
    if (i < 0) {
      if (verse.hits(ray)) verse.open()
      return
    }
    const now = performance.now()
    const again = lastClick.i === i && now - lastClick.at < 450
    lastClick = { i, at: now }
    if (again || (i === selected && e.pointerType !== 'mouse')) enterSelected()
    else select(i + 1)
  }
  const onLeave = () => {
    pointerIn = false
    setHover(-1)
  }

  // arrow keys walk the selection through the table, Enter goes in, Escape lets go
  const neighbour = (i, dc, dr) => {
    const from = cellOf(state[i].el)
    let best = -1
    let bestScore = Infinity
    state.forEach((s, j) => {
      const c = cellOf(s.el)
      const ddc = c.col - from.col
      const ddr = c.row - from.row
      const along = dc ? ddc * dc : ddr * dr
      if (along <= 0) return
      const across = dc ? Math.abs(ddr) : Math.abs(ddc)
      const score = along + across * 3
      if (score < bestScore) {
        bestScore = score
        best = j
      }
    })
    return best
  }
  const onKey = e => {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName ?? '')) return
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    if (dirs[e.code]) {
      e.preventDefault()
      const from = selected >= 0 ? selected : 0
      const j = selected >= 0 ? neighbour(from, ...dirs[e.code]) : 0
      if (j >= 0) select(j + 1)
    } else if (e.code === 'Enter' || e.code === 'NumpadEnter') enterSelected()
    else if (e.code === 'Escape') {
      select(null)
      flyTo(overview())
    }
  }

  const focusFamily = id => {
    familyFocus = id
    store.set({ familyFocus: id })
  }

  // the time machine: elements not yet discovered in `year` lie flat and dark
  let year = null
  const known = s => s.el.ancient || (s.el.discovered != null && s.el.discovered <= year)
  const setYear = y => {
    year = y
    if (y != null && trend) setTrend(null)
    const count = y == null ? ELEMENTS.length : state.filter(known).length
    store.set({ year: y, knownCount: count })
  }

  const setTrend = id => {
    if (id && year != null) setYear(null)
    trend = TRENDS.find(t => t.id === id) ?? null
    store.set({ trend: trend ? trend.id : null })
    if (!trend) {
      for (const s of state) {
        s.hTo = CUBE
        s.colorTo.copy(s.family)
      }
      return
    }
    const { norm, lo, hi } = trendScale(trend, ELEMENTS)
    store.set({ trendRange: { lo, hi, log: !!trend.log } })
    if (selected < 0) flyTo(trendView(), 1.2)
    state.forEach((s, i) => {
      const v = norm[i]
      s.hTo = v == null ? 0.5 : 0.7 + v * 9
      s.unknown = v == null
      s.colorTo.setRGB(...(v == null ? [0.25, 0.27, 0.35] : scaleColor(v)))
    })
  }

  // every frame: ease each cube to its targets and write the instances
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const p = new THREE.Vector3()
  const sc = new THREE.Vector3()
  const poolM = new THREE.Matrix4().makeRotationX(-Math.PI / 2)
  const update = (dt, time) => {
    sky.userData.update(time)
    if (fly) {
      fly.t = Math.min(1, fly.t + dt / fly.duration)
      const k = ease(fly.t)
      controls.target.lerpVectors(fly.fromT, fly.toT, k)
      camera.position.lerpVectors(fly.fromP, fly.toP, k)
      camera.lookAt(controls.target)
      if (fly.t >= 1) {
        fly = null
        controls.enabled = !entering
      }
    } else if (controls.enabled) {
      controls.update()
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, TABLE.minX - 10, TABLE.maxX + 10)
      controls.target.z = THREE.MathUtils.clamp(controls.target.z, TABLE.minZ - 10, TABLE.maxZ + 10)
      controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 12)
    }
    if (!fly && pointerIn && !down) setHover(pick())

    let colorDirty = false
    state.forEach((s, i) => {
      const isHover = i === hover
      const isSel = i === selected
      const outOfFamily = familyFocus && s.el.family !== familyFocus
      const unborn = year != null && !known(s)
      s.liftTo = isSel ? 0.9 : isHover ? 0.45 : 0
      s.glowTo = entering && isSel ? 3 : isSel ? 1.9 : isHover ? 1.55 : 1
      s.dimTo = outOfFamily || unborn ? 1 : trend && s.unknown ? 0.75 : 0
      if (!trend) s.hTo = unborn ? 0.3 : CUBE
      s.h = damp(s.h, s.hTo, 5, dt)
      s.lift = damp(s.lift, s.liftTo, 9, dt)
      s.glow = damp(s.glow, s.glowTo, 8, dt)
      s.dim = damp(s.dim, s.dimTo, 7, dt)
      if (!s.color.equals(s.colorTo)) {
        s.color.lerp(s.colorTo, 1 - Math.exp(-6 * dt))
        if (Math.abs(s.color.r - s.colorTo.r) + Math.abs(s.color.g - s.colorTo.g) + Math.abs(s.color.b - s.colorTo.b) < 0.002) s.color.copy(s.colorTo)
        cubes.setColorAt(i, s.color)
        pools.setColorAt(i, s.color)
        colorDirty = true
      }
      const bob = isSel ? Math.sin(time * 2.2) * 0.08 : 0
      const y0 = s.lift + bob
      p.set(s.x, y0 + s.h / 2, s.z)
      sc.set(1, s.h / CUBE, 1)
      cubes.setMatrixAt(i, m.compose(p, q, sc))
      glowAttr.array[i] = s.glow
      dimAttr.array[i] = s.dim
      pools.setMatrixAt(i, m.copy(poolM).setPosition(s.x, 0.02, s.z))

      const top = y0 + s.h + 0.015
      const t = tops[i]
      t.num.position.set(s.x - CUBE / 2 + 0.22, top, s.z - CUBE / 2 + 0.22)
      t.sym.position.set(s.x, top, s.z - 0.08)
      t.name.position.set(s.x, top, s.z + CUBE / 2 - 0.22)
      const f = fronts[i]
      const fy = y0 + Math.min(s.h, CUBE) * 0.58
      f.sym.position.set(s.x, fy, s.z + CUBE / 2 + 0.015)
      f.name.position.set(s.x, fy - 0.95, s.z + CUBE / 2 + 0.015)
      const a = 1 - 0.8 * s.dim
      for (const tt of [t.num, t.sym, t.name, f.sym, f.name]) tt.fillOpacity = a
    })
    hostLight.intensity = host ? 40 : 0
    for (const { star, s } of stars) {
      star.position.set(s.x, s.lift + s.h + 1.5 + Math.sin(time * 1.8 + s.x) * 0.15, s.z)
      star.rotation.y = time * 1.2
      star.visible = !host || host.i !== state.indexOf(s)
    }
    if (host) {
      const s = state[host.i]
      hostLight.position.set(s.x + 1.5, s.lift + s.h + 3.2, s.z + 3)
      host.holder.position.set(s.x, s.lift + s.h + 0.02, s.z - CUBE * 0.3)
      host.holder.rotation.y = Math.atan2(camera.position.x - s.x, camera.position.z - s.z) * 0.6
      host.a.update(dt, time, { speed: 0 })
    }
    cubes.instanceMatrix.needsUpdate = true
    pools.instanceMatrix.needsUpdate = true
    glowAttr.needsUpdate = true
    dimAttr.needsUpdate = true
    if (colorDirty) {
      cubes.instanceColor.needsUpdate = true
      pools.instanceColor.needsUpdate = true
    }
  }

  const retarget = t => {
    const el = t.at && element(t.at)
    if (el) {
      select(el.z, { frame: false })
      const v = closeUp(state[el.z - 1])
      controls.target.copy(v.target)
      camera.position.copy(v.position)
      camera.lookAt(v.target)
      flyTo(overview(), 1.6)
    }
  }

  const attach = () => {
    const start = overview()
    controls.target.copy(start.target)
    camera.position.copy(start.position)
    camera.lookAt(start.target)
    controls.enabled = true
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onLeave)
    window.addEventListener('keydown', onKey)
    store.set({ hover: null, selected: null, familyFocus: null, trend: null, year: null, knownCount: ELEMENTS.length })
    if (target.at) retarget(target)
  }

  // a reload comes back to the same view (the engine's keepSpot, the user, 2026-10-29): the camera, the
  // element picked, the trend and the family lit
  const r2 = v => Number(v.toFixed(2))
  const spot = () => ({
    cam: camera.position.toArray().map(r2),
    look: controls.target.toArray().map(r2),
    sel: selected >= 0 ? selected + 1 : null,
    trend: trend?.id ?? null,
    family: familyFocus,
  })
  const restoreSpot = s => {
    const ok = a => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite)
    if (s.sel >= 1 && s.sel <= state.length) select(s.sel, { frame: false })
    if (s.trend && TRENDS.some(t => t.id === s.trend)) setTrend(s.trend)
    if (s.family) focusFamily(s.family)
    if (ok(s.cam) && ok(s.look)) {
      fly = null
      controls.enabled = true
      controls.target.fromArray(s.look)
      camera.position.fromArray(s.cam)
      camera.lookAt(controls.target)
    }
  }

  const detach = () => {
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('keydown', onKey)
    canvas.style.cursor = ''
    controls.dispose()
    store.set({ hover: null, selected: null })
  }

  return {
    mode: 'orbit',
    root,
    env: { background: new THREE.Color('#04060f'), fog: new THREE.FogExp2('#121640', 0.0032), exposure: 1, bloom: { strength: 0.55, radius: 0.35, threshold: 0.8 }, envIntensity: 0.12, fov: 50 },
    attach,
    detach,
    update,
    retarget,
    spot,
    restoreSpot,
    resize: () => {},
    select: z => select(z),
    focusFamily,
    setTrend,
    setYear,
    enterSelected,
    overview: () => flyTo(overview()),
    // where an Atomling stands on a cube (others.js seats the others' there) and the cube mine stands on
    cubeSeat: z => {
      const s = state[z - 1]
      return s ? new THREE.Vector3(s.x, s.lift + s.h + 0.02, s.z - CUBE * 0.3) : null
    },
    hostZ: () => (host ? host.i + 1 : null),
    hostScale: k => host?.holder.scale.setScalar(k),
    dispose() {
      disc.dispose()
      verse.dispose()
    },
  }
}
