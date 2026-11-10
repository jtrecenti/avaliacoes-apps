# Como chamar o Jev em Python

O Jev responde perguntas tipadas sobre um texto: uma opção de uma lista
(`choice`) ou sim/não (`noul`), com a probabilidade de cada resposta.

Instalação: `pip install typesafe-sdk python-dotenv pandas openpyxl` (o openpyxl é o que salva o Excel)

A chave fica no `.env` desta pasta, na linha `JEV_API_KEY=...`. O pacote lê a
variável `TYPESAFE_API_KEY`; copie uma para a outra, sem imprimir a chave.

```python
import asyncio, json, os
from dotenv import load_dotenv
from typesafe_sdk import AsyncTypeSafeClient

load_dotenv(".env")   # o .env desta pasta
os.environ.setdefault("TYPESAFE_API_KEY", os.environ["JEV_API_KEY"])
dic = json.load(open("dicionario.json", encoding="utf-8"))

perguntas = {
    "tema": {
        "type": "choice",
        "instructions": dic["_instrucoes"] + " " + dic["variaveis"]["tema"]["pergunta"],
        "criteria": dic["variaveis"]["tema"]["opcoes"],   # {"opção": "definição", ...}
    },
    "reclamacao": {
        "type": "noul",
        "instructions": dic["_instrucoes"] + " " + dic["variaveis"]["reclamacao"]["pergunta"],
    },
}

async def anotar(texto, cli, limite):
    async with limite:
        r = await cli.system_one(state={"texto": texto}, questions=perguntas, model="jev-latest")
    tema = r.answers["tema"]
    return {
        "tema": tema.choice,                                 # a opção escolhida
        "conf_tema": tema.probabilities[tema.choice],        # a probabilidade dela
        "probabilidades": tema.probabilities,                # todas as opções
        "reclama": r.answers["reclamacao"].noul >= 0.5,      # noul: probabilidade de "sim"
        "conf_reclama": max(r.answers["reclamacao"].noul, 1 - r.answers["reclamacao"].noul),
    }

async def main(textos):
    cli = AsyncTypeSafeClient(model="jev-latest")
    limite = asyncio.Semaphore(16)   # até 16 pedidos ao mesmo tempo
    return await asyncio.gather(*(anotar(t, cli, limite) for t in textos))

# respostas = asyncio.run(main(lista_de_textos))
```

Guarde as respostas num arquivo assim que chegarem, para não pagar duas vezes
se precisar rodar de novo.
