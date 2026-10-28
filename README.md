# Bibi Plaud PWA

PWA waarmee Blue Bricks-collega's gespreksverslagen uit de Plaud Note Pro controleren en afronden.

Een Plaud-Routine maakt van elke opname een verslag met transcript en mailt dat. De PWA leest die mails uit, toont het verslag ter controle en laat de collega het afronden. De begrippen staan in [GLOSSARY.md](GLOSSARY.md).

## Status

Proof of concept (MVP, alleen de Must-onderdelen). Ontwikkeling gebeurt op de branch `dev`. Het plan staat in [docs/plan-mvp.md](docs/plan-mvp.md).

## Lokaal ontwikkelen

```bash
npm install
npm run dev
```

De app draait dan op http://localhost:5173/. Met http://localhost:5173/?demo zie je drie verzonnen verslagen, zonder in te loggen; dat werkt alleen lokaal. Met `npm run build` maak je de versie voor GitHub Pages. Iconen maak je opnieuw uit `public/logo.svg` met `npm run icons`.

Elke push naar `dev` publiceert de app op https://nieradj-bb.github.io/Bibi-Plaude-PWA/.

Echte Plaud-mails horen nooit in deze repository, want hij is openbaar.
