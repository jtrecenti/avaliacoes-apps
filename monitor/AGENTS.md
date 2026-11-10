# Regras deste monitor (o agente lê antes de qualquer tarefa)

Este monitor acompanha, todo dia, as avaliações dos aplicativos de bancos (Nubank,
Itaú, Banco do Brasil, Bradesco) e de delivery (iFood, Rappi, Zé Delivery) na App
Store e na Play Store do Brasil, e publica um painel em `docs/painel/`.

## Como rodar

- Um comando refaz tudo, da raiz do repositório: `python monitor/rodar.py`.
  Coleta hoje (se ainda não houver coleta hoje), junta, checa, anota com o Jev,
  roda os modelos e grava `docs/painel/dados.json` e `docs/painel/mapa.json`.
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
5. `p5_modelos.py`: o mapa das avaliações (TF-IDF + TruncatedSVD + t-SNE, em
   `docs/painel/mapa.json`) e a regressão do que explica a nota (vai no `dados.json`).
6. `p6_painel.py`: só agregados e uma lista curta de avaliações recentes, em `docs/painel/dados.json`.

## Modelos (passo 5)

- Rodam sem API e sem chave, em segundos, e são refeitos a cada rodada (não há
  cache). `random_state=42` em tudo: os mesmos dados dão o mesmo mapa.
- **Mapa**: título + texto viram um vetor TF-IDF (minúsculas, sem acento,
  stopwords em português escritas no código, sem o nome dos apps, palavras e
  pares, `min_df=3`, `sublinear_tf`), resumido em 100 componentes (TruncatedSVD),
  normalizado e projetado em 2D com t-SNE (`init="pca"`, perplexidade 30), um
  mapa por segmento. Texto sem nenhuma palavra do vocabulário (só emoji, por
  exemplo) fica fora do mapa, e o passo diz quantos. Textos repetidos ganham um
  pequeno espalhamento fixo para aparecer.
- O mapa mostra o corpo da avaliação (até 140 caracteres, mascarado), **nunca o
  título**: na App Store muita gente escreve o próprio nome no título.
- **Regressão**: só as reclamações (`reclamacao` verdadeiro) com tema dos últimos
  90 dias; `nota ~ C(tema) + C(empresa) + C(loja)` com statsmodels (erros HC3).
  Temas com menos de 30 reclamações entram juntos numa categoria só e não
  aparecem no gráfico. A média ajustada de um tema é a previsão média trocando o
  tema de todas as reclamações por ele (mesma mistura de apps e lojas), com
  intervalo de 95%. A frase da conclusão fala dos temas específicos (não de
  "outro", "crítica geral" ou "elogio geral") e, se os intervalos dos dois
  menores se cruzam, cita os dois.

## Painel

- A página (`docs/painel/index.html`) só lê `dados.json` e desenha. Nunca escreva
  número à mão: todo número, inclusive o dos títulos, sai das contas.
- ECharts com versão fixa. O título de cada gráfico é a conclusão, calculada.
- Barras ordenadas, começando no zero; uma cor de destaque (o vermelho) no app
  selecionado e cinza no resto; rótulo direto em vez de legenda.
- Nada de pizza, 3D, dois eixos y ou boxplot.
- Exceção às cores: no mapa das avaliações, pintar por tema usa uma paleta de
  categorias (os temas "outro", "crítica geral" e "elogio geral" em cinza) e
  pintar por nota vai do vermelho (1) ao verde (5). O app em destaque pode apagar
  os outros apps.
- `mapa.json` é lido depois que o resto da página foi desenhado.
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
  com o texto mascarado. O mapa (`mapa.json`) mostra o corpo de cada avaliação
  dos últimos 90 dias, cortado em 140 caracteres, mascarado e sem o título.

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
