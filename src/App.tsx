import { useState } from 'react'
import { useGoogleAuth } from './auth/useGoogleAuth'
import { TabBar, type Tab } from './components/TabBar'
import { useMailbox } from './mail/useMailbox'
import { ListScreen } from './screens/ListScreen'
import { MailScreen } from './screens/MailScreen'

export function App() {
  const auth = useGoogleAuth()
  const mailbox = useMailbox(auth.session?.token ?? null, auth.expire)
  const [tab, setTab] = useState<Tab>('open')
  const [openId, setOpenId] = useState<string | null>(null)

  const opened = mailbox.messages.find((m) => m.id === openId)
  if (opened) return <MailScreen message={opened} onBack={() => setOpenId(null)} />

  return (
    <div className="app">
      <ListScreen tab={tab} auth={auth} mailbox={mailbox} onOpen={setOpenId} />
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
