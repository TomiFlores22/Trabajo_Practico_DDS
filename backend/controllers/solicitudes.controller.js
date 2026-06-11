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
            const resultado = await solicitudesService.obtenerTodas(req.query, req.usuario);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const solicitud = await solicitudesService.obtenerPorId(req.params.id, req.usuario);
            res.json(solicitud);
        } catch (error) {
            const statusCode = error.message.includes("Denegado") ? 403 : 404;
            res.status(statusCode).json({ error: error.message});
        }
    }

    async actualizar(req, res) {
        try{
            const id = req.params.id;
            const usuarioModificador = req.usuario;

            const resultado = await solicitudesService.actualizar(id, req.body, usuarioModificador);;

            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

export default new SolicitudesController();

