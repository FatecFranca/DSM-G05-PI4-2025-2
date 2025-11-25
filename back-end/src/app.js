import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { spawn } from "child_process";
import dotenv from "dotenv";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";
import listaControleRoutes from "./routes/listaControleRoutes.js";
import visitanteRoutes from "./routes/visitanteRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const swaggerPath = new URL("./docs/swagger.json", import.meta.url);
const swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

app.use("/usuarios", usuarioRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/lista-controle", listaControleRoutes);
app.use("/visitantes", visitanteRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/estatisticas", (req, res) => {
  try {
    const py = spawn("python3", ["./python/estatisticas.py"]);

    let dataString = "";
    let errorString = "";

    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();

    py.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("Script Python finalizou com erro:", errorString);
        return res.status(500).json({ erro: errorString || "Erro desconhecido no Python" });
      }

      if (!dataString.trim()) {
        console.error("Nenhum resultado recebido do Python.");
        return res.status(500).json({ erro: "Python não retornou dados." });
      }

      try {
        const result = JSON.parse(dataString);
        return res.json(result);
      } catch (err) {
        console.error("Erro ao interpretar resposta do Python:", dataString);
        res.status(500).json({ erro: "Erro ao interpretar resposta do Python." });
      }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em: ${PORT}`);
});

export default app;