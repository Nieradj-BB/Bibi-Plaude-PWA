import type { ChangeEvent } from 'react'
import type { ReportDetails } from '../parser/plaudMail'
import { CONVERSATION_TYPES } from '../report/report'

type Props = {
  details: ReportDetails
  disabled: boolean
  clients: string[]
  assignments: string[]
  onChange: (details: ReportDetails) => void
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// Het blok Gegevens, voorgevuld uit de Plaud-mail; lege velden vallen op
export function DetailsForm({ details, disabled, clients, assignments, onChange }: Props) {
  const set = (key: keyof ReportDetails) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...details, [key]: e.target.value })
  const missing = (key: keyof ReportDetails) => (details[key].trim() ? undefined : 'missing')

  // Een gesprekstype buiten de lijst van de Skill blijft kiesbaar, zodat het niet stilletjes verdwijnt
  const types =
    !details.conversationType || CONVERSATION_TYPES.includes(details.conversationType)
      ? CONVERSATION_TYPES
      : [details.conversationType, ...CONVERSATION_TYPES]

  return (
    <section className="card">
      <div className="card-label">Gegevens</div>
      <fieldset className="details" disabled={disabled}>
        <label className="field">
          <span>Gesprekstype</span>
          <select className={missing('conversationType')} value={details.conversationType} onChange={set('conversationType')}>
            <option value="">Onbekend</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Onderwerp</span>
          <input type="text" className={missing('subject')} value={details.subject} onChange={set('subject')} placeholder="Onbekend" />
        </label>

        <label className="field">
          <span>Klant</span>
          <input
            type="text"
            list="known-clients"
            autoComplete="off"
            className={missing('client')}
            value={details.client}
            onChange={set('client')}
            placeholder="Onbekend"
          />
        </label>
        <datalist id="known-clients">
          {clients.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <label className="field">
          <span>Opdracht</span>
          <input
            type="text"
            list="known-assignments"
            autoComplete="off"
            className={missing('assignment')}
            value={details.assignment}
            onChange={set('assignment')}
            placeholder="Onbekend"
          />
        </label>
        <datalist id="known-assignments">
          {assignments.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>

        <label className="field">
          <span>Deelnemers</span>
          <textarea rows={2} className={missing('participants')} value={details.participants} onChange={set('participants')} placeholder="Onbekend" />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Datum</span>
            <input
              type={!details.date || ISO_DATE.test(details.date) ? 'date' : 'text'}
              className={missing('date')}
              value={details.date}
              onChange={set('date')}
              placeholder="Onbekend"
            />
          </label>
          <label className="field">
            <span>Duur</span>
            <input type="text" className={missing('duration')} value={details.duration} onChange={set('duration')} placeholder="Onbekend" />
          </label>
        </div>
      </fieldset>
    </section>
  )
}
