---
name: avaliacoes-lojas
description: Baixa as avaliações de um aplicativo na App Store e na Google Play do Brasil, sempre do mesmo jeito, e devolve um CSV e um resumo. Use quando o usuário pedir avaliações, reviews ou comentários de um app nas lojas.
---

# Avaliações das lojas de aplicativos

## Quando usar

O usuário quer as avaliações escritas de um aplicativo (o da empresa, de um
concorrente) para ler, contar ou classificar.

## Passo a passo

1. **Descubra os dois identificadores.** Na App Store, o número no endereço do
   app (`apps.apple.com/br/app/.../id814456780` → `814456780`). Na Google Play,
   o pacote no endereço (`play.google.com/store/apps/details?id=com.nu.production`).
   Se o usuário só disser o nome, procure e **confirme com ele** antes de baixar.
2. **Rode o script**, nunca conte nem copie à mão:
   `python scripts/baixar_avaliacoes.py --nome <Nome> --app-store <número> --play <pacote>`
   (instale antes, se faltar: `pip install pandas requests google-play-scraper`).
3. **Mostre o resumo** que o script imprime: quantas avaliações por loja, de que
   data a que data e a nota média. Diga quantas linhas entraram e quantas saíram.
4. **Avise os limites:** a App Store entrega só as 500 mais recentes; a Google
   Play, as 500 mais recentes, que num app grande cobrem poucos dias. As
   avaliações escritas não são uma amostra dos clientes.

## Regras

- Uma página por vez, com pausa. Nada em paralelo.
- Guarde o bruto (`brutos/`) antes de ler: se a leitura errar, não precisa baixar de novo.
- Nunca guarde nome, apelido ou foto de quem avaliou.
- Telefone, e-mail e CPF no texto saem mascarados (o script já faz).

## Exemplo

`python scripts/baixar_avaliacoes.py --nome Nubank --app-store 814456780 --play com.nu.production`
gera `avaliacoes_Nubank.csv` com cerca de 1.000 linhas (500 de cada loja).
