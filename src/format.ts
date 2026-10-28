const time = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' })
const dayMonth = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
const weekday = new Intl.DateTimeFormat('nl-NL', { weekday: 'long' })
const shortDate = new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: '2-digit' })

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function daysAgo(date: Date) {
  return Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)
}

// "vandaag 14:05", "gisteren 10:20" of "di 27 okt 14:05"
export function formatReceived(iso: string) {
  const date = new Date(iso)
  const days = daysAgo(date)
  const day = days === 0 ? 'vandaag' : days === 1 ? 'gisteren' : dayMonth.format(date).replace('.', '')
  return `${day} ${time.format(date)}`
}

// Zoals Mail in iOS: de tijd van vandaag, "gisteren", de dag van deze week of een korte datum
export function formatListDate(date: Date, withTime: boolean) {
  const days = daysAgo(date)
  if (days === 0) return withTime ? time.format(date) : 'vandaag'
  if (days === 1) return 'gisteren'
  if (days > 1 && days < 7) return weekday.format(date)
  return shortDate.format(date)
}

// Datum uit Gegevens ("2026-10-27"); een andere schrijfwijze is geen bruikbare datum
export function parseDetailsDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} kB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
