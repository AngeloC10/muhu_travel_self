import { test, expect } from '@playwright/test';

test.describe('Client Management', () => {
    test('Search existing client', async ({ page }) => {
        // Login as Agent
        await page.goto('/');
        await page.fill('input[type="email"]', 'agente@muhu.com');
        await page.fill('input[type="password"]', 'agent123');
        await page.click('button[type="submit"]');
        await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });

        // Navigate to Clients
        await page.click('text=Clientes');

        // Wait for table to load
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // Verify search works
        const searchInput = page.locator('input[placeholder*="Buscar"]');
        await searchInput.fill('Cliente');

        //Verify table has rows
        await expect(page.locator('table tbody tr')).toHaveCount(1, { timeout: 5000 });
    });
});
