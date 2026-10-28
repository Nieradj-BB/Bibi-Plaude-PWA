import { useMemo, useState } from 'react'
import { useGoogleAuth } from './auth/useGoogleAuth'
import { TabBar, type Tab } from './components/TabBar'
import { useMailbox } from './mail/useMailbox'
import { useStackNavigation } from './navigation/useStackNavigation'
import { applyEdits, readMail } from './report/report'
import { ListScreen } from './screens/ListScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { TranscriptScreen } from './screens/TranscriptScreen'
import { useReportStore } from './store/useReportStore'

export function App() {
  const auth = useGoogleAuth()
  const mailbox = useMailbox(auth.session?.token ?? null, auth.expire)
  const store = useReportStore()
  const nav = useStackNavigation()
  const [tab, setTab] = useState<Tab>('toReview')

  // Uitlezen alleen als er nieuwe mails zijn; bewerkingen komen er bij elke wijziging overheen
  const mailReports = useMemo(() => mailbox.messages.map(readMail), [mailbox.messages])
  const reports = useMemo(() => mailReports.map((m) => applyEdits(m, store.edits[m.id])), [mailReports, store.edits])

  const route = nav.route
  // Een verslag dat (nog) niet geladen is, bijvoorbeeld na opnieuw verbinden, valt terug op de lijst
  const report = route.screen === 'list' ? undefined : reports.find((r) => r.id === route.id)

  if (route.screen === 'review' && report) {
    return (
      <ReviewScreen
        report={report}
        reports={reports}
        store={store}
        onBack={nav.back}
        onOpenTranscript={() => nav.push({ screen: 'transcript', id: report.id })}
      />
    )
  }
  if (route.screen === 'transcript' && report) return <TranscriptScreen report={report} onBack={nav.back} />

  return (
    <>
      <ListScreen tab={tab} auth={auth} mailbox={mailbox} reports={reports} onOpen={(id) => nav.push({ screen: 'review', id })} />
      <div className="bottom-edge" aria-hidden="true" />
      <TabBar active={tab} toReviewCount={reports.filter((r) => r.status === 'toReview').length} onChange={setTab} />
    </>
  )
}
