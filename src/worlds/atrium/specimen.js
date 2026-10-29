// The specimen case in every atrium: what the element looks like for real (data/appearance.js), in a
// museum showcase: a stepped plinth ringed in the family's colour, a turntable, a lamp over it in a tall
// glass case. Metals as stacked ingots stamped with the symbol and a nugget, crystals as a cluster of
// pointed crystals on their rock, liquids in a flask, gases in a jar, noble gases as a glowing
// discharge tube, superheavies as a question mark (nobody has seen one); some elements have their own
// showpiece (showpieces.js). The user, 2026-10-29: the podium should be "more substantial", its samples
// were "often generic polyhedra".
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { makeText } from '../../engine/text.js'
import { edgeGlass } from '../common/props.js'
import { FAMILY } from '../../data/elements.js'
import { SHOWPIECES } from './showpieces.js'

const rnd = seed => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

function nugget(r, rand) {
  const g = new THREE.IcosahedronGeometry(r, 2)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i)
    v.multiplyScalar(0.82 + rand() * 0.3)
    p.setXYZ(i, v.x, v.y * 0.8, v.z)
  }
  g.computeVertexNormals()
  return g
}

/** An ingot as cast: a trapezoid bar with softened edges, `w` long, lying along x. */
function ingot(w = 0.3, d = 0.13, h = 0.085) {
  const s = new THREE.Shape()
  const top = 0.82
  s.moveTo(-w / 2, -h / 2)
  s.lineTo(w / 2, -h / 2)
  s.lineTo((w / 2) * top, h / 2)
  s.lineTo((-w / 2) * top, h / 2)
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: d * top, bevelEnabled: true, bevelThickness: d * 0.09, bevelSize: 0.008, bevelSegments: 2 })
  g.translate(0, h / 2, (-d * top) / 2)
  g.computeVertexNormals()
  return g
}

/** One crystal: a six-sided prism with a pointed tip, standing on its base. */
function crystalGeo(r, h) {
  const prism = new THREE.CylinderGeometry(r, r * 1.05, h, 6)
  prism.translate(0, h / 2, 0)
  const tip = new THREE.ConeGeometry(r, r * 1.7, 6)
  tip.translate(0, h + r * 0.85, 0)
  const g = mergeGeometries([prism.toNonIndexed(), tip.toNonIndexed()])
  g.computeVertexNormals()
  return g
}

export function specimen(el, look, { light = false, name = el.name.en } = {}) {
  const group = new THREE.Group()
  const rand = rnd(el.z * 97 + 13)
  const color = new THREE.Color(look.color)
  const updates = []

  // the showcase: a stepped plinth ringed in the family's colour, a turntable, a tall glass case with a
  // lamp in its lid, a plate with the name on the front
  const family = new THREE.Color(FAMILY[el.family]?.color ?? '#7fd4ff')
  const dark = new THREE.MeshStandardMaterial({ color: '#1b2250', roughness: 0.35, metalness: 0.5 })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.1, 0.18, 64), dark)
  base.position.y = 0.09
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.99, 0.025, 8, 96), new THREE.MeshStandardMaterial({ color: family, emissive: family, emissiveIntensity: 1.4 }))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.19
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.92, 0.8, 64), dark)
  column.position.y = 0.58
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.88, 0.07, 64), new THREE.MeshStandardMaterial({ color: '#2a3270', roughness: 0.3, metalness: 0.6 }))
  lip.position.y = 1.015
  group.add(base, ring, column, lip)
  const top = 1.05
  const turntable = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.72, 0.04, 64), new THREE.MeshStandardMaterial({ color: '#10153a', roughness: 0.25, metalness: 0.7 }))
  turntable.position.y = top + 0.02
  const tableEdge = new THREE.Mesh(new THREE.TorusGeometry(0.71, 0.012, 6, 96), ring.material)
  tableEdge.rotation.x = Math.PI / 2
  tableEdge.position.y = top + 0.04
  group.add(turntable, tableEdge)
  const caseH = 1.3
  const cover = new THREE.Mesh(
    new THREE.CylinderGeometry(0.84, 0.84, caseH, 64, 1, true),
    edgeGlass(),
  )
  cover.position.y = top + caseH / 2
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.08, 64), lip.material)
  lid.position.y = top + caseH + 0.04
  // the lamp: a glowing disc under the lid, and its light on the sample
  const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.34, 48), new THREE.MeshBasicMaterial({ color: '#d9cfb8' }))
  lamp.rotation.x = Math.PI / 2
  lamp.position.y = top + caseH - 0.005
  const lampRim = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.02, 6, 96), ring.material)
  lampRim.rotation.x = Math.PI / 2
  lampRim.position.y = top + caseH + 0.085
  group.add(cover, lid, lamp, lampRim)
  if (!light) {
    const spot = new THREE.PointLight('#fff4dc', 2.2, 2.4, 1.6)
    spot.position.y = top + caseH - 0.15
    group.add(spot)
  }
  // the name plate wraps round the front of the column (the user, 2026-10-29: a flat plate stood off
  // the round column): a strip of the column's own cone, 1 m along it, and the name curved the same way
  // the name on one line, the strip as long as the name needs (a long one, Rutherfordium, broke onto two
  // lines over a fixed plate)
  const columnR = y => 0.92 - (0.06 * (y - 0.18)) / 0.8
  const plateY = 0.68
  const plateH = 0.22
  const strip = length => {
    const arc = length / columnR(plateY)
    return new THREE.CylinderGeometry(columnR(plateY + plateH / 2) + 0.008, columnR(plateY - plateH / 2) + 0.008, plateH, 48, 1, true, -arc / 2, arc)
  }
  const plateBack = new THREE.Mesh(strip(1.0), new THREE.MeshStandardMaterial({ color: '#c9a35a', metalness: 1, roughness: 0.3 }))
  plateBack.position.y = plateY
  const plateR = columnR(plateY) + 0.016
  const plate = makeText(`${el.symbol} · ${name}`, { size: 0.12, color: '#2a1d05' })
  plate.curveRadius = -plateR
  plate.position.set(0, plateY, plateR)
  plate.rotation.x = -Math.atan(0.06 / 0.8)
  plate.addEventListener('synccomplete', () => {
    const b = plate.textRenderInfo?.blockBounds
    if (!b) return
    plateBack.geometry.dispose()
    plateBack.geometry = strip(Math.max(0.6, b[2] - b[0] + 0.2))
  })
  group.add(plateBack, plate)

  // the sample, on the turntable, at about twice the size it had in the small case
  const item = new THREE.Group()
  item.position.y = top + 0.04
  item.scale.setScalar(1.9)
  group.add(item)

  const own = SHOWPIECES[el.symbol]?.({ light })
  if (own) {
    item.add(own.group)
    updates.push(own.update)
  } else if (look.form === 'metal') {
    // three cast ingots (two side by side, one across them), the top one stamped with the symbol, and
    // a nugget beside them
    const mat = new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.2, clearcoat: 0.4 })
    const bar = ingot()
    for (const z of [-0.075, 0.075]) {
      const b = new THREE.Mesh(bar, mat)
      b.position.set(-0.06, 0, z)
      item.add(b)
    }
    const topBar = new THREE.Mesh(bar, mat)
    topBar.position.set(-0.06, 0.09, 0)
    topBar.rotation.y = Math.PI / 2
    item.add(topBar)
    const stamp = makeText(el.symbol, { size: 0.07, color: color.clone().multiplyScalar(0.45).getStyle() })
    stamp.rotation.set(-Math.PI / 2, 0, Math.PI / 2)
    stamp.position.set(-0.06, 0.09 + 0.085 + 0.006, 0)
    item.add(stamp)
    const lump = new THREE.Mesh(nugget(0.075, rand), new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.42 }))
    lump.position.set(0.21, 0.055, 0.1)
    item.add(lump)
  } else if (look.form === 'crystal') {
    const metallic = /metal|brilho|shine|shiny|graphite|grafite/i.test(look.look.en) && el.symbol !== 'S'
    const mat = look.rainbow
      ? new THREE.MeshPhysicalMaterial({ color, metalness: 0.9, roughness: 0.15, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [200, 900] })
      : new THREE.MeshPhysicalMaterial({ color, metalness: metallic ? 0.75 : 0.05, roughness: metallic ? 0.25 : 0.18, clearcoat: 0.8, emissive: look.glow ?? '#000000', emissiveIntensity: look.glow ? 0.35 : 0 })
    if (look.rainbow) {
      // bismuth: stepped, hollow-faced cubes in rainbow colours
      for (let i = 0; i < 7; i++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), mat)
        const a = (i / 7) * Math.PI * 2 + rand()
        const r = i === 0 ? 0 : 0.1 + rand() * 0.12
        c.position.set(Math.cos(a) * r, 0.06 + (i === 0 ? 0.05 : 0), Math.sin(a) * r)
        c.scale.setScalar(0.7 + rand() * 1.1)
        c.rotation.set(rand() * 0.6 - 0.3, rand() * Math.PI, rand() * 0.6 - 0.3)
        item.add(c)
      }
    } else {
      // a cluster of pointed crystals growing out of a piece of rock, leaning outwards
      const rock = new THREE.Mesh(nugget(0.2, rand), new THREE.MeshStandardMaterial({ color: '#3b3533', roughness: 0.85, flatShading: true }))
      rock.scale.set(1, 0.45, 0.85)
      rock.position.y = 0.04
      item.add(rock)
      for (let i = 0; i < 11; i++) {
        const big = i < 3
        const r = big ? 0.045 + rand() * 0.015 : 0.022 + rand() * 0.02
        const h = big ? 0.2 + rand() * 0.12 : 0.07 + rand() * 0.12
        const c = new THREE.Mesh(crystalGeo(r, h), mat)
        const a = rand() * Math.PI * 2
        const d = big ? rand() * 0.06 : 0.05 + rand() * 0.11
        c.position.set(Math.cos(a) * d, 0.06, Math.sin(a) * d)
        // leaning away from the middle, the farther out the more
        const lean = 0.15 + d * 3.2
        c.rotation.set(Math.sin(a) * lean, rand() * Math.PI, -Math.cos(a) * lean)
        item.add(c)
      }
    }
    if (look.vapour) {
      const v = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), new THREE.MeshBasicMaterial({ color: look.vapour, transparent: true, opacity: 0.12, depthWrite: false }))
      v.position.y = 0.42
      v.scale.y = 0.6
      item.add(v)
      updates.push(t => (v.material.opacity = 0.09 + Math.sin(t * 1.3) * 0.04))
    }
  } else if (look.form === 'liquid') {
    // a round flask with the liquid in its lower half (and coloured fumes above, for bromine)
    const outline = [[0.02, 0], [0.18, 0.02], [0.27, 0.12], [0.28, 0.22], [0.24, 0.33], [0.1, 0.4], [0.07, 0.43], [0.07, 0.62], [0.085, 0.64]]
    const glass = new THREE.Mesh(
      new THREE.LatheGeometry(outline.map(([r, y]) => new THREE.Vector2(r, y)), 40),
      edgeGlass({ color: '#eef5ff', edge: 0.6, base: 0.03 }),
    )
    const fill = [[0.0, 0.01], [0.17, 0.025], [0.255, 0.12], [0.262, 0.17], [0.0, 0.17]]
    const metalLiquid = el.symbol === 'Hg'
    const liquid = new THREE.Mesh(
      new THREE.LatheGeometry(fill.map(([r, y]) => new THREE.Vector2(r, y)), 40),
      new THREE.MeshPhysicalMaterial({ color, metalness: metalLiquid ? 1 : 0, roughness: metalLiquid ? 0.08 : 0.15, clearcoat: 1 }),
    )
    item.add(liquid, glass)
    if (el.symbol === 'Br') {
      const fumes = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), new THREE.MeshBasicMaterial({ color: '#d2691e', transparent: true, opacity: 0.25, depthWrite: false }))
      fumes.position.y = 0.26
      fumes.scale.y = 0.55
      item.add(fumes)
    }
  } else if (look.form === 'gas') {
    // a stoppered jar; a coloured gas tints it, a colourless one shows only a faint shimmer
    const coloured = !/colourless/.test(look.look.en)
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.55, 40, 1, true),
      edgeGlass({ color: '#eef5ff', edge: 0.6, base: 0.03 }),
    )
    jar.position.y = 0.3
    const gas = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.5, 32),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: coloured ? 0.45 : 0.06, depthWrite: false }),
    )
    gas.position.y = 0.3
    const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.08, 24), new THREE.MeshStandardMaterial({ color: '#8b6a4a', roughness: 0.8 }))
    stopper.position.y = 0.61
    item.add(gas, jar, stopper)
    if (look.liquid) {
      // oxygen: a small flask of its pale blue liquid beside the jar
      const lq = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: look.liquid, roughness: 0.1, clearcoat: 1, emissive: look.liquid, emissiveIntensity: 0.15 }))
      lq.position.set(0.33, 0.09, 0.12)
      lq.rotation.x = Math.PI
      item.add(lq)
    }
  } else if (look.form === 'tube') {
    // a discharge tube glowing in the gas's colour, the way neon signs do
    const glow = new THREE.Color(look.glow)
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.28, 0.08, 0), new THREE.Vector3(-0.28, 0.5, 0), new THREE.Vector3(-0.1, 0.62, 0),
      new THREE.Vector3(0.1, 0.38, 0), new THREE.Vector3(0.28, 0.5, 0), new THREE.Vector3(0.28, 0.08, 0),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(path, 80, 0.035, 12), new THREE.MeshStandardMaterial({ color: glow, emissive: glow, emissiveIntensity: 1.25 }))
    const light2 = new THREE.PointLight(glow, 3, 2.5, 2)
    light2.position.y = 0.4
    for (const x of [-0.28, 0.28]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), new THREE.MeshStandardMaterial({ color: '#9aa1ad', metalness: 1, roughness: 0.3 }))
      cap.position.set(x, 0.05, 0)
      item.add(cap)
    }
    item.add(tube, light2)
    updates.push(t => (tube.material.emissiveIntensity = 1.2 + Math.sin(t * 9) * 0.08))
  } else {
    // nobody has seen it
    const q = makeText('?', { size: 0.6, color: '#7fe7ff', opacity: 0.85 })
    q.position.y = 0.42
    item.add(q)
    updates.push(t => {
      q.fillOpacity = 0.55 + 0.35 * Math.abs(Math.sin(t * 2.1)) * (Math.sin(t * 23) > -0.8 ? 1 : 0.3)
      q.rotation.y = Math.sin(t * 0.8) * 0.5
    })
  }

  const showpiece = !!own
  item.scale.setScalar(showpiece ? 1.9 : ({ liquid: 1.35, gas: 1.35, tube: 1.3, unknown: 1 })[look.form] ?? 1.9)

  if (look.radioactive) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.885, 0.03, 8, 96), new THREE.MeshStandardMaterial({ color: '#ffd400', emissive: '#ffd400', emissiveIntensity: 0.6 }))
    band.rotation.x = Math.PI / 2
    band.position.y = 0.94
    group.add(band)
  }

  updates.push(t => {
    item.rotation.y = t * 0.25
    turntable.rotation.y = t * 0.25
  })
  return { group, update: t => updates.forEach(u => u(t)) }
}
