// The little window for writing your name in neon: a text box, a button for each sign gas (in its
// colour), "Light it!" and "Close". Plain DOM over the 3D (the wing adds it while it is open and takes
// it away when you leave), in the HUD's glass look. Keys typed here never reach the walker (the box
// stops them), Enter lights the word, Escape closes.
import { sanitizeName, NAME_MAX } from './tubeFont.js'

export function nameOverlay({ parent, words, gases, glowOf, nameOf, onPreview, onSubmit, onClose }) {
  let root = null
  let input = null
  let chips = []
  let gas = gases[0]
  let isOpen = false

  const paintChips = () => {
    for (const c of chips) {
      const on = c.dataset.gas === gas
      c.style.boxShadow = on ? '0 0 0 3px #ffffff, 0 0 14px 2px ' + glowOf(c.dataset.gas) : 'none'
      c.style.transform = on ? 'scale(1.08)' : 'none'
    }
  }

  const build = () => {
    root = document.createElement('div')
    root.className = 'glass'
    Object.assign(root.style, {
      position: 'absolute', top: '96px', left: '50%', transform: 'translateX(-50%)', width: 'min(92vw, 27rem)',
      zIndex: '30', padding: '14px 16px 16px', borderRadius: '18px', color: '#eef2ff', pointerEvents: 'auto',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)', borderColor: 'rgba(255,138,92,0.55)', fontFamily: 'Nunito, system-ui, sans-serif',
    })
    const title = document.createElement('div')
    title.textContent = words.title
    Object.assign(title.style, { fontFamily: 'Outfit, system-ui, sans-serif', fontWeight: '700', fontSize: '20px', marginBottom: '10px' })
    input = document.createElement('input')
    Object.assign(input, { type: 'text', maxLength: NAME_MAX + 4, placeholder: words.placeholder, autocomplete: 'off', spellcheck: false })
    input.setAttribute('autocapitalize', 'characters')
    input.setAttribute('aria-label', words.title)
    Object.assign(input.style, {
      width: '100%', boxSizing: 'border-box', fontSize: '22px', fontFamily: 'Outfit, system-ui, sans-serif', fontWeight: '700',
      letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff', background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(160,190,255,0.4)', borderRadius: '10px', padding: '8px 12px', outline: 'none',
    })
    const gasRow = document.createElement('div')
    Object.assign(gasRow.style, { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' })
    const gasLabel = document.createElement('span')
    gasLabel.textContent = `${words.gas}:`
    Object.assign(gasLabel.style, { fontSize: '13px', fontWeight: '700', opacity: '0.8', marginRight: '2px' })
    gasRow.append(gasLabel)
    chips = gases.map(sym => {
      const b = document.createElement('button')
      b.type = 'button'
      b.dataset.gas = sym
      b.textContent = sym
      b.title = nameOf(sym)
      b.setAttribute('aria-label', nameOf(sym))
      Object.assign(b.style, {
        width: '42px', height: '34px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, system-ui, sans-serif',
        fontWeight: '700', fontSize: '15px', color: '#0b0f24', background: glowOf(sym), transition: 'transform 0.12s, box-shadow 0.12s',
      })
      b.addEventListener('click', () => {
        gas = sym
        paintChips()
        input.focus()
      })
      gasRow.append(b)
      return b
    })
    const note = document.createElement('div')
    note.textContent = words.radon
    Object.assign(note.style, { fontSize: '12px', opacity: '0.7', marginTop: '8px' })
    const buttons = document.createElement('div')
    Object.assign(buttons.style, { display: 'flex', gap: '8px', marginTop: '14px' })
    const go = document.createElement('button')
    go.type = 'button'
    go.textContent = words.light
    Object.assign(go.style, {
      flex: '1', padding: '9px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: '#ffd166', color: '#0b0f24',
      fontFamily: 'Outfit, system-ui, sans-serif', fontWeight: '700', fontSize: '17px',
    })
    const shut = document.createElement('button')
    shut.type = 'button'
    shut.textContent = words.close
    Object.assign(shut.style, {
      padding: '9px 14px', borderRadius: '12px', border: '1px solid rgba(160,190,255,0.4)', cursor: 'pointer', background: 'transparent',
      color: '#eef2ff', fontFamily: 'Outfit, system-ui, sans-serif', fontWeight: '700', fontSize: '15px',
    })
    buttons.append(go, shut)
    root.append(title, input, gasRow, note, buttons)

    input.addEventListener('input', () => {
      const clean = sanitizeName(input.value)
      if (clean !== input.value.toLocaleUpperCase('pt-PT')) {
        input.value = clean
      }
      onPreview?.(clean.trim())
    })
    const submit = () => {
      const word = sanitizeName(input.value).trim()
      if (!word) {
        input.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 240 })
        input.focus()
        return
      }
      close(true)
      onSubmit?.(word, gas)
    }
    go.addEventListener('click', submit)
    shut.addEventListener('click', () => close(false))
    // keys stay in here: the walker does not move while you type, E does not use anything
    root.addEventListener('keydown', e => {
      e.stopPropagation()
      if (e.key === 'Enter') {
        e.preventDefault()
        submit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        close(false)
      }
    })
    root.addEventListener('keyup', e => e.stopPropagation())
    for (const kind of ['pointerdown', 'wheel', 'touchstart']) root.addEventListener(kind, e => e.stopPropagation(), { passive: true })
  }

  function open({ text = '', gas: g = gases[0] } = {}) {
    if (!root) build()
    gas = gases.includes(g) ? g : gases[0]
    input.value = text
    paintChips()
    if (!root.parentNode) parent.append(root)
    isOpen = true
    setTimeout(() => {
      input.focus()
      input.select()
    }, 30)
  }

  function close(submitted = false) {
    if (!isOpen) return
    isOpen = false
    root?.remove()
    input?.blur()
    onClose?.(submitted)
  }

  return {
    open,
    close,
    get isOpen() {
      return isOpen
    },
    dispose() {
      isOpen = false
      root?.remove()
      root = null
    },
  }
}
