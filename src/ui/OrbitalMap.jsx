/* eslint-disable react/prop-types */
// The electron map inside a panel (the room inside the atom, src/worlds/atom/): a row for each shell (the
// first at the bottom, as energy climbs), a key for each subshell in its block's colour with its electron
// count and Hund's boxes (↑ for an electron, ↑↓ for a pair). A tap on a key's name shows that subshell, on
// a box that one orbital, on "All" every electron; what is shown is lit. Panel.jsx shows it for a block
// { orbitals: { shells, subs [{ id, n, l, count, boxes, names }], sel { sub, m }, colors, all, sci, pick } }.

const ARROWS = ['', '↑', '↑↓']

export default function OrbitalMap({ map }) {
  const { shells, subs, sel, colors, all, sci, pick } = map
  const rows = Array.from({ length: shells }, (_, i) => shells - i)
  const allOn = sel.sub === 'all'
  return (
    <div className="rounded-xl bg-white/5 p-2.5 flex flex-col gap-2" data-orbital-map>
      <button
        type="button"
        onClick={() => pick({ sub: 'all', m: null })}
        className={`self-start rounded-xl px-3 py-1.5 text-sm font-bold transition active:scale-95 ${allOn ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10 hover:bg-white/20'}`}
      >
        ⚛ {all}
      </button>
      {rows.map(n => (
        <div key={n} className="flex flex-wrap items-center gap-1.5">
          <span className="w-9 shrink-0 text-xs opacity-50 tabular-nums">n = {n}</span>
          {subs
            .filter(s => s.n === n)
            .sort((a, b) => 'spdf'.indexOf(a.l) - 'spdf'.indexOf(b.l))
            .map(s => {
              const on = sel.sub === s.id
              const c = colors[s.l]
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-1 rounded-lg pl-1 pr-1.5 py-1"
                  style={{ background: `${c}${on ? '55' : '22'}`, boxShadow: on ? `0 0 0 2px #fff, 0 0 12px ${c}` : `inset 0 0 0 1.5px ${c}aa` }}
                >
                  <button
                    type="button"
                    onClick={() => pick({ sub: s.id, m: null })}
                    className="font-display font-bold text-sm px-1 leading-none active:scale-95"
                    aria-label={`${s.id} (${s.count})`}
                  >
                    {s.id}
                    <sup className="text-[0.65em] ml-px">{s.count}</sup>
                  </button>
                  {s.boxes.map((b, m) => {
                    const one = on && sel.m === m
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => pick({ sub: s.id, m })}
                        title={sci && s.names[m] ? `${s.id}${s.names[m]}` : undefined}
                        aria-label={`${s.id}${s.names[m] ?? ''}`}
                        className="w-[1.15rem] h-[1.15rem] rounded-[4px] text-[10px] leading-none font-bold flex items-center justify-center active:scale-90 transition"
                        style={{
                          background: one ? 'rgba(255,255,255,0.45)' : b ? `${c}66` : 'rgba(255,255,255,0.05)',
                          boxShadow: one ? '0 0 0 2px #fff' : `inset 0 0 0 1px rgba(255,255,255,${b ? 0.7 : 0.25})`,
                          letterSpacing: '-0.08em',
                        }}
                      >
                        {ARROWS[b]}
                      </button>
                    )
                  })}
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}
