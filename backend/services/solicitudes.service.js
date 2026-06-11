import Solicitud from '../models/solicitud.model.js';
import Equipo from '../models/equipo.model.js';
import historialService from './historial.service.js';
import { Op } from 'sequelize';
import AppError from "../utils/AppError.js";

class SolicitudesService {


    async crear(datos) {
        const { equipoId, usuarioId, fechaRetiro, fechaDevolucion, motivo } = datos;

        if (!motivo || !motivo.trim()) {
    throw new AppError(
        'Debe ingresar un motivo para la solicitud.',
        400
    );
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (new Date(fechaRetiro) < hoy) {
            throw new AppError(
                'La fecha de retiro no puede ser anterior a la fecha actual.',
                400
            );
        }

        if (new Date(fechaRetiro) >= new Date(fechaDevolucion)) {
            throw new AppError(
                'La fecha de retiro debe ser anterior a la fecha de devolución.',
                400
            );
        }

        const equipo = await Equipo.findByPk(equipoId);
        if (!equipo) throw new AppError('Equipo no encontrado.', 404);
        if (equipo.estado === 'Baja') throw new AppError('No se pueden realizar solicitudes sobre un equipo dado de baja.', 400);

        const solicitudSuperpuesta = await Solicitud.findOne({
            where: {
                equipoId: equipoId,
                estado: 'Aprobada',
                fechaRetiro: { [Op.lte]: fechaDevolucion },
                fechaDevolucion: { [Op.gte]: fechaRetiro }
            }
        });
        if (solicitudSuperpuesta) {
            throw new AppError('Ya existe una solicitud aprobada para este equipo en el rango de fechas especificado.', 400);
        }
        const nuevaSolicitud = await Solicitud.create({
            equipoId,
            usuarioId,
            fechaRetiro,
            fechaDevolucion,
            motivo: motivo.trim(),
            estado: 'Pendiente',
            autorizadoPor: null
        });

        return nuevaSolicitud;
    }


    async obtenerTodas(query, usuarioLogueado) {
        const { estado, equipoID, categoria, desde, hasta, page = 1, limit = 5, sortBy = 'fechaRetiro', order = 'ASC' } = query;

        const filtros = {};
        if (usuarioLogueado.rol !== 'admin') {
            filtros.usuarioId = usuarioLogueado.id;
        }

        if (estado) filtros.estado = estado;
        if (equipoID) filtros.equipoId = equipoID;

        if (desde && hasta) {
            filtros.fechaRetiro = { [Op.between]: [desde, hasta] };
        } else if (desde) {
            filtros.fechaRetiro = { [Op.gte]: desde };
        } else if (hasta) {
            filtros.fechaRetiro = { [Op.lte]: hasta };
        }

        const limiteNumero = parseInt(limit);
        const offsetNumero = (parseInt(page) - 1) * limiteNumero;

        const { count, rows } = await Solicitud.findAndCountAll({
            where: filtros,
            limit: limiteNumero,
            offset: offsetNumero,
            order: [[sortBy, order]],
            include: [
                {
                    model: Equipo,
                    attributes: ['nombre', 'codigoInventario', 'categoria'],
                    ...(categoria && {
                        where: { categoria }
                    })
                }
            ]
        });

        return {
            totalItems: count,
            paginasTotales: Math.ceil(count / limiteNumero),
            paginaActual: parseInt(page),
            solicitudes: rows
        };
    }


    async obtenerPorId(id, usuarioLogueado) {
        const solicitud = await Solicitud.findByPk(id, {
            include: [{ model: Equipo }]
        });
        if (!solicitud) {
            throw new AppError(
                'Solicitud no encontrada.',
                404
            );
        }
        if (
            usuarioLogueado.rol !== 'admin' &&
            solicitud.usuarioId !== usuarioLogueado.id
        ) {
            throw new AppError(
                'Acceso denegado: No tienes permisos para visualizar esta solicitud.',
                403
            );
        }
        return solicitud;
    }


    async actualizar(id, datos, usuarioModificador) {
        const solicitud = await this.obtenerPorId(id, usuarioModificador);

        const estadoAnterior = solicitud.estado;
        const nuevoEstado = datos.estado;

        if (!datos.estado) {

            if (solicitud.estado !== "Pendiente") {
                throw new AppError(
                    "Solo se pueden editar solicitudes pendientes.",
                    400
                );
            }

            await solicitud.update({
                fechaRetiro: datos.fechaRetiro ?? solicitud.fechaRetiro,
                fechaDevolucion: datos.fechaDevolucion ?? solicitud.fechaDevolucion,
                motivo: datos.motivo ?? solicitud.motivo
            });

            return {
                solicitud
            };
        }



        if (nuevoEstado && nuevoEstado !== estadoAnterior) {
            if (nuevoEstado && nuevoEstado !== estadoAnterior) {

                if (estadoAnterior === 'Pendiente') {
                    if (!['Aprobada', 'Rechazada', 'Cancelada'].includes(nuevoEstado)) {
                        throw new AppError(`Transición inválida: No se puede cambiar de ${estadoAnterior} a ${nuevoEstado}.`, 400);
                    }
                }
                else if (estadoAnterior === 'Aprobada') {
                    if (nuevoEstado !== 'Devuelta') {
                        throw new AppError(`Transición inválida: Una solicitud Aprobada solo puede pasar a Devuelta.`, 400);
                    }
                }
                else if (['Rechazada', 'Cancelada', 'Devuelta'].includes(estadoAnterior)) {
                    throw new AppError(`Acción denegada: La solicitud ya se encuentra en un estado final (${estadoAnterior}) y no puede reabrirse.`, 400);
                }

                if (['Aprobada', 'Rechazada'].includes(nuevoEstado)) {
                    if (usuarioModificador.rol !== 'admin') {
                        throw new AppError(
                            'Solo los administradores pueden Aprobar o Rechazar solicitudes.',
                            403
                        );
                    }

                    solicitud.autorizadoPor = usuarioModificador.id;
                }

                if (nuevoEstado === 'Cancelada') {
                    if (usuarioModificador.rol !== 'admin' && solicitud.usuarioId !== usuarioModificador.id) {
                        throw new AppError('Acceso denegado: No puedes cancelar una solicitud que no te pertenece.', 403);
                    }
                }

                if (nuevoEstado === 'Aprobada') {
                    const conflictoTemporal = await Solicitud.findOne({
                        where: {
                            id: { [Op.ne]: id },
                            equipoId: solicitud.equipoId,
                            estado: 'Aprobada',
                            fechaRetiro: { [Op.lte]: solicitud.fechaDevolucion },
                            fechaDevolucion: { [Op.gte]: solicitud.fechaRetiro }
                        }
                    });

                    if (conflictoTemporal) {
                        throw new AppError('Conflicto de fechas: El equipo ya fue asignado a otra solicitud aprobada en ese intervalo temporal.', 400);
                    }

                    await solicitud.Equipo.update({ estado: 'Prestado' });
                }

                if (nuevoEstado === 'Devuelta') {
                    await solicitud.Equipo.update({ estado: 'Disponible' });
                }
            }

            await solicitud.update(datos);

            if (nuevoEstado && nuevoEstado !== estadoAnterior) {
                await historialService.registrarCambio({
                    solicitudId: id,
                    usuarioId: usuarioModificador.id,
                    accion: `Cambio de Estado`,
                    valorAnterior: { estado: estadoAnterior },
                    valorNuevo: { estado: solicitud.estado }
                });
            }

            return {
                solicitud,
                estadoAnterior,
                nuevoEstado: solicitud.estado
            };
        }

    }


    async obtenerResumen() {

        const solicitudesPendientes =
            await Solicitud.count({
                where: { estado: "Pendiente" }
            });

        const equiposPrestados =
            await Equipo.count({
                where: { estado: "Prestado" }
            });

        const hoy = new Date().toISOString().split("T")[0];

        const prestamosVencidos =
            await Solicitud.count({
                where: {
                    estado: "Aprobada",
                    fechaDevolucion: {
                        [Op.lt]: hoy
                    }
                }
            });

        const equiposDisponibles =
            await Equipo.findAll({
                where: {
                    estado: "Disponible"
                }
            });

        const equiposDisponiblesPorCategoria = {};

        equiposDisponibles.forEach((equipo) => {
            const categoria = equipo.categoria;

            equiposDisponiblesPorCategoria[categoria] =
                (equiposDisponiblesPorCategoria[categoria] || 0) + 1;
        });

        return {
            equiposDisponiblesPorCategoria,
            solicitudesPendientes,
            equiposPrestados,
            prestamosVencidos
        };
    }
}

export default new SolicitudesService();