/* Tests structurels autonomes : node tests/verify-guides.js (aucun paquet à installer). */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const modules = [
  'Machine_learning.html',
  'Regression_lineaire.html',
  'Streamlit_les_graphiques.html',
  'Classification_et_arbres.html',
  'KNN_classification.html',
  'KNN_similarites.html'
];
const sourceHashes = {
  'Machine_learning.html': '3c9290f8fc6b7a436610edf167a8c50f436387eb23ded986ed8623c46842957d',
  'Regression_lineaire.html': 'a178273f071e7455db15eedba3edb20ab298b627c60834c4ad28d09588196aad',
  'Streamlit_les_graphiques.html': '9f97c6a815afc8cac383ab9bde405dbf1cf7af85201ff6cda917cc97bf2ca945'
};
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
let passed = 0;
let failed = 0;

function check(label, fn) {
  try {
    fn();
    console.log(`OK  ${label}`);
    passed++;
  } catch (error) {
    console.error(`KO  ${label} : ${error.message}`);
    failed++;
  }
}

check('Accueil : les six liens existent et ciblent les bons fichiers', () => {
  const home = read('index.html');
  const links = [...home.matchAll(/<a class="card" href="([^"]+\.html)">/g)].map(m => m[1]);
  assert.deepEqual(links, modules);
  for (const file of links) assert.ok(fs.statSync(path.join(root, file)).isFile());
});

check('Accueil : contenu transmis conservé à l’octet près', () => {
  const digest = crypto.createHash('sha256').update(read('index.html'), 'utf8').digest('hex');
  assert.equal(digest, '19fc19c1cdcbbddacadddc6a8783aae1c58fec4c5fd220a1a2e3ee2f09053266');
});

check('Navigation : le bouton Accueil est identique dans les six guides', () => {
  let commonClass;
  for (const name of modules) {
    const page = read(name);
    const found = [...page.matchAll(/<a href="index\.html" aria-label="Retour à l'accueil" class="([^"]+)">\s*← Accueil\s*<\/a>/g)];
    assert.equal(found.length, 1, `${name} doit avoir exactement un bouton Accueil`);
    if (commonClass === undefined) commonClass = found[0][1];
    assert.equal(found[0][1], commonClass, `Style du bouton incohérent dans ${name}`);
  }
});

// En retirant uniquement le nouveau lien et son conteneur de mise en page,
// le SHA256 doit être celui du HTML fourni avant la refonte.
function removeHomeAddition(html) {
  const pattern = /\n        <div class="flex items-center gap-2 flex-wrap">\n          <a href="index\.html" aria-label="Retour à l'accueil" class="[^"]+">\n            ← Accueil\n          <\/a>\n(          <span[\s\S]*?\n          <\/span>)\n        <\/div>/;
  let replacements = 0;
  const clean = html.replace(pattern, (_, badge) => {
    replacements++;
    return '\n' + badge.split('\n').map(line => line.slice(2)).join('\n');
  });
  assert.equal(replacements, 1, 'Impossible d’isoler la modification de navigation');
  // apply_patch ajoute un saut de ligne final de formatage ; les 3 originaux n'en avaient pas.
  return clean.endsWith('\n') ? clean.slice(0, -1) : clean;
}

for (const [filename, originalHash] of Object.entries(sourceHashes)) {
  check(`${filename} : contenu original préservé à l'octet près`, () => {
    const restored = removeHomeAddition(read(filename));
    const digest = crypto.createHash('sha256').update(restored, 'utf8').digest('hex');
    assert.equal(digest, originalHash);
  });
}

check('Tous les scripts JavaScript sont syntaxiquement corrects', () => {
  for (const name of ['index.html', ...modules]) {
    const html = read(name);
    const scriptRE = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g;
    for (const [, code] of html.matchAll(scriptRE)) {
      if (code.trim()) new vm.Script(code, { filename: name });
    }
  }
});

check('Les trois nouveaux guides ont leur progression et leurs ateliers', () => {
  for (const name of modules.slice(3)) {
    const html = read(name);
    assert.ok(html.includes('const LESSON_ROUTES = ['), name);
    assert.ok(html.includes('renderLessonRoute(currentIdx)'), name);
    assert.ok(html.includes('class="lesson-route"'), name);
  }
  assert.ok(read('Classification_et_arbres.html').includes('renderMetricsLab()'));
  assert.ok(read('KNN_classification.html').includes('refreshKnnSim()'));
  assert.ok(read('KNN_similarites.html').includes('renderMetricLab()'));
  assert.ok(read('KNN_similarites.html').includes('renderBookLab()'));
});

check('Liens des challenges et identifiant Pokémon cohérent avec les PDF', () => {
  const classHTML = read('Classification_et_arbres.html');
  const knnHTML = read('KNN_classification.html');
  const simHTML = read('KNN_similarites.html');
  assert.ok(classHTML.includes('1PaQr9SH5pzDm7UigN_c2COmFeniipZVa'));
  assert.ok(knnHTML.includes('1a_EdpqmAi23HuY1lK9XYxkX77vmlBlYR'));
  assert.ok(simHTML.includes('1J4rvTUxXRuQiloRF29sddHfG5e5MtbGs'));
  assert.ok(simHTML.includes('1gdPM1zWxSFXAYdjkh02ykAD2VvI5dJb56UANSpOPEm8'));
  assert.ok(!simHTML.includes('1gdPM1zWxSFXAYdjkh02ykAD2VvI5dJb56UANSp0PEm8'));
});

check('Notions fondamentales présentes dans les trois cours refondus', () => {
  const required = {
    'Classification_et_arbres.html': ['sigmoïde', 'gini', 'entropie', 'RandomForestClassifier', 'GradientBoostingClassifier', 'spécificité', 'class_weight', 'stratify'],
    'KNN_classification.html': ['StandardScaler', 'factorize', 'get_dummies', 'DummyClassifier', 'confusion_matrix', 'weights', 'GridSearchCV'],
    'KNN_similarites.html': ['NearestNeighbors', 'radius_neighbors', 'kneighbors', 'PCA', 'argsort', 'chebyshev', 'Giratina', 'Mewtwo']
  };
  for (const [filename, terms] of Object.entries(required)) {
    const source = read(filename).toLowerCase();
    for (const term of terms) assert.ok(source.includes(term.toLowerCase()), `${filename} : ${term} absent`);
  }
});

console.log(`\nBilan : ${passed} contrôle(s) OK, ${failed} échec(s).`);
if (failed) process.exitCode = 1;
