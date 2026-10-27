// The Great Oxidation: a stone pool with stromatolites (rocks built layer by layer by mats of
// cyanobacteria) whose green mats give off bubbles of oxygen, and a screen with the history of oxygen
// in the air over 4.6 billion years. Using it travels through time: the curve draws itself from the
// Earth's birth to today, the mats wake up (the first stromatolites, about 3.5 billion years ago), the
// bubbles come, and at about 2.4 billion years the oxygen in the air begins to rise.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { screen, glowMat, hdr, makeNoise, damp, random, canvasTex, smooth, normalFromHeight } from './kit.js'
import { o2At } from './oxygenData.js'

const MAX_PCT = 35

async function fontsReady() {
  try {
    await Promise.all([document.fonts.load('700 48px Outfit'), document.fonts.load('700 40px Nunito')])
  } catch {
    // the canvas falls back to a system face
  }
}

/** The graph: axes, grid and labels (back), and the curve alone (front, revealed as time runs). */
function graphTextures(words, lang) {
  const w = 2048
  const h = 1024
  const L = 230
  const Rm = 120
  const T = 150
  const B = 190
  const pw = w - L - Rm
  const ph = h - T - B
  const X = ga => L + ((4.6 - ga) / 4.6) * pw
  const Y = pct => T + ph - (pct / MAX_PCT) * ph
  const num = v => v.toLocaleString(lang === 'pt-pt' ? 'pt-PT' : 'en')
  const back = canvasTex(w, g => {
    g.clearRect(0, 0, w, h)
    g.lineWidth = 3
    g.strokeStyle = 'rgba(160,180,255,0.18)'
    g.fillStyle = 'rgba(205,215,255,0.9)'
    g.font = '600 44px Nunito'
    g.textAlign = 'right'
    g.textBaseline = 'middle'
    for (const p of [0, 10, 20, 30]) {
      g.beginPath()
      g.moveTo(L, Y(p))
      g.lineTo(L + pw, Y(p))
      g.stroke()
      g.fillText(`${p}%`, L - 24, Y(p))
    }
    g.textAlign = 'center'
    g.textBaseline = 'top'
    for (const ga of [4, 3, 2, 1, 0]) {
      g.beginPath()
      g.moveTo(X(ga), T + ph)
      g.lineTo(X(ga), T + ph + 16)
      g.stroke()
      g.fillText(ga === 0 ? words.axis.now : num(ga), X(ga), T + ph + 26)
    }
    g.font = '700 42px Nunito'
    g.fillStyle = 'rgba(205,215,255,0.75)'
    g.fillText(words.axis.ago, L + pw / 2, T + ph + 92)
    // the y axis title: "O2 in the air", the 2 small and low
    g.save()
    g.translate(70, T + ph / 2)
    g.rotate(-Math.PI / 2)
    g.textAlign = 'left'
    g.textBaseline = 'alphabetic'
    g.font = '700 46px Outfit'
    const title = words.axis.o2.replace('O2', '')
    const wO = g.measureText('O').width
    const w2 = (() => {
      g.font = '700 30px Outfit'
      return g.measureText('2').width
    })()
    g.font = '700 46px Outfit'
    const wt = g.measureText(title).width
    const x0 = -(wO + w2 + wt) / 2
    g.fillText('O', x0, 16)
    g.font = '700 30px Outfit'
    g.fillText('2', x0 + wO, 28)
    g.font = '700 46px Outfit'
    g.fillText(title, x0 + wO + w2, 16)
    g.restore()
    // the axes
    g.strokeStyle = 'rgba(205,215,255,0.8)'
    g.lineWidth = 5
    g.beginPath()
    g.moveTo(L, T)
    g.lineTo(L, T + ph)
    g.lineTo(L + pw, T + ph)
    g.stroke()
    // today's 21%: dashed
    g.setLineDash([18, 14])
    g.strokeStyle = 'rgba(143,208,255,0.55)'
    g.lineWidth = 4
    g.beginPath()
    g.moveTo(L, Y(21))
    g.lineTo(L + pw, Y(21))
    g.stroke()
    g.setLineDash([])
    // events
    const marks = [
      [4.54, words.marks.earth, 0], [3.5, words.marks.stromatolites, 1], [2.4, words.marks.goe, 0],
      [0.57, words.marks.animals, 1], [0.23, words.marks.dinos, 2],
    ]
    g.font = '700 38px Nunito'
    g.textBaseline = 'bottom'
    for (const [ga, text, row] of marks) {
      const x = X(ga)
      g.strokeStyle = 'rgba(255,209,102,0.55)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(x, T + ph)
      g.lineTo(x, T + 40 + row * 52)
      g.stroke()
      g.fillStyle = 'rgba(255,220,140,0.95)'
      g.textAlign = ga > 4 ? 'left' : ga < 0.4 ? 'right' : 'center'
      g.fillText(text, ga > 4 ? x - 10 : ga < 0.4 ? x + 30 : x, T + 36 + row * 52)
    }
  }, { srgb: true, mipmaps: true, height: h })
  const curve = canvasTex(w, g => {
    g.clearRect(0, 0, w, h)
    const pts = []
    for (let ga = 4.6; ga >= -0.0001; ga -= 0.005) pts.push([X(Math.max(0, ga)), Y(o2At(Math.max(0, ga)))])
    // under the curve, a soft fill
    const grad = g.createLinearGradient(0, T, 0, T + ph)
    grad.addColorStop(0, 'rgba(120,220,255,0.38)')
    grad.addColorStop(1, 'rgba(120,220,255,0.04)')
    g.fillStyle = grad
    g.beginPath()
    g.moveTo(pts[0][0], T + ph)
    for (const [x, y] of pts) g.lineTo(x, y)
    g.lineTo(pts[pts.length - 1][0], T + ph)
    g.closePath()
    g.fill()
    g.strokeStyle = '#bfefff'
    g.lineWidth = 9
    g.lineJoin = 'round'
    g.beginPath()
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
    g.stroke()
    // today's value
    g.fillStyle = '#ffffff'
    g.font = '700 46px Outfit'
    g.textAlign = 'right'
    g.textBaseline = 'bottom'
    g.fillText(words.marks.today, L + pw, Y(21) - 14)
  }, { srgb: true, height: h })
  return { back, curve, X: ga => (X(ga) / w), Y: pct => 1 - Y(pct) / h }
}

export async function goeExhibit({ color, light, words, level, lang }) {
  await fontsReady()
  const group = new THREE.Group()
  const rnd = random(24)
  const noise = makeNoise(41)

  // the pool: a ring of pale stone, a sandy floor, still water
  const stoneTex = canvasTex(512, (g, s) => {
    const img = g.createImageData(s, s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = noise.fbm2(x / 30, y / 30, 5)
        const k = 0.78 + n * 0.3
        img.data.set([196 * k, 188 * k, 172 * k, 255], (y * s + x) * 4)
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: 0 })
  stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping
  stoneTex.repeat.set(4, 1)
  const stone = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.85, metalness: 0 })
  const Rp = 1.25
  const basin = new THREE.Mesh(
    new THREE.LatheGeometry([
      new THREE.Vector2(Rp - 0.2, 0.12), new THREE.Vector2(Rp - 0.16, 0.46), new THREE.Vector2(Rp - 0.08, 0.52),
      new THREE.Vector2(Rp + 0.04, 0.52), new THREE.Vector2(Rp + 0.1, 0.46), new THREE.Vector2(Rp + 0.14, 0.0),
    ], 72),
    stone,
  )
  basin.castShadow = basin.receiveShadow = true
  const floorMat = new THREE.MeshStandardMaterial({ color: '#c9b48c', roughness: 0.95 })
  const floor = new THREE.Mesh(new THREE.CircleGeometry(Rp - 0.18, 64), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0.12
  floor.receiveShadow = true
  group.add(basin, floor)
  const glowRing = new THREE.Mesh(new THREE.TorusGeometry(Rp + 0.15, 0.025, 8, 80), glowMat(color, 1.6))
  glowRing.rotation.x = Math.PI / 2
  glowRing.position.y = 0.02
  group.add(glowRing)

  // stromatolites: domes of thin layers, their tops green with the living mat
  const bandTex = canvasTex(256, (g, s) => {
    for (let y = 0; y < s; y++) {
      const n = noise.n2(3, y / 3)
      const layer = Math.sin(y * 0.9 + noise.n2(y / 9, 7) * 4) * 0.5 + 0.5
      const k = 0.76 + layer * 0.13 + n * 0.1
      g.fillStyle = `rgb(${172 * k},${150 * k},${118 * k})`
      g.fillRect(0, y, s, 1)
    }
  })
  const stromMat = new THREE.MeshStandardMaterial({ map: bandTex, roughness: 0.9 })
  // the living mat: a thin olive film over each head, glowing softly while it makes oxygen
  const matMat = new THREE.MeshStandardMaterial({ color: '#5a5e36', emissive: '#8dff9a', emissiveIntensity: 0, roughness: 0.95, transparent: true, opacity: 0.9 })
  const tops = []
  const spots = [[0, 0, 0.32, 0.4], [-0.55, 0.25, 0.24, 0.33], [0.5, 0.3, 0.27, 0.36], [-0.3, -0.55, 0.22, 0.31], [0.42, -0.5, 0.2, 0.34], [-0.72, -0.18, 0.16, 0.28]]
  // a head: a narrow neck widening upward, then a round dome (as the ones of Shark Bay)
  const headShape = (r, hgt, seed) => {
    const capH = Math.min(hgt * 0.5, r * 0.85)
    const neck = hgt - capH
    const pts = []
    const N = 22
    for (let i = 0; i <= N; i++) {
      const y = (i / N) * hgt
      let rad
      if (y <= neck) rad = r * (0.72 + 0.28 * Math.pow(y / neck, 0.7))
      else rad = r * Math.sqrt(Math.max(0, 1 - ((y - neck) / capH) ** 2))
      rad += (noise.n2(i * 0.7, seed * 9) - 0.5) * r * 0.08 * (rad > 0.02 ? 1 : 0)
      pts.push(new THREE.Vector2(Math.max(0.0015, rad), y))
    }
    return { pts, neck, capH }
  }
  spots.forEach(([x, z, r, hgt], k) => {
    const { pts, neck } = headShape(r, hgt, k + 1)
    const dome = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), stromMat)
    dome.position.set(x, 0.12, z)
    dome.castShadow = true
    // the mat: the same shape from a little below the shoulder up, a few millimetres out
    const film = pts.filter(p => p.y >= neck + (hgt - neck) * 0.25).map(p => new THREE.Vector2(p.x + 0.005, p.y + 0.003))
    const cap = new THREE.Mesh(new THREE.LatheGeometry(film, 32), matMat)
    cap.position.copy(dome.position)
    group.add(dome, cap)
    tops.push(new THREE.Vector3(x, 0.12 + hgt, z))
  })

  // the water
  const waterHeights = new Float32Array(256 * 256)
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) waterHeights[y * 256 + x] = noise.fbm2(x / 20, y / 20, 4)
  const waterNormal = normalFromHeight(waterHeights, 256, 3)
  waterNormal.wrapS = waterNormal.wrapT = THREE.RepeatWrapping
  waterNormal.repeat.set(2, 2)
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: '#3a6f63', roughness: 0.06, metalness: 0, transparent: true, opacity: 0.42, normalMap: waterNormal,
    normalScale: new THREE.Vector2(0.25, 0.25), clearcoat: 1, envMapIntensity: 1.3,
  })
  const water = new THREE.Mesh(new THREE.CircleGeometry(Rp - 0.15, 64), waterMat)
  water.rotation.x = -Math.PI / 2
  water.position.y = 0.42
  water.renderOrder = 3
  group.add(water)
  const early = new THREE.Color('#5c7148') // iron-rich, oxygen-free water: murky green
  const now = new THREE.Color('#2f7d86')

  // bubbles of oxygen
  const bn = light ? 18 : 40
  const bubbleMat = new THREE.MeshStandardMaterial({ color: '#e9fbff', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85, emissive: '#bff', emissiveIntensity: 0.25 })
  const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 10, 8), bubbleMat, bn)
  bubbles.frustumCulled = false
  group.add(bubbles)
  const bl = Array.from({ length: bn }, () => ({ on: false, p: new THREE.Vector3(), s: 1, v: 0.2 }))
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const sc = new THREE.Vector3()

  // the history on a wide screen behind the pool
  const graph = graphTextures(words, lang)
  const scr = screen({ width: 2.8, height: 1.8, color, title: words.title, big: '', small: '', titleSize: 0.14 })
  scr.group.position.set(0, 1.72, -1.05)
  scr.group.rotation.x = -0.08
  group.add(scr.group)
  const legL = new THREE.Mesh(new RoundedBoxGeometry(0.1, 1.0, 0.08, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#eef1f5', roughness: 0.35 }))
  legL.position.set(-1.1, 0.5, -1.1)
  const legR = legL.clone()
  legR.position.x = 1.1
  legL.castShadow = legR.castShadow = true
  group.add(legL, legR)
  const gw = 2.56
  const gh = gw / 2
  const gy = -0.18
  const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), new THREE.MeshBasicMaterial({ map: graph.back, transparent: true, depthWrite: false, color: hdr('#ffffff', 1.15) }))
  backPlane.position.y = gy
  const reveal = { value: 0 }
  const curveMat = new THREE.MeshBasicMaterial({ map: graph.curve, transparent: true, depthWrite: false, color: hdr('#ffffff', 1.3) })
  curveMat.onBeforeCompile = s => {
    s.uniforms.uReveal = reveal
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uReveal;')
      .replace('#include <map_fragment>', '#include <map_fragment>\nif (vMapUv.x > uReveal) diffuseColor.a = 0.0;')
  }
  const curvePlane = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), curveMat)
  curvePlane.position.set(0, gy, 0.002)
  const head = new THREE.Mesh(new THREE.CircleGeometry(0.03, 20), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2.5) }))
  head.visible = false
  scr.content.add(backPlane, curvePlane, head)
  // when we are, while travelling (under the title)
  const yearText = makeText('', { size: 0.095, color: hdr('#ffd166', 1.5) })
  yearText.position.y = 0.58
  scr.content.add(yearText)
  const setYear = ga => {
    const text = ga == null ? '' : words.when(ga)
    if (yearText.text !== text) {
      yearText.text = text
      yearText.sync()
    }
  }

  // time: -1 idle (the whole curve shown), else 0..1 from 4.6 billion years ago to now
  let run = -1
  reveal.value = 1
  let mats = 0.6
  return {
    group,
    screen: scr,
    get busy() {
      return run >= 0
    },
    start() {
      if (run >= 0) return false
      run = 0
      reveal.value = 0
      return true
    },
    refresh() {},
    update(dt, t) {
      let ga = 0
      if (run >= 0) {
        run = Math.min(1, run + dt / 11)
        ga = 4.6 * (1 - run)
        reveal.value = THREE.MathUtils.lerp(graph.X(4.6), graph.X(0), run)
        head.visible = true
        head.position.set((graph.X(ga) - 0.5) * gw, (graph.Y(o2At(ga)) - 0.5) * gh + gy, 0.004)
        setYear(ga)
        if (run >= 1) {
          run = -1
          head.visible = false
          setTimeout(() => setYear(null), 2500)
        }
      }
      const living = run >= 0 ? smooth(3.7, 3.3, ga) : 1
      const oxygen = run >= 0 ? smooth(2.6, 2.2, ga) : 1
      mats = damp(mats, living, 3, dt)
      matMat.emissiveIntensity = mats * (0.025 + Math.sin(t * 2.5) * 0.01) + (run >= 0 ? 0.04 * mats : 0)
      waterMat.color.copy(early).lerp(now, run >= 0 ? oxygen : 1)
      waterNormal.offset.set(t * 0.01, t * 0.007)
      // bubbles: some from the start of the mats, many more once oxygen is building up
      const rate = (light ? 3 : 7) * mats * (run >= 0 ? 0.4 + oxygen : 1)
      if (rnd() < rate * dt) {
        const b = bl.find(x => !x.on)
        if (b) {
          const top = tops[Math.floor(rnd() * tops.length)]
          b.on = true
          b.p.copy(top).add(new THREE.Vector3((rnd() - 0.5) * 0.15, 0, (rnd() - 0.5) * 0.15))
          b.p.y = Math.min(b.p.y, 0.36) // from the drowned part of the mat
          b.v = 0.12 + rnd() * 0.1
          b.s = 0.6 + rnd() * 0.8
        }
      }
      bl.forEach((b, i) => {
        if (b.on) {
          b.p.y += b.v * dt
          b.p.x += Math.sin(t * 6 + i) * 0.02 * dt
          if (b.p.y > 0.42) b.on = false
        }
        bubbles.setMatrixAt(i, m4.compose(b.p, q, sc.setScalar(b.on ? b.s : 0)))
      })
      bubbles.instanceMatrix.needsUpdate = true
    },
  }
}
