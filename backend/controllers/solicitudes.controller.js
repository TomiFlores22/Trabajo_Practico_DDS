import solicitudesService from "../services/solicitudes.service.js";

class SolicitudesController {

    async crear(req, res) {
        try {

            const datosSolicitud = { ...req.body, usuarioId: req.usuario.id };
            const nuevaSolicitud = await solicitudesService.crear(datosSolicitud);
            res.status(201).json(nuevaSolicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async obtenerTodas(req, res) {
        try {
            const resultado = await solicitudesService.obtenerTodas(req.query);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const solicitud = await solicitudesService.obtenerPorId(req.params.id);
            res.json(solicitud);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try{
            const id = req.params.id;
            const usuarioModificador = req.usuario;

            const resultado = await solicitudesService.actualizar(id, req.body, usuarioModificador);

            // 💡 NOTA PARA LAUTI: Acá abajo él va a meter su línea del historial:
            // await historialService.registrarCambio(id, usuarioModificador.id, "Modificación", { estado: resultado.estadoAnterior }, { estado: resultado.nuevoEstado });

            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

export default new SolicitudesController();

