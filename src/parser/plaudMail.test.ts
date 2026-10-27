import { describe, expect, it } from 'vitest'
import { displayTitle, parsePlaudMail } from './plaudMail'

// Verzonnen voorbeelden in de opbouw van een Plaud-mail; nooit echte mails in deze openbare repository

const withoutMarker = [
  '- **Vraag van de klant**: De gemeente zoekt een informatieanalist voor 32 uur.',
  '- **Planning**: Start per 1 januari.',
  '',
  '## Actiepunten',
  '',
  '**@Speaker 1**',
  '- [ ] Twee profielen sturen',
  '',
  'Speaker 1: Goedemiddag, fijn dat je tijd hebt.',
  'Speaker 2: Graag, we zoeken iemand voor het sociaal domein.',
  '',
].join('\n')

const withMarker = [
  '- **Afspraak**: We spreken volgende week verder.',
  '',
  'Volledig transcript',
  '',
  'Anouk: Zullen we volgende week verder praten?',
  'Mirjam Smit: Dat is goed.',
].join('\n')

describe('parsePlaudMail', () => {
  it('splitst het transcript af als het direct na het verslag begint', () => {
    const report = parsePlaudMail('Plaud-verslag | 10-27 Kennismaking', withoutMarker)

    expect(report.summary).toContain('## Actiepunten')
    expect(report.summary).toContain('- [ ] Twee profielen sturen')
    expect(report.summary).not.toContain('Goedemiddag')
    expect(report.transcript).toEqual([
      { speaker: 'Speaker 1', text: 'Goedemiddag, fijn dat je tijd hebt.' },
      { speaker: 'Speaker 2', text: 'Graag, we zoeken iemand voor het sociaal domein.' },
    ])
  })

  it('splitst bij het kopje Volledig transcript', () => {
    const report = parsePlaudMail('Plaud-verslag | 10-27 Vervolg', withMarker)

    expect(report.summary).toBe('- **Afspraak**: We spreken volgende week verder.')
    expect(report.transcript.map((t) => t.speaker)).toEqual(['Anouk', 'Mirjam Smit'])
  })

  it('ziet een zin met een dubbele punt in het verslag niet aan voor een spreker', () => {
    const text = ['Conclusie: we gaan door met de werving.', '- Profielen volgen deze week'].join('\n')
    const report = parsePlaudMail('Verslag', text)

    expect(report.summary).toBe(text)
    expect(report.transcript).toEqual([])
  })

  it('voegt regels zonder spreker na het kopje toe aan de vorige beurt', () => {
    const text = ['Volledig transcript', 'Anouk: Eerste zin.', 'tweede zin van dezelfde beurt.'].join('\n')
    const report = parsePlaudMail('Verslag', text)

    expect(report.transcript).toEqual([{ speaker: 'Anouk', text: 'Eerste zin. tweede zin van dezelfde beurt.' }])
  })

  it('laat een mail zonder transcript heel', () => {
    const report = parsePlaudMail('Verslag', '- **Punt**: Alleen een samenvatting.')

    expect(report.summary).toBe('- **Punt**: Alleen een samenvatting.')
    expect(report.transcript).toEqual([])
  })
})

describe('displayTitle', () => {
  it('haalt het voorvoegsel en de datum uit het onderwerp', () => {
    expect(displayTitle('Plaud-verslag | 10-27 Dictaat: Workflow voor PWA')).toBe('Dictaat: Workflow voor PWA')
  })

  it('laat een ander onderwerp staan', () => {
    expect(displayTitle('Gesprek met de gemeente')).toBe('Gesprek met de gemeente')
  })
})
