// Zet de platte tekst van een Plaud-mail om in een verslag (Markdown) en een transcript (beurten per spreker)

export type TranscriptTurn = { speaker: string; text: string }

export type PlaudReport = {
  title: string
  summary: string
  transcript: TranscriptTurn[]
}

const TRANSCRIPT_MARKER = /^#{0,6}\s*\**\s*(volledig\s+)?transcript\s*\**\s*:?$/i

// "Speaker 1: tekst" of "Mirjam Smit: tekst"; geen opsomming, kopje of vetgedrukte tekst
const SPEAKER_LINE = /^([^\s\-*#>|`][^:\n]{0,40}?):\s+(\S.*)$/
const MAX_NAME_WORDS = 4

function speakerLine(line: string): TranscriptTurn | null {
  const match = line.match(SPEAKER_LINE)
  if (!match) return null
  const name = match[1].trim()
  if (name.split(/\s+/).length > MAX_NAME_WORDS || /^\d+[.)]/.test(name)) return null
  return { speaker: name, text: match[2].trim() }
}

function toTurns(lines: string[]) {
  const turns: TranscriptTurn[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const turn = speakerLine(line)
    if (turn) turns.push(turn)
    else if (turns.length > 0) turns[turns.length - 1].text += ` ${line}`
    else turns.push({ speaker: '', text: line })
  }
  return turns
}

// Zonder kopje begint het transcript bij het blok sprekersregels waarmee de mail eindigt
function transcriptStart(lines: string[]) {
  let start = lines.length
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim()
    if (!line) continue
    if (!speakerLine(line)) break
    start = i
  }
  return start
}

export function displayTitle(subject: string) {
  const title = subject
    .replace(/^\s*plaud-verslag\s*\|\s*/i, '')
    .replace(/^\d{1,2}-\d{1,2}\s+/, '')
    .trim()
  return title || subject
}

export function parsePlaudMail(subject: string, text: string): PlaudReport {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  const marker = lines.findIndex((line) => TRANSCRIPT_MARKER.test(line.trim()))

  const summaryEnd = marker >= 0 ? marker : transcriptStart(lines)
  const transcriptLines = marker >= 0 ? lines.slice(marker + 1) : lines.slice(summaryEnd)

  return {
    title: displayTitle(subject),
    summary: lines.slice(0, summaryEnd).join('\n').trim(),
    transcript: toTurns(transcriptLines),
  }
}
