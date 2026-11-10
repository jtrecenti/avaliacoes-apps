Use o skill creator para criar uma habilidade chamada baixar-avaliacoes.

Objetivo: baixar as avaliações de um aplicativo na App Store e na Google Play do Brasil, sempre do mesmo jeito, com um script em Python.

Entrada: o nome do app, o número dele na App Store e o pacote dele na Google Play.

Como baixar: na App Store, o feed RSS em JSON (até 10 páginas de 50, as mais recentes); na Google Play, o pacote google-play-scraper (as 500 mais recentes).

Regras: uma página por vez, com pausa; guarde o arquivo bruto antes de ler; nunca guarde o nome de quem avaliou; mascare telefone, e-mail e CPF.

Saída: um CSV (loja, app, id, data, nota, título, texto, versão) e um resumo: quantas avaliações vieram de cada loja, de que data a que data e a nota média.

Teste: com o Nubank (App Store 814456780, Google Play com.nu.production).
