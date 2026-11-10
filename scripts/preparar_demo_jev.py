"""Prepara a pasta demos/4-anotar-com-jev: as avaliações de delivery e o dicionário.

avaliacoes_delivery.csv: as 100 avaliações mais recentes de cada app e loja do
segmento Delivery (600 linhas), sem título (muita gente escreve o próprio nome
nele) e com o texto já mascarado.
dicionario.json: as instruções, a pergunta do tema com as opções do Delivery e a
pergunta de reclamação, do dicionário do monitor.
O .env (com JEV_API_KEY) é copiado da raiz do repositório e nunca vai para o Git.

Uso: python scripts/preparar_demo_jev.py
"""
import json
import shutil
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parents[1]
PASTA = RAIZ / "demos/4-anotar-com-jev"

av = pd.read_csv(RAIZ / "monitor/dados/processados/avaliacoes.csv.gz", dtype={"id_avaliacao": str})
d = av[(av.segmento == "Delivery") & av.texto.fillna("").str.strip().ne("")]
d = d.sort_values("data", ascending=False).groupby(["empresa", "loja"]).head(100)
d = d.assign(loja=d.loja.map({"app_store": "App Store", "play_store": "Google Play"}))
saida = d[["id_avaliacao", "empresa", "loja", "data", "nota", "texto"]].rename(columns={"id_avaliacao": "id", "empresa": "app"})
saida.sort_values(["app", "loja", "data"]).to_csv(PASTA / "avaliacoes_delivery.csv", index=False, encoding="utf-8")
print(f"{len(av)} avaliações na base; {len(saida)} saíram para a demonstração (100 por app e loja)")

dic = json.loads((RAIZ / "monitor/regras/dicionario.json").read_text(encoding="utf-8"))
mini = {
    "_instrucoes": dic["_instrucoes"],
    "variaveis": {
        "tema": {"pergunta": dic["variaveis"]["tema"]["pergunta"], "tipo": "escolha",
                 "opcoes": dic["variaveis"]["tema"]["opcoes_por_segmento"]["Delivery"]},
        "reclamacao": {"pergunta": dic["variaveis"]["reclamacao"]["pergunta"], "tipo": "sim_nao"},
    },
}
(PASTA / "dicionario.json").write_text(json.dumps(mini, ensure_ascii=False, indent=2), encoding="utf-8")
if (RAIZ / ".env").exists():
    shutil.copy(RAIZ / ".env", PASTA / ".env")
print("pasta pronta:", sorted(p.name for p in PASTA.iterdir()))
