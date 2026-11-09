/*
 * Motor de passos dos slides, com GSAP.
 *
 * Um slide animado tem fragmentos vazios no fim (`[]{.fragment .passo}`). O
 * número de passos visíveis, k, é o "estado" do slide. Avançar e voltar com as
 * setas só muda k; o motor redesenha tudo a partir de k. Por isso voltar um
 * slide nunca deixa a animação num estado intermediário.
 *
 * Há dois jeitos de usar k:
 *
 * 1. Declarativo, direto no markdown, sem escrever JS:
 *      data-p="2"      aparece quando k >= 2 (sobe 14px e acende)
 *      data-ate="3"    some quando k >= 3
 *      data-apaga="3"  fica esmaecido quando k >= 3
 *      data-foco="2"   ganha a classe .foco quando k >= 2
 *      data-marca="2"  ganha a classe .marcado quando k >= 2 (grifo)
 *    Dentro de `.legendas`, só o filho de índice k aparece.
 *
 * 2. Cenas em JS, para o que precisa de desenho (SVG, gráficos, simulações):
 *      Motor.cena("id", { montar(caixa, slide) {...}, passo(k, anim) {...} })
 *    e no markdown: `::: {.cena data-cena="id"}` + os fragmentos `.passo`.
 */
(function () {
  "use strict";
  const CENAS = {};
  const DUR = 0.5;

  function k(slide) {
    return [...slide.querySelectorAll(".fragment.passo")].filter((f) => f.classList.contains("visible")).length;
  }

  function declarativo(slide, n, anim) {
    const d = anim ? DUR : 0;
    slide.querySelectorAll("[data-p]").forEach((e) => {
      const on = n >= +e.dataset.p && !(e.dataset.ate && n >= +e.dataset.ate);
      gsap.to(e, { autoAlpha: on ? 1 : 0, y: on ? 0 : 14, duration: d, ease: "power2.out", overwrite: "auto" });
    });
    slide.querySelectorAll("[data-ate]:not([data-p])").forEach((e) => {
      const on = n < +e.dataset.ate;
      gsap.to(e, { autoAlpha: on ? 1 : 0, duration: d, overwrite: "auto" });
    });
    slide.querySelectorAll("[data-apaga]").forEach((e) => {
      gsap.to(e, { opacity: n >= +e.dataset.apaga ? 0.28 : 1, duration: d, overwrite: "auto" });
    });
    slide.querySelectorAll("[data-foco]").forEach((e) => e.classList.toggle("foco", n >= +e.dataset.foco));
    slide.querySelectorAll("[data-marca]").forEach((e) => e.classList.toggle("marcado", n >= +e.dataset.marca));
    slide.querySelectorAll(".legendas").forEach((caixa) => {
      const filhos = [...caixa.children];
      const alvo = Math.min(n, filhos.length - 1);
      filhos.forEach((f, i) =>
        gsap.to(f, i === alvo
          ? { autoAlpha: 1, y: 0, duration: anim ? 0.35 : 0, delay: anim ? 0.08 : 0, overwrite: true }
          : { autoAlpha: 0, y: 6, duration: anim ? 0.15 : 0, overwrite: true }));
    });
  }

  function atualizar(slide, anim) {
    if (!slide) return;
    const n = k(slide);
    declarativo(slide, n, anim);
    for (const c of slide._cenas || []) {
      try { c.passo && c.passo(n, anim); } catch (e) { console.error("[motor]", e); }
    }
    // a cena pode querer saber que o slide entrou (para tocar uma animação contínua)
    if (!anim) for (const c of slide._cenas || []) c.entrou && c.entrou(n);
  }

  let INICIADO = false;
  function montarCaixa(caixa) {
    const def = CENAS[caixa.dataset.cena];
    const slide = caixa.closest("section");
    if (!def || !slide || caixa._montada) { if (!def) console.warn("[motor] cena sem definição:", caixa.dataset.cena); return; }
    caixa._montada = true;
    const inst = Object.create(def);
    try { inst.montar && inst.montar(caixa, slide); } catch (e) { console.error("[motor]", caixa.dataset.cena, e); }
    (slide._cenas = slide._cenas || []).push(inst);
    if (INICIADO) atualizar(slide, false);
  }

  function iniciar() {
    document.querySelectorAll(".cena[data-cena]").forEach(montarCaixa);
    INICIADO = true;
    for (const s of document.querySelectorAll(".reveal .slides section")) atualizar(s, false);
    const R = window.Reveal;
    R.on("fragmentshown", () => atualizar(R.getCurrentSlide(), true));
    R.on("fragmenthidden", () => atualizar(R.getCurrentSlide(), true));
    R.on("slidechanged", (e) => atualizar(e.currentSlide, false));
    atualizar(R.getCurrentSlide(), false);
  }

  function quandoPronto() {
    const R = window.Reveal;
    if (!R || !window.gsap || !R.on) return setTimeout(quandoPronto, 40);
    if (R.isReady && R.isReady()) iniciar(); else R.on("ready", iniciar);
  }

  /* ---------- utilitários para as cenas ---------------------------------- */

  const NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, pai) {
    const n = document.createElementNS(NS, tag);
    for (const a in attrs || {}) n.setAttribute(a, attrs[a]);
    if (pai) pai.appendChild(n);
    return n;
  }
  function txt(pai, x, y, t, attrs) {
    const n = svg("text", Object.assign({ x, y }, attrs || {}), pai);
    n.textContent = t;
    return n;
  }
  function html(tag, cls, pai, texto) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.innerHTML = texto;
    if (pai) pai.appendChild(n);
    return n;
  }
  const escala = (d0, d1, r0, r1) => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
  function gerador(semente) {
    let a = semente >>> 0;
    const u = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const normal = () => {
      let x = 0; while (x === 0) x = u();
      return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * u());
    };
    return { u, normal };
  }
  function num(v, casas = 0) {
    return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }).replace("-", "−");
  }
  function ols(xs, ys) {
    const n = xs.length; let mx = 0, my = 0;
    for (let i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
    mx /= n; my /= n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    const b = sxy / sxx, a = my - b * mx;
    return { a, b, r2: (sxy * sxy) / (sxx * syy) };
  }
  function semTeclas(inp) { inp.addEventListener("keydown", (e) => e.stopPropagation()); }

  /* mostra ou esconde (com animação quando anim) */
  function vis(alvo, on, anim) {
    if (!alvo) return;
    gsap.to(alvo, { autoAlpha: on ? 1 : 0, duration: anim ? DUR : 0, overwrite: "auto" });
  }
  /* marcas "redondas" de um eixo entre a e b */
  function marcas(a, b, n = 5) {
    const bruto = (b - a) / n, pot = 10 ** Math.floor(Math.log10(bruto));
    const st = [1, 2, 5, 10].map((k) => k * pot).find((v) => v >= bruto * 0.999);
    const casas = Math.max(0, -Math.floor(Math.log10(st) + 1e-9)), out = [];
    for (let v = Math.ceil(a / st - 1e-9) * st; v <= b + 1e-9; v += st) out.push(+v.toFixed(10));
    return { out, casas };
  }
  /* eixo x numa altura y (opts.grade: y do topo das linhas de grade) */
  function eixoX(g, sx, x0, x1, y, n, tit, opts = {}) {
    const mx = marcas(x0, x1, n);
    svg("line", { x1: sx(x0), x2: sx(x1), y1: y, y2: y, class: "eixo" }, g);
    for (const v of mx.out) {
      if (opts.grade != null) svg("line", { x1: sx(v), x2: sx(v), y1: opts.grade, y2: y, class: "grade-linha" }, g);
      txt(g, sx(v), y + 22, (opts.fmt || ((u) => num(u, mx.casas)))(v), { "text-anchor": "middle", class: "rotulo-eixo" });
    }
    if (tit) txt(g, (sx(x0) + sx(x1)) / 2, y + 46, tit, { "text-anchor": "middle", class: "titulo-eixo" });
  }
  /* eixo y numa posição x (opts.grade: x do fim das linhas de grade) */
  function eixoY(g, sy, y0, y1, x, n, tit, opts = {}) {
    const my = marcas(y0, y1, n);
    svg("line", { x1: x, x2: x, y1: sy(y0), y2: sy(y1), class: "eixo" }, g);
    for (const v of my.out) {
      if (opts.grade != null) svg("line", { x1: x, x2: opts.grade, y1: sy(v), y2: sy(v), class: "grade-linha" }, g);
      txt(g, x - 8, sy(v) + 5, (opts.fmt || ((u) => num(u, my.casas)))(v), { "text-anchor": "end", class: "rotulo-eixo" });
    }
    if (tit) txt(g, 0, 0, tit, { class: "titulo-eixo", "text-anchor": "middle", transform: `translate(${x - 52} ${(sy(y0) + sy(y1)) / 2}) rotate(-90)` });
  }
  /* seta de (x1,y1) a (x2,y2), com ponta */
  function seta(g, x1, y1, x2, y2, cls = "") {
    const gg = svg("g", {}, g);
    svg("line", { x1, y1, x2, y2, class: `seta ${cls}` }, gg);
    const a = Math.atan2(y2 - y1, x2 - x1), t = 10;
    const p = [[x2, y2], [x2 - t * Math.cos(a - 0.45), y2 - t * Math.sin(a - 0.45)], [x2 - t * Math.cos(a + 0.45), y2 - t * Math.sin(a + 0.45)]];
    svg("polygon", { points: p.map((q) => q.join(",")).join(" "), class: `ponta ${cls}` }, gg);
    return gg;
  }
  /* liga um <input type=range> a uma função; devolve {inp, v} */
  function controle(inp, saida, fmt, f) {
    if (!inp) return null;
    semTeclas(inp);
    const at = () => { if (saida) saida.textContent = fmt(+inp.value); f(+inp.value); };
    inp.addEventListener("input", at);
    at();
    return { inp, at, get v() { return +inp.value; } };
  }

  window.Motor = {
    cena(id, def) {
      CENAS[id] = def;
      // se o motor já começou (script carregado depois), monta agora
      if (INICIADO) document.querySelectorAll(`.cena[data-cena="${id}"]`).forEach(montarCaixa);
    },
    util: { svg, txt, html, escala, gerador, num, ols, semTeclas, vis, marcas, eixoX, eixoY, seta, controle, DUR },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", quandoPronto);
  else quandoPronto();
})();
