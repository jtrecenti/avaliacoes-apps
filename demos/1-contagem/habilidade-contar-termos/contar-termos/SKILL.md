---
name: contar-termos
description: Conta quantas vezes temas e palavras aparecem numa transcrição de entrevista ou grupo focal, por pessoa, sempre com a mesma regra. Use quando pedirem para contar menções, palavras ou temas em transcrições, entrevistas, grupos focais ou falas.
---

# Contar termos numa transcrição

Contagem é trabalho para o script, nunca para a leitura. Ler e "estimar" dá um
número diferente a cada vez; o script dá sempre o mesmo.

## Como usar

1. Confira se a transcrição tem uma fala por linha, no formato `NOME: texto`.
   Se não tiver, mostre um exemplo de linha e pergunte antes de converter.
2. Combine com a pessoa **quais termos contam para cada tema** e mostre a lista
   antes de rodar. Sem pedido específico, use os temas padrão do script
   (preço, atraso, bagagem, atendimento).
3. Rode:

   ```bash
   python scripts/contar_termos.py <transcricao.txt> --trechos trechos.csv
   python scripts/contar_termos.py <transcricao.txt> --tema "preço=preço,preços,caro,tarifa*" --tema "atraso=atras*"
   ```

4. Responda com a tabela que o script imprimiu, **sem mudar nenhum número**, e
   diga a regra usada: palavra inteira, sem diferenciar acento e maiúscula,
   moderação fora.
5. Depois, e só depois, interprete: quem fala mais de cada tema, o que os
   trechos mostram. Leia o `trechos.csv` e aponte **falsos positivos** (por
   exemplo, "cara" no sentido de "pessoa" contado como preço). Proponha ajustar
   a lista de termos, mas não ajuste sem perguntar.

## Regras

- Nunca conte de cabeça, nem "aproximadamente". Se o script não rodar, diga
  que não rodou e por quê.
- A mesma pergunta, feita de novo, tem que dar a mesma tabela. Se a lista de
  termos mudou, diga o que mudou.
- Não inclua a moderação, a menos que peçam (`--incluir-moderacao`).
