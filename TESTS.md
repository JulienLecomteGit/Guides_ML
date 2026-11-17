# Tests et recette — 1.1.1-preview

**Date : 17 novembre 2026 — statut : correctif local non publié, à valider.**

## Vérifié automatiquement

| Famille | Contrôle | Résultat |
|---|---|---|
| Fichiers | Six cartes de l'accueil pointent chacune vers un HTML existant | OK |
| Conservation | Empreinte SHA256 de `index.html` identique au fichier transmis | OK · 1/1 |
| Navigation | Même bouton Accueil dans les six cours | OK |
| Conservation | Empreintes SHA256 des cours 01 à 03 identiques aux originaux après retrait du seul ajout de navigation | OK · 3/3 |
| JavaScript | Syntaxe des scripts intégrés vérifiée par Node.js | OK · 7 pages |
| JavaScript | Étiquettes Python : les 30 actions dans les deux modes et trois replis sans numéro | OK · 63 sorties |
| JavaScript | Matrice de confusion, vote k-NN et changement de distance : événements et résultats simulés sans navigateur | OK · 3/3 |
| Pédagogie | Parcours en trois temps, ateliers et notions fondamentales des cours 04–06 | OK |
| Sources | Identifiants des trois Colabs et de Google Sheets recoupés avec les PDF | OK dans les fichiers |
| Python | Analyse syntaxique de tous les blocs de code des cours 04–06 | OK · 30/30 |
| Python | Livres, fruits, PCA, comparaison de métriques, Pokémon fictifs, sélection de k avec validation croisée | OK · 6 groupes |

Commandes utilisées dans ce dossier :

```text
node tests/verify-guides.js
node tests/check_interactions.js
python3 tests/check_python_snippets.py
```

Le script Python exécute des exemples hors réseau avec les bibliothèques déjà présentes dans l'environnement de test. Les tests Python ne valident **pas** l'intégralité des notebooks Colab hébergés en ligne.

## Réserves explicites

- **Recette visuelle du correctif non réalisée :** l'ouverture des fichiers locaux était bloquée par la politique du navigateur. Le site 1.1.0-preview a été observé en ligne ; le remplacement des badges est validé par des tests JavaScript, mais doit être confirmé visuellement après validation.
- **Liens externes :** les adresses des Colabs et de Google Sheets ont été reprises des PDF, mais leur accessibilité en ligne et les permissions de partage n'ont pas été vérifiées.
- **Styles hors ligne :** les pages s'ouvrent sans serveur, mais la présentation complète dépend de Tailwind CDN et de polices Google Fonts.
- **Données de challenge :** les tests utilisent un jeu Pokémon **fictif** pour contrôler le traitement ; aucun jeu nominatif ou privé n'est joint.
- **GitHub :** aucun nouveau fichier envoyé et aucun commit effectué pour le correctif 1.1.1-preview. La version 1.1.0-preview est déjà publiée.

## Recette manuelle à faire avant publication

- [ ] Depuis `index.html`, ouvrir les six cartes, utiliser « ← Accueil », puis recommencer pour les six cours.
- [ ] Vérifier que les trois premiers cours montrent exactement les mêmes textes, schémas, boutons et exemples qu'avant, hors ajout d'Accueil.
- [ ] Dans le cours 04, tester plusieurs seuils de sigmoïde et plusieurs valeurs VN/FP/FN/VP ; vérifier que précision et rappel réagissent correctement.
- [ ] Dans les cours 04, 05 et 06, vérifier que les blocs Python intégrés affichent « A01 · … » (ou un autre numéro/thème) et plus jamais « UNDEFINED ». Vérifier aussi les badges dans « Tous les Codes ».
- [ ] Dans le cours 05, essayer k=1, 3, 5 en vote uniforme et pondéré ; vérifier que k=3 uniforme choisit rouge et que k=3 pondéré choisit bleu.
- [ ] Dans le cours 06, ouvrir l'exemple des livres, puis comparer Euclidienne (Y) et Manhattan (X) avec les boutons.
- [ ] Pour chacun des cours 04–06, changer de chapitre, tester le menu et l'antisèche Python, puis copier un exemple.
- [ ] Vérifier sur écran large et fenêtre étroite : barre latérale, cartes de trois étapes, simulateurs, défilement, lisibilité.
- [ ] Si autorisé, vérifier que les trois Colabs et la feuille Pokémon s'ouvrent bien, puis tester les exemples avec les véritables jeux de données.

Les anomalies éventuelles sont à corriger avant toute publication GitHub.
