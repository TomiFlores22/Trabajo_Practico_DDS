import request from 'supertest';
import app from '../index.js';
import sequelize from '../config/db.js';
import Solicitud from '../models/solicitud.model.js';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.model.js';
import Equipo from '../models/equipo.model.js';

const JWT_SECRET = process.env.JWT_SECRET || "mi-secreto";

describe('Test de integración - Módulo de solicitudes', () => {
    let tokenUsuario, tokenAdmin, usuarioComun, usuarioAdmin, equipo;

    beforeAll(async () => {
        await sequelize.sync({ force: true});

        usuarioComun = await Usuario.create({
            nombre: 'Test Alumno',
            correo: 'alumno.test@utn.com',
            passwordHash: 'contra-secreta',
            rol: 'usuario'
        });

        usuarioAdmin = await Usuario.create({
            nombre: 'Test Admin',
            correo: 'admin.test@utn.com',
            passwordHash: 'contra-secreta',
            rol: 'admin'
        });

        equipo = await Equipo.create({
            codigoInventario: 'EQUIPO-001',
            nombre: 'Laptop',
            categoria: 'Computadora',
            estado: 'Disponible',
            ubicacion: 'Lab A',
            requiereAutorizacion: true
        });

        tokenUsuario = jwt.sign({ id: usuarioComun.id, correo: usuarioComun.correo, rol: usuarioComun.rol }, JWT_SECRET);
        tokenAdmin = jwt.sign({ id: usuarioAdmin.id, correo: usuarioAdmin.correo, rol: usuarioAdmin.rol }, JWT_SECRET);
    });

    beforeEach(async () => {
        await Solicitud.destroy({ where: {}, truncate: { cascade: true } });
        await Equipo.destroy({ where: {}, truncate: { cascade: true } });

        equipo = await Equipo.create({
            codigoInventario: 'EQUIPO-001',
            nombre: 'Laptop',
            categoria: 'Computadora',
            estado: 'Disponible',
            ubicacion: 'Lab A',
            requiereAutorizacion: true
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/solicitudes - Creación', () => {
        it('Deberia crear una solicitud en estado Pendiente', async() => {
            const nuevaSolicitud = {
                equipoId: equipo.id,
                fechaRetiro: "2026-09-10",
                fechaDevolucion: "2026-09-15",
                motivo: 'Prueba automatizada'
            };

            const res = await request(app)
                .post('/api/solicitudes')
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(nuevaSolicitud);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.estado).toBe('Pendiente');
            expect(res.body.usuarioId).toBe(usuarioComun.id);
        });

        it('Debería saltar el error 400 por fechas solapadas', async () => {
            const solicitudVieja = {
                equipoId: equipo.id,
                fechaRetiro: '2023-01-01',
                fechaDevolucion: '2023-01-05',
                motivo: 'Debería fallar'
            };

            const res = await request(app)
                .post('/api/solicitudes')
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(solicitudVieja);

            expect(res.statusCode).toBe(400);
            const mensajeError = res.body.error || res.body.message || "";
            expect(mensajeError.toLowerCase()).toContain('la fecha de retiro no puede ser anterior a la fecha actual');
        });

        it('Deberia salir error 400 por motivo vacío', async () => {
            const solicitudSinMotivo = {
                equipoId: equipo.id,
                fechaRetiro: '2026-10-01',
                fechaDevolucion: '2026-10-05',
                motivo: ''
            };

            const res = await request(app)
                .post('/api/solicitudes')
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(solicitudSinMotivo);

            expect(res.statusCode).toBe(400);
            const mensajeError = res.body.error || res.body.message || "";
            expect(mensajeError.toLowerCase()).toContain('debe ingresar un motivo');
        });
    });

    describe('PUT /api/solicitudes/:id - Transiciones y Roles', () => {
        let solicitudId;

        beforeEach(async () => {
            const sol = await Solicitud.create({
                equipoId: equipo.id,
                usuarioId: usuarioComun.id,
                fechaRetiro: "2026-12-01",
                fechaDevolucion: "2026-12-05",
                motivo: 'Solicitud para mutar estado',
                estado: 'Pendiente'
            });
            solicitudId = sol.id;
        });

        it('Error 400 por Usuario que intenta aprobar', async () => {
            const res = await request(app)
                .put(`/api/solicitudes/${solicitudId}`)
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send({ estado: 'Aprobada' });

            expect(res.statusCode).toBe(403);
            const mensajeError = res.body.error || res.body.message || "";
            expect(mensajeError.toLowerCase()).toContain('solo los administradores pueden aprobar o rechazar solicitudes');
        });

        it('Debería permitir al Administrador aprobar la solicitud con 200', async () => {
            const res = await request(app)
                .put(`/api/solicitudes/${solicitudId}`)
                .set('Authorization', `Bearer ${tokenAdmin}`) 
                .send({ estado: 'Aprobada' });

            expect(res.statusCode).toBe(200);
            expect(res.body.estado).toBe('Aprobada');
            expect(res.body.autorizadoPor).toBe(usuarioAdmin.id);
        });
    });
})