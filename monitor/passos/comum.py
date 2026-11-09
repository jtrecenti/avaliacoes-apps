"""O que todos os passos usam: as pastas, a lista de aplicativos, o fuso e a máscara de dados pessoais."""
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd

MONITOR = Path(__file__).resolve().parents[1]
RAIZ = MONITOR.parent
REGRAS = MONITOR / "regras"
DADOS = MONITOR / "dados"
COLETAS = DADOS / "coletas"
PROCESSADOS = DADOS / "processados"
ESTRUTURADO = DADOS / "estruturado"
PAINEL = RAIZ / "docs" / "painel"

# Horário de Brasília (o Brasil não tem horário de verão desde 2019)
BRT = timezone(timedelta(hours=-3))

LOJAS = {"app_store": "App Store", "play_store": "Play Store"}

# As colunas de cada coleta, nesta ordem. Nada de nome, apelido ou foto de quem avaliou.
COLUNAS = ["loja", "segmento", "empresa", "id_avaliacao", "data", "nota", "titulo", "texto", "versao"]
COLUNAS_NOTAS_LOJA = ["loja", "segmento", "empresa", "nota_loja", "n_notas_loja"]

# gzip sem a data dentro do arquivo: o mesmo conteúdo gera o mesmo arquivo (o git não vê mudança à toa)
GZ = {"method": "gzip", "mtime": 0}

# Identificação honesta nas requisições: um nome de projeto, sem fingir ser navegador.
USER_AGENT = "avaliacoes-apps/1.0 (projeto didatico; github.com/jtrecenti/avaliacoes-apps)"


def agora() -> datetime:
    return datetime.now(BRT)


def ler_apps(pasta_regras: Path = REGRAS) -> pd.DataFrame:
    """Os aplicativos monitorados: uma linha por app em regras/apps.csv."""
    return pd.read_csv(pasta_regras / "apps.csv", dtype=str)


# Dados pessoais que aparecem no texto das avaliações. A ordem importa: CPF antes
# de telefone, porque um CPF sem pontos também parece um número de telefone.
PESSOAIS = {
    "e-mail": r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+",
    "CPF": r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b",
    "telefone": r"(?<!\d)(?:\+?55\s?)?(?:\(?\d{2}\)?[\s.-]?)?9?\d{4}[\s.-]?\d{4}\b",
}
MASCARA = {"e-mail": "[e-mail removido]", "CPF": "[CPF removido]", "telefone": "[telefone removido]"}


def mascarar(texto) -> tuple[str, int]:
    """Troca e-mail, CPF e telefone por uma marca. Devolve o texto e quantos trechos trocou."""
    if not isinstance(texto, str):
        return texto, 0
    n = 0
    for tipo, padrao in PESSOAIS.items():
        texto, k = re.subn(padrao, MASCARA[tipo], texto)
        n += k
    return texto, n


def tem_dado_pessoal(texto) -> bool:
    """Sobrou algum trecho com cara de e-mail, CPF ou telefone (depois da máscara)?"""
    if not isinstance(texto, str):
        return False
    return any(re.search(p, texto) for p in PESSOAIS.values())
