import { DetailsForm } from '../components/DetailsForm'
import { Icon } from '../components/Icon'
import { BackButton, NavBar, useScrolled } from '../components/NavBar'
import { ReportSections } from '../components/ReportSections'
import { StatusLabel } from '../components/ReportRow'
import { formatReceived, formatSize } from '../format'
import { usedValues, type Report } from '../report/report'
import type { ReportStore } from '../store/useReportStore'

type Props = {
  report: Report
  reports: Report[]
  store: ReportStore
  onBack: () => void
  onOpenTranscript: () => void
}

// Controlescherm: Gegevens bevestigen, verslag verbeteren, afronden of Niet bruikbaar
export function ReviewScreen({ report, reports, store, onBack, onOpenTranscript }: Props) {
  const scrolled = useScrolled()
  const editable = report.status === 'toReview'
  const turns = report.transcript.length

  function finish(status: 'done' | 'unusable') {
    store.setStatus(report.id, status)
    onBack()
  }

  return (
    <>
      <NavBar
        title={report.title}
        showTitle={scrolled}
        leading={<BackButton to={editable ? 'Te controleren' : 'Afgehandeld'} onClick={onBack} />}
      />

      <main className="screen has-bar">
        <h1 className="large-title">{report.title}</h1>
        <p className="large-subtitle">Ontvangen {formatReceived(report.receivedAt)}</p>

        <div className="content">
          {!editable && (
            <div className="group">
              <div className="row">
                <StatusLabel report={report} large />
              </div>
            </div>
          )}

          {!report.structured && (
            <div className="group">
              <div className="row notice-row">
                <Icon name="exclamationFill" size={22} className="notice-icon" />
                <span>De opbouw van deze mail wijkt af. De hele tekst staat hieronder als verslag; vul de Gegevens zelf in.</span>
              </div>
            </div>
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

          {turns > 0 && (
            <div className="group">
              <button type="button" className="row" onClick={onOpenTranscript}>
                <Icon name="doc" size={22} className="row-icon" />
                <span className="row-label">Transcript</span>
                <span className="row-value">{turns === 1 ? '1 beurt' : `${turns} beurten`}</span>
                <Icon name="chevronRight" size={14} className="row-chevron" />
              </button>
            </div>
          )}

          {report.attachments.length > 0 && (
            <>
              <div className="group-header">
                <span className="group-header-title">Bijlagen</span>
              </div>
              <div className="group">
                {report.attachments.map((a) => (
                  <div key={a.id} className="row">
                    <Icon name="paperclip" size={20} className="row-icon" />
                    <span className="row-label">{a.filename}</span>
                    <span className="row-value">{formatSize(a.size)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <div className="bottom-edge" aria-hidden="true" />
      <div className="toolbar">
        {editable ? (
          <>
            <button type="button" className="capsule-btn glass" onClick={() => finish('unusable')}>
              Niet bruikbaar
            </button>
            <button type="button" className="capsule-btn prominent" onClick={() => finish('done')}>
              <Icon name="checkmark" size={18} />
              Afronden
            </button>
          </>
        ) : (
          <button type="button" className="capsule-btn glass" onClick={() => store.setStatus(report.id, 'toReview')}>
            Terugzetten naar Te controleren
          </button>
        )}
      </div>
    </>
  )
}
