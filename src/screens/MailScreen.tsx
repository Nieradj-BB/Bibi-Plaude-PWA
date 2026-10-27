import { Markdown } from '../components/Markdown'
import { Transcript } from '../components/Transcript'
import { formatReceived, formatSize } from '../format'
import type { MailMessage } from '../mail/types'
import { parsePlaudMail } from '../parser/plaudMail'

// Leesweergave van een verslag; bewerken en afronden volgen in het controlescherm (stap 4)
export function MailScreen({ message, onBack }: { message: MailMessage; onBack: () => void }) {
  const report = parsePlaudMail(message.subject, message.text)
  const empty = !report.summary && report.transcript.length === 0

  return (
    <div className="app">
      <nav className="nav-row">
        <button type="button" className="back" onClick={onBack}>
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4l-6 6 6 6" />
          </svg>
          Terug
        </button>
      </nav>

      <main className="screen">
        <header className="app-head compact">
          <h1 className="app-title small">{report.title}</h1>
          <p className="app-sub">{formatReceived(message.receivedAt)}</p>
        </header>

        <div className="app-body">
          {report.summary && (
            <section className="card">
              <div className="card-label">Verslag</div>
              <Markdown>{report.summary}</Markdown>
            </section>
          )}

          {report.transcript.length > 0 && <Transcript turns={report.transcript} />}

          {empty && (
            <section className="card">
              <div className="card-label">Inhoud</div>
              <p>Deze mail heeft geen tekst.</p>
            </section>
          )}

          {message.attachments.length > 0 && (
            <section className="card">
              <div className="card-label">Bijlagen</div>
              <ul className="attachments">
                {message.attachments.map((a) => (
                  <li key={a.id}>
                    <span>{a.filename}</span>
                    <span className="meta">
                      {a.mimeType} · {formatSize(a.size)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="notice">Bewerken en afronden komen in een volgende versie.</p>
        </div>
      </main>
    </div>
  )
}
