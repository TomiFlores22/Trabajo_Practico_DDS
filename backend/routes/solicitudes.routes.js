import {Router} from 'express';
import solicitudesController from '../controllers/solicitudes.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { autorizarRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.post('/', verificarToken, solicitudesController.crear);
router.get('/', verificarToken, solicitudesController.obtenerTodas);
router.get("/resumen", verificarToken, autorizarRoles("admin"), solicitudesController.obtenerResumen);
router.patch("/:id/aprobar", verificarToken, solicitudesController.aprobar);
router.patch("/:id/rechazar", verificarToken, solicitudesController.rechazar);
router.patch("/:id/cancelar", verificarToken, solicitudesController.cancelar);
router.patch("/:id/devolver", verificarToken, solicitudesController.devolver);
router.get("/:id/historial",verificarToken, solicitudesController.obtenerHistorial);
router.get('/:id', verificarToken, solicitudesController.obtenerPorId);
router.put('/:id', verificarToken, solicitudesController.actualizar);

export default router;
