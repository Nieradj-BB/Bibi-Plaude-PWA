// Status en bewerkingen per verslag, alleen lokaal op dit toestel (zie docs/adr/0001)

import { useCallback, useEffect, useState } from 'react'
import type { ReportDetails } from '../parser/plaudMail'
import type { ReportEdits, ReportStatus } from '../report/report'

const STORAGE_KEY = 'reportEdits.v1'

type AllEdits = Record<string, ReportEdits>

function load(): AllEdits {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as AllEdits
  } catch {
    return {}
  }
}

export type ReportStore = {
  edits: AllEdits
  setStatus: (id: string, status: ReportStatus) => void
  setDetails: (id: string, details: ReportDetails) => void
  setSection: (id: string, index: number, body: string) => void
}

export function useReportStore(): ReportStore {
  const [edits, setEdits] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(edits))
    } catch {
      // Zonder opslag gaan de bewerkingen verloren bij het sluiten van de app
    }
  }, [edits])

  const update = useCallback((id: string, change: (current: ReportEdits) => ReportEdits) => {
    setEdits((all) => ({ ...all, [id]: change(all[id] ?? { status: 'toReview' }) }))
  }, [])

  return {
    edits,
    setStatus: useCallback((id, status) => update(id, (c) => ({ ...c, status })), [update]),
    setDetails: useCallback((id, details) => update(id, (c) => ({ ...c, details })), [update]),
    setSection: useCallback(
      (id, index, body) => update(id, (c) => ({ ...c, sections: { ...c.sections, [index]: body } })),
      [update],
    ),
  }
}
