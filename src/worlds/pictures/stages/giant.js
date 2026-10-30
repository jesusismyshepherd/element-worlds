// A stage for picture rooms (docs/knowledge/picture-rooms.md): the space deck (stages/space.js) floating
// beside a red giant. The giant fills a good part of the sky on one side, orange in the middle and deep red
// at its edge (limb darkening), its surface boiling in a few huge convection cells, a warm glow round it;
// its light, not a far white sun, lights the deck and whatever floats near it. The deck's rim glows orange.
// `giant.set({ scale, heat, glow })` lets a scene swell it, redden it and dim it (a star growing old, or
// puffing its outer layers away); `light` and `fill` are its lights, `NOISE` the GLSL noise its surface
// uses (for anything else hot that should boil the same way). Carbon's picture "Made inside a giant star"
// was the first room on it.
import * as THREE from 'three'
import { spaceStage } from './space.js'

/** Simplex-like value noise in 3D and a few octaves of it (GLSL), for boiling surfaces. */
export const NOISE = /* glsl */ `
  float h3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float n3(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h3(i + vec3(0, 0, 0)), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float a = 0.5; float s = 0.0; for (int i = 0; i < 4; i++) { s += a * n3(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
`

export function giantStage({ radius = 9, light = false, pixelRatio = 1, center = [-62, 14, -80], size = 40, rim = '#ff9a4a' } = {}) {
  const at = new THREE.Vector3(...center)
  // the space deck, its far sun turned to where the giant stands (so the giant hides it) ...
  const stage = spaceStage({ radius, light, pixelRatio, sun: at.toArray(), rim })
  const group = stage.group
  // ... and its lights made the giant's: a warm orange key light from it, a dusky fill
  let key = null
  let fill = null
  const sunAt = stage.sunDir.clone().multiplyScalar(760)
  group.traverse(o => {
    if (o.isDirectionalLight) key = o
    if (o.isHemisphereLight) fill = o
    // the far sun's disc and halo: behind the giant, but seen once the giant is gone
    if (o.isSprite && o.position.distanceTo(sunAt) < 1) o.visible = false
  })
  key.color.set('#ffb07a')
  key.intensity = 2.3
  fill.color.set('#ffb49a')
  fill.groundColor.set('#24101e')
  fill.intensity = 0.5

  // the giant: a sphere whose surface boils slowly, bright in the middle of its face, red at the edge
  const giant = new THREE.Group()
  giant.position.copy(at)
  group.add(giant)
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uHeat: { value: 0 }, uGlow: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz);
        vP = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uHeat; uniform float uGlow;
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      ${NOISE}
      void main() {
        float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        // a few giant convection cells, slowly churning, and finer boiling on them
        float cells = fbm(vP * 2.2 + vec3(0.0, uTime * 0.02, uTime * 0.013));
        float fine = fbm(vP * 7.0 - vec3(uTime * 0.04, 0.0, uTime * 0.03));
        float g = smoothstep(0.25, 0.75, cells) * 0.75 + fine * 0.35;
        // (linear colours: orange in the middle of the face, red toward the edge, deeper red when old)
        // (ACES tone mapping pales bright colours: kept below 1 and saturated)
        vec3 core = mix(vec3(0.9, 0.3, 0.06), vec3(0.75, 0.16, 0.035), uHeat);
        vec3 mid = mix(vec3(0.6, 0.1, 0.022), vec3(0.45, 0.05, 0.015), uHeat);
        vec3 edge = mix(vec3(0.2, 0.015, 0.01), vec3(0.12, 0.008, 0.008), uHeat);
        // limb darkening: the face's middle is seen deeper, hotter
        vec3 c = mix(edge, mid, smoothstep(0.0, 0.55, mu));
        c = mix(c, core, smoothstep(0.55, 1.0, mu) * 0.85);
        c *= 0.5 + 0.55 * g;
        // soot gathering on an old star's face: dark smudges
        c *= 1.0 - uHeat * 0.35 * smoothstep(0.55, 0.8, fbm(vP * 4.0 + 3.0 + uTime * 0.01));
        gl_FragColor = vec4(c * uGlow, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const body = new THREE.Mesh(new THREE.SphereGeometry(size, light ? 48 : 96, light ? 32 : 64), mat)
  giant.add(body)
  // its warm glow, wide and faint, and a brighter one close round it
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: '#ff5a24', transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  halo.scale.setScalar(size * 3.4)
  const near = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: '#ff7a36', transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  near.scale.setScalar(size * 2.35)
  halo.renderOrder = -6
  near.renderOrder = -5
  giant.add(halo, near)

  let look = { scale: 1, heat: 0, glow: 1 }
  const set = ({ scale = look.scale, heat = look.heat, glow = look.glow } = {}) => {
    look = { scale, heat, glow }
    giant.visible = scale > 0.002
    giant.scale.setScalar(Math.max(0.002, scale))
    mat.uniforms.uHeat.value = heat
    mat.uniforms.uGlow.value = glow
    halo.material.opacity = 0.5 * glow * Math.min(1, scale * 1.5)
    near.material.opacity = 0.4 * glow * Math.min(1, scale * 1.5)
    halo.material.color.set('#ff5a24').lerp(new THREE.Color('#c8301e'), heat)
    // its light on the deck follows how bright it is
    key.intensity = 2.3 * glow * Math.min(1, scale)
    fill.intensity = 0.32 + 0.18 * glow * Math.min(1, scale)
  }

  return {
    group,
    sunDir: stage.sunDir,
    glow: stage.glow,
    solids: stage.solids,
    env: stage.env,
    cameraBounds: stage.cameraBounds,
    light: key,
    fill,
    giant: {
      group: giant,
      body,
      center: at,
      radius: size,
      set,
      get look() {
        return look
      },
    },
    update(t) {
      stage.update(t)
      mat.uniforms.uTime.value = t
      // (the sprites scale with the giant's group)
      near.scale.setScalar(size * 2.35 * (1 + Math.sin(t * 0.9) * 0.015))
    },
    dispose: () => stage.dispose(),
  }
}
