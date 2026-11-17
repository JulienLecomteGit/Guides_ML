# Historique des modifications

## 1.1.1-preview — 17 novembre 2026

**État : correctif préparé et testé localement, non publié.**

- Corrige « UNDEFINED » dans les étiquettes des blocs Python intégrés aux chapitres 04, 05 et 06.
- Utilise automatiquement les champs `num` et `group` si le badge explicite n'est pas fourni.
- Conserve les badges de l'antisèche Python ; affiche « CODE » si aucune information de badge n'est disponible.
- Ajoute un contrôle automatisé des 30 actions en mode chapitre et antisèche, plus trois cas sans numéro (63 sorties vérifiées).
- Aucun changement dans les exemples Python, les simulateurs, les textes pédagogiques ou les cours 01 à 03.

## 1.1.0-preview — 17 novembre 2026

**État : version publiée sur GitHub Pages le 17 novembre 2026 (PR #1).**

### Navigation

- Même bouton « ← Accueil » (style, position dans l'en-tête de la barre latérale et `href="index.html"`) dans les six pages de cours.
- Les trois premiers cours conservent intégralement leur contenu pédagogique ; seule la navigation a été ajoutée.
- `index.html` transmis conservé, avec les six cartes existantes. Les cours 04, 05 et 06 étaient absents de GitHub au cadrage ; ils ont été ajoutés par la PR #1.

### Cours 04 — Classification et arbres

- Parcours « Ce que je vois / Ce que fait le modèle / Ce que je retiens » pour chacune des neuf notions.
- Matrice de confusion interactive : 4 curseurs et calcul cohérent de précision, rappel, F1 et spécificité.
- Quiz étendu à 10 questions pédagogiques.
- Challenge Titanic explicité : 4 parties, 5 modèles, 9 réflexions, mêmes données de test et nom de rendu.
- Distinction ajoutée entre la population totale du Titanic, les 891 lignes du jeu pédagogique et l'effet éventuel du nettoyage.

### Cours 05 — k-NN classification

- Parcours en trois temps pour les sept notions.
- Vote des voisins fondé sur cinq distances fictives explicites ; comparaison k=1/3/5 et vote uniforme/pondéré, avec résultats recalculés.
- Code de sélection de paramètres par `Pipeline` + `GridSearchCV` sur l'entraînement, et test final réservé.
- Clarification de la mise à l'échelle et de l'alignement des colonnes pour une prédiction individuelle.
- Quiz étendu à 7 questions ; challenge précisé avec 5 parties, 3 améliorations et 7 réflexions.

### Cours 06 — Recherche de similarités

- Parcours en trois temps pour les six notions.
- Exemple des 8 livres complet, classement visuel et explication du biais d'échelle.
- Démonstration à trois boutons montrant que la métrique Euclidienne/Manhattan/Chebyshev peut inverser les voisins.
- Exemples Python fruits et Pokémon rendus autonomes ou suffisamment contextualisés ; correction d'indices et de prérequis.
- Quiz étendu à 9 questions ; challenge Pokémon organisé en six étapes, sept réflexions et bonus PCA/t-SNE.
- Correction de la lettre `O` dans l'identifiant Google Sheets provenant du PDF.
- Rectification des formulations trop absolues sur les distances, la fiabilité et l'exclusion du voisin lui-même.

### Validation

- Voir `TESTS.md` pour les tests exécutés et les limites de recette visuelle.

### Lors de la préparation initiale

- Aucun fichier d'origine joint au chat n'a été modifié.
- Aucune installation ni suppression. La publication a ensuite été autorisée et réalisée sur GitHub.
