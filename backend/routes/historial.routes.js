import { Router } from "express";
import historialController from "../controllers/historial.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/:id",
    verificarToken,
    historialController.obtenerPorSolicitud
);

export default router;