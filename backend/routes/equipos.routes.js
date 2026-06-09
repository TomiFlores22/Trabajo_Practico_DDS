import { Router } from "express";
import { listarEquipos } from "../controllers/equipos.controller.js";

const router = Router();

router.get("/", listarEquipos);

export default router;