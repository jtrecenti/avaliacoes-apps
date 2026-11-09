"""Publica as regras do quiz (nó aulaapps) no Realtime Database do projeto jtrecenti.

O banco é compartilhado com outras disciplinas, e as regras são um documento
único: publicar só o nosso arquivo apagaria as regras dos outros. Então o script
baixa as regras publicadas, guarda um backup fora do repositório, troca APENAS a
chave "aulaapps" e publica (com --publicar; sem a opção, só mostra o que faria).

Requer o firebase CLI logado numa conta dona do projeto.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
PROJETO = "jtrecenti"
FIREBASE = shutil.which("firebase") or shutil.which("firebase.cmd") or "firebase"
CHAVE = "aulaapps"


def firebase(*args: str, cwd: Path | None = None) -> str:
    r = subprocess.run([FIREBASE, *args, "--project", PROJETO], capture_output=True, text=True,
                       encoding="utf-8", cwd=cwd)
    return r.stdout + r.stderr


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--publicar", action="store_true")
    a = ap.parse_args()

    bruto = firebase("database:get", "/.settings/rules")
    atuais = json.loads(bruto[bruto.find("{"):])
    nosso = json.loads((RAIZ / "firebase" / f"regras-{CHAVE}.json").read_text(encoding="utf-8"))

    backup = Path(tempfile.gettempdir()) / f"backup-regras-{dt.datetime.now():%Y%m%d-%H%M%S}.json"
    backup.write_text(json.dumps(atuais, indent=2, ensure_ascii=False), encoding="utf-8")

    novas = json.loads(json.dumps(atuais))
    print("nós preservados:", sorted(set(novas["rules"]) - {CHAVE}))
    novas["rules"][CHAVE] = nosso[CHAVE]
    print("backup em", backup)
    if not a.publicar:
        print("simulação: nada publicado (use --publicar)")
        return
    with tempfile.TemporaryDirectory() as tmp:
        t = Path(tmp)
        (t / "regras.json").write_text(json.dumps(novas, indent=2, ensure_ascii=False), encoding="utf-8")
        (t / "firebase.json").write_text(json.dumps({"database": {"rules": "regras.json"}}), encoding="utf-8")
        print(firebase("deploy", "--only", "database", cwd=t))


if __name__ == "__main__":
    main()
