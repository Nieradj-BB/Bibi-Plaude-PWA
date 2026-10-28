import { useState } from 'react'
import type { Report } from '../report/report'
import { EditSheet } from './EditSheet'
import { Markdown } from './Markdown'

type Props = {
  sections: Report['sections']
  disabled: boolean
  onChange: (index: number, body: string) => void
}

// Het verslag per onderdeel, elk als eigen groep; Wijzig opent het onderdeel in een blad
export function ReportSections({ sections, disabled, onChange }: Props) {
  const [editing, setEditing] = useState<number | null>(null)
  const current = editing === null ? undefined : sections[editing]

  return (
    <>
      <h2 className="section-heading">Verslag</h2>

      {sections.length === 0 && (
        <div className="group">
          <p className="cell-text placeholder">Deze mail heeft geen tekst.</p>
        </div>
      )}

      {sections.map((section, i) => {
        const title = section.title || 'Tekst'
        return (
          <section key={i} aria-label={title}>
            <div className="group-header">
              <span className="group-header-title">
                {title}
                {section.edited && ' · Aangepast'}
              </span>
              {!disabled && (
                <button type="button" className="header-btn" onClick={() => setEditing(i)} aria-label={`Wijzig ${title}`}>
                  Wijzig
                </button>
              )}
            </div>
            <div className="group cell-text">{section.body ? <Markdown>{section.body}</Markdown> : <p className="placeholder">Leeg</p>}</div>
          </section>
        )
      })}

      {current && editing !== null && (
        <EditSheet
          key={editing}
          title={current.title || 'Tekst'}
          initial={current.body}
          onCancel={() => setEditing(null)}
          onDone={(text) => {
            if (text !== current.body) onChange(editing, text)
            setEditing(null)
          }}
        />
      )}
    </>
  )
}
