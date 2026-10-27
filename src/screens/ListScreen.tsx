import type { GoogleAuth } from '../auth/useGoogleAuth'
import { ConnectCard } from '../components/ConnectCard'
import { InstallHint } from '../components/InstallHint'
import { MailboxError } from '../components/MailboxError'
import { MailCard } from '../components/MailCard'
import type { Tab } from '../components/TabBar'
import { MAIL_LABEL } from '../config'
import type { Mailbox } from '../mail/useMailbox'

const buildTime = new Date(__BUILD_TIME__).toLocaleString('nl-NL', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

type Props = {
  tab: Tab
  auth: GoogleAuth
  mailbox: Mailbox
  onOpen: (id: string) => void
}

function subtitle(auth: GoogleAuth, mailbox: Mailbox) {
  if (!auth.session) return 'Nog niet verbonden'
  if (mailbox.status === 'loading' && mailbox.messages.length === 0) return 'Mails ophalen...'
  const n = mailbox.messages.length
  return n === 1 ? '1 verslag' : `${n} verslagen`
}

export function ListScreen({ tab, auth, mailbox, onOpen }: Props) {
  const isOpen = tab === 'open'
  const connected = auth.session !== null

  return (
    <main className="screen">
      <header className="app-head">
        <div className="app-kicker">Verslagen</div>
        <div className="app-head-row">
          <h1 className="app-title">{isOpen ? 'Te controleren' : 'Afgerond'}</h1>
          {isOpen && connected && (
            <button
              type="button"
              className="icon-btn"
              onClick={mailbox.reload}
              disabled={mailbox.status === 'loading'}
              aria-label="Vernieuwen"
            >
              <svg
                className={mailbox.status === 'loading' ? 'spin' : undefined}
                viewBox="0 0 20 20"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 10a6 6 0 1 1-1.8-4.3" />
                <path d="M16 3.5v3.2h-3.2" />
              </svg>
            </button>
          )}
        </div>
        <p className="app-sub">{isOpen ? subtitle(auth, mailbox) : 'Nog niets afgerond'}</p>
      </header>

      <div className="app-body">
        {isOpen && <InstallHint />}

        {isOpen && !connected && <ConnectCard auth={auth} />}

        {isOpen && connected && mailbox.error && <MailboxError error={mailbox.error} onRetry={mailbox.reload} />}

        {isOpen && connected && mailbox.status === 'ready' && mailbox.messages.length === 0 && (
          <section className="card">
            <h2>Nog geen verslagen</h2>
            <p>Er staan nog geen mails met het label {MAIL_LABEL} in je Gmail. Na je volgende opname verschijnt het verslag hier.</p>
          </section>
        )}

        {isOpen && connected && mailbox.messages.map((m) => <MailCard key={m.id} message={m} onOpen={() => onOpen(m.id)} />)}

        {!isOpen && (
          <section className="card">
            <h2>Afgeronde verslagen</h2>
            <p>Verslagen die je als gecontroleerd of niet bruikbaar markeert, komen hier te staan.</p>
          </section>
        )}

        <footer className="foot">
          {connected && mailbox.account && (
            <p>
              Verbonden met {mailbox.account} ·{' '}
              <button type="button" className="link-btn inline" onClick={auth.signOut}>
                Uitloggen
              </button>
            </p>
          )}
          <p>
            Versie {__APP_VERSION__} · {buildTime}
          </p>
        </footer>
      </div>
    </main>
  )
}
