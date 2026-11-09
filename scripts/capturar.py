"""Tira um print de cada slide de uma aula, com todos os passos visíveis
(e, nos slides com passos, também o estado inicial). Serve para revisar o deck
sem passar slide por slide.

Uso: python scripts/capturar.py index [slides...] [--escuro] [--tela=1800x1200]
Saída: slides/_capturas/<aula>/sNN.png (e sNNa.png, o estado inicial)
"""
import pathlib
import sys

import functools
import http.server
import threading

from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parents[1]
args = [a for a in sys.argv[1:] if not a.startswith("--")]
ESCURO = "--escuro" in sys.argv
TELA = next((a.split("=")[1] for a in sys.argv if a.startswith("--tela=")), "1280x760")
LARG, ALT = map(int, TELA.split("x"))
AULA = args.pop(0)
sel = {int(a) for a in args}
OUT = RAIZ / "slides" / "_capturas" / (AULA + ("-escuro" if ESCURO else "") + ("" if TELA == "1280x760" else "-" + TELA))
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": LARG, "height": ALT})
    erros = []
    pg.on("console", lambda m: erros.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: erros.append(str(e)))
    if ESCURO:
        pg.add_init_script("localStorage.setItem('mkt-analitico-tema','escuro')")
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(RAIZ / "docs")))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    pg.goto(f"http://127.0.0.1:{srv.server_port}/slides/{AULA}.html?sala=teste-captura")
    pg.wait_for_timeout(1800)
    n = pg.evaluate("Reveal.getTotalSlides()")
    for i in range(n):
        if sel and i not in sel:
            continue
        nf = pg.evaluate(f"Reveal.getSlides()[{i}].querySelectorAll('.fragment').length")
        pg.evaluate(f"Reveal.slide({i}, 0, -1)")
        pg.wait_for_timeout(450)
        if nf:
            pg.screenshot(path=str(OUT / f"s{i:02d}a.png"))
            for _ in range(nf):
                pg.evaluate("Reveal.nextFragment()")
                pg.wait_for_timeout(650)
        pg.wait_for_timeout(900)
        pg.screenshot(path=str(OUT / f"s{i:02d}.png"))
    print(n, "slides; avisos:", erros)
    b.close()
