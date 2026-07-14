# CalcuFast

Site statique de calculateurs, sans installation ni dépendance.

## Tester sur Mac

Double-clique sur `index.html`, ou lance dans le Terminal :

```bash
cd chemin/vers/calcufast-site
python3 -m http.server 8000
```

Puis ouvre http://localhost:8000

## Mise en ligne avec GitHub + Vercel

1. Crée un dépôt GitHub vide nommé `calcufast`.
2. Ajoute tous les fichiers de ce dossier au dépôt.
3. Dans Vercel, clique sur **Add New Project** puis importe le dépôt.
4. Ne sélectionne aucun framework. Laisse les réglages par défaut et clique sur **Deploy**.

Le site n’utilise aucune base de données et aucun service payant.
