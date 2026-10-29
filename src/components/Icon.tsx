import type { ReactNode } from 'react'

// Lijniconen in de stijl van SF Symbols; altijd decoratief, de knop of tekst ernaast draagt de betekenis

const TRAY = 'M3.5 13.5 6 6.3A2 2 0 0 1 7.9 5h8.2a2 2 0 0 1 1.9 1.3l2.5 7.2V18a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z'
const TRAY_OPENING = 'M3.5 13.5H8l1.2 2.2h5.6l1.2-2.2h4.5'

const ICONS = {
  chevronLeft: <path d="M15 4.5 7.5 12 15 19.5" strokeWidth={2.6} />,
  chevronRight: <path d="M9 5.5 15.5 12 9 18.5" strokeWidth={2.4} />,
  chevronUpDown: <path d="M8 9.5 12 5.5l4 4M8 14.5l4 4 4-4" strokeWidth={2.2} />,
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.5 4.5v4h-4" />
    </>
  ),
  xmark: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" strokeWidth={2.4} />,
  checkmark: <path d="M5 12.5 9.8 17 19 7" strokeWidth={2.6} />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 20 20" />
    </>
  ),
  xmarkCircleFill: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth={2} />
    </>
  ),
  exclamationFill: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none" />
      <path d="M12 7.5v5.5" stroke="#fff" strokeWidth={2.2} />
      <circle cx="12" cy="16.6" r="1.25" fill="#fff" stroke="none" />
    </>
  ),
  checkCircleFill: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none" />
      <path d="M7.8 12.3l2.9 2.9 5.5-6" stroke="#fff" strokeWidth={2.2} />
    </>
  ),
  pencilCircleFill: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none" />
      <path d="M8.2 15.8l.6-2.6 5.4-5.4a1.3 1.3 0 0 1 1.9 1.9l-5.4 5.4z" stroke="#fff" strokeWidth={1.6} />
    </>
  ),
  minusCircleFill: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none" />
      <path d="M7.5 12h9" stroke="#fff" strokeWidth={2.2} />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3l2.8 2.8L16.2 9" />
    </>
  ),
  tray: (
    <>
      <path d={TRAY} />
      <path d={TRAY_OPENING} />
    </>
  ),
  trayFill: (
    <>
      <path d={TRAY} fill="currentColor" />
      <path d={TRAY_OPENING} stroke="#fff" />
    </>
  ),
  doc: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" />
    </>
  ),
  paperclip: <path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />,
  envelope: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof ICONS

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  )
}

// Activiteitsindicator van iOS: acht streepjes die rondlopen
export function Spinner({ spinning = true, size = 20 }: { spinning?: boolean; size?: number }) {
  return (
    <svg className={spinning ? 'spinner spinning' : 'spinner'} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={i}
          x1="12"
          y1="3"
          x2="12"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={0.25 + (i / 7) * 0.75}
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
  )
}
