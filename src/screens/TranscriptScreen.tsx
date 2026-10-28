import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { BackButton, NavBar, useScrolled } from '../components/NavBar'
import type { Report } from '../report/report'

const SPEAKER_COLORS = 4

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return text
  return text
    .split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
    .map((part, i) => (part.toLowerCase() === query ? <mark key={i}>{part}</mark> : part))
}

// Transcript om na te slaan, met een zoekbalk om een naam of bedrag terug te vinden
export function TranscriptScreen({ report, onBack }: { report: Report; onBack: () => void }) {
  const scrolled = useScrolled()
  const [query, setQuery] = useState('')
  const turns = report.transcript
  const speakers = [...new Set(turns.map((t) => t.speaker))]
  const colorOf = (speaker: string) => `speaker-${speakers.indexOf(speaker) % SPEAKER_COLORS}`

  const q = query.trim().toLowerCase()
  const shown = q ? turns.filter((t) => t.text.toLowerCase().includes(q) || t.speaker.toLowerCase().includes(q)) : turns

  return (
    <>
      <NavBar title="Transcript" showTitle={scrolled} leading={<BackButton to="het verslag" onClick={onBack} />} />

      <main className="screen">
        <h1 className="large-title">Transcript</h1>
        <p className="large-subtitle">{report.title}</p>

        <div className="content">
          <div className="search-field">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek in het transcript"
              aria-label="Zoek in het transcript"
              enterKeyHint="search"
              autoCorrect="off"
              spellCheck={false}
            />
            {query && (
              <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Wis zoekopdracht">
                <Icon name="xmarkCircleFill" size={18} />
              </button>
            )}
          </div>
          {q && (
            <p className="group-footer" role="status">
              {shown.length === 1 ? '1 beurt gevonden' : `${shown.length} beurten gevonden`}
            </p>
          )}

          {shown.length === 0 ? (
            <EmptyState icon={<Icon name="search" size={48} />} title="Geen resultaten" text={`Niets gevonden voor "${query.trim()}".`} />
          ) : (
            <div className="group">
              {shown.map((turn, i) => (
                <div key={i} className={`row turn ${colorOf(turn.speaker)}`}>
                  {turn.speaker && <span className="speaker">{turn.speaker}</span>}
                  <p>
                    <Highlight text={turn.text} query={q} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
