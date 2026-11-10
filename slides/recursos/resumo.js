/* Cenas do resumo da semana (aula 5, quinta de manhã).
 * Diagramas ilustrativos: os números marcados como "ilustrativos" não vêm de
 * uma base; os de concordância vêm da extração do exercício 3 (OpenAI x Jev,
 * 2.000 avaliações). */
(function () {
  "use strict";
  const { svg, txt, vis, seta, escala, gerador, eixoX, eixoY, num } = Motor.util;
  const F = "font-size:21px";
  const FP = "font-size:18px";

  function caixa(g, x, y, w, h, linhas, opts = {}) {
    const gg = svg("g", {}, g);
    svg("rect", { x, y, width: w, height: h, rx: 12, class: "caixa" + (opts.marca ? " marca" : "") }, gg);
    const dy = opts.dy || 26, y0 = y + h / 2 - ((linhas.length - 1) * dy) / 2 + 7;
    linhas.forEach((l, i) => txt(gg, x + w / 2, y0 + i * dy, l, {
      "text-anchor": "middle", class: "txt" + (i === 0 && opts.forte !== false ? " forte" : "") + (opts.mono && i > 0 ? " mono" : ""),
      style: opts.style || F }));
    return gg;
  }
  function chip(g, x, y, t, cor) {
    const gg = svg("g", {}, g);
    svg("rect", { x, y, width: 190, height: 46, rx: 23, style: `fill:var(--${cor});opacity:.16;stroke:var(--${cor});stroke-width:2` }, gg);
    txt(gg, x + 95, y + 30, t, { "text-anchor": "middle", class: "txt forte", style: F + `;fill:var(--${cor})` });
    return gg;
  }

  /* a) habilidades que usam código ---------------------------------------- */
  Motor.cena("rs-skill", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 380", class: "grafico-svg" }, c);
      this.g0 = svg("g", {}, s);
      caixa(this.g0, 10, 145, 220, 90, ["o pedido", "\"quantas falas", "citam preço?\""], { dy: 24, style: FP });
      this.g1 = svg("g", {}, s);
      txt(this.g1, 290, 34, "sem a skill", { class: "txt fraco forte", style: F });
      seta(this.g1, 232, 175, 285, 100);
      caixa(this.g1, 290, 55, 330, 80, ["a conversa conta", "\"de cabeça\""], { style: F });
      seta(this.g1, 625, 95, 680, 95);
      chip(this.g1, 690, 72, "1ª vez: 112", "marca");
      chip(this.g1, 900, 72, "2ª vez: 97", "marca");
      this.g2 = svg("g", {}, s);
      txt(this.g2, 290, 228, "com a skill", { class: "txt forte", style: F });
      seta(this.g2, 232, 205, 285, 285);
      caixa(this.g2, 290, 245, 200, 80, ["SKILL.md", "o passo a passo"], { style: F, marca: true });
      seta(this.g2, 495, 285, 530, 285);
      caixa(this.g2, 535, 245, 150, 80, ["contar.py", "o Python"], { style: F, marca: true });
      this.g3 = svg("g", {}, s);
      seta(this.g3, 690, 285, 715, 285);
      chip(this.g3, 720, 262, "1ª vez: 83", "turquesa");
      chip(this.g3, 920, 262, "2ª vez: 83", "turquesa");
      txt(s, 1110, 372, "números ilustrativos", { "text-anchor": "end", class: "txt fraco", style: "font-size:14px" });
    },
    passo(k, a) { vis(this.g1, k >= 1, a); vis(this.g2, k >= 2, a); vis(this.g3, k >= 3, a); },
  });

  /* b) plugins que coletam dados da web ----------------------------------- */
  Motor.cena("rs-plugin", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 380", class: "grafico-svg" }, c);
      const cnpj = ["11.222.333/0001-81", "22.333.444/0001-05", "33.444.555/0001-50", "44.555.666/0001-12", "55.666.777/0001-0X"];
      const res = [["Agência Alfa", "São Paulo"], ["Viagens Beta", "Campinas"], ["Turismo Gama", "Recife"], ["Voa Delta", "Curitiba"], null];
      const y0 = 40, dy = 50;
      txt(s, 20, y0, "CNPJ da planilha", { class: "txt forte", style: F });
      cnpj.forEach((n, i) => txt(s, 20, y0 + 44 + i * dy, n, { class: "txt mono", style: FP }));
      this.g1 = svg("g", {}, s);
      seta(this.g1, 262, 160, 330, 160);
      caixa(this.g1, 335, 115, 230, 90, ["API pública", "BrasilAPI"], { style: F, marca: true });
      seta(this.g1, 570, 160, 640, 160);
      this.g2 = svg("g", {}, s);
      txt(this.g2, 660, y0, "razão social", { class: "txt forte", style: F });
      txt(this.g2, 900, y0, "cidade", { class: "txt forte", style: F });
      this.linhas = res.map((r, i) => {
        const g = svg("g", {}, this.g2), y = y0 + 44 + i * dy;
        if (r) { txt(g, 660, y, r[0], { class: "txt", style: FP }); txt(g, 900, y, r[1], { class: "txt", style: FP }); }
        else txt(g, 660, y, "falhou: dígito do CNPJ errado", { class: "txt marca", style: FP });
        return g;
      });
      this.g3 = svg("g", {}, s);
      txt(this.g3, 560, 350, "5 linhas entraram · 4 voltaram com dado · 1 falhou, e o plugin diz por quê", { "text-anchor": "middle", class: "anot", style: F });
    },
    passo(k, a) {
      vis(this.g1, k >= 1, a); vis(this.g2, k >= 2, a);
      this.linhas.forEach((g, i) => gsap.to(g, { autoAlpha: k >= 2 ? 1 : 0, duration: a ? 0.3 : 0, delay: a && k === 2 ? i * 0.18 : 0, overwrite: "auto" }));
      vis(this.g3, k >= 3, a);
    },
  });

  /* c) estruturar textos com IA ------------------------------------------- */
  Motor.cena("rs-textos", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 380", class: "grafico-svg" }, c);
      const textos = [["\"O app travou no check-in", "e eu perdi o voo\""], ["\"Atendimento ótimo,", "resolveram rápido\""], ["\"Cobraram a mala", "duas vezes\""]];
      textos.forEach((t, i) => caixa(s, 10, 20 + i * 105, 300, 88, t, { forte: false, style: FP, dy: 26 }));
      this.g1 = svg("g", {}, s);
      seta(this.g1, 315, 170, 350, 170);
      const gd = svg("g", {}, this.g1);
      svg("rect", { x: 355, y: 40, width: 300, height: 260, rx: 12, class: "caixa marca" }, gd);
      txt(gd, 505, 74, "dicionário", { "text-anchor": "middle", class: "txt forte", style: F });
      [["tema: qual o assunto?", true], ["atraso, bagagem, app,", false], ["atendimento, preço", false], ["tom: como a pessoa se sente?", true], ["positivo, neutro, negativo", false]]
        .forEach(([l, f], i) => txt(gd, 375, 116 + i * 34 + (i >= 3 ? 14 : 0), l, { class: "txt" + (f ? " forte" : " fraco"), style: FP }));
      seta(this.g1, 660, 170, 695, 170);
      this.g2 = svg("g", {}, s);
      txt(this.g2, 715, 40, "tema", { class: "txt forte", style: F });
      txt(this.g2, 920, 40, "tom", { class: "txt forte", style: F });
      this.linhas = [["app", "negativo"], ["atendimento", "positivo"], ["bagagem", "negativo"]].map((r, i) => {
        const g = svg("g", {}, this.g2);
        txt(g, 715, 82 + i * 42, r[0], { class: "txt", style: FP });
        txt(g, 920, 82 + i * 42, r[1], { class: "txt", style: FP + (r[1] === "negativo" ? ";fill:var(--marca)" : ";fill:var(--turquesa)") });
        return g;
      });
      this.g3 = svg("g", {}, s);
      txt(this.g3, 715, 236, "dois modelos concordam no tema", { class: "txt forte", style: FP });
      const sx = escala(0, 100, 0, 250);
      [["em geral", 86, ""], ["modelo seguro", 96, "turquesa"], ["modelo em dúvida", 59, "marca"]].forEach(([r, v, cor], i) => {
        const y = 256 + i * 38;
        txt(this.g3, 715, y + 20, r, { class: "txt fraco", style: "font-size:16px" });
        svg("rect", { x: 860, y: y + 3, width: sx(v) * 0.8, height: 22, rx: 4, class: "barra " + cor }, this.g3);
        txt(this.g3, 866 + sx(v) * 0.8, y + 21, v + "%", { class: "txt forte", style: "font-size:17px" });
      });
    },
    passo(k, a) {
      vis(this.g1, k >= 1, a); vis(this.g2, k >= 2, a);
      this.linhas.forEach((g, i) => gsap.to(g, { autoAlpha: k >= 2 ? 1 : 0, duration: a ? 0.3 : 0, delay: a && k === 2 ? i * 0.25 : 0, overwrite: "auto" }));
      vis(this.g3, k >= 3, a);
    },
  });

  /* d) escolher o gráfico certo ------------------------------------------- */
  Motor.cena("rs-graficos", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 380", class: "grafico-svg" }, c);
      const r = gerador(7), W = 255, P = 22;
      const tits = [["uma categórica", "barras, em ordem"], ["numérica por grupo", "boxplot"], ["ao longo do tempo", "linha"], ["duas numéricas", "dispersão"]];
      this.p = tits.map((t, i) => {
        const g = svg("g", {}, s), x = 8 + i * (W + 32);
        svg("rect", { x, y: 0, width: W, height: 372, rx: 14, class: "caixa" }, g);
        txt(g, x + W / 2, 38, t[0], { "text-anchor": "middle", class: "txt forte", style: F });
        txt(g, x + W / 2, 66, t[1], { "text-anchor": "middle", class: "txt marca", style: F });
        const x0 = x + P, x1 = x + W - P, yb = 345, yt = 95;
        svg("line", { x1: x0, x2: x1, y1: yb, y2: yb, class: "eixo" }, g);
        if (i === 0) [0.95, 0.7, 0.5, 0.32, 0.18].forEach((v, j) => svg("rect", { x: x0, y: yt + 8 + j * 47, width: (x1 - x0) * v, height: 32, rx: 3, class: "barra " + (j === 0 ? "marca" : "") }, g));
        if (i === 1) [[0.35, 0.55, 0.75], [0.2, 0.35, 0.5], [0.5, 0.65, 0.85]].forEach(([q1, m, q3], j) => {
          const cx = x0 + 35 + j * 70, sy = (v) => yb - v * (yb - yt);
          svg("line", { x1: cx, x2: cx, y1: sy(q3 + 0.12), y2: sy(Math.max(0.02, q1 - 0.15)), class: "eixo" }, g);
          svg("rect", { x: cx - 22, y: sy(q3), width: 44, height: sy(q1) - sy(q3), class: "barra " + (j === 1 ? "marca" : "azul"), style: "opacity:.75" }, g);
          svg("line", { x1: cx - 22, x2: cx + 22, y1: sy(m), y2: sy(m), style: "stroke:var(--fundo);stroke-width:3" }, g);
        });
        if (i === 2) {
          const pts = Array.from({ length: 12 }, (_, j) => [x0 + j * (x1 - x0) / 11, yb - (0.3 + 0.05 * j + 0.08 * Math.sin(j * 1.3)) * (yb - yt)]);
          svg("polyline", { points: pts.map((q) => q.join(",")).join(" "), class: "reta" }, g);
        }
        if (i === 3) for (let j = 0; j < 45; j++) {
          const u = r.u();
          svg("circle", { cx: x0 + 8 + u * (x1 - x0 - 16), cy: yb - 12 - (0.15 + 0.7 * u + 0.12 * r.normal()) * (yb - yt - 20), r: 5, class: "ponto forte" }, g);
        }
        return g;
      });
    },
    passo(k, a) { this.p.forEach((g, i) => gsap.to(g, { opacity: k >= i ? 1 : 0.12, duration: a ? 0.45 : 0, overwrite: "auto" })); },
  });

  /* e) regressão linear --------------------------------------------------- */
  Motor.cena("rs-regressao", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 380", class: "grafico-svg" }, c);
      const r = gerador(11), sx = escala(0, 6, 90, 760), sy = escala(2, 10, 330, 20);
      this.sx = sx; this.sy = sy;
      eixoX(s, sx, 0, 6, 330, 6, "horas de atraso", { grade: 20 });
      eixoY(s, sy, 2, 10, 90, 4, "nota do voo", { grade: 760 });
      this.pts = [];
      for (let i = 0; i < 70; i++) {
        const con = r.u() < 0.4, x = Math.min(5.8, Math.abs(r.normal() * 1.6 + (con ? 2.4 : 0.8)));
        const y = 8.2 - 0.5 * x - (con ? 1.6 : 0) + r.normal() * 0.55;
        this.pts.push({ con, el: svg("circle", { cx: sx(x), cy: sy(y), r: 6, class: "ponto" }, s) });
      }
      this.reta = svg("line", { x1: sx(0), x2: sx(6), y1: sy(8.0), y2: sy(8.0 - 0.95 * 6), class: "reta" }, s);
      this.rr = txt(s, 790, 70, "sozinho: −0,95 ponto por hora", { class: "anot marca", style: F });
      this.gc = svg("g", {}, s);
      svg("line", { x1: sx(1), x2: sx(1), y1: sy(8.0 - 0.95), y2: sy(8.0 - 0.95 * 2), class: "guia" }, this.gc);
      svg("line", { x1: sx(1), x2: sx(2), y1: sy(8.0 - 0.95 * 2), y2: sy(8.0 - 0.95 * 2), class: "guia" }, this.gc);
      txt(this.gc, 790, 120, "uma hora a mais, entre voos", { class: "txt", style: F });
      txt(this.gc, 790, 148, "parecidos: a nota cai", { class: "txt", style: F });
      this.g2 = svg("g", {}, s);
      svg("line", { x1: sx(0), x2: sx(6), y1: sy(8.2), y2: sy(8.2 - 3), class: "reta", style: "stroke:var(--texto-fraco)" }, this.g2);
      svg("line", { x1: sx(0), x2: sx(6), y1: sy(6.6), y2: sy(6.6 - 3), class: "reta" }, this.g2);
      txt(this.g2, 790, 215, "com controle: −0,5 por hora", { class: "anot", style: F });
      txt(this.g2, 790, 248, "cinza: conexão mantida", { class: "txt fraco", style: FP });
      txt(this.g2, 790, 276, "vermelho: conexão perdida", { class: "txt marca", style: FP });
      txt(this.g2, 790, 312, "parte da queda era da conexão", { class: "txt fraco", style: FP });
      txt(s, 1110, 372, "dados ilustrativos", { "text-anchor": "end", class: "txt fraco", style: "font-size:14px" });
    },
    passo(k, a) {
      vis(this.reta, k >= 1 && k < 3, a); vis(this.rr, k >= 1, a); vis(this.gc, k === 2, a); vis(this.g2, k >= 3, a);
      this.pts.forEach((p) => {
        const on = k >= 3 && p.con;
        p.el.style.fill = on ? "var(--marca)" : "";
        p.el.style.opacity = on ? ".85" : "";
      });
    },
  });
  /* ====================================================================== */
  /* Pasta ou skill: o que mora onde                                         */
  /* ====================================================================== */
  function ficha(g, t, w = 236) {
    const gg = svg("g", {}, g);
    svg("rect", { x: 0, y: 0, width: w, height: 46, rx: 23, class: "caixa" }, gg);
    txt(gg, w / 2, 30, t, { "text-anchor": "middle", class: "txt", style: FP });
    return gg;
  }
  Motor.cena("rs-pasta-skill", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 470", class: "grafico-svg" }, c);
      this.bandeja = txt(s, 560, 14, "tudo o que o monitor deixou na pasta, misturado", { "text-anchor": "middle", class: "txt fraco", style: FP });
      this.caixas = svg("g", {}, s);
      svg("rect", { x: 10, y: 140, width: 535, height: 325, rx: 16, class: "caixa" }, this.caixas);
      svg("rect", { x: 575, y: 140, width: 535, height: 325, rx: 16, class: "caixa marca" }, this.caixas);
      txt(this.caixas, 277, 178, "a pasta do projeto", { "text-anchor": "middle", class: "txt forte", style: "font-size:24px" });
      txt(this.caixas, 277, 206, "a cozinha: a despensa e o caderno de anotações", { "text-anchor": "middle", class: "txt fraco", style: FP });
      txt(this.caixas, 842, 178, "a skill", { "text-anchor": "middle", class: "txt marca", style: "font-size:24px" });
      txt(this.caixas, 842, 206, "a ficha técnica, que vai para outra unidade", { "text-anchor": "middle", class: "txt fraco", style: FP });
      this.rodape = svg("g", {}, s);
      txt(this.rodape, 277, 440, "muda todo dia, só vale para esta base", { "text-anchor": "middle", class: "txt forte", style: FP });
      txt(this.rodape, 842, 440, "não muda, vale para qualquer base", { "text-anchor": "middle", class: "txt forte", style: FP });
      const pasta = ["as coletas de cada dia", "as regras desta base", "o histórico de alertas", "a página de hoje"];
      const skill = ["os passos, na ordem", "os scripts em Python", "as checagens genéricas", "quando usar: a descrição"];
      const mist = [pasta[0], skill[0], pasta[1], skill[1], skill[2], pasta[2], skill[3], pasta[3]];
      this.itens = mist.map((t, i) => {
        const g = ficha(s, t), lado = pasta.includes(t) ? 0 : 1, j = (lado ? skill : pasta).indexOf(t);
        return { g, lado, ini: [14 + (i % 4) * 276, 30 + Math.floor(i / 4) * 56], fim: [30 + lado * 565 + (j % 2) * 252, 238 + Math.floor(j / 2) * 74] };
      });
    },
    passo(k, a) {
      vis(this.caixas, k >= 1, a); vis(this.rodape, k >= 4, a); vis(this.bandeja, k < 3, a);
      this.itens.forEach((it) => {
        const p = (it.lado === 0 && k >= 2) || (it.lado === 1 && k >= 3) ? it.fim : it.ini;
        gsap.to(it.g, { x: p[0], y: p[1], duration: a ? 0.7 : 0, ease: "power2.inOut", overwrite: "auto" });
      });
    },
  });

  /* ====================================================================== */
  /* Primeiro a pasta, depois a skill                                        */
  /* ====================================================================== */
  Motor.cena("rs-primeiro-pasta", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 430", class: "grafico-svg" }, c);
      const xs = [130, 380, 630];
      svg("line", { x1: xs[0], x2: 940, y1: 40, y2: 40, class: "eixo", style: "stroke-width:4" }, s);
      this.barra = svg("line", { x1: xs[0], x2: xs[0], y1: 40, y2: 40, class: "reta", style: "stroke-width:6" }, s);
      this.alvos = [xs[0], xs[0], xs[1], xs[2], 940];
      const R = [
        ["1ª rodada", ["surpresas: avaliações", "repetidas e um", "telefone no texto"], "marca"],
        ["2ª rodada", ["surpresa: uma", "avaliação mudou", "de nota"], "marca"],
        ["3ª rodada", ["nenhuma surpresa:", "os números batem", "com os de ontem"], "turquesa"],
      ];
      this.rod = R.map(([t, ls, cor], i) => {
        const g = svg("g", {}, s), x = xs[i];
        svg("circle", { cx: x, cy: 40, r: 14, class: "caixa", style: "stroke-width:3" }, g);
        txt(g, x, 82, t, { "text-anchor": "middle", class: "txt forte", style: F });
        svg("rect", { x: x - 115, y: 96, width: 230, height: 112, rx: 12, style: `fill:var(--${cor});opacity:.13;stroke:var(--${cor});stroke-width:2` }, g);
        ls.forEach((l, j) => txt(g, x, 128 + j * 30, l, { "text-anchor": "middle", class: "txt", style: FP }));
        return g;
      });
      // AGENTS.md crescendo
      svg("rect", { x: 15, y: 232, width: 730, height: 190, rx: 14, class: "caixa" }, s);
      txt(s, 35, 266, "AGENTS.md, na pasta do projeto", { class: "txt forte mono", style: F });
      const regras = [["a mesma avaliação em várias coletas conta uma vez", 1], ["telefone, e-mail e CPF no texto são mascarados", 1], ["se a avaliação mudou, vale a versão mais recente", 2]];
      this.regras = regras.map(([t, k], j) => ({ k, g: txt(s, 35, 306 + j * 38, "+ " + t, { class: "txt", style: F }) }));
      this.ok = txt(s, 35, 410, "a 3ª rodada não precisou de regra nova: o processo está pronto", { class: "txt forte", style: FP + ";fill:var(--turquesa)" });
      // a skill
      this.skill = svg("g", {}, s);
      svg("circle", { cx: 940, cy: 40, r: 18, class: "caixa marca", style: "stroke-width:3" }, this.skill);
      txt(this.skill, 940, 82, "só agora: a skill", { "text-anchor": "middle", class: "txt marca", style: F });
      seta(this.skill, 750, 320, 800, 320, "marca");
      svg("rect", { x: 805, y: 96, width: 305, height: 326, rx: 14, class: "caixa marca" }, this.skill);
      ["SKILL.md", "os passos que", "funcionaram, as três", "regras e as", "checagens, para", "outra pessoa rodar"].forEach((l, j) =>
        txt(this.skill, 957, 140 + j * 38, l, { "text-anchor": "middle", class: "txt" + (j === 0 ? " forte mono" : ""), style: F }));
    },
    passo(k, a) {
      this.rod.forEach((g, i) => gsap.to(g, { opacity: k >= i + 1 ? 1 : 0.12, duration: a ? 0.45 : 0, overwrite: "auto" }));
      this.regras.forEach((r) => vis(r.g, k >= r.k, a));
      vis(this.ok, k >= 3, a); vis(this.skill, k >= 4, a);
      gsap.to(this.barra, { attr: { x2: this.alvos[Math.min(k, 4)] }, duration: a ? 0.6 : 0, overwrite: "auto" });
    },
  });

  /* ====================================================================== */
  /* Arquitetura: estático, dinâmico e estático com cálculo no navegador     */
  /* ====================================================================== */
  Motor.cena("rs-arquitetura", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 330", class: "grafico-svg" }, c);
      const linha = (y0, rot, meio, dir, custo, marcaFront) => {
        const g = svg("g", {}, s);
        txt(g, 0, y0 + 22, rot, { class: "txt forte", style: F });
        caixa(g, 0, y0 + 36, 270, 84, marcaFront ? ["navegador (frontend)", marcaFront] : ["navegador (frontend)", "mostra a página"], { style: FP, dy: 26, marca: !!marcaFront });
        caixa(g, 420, y0 + 36, 300, 84, meio, { style: FP, dy: 26 });
        const setas = svg("g", {}, g);
        seta(setas, 275, y0 + 62, 415, y0 + 62);
        seta(setas, 415, y0 + 96, 275, y0 + 96, "marca");
        txt(setas, 345, y0 + 54, "pedido", { "text-anchor": "middle", class: "txt fraco", style: "font-size:15px" });
        txt(setas, 345, y0 + 115, "resposta", { "text-anchor": "middle", class: "txt marca", style: "font-size:15px" });
        let dirg = null;
        if (dir && dir.caixa) {
          caixa(g, 820, y0 + 36, 290, 84, dir.caixa, { style: FP, dy: 26 });
          seta(setas, 725, y0 + 62, 815, y0 + 62);
          seta(setas, 815, y0 + 96, 725, y0 + 96, "marca");
        } else if (dir) {
          dirg = svg("g", {}, g);
          dir.texto.forEach((t, j) => txt(dirg, 745, y0 + 66 + j * 28, t, { class: "txt", style: FP }));
        }
        const pac = svg("circle", { cx: 275, cy: y0 + 62, r: 9, style: "fill:var(--marca);opacity:0" }, g);
        const cus = txt(g, 0, y0 + 144, custo, { class: "txt forte", style: FP });
        return { g, setas, pac, cus, y0, longe: !!(dir && dir.caixa) };
      };
      this.L = [
        linha(0, "estático", ["servidor de arquivos", "entrega arquivos prontos"], { texto: ["nenhum backend calcula", "nada depois de publicado"] }, "custo: zero · manutenção: ninguém · atualiza quando você publica de novo"),
        linha(170, "dinâmico", ["servidor backend (API)", "login, regras e consultas"], { caixa: ["banco de dados", "os dados ao vivo"] }, "custo: servidor e licença · manutenção: alguém de TI · atualiza sozinho, a cada pedido"),
      ];
    },
    passo(k, a) {
      const [e, d, p] = this.L;
      vis(e.g, true, a); vis(e.setas, k >= 1, a);
      vis(d.g, k >= 2, a); vis(d.setas, k >= 2, a);
      if (p) { vis(p.g, k >= 3, a); vis(p.setas, k >= 3, a); }
      this.L.forEach((l) => vis(l.cus, k >= (p ? 4 : 3), a));
      gsap.to(d.g, { opacity: k >= 5 ? 0.35 : k >= 2 ? 1 : 0, duration: a ? 0.4 : 0, overwrite: "auto" });
      const viagem = (l) => {
        const y = l.y0, tl = gsap.timeline();
        tl.set(l.pac, { attr: { cx: 275, cy: y + 62 }, opacity: 1 })
          .to(l.pac, { attr: { cx: l.longe ? 815 : 415 }, duration: l.longe ? 0.9 : 0.6, ease: "none" })
          .set(l.pac, { attr: { cy: y + 96 } })
          .to(l.pac, { attr: { cx: 275 }, duration: l.longe ? 0.9 : 0.6, ease: "none" })
          .to(l.pac, { opacity: 0, duration: 0.2 });
      };
      if (a && k === 1) viagem(e);
      if (a && k === 2) viagem(d);
      if (a && k === 3 && p) viagem(p);
    },
  });

  /* ====================================================================== */
  /* Frases para pôr no pedido, cada uma com um exemplo que funciona         */
  /* ====================================================================== */
  if (!document.getElementById("css-palavras")) {
    const st = document.createElement("style");
    st.id = "css-palavras";
    st.textContent = `
.palavras { display: grid; grid-template-columns: .82fr 1.18fr; gap: 18px; font-size: .64em; text-align: left; }
.palavras .grade { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-content: start; }
.palavras button.fr { font: inherit; font-size: .95em; text-align: left; line-height: 1.2; padding: 8px 10px; border-radius: 10px;
  border: 1.5px solid var(--superficie-borda); background: var(--superficie); color: var(--texto); cursor: pointer; }
.palavras button.fr.on { border-color: var(--marca); box-shadow: inset 0 0 0 1.5px var(--marca); font-weight: 700; }
.palavras .painel { background: var(--superficie); border-left: 5px solid var(--marca); border-radius: 12px; padding: 12px 16px; min-height: 440px; }
.palavras .painel .f { font-weight: 700; font-size: 1.12em; }
.palavras .painel .m { margin: 4px 0 8px; }
.palavras .painel .fonte { font-size: .78em; opacity: .75; margin-top: 8px; }
.palavras .demo { background: var(--fundo); border: 1px solid var(--superficie-borda); border-radius: 10px; padding: 10px 12px; min-height: 270px; }
.palavras .demo pre { margin: 0; font-size: .88em; line-height: 1.35; white-space: pre-wrap; font-family: "JetBrains Mono", Consolas, monospace; background: none; box-shadow: none; }
.palavras .demo .ok { color: var(--turquesa); font-weight: 700; } .palavras .demo .no { color: var(--marca); font-weight: 700; }
.palavras .demo button { font: inherit; font-size: .9em; margin-top: 8px; padding: 4px 12px; border-radius: 8px; border: 0; background: var(--marca); color: #fff; cursor: pointer; }
.palavras .demo textarea { width: 100%; box-sizing: border-box; height: 130px; font-family: "JetBrains Mono", Consolas, monospace; font-size: .82em; background: var(--superficie); color: var(--texto); border: 1px solid var(--superficie-borda); border-radius: 8px; padding: 6px; }
.palavras .duas { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.palavras .rot { font-size: .8em; font-weight: 700; opacity: .75; margin-bottom: 4px; }
.palavras .bolha { padding: 6px 10px; border-radius: 10px; margin: 5px 0; max-width: 85%; }
.palavras .bolha.ag { background: var(--superficie); } .palavras .bolha.eu { background: color-mix(in srgb, var(--turquesa) 18%, transparent); margin-left: auto; }
.palavras table { border-collapse: collapse; width: 100%; font-size: .9em; } .palavras td, .palavras th { border-bottom: 1px solid var(--superficie-borda); padding: 3px 6px; text-align: left; }
.palavras .barra-g { height: 22px; background: var(--marca); border-radius: 4px; margin: 4px 0 10px; }`;
    document.head.appendChild(st);
  }
  function carregar(src) {
    return new Promise((ok, erro) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = erro; document.head.appendChild(s); });
  }
  function notasPorEmpresa() {
    const linhas = (window.AVALIACOES || "").trim().split("\n").slice(1).map((l) => l.split(","));
    const m = {};
    linhas.forEach(([e, , n]) => { (m[e] = m[e] || []).push(+n); });
    return Object.entries(m).map(([e, v]) => [e, v.reduce((a, b) => a + b, 0) / v.length, v.length]).sort((a, b) => b[1] - a[1]);
  }
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let PY = null, ECH = null;
  const FRASES = [
    { f: "inclua testes e rode até passarem", m: "o agente escreve checagens, roda e só entrega quando passam",
      fonte: "Anthropic, boas práticas do Claude Code: dar ao agente um jeito de verificar o próprio trabalho; OpenAI, boas práticas do Codex: escrever testes e rodar as checagens",
      demo(d) {
        d.innerHTML = `<pre>def test_nota_entre_1_e_5(base):
    assert base["nota"].between(1, 5).all()

def test_sem_repetidas(base):
    assert not base["id_avaliacao"].duplicated().any()</pre><pre class="saida" style="margin-top:8px"></pre><button>corrigir e rodar de novo</button>`;
        const sai = d.querySelector(".saida"), bt = d.querySelector("button");
        const rodar = (ok) => {
          sai.innerHTML = `<span class="ok">ok</span>      test_nota_entre_1_e_5\n` + (ok ? `<span class="ok">ok</span>      test_sem_repetidas\n<span class="ok">2 passaram</span>` : `<span class="no">falhou</span>  test_sem_repetidas: 1.990 repetidas\n<span class="no">1 falhou</span>, 1 passou`);
          gsap.from(sai, { opacity: 0, duration: 0.4 });
        };
        rodar(false);
        bt.onclick = (e) => { e.stopPropagation(); rodar(true); bt.textContent = "rodar com o erro"; bt.onclick = (ev) => { ev.stopPropagation(); FRASES[0].demo(d); }; };
      } },
    { f: "diga o objetivo e quando está pronto", m: "o pedido ganha quatro partes, e o agente sabe onde parar",
      fonte: "OpenAI, boas práticas do Codex: objetivo, contexto, restrições e \"pronto quando\"",
      demo(d) {
        const L = [["Objetivo", "um monitor diário das avaliações dos 4 apps"], ["Contexto", "as coletas estão em dados/coletas/, uma por dia"], ["Restrições", "não edite as coletas; nenhum dado pessoal na página"], ["Pronto quando", "a página mostra 2.010 avaliações e 10 novas"]];
        d.innerHTML = L.map(([r, t]) => `<div class="l" style="margin:8px 0"><div class="rot">${r}</div>${t}</div>`).join("");
        gsap.from(d.querySelectorAll(".l"), { opacity: 0, y: 10, stagger: 0.25, duration: 0.4 });
      } },
    { f: "planeje antes de fazer e me mostre o plano", m: "você revisa o caminho antes de qualquer arquivo mudar",
      fonte: "Anthropic: explorar, planejar, implementar e verificar; OpenAI: modo de plano do Codex para tarefas ambíguas",
      demo(d) {
        const P = ["ler as duas coletas e contar as linhas", "juntar sem repetir avaliações", "escrever as checagens e rodar", "gerar a página saida/index.html"];
        d.innerHTML = `<div class="rot">Plano (aguardando a sua aprovação)</div>` + P.map((t, i) => `<div class="pp" style="margin:8px 0"><span class="ck">○</span> ${i + 1}. ${t}</div>`).join("") + `<button>aprovar o plano</button>`;
        d.querySelector("button").onclick = (e) => {
          e.stopPropagation();
          d.querySelectorAll(".ck").forEach((c, i) => setTimeout(() => { c.textContent = "✓"; c.className = "ck ok"; }, 350 * i));
        };
      } },
    { f: "me faça perguntas antes de começar", m: "o agente pergunta o que é ambíguo, em vez de chutar",
      fonte: "Anthropic: peça para o agente entrevistar você; OpenAI: perguntas de esclarecimento no modo de plano",
      demo(d) {
        const B = [["ag", "O que conta como avaliação nova: a que não estava em nenhuma coleta anterior?"], ["eu", "Isso."], ["ag", "Se a mesma avaliação mudar de nota, vale a mais recente?"], ["eu", "Vale, e avise na página."], ["ag", "Combinado. Vou escrever as duas regras no AGENTS.md."]];
        d.innerHTML = B.map(([q, t]) => `<div class="bolha ${q}">${t}</div>`).join("");
        gsap.from(d.querySelectorAll(".bolha"), { opacity: 0, y: 8, stagger: 0.4, duration: 0.35 });
      } },
    { f: "mostre a evidência: o comando e a saída", m: "em vez de \"pronto, deve funcionar\", você vê o que rodou",
      fonte: "Anthropic, boas práticas do Claude Code: peça evidência, o comando que rodou e a saída",
      demo(d) {
        const L = ["$ python rodar.py", "  4.000 linhas nas coletas viraram 2.010 avaliações (1.990 repetidas)", "  1 avaliação editada: vale a versão mais recente", "  9 checagens ok, 2 alertas", "  página gravada em saida/index.html"];
        d.innerHTML = `<pre>${L.map((l) => `<span class="ln">${esc(l)}\n</span>`).join("")}</pre>`;
        gsap.from(d.querySelectorAll(".ln"), { opacity: 0, stagger: 0.35, duration: 0.2 });
      } },
    { f: "crie um AGENTS.md com as regras", m: "as regras ficam num arquivo que toda conversa nova lê",
      fonte: "OpenAI, boas práticas do Codex: AGENTS.md curto, com como rodar, como testar, as regras e o que é estar pronto",
      demo(d) {
        d.innerHTML = `<pre># AGENTS.md
## Como rodar
python rodar.py --baixar
## Regras
- As coletas nunca são editadas.
- A mesma avaliação conta uma vez.
- Avaliação editada: vale a mais recente.
- Nenhum dado pessoal na página.
## Pronto quando
As checagens passam e a página abre.</pre>`;
      } },
    { f: "responda em JSON seguindo este esquema", m: "a IA devolve sempre as mesmas colunas, com as opções combinadas",
      fonte: "OpenAI, Structured Outputs: respostas que seguem um esquema JSON",
      demo(d) {
        d.innerHTML = `<div class="duas"><div><div class="rot">esquema</div><pre>{"tema": ["atraso", "bagagem",
          "app", "atendimento",
          "preço"],
 "tom":  ["positivo", "neutro",
          "negativo"]}</pre></div><div><div class="rot">resposta para "Cobraram a mala duas vezes"</div><pre>{"tema": "bagagem",
 "tom":  "negativo"}</pre><div class="v" style="margin-top:10px"><span class="ok">segue o esquema</span></div></div></div>`;
      } },
    { f: "use este print como referência de estilo", m: "a página sai com a cara da sua marca, e não a de um modelo genérico",
      fonte: "OpenAI, guia de front-end do GPT-5: dar a imagem do design como entrada; Anthropic: colar o print do design no pedido",
      demo(d) {
        d.innerHTML = `<div class="duas"><div><div class="rot">sem referência</div><div style="font-family:Arial;border:1px solid #99a;border-radius:6px;padding:10px"><div style="font-size:1.1em;color:#2d5be3;font-weight:700">Monitor de avaliações</div><div style="margin:6px 0">Nota média: 3,1</div><span style="background:#2d5be3;color:#fff;padding:3px 10px;border-radius:14px">Ver mais</span></div></div>
<div><div class="rot">com o print da marca</div><div style="border-left:5px solid #e50505;padding:10px;background:var(--superficie)"><div style="font-family:'GT Ultra Fine',Georgia,serif;font-size:1.3em">Monitor de avaliações</div><div style="margin:6px 0"><b style="font-size:1.6em">3,1</b> nota média</div><span style="color:#e50505;font-weight:700">ver detalhes ›</span></div></div></div>`;
      } },
    { f: "use ECharts para os gráficos", m: "gráficos interativos: passe o mouse para ver o número",
      fonte: "OpenAI, guia de front-end do GPT-5: dizer as bibliotecas de partida; ECharts (echarts.apache.org) é uma biblioteca aberta de gráficos",
      demo(d) {
        d.innerHTML = `<div class="g" style="width:100%;height:290px">carregando o ECharts...</div>`;
        const alvo = d.querySelector(".g");
        (ECH ? Promise.resolve() : carregar("https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js").then(() => { ECH = true; })).then(() => {
          alvo.textContent = "";
          const dados = notasPorEmpresa().reverse();
          const cor = getComputedStyle(document.documentElement).getPropertyValue("--texto").trim() || "#222";
          const ch = echarts.init(alvo);
          ch.setOption({
            title: { text: "Nota média dos últimos 90 dias", textStyle: { color: cor, fontSize: 16 } },
            tooltip: {}, grid: { left: 70, right: 30, top: 40, bottom: 30 },
            xAxis: { type: "value", min: 0, max: 5, axisLabel: { color: cor } },
            yAxis: { type: "category", data: dados.map((x) => x[0]), axisLabel: { color: cor, fontSize: 14 } },
            series: [{ type: "bar", data: dados.map((x) => +x[1].toFixed(2)), itemStyle: { color: "#e50505" }, label: { show: true, position: "right", color: cor } }],
          });
        }).catch(() => { alvo.textContent = "Sem internet para baixar o ECharts agora."; });
      } },
    { f: "use GSAP para as animações", m: "transições suaves: a mesma barra cresce até o valor novo",
      fonte: "OpenAI, guia de front-end do GPT-5: dizer as bibliotecas de partida (cita a Motion); GSAP (gsap.com) é a usada nestes slides",
      demo(d) {
        const dados = notasPorEmpresa();
        d.innerHTML = dados.map(([e, v]) => `<div>${e}: ${v.toFixed(1).replace(".", ",")}</div><div class="barra-g" data-v="${v}"></div>`).join("") + `<button>animar de novo</button>`;
        const anima = () => d.querySelectorAll(".barra-g").forEach((b, i) => gsap.fromTo(b, { width: 0 }, { width: (+b.dataset.v / 5) * 100 + "%", duration: 0.9, delay: i * 0.12, ease: "power2.out" }));
        anima();
        d.querySelector("button").onclick = (e) => { e.stopPropagation(); anima(); };
      } },
    { f: "use Pyodide para rodar Python no navegador", m: "o Python roda aqui, no seu navegador, sem servidor",
      fonte: "Pyodide (pyodide.org): Python e pandas compilados para WebAssembly",
      demo(d) {
        d.innerHTML = `<textarea spellcheck="false">import pandas as pd
from io import StringIO
d = pd.read_csv(StringIO(AVALIACOES))
print(d.groupby("empresa")["nota"].agg(["count", "mean"]).round(2))</textarea><button>rodar Python</button><pre class="saida" style="margin-top:8px">Clique em "rodar Python". Os dados são as avaliações reais dos últimos 90 dias, guardadas na página.</pre>`;
        const ta = d.querySelector("textarea"), sai = d.querySelector(".saida"), bt = d.querySelector("button");
        Motor.util.semTeclas(ta);
        bt.onclick = async (e) => {
          e.stopPropagation(); bt.disabled = true;
          try {
            if (!PY) {
              sai.textContent = "Baixando o Python para o navegador (só na primeira vez)...";
              const U = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/";
              await carregar(U + "pyodide.js"); PY = await loadPyodide({ indexURL: U });
              sai.textContent = "Carregando o pandas..."; await PY.loadPackage("pandas");
            }
            let t = ""; PY.setStdout({ batched: (x) => { t += x + "\n"; } }); PY.setStderr({ batched: (x) => { t += x + "\n"; } });
            PY.globals.set("AVALIACOES", window.AVALIACOES || "");
            const t0 = performance.now(); await PY.runPythonAsync(ta.value);
            sai.textContent = (t || "(nada impresso)") + `rodou em ${Math.round(performance.now() - t0)} ms, no seu computador`;
          } catch (err) { sai.textContent = "Erro: " + err.message; } finally { bt.disabled = false; }
        };
      } },
    { f: "só números agregados, nenhum dado pessoal", m: "a página mostra médias e contagens, nunca a pessoa",
      fonte: "OpenAI, boas práticas do Codex: restrições e regras de segurança no pedido; LGPD",
      demo(d) {
        d.innerHTML = `<div class="duas"><div><div class="rot no">linha a linha (exemplo fictício)</div><table><tr><th>apelido</th><th>texto</th></tr><tr><td>@viajante_sp</td><td>me liga no (11) 9...</td></tr><tr><td>@maria.v</td><td>cobraram a mala...</td></tr></table></div>
<div><div class="rot ok">agregado</div><table><tr><th>empresa</th><th>avaliações</th><th>nota</th></tr>${notasPorEmpresa().map(([e, v, n]) => `<tr><td>${e}</td><td>${n}</td><td>${v.toFixed(1).replace(".", ",")}</td></tr>`).join("")}</table></div></div>`;
      } },
    { f: "um único arquivo HTML", m: "a página vai inteira num arquivo, pronta para o Netlify Drop ou para o e-mail",
      fonte: "OpenAI, boas práticas do Codex: diga as restrições da entrega; o guia de front-end do GPT-5 entrega cada exemplo num arquivo HTML",
      demo(d) {
        d.innerHTML = `<div class="duas"><div><div class="rot">sem a frase</div><pre>projeto/
  package.json
  node_modules/  (312 MB)
  src/
    App.jsx
    grafico.jsx
  vite.config.js
"rode npm install"</pre></div><div><div class="rot">com a frase</div><pre>saida/
  index.html  (180 KB)

arraste no Netlify Drop
ou mande por e-mail</pre></div></div>`;
      } },
  ];
  Motor.cena("rs-palavras", {
    montar(c) {
      const box = Motor.util.html("div", "palavras", c);
      const grade = Motor.util.html("div", "grade", box);
      const painel = Motor.util.html("div", "painel", box);
      const mostrar = (i) => {
        const F0 = FRASES[i];
        painel.innerHTML = `<div class="f">"${F0.f}"</div><div class="m">${F0.m}</div><div class="demo"></div><div class="fonte">fonte: ${F0.fonte}</div>`;
        F0.demo(painel.querySelector(".demo"));
        grade.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === i));
      };
      FRASES.forEach((fr, i) => {
        const b = Motor.util.html("button", "fr", grade, fr.f);
        b.addEventListener("click", (e) => { e.stopPropagation(); mostrar(i); });
      });
      mostrar(0);
    },
  });

  /* ====================================================================== */
  /* O caminho da manhã                                                      */
  /* ====================================================================== */
  Motor.cena("rs-manha", {
    montar(c) {
      const s = svg("svg", { viewBox: "0 0 1120 250", class: "grafico-svg" }, c);
      const xs = [110, 335, 560, 785, 1010];
      this.xs = xs;
      svg("line", { x1: xs[0], x2: xs[4], y1: 80, y2: 80, class: "eixo", style: "stroke-width:4" }, s);
      this.barra = svg("line", { x1: xs[0], x2: xs[0], y1: 80, y2: 80, class: "reta", style: "stroke-width:6" }, s);
      const N = [["a coleta", "de hoje"], ["a pasta, com regras", "e checagens"], ["a skill", "do monitor"], ["a página", "publicada"], ["o link", "no celular"]];
      this.nos = N.map((l, i) => {
        const g = svg("g", {}, s);
        svg("circle", { cx: xs[i], cy: 80, r: 34, class: "caixa", style: "stroke-width:3" }, g);
        txt(g, xs[i], 92, String(i + 1), { "text-anchor": "middle", class: "txt forte", style: "font-size:30px" });
        l.forEach((t, j) => txt(g, xs[i], 160 + j * 30, t, { "text-anchor": "middle", class: "txt" + (j === 0 ? " forte" : ""), style: F }));
        return g;
      });
    },
    passo(k, a) {
      const i = Math.min(k, 4);
      this.nos.forEach((g, j) => {
        gsap.to(g, { opacity: j <= i ? 1 : 0.18, duration: a ? 0.4 : 0, overwrite: "auto" });
        g.querySelector("circle").setAttribute("class", "caixa" + (j === i && k < 5 ? " marca" : ""));
      });
      gsap.to(this.barra, { attr: { x2: this.xs[i] }, duration: a ? 0.6 : 0, overwrite: "auto" });
    },
  });
})();
