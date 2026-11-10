"""Experimento do slide "Contar com o modelo e contar com um script".

Pega as avaliações de um app numa loja, pergunta ao modelo três vezes (três
chamadas independentes, como três conversas novas) quantas citam o Pix, e conta
com uma regra fixa em Python. Grava o resultado em scripts/experimento_contagem.json,
que o dados_slides.py leva para a cena.

Uso: python scripts/experimento_contagem.py   (precisa de OPENAI_API_KEY no .env)
"""
import json
import os
import re
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parents[1]
APP, LOJA = "Itaú", "app_store"
MODELO = "gpt-5.6-luna"
REGRA = r"\bpix\b"

for linha in (RAIZ / ".env").read_text(encoding="utf-8").splitlines():
    if "=" in linha and not linha.startswith("#"):
        k, v = linha.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

d = pd.read_csv(RAIZ / "monitor/dados/processados/avaliacoes.csv.gz")
d = d[(d.empresa == APP) & (d.loja == LOJA)].sort_values("data", ascending=False).reset_index(drop=True)
textos = (d.titulo.fillna("") + ". " + d.texto.fillna("")).tolist()
script = int(sum(bool(re.search(REGRA, t, flags=re.I)) for t in textos))

from openai import OpenAI  # noqa: E402

cli = OpenAI()
corpo = "\n".join(f"{i + 1}. {t}" for i, t in enumerate(textos))
pergunta = f"Abaixo estão {len(textos)} avaliações do aplicativo do {APP}. Quantas delas citam o Pix? Responda só com o número."
respostas = []
for _ in range(3):
    r = cli.responses.create(model=MODELO, input=f"{pergunta}\n\n{corpo}")
    m = re.search(r"\d+", r.output_text)
    respostas.append(int(m.group()) if m else None)
    print("modelo:", r.output_text.strip()[:80])

saida = {"app": APP, "loja": "App Store", "n": len(textos), "modelo": MODELO, "pergunta": pergunta,
         "respostas_modelo": respostas, "regra": REGRA, "script": script}
(RAIZ / "scripts/experimento_contagem.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
print(saida)
