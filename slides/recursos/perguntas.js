/*
 * As oito perguntas do quiz. certa é o índice da alternativa certa (0 a 3).
 * As que dependem dos dados (q3, q5) são reescritas por scripts/dados_slides.py
 * entre os marcadores abaixo.
 */
window.QUIZ_PERGUNTAS = {
  q1: {
    enunciado: "Em três conversas novas, você cola as mesmas 500 avaliações e pergunta: quantas falam de Pix? O mais provável é…",
    opcoes: ["Três números iguais", "Três números diferentes", "Ele se recusa a contar", "Ele responde 500 nas três"],
    certa: 1, limite: 20,
    porque: "O modelo escreve sorteando cada palavra. Para contar, ele precisa de um script, que segue a mesma receita toda vez.",
  },
  q2: {
    enunciado: "Qual destes é o jeito mais simples (e educado) de coletar as avaliações da App Store?",
    opcoes: ["Abrir a página no navegador e copiar à mão", "Usar o feed público que a Apple oferece", "Disfarçar o robô de navegador para não ser bloqueado", "Baixar mil páginas ao mesmo tempo"],
    certa: 1, limite: 20,
    porque: "Antes de raspar, procure um jeito mais simples: a Apple oferece um feed feito para programas lerem. E nunca se disfarce para passar por uma proteção.",
  },
  /* DADOS-QUIZ-INICIO */
  q3: {"enunciado": "Na App Store, o Bradesco tem nota 4,7 na página. Qual é a média das avaliações escritas nos últimos 30 dias?", "opcoes": ["4,6", "3,6", "2,9", "1,9"], "certa": 3, "limite": 20, "porque": "1,9, em 129 avaliações escritas. Quem escreve, escreve para reclamar: em 14 dos 14 pares de app e loja, a nota de quem escreve fica abaixo da página."},
  q5: {"enunciado": "Nos quatro bancos, qual é o tema número 1 das reclamações nos últimos 90 dias?", "opcoes": ["golpe e segurança", "pix e pagamentos", "app com falha", "tarifas e cobranças"], "certa": 2, "limite": 20, "porque": "Bancos: nos quatro, o tema número 1 é app com falha: de 24% das reclamações (Itaú) a 46% (Banco do Brasil)."},
  /* DADOS-QUIZ-FIM */
  q4: {
    enunciado: "O Jev anotou uma avaliação como \"cartão e fatura\", com confiança de 41%. O que fazer?",
    opcoes: ["Apagar a avaliação da base", "Ler o texto e, se for o caso, melhorar a definição das opções", "Rodar de novo até a confiança passar de 90%", "Nada: o modelo sabe mais que a gente"],
    certa: 1, limite: 20,
    porque: "Confiança baixa é um convite para ler. Muitas vezes o texto tem dois assuntos, ou a opção está mal definida: a pergunta é que precisa mudar.",
  },
  q6: {
    enunciado: "Qual destas checagens deve BLOQUEAR a publicação do painel?",
    opcoes: ["A nota média caiu 0,1 desde ontem", "Uma avaliação ficou com um telefone sem máscara", "Um app recebeu menos avaliações que ontem", "O tema \"outro\" passou de 10%"],
    certa: 1, limite: 20,
    porque: "Bloqueie o que pode expor alguém ou inverter uma conclusão. As outras três merecem um alerta: o painel sai, com um aviso.",
  },
  q7: {
    enunciado: "Quando o GitHub Actions atualiza o painel, onde o script roda?",
    opcoes: ["No meu computador, que precisa estar ligado", "Num servidor do GitHub, no horário marcado", "No celular de quem abre o painel", "Dentro do ChatGPT"],
    certa: 1, limite: 20,
    porque: "Um servidor do GitHub liga, roda o script, grava os dados e desliga. O painel continua sendo uma página estática.",
  },
  q8: {
    enunciado: "Você pede: \"faça um gráfico da nota média por app\". Qual detalhe do pedido mais melhora o resultado?",
    opcoes: ["Pedir que seja bonito", "Dizer a conclusão no título, barras ordenadas e uma cor de destaque", "Pedir um gráfico de pizza", "Pedir 3D para impressionar"],
    certa: 1, limite: 20,
    porque: "Regras concretas viram gráficos melhores: título com a conclusão calculada pelo código, barras ordenadas a partir do zero, uma cor de destaque e cinza no resto.",
  },
};
