import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './password.js';

describe('Password Utils', () => {
    it('should hash a password correctly', async () => {
        const password = 'password123';
        const hash = await hashPassword(password);
        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);
        expect(hash.length).toBeGreaterThan(0);
    });

    it('should return true for matching password and hash', async () => {
        const password = 'password123';
        const hash = await hashPassword(password);
        const isMatch = await comparePassword(password, hash);
        expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
        const password = 'password123';
        const hash = await hashPassword(password);
        const isMatch = await comparePassword('wrongpassword', hash);
        expect(isMatch).toBe(false);
    });
});
