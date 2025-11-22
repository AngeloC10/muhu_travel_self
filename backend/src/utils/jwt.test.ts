import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from './jwt.js';

describe('JWT Utils', () => {
    it('should generate a valid token', () => {
        const token = generateToken('user123', 'test@example.com', 'AGENT');
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
    });

    it('should verify a valid token and return payload', () => {
        const userId = 'user123';
        const email = 'test@example.com';
        const role = 'AGENT';
        const token = generateToken(userId, email, role);

        const payload = verifyToken(token);
        expect(payload).toBeDefined();
        expect(payload?.userId).toBe(userId);
        expect(payload?.email).toBe(email);
        expect(payload?.role).toBe(role);
    });

    it('should return null for an invalid token', () => {
        const payload = verifyToken('invalid-token-string');
        expect(payload).toBeNull();
    });
});
