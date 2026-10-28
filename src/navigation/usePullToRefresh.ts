import { useEffect, useState } from 'react'

// Zo ver omlaag trekken voordat de lijst vernieuwt, in pixels
const THRESHOLD = 72

// Omlaag trekken om te vernieuwen, zoals in Mail. Op de iPhone loopt de pagina bovenaan door (scrollY < 0);
// dat gebruiken we, zodat het verende gevoel van iOS blijft. Op de laptop is er de knop Vernieuwen.
export function usePullToRefresh(onRefresh: () => void, enabled: boolean) {
  const [pull, setPull] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let touching = false
    let triggered = false

    const onScroll = () => {
      const y = window.scrollY
      if (y >= 0) {
        triggered = false
        setPull(0)
        return
      }
      // Doorschieten na een snelle veeg telt niet, alleen echt trekken
      if (!touching) {
        setPull(0)
        return
      }
      const progress = Math.min(1, -y / THRESHOLD)
      setPull(progress)
      if (progress >= 1 && !triggered) {
        triggered = true
        onRefresh()
      }
    }
    const onTouchStart = () => {
      touching = true
    }
    const onTouchEnd = () => {
      touching = false
      setPull(0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [enabled, onRefresh])

  return pull
}
