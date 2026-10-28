import { formatListDate, parseDetailsDate } from '../format'
import { hasMissingDetails, type Report } from '../report/report'
import { Icon } from './Icon'

// Status als tekst met icoon, zodat hij niet alleen aan de kleur te zien is
export function StatusLabel({ report, large = false }: { report: Report; large?: boolean }) {
  const size = large ? 22 : 15
  const className = large ? ' large' : ''
  if (report.status === 'done') {
    return (
      <span className={`status ok${className}`}>
        <Icon name="checkCircleFill" size={size} />
        Afgerond
      </span>
    )
  }
  if (report.status === 'unusable') {
    return (
      <span className={`status muted${className}`}>
        <Icon name="minusCircleFill" size={size} />
        Niet bruikbaar
      </span>
    )
  }
  if (hasMissingDetails(report.details)) {
    return (
      <span className={`status warn${className}`}>
        <Icon name="exclamationFill" size={size} />
        Gegevens onvolledig
      </span>
    )
  }
  return null
}

// Rij in de werkbak, zoals een mail in de lijst van Mail
export function ReportRow({ report, onOpen }: { report: Report; onOpen: () => void }) {
  const { details } = report
  const conversationDate = parseDetailsDate(details.date)
  const when = conversationDate ? formatListDate(conversationDate, false) : formatListDate(new Date(report.receivedAt), true)
  const about = [details.client, details.conversationType, details.duration].filter(Boolean).join(' · ')

  return (
    <button type="button" className="row report-row" onClick={onOpen}>
      <span className="report-row-main">
        <span className="report-row-top">
          <span className="report-row-title">{report.title}</span>
          <span className="report-row-date">{when}</span>
        </span>
        {about && <span className="report-row-sub">{about}</span>}
        <StatusLabel report={report} />
      </span>
      <Icon name="chevronRight" size={14} className="row-chevron" />
    </button>
  )
}
