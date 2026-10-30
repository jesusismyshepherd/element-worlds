// A stage for picture rooms (docs/knowledge/picture-rooms.md): shallow sunlit sea water, seen from the sea
// floor as something very small would see it. A dome from bright surface water to the deep, the surface
// shimmering overhead, shafts of sunlight swaying down, plankton drifting, a floor of pale silt. Walking
// inside a circle of `radius`; the fog hides where the floor ends.
import * as THREE from 'three'
import { motes, ringWall } from '../kit.js'

export function waterStage({ radius = 10, light = false, top = '#9ff0ee', mid = '#1b8a98', deep = '#06303f', fog = '#137080' } = {}) {
  const group = new THREE.Group()
  const disposers = []

  // the water all round: bright toward the surface, deep below
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(70, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color(top) }, uMid: { value: new THREE.Color(mid) }, uDeep: { value: new THREE.Color(deep) } },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uDeep;
        varying vec3 vDir;
        void main() {
          float h = vDir.y;
          vec3 c = h > 0.0 ? mix(uMid, uTop, pow(h, 0.8)) : mix(uMid, uDeep, pow(-h, 0.6));
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  group.add(dome)

  // the surface overhead: ripples of light
  const surfaceMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(top) } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor;
      varying vec2 vP;
      void main() {
        vec2 p = vP * 0.22;
        float w = sin(p.x * 3.1 + uTime * 0.7) + sin(p.y * 2.7 - uTime * 0.6) + sin((p.x + p.y) * 2.2 + uTime * 0.9);
        float caustic = pow(abs(sin(w * 1.6)), 6.0);
        float fade = smoothstep(60.0, 8.0, length(vP));
        gl_FragColor = vec4(uColor * (1.0 + caustic * 1.3), (0.35 + caustic * 0.5) * fade);
        #include <colorspace_fragment>
      }`,
  })
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), surfaceMat)
  surface.rotation.x = Math.PI / 2
  surface.position.y = 17
  group.add(surface)

  // shafts of sunlight: tall soft planes turned toward the eye, swaying
  const shaftMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color('#d8fff4') } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float across = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
        float along = smoothstep(0.0, 0.7, vUv.y);
        gl_FragColor = vec4(uColor, across * along * 0.16);
      }`,
  })
  const shafts = []
  const n = light ? 4 : 8
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.4
    const r = 4 + (i % 3) * 3.5
    const w = 1.2 + (i % 4) * 0.6
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 18).translate(0, 9, 0), shaftMat)
    m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r)
    m.rotation.z = 0.12
    group.add(m)
    shafts.push({ m, phase: i * 1.7 })
  }

  // the sea floor: pale silt flecked with broken shells
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#93a08a'
  g.fillRect(0, 0, 512, 512)
  let s = 7
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 2600; i++) {
    const v = 115 + rnd() * 70
    g.fillStyle = `rgba(${v},${v + 8},${v - 12},${0.25 + rnd() * 0.35})`
    g.beginPath()
    g.arc(rnd() * 512, rnd() * 512, 1 + rnd() * 3.5, 0, Math.PI * 2)
    g.fill()
  }
  // little broken rings and rods: old diatom shells
  g.strokeStyle = 'rgba(220,236,222,0.45)'
  for (let i = 0; i < 160; i++) {
    g.lineWidth = 1 + rnd() * 1.5
    g.beginPath()
    if (rnd() < 0.6) g.arc(rnd() * 512, rnd() * 512, 3 + rnd() * 6, 0, Math.PI * (1 + rnd()))
    else {
      const x = rnd() * 512
      const y = rnd() * 512
      const a = rnd() * Math.PI
      g.moveTo(x, y)
      g.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14)
    }
    g.stroke()
  }
  const floorTex = new THREE.CanvasTexture(c)
  floorTex.colorSpace = THREE.SRGBColorSpace
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping
  floorTex.repeat.set(9, 9)
  floorTex.anisotropy = 4
  disposers.push(() => floorTex.dispose())
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 1 }))
  floor.rotation.x = -Math.PI / 2
  group.add(floor)

  // soft dunes of silt round the edge
  const duneMat = new THREE.MeshStandardMaterial({ color: '#8a977f', roughness: 1 })
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + (i % 2) * 0.2
    const r = radius + 2.5 + (i % 3) * 2
    const d = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10), duneMat)
    d.scale.set(2.5 + (i % 4), 0.7 + (i % 3) * 0.35, 2 + (i % 2))
    d.position.set(Math.cos(a) * r, -0.2, Math.sin(a) * r)
    d.rotation.y = a
    group.add(d)
  }

  // plankton and specks drifting
  const specks = motes({ count: 700, radius: radius + 6, y0: 0.1, y1: 10, color: '#e8fff0', size: 0.05, opacity: 0.55, speed: 0.12, light })
  group.add(specks.group)

  group.add(new THREE.HemisphereLight('#c8f7ff', '#2a5552', 1.05))
  const sun = new THREE.DirectionalLight('#effff8', 1.3)
  sun.position.set(3, 14, 4)
  group.add(sun, sun.target)

  return {
    group,
    solids: ringWall(radius),
    env: {
      background: new THREE.Color(fog),
      fog: new THREE.Fog(fog, 9, 38),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.55, radius: 0.55, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 12, minZ: -radius - 1, maxZ: radius + 1 },
    update(t, camera) {
      surfaceMat.uniforms.uTime.value = t
      for (const { m, phase } of shafts) {
        if (camera) m.rotation.y = Math.atan2(camera.position.x - m.position.x, camera.position.z - m.position.z)
        m.rotation.z = 0.12 + Math.sin(t * 0.25 + phase) * 0.05
      }
      specks.update(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
