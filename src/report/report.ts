// Een verslag zoals de app het toont: de uitgelezen Plaud-mail met de bewerkingen van de collega eroverheen

import type { MailAttachment, MailMessage } from '../mail/types'
import {
  emptyDetails,
  parsePlaudMail,
  splitSections,
  type ReportDetails,
  type ReportSection,
  type TranscriptTurn,
} from '../parser/plaudMail'

export type ReportStatus = 'toReview' | 'done' | 'unusable'

// Wat de collega heeft veranderd; zonder bewerkingen is een verslag Te controleren
export type ReportEdits = {
  status: ReportStatus
  details?: ReportDetails
  sections?: Record<number, string>
  // Gezet met Bewaar: de collega is begonnen, ook als er (nog) niets is gewijzigd
  saved?: boolean
}

// De mail uitgelezen, nog zonder bewerkingen
export type MailReport = {
  id: string
  receivedAt: string
  mailTitle: string
  details: ReportDetails | null
  sections: ReportSection[]
  transcript: TranscriptTurn[]
  attachments: MailAttachment[]
}

export type Report = {
  id: string
  receivedAt: string
  title: string
  // false als de mail niet de opbouw van de Skill heeft; dan is de hele tekst het verslag
  structured: boolean
  details: ReportDetails
  sections: (ReportSection & { edited: boolean })[]
  transcript: TranscriptTurn[]
  attachments: MailAttachment[]
  status: ReportStatus
  // Bezig: nog Te controleren, maar bewaard of al gewijzigd
  inProgress: boolean
}

export const CONVERSATION_TYPES = [
  'Commercieel gesprek',
  'Commerciële briefing',
  'Resultaatafspraakgesprek',
  'Intern overleg',
  'Dictaat',
  'Overig',
]

function canonicalType(value: string) {
  return CONVERSATION_TYPES.find((t) => t.toLowerCase() === value.trim().toLowerCase()) ?? value
}

export function readMail(mail: MailMessage): MailReport {
  const parsed = parsePlaudMail(mail.subject, mail.text)
  return {
    // De Message-ID blijft gelijk als de mailbron later Microsoft Graph wordt
    id: mail.messageId ?? mail.id,
    receivedAt: mail.receivedAt,
    mailTitle: parsed.title,
    details: parsed.details && { ...parsed.details, conversationType: canonicalType(parsed.details.conversationType) },
    sections: splitSections(parsed.summary),
    transcript: parsed.transcript,
    attachments: mail.attachments,
  }
}

export function applyEdits(mail: MailReport, edits: ReportEdits | undefined): Report {
  const details = edits?.details ?? mail.details ?? emptyDetails()
  return {
    id: mail.id,
    receivedAt: mail.receivedAt,
    title: details.subject || mail.mailTitle || 'Verslag zonder titel',
    structured: mail.details !== null,
    details,
    sections: mail.sections.map((section, i) => {
      const body = edits?.sections?.[i]
      return body === undefined ? { ...section, edited: false } : { ...section, body, edited: true }
    }),
    transcript: mail.transcript,
    attachments: mail.attachments,
    status: edits?.status ?? 'toReview',
    inProgress: (edits?.status ?? 'toReview') === 'toReview' && Boolean(edits?.saved || edits?.details || edits?.sections),
  }
}

// Een leeg veld in Gegevens betekent dat Plaud het niet wist ([Onbekend]) of dat het is leeggemaakt
export function hasMissingDetails(details: ReportDetails) {
  return Object.values(details).some((value) => !value.trim())
}

// Eerder gebruikte waarden, als suggesties bij het invullen
export function usedValues(reports: Report[], field: keyof ReportDetails) {
  const values = new Set(reports.map((r) => r.details[field].trim()).filter(Boolean))
  return [...values].sort((a, b) => a.localeCompare(b, 'nl'))
}
