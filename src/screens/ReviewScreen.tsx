import { useEffect } from 'react'
import { DetailsForm } from '../components/DetailsForm'
import { ReportSections } from '../components/ReportSections'
import { Transcript } from '../components/Transcript'
import { formatReceived, formatSize } from '../format'
import { usedValues, type Report } from '../report/report'
import type { ReportStore } from '../store/useReportStore'

type Props = {
  report: Report
  reports: Report[]
  store: ReportStore
  onBack: () => void
}

// Controlescherm: Gegevens bevestigen, verslag verbeteren, afronden of Niet bruikbaar
export function ReviewScreen({ report, reports, store, onBack }: Props) {
  const editable = report.status === 'toReview'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [report.id])

  function finish(status: 'done' | 'unusable') {
    store.setStatus(report.id, status)
    onBack()
  }

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
          <p className="app-sub review-sub">
            Ontvangen {formatReceived(report.receivedAt)}
            {report.status === 'done' && <span className="chip ok">Afgerond</span>}
            {report.status === 'unusable' && <span className="chip muted">Niet bruikbaar</span>}
          </p>
        </header>

        <div className="app-body">
          {!report.structured && (
            <p className="notice">De opbouw van deze mail wijkt af. De hele tekst staat hieronder als verslag; vul de Gegevens zelf in.</p>
          )}

          <DetailsForm
            details={report.details}
            disabled={!editable}
            clients={usedValues(reports, 'client')}
            assignments={usedValues(reports, 'assignment')}
            onChange={(details) => store.setDetails(report.id, details)}
          />

          <ReportSections
            sections={report.sections}
            disabled={!editable}
            onChange={(index, body) => store.setSection(report.id, index, body)}
          />

          {report.transcript.length > 0 && <Transcript turns={report.transcript} />}

          {report.attachments.length > 0 && (
            <section className="card">
              <div className="card-label">Bijlagen</div>
              <ul className="attachments">
                {report.attachments.map((a) => (
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
        </div>
      </main>

      <div className="action-bar">
        {editable ? (
          <>
            <button type="button" className="btn ghost" onClick={() => finish('unusable')}>
              Niet bruikbaar
            </button>
            <button type="button" className="btn primary" onClick={() => finish('done')}>
              Afronden
            </button>
          </>
        ) : (
          <button type="button" className="btn ghost" onClick={() => store.setStatus(report.id, 'toReview')}>
            Terugzetten naar Te controleren
          </button>
        )}
      </div>
    </div>
  )
}
