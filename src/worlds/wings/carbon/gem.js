// A cut diamond that sparkles for real: the facets are exact planes (structures.js), and every pixel
// follows its ray into the stone (refraction at n = 2.42), from facet to facet inside (total internal
// reflection below the 24.4° critical angle) and out again, once per colour with that colour's index,
// so white light comes out split into its colours (the fire). The light it sees is a jeweller's room
// painted into a small cube map. A convex stone needs no mesh tracing: the exit of a ray from the inside
// is simply the nearest facet plane ahead of it.
import * as THREE from 'three'

// diamond's refractive index for red, green and blue light (656, 527 and 431 nm)
export const DIAMOND_IOR = [2.41, 2.4235, 2.451]

/** Flat-shaded triangles from facets ({ pts, normal }), winding outward. */
export function facetGeometry(facets) {
  const pos = []
  const nor = []
  for (const f of facets) {
    for (let i = 1; i < f.pts.length - 1; i++) {
      for (const p of [f.pts[0], f.pts[i], f.pts[i + 1]]) {
        pos.push(p[0], p[1], p[2])
        nor.push(f.normal[0], f.normal[1], f.normal[2])
      }
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.computeBoundingSphere()
  return g
}

/** A small cube map of a jeweller's room: dark, with soft boxes and pin-point lamps (what makes
 *  sparkle), a cool tint from the gallery and one warm lamp. */
export function sparkleEnv(size = 128, seed = 7) {
  let s = seed
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  const faces = []
  for (let f = 0; f < 6; f++) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const g = c.getContext('2d')
    const top = f === 2
    const bottom = f === 3
    const grad = g.createLinearGradient(0, 0, 0, size)
    grad.addColorStop(0, top ? '#1d2a55' : bottom ? '#04060f' : '#141c40')
    grad.addColorStop(1, top ? '#1a2550' : bottom ? '#03050c' : '#070b1d')
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
    // soft boxes
    const boxes = top ? 4 : bottom ? 0 : 2
    for (let i = 0; i < boxes; i++) {
      const w = size * (0.12 + rnd() * 0.22)
      const h = size * (0.06 + rnd() * 0.14)
      const x = rnd() * (size - w)
      const y = (top ? rnd() : rnd() * 0.6) * (size - h)
      const rg = g.createLinearGradient(x, y, x, y + h)
      const tone = rnd() < 0.25 ? '191,230,255' : '255,255,255'
      rg.addColorStop(0, `rgba(${tone},0.95)`)
      rg.addColorStop(1, `rgba(${tone},0.7)`)
      g.fillStyle = rg
      g.fillRect(x, y, w, h)
    }
    // pin-point lamps
    const dots = bottom ? 6 : 22
    for (let i = 0; i < dots; i++) {
      const x = rnd() * size
      const y = rnd() * size * (top ? 1 : 0.85)
      const r = 0.6 + rnd() * 2.2
      const warm = rnd() < 0.12
      const rg = g.createRadialGradient(x, y, 0, x, y, r * 2.5)
      rg.addColorStop(0, warm ? 'rgba(255,214,150,1)' : 'rgba(255,255,255,1)')
      rg.addColorStop(0.4, warm ? 'rgba(255,190,120,0.8)' : 'rgba(220,240,255,0.75)')
      rg.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = rg
      g.beginPath()
      g.arc(x, y, r * 2.5, 0, Math.PI * 2)
      g.fill()
    }
    // the gallery's glowing lines
    g.fillStyle = 'rgba(127,212,255,0.55)'
    if (!top && !bottom) {
      for (let i = 0; i < 3; i++) g.fillRect(rnd() * size, size * 0.15, 1.5, size * 0.7)
    }
    faces.push(c)
  }
  const tex = new THREE.CubeTexture(faces)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

/** The material: `planes` are the stone's facet planes [nx, ny, nz, d] in its own space. */
export function gemMaterial({ planes, env, light = false, tint = '#ffffff', gain = 2.6, ior = DIAMOND_IOR, bounces = null }) {
  const n = planes.length
  const mat = new THREE.ShaderMaterial({
    defines: { NP: n, BOUNCES: bounces ?? (light ? 3 : 5), CHANNELS: light ? 1 : 3 },
    uniforms: {
      uPlanes: { value: planes.map(p => new THREE.Vector4(p[0], p[1], p[2], p[3])) },
      uEnv: { value: env },
      uCam: { value: new THREE.Vector3() },
      uToWorld: { value: new THREE.Matrix3() },
      uIor: { value: new THREE.Vector3(...ior) },
      uGain: { value: gain },
      uTint: { value: new THREE.Color(tint) },
      uFlash: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying vec3 vNor;
      void main() {
        vPos = position;
        vNor = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec4 uPlanes[NP];
      uniform samplerCube uEnv;
      uniform vec3 uCam; uniform mat3 uToWorld; uniform vec3 uIor; uniform float uGain; uniform vec3 uTint; uniform float uFlash;
      varying vec3 vPos; varying vec3 vNor;
      vec3 env(vec3 d) {
        vec3 w = normalize(uToWorld * d);
        vec3 c = textureCube(uEnv, vec3(-w.x, w.y, w.z)).rgb;
        return c * c * 1.6 + c * 0.25; // hot lamps hotter, dark room darker
      }
      // a ray inside the stone: from facet to facet until it leaves, for one index of refraction
      float trace(vec3 p, vec3 d, float ior, float thr, int ch) {
        float acc = 0.0;
        for (int b = 0; b < BOUNCES; b++) {
          float tMin = 1e5;
          vec3 nh = vec3(0.0, 1.0, 0.0);
          for (int i = 0; i < NP; i++) {
            vec4 pl = uPlanes[i];
            float dn = dot(pl.xyz, d);
            if (dn > 1e-5) {
              float t = (pl.w - dot(pl.xyz, p)) / dn;
              if (t > 1e-5 && t < tMin) { tMin = t; nh = pl.xyz; }
            }
          }
          p += d * tMin;
          vec3 o = refract(d, -nh, ior);
          if (dot(o, o) > 1e-6) {
            float c = clamp(dot(o, nh), 0.0, 1.0);
            float F = 0.172 + 0.828 * pow(1.0 - c, 5.0);
            vec3 e = env(o);
            acc += thr * (1.0 - F) * (ch == 0 ? e.r : ch == 1 ? e.g : e.b);
            thr *= F;
          }
          d = reflect(d, -nh);
        }
        return acc + thr * 0.03;
      }
      void main() {
        vec3 N = normalize(vNor);
        vec3 V = normalize(vPos - uCam);
        if (dot(V, N) > 0.0) N = -N;
        float cosi = clamp(dot(-V, N), 0.0, 1.0);
        float F = 0.172 + 0.828 * pow(1.0 - cosi, 5.0);
        vec3 col = env(reflect(V, N)) * F;
        vec3 inner;
        #if CHANNELS == 3
          inner.r = trace(vPos, refract(V, N, 1.0 / uIor.x), uIor.x, 1.0 - F, 0);
          inner.g = trace(vPos, refract(V, N, 1.0 / uIor.y), uIor.y, 1.0 - F, 1);
          inner.b = trace(vPos, refract(V, N, 1.0 / uIor.z), uIor.z, 1.0 - F, 2);
        #else
          float g = trace(vPos, refract(V, N, 1.0 / uIor.y), uIor.y, 1.0 - F, 1);
          inner = vec3(g);
        #endif
        col += inner * uTint;
        col *= uGain * (1.0 + uFlash);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  return mat
}

/** A gem mesh: keeps its shader's camera and orientation up to date as it turns. */
export function gemMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material)
  const inv = new THREE.Matrix4()
  const cam = new THREE.Vector3()
  mesh.onBeforeRender = (renderer, scene, camera) => {
    inv.copy(mesh.matrixWorld).invert()
    cam.setFromMatrixPosition(camera.matrixWorld).applyMatrix4(inv)
    material.uniforms.uCam.value.copy(cam)
    const m = material.uniforms.uToWorld.value.setFromMatrix4(mesh.matrixWorld)
    // keep only the rotation (the scale is the same on every axis)
    const e = m.elements
    const k = 1 / Math.hypot(e[0], e[1], e[2])
    for (let i = 0; i < 9; i++) e[i] *= k
  }
  return mesh
}

/** Four-pointed glints that flash on a stone's corners now and then. */
export function glints(points, { count = 4, size = 0.22, color = '#ffffff' } = {}) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.12, 'rgba(255,255,255,0.7)')
  grad.addColorStop(0.35, 'rgba(200,230,255,0.12)')
  grad.addColorStop(1, 'rgba(200,230,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  g.globalCompositeOperation = 'lighter'
  for (const [w, h] of [[2.2, 60], [60, 2.2]]) {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 62)
    r.addColorStop(0, 'rgba(255,255,255,0.95)')
    r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r
    g.beginPath()
    g.ellipse(64, 64, w, h, 0, 0, Math.PI * 2)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const group = new THREE.Group()
  const items = []
  for (let i = 0; i < count; i++) {
    const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 })
    const sp = new THREE.Sprite(m)
    sp.scale.setScalar(size)
    group.add(sp)
    items.push({ sp, t: -i * 0.37 - Math.random() * 0.6, dur: 0.45 + Math.random() * 0.3 })
  }
  return {
    group,
    update(dt, boost = 1) {
      for (const it of items) {
        it.t += dt * boost
        if (it.t > it.dur) {
          it.t = -Math.random() * 1.4 / boost
          const p = points[(Math.random() * points.length) | 0]
          it.sp.position.set(p[0], p[1], p[2]).multiplyScalar(1.02)
          it.sp.material.rotation = Math.random() * 0.6 - 0.3
        }
        const k = it.t > 0 ? Math.sin((it.t / it.dur) * Math.PI) : 0
        it.sp.material.opacity = k
        it.sp.scale.setScalar(size * (0.4 + 0.8 * k))
      }
    },
  }
}
