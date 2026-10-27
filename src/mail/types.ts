// Mail zoals de rest van de app hem ziet, los van waar hij vandaan komt (Gmail nu, Microsoft Graph later)

export type MailAttachment = {
  id: string
  filename: string
  mimeType: string
  size: number
}

export type MailMessage = {
  id: string
  // Message-ID-header; dezelfde mail die twee keer binnenkomt, tonen we één keer
  messageId: string | null
  subject: string
  from: string
  receivedAt: string
  text: string
  html: string | null
  attachments: MailAttachment[]
}

export interface MailSource {
  listMessages(): Promise<MailMessage[]>
  account(): Promise<string>
}

export type MailErrorKind = 'unauthorized' | 'forbidden' | 'labelMissing' | 'network' | 'other'

export class MailError extends Error {
  readonly kind: MailErrorKind

  constructor(kind: MailErrorKind, message: string) {
    super(message)
    this.kind = kind
  }
}
