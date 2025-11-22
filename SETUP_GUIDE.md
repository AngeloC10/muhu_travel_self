# 🚀 Guía Completa: Setup Backend + Frontend

Esta guía te ayudará a configurar y ejecutar el sistema completo de Muhu Travel (frontend + backend + base de datos).

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js 16+** - [Descargar](https://nodejs.org/)
2. **PostgreSQL 12+** - [Descargar](https://www.postgresql.org/download/)
3. **Git** (opcional, para clonar repositorios)

### Verificar instalación

```powershell
# En PowerShell
node --version
npm --version
psql --version
```

---

## 🗄️ Paso 1: Configurar PostgreSQL

### Crear la base de datos

```powershell
# Abre PostgreSQL
psql -U postgres

# Dentro de psql, ejecuta:
CREATE DATABASE muhu_travel;

# Verifica que se creó
\l

# Salir
\q
```

**Alternativa con GUI:**
Si prefieres, usa **pgAdmin** que viene con PostgreSQL para crear la BD gráficamente.

---

## 🔧 Paso 2: Setup del Backend

### 2.1 Ir a la carpeta del backend

```powershell
cd backend
```

### 2.2 Configurar variables de entorno

El archivo `.env.local` ya existe con valores por defecto. **Edítalo** para agregar tus credenciales de PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:tu-contraseña@localhost:5432/muhu_travel"
JWT_SECRET="muhu-secret-key-2024-change-in-production"
PORT=3000
NODE_ENV="development"
```

**Nota:** Reemplaza `tu-contraseña` con tu contraseña de PostgreSQL.

### 2.3 Instalar dependencias

```powershell
npm install
```

### 2.4 Inicializar la base de datos

```powershell
# Generar cliente Prisma
npm run prisma:generate

# Crear tablas en PostgreSQL
npm run prisma:migrate
```

Cuando se pida nombre de migración, escribe: `initial`

### 2.5 Cargar datos iniciales (Seeds)

Para poblar la base de datos con usuarios, paquetes y clientes de prueba, ejecuta el siguiente comando:

```powershell
npx prisma db seed
```

Esto creará:
- Usuario Admin (`admin@muhu.com` / `admin123`)
- Usuario Agente (`agente@muhu.com` / `agent123`)
- Paquetes turísticos de ejemplo
- Clientes y proveedores de prueba

### 2.6 Iniciar el servidor

```powershell
npm run dev
```

Deberías ver:
```
🚀 Server running on http://localhost:3000
```

✅ **El backend está corriendo. NO cierres esta terminal.**

---

## 💻 Paso 3: Setup del Frontend

### 3.1 Abre una NUEVA terminal (PowerShell)

```powershell
cd c:\Users\Angelo\Documents\MuhuV1
```

### 3.2 Instalar dependencias (si aún no lo hiciste)

```powershell
npm install
```

### 3.3 Verificar que `.env.local` está configurado

El archivo ya debería tener:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

### 3.4 Ejecutar el frontend

```powershell
npm run dev
```

Deberías ver algo como:

```
VITE v6.0.0  ready in 250 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **El frontend está corriendo.**

---

## 🎯 Paso 4: Usar la aplicación

### En tu navegador:

1. Abre **http://localhost:5173**
2. Verás la pantalla de login
3. Usa las credenciales que aparecen en pantalla.
4. ¡Listo! Ya estás dentro de la aplicación

---

## 🛠️ Comandos útiles

### Backend

```powershell
# Iniciar servidor (desarrollo)
npm run dev

# Ver esquema de BD en interfaz gráfica
npm run prisma:studio

# Crear una nueva migración
npm run prisma:migrate

# Compilar TypeScript
npm run build

# Correr en producción (después de build)
npm start
```

### Frontend

```powershell
# Iniciar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de build
npm run preview
```

---

## 🐛 Solución de problemas

### Error: "Cannot connect to database"

```powershell
# Verifica que PostgreSQL está corriendo
psql -U postgres -c "SELECT 1"

# Si no responde, inicia PostgreSQL
# En Windows, abre Services y busca "postgresql"
```

### Error: "Port 3000 already in use"

```powershell
# Cambia el puerto en backend/.env.local
PORT=3001

# O mata el proceso que usa el puerto
Get-Process | Where-Object {$_.Port -eq 3000}
# Luego en el Process Explorer mata el proceso
```

### Error: "Port 5173 already in use"

```powershell
# En el segundo terminal, usa otro puerto
npm run dev -- --port 5174
```

### Error: "Missing .env.local en backend"

```powershell
# Se debería haber creado, pero si no:
cd backend
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/muhu_travel"' > .env.local
echo 'JWT_SECRET="tu-secreto"' >> .env.local
echo 'PORT=3000' >> .env.local
```

### Error: "Token expired" en la UI

Es normal después de 24 horas. Solo haz login de nuevo.

---

## 📊 Estructura final

```
MuhuV1/
├── frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   │   └── backend-db.ts  (nuevo)
│   │   └── types.ts
│   ├── .env.local
│   ├── package.json
│   └── vite.config.ts
│
├── backend (Express + Prisma)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── db.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── README.md (este archivo)
```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN:**

1. **Nunca** commits `.env.local` a Git (ya está en `.gitignore`)
2. Cambia `JWT_SECRET` a algo aleatorio y largo
3. Usa contraseñas fuertes en PostgreSQL
4. Implementa HTTPS
5. Configura CORS correctamente (solo dominios confiables)
6. Usa variables de entorno en servidor de hosting

---

## 📚 Documentación adicional

- **Backend API docs:** Ver `backend/README.md`
- **Frontend:** Componentes reutilizables en `src/components/`
- **Base de datos:** Schema Prisma en `backend/prisma/schema.prisma`

---

## 🆘 Contacto y soporte

Si encuentras problemas:

1. Revisa los logs en la terminal
2. Verifica la sección "Solución de problemas" arriba
3. Asegúrate de que PostgreSQL y Node están actualizados
4. Reinstala dependencias: `npm install`

---

**¡Felicidades! Ya tienes el stack completo funcionando.** 🎉

Puedes empezar a:
- Crear nuevas reservas
- Gestionar clientes, empleados, proveedores
- Ver estadísticas en el dashboard
- Agregar nuevos paquetes turísticos

Próximos pasos opcionales:
- Agregar validación de formularios
- Implementar más roles y permisos
- Conectar a un email service (SendGrid, Mailgun)
- Agregar pagos (Stripe, PayPal)
