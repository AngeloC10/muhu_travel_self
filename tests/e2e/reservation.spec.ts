import { test, expect } from '@playwright/test';

test.describe('Reservation Flow', () => {
    test('Create a new reservation', async ({ page }) => {
        // Login as Agent
        await page.goto('/login');
        await page.fill('input[type="email"]', 'agente@muhu.com');
        await page.fill('input[type="password"]', 'agent123');
        await page.click('button[type="submit"]');
        await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });

        // Navigate to Reservations
        await page.click('text=Reservas');
        await expect(page.getByText('Gestión de Reservas')).toBeVisible();

        // Click "Nuevo" to start wizard
        await page.click('text=Nuevo');
        await expect(page.getByText('Nueva Reserva')).toBeVisible();

        // Step 0: Package Selection
        await expect(page.getByText('Detalles del Viaje')).toBeVisible();

        // Select first package
        await page.selectOption('select', { index: 1 });

        // Set travel date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await page.fill('input[type="date"]', tomorrow.toISOString().split('T')[0]);

        await page.click('text=Siguiente');

        // Step 1: Passenger Details
        await expect(page.getByText('Datos de los Pasajeros')).toBeVisible();
        await page.fill('input[placeholder="Nombres"]', 'TEST');
        await page.fill('input[placeholder="Apellidos"]', 'PASSENGER');
        await page.fill('input[placeholder="Num. Documento"]', '12345678');
        await page.locator('input[type="date"]').first().fill('1990-01-01');

        await page.click('text=Siguiente');

        // Step 2: Payment
        await expect(page.getByText('Método de Pago')).toBeVisible();
        await page.click('text=Siguiente');

        // Step 3: Billing
        await expect(page.getByText('Datos de Facturación')).toBeVisible();

        // Fill billing info
        const inputs = await page.locator('input[type="text"]').all();
        await inputs[0].fill('87654321'); // Doc number
        await inputs[1].fill('E2E Client Test'); // Name

        await page.fill('input[type="email"]', 'e2e@test.com');
        await page.fill('input[type="tel"]', '999888777');

        await page.click('text=Finalizar Reserva');

        // Step 4: Success
        await expect(page.getByText('¡Reserva Exitosa!')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Código de Reserva')).toBeVisible();
    });
});
