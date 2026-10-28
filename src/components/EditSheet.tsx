import { useEffect, useRef, useState, type PointerEvent, type TransitionEvent } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

type Props = {
  title: string
  initial: string
  onCancel: () => void
  onDone: (text: string) => void
}

type Phase = 'enter' | 'open' | 'exit'

// Zo ver omlaag vegen om het blad te sluiten, in pixels
const DISMISS_DISTANCE = 120

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Bij een open toetsenbord is het zichtbare deel van het scherm kleiner; het blad past zich daaraan aan
function useVisualViewport() {
  useEffect(() => {
    const viewport = window.visualViewport
    const root = document.documentElement
    if (!viewport) return
    const update = () => {
      root.style.setProperty('--vv-height', `${viewport.height}px`)
      root.style.setProperty('--vv-top', `${viewport.offsetTop}px`)
    }
    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      root.style.removeProperty('--vv-height')
      root.style.removeProperty('--vv-top')
    }
  }, [])
}

// Blad dat van onderen omhoog schuift, met Annuleer (kruisje) en Gereed (vinkje) zoals in iOS 26.
// Omlaag vegen sluit het blad, maar alleen als er niets is gewijzigd.
export function EditSheet({ title, initial, onCancel, onDone }: Props) {
  const [text, setText] = useState(initial)
  const [phase, setPhase] = useState<Phase>('enter')
  const [drag, setDrag] = useState<number | null>(null)
  const result = useRef<'cancel' | 'done'>('cancel')
  const finished = useRef(false)
  const dragStart = useRef(0)
  const dirty = text !== initial

  useVisualViewport()

  useEffect(() => {
    document.documentElement.classList.add('sheet-open')
    // Pas na de eerste frame openschuiven; was het blad intussen al gesloten, dan blijft het dicht
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase((p) => (p === 'enter' ? 'open' : p))))
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('sheet-open')
    }
  }, [])

  function finish() {
    if (finished.current) return
    finished.current = true
    if (result.current === 'done') onDone(text)
    else onCancel()
  }

  function close(kind: 'cancel' | 'done') {
    result.current = kind
    setDrag(null)
    // Zonder zichtbare animatie (nog niet open, of minder beweging) direct sluiten
    if (prefersReducedMotion() || phase !== 'open') {
      finish()
      return
    }
    setPhase('exit')
    // Vangnet als de browser geen transitionend stuurt
    window.setTimeout(finish, 700)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close('cancel')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function onTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && e.propertyName === 'transform' && phase === 'exit') finish()
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('button')) return
    dragStart.current = e.clientY
    setDrag(0)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (drag === null) return
    const distance = Math.max(0, e.clientY - dragStart.current)
    // Met wijzigingen veert het blad terug, zodat je niet per ongeluk tekst kwijtraakt
    setDrag(dirty ? distance * 0.25 : distance)
  }

  function onPointerUp() {
    if (drag === null) return
    if (!dirty && drag > DISMISS_DISTANCE) close('cancel')
    else setDrag(null)
  }

  const offscreen = phase !== 'open'
  const transform = offscreen ? 'translateY(100%)' : `translateY(${drag ?? 0}px)`

  return createPortal(
    <>
      <div className="sheet-scrim" style={{ opacity: offscreen ? 0 : 1 }} onClick={() => !dirty && close('cancel')} />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ transform, transition: drag !== null ? 'none' : 'transform 0.45s var(--ease-ios)' }}
        onTransitionEnd={onTransitionEnd}
      >
        <div className="sheet-grabber" aria-hidden="true" />
        <div className="sheet-header" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <button type="button" className="glass-btn plain" onClick={() => close('cancel')} aria-label="Annuleer">
            <Icon name="xmark" size={18} />
          </button>
          <h2 className="sheet-title">{title}</h2>
          <button type="button" className="glass-btn tinted" onClick={() => close('done')} aria-label="Gereed">
            <Icon name="checkmark" size={20} />
          </button>
        </div>
        <textarea
          className="sheet-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={`Tekst van ${title}`}
          autoFocus
        />
      </div>
    </>,
    document.body,
  )
}
