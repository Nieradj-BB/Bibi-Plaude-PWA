import type { GoogleAuth } from '../auth/useGoogleAuth'
import { MAIL_LABEL } from '../config'

const errorText: Record<string, string> = {
  access_denied: 'Je hebt geen toestemming gegeven. Zonder toestemming kan Verslagen je Plaud-mails niet lezen.',
  state_mismatch: 'Het inloggen is niet goed afgerond. Probeer het nog een keer.',
}

export function ConnectCard({ auth }: { auth: GoogleAuth }) {
  if (auth.renewing) {
    return (
      <section className="card">
        <h2>Opnieuw verbinden met Gmail</h2>
        <p>Even geduld, je wordt opnieuw aangemeld.</p>
      </section>
    )
  }

  // Een mislukte stille poging (bijvoorbeeld login_required) is geen fout voor de gebruiker
  const message = auth.error ? errorText[auth.error] : undefined

  return (
    <section className="card connect">
      <h2>Verbind je Gmail</h2>
      <p>Verslagen leest alleen de mails met het label {MAIL_LABEL}. Je hoeft dit maar één keer te doen.</p>
      {message && <p className="error-text">{message}</p>}
      <button type="button" className="btn primary" onClick={auth.signIn}>
        Inloggen met Google
      </button>
    </section>
  )
}
