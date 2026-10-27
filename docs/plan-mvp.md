# Plan MVP: alleen de Must-onderdelen

Stand: 27 oktober 2026. Ontwikkeling op de branch `dev`.

## Doel

Zo snel mogelijk testen of de PWA prettig werkt: opname met de Note Pro, AutoFlow mailt het transcript, de PWA toont het verslag, de collega controleert en rondt af. Eén gebruiker, de persoonlijke mailbox, geen Bibi.

Klaar is de MVP als vijf echte gesprekken via de PWA zijn gecontroleerd en afgerond op de iPhone.

## Keuzes voor snelheid

| Keuze | Waarom | Wat we ervoor inleveren |
|---|---|---|
| Alleen een frontend, geen backend | De PWA leest de mailbox zelf via Microsoft Graph, met de inlog van de gebruiker. Geen server, geen database. | Geen pushmeldingen. Nieuwe verslagen verschijnen als je de PWA opent. |
| Status en bewerkingen lokaal in de browser | Geen opslag nodig buiten het toestel | Telefoon en laptop delen hun status niet |
| Vite, React en TypeScript | Snel opzetten, bekend gereedschap | |
| `vite-plugin-pwa` | Manifest en service worker zonder handwerk | |
| Eerst Gmail met Google-login, later Microsoft | Een Google Cloud-project richt je zelf in, zonder IT. Een tussenlaag voor de mailbron zorgt dat later alleen die laag vervangen wordt door Microsoft Graph. | Inloggen is in de test niet representatief: Google geeft toegang voor een uur, daarna verbindt de app opnieuw |
| Eigen CSS met de Blue Bricks-kleuren | Geen UI-bibliotheek om te leren | |
| GitHub Pages, automatisch vanaf `dev` | Gratis, met HTTPS, en de repository is openbaar | De app staat op een openbare URL. Zonder Blue Bricks-inlog is er niets te zien. |
| Ophalen bij openen, plus een knop Vernieuwen | Werkt zonder backend | |
| Parser op basis van een echte AutoFlow-mail | De opmaak van de mail is nog onbekend | Lukt het splitsen niet, dan toont de PWA de hele mail als verslag |

## Voorwaarden voordat we bouwen

| # | Wat | Wie | Blokkeert |
|---|---|---|---|
| V1 | AutoFlow-test gedaan, twee of drie voorbeeldmails beschikbaar | Nieradj | Stap 3 |
| V2 | Gmail-filter dat AutoFlow-mails het label `BB-Plaud` geeft | Nieradj | Stap 2 |
| V3 | Google Cloud-project met Gmail API en OAuth-client (klaar op 27 oktober) | Nieradj | Stap 2 |
| V4 | GitHub Pages aanzetten, met GitHub Actions als bron | Nieradj | Stap 1 (alleen het publiceren) |

**Google Cloud-project (V3)**
- Project `Verslagen PWA`, Gmail API aan, toestemmingsscherm extern en in testmodus
- Bereik: `gmail.readonly`
- OAuth-client van het type webapplicatie, met omleidings-URI's `http://localhost:5173/` en `https://nieradj-bb.github.io/Bibi-Plaude-PWA/`
- De client-ID staat in `src/config.ts`. Die is niet geheim; het clientgeheim gebruiken we niet.

**Later: Microsoft.** Voor de overstap naar de Outlook-mailbox is een app-registratie in Microsoft Entra ID nodig (type SPA, rechten `User.Read` en `Mail.Read`). Alleen de mailbron en het inloggen veranderen dan.

**Gebruik nagespeelde gesprekken** zolang de mails in een persoonlijke Gmail binnenkomen, zodat er geen klantgegevens in terechtkomen.

**Let op: de repository is openbaar.** Echte AutoFlow-mails gaan nooit in de repository. Testbestanden maken we anoniem: andere namen, klanten en bedragen.

## Bouwstappen

| Stap | Wat | Klaar als | Tijd |
|---|---|---|---|
| 1. Basis | Vite-project, PWA-manifest en iconen, service worker, kleuren en lettertype van Blue Bricks. Publiceren naar GitHub Pages bij elke push naar `dev`. | De lege app staat op het beginscherm van de iPhone | ½ dag |
| 2. Inloggen en mails ophalen | Google-login via redirect (werkt beter dan een pop-up in een PWA op de iPhone). Inlog bewaren in `localStorage`, na een uur stil opnieuw verbinden. Het label `BB-Plaud` zoeken en de mails ophalen, met bijlagen als het transcript daarin staat. Elke mail maar één keer, op basis van de Message-ID. Tijdelijk scherm dat de mail als tekst toont. | Na inloggen zie je je AutoFlow-mails en hun inhoud | ½ dag |
| 3. Mail uitlezen | Van mail naar verslag: titel, datum, tijd, duur, de onderdelen van het verslag, feedback en transcript. Eerst de tests op basis van de anonieme voorbeeldmails, dan de code. | De tests slagen voor alle voorbeeldmails, en een onbekende mail valt terug op de hele tekst | ½ tot 1 dag |
| 4. Schermen | De lijst Te controleren en Afgerond. Het controlescherm: verslag bewerken, gesprekstype kiezen, klant en opdracht invullen, feedback apart, transcript bekijken. Afronden met Gecontroleerd en kopiëren, of Niet bruikbaar. Alles lokaal bewaard. | Een verslag gaat van nieuw naar gecontroleerd en staat op het klembord | 1 dag |
| 5. Testen in de praktijk | Echte gesprekken opnemen en afronden op de iPhone. Correctietijd en wat tegenvalt bijhouden. | Vijf echte verslagen afgerond | ½ dag bouwen, daarna een testweek |

Totaal: ongeveer 3 tot 4 dagen bouwen.

## Welke Must waar zit

| Must | Stap |
|---|---|
| Installeerbare PWA | 1 |
| Inloggen met je Blue Bricks-account | 2 |
| AutoFlow-mails ophalen | 2 |
| Mail uitlezen | 3 |
| Lijst Te controleren | 4 |
| Controlescherm | 4 |
| Feedback apart tonen | 3 en 4 |
| Transcript bekijken | 3 en 4 |
| Afronden | 4 |

## Opbouw van de code

```
src/
  auth/      Google-login (later Microsoft)
  mail/      mailbron: Gmail nu, Microsoft Graph later
  parser/    AutoFlow-mail omzetten naar een verslag, met tests
  store/     status en bewerkingen lokaal bewaren
  screens/   Te controleren, Controleren
  styles/    kleuren en lettertype van Blue Bricks
```

## Wat we bewust overslaan

Backend, pushmeldingen, alles met Bibi, meerdere gebruikers, offline werken en synchroniseren tussen toestellen. Tests schrijven we alleen voor de parser, want daar zit het meeste risico.

## Risico's en terugvalopties

| Risico | Gevolg | Terugvaloptie |
|---|---|---|
| Later geen toestemming voor `Mail.Read` bij Microsoft | De PWA kan de Outlook-mailbox niet lezen | Bij Gmail blijven voor de test, of mail importeren: een AutoFlow-mail delen of uploaden naar de PWA |
| AutoFlow bestaat niet meer (vervangen door Routines vanaf Plaud-app 4.0) | Geen automatische mail | Nagaan of Routines nog mailt; anders Zapier of mail handmatig doorsturen |
| Het transcript zit als pdf of docx in de bijlage | Uitlezen kost meer werk | In de MVP alleen een knop om de bijlage te openen |
| AutoFlow verandert de opmaak van de mail | De parser herkent de onderdelen niet meer | Terugval op de hele tekst; de tests laten zien wat er veranderd is |
| Inloggen werkt anders in een PWA op de iPhone | Steeds opnieuw inloggen | Redirect-login, de inlog in `localStorage` bewaren en stil opnieuw verbinden; vroeg testen in stap 2 |
