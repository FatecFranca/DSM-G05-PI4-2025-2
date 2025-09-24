import express from "express";
import controller from "../controllers/veiculoController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.retrieveAll);
router.get("/:id", authMiddleware, controller.retrieveOne);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;