"""Leva os números do monitor para os slides. Nada escrito à mão nas cenas.

Lê docs/painel/dados.json (agregados), monitor/dados/processados (para a
avaliação de exemplo), o cache do Jev, scripts/experimento_contagem.json e
scripts/exemplos_jev.json, e reescreve o bloco DADOS_AP de slides/recursos/aula.js
(entre DADOS-INICIO e DADOS-FIM).

Uso: python scripts/dados_slides.py   (depois, quarto render em slides/)
"""
import hashlib
import json
import re
import sys
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ / "monitor"))
from passos.p4_anotar import marca  # noqa: E402  (a mesma marca do cache)

# A avaliação do slide "uma avaliação vira uma linha": uma nota 5 que reclama.
EXEMPLO = ("Itaú", "Não estou conseguindo acessar a fatura do cartão de crédito")
# Fora do "tema número 1": não são assuntos concretos.
GENERICOS = {"outro", "crítica geral", "elogio geral", "sugestão de recurso"}
# Medido na primeira rodada completa do passo 4 (9/11/2026), que não fica no dados.json.
JEV_RODADA = {"textos": 5267, "segundos": 63}

d = json.loads((RAIZ / "docs/painel/dados.json").read_text(encoding="utf-8"))
data_coleta = pd.Timestamp(d["coleta_mais_recente"].split()[0]).strftime("%d/%m/%Y")


def br(v, casas=1):
    return f"{v:.{casas}f}".replace(".", ",")


# ---- apps: nota da loja x escrita (30 dias) ---------------------------------
apps = []
for nome, a in d["apps"].items():
    item = {"empresa": nome, "segmento": a["segmento"]}
    for k, chave in (("ios", "app_store"), ("play", "play_store")):
        L = a["lojas"].get(chave)
        if L and L.get("nota_loja") and L.get("nota_30"):
            item[k] = {"nota_loja": L["nota_loja"], "n_loja": L["n_notas_loja"], "media_escrita": L["nota_30"], "n": L["n_30"]}
    apps.append(item)

# ---- temas das reclamações (90 dias, as duas lojas) --------------------------
temas = {}
for seg, S in d["segmentos"].items():
    emp = S["empresas"]
    pct = {e: d["apps"][e]["lojas"]["ambas"]["temas_reclamacao"] for e in emp}
    concretos = [t for t in S["temas"] if t not in GENERICOS]
    media = {t: sum(pct[e].get(t, 0) for e in emp) / len(emp) for t in concretos}
    lista = sorted(concretos, key=lambda t: -media[t])[:8]
    top = {e: max(concretos, key=lambda t: pct[e].get(t, 0)) for e in emp}
    for e in emp:  # o tema número 1 de cada app precisa aparecer
        if top[e] not in lista:
            lista[-1] = top[e]
    temas[seg] = {"apps": emp, "temas": lista, "pct": pct, "top": top,
                  "reclama": {e: d["apps"][e]["lojas"]["ambas"]["pct_reclamacao_90"] for e in emp}}

# ---- a avaliação de exemplo ---------------------------------------------------
av = pd.read_csv(RAIZ / "monitor/dados/processados/avaliacoes.csv.gz")
cache = {}
for linha in (RAIZ / "monitor/dados/estruturado/cache.jsonl").read_text(encoding="utf-8").splitlines():
    if linha.strip():
        r = json.loads(linha)
        cache[r["marca"]] = r
ex = av[(av.empresa == EXEMPLO[0]) & av.texto.fillna("").str.contains(EXEMPLO[1], regex=False)].iloc[0]
resp = cache[marca(ex.segmento, ex.titulo, ex.texto)]
linha_ex = {
    "empresa": ex.empresa, "loja": "App Store" if ex.loja == "app_store" else "Google Play", "nota": int(ex.nota),
    "titulo": "" if pd.isna(ex.titulo) else ex.titulo, "texto": ex.texto,
    "tema": resp["tema"], "conf_tema": resp["conf_tema"],
    "reclamacao": "sim" if resp["reclamacao"] else "não", "conf_reclamacao": resp["conf_reclamacao"],
}

# ---- textos das legendas (calculados) -----------------------------------------
B, Dl = temas["Bancos"], temas["Delivery"]
tops_b = set(B["top"].values())
if len(tops_b) == 1:
    t = tops_b.pop()
    vals = sorted((B["pct"][e][t], e) for e in B["apps"])
    leg_b = (f"**Bancos:** nos quatro, o tema número 1 é **{t}**: de {br(vals[0][0], 0)}% das reclamações "
             f"({vals[0][1]}) a {br(vals[-1][0], 0)}% ({vals[-1][1]}).")
else:
    leg_b = "**Bancos:** " + "; ".join(f"{e}, {B['top'][e]}" for e in B["apps"]) + "."
mais_reclama = max(Dl["apps"], key=lambda e: Dl["reclama"][e])
leg_d = ("**Delivery:** " + "; ".join(f"no {e}, **{Dl['top'][e]}**" for e in Dl["apps"]) +
         f". E {br(Dl['reclama'][mais_reclama], 0)}% das avaliações do {mais_reclama} reclamam de algo.")
leg_d = leg_d.replace("no iFood", "no iFood").replace("no Zé Delivery", "no Zé Delivery")

pares = [(a["empresa"], k, a[k]) for a in apps for k in ("ios", "play") if k in a]
abaixo = sum(1 for _, _, s in pares if s["media_escrita"] < s["nota_loja"])
maior = max(pares, key=lambda p: p[2]["nota_loja"] - p[2]["media_escrita"])
leg_notas = (f"Em **{abaixo} dos {len(pares)}** pares de app e loja, quem escreve dá nota menor que a média da loja. "
             f"A maior distância: {maior[0]} na {'App Store' if maior[1] == 'ios' else 'Google Play'}, "
             f"{br(maior[2]['nota_loja'])} na página e {br(maior[2]['media_escrita'])} nas escritas.")

c = d["contagens"]
contagem = json.loads((RAIZ / "scripts/experimento_contagem.json").read_text(encoding="utf-8"))
jev = json.loads((RAIZ / "scripts/exemplos_jev.json").read_text(encoding="utf-8"))
DADOS = {
    "contagem": contagem, "jev": {"chamadas": jev["chamadas"], "tabela": jev["tabela"]},
    "apps": apps, "temas": temas, "linha": linha_ex,
    "checagens": [{"frase": x["frase"], "nivel": x["nivel"], "ok": x["ok"]} for x in d["checagens"]],
    "fonte": f"App Store e Google Play, coleta de {data_coleta}; média das escritas: últimos 30 dias",
    "fonte_temas": f"% das avaliações que reclamam, por tema; últimos 90 dias, as duas lojas; coleta de {data_coleta}",
    "texto": {
        "n_avaliacoes": f"{c['avaliacoes_unicas']:,}".replace(",", "."),
        "n_anotadas": f"{c['anotadas_90_dias']:,}".replace(",", "."),
        "n_textos_jev": f"{JEV_RODADA['textos']:,}".replace(",", "."),
        "seg_jev": str(JEV_RODADA["segundos"]),
        "conf_baixa": f"{c['confianca_baixa_tema']:,}".replace(",", "."),
        "pct_conf_baixa": f"{100 * c['confianca_baixa_tema'] / c['anotadas_90_dias']:.0f}%",
        "opcoes_bancos": ", ".join(d["segmentos"]["Bancos"]["temas"]),
        "leg_temas_bancos": leg_b, "leg_temas_delivery": leg_d, "leg_notas": leg_notas,
        "n_checagens": str(len(d["checagens"])), "n_ok": str(sum(x["ok"] for x in d["checagens"])),
    },
}

js = RAIZ / "slides/recursos/aula.js"
t = js.read_text(encoding="utf-8")
t = re.sub(r"/\* DADOS-INICIO \*/.*?/\* DADOS-FIM \*/",
           lambda m: "/* DADOS-INICIO */\nconst DADOS_AP = " + json.dumps(DADOS, ensure_ascii=False) + ";\n/* DADOS-FIM */",
           t, flags=re.S)
js.write_text(t, encoding="utf-8")

print("legendas:\n ", leg_b, "\n ", leg_d, "\n ", leg_notas)
print("exemplo:", linha_ex)
