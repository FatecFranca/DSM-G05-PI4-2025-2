from flask import Flask, request
import easyocr
import cv2
import numpy as np
import re
import requests  

app = Flask(__name__)
reader = easyocr.Reader(['en'])

# URL do endpoint que retorna os veículos
URL_VEICULOS = "http://72.60.58.66:9000/veiculos"


def buscar_placas():
    try:
        response = requests.get(URL_VEICULOS, timeout=5)
        response.raise_for_status()

        dados = response.json()

        # Ajuste conforme o formato real da sua API
        # Exemplo esperado: [{"placa": "FYW4100"}, {"placa": "ABC1D23"}]
        placas = [item["placa"].replace("-", "").upper() for item in dados]

        print("Placas liberadas da API:", placas)
        return placas

    except Exception as e:
        print("Erro ao buscar placas:", e)
        return []


def extrair_placa(texto):
    padrao = r"([A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2})"
    placas = re.findall(padrao, texto.upper())
    return placas[0].replace("-", "") if placas else ""


@app.route("/ocr", methods=["POST"])
def ocr():
    try:
        image_bytes = request.data
        npimg = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        # OCR
        results = reader.readtext(img, detail=0)
        texto_completo = " ".join(results)
        placa = extrair_placa(texto_completo)

        print("Texto OCR:", texto_completo)
        print("Placa detectada:", placa)

        # Busca placas liberadas no endpoint
        placas_liberadas = buscar_placas()

        if placa and placa in placas_liberadas:
            return "LIBERADO"
        else:
            return "NEGADO"

    except Exception as e:
        print("Erro:", e)
        return "NEGADO"


app.run(host="0.0.0.0", port=5000)