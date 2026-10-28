import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

// Hoogte van de grote titel: daarna verschijnt de titel klein in de navigatiebalk
const LARGE_TITLE_HEIGHT = 44

export function useScrolled(threshold = LARGE_TITLE_HEIGHT) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

type Props = {
  title: string
  showTitle: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export function NavBar({ title, showTitle, leading, trailing }: Props) {
  return (
    <header className={showTitle ? 'navbar is-scrolled' : 'navbar'}>
      <div className="navbar-inner">
        <div className="navbar-side">{leading}</div>
        <div className="navbar-title" aria-hidden="true">
          {title}
        </div>
        <div className="navbar-side end">{trailing}</div>
      </div>
    </header>
  )
}

// Terugknop van iOS 26: een glazen rondje met een pijl
export function BackButton({ to, onClick }: { to: string; onClick: () => void }) {
  return (
    <button type="button" className="glass glass-btn" onClick={onClick} aria-label={`Terug naar ${to}`}>
      <Icon name="chevronLeft" size={22} />
    </button>
  )
}
