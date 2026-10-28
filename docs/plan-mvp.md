# Plan MVP: alleen de Must-onderdelen

Stand: 28 oktober 2026. Ontwikkeling op de branch `dev`.

## Doel

Zo snel mogelijk testen of de PWA prettig werkt: opname met de Note Pro, een Plaud-Routine mailt verslag en transcript, de PWA toont het verslag, de collega controleert en rondt af. Eén gebruiker, de persoonlijke mailbox, geen Bibi.

Klaar is de MVP als vijf echte gesprekken via de PWA zijn gecontroleerd en afgerond op de iPhone.

De PWA is de vaste plek om verslagen te controleren: later gaat een verslag pas na afronden naar Bibi admin ([ADR 0002](adr/0002-pwa-vaste-controleplek.md)). We ontwerpen daarom voor de pilot en bouwen nu alleen het MVP-deel. In de MVP gaat een afgerond verslag nog nergens heen.

## Hoe de app werkt

De app is een werkbak voor verslagen, geen mailprogramma. De begrippen staan in [GLOSSARY.md](../GLOSSARY.md).

| Onderdeel | Werking |
|---|---|
| Vormgeving | PWA first, zo native mogelijk op de iPhone in de stijl van iOS 26 (Liquid Glass): systeemlettertype dat meeschaalt met de tekstgrootte van de iPhone, iOS-kleuren met Blue Bricks-blauw als accent, alleen een licht thema. Grote titels, gegroepeerde lijsten, een zwevende tabbalk en glazen knoppen. |
| Navigatie | Een stapel schermen zoals in iOS: werkbak, controlescherm, transcript. Elk scherm schuift in en staat in de geschiedenis, zodat de terugknop en vegen vanaf de linkerrand werken. Omlaag trekken vernieuwt de lijst; op de laptop is er een knop Vernieuwen. |
| Startscherm | Werkbak Te controleren, nieuwste verslag bovenaan. Elke rij toont Onderwerp, datum, klant, gesprekstype en duur, en laat zien als Gegevens ontbreken. |
| Controlescherm | Bovenaan Gegevens als iOS-formulier; lege velden tonen Onbekend in oranje. Daaronder het verslag per onderdeel en een rij naar het transcript. Afronden en Niet bruikbaar zweven onderin beeld. |
| Controleren | Gegevens bevestigen, fouten in namen, bedragen en toezeggingen verbeteren, en beslissen: Afronden of Niet bruikbaar |
| Bewerken | Gegevens direct in het formulier. Een onderdeel van het verslag bewerk je in een blad dat van onderen opschuift, met Annuleer (kruisje) en Gereed (vinkje); pas Gereed bewaart. Gesprekstype kies je uit de lijst van de Skill; klant en opdracht zijn vrije velden met suggesties uit eerdere verslagen. |
| Transcript | Eigen scherm om na te slaan, met een zoekbalk |
| Statussen | Te controleren, Afgerond en Niet bruikbaar. Afgerond en Niet bruikbaar staan samen in de tab Afgehandeld, elk met een eigen label. Terugzetten naar Te controleren kan. Afronden zet alleen de status. |
| Toestellen | De iPhone is het hoofdtoestel; de laptop kan ook, maar elk toestel heeft zijn eigen status ([ADR 0001](adr/0001-lokale-opslag-zonder-backend.md)) |
| Melding | Geen eigen melding; de melding van Gmail of de Plaud-app is het seintje |
| Andere gesprekstypen | Intern overleg, dictaat en overig toont de app ook, en die kun je gewoon afronden |
| Mail met een andere opbouw | Wordt één verslag met de hele tekst en lege Gegevens, met een melding dat de opbouw afwijkt |
| Twee mails voor één opname | Twee verslagen; de collega zet er één op Niet bruikbaar |

## Keuzes voor snelheid

| Keuze | Waarom | Wat we ervoor inleveren |
|---|---|---|
| Alleen een frontend, geen backend | De PWA leest de mailbox zelf via Microsoft Graph, met de inlog van de gebruiker. Geen server, geen database. | Geen pushmeldingen. Nieuwe verslagen verschijnen als je de PWA opent. |
| Status en bewerkingen lokaal in de browser, zonder backend en zonder app-map in de cloud ([ADR 0001](adr/0001-lokale-opslag-zonder-backend.md)) | Geen opslag nodig buiten het toestel. In de POC gaat een afgerond verslag nergens heen, dus delen tussen toestellen is gemak en geen noodzaak. | Telefoon en laptop delen hun status niet. De iPhone is het hoofdtoestel; een verslag rond je af op het toestel waar je eraan begon. |
| Vite, React en TypeScript | Snel opzetten, bekend gereedschap | |
| `vite-plugin-pwa` | Manifest en service worker zonder handwerk | |
| Eerst Gmail met Google-login, later Microsoft | Een Google Cloud-project richt je zelf in, zonder IT. Een tussenlaag voor de mailbron zorgt dat later alleen die laag vervangen wordt door Microsoft Graph. | Inloggen is in de test niet representatief: Google geeft toegang voor een uur, daarna verbindt de app opnieuw |
| Eigen CSS in iOS-stijl, zonder UI-bibliotheek | Geen bibliotheek om te leren; dicht bij iOS met systeemlettertype en -kleuren | Liquid Glass en de iOS-overgangen bootsen we na; ze zijn niet echt van Apple |
| GitHub Pages, automatisch vanaf `dev` | Gratis, met HTTPS, en de repository is openbaar | De app staat op een openbare URL. Zonder Blue Bricks-inlog is er niets te zien. |
| Ophalen bij openen, plus een knop Vernieuwen | Werkt zonder backend | |
| Afronden zet alleen een status | In de MVP gaat er nog niets naar Bibi | Geen kopieerknop: wat je in Bibi wilt hebben, neem je zelf over |
| Parser op basis van de vaste opbouw van de Skill *BB-gespreksverslag*; andere opbouwen, zoals het briefing-template, ondersteunen we niet | De Skill schrijft blok `## Gegevens`, `## Verslag` en `## Volledig transcript` voor | Lukt het splitsen niet, dan toont de PWA de hele mail als verslag, met lege Gegevens |

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
| 3. Mail uitlezen | Van mail naar verslag: het blok Gegevens (gesprekstype, onderwerp, klant, opdracht, deelnemers, datum, duur; `[Onbekend]` wordt een leeg veld), het verslag per onderdeel en het transcript. Het Onderwerp wordt de titel. Eerst de tests op basis van de anonieme voorbeeldmails, dan de code. | De tests slagen voor alle voorbeeldmails, en een mail met een andere opbouw valt terug op de hele tekst | ½ tot 1 dag |
| 4. Schermen | Werkbak, tab Afgehandeld en controlescherm, zoals beschreven onder *Hoe de app werkt*. Status en verbeteringen lokaal bewaard. | Een verslag gaat van Te controleren naar Afgerond, en de verbeteringen staan er na opnieuw openen nog | 1½ dag |
| 5. Testen in de praktijk | Echte gesprekken opnemen en controleren, vooral op de iPhone. We meten niets; na de testweek beoordelen we of controleren prettig werkt. | Vijf echte verslagen afgerond | Een testweek |

Totaal: ongeveer 3 tot 4 dagen bouwen.

## Welke Must waar zit

| Must | Stap |
|---|---|
| Installeerbare PWA | 1 |
| Inloggen met je Blue Bricks-account | 2 |
| Plaud-mails ophalen | 2 |
| Mail uitlezen | 3 |
| Lijst Te controleren | 4 |
| Controlescherm | 4 |
| Transcript bekijken | 3 en 4 |
| Afronden | 4 |

*Feedback apart tonen* is vervallen (28 oktober): de Skill geeft geen feedback op de gespreksvoering. *Gecontroleerd en kopiëren* is ook vervallen (28 oktober): afronden zet alleen de status.

## Opbouw van de code

```
src/
  auth/      Google-login (later Microsoft)
  mail/      mailbron: Gmail nu, Microsoft Graph later; demo-mails voor ontwikkelen
  parser/    Plaud-mail omzetten naar een verslag, met tests
  report/    verslag: uitgelezen mail met de bewerkingen van de collega erover
  store/     status en bewerkingen lokaal bewaren
  navigation/ schermenstapel met geschiedenis, omlaag trekken om te vernieuwen
  screens/   Werkbak (Te controleren, Afgehandeld), Controleren, Transcript
  styles/    iOS-stijl: kleuren, tekstgroottes, glas
```

## Wat we bewust overslaan

Backend, eigen meldingen, alles met Bibi (ook kopiëren), meerdere gebruikers, offline werken, synchroniseren tussen toestellen, metingen in de testweek en het herkennen van dubbele verslagen. Tests schrijven we alleen voor de parser, want daar zit het meeste risico.

## Risico's en terugvalopties

| Risico | Gevolg | Terugvaloptie |
|---|---|---|
| Later geen toestemming voor `Mail.Read` bij Microsoft | De PWA kan de Outlook-mailbox niet lezen | Bij Gmail blijven voor de test, of mail importeren: een AutoFlow-mail delen of uploaden naar de PWA |
| AutoFlow bestaat niet meer (vervangen door Routines vanaf Plaud-app 4.0) | Geen automatische mail | Nagaan of Routines nog mailt; anders Zapier of mail handmatig doorsturen |
| Het transcript zit als pdf of docx in de bijlage | Uitlezen kost meer werk | In de MVP alleen een knop om de bijlage te openen |
| AutoFlow verandert de opmaak van de mail | De parser herkent de onderdelen niet meer | Terugval op de hele tekst; de tests laten zien wat er veranderd is |
| Inloggen werkt anders in een PWA op de iPhone | Steeds opnieuw inloggen | Redirect-login, de inlog in `localStorage` bewaren en stil opnieuw verbinden; vroeg testen in stap 2 |
