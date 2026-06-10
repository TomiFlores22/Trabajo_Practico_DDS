import Solicitud from  '../models/solicitud.model.js';
import Equipo from '../models/equipo.model.js';
import { Op } from 'sequelize';

class SolicitudesService {


    async crear(datos) {
        const { equipoId, usuarioId, fechaRetiro, fechaDevolucion, motivo } = datos;

        if (new Date(fechaRetiro) >= new Date(fechaDevolucion)) {
            throw new Error('La fecha de retiro debe ser anterior a la fecha de devolución.');
        }

        const equipo = await Equipo.findByPk(equipoId);
        if (!equipo) {
            throw new Error('Equipo no encontrado.');
        }

        if (equipo.estado !== 'Disponible') {
            throw new Error(`El equipo no está disponible para préstamo. Estado actual: ${equipo.estado}`);
        }

        const solicitudSuperpuesta = await Solicitud.findOne({
            where: {
                equipoId: equipoId,
                estado: 'Aprobada',
                fechaRetiro: { [Op.lte]: new Date(fechaDevolucion) },
                fechaDevolucion: { [Op.gte]: new Date(fechaRetiro) }
            }
        });
        if (solicitudSuperpuesta) {
            throw new Error('Ya existe una solicitud aprobada para este equipo en el rango de fechas especificado.');
        }
        return await Solicitud.create({
            equipoId,
            usuarioId,
            fechaRetiro,
            fechaDevolucion,
            motivo,
            estado: 'Pendiente',
            autorizadoPor: null
        });
    }


    async obtenerTodas(query) {
        const { estado, equipoID, desde, hasta, page = 1, limit = 5, sortBy = 'fechaRetiro', order = 'ASC' } = query;

        const filtros = {};
        if (estado) filtros.estado = estado;
        if (equipoID) filtros.equipoId = equipoID;

        if (desde && hasta) {
            filtros.fechaRetiro = { [Op.between] : [desde, hasta] };
        } else if (desde) {
            filtros.fechaRetiro = { [Op.gte] : desde };
        } else if (hasta) {
            filtros.fechaRetiro = { [Op.lte] : hasta };
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


    async obtenerPorId(id) {
        const solicitud = await Solicitud.findByPk(id, {
            include: [{ model : Equipo }]
        });
        if (!solicitud) {
            throw new Error('Solicitud no encontrada.');
        }
        return solicitud;
    }


    async actualizar(id, datos, usuarioModificador) {
        const solicitud = await this.obtenerPorId(id);

        const estadoAnterior = solicitud.estado;
        const nuevoEstado = datos.estado;

        if (nuevoEstado && nuevoEstado !== estadoAnterior) {
            if (nuevoEstado === 'Aprobada') {
                if (usuarioModificador.rol !== 'admin') {
                    throw new Error('Solo los administradores pueden aprobar solicitudes.');
                }
                solicitud.autorizadoPor = usuarioModificador.id;
                await solicitud.Equipo.update({ estado: 'Prestado' });
            }
            if (['Devuelta', 'Cancelada', 'Rechazada'].includes(nuevoEstado)) {
                await solicitud.Equipo.update({ estado: 'Disponible' });
            }
        }

        await solicitud.update(datos);

        return {
            solicitud,
            estadoAnterior,
            nuevoEstado: solicitud.estado
        };
    }
}

export default new SolicitudesService();