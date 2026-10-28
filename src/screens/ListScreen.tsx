import type { GoogleAuth } from '../auth/useGoogleAuth'
import { ConnectCard } from '../components/ConnectCard'
import { InstallHint } from '../components/InstallHint'
import { MailboxError } from '../components/MailboxError'
import { ReportCard } from '../components/ReportCard'
import type { Tab } from '../components/TabBar'
import { MAIL_LABEL } from '../config'
import type { Mailbox } from '../mail/useMailbox'
import type { Report } from '../report/report'

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
  reports: Report[]
  onOpen: (id: string) => void
}

function subtitle(tab: Tab, auth: GoogleAuth, mailbox: Mailbox, shown: number) {
  if (!auth.session) return 'Nog niet verbonden'
  if (mailbox.status === 'loading' && mailbox.messages.length === 0) return 'Verslagen ophalen...'
  if (tab === 'handled') return shown === 1 ? '1 verslag afgehandeld' : `${shown} verslagen afgehandeld`
  if (shown === 0) return 'Niets te controleren'
  return shown === 1 ? '1 verslag wacht op je' : `${shown} verslagen wachten op je`
}

function EmptyState({ tab, total }: { tab: Tab; total: number }) {
  if (tab === 'handled') {
    return (
      <section className="card">
        <h2>Nog niets afgehandeld</h2>
        <p>Verslagen die je afrondt of op Niet bruikbaar zet, komen hier te staan.</p>
      </section>
    )
  }
  if (total > 0) {
    return (
      <section className="card">
        <h2>Alles gecontroleerd</h2>
        <p>Na je volgende opname verschijnt het nieuwe verslag hier.</p>
      </section>
    )
  }
  return (
    <section className="card">
      <h2>Nog geen verslagen</h2>
      <p>Er staan nog geen mails met het label {MAIL_LABEL} in je Gmail. Na je volgende opname verschijnt het verslag hier.</p>
    </section>
  )
}

export function ListScreen({ tab, auth, mailbox, reports, onOpen }: Props) {
  const isToReview = tab === 'toReview'
  const connected = auth.session !== null
  const shown = reports.filter((r) => (isToReview ? r.status === 'toReview' : r.status !== 'toReview'))

  return (
    <main className="screen">
      <header className="app-head">
        <div className="app-kicker">Verslagen</div>
        <div className="app-head-row">
          <h1 className="app-title">{isToReview ? 'Te controleren' : 'Afgehandeld'}</h1>
          {connected && (
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
        <p className="app-sub">{subtitle(tab, auth, mailbox, shown.length)}</p>
      </header>

      <div className="app-body">
        {isToReview && <InstallHint />}

        {!connected && <ConnectCard auth={auth} />}

        {connected && mailbox.error && <MailboxError error={mailbox.error} onRetry={mailbox.reload} />}

        {connected && mailbox.status === 'ready' && shown.length === 0 && <EmptyState tab={tab} total={reports.length} />}

        {connected && shown.map((r) => <ReportCard key={r.id} report={r} onOpen={() => onOpen(r.id)} />)}

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
