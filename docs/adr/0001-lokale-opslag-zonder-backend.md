# Lokale opslag zonder backend in de POC

De POC bewaart de status van een verslag, de Gegevens en de verbeteringen alleen lokaal in de browser van het toestel: geen backend, geen database en geen app-map in de cloud. In de POC gaat een afgerond verslag nergens heen en meten we niets, dus delen tussen iPhone en laptop is gemak en geen noodzaak; lokaal is het snelst gebouwd en vraagt geen extra dienst, account of toestemming. Besloten op 28 oktober 2026.

## Overwogen opties

- **Kleine backend** (Supabase, Firebase of Cloudflare Workers met D1, alleen gratis plannen): deelt alles tussen toestellen, maar vraagt een extra dienst en account. Voor de pilot is Supabase de eerste kandidaat, omdat inloggen en afgeschermde data per gebruiker erin zitten en het later ook de mail kan ophalen.
- **Verborgen app-map in de eigen Google Drive** (later OneDrive): deelt alles zonder backend, maar vraagt een extra toestemming. Afgewezen.
- **Status als Gmail-label**: deelt alleen de status, verbeteringen blijven per toestel, en de app moet in Gmail mogen wijzigen.

## Gevolgen

- De iPhone is het hoofdtoestel. Een verslag rond je af op het toestel waar je eraan begon; iPhone en laptop zien elkaars status niet.
- Op de iPhone hebben de app op het beginscherm en Safari elk een eigen opslag.
- Status en verbeteringen zijn weg als je de app verwijdert of de websitegegevens wist.
- In de pilot verhuist de opslag naar een simpele, gratis backend.
