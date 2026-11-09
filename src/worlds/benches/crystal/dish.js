// Growing Crystals: the dish on the lab's table (crystal.js). A wide glass dish of salt water, lit from
// above (a spot light, its cone faintly in the air, caustics dancing on the dish's floor), its level
// falling as the water evaporates, wisps of vapour rising; or, for a compound water would destroy, a hot
// melt in a crucible, glowing and dimming as it cools. A glass rod lies across with a thread hanging from
// it: the first crystal grows on the thread, the way crystals are grown at home (in a melt: on a seed held
// on a wire). Light mode (phones): no caustics, cone or vapour.
import * as THREE from 'three'

const RADIUS = 2.1
const HEIGHT = 1.8
const LEVEL = [1.05, 1.5] // the liquid's height over the dish's floor: dried down to, at the start
const MELT = 1.42

export function makeDish({ light = false, top = 0.5 } = {}) {
  const group = new THREE.Group()
  group.name = 'dish'
  const floorY = top + 0.05

  // the glass: a wall, a floor, a rim catching the light
  const glassMat = new THREE.MeshStandardMaterial({ color: '#d6ecff', transparent: true, opacity: 0.1, roughness: 0.14, metalness: 0.15, emissive: '#000000', side: THREE.DoubleSide, depthWrite: false })
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, light ? 48 : 96, 1, true), glassMat)
  wall.position.y = top + HEIGHT / 2
  wall.renderOrder = 6
  group.add(wall)
  const baseMat = new THREE.MeshStandardMaterial({ color: '#a9d4ff', transparent: true, opacity: 0.22, roughness: 0.14, metalness: 0.15, depthWrite: false })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(RADIUS, RADIUS * 0.98, 0.05, light ? 48 : 96), baseMat)
  base.position.y = top + 0.025
  group.add(base)
  const rimMat = new THREE.MeshStandardMaterial({ color: '#e8f6ff', emissive: '#9fdcff', emissiveIntensity: 0.3, transparent: true, opacity: 0.7 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RADIUS, 0.028, 8, light ? 64 : 128), rimMat)
  rim.rotation.x = Math.PI / 2
  rim.position.y = top + HEIGHT
  group.add(rim)

  // the liquid: its top, its body seen through the glass, the bright line where it meets the glass
  const liquidTop = new THREE.MeshStandardMaterial({ color: '#3f93e8', emissive: '#1d5cc4', emissiveIntensity: 0.1, transparent: true, opacity: 0.1, roughness: 0.12, metalness: 0, side: THREE.DoubleSide, depthWrite: false })
  const surface = new THREE.Mesh(new THREE.CircleGeometry(RADIUS - 0.015, light ? 48 : 96), liquidTop)
  surface.rotation.x = -Math.PI / 2
  surface.renderOrder = 4
  group.add(surface)
  const liquidBody = new THREE.MeshStandardMaterial({ color: '#3d8fe0', emissive: '#123a8a', emissiveIntensity: 0.15, transparent: true, opacity: 0.08, roughness: 0.1, metalness: 0.2, side: THREE.FrontSide, depthWrite: false })
  const body = new THREE.Mesh(new THREE.CylinderGeometry(RADIUS - 0.015, RADIUS - 0.015, 1, light ? 48 : 96, 1, true), liquidBody)
  body.renderOrder = 3
  group.add(body)
  const lineMat = new THREE.MeshBasicMaterial({ color: '#bfe7ff', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
  const meniscus = new THREE.Mesh(new THREE.TorusGeometry(RADIUS - 0.02, 0.012, 6, light ? 64 : 128), lineMat)
  meniscus.rotation.x = Math.PI / 2
  group.add(meniscus)

  // caustics on the dish's floor: light from above, bent by the moving surface (a pattern of cells whose
  // edges shine, two layers drifting)
  let caustics = null
  if (!light) {
    caustics = new THREE.Mesh(
      new THREE.CircleGeometry(RADIUS - 0.03, 96),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uAmp: { value: 1 }, uColor: { value: new THREE.Color('#6aaeff') } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uAmp; uniform vec3 uColor;
          varying vec2 vUv;
          vec2 hash2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
          float edges(vec2 p, float t) {
            vec2 i = floor(p); vec2 f = fract(p);
            float d1 = 8.0; float d2 = 8.0;
            for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
              vec2 g = vec2(float(x), float(y));
              vec2 o = 0.5 + 0.42 * sin(t + 6.2831 * hash2(i + g));
              float d = length(g + o - f);
              if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
            }
            return d2 - d1;
          }
          void main() {
            vec2 p = (vUv - 0.5) * 6.0;
            p += 0.45 * vec2(sin(p.y * 1.7 + uTime * 0.5), cos(p.x * 1.4 - uTime * 0.45));
            float a = 1.0 - smoothstep(0.0, 0.07, edges(p, uTime * 0.7));
            float b = 1.0 - smoothstep(0.0, 0.05, edges(p * 1.6 + 3.7 + 0.3 * vec2(cos(uTime * 0.3), sin(uTime * 0.37)), uTime * 0.9 + 2.0));
            float c = a * 0.42 + b * 0.3 + a * b * 0.6;
            float r = length(vUv - 0.5) * 2.0;
            float spot = 1.0 - smoothstep(0.55, 1.0, r);
            gl_FragColor = vec4(uColor * c * uAmp * 0.75 * (0.3 + 0.7 * spot), 1.0);
          }`,
      }),
    )
    caustics.rotation.x = -Math.PI / 2
    caustics.position.y = floorY + 0.004
    group.add(caustics)
  }
  // a melt's floor glows (no caustics there)
  // (a hot glow, yellow in the middle, red at the edge, flickering slowly; fading as the melt cools)
  const heatMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uGlow: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uGlow;
      varying vec2 vUv;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float n = 0.5 + 0.5 * sin(vUv.x * 13.0 + uTime * 0.7) * sin(vUv.y * 11.0 - uTime * 0.5);
        vec3 hot = mix(vec3(0.9, 0.18, 0.02), vec3(1.0, 0.62, 0.18), (1.0 - r) * uGlow);
        float a = uGlow * (1.0 - 0.65 * smoothstep(0.4, 1.0, r)) * (0.85 + 0.15 * n);
        gl_FragColor = vec4(hot * a, 1.0);
      }`,
  })
  // and its light on the ions from below
  const heatLight = new THREE.PointLight('#ff7a2a', 0, 7, 1.2)
  heatLight.position.set(0, top + 0.35, 0)
  group.add(heatLight)
  const heat = new THREE.Mesh(new THREE.CircleGeometry(RADIUS - 0.03, light ? 48 : 96), heatMat)
  heat.rotation.x = -Math.PI / 2
  heat.position.y = floorY + 0.006
  group.add(heat)

  // the light from above: a spot light and its cone in the air
  const spot = new THREE.SpotLight('#fff3df', 1.5, 0, 0.4, 0.7, 0)
  spot.position.set(0, top + 7.5, 0.4)
  spot.target.position.set(0, top, 0)
  group.add(spot, spot.target)
  let cone = null
  if (!light) {
    const h = 6.6
    cone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, RADIUS * 1.05, h, 64, 1, true),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color('#bcd8ff') }, uAmp: { value: 1 } },
        vertexShader: /* glsl */ `
          varying float vH; varying float vRim;
          void main() {
            vH = position.y / ${h.toFixed(2)} + 0.5;
            vec3 n = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vRim = 1.0 - abs(dot(n, normalize(-mv.xyz)));
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uAmp;
          varying float vH; varying float vRim;
          void main() {
            float a = (0.012 + 0.045 * pow(vRim, 2.0)) * smoothstep(0.0, 0.35, vH) * (1.0 - smoothstep(0.75, 1.0, vH));
            gl_FragColor = vec4(uColor * a * uAmp, 1.0);
          }`,
      }),
    )
    cone.position.y = top + HEIGHT * 0.15 + h / 2
    cone.renderOrder = 8
    group.add(cone)
  }

  // the glass rod across the dish and the thread hanging from it (in a melt: a wire holding the seed)
  const rodMat = new THREE.MeshStandardMaterial({ color: '#e6f4ff', emissive: '#7fbfff', emissiveIntensity: 0.25, transparent: true, opacity: 0.6, roughness: 0.05, metalness: 0.4 })
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, RADIUS * 2 + 0.7, 16), rodMat)
  rod.rotation.z = Math.PI / 2
  rod.position.y = top + HEIGHT + 0.06
  group.add(rod)
  const threadMat = new THREE.MeshStandardMaterial({ color: '#f4f1e6', emissive: '#fff4d6', emissiveIntensity: 0.12, roughness: 0.8 })
  const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 1, 6), threadMat)
  group.add(thread)
  const knot = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 16), threadMat)
  knot.rotation.x = Math.PI / 2
  knot.position.y = rod.position.y
  knot.scale.set(1, 1, 1.6)
  group.add(knot)
  /** Hang the thread from the rod down to y. */
  const hang = y => {
    const len = rod.position.y - y
    thread.position.y = y + len / 2
    thread.scale.y = len
  }
  hang(floorY + 0.86)

  // vapour rising from evaporating water
  const wisps = []
  let wispTex = null
  if (!light) {
    const cv = document.createElement('canvas')
    cv.width = cv.height = 64
    const g = cv.getContext('2d')
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grd.addColorStop(0, 'rgba(255,255,255,0.55)')
    grd.addColorStop(0.5, 'rgba(220,235,255,0.18)')
    grd.addColorStop(1, 'rgba(220,235,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 64, 64)
    wispTex = new THREE.CanvasTexture(cv)
    for (let i = 0; i < 16; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: wispTex, transparent: true, opacity: 0, depthWrite: false, color: '#dcecff' }))
      s.visible = false
      s.userData = { t0: -10, life: 3 }
      group.add(s)
      wisps.push(s)
    }
  }

  let medium = 'water'
  let level = LEVEL[1]
  let fade = 1
  let glow = 1
  let lastWisp = 0
  const water = {
    top: new THREE.Color('#3f93e8'), topE: new THREE.Color('#1d5cc4'), body: new THREE.Color('#3d8fe0'), bodyE: new THREE.Color('#123a8a'),
  }
  const melt = {
    top: new THREE.Color('#ff9a3a'), topE: new THREE.Color('#ff5a00'), body: new THREE.Color('#ff7a1a'), bodyE: new THREE.Color('#d83a00'),
  }

  const setLevel = h => {
    level = h
    surface.position.y = floorY + h
    meniscus.position.y = floorY + h
    body.scale.y = h
    body.position.y = floorY + h / 2
  }
  setLevel(level)

  const paint = () => {
    const m = medium === 'melt'
    const c = m ? melt : water
    liquidTop.color.copy(c.top)
    liquidTop.emissive.copy(c.topE)
    liquidTop.emissiveIntensity = m ? 0.25 + 0.75 * glow : 0.1
    liquidTop.opacity = (m ? 0.08 + 0.08 * glow : 0.1) * fade
    liquidBody.color.copy(c.body)
    liquidBody.emissive.copy(c.bodyE)
    liquidBody.emissiveIntensity = m ? 0.2 + 0.6 * glow : 0.15
    liquidBody.opacity = (m ? 0.05 + 0.06 * glow : 0.06) * fade
    lineMat.color.set(m ? '#ffd0a0' : '#bfe7ff')
    lineMat.opacity = 0.35 * fade
    heatMat.uniforms.uGlow.value = m ? (0.12 + 0.55 * glow) * fade : 0
    heat.visible = m
    heatLight.intensity = m ? (0.6 + 2.6 * glow) * fade : 0
    spot.intensity = m ? 0.9 : 1.5
    // a crucible for a melt (hot, a dull red glow), glass for water
    // a crucible for a melt: dark, glowing red with the heat; glass for water
    glassMat.color.set(m ? '#ffd2b0' : '#d6ecff')
    glassMat.emissive.set(m ? '#ff4a10' : '#000000')
    glassMat.emissiveIntensity = m ? 0.08 + 0.2 * glow : 0
    glassMat.opacity = (m ? 0.14 : 0.1) * fade
    rimMat.emissive.set(m ? '#ff9a5a' : '#9fdcff')
    rimMat.opacity = 0.7 * fade
    baseMat.opacity = 0.22 * fade
    rodMat.opacity = 0.6 * fade
    rodMat.color.set(m ? '#d9dde6' : '#e6f4ff')
    if (caustics) {
      caustics.visible = !m
      caustics.material.uniforms.uAmp.value = fade
    }
    if (cone) cone.material.uniforms.uAmp.value = fade
    spot.color.set(m ? '#ffe2c4' : '#fff3df')
  }

  return {
    group,
    floorY,
    radius: RADIUS,
    get level() {
      return level
    },
    get surface() {
      return floorY + level
    },
    // what a tap on the dish can hit (to start it)
    tappable: [surface, body, wall],
    /** Water or a melt (and how fast it evaporates or cools). */
    setMedium(m) {
      medium = m === 'melt' ? 'melt' : 'water'
      glow = 1
      setLevel(medium === 'melt' ? MELT : LEVEL[1])
      paint()
    },
    /** Fade the dish (zoomed out to the grain of salt). */
    setFade(f) {
      if (Math.abs(f - fade) < 1e-3) return
      fade = f
      paint()
    },
    /** left: the share of the evaporation or the cooling still to come (1 at the start). */
    update(dt, t, { left = 1, speed = 0.2, growing = false, waiting = false, camera = null } = {}) {
      if (medium === 'water') {
        const h = LEVEL[0] + (LEVEL[1] - LEVEL[0]) * left
        if (Math.abs(h - level) > 1e-4) setLevel(h)
      } else if (Math.abs(left - glow) > 0.004) {
        glow = left
        paint()
      }
      if (caustics) caustics.material.uniforms.uTime.value = t
      heatMat.uniforms.uTime.value = t
      // the cone of light fades as the camera comes into it (seen from inside it is only a haze)
      if (cone && camera) {
        const r = Math.hypot(camera.position.x, camera.position.z)
        cone.material.uniforms.uAmp.value = fade * Math.min(1, Math.max(0, (r - RADIUS * 1.1) / 1.6))
      }
      // the surface breathes a little; waiting for a tap, its edge glows and fades: tap me
      surface.position.y = floorY + level + Math.sin(t * 1.3) * 0.004
      lineMat.opacity = (waiting ? 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 3)) : 0.35) * fade
      if (waiting && medium === 'water') liquidTop.emissiveIntensity = 0.1 + 0.25 * (0.5 + 0.5 * Math.sin(t * 3))
      else if (medium === 'water' && liquidTop.emissiveIntensity !== 0.1) liquidTop.emissiveIntensity = 0.1
      // vapour: more the faster it dries
      if (wisps.length && medium === 'water' && growing && t - lastWisp > 0.9 - speed * 0.7) {
        lastWisp = t
        const w = wisps.find(s => !s.visible)
        if (w) {
          const a = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random()) * (RADIUS - 0.3)
          w.position.set(Math.cos(a) * r, floorY + level + 0.1, Math.sin(a) * r)
          w.userData = { t0: t, life: 2.6 + Math.random() * 1.6, x: w.position.x, z: w.position.z, drift: (Math.random() - 0.5) * 0.3 }
          w.visible = true
        }
      }
      for (const w of wisps) {
        if (!w.visible) continue
        const u = (t - w.userData.t0) / w.userData.life
        if (u >= 1) {
          w.visible = false
          continue
        }
        w.position.y = floorY + level + 0.1 + u * 1.6
        w.position.x = w.userData.x + w.userData.drift * u
        w.scale.setScalar(0.35 + u * 0.9)
        w.material.opacity = Math.sin(u * Math.PI) * 0.22 * fade
      }
    },
    /** Hang the thread down to y (the first crystal's middle). */
    hang,
    dispose() {
      wispTex?.dispose()
    },
  }
}
