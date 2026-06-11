import historialService from "../services/historial.service.js";
import solicitudesService from "../services/solicitudes.service.js";

class SolicitudesController {

    async obtenerHistorial(req, res) {
        try {
            const { id } = req.params;
            await solicitudesService.obtenerPorId(
                id,
                req.usuario
            );
            const historial =
                await historialService.obtenerPorSolicitud(id);
            res.json(historial);
        } catch (error) {
            const statusCode =
                error.message
                    .toLowerCase()
                    .includes("denegado")
                    ? 403
                    : 500;
            res.status(statusCode).json({
                error: error.message
            });
        }
    }

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
            const statusCode = error.message.includes("denegado") ? 403 : 404;
            res.status(statusCode).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const id = req.params.id;
            const usuarioModificador = req.usuario;

            const resultado = await solicitudesService.actualizar(id, req.body, usuarioModificador);;


            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    async aprobar(req, res) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Aprobada" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async rechazar(req, res) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Rechazada" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancelar(req, res) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Cancelada" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async devolver(req, res) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Devuelta" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    async obtenerResumen(req, res) {
        try {

            const resumen =
                await solicitudesService.obtenerResumen();

            res.json(resumen);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }
    }

}

export default new SolicitudesController();

