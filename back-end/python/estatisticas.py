import sys
import json
import pandas as pd
from scipy.stats import skew, kurtosis
from sklearn.linear_model import LinearRegression

def calcular_estatisticas_e_regressao(dados):
    if isinstance(dados, dict) and "registros" in dados:
        dados = dados["registros"]

    if not dados or not isinstance(dados, list):
        return {"erro": "Nenhum dado recebido ou formato inválido."}

    df = pd.DataFrame(dados)

    if "horaEntrada" not in df.columns or "horaSaida" not in df.columns:
        return {"erro": "Colunas horaEntrada/horaSaida ausentes."}

    df = df.dropna(subset=["horaEntrada"])
    df["horaEntrada"] = pd.to_datetime(df["horaEntrada"])
    df["horaSaida"] = pd.to_datetime(df["horaSaida"])

    df["tempo_min"] = (
        (df["horaSaida"] - df["horaEntrada"])
        .dt.total_seconds() / 60
    ).round(2)

    df = df.dropna(subset=["tempo_min"])

    tempos_min = df["tempo_min"]

    if len(tempos_min) == 0:
        return {"erro": "Sem dados válidos para cálculo."}

    estatisticas = {
        "media": round(tempos_min.mean(), 2),
        "mediana": round(tempos_min.median(), 2),
        "moda": tempos_min.mode().iloc[0] if not tempos_min.mode().empty else None,
        "desvio_padrao": round(tempos_min.std(), 2),
        "assimetria": round(skew(tempos_min), 2) if len(tempos_min) > 2 else None,
        "curtose": round(kurtosis(tempos_min), 2) if len(tempos_min) > 3 else None,
        "probabilidade_>90min": round(
            (tempos_min[tempos_min > 90].count() / len(tempos_min)) * 100, 2
        )
    }

    df["hora_decimal"] = df["horaEntrada"].dt.hour + df["horaEntrada"].dt.minute / 60

    X = df[["hora_decimal"]].values
    y = df["tempo_min"].values

    if len(df) > 2:
        modelo = LinearRegression()
        modelo.fit(X, y)

        estatisticas["regressao"] = {
            "coeficiente": round(float(modelo.coef_[0]), 4),  
            "intercepto": round(float(modelo.intercept_), 4),  
            "r2": round(modelo.score(X, y), 3)                 
        }
    else:
        estatisticas["regressao"] = "Dados insuficientes para regressão."

    return estatisticas

if __name__ == "__main__":
    entrada = sys.stdin.read()
    dados = json.loads(entrada)

    resultado = calcular_estatisticas_e_regressao(dados)
    print(json.dumps(resultado))