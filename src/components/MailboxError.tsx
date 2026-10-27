import { MAIL_LABEL } from '../config'
import type { MailError } from '../mail/types'

export function MailboxError({ error, onRetry }: { error: MailError; onRetry: () => void }) {
  if (error.kind === 'labelMissing') {
    return (
      <section className="card">
        <h2>Label {MAIL_LABEL} ontbreekt</h2>
        <p>Maak in Gmail op de computer een filter dat de mails van Plaud het label {MAIL_LABEL} geeft. Daarna verschijnen ze hier.</p>
        <button type="button" className="btn ghost" onClick={onRetry}>
          Opnieuw kijken
        </button>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Ophalen lukte niet</h2>
      <p>{error.message}</p>
      <button type="button" className="btn ghost" onClick={onRetry}>
        Opnieuw proberen
      </button>
    </section>
  )
}
