# Avaliações dos apps de bancos e delivery

Material do curso **Marketing Analítico com IA** (Insper, Educação Executiva).

Um monitor que, todo dia, coleta as avaliações dos aplicativos de bancos (Nubank,
Itaú, Banco do Brasil, Bradesco) e de delivery (iFood, Rappi, Zé Delivery) na App
Store e na Play Store do Brasil, confere a qualidade dos dados, classifica o tema
de cada avaliação com IA (o Jev) e publica um painel.

- **Painel:** https://jtrecenti.github.io/avaliacoes-apps/painel/
- **Atualizações:** https://github.com/jtrecenti/avaliacoes-apps/actions

## Como o monitor funciona

`python monitor/rodar.py` roda seis passos, cada um num arquivo de `monitor/passos/`:

1. **coletar**: as avaliações mais recentes nas duas lojas e a nota oficial de cada app.
2. **juntar**: todas as coletas numa base só; a mesma avaliação conta uma vez.
3. **checar**: frases que precisam ser verdade. Se uma que bloqueia falhar, o painel não é atualizado.
4. **anotar**: o Jev classifica o tema e se a avaliação reclama de algo (últimos 90 dias).
5. **modelos**: o mapa das avaliações e a regressão do que explica a nota (veja abaixo).
6. **painel**: grava `docs/painel/dados.json`, que a página do painel lê.

Cada passo diz quantas linhas entraram, quantas saíram e por quê.

### Os dois modelos (passo 5)

Rodam no próprio computador (ou no GitHub Actions), sem API e sem chave, em uns
15 segundos, e dão sempre o mesmo resultado com os mesmos dados.

- **Mapa das avaliações.** Cada avaliação dos últimos 90 dias (título e texto)
  vira um vetor com as palavras que ela usa (TF-IDF: minúsculas, sem acento, sem
  palavras muito comuns e sem o nome dos apps, palavras e pares de palavras). O
  vetor é resumido em 100 números (TruncatedSVD) e o t-SNE projeta tudo num plano:
  avaliações que usam palavras parecidas ficam perto. Um mapa por segmento, em
  `docs/painel/mapa.json`, que a página lê depois de desenhar o resto. O título
  diz qual tema forma o grupo mais nítido (a % das 10 avaliações mais parecidas
  com cada uma que têm o mesmo tema). O mapa mostra só o corpo da avaliação,
  cortado em 140 caracteres e mascarado: o título fica de fora porque na App
  Store muita gente escreve o próprio nome nele.
- **O que explica a nota.** Entre as reclamações dos últimos 90 dias, uma
  regressão linear: `nota ~ tema + app + loja` (statsmodels, erros robustos HC3).
  Para cada tema com pelo menos 30 reclamações, a média ajustada é a nota que o
  modelo prevê se todas as reclamações fossem daquele tema, com a mesma mistura
  de apps e lojas, com intervalo de 95%. Vai em `dados.json`, dentro de cada
  segmento (`regressao`), com o R² e a frase da conclusão.

```
monitor/
  rodar.py               roda tudo
  passos/                um arquivo por passo
  regras/apps.csv        os apps monitorados
  regras/dicionario.json as perguntas e os temas que o Jev usa
  dados/coletas/         cada coleta, como chegou (nunca editada)
  dados/processados/     a base juntada (avaliacoes.csv.gz)
  dados/estruturado/     o cache das respostas do Jev (sem o texto)
  AGENTS.md              as regras do projeto, para pessoas e agentes
docs/painel/             a página do painel (index.html, estilo.css, dados.json, mapa.json)
testes/                  testes automáticos (pytest)
```

## Como atualizar o painel

O painel se atualiza sozinho todo dia às 09:00 (horário de Brasília). Para
atualizar na hora:

1. Abra a aba [Actions](https://github.com/jtrecenti/avaliacoes-apps/actions).
2. Clique em **Atualizar painel**, depois em **Run workflow** e de novo em **Run workflow**.
3. Em 2 a 3 minutos o job termina, grava os dados novos e o GitHub Pages publica o painel.

Se uma checagem que bloqueia falhar, o job fica vermelho e nada é gravado: o
painel continua com a última versão boa.

## Como rodar no seu computador

```
pip install -r requirements.txt
python monitor/rodar.py
python -m pytest testes
```

Para ver o painel, sirva a pasta do repositório e abra o endereço no navegador
(abrir o arquivo direto não funciona, porque a página lê `dados.json`):

```
python -m http.server
# http://localhost:8000/docs/painel/
```

Para a classificação com IA, crie um arquivo `.env` na raiz com `JEV_API_KEY=...`.
O `.env` nunca vai para o repositório. Sem a chave, o monitor usa só o que já está
no cache e avisa quantas avaliações ficaram sem tema.

## Como adicionar um app

Uma linha em `monitor/regras/apps.csv`:

```
segmento,empresa,id_app_store,id_play_store
Delivery,Nome do App,123456789,com.empresa.app
```

- O id da App Store é o número no fim do endereço da página do app (`.../id123456789`).
- O id da Play Store é o que vem depois de `id=` no endereço (`...?id=com.empresa.app`).
- Um segmento novo também precisa de uma lista de temas em `monitor/regras/dicionario.json`.

## Como colocar a chave do Jev no GitHub

A chave fica num segredo do repositório (nunca no código). No terminal:

```
gh secret set JEV_API_KEY -R jtrecenti/avaliacoes-apps
```

Ou pelo site: Settings, Secrets and variables, Actions, New repository secret.
Sem o segredo, o job roda do mesmo jeito, só sem classificar avaliações novas.

## Checagens de qualidade

Bloqueiam (se falharem, o painel não é atualizado):

- toda coleta tem exatamente as colunas esperadas
- nenhuma coleta guarda nome, apelido ou foto de quem avaliou
- todo aplicativo da lista veio nas duas lojas na coleta mais recente
- toda avaliação tem loja, empresa, identificador, data e nota
- toda nota está entre 1 e 5
- nenhuma avaliação repetida na base final
- nenhuma avaliação com data depois do dia da coleta
- nenhum texto com telefone, e-mail ou CPF sem máscara

Alertam (o painel sai, com um aviso):

- a coleta mais recente tem pelo menos 200 avaliações por app e loja
- a nota oficial da loja veio para todo app nas duas lojas
- cada coleta alcança a anterior (nenhuma avaliação perdida no meio)
- nenhuma avaliação mudou entre coletas
- nenhuma avaliação precisou de máscara de dado pessoal
- toda avaliação dos últimos 90 dias tem tema
- menos de 10% dos temas com confiança abaixo de 60%

## Dados pessoais

Nome, apelido e foto de quem avaliou não são guardados. Telefone, e-mail e CPF que
aparecem no texto são trocados por `[telefone removido]`, `[e-mail removido]` e
`[CPF removido]` antes de qualquer arquivo ser gravado.

## Slides e quiz

- **Slides:** [jtrecenti.github.io/avaliacoes-apps/slides](https://jtrecenti.github.io/avaliacoes-apps/slides/).
  Fonte em `slides/index.qmd` (Quarto + reveal.js), com as cenas animadas em
  `slides/recursos/*.js` (GSAP). Para gerar: `cd slides && quarto render`.
  Os números das cenas vêm de `python scripts/dados_slides.py`, que lê o painel.
- **Quiz:** [jtrecenti.github.io/avaliacoes-apps/quiz](https://jtrecenti.github.io/avaliacoes-apps/quiz/),
  no celular. O telão fica dentro dos slides: no slide "Entre no quiz", digite a
  chave do professor e clique em "abrir a sala"; em cada pergunta, **V** abre e
  **R** revela. Cada acerto vale de 1.000 pontos (na hora) a 500 (no último
  segundo). As respostas ficam no Firebase Realtime Database (nó `aulaapps`;
  regras em `firebase/`, publicadas com `python scripts/firebase_regras.py --publicar`).
  Para uma partida nova, use outra sala: `slides/?sala=outro-nome` e
  `quiz/?sala=outro-nome`.
- **Prints dos slides:** `python scripts/capturar.py index` grava em `slides/_capturas/`.
