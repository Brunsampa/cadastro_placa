const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Autenticação', () => {
    it('Deve registrar um novo usuário', async () => {
        const res = await request(app).post('/api/auth/cadastro').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(201);
    });

    it('Deve falhar ao registrar usuário com email duplicado', async () => {
        const res = await request(app).post('/api/auth/cadastro').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(400);
    });

    it('Deve fazer login com sucesso', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Deve falhar ao fazer login com senha errada', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(400);
    });
});
