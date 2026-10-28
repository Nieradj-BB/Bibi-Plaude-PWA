import { formatDetailsDate, formatReceived } from '../format'
import { hasMissingDetails, type Report } from '../report/report'

function StatusChip({ report }: { report: Report }) {
  if (report.status === 'done') return <span className="chip ok">Afgerond</span>
  if (report.status === 'unusable') return <span className="chip muted">Niet bruikbaar</span>
  if (hasMissingDetails(report.details)) return <span className="chip warn">Gegevens onvolledig</span>
  return null
}

export function ReportCard({ report, onOpen }: { report: Report; onOpen: () => void }) {
  const { details } = report
  const what = [details.client, details.conversationType].filter(Boolean).join(' · ')
  const when = [details.date ? formatDetailsDate(details.date) : formatReceived(report.receivedAt), details.duration]
    .filter(Boolean)
    .join(' · ')

  return (
    <button type="button" className="card report-card" onClick={onOpen}>
      <span className="report-card-top">
        <strong>{report.title}</strong>
        <StatusChip report={report} />
      </span>
      {what && <span className="report-card-what">{what}</span>}
      <span className="meta">{when}</span>
    </button>
  )
}
