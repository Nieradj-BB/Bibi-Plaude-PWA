import { useCallback, useEffect, useState } from 'react'
import { knownEmail, rememberEmail } from '../auth/google'
import { createDemoSource, DEMO } from './demo'
import { createGmailSource } from './gmail'
import { MailError, type MailMessage } from './types'

export type Mailbox = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  messages: MailMessage[]
  error: MailError | null
  account: string | null
  reload: () => void
}

export function useMailbox(token: string | null, onUnauthorized: () => void): Mailbox {
  const [status, setStatus] = useState<Mailbox['status']>('idle')
  const [messages, setMessages] = useState<MailMessage[]>([])
  const [error, setError] = useState<MailError | null>(null)
  const [account, setAccount] = useState<string | null>(() => knownEmail())

  const load = useCallback(async () => {
    if (!token) {
      setMessages([])
      setStatus('idle')
      return
    }
    setStatus('loading')
    try {
      const source = import.meta.env.DEV && DEMO ? createDemoSource() : createGmailSource(token)
      setMessages(await source.listMessages())
      setError(null)
      setStatus('ready')
      if (!DEMO && !knownEmail()) {
        const email = await source.account()
        rememberEmail(email)
        setAccount(email)
      }
    } catch (e) {
      const mailError = e instanceof MailError ? e : new MailError('other', 'Er ging iets mis bij het ophalen van je mail.')
      setError(mailError)
      setStatus('error')
      if (mailError.kind === 'unauthorized') onUnauthorized()
    }
  }, [token, onUnauthorized])

  useEffect(() => {
    load()
  }, [load])

  // Opnieuw ophalen zodra de app weer op het scherm komt
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [load])

  return { status, messages, error, account, reload: load }
}
