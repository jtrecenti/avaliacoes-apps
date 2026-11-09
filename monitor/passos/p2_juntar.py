"""Passo 2: juntar todas as coletas numa base só, uma linha por avaliação.

Regras (AGENTS.md):
- a mesma avaliação (mesma loja e mesmo id) aparece em várias coletas e conta uma vez;
- se ela mudou entre coletas (a pessoa editou a nota ou o texto), vale a versão
  da coleta mais recente;
- telefone, e-mail e CPF no título e no texto são mascarados (de novo: a coleta
  já sai mascarada, mas coletas antigas podem ter sido gravadas antes da regra).
Saída: dados/processados/avaliacoes.csv.gz
"""
import pandas as pd

from .comum import GZ, PROCESSADOS, mascarar

CHAVE = ["loja", "id_avaliacao"]


def juntar(coletas: dict[str, pd.DataFrame], gravar: bool = True) -> tuple[pd.DataFrame, list[str]]:
    log = []
    tudo = pd.concat([d.assign(coleta=k) for k, d in coletas.items()], ignore_index=True)
    # a versão mais recente de cada avaliação
    base = tudo.sort_values("coleta", kind="stable").drop_duplicates(CHAVE, keep="last").copy()
    log.append(f"{len(tudo)} linhas nas coletas viraram {len(base)} avaliações diferentes "
               f"({len(tudo) - len(base)} repetidas entre coletas, contadas uma vez)")

    # avaliações que mudaram entre coletas (nota, título ou texto)
    versoes = tudo.drop_duplicates(CHAVE + ["nota", "titulo", "texto"])
    editadas = versoes.loc[versoes.duplicated(CHAVE, keep=False), CHAVE].drop_duplicates()
    chave_ed = set(map(tuple, editadas.values))
    base["editada"] = [k in chave_ed for k in zip(base["loja"], base["id_avaliacao"])]
    if chave_ed:
        log.append(f"{len(chave_ed)} avaliação(ões) editada(s) entre coletas: vale a versão mais recente")

    # novas: não estavam em nenhuma coleta anterior à última
    ultima = max(coletas)
    antes = set(zip(*[tudo.loc[tudo["coleta"] < ultima, c] for c in CHAVE]))
    base["nova"] = [k not in antes for k in zip(base["loja"], base["id_avaliacao"])]

    # dados pessoais no texto
    total = 0
    for col in ["titulo", "texto"]:
        res = base[col].map(mascarar)
        base[col] = res.str[0]
        total += int(res.str[1].sum())
    log.append(f"{total} trecho(s) com cara de telefone, e-mail ou CPF mascarados nesta etapa")

    base = base.sort_values(["segmento", "empresa", "loja", "data", "id_avaliacao"]).reset_index(drop=True)
    if gravar:
        PROCESSADOS.mkdir(parents=True, exist_ok=True)
        base.to_csv(PROCESSADOS / "avaliacoes.csv.gz", index=False, encoding="utf-8", compression=GZ)
        log.append(f"saíram {len(base)} linhas em dados/processados/avaliacoes.csv.gz")
    for linha in log:
        print("  " + linha)
    return base, log
