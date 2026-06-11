import request from 'supertest';
import app from '../index.js';
import sequelize from '../config/db.js';
import Usuario from '../models/usuario.model.js';
import bcryptjs from 'bcryptjs'; 

describe('🧪 Tests de Integración - Autenticación y Permisos', () => {
    
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash('clave123', salt);
        
        await Usuario.create({
            nombre: 'Juan Perez',
            correo: 'juan@dds.com',
            passwordHash: passwordHash,
            rol: 'Usuario',
            activo: true
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('✅ POST /api/auth/login - Debería iniciar sesión y devolver un JWT', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                correo: 'juan@dds.com',
                password: 'clave123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('❌ POST /api/auth/login - Debería rebotar con 401 ante credenciales inválidas', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                correo: 'juan@dds.com',
                password: 'password_erronea'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toLowerCase().toContain('inválid');
    });

    it('❌ GET /api/solicitudes - Debería rebotar con 401 si no se envía el token', async () => {
        const res = await request(app).get('/api/solicitudes');
        expect(res.statusCode).toBe(401);
    });

});