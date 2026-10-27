export type Tab = 'open' | 'done'

type Props = {
  active: Tab
  onChange: (tab: Tab) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tabbar" aria-label="Hoofdmenu">
      <button
        type="button"
        className="tab"
        aria-current={active === 'open' ? 'page' : undefined}
        onClick={() => onChange('open')}
      >
        <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11l2-6h10l2 6v5H3z" />
          <path d="M3 11h4l1 2h4l1-2h4" />
        </svg>
        Te controleren
      </button>
      <button
        type="button"
        className="tab"
        aria-current={active === 'done' ? 'page' : undefined}
        onClick={() => onChange('done')}
      >
        <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="M6.5 10.2l2.4 2.4 4.6-5" />
        </svg>
        Afgerond
      </button>
    </nav>
  )
}
