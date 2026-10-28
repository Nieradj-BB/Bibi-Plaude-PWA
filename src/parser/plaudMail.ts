// Zet de platte tekst van een Plaud-mail om in een verslag (Markdown) en een transcript (beurten per spreker)

export type TranscriptTurn = { speaker: string; text: string }

// Blok "## Gegevens" uit de Skill BB-gespreksverslag
export type ReportDetails = {
  conversationType: string
  subject: string
  client: string
  assignment: string
  participants: string
  date: string
  duration: string
}

export type PlaudReport = {
  title: string
  details: ReportDetails | null
  summary: string
  transcript: TranscriptTurn[]
}

const TRANSCRIPT_MARKER = /^#{0,6}\s*\**\s*(volledig\s+)?transcript\s*\**\s*:?$/i
const DETAILS_MARKER = /^#{1,6}\s*gegevens\s*:?$/i
const REPORT_HEADING = /^#{1,6}\s*verslag\s*:?\s*(\n|$)/i
const HEADING = /^#{1,6}\s/
const UNKNOWN = /^\[onbekend\]$/i

// "Type" is de oude naam van het veld in de Skill
const DETAIL_LABELS: Record<string, keyof ReportDetails> = {
  gesprekstype: 'conversationType',
  type: 'conversationType',
  onderwerp: 'subject',
  klant: 'client',
  opdracht: 'assignment',
  deelnemers: 'participants',
  datum: 'date',
  duur: 'duration',
}

export function emptyDetails(): ReportDetails {
  return { conversationType: '', subject: '', client: '', assignment: '', participants: '', date: '', duration: '' }
}

// Het blok loopt tot het volgende kopje; de rest van de mail gaat verder als verslag en transcript
function readDetails(lines: string[]) {
  const start = lines.findIndex((line) => DETAILS_MARKER.test(line.trim()))
  if (start < 0) return { details: null, rest: lines }

  let end = start + 1
  while (end < lines.length && !HEADING.test(lines[end].trim()) && !TRANSCRIPT_MARKER.test(lines[end].trim())) end++

  const details = emptyDetails()
  for (const line of lines.slice(start + 1, end)) {
    const plain = line.trim().replace(/^[-*]\s+/, '').replace(/\*\*/g, '')
    const match = plain.match(/^([^:]+):\s*(.*)$/)
    const key = match && DETAIL_LABELS[match[1].trim().toLowerCase()]
    if (!key) continue
    const value = match[2].trim()
    details[key] = UNKNOWN.test(value) ? '' : value
  }
  return { details, rest: [...lines.slice(0, start), ...lines.slice(end)] }
}

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

export type ReportSection = { title: string; body: string }

const SECTION_HEADING = /^#{1,3}\s+(.+?)\s*#*$/

// Onderdelen van het verslag (Samenvatting, Actiepunten, ...); tekst vóór het eerste kopje krijgt geen titel
export function splitSections(summary: string): ReportSection[] {
  const sections: { title: string; lines: string[] }[] = []
  for (const line of summary.split('\n')) {
    const heading = line.trim().match(SECTION_HEADING)
    if (heading) sections.push({ title: heading[1].replace(/\*\*/g, '').trim(), lines: [] })
    else if (sections.length > 0) sections[sections.length - 1].lines.push(line)
    else sections.push({ title: '', lines: [line] })
  }
  return sections
    .map((s) => ({ title: s.title, body: s.lines.join('\n').trim() }))
    .filter((s) => s.title || s.body)
}

export function displayTitle(subject: string) {
  const title = subject
    .replace(/^\s*plaud-verslag\s*\|\s*/i, '')
    .replace(/^\d{1,2}-\d{1,2}\s+/, '')
    .trim()
  return title || subject
}

export function parsePlaudMail(subject: string, text: string): PlaudReport {
  const { details, rest: lines } = readDetails(text.replace(/\r\n?/g, '\n').split('\n'))
  const marker = lines.findIndex((line) => TRANSCRIPT_MARKER.test(line.trim()))

  const summaryEnd = marker >= 0 ? marker : transcriptStart(lines)
  const transcriptLines = marker >= 0 ? lines.slice(marker + 1) : lines.slice(summaryEnd)

  return {
    title: displayTitle(subject),
    details,
    // Het kopje "## Verslag" van de Skill staat al op het scherm
    summary: lines.slice(0, summaryEnd).join('\n').trim().replace(REPORT_HEADING, '').trim(),
    transcript: toTurns(transcriptLines),
  }
}
