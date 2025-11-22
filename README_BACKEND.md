# 🚀 Muhu Travel - Sistema CRM Turístico

**Backend REST API + Frontend React completamente funcional con PostgreSQL**

---

## 📋 ¿Qué se creó?

### Backend Express + Prisma (100% completado)
- ✅ 7 Controllers (Auth, Users, Clients, Employees, Providers, Packages, Reservations)
- ✅ 7 Routes con endpoints CRUD
- ✅ Middleware de JWT para autenticación
- ✅ Hash bcrypt para contraseñas
- ✅ Schema Prisma con 7 tablas + relaciones
- ✅ Documentación completa

### Frontend React (compatible con backend)
- ✅ Servicio `backend-db.ts` para llamadas HTTP
- ✅ AuthContext con token JWT
- ✅ Componentes listos para usar

### Documentación
- ✅ `SETUP_GUIDE.md` - Pasos para ejecutar
- ✅ `MIGRATION_GUIDE.md` - Cambiar de mock a backend
- ✅ `BACKEND_SUMMARY.md` - Resumen de lo creado
- ✅ `ARCHITECTURE.md` - Diagramas y flujos
- ✅ `SETUP_VERIFICATION.md` - Checklist de validación
- ✅ `backend/README.md` - Documentación técnica

---

## ⚡ Quick Start (5 minutos)

### 1. Crear base de datos PostgreSQL

```powershell
createdb muhu_travel
```

### 2. Configurar backend

```powershell
cd backend
# Edita .env.local con tu contraseña PostgreSQL
npm install
npm run prisma:migrate
npm run dev
```

Debería mostrar: `🚀 Server running on http://localhost:3000`

### 3. Configurar frontend (nueva terminal)

```powershell
npm install
npm run dev
```

Debería mostrar: `➜  Local: http://localhost:5173/`

### 4. Abrir navegador

- URL: **http://localhost:5173**
- Email: `admin@muhutravel.com`
- Contraseña: `admin123`

✅ **¡Listo! Sistema completamente funcional.**

---

## 📁 Estructura del proyecto

```
MuhuV1/
│
├── 📂 backend/                    ← NUEVO: API REST Express + Prisma
│   ├── src/
│   │   ├── controllers/           (Auth, CRUD lógica)
│   │   ├── routes/                (Endpoints API)
│   │   ├── middleware/            (JWT validation)
│   │   ├── utils/                 (JWT, bcrypt helpers)
│   │   ├── db.ts                  (Prisma instance)
│   │   └── server.ts              (Express app)
│   ├── prisma/
│   │   └── schema.prisma          (DB schema: 7 tablas)
│   ├── .env.local                 (BD config)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 📂 src/                        ← EXISTENTE: React app
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── services/
│   │   ├── backend-db.ts          (NUEVO: llamadas HTTP a backend)
│   │   └── db.ts                  (viejo mock, mantener si quieres)
│   └── types.ts
│
├── .env.local                     (ACTUALIZADO: API_URL agregada)
├── SETUP_GUIDE.md                 (Guía paso a paso)
├── MIGRATION_GUIDE.md             (Cómo cambiar mock → backend)
├── BACKEND_SUMMARY.md             (Resumen técnico)
├── ARCHITECTURE.md                (Diagramas y flujos)
└── SETUP_VERIFICATION.md          (Checklist completo)
```

---

## 🔌 API Endpoints

### Autenticación (sin protección)
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/profile
```

### Protegidos (requieren JWT)
```
GET    /api/users
GET    /api/clients
GET    /api/employees
GET    /api/providers
GET    /api/packages
GET    /api/reservations
POST   /api/*/create
PUT    /api/*/:id
DELETE /api/*/:id
```

**Ejemplo:**
```bash
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer <token>"
```

---

## 🛠️ Stack tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Express.js + TypeScript |
| BD | PostgreSQL 12+ |
| ORM | Prisma 5 |
| Auth | JWT (24h) |
| Password | bcrypt |
| Icons | Lucide React |
| Charts | Recharts |

---

## 📊 Base de datos

7 tablas principales:
- **users** - Sistema de usuarios (admin, agentes)
- **clients** - Clientes/pasajeros
- **employees** - Personal
- **providers** - Proveedores (hoteles, transporte)
- **tour_packages** - Paquetes turísticos
- **reservations** - Reservas creadas
- **passengers** - Pasajeros de reservas

---

## 🔐 Seguridad

✅ **Implementado:**
- JWT con expiración 24h
- Contraseñas hasheadas con bcrypt
- Middleware de autenticación
- CORS habilitado
- Validación de tokens
- No se guardan contraseñas en texto plano

⚠️ **Para producción, además:**
- Cambiar JWT_SECRET a clave aleatoria larga
- Usar HTTPS
- Rate limiting
- CORS con dominios específicos
- Validación stricter de inputs

---

## 📖 Documentación

| Archivo | Contenido |
|--------|----------|
| `SETUP_GUIDE.md` | Paso a paso: BD, backend, frontend |
| `BACKEND_SUMMARY.md` | Resumen técnico de todo lo creado |
| `ARCHITECTURE.md` | Diagramas de arquitectura y flujos |
| `MIGRATION_GUIDE.md` | Cómo cambiar de mock a real backend |
| `SETUP_VERIFICATION.md` | Checklist de validación |
| `backend/README.md` | Documentación técnica del backend |

**Lee primero: `SETUP_GUIDE.md`**

---

## 🚀 Ejemplos de uso

### Login desde cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@muhutravel.com", "password": "admin123"}'
```

### Crear cliente
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Perez",
    "docType": "DNI",
    "docNumber": "12345678",
    "email": "juan@example.com",
    "phone": "987654321"
  }'
```

### Desde el frontend (ya configurado)
```typescript
import { db } from './services/backend-db';

// Login
await db.login('admin@muhutravel.com', 'admin123');

// Crear cliente
await db.createClient({
  fullName: 'Juan Perez',
  docType: 'DNI',
  docNumber: '12345678',
  email: 'juan@example.com',
  phone: '987654321'
});

// Obtener todos
const clients = await db.getClients();
```

---

## ✅ Checklist de verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `muhu_travel` creada
- [ ] Backend configurado y corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Login funciona con admin@muhutravel.com / admin123
- [ ] Puedes crear clientes
- [ ] Puedes crear paquetes
- [ ] Puedes crear reservas
- [ ] Los datos se guardan en PostgreSQL

**Ver `SETUP_VERIFICATION.md` para validación completa.**

---

## 🎯 Características principales

✅ **Implementadas:**
- Autenticación JWT
- CRUD completo (usuarios, clientes, empleados, proveedores, paquetes)
- Reservas con 5 pasos
- Dashboard con estadísticas
- Tablas con búsqueda
- Soft delete (empleados, proveedores)
- Upsert de clientes
- Interfaz responsive

---

## 🆘 Solución rápida de problemas

### "Cannot connect to database"
```powershell
psql -U postgres -c "SELECT 1"
```

### "Port 3000 already in use"
Cambia en `backend/.env.local`:
```env
PORT=3001
```

### "Missing .env.local"
Backend `.env.local` ya existe. Edita con tu contraseña PostgreSQL.

### "Tables not found"
```powershell
cd backend
npm run prisma:migrate
```

**Ver `SETUP_GUIDE.md` para más problemas.**

---

## 📞 Contacto y soporte

Si algo no funciona:
1. Lee `SETUP_GUIDE.md` (sección de problemas)
2. Verifica `SETUP_VERIFICATION.md` (checklist)
3. Mira logs en terminal (contendrán el error)
4. Revisa `ARCHITECTURE.md` (entiende cómo funciona)

---

## 🎓 Aprendizaje

Este proyecto es excelente para aprender:
- ✅ Autenticación JWT
- ✅ CRUD REST API
- ✅ Prisma ORM
- ✅ React Context
- ✅ TypeScript full-stack
- ✅ PostgreSQL
- ✅ Express.js
- ✅ Arquitectura de aplicaciones

---

## 🚀 Próximos pasos

### Funcionalidades opcionales
- [ ] Agregar validación con Zod
- [ ] Implementar paginación
- [ ] Agregar tests
- [ ] Integrar pagos (Stripe)
- [ ] Email notifications (SendGrid)
- [ ] SMS (Twilio)

### Deployment
- [ ] Frontend: Vercel, Netlify
- [ ] Backend: Railway, Render, AWS
- [ ] BD: Supabase, Railway, AWS RDS

### Mejoras
- [ ] Agregar logging
- [ ] Rate limiting
- [ ] Caché (Redis)
- [ ] Documentación Swagger
- [ ] CI/CD con GitHub Actions

---

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir.

---

## 🎉 ¡Estás listo para empezar!

**Comando final para ejecutar todo:**

Terminal 1:
```powershell
cd c:\Users\Angelo\Documents\MuhuV1\backend
npm run dev
```

Terminal 2:
```powershell
cd c:\Users\Angelo\Documents\MuhuV1
npm run dev
```

**Luego abre: http://localhost:5173**

✅ **¡Disfruta tu CRM turístico completamente funcional!** 🎉

---

**Creado: 20 de noviembre de 2024**  
**Estado: ✅ Producción-ready (con ajustes de seguridad para prod)**  
**Backend: Express + Prisma + PostgreSQL**  
**Frontend: React 19 + TypeScript + Vite**
