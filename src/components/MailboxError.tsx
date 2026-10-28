import { MAIL_LABEL } from '../config'
import type { MailError } from '../mail/types'
import { EmptyState } from './EmptyState'
import { Icon } from './Icon'

export function MailboxError({ error, onRetry }: { error: MailError; onRetry: () => void }) {
  const labelMissing = error.kind === 'labelMissing'

  return (
    <EmptyState
      icon={<Icon name="exclamationFill" size={52} />}
      title={labelMissing ? `Label ${MAIL_LABEL} ontbreekt` : 'Ophalen lukte niet'}
      text={
        labelMissing
          ? `Maak in Gmail op de computer een filter dat de mails van Plaud het label ${MAIL_LABEL} geeft. Daarna verschijnen ze hier.`
          : error.message
      }
    >
      <button type="button" className="capsule-btn glass inline" onClick={onRetry}>
        {labelMissing ? 'Opnieuw kijken' : 'Opnieuw proberen'}
      </button>
    </EmptyState>
  )
}
