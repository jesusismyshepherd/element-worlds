// The fire chamber: a round cave of warm rock under a dome with an opening to the night sky, smoke
// going up through it and a shaft of moonlight coming down; a floor of flagstones, a ring of boulders
// round the walkable part (the cave goes on into darkness behind them), dust drifting in the moonlight.
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { canvasTex, makeNoise, normalFromHeight, Particles, softDot, random } from './kit.js'
import { rockGeometry } from './flame.js'

export const CAVE = { R: 13.5, H: 9.2, walk: 9.3, hole: 1.6 }

/** Rock: warm grey-brown with layers and cracks; returns { map, normalMap, heights }. */
function rockTextures(size) {
  const noise = makeNoise(13)
  const heights = new Float32Array(size * size)
  const map = canvasTex(size, (g, s) => {
    const img = g.createImageData(s, s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const n = noise.fbm2(x / 48, y / 48, 5)
        const strata = Math.sin(y / 9 + noise.fbm2(x / 90, y / 30, 3) * 9) * 0.5 + 0.5
        const crack = Math.pow(1 - Math.abs(noise.fbm2(x / 20 + 5, y / 20, 3) * 2 - 1), 14)
        const h = n * 0.75 + strata * 0.15 - crack * 0.5
        heights[y * s + x] = h
        const k = 0.5 + h * 0.6
        img.data.set([118 * k + 8 * strata, 100 * k + 4 * strata, 86 * k, 255], (y * s + x) * 4)
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: 1 })
  const normalMap = normalFromHeight(heights, size, 5)
  for (const t of [map, normalMap]) t.wrapS = t.wrapT = THREE.RepeatWrapping
  return { map, normalMap }
}

/** Flagstones: irregular slabs (nearest of scattered points) with dark joints. */
function flagstones(size) {
  const noise = makeNoise(21)
  const rnd = random(5)
  const n = 70
  const pts = Array.from({ length: n }, () => [rnd() * size, rnd() * size, 0.75 + rnd() * 0.4])
  const heights = new Float32Array(size * size)
  const map = canvasTex(size, (g, s) => {
    const img = g.createImageData(s, s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        let d1 = 1e9
        let d2 = 1e9
        let tone = 1
        for (const [px, py, tt] of pts) {
          // wrap round so the texture tiles
          let dx = Math.abs(x - px)
          let dy = Math.abs(y - py)
          dx = Math.min(dx, s - dx)
          dy = Math.min(dy, s - dy)
          const d = dx * dx + dy * dy
          if (d < d1) {
            d2 = d1
            d1 = d
            tone = tt
          } else if (d < d2) d2 = d
        }
        const edge = Math.sqrt(d2) - Math.sqrt(d1)
        const joint = THREE.MathUtils.smoothstep(edge, 1.5, 5.5)
        const grain = noise.fbm2(x / 14, y / 14, 4)
        const h = joint * (0.7 + grain * 0.3)
        heights[y * s + x] = h
        const k = (0.32 + grain * 0.22) * tone * (0.25 + 0.75 * joint)
        img.data.set([150 * k + 6, 132 * k + 5, 116 * k + 4, 255], (y * s + x) * 4)
      }
    }
    g.putImageData(img, 0, 0)
  })
  const normalMap = normalFromHeight(heights, size, 6)
  for (const t of [map, normalMap]) t.wrapS = t.wrapT = THREE.RepeatWrapping
  return { map, normalMap }
}

export function fireCave({ light = false }) {
  const group = new THREE.Group()
  const { R, H, hole } = CAVE
  const noise = makeNoise(3)
  const rock = rockTextures(light ? 256 : 512)
  rock.map.repeat.set(10, 4)
  rock.normalMap.repeat.set(10, 4)
  const rockMat = new THREE.MeshStandardMaterial({
    map: rock.map, normalMap: rock.normalMap, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.93, metalness: 0,
    side: THREE.DoubleSide, color: '#b9a99a',
  })
  // the dome: a hemisphere, squashed, lumpy, open at the top
  const thetaHole = Math.asin(hole / R)
  const dome = new THREE.SphereGeometry(R, light ? 72 : 120, light ? 36 : 60, 0, Math.PI * 2, thetaHole, Math.PI / 2 - thetaHole + 0.12)
  const pos = dome.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const up = v.y / R
    const n = noise.fbm3(v.x * 0.16, v.y * 0.2, v.z * 0.16, 4)
    const fine = noise.fbm3(v.x * 0.7, v.y * 0.7, v.z * 0.7, 3)
    // bulges in and out (less near the rim of the opening, so it stays round)
    const k = 1 + ((n - 0.5) * 0.22 + (fine - 0.5) * 0.06) * Math.min(1, (1 - up) * 3)
    v.x *= k
    v.z *= k
    v.y = v.y * (H / R) + (fine - 0.5) * 0.3 * (1 - up)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  dome.computeVertexNormals()
  const domeMesh = new THREE.Mesh(dome, rockMat)
  domeMesh.receiveShadow = true
  domeMesh.castShadow = true
  group.add(domeMesh)
  // the lip of the opening, a ring of rock
  const lip = new THREE.Mesh(new THREE.TorusGeometry(hole + 0.15, 0.32, 10, 48), rockMat)
  lip.rotation.x = Math.PI / 2
  lip.position.y = H * Math.cos(thetaHole) - 0.05
  lip.castShadow = true
  group.add(lip)

  // the floor
  const fs = flagstones(light ? 256 : 512)
  fs.map.repeat.set(7, 7)
  fs.normalMap.repeat.set(7, 7)
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(R + 0.5, 96),
    new THREE.MeshStandardMaterial({ map: fs.map, normalMap: fs.normalMap, normalScale: new THREE.Vector2(1.4, 1.4), roughness: 0.82, metalness: 0.02 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  group.add(floor)

  // boulders round the walkable part, with an opening at the south for the arch
  const stoneMat = new THREE.MeshStandardMaterial({ map: rock.map, normalMap: rock.normalMap, roughness: 0.9, color: '#a8988a' })
  const rnd = random(17)
  const ring = new THREE.Group()
  const count = light ? 34 : 52
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rnd() * 0.05
    const south = Math.abs(Math.atan2(Math.sin(a - Math.PI / 2), Math.cos(a - Math.PI / 2)))
    if (south < 0.2) continue
    const r = CAVE.walk + 0.6 + rnd() * 0.9
    const size = 0.35 + rnd() * 0.45
    const b = new THREE.Mesh(rockGeometry(size, 100 + i, light ? 1 : 2), stoneMat)
    b.position.set(Math.cos(a) * r, size * 0.25, Math.sin(a) * r)
    b.rotation.set(rnd() * 0.4, rnd() * 6, rnd() * 0.4)
    b.castShadow = b.receiveShadow = true
    ring.add(b)
  }
  group.add(ring)

  // the night sky beyond the opening, and the moon's light coming down through it
  const sky = nightSky({ radius: 600, stars: light ? 500 : 1200 })
  group.add(sky)
  const moonDir = new THREE.Vector3(0.32, 1, 0.22).normalize()
  const moon = new THREE.DirectionalLight('#9fb8ff', light ? 0 : 1.1)
  moon.position.copy(moonDir).multiplyScalar(30)
  moon.target.position.set(0, 0, 0)
  if (!light) {
    moon.castShadow = true
    moon.shadow.mapSize.set(1024, 1024)
    const c = moon.shadow.camera
    c.left = -15
    c.right = 15
    c.top = 15
    c.bottom = -15
    c.near = 5
    c.far = 60
    moon.shadow.bias = -0.0008
    moon.shadow.normalBias = 0.04
  }
  group.add(moon, moon.target)
  // where the shaft lands, and the shaft itself (faint, with dust in it)
  const top = new THREE.Vector3(0, H * Math.cos(thetaHole), 0)
  const landing = top.clone().addScaledVector(moonDir, -top.y / moonDir.y)
  const shaftLen = top.distanceTo(landing)
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(hole * 0.95, hole * 1.12, shaftLen, 40, 1, true),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying float vY;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vY = position.y;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vY;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float edge = pow(abs(dot(vN, vV)), 1.5);
          float fade = smoothstep(${(-shaftLen / 2).toFixed(3)}, ${(-shaftLen / 2 + 2).toFixed(3)}, vY) * 0.7 + 0.3;
          gl_FragColor = vec4(vec3(0.42, 0.55, 1.0) * edge * fade * 0.045, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  )
  shaft.position.copy(top).add(landing).multiplyScalar(0.5)
  shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), moonDir)
  shaft.renderOrder = 9
  group.add(shaft)
  // a pool of moonlight on the floor, for light mode (no shadows there) and to soften the edge
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(hole * 1.35, 40),
    new THREE.MeshBasicMaterial({ map: softDot(128), color: new THREE.Color('#7f9bff').multiplyScalar(light ? 0.5 : 0.18), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  pool.rotation.x = -Math.PI / 2
  pool.position.set(landing.x, 0.015, landing.z)
  pool.scale.set(1, 1 / moonDir.y, 1)
  group.add(pool)
  // dust in the moonlight
  const dust = new Particles(light ? 30 : 90, { map: softDot(32), renderOrder: 10 })
  group.add(dust.points)
  const drnd = random(99)
  for (let i = 0; i < dust.count; i++) {
    const k = drnd()
    const p = top.clone().lerp(landing, k)
    const a = drnd() * Math.PI * 2
    const r = Math.sqrt(drnd()) * hole
    dust.spawn({ x: p.x + Math.cos(a) * r, y: p.y, z: p.z + Math.sin(a) * r, life: 1e9, size: 0.012 + drnd() * 0.012, alpha: 0, r: 0.75, g: 0.85, b: 1.2, k: drnd() * 100 })
  }

  // a faint fill so the far wall is never pure black
  const fill = new THREE.HemisphereLight('#4a5a8a', '#3a2414', 0.6)
  group.add(fill)

  return {
    group,
    stoneMat,
    landing,
    update(dt, t, camera, renderer) {
      sky.userData.update?.(t)
      dust.step(dt, (p, d) => {
        p.x += Math.sin(t * 0.3 + p.k) * d * 0.03
        p.y += Math.sin(t * 0.21 + p.k * 1.3) * d * 0.02
        p.alpha = 0.35 + 0.35 * Math.sin(t * 0.8 + p.k)
      }, camera, renderer)
    },
  }
}
