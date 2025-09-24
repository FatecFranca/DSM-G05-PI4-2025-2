import express from "express";
import controller from "../controllers/listaControleController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, controller.registrarEntrada);
router.patch("/:id/saida", authMiddleware, controller.registrarSaida);
router.get("/", authMiddleware, controller.listarRegistros);

export default router;