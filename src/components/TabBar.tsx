export type Tab = 'toReview' | 'handled'

type Props = {
  active: Tab
  toReviewCount: number
  onChange: (tab: Tab) => void
}

export function TabBar({ active, toReviewCount, onChange }: Props) {
  return (
    <nav className="tabbar" aria-label="Hoofdmenu">
      <button
        type="button"
        className="tab"
        aria-current={active === 'toReview' ? 'page' : undefined}
        onClick={() => onChange('toReview')}
      >
        <span className="tab-icon">
          <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 11l2-6h10l2 6v5H3z" />
            <path d="M3 11h4l1 2h4l1-2h4" />
          </svg>
          {toReviewCount > 0 && <span className="badge">{toReviewCount}</span>}
        </span>
        Te controleren
      </button>
      <button
        type="button"
        className="tab"
        aria-current={active === 'handled' ? 'page' : undefined}
        onClick={() => onChange('handled')}
      >
        <span className="tab-icon">
          <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="10" cy="10" r="7" />
            <path d="M6.5 10.2l2.4 2.4 4.6-5" />
          </svg>
        </span>
        Afgehandeld
      </button>
    </nav>
  )
}
