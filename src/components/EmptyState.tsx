import type { ReactNode } from 'react'

// Lege of foutstaat in het midden van het scherm, zoals ContentUnavailableView in iOS
export function EmptyState({ icon, title, text, children }: { icon: ReactNode; title: string; text: string; children?: ReactNode }) {
  return (
    <section className="empty">
      <span className="empty-icon">{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </section>
  )
}
