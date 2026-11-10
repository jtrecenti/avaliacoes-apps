"""Conta quantas vezes cada tema aparece numa transcrição, por pessoa.

Uso:
    python contar_termos.py transcricao.txt
    python contar_termos.py transcricao.txt --tema "preço=preço,preços,caro,cara,caros,caras,barato,barata,tarifa*"
    python contar_termos.py transcricao.txt --incluir-moderacao --trechos trechos.csv

A transcrição tem uma fala por linha, no formato "NOME: texto". Linhas sem esse
formato (títulos, anotações) são ignoradas e contadas no relatório.

Regras, sempre as mesmas:
- maiúsculas e acentos não importam ("Preço", "preco" e "PREÇO" contam igual);
- conta palavra inteira: "caro" não conta dentro de "caroço";
- um termo terminado em * pega o começo da palavra: "atras*" conta atraso,
  atrasou, atrasado;
- a moderação (MODERADOR, MODERADORA) fica de fora, a menos que se peça;
- cada ocorrência vira uma linha no arquivo de trechos, para conferir.
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

TEMAS_PADRAO = {
    "preço": "preço,preços,caro,cara,caros,caras,barato,barata,baratos,baratas,tarifa*,quanto custa,r$",
    "atraso": "atras*",
    "bagagem": "bagagem,bagagens,mala,malas",
    "atendimento": "atendimento*,atendente*,sac",
}
MODERACAO = {"moderador", "moderadora"}
FALA = re.compile(r"^\s*([A-ZÁÂÃÉÊÍÓÔÕÚÇ][A-ZÁÂÃÉÊÍÓÔÕÚÇ .'-]{1,40}):\s*(.+)$")


def normalizar(t: str) -> str:
    t = unicodedata.normalize("NFKD", t.lower())
    return "".join(c for c in t if not unicodedata.combining(c))


def padrao(termos: str) -> re.Pattern:
    partes = []
    for termo in (x.strip() for x in termos.split(",") if x.strip()):
        n = re.escape(normalizar(termo.rstrip("*")))
        partes.append(n + r"\w*" if termo.endswith("*") else n)
    # palavra inteira: nada de letra ou número colado antes ou depois
    return re.compile(r"(?<![\w$])(?:" + "|".join(partes) + r")(?!\w)")


def ler_temas(lista: list[str] | None) -> dict[str, re.Pattern]:
    brutos = dict(TEMAS_PADRAO) if not lista else dict(x.split("=", 1) for x in lista)
    return {nome.strip(): padrao(termos) for nome, termos in brutos.items()}


def contar(arquivo: Path, temas: dict[str, re.Pattern], incluir_moderacao: bool):
    contagem: dict[str, Counter] = defaultdict(Counter)
    falas: Counter = Counter()
    trechos, ignoradas = [], 0
    for n, linha in enumerate(arquivo.read_text(encoding="utf-8").splitlines(), 1):
        m = FALA.match(linha)
        if not m:
            ignoradas += bool(linha.strip())
            continue
        quem, texto = m.group(1).strip().title(), m.group(2)
        if quem.lower() in MODERACAO and not incluir_moderacao:
            continue
        falas[quem] += 1
        norm = normalizar(texto)
        for tema, rx in temas.items():
            for achado in rx.finditer(norm):
                contagem[tema][quem] += 1
                ini, fim = max(0, achado.start() - 60), achado.end() + 60
                trechos.append({"linha": n, "pessoa": quem, "tema": tema, "termo": achado.group(0),
                                "trecho": "..." + texto[ini:fim].strip() + "..."})
    return contagem, falas, trechos, ignoradas


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("arquivo", type=Path)
    p.add_argument("--tema", action="append", help='nome=termo1,termo2,radical*  (pode repetir)')
    p.add_argument("--incluir-moderacao", action="store_true")
    p.add_argument("--trechos", type=Path, help="CSV com cada ocorrência, para conferir")
    a = p.parse_args()

    temas = ler_temas(a.tema)
    contagem, falas, trechos, ignoradas = contar(a.arquivo, temas, a.incluir_moderacao)
    pessoas = sorted(falas, key=lambda x: -falas[x])

    print(f"Arquivo: {a.arquivo.name}. Falas contadas: {sum(falas.values())} de {len(pessoas)} pessoas"
          f"{'' if a.incluir_moderacao else ' (moderação fora)'}. Linhas fora do formato NOME: fala: {ignoradas}.\n")
    print("| pessoa | falas | " + " | ".join(temas) + " |")
    print("|---|---:|" + "---:|" * len(temas))
    for quem in pessoas:
        print(f"| {quem} | {falas[quem]} | " + " | ".join(str(contagem[t][quem]) for t in temas) + " |")
    print("| **total** | " + f"**{sum(falas.values())}** | " + " | ".join(f"**{sum(contagem[t].values())}**" for t in temas) + " |")
    print("\nTermos de cada tema:")
    for t, rx in temas.items():
        print(f"- {t}: {rx.pattern}")
    if a.trechos:
        with a.trechos.open("w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=["linha", "pessoa", "tema", "termo", "trecho"])
            w.writeheader()
            w.writerows(trechos)
        print(f"\n{len(trechos)} ocorrências em {a.trechos}")


if __name__ == "__main__":
    main()
