import { MAIL_LABEL } from '../config'
import { charsetOf, decodeBase64Url, htmlToText } from './mimeText'
import { MailError, type MailAttachment, type MailMessage, type MailSource } from './types'

const API = 'https://gmail.googleapis.com/gmail/v1/users/me'
const MAX_MESSAGES = 50
const PARALLEL_REQUESTS = 8

type GmailHeader = { name: string; value: string }

type GmailPart = {
  mimeType: string
  filename?: string
  headers?: GmailHeader[]
  body?: { size: number; data?: string; attachmentId?: string }
  parts?: GmailPart[]
}

type GmailMessage = {
  id: string
  internalDate: string
  payload: GmailPart
}

async function call<T>(token: string, path: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  } catch {
    throw new MailError('network', 'Geen verbinding met Gmail. Controleer je internet en probeer het opnieuw.')
  }
  if (response.status === 401) throw new MailError('unauthorized', 'Je sessie bij Google is verlopen.')
  if (response.status === 403) {
    throw new MailError(
      'forbidden',
      'Verslagen mag je Gmail niet lezen. Log opnieuw in en vink de toestemming om je e-mail te bekijken aan.',
    )
  }
  if (!response.ok) throw new MailError('other', `Gmail gaf een fout (${response.status}). Probeer het later opnieuw.`)
  return response.json() as Promise<T>
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

function header(part: GmailPart, name: string) {
  return part.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? null
}

function toMailMessage(message: GmailMessage): MailMessage {
  let plain: string | null = null
  let html: string | null = null
  const attachments: MailAttachment[] = []

  const walk = (part: GmailPart) => {
    if (part.filename && part.body?.attachmentId) {
      attachments.push({
        id: part.body.attachmentId,
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size,
      })
    } else if (part.body?.data && part.mimeType === 'text/plain' && plain === null) {
      plain = decodeBase64Url(part.body.data, charsetOf(header(part, 'Content-Type') ?? undefined))
    } else if (part.body?.data && part.mimeType === 'text/html' && html === null) {
      html = decodeBase64Url(part.body.data, charsetOf(header(part, 'Content-Type') ?? undefined))
    }
    part.parts?.forEach(walk)
  }
  walk(message.payload)

  return {
    id: message.id,
    messageId: header(message.payload, 'Message-ID'),
    subject: header(message.payload, 'Subject') ?? '(geen onderwerp)',
    from: header(message.payload, 'From') ?? '',
    receivedAt: new Date(Number(message.internalDate)).toISOString(),
    text: plain ?? (html ? htmlToText(html) : ''),
    html,
    attachments,
  }
}

function dedupe(messages: MailMessage[]) {
  const seen = new Set<string>()
  return messages.filter((m) => {
    const key = m.messageId ?? m.id
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function createGmailSource(token: string): MailSource {
  return {
    async account() {
      const profile = await call<{ emailAddress: string }>(token, '/profile')
      return profile.emailAddress
    },

    async listMessages() {
      const { labels } = await call<{ labels: { id: string; name: string }[] }>(token, '/labels')
      const label = labels.find((l) => l.name.toLowerCase() === MAIL_LABEL.toLowerCase())
      if (!label) {
        throw new MailError('labelMissing', `Er is nog geen label ${MAIL_LABEL} in je Gmail.`)
      }

      const list = await call<{ messages?: { id: string }[] }>(
        token,
        `/messages?labelIds=${encodeURIComponent(label.id)}&maxResults=${MAX_MESSAGES}`,
      )
      const ids = (list.messages ?? []).map((m) => m.id)
      const full = await mapLimit(ids, PARALLEL_REQUESTS, (id) =>
        call<GmailMessage>(token, `/messages/${id}?format=full`),
      )

      return dedupe(full.map(toMailMessage)).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    },
  }
}
