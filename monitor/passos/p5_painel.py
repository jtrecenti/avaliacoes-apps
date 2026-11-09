"""Passo 5: calcular os números do painel e gravar docs/painel/dados.json.

O Python calcula só agregados (médias, contagens, porcentagens) e uma lista curta
de avaliações recentes por app e loja, com o texto já mascarado. A página
docs/painel/index.html só lê esse arquivo e desenha: nenhum número é escrito à mão.
"""
import json

import pandas as pd

from .comum import LOJAS, PAINEL, agora

SEMANAS = 12          # semanas na linha do tempo
MIN_SEMANA = 5        # semana com menos avaliações que isso fica sem ponto
RECENTES = 10         # avaliações recentes por app e loja
MAX_TEXTO = 400       # caracteres do texto mostrados na lista
NAO_ESPECIFICOS = {"outro", "crítica geral", "elogio geral"}


def _media(s):
    return round(float(s.mean()), 2) if len(s) else None


def _pct(parte, todo):
    return round(100 * parte / todo, 1) if todo else None


def resumo_loja(x: pd.DataFrame, ex: pd.DataFrame, fim: pd.Timestamp, semanas, temas: list[str]) -> dict:
    """Os números de um app numa loja (ou nas duas). x: base inteira do recorte; ex: anotadas (90 dias)."""
    dt = pd.to_datetime(x["data"])
    u30 = x[dt > fim - pd.Timedelta(days=30)]
    a30 = x[(dt <= fim - pd.Timedelta(days=30)) & (dt > fim - pd.Timedelta(days=60))]
    sem = (x[dt >= semanas[0].start_time]
           .assign(s=lambda d: pd.to_datetime(d["data"]).dt.to_period("W-SUN"))
           .groupby("s")["nota"].agg(["mean", "size"]))
    serie = [round(float(sem.loc[s, "mean"]), 2) if s in sem.index and sem.loc[s, "size"] >= MIN_SEMANA else None
             for s in semanas]
    n_sem = [int(sem.loc[s, "size"]) if s in sem.index else 0 for s in semanas]

    com_resp = ex[ex["reclamacao"].notna()]
    recl = com_resp[com_resp["reclamacao"].astype(bool)]
    recl_tema = recl[recl["tema"].notna()]
    contagem = recl_tema["tema"].value_counts()
    pct_temas = {t: _pct(int(contagem.get(t, 0)), len(recl_tema)) for t in temas}
    especificos = contagem[[t not in NAO_ESPECIFICOS for t in contagem.index]]
    topo = especificos.index[0] if len(especificos) else None
    return {
        "n_total": int(len(x)),
        "data_min": x["data"].min() if len(x) else None,
        "data_max": x["data"].max() if len(x) else None,
        "n_30": int(len(u30)),
        "nota_30": _media(u30["nota"]),
        "nota_30_ant": _media(a30["nota"]),
        "pct_1_estrela_30": _pct(int((u30["nota"] == 1).sum()), len(u30)),
        "semanal": serie,
        "n_semanal": n_sem,
        "n_anotadas_90": int(len(com_resp)),
        "pct_reclamacao_90": _pct(len(recl), len(com_resp)),
        "n_reclamacoes_90": int(len(recl_tema)),
        "temas_reclamacao": pct_temas,
        "tema_principal": topo,
        "pct_tema_principal": pct_temas.get(topo) if topo else None,
    }


def recentes(x: pd.DataFrame, ex: pd.DataFrame) -> list[dict]:
    ult = x.sort_values(["data", "id_avaliacao"], ascending=False).head(RECENTES)
    t = ex.set_index(["loja", "id_avaliacao"])[["tema", "reclamacao"]]
    out = []
    for r in ult.itertuples():
        k = (r.loja, r.id_avaliacao)
        texto = "" if pd.isna(r.texto) else str(r.texto)
        out.append({
            "loja": r.loja, "data": r.data, "nota": int(r.nota),
            "titulo": None if pd.isna(r.titulo) else str(r.titulo),
            "texto": texto[:MAX_TEXTO] + ("…" if len(texto) > MAX_TEXTO else ""),
            "tema": t.loc[k, "tema"] if k in t.index and pd.notna(t.loc[k, "tema"]) else None,
            "reclamacao": bool(t.loc[k, "reclamacao"]) if k in t.index and pd.notna(t.loc[k, "reclamacao"]) else None,
        })
    return out


def calcular(base, est, notas_loja, apps, checagens, contagens, coleta, temas_por_segmento) -> dict:
    fim = pd.Timestamp(coleta[:10])
    # semanas de segunda a domingo; a semana do dia da coleta fica de fora (está incompleta)
    semanas = pd.period_range(end=fim.to_period("W-SUN") - 1, periods=SEMANAS, freq="W-SUN")
    nl = notas_loja.set_index(["empresa", "loja"]) if len(notas_loja) else None
    dados = {
        "atualizado_em": agora().strftime("%Y-%m-%dT%H:%M:%S%z"),
        "coleta_mais_recente": coleta,
        "fonte": "Feed público de avaliações da App Store do Brasil (até 500 mais recentes por app) e Play Store "
                 "do Brasil (500 mais recentes por app, via google-play-scraper). Tema e reclamação classificados "
                 "por IA (Jev) nas avaliações dos últimos 90 dias.",
        "contagens": contagens,
        "checagens": checagens,
        "semanas": [s.start_time.strftime("%d/%m") for s in semanas],
        "lojas": LOJAS,
        "segmentos": {},
        "apps": {},
    }
    for seg, d_seg in apps.groupby("segmento", sort=False):
        temas = temas_por_segmento[seg]
        dados["segmentos"][seg] = {"empresas": list(d_seg["empresa"]), "temas": temas}
        for e in d_seg["empresa"]:
            xb, xe = base[base["empresa"] == e], est[est["empresa"] == e]
            app = {"segmento": seg, "lojas": {"ambas": resumo_loja(xb, xe, fim, semanas, temas)}, "recentes": []}
            for loja in LOJAS:
                xl, el = xb[xb["loja"] == loja], xe[xe["loja"] == loja]
                r = resumo_loja(xl, el, fim, semanas, temas)
                if nl is not None and (e, loja) in nl.index:
                    v = nl.loc[(e, loja)]
                    r["nota_loja"] = round(float(v["nota_loja"]), 2) if pd.notna(v["nota_loja"]) else None
                    r["n_notas_loja"] = int(v["n_notas_loja"]) if pd.notna(v["n_notas_loja"]) else None
                else:
                    r["nota_loja"], r["n_notas_loja"] = None, None
                app["lojas"][loja] = r
                app["recentes"] += recentes(xl, el)
            dados["apps"][e] = app
    return dados


def gravar(dados: dict) -> None:
    PAINEL.mkdir(parents=True, exist_ok=True)
    arq = PAINEL / "dados.json"
    arq.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    n_rec = sum(len(a["recentes"]) for a in dados["apps"].values())
    print(f"  saíram {len(dados['apps'])} apps, {len(dados['checagens'])} checagens e {n_rec} avaliações "
          f"recentes (texto mascarado) em docs/painel/dados.json ({arq.stat().st_size // 1024} KB)")
