/*
 * As cinco perguntas do quiz, uma no fim de cada parte da aula, sobre o que
 * acabou de ser mostrado. certa é o índice da alternativa certa (0 a 3).
 */
window.QUIZ_PERGUNTAS = {
  q1: {
    enunciado: "Uma habilidade com script contou 41 avaliações que citam o Pix, e deu 41 de novo na segunda vez. O que isso garante?",
    opcoes: [
      "Que 41 é o número certo",
      "Que a conta se repete; se a regra estiver errada, ela erra igual toda vez",
      "Que o modelo não vai mais errar contas",
      "Nada: o script também sorteia",
    ],
    certa: 1, limite: 25,
    porque: "Mesmo número não é número certo. A vantagem do script é que a regra está escrita: dá para conferir, e corrigir a regra vale para sempre.",
  },
  q2: {
    enunciado: "Por que a média das avaliações escritas fica abaixo da nota que a página da loja mostra, em todos os apps e nas duas lojas?",
    opcoes: [
      "A loja arredonda a nota para cima",
      "A página soma milhões de notas sem texto, e quem escreve costuma escrever para reclamar",
      "O feed só entrega as avaliações de 1 estrela",
      "O script calculou a média errada",
    ],
    certa: 1, limite: 25,
    porque: "As avaliações escritas recentes não são uma amostra dos clientes: são um termômetro do que está incomodando agora.",
  },
  q3: {
    enunciado: "Para \"Praticidade e ótimos descontos\", o Jev deu 55% para elogio geral e 44% para cupons e promoções. O que fazer?",
    opcoes: [
      "Aceitar elogio geral: foi a opção mais provável",
      "Apagar a avaliação da base",
      "Rever o dicionário: dizer o que conta quando o texto elogia um desconto",
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
