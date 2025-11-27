import express from "express";
import controller from "../controllers/listaControleController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", controller.registrarEntrada);
router.patch("/:id/saida", controller.registrarSaida);
router.get("/", controller.listarRegistros);

export default router;
