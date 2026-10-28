import { useCallback, useEffect, useState } from 'react'
import { DEMO } from '../mail/demo'
import {
  consumeRedirect,
  currentSession,
  forgetToken,
  maySignInSilently,
  signOut,
  startSignIn,
  type Session,
} from './google'

// Eén keer bij het laden van de app, buiten React, zodat StrictMode het antwoord niet twee keer leest
const redirect = consumeRedirect()

export type GoogleAuth = {
  session: Session | null
  renewing: boolean
  error: string | null
  signIn: () => void
  signOut: () => Promise<void>
  expire: () => void
}

export function useGoogleAuth(): GoogleAuth {
  const [session, setSession] = useState(() => (DEMO ? { token: 'demo', expiresAt: Infinity } : currentSession()))
  const error = redirect.kind === 'error' ? redirect.error : null

  // Verlopen sessie: stil opnieuw verbinden, tenzij Google net een fout gaf
  const renewing = !session && !error && maySignInSilently()

  useEffect(() => {
    if (renewing) startSignIn({ silent: true })
  }, [renewing])

  const expire = useCallback(() => {
    forgetToken()
    setSession(null)
  }, [])

  const doSignOut = useCallback(async () => {
    await signOut()
    setSession(null)
  }, [])

  return {
    session,
    renewing,
    error,
    signIn: () => startSignIn(),
    signOut: doSignOut,
    expire,
  }
}
