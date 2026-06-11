import Solicitud from '../models/solicitud.model.js';
import Equipo from '../models/equipo.model.js';
import historialService from './historial.service.js';
import { Op } from 'sequelize';

class SolicitudesService {


    async crear(datos) {
        const { equipoId, usuarioId, fechaRetiro, fechaDevolucion, motivo } = datos;

        if (!motivo || !motivo.trim()) {
            throw new Error('Debe ingresar un motivo para la solicitud.');
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (new Date(fechaRetiro) < hoy) {
            throw new Error('La fecha de retiro no puede ser anterior a la fecha actual.');
        }

        if (new Date(fechaRetiro) >= new Date(fechaDevolucion)) {
            throw new Error('La fecha de retiro debe ser anterior a la fecha de devolución.');
        }

        const equipo = await Equipo.findByPk(equipoId);
        if (!equipo) throw new Error('Equipo no encontrado.');
        if (equipo.estado === 'Baja') throw new Error('No se pueden realizar solicitudes sobre un equipo dado de baja.');

        const solicitudSuperpuesta = await Solicitud.findOne({
            where: {
                equipoId: equipoId,
                estado: 'Aprobada',
                fechaRetiro: { [Op.lte]: fechaDevolucion },
                fechaDevolucion: { [Op.gte]: fechaRetiro }
            }
        });
        if (solicitudSuperpuesta) {
            throw new Error('Ya existe una solicitud aprobada para este equipo en el rango de fechas especificado.');
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
        const { estado, equipoID, desde, hasta, page = 1, limit = 5, sortBy = 'fechaRetiro', order = 'ASC' } = query;

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
                { model: Equipo, attributes: ['nombre', 'codigoInventario', 'categoria'] }
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
            throw new Error('Solicitud no encontrada.');
        }
        if (usuarioLogueado.rol !== 'admin' && solicitud.usuarioId !== usuarioLogueado.id) {
            throw new Error('Acceso denegado: No tienes permisos para visualizar esta solicitud.');
        }
        return solicitud;
    }


    async actualizar(id, datos, usuarioModificador) {
        const solicitud = await this.obtenerPorId(id, usuarioModificador);

        const estadoAnterior = solicitud.estado;
        const nuevoEstado = datos.estado;

        

        if (nuevoEstado && nuevoEstado !== estadoAnterior) {
            if (nuevoEstado && nuevoEstado !== estadoAnterior) {

                if (estadoAnterior === 'Pendiente') {
                    if (!['Aprobada', 'Rechazada', 'Cancelada'].includes(nuevoEstado)) {
                        throw new Error(`Transición inválida: No se puede cambiar de ${estadoAnterior} a ${nuevoEstado}.`);
                    }
                }
                else if (estadoAnterior === 'Aprobada') {
                    if (nuevoEstado !== 'Devuelta') {
                        throw new Error(`Transición inválida: Una solicitud Aprobada solo puede pasar a Devuelta.`);
                    }
                }
                else if (['Rechazada', 'Cancelada', 'Devuelta'].includes(estadoAnterior)) {
                    throw new Error(`Acción denegada: La solicitud ya se encuentra en un estado final (${estadoAnterior}) y no puede reabrirse.`);
                }

                if (['Aprobada', 'Rechazada'].includes(nuevoEstado)) {
                    if (usuarioModificador.rol !== 'admin') {
                        throw new Error('Acceso denegado: Solo los administradores pueden Aprobar o Rechazar solicitudes.');
                    }
                    solicitud.autorizadoPor = usuarioModificador.id;
                }

                if (nuevoEstado === 'Cancelada') {
                    if (usuarioModificador.rol !== 'admin' && solicitud.usuarioId !== usuarioModificador.id) {
                        throw new Error('Acceso denegado: No puedes cancelar una solicitud que no te pertenece.');
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
                        throw new Error('Conflicto de fechas: El equipo ya fue asignado a otra solicitud aprobada en ese intervalo temporal.');
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
}

export default new SolicitudesService();