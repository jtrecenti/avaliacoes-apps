/*
 * Cenas desta aula (avaliações de sete aplicativos nas duas lojas).
 * Usa o motor de passos (recursos/motor.js) e as classes de recursos/cenas.css.
 *
 * Os números vêm do monitor (monitor/dados/processados e docs/painel/dados.json):
 * scripts/dados_slides.py reescreve o bloco DADOS abaixo. Nada escrito à mão.
 */
/* DADOS-INICIO */
const DADOS_AP = {"contagem": {"app": "Itaú", "loja": "App Store", "n": 500, "modelo": "gpt-5.6-luna", "pergunta": "Abaixo estão 500 avaliações do aplicativo do Itaú. Quantas delas citam o Pix? Responda só com o número.", "respostas_modelo": [32, 32, 32], "regra": "\\bpix\\b", "script": 32}, "jev": {"chamadas": [{"empresa": "Itaú", "segmento": "Bancos", "loja": "play_store", "nota": 5, "titulo": "", "texto": "Não estou conseguindo acessar a fatura do cartão de crédito", "estado": {"texto": "Não estou conseguindo acessar a fatura do cartão de crédito"}, "tema": "cartão e fatura", "probs": [["cartão e fatura", 0.98], ["acesso e login", 0.02], ["app com falha", 0.0], ["pix e pagamentos", 0.0], ["crédito e limite", 0.0]], "reclamacao": 0.95}, {"empresa": "Zé Delivery", "segmento": "Delivery", "loja": "app_store", "nota": 1, "titulo": "Taxa de entrega abusiva", "texto": "Dou apenas uma estrela. \nCerveja quente, taxa de quase R$7,00", "estado": {"titulo": "Taxa de entrega abusiva", "texto": "Dou apenas uma estrela. \nCerveja quente, taxa de quase R$7,00"}, "tema": "preços e taxas", "probs": [["preços e taxas", 0.99], ["qualidade da comida ou do produto", 0.01], ["app com falha", 0.0], ["atraso na entrega", 0.0], ["pedido errado ou incompleto", 0.0]], "reclamacao": 0.98}, {"empresa": "iFood", "segmento": "Delivery", "loja": "app_store", "nota": 5, "titulo": "Muito bom", "texto": "Praticidade e ótimos descontos", "estado": {"titulo": "Muito bom", "texto": "Praticidade e ótimos descontos"}, "tema": "elogio geral", "probs": [["elogio geral", 0.55], ["cupons e promoções", 0.44], ["preços e taxas", 0.01], ["app com falha", 0.0], ["atraso na entrega", 0.0]], "reclamacao": 0.02}], "tabela": [{"empresa": "iFood", "nota": 5, "texto": "Praticidade e ótimos descontos", "tema": "elogio geral", "conf": 0.51, "reclama": false}, {"empresa": "iFood", "nota": 4, "texto": "Muita praticidade e promoção apenas para reembolso ou troca que deveriam melhorar .", "tema": "cupons e promoções", "conf": 0.48, "reclama": true}, {"empresa": "Zé Delivery", "nota": 1, "texto": "Era um app bom, pena que agora começaram a escolher onde querem entregar", "tema": "cancelamento e reembolso", "conf": 0.35, "reclama": true}, {"empresa": "iFood", "nota": 5, "texto": "e miito bom tem desconto de 1,89 e 0,09 centavos é muito bom", "tema": "cupons e promoções", "conf": 0.59, "reclama": false}, {"empresa": "iFood", "nota": 5, "texto": "Hace lo q tiene q hacer el app \nLo hace bien q mas", "tema": "elogio geral", "conf": 1.0, "reclama": false}, {"empresa": "iFood", "nota": 5, "texto": "ótima experiência !!! muito bom o Ifood 💗", "tema": "elogio geral", "conf": 1.0, "reclama": false}, {"empresa": "iFood", "nota": 5, "texto": "foi umas das melhores coisas que já fizeram porque adianta muito a sua vida.", "tema": "elogio geral", "conf": 0.99, "reclama": false}, {"empresa": "Zé Delivery", "nota": 2, "texto": "Utilizo apenas em situação de necessidade mas não é a minha primeira nem segunda opção", "tema": "preços e taxas", "conf": 1.0, "reclama": true}]}, "apps": [{"empresa": "Nubank", "segmento": "Bancos", "ios": {"nota_loja": 4.82, "n_loja": 1673353, "media_escrita": 3.32, "n": 179}, "play": {"nota_loja": 4.75, "n_loja": 6008653, "media_escrita": 4.05, "n": 552}}, {"empresa": "Itaú", "segmento": "Bancos", "ios": {"nota_loja": 4.7, "n_loja": 3284219, "media_escrita": 3.3, "n": 309}, "play": {"nota_loja": 4.77, "n_loja": 5924348, "media_escrita": 3.51, "n": 523}}, {"empresa": "Banco do Brasil", "segmento": "Bancos", "ios": {"nota_loja": 4.75, "n_loja": 4280307, "media_escrita": 3.84, "n": 500}, "play": {"nota_loja": 4.71, "n_loja": 8544809, "media_escrita": 3.32, "n": 533}}, {"empresa": "Bradesco", "segmento": "Bancos", "ios": {"nota_loja": 4.73, "n_loja": 3147979, "media_escrita": 1.91, "n": 129}, "play": {"nota_loja": 4.69, "n_loja": 6084237, "media_escrita": 2.9, "n": 525}}, {"empresa": "iFood", "segmento": "Delivery", "ios": {"nota_loja": 4.86, "n_loja": 8994959, "media_escrita": 3.63, "n": 509}, "play": {"nota_loja": 4.71, "n_loja": 13496299, "media_escrita": 4.01, "n": 656}}, {"empresa": "Rappi", "segmento": "Delivery", "ios": {"nota_loja": 4.54, "n_loja": 448971, "media_escrita": 1.7, "n": 47}, "play": {"nota_loja": 4.05, "n_loja": 2384243, "media_escrita": 2.22, "n": 78}}, {"empresa": "Zé Delivery", "segmento": "Delivery", "ios": {"nota_loja": 4.93, "n_loja": 697839, "media_escrita": 3.83, "n": 81}, "play": {"nota_loja": 4.9, "n_loja": 1815609, "media_escrita": 4.2, "n": 512}}], "temas": {"Bancos": {"apps": ["Nubank", "Itaú", "Banco do Brasil", "Bradesco"], "temas": ["app com falha", "acesso e login", "pix e pagamentos", "cartão e fatura", "crédito e limite", "atendimento", "tarifas e cobranças", "golpe e segurança"], "pct": {"Nubank": {"app com falha": 34.6, "acesso e login": 14.1, "pix e pagamentos": 11.3, "cartão e fatura": 3.7, "crédito e limite": 9.1, "golpe e segurança": 3.0, "conta bloqueada ou encerrada": 4.3, "tarifas e cobranças": 3.3, "atendimento": 1.3, "sugestão de recurso": 4.8, "crítica geral": 7.2, "elogio geral": 0.0, "outro": 3.3}, "Itaú": {"app com falha": 24.8, "acesso e login": 18.9, "pix e pagamentos": 11.4, "cartão e fatura": 8.1, "crédito e limite": 4.3, "golpe e segurança": 2.0, "conta bloqueada ou encerrada": 0.8, "tarifas e cobranças": 3.5, "atendimento": 5.7, "sugestão de recurso": 4.9, "crítica geral": 12.8, "elogio geral": 0.2, "outro": 2.8}, "Banco do Brasil": {"app com falha": 48.6, "acesso e login": 20.2, "pix e pagamentos": 6.4, "cartão e fatura": 1.5, "crédito e limite": 0.9, "golpe e segurança": 0.9, "conta bloqueada ou encerrada": 0.7, "tarifas e cobranças": 0.7, "atendimento": 3.3, "sugestão de recurso": 2.2, "crítica geral": 12.1, "elogio geral": 0.4, "outro": 2.2}, "Bradesco": {"app com falha": 33.5, "acesso e login": 19.8, "pix e pagamentos": 11.1, "cartão e fatura": 4.3, "crédito e limite": 2.3, "golpe e segurança": 0.8, "conta bloqueada ou encerrada": 0.9, "tarifas e cobranças": 2.9, "atendimento": 4.6, "sugestão de recurso": 3.7, "crítica geral": 14.0, "elogio geral": 0.2, "outro": 2.1}}, "top": {"Nubank": "app com falha", "Itaú": "app com falha", "Banco do Brasil": "app com falha", "Bradesco": "app com falha"}, "reclama": {"Nubank": 51.2, "Itaú": 49.5, "Banco do Brasil": 44.0, "Bradesco": 66.9}}, "Delivery": {"apps": ["iFood", "Rappi", "Zé Delivery"], "temas": ["atraso na entrega", "app com falha", "cupons e promoções", "cancelamento e reembolso", "atendimento", "preços e taxas", "pagamento", "conta e cadastro"], "pct": {"iFood": {"app com falha": 5.7, "atraso na entrega": 10.2, "pedido errado ou incompleto": 5.5, "cancelamento e reembolso": 12.7, "preços e taxas": 9.9, "cupons e promoções": 14.4, "pagamento": 8.9, "conta e cadastro": 3.7, "atendimento": 12.9, "entregador": 1.7, "qualidade da comida ou do produto": 2.5, "crítica geral": 5.2, "elogio geral": 0.7, "outro": 6.0}, "Rappi": {"app com falha": 15.5, "atraso na entrega": 15.8, "pedido errado ou incompleto": 7.3, "cancelamento e reembolso": 10.0, "preços e taxas": 5.8, "cupons e promoções": 3.3, "pagamento": 10.0, "conta e cadastro": 4.6, "atendimento": 9.4, "entregador": 3.6, "qualidade da comida ou do produto": 0.6, "crítica geral": 9.4, "elogio geral": 0.0, "outro": 4.6}, "Zé Delivery": {"app com falha": 11.6, "atraso na entrega": 9.3, "pedido errado ou incompleto": 5.3, "cancelamento e reembolso": 8.3, "preços e taxas": 10.6, "cupons e promoções": 14.9, "pagamento": 2.3, "conta e cadastro": 11.3, "atendimento": 4.3, "entregador": 4.0, "qualidade da comida ou do produto": 4.3, "crítica geral": 7.3, "elogio geral": 0.3, "outro": 6.3}}, "top": {"iFood": "cupons e promoções", "Rappi": "atraso na entrega", "Zé Delivery": "cupons e promoções"}, "reclama": {"iFood": 34.6, "Rappi": 80.2, "Zé Delivery": 32.6}}}, "linha": {"empresa": "Itaú", "loja": "Google Play", "nota": 5, "titulo": "", "texto": "Não estou conseguindo acessar a fatura do cartão de crédito", "tema": "cartão e fatura", "conf_tema": 0.98, "reclamacao": "sim", "conf_reclamacao": 0.94}, "checagens": [{"frase": "toda coleta tem exatamente as colunas esperadas", "nivel": "bloqueia", "ok": true}, {"frase": "nenhuma coleta guarda nome, apelido ou foto de quem avaliou", "nivel": "bloqueia", "ok": true}, {"frase": "todo aplicativo da lista veio nas duas lojas na coleta mais recente", "nivel": "bloqueia", "ok": true}, {"frase": "toda avaliação tem loja, empresa, identificador, data e nota", "nivel": "bloqueia", "ok": true}, {"frase": "toda nota está entre 1 e 5", "nivel": "bloqueia", "ok": true}, {"frase": "nenhuma avaliação repetida na base final", "nivel": "bloqueia", "ok": true}, {"frase": "nenhuma avaliação com data depois do dia da coleta", "nivel": "bloqueia", "ok": true}, {"frase": "nenhum texto com telefone, e-mail ou CPF sem máscara", "nivel": "bloqueia", "ok": true}, {"frase": "a coleta mais recente tem pelo menos 200 avaliações por app e loja", "nivel": "alerta", "ok": true}, {"frase": "a nota oficial da loja veio para todo app nas duas lojas", "nivel": "alerta", "ok": true}, {"frase": "cada coleta alcança a anterior (nenhuma avaliação perdida no meio)", "nivel": "alerta", "ok": true}, {"frase": "nenhuma avaliação mudou entre coletas", "nivel": "alerta", "ok": true}, {"frase": "nenhuma avaliação precisou de máscara de dado pessoal", "nivel": "alerta", "ok": false}, {"frase": "toda avaliação dos últimos 90 dias tem tema", "nivel": "alerta", "ok": true}, {"frase": "menos de 10% dos temas com confiança abaixo de 60%", "nivel": "alerta", "ok": false}], "fonte": "App Store e Google Play, coleta de 09/11/2026; média das escritas: últimos 30 dias", "fonte_temas": "% das avaliações que reclamam, por tema; últimos 90 dias, as duas lojas; coleta de 09/11/2026", "texto": {"n_avaliacoes": "7.320", "n_anotadas": "6.599", "n_textos_jev": "5.267", "seg_jev": "63", "conf_baixa": "667", "pct_conf_baixa": "10%", "opcoes_bancos": "app com falha, acesso e login, pix e pagamentos, cartão e fatura, crédito e limite, golpe e segurança, conta bloqueada ou encerrada, tarifas e cobranças, atendimento, sugestão de recurso, crítica geral, elogio geral, outro", "leg_temas_bancos": "**Bancos:** nos quatro, o tema número 1 é **app com falha**: de 25% das reclamações (Itaú) a 49% (Banco do Brasil).", "leg_temas_delivery": "**Delivery:** no iFood, **cupons e promoções**; no Rappi, **atraso na entrega**; no Zé Delivery, **cupons e promoções**. E 80% das avaliações do Rappi reclamam de algo.", "leg_notas": "Em **14 dos 14** pares de app e loja, quem escreve dá nota menor que a média da loja. A maior distância: Rappi na App Store, 4,5 na página e 1,7 nas escritas.", "n_checagens": "15", "n_ok": "13"}};
/* DADOS-FIM */
(function () {
  "use strict";
  const { svg, html, escala, num, seta, vis, DUR } = Motor.util;
  function txt(pai, x, y, t, attrs = {}) {
    const a = Object.assign({}, attrs);
    if (a["font-size"]) { a.style = (a.style ? a.style + ";" : "") + `font-size:${a["font-size"]}px`; delete a["font-size"]; }
    return Motor.util.txt(pai, x, y, t, a);
  }
  const quadro = (caixa, w, h) => svg("svg", { viewBox: `0 0 ${w} ${h}`, class: "grafico-svg" }, caixa);
  function mostra(el, on, anim, atraso = 0) {
    if (!el) return;
    gsap.to(el, { autoAlpha: on ? 1 : 0, duration: anim ? DUR : 0, delay: anim && on ? atraso : 0, overwrite: "auto" });
  }
  const esconde = (lista) => lista.forEach((e) => e && gsap.set(e, { autoAlpha: 0 }));
  const D = DADOS_AP || { apps: [], temas: {}, linha: null, checagens: [], jev: {} };
  const SEG_COR = { Bancos: "var(--roxo)", Delivery: "var(--laranja)" };
  const pct = (v) => num(v, 0) + "%";
  const mil = (v) => (v >= 1e6 ? `${num(v / 1e6, 1)} mi` : v >= 1e3 ? `${num(v / 1e3, 0)} mil` : num(v, 0));

  const css = document.createElement("style");
  css.textContent = `
  .ap-apps { display: grid; grid-template-columns: repeat(4, 1fr); gap: .8rem; margin-top: .3rem; }
  .ap-app { background: var(--superficie); border-radius: 12px; padding: .55rem .8rem .6rem; border-top: 5px solid var(--cor); }
  .ap-app .nome { font-family: "GT Ultra Fine", Georgia, serif; font-size: 1.15em; font-weight: 700; }
  .ap-app .seg { font-size: .55em; color: var(--texto-fraco); text-transform: uppercase; letter-spacing: .06em; }
  .ap-app .lojas { display: grid; gap: .2rem; margin-top: .4rem; font-size: .6em; }
  .ap-app .lojas div { display: flex; justify-content: space-between; gap: .4rem; }
  .ap-app .lojas b { font-size: 1.15em; }
  .ap-app.vazio { background: none; border: 2px dashed var(--superficie-borda); display: grid; place-items: center; text-align: center; color: var(--texto-fraco); font-size: .6em; }
  .ap-linha { display: grid; grid-template-columns: 1fr 70px 1.15fr; align-items: center; gap: .6rem; margin-top: .4rem; }
  .ap-aval { background: var(--superficie); border-radius: 12px; padding: .9rem 1rem; font-size: .82em; line-height: 1.4; border-left: 5px solid var(--marca); }
  .ap-aval .meta { color: var(--texto-fraco); font-size: .85em; margin-bottom: .3rem; }
  .ap-aval .estrelas { color: #d59a00; letter-spacing: .1em; }
  .ap-seta { font-size: 2.2em; text-align: center; color: var(--texto-fraco); }
  .ap-tab { border-collapse: collapse; width: 100%; font-size: .76em; }
  .ap-tab th { text-align: left; color: var(--texto-fraco); font-weight: 600; padding: .25rem .4rem; border-bottom: 2px solid var(--regua); text-transform: none; letter-spacing: 0; }
  .ap-tab td { padding: .35rem .4rem; border-bottom: 1px solid var(--regua); vertical-align: middle; }
  .ap-tab td.v { font-weight: 700; }
  .ap-conf { display: inline-block; width: 90px; height: 12px; background: var(--superficie); border-radius: 6px; overflow: hidden; vertical-align: middle; margin-right: .3rem; }
  .ap-conf i { display: block; height: 100%; background: var(--turquesa); }
  .ap-checks { display: grid; gap: .35rem; margin-top: .3rem; }
  .ap-check { display: grid; grid-template-columns: 2.1rem 1fr 6.5rem; gap: .6rem; align-items: center; background: var(--superficie); border-radius: 10px; padding: .3rem .7rem; font-size: .62em; }
  .ap-check .ic { width: 1.7rem; height: 1.7rem; border-radius: 50%; display: grid; place-items: center; color: #fff; font-weight: 800; }
  .ap-check .ic.ok { background: var(--turquesa); }
  .ap-check .ic.alerta { background: #d59a00; }
  .ap-check .ic.falha { background: var(--marca); }
  .ap-check .nv { font-size: .85em; font-weight: 700; text-align: right; }
  .ap-check .nv.bloqueia { color: var(--marca); }
  .ap-check .nv.alerta { color: #b07f00; }
  `;
  document.head.appendChild(css);

  /* Números e frases calculados pelo script, nos lugares marcados com []{.dado data-k="..."} */
  document.querySelectorAll(".dado[data-k]").forEach((e) => {
    const v = D.texto?.[e.dataset.k];
    if (v != null) e.innerHTML = String(v).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  });

  /* Botão "copiar" nos pedidos das demonstrações: o professor clica e cola no ChatGPT. */
  document.querySelectorAll(".prompt.prompt-estruturado").forEach((p) => {
    const b = html("button", "copiar", p, "copiar");
    b.type = "button";
    b.addEventListener("click", async (e) => {
      e.stopPropagation();
      const clone = p.cloneNode(true);
      clone.querySelector(".copiar")?.remove();
      document.body.appendChild(clone); // innerText só respeita quebras em nós no documento
      clone.style.cssText = "position:absolute;left:-9999px;white-space:normal";
      const texto = clone.innerText.trim(); // o rótulo (data-quem) é CSS e não entra
      clone.remove();
      try { await navigator.clipboard.writeText(texto); b.textContent = "copiado"; b.classList.add("ok"); }
      catch { b.textContent = "selecione e copie"; }
      setTimeout(() => { b.textContent = "copiar"; b.classList.remove("ok"); }, 2500);
    });
  });

  /* ======================================================================
   * 1. Os sete aplicativos, com a nota e o volume de cada loja
   * ==================================================================== */
  Motor.cena("ap-apps", {
    montar(caixa) {
      const g = html("div", "ap-apps", caixa);
      this.lojas = [];
      for (const a of D.apps) {
        const c = html("div", "ap-app", g);
        c.style.setProperty("--cor", SEG_COR[a.segmento] || "var(--regua)");
        html("div", "seg", c, a.segmento);
        html("div", "nome", c, a.empresa);
        const l = html("div", "lojas", c);
        for (const [rot, k] of [["App Store", "ios"], ["Google Play", "play"]]) {
          const s = a[k];
          if (!s) continue;
          html("div", "", l, `<span>${rot}</span><span><b>${num(s.nota_loja, 1)}</b> ★ · ${mil(s.n_loja)} notas</span>`);
        }
        this.lojas.push(l);
      }
      const v = html("div", "ap-app vazio", g, "e o app da sua empresa:<br>uma linha a mais em <code>apps.csv</code>");
      this.vazio = v;
      esconde([...this.lojas, v]);
    },
    passo(k, anim) {
      this.lojas.forEach((l, i) => mostra(l, k >= 1, anim, i * 0.06));
      mostra(this.vazio, k >= 2, anim);
    },
  });

  /* ======================================================================
   * 2. Nota da loja x nota de quem escreve, por app e loja
   * ==================================================================== */
  Motor.cena("ap-notas", {
    montar(caixa) {
      const linhas = [];
      for (const a of D.apps) for (const [k, rot] of [["ios", "App Store"], ["play", "Google Play"]]) if (a[k]) linhas.push({ a, k, rot, s: a[k] });
      const RH = 28, H = 46 + linhas.length * RH;
      const s = quadro(caixa, 1100, H + 52);
      s.style.maxHeight = "470px";
      const sx = escala(1, 5, 350, 1060);
      for (let v = 1; v <= 5; v++) {
        svg("line", { x1: sx(v), x2: sx(v), y1: 26, y2: H, class: "grade-linha" }, s);
        txt(s, sx(v), H + 22, `${v} ★`, { class: "rotulo-eixo", "text-anchor": "middle", "font-size": 17 });
      }
      this.pag = []; this.med = [];
      let ant = null;
      linhas.forEach((L, i) => {
        const y = 48 + i * RH;
        if (L.a.empresa !== ant) {
          txt(s, 0, y + 6, L.a.empresa, { class: "txt forte", "font-size": 19, style: `fill:${SEG_COR[L.a.segmento]}` });
          ant = L.a.empresa;
        }
        txt(s, 190, y + 6, L.rot, { class: "txt fraco", "font-size": 17 });
        const gp = svg("g", {}, s);
        svg("circle", { cx: sx(L.s.nota_loja), cy: y, r: 8, fill: "var(--fundo)", stroke: "var(--texto-fraco)", "stroke-width": 3 }, gp);
        txt(gp, sx(L.s.nota_loja) + 14, y + 6, num(L.s.nota_loja, 1), { class: "anot fraco", "font-size": 17 });
        this.pag.push(gp);
        const gm = svg("g", {}, s);
        svg("line", { x1: sx(L.s.media_escrita) + 9, x2: sx(L.s.nota_loja) - 9, y1: y, y2: y, class: "seta marca", "stroke-width": 3 }, gm);
        svg("circle", { cx: sx(L.s.media_escrita), cy: y, r: 9, fill: "var(--marca)" }, gm);
        txt(gm, sx(L.s.media_escrita) - 14, y + 6, num(L.s.media_escrita, 1), { class: "anot marca", "text-anchor": "end", "font-size": 17 });
        this.med.push(gm);
      });
      const leg = svg("g", {}, s);
      svg("circle", { cx: 340, cy: 10, r: 7, fill: "var(--fundo)", stroke: "var(--texto-fraco)", "stroke-width": 3 }, leg);
      txt(leg, 354, 16, "nota da página da loja", { class: "txt fraco", "font-size": 17 });
      this.leg2 = svg("g", {}, s);
      svg("circle", { cx: 580, cy: 10, r: 7, fill: "var(--marca)" }, this.leg2);
      txt(this.leg2, 594, 16, "média das escritas, últimos 30 dias", { class: "txt marca", "font-size": 17 });
      txt(s, 1100, H + 48, D.fonte || "", { class: "txt fraco", "text-anchor": "end", "font-size": 13 });
      esconde([...this.pag, ...this.med, this.leg2]);
    },
    passo(k, anim) {
      this.pag.forEach((g, i) => mostra(g, true, anim && k === 0, i * 0.03));
      this.med.forEach((g, i) => mostra(g, k >= 1, anim, i * 0.05));
      mostra(this.leg2, k >= 1, anim);
    },
  });

  /* ======================================================================
   * 3. Uma avaliação vira uma linha de tabela
   * ==================================================================== */
  Motor.cena("ap-linha", {
    montar(caixa) {
      const L = D.linha;
      if (!L) return;
      const g = html("div", "ap-linha", caixa);
      html("div", "ap-aval", g, `
        <div class="meta">${L.empresa} · ${L.loja} · <span class="estrelas">${"★".repeat(L.nota)}${"☆".repeat(5 - L.nota)}</span></div>
        ${L.titulo ? `<b>${L.titulo}</b><br>` : ""}${L.texto}`);
      this.seta = html("div", "ap-seta", g, "→");
      const t = html("table", "ap-tab", g, `
        <thead><tr><th>variável</th><th>resposta</th><th>confiança</th></tr></thead>
        <tbody>
          <tr class="r1"><td>tema principal</td><td class="v">${L.tema}</td><td class="c"><span class="ap-conf"><i style="width:${L.conf_tema * 100}%"></i></span>${pct(L.conf_tema * 100)}</td></tr>
          <tr class="r2"><td>reclama de algo?</td><td class="v">${L.reclamacao}</td><td class="c"><span class="ap-conf"><i style="width:${L.conf_reclamacao * 100}%"></i></span>${pct(L.conf_reclamacao * 100)}</td></tr>
        </tbody>`);
      this.tab = t;
      this.perg = [...t.querySelectorAll("tbody tr td:first-child")];
      this.resp = [...t.querySelectorAll("td.v")];
      this.conf = [...t.querySelectorAll("td.c")];
      this.cab = t.querySelector("thead");
      esconde([this.seta, ...this.perg, ...this.resp, ...this.conf, this.cab]);
    },
    passo(k, anim) {
      if (!this.tab) return;
      mostra(this.seta, k >= 1, anim);
      mostra(this.cab, k >= 1, anim);
      this.perg.forEach((e, i) => mostra(e, k >= 1, anim, i * 0.15));
      this.resp.forEach((e, i) => mostra(e, k >= 2, anim, i * 0.15));
      this.conf.forEach((e, i) => mostra(e, k >= 3, anim, i * 0.15));
    },
  });

  /* ======================================================================
   * 4. Temas das reclamações: app x tema, em % das reclamações do app
   * ==================================================================== */
  Motor.cena("ap-temas", {
    montar(caixa) {
      const s = quadro(caixa, 1120, 410);
      const CURTO = { "Banco do Brasil": "BB", "Zé Delivery": "Zé" };
      this.grupos = [];
      const segs = ["Bancos", "Delivery"];
      segs.forEach((seg, si) => {
        const T = D.temas[seg];
        if (!T) return;
        const g = svg("g", {}, s);
        const x0 = si * 590, temas = T.temas, apps = T.apps;
        const cw = si === 0 ? 80 : 92, ch = 36, left = x0 + (si === 0 ? 228 : 218), top = 66;
        txt(g, x0, 24, seg, { class: "txt forte", "font-size": 22, style: `fill:${SEG_COR[seg]}` });
        apps.forEach((a, j) => txt(g, left + j * cw + cw / 2, top - 10, CURTO[a] || a, { class: "rotulo-eixo forte", "text-anchor": "middle", "font-size": 17 }));
        const max = Math.max(...temas.flatMap((t) => apps.map((a) => T.pct[a]?.[t] || 0)));
        temas.forEach((t, i) => {
          const y = top + i * ch;
          txt(g, left - 8, y + ch / 2 + 6, t, { class: "rotulo-eixo", "text-anchor": "end", "font-size": 16 });
          apps.forEach((a, j) => {
            const v = T.pct[a]?.[t] || 0;
            const top1 = T.top[a] === t;
            svg("rect", { x: left + j * cw + 1, y: y + 1, width: cw - 2, height: ch - 2, rx: 4,
              style: `fill:${top1 ? "var(--marca)" : "var(--texto-fraco)"};opacity:${top1 ? 0.95 : 0.06 + 0.6 * (v / max)}` }, g);
            if (v >= 1) txt(g, left + j * cw + cw / 2, y + ch / 2 + 6, pct(v), {
              "text-anchor": "middle", "font-size": 16, style: `fill:${top1 || v / max > 0.6 ? "#fff" : "var(--texto)"};font-weight:${top1 ? 700 : 400}` });
          });
        });
        this.grupos.push(g);
      });
      txt(s, 1120, 404, D.fonte_temas || "", { class: "txt fraco", "text-anchor": "end", "font-size": 13 });
      esconde(this.grupos);
    },
    passo(k, anim) {
      this.grupos.forEach((g, i) => mostra(g, k >= i + 1, anim));
    },
  });

  /* ======================================================================
   * 5. Cinco passos e os portões de checagem
   * ==================================================================== */
  Motor.cena("ap-portoes", {
    montar(caixa) {
      const s = quadro(caixa, 1120, 330);
      const PASSOS = [["coletar", "as duas lojas"], ["juntar", "sem repetir"], ["checar", "as frases"], ["anotar", "tema, com o Jev"], ["modelos", "mapa e regressão"], ["painel", "dados.json + página"]];
      const W = 150, G = 40, Y = 120;
      this.caixas = [];
      PASSOS.forEach(([a, b], i) => {
        const x = 10 + i * (W + G);
        const g = svg("g", {}, s);
        svg("rect", { x, y: Y, width: W, height: 86, rx: 12, class: "caixa" + (i === 2 ? " marca" : "") }, g);
        txt(g, x + W / 2, Y + 38, a, { class: "txt forte", "text-anchor": "middle", "font-size": 21 });
        txt(g, x + W / 2, Y + 64, b, { class: "txt fraco", "text-anchor": "middle", "font-size": 15 });
        if (i < PASSOS.length - 1) seta(g, x + W + 4, Y + 43, x + W + G - 4, Y + 43);
        this.caixas.push(g);
      });
      const xc = 10 + 2 * (W + G) + W / 2;
      // alerta: segue, com aviso
      this.alerta = svg("g", {}, s);
      svg("circle", { cx: xc, cy: 60, r: 26, fill: "#d59a00" }, this.alerta);
      txt(this.alerta, xc, 69, "!", { "text-anchor": "middle", "font-size": 28, style: "fill:#fff;font-weight:800" });
      txt(this.alerta, xc + 40, 52, "alerta: \"um app veio com menos", { class: "txt", "font-size": 16 });
      txt(this.alerta, xc + 40, 74, "avaliações que ontem\"; o painel sai, com aviso", { class: "txt", "font-size": 16 });
      const xp = 10 + 5 * (W + G);
      this.aviso = svg("g", {}, s);
      svg("rect", { x: xp + W - 34, y: Y - 14, width: 30, height: 30, rx: 15, fill: "#d59a00" }, this.aviso);
      txt(this.aviso, xp + W - 19, Y + 7, "!", { "text-anchor": "middle", "font-size": 18, style: "fill:#fff;font-weight:800" });
      // bloqueia: para, painel de ontem
      this.bloq = svg("g", {}, s);
      svg("rect", { x: xc - 30, y: Y + 110, width: 60, height: 60, rx: 10, fill: "var(--marca)" }, this.bloq);
      txt(this.bloq, xc, Y + 152, "✕", { "text-anchor": "middle", "font-size": 34, style: "fill:#fff;font-weight:800" });
      txt(this.bloq, xc + 44, Y + 132, "bloqueia: \"nenhum texto com telefone", { class: "txt marca", "font-size": 16 });
      txt(this.bloq, xc + 44, Y + 154, "sem máscara\"; a linha para aqui", { class: "txt marca", "font-size": 16 });
      this.ontem = svg("g", {}, s);
      svg("rect", { x: xp, y: Y + 110, width: W, height: 60, rx: 10, class: "caixa" }, this.ontem);
      txt(this.ontem, xp + W / 2, Y + 136, "no ar: o painel", { class: "txt forte", "text-anchor": "middle", "font-size": 15 });
      txt(this.ontem, xp + W / 2, Y + 157, "de ontem, intacto", { class: "txt forte", "text-anchor": "middle", "font-size": 15 });
      esconde([this.alerta, this.aviso, this.bloq, this.ontem]);
    },
    passo(k, anim) {
      this.caixas.forEach((g, i) => gsap.to(g, { autoAlpha: k >= 3 && i > 2 ? 0.25 : 1, duration: anim ? DUR : 0, overwrite: "auto" }));
      mostra(this.alerta, k === 2, anim);
      mostra(this.aviso, k === 2, anim, 0.3);
      mostra(this.bloq, k >= 3, anim);
      mostra(this.ontem, k >= 3, anim, 0.3);
    },
  });

  /* ======================================================================
   * 6. As checagens reais da última rodada
   * ==================================================================== */
  Motor.cena("ap-checagens", {
    montar(caixa) {
      const g = html("div", "ap-checks", caixa);
      const lista = (D.checagens || []).filter((c) => c.nivel === "bloqueia" || !c.ok);
      this.itens = lista.map((c) => {
        const st = c.ok ? "ok" : c.nivel === "bloqueia" ? "falha" : "alerta";
        return html("div", "ap-check", g, `<span class="ic ${st}">${c.ok ? "✓" : st === "falha" ? "✕" : "!"}</span><span>${c.frase}</span><span class="nv ${c.nivel}">${c.nivel}</span>`);
      });
      esconde(this.itens);
    },
    passo(k, anim) {
      this.itens.forEach((e, i) => mostra(e, true, anim && k === 0, i * 0.08));
    },
  });

  /* ======================================================================
   * 7. GitHub Actions: do relógio ao painel
   * ==================================================================== */
  Motor.cena("ap-acoes", {
    montar(caixa) {
      const s = quadro(caixa, 1120, 300);
      const no = (g, x, y, w, l1, l2, marca) => {
        svg("rect", { x, y, width: w, height: 84, rx: 12, class: "caixa" + (marca ? " marca" : "") }, g);
        txt(g, x + w / 2, y + 36, l1, { class: "txt forte", "text-anchor": "middle", "font-size": 19 });
        txt(g, x + w / 2, y + 62, l2, { class: "txt fraco", "text-anchor": "middle", "font-size": 15 });
      };
      this.g = [0, 1, 2, 3, 4].map(() => svg("g", {}, s));
      no(this.g[0], 0, 100, 180, "todo dia às 9h", "ou o botão Run", false);
      seta(this.g[1], 184, 142, 226, 142);
      no(this.g[1], 230, 100, 230, "servidor do GitHub", "python monitor/rodar.py", true);
      seta(this.g[2], 464, 142, 506, 142);
      no(this.g[2], 510, 100, 170, "checagens", "passaram?", false);
      txt(this.g[2], 595, 222, "não: para aqui", { class: "txt marca", "text-anchor": "middle", "font-size": 16 });
      seta(this.g[2], 595, 188, 595, 204, "marca");
      seta(this.g[3], 684, 142, 726, 142);
      no(this.g[3], 730, 100, 170, "git commit", "dados novos", false);
      seta(this.g[3], 904, 142, 946, 142);
      no(this.g[3], 950, 100, 170, "GitHub Pages", "o painel no ar", true);
      const ch = this.g[4];
      svg("rect", { x: 230, y: 10, width: 230, height: 54, rx: 10, style: "fill:none;stroke:var(--turquesa);stroke-width:2;stroke-dasharray:6 5" }, ch);
      txt(ch, 345, 32, "segredo JEV_API_KEY", { class: "txt forte", "text-anchor": "middle", "font-size": 16, style: "fill:var(--turquesa)" });
      txt(ch, 345, 53, "nunca no código", { class: "txt fraco", "text-anchor": "middle", "font-size": 14 });
      seta(ch, 345, 66, 345, 96);
      esconde(this.g.slice(1));
    },
    passo(k, anim) {
      this.g.slice(1).forEach((g, i) => mostra(g, k >= i + 1, anim));
    },
  });

  /* ======================================================================
   * 8. Contar com o modelo e contar com um script (experimento real)
   * ==================================================================== */
  const css2 = document.createElement("style");
  css2.textContent = `
  .ap-cont { display: grid; gap: .9rem; margin-top: .2rem; }
  .ap-cont .linha { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ap-cont .perg { grid-column: 1 / -1; font-size: .72em; font-weight: 700; background: var(--superficie); border-left: 5px solid var(--azul); padding: .45rem .8rem; border-radius: 0 8px 8px 0; }
  .ap-cont .perg small { display: block; font-weight: 400; color: var(--texto-fraco); font-size: .85em; }
  .ap-cont .lado { border: 1.5px solid var(--superficie-borda); border-radius: 12px; padding: .5rem .8rem; font-size: .62em; }
  .ap-cont .lado b.rot { display: block; margin-bottom: .35rem; }
  .ap-cont .chips { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
  .ap-cont .chip-n { font-family: "GT Ultra Fine", Georgia, serif; font-size: 2em; font-weight: 700; min-width: 2.4em; text-align: center; border-radius: 10px; padding: .05em .3em; background: color-mix(in srgb, var(--roxo) 14%, transparent); color: var(--roxo); }
  .ap-cont .chip-n.scr { background: color-mix(in srgb, var(--turquesa) 16%, transparent); color: var(--turquesa); }
  .ap-cont .chip-n.ruim { background: color-mix(in srgb, var(--marca) 14%, transparent); color: var(--marca); }
  .ap-cont code { font-size: .95em; }
  .ap-probs { display: grid; grid-template-columns: repeat(3, 1fr); gap: .9rem; margin-top: .3rem; }
  .ap-prob { background: var(--superficie); border-radius: 12px; padding: .6rem .8rem; font-size: .66em; line-height: 1.35; display: flex; flex-direction: column; gap: .45rem; }
  .ap-prob .meta { color: var(--texto-fraco); font-size: .9em; }
  .ap-prob .meta .estrelas { color: #d59a00; }
  .ap-prob .txt { font-weight: 600; min-height: 3.6em; }
  .ap-prob .op { display: grid; grid-template-columns: 1fr 80px 3em; gap: .4rem; align-items: center; font-size: .95em; }
  .ap-prob .op i { display: block; height: 12px; border-radius: 6px; background: var(--regua); }
  .ap-prob .op.top i { background: var(--turquesa); }
  .ap-prob .op.top span:first-child { font-weight: 700; }
  .ap-prob .op .pv { text-align: right; font-variant-numeric: tabular-nums; }
  .ap-prob .rec { border-top: 1px solid var(--regua); padding-top: .35rem; }
  .ap-teste { border-collapse: collapse; width: 100%; font-size: .56em; margin-top: .2rem; }
  .ap-teste th { text-align: left; color: var(--texto-fraco); font-weight: 600; padding: .2rem .4rem; border-bottom: 2px solid var(--regua); text-transform: none; letter-spacing: 0; }
  .ap-teste td { padding: .28rem .4rem; border-bottom: 1px solid var(--regua); vertical-align: middle; }
  .ap-teste td.cf { white-space: nowrap; font-variant-numeric: tabular-nums; }
  .ap-teste .barra { display: inline-block; width: 60px; height: 10px; border-radius: 5px; background: var(--superficie); overflow: hidden; vertical-align: middle; margin-right: .3rem; }
  .ap-teste .barra i { display: block; height: 100%; background: var(--turquesa); }
  .ap-teste tr.baixa.marcar td { background: color-mix(in srgb, var(--marca) 10%, transparent); }
  .ap-teste tr.baixa.marcar .barra i { background: var(--marca); }
  `;
  document.head.appendChild(css2);

  Motor.cena("ap-contagem", {
    montar(caixa) {
      const C = D.contagem;
      if (!C) return;
      const g = html("div", "ap-cont", caixa);
      const l1 = html("div", "linha", g);
      html("div", "perg", l1, `Quantas das ${C.n} avaliações mais recentes do ${C.app} na ${C.loja} citam o Pix?
        <small>com os dados de hoje</small>`);
      this.m1 = html("div", "lado", l1, `<b class="rot">O modelo, em três pedidos independentes</b>
        <div class="chips">${C.respostas_modelo.map((v) => `<span class="chip-n">${v}</span>`).join("")}</div>`);
      this.s1 = html("div", "lado", l1, `<b class="rot">Um script, com uma regra escrita</b>
        <div class="chips"><code>re.search(r"\\bpix\\b", texto, re.I)</code><span class="chip-n scr">${C.script}</span></div>`);
      const l2 = html("div", "linha", g);
      this.l2 = l2;
      html("div", "perg", l2, `Num grupo focal de 916 falas, quantas vezes o participante Diego falou de preço?
        <small>no curso de executivos, com o ChatGPT</small>`);
      html("div", "lado", l2, `<b class="rot">Três conversas no ChatGPT</b>
        <div class="chips"><span class="chip-n ruim">13</span><span class="chip-n ruim">12</span><span class="chip-n ruim">25</span></div>`);
      html("div", "lado", l2, `<b class="rot">O script da habilidade, três vezes</b>
        <div class="chips"><span class="chip-n scr">5</span><span class="chip-n scr">5</span><span class="chip-n scr">5</span></div>`);
      esconde([this.m1, this.s1, l2]);
    },
    passo(k, anim) {
      if (!this.m1) return;
      mostra(this.m1, k >= 1, anim);
      mostra(this.s1, k >= 2, anim);
      mostra(this.l2, k >= 3, anim);
    },
  });

  /* ======================================================================
   * 9. As respostas do Jev, com a probabilidade de cada opção
   * ==================================================================== */
  Motor.cena("ap-probs", {
    montar(caixa) {
      const g = html("div", "ap-probs", caixa);
      this.cards = (D.jev?.chamadas || []).map((c) => {
        const ops = c.probs.slice(0, 3).map(([k, v], i) => `
          <div class="op${i === 0 ? " top" : ""}"><span>${k}</span><span><i style="width:${Math.max(2, v * 100)}%"></i></span><span class="pv">${pct(v * 100)}</span></div>`).join("");
        return html("div", "ap-prob", g, `
          <div class="meta">${c.empresa} · ${c.loja === "app_store" ? "App Store" : "Google Play"} · <span class="estrelas">${"★".repeat(c.nota)}${"☆".repeat(5 - c.nota)}</span></div>
          <div class="txt">${(c.titulo ? c.titulo + ". " : "") + c.texto}</div>
          <div><b>tema</b> (3 opções mais prováveis)</div>${ops}
          <div class="rec"><b>reclama de algo?</b> sim, com ${pct(c.reclamacao * 100)}</div>`);
      });
      esconde(this.cards.slice(1));
    },
    passo(k, anim) {
      this.cards.forEach((c, i) => mostra(c, k >= i, anim));
    },
  });

  /* ======================================================================
   * 10. Teste em oito avaliações: onde a confiança é baixa
   * ==================================================================== */
  Motor.cena("ap-teste", {
    montar(caixa) {
      const linhas = D.jev?.tabela || [];
      const t = html("table", "ap-teste", caixa, `
        <thead><tr><th>app</th><th>★</th><th>avaliação</th><th>tema do Jev</th><th>confiança</th></tr></thead>
        <tbody>${linhas.map((r) => `
          <tr class="${r.conf < 0.6 ? "baixa" : ""}"><td>${r.empresa}</td><td>${r.nota}</td><td>${r.texto}</td>
          <td><b>${r.tema}</b></td><td class="cf"><span class="barra"><i style="width:${r.conf * 100}%"></i></span>${pct(r.conf * 100)}</td></tr>`).join("")}
        </tbody>`);
      this.baixas = [...t.querySelectorAll("tr.baixa")];
    },
    passo(k) {
      this.baixas.forEach((r) => r.classList.toggle("marcar", k >= 1));
    },
  });

  /* ======================================================================
   * 11. Grupo focal: três conversas, três números; a habilidade, sempre 162
   * ==================================================================== */
  const css3 = document.createElement("style");
  css3.textContent = `
  .ap-gf { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-top: .4rem; }
  .ap-gf .perg { grid-column: 1 / -1; font-size: .8em; background: var(--superficie); border-left: 6px solid var(--azul); padding: .55rem .9rem; border-radius: 0 10px 10px 0; }
  .ap-gf .perg b { display: block; }
  .ap-gf .perg small { color: var(--texto-fraco); font-size: .78em; }
  .ap-gf .lado { border: 2px solid var(--superficie-borda); border-radius: 14px; padding: .6rem .9rem .8rem; }
  .ap-gf .lado b.rot { display: block; font-size: .7em; margin-bottom: .5rem; }
  .ap-gf .lado.com { border-color: var(--turquesa); }
  .ap-gf .nums { display: flex; gap: .7rem; }
  .ap-gf .n { flex: 1; text-align: center; border-radius: 12px; padding: .35rem 0 .25rem; background: color-mix(in srgb, var(--marca) 12%, transparent); }
  .ap-gf .com .n { background: color-mix(in srgb, var(--turquesa) 14%, transparent); }
  .ap-gf .n span { display: block; font-size: .5em; color: var(--texto-fraco); }
  .ap-gf .n b { font-family: "GT Ultra Fine", Georgia, serif; font-size: 1.9em; color: var(--marca); line-height: 1.1; }
  .ap-gf .com .n b { color: var(--turquesa); }
  .ap-gf .nota { font-size: .58em; color: var(--texto-fraco); margin-top: .45rem; }
  /* anatomia de uma habilidade */
  .ap-sk { display: grid; grid-template-columns: 1.05fr .95fr; gap: 1.2rem; align-items: start; margin-top: .2rem; }
  .ap-sk .pasta { position: relative; background: var(--superficie); border-radius: 4px 16px 16px 16px; padding: .7rem .8rem .7rem; margin-top: 1.1rem; }
  .ap-sk .pasta::before { content: "avaliacoes-lojas/"; position: absolute; top: -1.3rem; left: 0; background: var(--superficie); border-radius: 10px 10px 0 0; padding: .1rem .9rem 0; font-family: "Cascadia Code", Consolas, monospace; font-size: .7em; font-weight: 700; }
  .ap-sk .arq { background: var(--fundo); border: 2px solid var(--superficie-borda); border-radius: 12px; padding: .35rem .65rem; margin-bottom: .45rem; transition: border-color .3s, box-shadow .3s, opacity .3s; }
  .ap-sk .arq:last-child { margin-bottom: 0; }
  .ap-sk .arq .nome { font-family: "Cascadia Code", Consolas, monospace; font-weight: 700; font-size: .72em; display: flex; justify-content: space-between; align-items: center; }
  .ap-sk .arq .nome i { font-style: normal; font-family: Inter, sans-serif; font-weight: 600; font-size: .85em; color: var(--texto-fraco); }
  .ap-sk .arq.opc { border-style: dashed; }
  .ap-sk .parte { margin-top: .25rem; border-radius: 8px; padding: .18rem .5rem; font-size: .58em; line-height: 1.25; background: var(--superficie); transition: background .3s, box-shadow .3s; }
  .ap-sk .parte b { display: block; font-size: 1.02em; }
  .ap-sk .on { border-color: var(--marca) !important; box-shadow: 0 0 0 4px color-mix(in srgb, var(--marca) 18%, transparent); }
  .ap-sk .parte.on { background: color-mix(in srgb, var(--marca) 12%, var(--fundo)); box-shadow: none; }
  .ap-sk .linha2 { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
  .ap-sk .fluxo { display: grid; gap: .55rem; font-size: .7em; }
  .ap-sk .fluxo div { background: var(--superficie); border-radius: 10px; padding: .4rem .7rem; position: relative; }
  .ap-sk .fluxo div::after { content: "↓"; position: absolute; left: 50%; bottom: -1.05em; color: var(--texto-fraco); font-weight: 700; }
  .ap-sk .fluxo div:last-child::after { content: none; }
  .ap-sk .fluxo b { color: var(--marca); }
  /* dicionário: as partes do JSON acendem uma de cada vez */
  .ap-json pre.cod .jp { border-radius: 4px; transition: background .3s, opacity .3s; }
  .ap-json pre.cod.focando .jp { opacity: .35; }
  .ap-json pre.cod .jp.agora { opacity: 1; background: var(--grifo); }
  :root[data-tema="escuro"] .ap-json pre.cod .jp.agora { background: color-mix(in srgb, var(--amarelo) 35%, transparent); }
  `;
  document.head.appendChild(css3);

  Motor.cena("ap-grupo", {
    montar(caixa) {
      const g = html("div", "ap-gf", caixa);
      html("div", "perg", g, `<b>"Neste grupo focal, quantas vezes cada participante falou de preço?"</b>
        <small>a transcrição de um grupo focal com 8 viajantes: 916 falas, 18 mil palavras (curso de executivos)</small>`);
      this.sem = html("div", "lado", g, `<b class="rot">Sem habilidade: a mesma pergunta em três conversas novas do ChatGPT</b>
        <div class="nums"><div class="n"><span>1ª conversa</span><b>157</b></div><div class="n"><span>2ª conversa</span><b>161</b></div><div class="n"><span>3ª conversa</span><b>210</b></div></div>
        <div class="nota">Em cada conversa, um critério diferente: incluiu reembolso, tirou reembolso, incluiu bagagem.</div>`);
      this.com = html("div", "lado com", g, `<b class="rot">Com a habilidade contar-termos: um script com a lista de termos</b>
        <div class="nums"><div class="n"><span>em qualquer conversa, quantas vezes rodar</span><b>162</b></div></div>
        <div class="nota">preço = preço, preços, caro, cara, barato, barata, tarifa*, "quanto custa", R$</div>`);
      esconde([this.sem, this.com]);
    },
    passo(k, anim) {
      mostra(this.sem, k >= 1, anim);
      mostra(this.com, k >= 2, anim);
    },
  });

  Motor.cena("ap-skill", {
    montar(caixa) {
      const g = html("div", "ap-sk", caixa);
      const p = html("div", "pasta", g);
      this.skill = html("div", "arq", p, `<div class="nome">SKILL.md <i>obrigatório</i></div>
        <div class="parte p1"><b>nome e descrição</b>"baixa as avaliações de um app nas duas lojas; use quando pedirem avaliações"</div>
        <div class="parte p2"><b>passo a passo</b>confirme os identificadores · rode o script · mostre o resumo</div>
        <div class="parte p3"><b>regras</b>uma página por vez · nunca o nome de quem avaliou</div>`);
      this.scr = html("div", "arq", p, `<div class="nome">scripts/ <i>o código</i></div>
        <div class="parte"><b>baixar_avaliacoes.py</b>baixa, junta e resume: sempre do mesmo jeito</div>`);
      const l2 = html("div", "linha2", p);
      this.ref = html("div", "arq opc", l2, `<div class="nome">referencias/ <i>opcional</i></div>
        <div class="parte">documentação, exemplos</div>`);
      this.mod = html("div", "arq opc", l2, `<div class="nome">modelos/ <i>opcional</i></div>
        <div class="parte">modelo de relatório, listas</div>`);
      const f = html("div", "fluxo", g);
      this.fl = [
        html("div", "", f, `<b>1.</b> Você pede: "baixe as avaliações do iFood"`),
        html("div", "", f, `<b>2.</b> O ChatGPT lê as <b>descrições</b> das habilidades instaladas e escolhe esta`),
        html("div", "", f, `<b>3.</b> Lê o <b>SKILL.md</b> inteiro e segue o passo a passo`),
        html("div", "", f, `<b>4.</b> Roda o <b>script</b> e consulta os arquivos de apoio, se precisar`),
        html("div", "", f, `<b>5.</b> Mostra o resumo, sempre no mesmo formato`),
      ];
      this.partes = [...this.skill.querySelectorAll(".parte")];
      esconde([this.scr, this.ref, this.mod, ...this.fl]);
    },
    passo(k, anim) {
      // 0: o SKILL.md; 1: nome e descrição; 2: passo a passo e regras; 3: scripts; 4: opcionais; 5: o fluxo
      this.partes[0].classList.toggle("on", k === 1);
      this.partes[1].classList.toggle("on", k === 2);
      this.partes[2].classList.toggle("on", k === 2);
      this.skill.classList.toggle("on", k === 0);
      mostra(this.scr, k >= 3, anim);
      this.scr.classList.toggle("on", k === 3);
      mostra(this.ref, k >= 4, anim);
      mostra(this.mod, k >= 4, anim, 0.15);
      this.ref.classList.toggle("on", k === 4);
      this.mod.classList.toggle("on", k === 4);
      this.fl.forEach((e, i) => mostra(e, k >= 5, anim, i * 0.25));
    },
  });

  Motor.cena("ap-json", {
    montar(caixa) {
      this.pre = caixa.querySelector("pre.cod");
      this.partes = this.pre ? [...this.pre.querySelectorAll(".jp")] : [];
    },
    passo(k) {
      if (!this.pre) return;
      this.pre.classList.toggle("focando", k > 0);
      this.partes.forEach((e) => e.classList.toggle("agora", String(k) === e.dataset.k));
    },
  });
})();
