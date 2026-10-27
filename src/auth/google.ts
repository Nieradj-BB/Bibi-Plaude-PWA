import { GMAIL_SCOPE, GOOGLE_CLIENT_ID, REDIRECT_URI } from '../config'

// Google OAuth via redirect (impliciete flow): werkt zonder backend en, anders dan een pop-up,
// ook in een PWA op het beginscherm van de iPhone

const KEY = {
  token: 'google.token',
  expiresAt: 'google.expiresAt',
  email: 'google.email',
  state: 'google.oauthState',
  silentAt: 'google.silentAt',
}

// Stil opnieuw verbinden hooguit eens per vijf minuten, zodat een mislukte poging nooit blijft herhalen
const SILENT_RETRY_MS = 5 * 60_000
const EXPIRY_MARGIN_MS = 60_000

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Zonder opslag blijft de sessie alleen in deze pagina bestaan
  }
}

export type Session = { token: string; expiresAt: number }

export function currentSession(): Session | null {
  const token = read(KEY.token)
  const expiresAt = Number(read(KEY.expiresAt))
  if (!token || !expiresAt || Date.now() > expiresAt - EXPIRY_MARGIN_MS) return null
  return { token, expiresAt }
}

export function knownEmail() {
  return read(KEY.email)
}

export function rememberEmail(email: string) {
  write(KEY.email, email)
}

export function startSignIn(options: { silent?: boolean } = {}) {
  const state = crypto.randomUUID()
  write(KEY.state, state)

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: GMAIL_SCOPE,
    include_granted_scopes: 'true',
    state,
  })
  const email = knownEmail()
  if (email) params.set('login_hint', email)
  if (options.silent) {
    params.set('prompt', 'none')
    write(KEY.silentAt, String(Date.now()))
  }

  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}

export type RedirectResult =
  | { kind: 'none' }
  | { kind: 'signedIn' }
  | { kind: 'error'; error: string }

// Leest het antwoord van Google uit de URL en haalt het daarna weg, zodat het token niet in de geschiedenis blijft staan
export function consumeRedirect(): RedirectResult {
  const params = new URLSearchParams(window.location.hash.slice(1))
  if (!params.has('access_token') && !params.has('error')) return { kind: 'none' }

  history.replaceState(null, '', window.location.pathname + window.location.search)

  const expected = read(KEY.state)
  write(KEY.state, null)
  if (!expected || params.get('state') !== expected) return { kind: 'error', error: 'state_mismatch' }

  const error = params.get('error')
  if (error) return { kind: 'error', error }

  const expiresIn = Number(params.get('expires_in') ?? 3600)
  write(KEY.token, params.get('access_token'))
  write(KEY.expiresAt, String(Date.now() + expiresIn * 1000))
  return { kind: 'signedIn' }
}

export function maySignInSilently() {
  if (!knownEmail()) return false
  const lastAttempt = Number(read(KEY.silentAt))
  return !lastAttempt || Date.now() - lastAttempt > SILENT_RETRY_MS
}

export function forgetToken() {
  write(KEY.token, null)
  write(KEY.expiresAt, null)
}

export async function signOut() {
  const token = read(KEY.token)
  forgetToken()
  write(KEY.email, null)
  write(KEY.silentAt, null)
  if (!token) return
  try {
    await fetch('https://oauth2.googleapis.com/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token }),
    })
  } catch {
    // Het token verloopt binnen een uur vanzelf
  }
}
