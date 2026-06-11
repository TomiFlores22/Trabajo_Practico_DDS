import request from 'supertest';
import app from '../index.js';

describe('API Tests', () => {
  test('GET / debe retornar mensaje de API funcionando', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('API funcionando');
  });
});