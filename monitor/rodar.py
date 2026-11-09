"""Refaz o monitor das avaliações, do começo ao fim: python monitor/rodar.py

Passos (cada um num arquivo de monitor/passos/):
  1. coletar  as avaliações de hoje nas duas lojas (só se ainda não houver coleta hoje)
  2. juntar   todas as coletas, sem repetir avaliação, com dados pessoais mascarados
  3. checar   as frases que precisam ser verdade; se uma que bloqueia falhar, para aqui
  4. anotar   tema e reclamação com o Jev (só o que não está no cache)
  5. painel   grava docs/painel/dados.json, que a página do painel lê

Opções:
  --coletar-de-novo  coleta mesmo que já exista coleta hoje (gera um arquivo novo)
  --sem-coleta       não coleta; refaz tudo com as coletas que já existem

Se uma checagem que bloqueia falhar, o programa sai com código 1 antes de gravar
o painel: o painel publicado continua com a última versão boa.
"""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from passos.comum import COLETAS, REGRAS, agora, ler_apps  # noqa: E402
from passos.p1_coletar import coletar, ler_coletas  # noqa: E402
from passos.p2_juntar import juntar  # noqa: E402
from passos.p3_checar import checar, checar_anotacao  # noqa: E402
from passos.p4_anotar import anotar  # noqa: E402
from passos.p5_painel import calcular, gravar  # noqa: E402


def main(args: list[str]) -> int:
    t0 = time.perf_counter()
    apps = ler_apps()

    print("1/5 coletar")
    hoje = agora().strftime("%Y-%m-%d")
    ja_tem = any((COLETAS / hoje).glob("avaliacoes_*.csv.gz"))
    if "--sem-coleta" in args:
        print("  --sem-coleta: uso só as coletas que já existem")
    elif ja_tem and "--coletar-de-novo" not in args:
        print(f"  já existe coleta de hoje ({hoje}); não coleto de novo (use --coletar-de-novo para forçar)")
    else:
        coletar()
    coletas, notas = ler_coletas()
    if not coletas:
        print("  nenhuma coleta encontrada em monitor/dados/coletas/")
        return 1
    ultima = max(coletas)

    print("2/5 juntar")
    base, log = juntar(coletas)

    print("3/5 checar")
    ch = checar(coletas, notas, base, apps)
    travas = [x for x in ch if not x["ok"] and x["nivel"] == "bloqueia"]
    if travas:
        print(f"\nPAINEL NÃO ATUALIZADO: {len(travas)} checagem(ns) que bloqueiam falharam. "
              "O painel publicado continua com a última versão boa. Resolva e rode de novo.")
        return 1

    print("4/5 anotar (Jev)")
    est, res = anotar(base, ultima[:10])
    ch += checar_anotacao(est)

    print("5/5 painel")
    dic = json.loads((REGRAS / "dicionario.json").read_text(encoding="utf-8"))
    temas = dic["variaveis"]["tema"]["opcoes_por_segmento"]
    temas = {seg: list(op) for seg, op in temas.items()}
    contagens = {
        "coletas": len(coletas),
        "linhas_coletadas": int(sum(len(c) for c in coletas.values())),
        "linhas_ultima_coleta": int(len(coletas[ultima])),
        "avaliacoes_unicas": int(len(base)),
        "anotadas_90_dias": int(res["n_alvo"]),
        "textos_diferentes_90_dias": int(res["n_textos"]),
        "sem_tema": int(res["sem_tema"]),
        "confianca_baixa_tema": int(res["conf_baixa"]),
        "confianca_baixa_reclamacao": int(res["conf_baixa_reclamacao"]),
        "classificadas_nesta_rodada": int(res["classificadas_agora"]),
        "segundos_jev_nesta_rodada": res["segundos"],
        "log": log,
    }
    dados = calcular(base, est, notas[ultima], apps, ch, contagens, ultima, temas)
    gravar(dados)
    print(f"pronto em {time.perf_counter() - t0:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
