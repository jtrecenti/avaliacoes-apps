# Regras deste monitor (o agente lê antes de qualquer tarefa)

Este monitor acompanha, todo dia, as avaliações dos aplicativos de bancos (Nubank,
Itaú, Banco do Brasil, Bradesco) e de delivery (iFood, Rappi, Zé Delivery) na App
Store e na Play Store do Brasil, e publica um painel em `docs/painel/`.

## Como rodar

- Um comando refaz tudo, da raiz do repositório: `python monitor/rodar.py`.
  Coleta hoje (se ainda não houver coleta hoje), junta, checa, anota com o Jev e
  grava `docs/painel/dados.json`.
- `--coletar-de-novo` coleta mesmo que já exista coleta hoje; `--sem-coleta` refaz
  tudo só com as coletas que já existem.
- Cada passo fica num arquivo de `monitor/passos/` e diz quantas linhas entraram,
  quantas saíram e por quê.
- Antes de dizer que terminou: `python -m pytest testes`.

## Passos

1. `p1_coletar.py`: App Store (feed público, até 10 páginas de 50) e Play Store
   (google-play-scraper, 500 mais recentes), mais a nota oficial de cada loja.
2. `p2_juntar.py`: junta as coletas, sem repetir avaliação, e mascara dados pessoais.
3. `p3_checar.py`: as checagens de qualidade (frases que precisam ser verdade).
4. `p4_anotar.py`: tema e reclamação com o Jev, com cache.
5. `p5_painel.py`: só agregados e uma lista curta de avaliações recentes, em `docs/painel/dados.json`.

## Painel

- A página (`docs/painel/index.html`) só lê `dados.json` e desenha. Nunca escreva
  número à mão: todo número, inclusive o dos títulos, sai das contas.
- ECharts com versão fixa. O título de cada gráfico é a conclusão, calculada.
- Barras ordenadas, começando no zero; uma cor de destaque (o vermelho) no app
  selecionado e cinza no resto; rótulo direto em vez de legenda.
- Nada de pizza, 3D, dois eixos y ou boxplot.
- Fonte e data da coleta no rodapé.

## Dados

- Cada coleta fica em `monitor/dados/coletas/AAAA-MM-DD/` (`avaliacoes_HHMM.csv.gz`
  e `notas_loja_HHMM.csv.gz`) e **nunca é editada**. Toda correção é um passo
  escrito ou uma linha em `regras/`.
- A App Store devolve só as 500 avaliações mais recentes e a Play Store, do jeito
  que coletamos, as 500 mais recentes: nos apps grandes isso cobre só 2 a 4 dias.
  Colete todo dia para não perder nada no meio.
- A mesma avaliação (mesma loja e mesmo id) aparece em várias coletas e conta
  **uma vez**. Se ela mudou entre coletas, vale a versão mais recente.
- Os aplicativos ficam em `regras/apps.csv` (segmento, empresa, id da App Store,
  id da Play Store). Adicionar um app é uma linha. Um segmento novo precisa também
  de uma lista de temas em `regras/dicionario.json`.

## Classificação com IA (Jev)

- Perguntas e opções em `regras/dicionario.json`, com uma lista de temas por
  segmento. Só entram as avaliações dos últimos 90 dias.
- Antes de mudar as opções, leia uma amostra dos textos reais. Teste em 10,
  confira à mão, e só então rode tudo.
- O cache (`dados/estruturado/cache.jsonl`) guarda só a marca do texto (sha1) e as
  respostas, nunca o texto. Rodar de novo não classifica de novo. Mudou o
  dicionário: apague o cache e anote a data em `_versao`.
- Respostas com confiança abaixo de 60% são contadas e mostradas no painel.

## Dados pessoais

- Nome, apelido e foto de quem avaliou **não são guardados**.
- Telefone, e-mail e CPF dentro do texto são mascarados já na coleta, e de novo
  ao juntar.
- O painel mostra agregados e no máximo 10 avaliações recentes por app e loja,
  com o texto mascarado.

## Checagens

- Estão em `passos/p3_checar.py`. Uma checagem que **bloqueia** impede o painel
  de ser atualizado (o programa sai com código 1 e o GitHub Actions não grava
  nada); um **alerta** aparece no painel para alguém olhar.
- Todo problema novo vira uma checagem nova. Antes de confiar nela, quebre uma
  cópia do dado de propósito e veja a checagem falhar (`testes/test_checagens.py`).

## Chaves

- A chave do Jev (`JEV_API_KEY`) fica só no `.env` (fora do repositório) e no
  segredo do GitHub. Nunca imprima nem grave a chave. Sem a chave, o painel sai com
  o que já está no cache.
