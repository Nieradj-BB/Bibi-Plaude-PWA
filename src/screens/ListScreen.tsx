import type { GoogleAuth } from '../auth/useGoogleAuth'
import { ConnectCard } from '../components/ConnectCard'
import { EmptyState } from '../components/EmptyState'
import { Icon, Spinner } from '../components/Icon'
import { InstallHint } from '../components/InstallHint'
import { MailboxError } from '../components/MailboxError'
import { NavBar, useScrolled } from '../components/NavBar'
import { ReportRow } from '../components/ReportRow'
import type { Tab } from '../components/TabBar'
import { MAIL_LABEL } from '../config'
import type { Mailbox } from '../mail/useMailbox'
import { usePullToRefresh } from '../navigation/usePullToRefresh'
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

function EmptyList({ tab, total }: { tab: Tab; total: number }) {
  if (tab === 'handled') {
    return (
      <EmptyState
        icon={<Icon name="checkCircle" size={52} />}
        title="Nog niets afgehandeld"
        text="Verslagen die je afrondt of op Niet bruikbaar zet, komen hier te staan."
      />
    )
  }
  if (total > 0) {
    return (
      <EmptyState
        icon={<Icon name="checkCircle" size={52} />}
        title="Alles gecontroleerd"
        text="Na je volgende opname verschijnt het nieuwe verslag hier."
      />
    )
  }
  return (
    <EmptyState
      icon={<Icon name="tray" size={52} />}
      title="Nog geen verslagen"
      text={`Er staan nog geen mails met het label ${MAIL_LABEL} in je Gmail. Na je volgende opname verschijnt het verslag hier.`}
    />
  )
}

export function ListScreen({ tab, auth, mailbox, reports, onOpen }: Props) {
  const scrolled = useScrolled()
  const connected = auth.session !== null
  const pull = usePullToRefresh(mailbox.reload, connected)
  const isToReview = tab === 'toReview'
  const title = isToReview ? 'Te controleren' : 'Afgehandeld'
  const loading = mailbox.status === 'loading'
  const shown = reports.filter((r) => (isToReview ? r.status === 'toReview' : r.status !== 'toReview'))

  return (
    <>
      <NavBar
        title={title}
        showTitle={scrolled}
        trailing={
          connected && (
            <button type="button" className="glass glass-btn" onClick={mailbox.reload} disabled={loading} aria-label="Vernieuwen">
              {loading ? <Spinner /> : <Icon name="refresh" size={21} />}
            </button>
          )
        }
      />
      {pull > 0 && (
        <div className="pull" style={{ opacity: pull }}>
          <Spinner spinning={pull >= 1} size={26} />
        </div>
      )}

      <main className="screen has-bar">
        <h1 className="large-title">{title}</h1>
        <p className="large-subtitle" role="status">
          {subtitle(tab, auth, mailbox, shown.length)}
        </p>

        <div className="content">
          {isToReview && <InstallHint />}

          {!connected && <ConnectCard auth={auth} />}

          {connected && mailbox.error && <MailboxError error={mailbox.error} onRetry={mailbox.reload} />}

          {connected && mailbox.status === 'ready' && shown.length === 0 && <EmptyList tab={tab} total={reports.length} />}

          {connected && shown.length > 0 && (
            <div className="group">
              {shown.map((r) => (
                <ReportRow key={r.id} report={r} onOpen={() => onOpen(r.id)} />
              ))}
            </div>
          )}

          <footer className="foot">
            {connected && mailbox.account && (
              <p>
                Verbonden met {mailbox.account} ·{' '}
                <button type="button" className="text-btn" onClick={auth.signOut}>
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
    </>
  )
}
