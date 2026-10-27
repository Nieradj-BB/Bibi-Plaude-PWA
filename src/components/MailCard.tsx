import { formatReceived, senderName } from '../format'
import type { MailMessage } from '../mail/types'
import { displayTitle } from '../parser/plaudMail'

export function MailCard({ message, onOpen }: { message: MailMessage; onOpen: () => void }) {
  return (
    <button type="button" className="card mail-card" onClick={onOpen}>
      <span className="mail-card-top">
        <strong>{displayTitle(message.subject)}</strong>
        <span className="chip ready">Nieuw</span>
      </span>
      <span className="meta">
        {formatReceived(message.receivedAt)} · {senderName(message.from)}
      </span>
    </button>
  )
}
