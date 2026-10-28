import type { ChangeEvent } from 'react'
import type { ReportDetails } from '../parser/plaudMail'
import { CONVERSATION_TYPES } from '../report/report'
import { Icon } from './Icon'

type Props = {
  details: ReportDetails
  disabled: boolean
  clients: string[]
  assignments: string[]
  onChange: (details: ReportDetails) => void
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// Het blok Gegevens als iOS-formulier: label links, waarde rechts; lege velden tonen "Onbekend" in oranje
export function DetailsForm({ details, disabled, clients, assignments, onChange }: Props) {
  const set = (key: keyof ReportDetails) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...details, [key]: e.target.value })
  const missing = (key: keyof ReportDetails) => (details[key].trim() ? '' : ' missing')

  // Een gesprekstype buiten de lijst van de Skill blijft kiesbaar, zodat het niet stilletjes verdwijnt
  const types =
    !details.conversationType || CONVERSATION_TYPES.includes(details.conversationType)
      ? CONVERSATION_TYPES
      : [details.conversationType, ...CONVERSATION_TYPES]

  return (
    <>
      <h2 className="section-heading">Gegevens</h2>
      <fieldset className="group" disabled={disabled}>
        <label className="row field-row picker-row">
          <span className="field-label">Gesprekstype</span>
          <span className={`field-value${missing('conversationType')}`}>{details.conversationType || 'Onbekend'}</span>
          <Icon name="chevronUpDown" size={15} className="picker-chevron" />
          <select className="overlay-select" value={details.conversationType} onChange={set('conversationType')} aria-label="Gesprekstype">
            <option value="">Onbekend</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="row field-row">
          <span className="field-label">Onderwerp</span>
          <input type="text" className={`field-input${missing('subject')}`} value={details.subject} onChange={set('subject')} placeholder="Onbekend" />
        </label>

        <label className="row field-row">
          <span className="field-label">Klant</span>
          <input
            type="text"
            list="known-clients"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={`field-input${missing('client')}`}
            value={details.client}
            onChange={set('client')}
            placeholder="Onbekend"
          />
        </label>

        <label className="row field-row">
          <span className="field-label">Opdracht</span>
          <input
            type="text"
            list="known-assignments"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={`field-input${missing('assignment')}`}
            value={details.assignment}
            onChange={set('assignment')}
            placeholder="Onbekend"
          />
        </label>

        <label className="row field-row stacked">
          <span className="field-label">Deelnemers</span>
          <textarea
            rows={2}
            autoCorrect="off"
            spellCheck={false}
            className={`field-input${missing('participants')}`}
            value={details.participants}
            onChange={set('participants')}
            placeholder="Onbekend"
          />
        </label>

        <label className="row field-row">
          <span className="field-label">Datum</span>
          <input
            type={!details.date || ISO_DATE.test(details.date) ? 'date' : 'text'}
            className={`date-pill${missing('date')}`}
            value={details.date}
            onChange={set('date')}
            aria-label="Datum"
          />
        </label>

        <label className="row field-row">
          <span className="field-label">Duur</span>
          <input type="text" className={`field-input${missing('duration')}`} value={details.duration} onChange={set('duration')} placeholder="Onbekend" />
        </label>
      </fieldset>
      {!disabled && <p className="group-footer">Velden met Onbekend in oranje heeft Plaud niet kunnen invullen.</p>}

      <datalist id="known-clients">
        {clients.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <datalist id="known-assignments">
        {assignments.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
    </>
  )
}
