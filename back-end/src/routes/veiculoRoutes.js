import express from "express";
import controller from "../controllers/veiculoController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, controller.create);
router.get("/", controller.retrieveAll);
router.get("/:id", authMiddleware, controller.retrieveOne);
router.patch("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;