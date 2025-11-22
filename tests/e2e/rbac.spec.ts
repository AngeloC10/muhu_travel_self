import { test, expect } from '@playwright/test';

test.describe('RBAC', () => {
    test('Agent cannot access restricted routes', async ({ page }) => {
        // Login as Agent
        await page.goto('/');
        await page.fill('input[type="email"]', 'agente@muhu.com');
        await page.fill('input[type="password"]', 'agent123');
        await page.click('button[type="submit"]');

        // Wait for dashboard
        await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });

        // Verify "Usuarios Sistema" link is not visible in sidebar
        const usersLink = page.locator('text=Usuarios Sistema');
        await expect(usersLink).not.toBeVisible();
    });
});
