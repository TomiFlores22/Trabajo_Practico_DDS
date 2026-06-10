import bcrypt from "bcryptjs";
import Usuario from '../models/usuario.model.js';
import Equipo from '../models/equipo.model.js';
import Solicitud from '../models/solicitud.model.js';
import Historial from '../models/historial.model.js'; // Ajustá el nombre exacto de tu archivo de historial
import  sequelize  from '../config/db.js';

const usuariosSeed = [
    {
        nombre: 'Juan Pérez',
        correo: 'juan.perez@gmail.com',
        passwordHash: 'Contra1',
        rol: 'admin',
        activo: true
    },
    {
        nombre: 'María Gómez',
        correo: 'maria.gomez@outlook.com',
        passwordHash: 'Contra2',
        rol: 'usuario',
        activo: true
    },
    {
        nombre: 'Carlos Sánchez',
        correo: 'carlos.sanchez@yahoo.com',
        passwordHash: 'Contra3',
        rol: 'usuario',
        activo: true
    }
];

const equiposSeed = [
    {
        codigoInventario: 'INV-2026-001',
        nombre: 'Laptop Dell XPS 13',
        categoria: 'Computadora',
        estado: 'Disponible',
        ubicacion: 'Departamento de Sistemas',
        requiereAutorizacion: true
    },
    {
        codigoInventario: 'INV-2026-002',
        nombre: 'Proyector Epson EB-S41',
        categoria: 'Audiovisual',
        estado: 'Prestado',
        ubicacion: 'Aula 500',
        requiereAutorizacion: true
    },
    {
        codigoInventario: 'INV-2026-003',
        nombre: 'Impresora HP LaserJet Pro',
        categoria: 'Periférico',
        estado: 'Baja',
        ubicacion: 'Sala de Mantenimiento',
        requiereAutorizacion: true
    },
    {
        codigoInventario: 'INV-2026-004',
        nombre: 'Monitor Samsung 24"',
        categoria: 'Periférico',
        estado: 'Mantenimiento',
        ubicacion: 'Sala de Mantenimiento',
        requiereAutorizacion: true
    },
    {
        codigoInventario: 'INV-2026-005',
        nombre: 'Teclado Logitech K120',
        categoria: 'Periférico',
        estado: 'Disponible',
        ubicacion: 'Departamento de Sistemas',
        requiereAutorizacion: false
    },
    {
        codigoInventario: 'INV-2026-006',
        nombre: 'Mouse Logitech MX Master 3',
        categoria: 'Periférico',
        estado: 'Disponible',
        ubicacion: 'Departamento de Sistemas',
        requiereAutorizacion: false
    },
    {
        codigoInventario: 'INV-2026-007',
        nombre: 'Router Cisco RV340',
        categoria: 'Redes',
        estado: 'Prestado',
        ubicacion: 'Labsys A6',
        requiereAutorizacion: true
    },
    {
        codigoInventario: 'INV-2026-008',
        nombre: 'Control Aire Acondicionado LG',
        categoria: 'Otros',
        estado: 'Disponible',
        ubicacion: 'Departamento de Sistemas',
        requiereAutorizacion: false
    }
];

const solicitudesSeed = [
    {
        equipoId: 1,
        usuarioId: 2,
        fechaSolicitud: "2026-03-04",
        fechaRetiro: "2026-03-10",
        fechaDevolucion: "2026-03-15",
        motivo: "Necesito la laptop para mostrar fundamentos de linux",
        estado: "Aprobada",
        autorizadoPor: 1
    },
    {
        equipoId: 2,
        usuarioId: 3,
        fechaSolicitud: "2026-04-05",
        fechaRetiro: "2026-04-11",
        fechaDevolucion: "2026-04-16",
        motivo: "Necesito el proyector para presentar un informe importante.",
        estado: "Pendiente",
        autorizadoPor: null
    },
    {
        equipoId: 7,
        usuarioId: 2,
        fechaSolicitud: "2026-03-06",
        fechaRetiro: "2026-03-12",
        fechaDevolucion: "2026-03-17",
        motivo: "Necesito el router para configurar la red en el laboratorio.",
        estado: "Cancelada",
        autorizadoPor: 1
    },
    {
        equipoId: 5,
        usuarioId: 3,
        fechaSolicitud: "2026-05-07",
        fechaRetiro: "2026-05-13",
        fechaDevolucion: "2026-05-18",
        motivo: "Necesito el teclado para trabajar en mi computadora.",
        estado: "Devuelta",
        autorizadoPor: 1
    },
    {
        equipoId: 6,
        usuarioId: 2,
        fechaSolicitud: "2026-05-08",
        fechaRetiro: "2026-05-14",
        fechaDevolucion: "2026-05-19",
        motivo: "Necesito el mouse para trabajar en mi computadora.",
        estado: "Aprobada",
        autorizadoPor: 1
    },
    {
        equipoId: 8,
        usuarioId: 3,
        fechaSolicitud: "2026-05-15",
        fechaRetiro: "2026-05-15",
        fechaDevolucion: "2026-05-16",
        motivo: "Necesito el control de aire acondicionado para el aula.",
        estado: "Pendiente",
        autorizadoPor: null
    },
    {
        equipoId: 3,
        usuarioId: 2,
        fechaSolicitud: "2026-06-01",
        fechaRetiro: "2026-06-07",
        fechaDevolucion: "2026-06-12",
        motivo: "Necesito la impresora para imprimir documentos importantes.",
        estado: "Cancelada",
        autorizadoPor: 1
    },
    {
        equipoId: 4,
        usuarioId: 3,
        fechaSolicitud: "2026-06-02",
        fechaRetiro: "2026-06-08",
        fechaDevolucion: "2026-06-13",
        motivo: "Necesito el monitor para trabajar en mi computadora.",
        estado: "Pendiente",
        autorizadoPor: null
    },
    {
        equipoId: 1,
        usuarioId: 3,
        fechaSolicitud: "2026-06-03",
        fechaRetiro: "2026-06-09",
        fechaDevolucion: "2026-06-14",
        motivo: "Pido la Notebook para usarla con el proyector.",
        estado: "Aprobada",
        autorizadoPor: 1
    },
    {
        equipoId: 2,
        usuarioId: 2,
        fechaSolicitud: "2026-06-04",
        fechaRetiro: "2026-06-10",
        fechaDevolucion: "2026-06-15",
        motivo: "Necesito el proyector para una presentación sobre base de datos en el aula 205.",
        estado: "Pendiente",
        autorizadoPor: null
    },
    {
        equipoId: 7,
        usuarioId: 3,
        fechaSolicitud: "2026-06-05",
        fechaRetiro: "2026-06-11",
        fechaDevolucion: "2026-06-16",
        motivo: "Necesito el router para mostrarlo en la clase de COM.",
        estado: "Devuelta",
        autorizadoPor: 1
    },
    {
        equipoId: 5,
        usuarioId: 2,
        fechaSolicitud: "2026-06-06",
        fechaRetiro: "2026-06-12",
        fechaDevolucion: "2026-06-17",
        motivo: "Necesito el teclado para trabajar en mi computadora.",
        estado: "Aprobada",
        autorizadoPor: 1
    }
];

const historialSeed = [
    {
        solicitudId: 1,
        usuarioId: 2,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-04T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 1,
        usuarioId: 1,
        accion: "Aprobación de solicitud",
        fechaHora: "2026-03-04T11:00:00Z",
        valorAnterior: '{"estado": "Pendiente"}',
        valorNuevo: '{"estado": "Aprobada"}'
    },
    {
        solicitudId: 2,
        usuarioId: 3,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-05T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 3,
        usuarioId: 2,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-06T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 3,
        usuarioId: 1, // Autorizado por admin
        accion: "Cancelación de solicitud",
        fechaHora: "2026-03-06T11:00:00Z",
        valorAnterior: '{"estado": "Pendiente"}',
        valorNuevo: '{"estado": "Cancelada"}'
    },
    {
        solicitudId: 4,
        usuarioId: 3,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-07T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 5,
        usuarioId: 2,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-08T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 5,
        usuarioId: 1,
        accion: "Aprobación de solicitud",
        fechaHora: "2026-03-08T11:00:00Z",
        valorAnterior: '{"estado": "Pendiente"}',
        valorNuevo: '{"estado": "Aprobada"}'
    },
    {
        solicitudId: 6,
        usuarioId: 3,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-09T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 7,
        usuarioId: 3,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-10T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    },
    {
        solicitudId: 7,
        usuarioId: 1,
        accion: "Cancelación de solicitud",
        fechaHora: "2026-03-10T11:00:00Z",
        valorAnterior: '{"estado": "Pendiente"}',
        valorNuevo: '{"estado": "Cancelada"}'
    },
    {
        solicitudId: 8,
        usuarioId: 3,
        accion: "Creación de solicitud",
        fechaHora: "2026-03-11T10:00:00Z",
        valorAnterior: null,
        valorNuevo: '{"estado": "Pendiente"}'
    }
];

async function ejecutarSeed() {
    try {

        await sequelize.sync({ force: true });

        // Hashear las contraseñas de los usuarios semilla
        for (const usuario of usuariosSeed) {
            usuario.passwordHash = await bcrypt.hash(
                usuario.passwordHash,
                10
            );
        }

        await Usuario.bulkCreate(usuariosSeed);

        await Equipo.bulkCreate(equiposSeed);

        await Solicitud.bulkCreate(solicitudesSeed);

        await Historial.bulkCreate(historialSeed);

        console.log("¡PROCESO SEED FINALIZADO CON ÉXITO!");

    } catch (error) {

        console.error("Error al cargar los datos semilla:");
        console.error(error);

    } finally {

        await sequelize.close();

    }
}

ejecutarSeed();