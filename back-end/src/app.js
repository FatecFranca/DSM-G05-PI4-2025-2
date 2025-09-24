import express from "express";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";
import listaControleRoutes from "./routes/listaControleRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/lista-controle", listaControleRoutes);

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

export default app;