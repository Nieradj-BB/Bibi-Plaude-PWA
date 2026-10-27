export function charsetOf(contentType: string | undefined) {
  return contentType?.match(/charset="?([^";\s]+)"?/i)?.[1] ?? 'utf-8'
}

export function decodeBase64Url(data: string, charset = 'utf-8') {
  const binary = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  try {
    return new TextDecoder(charset).decode(bytes)
  } catch {
    return new TextDecoder('utf-8').decode(bytes)
  }
}

// Alleen tekst: de HTML van een mail wordt nooit als HTML in de app gezet
export function htmlToText(html: string) {
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|table|ul|ol|blockquote)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
  const doc = new DOMParser().parseFromString(withBreaks, 'text/html')
  doc.querySelectorAll('style, script, head').forEach((node) => node.remove())
  return (doc.body.textContent ?? '')
    .replace(/ /g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
