import { test, expect } from '@playwright/test';

test.describe('Package Management', () => {
    test('Admin can create a new package', async ({ page }) => {
        // Login as Admin
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@muhu.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });

        // Navigate to Packages
        await page.click('text=Paquetes');

        // Wait for page to load
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 });

        // Click "Nuevo" button
        await page.click('text=Nuevo');

        // Fill form
        await page.fill('input[placeholder="Nombre Paquete"]', 'E2E Test Package');
        await page.fill('textarea[placeholder="Descripción"]', 'Test description');
        await page.fill('input[placeholder="Precio"]', '999');
        await page.fill('input[placeholder="Días"]', '5');
        await page.fill('input[placeholder="Max Personas"]', '10');

        await page.click('button:has-text("Guardar")');

        // Verify package appears
        await expect(page.getByText('E2E Test Package')).toBeVisible({ timeout: 5000 });
    });
});
