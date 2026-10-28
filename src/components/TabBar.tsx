import { Icon } from './Icon'

export type Tab = 'toReview' | 'handled'

type Props = {
  active: Tab
  toReviewCount: number
  onChange: (tab: Tab) => void
}

// Zwevende tabbalk van iOS 26; het actieve tabblad krijgt een gevuld icoon
export function TabBar({ active, toReviewCount, onChange }: Props) {
  return (
    <nav className="tabbar glass" aria-label="Hoofdmenu">
      <button
        type="button"
        className="tab"
        aria-current={active === 'toReview' ? 'page' : undefined}
        onClick={() => onChange('toReview')}
      >
        <span className="tab-icon">
          <Icon name={active === 'toReview' ? 'trayFill' : 'tray'} size={26} />
          {toReviewCount > 0 && (
            <span className="badge" aria-label={`${toReviewCount} te controleren`}>
              {toReviewCount}
            </span>
          )}
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
          <Icon name={active === 'handled' ? 'checkCircleFill' : 'checkCircle'} size={26} />
        </span>
        Afgehandeld
      </button>
    </nav>
  )
}
