import express from "express";
import controller from "../controllers/usuarioController.js";
import { authMiddleware, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", controller.create);
router.post("/login", controller.login);
router.get("/", authMiddleware, authorize(["porteiro", "admin"]), controller.retrieveAll);
router.get("/:id", authMiddleware, controller.retrieveOne);
router.put("/", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;