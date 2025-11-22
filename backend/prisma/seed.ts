import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // --- Users ---
    const adminPassword = await bcrypt.hash('admin123', 10);
    const agentPassword = await bcrypt.hash('agent123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@muhu.com' },
        update: {},
        create: {
            email: 'admin@muhu.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
            active: true,
        },
    });

    const agent = await prisma.user.upsert({
        where: { email: 'agente@muhu.com' },
        update: {},
        create: {
            email: 'agente@muhu.com',
            name: 'Agente Ventas',
            password: agentPassword,
            role: 'AGENT',
            active: true,
        },
    });

    console.log({ admin, agent });

    // --- Packages ---
    const packages = [
        {
            name: 'Machu Picchu Full Day',
            description: 'Visita a la maravilla del mundo en un día inolvidable.',
            price: 450.00,
            durationDays: 1,
            maxPax: 15,
            destinations: ['Cusco', 'Machu Picchu'],
        },
        {
            name: 'Valle Sagrado VIP',
            description: 'Recorrido exclusivo por Pisac, Ollantaytambo y Chinchero.',
            price: 280.00,
            durationDays: 1,
            maxPax: 12,
            destinations: ['Pisac', 'Ollantaytambo', 'Chinchero'],
        },
        {
            name: 'Cusco Mágico 4D/3N',
            description: 'Paquete completo incluyendo City Tour, Valle Sagrado y Machu Picchu.',
            price: 1200.00,
            durationDays: 4,
            maxPax: 10,
            destinations: ['Cusco', 'Sacsayhuaman', 'Pisac', 'Machu Picchu'],
        },
        {
            name: 'Montaña 7 Colores',
            description: 'Trekking a la famosa montaña Vinicunca.',
            price: 150.00,
            durationDays: 1,
            maxPax: 20,
            destinations: ['Cusco', 'Vinicunca'],
        },
    ];

    for (const pkg of packages) {
        await prisma.tourPackage.upsert({
            where: { name: pkg.name },
            update: {},
            create: pkg,
        });
    }

    // --- Employees ---
    const employees = [
        {
            fullName: 'Juan Pérez',
            position: 'Guía Oficial',
            email: 'juan.perez@muhu.com',
            phone: '987654321',
            hireDate: new Date('2023-01-15'),
            status: 'ACTIVE',
        },
        {
            fullName: 'Maria Rodriguez',
            position: 'Coordinadora de Operaciones',
            email: 'maria.rodriguez@muhu.com',
            phone: '912345678',
            hireDate: new Date('2023-03-10'),
            status: 'ACTIVE',
        },
    ];

    for (const emp of employees) {
        await prisma.employee.upsert({
            where: { email: emp.email },
            update: {},
            create: emp,
        });
    }

    // --- Providers ---
    const providers = [
        {
            companyName: 'Transportes Cusco',
            serviceType: 'Transport',
            contactName: 'Carlos Gomez',
            email: 'contacto@transportescusco.com',
            phone: '998877665',
            status: 'ACTIVE',
        },
        {
            companyName: 'Hotel Los Andes',
            serviceType: 'Hotel',
            contactName: 'Ana Torres',
            email: 'reservas@hotellosandes.com',
            phone: '977665544',
            status: 'ACTIVE',
        },
        {
            companyName: 'Restaurante El Maíz',
            serviceType: 'Restaurant',
            contactName: 'Luis Romero',
            email: 'info@elmaiz.com',
            phone: '955443322',
            status: 'ACTIVE',
        },
    ];

    for (const prov of providers) {
        // Providers don't have a unique field other than ID in schema, so we'll check by email or just create if we want to be simple.
        // But to avoid duplicates on re-runs, let's try to find first or just create.
        // Since schema doesn't enforce unique email on provider (it's optional), we can't use upsert easily without a unique constraint.
        // However, for seeding, let's just check if one exists with that name.
        const existing = await prisma.provider.findFirst({ where: { companyName: prov.companyName } });
        if (!existing) {
            await prisma.provider.create({ data: prov });
        }
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
