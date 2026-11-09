/* ==========================================================================
   Quiz ao vivo: o que o celular e o telão (os slides) compartilham.

   Sem servidor próprio: o Firebase Realtime Database aceita GET/PUT em
   `<caminho>.json` e transmite as mudanças por Server-Sent Events. O site
   continua estático (GitHub Pages).

   Estrutura no banco, em aulaapps/<sala>/:
     estado/pub        o que está no telão: pergunta, opções, aberta ou não,
                       quando abriu (hora do servidor) e o histórico das já
                       reveladas (com a alternativa certa de cada uma)
     jogadores/<id>    o apelido de cada celular
     respostas/<p>/<id>  { v: alternativa, t: hora do servidor }

   O que as regras do banco garantem (firebase/regras-aulaapps.json):
     - só quem tem a chave do professor muda o estado;
     - cada celular responde uma vez, e só enquanto a pergunta está aberta;
     - a hora da resposta é a do servidor, e não a do celular.

   Pontos por pergunta (como nos jogos de auditório): quem acerta ganha de
   1000 (resposta imediata) a 500 (no último segundo); quem erra, zero.
   ========================================================================== */

const params = new URLSearchParams(location.search);
export const CONFIG = {
  banco: params.get("banco") || "https://jtrecenti-default-rtdb.firebaseio.com",
  sala: (params.get("sala") || "aula-2026-11-10").replace(/[^\w-]/g, "").slice(0, 40),
};
const RAIZ = `aulaapps/${CONFIG.sala}`;
const url = (caminho) => `${CONFIG.banco}/${RAIZ}/${caminho}.json`;

export async function ler(caminho) {
  const r = await fetch(url(caminho));
  if (!r.ok) throw new Error(`leitura negada (${r.status})`);
  return r.json();
}

export async function gravar(caminho, valor, metodo = "PUT") {
  const r = await fetch(url(caminho), {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valor),
  });
  if (!r.ok) {
    throw new Error(r.status === 401 || r.status === 403 ? "o banco recusou a gravação" : `erro ${r.status}`);
  }
  return r.json().catch(() => null);
}

/* Acompanha um caminho ao vivo. Se o streaming cair (rede de sala cheia),
   passa a ler a cada 3 segundos. Devolve uma função que para. */
export function acompanhar(caminho, aoMudar, { intervalo = 3000 } = {}) {
  let valor = null, parado = false, fonte = null, relogio = null;

  function aplicar(path, dados, patch) {
    if (path === "/") {
      valor = patch && valor && typeof valor === "object" ? { ...valor, ...dados } : dados;
    } else {
      const partes = path.split("/").filter(Boolean);
      valor = valor && typeof valor === "object" ? structuredClone(valor) : {};
      let no = valor;
      for (let i = 0; i < partes.length - 1; i++) {
        if (!no[partes[i]] || typeof no[partes[i]] !== "object") no[partes[i]] = {};
        no = no[partes[i]];
      }
      const ultima = partes[partes.length - 1];
      if (patch && dados && typeof dados === "object") no[ultima] = { ...(no[ultima] || {}), ...dados };
      else if (dados === null) delete no[ultima];
      else no[ultima] = dados;
    }
    aoMudar(valor);
  }

  function sondar() {
    clearInterval(relogio);
    const vez = async () => {
      if (parado) return;
      try { valor = await ler(caminho); aoMudar(valor); } catch { /* tenta de novo */ }
    };
    vez();
    relogio = setInterval(vez, intervalo);
  }

  try {
    fonte = new EventSource(url(caminho));
    const tratar = (patch) => (ev) => {
      try { const { path, data } = JSON.parse(ev.data); aplicar(path, data, patch); } catch { /* ignora */ }
    };
    fonte.addEventListener("put", tratar(false));
    fonte.addEventListener("patch", tratar(true));
    fonte.addEventListener("cancel", () => { fonte.close(); sondar(); });
    fonte.onerror = () => { if (fonte.readyState === EventSource.CLOSED && !parado) sondar(); };
  } catch {
    sondar();
  }
  return () => { parado = true; fonte && fonte.close(); clearInterval(relogio); };
}

/* Identificador do celular: não é login, só evita contar o mesmo aparelho duas vezes. */
export function aparelho() {
  const CHAVE = "aulaapps-aparelho";
  try {
    let v = localStorage.getItem(CHAVE);
    if (!v) { v = crypto.randomUUID().replace(/-/g, "").slice(0, 14); localStorage.setItem(CHAVE, v); }
    return v;
  } catch {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 14);
  }
}

export const LETRAS = ["A", "B", "C", "D"];
export const FORMAS = ["▲", "◆", "●", "■"];

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Pontos de uma resposta. h = { abertoEm, certa, limite } (do histórico). */
export function pontos(h, r) {
  if (!h || !r || r.v !== h.certa || !Number.isFinite(r.t)) return 0;
  const dt = (r.t - h.abertoEm) / 1000;
  const lim = h.limite || 20;
  if (dt > lim + 1.5) return 0; // 1,5 s de folga para a rede
  return Math.round(1000 - 500 * Math.min(1, Math.max(0, dt) / lim));
}

/* Placar a partir do histórico (perguntas já reveladas), das respostas e dos apelidos. */
export function placar(historico, respostas, jogadores) {
  const tot = {};
  for (const [id, j] of Object.entries(jogadores || {})) tot[id] = { id, nome: j?.nome || "?", pts: 0, acertos: 0, tempo: 0 };
  for (const [pid, h] of Object.entries(historico || {})) {
    for (const [id, r] of Object.entries(respostas?.[pid] || {})) {
      if (!tot[id]) tot[id] = { id, nome: "?", pts: 0, acertos: 0, tempo: 0 };
      const p = pontos(h, r);
      tot[id].pts += p;
      if (p > 0) { tot[id].acertos += 1; tot[id].tempo += (r.t - h.abertoEm) / 1000; }
    }
  }
  // desempate: mais acertos, depois menos tempo somado nos acertos
  return Object.values(tot).sort((a, b) => b.pts - a.pts || b.acertos - a.acertos || a.tempo - b.tempo);
}
