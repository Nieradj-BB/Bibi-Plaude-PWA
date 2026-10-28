import { useState } from 'react'

const DISMISS_KEY = 'installHintDismissed'

function isInstalled() {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function InstallHint() {
  const [hidden, setHidden] = useState(() => isInstalled() || wasDismissed())
  if (hidden) return null

  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent)

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Zonder opslag verdwijnt de tip alleen voor deze sessie
    }
    setHidden(true)
  }

  return (
    <section className="group" aria-label="App installeren">
      <div className="cell-text hint">
        <strong>Zet Verslagen op je beginscherm</strong>
        <p>
          {isIos
            ? 'Tik in Safari op Delen en kies Zet op beginscherm. Dan opent Verslagen als een gewone app.'
            : 'Open het menu van je browser en kies Installeren of Toevoegen aan startscherm.'}
        </p>
      </div>
      <button type="button" className="row text-row" onClick={dismiss}>
        Niet meer tonen
      </button>
    </section>
  )
}
