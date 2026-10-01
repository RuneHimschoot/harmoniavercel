# Testverslag — Harmonia 0.3

Uitgevoerd op 1 oktober 2026, lokaal op Windows met Node.js 20.7.0 en de ingebouwde browser.

## Geautomatiseerd

`node tests/domain.test.mjs` — **30/30 geslaagd**.

De suite controleert wederzijdse matching, chattoegang, blokkeren, gelezen-status, moderatie, zichtbaarheid en delen van evenementen, resets, geldige datums en eigenaarschap. Nieuwe controles behandelen:

- 120 unieke studenten, 36 bedrijven, 72 evenementen; regiofilters in drie steden.
- Eén aanpasbare review per student/bedrijf, geldige sterren, nuttig-stemmen en antwoorden van de eigenaar.
- Vaste demo-creditpakketten, idempotente checkout en rolcontrole.
- Gratis concept, eenmalige publicatiekosten, gratis bewerken/herpubliceren.
- Onvoldoende credits of ongeldige ticketprijs veranderen de gegevens niet.
- Views dedupliceren, unieke bezoekers, inschrijvingen, annuleringen en correcte demo-ticketomzet.
- Periode, evenement, bedrijfsaccount en voorbeelddata gescheiden in de cijfers.
- Onbeschikbare bedrijven/evenementen kunnen geen nieuwe inschrijvingen of views ontvangen.
- Interactie-reset wist commerce-interacties en bewaart credits.
- Migratie uit v1/v2 bewaart eigen gegevens en belast bestaande publicaties niet achteraf.
- Verwijderen verbergt een evenement, behoudt historische cijfers en geeft geen credits terug.

## Browserflows

Getest op een afzonderlijke lokale oorsprong (`localhost:4173`) zodat de bestaande gebruikersdemo op `127.0.0.1:4173` niet werd gereset.

- Discover → Leuven: 30 beschikbare nieuwe studenten, met lokale instellingen en regio op het profiel.
- Explore → Bedrijven → Leuven: acht bedrijven. Antwerpen + Koffie: twee resultaten.
- Review geschreven als Noor bij Café Komma: score en reviewaantal veranderen; eigen review is bewerkbaar.
- Betaalde demoactiviteit geopend en inschrijving bevestigd.
- Accountwissel naar Café Komma: eigen acties tonen 2 detailviews, 1 unieke student, 1 inschrijving en €5 demo-omzet.
- Pakket van 50 credits gekocht: saldo 30 → 80; nieuw evenement publiceren: 80 → 70; opnieuw opslaan: saldo blijft 70.
- Eigen evenement met regio Antwerpen en ticketprijs €7,50 opgeslagen.
- Bedrijfsantwoord op review opgeslagen; account, evenement en credits blijven bewaard na herladen.
- Admininteractie-reset: dashboardcijfers en reviews leeg, creditsaldo 70 en eigen evenement behouden.
- Explore visueel gecontroleerd op 390 × 844; geen horizontale paginaoverflow. Dashboard eveneens zonder paginaoverflow op die breedte.
- Desktopdashboard visueel gecontroleerd. Browserconsole bevatte geen JavaScript-fouten tijdens de flows.

## Betekenis van deze controles

Dit valideert de lokale demo, niet een productie- of betaalomgeving. Geen echte betaling, Google Reviews-koppeling of externe analytics aanwezig. Gegevens blijven per browser/oorsprong lokaal; er is geen synchronisatie tussen apparaten.

## Vercel-voorbereiding

- `npm run build` lokaal geslaagd, inclusief alle 30 gedragstests en JavaScript-syntaxcontroles.
- Build bevat 14 statische appbestanden; backendservers, tests en documentatie worden niet gepubliceerd.
- Offlinecachelijst gecontroleerd op ontbrekende bestanden; serviceworker krijgt een inhoudsafhankelijke buildversie.
- Repo bevat vercel.json, npm-lockfile en buildscript; output build/ is genegeerd in Git.
- Geen GitHub-wijzigingen op afstand of echte Vercel-deployment uitgevoerd.
