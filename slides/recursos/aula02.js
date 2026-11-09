/*
 * Cenas animadas de 01-chatgpt-work.qmd, segunda metade (estúdio 2, 11h a 13h).
 * Usa o motor de passos (recursos/motor.js) e as classes de recursos/cenas.css.
 *
 * Os números (só agregados: contagens e proporções) vêm de
 * scripts/dados_cenas_aula02.py, que reescreve o bloco DADOS abaixo.
 */
/* DADOS-INICIO */
const DADOS = {"linha":{"LATAM":{"n":500,"ini":"2025-10-24","fim":"2026-10-31","meses":{"2025-10":6,"2025-11":23,"2025-12":31,"2026-01":43,"2026-02":31,"2026-03":54,"2026-04":40,"2026-05":45,"2026-06":33,"2026-07":47,"2026-08":40,"2026-09":53,"2026-10":54}},"Gol":{"n":500,"ini":"2026-05-15","fim":"2026-10-31","meses":{"2026-05":66,"2026-06":122,"2026-07":96,"2026-08":37,"2026-09":34,"2026-10":145}},"Azul":{"n":500,"ini":"2026-06-30","fim":"2026-11-01","meses":{"2026-06":4,"2026-07":120,"2026-08":123,"2026-09":123,"2026-10":128,"2026-11":2}},"TAP":{"n":500,"ini":"2021-03-10","fim":"2026-10-31","meses":{"2021-03":1,"2021-04":7,"2021-05":2,"2021-06":2,"2021-07":7,"2021-08":4,"2021-09":5,"2021-10":7,"2021-11":7,"2021-12":4,"2022-01":4,"2022-02":13,"2022-03":15,"2022-04":19,"2022-05":3,"2022-06":3,"2022-07":37,"2022-08":10,"2022-09":20,"2022-10":8,"2022-11":3,"2022-12":5,"2023-01":20,"2023-02":5,"2023-03":10,"2023-04":22,"2023-05":14,"2023-06":6,"2023-07":4,"2023-08":4,"2023-09":5,"2023-10":5,"2023-11":1,"2023-12":7,"2024-01":16,"2024-02":2,"2024-03":5,"2024-04":6,"2024-05":6,"2024-06":3,"2024-07":9,"2024-08":2,"2024-09":3,"2024-10":5,"2024-11":4,"2024-12":13,"2025-01":13,"2025-02":7,"2025-03":12,"2025-04":6,"2025-05":6,"2025-06":6,"2025-07":4,"2025-08":3,"2025-09":3,"2025-10":7,"2025-11":4,"2025-12":1,"2026-01":5,"2026-02":3,"2026-03":7,"2026-04":3,"2026-05":1,"2026-06":1,"2026-07":3,"2026-09":5,"2026-10":37}}},"notas":{"LATAM":{"n":500,"estrelas":[195,32,20,25,228],"media":3.12,"pagina":4.85,"pagina_n":519628},"Gol":{"n":500,"estrelas":[295,34,29,7,135],"media":2.31,"pagina":4.69,"pagina_n":427593},"Azul":{"n":500,"estrelas":[147,21,33,16,283],"media":3.53,"pagina":4.89,"pagina_n":723984},"TAP":{"n":500,"estrelas":[360,39,19,23,59],"media":1.76,"pagina":3.25,"pagina_n":1011}},"app":{"LATAM":{"app_falha":33.6,"atraso_canc":2.2,"fala_do_voo":13.2,"elogio":37.2},"Gol":{"app_falha":36.0,"atraso_canc":12.4,"fala_do_voo":18.2,"elogio":19.6},"Azul":{"app_falha":13.6,"atraso_canc":1.4,"fala_do_voo":7.8,"elogio":45.6},"TAP":{"app_falha":76.2,"atraso_canc":0.4,"fala_do_voo":7.0,"elogio":8.2}},"tjsp":{"LATAM":{"n":102,"cancelamento":52.0,"atraso":26.5,"bagagem":5.9,"overbooking_ou_embarque_negado":6.9,"outros":8.7},"Gol":{"n":85,"cancelamento":43.5,"atraso":36.5,"bagagem":2.4,"overbooking_ou_embarque_negado":10.6,"outros":7.0},"Azul":{"n":160,"cancelamento":50.6,"atraso":29.4,"bagagem":3.1,"overbooking_ou_embarque_negado":8.8,"outros":8.1},"TAP":{"n":119,"cancelamento":39.5,"atraso":16.8,"bagagem":21.0,"overbooking_ou_embarque_negado":15.1,"outros":7.6}},"conf":[{"de":0.35,"concordam":0,"discordam":1},{"de":0.4,"concordam":2,"discordam":0},{"de":0.45,"concordam":1,"discordam":1},{"de":0.5,"concordam":1,"discordam":1},{"de":0.55,"concordam":2,"discordam":0},{"de":0.6,"concordam":2,"discordam":3},{"de":0.65,"concordam":2,"discordam":2},{"de":0.7,"concordam":3,"discordam":2},{"de":0.75,"concordam":4,"discordam":0},{"de":0.8,"concordam":8,"discordam":2},{"de":0.85,"concordam":9,"discordam":2},{"de":0.9,"concordam":15,"discordam":5},{"de":0.95,"concordam":82,"discordam":10}]};
/* DADOS-FIM */
(function () {
  "use strict";
  const { svg, html, escala, num, gerador, seta, DUR } = Motor.util;
  /* como o txt do motor, mas o tamanho da fonte vai no style (a classe venceria o atributo) */
  function txt(pai, x, y, t, attrs = {}) {
    const a = Object.assign({}, attrs);
    if (a["font-size"]) { a.style = (a.style ? a.style + ";" : "") + `font-size:${a["font-size"]}px`; delete a["font-size"]; }
    return Motor.util.txt(pai, x, y, t, a);
  }
  const EMP = ["LATAM", "Gol", "Azul", "TAP"];
  const COR = { LATAM: "var(--roxo)", Gol: "var(--laranja)", Azul: "var(--turquesa)", TAP: "var(--marca)" };
  const pct = (v) => num(v, 0) + "%";

  /* ---------- estilos só desta parte do deck ----------------------------- */
  const css = document.createElement("style");
  css.textContent = `
  .grafico-svg .a2-mono { font-family: "JetBrains Mono", Consolas, monospace; font-size: 16px; fill: var(--texto); }
  .grafico-svg .a2-tit { font-size: 20px; font-weight: 700; fill: var(--texto); }
  .grafico-svg .a2-sub { font-size: 16px; fill: var(--texto-fraco); }
  .grafico-svg .a2-dentro { fill: var(--fundo); font-size: 16px; font-weight: 700; }
  .grafico-svg .a2-voce { fill: var(--turquesa); font-weight: 700; }
  .grafico-svg .a2-cod { fill: var(--laranja); font-weight: 700; }
  .grafico-svg .caixa.voce { stroke: var(--turquesa); stroke-width: 3.5; }
  .grafico-svg .caixa.cod { stroke: var(--laranja); stroke-width: 3.5; }
  .grafico-svg .tracejada { stroke-dasharray: 7 6; }
  .grafico-svg .a2-ph { fill: var(--regua); }
  .grafico-svg .a2-pasta { fill: var(--superficie); stroke: var(--texto-fraco); stroke-width: 2; }
  .grafico-svg .a2-arq rect { fill: var(--fundo); stroke: var(--texto-fraco); stroke-width: 1.5; }
  .grafico-svg .a2-ok { fill: var(--turquesa); font-weight: 700; }
  .grafico-svg .a2-nao { fill: var(--marca); font-weight: 700; }
  .grafico-svg .a2-riscado { fill: var(--texto-fraco); text-decoration: line-through; }
  .grafico-svg .a2-trilho { fill: var(--superficie); stroke: var(--superficie-borda); }
  .grafico-svg .a2-realce { fill: none; stroke: var(--marca); stroke-width: 3; }
  .grafico-svg .a2-ponto { fill: var(--regua); transition: fill .5s, stroke .3s; stroke: transparent; stroke-width: 0; }
  .grafico-svg.a2-cor .a2-ponto.dis { fill: var(--laranja); }
  .grafico-svg.a2-cor .a2-ponto.con { fill: var(--turquesa); }
  .grafico-svg .a2-ponto.ler { stroke: var(--marca); stroke-width: 3; }
  .grafico-svg .seta.v-tema { stroke: var(--roxo); stroke-width: 2.5; } .grafico-svg .ponta.v-tema { fill: var(--roxo); }
  .grafico-svg .seta.v-preco { stroke: var(--laranja); stroke-width: 2.5; } .grafico-svg .ponta.v-preco { fill: var(--laranja); }
  .grafico-svg .seta.v-tom { stroke: var(--turquesa); stroke-width: 2.5; } .grafico-svg .ponta.v-tom { fill: var(--turquesa); }
  .a2-sobre { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
  .grifo-p.v-tema.marcado { box-shadow: inset 0 -4px 0 var(--roxo); }
  .grifo-p.v-preco.marcado { box-shadow: inset 0 -4px 0 var(--laranja); }
  .grifo-p.v-tom.marcado { box-shadow: inset 0 -4px 0 var(--turquesa); }
  td span.v-tema { color: var(--roxo); font-weight: 700; } td span.v-preco { color: var(--laranja); font-weight: 700; }
  td span.v-tom { color: var(--turquesa); font-weight: 700; }
  .a2-ctrl .botoes { align-items: center; }
  .a2-ctrl .leitura { margin-top: .35em; font-size: 1.15em; color: var(--texto); }
  .a2-ctrl .leitura b { color: var(--marca); }
  `;
  document.head.appendChild(css);

  /* ---------- utilitários ------------------------------------------------ */
  function quadro(caixa, w, h) { return svg("svg", { viewBox: `0 0 ${w} ${h}`, class: "grafico-svg" }, caixa); }
  function mostra(el, on, anim, atraso = 0) {
    if (!el) return;
    gsap.to(el, { autoAlpha: on ? 1 : 0, duration: anim ? DUR : 0, delay: anim && on ? atraso : 0, overwrite: "auto" });
  }
  function esconde(lista) { lista.forEach((e) => e && gsap.set(e, { autoAlpha: 0 })); }
  function ret(g, x, y, w, h, cls = "caixa", rx = 10) { return svg("rect", { x, y, width: w, height: h, rx, class: cls }, g); }
  /* curva com ponta, saindo e chegando na horizontal */
  function curva(g, x1, y1, x2, y2, cls = "") {
    const gg = svg("g", {}, g);
    const dx = (x2 - x1) * 0.5, dir = Math.sign(x2 - x1) || 1;
    svg("path", { d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2 - dir * 6},${y2}`, class: `seta ${cls}` }, gg);
    svg("polygon", { points: `${x2},${y2} ${x2 - dir * 12},${y2 - 6} ${x2 - dir * 12},${y2 + 6}`, class: `ponta ${cls}` }, gg);
    return gg;
  }
  /* texto com partes de estilos diferentes: [["texto", "classe"], ...] */
  function partes(g, x, y, lista, attrs) {
    const t = txt(g, x, y, "", attrs);
    for (const [s, c] of lista) { const sp = svg("tspan", c ? { class: c } : {}, t); sp.textContent = s; }
    return t;
  }

  /* ======================================================================
   * 1. O ciclo do web scraping: seis passos, três com vocês, três de código
   * ==================================================================== */
  Motor.cena("a2-ciclo", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 290);
      const P = [["Identificar", "voce"], ["Navegar", "voce"], ["Replicar", "cod"], ["Parsear", "cod"], ["Validar", "voce"], ["Iterar", "cod"]];
      const W = 142, G = 29, X0 = 8, Y = 80, H = 82;
      this.nos = []; this.setas = []; this.quem = [];
      P.forEach(([nome, tipo], i) => {
        const x = X0 + i * (W + G);
        const g = svg("g", {}, s);
        const r = ret(g, x, Y, W, H);
        txt(g, x + W / 2, Y + 32, String(i + 1), { "text-anchor": "middle", class: "txt fraco", "font-size": 19 });
        txt(g, x + W / 2, Y + 62, nome, { "text-anchor": "middle", class: "txt forte", "font-size": 21 });
        this.nos.push({ g, r, tipo });
        if (i) this.setas.push(seta(s, x - G + 2, Y + H / 2, x - 3, Y + H / 2));
        this.quem.push(txt(s, x + W / 2, Y - 20, tipo === "voce" ? "vocês" : "código", { "text-anchor": "middle", class: "txt a2-" + tipo, "font-size": 19 }));
      });
      const xi = X0 + 5 * (W + G) + W / 2, xr = X0 + 2 * (W + G) + W / 2, yb = Y + H, yv = 232;
      this.volta = svg("g", {}, s);
      svg("path", { d: `M${xi},${yb + 4} V${yv} H${xr} V${yb + 16}`, class: "seta marca tracejada" }, this.volta);
      svg("polygon", { points: `${xr},${yb + 4} ${xr - 7},${yb + 17} ${xr + 7},${yb + 17}`, class: "ponta marca" }, this.volta);
      txt(this.volta, (xi + xr) / 2, yv + 30, "a próxima página, com pausa", { "text-anchor": "middle", class: "anot marca" });
      esconde([...this.nos.map((n) => n.g), ...this.setas, ...this.quem, this.volta]);
    },
    passo(k, anim) {
      this.nos.forEach((n, i) => {
        mostra(n.g, k >= i + 1, anim);
        n.r.setAttribute("class", "caixa" + (k >= 7 ? " " + n.tipo : k === i + 1 ? " marca" : ""));
      });
      this.setas.forEach((a, i) => mostra(a, k >= i + 2, anim));
      mostra(this.volta, k >= 6, anim, 0.25);
      this.quem.forEach((t) => mostra(t, k >= 7, anim));
    },
  });

  /* ======================================================================
   * 2. Do pedido à tabela: página do feed -> arquivo -> linhas
   * ==================================================================== */
  Motor.cena("a2-feed", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 420);
      const L = DADOS.linha.TAP;
      // o pedido
      this.pedido = svg("g", {}, s);
      ret(this.pedido, 4, 18, 330, 112);
      txt(this.pedido, 20, 46, "o pedido", { class: "a2-sub" });
      txt(this.pedido, 20, 74, "itunes.apple.com/br/rss/", { class: "a2-mono" });
      const l2 = txt(this.pedido, 20, 97, "customerreviews/", { class: "a2-mono" });
      this.pag = svg("tspan", { class: "a2-mono", style: "fill:var(--marca);font-weight:700" }, l2);
      this.pag.textContent = "page=1";
      const t3 = svg("tspan", {}, l2); t3.textContent = "/";
      txt(this.pedido, 20, 120, "id=440497198/json", { class: "a2-mono" });
      // a resposta
      this.resp = svg("g", {}, s);
      seta(this.resp, 169, 134, 169, 158);
      ret(this.resp, 4, 164, 330, 236);
      txt(this.resp, 20, 192, "a resposta, em JSON", { class: "a2-sub" });
      const J = ['{"im:rating": "1",', ' "updated": "2026-10-31",', ' "im:version": "7.3.2",', ' "title": "Erro de cadastro",', ' "content": "Ruim, não…",'];
      J.forEach((l, i) => txt(this.resp, 20, 222 + i * 26, l, { class: "a2-mono" }));
      partes(this.resp, 20, 222 + 5 * 26, [[' "author": ', "a2-mono"], ["apelido", "a2-mono a2-riscado"], ["}", "a2-mono"]]);
      txt(this.resp, 322, 222 + 5 * 26, "não guardar", { class: "anot marca", "text-anchor": "end", "font-size": 15 });
      // a pasta com os arquivos brutos
      this.pasta = svg("g", {}, s);
      seta(this.pasta, 340, 260, 372, 260);
      svg("path", { d: "M378,52 h70 l14,16 h150 v332 h-234 z", class: "a2-pasta" }, this.pasta);
      txt(this.pasta, 390, 44, "brutos/", { class: "a2-mono", "font-weight": 700 });
      this.arqs = [];
      for (let i = 0; i < 10; i++) {
        const c = i % 2, r = Math.floor(i / 2), x = 390 + c * 112, y = 84 + r * 50;
        const g = svg("g", { class: "a2-arq" }, s);
        svg("rect", { x, y, width: 98, height: 38, rx: 4 }, g);
        txt(g, x + 49, y + 25, `p${String(i + 1).padStart(2, "0")}.json`, { class: "a2-mono", "text-anchor": "middle", "font-size": 15 });
        this.arqs.push(g);
      }
      this.contaArq = txt(s, 495, 368, "10 arquivos × 50", { class: "txt", "text-anchor": "middle", "font-size": 17 });
      // a tabela
      this.tab = svg("g", {}, s);
      seta(this.tab, 616, 220, 646, 220);
      const C = [[654, "data"], [758, "nota"], [810, "versão"], [884, "título"]];
      C.forEach(([x, t]) => txt(this.tab, x, 70, t, { class: "txt fraco forte", "font-size": 16 }));
      svg("line", { x1: 652, x2: 996, y1: 80, y2: 80, class: "eixo" }, this.tab);
      ["2026-10-31", "1", "7.3.2", "Erro de cad…"].forEach((t, i) => txt(this.tab, C[i][0], 104, t, { class: "txt", "font-size": 16 }));
      this.linhas = [];
      const g = gerador(11);
      for (let i = 0; i < 7; i++) {
        const gg = svg("g", {}, this.tab), y = 120 + i * 24;
        [[654, 86], [758, 14], [810, 50], [884, 70 + g.u() * 40]].forEach(([x, w]) => ret(gg, x, y, w, 9, "a2-ph", 4));
        this.linhas.push(gg);
      }
      txt(this.tab, 654, 312, "… uma avaliação por linha", { class: "txt fraco", "font-size": 16 });
      // a validação
      this.val = svg("g", {}, s);
      const ini = L.ini.split("-"), fim = L.fim.split("-");
      partes(this.val, 654, 344, [["✓ ", "a2-ok"], [`${L.n} linhas, nenhuma repetida`, ""]], { class: "txt", "font-size": 17 });
      partes(this.val, 654, 370, [["✓ ", "a2-ok"], [`de ${ini[1]}/${ini[0]} a ${fim[1]}/${fim[0]}`, ""]], { class: "txt", "font-size": 17 });
      partes(this.val, 654, 396, [["✗ ", "a2-nao"], ["sem o apelido", ""]], { class: "txt", "font-size": 17 });
      esconde([this.resp, this.pasta, this.contaArq, this.tab, this.val, ...this.arqs]);
      gsap.set(this.pedido, { autoAlpha: 0 });
    },
    passo(k, anim) {
      mostra(this.pedido, k >= 1, anim);
      mostra(this.resp, k >= 2, anim);
      mostra(this.pasta, k >= 3, anim);
      this.arqs.forEach((a, i) => {
        const de = i === 0 ? 3 : 4, on = k >= de;
        if (anim && on && k === de) {
          gsap.fromTo(a, { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.in", delay: i === 0 ? 0.3 : (i - 1) * 0.2, overwrite: true });
        } else gsap.to(a, { autoAlpha: on ? 1 : 0, y: 0, duration: anim ? 0.3 : 0, overwrite: true });
      });
      mostra(this.contaArq, k >= 4, anim, anim ? 1.9 : 0);
      if (anim && k === 4) {
        const o = { v: 1 };
        gsap.to(o, { v: 10, duration: 1.8, ease: "none", onUpdate: () => { this.pag.textContent = "page=" + Math.round(o.v); } });
      } else this.pag.textContent = "page=" + (k >= 4 ? 10 : 1);
      mostra(this.tab, k >= 5, anim);
      this.linhas.forEach((l, i) => mostra(l, k >= 5, anim, 0.2 + i * 0.08));
      mostra(this.val, k >= 6, anim);
    },
  });

  /* ======================================================================
   * 3. Do mais simples ao mais difícil: a escada dos tipos de raspagem
   * ==================================================================== */
  Motor.cena("a2-escada", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 395);
      const T = [
        ["API documentada", ["endereço feito para", "programas, com manual"], "ex.: BrasilAPI, IBGE"],
        ["API pouco divulgada", ["endereço para programas", "que a aba Rede revela"], "ex.: App Store, Google Play"],
        ["HTML estático", ["os dados já vêm na", "página: é ler o HTML"], "ex.: tribunais, notícias"],
        ["HTML dinâmico", ["a página monta os dados", "rodando no navegador"], "lento e frágil"],
      ];
      const W = 232, G = 12, BASE = 330;
      this.col = T.map(([tit, desc, ex], i) => {
        const x = 8 + i * (W + G), top = 190 - i * 52;
        const g = svg("g", {}, s);
        ret(g, x, top, W, BASE - top, "caixa" + (i === 1 || i === 2 ? " marca" : ""), 8);
        txt(g, x + 14, top + 32, tit, { class: "a2-tit", "font-size": 19 });
        desc.forEach((l, j) => txt(g, x + 14, top + 60 + j * 23, l, { class: "txt", "font-size": 17 }));
        txt(g, x + 14, top + 118, ex, { class: i === 3 ? "txt fraco" : "txt marca", "font-size": 17 });
        return g;
      });
      this.eixo = svg("g", {}, s);
      seta(this.eixo, 20, 352, 980, 352);
      txt(this.eixo, 20, 384, "mais simples, mais estável", { class: "anot fraco" });
      txt(this.eixo, 980, 384, "mais trabalho, mais frágil", { class: "anot fraco", "text-anchor": "end" });
      esconde([...this.col, this.eixo]);
    },
    passo(k, anim) {
      this.col.forEach((c, i) => mostra(c, k >= i + 1, anim));
      mostra(this.eixo, k >= 4, anim, 0.2);
    },
  });

  /* ======================================================================
   * 4. As 500 mais recentes cobrem períodos diferentes (linha do tempo)
   * ==================================================================== */
  Motor.cena("a2-periodo", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 330);
      this.X0 = 150; this.X1 = 985;
      const ROW = { LATAM: 40, Gol: 110, Azul: 180, TAP: 250 };
      const ROT = { LATAM: "1 ano", Gol: "5 meses e meio", Azul: "4 meses", TAP: "5 anos e meio" };
      const id = "a2clip" + Math.floor(Math.random() * 1e6);
      const defs = svg("defs", {}, s);
      const cp = svg("clipPath", { id }, defs);
      svg("rect", { x: this.X0 - 4, y: 0, width: this.X1 - this.X0 + 8, height: 300 }, cp);
      this.gEixo = svg("g", {}, s);
      const plot = svg("g", { "clip-path": `url(#${id})` }, s);
      const g = gerador(2026);
      this.grupos = {}; this.pts = []; this.faixas = [];
      for (const e of EMP) {
        const L = DADOS.linha[e], y0 = ROW[e];
        const gr = svg("g", {}, plot);
        const ini = Date.parse(L.ini), fim = Date.parse(L.fim) + 864e5;
        const fx = svg("rect", { y: y0 - 27, height: 54, rx: 6, fill: COR[e], opacity: 0.13 }, gr);
        this.faixas.push({ fx, ini, fim });
        for (const [m, c] of Object.entries(L.meses)) {
          const [a, mm] = m.split("-").map(Number);
          let d0 = Date.UTC(a, mm - 1, 1), d1 = Date.UTC(a, mm, 1);
          d0 = Math.max(d0, ini); d1 = Math.min(d1, fim);
          for (let j = 0; j < c; j++) {
            const t = d0 + g.u() * (d1 - d0);
            const p = svg("circle", { cy: y0 + (g.u() - 0.5) * 44, r: 3, fill: COR[e], opacity: 0.7 }, gr);
            this.pts.push([p, t]);
          }
        }
        const rot = svg("g", {}, s);
        txt(rot, 0, y0 - 2, e, { class: "txt forte", "font-size": 20, fill: COR[e], style: `fill:${COR[e]}` });
        txt(rot, 0, y0 + 21, ROT[e], { class: "txt fraco", "font-size": 16 });
        this.grupos[e] = [gr, rot];
      }
      this.A = Date.UTC(2025, 8, 1); this.B = Date.UTC(2021, 0, 1); this.FIM = Date.UTC(2026, 10, 20);
      this.ini = this.A;
      this.desenha(this.A);
      Object.values(this.grupos).flat().forEach((x) => gsap.set(x, { autoAlpha: 0 }));
    },
    desenha(ini) {
      this.ini = ini;
      const sx = escala(ini, this.FIM, this.X0, this.X1);
      for (const [p, t] of this.pts) p.setAttribute("cx", sx(t));
      for (const { fx, ini: a, fim: b } of this.faixas) {
        fx.setAttribute("x", sx(a) - 4); fx.setAttribute("width", Math.max(0, sx(b) - sx(a) + 8));
      }
      const g = this.gEixo; g.replaceChildren();
      svg("line", { x1: this.X0, x2: this.X1, y1: 290, y2: 290, class: "eixo" }, g);
      const anos = this.FIM - ini > 2.5 * 365 * 864e5;
      const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      const ticks = [];
      if (anos) for (let a = 2021; a <= 2026; a++) ticks.push([Date.UTC(a, 0, 1), String(a)]);
      else for (let a = 2025; a <= 2026; a++) for (let m = 0; m < 12; m += 2) ticks.push([Date.UTC(a, m, 1), `${MES[m]}/${String(a).slice(2)}`]);
      for (const [t, r] of ticks) {
        const x = sx(t);
        if (x < this.X0 - 1 || x > this.X1 - 20) continue;
        svg("line", { x1: x, x2: x, y1: 8, y2: 290, class: "grade-linha" }, g);
        txt(g, x, 314, r, { class: "rotulo-eixo", "text-anchor": "middle", "font-size": 16 });
      }
    },
    passo(k, anim) {
      const ordem = ["Azul", "Gol", "LATAM", "TAP"];
      ordem.forEach((e, i) => this.grupos[e].forEach((x) => mostra(x, k >= i + 1, anim, e === "TAP" ? 0.9 : 0)));
      const alvo = k >= 4 ? this.B : this.A;
      if (alvo !== this.ini) {
        if (anim) {
          const o = { v: this.ini };
          gsap.to(o, { v: alvo, duration: 1.3, ease: "power2.inOut", onUpdate: () => this.desenha(o.v) });
        } else this.desenha(alvo);
      }
    },
  });

  /* ======================================================================
   * 5. A nota da página e a nota das 500 com texto
   * ==================================================================== */
  Motor.cena("a2-notas", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 330);
      const sx = escala(1, 5, 200, 640), ROW = [62, 132, 202, 272];
      txt(s, 200, 22, "nota média, de 1 a 5 estrelas", { class: "a2-sub" });
      svg("line", { x1: 200, x2: 640, y1: 300, y2: 300, class: "eixo" }, s);
      for (let v = 1; v <= 5; v++) {
        svg("line", { x1: sx(v), x2: sx(v), y1: 34, y2: 300, class: "grade-linha" }, s);
        txt(s, sx(v), 324, `${v} ★`, { class: "rotulo-eixo", "text-anchor": "middle", "font-size": 16 });
      }
      this.pag = []; this.med = []; this.dist = [];
      const ESTR = ["var(--marca)", "var(--laranja)", "var(--regua)", "var(--turquesa-claro)", "var(--turquesa)"];
      this.cab = svg("g", {}, s);
      txt(this.cab, 700, 22, `as ${"500"} com texto, por estrelas`, { class: "a2-sub" });
      ESTR.forEach((c, i) => {
        svg("rect", { x: 700 + i * 58, y: 300, width: 14, height: 14, fill: c }, this.cab);
        txt(this.cab, 718 + i * 58, 313, `${i + 1}★`, { class: "rotulo-eixo", "font-size": 15 });
      });
      EMP.forEach((e, i) => {
        const N = DADOS.notas[e], y = ROW[i];
        txt(s, 0, y - 2, e, { class: "txt forte", "font-size": 20, style: `fill:${COR[e]}` });
        const mil = N.pagina_n >= 1e4 ? `${num(N.pagina_n / 1e3, 0)} mil notas` : `${num(N.pagina_n, 0)} notas`;
        txt(s, 0, y + 21, `página: ${mil}`, { class: "txt fraco", "font-size": 15 });
        const gp = svg("g", {}, s);
        svg("circle", { cx: sx(N.pagina), cy: y, r: 10, fill: "var(--fundo)", stroke: COR[e], "stroke-width": 3.5 }, gp);
        txt(gp, sx(N.pagina), y - 17, num(N.pagina, 1), { class: "anot", "text-anchor": "middle" });
        this.pag.push(gp);
        const gm = svg("g", {}, s);
        seta(gm, sx(N.pagina) - 14, y, sx(N.media) + 14, y, "marca");
        svg("circle", { cx: sx(N.media), cy: y, r: 10, fill: COR[e] }, gm);
        txt(gm, sx(N.media), y - 17, num(N.media, 1), { class: "anot", "text-anchor": "middle" });
        txt(gm, (sx(N.pagina) + sx(N.media)) / 2, y - 10, num(N.media - N.pagina, 1), { class: "anot marca", "text-anchor": "middle", "font-size": 16 });
        this.med.push(gm);
        const gd = svg("g", {}, s);
        let x = 700;
        N.estrelas.forEach((c, j) => {
          const w = (c / N.n) * 290;
          svg("rect", { x, y: y - 17, width: Math.max(0, w - 1), height: 34, fill: ESTR[j] }, gd);
          if ((j === 0 || j === 4) && c / N.n >= 0.12) txt(gd, x + w / 2, y + 6, pct((c / N.n) * 100), { class: "a2-dentro", "text-anchor": "middle" });
          x += w;
        });
        this.dist.push(gd);
      });
      esconde([...this.pag, ...this.med, ...this.dist, this.cab]);
    },
    passo(k, anim) {
      this.pag.forEach((g, i) => mostra(g, k >= 1, anim, i * 0.1));
      this.med.forEach((g, i) => mostra(g, k >= 2, anim, i * 0.15));
      this.dist.forEach((g, i) => mostra(g, k >= 3, anim, i * 0.1));
      mostra(this.cab, k >= 3, anim);
    },
  });

  /* ======================================================================
   * 6. Uma avaliação vira uma linha: setas do grifo à variável
   * ==================================================================== */
  Motor.cena("a2-linha", {
    montar(caixa) {
      this.caixa = caixa; this.k = 0;
      this.s = svg("svg", { class: "grafico-svg a2-sobre" }, caixa);
    },
    desenhar(anim) {
      const c = this.caixa, b = c.getBoundingClientRect();
      if (!b.width || !window.Reveal) return;
      const esc = Reveal.getScale() || 1;
      const W = c.offsetWidth, H = c.offsetHeight;
      this.s.setAttribute("width", W); this.s.setAttribute("height", H);
      this.s.setAttribute("viewBox", `0 0 ${W} ${H}`);
      this.s.replaceChildren();
      const rel = (r) => ({ l: (r.left - b.left) / esc, r: (r.right - b.left) / esc, t: (r.top - b.top) / esc, b: (r.bottom - b.top) / esc });
      const caso = c.querySelector(".caixa.caso");
      if (!caso) return;
      const rc = rel(caso.getBoundingClientRect());
      const linha = (nome) => { const sp = c.querySelector(`[data-var="${nome}"]`); return sp && rel(sp.closest("tr").getBoundingClientRect()); };
      c.querySelectorAll(".grifo-p[data-liga]").forEach((gr) => {
        const m = +gr.dataset.marca, rs = gr.getClientRects(), ult = rel(rs[rs.length - 1]);
        const cls = [...gr.classList].find((x) => x.startsWith("v-"));
        gr.dataset.liga.split(" ").forEach((v, j) => {
          const t = linha(v); if (!t) return;
          const y1 = (ult.t + ult.b) / 2;
          const a = curva(this.s, rc.r + 2, y1, t.l - 4, (t.t + t.b) / 2 + (j ? 0 : 0), cls + (j ? " tracejada" : ""));
          gsap.set(a, { autoAlpha: this.k >= m ? 1 : 0 });
          if (anim && this.k === m) gsap.from(a, { autoAlpha: 0, duration: DUR, delay: 0.15 });
        });
      });
      const voo = linha("fala_do_voo");
      if (voo) {
        const a = curva(this.s, rc.r + 2, rc.b - 12, voo.l - 4, (voo.t + voo.b) / 2, "tracejada");
        gsap.set(a, { autoAlpha: this.k >= 4 ? 1 : 0 });
        if (anim && this.k === 4) gsap.from(a, { autoAlpha: 0, duration: DUR, delay: 0.15 });
      }
    },
    passo(k, anim) { this.k = k; this.desenhar(anim); },
    entrou(k) { this.k = k; requestAnimationFrame(() => this.desenhar(false)); },
  });

  /* ======================================================================
   * 7. Dois modelos lendo a mesma avaliação (A001)
   * ==================================================================== */
  Motor.cena("a2-modelos", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 400);
      this.topo = svg("g", {}, s);
      ret(this.topo, 230, 4, 540, 108);
      txt(this.topo, 248, 32, "A001 · aplicativo da Azul · 1 estrela", { class: "a2-sub" });
      txt(this.topo, 248, 60, "Aumento de preço durante a compra!", { class: "txt forte", "font-size": 19 });
      txt(this.topo, 248, 90, "…o site parou de funcionar… aumento de 200 reais…", { class: "txt", "font-size": 17 });
      const V = [["tema", "app_falha", "compra_preco", 0.94], ["preco_caro", "true", "sim", 0.84], ["tom", "negativo", "negativo", 1.0], ["fala_do_voo", "false", "não", 0.96]];
      // OpenAI
      this.oa = svg("g", {}, s);
      seta(this.oa, 400, 116, 250, 160);
      ret(this.oa, 4, 166, 466, 228);
      txt(this.oa, 22, 198, "OpenAI, com saída estruturada", { class: "a2-tit", "font-size": 19 });
      this.oaL = V.map(([v, o], i) => {
        const val = o === "true" || o === "false" ? o : `"${o}"`;
        return txt(this.oa, 22, 240 + i * 38, `${i ? " " : "{"}"${v}": ${val}${i === 3 ? "}" : ","}`, { class: "a2-mono", "font-size": 18 });
      });
      // Jev
      this.jv = svg("g", {}, s);
      seta(this.jv, 600, 116, 750, 160);
      ret(this.jv, 530, 166, 466, 228);
      txt(this.jv, 548, 198, "Jev, da TypeSafe", { class: "a2-tit", "font-size": 19 });
      this.barras = V.map(([v, , j, p], i) => {
        const y = 240 + i * 38;
        txt(this.jv, 548, y, `${v}: ${j}`, { class: "txt", "font-size": 17 });
        svg("rect", { x: 760, y: y - 15, width: 150, height: 18, rx: 3, class: "a2-trilho" }, this.jv);
        const b = svg("rect", { x: 760, y: y - 15, width: 0, height: 18, rx: 3, class: "barra turquesa" }, this.jv);
        txt(this.jv, 918, y, pct(p * 100), { class: "txt forte", "font-size": 17 });
        return [b, 150 * p];
      });
      // a diferença no tema
      this.dif = svg("g", {}, s);
      ret(this.dif, 14, 216, 446, 34, "a2-realce", 5);
      ret(this.dif, 540, 216, 446, 34, "a2-realce", 5);
      this.dif2 = txt(s, 500, 244, "≠", { class: "txt marca", "text-anchor": "middle", "font-size": 40 });
      esconde([this.topo, this.oa, this.jv, this.dif, this.dif2, ...this.oaL]);
    },
    passo(k, anim) {
      mostra(this.topo, true, false);
      mostra(this.oa, k >= 1, anim);
      this.oaL.forEach((l, i) => mostra(l, k >= 1, anim, 0.2 + i * 0.15));
      mostra(this.jv, k >= 2, anim);
      this.barras.forEach(([b, w], i) => gsap.to(b, { attr: { width: k >= 2 ? w : 0 }, duration: anim ? 0.7 : 0, delay: anim && k === 2 ? 0.2 + i * 0.12 : 0, overwrite: true }));
      mostra(this.dif, k >= 3, anim);
      mostra(this.dif2, k >= 3, anim, 0.2);
    },
  });

  /* ======================================================================
   * 8. Concordância por faixa de confiança do Jev, e quantos textos ler
   * ==================================================================== */
  Motor.cena("a2-confianca", {
    montar(caixa, slide) {
      const s = this.s = quadro(caixa, 1000, 330);
      const FX = [["abaixo de 60%", 0.6], ["60% a 80%", 0.8], ["80% a 95%", 0.95], ["95% ou mais", 9]];
      const faixa = (de) => FX.findIndex(([, ate]) => de < ate - 1e-9);
      this.pts = []; const cont = FX.map(() => ({ n: 0, con: 0 }));
      for (const b of DADOS.conf) {
        const f = faixa(b.de);
        for (let i = 0; i < b.discordam + b.concordam; i++) {
          const dis = i < b.discordam, j = cont[f].n++;
          if (!dis) cont[f].con++;
          const cx = 125 + f * 250 - 85.5 + (j % 10) * 19, cy = 92 + Math.floor(j / 10) * 19;
          this.pts.push({ c: svg("circle", { cx, cy, r: 7.5, class: "a2-ponto " + (dis ? "dis" : "con") }, s), f, dis });
        }
      }
      this.cont = cont; this.total = this.pts.length; this.totalDis = this.pts.filter((p) => p.dis).length;
      this.pcts = FX.map(([rot], f) => {
        const x = 125 + f * 250;
        txt(s, x, 32, rot, { class: "a2-tit", "text-anchor": "middle", "font-size": 19 });
        txt(s, x, 58, `${cont[f].n} avaliações`, { class: "a2-sub", "text-anchor": "middle" });
        return txt(s, x, 300, `${pct((cont[f].con / cont[f].n) * 100)} concordam`, { class: "txt forte", "text-anchor": "middle", "font-size": 19 });
      });
      this.leg = svg("g", {}, s);
      svg("circle", { cx: 380, cy: 322, r: 7, fill: "var(--turquesa)" }, this.leg);
      txt(this.leg, 394, 328, "OpenAI e Jev concordam", { class: "txt", "font-size": 16 });
      svg("circle", { cx: 610, cy: 322, r: 7, fill: "var(--laranja)" }, this.leg);
      txt(this.leg, 624, 328, "discordam", { class: "txt", "font-size": 16 });
      esconde([...this.pcts, this.leg]);
      // botões: ler à mão os de confiança abaixo de ...
      const ctrl = slide.querySelector(".a2-ctrl");
      this.lim = 0;
      if (ctrl) {
        ctrl.replaceChildren();
        const bt = html("div", "botoes", ctrl, "<span>Ler à mão os de confiança abaixo de</span>");
        this.bts = [[0.6, "60%"], [0.8, "80%"], [0.95, "95%"]].map(([v, r]) => {
          const b = html("button", "", bt, r);
          b.addEventListener("click", (e) => { e.stopPropagation(); this.lim = this.lim === v ? 0 : v; this.marca(); });
          return [b, v];
        });
        this.leitura = html("div", "leitura", ctrl, "Escolha um limite.");
      }
    },
    marca() {
      const LIM = [0.6, 0.8, 0.95];
      let n = 0, d = 0;
      for (const p of this.pts) {
        const ler = this.lim > 0 && LIM[p.f] !== undefined && LIM[p.f] <= this.lim + 1e-9;
        p.c.classList.toggle("ler", ler);
        if (ler) { n++; if (p.dis) d++; }
      }
      (this.bts || []).forEach(([b, v]) => b.classList.toggle("on", v === this.lim));
      if (this.leitura) this.leitura.innerHTML = this.lim
        ? `Ler <b>${n}</b> de ${this.total} textos (${pct((n / this.total) * 100)}) encontra <b>${d}</b> das ${this.totalDis} discordâncias (${pct((d / this.totalDis) * 100)}).`
        : "Escolha um limite.";
    },
    passo(k, anim) {
      this.s.classList.toggle("a2-cor", k >= 1);
      this.pcts.forEach((t, i) => mostra(t, k >= 1, anim, 0.3 + i * 0.1));
      mostra(this.leg, k >= 1, anim);
      if (k < 2 && this.lim) { this.lim = 0; this.marca(); }
    },
  });

  /* ======================================================================
   * 9. App Store x TJSP: o que cada fonte enxerga
   * ==================================================================== */
  Motor.cena("a2-fontes", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 394);
      const ROW = [114, 182, 250, 318];
      const sa = escala(0, 100, 100, 400);
      const TJ = [["cancelamento", "var(--roxo)"], ["atraso", "var(--laranja)"], ["bagagem", "var(--marca)"], ["overbooking_ou_embarque_negado", "var(--turquesa)"], ["outros", "var(--regua)"]];
      const ROTJ = { overbooking_ou_embarque_negado: "overbooking" };
      txt(s, 100, 24, "App Store", { class: "a2-tit" });
      txt(s, 100, 48, "do que falam as avaliações", { class: "a2-sub" });
      this.cabT = svg("g", {}, s);
      txt(this.cabT, 480, 24, "TJSP", { class: "a2-tit" });
      txt(this.cabT, 480, 48, "por que processaram a companhia", { class: "a2-sub" });
      this.af = []; this.fv = []; this.tj = []; this.linhas = { app: [], tj: [] };
      const legA = svg("g", {}, s), legV = svg("g", {}, s);
      svg("rect", { x: 100, y: 64, width: 14, height: 14, fill: "var(--azul)" }, legA);
      txt(legA, 120, 77, "o aplicativo falha", { class: "txt", "font-size": 15 });
      svg("rect", { x: 262, y: 66, width: 14, height: 10, fill: "var(--turquesa)" }, legV);
      txt(legV, 282, 77, "fala do voo", { class: "txt", "font-size": 15 });
      this.legA = legA; this.legV = legV;
      EMP.forEach((e, i) => {
        const y = ROW[i], A = DADOS.app[e], T = DADOS.tjsp[e];
        const ga = svg("g", {}, s);
        txt(ga, 0, y + 6, e, { class: "txt forte", "font-size": 20, style: `fill:${COR[e]}` });
        const a = svg("g", {}, ga);
        svg("rect", { x: 100, y: y - 20, width: sa(A.app_falha) - 100, height: 24, fill: "var(--azul)" }, a);
        txt(a, sa(A.app_falha) + 6, y - 2, pct(A.app_falha), { class: "txt forte", "font-size": 17 });
        const v = svg("g", {}, ga);
        svg("rect", { x: 100, y: y + 8, width: sa(A.fala_do_voo) - 100, height: 13, fill: "var(--turquesa)" }, v);
        txt(v, sa(A.fala_do_voo) + 6, y + 20, pct(A.fala_do_voo), { class: "txt", "font-size": 16 });
        this.af.push(a); this.fv.push(v); this.linhas.app.push(ga);
        const fora = svg("g", {}, s), gt = svg("g", {}, fora);
        let x = 480;
        TJ.forEach(([c, cor]) => {
          const w = (T[c] / 100) * 510;
          svg("rect", { x, y: y - 18, width: Math.max(0, w - 1.5), height: 36, fill: cor }, gt);
          if (T[c] >= 8 && c !== "outros") txt(gt, x + w / 2, y + 6, pct(T[c]), { class: "a2-dentro", "text-anchor": "middle" });
          x += w;
        });
        this.tj.push(gt); this.linhas.tj.push(fora);
      });
      this.legT = svg("g", {}, s);
      TJ.forEach(([c, cor], i) => {
        const x = 480 + (i % 3) * 170, y = 362 + Math.floor(i / 3) * 24;
        svg("rect", { x, y: y - 12, width: 14, height: 14, fill: cor }, this.legT);
        txt(this.legT, x + 20, y + 1, ROTJ[c] || c, { class: "txt", "font-size": 15 });
      });
      esconde([...this.af, ...this.fv, ...this.tj, this.cabT, this.legT, legA, legV]);
    },
    passo(k, anim) {
      this.af.forEach((g, i) => mostra(g, k >= 1, anim, i * 0.1));
      mostra(this.legA, k >= 1, anim);
      this.fv.forEach((g, i) => mostra(g, k >= 2, anim, i * 0.1));
      mostra(this.legV, k >= 2, anim);
      mostra(this.cabT, k >= 3, anim); mostra(this.legT, k >= 3, anim);
      this.tj.forEach((g, i) => mostra(g, k >= 3, anim, i * 0.12));
      [...this.linhas.app, ...this.linhas.tj].forEach((g, i) => {
        const tap = i % 4 === 3;
        gsap.to(g, { opacity: k >= 4 && !tap ? 0.25 : 1, duration: anim ? DUR : 0, overwrite: false });
      });
    },
  });

  /* ======================================================================
   * 10. As colunas da base de voos, no tempo
   * ==================================================================== */
  Motor.cena("a2-momentos", {
    montar(caixa) {
      const s = quadro(caixa, 1000, 200);
      const B = [
        [8, 316, "antes do voo", ["rota, horário, preço, ocupação,", "idade do avião, check-in pelo", "aplicativo, passageiros em conexão"], "var(--turquesa)"],
        [342, 316, "no dia do voo", ["atraso e motivo, reacomodação,", "assistência, falha no check-in,", "conexões perdidas, malas extraviadas"], "var(--laranja)"],
        [676, 316, "pesquisa e atendimento", ["a nota média, respondentes,", "comentários negativos, reclamações", "em 7 dias, compensação paga"], "var(--roxo)"],
      ];
      svg("line", { x1: 8, x2: 975, y1: 70, y2: 70, class: "eixo" }, s);
      svg("polygon", { points: "992,70 976,63 976,77", fill: "var(--texto-fraco)" }, s);
      txt(s, 992, 100, "tempo", { class: "a2-sub", "text-anchor": "end" });
      this.bl = B.map(([x, w, tit, l, cor]) => {
        const g = svg("g", {}, s);
        svg("rect", { x, y: 8, width: w, height: 46, rx: 8, fill: cor, opacity: 0.18 }, g);
        svg("rect", { x, y: 8, width: 6, height: 46, fill: cor }, g);
        txt(g, x + 18, 38, tit, { class: "a2-tit", "font-size": 19 });
        l.forEach((t, i) => txt(g, x + 8, 118 + i * 24, t, { class: "txt", "font-size": 16 }));
        return g;
      });
      this.nota = svg("g", {}, s);
      svg("line", { x1: 668, x2: 668, y1: 2, y2: 190, class: "guia" }, this.nota);
      svg("circle", { cx: 668, cy: 70, r: 9, fill: "var(--marca)" }, this.nota);
      txt(this.nota, 660, 100, "a nota", { class: "anot marca", "text-anchor": "end" });
      esconde([...this.bl, this.nota]);
    },
    passo(k, anim) {
      this.bl.forEach((g, i) => mostra(g, k >= i + 1, anim));
      mostra(this.nota, k >= 4, anim);
    },
  });
})();
