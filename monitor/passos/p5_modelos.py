"""Passo 5: dois modelos sobre as avaliações anotadas dos últimos 90 dias.

1. Mapa das avaliações (TF-IDF + t-SNE). Cada avaliação vira um vetor com as
   palavras que ela usa (TF-IDF: palavras raras pesam mais que palavras comuns),
   o vetor é resumido em 100 números (TruncatedSVD) e o t-SNE projeta tudo num
   plano: avaliações que usam palavras parecidas ficam perto. Tudo roda no
   computador, sem API e sem baixar modelo, e dá sempre o mesmo resultado
   (random_state=42). Grava docs/painel/mapa.json, que a página lê depois de
   desenhar o resto.

2. O que explica a nota (regressão linear). Entre as avaliações que reclamam de
   algo, nota ~ tema + app + loja. Para cada tema com pelo menos 30 reclamações,
   a média ajustada é a nota que o modelo prevê se todas as reclamações fossem
   desse tema, mantendo a mistura real de apps e lojas. Assim a comparação entre
   temas não depende de um app ter mais reclamações de um tema que outro.
"""
import json
import time

import numpy as np
import pandas as pd

from .comum import PAINEL, agora

MAX_TEXTO_MAPA = 140   # caracteres do texto que aparecem no mapa
MIN_RECLAMACOES = 30   # tema com menos reclamações que isso não entra na comparação
COMPONENTES = 100      # tamanho do vetor depois do TruncatedSVD
VIZINHOS = 10          # vizinhas mais parecidas usadas para medir se um tema "fica junto"
NAO_ESPECIFICOS = {"outro", "crítica geral", "elogio geral"}

# Palavras muito comuns em português, que não dizem do que a avaliação fala.
# Sem acento, porque o TF-IDF tira os acentos antes de comparar. "nao" fica de
# fora da lista de propósito: "nao funciona" e "funciona" são opostos.
STOPWORDS = """
a o as os um uma uns umas de do da dos das no na nos nas em ao aos pelo pela pelos pelas por para pra pro
com sem sob sobre ate apos entre desde e ou mas que se como quando onde quem qual quais porque pois porem
eu tu ele ela nos vos eles elas voce voces me te lhe nos vos lhes meu minha meus minhas teu tua seu sua seus
suas nosso nossa nossos nossas dele dela deles delas esse essa esses essas este esta estes estas isso isto
aquele aquela aquilo aqui ai la ali ja tambem so muito muita muitos muitas mais menos tao tanto bem ainda
sempre nunca entao assim ser sou e era foi fui sao estou esta estao estava ter tem tenho tinha teve ha
fazer faz fiz vai vou ir fica ficar pode posso estar seja sendo sido tive todo toda todos todas cada outro
outra outros outras mesmo mesma algum alguma nada tudo coisa ne la vez vezes q pq vc vcs tb tbm
""".split()


# ---------------------------------------------------------------- mapa

def texto_mapa(titulo, texto) -> str:
    """O texto que vira vetor: título e texto juntos."""
    partes = [str(v).strip() for v in (titulo, texto) if not pd.isna(v) and str(v).strip()]
    return ". ".join(partes)


def vetores(textos: list[str], extras_stop: list[str] = ()) -> tuple[np.ndarray, np.ndarray]:
    """TF-IDF (palavras e pares de palavras) + TruncatedSVD + normalização.

    Devolve a matriz (uma linha por texto) e uma máscara dos textos que têm pelo
    menos uma palavra no vocabulário (os outros ficam de fora do mapa).
    """
    from sklearn.decomposition import TruncatedSVD
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.preprocessing import normalize

    n = len(textos)
    tf = TfidfVectorizer(lowercase=True, strip_accents="unicode", stop_words=sorted(set(STOPWORDS) | set(extras_stop)),
                         ngram_range=(1, 2), min_df=3 if n >= 100 else 1, sublinear_tf=True)
    m = tf.fit_transform(textos)
    tem = np.asarray(m.getnnz(axis=1) > 0)
    k = max(2, min(COMPONENTES, m.shape[1] - 1, n - 1))
    z = TruncatedSVD(n_components=k, random_state=42).fit_transform(m)
    z = normalize(z)
    return z, tem


def tsne(z: np.ndarray) -> np.ndarray:
    from sklearn.manifold import TSNE
    perp = min(30.0, max(2.0, (len(z) - 1) / 3))
    return TSNE(n_components=2, random_state=42, init="pca", perplexity=perp).fit_transform(z)


def _nomes_dos_apps(empresas) -> list[str]:
    """Os nomes dos apps viram stopwords: senão o mapa separa as avaliações só porque citam o nome do app."""
    from sklearn.feature_extraction.text import strip_accents_unicode
    return sorted({p for e in empresas for p in strip_accents_unicode(str(e).lower()).split() if len(p) > 1})


def _tema_que_fica_junto(z: np.ndarray, temas: pd.Series) -> dict | None:
    """Para cada tema específico, a % média das 10 avaliações mais parecidas (no vetor, não no plano) com o mesmo tema."""
    from sklearn.neighbors import NearestNeighbors
    ok = temas.notna().to_numpy()
    if ok.sum() <= VIZINHOS:
        return None
    zt, tt = z[ok], temas[ok].to_numpy()
    _, idx = NearestNeighbors(n_neighbors=VIZINHOS + 1).fit(zt).kneighbors(zt)
    igual = (tt[idx[:, 1:]] == tt[:, None]).mean(axis=1)
    melhor = None
    for t in pd.unique(tt):
        sel = tt == t
        if t in NAO_ESPECIFICOS or sel.sum() < MIN_RECLAMACOES:
            continue
        r = {"tema": str(t), "pct_vizinhas": round(100 * float(igual[sel].mean()), 1),
             "pct_base": round(100 * float(sel.mean()), 1), "n": int(sel.sum())}
        if melhor is None or r["pct_vizinhas"] > melhor["pct_vizinhas"]:
            melhor = r
    return melhor


def _curto(s: str) -> str:
    return s if len(s) <= MAX_TEXTO_MAPA else s[:MAX_TEXTO_MAPA - 1].rstrip() + "…"


def _fmt(x, c=1) -> str:
    return f"{x:.{c}f}".replace(".", ",")


def _mil(n: int) -> str:
    return f"{n:,}".replace(",", ".")


def mapa_segmento(d: pd.DataFrame) -> dict:
    """Os pontos do mapa de um segmento, em colunas (listas) com códigos para as categorias."""
    d = d.copy()
    d["texto_mapa"] = [texto_mapa(a, b) for a, b in zip(d["titulo"], d["texto"])]
    # o texto que aparece no mapa é só o corpo da avaliação: na App Store muita gente escreve
    # o próprio nome no título, e nome de quem avaliou não vai para o painel
    d["texto_mostrado"] = [texto_mapa(None, b) or texto_mapa(None, a) for a, b in zip(d["titulo"], d["texto"])]
    unicos = d.drop_duplicates("texto_mapa").reset_index(drop=True)
    z, tem = vetores(unicos["texto_mapa"].tolist(), _nomes_dos_apps(d["empresa"].unique()))
    fora_textos = unicos.loc[~tem, "texto_mapa"]
    unicos, z = unicos[tem].reset_index(drop=True), z[tem]
    xy = tsne(z)
    pos = dict(zip(unicos["texto_mapa"], map(tuple, xy)))

    entrou = d["texto_mapa"].isin(pos.keys())
    d = d[entrou].sort_values(["empresa", "loja", "data", "id_avaliacao"]).reset_index(drop=True)
    p = np.array([pos[t] for t in d["texto_mapa"]])
    # textos repetidos ("ótimo", "muito bom") caem no mesmo lugar; um pequeno espalhamento
    # (sempre o mesmo, random_state=42) deixa ver que ali há muitos pontos
    rep = d["texto_mapa"].duplicated(keep=False).to_numpy()
    rng = np.random.default_rng(42)
    p[rep] += rng.normal(0, 0.6, size=(rep.sum(), 2))

    cats = {c: sorted(d[c].dropna().astype(str).unique()) for c in ("empresa", "loja", "tema")}
    cod = lambda c: [cats[c].index(str(v)) if pd.notna(v) else -1 for v in d[c]]  # noqa: E731
    junto = _tema_que_fica_junto(z, unicos["tema"])
    n = len(d)
    if junto:
        titulo = (f"Avaliações sobre {junto['tema']} formam o grupo mais nítido do mapa: "
                  f"{_fmt(junto['pct_vizinhas'], 0)}% das {VIZINHOS} mais parecidas com cada uma falam do mesmo tema "
                  f"(o tema é só {_fmt(junto['pct_base'], 0)}% dos textos)")
    else:
        titulo = "Avaliações que usam palavras parecidas ficam perto no mapa"
    return {
        "titulo": titulo,
        "subtitulo": f"{_mil(n)} avaliações dos últimos 90 dias ({_mil(len(unicos))} textos diferentes); cada ponto é "
                     "uma avaliação, e avaliações que usam palavras parecidas ficam perto.",
        "tema_mais_junto": junto,
        "n": n,
        "n_textos": int(len(unicos)),
        "fora": int((~entrou).sum()),
        "fora_textos": int(len(fora_textos)),
        "categorias": cats,
        "x": [round(float(v), 2) for v in p[:, 0]],
        "y": [round(float(v), 2) for v in p[:, 1]],
        "empresa": cod("empresa"),
        "loja": cod("loja"),
        "tema": cod("tema"),
        "nota": [int(v) for v in d["nota"]],
        "reclamacao": [-1 if pd.isna(v) else int(bool(v)) for v in d["reclamacao"]],
        "conf_tema": [-1 if pd.isna(v) else int(round(100 * float(v))) for v in d["conf_tema"]],
        "texto": [_curto(t) for t in d["texto_mostrado"]],
    }


def mapa(est: pd.DataFrame) -> dict:
    t0 = time.perf_counter()
    out = {"gerado_em": agora().strftime("%Y-%m-%dT%H:%M:%S%z"),
           "metodo": "TF-IDF (palavras e pares de palavras) + TruncatedSVD (100 componentes) + t-SNE (2D), "
                     "random_state=42",
           "segmentos": {}}
    for seg, d in est.groupby("segmento", sort=False):
        if len(d) < 50:
            print(f"  mapa {seg}: só {len(d)} avaliações, fica sem mapa")
            continue
        m = mapa_segmento(d)
        out["segmentos"][seg] = m
        print(f"  mapa {seg}: entraram {len(d)} avaliações ({m['n_textos'] + m['fora_textos']} textos diferentes); "
              f"saíram {m['n']} pontos; {m['fora']} ficaram de fora ({m['fora_textos']} textos sem nenhuma palavra "
              "do vocabulário, como só emojis ou só stopwords)")
    out["segundos"] = round(time.perf_counter() - t0, 1)
    return out


def gravar_mapa(m: dict) -> None:
    PAINEL.mkdir(parents=True, exist_ok=True)
    arq = PAINEL / "mapa.json"
    arq.write_text(json.dumps(m, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"  gravado docs/painel/mapa.json ({arq.stat().st_size // 1024} KB, {m['segundos']} s)")


# ---------------------------------------------------------------- regressão

def regressao_segmento(d: pd.DataFrame, minimo: int = MIN_RECLAMACOES) -> dict | None:
    """OLS nota ~ C(tema) + C(empresa) + C(loja) nas reclamações, com médias ajustadas por tema."""
    import patsy
    import statsmodels.formula.api as smf

    ent = len(d)
    d = d[d["reclamacao"].notna() & d["tema"].notna()]
    d = d[d["reclamacao"].astype(bool)].copy()
    if len(d) < minimo:
        return None
    cont = d["tema"].value_counts()
    grandes = [t for t in cont.index if cont[t] >= minimo]
    if len(grandes) < 2:
        return None
    # temas pequenos ficam juntos numa categoria só: entram no modelo, mas não na comparação
    pequenos = "temas com menos de %d reclamações" % minimo
    d["tema_m"] = d["tema"].where(d["tema"].isin(grandes), pequenos)
    termos = ["C(tema_m)"] + [f"C({c})" for c in ("empresa", "loja") if d[c].nunique() > 1]
    formula = "nota ~ " + " + ".join(termos)
    res = smf.ols(formula, data=d).fit(cov_type="HC3")
    info, beta, v = res.model.data.design_info, res.params.to_numpy(), res.cov_params().to_numpy()

    temas = []
    for t in grandes:
        x = patsy.build_design_matrices([info], d.assign(tema_m=t), return_type="dataframe")[0].mean().to_numpy()
        m, ep = float(x @ beta), float(np.sqrt(x @ v @ x))
        temas.append({"tema": t, "n": int(cont[t]), "media_ajustada": round(m, 2),
                      "ic_inf": round(m - 1.96 * ep, 2), "ic_sup": round(m + 1.96 * ep, 2),
                      "media_bruta": round(float(d.loc[d["tema"] == t, "nota"].mean()), 2)})
    temas.sort(key=lambda r: r["media_ajustada"])
    # a frase fala dos temas específicos ("outro", "crítica geral" e "elogio geral" não dizem qual é o problema)
    esp = [r for r in temas if r["tema"] not in NAO_ESPECIFICOS] or temas
    a, z = esp[0], esp[-1]
    b = esp[1] if len(esp) > 2 else None
    if b and b["ic_inf"] <= a["ic_sup"]:  # os intervalos se cruzam: não dá para separar os dois
        destaques = [a["tema"], b["tema"]]
        frase = (f"Entre as reclamações, {a['tema']} e {b['tema']} têm as menores notas "
                 f"({_fmt(a['media_ajustada'])} e {_fmt(b['media_ajustada'])})")
    else:
        destaques = [a["tema"]]
        frase = f"Entre as reclamações, {a['tema']} tem a menor nota ({_fmt(a['media_ajustada'])})"
    frase += f", mesmo comparando o mesmo app e a mesma loja; {z['tema']} tem a maior ({_fmt(z['media_ajustada'])})"
    return {
        "formula": formula.replace("tema_m", "tema"),
        "n": int(len(d)),
        "n_fora": int(ent - len(d)),
        "n_temas_pequenos": int((d["tema_m"] == pequenos).sum()),
        "r2": round(float(res.rsquared), 3),
        "r2_ajustado": round(float(res.rsquared_adj), 3),
        "temas": temas,
        "destaques": destaques,
        "conclusao": frase,
    }


def regressao(est: pd.DataFrame) -> dict:
    out = {}
    for seg, d in est.groupby("segmento", sort=False):
        r = regressao_segmento(d)
        if r is None:
            print(f"  regressão {seg}: reclamações insuficientes, fica de fora")
            continue
        out[seg] = r
        print(f"  regressão {seg}: entraram {len(d)} avaliações; {r['n']} reclamações com tema no modelo "
              f"({r['n_fora']} saíram: não reclamam ou estão sem tema); {len(r['temas'])} temas comparados; "
              f"R² = {r['r2']:.2f}")
    return out
