"""Passo 1: coletar as avaliações de hoje nas duas lojas e a nota oficial de cada app.

App Store: o feed público (RSS em JSON) da loja do Brasil, até 10 páginas de 50,
as mais recentes. Play Store: o pacote google-play-scraper, as 500 mais recentes
em português do Brasil. Junto, a nota oficial que a loja mostra e quantas notas
ela soma (a "nota da loja"), para comparar com a nota de quem escreve.

Cada coleta fica em dados/coletas/AAAA-MM-DD/ e nunca é editada depois:
  avaliacoes_HHMM.csv.gz   uma linha por avaliação
  notas_loja_HHMM.csv.gz   uma linha por app e loja
Nome, apelido e foto de quem avaliou não são guardados. Telefone, e-mail e CPF
no texto já saem mascarados.
"""
import time
from datetime import datetime

import pandas as pd
import requests

from .comum import BRT, COLETAS, COLUNAS, COLUNAS_NOTAS_LOJA, GZ, USER_AGENT, agora, ler_apps, mascarar

FEED = "https://itunes.apple.com/br/rss/customerreviews/page={p}/id={app}/sortby=mostrecent/json"
LOOKUP = "https://itunes.apple.com/lookup"
PAGINAS_APP_STORE = 10
N_PLAY_STORE = 500
PAUSA = 1.0  # segundos entre requisições, para não sobrecarregar as lojas

sessao = requests.Session()
sessao.headers["User-Agent"] = USER_AGENT


def _get(url, **kw):
    """Uma requisição com até 3 tentativas (as lojas às vezes respondem com erro passageiro)."""
    for tentativa in range(3):
        try:
            r = sessao.get(url, timeout=30, **kw)
            r.raise_for_status()
            return r
        except requests.RequestException:
            if tentativa == 2:
                raise
            time.sleep(3 * (tentativa + 1))


def coletar_app_store(app) -> list[dict]:
    linhas = []
    for p in range(1, PAGINAS_APP_STORE + 1):
        try:
            r = _get(FEED.format(p=p, app=app.id_app_store))
        except requests.RequestException as e:
            print(f"    App Store {app.empresa}, página {p}: falhou ({type(e).__name__}), paro aqui")
            break
        entradas = r.json().get("feed", {}).get("entry", [])
        if isinstance(entradas, dict):  # página com uma avaliação só vem como objeto
            entradas = [entradas]
        entradas = [e for e in entradas if "im:rating" in e]
        if not entradas:
            break
        for e in entradas:
            data = datetime.fromisoformat(e["updated"]["label"]).astimezone(BRT)
            linhas.append({
                "loja": "app_store", "segmento": app.segmento, "empresa": app.empresa,
                "id_avaliacao": str(e["id"]["label"]), "data": data.strftime("%Y-%m-%d"),
                "nota": int(e["im:rating"]["label"]), "titulo": e.get("title", {}).get("label"),
                "texto": e.get("content", {}).get("label"), "versao": e.get("im:version", {}).get("label"),
            })
        time.sleep(PAUSA)
    return linhas


def coletar_play_store(app) -> list[dict]:
    from google_play_scraper import Sort, reviews
    try:
        res, _ = reviews(app.id_play_store, lang="pt", country="br", sort=Sort.NEWEST, count=N_PLAY_STORE)
    except Exception as e:  # o pacote não padroniza os erros
        print(f"    Play Store {app.empresa}: falhou ({type(e).__name__})")
        return []
    linhas = []
    for x in res:
        # o pacote devolve a hora local da máquina sem fuso; astimezone converte para Brasília
        data = x["at"].astimezone(BRT)
        linhas.append({
            "loja": "play_store", "segmento": app.segmento, "empresa": app.empresa,
            "id_avaliacao": str(x["reviewId"]), "data": data.strftime("%Y-%m-%d"),
            "nota": int(x["score"]), "titulo": None, "texto": x.get("content"),
            "versao": x.get("reviewCreatedVersion"),
        })
    return linhas


def nota_da_loja(app) -> list[dict]:
    """A nota oficial que cada loja mostra para o app e quantas notas ela soma."""
    linhas = []
    try:
        r = _get(LOOKUP, params={"id": app.id_app_store, "country": "br"}).json()["results"][0]
        linhas.append({"loja": "app_store", "segmento": app.segmento, "empresa": app.empresa,
                       "nota_loja": r.get("averageUserRating"), "n_notas_loja": r.get("userRatingCount")})
    except (requests.RequestException, KeyError, IndexError) as e:
        print(f"    nota da App Store de {app.empresa}: falhou ({type(e).__name__})")
    time.sleep(PAUSA)
    try:
        from google_play_scraper import app as play_app
        r = play_app(app.id_play_store, lang="pt", country="br")
        linhas.append({"loja": "play_store", "segmento": app.segmento, "empresa": app.empresa,
                       "nota_loja": r.get("score"), "n_notas_loja": r.get("ratings")})
    except Exception as e:
        print(f"    nota da Play Store de {app.empresa}: falhou ({type(e).__name__})")
    time.sleep(PAUSA)
    return linhas


def coletar() -> str:
    """Coleta tudo e grava em dados/coletas/AAAA-MM-DD/. Devolve o carimbo da coleta (AAAA-MM-DD HHMM)."""
    momento = agora()
    pasta = COLETAS / momento.strftime("%Y-%m-%d")
    pasta.mkdir(parents=True, exist_ok=True)
    hhmm = momento.strftime("%H%M")
    apps = ler_apps()
    linhas, notas = [], []
    for app in apps.itertuples():
        a = coletar_app_store(app)
        time.sleep(PAUSA)
        p = coletar_play_store(app)
        n = nota_da_loja(app)
        print(f"  {app.empresa}: {len(a)} avaliações na App Store, {len(p)} na Play Store")
        linhas += a + p
        notas += n
    base = pd.DataFrame(linhas, columns=COLUNAS)
    mascarados = 0
    for col in ["titulo", "texto"]:
        res = base[col].map(mascarar)
        base[col] = res.str[0]
        mascarados += int(res.str[1].sum())
    base.to_csv(pasta / f"avaliacoes_{hhmm}.csv.gz", index=False, encoding="utf-8", compression=GZ)
    pd.DataFrame(notas, columns=COLUNAS_NOTAS_LOJA).to_csv(pasta / f"notas_loja_{hhmm}.csv.gz", index=False, encoding="utf-8", compression=GZ)
    print(f"  entraram {len(base)} avaliações de {len(apps)} apps; {mascarados} trecho(s) com telefone, "
          f"e-mail ou CPF mascarados; saíram em {pasta.name}/avaliacoes_{hhmm}.csv.gz")
    return f"{pasta.name} {hhmm}"


def ler_coletas(pasta=COLETAS) -> tuple[dict[str, pd.DataFrame], dict[str, pd.DataFrame]]:
    """Lê todas as coletas como chegaram. As chaves são 'AAAA-MM-DD HHMM', em ordem."""
    coletas, notas = {}, {}
    for arq in sorted(pasta.glob("*/avaliacoes_*.csv.gz")):
        chave = f"{arq.parent.name} {arq.name.removeprefix('avaliacoes_').removesuffix('.csv.gz')}"
        coletas[chave] = pd.read_csv(arq, dtype={"id_avaliacao": str, "data": str, "versao": str,
                                                 "titulo": str, "texto": str})
        arq_n = arq.with_name(arq.name.replace("avaliacoes_", "notas_loja_"))
        notas[chave] = pd.read_csv(arq_n) if arq_n.exists() else pd.DataFrame(columns=COLUNAS_NOTAS_LOJA)
    print(f"  {len(coletas)} coleta(s) lida(s), {sum(len(c) for c in coletas.values())} linhas no total")
    return coletas, notas
