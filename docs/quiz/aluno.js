/* ==========================================================================
   Quiz ao vivo · celular de quem joga

   O celular não decide nada: acompanha o que o telão publica (pergunta,
   aberta ou não, revelada ou não) e desenha. Cada pergunta aceita um toque
   só: quanto mais rápido o acerto, mais pontos.
   ========================================================================== */

import { acompanhar, gravar, aparelho, LETRAS, FORMAS, pontos, placar, CONFIG } from "./comum.js";

const eu = aparelho();
const st = { pub: null, respostas: {}, minhas: {}, jogadores: {}, nome: null, recebidaEm: 0, enviando: false };
const $ = (s) => document.querySelector(s);
const CHAVE_NOME = `aulaapps-nome-${CONFIG.sala}`;

function el(tag, attrs = {}, filhos = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "texto") n.textContent = v;
    else if (k === "classe") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, "");
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const f of [].concat(filhos)) if (f) n.append(f);
  return n;
}

function conexao(t, ruim) {
  const n = $("#conexao");
  n.textContent = t;
  n.classList.toggle("ruim", Boolean(ruim));
}

function aviso(t) {
  const n = el("div", { classe: "aviso", texto: t });
  document.body.append(n);
  setTimeout(() => n.remove(), 4000);
}

async function entrar(nome) {
  nome = nome.trim().replace(/\s+/g, " ").slice(0, 20);
  if (!nome) return;
  try {
    await gravar(`jogadores/${eu}`, { nome });
    st.nome = nome;
    try { localStorage.setItem(CHAVE_NOME, nome); } catch { /* sem armazenamento */ }
    desenhar();
  } catch (e) {
    aviso("Não consegui entrar: " + (e.message || e));
  }
}

async function responder(i) {
  const pid = st.pub?.pergunta;
  if (!pid || !st.pub.aberto || minhaDe(pid) || st.enviando) return;
  st.enviando = true;
  st.minhas[pid] = { v: i, t: Date.now(), local: true };
  desenhar();
  try {
    await gravar(`respostas/${pid}/${eu}`, { v: i, t: { ".sv": "timestamp" } });
  } catch (e) {
    delete st.minhas[pid];
    aviso("A resposta não chegou a tempo.");
  } finally {
    st.enviando = false;
    desenhar();
  }
}

function minhaDe(pid) {
  return st.respostas?.[pid]?.[eu] || st.minhas[pid] || null;
}

function minhaPosicao() {
  const lista = placar(st.pub?.historico, st.respostas, st.jogadores);
  const i = lista.findIndex((x) => x.id === eu);
  return { pos: i + 1, total: lista.length, pts: i >= 0 ? lista[i].pts : 0 };
}

function rodapePlacar() {
  const { pos, total, pts } = minhaPosicao();
  if (!Object.keys(st.pub?.historico || {}).length) return null;
  return el("div", { classe: "meu-placar" }, [
    el("span", { texto: `${pts.toLocaleString("pt-BR")} pontos` }),
    el("span", { texto: pos ? `${pos}º de ${total}` : "" }),
  ]);
}

let relogio = null;
function cronometro(caixa) {
  clearInterval(relogio);
  const lim = st.pub?.limite || 20;
  const barra = el("div", { classe: "tempo" }, [el("i")]);
  caixa.append(barra);
  const passo = () => {
    const frac = Math.max(0, 1 - (Date.now() - st.recebidaEm) / (lim * 1000));
    barra.firstChild.style.width = `${frac * 100}%`;
    if (frac <= 0) clearInterval(relogio);
  };
  passo();
  relogio = setInterval(passo, 100);
}

function desenhar() {
  const tela = $("#tela");
  tela.replaceChildren();
  clearInterval(relogio);

  if (!st.nome) {
    const campo = el("input", { classe: "campo", maxlength: 20, placeholder: "seu apelido", autocomplete: "off", enterkeyhint: "go" });
    campo.addEventListener("keydown", (e) => { if (e.key === "Enter") entrar(campo.value); });
    tela.append(
      el("h1", { texto: "Entre no quiz" }),
      el("p", { classe: "fraco", texto: "Escolha um apelido. Ele aparece no placar do telão, então nada de nome completo." }),
      campo,
      el("button", { classe: "enviar", type: "button", texto: "Entrar", onclick: () => entrar(campo.value) }),
    );
    setTimeout(() => campo.focus(), 50);
    return;
  }

  const pub = st.pub;
  const pid = pub?.pergunta;
  const minha = pid ? minhaDe(pid) : null;

  if (!pid || (!pub.aberto && !pub.revelado)) {
    tela.append(el("div", { classe: "espera" }, [
      el("div", { classe: "ponto" }),
      el("h1", { texto: `Você está dentro, ${st.nome}.` }),
      el("p", { classe: "fraco", texto: "Olhe para o telão. A próxima pergunta aparece aqui sozinha." }),
    ]));
    const rp = rodapePlacar();
    if (rp) tela.append(rp);
    tela.append(el("button", { classe: "trocar", type: "button", texto: "trocar o apelido", onclick: () => { st.nome = null; desenhar(); } }));
    return;
  }

  tela.append(el("h1", { classe: "enunciado", texto: pub.enunciado || "" }));

  if (pub.aberto && !minha) {
    cronometro(tela);
    const grade = el("div", { classe: "botoes" });
    (pub.opcoes || []).forEach((t, i) => {
      grade.append(el("button", { classe: `botao c${i}`, type: "button", onclick: () => responder(i) }, [
        el("span", { classe: "forma", texto: FORMAS[i] }),
        el("span", { texto: t }),
      ]));
    });
    tela.append(grade);
    return;
  }

  if (pub.aberto && minha) {
    tela.append(el("div", { classe: `escolhida c${minha.v}` }, [
      el("span", { classe: "forma", texto: FORMAS[minha.v] }),
      el("span", { texto: (pub.opcoes || [])[minha.v] || LETRAS[minha.v] }),
    ]), el("p", { classe: "fraco centro", texto: "Resposta enviada. Espere o resultado no telão." }));
    return;
  }

  // revelada
  const h = pub.historico?.[pid];
  const certa = h ? h.certa : pub.certa;
  if (!minha) {
    tela.append(el("div", { classe: "resultado neutro" }, [el("b", { texto: "Sem resposta desta vez" }), el("span", { texto: `A certa era ${LETRAS[certa]}: ${(pub.opcoes || [])[certa] || ""}` })]));
  } else {
    const p = minha.local ? 0 : pontos(h, minha);
    const ok = minha.v === certa;
    tela.append(el("div", { classe: `resultado ${ok ? "ok" : "erro"}` }, [
      el("b", { texto: ok ? (p ? `Acertou! +${p} pontos` : "Acertou, mas depois do tempo") : "Não foi desta vez" }),
      el("span", { texto: ok ? "" : `A certa era ${LETRAS[certa]}: ${(pub.opcoes || [])[certa] || ""}` }),
    ]));
  }
  const rp = rodapePlacar();
  if (rp) tela.append(rp);
}

function iniciar() {
  try { st.nome = localStorage.getItem(CHAVE_NOME); } catch { /* sem armazenamento */ }
  desenhar();
  let recebeu = false;
  acompanhar("estado/pub", (pub) => {
    recebeu = true;
    conexao("ao vivo");
    const abriuAgora = pub?.aberto && (!st.pub?.aberto || st.pub?.pergunta !== pub?.pergunta);
    if (abriuAgora) st.recebidaEm = Date.now();
    st.pub = pub;
    desenhar();
  });
  acompanhar("respostas", (r) => {
    // a resposta local (ainda sem hora do servidor) fica até o banco confirmar
    st.respostas = r || {};
    if (!st.pub?.aberto) desenhar();
  });
  acompanhar("jogadores", (j) => { st.jogadores = j || {}; });
  setTimeout(() => { if (!recebeu) conexao("sem conexão", true); }, 8000);
}

iniciar();
