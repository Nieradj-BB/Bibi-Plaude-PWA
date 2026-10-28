import type { GoogleAuth } from '../auth/useGoogleAuth'
import { MAIL_LABEL } from '../config'
import { EmptyState } from './EmptyState'
import { Icon, Spinner } from './Icon'

const errorText: Record<string, string> = {
  access_denied: 'Je hebt geen toestemming gegeven. Zonder toestemming kan Verslagen je Plaud-mails niet lezen.',
  state_mismatch: 'Het inloggen is niet goed afgerond. Probeer het nog een keer.',
}

export function ConnectCard({ auth }: { auth: GoogleAuth }) {
  if (auth.renewing) {
    return <EmptyState icon={<Spinner size={30} />} title="Opnieuw verbinden" text="Even geduld, je wordt opnieuw aangemeld bij Gmail." />
  }

  // Een mislukte stille poging (bijvoorbeeld login_required) is geen fout voor de gebruiker
  const message = auth.error ? errorText[auth.error] : undefined

  return (
    <EmptyState
      icon={<Icon name="envelope" size={52} />}
      title="Verbind je Gmail"
      text={`Verslagen leest alleen de mails met het label ${MAIL_LABEL}. Je hoeft dit maar één keer te doen.`}
    >
      {message && <p className="empty-error">{message}</p>}
      <button type="button" className="capsule-btn prominent inline" onClick={auth.signIn}>
        Inloggen met Google
      </button>
    </EmptyState>
  )
}
