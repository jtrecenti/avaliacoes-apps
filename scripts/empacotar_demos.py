"""Empacota demos/ em docs/materiais/demos.zip, para baixar pelo site.

Fica de fora: o .env (a chave do Jev nunca sai do computador), __pycache__ e
arquivos temporários. Quem baixa cria o próprio .env na pasta 4-anotar-com-jev.

Uso: python scripts/empacotar_demos.py
"""
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
ORIGEM = RAIZ / "demos"
DESTINO = RAIZ / "docs/materiais/demos.zip"
FORA = {".env", ".DS_Store"}

DESTINO.parent.mkdir(parents=True, exist_ok=True)
arquivos = [f for f in sorted(ORIGEM.rglob("*"))
            if f.is_file() and f.name not in FORA and "__pycache__" not in f.parts and "brutos" not in f.parts
            and not f.name.startswith(("ocorrencias", "trechos")) and f.suffix != ".xlsx"]  # saídas das demonstrações
with zipfile.ZipFile(DESTINO, "w", zipfile.ZIP_DEFLATED) as z:
    for f in arquivos:
        z.write(f, ("demos" / f.relative_to(ORIGEM)).as_posix())
nomes = zipfile.ZipFile(DESTINO).namelist()
assert not any(n.endswith(".env") for n in nomes), "o .env entrou no zip"
print(f"{len(nomes)} arquivos em {DESTINO.relative_to(RAIZ)} ({DESTINO.stat().st_size / 1024:.0f} KB); .env fora")
for n in nomes:
    print("  ", n)
