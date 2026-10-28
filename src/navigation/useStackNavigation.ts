// Navigatiestapel zoals in iOS: elk scherm krijgt een eigen plek in de geschiedenis van de browser,
// zodat Terug, de terugknop van Android en vegen vanaf de linkerrand op de iPhone allemaal werken

import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export type Route = { screen: 'list' } | { screen: 'review'; id: string } | { screen: 'transcript'; id: string }

type Entry = { route: Route; scrollY: number }
type HistoryState = { depth: number; route: Route }
type Direction = 'push' | 'pop'
type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } }

const ROOT: Route = { screen: 'list' }

// Schuift het scherm in of uit; zonder View Transitions of met minder beweging wisselt het direct
function transition(direction: Direction, update: () => void, animate: boolean) {
  const doc = document as ViewTransitionDocument
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!animate || reduced || !doc.startViewTransition) {
    update()
    return
  }
  document.documentElement.dataset.nav = direction
  doc.startViewTransition(update).finished.finally(() => {
    delete document.documentElement.dataset.nav
  })
}

function rememberScroll(entries: Entry[]) {
  return entries.map((entry, i) => (i === entries.length - 1 ? { ...entry, scrollY: window.scrollY } : entry))
}

export function useStackNavigation() {
  const [stack, setStack] = useState<Entry[]>([{ route: ROOT, scrollY: 0 }])
  const stackRef = useRef(stack)

  const apply = useCallback((next: Entry[]) => {
    stackRef.current = next
    flushSync(() => setStack(next))
    window.scrollTo(0, next[next.length - 1].scrollY)
  }, [])

  useEffect(() => {
    history.replaceState({ depth: 0, route: ROOT } satisfies HistoryState, '')

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState | null
      const depth = state?.depth ?? 0
      const current = stackRef.current
      // Na vegen vanaf de rand heeft Safari zelf al geanimeerd
      const animate = !(event as PopStateEvent & { hasUAVisualTransition?: boolean }).hasUAVisualTransition

      if (depth < current.length - 1) {
        transition('pop', () => apply(current.slice(0, depth + 1)), animate)
      } else if (depth > current.length - 1 && state) {
        transition('push', () => apply([...rememberScroll(current), { route: state.route, scrollY: 0 }]), animate)
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [apply])

  const push = useCallback(
    (route: Route) => {
      const next = [...rememberScroll(stackRef.current), { route, scrollY: 0 }]
      history.pushState({ depth: next.length - 1, route } satisfies HistoryState, '')
      transition('push', () => apply(next), true)
    },
    [apply],
  )

  const back = useCallback(() => history.back(), [])

  return { route: stack[stack.length - 1].route, push, back }
}
