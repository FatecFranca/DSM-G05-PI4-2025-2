# 🚗 **Monit -- Sistema Inteligente de Monitoramento de Acesso de Veículos**

Repositório do **GRUPO 05** do Projeto Interdisciplinar do 4º semestre
DSM 2025/2.

**Integrantes:** 
- Eduardo Gibertoni Camillo
- Gustavo Schizari Ferreira Filho
- Lívia Portela Ferreira
- Maria Clara Cardoso Costa

------------------------------------------------------------------------

# 🚀 Funcionalidades principais

-   Login e autenticação
-   Gestão de moradores, veículos e visitantes
-   Registro automático de entrada e saída
-   OCR via IoT
-   Sincronização API / Mobile / Web / IoT
-   Estatísticas e previsões

------------------------------------------------------------------------

# 📁 Estrutura do Repositório

    Monit/
    │── back-end/
    │── mobile/
    │── web/
    │── leitor_placa_iot/
    └── README.md

------------------------------------------------------------------------

# 🧪 Execução dos módulos

------------------------------------------------------------------------

# 1️⃣ **Back-end (API)**

Crie o arquivo `.env`:

    DATABASE_URL="mysql://dev:Senha@localhost:3306/monit"
    SECRET="Secret"

Rodar:

    npm install
    npx prisma migrate dev
    npm run dev

------------------------------------------------------------------------

# 2️⃣ **Mobile (React Native)**

Entre no diretório:

    cd mobile
    npm install

Edite o arquivo **`app.json`**, substituindo `SEU_IPV4_AQUI` pelo seu
IPv4 real:

``` json
{
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "splash": {
      "image": "./assets/logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "extra": {
      "BASE_URL": "http://SEU_IPV4_AQUI:8080"
    },
    "android": {
      "package": "com.anonymous.mobile"
    }
  }
}
```

Iniciar o Expo:

    npx expo start

------------------------------------------------------------------------

# 3️⃣ **Web (React.js)**

    cd web
    npm install
    npm start

------------------------------------------------------------------------

# 4️⃣ **Leitor de Placas (IoT -- Python)**

    cd leitor_placa_iot
    pip install flask easyocr opencv-python numpy requests
    python leitor_placa.py

------------------------------------------------------------------------

# 📦 Bibliotecas Python

    pip install pandas scipy scikit-learn flask easyocr opencv-python numpy requests

------------------------------------------------------------------------

# 🛠 Requisitos Gerais

-   Node.js
-   Python 3.10+
-   MySQL
-   IPV4 configurado no mobile, web e IoT\
-   Prisma instalado
