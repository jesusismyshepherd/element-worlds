// The graphene honeycomb in GLSL, drawn exactly: atoms on the corners of hexagons whose side is the
// bond length. Shared by the floor, the moiré bilayer, the hammock and the transistor's channel.

export const HONEY_GLSL = /* glsl */ `
  const vec2 HS = vec2(1.0, 1.7320508);
  vec4 hexCell(vec2 p) {
    vec4 hC = floor(vec4(p, p - vec2(0.5, 1.0)) / HS.xyxy) + 0.5;
    vec4 h = vec4(p - hC.xy * HS, p - (hC.zw + 0.5) * HS);
    return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw + 0.5);
  }
  // distances from a point to the nearest bond (x) and the nearest atom (y), in bond lengths
  vec2 honey(vec2 xy, float bond) {
    vec2 p = xy * (0.5773503 / bond);
    vec2 q = abs(hexCell(p).xy);
    float edge = 0.5 - max(dot(q, HS * 0.5), q.x);
    float dv = min(length(q - vec2(0.5, 0.2886751)), length(q - vec2(0.0, 0.5773503)));
    return vec2(edge, dv) * 1.7320508;
  }
  // how much of a pixel the lattice covers: lines lw and atoms ar wide (in bond lengths); far
  // away, where a line is thinner than a pixel, its average instead of a flicker
  vec2 honeyInk(vec2 xy, float bond, float lw, float ar) {
    vec2 h = honey(xy, bond);
    float px = length(fwidth(xy)) / bond;
    float line = 1.0 - smoothstep(lw, lw + px * 1.3, h.x);
    float node = 1.0 - smoothstep(ar, ar + px * 1.3, h.y);
    float far = smoothstep(lw * 1.2, lw * 5.0, px);
    return vec2(mix(line, lw * 2.6, far), mix(node, ar * ar * 2.4, far));
  }
`
