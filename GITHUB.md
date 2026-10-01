# GitHub als bron voor Vercel

Gebruik voortaan **VERCEL.md** voor de repo-indeling en hostinginstellingen.

De oude lokale GitHub Pages-workflow is verwijderd. Als `.github/workflows/pages.yml` nog in je remote repository staat, verwijder die bij het overnemen van de nieuwe bestanden. Vanuit deze taak is niets op GitHub aangepast.

Commit de appbron in `dist/`, plus `vercel.json`, `package.json`, `package-lock.json`, `scripts/` en `tests/`. Vercel bouwt en publiceert de gegenereerde map `build/`.
