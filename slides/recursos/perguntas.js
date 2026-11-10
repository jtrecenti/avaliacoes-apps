/*
 * As cinco perguntas do quiz, uma no fim de cada parte da aula, sobre o que
 * acabou de ser mostrado. certa é o índice da alternativa certa (0 a 3).
 */
window.QUIZ_PERGUNTAS = {
  q1: {
    enunciado: "A habilidade contar-termos deu 162 menções a preço em três conversas seguidas. O que dá para afirmar?",
    opcoes: [
      "Há exatamente 162 falas sobre preço no grupo focal",
      "A mesma regra foi aplicada ao mesmo texto nas três vezes",
      "O modelo leu e entendeu a transcrição inteira, três vezes",
      "Qualquer outra habilidade de contagem também daria 162",
    ],
    certa: 1, limite: 25,
    porque: "Mesmo número não é número certo: \"filmando na cara\" entrou como preço. O que o script garante é a mesma regra, escrita e conferível; corrigir a lista de termos vale para sempre.",
  },
  q2: {
    enunciado: "Por que a média das avaliações escritas fica abaixo da nota que a página da loja mostra, em todos os apps e nas duas lojas?",
    opcoes: [
      "A loja arredonda a nota para cima na página",
      "Quem escreve avaliação costuma escrever para reclamar",
      "O feed só entrega as avaliações mais negativas",
      "O script calculou a média de um jeito errado",
    ],
    certa: 1, limite: 25,
    porque: "A página soma milhões de notas, a maioria sem texto. Quem escreve costuma escrever para reclamar: as avaliações escritas não são uma amostra dos clientes, são um termômetro do que está incomodando agora.",
  },
  q3: {
    enunciado: "Para \"Praticidade e ótimos descontos\", o Jev deu 55% para elogio geral e 44% para cupons e promoções. O que fazer?",
    opcoes: [
      "Aceitar elogio geral, a opção mais provável",
      "Apagar a avaliação, porque o Jev ficou em dúvida",
      "Definir no dicionário onde entra o elogio a desconto",
      "Rodar de novo até a confiança passar de 90%",
    ],
    certa: 2, limite: 25,
    porque: "Confiança baixa quase sempre aponta uma pergunta mal definida: o texto cabe em duas opções. Quem decide a regra é você, no dicionário.",
  },
  q4: {
    enunciado: "Qual destas checagens deve BLOQUEAR a publicação do painel?",
    opcoes: [
      "A nota média caiu 0,1 desde ontem",
      "Uma avaliação ficou com um telefone sem máscara",
      "Um app recebeu menos avaliações que ontem",
      "O tema \"outro\" passou de 10%",
    ],
    certa: 1, limite: 20,
    porque: "Bloqueie o que pode expor alguém ou inverter uma conclusão. As outras três merecem um alerta: o painel sai, com um aviso.",
  },
  q5: {
    enunciado: "No mapa das avaliações do painel, quando dois pontos ficam perto um do outro, é porque…",
    opcoes: [
      "As duas avaliações têm a mesma nota",
      "As duas são do mesmo aplicativo",
      "As duas usam palavras parecidas",
      "As duas foram escritas no mesmo dia",
    ],
    certa: 2, limite: 20,
    porque: "Cada avaliação vira um vetor com as palavras que usa, e o t-SNE coloca perto os vetores parecidos. A cor (tema, nota, app) vem depois, das colunas.",
  },
};
