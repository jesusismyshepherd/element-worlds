// The specimen case in every atrium: what the element looks like for real (data/appearance.js), on a
// plinth under a glass cover. Metals as a polished ingot and a nugget, crystals as a cluster, liquids in
// a flask, gases in a jar, noble gases as a glowing discharge tube, superheavies as a question mark
// (nobody has seen one).
import * as THREE from 'three'
import { makeText } from '../../engine/text.js'

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

export function specimen(el, look, { light = false, name = el.name.en } = {}) {
  const group = new THREE.Group()
  const rand = rnd(el.z * 97 + 13)
  const color = new THREE.Color(look.color)
  const updates = []

  // the plinth, its glass cover and the name plate
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.7, 0.95, 48),
    new THREE.MeshStandardMaterial({ color: '#1b2250', roughness: 0.35, metalness: 0.5 }),
  )
  plinth.position.y = 0.475
  group.add(plinth)
  const top = 0.95
  const cover = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.95, 48, 1, true),
    new THREE.MeshPhysicalMaterial({ color: '#dbe6ff', transparent: true, opacity: 0.14, roughness: 0.05, metalness: 0, side: THREE.DoubleSide, depthWrite: false }),
  )
  cover.position.y = top + 0.475
  const lid = new THREE.Mesh(new THREE.CircleGeometry(0.55, 48), cover.material)
  lid.rotation.x = -Math.PI / 2
  lid.position.y = top + 0.95
  group.add(cover, lid)
  const plate = makeText(`${el.symbol} · ${name}`, { size: 0.13, color: '#dfe6ff' })
  plate.position.set(0, 0.62, 0.705)
  group.add(plate)

  const item = new THREE.Group()
  item.position.y = top
  group.add(item)

  if (look.form === 'metal') {
    const mat = new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.22, clearcoat: 0.4 })
    const ingot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.34, 40), mat)
    ingot.position.set(-0.12, 0.17, -0.05)
    const lump = new THREE.Mesh(nugget(0.13, rand), new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.45 }))
    lump.position.set(0.2, 0.1, 0.1)
    item.add(ingot, lump)
  } else if (look.form === 'crystal') {
    const metallic = /metal|brilho|shine|shiny|graphite|grafite/i.test(look.look.en) && el.symbol !== 'S'
    const mat = look.rainbow
      ? new THREE.MeshPhysicalMaterial({ color, metalness: 0.9, roughness: 0.15, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [200, 900] })
      : new THREE.MeshPhysicalMaterial({ color, metalness: metallic ? 0.75 : 0.05, roughness: metallic ? 0.25 : 0.18, clearcoat: 0.8, emissive: look.glow ?? '#000000', emissiveIntensity: look.glow ? 0.35 : 0 })
    for (let i = 0; i < 7; i++) {
      const h = 0.14 + rand() * 0.26
      const geo = look.rainbow ? new THREE.BoxGeometry(0.11, 0.11, 0.11) : new THREE.OctahedronGeometry(0.07 + rand() * 0.04)
      const c = new THREE.Mesh(geo, mat)
      const a = (i / 7) * Math.PI * 2 + rand()
      const r = i === 0 ? 0 : 0.1 + rand() * 0.12
      c.position.set(Math.cos(a) * r, (look.rainbow ? 0.06 : h * 0.5) + (i === 0 ? 0.05 : 0), Math.sin(a) * r)
      if (look.rainbow) c.scale.setScalar(0.7 + rand() * 1.1)
      else c.scale.set(0.8, h / 0.14, 0.8)
      c.rotation.set(rand() * 0.6 - 0.3, rand() * Math.PI, rand() * 0.6 - 0.3)
      item.add(c)
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
      light ? new THREE.MeshStandardMaterial({ color: '#e8f0ff', transparent: true, opacity: 0.2, side: THREE.DoubleSide })
        : new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, thickness: 0.02, roughness: 0.03, ior: 1.5, side: THREE.DoubleSide }),
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
      new THREE.MeshPhysicalMaterial({ color: '#eef4ff', transparent: true, opacity: 0.18, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false }),
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

  if (look.radioactive) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.025, 8, 64), new THREE.MeshStandardMaterial({ color: '#ffd400', emissive: '#ffd400', emissiveIntensity: 0.6 }))
    band.rotation.x = Math.PI / 2
    band.position.y = 0.9
    group.add(band)
  }

  updates.push(t => (item.rotation.y = t * 0.25))
  return { group, update: t => updates.forEach(u => u(t)) }
}
