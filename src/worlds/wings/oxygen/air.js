// Oxygen's first wing, the air: a round sky deck floating above a sea of clouds in daylight, with snowy
// peaks far off and the ozone layer glowing high above. On the deck: the box of air (100 molecules in
// the real proportions, the oxygen counted), the rare CO2, O2 up close with its Lewis picture, liquid
// oxygen held by a magnet, the ozone layer in a column, where our oxygen comes from (a globe), and the
// Great Oxidation (a stromatolite pool and the history of oxygen in the air). The arch behind the
// spawn leads back to oxygen's hall. Contract: docs/knowledge/adding-a-wing.md.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { element, nameOf } from '../../../data/elements.js'
import { createAtomling } from '../../../characters/atomling.js'
import { arch } from '../../common/props.js'
import { box, circle } from '../../../engine/collide.js'
import { atriumPath } from '../../registry.js'
import { SUN, skyDome, skyEnvironment, cloudSea, peaks, ozoneLayer } from './airSky.js'
import { airBox } from './airBox.js'
import { o2UpClose, magnetBench } from './airO2.js'
import { ozoneColumn } from './airOzone.js'
import { globeExhibit } from './globe.js'
import { goeExhibit } from './airGoe.js'
import { breathExhibit } from './airBreath.js'
import { AIR_WORDS } from './airWords.js'
import { exhibitSet, onLevel, at, chem, canvasTex, makeNoise, glowMat, softDot } from './kit.js'

const COLOR = '#8fd0ff'
const R = 12.5 // the deck's radius
const GAP = 0.2 // half the angle of the opening for the arch (radians)

export async function build(ctx) {
  const el = element('O')
  const lang = ctx.lang()
  const W = AIR_WORDS[lang] ?? AIR_WORDS.en
  const who = nameOf(el, lang)
  const light = ctx.light
  const root = new THREE.Group()
  root.name = 'wing-O-air'
  const updates = []
  const disposables = []

  // ---- sky, clouds, peaks, the ozone layer ----
  const env = skyEnvironment(ctx.renderer)
  disposables.push(env)
  root.add(skyDome())
  const clouds = cloudSea({ light })
  root.add(clouds.mesh)
  updates.push((dt, t) => clouds.update(t))
  root.add(peaks())
  const ozone = ozoneLayer({ light })
  root.add(ozone.group)
  updates.push((dt, t) => ozone.update(dt, t, ctx.camera, ctx.renderer))

  // ---- light: a low warm sun, the blue sky, and light thrown up by the clouds ----
  const sun = new THREE.DirectionalLight('#fff0dc', 3.1)
  sun.position.copy(SUN).multiplyScalar(45)
  sun.target.position.set(0, 0, 0)
  if (!light) {
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    const c = sun.shadow.camera
    c.left = -16
    c.right = 16
    c.top = 16
    c.bottom = -16
    c.near = 5
    c.far = 95
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.03
    sun.shadow.radius = 3
  }
  root.add(sun, sun.target, new THREE.HemisphereLight('#bcd6ff', '#f2eee6', 0.55))

  // ---- the deck ----
  const noise = makeNoise(5)
  const texSize = light ? 1024 : 2048
  const deckMap = canvasTex(texSize, (g, s) => {
    const img = g.createImageData(s, s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const u = x / s
        const v = y / s
        const n = noise.fbm2(u * 24, v * 24, 4)
        const fine = noise.n2(u * 400, v * 400)
        const k = 0.9 + (n - 0.5) * 0.08 + (fine - 0.5) * 0.03
        const i = (y * s + x) * 4
        img.data[i] = 232 * k
        img.data[i + 1] = 230 * k
        img.data[i + 2] = 225 * k
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
    // joints: rings of slabs and their radial seams
    g.strokeStyle = 'rgba(120,128,140,0.35)'
    g.lineWidth = s / 1024
    const c = s / 2
    const px = r => (r / R) * (s / 2)
    for (const r of [2.2, 4.6, 6.5, 8.4, 10.3, 12.1]) {
      g.beginPath()
      g.arc(c, c, px(r), 0, Math.PI * 2)
      g.stroke()
    }
    const rings = [[4.6, 6.5, 24], [6.5, 8.4, 32], [8.4, 10.3, 40], [10.3, 12.1, 48], [2.2, 4.6, 16]]
    for (const [a, b, n] of rings) {
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2 + (n % 16) * 0.05
        g.beginPath()
        g.moveTo(c + Math.cos(t) * px(a), c + Math.sin(t) * px(a))
        g.lineTo(c + Math.cos(t) * px(b), c + Math.sin(t) * px(b))
        g.stroke()
      }
    }
  })
  // the glowing inlay: a ring round the box, one near the rail, and paths out to the exhibits
  const SPOTS = [-90, -45, 0, 45, 90, 135].map(a => (a * Math.PI) / 180)
  const deckGlow = canvasTex(light ? 1024 : 2048, (g, s) => {
    g.fillStyle = '#000'
    g.fillRect(0, 0, s, s)
    const c = s / 2
    const px = r => (r / R) * (s / 2)
    g.strokeStyle = '#fff'
    g.lineWidth = s / 400
    for (const r of [4.6, 11.85]) {
      g.beginPath()
      g.arc(c, c, px(r), 0, Math.PI * 2)
      g.stroke()
    }
    g.lineWidth = s / 700
    for (const a of SPOTS) {
      // canvas: x right, y down = world x, world z; azimuth a from north (-z) toward east (+x)
      const dx = Math.sin(a)
      const dz = -Math.cos(a)
      g.beginPath()
      g.moveTo(c + dx * px(4.6), c + dz * px(4.6))
      g.lineTo(c + dx * px(6.2), c + dz * px(6.2))
      g.stroke()
      g.beginPath()
      g.arc(c + dx * px(8.6), c + dz * px(8.6), px(1.55), 0, Math.PI * 2)
      g.stroke()
    }
  })
  const deck = new THREE.Mesh(
    new THREE.CircleGeometry(R, 160),
    new THREE.MeshStandardMaterial({ map: deckMap, roughness: 0.42, metalness: 0.05, emissive: COLOR, emissiveMap: deckGlow, emissiveIntensity: 0.9 }),
  )
  // the circle's UVs map x to u and y to v; lying flat, its +y becomes -z, so flip v to match the canvas
  deck.geometry.attributes.uv.array.forEach((v, i, a) => {
    if (i % 2) a[i] = 1 - v
  })
  deck.rotation.x = -Math.PI / 2
  deck.receiveShadow = true
  root.add(deck)
  const whiteMat = new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35, metalness: 0.08 })
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(R, R - 0.25, 0.5, 160, 1, true), whiteMat)
  rim.position.y = -0.25
  root.add(rim)
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R, 0.05, 8, 200), glowMat(COLOR, 1.8))
  lip.rotation.x = Math.PI / 2
  lip.position.y = -0.03
  root.add(lip)
  // the underside: a shallow cone with glowing rings, and a core of light that holds it up
  const under = new THREE.Mesh(
    new THREE.LatheGeometry([
      new THREE.Vector2(R - 0.25, -0.5), new THREE.Vector2(R - 0.9, -1.2), new THREE.Vector2(R * 0.62, -3.1),
      new THREE.Vector2(3.2, -6.3), new THREE.Vector2(1.2, -8.2), new THREE.Vector2(0.01, -8.6),
    ], 96),
    new THREE.MeshStandardMaterial({ color: '#dfe5ee', roughness: 0.45, metalness: 0.35 }),
  )
  root.add(under)
  for (const [r, y] of [[R - 0.95, -1.25], [R * 0.64, -3.0], [3.3, -6.2]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 8, 160), glowMat(COLOR, 2))
    ring.rotation.x = Math.PI / 2
    ring.position.y = y
    root.add(ring)
  }
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 16), glowMat('#bfe6ff', 3))
  core.position.y = -8.6
  root.add(core)
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128), color: '#9fdcff', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }))
  coreGlow.scale.setScalar(9)
  coreGlow.position.y = -8.6
  root.add(coreGlow)

  // ---- the railing: a curved glass wall with a glowing top rail, open at the arch ----
  const railH = 1.08
  const railR = R - 0.18
  const glassBand = new THREE.Mesh(
    new THREE.CylinderGeometry(railR, railR, railH - 0.1, 160, 1, true, GAP, Math.PI * 2 - GAP * 2),
    new THREE.MeshPhysicalMaterial({
      color: '#cfe8ff', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.16, envMapIntensity: 1.5,
      side: THREE.DoubleSide, depthWrite: false, clearcoat: 1,
    }),
  )
  glassBand.position.y = (railH - 0.1) / 2
  glassBand.renderOrder = 3
  root.add(glassBand)
  const railArc = new THREE.Group()
  railArc.rotation.y = -Math.PI / 2 + GAP
  const topRail = new THREE.Mesh(new THREE.TorusGeometry(railR, 0.05, 10, 200, Math.PI * 2 - GAP * 2), whiteMat)
  topRail.rotation.x = -Math.PI / 2
  topRail.position.y = railH
  const railGlow = new THREE.Mesh(new THREE.TorusGeometry(railR - 0.035, 0.018, 6, 200, Math.PI * 2 - GAP * 2), glowMat(COLOR, 2.2))
  railGlow.rotation.x = -Math.PI / 2
  railGlow.position.y = railH - 0.06
  railArc.add(topRail, railGlow)
  root.add(railArc)
  const postCount = 40
  const posts = new THREE.InstancedMesh(new RoundedBoxGeometry(0.07, railH, 0.07, 2, 0.02), whiteMat, postCount)
  const m4 = new THREE.Matrix4()
  let placed = 0
  for (let i = 0; i < postCount; i++) {
    const a = GAP + (i / (postCount - 1)) * (Math.PI * 2 - GAP * 2)
    m4.makeRotationY(a).setPosition(Math.sin(a) * railR, railH / 2, Math.cos(a) * railR)
    posts.setMatrixAt(placed++, m4)
  }
  posts.castShadow = true
  root.add(posts)

  // the deck's edge as solids (the opening is closed behind the arch)
  const solids = []
  const segs = 48
  for (let i = 0; i < segs; i++) {
    const a = ((i + 0.5) / segs) * Math.PI * 2
    const chord = 2 * (R + 0.2) * Math.sin(Math.PI / segs) + 0.3
    solids.push(box(Math.sin(a) * (R + 0.05), Math.cos(a) * (R + 0.05), chord, 0.7, { rot: a }))
  }

  // ---- the arch back to oxygen's hall ----
  const back = arch({ width: 3.6, height: 4.4, color: '#5aa9ff', label: W.back, portal: 'swirl' })
  back.group.position.set(0, 0, R - 0.25)
  back.group.rotation.y = Math.PI
  root.add(back.group)
  updates.push((dt, t) => back.update(t))
  const doors = [{ x: 0, z: R - 0.05, radius: 0.85, to: atriumPath('O') }]

  // ---- exhibits ----
  const ex = exhibitSet(ctx, { wing: 'air', color: COLOR, who, busy: lv => at(W.busy, lv) })
  const level = () => ctx.level()

  // the box of air, in the middle
  const air = airBox({ x: 0, z: -0.6, color: COLOR, light, words: { screenTitle: W.box.screenTitle, rareTag: W.rare.tag } })
  root.add(air.group)
  solids.push(box(0, -0.6, air.halfSize.x * 2 + 0.1, air.halfSize.z * 2 + 0.1))
  solids.push(box(0, -0.6 + 1.7 + 0.55, 0.6, 0.4))
  updates.push((dt, t) => air.update(dt, t, ctx.camera))
  const modes = ['all', 'O2', 'N2', 'Ar']
  const nextMode = () => modes[(modes.indexOf(air.mode) + 1) % modes.length]
  ex.add({
    id: 'box',
    x: 0,
    z: 2.75,
    radius: 1.9,
    screen: air.con,
    label: W.box.label,
    verb: () => W.box.verbs[nextMode()],
    act: () => {
      air.setMode(nextMode())
      return at(W.box.says[air.mode], level())
    },
    panel: lv => ({ title: W.box.title, kicker: W.kicker, color: COLOR, blocks: W.box.panel[lv === 'scientist' ? 'sci' : 'kid'] }),
  })
  // the rare one, beside the box
  air.rare.position.set(-3.75, 0, 2.55)
  root.add(air.rare)
  solids.push(box(-3.75, 2.55, 0.7, 0.7))
  updates.push((dt, t) => air.rareUpdate(t))
  ex.add({
    id: 'rare',
    x: -3.75,
    z: 3.45,
    radius: 1.0,
    label: W.rare.label,
    verb: W.rare.verb,
    panel: lv => ({ title: W.rare.title, kicker: W.kicker, color: '#9ff0c0', blocks: W.rare.panel[lv === 'scientist' ? 'sci' : 'kid'] }),
  })

  // ---- the exhibits round the deck, each facing the middle ----
  const refreshers = []
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  /** Puts an exhibit at an azimuth (degrees from north toward east) and distance, facing the middle;
   *  returns where a point given in the exhibit's own frame lands in the world. */
  const stand = (obj, az, dist) => {
    const a = (az * Math.PI) / 180
    const x = Math.sin(a) * dist
    const z = -Math.cos(a) * dist
    obj.position.set(x, 0, z)
    obj.rotation.y = Math.atan2(-x, -z)
    root.add(obj)
    const rot = obj.rotation.y
    return {
      x,
      z,
      rot,
      at: (lx, lz) => ({ x: x + lx * Math.cos(rot) + lz * Math.sin(rot), z: z - lx * Math.sin(rot) + lz * Math.cos(rot) }),
    }
  }

  // O2 up close (east)
  const o2 = o2UpClose({ color: COLOR, light, words: W.o2, level })
  const o2At = stand(o2.group, 90, 8.6)
  updates.push((dt, t) => o2.update(dt, t))
  refreshers.push(() => o2.refresh())
  solids.push(circle(o2At.x, o2At.z, 1.08))
  const o2Scr = o2At.at(1.85, 0.55)
  solids.push(circle(o2Scr.x, o2Scr.z, 0.4))
  const o2Spot = o2At.at(0, 2.3)
  ex.add({
    id: 'o2',
    x: o2Spot.x,
    z: o2Spot.z,
    radius: 1.9,
    screen: o2.screen,
    label: W.o2.label,
    verb: () => (o2.showing ? W.o2.verbs.hide : W.o2.verbs.show),
    act: () => at(W.o2.says[o2.toggle() ? 'show' : 'hide'], level()),
    panel: lv => ({ title: W.o2.title, kicker: W.kicker, color: '#ff7a6b', blocks: W.o2.panel[depth(lv)] }),
  })

  // liquid oxygen and the magnet (west)
  const mag = magnetBench({ color: COLOR, light, words: W.magnet, level })
  const magAt = stand(mag.group, -90, 8.7)
  updates.push((dt, t) => mag.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => mag.refresh())
  solids.push(box(magAt.x, magAt.z, 1.75, 1.05, { rot: magAt.rot }))
  const magScr = magAt.at(-1.45, 0.35)
  solids.push(circle(magScr.x, magScr.z, 0.4))
  const magSpot = magAt.at(0, 1.9)
  ex.add({
    id: 'magnet',
    x: magSpot.x,
    z: magSpot.z,
    radius: 1.7,
    screen: mag.screen,
    label: W.magnet.label,
    verb: () => W.magnet.verbs[mag.next],
    act: () => {
      const kind = mag.pour()
      return kind ? at(W.magnet.says[kind], level()) : false
    },
    panel: lv => ({ title: W.magnet.title, kicker: W.kicker, color: '#9fd2ff', blocks: W.magnet.panel[depth(lv)] }),
  })

  // the ozone layer in a column (north-west)
  const col = ozoneColumn({ color: COLOR, light, words: W.ozone, level })
  const colAt = stand(col.group, -45, 8.7)
  updates.push((dt, t) => col.update(dt, t, ctx.camera, ctx.renderer))
  refreshers.push(() => col.refresh())
  solids.push(circle(colAt.x, colAt.z, 1.22))
  const colScr = colAt.at(1.75, 0.75)
  solids.push(circle(colScr.x, colScr.z, 0.4))
  const colSpot = colAt.at(0, 2.4)
  ex.add({
    id: 'ozone',
    x: colSpot.x,
    z: colSpot.z,
    radius: 1.9,
    screen: col.screen,
    label: W.ozone.label,
    verb: W.ozone.verb,
    act: () => {
      if (!col.start()) return false
      ozone.volley(12)
      return at(W.ozone.says, level())
    },
    panel: lv => ({ title: W.ozone.title, kicker: W.kicker, color: '#b99cff', blocks: W.ozone.panel[depth(lv)] }),
  })

  // where our oxygen comes from: the globe (north, behind the box)
  const earth = globeExhibit({ color: COLOR, light, words: W.sources, level })
  const earthAt = stand(earth.group, 0, 8.7)
  updates.push((dt, t) => earth.update(dt, t))
  refreshers.push(() => earth.refresh())
  solids.push(circle(earthAt.x, earthAt.z, 0.98))
  const earthScr = earthAt.at(1.8, 0.7)
  solids.push(circle(earthScr.x, earthScr.z, 0.4))
  const earthSpot = earthAt.at(0, 2.2)
  ex.add({
    id: 'sources',
    x: earthSpot.x,
    z: earthSpot.z,
    radius: 1.9,
    screen: earth.screen,
    label: W.sources.label,
    verb: () => W.sources.verbs[earth.mode === 'land' ? 'ocean' : 'land'],
    act: () => at(W.sources.says[earth.next()], level()),
    panel: lv => ({ title: W.sources.title, kicker: W.kicker, color: '#6fe0a0', blocks: W.sources.panel[depth(lv)] }),
  })

  // the Great Oxidation (north-east)
  const goe = await goeExhibit({ color: COLOR, light, words: W.goe, level, lang })
  const goeAt = stand(goe.group, 45, 8.7)
  updates.push((dt, t) => goe.update(dt, t))
  refreshers.push(() => goe.refresh())
  solids.push(circle(goeAt.x, goeAt.z, 1.42))
  const goeBack = goeAt.at(0, -1.08)
  solids.push(box(goeBack.x, goeBack.z, 2.9, 0.3, { rot: goeAt.rot }))
  const goeSpot = goeAt.at(0, 2.5)
  ex.add({
    id: 'goe',
    x: goeSpot.x,
    z: goeSpot.z,
    radius: 1.9,
    screen: goe.screen,
    label: W.goe.label,
    verb: W.goe.verb,
    act: () => (goe.start() ? at(W.goe.says, level()) : false),
    panel: lv => ({ title: W.goe.title, kicker: W.kicker, color: '#6fe0c0', blocks: W.goe.panel[depth(lv)] }),
  })

  // breathing (south-east)
  const breath = breathExhibit({ color: COLOR, light, words: W.breath, level })
  const breathAt = stand(breath.group, 135, 8.7)
  updates.push((dt, t) => breath.update(dt, t))
  refreshers.push(() => breath.refresh())
  solids.push(box(breathAt.x, breathAt.z, 3.0, 1.2, { rot: breathAt.rot }))
  const breathScr = breathAt.at(0, 0.95)
  solids.push(circle(breathScr.x, breathScr.z, 0.4))
  const breathSpot = breathAt.at(0, 2.2)
  ex.add({
    id: 'breath',
    x: breathSpot.x,
    z: breathSpot.z,
    radius: 1.6,
    screen: breath.screen,
    label: W.breath.label,
    verb: W.breath.verb,
    act: () => (breath.start() ? at(W.breath.says, level()) : false),
    panel: lv => ({ title: W.breath.title, kicker: W.kicker, color: '#ff8fa0', blocks: W.breath.panel[depth(lv)] }),
  })

  // ---- the oxygen Atomling ----
  const avatar = createAtomling(el, { light })
  root.add(avatar.root)

  root.traverse(o => {
    if (o.isMesh && o.material?.isMeshStandardMaterial && !o.material.transparent) o.receiveShadow = true
  })

  // talking to the Atomling (T, the talk button, or E next to it in first person): hints and facts in turn
  let said = 0
  const talk = () => {
    const lines = [at(W.greet, level()), ...W.talk[depth(level())]]
    said = (said + 1) % lines.length
    ctx.store.set({ panel: null, speech: { text: chem(lines[said]), who, color: COLOR } })
  }
  const host = {
    id: 'host',
    get x() {
      return ctx.engine.player.npc?.x ?? 99
    },
    get z() {
      return ctx.engine.player.npc?.z ?? 99
    },
    radius: 2.0,
    label: who,
    verb: W.talkTo,
    onUse: talk,
  }

  let unsub = null
  const fogColor = new THREE.Color().setRGB(0.74, 0.81, 0.91, THREE.LinearSRGBColorSpace)
  return {
    mode: 'walk',
    root,
    title: ctx.t('wings.O.air.title'),
    env: {
      background: new THREE.Color('#8fb8e6'),
      fog: new THREE.Fog(fogColor, 700, 7600),
      environment: env.texture,
      exposure: 0.9,
      envIntensity: 0.55,
      bloom: { strength: 0.32, radius: 0.55, threshold: 0.95 },
      fov: 62,
      far: 9000,
      shadows: true,
    },
    spawn: { x: 0, z: R - 4.6, yaw: 0 },
    hostSpot: { x: 2.1, z: R - 6.2, yaw: Math.atan2(2.1, -1.6) },
    avatar,
    solids,
    // the camera may swing out over the railing, but never behind the arch (its portal would fill the view)
    cameraBounds: { minX: -R - 3, maxX: R + 3, minY: 0.35, maxY: 14, minZ: -R - 3, maxZ: R - 0.8 },
    // the Atomling's player can tilt the view up to the ozone layer and the Sun's rays
    cameraPitchMax: 0.9,
    interactables: [...ex.list, host],
    doors,
    talk,
    attach() {
      ex.report()
      unsub = onLevel(ctx.store, () => refreshers.forEach(f => f()))
      setTimeout(() => {
        if (ctx.engine.world?.root === root) ctx.store.set({ speech: { text: chem(at(W.greet, ctx.level())), who, color: COLOR } })
      }, 900)
    },
    detach() {
      unsub?.()
      ctx.store.set({ speech: null, discoveries: null })
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
      ex.sync()
    },
    dispose() {
      for (const d of disposables) d.dispose()
    },
  }
}
