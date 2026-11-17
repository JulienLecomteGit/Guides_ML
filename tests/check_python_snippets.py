"""Teste les exemples Python des fiches : syntaxe + exécution hors réseau.

Commande : python tests/check_python_snippets.py
Aucune installation n'est effectuée. Les tests d'exécution demandent pandas,
numpy et scikit-learn déjà installés ; les analyses syntaxiques fonctionnent sans.
"""

from __future__ import annotations

import ast
import contextlib
import io
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
GUIDES = {
    "Classification_et_arbres.html": 12,
    "KNN_classification.html": 10,
    "KNN_similarites.html": 8,
}


def read_code_actions(file_name: str) -> dict[str, str]:
    html = (ROOT / file_name).read_text(encoding="utf-8")
    assert "const CODE_ACTIONS = [" in html, file_name
    section = html.split("const CODE_ACTIONS = [", 1)[1].split("\n];", 1)[0]
    regex = re.compile(
        r"\{\s*id:\s*'([^']+)',\s*num:\s*'[^']+'"
        r"[\s\S]*?\bcode:\s*`([\s\S]*?)`,\s*\n\s*tip:",
        re.MULTILINE,
    )
    actions = dict(regex.findall(section))
    assert len(actions) == GUIDES[file_name], (
        f"{file_name}: {len(actions)} codes isolés, "
        f"{GUIDES[file_name]} attendus"
    )
    return actions


def run(code: str, variables: dict) -> str:
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exec(compile(code, "guide_code.py", "exec"), variables)
    return output.getvalue()


def main() -> None:
    actions = {}
    checked = 0
    executed = 0
    for file_name in GUIDES:
        snippets = read_code_actions(file_name)
        for action_id, code in snippets.items():
            ast.parse(code, filename=f"{file_name}/{action_id}")
            checked += 1
        actions.update(snippets)
        print(f"OK  {file_name} : {len(snippets)} blocs Python analysés")
    print(f"OK  Syntaxe Python : {checked} / {checked} blocs valides")

    try:
        import numpy as np
        import pandas as pd
        from sklearn.datasets import make_classification
        from sklearn.model_selection import train_test_split
    except ImportError as exc:
        print(f"NON TESTÉ  Exécution : dépendance absente ({exc})")
        return

    # Le cours Similarités : les données des livres sont désormais incluses.
    books = run(actions["ks-02"], {})
    assert "Livre 5 : distance = 14.14" in books, books
    assert "Livre 3 : distance = 20.62" in books, books
    assert "Livre 0 : distance = 33.54" in books, books
    executed += 1
    print("OK  Livres : indices et trois distances du PDF")

    # Les actions fruits sont des blocs successifs : A03 prépare A04, A06 et A07.
    fruits: dict = {}
    run(actions["ks-03"], fruits)
    results = run(actions["ks-04"], fruits)
    assert "Poire : distance = 0.57" in results, results
    assert "Banane : distance = 0.80" in results, results
    run(actions["ks-06"], fruits)
    assert list(np.round(fruits["distances"][0][:3], 2)) == [0.0, 0.57, 0.8]
    assert len(fruits["indices"][0]) == 5
    executed += 1
    print("OK  Fruits : StandardScaler, voisins et rayon trié")

    # Matplotlib en mode sans interface : aucune fenêtre, aucune écriture.
    try:
        import matplotlib
    except ImportError:
        print("NON TESTÉ  Projection PCA : matplotlib absent")
    else:
        matplotlib.use("Agg")
        run(actions["ks-07"], fruits)
        executed += 1
        print("OK  Fruits : projection PCA en deux dimensions")

    changed = run(actions["ks-08"], {})
    assert "plus proche : Y" in changed, changed
    assert "plus proche : X" in changed, changed
    executed += 1
    print("OK  Métriques : classement inversé Euclidienne / Manhattan")

    # Le challenge Pokémon utilise un tableau fictif seulement pour le test.
    stats = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"]
    pokemon = pd.DataFrame(
        [
            {"Name": f"Non-leg-{i}", "Legendary": False,
             **{stat: 30 + i * 4 + j for j, stat in enumerate(stats)}}
            for i in range(10)
        ] + [{"Name": "Mewtwo", "Legendary": True,
              **{stat: 92 + j * 3 for j, stat in enumerate(stats)}}]
    )
    pokemon_ctx: dict = {"pokemon": pokemon}
    run(actions["ks-05"], pokemon_ctx)
    assert pokemon_ctx["cible_s"].shape == (1, 6)
    assert len(pokemon_ctx["indices"][0]) == 3
    assert not pokemon_ctx["non_leg"]["Legendary"].any()
    executed += 1
    print("OK  Pokémon fictifs : cible externe et trois voisins non légendaires")

    # Le nouveau code de validation croisée conserve le test totalement séparé.
    X, y = make_classification(
        n_samples=150, n_features=6, n_informative=4,
        n_redundant=0, random_state=42,
    )
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, stratify=y, random_state=42,
    )
    cv_ctx = {
        "X_train": X_train, "X_test": X_test,
        "y_train": y_train, "y_test": y_test,
    }
    cv_output = run(actions["kc-10"], cv_ctx)
    assert "Meilleur k :" in cv_output and "F1 final :" in cv_output
    executed += 1
    print("OK  KNN : GridSearchCV sur le train puis évaluation du test final")

    print(f"\nBilan : {checked} blocs Python valides ; {executed} groupes d'exécution contrôlés.")


if __name__ == "__main__":
    main()
