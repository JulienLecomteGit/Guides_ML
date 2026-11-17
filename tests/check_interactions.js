/* Tests unitaires des simulateurs JavaScript sans navigateur ni dépendance. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function makeElement(dataset = {}, value = '') {
  return {
    dataset, value, textContent: '', innerHTML: '', className: '', attributes: {}, events: {},
    setAttribute(name, val) { this.attributes[name] = String(val); },
    addEventListener(name, callback) { this.events[name] = callback; },
    trigger(name = 'click') {
      assert.equal(typeof this.events[name], 'function', `écouteur ${name} absent`);
      this.events[name]();
    }
  };
}

function runBinder(filename, document) {
  const html = fs.readFileSync(path.join(root, filename), 'utf8');
  const start = html.indexOf('function bindSimulators() {');
  const end = html.indexOf('\n    function renderSidebar()', start);
  assert.ok(start !== -1 && end > start, `Simulateurs introuvables : ${filename}`);
  vm.runInNewContext(html.slice(start, end) + '\nbindSimulators();', { document }, { filename });
}

// 04. Les quatre nombres doivent produire les quatre métriques mathématiquement justes.
{
  const values = { tn: 45, fp: 10, fn: 15, tp: 30 };
  const counts = Object.entries(values).map(([id, n]) => makeElement({ count: id }, String(n)));
  const outputs = Object.fromEntries(Object.keys(values).map(id => [id, makeElement()]));
  const scores = Object.fromEntries(['precision', 'recall', 'f1', 'specificity'].map(id => [id, makeElement()]));
  const metrics = makeElement();
  metrics.querySelectorAll = selector => selector === '[data-count]' ? counts : [];
  metrics.querySelector = selector => {
    const value = selector.match(/^\[data-value="([^"]+)"\]$/);
    const score = selector.match(/^\[data-score="([^"]+)"\]$/);
    return value ? outputs[value[1]] : score ? scores[score[1]] : null;
  };
  runBinder('Classification_et_arbres.html', {
    getElementById(id) { return id === 'metrics-lab' ? metrics : null; }
  });
  assert.equal(scores.precision.textContent, '75.0 %');
  assert.equal(scores.recall.textContent, '66.7 %');
  assert.equal(scores.f1.textContent, '70.6 %');
  assert.equal(scores.specificity.textContent, '81.8 %');
  counts.find(item => item.dataset.count === 'fp').value = '30';
  metrics.trigger('input');
  assert.equal(scores.precision.textContent, '50.0 %');
  assert.equal(scores.specificity.textContent, '60.0 %');
  console.log('OK  Matrice de confusion : quatre métriques et réaction au curseur');
}

// 05. Même voisins, vote uniforme puis vote pondéré : choix opposé pour k=3.
{
  const ids = ['sim-k1', 'sim-k3', 'sim-k5', 'sim-wu', 'sim-wd', 'k-c1', 'k-c3', 'k-c5', 'sim-k-out'];
  const elements = Object.fromEntries(ids.map(id => [id, makeElement()]));
  runBinder('KNN_classification.html', {
    getElementById(id) { return elements[id] ?? null; },
    querySelectorAll(selector) { return selector === '.k-btn' ? ids.slice(0, 3).map(id => elements[id]) : []; }
  });
  assert.match(elements['sim-k-out'].innerHTML, /Triangle rouge/);
  assert.match(elements['sim-k-out'].innerHTML, /Bleus : 1\.00 · Rouges : 2\.00/);
  elements['sim-wd'].trigger();
  assert.match(elements['sim-k-out'].innerHTML, /Carré bleu/);
  assert.equal(elements['sim-wd'].attributes['aria-pressed'], 'true');
  elements['sim-k5'].trigger();
  assert.match(elements['sim-k-out'].innerHTML, /Carré bleu/);
  elements['sim-k1'].trigger();
  assert.match(elements['sim-k-out'].innerHTML, /Carré bleu/);
  console.log('OK  k-NN : résultats et boutons pour k=1/3/5, uniforme/pondéré');
}

// 06. Changer uniquement la métrique doit inverser le premier voisin.
{
  const buttons = ['euclidean', 'manhattan', 'chebyshev'].map(metric => makeElement({ metric }));
  const lineX = makeElement(), lineY = makeElement(), explanation = makeElement();
  const lab = makeElement();
  lab.querySelectorAll = selector => selector === '[data-metric]' ? buttons : [];
  lab.querySelector = selector => ({
    '#metric-line-x': lineX, '#metric-line-y': lineY, '#metric-expl': explanation
  })[selector] ?? null;
  runBinder('KNN_similarites.html', {
    getElementById(id) { return id === 'metric-lab' ? lab : null; }
  });
  assert.match(explanation.innerHTML, /candidat Y/);
  buttons[1].trigger();
  assert.match(explanation.innerHTML, /candidat X/);
  assert.equal(buttons[1].attributes['aria-pressed'], 'true');
  assert.equal(lineY.attributes.d, 'M50 270 L200 270 L200 120');
  buttons[2].trigger();
  assert.match(explanation.innerHTML, /candidat Y/);
  console.log('OK  Similarités : Euclidienne → Manhattan → Chebyshev');
}

console.log('\nBilan : 3 simulateurs testés sans navigateur (calculs et événements).');
