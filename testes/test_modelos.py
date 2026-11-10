"""Os dois modelos do passo 5 (mapa e regressão), com dados inventados e sem internet."""
import json

import numpy as np
import pandas as pd

from passos.p5_modelos import mapa, regressao_segmento, texto_mapa, vetores

FRASES = {
    "pix e pagamentos": ["o pix não cai na conta", "transferência pix demora demais", "pix agendado não saiu"],
    "acesso e login": ["não consigo entrar com a senha", "biometria não funciona para entrar", "esqueci a senha e travou"],
    "cartão e fatura": ["fatura do cartão veio errada", "cartão recusado na compra", "cartão bloqueado sem motivo"],
}


def anotadas(n_por_tema=40, seed=1):
    """Avaliações anotadas parecidas com as do passo 4: o tema muda a nota."""
    rng = np.random.default_rng(seed)
    base_nota = {"pix e pagamentos": 2.0, "acesso e login": 1.2, "cartão e fatura": 3.0}
    linhas = []
    for tema, frases in FRASES.items():
        for i in range(n_por_tema):
            empresa = ["Nubank", "Itaú"][i % 2]
            loja = ["app_store", "play_store"][(i // 2) % 2]
            nota = int(np.clip(round(base_nota[tema] + rng.normal(0, 0.5) + (0.3 if empresa == "Nubank" else 0)), 1, 5))
            linhas.append({"segmento": "Bancos", "empresa": empresa, "loja": loja, "id_avaliacao": f"{tema}-{i}",
                           "data": "2026-11-01", "nota": nota, "titulo": None,
                           "texto": f"{frases[i % 3]} {i}", "tema": tema, "conf_tema": 0.9,
                           "reclamacao": True, "conf_reclamacao": 0.95})
    return pd.DataFrame(linhas)


def test_regressao_tem_uma_linha_por_tema_com_intervalo():
    d = anotadas()
    r = regressao_segmento(d, minimo=30)
    assert r["formula"] == "nota ~ C(tema) + C(empresa) + C(loja)"
    assert r["n"] == len(d) and r["n_fora"] == 0
    assert 0 <= r["r2"] <= 1
    assert {t["tema"] for t in r["temas"]} == set(FRASES)
    medias = [t["media_ajustada"] for t in r["temas"]]
    assert medias == sorted(medias)
    for t in r["temas"]:
        assert t["ic_inf"] < t["media_ajustada"] < t["ic_sup"]
        assert set(t) == {"tema", "n", "media_ajustada", "ic_inf", "ic_sup", "media_bruta"}
    assert r["temas"][0]["tema"] == "acesso e login"
    assert r["destaques"][0] == "acesso e login"
    assert "acesso e login" in r["conclusao"]
    assert "–" not in r["conclusao"] and "—" not in r["conclusao"]  # sem travessão


def test_regressao_tira_quem_nao_reclama_e_junta_temas_pequenos():
    d = anotadas()
    d.loc[:4, "reclamacao"] = False
    d.loc[5:6, "tema"] = None
    extra = d.iloc[:5].assign(tema="tarifas e cobranças", reclamacao=True, id_avaliacao=lambda x: "t" + x["id_avaliacao"])
    r = regressao_segmento(pd.concat([d, extra], ignore_index=True), minimo=30)
    assert r["n_fora"] == 7
    assert r["n_temas_pequenos"] == 5
    assert "tarifas e cobranças" not in {t["tema"] for t in r["temas"]}


def test_vetores_sao_sempre_iguais_e_tem_tamanho_um():
    textos = [texto_mapa(None, t) for t in anotadas()["texto"]]
    a, ok_a = vetores(textos)
    b, ok_b = vetores(textos)
    assert np.allclose(a, b) and (ok_a == ok_b).all()
    assert np.allclose(np.linalg.norm(a[ok_a], axis=1), 1)


def test_texto_so_com_stopwords_fica_fora_do_mapa():
    textos = [texto_mapa(None, t) for t in anotadas()["texto"]] + ["e o de que"]
    _, ok = vetores(textos)
    assert not ok[-1] and ok[:-1].all()


def test_mapa_em_colunas_do_mesmo_tamanho_e_pequeno():
    d = anotadas().assign(titulo="Fulano Pereira")  # na App Store, tem gente que põe o nome no título
    m = mapa(d)
    s = m["segmentos"]["Bancos"]
    assert not any("Fulano" in t for t in s["texto"])
    n = s["n"]
    assert n + s["fora"] == len(anotadas())
    for c in ("x", "y", "empresa", "loja", "tema", "nota", "reclamacao", "conf_tema", "texto"):
        assert len(s[c]) == n, c
    assert all(len(t) <= 140 for t in s["texto"])
    assert set(s["categorias"]["empresa"]) == {"Nubank", "Itaú"}
    assert max(s["tema"]) < len(s["categorias"]["tema"])
    json.dumps(m)  # vira JSON sem erro
