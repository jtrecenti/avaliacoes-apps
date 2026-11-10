"""Gera a entrevista da demonstração 1 a partir da original, com mais variação.

Transcrições reais são bagunçadas: sem acento, em maiúsculas, com erros de
digitação e de transcrição, e com muitos jeitos de falar de preço. Essa bagunça é o que faz a
contagem "de olho" mudar de uma conversa para outra; a habilidade, com uma regra
escrita (sem acento e sem diferenciar maiúscula), continua dando sempre o mesmo.

Entrada: scripts/grupo_focal_original.txt (a transcrição do curso de executivos)
Saída:   demos/1-contagem/entrevista/grupo_focal_aerea_sol.txt
Semente fixa: rodar de novo dá o mesmo arquivo.

Uso: python scripts/dificultar_entrevista.py
"""
import random
import re
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
ORIGEM = RAIZ / "scripts/grupo_focal_original.txt"
DESTINO = RAIZ / "demos/1-contagem/entrevista/grupo_focal_aerea_sol.txt"
rnd = random.Random(2026)


def sem_acento(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


# jeitos de dizer "preço" (alguns a regra pega, outros não: é aí que o critério importa)
TROCAS_PRECO = ["preco", "PREÇO", "Preço", "valor", "precinho", "presso", "preço da passagem", "custo", "tarifa"]
# comentários soltos sobre dinheiro, com palavras que pedem julgamento
EXTRAS = [
    "A tarifa tava salgada demais.",
    "Paguei uma grana nessa passagem.",
    "Custou os olhos da cara, sério.",
    "Tava CARÍSSIMO, gente.",
    "Saiu uns R$ 899 ida e volta.",
    "Achei baratinho, pra ser sincera.",
    "Foi uma pechincha, comprei na promoção.",
    "O valor dobrou em uma semana.",
    "Cobram uma taxa absurda pra marcar assento.",
    "O cara do balcão foi super gente boa, aliás.",
    "Não vale o que cobram, na minha opinião.",
    "preco justo eu pago sem reclamar",
    "TARIFA BÁSICA nunca mais.",
    "Eu comparo o preço em três sites antes.",
    "Ficou barato, mas a bagagem saiu cara.",
    "Meu chefe acha caro, eu acho normal.",
]

# erros de transcrição nas palavras dos temas (a regra pega alguns, outros não)
ERROS_TEMA = {
    "preço": ["prço", "preçõ", "precço", "presso"], "caro": ["karo", "caaro"], "barato": ["barrato", "baraato"],
    "atraso": ["atrazo", "atraço", "atrasso"], "atrasou": ["atrazou", "atrassou"], "atrasado": ["atrazado"],
    "bagagem": ["bagajem", "bagagen", "bagaem"], "mala": ["mla", "malla"],
    "atendimento": ["atendimeto", "atendimennto", "atendimento,"], "atendente": ["atendemte", "atendete"],
}


def erro_digitacao(palavra: str) -> str:
    """Um erro de digitação comum: letra trocada de lugar, letra a menos ou a mais."""
    if len(palavra) < 5 or not palavra.isalpha():
        return palavra
    i = rnd.randrange(1, len(palavra) - 2)
    tipo = rnd.choice(["troca", "falta", "dobra"])
    if tipo == "troca":
        return palavra[:i] + palavra[i + 1] + palavra[i] + palavra[i + 2:]
    if tipo == "falta":
        return palavra[:i] + palavra[i + 1:]
    return palavra[:i] + palavra[i] + palavra[i:]


linhas = ORIGEM.read_text(encoding="utf-8").splitlines()
saida, n_mudadas, n_extras = [], 0, 0
for linha in linhas:
    m = re.match(r"^([A-ZÁÉÍÓÚÂÊÔÃÕÇ]+): (.*)$", linha)
    if not m or m.group(1) == "MODERADORA":
        saida.append(linha)
        continue
    nome, fala = m.groups()
    antes = fala
    # 1. outras formas de falar de preço
    fala = re.sub(r"\bpreço\b", lambda _: rnd.choice(TROCAS_PRECO) if rnd.random() < 0.45 else "preço", fala)
    # 2. erros nas palavras dos temas e erros de digitação no resto
    fala = re.sub(r"\b(" + "|".join(ERROS_TEMA) + r")\b",
                  lambda x: rnd.choice(ERROS_TEMA[x.group(1)]) if rnd.random() < 0.18 else x.group(1), fala)
    if rnd.random() < 0.25:
        palavras = fala.split(" ")
        for _ in range(rnd.choice([1, 1, 2, 3])):
            k = rnd.randrange(len(palavras))
            palavras[k] = erro_digitacao(palavras[k])
        fala = " ".join(palavras)
    # 3. acento e maiúscula: transcrição automática não ajuda
    sorteio = rnd.random()
    if sorteio < 0.30:
        fala = sem_acento(fala)
    elif sorteio < 0.38:
        fala = fala.lower()
    elif sorteio < 0.43:
        fala = re.sub(r"\b(caro|cara|barato|preço|tarifa|valor)\b", lambda x: x.group(1).upper(), fala)
    # 4. um comentário a mais sobre dinheiro, de vez em quando
    if rnd.random() < 0.10:
        extra = rnd.choice(EXTRAS)
        fala = f"{fala} {sem_acento(extra) if rnd.random() < 0.3 else extra}"
        n_extras += 1
    n_mudadas += fala != antes
    saida.append(f"{nome}: {fala}")

DESTINO.write_text("\n".join(saida) + "\n", encoding="utf-8")
print(f"{len(linhas)} linhas lidas; {n_mudadas} falas mudaram; {n_extras} comentários sobre dinheiro acrescentados")
print("saiu em", DESTINO.relative_to(RAIZ))
