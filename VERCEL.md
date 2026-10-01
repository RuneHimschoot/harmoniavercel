# Harmonia op Vercel via GitHub

Dit project is voorbereid voor Vercel. Er is vanuit deze taak niets geüpload, gepusht of gedeployed.

## Wat je in je repository zet

Plaats de **inhoud** van `Harmonia-vercel.zip` in de root van je repository. `package.json` en `vercel.json` staan dan direct op het hoogste niveau:

```text
Harmonia/
├── vercel.json              Vercel build- en hostinginstellingen
├── package.json             npm run build, npm test, npm start
├── package-lock.json        Reproduceerbare npm-installatie
├── .gitignore               Sluit build/ en .vercel/ uit
├── dist/                    Bewerkbare appbestanden, wel committen
│   ├── index.html
│   ├── styles.css
│   ├── mobile.css
│   ├── commerce.css
│   ├── sw.js
│   ├── manifest.webmanifest
│   ├── icon.svg
│   └── src/                 JavaScript van de app
├── scripts/
│   ├── build.mjs            Valideert en maakt build/
│   ├── server.mjs           Alleen voor lokaal testen
│   └── launch.mjs           Lokale achtergrondstart
├── tests/domain.test.mjs
├── START.cmd
├── README.md
├── VERCEL.md
└── TESTVERSLAG.md
```

`build/` wordt automatisch gemaakt op Vercel en hoort niet in Git. De bestaande map `dist/` blijft de bron voor de statische app, zodat lokaal testen en bestaande imports blijven werken. Pas dus bestanden in `dist/` aan, niet in `build/`.

De oude lokale GitHub Pages-workflow is verwijderd. Als `.github/workflows/pages.yml` nog in je bestaande remote repo staat, verwijder dat bestand daar bij het overnemen van deze versie. Het weglaten van een bestand uit een ZIP verwijdert een bestaand GitHub-bestand niet automatisch.

## Project importeren in Vercel

Importeer je GitHub-repository in Vercel. Gebruik:

| Instelling | Waarde |
| --- | --- |
| Root Directory | `.` als package.json in de repo-root staat |
| Framework Preset | Other |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm ci --ignore-scripts --no-audit --no-fund` |
| Environment Variables | Niet nodig voor deze demo |

Deze instellingen staan al in `vercel.json`; de Root Directory kies je in Vercel. Staat de hele app in een submap van je repo, kies dan die submap als Root Directory: de map waarin **beide** `package.json` en `vercel.json` staan. Kies niet `dist/` of `build/`.

Vercel publiceert uitsluitend de inhoud van `build/`. Er is geen permanent Node-serverproces nodig. `npm start` en `START.cmd` blijven uitsluitend voor lokaal testen.

Referentie: [Vercel — configuratie van vercel.json](https://vercel.com/docs/project-configuration/vercel-json) en [buildinstellingen](https://vercel.com/docs/builds/configure-a-build).

## Wat de build doet

1. Voert de 30 gedragstests uit; een fout stopt de build.
2. Controleert JavaScript-syntax, vereiste appbestanden en alle bestanden uit de offlinecache.
3. Maakt een schone `build/` met alleen de statische app.
4. Geeft de serviceworker een cacheversie op basis van de inhoud van alle appbestanden. Codewijzigingen leveren automatisch een nieuwe versie op.

De HTTP-cache laat appbestanden opnieuw valideren. De offlinecache blijft beschikbaar. De navigatie gebeurt binnen de app op de root/hash; er zijn geen catch-all rewrites die ontbrekende JavaScript-bestanden per ongeluk door HTML vervangen.

## Zelf controleren

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

De lokale build is gecontroleerd. Een echte Vercel-deployment is nog niet uitgevoerd.

## Je demo op de nieuwe URL

Op de Vercel-URL krijgt elke browser eigen demo-opslag. Je lokale chats, reviews en wijzigingen worden niet automatisch overgezet. Ook je gsm heeft zijn eigen testgegevens. Binnen dezelfde URL/browser blijven ze behouden na een update; adminresets blijven werken.

De accountwisselaar, democredits en alle testaccounts blijven beschikbaar. Er is geen database of betaalprovider nodig voor deze versie.
