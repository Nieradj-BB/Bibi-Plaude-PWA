// Alleen bij npm run dev met ?demo in de adresbalk: verzonnen verslagen om de schermen te bekijken zonder Gmail.
// Nooit echte mails hier; de repository is openbaar.

import type { MailMessage, MailSource } from './types'

export const DEMO = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo')

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString()

function demoMail(id: string, subject: string, receivedAt: string, lines: string[]): MailMessage {
  return { id, messageId: `<${id}@demo>`, subject, from: 'Demo <demo@voorbeeld.nl>', receivedAt, text: lines.join('\n'), html: null, attachments: [] }
}

const demoMessages = (): MailMessage[] => [
  demoMail('kroonwijk', 'Plaud-verslag | 10-28 Voortgang Koers Kroonwijk', hoursAgo(1), [
    '## Gegevens',
    'Gesprekstype: Commercieel gesprek',
    'Onderwerp: Voortgang Koers Kroonwijk',
    'Klant: Woonstichting Kroonwijk',
    'Opdracht: Koers Kroonwijk',
    'Deelnemers: Sandra Molenaar (Woonstichting Kroonwijk); Anouk (Blue Bricks)',
    'Datum: 2026-10-28',
    'Duur: 38 min',
    '',
    '## Verslag',
    '### Samenvatting',
    'De reorganisatie van de wijkteams loopt volgens plan. In 2027 volgt een nieuw klantsysteem; Sandra zoekt begeleiding aan de menskant.',
    '### Belangrijkste punten',
    '- **Voortgang**: positief, maar teamleiders vinden het tempo hoog.',
    '- **Weerstand**: vooral in de wijkteams Noord en Oost.',
    '- **Budget**: ruimte voor begeleiding, nog niet door het MT.',
    '### Besluiten',
    'Geen',
    '### Actiepunten',
    '- [ ] Anouk: korte notitie over de aanpak sturen (uiterlijk 6 november)',
    '- [ ] Sandra: planning van het nieuwe systeem delen',
    '### Open vragen',
    '- Wanneer besluit het MT?',
    '### Relatie en persoonlijke kennis',
    'Sandra houdt van korte lijntjes en liever bellen dan lange mails.',
    '',
    '## Volledig transcript',
    'Anouk: Hoe loopt het in de wijkteams?',
    'Sandra Molenaar: Goed, al vinden de teamleiders het tempo hoog.',
    'Anouk: Waar zit de meeste weerstand?',
    'Sandra Molenaar: In Noord en Oost. En volgend jaar komt het nieuwe klantsysteem er nog bovenop.',
  ]),
  demoMail('dictaat', 'Plaud-verslag | 10-27 Ideeën voor de kwartaalplanning', hoursAgo(26), [
    '## Gegevens',
    'Type: Dictaat',
    'Onderwerp: Ideeën voor de kwartaalplanning',
    'Klant: [Onbekend]',
    'Opdracht: [Onbekend]',
    'Deelnemers: Anouk (Blue Bricks)',
    'Datum: 2026-10-27',
    'Duur: 4 min',
    '',
    '## Verslag',
    '### Samenvatting',
    'Anouk spreekt drie ideeën in voor de planning van het volgende kwartaal.',
    '### Actiepunten',
    '- [ ] Anouk: ideeën bespreken in het teamoverleg',
    '',
    '## Volledig transcript',
    'Anouk: Even drie ideeën voor de kwartaalplanning.',
  ]),
  demoMail('oud', 'Plaud-verslag | 10-26 Kennismaking gemeente Noordstad', hoursAgo(50), [
    'Kennismaking met de gemeente Noordstad over een informatieanalist.',
    '',
    '- **Vraag van de klant**: een informatieanalist voor 32 uur.',
    '- **Planning**: start per 1 januari.',
    '',
    'Speaker 1: Goedemiddag, fijn dat je tijd hebt.',
    'Speaker 2: Graag, we zoeken iemand voor het sociaal domein.',
  ]),
]

export function createDemoSource(): MailSource {
  return {
    async listMessages() {
      return demoMessages()
    },
    async account() {
      return 'demo@voorbeeld.nl'
    },
  }
}
