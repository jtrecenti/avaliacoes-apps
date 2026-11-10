# Demonstrações da aula

Quatro demonstrações (a 3 é opcional), todas no **aplicativo do ChatGPT para computador, no modo
Work**. Em cada pasta, o pedido está em `pedido.md`: é copiar e colar (os
slides também têm o botão "copiar").

## Antes da aula

1. **Instale as duas habilidades.** No ChatGPT: Personalizar → Habilidades →
   Adicionar → enviar arquivo, uma de cada vez:
   `1-contagem/habilidade-contar-termos/contar-termos.zip` e
   `2-baixar-avaliacoes/habilidade-avaliacoes-lojas/avaliacoes-lojas.zip`.
   Confira que `contar-termos` e `avaliacoes-lojas` aparecem na lista.
2. **Nenhuma outra habilidade é necessária:** a demonstração 4 traz o guia do
   Jev na própria pasta.
3. **Confira o `.env`** em `4-anotar-com-jev/` (linha `JEV_API_KEY=...`). Ele
   não vai para o GitHub nem para o `demos.zip`: quem baixou o zip cria o
   arquivo com a própria chave.
4. Se quiser repetir a demonstração 3 do zero, apague a habilidade
   `baixar-avaliacoes` que a última execução criou.

## 1. Contar sem e com uma habilidade (`1-contagem/`)

- `entrevista/grupo_focal_aerea_sol.txt`: a transcrição de um grupo focal
  fictício (916 falas, uma por linha, `NOME: texto`).
- **Sem habilidade:** abra uma conversa nova, anexe a transcrição e cole
  `sem-habilidade/pedido.md`. Repita numa segunda conversa nova e compare os
  totais. Na preparação do curso de executivos, três conversas deram 157, 161 e
  210 falas sobre preço.
- **Com habilidade:** numa conversa nova, anexe a transcrição e cole
  `com-habilidade/pedido.md`. A habilidade roda o script e dá sempre 162
  (Jéssica 69, Thiago 21, Roberto 20...). Nos trechos, "filmando na **cara**"
  aparece contado como preço: o erro é visível, e se repete.

## 2. Baixar as avaliações dos bancos (`2-baixar-avaliacoes/`)

Numa conversa nova, cole `pedido.md`. Ele usa a habilidade `avaliacoes-lojas`
(instalada antes da aula, a partir de `habilidade-avaliacoes-lojas/avaliacoes-lojas.zip`)
para baixar os quatro bancos e mostra a tabela de notas.

## 3. Criar uma habilidade com o skill creator (`3-criar-habilidade-opcional/`)

Opcional: pule se o tempo estiver curto. Numa conversa nova, cole `pedido.md`.
O skill creator do ChatGPT faz perguntas, escreve o `SKILL.md` e o script e
testa com o Nubank. Leva alguns minutos. Ela se chama `baixar-avaliacoes`, para
não colidir com a `avaliacoes-lojas` já instalada; a versão de referência está
em `skills/avaliacoes-lojas/`.

## 4. Anotar com o Jev (`4-anotar-com-jev/`)

Abra **esta pasta** no modo Work (ela já tem `avaliacoes_delivery.csv`, com
600 avaliações, o `dicionario.json`, o `como_usar_o_jev.md` e o `.env`) e cole
`pedido.md`. Ele testa em 10 só para ver se a chamada funciona, roda nas 600
sem parar para perguntar (em segundos), salva `avaliacoes_anotadas.xlsx`, faz
o gráfico e mostra as de confiança mais baixa.

Para refazer a pasta com dados mais novos: `python scripts/preparar_demo_jev.py`.
