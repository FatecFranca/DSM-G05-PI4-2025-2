import cv2
import pytesseract
import numpy as np
import imutils
import re
import csv
from datetime import datetime
import os

# CONFIGURAÇÕES - ajuste conforme necessário
# Caminho onde o tesseract está instalado (Windows) informado por você:
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\NITRO 5\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

# Pasta onde salvar capturas e CSV
OUTPUT_DIR = "placas_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)
CSV_PATH = os.path.join(OUTPUT_DIR, "detections.csv")

# Regex para placas (padrão antigo BBB9999 e versão com espaço BBB 9999).
# Mercosul tem variações; aqui incluímos o padrão clássico que é o mais comum.
PLATE_REGEXES = [
    re.compile(r"[A-Z]{3}\s?\d{4}"),      # Ex: ABC1234 or ABC 1234
    re.compile(r"[A-Z]{3}\d[A-Z]\d{2}")   # tentativa para capturar padrões mistos (opcional)
]

# Função utilitária: tenta extrair string com OCR e filtra por regex
def extract_plate_text(img):
    # Forçar whitelist de caracteres (alfanumérico maiúsculo)
    custom_config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    text = pytesseract.image_to_string(img, config=custom_config)
    # Limpeza básica: manter só caracteres alfanuméricos e espaços
    cleaned = re.sub(r'[^A-Z0-9 ]', '', text.upper())
    # Procurar por possíveis placas
    for rx in PLATE_REGEXES:
        m = rx.search(cleaned)
        if m:
            return m.group(0).replace(" ", "")
    return None

# Inicializa arquivo CSV (se não existir, cria com cabeçalho)
if not os.path.exists(CSV_PATH):
    with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "plate", "image_path"])

# Inicializa câmera (índice 0 - webcam padrão)
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Erro: não foi possível abrir a câmera. Verifique o índice da câmera e permissões.")
    raise SystemExit

print("Iniciando captura. Pressione 'E' para sair, 'S' para salvar o frame atual manualmente.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Falha ao ler frame da câmera.")
        break

    # Redimensiona para velocidade e padroniza
    frame = imutils.resize(frame, width=800)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Aparência suave mas preservando bordas
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    edged = cv2.Canny(gray, 30, 200)

    # Encontrar contornos e ordená-los por área (maiores primeiro)
    contours = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(contours)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:50]

    plate_candidate = None
    plate_box = None

    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.018 * peri, True)
        # Procuramos por contornos quadriláteros
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(approx)
            aspect = w / float(h)
            area = cv2.contourArea(approx)
            # Filtros heurísticos para placas: aspecto e área mínimos
            if 2.0 < aspect < 6.0 and area > 2000:
                plate_candidate = approx
                plate_box = (x, y, w, h)
                break

    display = frame.copy()
    ocr_result = None

    if plate_candidate is not None and plate_box is not None:
        x, y, w, h = plate_box
        # Expandir um pouco o ROI para garantir que a borda da placa fique incluída
        pad_x = int(w * 0.03)
        pad_y = int(h * 0.06)
        x1 = max(x - pad_x, 0)
        y1 = max(y - pad_y, 0)
        x2 = min(x + w + pad_x, frame.shape[1])
        y2 = min(y + h + pad_y, frame.shape[0])
        plate_img_color = frame[y1:y2, x1:x2]
        plate_img_gray = cv2.cvtColor(plate_img_color, cv2.COLOR_BGR2GRAY)
        plate_img_gray = cv2.resize(plate_img_gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        plate_img_gray = cv2.bilateralFilter(plate_img_gray, 11, 17, 17)
        _, plate_thresh = cv2.threshold(plate_img_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Tenta extrair texto
        try:
            ocr = extract_plate_text(plate_thresh)
            ocr_result = ocr
        except Exception as e:
            ocr_result = None

        # Desenhar retângulo e resultado na imagem principal
        cv2.drawContours(display, [plate_candidate], -1, (0, 255, 0), 2)
        cv2.rectangle(display, (x1, y1), (x2, y2), (255, 0, 0), 2)
        if ocr_result:
            cv2.putText(display, f"Plate: {ocr_result}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

    # Mostrar frame
    cv2.imshow("License Plate Reader", display)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('e'):
        break
    if key == ord('s'):
        # Salvar frame inteiro para inspeção
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(OUTPUT_DIR, f"frame_{timestamp}.jpg")
        cv2.imwrite(filename, frame)
        print(f"Frame salvo: {filename}")

    # Se houver detecção OCR válida, salvar em CSV e imagem da placa
    if ocr_result:
        timestamp = datetime.now().isoformat(sep=' ', timespec='seconds')
        plate_clean = re.sub(r'[^A-Z0-9]', '', ocr_result.upper())
        img_name = f"plate_{plate_clean}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        img_path = os.path.join(OUTPUT_DIR, img_name)
        # salvar a imagem da placa (region of interest)
        try:
            cv2.imwrite(img_path, plate_thresh)
        except Exception:
            cv2.imwrite(img_path, plate_img_gray)

        # Append ao CSV
        with open(CSV_PATH, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([timestamp, plate_clean, img_path])
        print(f"[{timestamp}] Detected plate: {plate_clean} -> {img_path}")
        # Evitar múltiplas escritas para o mesmo frame: esperar um pouco
        # Aqui fazemos um pequeno delay visual (sem travar a UI)
        cv2.waitKey(500)

# Cleanup
cap.release()
cv2.destroyAllWindows()
