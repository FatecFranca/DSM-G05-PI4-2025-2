import sys
import json
import pandas as pd
from scipy.stats import skew, kurtosis

def calcular_estatisticas(dados):
    if isinstance(dados, dict) and "registros" in dados:
        dados = dados["registros"]

    if not dados or not isinstance(dados, list):
        return {"erro": "Nenhum dado recebido ou formato inválido."}

    df = pd.DataFrame(dados)

    if "horaEntrada" not in df.columns or "horaSaida" not in df.columns:
        return {"erro": "Colunas horaEntrada/horaSaida ausentes."}

    df = df.dropna(subset=["horaEntrada"])
    df["horaEntrada"] = pd.to_datetime(df["horaEntrada"], errors="coerce")
    df["horaSaida"] = pd.to_datetime(df["horaSaida"], errors="coerce")

    df["tempo_min"] = (df["horaSaida"] - df["horaEntrada"]).dt.total_seconds() / 60
    df = df.dropna(subset=["tempo_min"])

    tempos = df["tempo_min"]

    if len(tempos) == 0:
        return {"erro": "Sem dados válidos para cálculo."}

    return {
        "media": round(tempos.mean(), 2),
        "mediana": round(tempos.median(), 2),
        "moda": tempos.mode().iloc[0] if not tempos.mode().empty else None,
        "desvio_padrao": round(tempos.std(), 2),
        "assimetria": round(skew(tempos), 2) if len(tempos) > 2 else None,
        "curtose": round(kurtosis(tempos), 2) if len(tempos) > 3 else None,
        "probabilidade_>90min": round((tempos[tempos > 90].count() / len(tempos)) * 100, 2)
    }

if __name__ == "__main__":
    entrada = sys.stdin.read()
    dados = json.loads(entrada)

    resultado = calcular_estatisticas(dados)
    print(json.dumps(resultado)) 