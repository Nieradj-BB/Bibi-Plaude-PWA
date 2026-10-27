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
| `@azure/msal-browser` en `@azure/msal-react` | Standaard Microsoft-login voor een app in de browser | |
| Eigen CSS met de Blue Bricks-kleuren | Geen UI-bibliotheek om te leren | |
| GitHub Pages, automatisch vanaf `dev` | Gratis, met HTTPS, en de repository is openbaar | De app staat op een openbare URL. Zonder Blue Bricks-inlog is er niets te zien. |
| Ophalen bij openen, plus een knop Vernieuwen | Werkt zonder backend | |
| Parser op basis van een echte AutoFlow-mail | De opmaak van de mail is nog onbekend | Lukt het splitsen niet, dan toont de PWA de hele mail als verslag |

## Voorwaarden voordat we bouwen

| # | Wat | Wie | Blokkeert |
|---|---|---|---|
| V1 | AutoFlow-test gedaan, twee of drie voorbeeldmails beschikbaar | Nieradj | Stap 3 |
| V2 | Outlook-regel die AutoFlow-mails naar de map `Plaud-verslagen` verplaatst | Nieradj | Stap 2 |
| V3 | App-registratie in Microsoft Entra ID (zie hieronder) | Nieradj of IT | Stap 2 |
| V4 | GitHub Pages aanzetten, met GitHub Actions als bron | Nieradj | Stap 1 (alleen het publiceren) |

**App-registratie (V3)**
- Type: single-page application (SPA)
- Redirect-URI's: `http://localhost:5173/` en `https://nieradj-bb.github.io/Bibi-Plaude-PWA/`
- Rechten (delegated): `User.Read` en `Mail.Read`
- Nodig voor de app: de client-ID en de tenant-ID. Die zijn niet geheim.
- Mag je zelf geen app registreren of geen toestemming geven voor `Mail.Read`, dan doet IT dit.

**Let op: de repository is openbaar.** Echte AutoFlow-mails gaan nooit in de repository. Testbestanden maken we anoniem: andere namen, klanten en bedragen.

## Bouwstappen

| Stap | Wat | Klaar als | Tijd |
|---|---|---|---|
| 1. Basis | Vite-project, PWA-manifest en iconen, service worker, kleuren en lettertype van Blue Bricks. Publiceren naar GitHub Pages bij elke push naar `dev`. | De lege app staat op het beginscherm van de iPhone | ½ dag |
| 2. Inloggen en mails ophalen | Microsoft-login via redirect (werkt beter dan een pop-up in een PWA op de iPhone). Inlog bewaren in `localStorage`. De map `Plaud-verslagen` zoeken en de mails ophalen, met bijlagen als het transcript daarin staat. Elke mail maar één keer, op basis van de `internetMessageId`. | Na inloggen zie je de onderwerpen van je AutoFlow-mails | ½ dag |
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
  auth/      Microsoft-login (MSAL)
  graph/     mails en bijlagen ophalen
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
| Geen toestemming voor `Mail.Read` | De PWA kan je mailbox niet lezen | Mail importeren: een AutoFlow-mail delen of uploaden naar de PWA. Daarmee is het gemak nog steeds te testen. |
| Het transcript zit als pdf of docx in de bijlage | Uitlezen kost meer werk | In de MVP alleen een knop om de bijlage te openen |
| AutoFlow verandert de opmaak van de mail | De parser herkent de onderdelen niet meer | Terugval op de hele tekst; de tests laten zien wat er veranderd is |
| Inloggen werkt anders in een PWA op de iPhone | Steeds opnieuw inloggen | Redirect-login en de inlog in `localStorage` bewaren; vroeg testen in stap 2 |
