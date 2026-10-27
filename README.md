# Bibi Plaud PWA

PWA waarmee Blue Bricks-collega's gespreksverslagen uit de Plaud Note Pro controleren en afronden.

AutoFlow in de Plaud-app transcribeert elke opname en mailt het resultaat. De PWA leest die mails uit, toont het verslag ter controle en laat de collega het afronden.

## Status

Proof of concept (MVP, alleen de Must-onderdelen). Ontwikkeling gebeurt op de branch `dev`. Het plan staat in [docs/plan-mvp.md](docs/plan-mvp.md).

## Lokaal ontwikkelen

```bash
npm install
npm run dev
```

De app draait dan op http://localhost:5173/. Met `npm run build` maak je de versie voor GitHub Pages. Iconen maak je opnieuw uit `public/logo.svg` met `npm run icons`.

Elke push naar `dev` publiceert de app op https://nieradj-bb.github.io/Bibi-Plaude-PWA/.

Echte AutoFlow-mails horen nooit in deze repository, want hij is openbaar.
