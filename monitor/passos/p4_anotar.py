"""Passo 4: anotar os textos com IA (o tema de cada avaliação e se ela reclama de algo).

Usa o Jev (pacote typesafe-sdk), que responde perguntas tipadas e devolve a
confiança de cada resposta. As perguntas e as opções ficam em
regras/dicionario.json, com uma lista de temas para cada segmento (bancos e
delivery têm assuntos diferentes). Só entram as avaliações dos últimos 90 dias
que têm texto.

Cache: dados/estruturado/cache.jsonl guarda, para cada texto, só uma marca
(sha1 do segmento, do título e do texto) e as respostas, nunca o texto. Textos
iguais ("ótimo", "muito bom") são classificados uma vez. Rodar de novo não paga
de novo; uma avaliação editada ganha marca nova e é classificada outra vez.
Mudou o dicionário? Apague o cache e anote a data em "_versao".

Sem JEV_API_KEY (por exemplo, no GitHub Actions sem o segredo), o passo usa só o
cache e avisa quantas ficaram sem tema. Não falha.
"""
import asyncio
import hashlib
import json
import os
import time

import pandas as pd

from .comum import ESTRUTURADO, RAIZ, REGRAS

MODELO = "jev-latest"
DIAS = 90
SIMULTANEAS = 16
NOMES = ["tema", "reclamacao"]


def marca(segmento, titulo, texto) -> str:
    t = "" if pd.isna(titulo) else str(titulo)
    x = "" if pd.isna(texto) else str(texto)
    return hashlib.sha1(f"{segmento}\n{t}\n{x}".encode("utf-8")).hexdigest()


def perguntas(dic: dict, segmento: str) -> dict:
    q = {}
    for nome, v in dic["variaveis"].items():
        instr = f"{dic['_instrucoes']} {v['pergunta']}"
        if v["tipo"] == "escolha":
            q[nome] = {"type": "choice", "instructions": instr, "criteria": v["opcoes_por_segmento"][segmento]}
        else:
            q[nome] = {"type": "noul", "instructions": instr}
    return q


def ler_cache(arq=None) -> dict:
    arq = arq or ESTRUTURADO / "cache.jsonl"
    cache = {}
    if arq.exists():
        for linha in arq.read_text(encoding="utf-8").splitlines():
            if linha.strip():
                reg = json.loads(linha)
                cache[reg["marca"]] = reg
    return cache


async def _classificar(faltam: pd.DataFrame, dic: dict, cache: dict, arq) -> int:
    os.environ.setdefault("TYPESAFE_API_KEY", os.environ.get("JEV_API_KEY", ""))
    from typesafe_sdk import AsyncTypeSafeClient
    cli = AsyncTypeSafeClient(model=MODELO)
    q = {s: perguntas(dic, s) for s in faltam["segmento"].unique()}
    sem, erros = asyncio.Semaphore(SIMULTANEAS), 0
    with arq.open("a", encoding="utf-8") as f:
        async def uma(x):
            nonlocal erros
            estado = {k: str(v) for k, v in {"titulo": x.titulo, "texto": x.texto}.items()
                      if not pd.isna(v) and str(v).strip()}
            async with sem:
                try:
                    r = await cli.system_one(state=estado, questions=q[x.segmento], model=MODELO)
                except Exception as e:  # registra e segue; a próxima rodada tenta de novo
                    erros += 1
                    print(f"    erro: {type(e).__name__}: {str(e)[:100]}")
                    return
            reg = {"marca": x.marca}
            for k, a in r.answers.items():
                if a.type == "noul":
                    reg[k], reg[f"conf_{k}"] = bool(a.noul >= 0.5), round(max(a.noul, 1 - a.noul), 3)
                else:
                    reg[k], reg[f"conf_{k}"] = a.choice, round(a.probabilities[a.choice], 3)
            f.write(json.dumps(reg, ensure_ascii=False) + "\n")
            f.flush()
            cache[reg["marca"]] = reg
        await asyncio.gather(*(uma(x) for x in faltam.itertuples()))
    return erros


def anotar(base: pd.DataFrame, hoje: str, limite: int | None = None) -> tuple[pd.DataFrame, dict]:
    """Devolve as avaliações dos últimos 90 dias com tema e reclamação, e um resumo da rodada."""
    dic = json.loads((REGRAS / "dicionario.json").read_text(encoding="utf-8"))
    corte = (pd.Timestamp(hoje) - pd.Timedelta(days=DIAS)).strftime("%Y-%m-%d")
    recentes = base[base["data"] > corte]
    tem_texto = (recentes["titulo"].fillna("").str.strip() + recentes["texto"].fillna("").str.strip()) != ""
    alvo = recentes[tem_texto].copy()
    alvo["marca"] = [marca(s, a, b) for s, a, b in zip(alvo["segmento"], alvo["titulo"], alvo["texto"])]

    arq = ESTRUTURADO / "cache.jsonl"
    arq.parent.mkdir(parents=True, exist_ok=True)
    cache = ler_cache(arq)
    unicos = alvo.drop_duplicates("marca")
    faltam = unicos[~unicos["marca"].isin(cache.keys())]
    if limite:
        faltam = faltam.head(limite)
    print(f"  entraram {len(base)} avaliações; {len(recentes)} dos últimos {DIAS} dias, "
          f"{len(alvo)} com texto ({len(recentes) - len(alvo)} sem texto ficam de fora); "
          f"{alvo['marca'].nunique()} textos diferentes; {len(faltam)} para classificar agora")

    resumo = {"classificadas_agora": 0, "erros": 0, "segundos": 0.0, "sem_chave": False}
    if len(faltam):
        try:
            from dotenv import load_dotenv
            load_dotenv(RAIZ / ".env")
        except ImportError:
            pass
        if not (os.environ.get("JEV_API_KEY") or os.environ.get("TYPESAFE_API_KEY")):
            resumo["sem_chave"] = True
            print(f"  sem JEV_API_KEY: {len(faltam)} textos ficam sem tema nesta rodada (o passo segue só com o cache)")
        else:
            t0 = time.perf_counter()
            erros = asyncio.run(_classificar(faltam, dic, cache, arq))
            resumo.update(classificadas_agora=len(faltam) - erros, erros=erros,
                          segundos=round(time.perf_counter() - t0, 1))
            print(f"  classificados agora: {len(faltam) - erros} textos em {resumo['segundos']} s; erros: {erros}")

    for n in NOMES:
        alvo[n] = alvo["marca"].map(lambda m: cache.get(m, {}).get(n))
        alvo[f"conf_{n}"] = alvo["marca"].map(lambda m: cache.get(m, {}).get(f"conf_{n}"))
    alvo["conf_tema"] = pd.to_numeric(alvo["conf_tema"])
    alvo["conf_reclamacao"] = pd.to_numeric(alvo["conf_reclamacao"])
    sem = int(alvo["tema"].isna().sum())
    baixa = int((alvo["conf_tema"] < 0.6).sum())
    resumo.update(n_alvo=len(alvo), n_textos=int(alvo["marca"].nunique()), sem_tema=sem, conf_baixa=baixa,
                  conf_baixa_reclamacao=int((alvo["conf_reclamacao"] < 0.6).sum()))
    print(f"  saíram {len(alvo)} avaliações anotadas: {sem} sem tema, {baixa} com confiança abaixo de 60% no tema")
    return alvo.drop(columns="marca"), resumo
