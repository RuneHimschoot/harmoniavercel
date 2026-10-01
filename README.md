# Harmonia Playground 0.3

**Find your harmony.** Lokale testapp met studenten, bedrijven en een admin. Alle profielen, reviews, cijfers en betalingen zijn fictief.

## Vercel via GitHub

Het project is klaar voor statische hosting op Vercel. Zie **VERCEL.md** voor de repo-indeling en importinstellingen. `npm run build` test en valideert de app en maakt de publicatiemap `build/`. Bewerk en commit de bronbestanden in `dist/`; `build/` wordt automatisch gegenereerd.

## Starten

Open **http://127.0.0.1:4173/**. Na een herstart van de computer: dubbelklik op **START.cmd**. De launcher start de server verborgen en opent de browser; opnieuw starten herkent de bestaande server.

Node.js 18+ volstaat, zonder npm-pakketten. Handmatig: `npm start`. Achtergrondstart: `npm run launch`. Tests: `npm test`.

Gebruik dezelfde browser en hetzelfde adres om je testgegevens te behouden. Gegevens staan lokaal; verschillende apparaten/browsers delen geen database. De offlinecache bewaart de app na een eerste bezoek; voor code-updates moet de lokale server draaien en laad je de pagina opnieuw.

## Nieuwe mogelijkheden

- **120 studenten, 36 bedrijven, 72 activiteiten en 1 admin.** Gent: 60 studenten/20 bedrijven; Leuven en Antwerpen: ieder 30 studenten/8 bedrijven. Twee Gentse bedrijven wachten op verificatie en hebben vier conceptactiviteiten.
- **Discover:** filter studenten op regio en interesse. Dateless swipen, wederzijdse Harmonies en chat blijven behouden.
- **Explore → Activiteiten / Bedrijven:** regiofilters, interessechips, bewaarde activiteiten en sortering van bedrijven. Alle gepubliceerde activiteiten van actieve geverifieerde bedrijven blijven voor iedere student beschikbaar; persoonlijke interesses verbergen niets automatisch.
- **Bedrijfsdetails:** activiteiten, gemiddelde sterren, reviews, nuttig-stemmen en antwoorden van de eigenaar. Een student heeft één aanpasbare review per bedrijf. Aanbevolen volgorde combineert gemiddelde sterren met aantal reviews; een uitgangsgewicht van vijf reviews met vier sterren beperkt extreme scores bij weinig reviews.
- **Ik ga mee:** inschrijven en annuleren bij een activiteit. De ticketprijs is een simulatie; er vindt geen betaling plaats. Deze acties voeden het dashboard.
- **Bedrijvenomgeving:** Dashboard, Evenementen, Credits en Mijn bedrijf. Regio en bedrijfsprofiel zijn bewerkbaar. Regio per evenement kan afwijken van de bedrijfsvestiging.

## Credits

Een bedrijf start in de volledige demo met 50 credits. De twee reeds gepubliceerde voorbeeldevenementen hebben samen 20 credits gebruikt; saldo 30. Ongeverifieerde bedrijven behouden 50 credits.

| Demopakket | Credits | Demoprijs |
| --- | ---: | ---: |
| Eerste klik | 50 | €9 |
| Campus favoriet | 150 | €24 |
| De hele stad | 400 | €59 |

Een eerste publicatie kost 10 credits. Concept opslaan, bewerken en een eerder betaald evenement opnieuw publiceren zijn gratis. Onvoldoende saldo? Bewaar een concept of voeg een demopakket toe. Verwijderen geeft geen credits terug. Het saldo en alle transacties zijn zichtbaar bij Credits. Er is geen betaalprovider, abonnement of echte afschrijving.

Bij migratie uit de vorige versie behouden bestaande gepubliceerde evenementen hun publicatie zonder achteraf credits af te boeken.

## Dashboard

- Algemene cijfers en selectie per evenement, met perioden van 7, 30 of 90 dagen.
- Detailpaginaweergaven, unieke studentbezoekers, inschrijvingen en bruto demo-ticketomzet.
- Bewaaracties, gedeelde activiteiten, inschrijfconversie, herkomst per regio en een weekgrafiek.
- Vergelijkingstabel per evenement en een suggestie op basis van de getoonde cijfers.
- **Alleen eigen testacties** sluit de vooraf gegenereerde voorbeeldcijfers uit.

Een paginaweergave ontstaat wanneer een student bedrijfs- of evenementdetails opent. Herhaald openen binnen 30 seconden telt niet opnieuw. Bewaaracties tellen handelingen, niet het actuele aantal opgeslagen favorieten. Delen telt wanneer een activiteit daadwerkelijk in een Harmony-chat wordt verstuurd. Unieke bezoekers tellen studenten, geen apparaten.

Demo-omzet gebruikt de ticketprijs op het moment van inschrijving. Een latere prijswijziging verandert bestaande inschrijvingen niet. Annuleren verwijdert de inschrijving en de bijbehorende omzet uit de cijfers. Aangekochte credits zijn geen omzet van het bedrijf. De conversie is het aandeel unieke detailbezoekers met een actieve inschrijving binnen dezelfde gekozen periode en selectie. Reviews tonen de totaalscore onafhankelijk van de dashboardperiode.

Verwijderde evenementen verdwijnen uit Explore en het beheer voor evenementen. Hun historische cijfers blijven selecteerbaar in het dashboard. Er is geen koppeling met Google Reviews of externe analytics.

## Testroute

1. Kies **Noor Peeters**. Open Explore → Bedrijven, kies Leuven en open **Café Komma**.
2. Geef sterren, schrijf een review en open een activiteit. Klik **Ik ga mee · demo**.
3. Wissel naar **Café Komma**. Vink **Alleen eigen testacties** aan: je ziet je bezoek en inschrijving terug. Bij een betaalde activiteit verschijnt de demo-omzet.
4. Ga naar Mijn bedrijf en beantwoord Noors review.
5. Open Credits, kies een pakket en voeg de democredits toe. Maak een evenement: publiceren kost eenmaal 10 credits. Bewerk het opnieuw: het saldo blijft gelijk.
6. Wissel naar een student, filter op de evenementregio en bekijk de nieuwe activiteit.
7. Probeer de resets in het adminaccount.

Voor Harmonies: Noor en Luca hebben een vooraf ingestelde inkomende like. Swipe als Noor Luca naar rechts, stuur een bericht en wissel naar Luca om nieuwe-Harmony- en berichtmeldingen te testen.

## Resets en bestaande gegevens

**Reset interacties** wist swipes, Harmonies, chats, meldingen, blokkeringen, bewaarde activiteiten, reviews, inschrijvingen en alle dashboardactiviteit, inclusief voorbeelden. Profielen, bedrijven, evenementen en credits blijven behouden. Speel na deze reset beide studentenaccounts om een wederzijdse Harmony te maken.

**Reset volledige demo** herstelt alle accounts, evenementen, startcredits, voorbeeldreviews en voorbeeldcijfers. Eigen wijzigingen verdwijnen. Nieuwe voorbeeldactiviteiten krijgen toekomstige datums.

De app migreert v1/v2-opslag naar `harmonia-demo-v3`, met behoud van bestaande profielen, chats en evenementwijzigingen. Oude opslag blijft als eerdere kopie staan. Nieuwe steden en commercegegevens worden toegevoegd. Een al gemigreerde v3 wordt niet opnieuw gevuld na een reset.

## Mappen

```text
harmonia/
  START.cmd
  package.json
  README.md
  TESTVERSLAG.md
  dist/
    index.html
    styles.css              Basis en beheeromgeving
    mobile.css              Studenteninterface en swipeanimaties
    commerce.css            Explore, reviews, credits en dashboards
    sw.js                   Offlinecache, versie 3
    manifest.webmanifest
    icon.svg
    src/
      app.js                Interacties, navigatie en browseropslag
      views.js              Accountkeuze, Discover, Harmonies en kaarten
      domain.js             Matching, events, migratie en resets
      data.js               Basistestaccounts
      demo.js               Nieuwe regio’s, pakketten en voorbeeldcijfers
      marketplace.js        Reviews, credits, tracking en rekenregels
      marketplace-views.js  Explore en bedrijvenomgeving
  scripts/
    server.mjs
    launch.mjs
  tests/
    domain.test.mjs          30 gedragstests
```

De accountwisselaar blijft vrij beschikbaar. Dit is een lokale prototype-app; echte login, echte betalingen, gedeelde serverdatabase en telefoonpushmeldingen zijn geen onderdeel van deze versie.
