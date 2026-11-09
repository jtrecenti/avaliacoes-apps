"""Cada checagem só merece confiança depois de vermos ela falhar com um dado quebrado de propósito."""
from passos.p2_juntar import juntar
from passos.p3_checar import checar


def resultado(ch, inicio):
    return next(x for x in ch if x["frase"].startswith(inicio))


def test_dados_bons_passam_em_tudo_que_bloqueia(coletas, notas, apps):
    base, _ = juntar(coletas, gravar=False)
    ch = checar(coletas, notas, base, apps)
    assert all(x["ok"] for x in ch if x["nivel"] == "bloqueia")


def test_nota_fora_da_escala_bloqueia(coletas, notas, apps):
    coletas[max(coletas)].loc[0, "nota"] = 7
    base, _ = juntar(coletas, gravar=False)
    x = resultado(checar(coletas, notas, base, apps), "toda nota está entre 1 e 5")
    assert not x["ok"] and x["nivel"] == "bloqueia"


def test_data_no_futuro_bloqueia(coletas, notas, apps):
    coletas[max(coletas)].loc[0, "data"] = "2030-01-01"
    base, _ = juntar(coletas, gravar=False)
    x = resultado(checar(coletas, notas, base, apps), "nenhuma avaliação com data depois")
    assert not x["ok"] and x["nivel"] == "bloqueia"


def test_app_faltando_numa_loja_bloqueia(coletas, notas, apps):
    k = max(coletas)
    d = coletas[k]
    coletas[k] = d[~((d["empresa"] == "iFood") & (d["loja"] == "play_store"))]
    base, _ = juntar(coletas, gravar=False)
    x = resultado(checar(coletas, notas, base, apps), "todo aplicativo da lista veio nas duas lojas")
    assert not x["ok"] and "iFood na play_store" in x["detalhe"]


def test_telefone_sem_mascara_bloqueia(coletas, notas, apps):
    base, _ = juntar(coletas, gravar=False)
    base.loc[0, "texto"] = "liga 11 98765-4321"  # simula um passo que esqueceu a máscara
    x = resultado(checar(coletas, notas, base, apps), "nenhum texto com telefone")
    assert not x["ok"] and x["nivel"] == "bloqueia"


def test_coluna_com_nome_de_quem_avaliou_bloqueia(coletas, notas, apps):
    k = max(coletas)
    coletas[k] = coletas[k].assign(userName="Fulano")
    base, _ = juntar(coletas, gravar=False)
    ch = checar(coletas, notas, base, apps)
    assert not resultado(ch, "nenhuma coleta guarda nome")["ok"]
    assert not resultado(ch, "toda coleta tem exatamente as colunas")["ok"]


def test_poucas_avaliacoes_so_alerta(coletas, notas, apps):
    base, _ = juntar(coletas, gravar=False)
    x = resultado(checar(coletas, notas, base, apps), "a coleta mais recente tem pelo menos")
    assert not x["ok"] and x["nivel"] == "alerta"
