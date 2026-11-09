/* Cenas animadas de 01-chatgpt-work.qmd (Motor.cena), primeira metade do deck:
   aplicativos de desktop, exercício 1 (habilidade que conta) e exercício 2
   (plugin da BrasilAPI). Ver recursos/motor.js e recursos/cenas.css.

   Os números vêm de DADOS, gerado por scripts/dados_cenas_aula01.py a partir da
   transcrição do grupo focal e do gabarito do exercício 2. Os totais do Chat
   (157, 161, 210; Diego 13, 12, 25) são os das conversas da preparação. */
(function () {
"use strict";
/* DADOS:inicio (gerado por scripts/dados_cenas_aula01.py, não edite à mão) */
const DADOS = {"preco": {"pessoas": [["Jéssica", 50], ["Roberto", 17], ["Thiago", 15], ["Marcos", 12], ["Carla", 11], ["Patrícia", 7], ["Sueli", 5], ["Diego", 5]], "total": 122}, "agencias": {"lista": [{"id": "A01", "nome": "CVC", "vendas": 4.25, "motivo": ""}, {"id": "A02", "nome": "Rextur Advance", "vendas": 1.83, "motivo": ""}, {"id": "A03", "nome": "Decolar", "vendas": 3.98, "motivo": ""}, {"id": "A04", "nome": "Flytour Consolidadora", "vendas": 2.64, "motivo": ""}, {"id": "A05", "nome": "Flytour Business Travel", "vendas": 1.91, "motivo": ""}, {"id": "A06", "nome": "America Travel", "vendas": 0.72, "motivo": ""}, {"id": "A07", "nome": "Fly Pack", "vendas": 0.53, "motivo": ""}, {"id": "A08", "nome": "Flytour American Express", "vendas": 0.88, "motivo": ""}, {"id": "A09", "nome": "Zarpo", "vendas": 0.61, "motivo": ""}, {"id": "A10", "nome": "ViajaNet", "vendas": 0.0, "motivo": "baixada"}, {"id": "A11", "nome": "123milhas", "vendas": 2.3, "motivo": "atividade"}, {"id": "A12", "nome": "Sky Team Viagens", "vendas": 0.34, "motivo": "cadastro"}, {"id": "A13", "nome": "Real Sete Turismo", "vendas": 0.095, "motivo": "cadastro"}, {"id": "A14", "nome": "Pé na Estrada", "vendas": 0.06, "motivo": ""}, {"id": "A15", "nome": "Zarpei", "vendas": 0.048, "motivo": ""}, {"id": "A16", "nome": "Belatur", "vendas": 0.15, "motivo": "atividade"}, {"id": "A17", "nome": "Aérea Turismo", "vendas": 0.41, "motivo": "atividade"}, {"id": "A18", "nome": "TUR Operadora", "vendas": 0.52, "motivo": ""}, {"id": "A19", "nome": "Decolar.com", "vendas": 3.98, "motivo": "digitacao"}, {"id": "A20", "nome": "Viagens Bem Brasil", "vendas": 0.075, "motivo": "digitacao"}], "arestas": [["A01", "A02", "telefone"], ["A04", "A05", "telefone"], ["A04", "A06", "telefone"], ["A04", "A07", "telefone"], ["A05", "A06", "telefone"], ["A05", "A07", "telefone"], ["A06", "A07", "telefone"], ["A05", "A06", "endereco"], ["A01", "A02", "endereco"], ["A04", "A07", "endereco"], ["A04", "A10", "endereco"], ["A07", "A10", "endereco"]], "grupos": [["A01", "A02"], ["A04", "A05", "A06", "A07", "A10"]], "soma_grupo": {"A01+A02": 6.08, "A04+A05+A06+A07+A10": 5.8}}};
/* DADOS:fim */

if (!window.Motor) return;
const U = Motor.util;
const { svg, txt, html, seta, num, gerador, escala, eixoX } = U;

/* ---------- estilo próprio (prefixo a1-, para não colidir com outras aulas) --- */
const CSS = `
.a1 .a1-bloco rect { fill: var(--superficie); stroke: var(--superficie-borda); stroke-width: 2; }
.a1 .a1-bloco.roxo rect { stroke: var(--roxo); stroke-width: 3; }
.a1 .a1-bloco.turq rect { stroke: var(--turquesa); stroke-width: 3; }
.a1 .a1-bloco.marca rect { stroke: var(--marca); stroke-width: 3; }
.a1 .a1-bloco.laranja rect { stroke: var(--laranja); stroke-width: 3; }
.a1 .a1-bloco.vazio rect { fill: none; }
.a1 .a1-bloco.fundo rect { fill: var(--fundo); }
.a1 .a1-t1 { fill: var(--texto); font-size: 18px; font-weight: 650; }
.a1 .a1-t2 { fill: var(--texto-fraco); font-size: 15px; }
.a1 .a1-mono { font-family: "JetBrains Mono", Consolas, monospace; }
.a1 .a1-zona { fill: none; stroke: var(--regua); stroke-width: 2; stroke-dasharray: 8 6; }
.a1 .a1-zona.cheia { stroke-dasharray: none; }
.a1 .a1-zona.marca { stroke: var(--marca); stroke-width: 3; stroke-dasharray: none; }
.a1 .a1-zona.roxo { stroke: var(--roxo); stroke-width: 3; stroke-dasharray: none; }
.a1 .a1-zona.turq { stroke: var(--turquesa); stroke-width: 3; stroke-dasharray: none; }
.a1 .a1-tit { fill: var(--texto-fraco); font-size: 15px; font-weight: 700; letter-spacing: .03em; }
.a1 .a1-cab { font-size: 19px; font-weight: 700; fill: var(--texto); }
.a1 .a1-cab.roxo { fill: var(--roxo); } .a1 .a1-cab.turq { fill: var(--turquesa); } .a1 .a1-cab.marca { fill: var(--marca); }
.a1 .a1-pac { fill: var(--marca); }
.a1 .a1-pac.turq { fill: var(--turquesa); }
.a1 .a1-x { fill: var(--marca); font-size: 28px; font-weight: 800; }
.a1 .seta.roxo { stroke: var(--roxo); } .a1 .ponta.roxo { fill: var(--roxo); }
.a1 .seta.turq { stroke: var(--turquesa); } .a1 .ponta.turq { fill: var(--turquesa); }
.a1 .seta.laranja { stroke: var(--laranja); } .a1 .ponta.laranja { fill: var(--laranja); }
.a1 .seta.tracejada { stroke-dasharray: 6 5; }
.a1 .seta.grossa { stroke-width: 3; }
.a1 .a1-sinal circle { stroke-width: 2.5; }
.a1 .a1-sinal text { font-size: 16px; font-weight: 800; text-anchor: middle; }
.a1 .a1-sinal.espera circle { fill: none; stroke: var(--regua); }
.a1 .a1-sinal.ok circle { fill: var(--turquesa); stroke: var(--turquesa); }
.a1 .a1-sinal.erro circle { fill: var(--marca); stroke: var(--marca); }
.a1 .a1-sinal.aviso circle { fill: var(--laranja); stroke: var(--laranja); }
.a1 .a1-sinal.tempo circle { fill: none; stroke: var(--laranja); stroke-dasharray: 4 3; }
.a1 .a1-sinal text { fill: var(--fundo); }
.a1 .a1-sinal.tempo text, .a1 .a1-sinal.espera text { fill: var(--laranja); }
.a1 .a1-luz { fill: var(--grifo); }
.a1 .a1-chip rect { fill: var(--superficie); stroke-width: 2.5; }
.a1 .a1-chip.varia rect { stroke: var(--laranja); stroke-dasharray: 5 4; }
.a1 .a1-chip.fixa rect { stroke: var(--turquesa); }
.a1 .a1-chip text { font-family: "GT Ultra Fine", Georgia, serif; font-size: 24px; fill: var(--texto); text-anchor: middle; }
.a1 .a1-barra { fill: var(--roxo); opacity: .8; }
.a1 .a1-barra.turq { fill: var(--turquesa); opacity: .9; }
.a1 .a1-barra.marca { fill: var(--marca); opacity: 1; }
.a1 .a1-barra.fantasma { fill: none; stroke: var(--marca); stroke-width: 2; stroke-dasharray: 6 4; opacity: 1; }
.a1 .a1-ponto { stroke: var(--fundo); stroke-width: 2; }
.a1 .a1-ponto.chat { fill: var(--laranja); }
.a1 .a1-ponto.chat.sim { opacity: .45; }
.a1 .a1-ponto.hab { fill: var(--turquesa); }
.a1 .a1-no circle { fill: var(--azul); opacity: .85; }
.a1 .a1-no.fora circle { fill: var(--marca); opacity: .7; }
.a1 .a1-no.fantasma circle { fill: none; stroke: var(--marca); stroke-width: 2.5; stroke-dasharray: 5 4; opacity: 1; }
.a1 .a1-aresta { stroke-width: 3.5; fill: none; }
.a1 .a1-aresta.telefone { stroke: var(--laranja); }
.a1 .a1-aresta.endereco { stroke: var(--roxo); stroke-dasharray: 7 5; }
.a1 .a1-casco { fill: var(--superficie); stroke: var(--marca); stroke-width: 2.5; }
.a1 .a1-cartao rect { fill: var(--superficie); stroke: var(--superficie-borda); stroke-width: 2; transition: stroke .3s; }
.a1 .a1-cartao .a1-nome { fill: var(--texto); font-size: 15px; font-weight: 650; }
.a1 .a1-cartao .a1-venda { fill: var(--texto-fraco); font-size: 15px; }
.a1 .a1-cartao .a1-motivo { font-size: 15px; font-weight: 800; }
.a1 .a1-cartao.fora rect { stroke-width: 3; stroke-dasharray: 6 4; }
.a1 .a1-cartao.fora .a1-nome { opacity: .55; }
.a1 .a1-cartao.baixada rect, .a1 .a1-cartao.atividade rect { stroke: var(--marca); }
.a1 .a1-cartao.baixada .a1-motivo, .a1 .a1-cartao.atividade .a1-motivo { fill: var(--marca); }
.a1 .a1-cartao.cadastro rect { stroke: var(--laranja); } .a1 .a1-cartao.cadastro .a1-motivo { fill: var(--laranja); }
.a1 .a1-cartao.digitacao rect { stroke: var(--roxo); } .a1 .a1-cartao.digitacao .a1-motivo { fill: var(--roxo); }
.a1 .a1-doc { fill: var(--fundo); stroke: var(--texto-fraco); stroke-width: 2; }
.a1 .a1-linha-doc { stroke: var(--regua); stroke-width: 3; }
.a1-g1.marcado { background: color-mix(in srgb, var(--turquesa) 24%, transparent); box-shadow: 0 0 0 .12em color-mix(in srgb, var(--turquesa) 24%, transparent); }
.a1-g2.marcado { background: color-mix(in srgb, var(--laranja) 26%, transparent); box-shadow: 0 0 0 .12em color-mix(in srgb, var(--laranja) 26%, transparent); }
.a1-g3.marcado { background: color-mix(in srgb, var(--roxo) 20%, transparent); box-shadow: 0 0 0 .12em color-mix(in srgb, var(--roxo) 20%, transparent); }
.a1-g4.marcado { background: color-mix(in srgb, var(--marca) 18%, transparent); box-shadow: 0 0 0 .12em color-mix(in srgb, var(--marca) 18%, transparent); }
.a1-ctrl { display: flex; gap: .6em; align-items: center; flex-wrap: wrap; }
.a1-ctrl .nota { color: var(--texto-fraco); }
.cena-cheia .grafico-svg { max-height: 470px; }
`;
const st = document.createElement("style");
st.textContent = CSS;
document.head.appendChild(st);

/* ---------- utilitários desta aula ---------------------------------------- */

function raiz(caixa, w, h) {
  const s = svg("svg", { viewBox: `0 0 ${w} ${h}`, class: "grafico-svg a1", role: "img" });
  caixa.appendChild(s);
  return s;
}
const grupo = (pai, cls) => svg("g", cls ? { class: cls } : {}, pai);

/* caixa com uma ou duas linhas de texto */
function bloco(pai, x, y, w, h, cls, l1, l2, opts = {}) {
  const g = svg("g", { class: "a1-bloco " + (cls || "") }, pai);
  svg("rect", { x, y, width: w, height: h, rx: 10 }, g);
  const cx = opts.esq ? x + 16 : x + w / 2, a = opts.esq ? "start" : "middle";
  const c1 = "a1-t1" + (opts.mono1 ? " a1-mono" : ""), c2 = "a1-t2" + (opts.mono2 ? " a1-mono" : "");
  if (l2) {
    txt(g, cx, y + h / 2 - 4, l1, { class: c1, "text-anchor": a });
    txt(g, cx, y + h / 2 + 19, l2, { class: c2, "text-anchor": a });
  } else txt(g, cx, y + h / 2 + 6, l1, { class: c1, "text-anchor": a });
  return g;
}

/* mostra/esconde, com atraso opcional quando anima */
function mostra(el, on, anim, atraso = 0) {
  if (!el) return;
  gsap.to(el, { autoAlpha: on ? 1 : 0, duration: anim ? 0.45 : 0, delay: anim && on ? atraso : 0, overwrite: "auto" });
}
function esmaece(el, on, anim) {
  gsap.to(el, { opacity: on ? 0.22 : 1, duration: anim ? 0.45 : 0, overwrite: "auto" });
}

/* um "pacote" que viaja pelos pontos; devolve a timeline */
function viagem(pai, pts, o = {}) {
  const c = svg("circle", { cx: pts[0][0], cy: pts[0][1], r: o.r || 8, class: "a1-pac " + (o.cls || "") }, pai);
  const tl = gsap.timeline({ delay: o.atraso || 0, onComplete: () => { c.remove(); o.fim && o.fim(); } });
  gsap.set(c, { opacity: 0 });
  tl.set(c, { opacity: 1 });
  for (let i = 1; i < pts.length; i++) tl.to(c, { attr: { cx: pts[i][0], cy: pts[i][1] }, duration: o.dur || 0.45, ease: "none" });
  if (o.some) tl.to(c, { opacity: 0, duration: 0.35 });
  return tl;
}
/* para animações em curso e apaga pacotes soltos */
function parar(inst) {
  (inst._tl || []).forEach((t) => t.kill());
  inst._tl = [];
  inst.raiz && inst.raiz.querySelectorAll(".a1-pac").forEach((n) => n.remove());
}
/* sinal redondo (ok, erro, tempo, aviso, espera) */
function sinal(pai, x, y, r, tipo, simb) {
  const g = svg("g", { class: "a1-sinal " + tipo }, pai);
  svg("circle", { cx: x, cy: y, r }, g);
  txt(g, x, y + 6, simb, {});
  return g;
}
function setTipo(g, tipo, simb) {
  g.setAttribute("class", "a1-sinal " + tipo);
  g.querySelector("text").textContent = simb;
}
const mi = (v) => num(v, 2);
/* quebra um nome em até duas linhas de no máximo n letras */
function quebra(nome, n = 16) {
  if (nome.length <= n) return [nome];
  const p = nome.split(" ");
  let a = "", i = 0;
  while (i < p.length && (a + (a ? " " : "") + p[i]).length <= n) a += (a ? " " : "") + p[i++];
  return [a || p[i++], p.slice(i).join(" ")];
}

/* ========================================================================== */
/* 1. Onde o trabalho acontece: Chat, Work no navegador, Work no desktop      */
/* ========================================================================== */
Motor.cena("a1-onde-roda", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 720, 440));
    // zonas
    svg("rect", { x: 10, y: 14, width: 280, height: 416, rx: 16, class: "a1-zona" }, s);
    txt(s, 150, 42, "SEU COMPUTADOR", { class: "a1-tit", "text-anchor": "middle" });
    svg("rect", { x: 430, y: 14, width: 280, height: 246, rx: 16, class: "a1-zona" }, s);
    txt(s, 570, 42, "NUVEM DA OPENAI", { class: "a1-tit", "text-anchor": "middle" });
    svg("rect", { x: 430, y: 300, width: 280, height: 130, rx: 16, class: "a1-zona" }, s);
    txt(s, 570, 332, "SITES E APIS", { class: "a1-tit", "text-anchor": "middle" });
    txt(s, 570, 362, "BrasilAPI, App Store, TJSP", { class: "a1-t2", "text-anchor": "middle" });
    txt(s, 570, 386, "e os sistemas da empresa", { class: "a1-t2", "text-anchor": "middle" });

    this.app = bloco(s, 28, 62, 244, 64, "marca", "aplicativo de desktop", "o Work trabalha aqui");
    bloco(s, 28, 160, 244, 58, "", "pasta do curso", "planilhas e textos");
    bloco(s, 28, 240, 244, 58, "", "chaves de API", "no arquivo .env");
    bloco(s, 28, 320, 244, 58, "", "sua internet", "a rede daqui");
    this.modelo = bloco(s, 450, 60, 240, 64, "roxo", "modelo", "lê, escreve, decide");
    this.nuvem = bloco(s, 450, 160, 240, 74, "", "computador na nuvem", "roda código e navega");

    // passo 1: chat
    const p1 = (this.p1 = grupo(s));
    seta(p1, 274, 182, 446, 104, "roxo grossa");
    txt(p1, 362, 162, "você anexa", { class: "anot", "text-anchor": "middle" });
    // passo 2: work na nuvem
    const p2 = (this.p2 = grupo(s));
    seta(p2, 500, 236, 500, 298, "grossa");
    txt(p2, 490, 276, "navega", { class: "anot", "text-anchor": "end" });
    seta(p2, 640, 236, 640, 298, "tracejada");
    txt(p2, 640, 278, "✗", { class: "a1-x", "text-anchor": "middle" });
    txt(p2, 626, 276, "alguns recusam", { class: "anot fraco", "text-anchor": "end" });
    seta(p2, 448, 214, 276, 200, "tracejada");
    txt(p2, 362, 216, "✗", { class: "a1-x", "text-anchor": "middle" });
    txt(p2, 360, 246, "não vê", { class: "anot fraco", "text-anchor": "middle" });
    txt(p2, 360, 268, "a sua pasta", { class: "anot fraco", "text-anchor": "middle" });
    // passo 3: work no desktop
    const p3 = (this.p3 = grupo(s));
    const bus = svg("path", { d: "M28,94 H18 V349 H26 M18,189 H26 M18,269 H26", class: "seta marca grossa" }, p3);
    bus.setAttribute("fill", "none");
    seta(p3, 274, 92, 446, 92, "marca grossa");
    txt(p3, 360, 80, "pensa lá", { class: "anot marca", "text-anchor": "middle" });
    seta(p3, 274, 350, 426, 372, "marca grossa");
    txt(p3, 350, 340, "pela sua rede", { class: "anot marca", "text-anchor": "middle" });
  },
  passo(k, anim) {
    mostra(this.p1, k >= 1, anim);
    esmaece(this.p1, k >= 2, anim);
    mostra(this.nuvem, k >= 2, anim);
    mostra(this.p2, k >= 2, anim);
    esmaece(this.p2, k >= 3, anim);
    esmaece(this.nuvem, k >= 3, anim);
    mostra(this.app, k >= 3, anim);
    mostra(this.p3, k >= 3, anim, 0.2);
  },
});

/* ========================================================================== */
/* 2. Habilidade dentro de plugin dentro de aplicativo                        */
/* ========================================================================== */
Motor.cena("a1-caixas", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 820, 420));
    const app = (this.app = grupo(s));
    svg("rect", { x: 8, y: 8, width: 640, height: 404, rx: 18, class: "a1-zona marca" }, app);
    txt(app, 30, 40, "Aplicativo", { class: "a1-cab marca" });
    txt(app, 150, 40, "um plugin publicado por uma empresa", { class: "a1-t2" });

    const pl = (this.pl = grupo(s));
    svg("rect", { x: 32, y: 62, width: 594, height: 330, rx: 16, class: "a1-zona laranja" }, pl);
    pl.lastChild.style.stroke = "var(--laranja)";
    pl.lastChild.style.strokeWidth = 3;
    pl.lastChild.style.strokeDasharray = "none";
    txt(pl, 52, 94, "Plugin", { class: "a1-cab" });
    txt(pl, 124, 94, "habilidades + conexão", { class: "a1-t2" });
    bloco(pl, 428, 190, 176, 104, "laranja", "conexão", "API ou MCP");
    seta(pl, 606, 242, 686, 242, "laranja grossa");

    const hab = (this.hab = grupo(s));
    svg("rect", { x: 56, y: 116, width: 344, height: 254, rx: 14, class: "a1-zona turq" }, hab);
    txt(hab, 76, 148, "Habilidade", { class: "a1-cab turq" });
    txt(hab, 76, 172, "o que fazer, e como", { class: "a1-t2" });
    // documento SKILL.md
    svg("path", { d: "M80,190 h108 l22,22 v108 h-130 z", class: "a1-doc" }, hab);
    for (let i = 0; i < 4; i++) svg("line", { x1: 94, x2: 194, y1: 244 + i * 16, y2: 244 + i * 16, class: "a1-linha-doc" }, hab);
    txt(hab, 145, 224, "SKILL.md", { class: "a1-t1 a1-mono", "text-anchor": "middle" });
    txt(hab, 145, 348, "instruções", { class: "a1-t2", "text-anchor": "middle" });
    // script
    svg("path", { d: "M242,190 h108 l22,22 v108 h-130 z", class: "a1-doc" }, hab);
    txt(hab, 307, 224, "script.py", { class: "a1-t1 a1-mono", "text-anchor": "middle" });
    txt(hab, 307, 280, "{ }", { class: "a1-t1 a1-mono", "text-anchor": "middle", style: "font-size:34px" });
    txt(hab, 307, 348, "conta, confere", { class: "a1-t2", "text-anchor": "middle" });

    const ext = (this.ext = grupo(s));
    bloco(ext, 690, 182, 124, 120, "", "outro", "sistema");
    txt(ext, 752, 326, "BrasilAPI,", { class: "a1-t2", "text-anchor": "middle" });
    txt(ext, 752, 348, "Drive, Outlook", { class: "a1-t2", "text-anchor": "middle" });
    this.conta = txt(s, 752, 168, "🔑 sua conta", { class: "anot marca", "text-anchor": "middle" });
  },
  passo(k, anim) {
    mostra(this.hab, k >= 1, anim);
    mostra(this.pl, k >= 2, anim);
    mostra(this.ext, k >= 2, anim, 0.2);
    mostra(this.app, k >= 3, anim);
    mostra(this.conta, k >= 3, anim, 0.2);
  },
});

/* ========================================================================== */
/* 3. O modelo sorteia a próxima palavra; o script segue uma receita          */
/* ========================================================================== */
const CANDIDATAS = [["13", 0.28], ["12", 0.24], ["cerca de", 0.14], ["25", 0.12], ["várias", 0.12], ["5", 0.10]];
Motor.cena("a1-palavra", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 380));
    // lado do modelo
    txt(s, 0, 22, "Só o modelo: uma palavra de cada vez", { class: "a1-cab roxo" });
    txt(s, 0, 60, "“O Diego falou de preço …”", { class: "a1-t1" });
    txt(s, 470, 60, "chances ilustrativas", { class: "a1-t2", "text-anchor": "end" });
    const bar = (this.barras = grupo(s));
    this.luz = CANDIDATAS.map((c, i) => {
      const y = 78 + i * 40;
      const l = svg("rect", { x: -6, y: y, width: 470, height: 34, rx: 6, class: "a1-luz", opacity: 0 }, bar);
      txt(bar, 0, y + 23, c[0], { class: "a1-t1" });
      svg("rect", { x: 110, y: y + 5, width: c[1] * 800, height: 24, rx: 3, class: "a1-barra" }, bar);
      txt(bar, 118 + c[1] * 800, y + 23, `${Math.round(c[1] * 100)}%`, { class: "a1-t2" });
      return l;
    });
    this.resp = grupo(s);
    txt(this.resp, 0, 362, "conversas:", { class: "a1-t2" });
    this.chips = grupo(this.resp);
    // lado do script
    const rec = (this.receita = grupo(s));
    txt(rec, 530, 22, "Habilidade: o script segue uma receita", { class: "a1-cab turq" });
    const passos = ["lê uma linha da transcrição", "separa NOME: fala (sem a moderadora)", "tira acento e maiúscula", "acha os termos da lista, palavra inteira", "soma 1 para a pessoa"];
    this.passosR = passos.map((p, i) => {
      const g = grupo(rec);
      const y = 44 + i * 50;
      svg("rect", { x: 530, y, width: 400, height: 40, rx: 8, class: "a1-zona turq", style: "fill:var(--superficie)" }, g);
      txt(g, 550, y + 27, String(i + 1), { class: "a1-t1", style: "fill:var(--turquesa)" });
      txt(g, 574, y + 27, p, { class: "a1-t2", style: "fill:var(--texto);font-size:16px" });
      return g;
    });
    const volta = grupo(rec);
    svg("path", { d: "M932,264 H962 V64 H938", class: "seta turq grossa", fill: "none" }, volta);
    svg("polygon", { points: "932,64 942,58 942,70", class: "ponta turq" }, volta);
    txt(volta, 984, 164, "nas 916 falas", { class: "a1-t2", "text-anchor": "middle", transform: "rotate(90 984 164)" });
    this.volta = volta;
    const saida = (this.saidaR = grupo(s));
    txt(saida, 530, 362, "Diego:", { class: "a1-t2" });
    [0, 1, 2].forEach((i) => this.chip(saida, 600 + i * 62, "5", "fixa"));
    txt(saida, 800, 362, "toda vez", { class: "a1-t2" });

    // botão de sortear
    const c = html("div", "ctrl a1-ctrl", caixa);
    const b = html("button", "", c, "sortear de novo");
    html("span", "nota", c, "o modelo sorteia; a chance de cada palavra é ilustrativa");
    this.ctrl = c;
    this.rng = gerador(7);
    this.extra = [];
    b.addEventListener("click", () => {
      let u = this.rng.u(), i = 0;
      while (i < CANDIDATAS.length - 1 && u > CANDIDATAS[i][1]) u -= CANDIDATAS[i++][1];
      this.extra.push(CANDIDATAS[i][0]);
      this.desenhaChips(true, i);
    });
  },
  chip(pai, x, t, cls) {
    const g = svg("g", { class: "a1-chip " + cls }, pai);
    const w = Math.max(52, t.length * 13 + 22);
    svg("rect", { x, y: 334, width: w, height: 38, rx: 7 }, g);
    txt(g, x + w / 2, 362, t, {});
    return w;
  },
  desenhaChips(anim, acende) {
    this.chips.innerHTML = "";
    // só os últimos que cabem até x = 470
    const larg = (t) => Math.max(52, t.length * 13 + 22) + 10;
    const lista = this.base.concat(this.extra), todos = [];
    let soma = 0;
    for (let i = lista.length - 1; i >= 0 && soma + larg(lista[i]) <= 372; i--) { soma += larg(lista[i]); todos.unshift(lista[i]); }
    let x = 98;
    todos.forEach((t, i) => {
      const w = this.chip(this.chips, x, t, "varia");
      if (anim && i === todos.length - 1) gsap.from(this.chips.lastChild, { opacity: 0, y: -12, duration: 0.35 });
      x += w + 10;
    });
    this.luz.forEach((l, i) => gsap.to(l, { opacity: i === acende ? 1 : 0, duration: anim ? 0.3 : 0 }));
  },
  passo(k, anim) {
    parar(this);
    const novo = anim && k > (this.k0 || 0);
    mostra(this.barras, k >= 1, anim);
    mostra(this.resp, k >= 2, anim);
    mostra(this.ctrl, k >= 2, anim);
    if (k < 2) this.extra = [];
    this.base = k >= 2 ? ["13", "12", "25"] : [];
    if (k === 2 && novo) {
      // três sorteios em sequência
      this.base = [];
      this.desenhaChips(false, -1);
      const seq = [0, 1, 3];
      const tl = gsap.timeline();
      seq.forEach((ci, j) => tl.call(() => { this.base = ["13", "12", "25"].slice(0, j + 1); this.desenhaChips(true, ci); }, null, 0.3 + j * 0.8));
      this._tl.push(tl);
    } else this.desenhaChips(false, -1);
    mostra(this.receita, k >= 3, anim);
    if (k >= 3) this.passosR.forEach((g, i) => mostra(g, true, anim, novo && k === 3 ? 0.15 * i : 0));
    else this.passosR.forEach((g) => mostra(g, false, false));
    mostra(this.volta, k >= 3, anim, novo && k === 3 ? 0.8 : 0);
    mostra(this.saidaR, k >= 4, anim);
    this.k0 = k;
  },
});

/* ========================================================================== */
/* 4. Seis conversas: o Chat espalha, a habilidade empilha                    */
/* ========================================================================== */
const CHAT = [157, 161, 210];
Motor.cena("a1-seis", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 900, 350));
    const sx = (this.sx = escala(100, 240, 230, 880));
    const ex = grupo(s);
    eixoX(ex, sx, 100, 240, 292, 7, "total de menções a preço", { grade: 70 });
    txt(s, 0, 124, "Chat", { class: "a1-cab" });
    txt(s, 0, 148, "só o modelo", { class: "a1-t2" });
    txt(s, 0, 234, "Habilidade", { class: "a1-cab" });
    txt(s, 0, 258, "com script", { class: "a1-t2" });
    this.yc = 130; this.yh = 250;
    this.sim = grupo(s);
    this.simH = grupo(s);
    this.chat = CHAT.map((v) => {
      const g = grupo(s);
      svg("circle", { cx: sx(v), cy: this.yc, r: 12, class: "a1-ponto chat" }, g);
      // 157 e 161 ficam quase no mesmo lugar: um rótulo em cima, o outro embaixo
      const dy = v === 157 ? 36 : -22;
      txt(g, sx(v), this.yc + dy, String(v), { class: "anot", "text-anchor": "middle" });
      return g;
    });
    this.hab = [0, 1, 2].map((i) => svg("circle", { cx: sx(122), cy: this.yh - i * 24, r: 12, class: "a1-ponto hab" }, s));
    this.habRot = txt(s, sx(122) + 22, this.yh - 18, "122, 122, 122", { class: "anot" });
    this.habN = txt(s, sx(122), this.yh - 80, "", { class: "anot", "text-anchor": "middle" });
    const br = (this.chaves = grupo(s));
    svg("path", { d: `M${sx(157)},${86} V78 H${sx(210)} V86`, class: "guia", fill: "none" }, br);
    txt(br, (sx(157) + sx(210)) / 2, 68, "53 de diferença", { class: "anot marca", "text-anchor": "middle" });
    txt(br, sx(122) + 22, this.yh + 8, "diferença zero", { class: "anot marca" });
    // controles
    const c = html("div", "ctrl a1-ctrl", caixa);
    const b1 = html("button", "", c, "+ 1 conversa");
    const b10 = html("button", "", c, "+ 10 conversas");
    const b0 = html("button", "", c, "limpar");
    this.cont = html("span", "nota", c, "");
    this.ctrl = c;
    this.rng = gerador(11);
    this.n = 0;
    const add = (q) => { for (let i = 0; i < q; i++) this.mais(true); this.contar(); };
    b1.addEventListener("click", () => add(1));
    b10.addEventListener("click", () => add(10));
    b0.addEventListener("click", () => this.limpa());
  },
  mais(anim) {
    const r = this.rng;
    const v = Math.max(104, Math.min(236, Math.round(176 + 24 * r.normal())));
    const y = this.yc + (r.u() - 0.5) * 44;
    const c = svg("circle", { cx: this.sx(v), cy: y, r: 10, class: "a1-ponto chat sim" }, this.sim);
    if (anim) gsap.from(c, { attr: { cy: 70 }, opacity: 0, duration: 0.5, ease: "bounce.out" });
    this.n++;
  },
  contar() {
    this.cont.textContent = this.n ? `${this.n} conversas simuladas em cada; a habilidade deu 122 em todas` : "conversas simuladas, só para ilustrar";
    this.habN.textContent = this.n ? `+${this.n} vezes 122` : "";
  },
  limpa() { this.sim.innerHTML = ""; this.n = 0; this.contar(); },
  passo(k, anim) {
    const novo = anim && k > (this.k0 || 0);
    this.chat.forEach((g, i) => {
      mostra(g, k >= 1, anim, novo && k === 1 ? i * 0.35 : 0);
    });
    this.hab.forEach((c, i) => mostra(c, k >= 2, anim, novo && k === 2 ? i * 0.35 : 0));
    mostra(this.habRot, k >= 2, anim, novo && k === 2 ? 1 : 0);
    mostra(this.ctrl, k >= 3, anim);
    if (k < 3) this.limpa();
    mostra(this.sim, k >= 3, anim);
    mostra(this.habN, k >= 3, anim);
    mostra(this.chaves, k >= 4, anim);
    this.k0 = k;
  },
});

/* ========================================================================== */
/* 5. A habilidade divide o trabalho: instrução julga, script conta           */
/* ========================================================================== */
Motor.cena("a1-fluxo", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 340));
    const P = DADOS.preco.pessoas;
    this.a = grupo(s);
    bloco(this.a, 0, 10, 160, 74, "", "pedido", "“quem fala de preço?”");
    seta(this.a, 162, 47, 196, 47, "grossa");
    bloco(this.a, 200, 10, 190, 74, "roxo", "modelo lê", "SKILL.md", { mono2: true });
    this.b = grupo(s);
    seta(this.b, 392, 47, 426, 47, "grossa");
    bloco(this.b, 430, 10, 210, 74, "turq", "contar_termos.py", "916 falas", { mono1: true });
    seta(this.b, 642, 47, 676, 47, "grossa");
    bloco(this.b, 680, 10, 130, 74, "turq", "tabela", "+ trechos");
    this.c = grupo(s);
    seta(this.c, 812, 47, 846, 47, "grossa");
    bloco(this.c, 850, 10, 150, 74, "roxo", "modelo", "interpreta");
    // barras por pessoa
    const x0 = 110, esc = 9.6;
    this.barras = [];
    this.tab = grupo(s);
    P.forEach(([nome, n], i) => {
      const y = 112 + i * 27;
      txt(this.tab, x0 - 10, y + 18, nome, { class: "a1-t2", "text-anchor": "end", style: "fill:var(--texto)" });
      const r = svg("rect", { x: x0, y: y + 3, width: n * esc, height: 21, rx: 3, class: "a1-barra turq" }, this.tab);
      const t = txt(this.tab, x0 + n * esc + 8, y + 19, String(n), { class: "a1-t2" });
      this.barras.push([r, t, n]);
      if (nome === "Marcos") this.yM = y;
    });
    this.total = txt(this.tab, x0 + 50 * esc + 70, 130, `total: ${DADOS.preco.total}`, { class: "a1-cab turq" });
    // falso positivo
    const fp = (this.fp = grupo(s));
    const xm = x0 + 11 * esc;
    svg("rect", { x: xm, y: this.yM + 3, width: esc, height: 21, class: "a1-barra marca" }, fp);
    seta(fp, 590, this.yM + 14, xm + esc + 30, this.yM + 14, "marca grossa");
    txt(fp, 600, this.yM + 4, "“Gritando, filmando na cara.”", { class: "anot" });
    txt(fp, 600, this.yM + 28, "não é preço: o modelo aponta", { class: "anot marca" });
  },
  passo(k, anim) {
    const novo = anim && k > (this.k0 || 0);
    mostra(this.a, k >= 1, anim);
    mostra(this.b, k >= 2, anim);
    mostra(this.tab, k >= 2, anim);
    this.barras.forEach(([r, t, n], i) => {
      if (novo && k === 2) gsap.fromTo(r, { attr: { width: 0 } }, { attr: { width: n * 9.6 }, duration: 0.6, delay: 0.25 + i * 0.07 });
    });
    mostra(this.c, k >= 3, anim);
    mostra(this.fp, k >= 3, anim, 0.25);
    this.k0 = k;
  },
});

/* ========================================================================== */
/* 6. Uma linha da planilha vira quatro consultas                            */
/* ========================================================================== */
const CONSULTAS = [
  ["CNPJ", "12.337.454/0001-31", "/api/cnpj/v1", "Receita Federal", "\"BAIXADA\"", "encerrada em jan/2023"],
  ["CEP", "30140-071", "/api/cep/v2", "Correios", "city: Belo Horizonte", "Receita: Sete Lagoas"],
  ["DDD do telefone", "11", "/api/ddd/v1", "Anatel", "state: SP", "agência no RS"],
  ["ano", "2027", "/api/feriados/v1", "calendário nacional", "27/05 Corpus Christi", "quinta: emenda"],
];
Motor.cena("a1-consultas", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 350));
    const Y = (i) => 6 + i * 86, H = 70;
    txt(s, 0, 0, "", {});
    svg("rect", { x: 300, y: 6, width: 150, height: 3 * 86 + H, rx: 14, class: "a1-zona marca", style: "fill:var(--superficie)" }, s);
    txt(s, 375, 170, "plugin", { class: "a1-t2", "text-anchor": "middle" });
    txt(s, 375, 196, "brasilapi", { class: "a1-cab marca a1-mono", "text-anchor": "middle" });
    this.linhas = CONSULTAS.map((c, i) => {
      const y = Y(i);
      const g0 = bloco(s, 0, y, 240, H, "", c[0], c[1], { esq: true, mono2: true });
      g0.querySelector(".a1-t1").setAttribute("class", "a1-t2");
      g0.querySelector(".a1-t2.a1-mono").setAttribute("style", "fill:var(--texto);font-size:18px");
      const g = grupo(s);
      seta(g, 242, y + H / 2, 296, y + H / 2, "grossa");
      seta(g, 452, y + H / 2, 516, y + H / 2, "grossa");
      bloco(g, 520, y, 220, H, "", c[2], c[3], { mono1: true });
      g.lastChild.querySelector(".a1-t1").style.fontSize = "16px";
      const r = grupo(s);
      seta(r, 742, y + H / 2, 766, y + H / 2, "marca grossa");
      bloco(r, 770, y, 230, H, "marca", c[4], c[5], { mono1: true });
      r.lastChild.querySelector(".a1-t1").style.fontSize = "15px";
      r.lastChild.querySelector(".a1-t2").setAttribute("style", "fill:var(--marca);font-weight:700;font-size:16px");
      return { g, r, y: y + H / 2 };
    });
  },
  passo(k, anim) {
    parar(this);
    const novo = anim && k > (this.k0 || 0);
    this.linhas.forEach((l, i) => {
      const on = k >= i + 1;
      mostra(l.g, on, anim);
      if (novo && k === i + 1) {
        mostra(l.r, false, false);
        const tl = viagem(this.raiz, [[240, l.y], [375, l.y], [520, l.y]], { dur: 0.35, fim: () => {} });
        const tl2 = viagem(this.raiz, [[740, l.y], [770, l.y]], { atraso: 0.8, dur: 0.2 });
        this._tl.push(tl, tl2);
        mostra(l.r, true, true, 1.0);
      } else mostra(l.r, on, anim);
    });
    this.k0 = k;
  },
});

/* ========================================================================== */
/* 7. Antes de escolher uma API, teste: três chamadas para cada endereço      */
/* ========================================================================== */
const TESTES = [
  ["cnpj", "empresa na Receita", "ok", "respondeu sempre"],
  ["cep", "endereço do CEP", "ok", "respondeu sempre"],
  ["ddd", "estado do DDD", "ok", "respondeu sempre"],
  ["feriados", "feriados nacionais", "ok", "respondeu sempre"],
  ["cptec/…/previsao", "previsão do tempo", "ok", "respondeu sempre"],
  ["fipe/preco", "preço de veículo", "erro", "erro 500, há dois dias"],
  ["cptec/…/aeroporto", "tempo num aeroporto", "aviso", "200, tudo “undefined”"],
];
Motor.cena("a1-semaforo", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 330));
    const cab = { class: "rotulo-eixo forte" };
    txt(s, 0, 20, "endereço", cab);
    txt(s, 270, 20, "o que devolve", cab);
    txt(s, 650, 20, "três chamadas", Object.assign({ "text-anchor": "middle" }, cab));
    txt(s, 750, 20, "como estava", cab);
    this.linhas = TESTES.map((t, i) => {
      const y = 56 + i * 40;
      const luz = svg("rect", { x: -6, y: y - 20, width: 1006, height: 38, rx: 6, class: "a1-luz", opacity: 0 }, s);
      txt(s, 0, y + 6, t[0], { class: "a1-t1 a1-mono", style: "font-size:17px;font-weight:500" });
      txt(s, 270, y + 6, t[1], { class: "a1-t2" });
      const sinais = [600, 650, 700].map((x) => sinal(s, x, y, 15, "espera", ""));
      const res = txt(s, 750, y + 6, t[3], { class: "a1-t2", style: "fill:var(--texto)" });
      return { t, sinais, res, luz };
    });
  },
  passo(k, anim) {
    const novo = anim && k > (this.k0 || 0);
    this.linhas.forEach((l, i) => {
      const grp = i < 5 ? 1 : 2;
      const on = k >= grp;
      l.sinais.forEach((g, j) => {
        const tipo = l.t[2], simb = tipo === "ok" ? "✓" : tipo === "erro" ? "✗" : "?";
        const d = novo && k === grp ? (i % 5) * 0.12 + j * 0.18 : 0;
        if (on) gsap.delayedCall(anim ? d : 0, () => setTipo(g, tipo, simb));
        else setTipo(g, "espera", "");
      });
      mostra(l.res, on, anim, novo && k === grp ? 0.6 : 0);
      gsap.to(l.luz, { opacity: k >= 3 && i === 6 ? 1 : 0, duration: anim ? 0.4 : 0 });
    });
    this.k0 = k;
  },
});

/* ========================================================================== */
/* 8. Da nuvem, uma resposta em quatro; do desktop, todas                     */
/* ========================================================================== */
Motor.cena("a1-nuvem-api", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 760, 400));
    bloco(s, 0, 20, 240, 80, "", "computador na nuvem", "Work no navegador");
    bloco(s, 0, 250, 240, 80, "marca", "seu computador", "aplicativo de desktop");
    // proteção e API
    svg("line", { x1: 480, x2: 480, y1: 30, y2: 330, class: "a1-zona cheia", style: "stroke-width:6;stroke:var(--laranja)" }, s);
    txt(s, 480, 18, "proteção contra robôs", { class: "a1-t2", "text-anchor": "middle", style: "fill:var(--laranja);font-weight:700" });
    bloco(s, 560, 135, 200, 80, "turq", "BrasilAPI", "cnpj, cep, ddd…");
    svg("line", { x1: 240, y1: 60, x2: 560, y2: 160, class: "seta tracejada" }, s);
    svg("line", { x1: 240, y1: 290, x2: 560, y2: 192, class: "seta tracejada" }, s);
    this.Pn = [[240, 60], [480, 135], [560, 160]];
    this.Pd = [[240, 290], [480, 216.5], [560, 192]];
    // placar
    const rot = ["403", "200", "tempo", "tempo"], tip = [["erro", "✗"], ["ok", "✓"], ["tempo", "…"], ["tempo", "…"]];
    this.nuvem = rot.map((r, i) => {
      const g = grupo(s);
      sinal(g, 30 + i * 56, 140, 18, tip[i][0], tip[i][1]);
      txt(g, 30 + i * 56, 182, r, { class: "a1-t2", "text-anchor": "middle" });
      return g;
    });
    this.placarN = txt(s, 250, 146, "1 de 4", { class: "a1-cab marca" });
    this.desk = [0, 1, 2].map((i) => {
      const g = grupo(s);
      sinal(g, 30 + i * 56, 370, 18, "ok", "✓");
      return g;
    });
    this.placarD = txt(s, 196, 376, "3 de 3", { class: "a1-cab turq" });
    this.x403 = txt(s, 480, 112, "✗", { class: "a1-x", "text-anchor": "middle" });
  },
  passo(k, anim) {
    parar(this);
    const novo = anim && k > (this.k0 || 0);
    const Pn = this.Pn, Pd = this.Pd;
    const quando = (i) => (novo && k === i ? 1 : 0);
    // tentativa 1: barrada na proteção
    if (novo && k === 1) this._tl.push(viagem(this.raiz, [Pn[0], Pn[1]], { dur: 0.7, some: true }));
    mostra(this.x403, k === 1, anim, quando(1) * 0.7);
    mostra(this.nuvem[0], k >= 1, anim, quando(1) * 0.8);
    // tentativa 2: passa e volta
    if (novo && k === 2) this._tl.push(viagem(this.raiz, [Pn[0], Pn[1], Pn[2], Pn[1], Pn[0]], { dur: 0.35, cls: "turq" }));
    mostra(this.nuvem[1], k >= 2, anim, quando(2) * 1.4);
    // tentativas 3 e 4: somem no caminho
    if (novo && k === 3) {
      this._tl.push(viagem(this.raiz, [Pn[0], [400, 110]], { dur: 0.9, some: true }));
      this._tl.push(viagem(this.raiz, [Pn[0], [400, 110]], { dur: 0.9, some: true, atraso: 0.4 }));
    }
    mostra(this.nuvem[2], k >= 3, anim, quando(3) * 1.2);
    mostra(this.nuvem[3], k >= 3, anim, quando(3) * 1.6);
    mostra(this.placarN, k >= 3, anim, quando(3) * 1.8);
    // desktop: três de três
    if (novo && k === 4) [0, 1, 2].forEach((i) => this._tl.push(viagem(this.raiz, [Pd[0], Pd[1], Pd[2], Pd[1], Pd[0]], { dur: 0.3, cls: "turq", atraso: i * 0.35 })));
    this.desk.forEach((g, i) => mostra(g, k >= 4, anim, quando(4) * (1.2 + i * 0.35)));
    mostra(this.placarD, k >= 4, anim, quando(4) * 2.1);
    this.k0 = k;
  },
});

/* ========================================================================== */
/* 9. Triagem: oito das vinte agências não entram como estão                  */
/* ========================================================================== */
const MOTIVO = { baixada: [1, "baixada"], atividade: [2, "não é agência"], cadastro: [3, "cadastro velho"], digitacao: [4, "digitação"] };
Motor.cena("a1-triagem", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 700, 470));
    this.placar = txt(s, 0, 24, "", { class: "a1-cab" });
    const L = DADOS.agencias.lista;
    this.cartoes = L.map((a, i) => {
      const x = (i % 4) * 176, y = 44 + Math.floor(i / 4) * 85;
      const g = svg("g", { class: "a1-cartao" }, s);
      svg("rect", { x, y, width: 166, height: 76, rx: 9 }, g);
      const ls = quebra(a.nome);
      ls.forEach((l, j) => txt(g, x + 10, y + 22 + j * 18, l, { class: "a1-nome" }));
      const v = txt(g, x + 10, y + 66, a.vendas ? `R$ ${mi(a.vendas)} mi` : "R$ 0", { class: "a1-venda" });
      const m = a.motivo ? txt(g, x + 10, y + 66, MOTIVO[a.motivo][1], { class: "a1-motivo" }) : null;
      return { g, v, m, a };
    });
  },
  passo(k, anim) {
    let fora = 0;
    this.cartoes.forEach((c) => {
      const p = c.a.motivo ? MOTIVO[c.a.motivo][0] : 99;
      const sai = k >= p;
      if (sai) fora++;
      c.g.setAttribute("class", "a1-cartao" + (sai ? ` fora ${c.a.motivo}` : ""));
      mostra(c.v, !sai, anim);
      if (c.m) mostra(c.m, sai, anim);
      if (anim && k === p) gsap.fromTo(c.g, { x: 0 }, { x: 0, keyframes: [{ x: -6 }, { x: 6 }, { x: -3 }, { x: 0 }], duration: 0.4 });
    });
    this.placar.textContent = `${20 - fora} de 20 entram como estão`;
  },
});

/* ========================================================================== */
/* 10. Grafo de agências: telefone e endereço juntam grupos                   */
/* ========================================================================== */
const POS = { A01: [150, 92], A02: [360, 92], A03: [500, 92], A04: [210, 245], A05: [420, 245], A06: [420, 350], A07: [210, 350], A10: [60, 298] };
Motor.cena("a1-grafo", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 420));
    const L = Object.fromEntries(DADOS.agencias.lista.map((a) => [a.id, a]));
    const R = (id) => 9 + 15 * Math.sqrt(L[id].vendas / 4.25);
    this.R = R;
    // cascos dos grupos (passo 3)
    this.cascos = grupo(s);
    svg("rect", { x: 92, y: 40, width: 326, height: 104, rx: 40, class: "a1-casco" }, this.cascos);
    svg("rect", { x: 10, y: 196, width: 480, height: 222, rx: 40, class: "a1-casco" }, this.cascos);
    txt(this.cascos, 255, 32, `grupo: R$ ${mi(DADOS.agencias.soma_grupo["A01+A02"])} mi`, { class: "anot marca", "text-anchor": "middle" });
    txt(this.cascos, 250, 190, `grupo: R$ ${mi(DADOS.agencias.soma_grupo["A04+A05+A06+A07+A10"])} mi`, { class: "anot marca", "text-anchor": "middle" });
    // arestas
    this.tel = grupo(s); this.end = grupo(s);
    for (const [a, b, tipo] of DADOS.agencias.arestas) {
      const [x1, y1] = POS[a], [x2, y2] = POS[b];
      const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy), off = tipo === "telefone" ? -5 : 5;
      const ox = (-dy / n) * off, oy = (dx / n) * off;
      svg("line", { x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy, class: "a1-aresta " + tipo }, tipo === "telefone" ? this.tel : this.end);
    }
    // nós
    for (const id in POS) {
      const [x, y] = POS[id], a = L[id];
      const g = svg("g", { class: "a1-no" + (a.motivo ? " fora" : "") }, s);
      svg("circle", { cx: x, cy: y, r: R(id) }, g);
      const acima = id === "A04" || id === "A05";
      txt(g, x, acima ? y - R(id) - 9 : y + R(id) + 19, a.nome, { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    }
    // a linha repetida da Decolar (passo 4)
    this.dup = svg("g", { class: "a1-no fantasma" }, s);
    svg("circle", { cx: 500, cy: 92, r: R("A03") + 8 }, this.dup);
    txt(this.dup, 500, 38, "2 linhas, 1 CNPJ", { class: "anot marca", "text-anchor": "middle" });
    // legenda das arestas
    const lg = grupo(s);
    svg("line", { x1: 560, x2: 600, y1: 400, y2: 400, class: "a1-aresta telefone" }, lg);
    txt(lg, 608, 406, "mesmo telefone", { class: "a1-t2" });
    svg("line", { x1: 760, x2: 800, y1: 400, y2: 400, class: "a1-aresta endereco" }, lg);
    txt(lg, 808, 406, "mesmo endereço", { class: "a1-t2" });
    this.lgTel = lg.children[0]; this.lgTelT = lg.children[1];
    this.lgEnd = lg.children[2]; this.lgEndT = lg.children[3];
    // ranking
    txt(s, 600, 24, "maiores vendas, R$ milhões", { class: "a1-cab" });
    this.esc = 40;
    this.barras = [0, 1, 2, 3].map((i) => {
      const y = 46 + i * 80;
      const nome = txt(s, 600, y + 20, "", { class: "a1-t1", style: "font-size:17px" });
      const fant = svg("rect", { x: 600, y: y + 30, width: 0, height: 26, rx: 3, class: "a1-barra fantasma" }, s);
      const r = svg("rect", { x: 600, y: y + 30, width: 0, height: 26, rx: 3, class: "a1-barra" }, s);
      const v = txt(s, 608, y + 50, "", { class: "a1-t2", style: "fill:var(--texto);font-weight:700" });
      const fv = txt(s, 608, y + 50, "", { class: "a1-t2", style: "fill:var(--marca);font-weight:700" });
      return { nome, r, v, fant, fv, y };
    });
  },
  passo(k, anim) {
    const d = anim ? 0.6 : 0;
    mostra(this.tel, k >= 1, anim); mostra(this.lgTel, k >= 1, anim); mostra(this.lgTelT, k >= 1, anim);
    mostra(this.end, k >= 2, anim); mostra(this.lgEnd, k >= 2, anim); mostra(this.lgEndT, k >= 2, anim);
    mostra(this.cascos, k >= 3, anim);
    mostra(this.dup, k >= 4, anim);
    const A = DADOS.agencias, L = Object.fromEntries(A.lista.map((a) => [a.id, a]));
    const rank = k >= 3
      ? [["CVC + Rextur", A.soma_grupo["A01+A02"]], ["grupo Flytour (5 CNPJs)", A.soma_grupo["A04+A05+A06+A07+A10"]], ["Decolar", L.A03.vendas], ["123milhas", L.A11.vendas]]
      : [["CVC", L.A01.vendas], ["Decolar", L.A03.vendas], ["Flytour Consolidadora", L.A04.vendas], ["123milhas", L.A11.vendas]];
    this.barras.forEach((b, i) => {
      const [n, v] = rank[i];
      b.nome.textContent = n;
      gsap.to(b.r, { attr: { width: v * this.esc }, duration: d, ease: "power2.out" });
      b.r.setAttribute("class", "a1-barra" + (k >= 3 && i < 2 ? " marca" : ""));
      b.v.textContent = mi(v);
      gsap.to(b.v, { attr: { x: 608 + v * this.esc }, duration: d, ease: "power2.out" });
      const dup = k >= 4 && n === "Decolar";
      gsap.to(b.fant, { attr: { width: dup ? 2 * v * this.esc : 0 }, duration: d });
      b.fv.textContent = mi(2 * v);
      b.fv.setAttribute("x", 608 + 2 * v * this.esc);
      mostra(b.fv, dup, anim, dup ? 0.4 : 0);
    });
  },
});

/* ========================================================================== */
/* 11. O tema dos dois dias: companhias aéreas, imagem, reclamações, fontes   */
/* ========================================================================== */
const CIAS = [
  { nome: "LATAM", cor: "var(--marca)" },
  { nome: "Gol", cor: "var(--laranja)" },
  { nome: "Azul", cor: "#2F6FE4" },
  { nome: "TAP", cor: "var(--turquesa)" },
];
/* notas da App Store (página e média das 500 mais recentes com texto), 3/11/2026 */
const NOTAS_APP = { LATAM: [4.85, 3.12], Gol: [4.69, 2.31], Azul: [4.89, 3.53], TAP: [3.25, 1.76] };
const AVIAO = "M14,0 L9,-1.6 L3,-1.6 L-2,-8 L-5,-8 L-2,-1.6 L-8,-1.6 L-10.5,-4.5 L-13,-4.5 L-11.5,0 L-13,4.5 L-10.5,4.5 L-8,1.6 L-2,1.6 L-5,8 L-2,8 L3,1.6 L9,1.6 Z";
const CSS_TEMA = `
.a1 .a1-rota { fill: none; stroke-width: 2.5; stroke-dasharray: 3 9; stroke-linecap: round; opacity: .55; }
.a1 .a1-aviao { stroke: var(--fundo); stroke-width: 1; }
.a1 .a1-cia { font-size: 21px; font-weight: 800; }
.a1 .a1-bolha rect { fill: var(--superficie); stroke-width: 3; }
.a1 .a1-bolha text { fill: var(--texto); font-size: 17px; }
.a1 .a1-bolha .a1-quem { font-size: 15px; font-weight: 800; }
.a1 .a1-halter { stroke-width: 5; stroke-linecap: round; opacity: .45; }
.a1 .a1-pag { fill: var(--fundo); stroke-width: 3.5; }
.a1 .a1-txt { stroke: var(--fundo); stroke-width: 2; }
.a1 .a1-val { font-size: 17px; font-weight: 750; }
.a1 .a1-base rect { fill: color-mix(in srgb, var(--marca) 12%, var(--superficie)); stroke: var(--marca); stroke-width: 3; }
`;
const st2 = document.createElement("style");
st2.textContent = CSS_TEMA;
document.head.appendChild(st2);

Motor.cena("a1-tema", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 450));
    // faixa de cima: quatro rotas, quatro aviões
    this.rotas = CIAS.map((c, i) => {
      const y = 36 + i * 34;
      txt(s, 20, y + 7, c.nome, { class: "a1-cia", style: `fill:${c.cor}` });
      const d = `M120,${y + 14} C 360,${y - 40 - i * 6} 640,${y + 40 + i * 6} 980,${y - 4}`;
      const p = svg("path", { d, class: "a1-rota", style: `stroke:${c.cor}` }, s);
      const a = svg("path", { d: AVIAO, class: "a1-aviao", style: `fill:${c.cor}`, transform: "scale(1.5)" }, s);
      return { p, a, i };
    });
    // 0. as quatro companhias
    const FATOS = [["a maior do país", "o aplicativo mais baixado"], ["hub em Congonhas", "o aeroporto mais disputado"],
                   ["hub em Campinas", "a frota mais variada"], ["Brasil-Portugal", "muita conexão em Lisboa"]];
    this.cias = grupo(s);
    CIAS.forEach((c, i) => {
      const x = 20 + i * 245, g = grupo(this.cias);
      svg("rect", { x, y: 200, width: 225, height: 190, rx: 18, style: `fill:var(--superficie);stroke:${c.cor};stroke-width:3` }, g);
      svg("path", { d: AVIAO, transform: `translate(${x + 112},${250}) rotate(-30) scale(2.4)`, style: `fill:${c.cor}` }, g);
      txt(g, x + 112, 320, c.nome, { class: "a1-cia", "text-anchor": "middle", style: `fill:${c.cor};font-size:30px` });
      txt(g, x + 112, 350, FATOS[i][0], { class: "a1-t2", "text-anchor": "middle", style: "font-size:17px;fill:var(--texto)" });
      txt(g, x + 112, 374, FATOS[i][1], { class: "a1-t2", "text-anchor": "middle", style: "font-size:16px" });
    });
    // 1. a imagem: nota da página x nota das 500 com texto
    const im = (this.imagem = grupo(s));
    const sx = escala(1, 5, 300, 900);
    this.sx = sx;
    for (let v = 1; v <= 5; v++) {
      svg("line", { x1: sx(v), x2: sx(v), y1: 186, y2: 412, class: "regua" }, im);
      txt(im, sx(v), 436, `${v} ★`, { class: "rotulo-eixo", "text-anchor": "middle" });
    }
    txt(im, 20, 200, "App Store", { class: "a1-cab" });
    txt(im, 20, 224, "nota de 1 a 5", { class: "a1-t2" });
    const lg = grupo(im);
    svg("circle", { cx: 34, cy: 268, r: 9, class: "a1-pag", style: "stroke:var(--texto-fraco)" }, lg);
    txt(lg, 52, 274, "na página", { class: "a1-t2" });
    svg("circle", { cx: 34, cy: 300, r: 9, style: "fill:var(--texto-fraco)" }, lg);
    txt(lg, 52, 306, "nas 500 com texto", { class: "a1-t2" });
    this.halteres = CIAS.map((c, i) => {
      const y = 214 + i * 56, [pg, tx] = NOTAS_APP[c.nome];
      const g = grupo(im);
      txt(g, 286, y + 6, c.nome, { class: "a1-t1", "text-anchor": "end", style: `fill:${c.cor}` });
      const ln = svg("line", { x1: sx(pg), x2: sx(pg), y1: y, y2: y, class: "a1-halter", style: `stroke:${c.cor}` }, g);
      svg("circle", { cx: sx(pg), cy: y, r: 11, class: "a1-pag", style: `stroke:${c.cor}` }, g);
      txt(g, sx(pg) + 18, y + 6, num(pg, 1), { class: "a1-val", style: `fill:${c.cor}` });
      const dt = svg("circle", { cx: sx(pg), cy: y, r: 11, class: "a1-txt", style: `fill:${c.cor}` }, g);
      const vt = txt(g, sx(tx) - 18, y + 6, num(tx, 1), { class: "a1-val", "text-anchor": "end", style: `fill:${c.cor}` });
      return { ln, dt, vt, pg, tx };
    });
    // 2. as reclamações
    const BOLHAS = [
      ["Gol", "o voo atrasou três horas e ninguém explicou nada", 10, 186],
      ["TAP", "o aplicativo não deixa fazer o check-in", 510, 186],
      ["Azul", "cancelaram o voo na véspera, por manutenção", 10, 270],
      ["TAP", "perdi a conexão em Lisboa, e a mala ficou lá", 510, 270],
      ["LATAM", "o preço subiu no meio da compra", 10, 354],
      ["Gol", "nenhuma assistência no aeroporto", 510, 354],
    ];
    this.rec = grupo(s);
    this.bolhas = BOLHAS.map(([cia, t, x, y]) => {
      const cor = CIAS.find((c) => c.nome === cia).cor;
      const g = svg("g", { class: "a1-bolha" }, this.rec);
      const w = 36 + (t.length + 2) * 9.1;
      svg("rect", { x, y, width: w, height: 62, rx: 18, style: `stroke:${cor}` }, g);
      svg("path", { d: `M${x + 30},${y + 62} l-6,16 l20,-16 z`, style: `fill:var(--superficie);stroke:${cor};stroke-width:3;stroke-linejoin:round` }, g);
      svg("line", { x1: x + 26, x2: x + 42, y1: y + 61, y2: y + 61, style: "stroke:var(--superficie);stroke-width:5" }, g);
      txt(g, x + 16, y + 24, cia, { class: "a1-quem", style: `fill:${cor}` });
      txt(g, x + 16, y + 48, `"${t}"`, {});
      g.style.transformOrigin = `${x + 30}px ${y + 70}px`;
      g.style.transformBox = "view-box";
      return g;
    });
    txt(this.rec, 990, 446, "frases resumidas, no tom das avaliações e das sentenças", { class: "a1-t2", "text-anchor": "end" });
    // 3. as fontes de hoje viram uma base
    const fo = (this.fontes = grupo(s));
    const F = [["grupo focal", "exercício 1"], ["agências do CRM e BrasilAPI", "exercício 2"], ["App Store e TJSP", "exercício 3"], ["8.000 voos simulados", "à tarde"]];
    this.fontesG = F.map(([a, b], i) => {
      const y = 190 + i * 64, g = grupo(fo);
      bloco(g, 40, y, 360, 52, i === 3 ? "roxo" : "turq", a, null, { esq: true });
      txt(g, 390, y + 32, b, { class: "a1-t2", "text-anchor": "end" });
      seta(g, 406, y + 26, 600, 318, i === 3 ? "roxo grossa" : "turq grossa");
      return g;
    });
    const base = (this.base = svg("g", { class: "a1-base" }, fo));
    svg("rect", { x: 610, y: 250, width: 360, height: 136, rx: 18 }, base);
    txt(base, 790, 306, "uma base de dados", { class: "a1-cab", "text-anchor": "middle", style: "font-size:26px" });
    txt(base, 790, 342, "o que irrita o passageiro,", { class: "a1-t2", "text-anchor": "middle", style: "font-size:17px" });
    txt(base, 790, 366, "companhia por companhia", { class: "a1-t2", "text-anchor": "middle", style: "font-size:17px" });
  },
  entrou() {
    // os aviões voam sem parar enquanto o slide está aberto
    (this._voo || []).forEach((t) => t.kill());
    this._voo = this.rotas.map(({ p, a, i }) => {
      const L = p.getTotalLength(), o = { t: 0 };
      const pos = () => {
        const q = p.getPointAtLength(o.t * L), r = p.getPointAtLength(Math.min(L, o.t * L + 2));
        const ang = (Math.atan2(r.y - q.y, r.x - q.x) * 180) / Math.PI;
        a.setAttribute("transform", `translate(${q.x},${q.y}) rotate(${ang}) scale(1.5)`);
      };
      pos();
      return gsap.to(o, { t: 1, duration: 6 + i * 1.3, delay: i * 0.7, ease: "power1.inOut", repeat: -1, repeatDelay: 0.6, onUpdate: pos });
    });
  },
  passo(k, anim) {
    if (!this._voo) this.entrou();
    const d = anim ? 0.8 : 0;
    mostra(this.cias, k === 0, anim);
    mostra(this.imagem, k === 1, anim);
    this.halteres.forEach((h, i) => {
      const x = k >= 1 ? this.sx(h.tx) : this.sx(h.pg);
      gsap.to(h.dt, { attr: { cx: x }, duration: d, delay: anim ? 0.3 + i * 0.15 : 0, ease: "power2.out" });
      gsap.to(h.ln, { attr: { x1: x }, duration: d, delay: anim ? 0.3 + i * 0.15 : 0, ease: "power2.out" });
      mostra(h.vt, k >= 1, anim, 0.9 + i * 0.15);
    });
    mostra(this.rec, k === 2, anim);
    this.bolhas.forEach((b, i) => {
      if (k === 2 && anim) gsap.fromTo(b, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, delay: 0.2 + i * 0.35, ease: "back.out(2)" });
      else gsap.set(b, { scale: 1, autoAlpha: 1 });
    });
    mostra(this.fontes, k === 3, anim);
    this.fontesG.forEach((g, i) => mostra(g, k === 3, anim, 0.15 + i * 0.25));
    mostra(this.base, k === 3, anim, 1.2);
  },
});

/* ========================================================================== */
/* 12. Conversa, habilidade ou plugin, e onde cada exercício cai               */
/* ========================================================================== */
Motor.cena("a1-decisao", {
  montar(caixa) {
    const s = (this.raiz = raiz(caixa, 1000, 420));
    const COL = [[10, "Conversa", "um pedido, uma vez", ""], [380, "Habilidade", "instruções e scripts", "turq"], [750, "Plugin", "habilidades e conexões", "laranja"]];
    this.cols = COL.map(([x, a, b, cls]) => {
      const g = grupo(s);
      svg("rect", { x, y: 20, width: 240, height: 380, rx: 18, class: "a1-zona" + (cls ? " cheia" : ""), style: cls ? `stroke:var(--${cls === "turq" ? "turquesa" : "laranja"});stroke-width:3` : "" }, g);
      txt(g, x + 120, 60, a, { class: "a1-cab", "text-anchor": "middle", style: "font-size:24px" });
      txt(g, x + 120, 86, b, { class: "a1-t2", "text-anchor": "middle" });
      return g;
    });
    // critérios entre as colunas
    const c1 = (this.c1 = grupo(s));
    seta(c1, 262, 150, 372, 150, "turq grossa");
    txt(c1, 317, 118, "vai repetir?", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c1, 317, 186, "a conta", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c1, 317, 204, "tem que", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c1, 317, 222, "dar igual?", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    const c2 = (this.c2 = grupo(s));
    seta(c2, 632, 150, 742, 150, "laranja grossa");
    txt(c2, 687, 118, "outro", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c2, 687, 136, "sistema?", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c2, 687, 186, "vai", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c2, 687, 204, "distribuir", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    txt(c2, 687, 222, "à equipe?", { class: "anot", "text-anchor": "middle", style: "font-size:15px" });
    // fichas dos exercícios
    const ficha = (x, y, rot, sub, cls, fantasma) => {
      const g = svg("g", { class: "a1-chip " + (fantasma ? "varia" : "fixa") }, s);
      svg("rect", { x, y, width: 210, height: 64, rx: 14, style: fantasma ? "" : `stroke:var(--${cls})` }, g);
      txt(g, x + 105, y + 28, rot, { style: "font-family:inherit;font-size:19px;font-weight:750" });
      txt(g, x + 105, y + 50, sub, { style: "font-family:inherit;font-size:15px;fill:var(--texto-fraco)" });
      if (fantasma) g.style.opacity = 0.75;
      return g;
    };
    this.e1 = ficha(395, 120, "Exercício 1", "contar-termos", "turquesa");
    this.e1b = ficha(765, 120, "Exercício 1?", "daria, sem ganho", "", true);
    this.e2 = ficha(765, 210, "Exercício 2", "brasilapi", "laranja");
    this.e2b = ficha(395, 210, "Exercício 2?", "daria: API sem login", "", true);
    this.e3 = ficha(25, 300, "Exercício 3", "comece aqui", "texto");
    this.e3b = ficha(395, 300, "se virar rotina", "avaliacoes-app", "", true);
    this.e3s = grupo(s);
    seta(this.e3s, 237, 332, 389, 332, "tracejada grossa");
  },
  passo(k, anim) {
    mostra(this.c1, k >= 1, anim);
    mostra(this.c2, k >= 2, anim);
    mostra(this.e1, k >= 3, anim); mostra(this.e1b, k >= 3, anim, 0.4);
    mostra(this.e2, k >= 4, anim); mostra(this.e2b, k >= 4, anim, 0.4);
    mostra(this.e3, k >= 5, anim); mostra(this.e3s, k >= 5, anim, 0.3); mostra(this.e3b, k >= 5, anim, 0.5);
  },
});
})();
