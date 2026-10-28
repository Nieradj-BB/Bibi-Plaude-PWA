import { useState } from 'react'
import type { Report } from '../report/report'
import { Markdown } from './Markdown'

type Section = Report['sections'][number]

type Props = {
  sections: Report['sections']
  disabled: boolean
  onChange: (index: number, body: string) => void
}

// Tekstvak groeit mee met de tekst, zodat je op de telefoon niet in een klein vak scrolt
function rowsFor(text: string) {
  const lines = text.split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / 40)), 0)
  return Math.min(Math.max(lines + 1, 4), 24)
}

function SectionBlock({ section, disabled, onChange }: { section: Section; disabled: boolean; onChange: (body: string) => void }) {
  const [editing, setEditing] = useState(false)
  const isEditing = editing && !disabled

  return (
    <div className="section">
      <div className="section-head">
        {section.title ? <h3>{section.title}</h3> : <span className="section-untitled" />}
        {section.edited && <span className="chip ready">Aangepast</span>}
        {!disabled && (
          <button type="button" className="link-btn" onClick={() => setEditing(!editing)}>
            {isEditing ? 'Klaar' : 'Bewerken'}
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea
          className="section-edit"
          value={section.body}
          rows={rowsFor(section.body)}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${section.title || 'Verslag'} bewerken`}
          autoFocus
        />
      ) : section.body ? (
        <Markdown>{section.body}</Markdown>
      ) : (
        <p className="meta">Leeg</p>
      )}
    </div>
  )
}

// Het verslag per onderdeel; elk onderdeel bewerk je apart
export function ReportSections({ sections, disabled, onChange }: Props) {
  return (
    <section className="card">
      <div className="card-label">Verslag</div>
      {sections.length === 0 && <p>Deze mail heeft geen tekst.</p>}
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} disabled={disabled} onChange={(body) => onChange(i, body)} />
      ))}
    </section>
  )
}
