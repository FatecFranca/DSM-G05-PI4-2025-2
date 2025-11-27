import cv2
import pytesseract
import numpy as np
import imutils
import re
import csv
from datetime import datetime
import os
import requests
import serial
import time

# ================================
# CONFIGURAÇÕES
# ================================

ESP32_PORT = "COM6"     # <-- SUA PORTA!
ESP32_BAUD = 115200

# abrir o serial (tenta conectar)
try:
    esp = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
    time.sleep(2)
    print("ESP32 conectado na porta", ESP32_PORT)
except Exception as e:
    print("ERRO ao conectar no ESP32:", e)
    esp = None

# CONFIG TESSERACT
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\NITRO 5\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

# PASTAS / CSV
OUTPUT_DIR = "placas_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)
CSV_PATH = os.path.join(OUTPUT_DIR, "detections.csv")

# ENDPOINTS
URL_VEICULOS = "http://72.60.58.66:9000/veiculos"
URL_REGISTRO = "http://72.60.58.66:9000/lista-controle"

# REGEX
PLATE_REGEXES = [
    re.compile(r"[A-Z]{3}\s?\d{4}"),
    re.compile(r"[A-Z]{3}\d[A-Z]\d{2}")
]

# ================================
# FUNÇÕES
# ================================

def verificar_placa_liberada(placa):
    try:
        resp = requests.get(URL_VEICULOS, timeout=5)
        lista = resp.json()

        placas_liberadas = [
            v["placa"].replace("-", "").upper()
            for v in lista
            if "placa" in v
        ]

        return placa.upper() in placas_liberadas

    except Exception as e:
        print("Erro ao acessar servidor:", e)
        return False


def enviar_registro(placa):
    try:
        payload = {"placa": placa, "motivo": "Morador"}
        resp = requests.post(URL_REGISTRO, json=payload, timeout=5)

        if resp.status_code == 200:
            print("Registro enviado:", payload)
        else:
            print("ERRO:", resp.status_code, resp.text)

    except Exception as e:
        print("Erro ao enviar registro:", e)


def extract_plate_text(img):
    config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    text = pytesseract.image_to_string(img, config=config)
    cleaned = re.sub(r'[^A-Z0-9 ]', '', text.upper())

    for rx in PLATE_REGEXES:
        m = rx.search(cleaned)
        if m:
            return m.group(0).replace(" ", "")

    return None


# cria CSV se não existir
if not os.path.exists(CSV_PATH):
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "plate", "image_path"])

# ================================
# CAPTURA DE VÍDEO
# ================================

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Erro câmera.")
    exit()

print("Iniciando captura... (E sair | S salvar)")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Erro frame.")
        break

    frame = imutils.resize(frame, width=800)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    edged = cv2.Canny(gray, 30, 200)

    contours = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(contours)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:40]

    plate_candidate = None
    plate_box = None
    ocr_result = None

    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.018 * peri, True)

        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(approx)
            aspect = w / float(h)
            area = cv2.contourArea(approx)

            if 2.0 < aspect < 6.0 and area > 2000:
                plate_candidate = approx
                plate_box = (x, y, w, h)
                break

    display = frame.copy()

    if plate_box:
        x, y, w, h = plate_box
        pad_x = int(w * 0.03)
        pad_y = int(h * 0.06)
        x1 = max(x - pad_x, 0)
        y1 = max(y - pad_y, 0)
        x2 = min(x + w + pad_x, frame.shape[1])
        y2 = min(y + h + pad_y, frame.shape[0])

        plate_img = frame[y1:y2, x1:x2]
        plate_gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
        plate_gray = cv2.resize(plate_gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        plate_gray = cv2.bilateralFilter(plate_gray, 11, 17, 17)
        _, plate_thresh = cv2.threshold(plate_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        try:
            ocr_result = extract_plate_text(plate_thresh)
        except:
            ocr_result = None

    cv2.imshow("OCR", display)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('e'):
        break

    # ---------------------------------------
    # SE ENCONTROU UMA PLACA
    # ---------------------------------------
    if ocr_result:
        placa = re.sub(r'[^A-Z0-9]', '', ocr_result)

        print(f"\n=== PLACA DETECTADA: {placa} ===")

        liberado = verificar_placa_liberada(placa)

        if liberado:
            print("PLACA LIBERADA! Enviando registro...")

            enviar_registro(placa)

            # ---- ENVIA COMANDO PARA ESP32 ----
            if esp:
                print("Enviando comando ABRIR para o ESP32...")
                esp.write(b"ABRIR\n")

        else:
            print("Placa NAO liberada.")

        # Salvar imagem e CSV
        timestamp = datetime.now().isoformat(sep=" ", timespec="seconds")
        img_name = f"plate_{placa}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        img_path = os.path.join(OUTPUT_DIR, img_name)

        cv2.imwrite(img_path, plate_gray)

        with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([timestamp, placa, img_path])

        print("Salvo:", img_path)
        cv2.waitKey(500)

cap.release()
cv2.destroyAllWindows()
