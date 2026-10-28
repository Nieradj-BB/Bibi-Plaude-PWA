import { useMemo, useState } from 'react'
import { useGoogleAuth } from './auth/useGoogleAuth'
import { TabBar, type Tab } from './components/TabBar'
import { useMailbox } from './mail/useMailbox'
import { applyEdits, readMail } from './report/report'
import { ListScreen } from './screens/ListScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { useReportStore } from './store/useReportStore'

export function App() {
  const auth = useGoogleAuth()
  const mailbox = useMailbox(auth.session?.token ?? null, auth.expire)
  const store = useReportStore()
  const [tab, setTab] = useState<Tab>('toReview')
  const [openId, setOpenId] = useState<string | null>(null)

  // Uitlezen alleen als er nieuwe mails zijn; bewerkingen komen er bij elke wijziging overheen
  const mailReports = useMemo(() => mailbox.messages.map(readMail), [mailbox.messages])
  const reports = useMemo(() => mailReports.map((m) => applyEdits(m, store.edits[m.id])), [mailReports, store.edits])

  const opened = reports.find((r) => r.id === openId)
  if (opened) return <ReviewScreen report={opened} reports={reports} store={store} onBack={() => setOpenId(null)} />

  return (
    <div className="app">
      <ListScreen tab={tab} auth={auth} mailbox={mailbox} reports={reports} onOpen={setOpenId} />
      <TabBar active={tab} toReviewCount={reports.filter((r) => r.status === 'toReview').length} onChange={setTab} />
    </div>
  )
}
