import historialService from "../services/historial.service.js";
import solicitudesService from "../services/solicitudes.service.js";

class SolicitudesController {

    async obtenerHistorial(req, res, next) {
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
            next(error) ;
        }
    }

    async crear(req, res, next) {
        try {

            const datosSolicitud = { ...req.body, usuarioId: req.usuario.id };
            const nuevaSolicitud = await solicitudesService.crear(datosSolicitud);
            res.status(201).json(nuevaSolicitud);
        } catch (error) {
            next(error);
        }
    }

    async obtenerTodas(req, res, next) {
        try {
            const resultado = await solicitudesService.obtenerTodas(req.query, req.usuario);
            res.json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const solicitud = await solicitudesService.obtenerPorId(req.params.id, req.usuario);
            res.json(solicitud);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const id = req.params.id;
            const usuarioModificador = req.usuario;

            const resultado = await solicitudesService.actualizar(id, req.body, usuarioModificador);;


            res.json(resultado.solicitud);
        } catch (error) {
            next(error);
        }
    }


    async aprobar(req, res, next) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Aprobada" },
                req.usuario
            );

            res.json(resultado.solicitud);

        } catch (error) {
            next(error);
        }
    }

    async rechazar(req, res, next) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Rechazada" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            next(error);
        }
    }

    async cancelar(req, res, next) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Cancelada" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            next(error);
        }
    }

    async devolver(req, res, next) {
        try {
            const resultado = await solicitudesService.actualizar(
                req.params.id,
                { estado: "Devuelta" },
                req.usuario
            );

            res.json(resultado.solicitud);
        } catch (error) {
            next(error);
        }
    }


    async obtenerResumen(req, res, next) {
        try {

            const resumen =
                await solicitudesService.obtenerResumen();

            res.json(resumen);

        } catch (error) {
            next(error);
        }
    }

}

          

export default new SolicitudesController();

