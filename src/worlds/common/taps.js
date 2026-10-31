// Things worked by hand, for any walking world: a click or a tap on the thing itself does the step it is
// for (the user, 2026-10-30: choosing the next step by touching the sand, the soda, the pot beats pressing
// E again and again). The engine sends a tap to `world.onTap(ray)` and asks `world.pointAt(ray)` whether
// the hand shows (engine.js). First used by the picture rooms (pictures/room.js).
import * as THREE from 'three'

/** clickable(object, onTap, { when, reach, accept }): `when()` says whether it can be used now (the hand
 *  shows only then), `reach` how near the visitor must stand (m), `accept(hit)` which hits count (the clear
 *  corner of a cut face is no place to tap). Give the world `pointAt` and `onTap`. An object whose own
 *  `visible` is false is skipped: an invisible, bigger hit shape is a mesh with an invisible material
 *  inside a visible group (oxygen's kit `hitShape`). */
export function tapTargets(ctx) {
  const list = []
  const caster = new THREE.Raycaster()
  const clickable = (object, onTap, { when = () => true, reach = 4.5, accept = null } = {}) => list.push({ object, onTap, when, reach, accept })
  const at = ray => {
    if (!ray || !list.length) return null
    caster.ray.copy(ray)
    // sprites need the camera to be hit
    caster.camera = ctx.camera
    const p = ctx.engine.player.pos
    let best = null
    for (const c of list) {
      if (!c.object.visible || !c.when()) continue
      const hit = caster.intersectObject(c.object, true).find(h => !c.accept || c.accept(h))
      if (!hit || (best && hit.distance >= best.hit.distance)) continue
      if (Math.hypot(hit.point.x - p.x, hit.point.z - p.z) > c.reach) continue
      best = { c, hit }
    }
    return best
  }
  return {
    clickable,
    pointAt: ray => !!at(ray),
    onTap(ray) {
      const best = at(ray)
      if (best) best.c.onTap(best.hit)
    },
  }
}
