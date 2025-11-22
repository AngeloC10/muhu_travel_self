# Muhu Travel Backend

Backend REST API para la aplicación CRM de turismo Muhu Travel.

## Stack Tecnológico

- **Node.js** + **Express.js** - Framework HTTP
- **TypeScript** - Tipado estático
- **Prisma** - ORM moderno
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcrypt** - Hashing de contraseñas

## Requisitos previos

- Node.js 16+ instalado
- PostgreSQL 12+ instalado y corriendo localmente
- npm o yarn

## Setup inicial

### 1. Configurar la base de datos PostgreSQL

```bash
# Crear la base de datos
createdb muhu_travel

# O si prefieres usar psql:
psql -U postgres
CREATE DATABASE muhu_travel;
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Edita el archivo `.env.local` con tus datos:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/muhu_travel"
JWT_SECRET="tu-llave-secreta-muy-larga-y-segura"
PORT=3000
NODE_ENV="development"
```

**Nota:** Reemplaza `user` y `password` con tus credenciales de PostgreSQL.

### 4. Generar el cliente Prisma e inicializar la BD

```bash
# Generar el cliente Prisma
npm run prisma:generate

# Ejecutar migraciones e inicializar la BD
npm run prisma:migrate
```

Cuando se te pregunte por el nombre de la migración, puedes usar:
```
initial
```

### 5. (Opcional) Cargar datos iniciales

Si quieres poblar la BD con datos de ejemplo, puedes crear un script en `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear usuarios
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@muhutravel.com',
        password: '$2b$10$...', // Usar bcrypt hash
        role: 'ADMIN',
        active: true,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Luego ejecuta:
```bash
npx prisma db seed
```

## Ejecución

### Modo desarrollo (con hot reload)

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Build para producción

```bash
npm run build
npm start
```

### Herramientas

**Prisma Studio** - Interfaz visual para explorar y editar datos:

```bash
npm run prisma:studio
```

## Estructura del proyecto

```
backend/
├── src/
│   ├── controllers/       # Lógica de negocio
│   ├── routes/           # Definición de endpoints
│   ├── middleware/       # Auth, validación, etc.
│   ├── utils/            # JWT, password, helpers
│   ├── db.ts            # Instancia de Prisma
│   └── server.ts        # Punto de entrada
├── prisma/
│   └── schema.prisma    # Esquema de BD
├── .env.local           # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## Endpoints API

### Autenticación (sin proteger)

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### Usuarios (protegido)

- `GET /api/users` - Obtener todos
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Clientes (protegido)

- `GET /api/clients` - Obtener todos
- `POST /api/clients` - Crear cliente
- `POST /api/clients/upsert` - Crear o actualizar (por documento)
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Empleados (protegido)

- `GET /api/employees` - Obtener todos
- `POST /api/employees` - Crear empleado
- `PUT /api/employees/:id` - Actualizar empleado
- `DELETE /api/employees/:id` - Desactivar empleado (soft delete)

### Proveedores (protegido)

- `GET /api/providers` - Obtener todos
- `POST /api/providers` - Crear proveedor
- `PUT /api/providers/:id` - Actualizar proveedor
- `DELETE /api/providers/:id` - Desactivar proveedor (soft delete)

### Paquetes Turísticos (protegido)

- `GET /api/packages` - Obtener todos
- `POST /api/packages` - Crear paquete
- `PUT /api/packages/:id` - Actualizar paquete
- `DELETE /api/packages/:id` - Eliminar paquete

### Reservas (protegido)

- `GET /api/reservations` - Obtener todas
- `POST /api/reservations` - Crear reserva
- `PUT /api/reservations/:id` - Actualizar estado
- `DELETE /api/reservations/:id` - Eliminar reserva

## Autenticación

Todos los endpoints excepto `/api/auth/*` requieren un token JWT en el header:

```bash
Authorization: Bearer <token>
```

El token se obtiene al hacer login o register y es válido por 24 horas.

## Ejemplo de uso con cURL

```bash
# Registrarse
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Perez",
    "email": "juan@example.com",
    "password": "password123"
  }'

# Usar el token para hacer otra request
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer <token>"
```

## Solución de problemas

### Error de conexión a PostgreSQL

- Verifica que PostgreSQL esté corriendo: `psql -U postgres`
- Revisa las credenciales en `.env.local`
- Asegúrate de que la BD existe: `createdb muhu_travel`

### Error de "Missing .env.local"

- Copia `.env.local` del ejemplo y configúralo
- `npm run prisma:migrate` para crear las tablas

### Port 3000 ya está en uso

- Cambia el PORT en `.env.local`
- O mata el proceso: `lsof -i :3000` / `kill -9 <PID>`

## Seguridad (Importante para producción)

- ✅ Cambia `JWT_SECRET` a una clave aleatoria larga
- ✅ Usa variables de entorno para credenciales (nunca en código)
- ✅ Implementa rate limiting para endpoints públicos
- ✅ Usa HTTPS en producción
- ✅ Configura CORS apropiadamente
- ✅ Valida y sanitiza inputs en los controllers

## Próximos pasos

1. Conectar el frontend a este backend (actualiza `REACT_APP_API_URL`)
2. Implementar roles y permisos granulares
3. Agregar validación de entrada con Zod o Yup
4. Implementar logging y monitoreo
5. Agregar tests con Jest
6. Dockerizar la aplicación

---

**Creado con ❤️ para Muhu Travel**
