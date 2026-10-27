const time = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' })
const dayMonth = new Intl.DateTimeFormat('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

// "vandaag 14:05", "gisteren 10:20" of "di 27 okt 14:05"
export function formatReceived(iso: string) {
  const date = new Date(iso)
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)
  const day = days === 0 ? 'vandaag' : days === 1 ? 'gisteren' : dayMonth.format(date).replace('.', '')
  return `${day} ${time.format(date)}`
}

// "Plaud <noreply@plaud.ai>" wordt "Plaud"
export function senderName(from: string) {
  const name = from.replace(/<[^>]*>/, '').replace(/"/g, '').trim()
  return name || from
}

export function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} kB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
