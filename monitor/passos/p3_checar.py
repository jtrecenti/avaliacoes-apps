"""Passo 3: checagens de qualidade. Cada uma é uma frase que precisa ser verdade.

nivel "bloqueia": se falhar, rodar.py para com erro ANTES de escrever os dados do
painel, e o painel publicado continua com a última versão boa.
nivel "alerta": o painel sai, com um aviso para alguém olhar.

Toda checagem nova deve ser testada quebrando uma cópia do dado de propósito
(veja testes/test_checagens.py).
"""
import pandas as pd

from .comum import COLUNAS, MASCARA, tem_dado_pessoal

MIN_POR_APP_E_LOJA = 200  # a App Store às vezes devolve menos de 500; abaixo disso, alguém olha
PROIBIDAS = {"userName", "userImage", "author", "nome", "apelido", "usuario", "foto"}


def checar(coletas: dict[str, pd.DataFrame], notas: dict[str, pd.DataFrame], base: pd.DataFrame,
           apps: pd.DataFrame) -> list[dict]:
    r = []

    def ch(frase, ok, nivel="bloqueia", detalhe=""):
        r.append({"frase": frase, "nivel": nivel, "ok": bool(ok), "detalhe": detalhe if not ok else ""})

    ultima = max(coletas)
    hoje = coletas[ultima]
    esperados = {(a.empresa, l) for a in apps.itertuples() for l in ("app_store", "play_store")}

    # ---- bloqueiam
    ruins = [k for k, c in coletas.items() if list(c.columns) != COLUNAS]
    ch("toda coleta tem exatamente as colunas esperadas", not ruins, detalhe="; ".join(ruins))
    pessoais = sorted({col for c in coletas.values() for col in c.columns if col in PROIBIDAS})
    ch("nenhuma coleta guarda nome, apelido ou foto de quem avaliou", not pessoais, detalhe=", ".join(pessoais))

    veio = set(zip(hoje["empresa"], hoje["loja"]))
    faltam = sorted(esperados - veio)
    ch("todo aplicativo da lista veio nas duas lojas na coleta mais recente", not faltam,
       detalhe="; ".join(f"{e} na {l}" for e, l in faltam))

    vazias = int(base[["loja", "empresa", "id_avaliacao", "data", "nota"]].isna().any(axis=1).sum())
    ch("toda avaliação tem loja, empresa, identificador, data e nota", vazias == 0, detalhe=f"{vazias} sem algum desses campos")

    notas_num = pd.to_numeric(base["nota"], errors="coerce")
    fora = int((~notas_num.between(1, 5)).sum())
    ch("toda nota está entre 1 e 5", fora == 0, detalhe=f"{fora} fora da escala")

    rep = int(base.duplicated(["loja", "id_avaliacao"]).sum())
    ch("nenhuma avaliação repetida na base final", rep == 0, detalhe=f"{rep} repetidas")

    futuro = {k: int((c["data"] > k[:10]).sum()) for k, c in coletas.items() if (c["data"] > k[:10]).any()}
    ch("nenhuma avaliação com data depois do dia da coleta", not futuro,
       detalhe="; ".join(f"coleta {k}: {n}" for k, n in futuro.items()))

    texto = base["titulo"].fillna("") + " " + base["texto"].fillna("")
    sem_mascara = int(texto.map(tem_dado_pessoal).sum())
    ch("nenhum texto com telefone, e-mail ou CPF sem máscara", sem_mascara == 0,
       detalhe=f"{sem_mascara} avaliação(ões) com dado pessoal aparente")

    # ---- alertas
    cont = hoje.groupby(["empresa", "loja"]).size()
    poucas = [f"{e} na {l}: {cont.get((e, l), 0)}" for e, l in sorted(esperados) if cont.get((e, l), 0) < MIN_POR_APP_E_LOJA]
    ch(f"a coleta mais recente tem pelo menos {MIN_POR_APP_E_LOJA} avaliações por app e loja", not poucas, "alerta",
       "; ".join(poucas))

    nl = notas.get(ultima, pd.DataFrame())
    ok_nl = set()
    if len(nl):
        v = nl[pd.to_numeric(nl["nota_loja"], errors="coerce").between(1, 5)]
        ok_nl = set(zip(v["empresa"], v["loja"]))
    sem_nota = sorted(esperados - ok_nl)
    ch("a nota oficial da loja veio para todo app nas duas lojas", not sem_nota, "alerta",
       "; ".join(f"{e} na {l}" for e, l in sem_nota))

    chaves = sorted(coletas)
    buracos = []
    for a, b in zip(chaves, chaves[1:]):
        for e, l in sorted(esperados):
            ant = coletas[a][(coletas[a]["empresa"] == e) & (coletas[a]["loja"] == l)]
            nov = coletas[b][(coletas[b]["empresa"] == e) & (coletas[b]["loja"] == l)]
            if len(ant) and len(nov) and nov["data"].min() > ant["data"].max():
                buracos.append(f"{e} na {l} entre {a[:10]} e {b[:10]}")
    ch("cada coleta alcança a anterior (nenhuma avaliação perdida no meio)", not buracos, "alerta",
       "; ".join(buracos[:6]) + (" e outros" if len(buracos) > 6 else "") + (": colete com mais frequência" if buracos else ""))

    ed = int(base["editada"].sum()) if "editada" in base else 0
    ch("nenhuma avaliação mudou entre coletas", ed == 0, "alerta",
       f"{ed} editada(s) pela pessoa; vale a versão mais recente")

    marcas = tuple(MASCARA.values())
    mascaradas = int(texto.map(lambda t: any(m in t for m in marcas)).sum())
    ch("nenhuma avaliação precisou de máscara de dado pessoal", mascaradas == 0, "alerta",
       f"{mascaradas} avaliação(ões) com telefone, e-mail ou CPF mascarados")

    for x in r:
        print("  " + rotulo(x) + " " + x["frase"] + (f"  ({x['detalhe']})" if x["detalhe"] else ""))
    return r


def rotulo(x: dict) -> str:
    return "ok    " if x["ok"] else ("FALHA " if x["nivel"] == "bloqueia" else "alerta")


def checar_anotacao(est: pd.DataFrame, limite_conf: float = 0.6) -> list[dict]:
    """Duas checagens de alerta sobre o resultado do passo 4 (classificação pelo Jev)."""
    sem = int(est["tema"].isna().sum())
    baixa = int((est["conf_tema"] < limite_conf).sum())
    pct = baixa / max(int(est["tema"].notna().sum()), 1)
    r = [
        {"frase": "toda avaliação dos últimos 90 dias tem tema", "nivel": "alerta", "ok": sem == 0,
         "detalhe": f"{sem} sem tema (sem chave do Jev ou erro na chamada)" if sem else ""},
        {"frase": "menos de 10% dos temas com confiança abaixo de 60%", "nivel": "alerta", "ok": pct < 0.10,
         "detalhe": f"{baixa} com confiança baixa ({pct:.0%})" if pct >= 0.10 else ""},
    ]
    for x in r:
        print("  " + rotulo(x) + " " + x["frase"] + (f"  ({x['detalhe']})" if x["detalhe"] else ""))
    return r
