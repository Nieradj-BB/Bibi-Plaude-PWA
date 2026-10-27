import type { TranscriptTurn } from '../parser/plaudMail'

const SPEAKER_COLORS = 4

export function Transcript({ turns }: { turns: TranscriptTurn[] }) {
  const speakers = [...new Set(turns.map((t) => t.speaker))]
  const colorOf = (speaker: string) => `speaker-${speakers.indexOf(speaker) % SPEAKER_COLORS}`

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
      <ol className="turns">
        {turns.map((turn, i) => (
          <li key={i} className={colorOf(turn.speaker)}>
            {turn.speaker && <span className="speaker">{turn.speaker}</span>}
            <p>{turn.text}</p>
          </li>
        ))}
      </ol>
    </details>
  )
}
