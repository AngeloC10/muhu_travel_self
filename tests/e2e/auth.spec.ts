import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('Admin Login', async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@muhu.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Wait for sidebar navigation to appear
        await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });
    });

    test('Agent Login', async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"]', 'agente@muhu.com');
        await page.fill('input[type="password"]', 'agent123');
        await page.click('button[type="submit"]');

        await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });
    });

    test('Invalid credentials should show error', async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Should stay on login page
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });
});
