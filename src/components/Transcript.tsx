import { useState } from 'react'
import type { TranscriptTurn } from '../parser/plaudMail'

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

// Transcript om na te slaan: ingeklapt, met zoeken om een naam of bedrag terug te vinden
export function Transcript({ turns }: { turns: TranscriptTurn[] }) {
  const [query, setQuery] = useState('')
  const speakers = [...new Set(turns.map((t) => t.speaker))]
  const colorOf = (speaker: string) => `speaker-${speakers.indexOf(speaker) % SPEAKER_COLORS}`

  const q = query.trim().toLowerCase()
  const shown = q ? turns.filter((t) => t.text.toLowerCase().includes(q) || t.speaker.toLowerCase().includes(q)) : turns

  return (
    <details className="card transcript">
      <summary>
        <span>
          <strong>Transcript</strong>
          <span className="meta">
            {turns.length === 1 ? '1 beurt' : `${turns.length} beurten`} · {speakers.filter(Boolean).join(', ') || 'onbekende spreker'}
          </span>
        </span>
        <svg className="chevron" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8l4 4 4-4" />
        </svg>
      </summary>
      <input
        type="search"
        className="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zoek in het transcript"
        aria-label="Zoek in het transcript"
      />
      {q && <p className="meta search-count">{shown.length === 1 ? '1 beurt gevonden' : `${shown.length} beurten gevonden`}</p>}
      <ol className="turns">
        {shown.map((turn, i) => (
          <li key={i} className={colorOf(turn.speaker)}>
            {turn.speaker && <span className="speaker">{turn.speaker}</span>}
            <p>
              <Highlight text={turn.text} query={q} />
            </p>
          </li>
        ))}
      </ol>
    </details>
  )
}
