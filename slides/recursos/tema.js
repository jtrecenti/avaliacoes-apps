/*
 * Duas coisas pequenas que o revealjs não faz sozinho (mesmo esquema da CDAD).
 *
 * 1. Claro/escuro na tecla "d". O quanto o fundo claro estoura depende da sala
 *    e da luz do dia; a escolha fica guardada no navegador.
 * 2. O nome da parte no alto de cada slide, propagado a partir das divisórias
 *    (`.secao`), para quem se perdeu saber onde a turma está.
 */
(function () {
  const CHAVE = "mkt-analitico-tema";
  const raiz = document.documentElement;

  function aplicar(tema) {
    if (tema === "escuro") raiz.setAttribute("data-tema", "escuro");
    else raiz.removeAttribute("data-tema");
    const b = document.getElementById("botao-tema");
    if (b) b.textContent = tema === "escuro" ? "claro (d)" : "escuro (d)";
  }
  function atual() {
    try { return localStorage.getItem(CHAVE) === "escuro" ? "escuro" : "claro"; }
    catch { return "claro"; }
  }
  function alternar() {
    const novo = atual() === "escuro" ? "claro" : "escuro";
    try { localStorage.setItem(CHAVE, novo); } catch { /* só nesta sessão */ }
    aplicar(novo);
  }
  aplicar(atual());

  function marcarPartes() {
    let numero = 0, parte = "";
    for (const s of document.querySelectorAll(".reveal .slides > section")) {
      if (s.classList.contains("secao")) {
        numero += 1;
        s.setAttribute("data-numero", String(numero));
        const h = s.querySelector("h2");
        parte = h ? h.textContent.trim() : "";
        continue;
      }
      if (parte && !s.classList.contains("capa") && s.querySelector("h2")) s.setAttribute("data-parte", parte);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    marcarPartes();
    const b = document.createElement("button");
    b.id = "botao-tema"; b.type = "button";
    b.addEventListener("click", alternar);
    document.body.appendChild(b);
    aplicar(atual());
    document.addEventListener("keydown", function (e) {
      if (e.key !== "d" && e.key !== "D") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const alvo = e.target;
      if (alvo && (/^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName) || alvo.isContentEditable)) return;
      e.preventDefault();
      alternar();
    });
  });
})();
