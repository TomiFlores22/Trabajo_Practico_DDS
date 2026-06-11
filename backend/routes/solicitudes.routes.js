import {Router} from 'express';
import solicitudesController from '../controllers/solicitudes.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, solicitudesController.crear);
router.get('/', verificarToken, solicitudesController.obtenerTodas);
router.get("/:id/historial",verificarToken, solicitudesController.obtenerHistorial);
router.get('/:id', verificarToken, solicitudesController.obtenerPorId);
router.put('/:id', verificarToken, solicitudesController.actualizar);

export default router;
