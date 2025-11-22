import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Integration Tests', () => {
    let adminToken: string;
    let agentToken: string;

    // Login before running tests to get tokens
    beforeAll(async () => {
        // Admin Login
        const adminRes = await request(app).post('/api/auth/login').send({
            email: 'admin@muhu.com',
            password: 'admin123'
        });
        adminToken = adminRes.body.token;

        // Agent Login
        const agentRes = await request(app).post('/api/auth/login').send({
            email: 'agente@muhu.com',
            password: 'agent123'
        });
        // console.log('Agent Login Status:', agentRes.status);
        // console.log('Agent Login Body:', agentRes.body);
        agentToken = agentRes.body.token;
    });

    describe('Auth Endpoints', () => {
        it('POST /api/auth/login - should login successfully with valid credentials', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'admin@muhu.com',
                password: 'admin123'
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('admin@muhu.com');
        });

        it('POST /api/auth/login - AGENT should login successfully', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'agente@muhu.com',
                password: 'agent123'
            });
            if (res.status !== 200) {
                console.log('Agent Login Failed:', res.status, res.body);
            }
            expect(res.status).toBe(200);
        });

        it('POST /api/auth/login - should fail with invalid credentials', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'admin@muhu.com',
                password: 'wrongpassword'
            });
            expect(res.status).toBe(401);
        });

        it('POST /api/auth/register - should fail without admin password', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'New User',
                email: 'new@example.com',
                password: 'password123'
            });
            expect(res.status).toBe(400); // Missing required fields
        });
    });

    describe('Protected Endpoints', () => {
        it('GET /api/packages - should be inaccessible without token', async () => {
            const res = await request(app).get('/api/packages');
            expect(res.status).toBe(401); // Or 403 depending on middleware
        });

        it('GET /api/packages - should return packages for authenticated user', async () => {
            const res = await request(app)
                .get('/api/packages')
                .set('Authorization', `Bearer ${agentToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('GET /api/auth/profile - should return profile for AGENT', async () => {
            const loginRes = await request(app).post('/api/auth/login').send({
                email: 'agente@muhu.com',
                password: 'agent123'
            });
            const token = loginRes.body.token;

            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.role).toBe('AGENT');
        });
    });
});
