// De client-ID is niet geheim; hij hoort bij het Google Cloud-project "Verslagen PWA"
export const GOOGLE_CLIENT_ID = '36238168741-m9t52lnidnbrpgu7ajk3tkp1t6bud1ua.apps.googleusercontent.com'
export const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'

// Gmail-label waarin een filter de AutoFlow-mails zet
export const MAIL_LABEL = 'BB-Plaud'

// Moet exact overeenkomen met een omleidings-URI van de OAuth-client
export const REDIRECT_URI = new URL(import.meta.env.BASE_URL, window.location.origin).href
