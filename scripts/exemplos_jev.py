"""Exemplos reais do Jev para os slides de estruturação de textos.

1. Chama o Jev (o mesmo pedido do monitor) para três avaliações e guarda a
   probabilidade de cada opção, e não só a escolhida.
2. Sorteia (semente fixa) oito avaliações anotadas do cache, metade com
   confiança baixa, para a tabela do "teste em dez".
Grava scripts/exemplos_jev.json, que o dados_slides.py leva para os slides.

Uso: python scripts/exemplos_jev.py   (precisa de JEV_API_KEY no .env)
"""
import asyncio
import json
import os
import sys
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ / "monitor"))
from passos.p4_anotar import MODELO, ler_cache, marca, perguntas  # noqa: E402

for linha in (RAIZ / ".env").read_text(encoding="utf-8").splitlines():
    if "=" in linha and not linha.startswith("#"):
        k, v = linha.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())
os.environ.setdefault("TYPESAFE_API_KEY", os.environ.get("JEV_API_KEY", ""))

EXEMPLOS = [  # (empresa, trecho do texto)
    ("Itaú", "Não estou conseguindo acessar a fatura do cartão de crédito"),
    ("Zé Delivery", "Cerveja quente"),
    (None, "Praticidade e ótimos descontos"),
]

dic = json.loads((RAIZ / "monitor/regras/dicionario.json").read_text(encoding="utf-8"))
av = pd.read_csv(RAIZ / "monitor/dados/processados/avaliacoes.csv.gz")
av["completo"] = av.titulo.fillna("") + " " + av.texto.fillna("")


async def chamar(linhas):
    from typesafe_sdk import AsyncTypeSafeClient
    cli = AsyncTypeSafeClient(model=MODELO)
    saida = []
    for x in linhas:
        estado = {k: str(v) for k, v in {"titulo": x.titulo, "texto": x.texto}.items() if not pd.isna(v) and str(v).strip()}
        r = await cli.system_one(state=estado, questions=perguntas(dic, x.segmento), model=MODELO)
        t, rec = r.answers["tema"], r.answers["reclamacao"]
        probs = sorted(t.probabilities.items(), key=lambda kv: -kv[1])
        saida.append({"empresa": x.empresa, "segmento": x.segmento, "loja": x.loja, "nota": int(x.nota),
                      "titulo": "" if pd.isna(x.titulo) else x.titulo, "texto": x.texto, "estado": estado,
                      "tema": t.choice, "probs": [[k, round(v, 3)] for k, v in probs[:5]],
                      "reclamacao": round(rec.noul, 3)})
    return saida


linhas = []
for emp, trecho in EXEMPLOS:
    achou = av[((av.empresa == emp) if emp else True) & av.completo.str.contains(trecho, regex=False)]
    if len(achou):
        linhas.append(achou.iloc[0])
chamadas = asyncio.run(chamar(linhas))

# tabela do teste: 8 avaliações do Delivery, metade com confiança baixa
cache = ler_cache()
dl = av[av.segmento == "Delivery"].copy()
dl["marca"] = [marca(s, a, b) for s, a, b in zip(dl.segmento, dl.titulo, dl.texto)]
dl = dl[dl.marca.isin(cache)]
dl["tema"] = dl.marca.map(lambda m: cache[m]["tema"])
dl["conf"] = dl.marca.map(lambda m: cache[m]["conf_tema"])
dl["rec"] = dl.marca.map(lambda m: cache[m]["reclamacao"])
dl = dl[dl.texto.fillna("").str.len().between(25, 110)]
alta = dl[dl.conf >= 0.9].sample(4, random_state=7)
baixa = dl[dl.conf < 0.6].sample(4, random_state=7)
tabela = [{"empresa": r.empresa, "nota": int(r.nota), "texto": r.texto, "tema": r.tema, "conf": round(r.conf, 2),
           "reclama": bool(r.rec)} for r in pd.concat([alta, baixa]).sample(frac=1, random_state=3).itertuples()]

out = {"modelo": MODELO, "chamadas": chamadas, "tabela": tabela,
       "opcoes": dic["variaveis"]["tema"]["opcoes_por_segmento"], "instrucoes": dic["_instrucoes"],
       "pergunta_tema": dic["variaveis"]["tema"]["pergunta"], "pergunta_rec": dic["variaveis"]["reclamacao"]["pergunta"]}
(RAIZ / "scripts/exemplos_jev.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for c in chamadas:
    print(c["empresa"], "|", c["texto"][:60], "|", c["probs"][:3], "| reclama", c["reclamacao"])
for t in tabela:
    print(t["conf"], t["tema"], "|", t["texto"][:70])
