import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import clientsRoutes from './routes/clients.js';
import employeesRoutes from './routes/employees.js';
import providersRoutes from './routes/providers.js';
import packagesRoutes from './routes/packages.js';
import reservationsRoutes from './routes/reservations.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (públicas)
app.use('/api/auth', authRoutes);

// Routes (protegidas)
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/clients', authMiddleware, clientsRoutes);
app.use('/api/employees', authMiddleware, employeesRoutes);
app.use('/api/providers', authMiddleware, providersRoutes);
app.use('/api/packages', authMiddleware, packagesRoutes);
app.use('/api/reservations', authMiddleware, reservationsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Muhu Travel API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      clients: '/api/clients',
      employees: '/api/employees',
      providers: '/api/providers',
      packages: '/api/packages',
      reservations: '/api/reservations',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});



export default app;
