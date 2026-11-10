"""Baixa as avaliações de um aplicativo na App Store e na Google Play do Brasil.

Uso:
    python baixar_avaliacoes.py --nome Nubank --app-store 814456780 --play com.nu.production

Saída, na pasta atual:
    brutos/<nome>_app_store_p<N>.json  as páginas do feed da Apple, como chegaram
    avaliacoes_<nome>.csv              loja, app, id, data, nota, titulo, texto, versao
e um resumo na tela: quantas avaliações por loja, de que data a que data, nota média.

Regras: uma página por vez, com pausa; nada do nome ou da foto de quem avaliou;
telefone, e-mail e CPF no texto são mascarados.
"""
import argparse
import json
import re
import time
from pathlib import Path

import pandas as pd
import requests

FEED = "https://itunes.apple.com/br/rss/customerreviews/page={p}/id={app}/sortby=mostrecent/json"
PAUSA = 1.0
MASCARAS = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"), "[e-mail removido]"),
    (re.compile(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b"), "[CPF removido]"),
    (re.compile(r"(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}\b"), "[telefone removido]"),
]


def mascarar(t):
    if not isinstance(t, str):
        return t
    for padrao, troca in MASCARAS:
        t = padrao.sub(troca, t)
    return t


def app_store(nome, id_app, brutos):
    linhas = []
    for p in range(1, 11):
        r = requests.get(FEED.format(p=p, app=id_app), timeout=30, headers={"User-Agent": "avaliacoes-lojas/1.0"})
        r.raise_for_status()
        (brutos / f"{nome}_app_store_p{p}.json").write_text(r.text, encoding="utf-8")  # o bruto primeiro
        entradas = r.json().get("feed", {}).get("entry", [])
        entradas = [entradas] if isinstance(entradas, dict) else entradas
        entradas = [e for e in entradas if "im:rating" in e]
        if not entradas:
            break
        for e in entradas:
            linhas.append({"loja": "App Store", "app": nome, "id": e["id"]["label"], "data": e["updated"]["label"][:10],
                           "nota": int(e["im:rating"]["label"]), "titulo": e["title"]["label"],
                           "texto": e["content"]["label"], "versao": e.get("im:version", {}).get("label")})
        time.sleep(PAUSA)
    return linhas


def google_play(nome, pacote):
    from google_play_scraper import Sort, reviews
    res, _ = reviews(pacote, lang="pt", country="br", sort=Sort.NEWEST, count=500)
    return [{"loja": "Google Play", "app": nome, "id": x["reviewId"], "data": x["at"].strftime("%Y-%m-%d"),
             "nota": int(x["score"]), "titulo": None, "texto": x["content"], "versao": x.get("reviewCreatedVersion")}
            for x in res]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--nome", required=True)
    ap.add_argument("--app-store", required=True, help="o número do app na App Store (id1234 sem o 'id')")
    ap.add_argument("--play", required=True, help="o pacote na Google Play (ex.: com.nu.production)")
    a = ap.parse_args()
    brutos = Path("brutos")
    brutos.mkdir(exist_ok=True)
    base = pd.DataFrame(app_store(a.nome, a.app_store, brutos) + google_play(a.nome, a.play))
    for col in ["titulo", "texto"]:
        base[col] = base[col].map(mascarar)
    antes = len(base)
    base = base.drop_duplicates(["loja", "id"])
    arq = Path(f"avaliacoes_{a.nome}.csv")
    base.to_csv(arq, index=False, encoding="utf-8")
    print(f"{antes} linhas baixadas, {antes - len(base)} repetidas removidas, {len(base)} em {arq}")
    for loja, g in base.groupby("loja"):
        print(f"  {loja}: {len(g)} avaliações, de {g.data.min()} a {g.data.max()}, nota média {g.nota.mean():.2f}")


if __name__ == "__main__":
    main()
