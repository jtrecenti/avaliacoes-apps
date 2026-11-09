/*
 * Quiz ao vivo dentro dos slides (o telão).
 *
 * Três tipos de bloco no markdown:
 *   ::: {.quiz-entrada}            QR, apelidos chegando e a chave do professor
 *   ::: {.quiz data-quiz="q1"}     uma pergunta: "Valendo!" abre, o tempo corre,
 *                                  no fim (ou quando todos responderem) revela
 *   ::: {.quiz-placar}             o placar até aqui; com data-final, o pódio
 *
 * Teclas num slide de pergunta: V abre, R revela. O banco e as regras estão em
 * ../docs/quiz/comum.js e ../firebase/. Sem internet, a pergunta continua no
 * telão e o R mostra a resposta certa (a turma responde levantando a mão).
 *
 * As perguntas ficam aqui, e não num arquivo público do site: o celular só
 * recebe a pergunta quando ela abre, e a resposta certa quando ela é revelada.
 */
(function () {
  "use strict";

  const PERGUNTAS = window.QUIZ_PERGUNTAS || {};
  const SITE = "https://jtrecenti.github.io/avaliacoes-apps/quiz/";
  const BASE = /^https?:$/.test(location.protocol) ? new URL("../quiz/", location.href).href : SITE;
  const ENDERECO = SITE.replace(/^https:\/\//, "").replace(/\/$/, "");
  const CHAVE_LS = "aulaapps-chave";
  const CORES = ["#e50505", "#1d6fd6", "#d59a00", "#1d9a6c"];

  let Q = null; // módulo comum.js
  const st = { pub: null, respostas: {}, jogadores: {}, online: false, timer: null, fimEm: 0, revelandoLocal: {} };

  const chave = () => { try { return localStorage.getItem(CHAVE_LS) || ""; } catch { return ""; } };
  const n = (v) => Number(v).toLocaleString("pt-BR");
  function h(tag, cls, pai, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (pai) pai.appendChild(e);
    return e;
  }
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const FORMAS = ["▲", "◆", "●", "■"];
  const LETRAS = ["A", "B", "C", "D"];

  /* ---------- estado no banco ------------------------------------------- */

  async function publicar(pub) {
    if (!Q || !chave()) throw new Error("sem chave");
    await Q.gravar("estado", { chave: chave(), pub });
  }

  function historico() { return Object.assign({}, st.pub?.historico || {}); }

  async function abrirSala() {
    await publicar({ pergunta: "", aberto: false, revelado: false, historico: historico() });
  }

  async function abrir(id) {
    const p = PERGUNTAS[id];
    await publicar({
      pergunta: id, enunciado: p.enunciado, opcoes: p.opcoes, limite: p.limite || 20,
      aberto: true, revelado: false, abertoEm: { ".sv": "timestamp" }, historico: historico(),
    });
  }

  async function revelar(id) {
    const p = PERGUNTAS[id];
    const pub = st.pub || {};
    const hist = historico();
    if (pub.pergunta === id && Number.isFinite(pub.abertoEm)) hist[id] = { abertoEm: pub.abertoEm, certa: p.certa, limite: p.limite || 20 };
    await publicar({
      pergunta: id, enunciado: p.enunciado, opcoes: p.opcoes, limite: p.limite || 20,
      aberto: false, revelado: true, certa: p.certa, abertoEm: pub.abertoEm || 0, historico: hist,
    });
  }

  /* ---------- desenho: entrada ------------------------------------------ */

  function montarEntrada(caixa) {
    // o QR vem embutido pelo Quarto (imagem dentro do bloco); aqui só muda de lugar
    const img = caixa.querySelector("img");
    const src = img ? img.getAttribute("src") : "recursos/img/qr-quiz.svg";
    caixa.innerHTML = `
      <div class="qz-entrada">
        <div class="qz-qr"><img src="${src}" alt="QR do quiz"><div class="qz-url">${ENDERECO}</div></div>
        <div class="qz-lado">
          <div class="qz-conta"><b>0</b> <span>pessoas no jogo</span></div>
          <div class="qz-nomes"></div>
          <div class="qz-prof">
            <input type="password" placeholder="chave do professor" autocomplete="off">
            <button type="button">abrir a sala</button>
            <span class="qz-msg"></span>
          </div>
        </div>
      </div>`;
    const inp = caixa.querySelector("input"), msg = caixa.querySelector(".qz-msg");
    inp.value = chave();
    inp.addEventListener("keydown", (e) => e.stopPropagation());
    caixa.querySelector("button").addEventListener("click", async () => {
      try { localStorage.setItem(CHAVE_LS, inp.value.trim()); } catch { /* só nesta sessão */ }
      try { await abrirSala(); msg.textContent = "sala aberta"; caixa.querySelector(".qz-prof").classList.add("ok"); }
      catch (e) { msg.textContent = e.message === "sem chave" ? "falta a chave" : "o banco recusou: confira a chave"; }
    });
    if (chave()) caixa.querySelector(".qz-prof").classList.add("ok");
  }

  function desenharEntrada(caixa) {
    const nomes = Object.entries(st.jogadores || {});
    caixa.querySelector(".qz-conta b").textContent = n(nomes.length);
    const lista = caixa.querySelector(".qz-nomes");
    const ja = new Set([...lista.children].map((c) => c.dataset.id));
    for (const [id, j] of nomes) {
      if (ja.has(id)) continue;
      const e = h("span", "qz-nome", lista, esc(j?.nome));
      e.dataset.id = id;
      if (window.gsap) gsap.from(e, { scale: 0.2, opacity: 0, duration: 0.5, ease: "back.out(2.5)" });
    }
  }

  /* ---------- desenho: pergunta ----------------------------------------- */

  function montarPergunta(caixa) {
    const id = caixa.dataset.quiz, p = PERGUNTAS[id];
    if (!p) { caixa.textContent = `pergunta ${id} sem definição`; return; }
    caixa.innerHTML = `
      <div class="qz-cab">
        <div class="qz-enunciado">${p.enunciado}</div>
        <div class="qz-relogio"><b></b><span></span></div>
      </div>
      <div class="qz-opcoes">${p.opcoes.map((o, i) => `
        <div class="qz-op" data-i="${i}" style="--cor:${CORES[i]}">
          <span class="qz-forma">${FORMAS[i]}</span><span class="qz-txt">${o}</span>
          <span class="qz-barra"><i></i></span><span class="qz-votos"></span>
        </div>`).join("")}
      </div>
      <div class="qz-rodape">
        <button type="button" class="qz-valendo">Valendo! <small>(V)</small></button>
        <span class="qz-respostas"></span>
        <button type="button" class="qz-revelar">revelar <small>(R)</small></button>
      </div>
      <div class="qz-porque">${p.porque || ""}</div>
      <div class="qz-rapidos"></div>`;
    caixa.querySelector(".qz-valendo").addEventListener("click", () => comecar(caixa));
    caixa.querySelector(".qz-revelar").addEventListener("click", () => terminar(caixa));
  }

  async function comecar(caixa) {
    const id = caixa.dataset.quiz, p = PERGUNTAS[id];
    if (st.pub?.historico?.[id]) return; // já foi jogada nesta sala
    try { await abrir(id); }
    catch (e) {
      caixa.querySelector(".qz-respostas").textContent = chave() ? "sem conexão com o banco" : "falta a chave (slide de entrada)";
      return;
    }
    clearInterval(st.timer);
    st.fimEm = Date.now() + (p.limite || 20) * 1000;
    st.timer = setInterval(() => {
      const falta = Math.ceil((st.fimEm - Date.now()) / 1000);
      const todos = Object.keys(st.jogadores || {}).length;
      const resp = Object.keys(st.respostas?.[id] || {}).length;
      if (falta <= 0 || (todos > 0 && resp >= todos)) { clearInterval(st.timer); terminar(caixa); }
      desenharPergunta(caixa);
    }, 200);
  }

  async function terminar(caixa) {
    const id = caixa.dataset.quiz;
    clearInterval(st.timer);
    st.revelandoLocal[id] = true;
    desenharPergunta(caixa, true);
    if (!chave()) return;
    // espera a hora de abertura chegar do servidor (abertoEm), se ainda não chegou
    for (let i = 0; i < 15 && st.pub?.pergunta === id && !Number.isFinite(st.pub?.abertoEm); i++) await new Promise((r) => setTimeout(r, 200));
    try { await revelar(id); } catch { /* sem banco: fica só a revelação local */ }
  }

  function desenharPergunta(caixa, animar) {
    const id = caixa.dataset.quiz, p = PERGUNTAS[id];
    if (!p) return;
    const pub = st.pub || {};
    const ativa = pub.pergunta === id;
    const aberta = ativa && pub.aberto;
    const revelada = (ativa && pub.revelado) || Boolean(pub.historico?.[id]) || st.revelandoLocal[id];
    const resp = st.respostas?.[id] || {};
    const total = Object.keys(resp).length;
    const cont = [0, 0, 0, 0];
    Object.values(resp).forEach((r) => { if (r && r.v >= 0 && r.v < 4) cont[r.v]++; });

    caixa.classList.toggle("aberta", Boolean(aberta));
    caixa.classList.toggle("revelada", Boolean(revelada));
    const rel = caixa.querySelector(".qz-relogio");
    if (aberta) {
      const falta = Math.max(0, Math.ceil((st.fimEm - Date.now()) / 1000));
      rel.querySelector("b").textContent = st.fimEm ? falta : "";
      rel.querySelector("span").textContent = "segundos";
    } else {
      rel.querySelector("b").textContent = "";
      rel.querySelector("span").textContent = "";
    }
    const jog = Object.keys(st.jogadores || {}).length;
    caixa.querySelector(".qz-respostas").textContent = aberta || revelada
      ? `${n(total)} ${total === 1 ? "resposta" : "respostas"}${jog ? ` de ${n(jog)}` : ""}`
      : jog ? `${n(jog)} no jogo` : "";

    caixa.querySelectorAll(".qz-op").forEach((op) => {
      const i = +op.dataset.i;
      op.classList.toggle("certa", Boolean(revelada) && i === p.certa);
      op.classList.toggle("apagada", Boolean(revelada) && i !== p.certa);
      const frac = total ? cont[i] / total : 0;
      const barra = op.querySelector(".qz-barra i");
      if (revelada) {
        op.querySelector(".qz-votos").textContent = total ? n(cont[i]) : "";
        if (window.gsap) gsap.to(barra, { width: `${frac * 100}%`, duration: animar ? 0.9 : 0, ease: "power3.out" });
        else barra.style.width = `${frac * 100}%`;
      } else {
        op.querySelector(".qz-votos").textContent = "";
        barra.style.width = "0";
      }
    });

    // os três acertos mais rápidos desta pergunta
    const rap = caixa.querySelector(".qz-rapidos");
    const hst = pub.historico?.[id];
    if (revelada && hst && Q) {
      const top = Object.entries(resp)
        .map(([aid, r]) => ({ nome: st.jogadores?.[aid]?.nome || "?", pts: Q.pontos(hst, r), s: (r.t - hst.abertoEm) / 1000 }))
        .filter((x) => x.pts > 0).sort((a, b) => b.pts - a.pts).slice(0, 3);
      rap.innerHTML = top.length ? "mais rápidos: " + top.map((x) => `<b>${esc(x.nome)}</b> ${x.s.toFixed(1).replace(".", ",")} s`).join(" · ") : "";
    } else rap.innerHTML = "";
  }

  /* ---------- desenho: placar -------------------------------------------- */

  function montarPlacar(caixa) {
    caixa.innerHTML = `<div class="qz-lista"></div>`;
  }

  function desenharPlacar(caixa, animar) {
    if (!Q) return;
    const lista = Q.placar(st.pub?.historico, st.respostas, st.jogadores).slice(0, caixa.dataset.final != null ? 10 : 8);
    const alvo = caixa.querySelector(".qz-lista");
    const max = Math.max(1, ...lista.map((x) => x.pts));
    alvo.innerHTML = lista.length ? lista.map((x, i) => `
      <div class="qz-linha${i < 3 ? " pod" + (i + 1) : ""}">
        <span class="qz-pos">${i + 1}º</span><span class="qz-quem">${esc(x.nome)}</span>
        <span class="qz-pbar"><i style="width:${(100 * x.pts) / max}%"></i></span>
        <span class="qz-pts">${n(x.pts)}</span>
      </div>`).join("") : `<p class="qz-vazio">O placar aparece depois da primeira pergunta.</p>`;
    if (animar && window.gsap) {
      gsap.from(alvo.querySelectorAll(".qz-linha"), { x: -40, opacity: 0, stagger: 0.08, duration: 0.45, ease: "power2.out" });
      gsap.from(alvo.querySelectorAll(".qz-pbar i"), { width: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" });
      if (caixa.dataset.final != null) confete(caixa);
    }
  }

  function confete(caixa) {
    const c = h("div", "qz-confete", caixa);
    for (let i = 0; i < 90; i++) {
      const p = h("i", "", c);
      p.style.background = CORES[i % 4];
      p.style.left = `${Math.random() * 100}%`;
      gsap.fromTo(p, { y: -40, rotation: 0, opacity: 1 },
        { y: 820, rotation: 360 * (Math.random() * 4 - 2), x: (Math.random() - 0.5) * 220, opacity: 0.9,
          duration: 2.4 + Math.random() * 2, delay: Math.random() * 0.8, ease: "power1.in" });
    }
    setTimeout(() => c.remove(), 6000);
  }

  /* ---------- ligação com o revealjs ------------------------------------- */

  function redesenhar(animar) {
    const s = window.Reveal && Reveal.getCurrentSlide();
    if (!s) return;
    s.querySelectorAll(".quiz-entrada").forEach((c) => desenharEntrada(c));
    s.querySelectorAll(".quiz[data-quiz]").forEach((c) => desenharPergunta(c, animar));
    s.querySelectorAll(".quiz-placar").forEach((c) => desenharPlacar(c, animar));
  }

  async function iniciar() {
    document.querySelectorAll(".quiz-entrada").forEach(montarEntrada);
    document.querySelectorAll(".quiz[data-quiz]").forEach(montarPergunta);
    document.querySelectorAll(".quiz-placar").forEach(montarPlacar);
    Reveal.on("slidechanged", () => redesenhar(true));
    document.addEventListener("keydown", (e) => {
      const s = Reveal.getCurrentSlide();
      const c = s && s.querySelector(".quiz[data-quiz]");
      if (!c || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (e.key === "v" || e.key === "V") { e.preventDefault(); comecar(c); }
      if (e.key === "r" || e.key === "R") { e.preventDefault(); terminar(c); }
    }, true);
    redesenhar(false);
    try {
      Q = await import(BASE + "comum.js");
      Q.acompanhar("estado/pub", (v) => { st.pub = v; st.online = true; redesenhar(false); });
      Q.acompanhar("respostas", (v) => { st.respostas = v || {}; redesenhar(false); });
      Q.acompanhar("jogadores", (v) => { st.jogadores = v || {}; redesenhar(false); });
    } catch (e) {
      console.warn("[quiz] sem conexão com o banco:", e);
    }
  }

  function quandoPronto() {
    if (!window.Reveal || !Reveal.on) return setTimeout(quandoPronto, 60);
    if (Reveal.isReady && Reveal.isReady()) iniciar(); else Reveal.on("ready", iniciar);
  }
  quandoPronto();
})();
