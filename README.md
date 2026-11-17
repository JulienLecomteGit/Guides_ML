# Guides visuels — Machine Learning

**Version de prévisualisation : 1.1.1-preview (17 novembre 2026)**  
**Statut : correctif local non publié sur GitHub — validation de Julien en attente.**

Application pédagogique statique comprenant **6 cours HTML**. Elle s'ouvre par un double-clic sur `index.html` et permet de naviguer entre les cours sans serveur ni compte.

## Ouvrir et parcourir

1. Extraire **tous** les fichiers du ZIP dans un même dossier (ne pas ouvrir une page directement depuis l'archive).
2. Ouvrir `index.html` dans Chrome, Edge ou un autre navigateur récent.
3. Choisir l'une des six cartes de cours.
4. Utiliser **← Accueil** en haut de la colonne de gauche pour revenir aux six cartes.
5. Dans les cours 04 à 06, lire le parcours en trois temps, essayer les démonstrations puis accéder à l'antisèche Python.

### Les six cours

| Cours | Fichier | Périmètre |
|---|---|---|
| 01 · Introduction ML | `Machine_learning.html` | Contenu pédagogique conservé |
| 02 · Régression linéaire | `Regression_lineaire.html` | Contenu pédagogique conservé |
| 03 · Streamlit graphiques | `Streamlit_les_graphiques.html` | Contenu pédagogique conservé |
| 04 · Classification et arbres | `Classification_et_arbres.html` | Parcours vulgarisé, matrice de confusion réglable, quiz et challenge Titanic |
| 05 · k-NN classification | `KNN_classification.html` | Vote réel pour k=1/3/5 et pondération, code de validation croisée, challenge Titanic |
| 06 · k-NN similarités | `KNN_similarites.html` | Classement visuel des livres, comparateur de métriques, fruits et challenge Pokémon |

Les six pages de cours utilisent le **même bouton Accueil** ; le contenu des trois premiers cours n'a été modifié **que pour ajouter ce bouton et son conteneur de mise en page**. La page `index.html` du lot transmis est inchangée.

**Correctif 1.1.1-preview :** dans les cours 04, 05 et 06, les badges des blocs Python affichent le numéro d'action et le thème au lieu de « UNDEFINED ». L'antisèche conserve son fonctionnement. Les autres contenus HTML sont ceux de la version 1.1.0-preview déjà publiée.

## Vérifier les fichiers

Les tests fournis se trouvent dans `tests/` :

```powershell
# À exécuter seulement si Node.js et Python sont déjà installés :
node .\tests\verify-guides.js
node .\tests\check_interactions.js
python .\tests\check_python_snippets.py
```

- `verify-guides.js` : navigation, empreintes d'origine des trois premiers cours, syntaxe JavaScript, badges des blocs Python dans les deux modes, présence des ateliers et notions clés.
- `check_interactions.js` : calculs et réactions des trois nouveaux simulateurs, sans navigateur.
- `check_python_snippets.py` : analyse des 30 exemples Python et exécution hors réseau de 6 groupes représentatifs, si `numpy`, `pandas`, `matplotlib` et `scikit-learn` sont installés.
- `TESTS.md` : résultats obtenus, scénarios de recette manuelle et limites.

**Aucune installation n'est nécessaire pour consulter les cours HTML.** Les fichiers chargent toutefois les styles Tailwind et certaines polices via des serveurs externes ; une connexion Internet est nécessaire pour retrouver l'apparence complète. Certains boutons ouvrent des notebooks Google Colab ou une feuille Google Sheets et demandent les droits correspondants.

## Documentation et publication

- `CHANGELOG.md` : modifications détaillées de la préversion.
- `TESTS.md` : contrôles et réserves de validation.
- Les PDF officiels ont servi à vérifier les notions et challenges ; ils ne sont pas recopiés dans cette archive de code.
- **Aucun nouveau commit, push ni publication GitHub pour le correctif 1.1.1-preview.** La version 1.1.0-preview est déjà en ligne sur `JulienLecomteGit/Guides_ML` ; ce correctif fera l'objet d'un accord distinct.
