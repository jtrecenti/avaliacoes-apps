import pandas as pd

from passos.comum import mascarar, tem_dado_pessoal
from passos.p2_juntar import juntar


def test_mesma_avaliacao_conta_uma_vez_e_vale_a_mais_recente(coletas):
    base, log = juntar(coletas, gravar=False)
    assert not base.duplicated(["loja", "id_avaliacao"]).any()
    um = base[base["id_avaliacao"] == "1"]
    assert len(um) == 1
    assert um["nota"].item() == 1  # a versão da coleta mais recente
    assert um["editada"].item()


def test_mesmo_id_em_lojas_diferentes_nao_e_repeticao(coletas):
    c = dict(coletas)
    k = max(c)
    d = c[k].copy()
    extra = d.iloc[[0]].assign(loja="play_store", id_avaliacao="1")
    c[k] = pd.concat([d, extra], ignore_index=True)
    base, _ = juntar(c, gravar=False)
    assert len(base[base["id_avaliacao"] == "1"]) == 2


def test_mascara_telefone_email_e_cpf():
    t, n = mascarar("me liga (11) 98765-4321 ou escreve para fulano@exemplo.com, cpf 123.456.789-09")
    assert n == 3
    assert "98765" not in t and "@" not in t and "123.456" not in t
    assert not tem_dado_pessoal(t)


def test_mascara_nao_estraga_texto_comum():
    texto = "Paguei R$ 50,00 no dia 10/11 e a nota é 5 de 5"
    t, n = mascarar(texto)
    assert n == 0 and t == texto


def test_juntar_mascara_coleta_antiga(coletas):
    k = min(coletas)
    coletas[k].loc[0, "texto"] = "meu zap é 11 91234-5678"
    base, _ = juntar(coletas, gravar=False)
    assert not base["texto"].map(tem_dado_pessoal).any()
