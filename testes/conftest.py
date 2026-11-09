"""Deixa os testes importarem os passos do monitor (monitor/passos/)."""
import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "monitor"))

from passos.comum import COLUNAS  # noqa: E402


def linha(**kw):
    base = {"loja": "app_store", "segmento": "Bancos", "empresa": "Nubank", "id_avaliacao": "1",
            "data": "2026-11-08", "nota": 5, "titulo": "Bom", "texto": "Gostei do app", "versao": "1.0"}
    base.update(kw)
    return base


@pytest.fixture
def coletas():
    """Duas coletas pequenas e boas: a avaliação 1 aparece nas duas, editada na segunda."""
    apps_lojas = [("Nubank", "Bancos"), ("iFood", "Delivery")]
    c1, c2 = [], []
    for i, (e, s) in enumerate(apps_lojas):
        for loja in ("app_store", "play_store"):
            c1.append(linha(empresa=e, segmento=s, loja=loja, id_avaliacao=f"{e}-{loja}-1", data="2026-11-07"))
            c2.append(linha(empresa=e, segmento=s, loja=loja, id_avaliacao=f"{e}-{loja}-2", data="2026-11-08"))
    c1.append(linha(id_avaliacao="1", nota=5, texto="Ótimo"))
    c2.append(linha(id_avaliacao="1", nota=1, texto="Piorou depois da atualização"))
    return {"2026-11-08 0900": pd.DataFrame(c1, columns=COLUNAS),
            "2026-11-09 0900": pd.DataFrame(c2, columns=COLUNAS)}


@pytest.fixture
def apps():
    return pd.DataFrame({"segmento": ["Bancos", "Delivery"], "empresa": ["Nubank", "iFood"],
                         "id_app_store": ["1", "2"], "id_play_store": ["a", "b"]})


@pytest.fixture
def notas():
    n = pd.DataFrame([{"loja": l, "segmento": s, "empresa": e, "nota_loja": 4.8, "n_notas_loja": 1000}
                      for e, s in [("Nubank", "Bancos"), ("iFood", "Delivery")] for l in ("app_store", "play_store")])
    return {"2026-11-08 0900": n, "2026-11-09 0900": n}
