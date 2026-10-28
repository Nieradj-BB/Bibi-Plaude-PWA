import { describe, expect, it } from 'vitest'
import { displayTitle, parsePlaudMail, splitSections } from './plaudMail'

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

// Opbouw van de Skill BB-gespreksverslag: Gegevens, Verslag, Volledig transcript
const skillMail = [
  '## Gegevens',
  'Type: Commercieel gesprek',
  'Onderwerp: Voortgang Koers Kroonwijk',
  'Klant: Woonstichting Kroonwijk',
  'Opdracht: Koers Kroonwijk',
  'Deelnemers: Sandra Molenaar (Woonstichting Kroonwijk); Anouk (Blue Bricks)',
  'Datum: 2026-10-27',
  'Duur: 38 min',
  '',
  '## Verslag',
  '### Samenvatting',
  'De reorganisatie loopt; volgend jaar volgt een nieuw klantsysteem.',
  '### Actiepunten',
  '- [ ] Anouk: notitie over de aanpak sturen (uiterlijk 6 november)',
  '',
  '## Volledig transcript',
  'Anouk: Hoe loopt het in de wijkteams?',
  'Sandra Molenaar: Goed, al vinden de teamleiders het tempo hoog.',
].join('\n')

describe('parsePlaudMail met het blok Gegevens', () => {
  it('leest de gegevens uit en haalt het blok uit het verslag', () => {
    const report = parsePlaudMail('Plaud-verslag | 10-27 Voortgang Koers Kroonwijk', skillMail)

    expect(report.details).toEqual({
      conversationType: 'Commercieel gesprek',
      subject: 'Voortgang Koers Kroonwijk',
      client: 'Woonstichting Kroonwijk',
      assignment: 'Koers Kroonwijk',
      participants: 'Sandra Molenaar (Woonstichting Kroonwijk); Anouk (Blue Bricks)',
      date: '2026-10-27',
      duration: '38 min',
    })
    expect(report.summary).not.toContain('Gegevens')
    expect(report.summary).not.toContain('Klant:')
    expect(report.summary).toContain('### Samenvatting')
    expect(report.transcript.map((t) => t.speaker)).toEqual(['Anouk', 'Sandra Molenaar'])
  })

  it('maakt van [Onbekend] een leeg veld', () => {
    const text = ['## Gegevens', 'Type: Dictaat', 'Klant: [Onbekend]', 'Opdracht: [onbekend]', '', '## Verslag'].join('\n')
    const report = parsePlaudMail('Verslag', text)

    expect(report.details?.conversationType).toBe('Dictaat')
    expect(report.details?.client).toBe('')
    expect(report.details?.assignment).toBe('')
  })

  it('leest de gegevens ook als Plaud er vet of opsommingstekens omheen zet', () => {
    const text = ['## Gegevens', '**Type:** Intern overleg', '- **Klant**: Gemeente Noordstad', '* Duur: 12 min'].join('\n')
    const report = parsePlaudMail('Verslag', text)

    expect(report.details?.conversationType).toBe('Intern overleg')
    expect(report.details?.client).toBe('Gemeente Noordstad')
    expect(report.details?.duration).toBe('12 min')
  })

  it('leest het gesprekstype ook onder de naam Gesprekstype', () => {
    const report = parsePlaudMail('Verslag', ['## Gegevens', 'Gesprekstype: Commerciële briefing'].join('\n'))

    expect(report.details?.conversationType).toBe('Commerciële briefing')
  })

  it('laat het kopje Verslag weg, want het scherm heeft dat al', () => {
    const report = parsePlaudMail('Verslag', skillMail)

    expect(report.summary.startsWith('### Samenvatting')).toBe(true)
  })

  it('zet het blok niet in het transcript als het onderaan staat zonder kopje Volledig transcript', () => {
    const text = ['- **Punt**: Alleen een samenvatting.', '', '## Gegevens', 'Klant: Gemeente Noordstad', 'Datum: [Onbekend]'].join('\n')
    const report = parsePlaudMail('Verslag', text)

    expect(report.details?.client).toBe('Gemeente Noordstad')
    expect(report.summary).toBe('- **Punt**: Alleen een samenvatting.')
    expect(report.transcript).toEqual([])
  })

  it('geeft geen gegevens als het blok ontbreekt', () => {
    expect(parsePlaudMail('Verslag', withMarker).details).toBeNull()
  })
})

describe('splitSections', () => {
  it('maakt van elk kopje een onderdeel', () => {
    const summary = parsePlaudMail('Verslag', skillMail).summary

    expect(splitSections(summary)).toEqual([
      { title: 'Samenvatting', body: 'De reorganisatie loopt; volgend jaar volgt een nieuw klantsysteem.' },
      { title: 'Actiepunten', body: '- [ ] Anouk: notitie over de aanpak sturen (uiterlijk 6 november)' },
    ])
  })

  it('zet tekst zonder kopje in een onderdeel zonder titel', () => {
    const summary = ['Een introzin.', '', '## Actiepunten', '- [ ] Profielen sturen'].join('\n')

    expect(splitSections(summary)).toEqual([
      { title: '', body: 'Een introzin.' },
      { title: 'Actiepunten', body: '- [ ] Profielen sturen' },
    ])
  })

  it('houdt een onderdeel met lege tekst', () => {
    expect(splitSections('### Open vragen')).toEqual([{ title: 'Open vragen', body: '' }])
  })

  it('geeft niets bij een leeg verslag', () => {
    expect(splitSections('')).toEqual([])
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
