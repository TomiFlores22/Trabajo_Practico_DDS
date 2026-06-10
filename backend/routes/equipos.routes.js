import { autorizarRoles } from "../middlewares/roles.middleware.js";
import { Router } from "express";
import { listarEquipos } from "../controllers/equipos.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/",
    verificarToken,
    autorizarRoles("admin"),
    listarEquipos
);

export default router;
