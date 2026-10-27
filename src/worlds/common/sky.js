// A night sky: a dome shading from a deep top to a lighter horizon, and twinkling stars (the elements
// were made in stars, so the table stands under them).
import * as THREE from 'three'

export function nightSky({
  radius = 900, stars = 2600, top = '#04060f', mid = '#0b1030', horizon = '#161a48', pixelRatio = 1,
} = {}) {
  const group = new THREE.Group()
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color(top) },
        uMid: { value: new THREE.Color(mid) },
        uHorizon: { value: new THREE.Color(horizon) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon;
        varying vec3 vDir;
        void main() {
          float h = clamp(vDir.y, -1.0, 1.0);
          vec3 c = h > 0.18 ? mix(uMid, uTop, smoothstep(0.18, 0.85, h)) : mix(uHorizon, uMid, smoothstep(-0.05, 0.18, h));
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  dome.renderOrder = -10
  dome.frustumCulled = false
  group.add(dome)

  const pos = new Float32Array(stars * 3)
  const col = new Float32Array(stars * 3)
  const size = new Float32Array(stars)
  const phase = new Float32Array(stars)
  const tint = [new THREE.Color('#cfe0ff'), new THREE.Color('#fff4e0'), new THREE.Color('#ffd2b0'), new THREE.Color('#bcd2ff')]
  for (let i = 0; i < stars; i++) {
    const y = Math.pow(Math.random(), 0.7) * 0.98 + 0.02
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(1 - y * y)
    const d = radius * 0.95
    pos.set([Math.cos(a) * r * d, y * d, Math.sin(a) * r * d], i * 3)
    const c = tint[(Math.random() * tint.length) | 0]
    col.set([c.r, c.g, c.b], i * 3)
    size[i] = Math.random() < 0.06 ? 2.6 + Math.random() * 1.6 : 0.8 + Math.random() * 1.4
    phase[i] = Math.random() * 100
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: { uTime: { value: 0 }, uScale: { value: pixelRatio } },
    vertexShader: /* glsl */ `
      attribute float aSize; attribute float aPhase; attribute vec3 color;
      uniform float uTime; uniform float uScale;
      varying vec3 vColor; varying float vTw;
      void main() {
        vColor = color;
        vTw = 0.65 + 0.35 * sin(uTime * (0.6 + fract(aPhase) * 1.7) + aPhase);
        gl_PointSize = aSize * uScale * (0.85 + 0.3 * vTw);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * vTw * 1.4, a);
      }`,
  })
  const points = new THREE.Points(geo, starMat)
  points.frustumCulled = false
  points.renderOrder = -9
  group.add(points)

  group.userData.update = t => {
    starMat.uniforms.uTime.value = t
  }
  return group
}
