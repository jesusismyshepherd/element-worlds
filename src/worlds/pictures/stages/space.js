// A stage for picture rooms (docs/knowledge/picture-rooms.md): a viewing deck floating in space. A round
// walkable deck with a glowing rim and a low shimmering field round its edge (you cannot fall off), its
// underside tapering into the dark; stars all round, above and below; two faint nebulae; a sun far off
// that lights whatever floats near the deck from one side (`sunDir`), so planets have a day side and a
// night side. Dark: the environment light is kept low (the default studio light washes a night out).
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { canvasTex } from '../../wings/noble/kit.js'
import { ringWall } from '../kit.js'

const TAU = Math.PI * 2

/** A soft round glow (white in the middle, clear at the edge), for sprites. */
export function glowTexture(size = 128) {
  return canvasTex(size, size, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.25, 'rgba(255,255,255,0.55)')
    grd.addColorStop(0.6, 'rgba(255,255,255,0.12)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export function spaceStage({ radius = 9, light = false, pixelRatio = 1, sun = [0.7, 0.42, 0.58], rim = '#7fdcff' } = {}) {
  const group = new THREE.Group()
  const textures = []
  const sunDir = new THREE.Vector3(...sun).normalize()

  // the sky: stars above (with the dome) and a second field turned over for the stars below the deck
  const sky = nightSky({ radius: 900, stars: light ? 900 : 2200, top: '#02030b', mid: '#04071a', horizon: '#060a22', pixelRatio })
  const below = nightSky({ radius: 880, stars: light ? 500 : 1500, pixelRatio })
  const dome = below.children[0]
  below.remove(dome)
  dome.geometry.dispose()
  dome.material.dispose()
  below.rotation.x = Math.PI
  group.add(sky, below)

  // faint nebulae far off, and the sun
  const glow = glowTexture(128)
  textures.push(glow)
  const sprite = (dir, color, size, opacity) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
    s.position.copy(new THREE.Vector3(...dir).normalize().multiplyScalar(760))
    s.scale.setScalar(size)
    s.renderOrder = -8
    group.add(s)
    return s
  }
  sprite([-0.7, 0.45, -0.55], '#3c6a2a', 900, 0.32)
  sprite([-0.4, 0.15, -0.9], '#2a2f6a', 700, 0.3)
  sprite([0.8, -0.1, -0.6], '#4a2a66', 800, 0.26)
  sprite([0.2, -0.6, 0.5], '#22305a', 900, 0.25)
  const sunDisc = sprite(sunDir.toArray(), new THREE.Color('#fff2d6').multiplyScalar(3), 46, 1)
  const sunHalo = sprite(sunDir.toArray(), '#ffd9a0', 260, 0.35)

  // the deck: a round floor of plates, seams and a painted guide ring
  const N = light ? 512 : 1024
  const paint = (g, w, glowOnly) => {
    const c = w / 2
    g.fillStyle = glowOnly ? '#000000' : '#323b5c'
    g.fillRect(0, 0, w, w)
    const rings = [0.16, 0.34, 0.55, 0.77, 0.985]
    if (!glowOnly) {
      for (let i = rings.length - 1; i >= 0; i--) {
        g.fillStyle = ['#2c3453', '#343e62', '#2f3859', '#363f63', '#30395a'][i]
        g.beginPath()
        g.arc(c, c, rings[i] * c, 0, TAU)
        g.fill()
      }
      // specks and wear
      let s = 11
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
      for (let i = 0; i < 2400; i++) {
        const v = 40 + rnd() * 40
        g.fillStyle = `rgba(${v},${v + 8},${v + 30},${0.12 + rnd() * 0.2})`
        g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 3, 1 + rnd() * 3)
      }
      // seams: rings and spokes
      g.strokeStyle = 'rgba(8,10,24,0.85)'
      g.lineWidth = w / 360
      for (const r of rings) {
        g.beginPath()
        g.arc(c, c, r * c, 0, TAU)
        g.stroke()
      }
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU
        const r0 = i % 2 ? rings[2] : rings[0]
        g.beginPath()
        g.moveTo(c + Math.cos(a) * r0 * c, c + Math.sin(a) * r0 * c)
        g.lineTo(c + Math.cos(a) * rings[4] * c, c + Math.sin(a) * rings[4] * c)
        g.stroke()
      }
      // rivets along the seams
      g.fillStyle = 'rgba(150,165,210,0.35)'
      for (const r of rings.slice(1)) {
        const n = Math.round(r * 90)
        for (let i = 0; i < n; i++) {
          const a = ((i + 0.5) / n) * TAU
          g.beginPath()
          g.arc(c + Math.cos(a) * (r * c - w / 200), c + Math.sin(a) * (r * c - w / 200), w / 600, 0, TAU)
          g.fill()
        }
      }
    }
    // the glowing guide: a ring of dashes and a thin circle round the middle
    g.strokeStyle = glowOnly ? '#5f9cc0' : '#5f7cae'
    g.lineWidth = w / 260
    g.setLineDash([w / 60, w / 90])
    g.beginPath()
    g.arc(c, c, 0.66 * c, 0, TAU)
    g.stroke()
    g.setLineDash([])
    g.lineWidth = w / 420
    g.beginPath()
    g.arc(c, c, 0.25 * c, 0, TAU)
    g.stroke()
    g.beginPath()
    g.arc(c, c, 0.93 * c, 0, TAU)
    g.stroke()
  }
  const floorTex = canvasTex(N, N, (g, w) => paint(g, w, false))
  const floorGlow = canvasTex(N, N, (g, w) => paint(g, w, true))
  textures.push(floorTex, floorGlow)
  const metal = new THREE.MeshStandardMaterial({ color: '#2a3150', roughness: 0.55, metalness: 0.35 })
  const top = new THREE.MeshStandardMaterial({ map: floorTex, emissive: '#ffffff', emissiveMap: floorGlow, emissiveIntensity: 0.22, roughness: 0.7, metalness: 0.15 })
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.985, 0.32, 128), [metal, top, metal])
  deck.position.y = -0.16
  group.add(deck)
  // the underside: a cone into the dark, a ring of lights, a glowing heart at the bottom
  const under = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.97, radius * 0.22, 2.6, 64, 1, true), new THREE.MeshStandardMaterial({ color: '#1b2036', roughness: 0.6, metalness: 0.3 }))
  under.position.y = -0.32 - 1.3
  group.add(under)
  const rimMat = new THREE.MeshStandardMaterial({ color: rim, emissive: rim, emissiveIntensity: 1.6, roughness: 0.4 })
  const lamps = new THREE.InstancedMesh(new THREE.SphereGeometry(0.08, 10, 8), rimMat, 32)
  const o = new THREE.Object3D()
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * TAU
    o.position.set(Math.cos(a) * radius * 0.8, -0.95, Math.sin(a) * radius * 0.8)
    o.updateMatrix()
    lamps.setMatrixAt(i, o.matrix)
  }
  group.add(lamps)
  const heart = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.22, 40), rimMat)
  heart.rotation.x = Math.PI / 2
  heart.position.y = -2.93
  group.add(heart)
  // the rim, glowing
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.06, 8, 180), rimMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.03
  group.add(ring)
  // the field round the edge: a low shimmering wall, bright at the floor and fading upward
  const fieldMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(rim) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float up = 1.0 - vUv.y;
        float lines = 0.5 + 0.5 * sin(vUv.x * 900.0);
        float wave = 0.75 + 0.25 * sin(vUv.x * 60.0 + uTime * 1.3 + vUv.y * 4.0);
        float a = pow(up, 2.2) * 0.32 * wave + pow(up, 6.0) * 0.25 + lines * pow(up, 3.0) * 0.06;
        gl_FragColor = vec4(uColor, a);
      }`,
  })
  const field = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.02, radius + 0.02, 1.1, 180, 1, true), fieldMat)
  field.position.y = 0.55
  group.add(field)

  // light: the sun from one side, and a dim fill so the deck and the night sides are not black
  const sunLight = new THREE.DirectionalLight('#fff3e2', 2.4)
  sunLight.position.copy(sunDir).multiplyScalar(40)
  group.add(sunLight, sunLight.target)
  group.add(new THREE.HemisphereLight('#8ea6ff', '#141a33', 0.55))

  return {
    group,
    sunDir,
    glow,
    solids: ringWall(radius),
    env: {
      background: new THREE.Color('#02030b'),
      exposure: 1.0,
      envIntensity: 0.12,
      bloom: { strength: 0.62, radius: 0.5, threshold: 0.82 },
      fov: 62,
      far: 2500,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      sky.userData.update(t)
      below.userData.update(t)
      fieldMat.uniforms.uTime.value = t
      sunHalo.material.opacity = 0.33 + Math.sin(t * 0.7) * 0.03
      sunDisc.scale.setScalar(46 + Math.sin(t * 1.3) * 1.5)
    },
    dispose: () => textures.forEach(tx => tx.dispose()),
  }
}
