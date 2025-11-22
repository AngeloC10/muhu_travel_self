# 🏗️ Arquitectura de Muhu Travel

Visión general de cómo funciona el sistema completo.

---

## 🌐 Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Navegador)                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  React 19 + TypeScript                                       │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ UI Components (Login, Dashboard, EntityManager)      │   │ │
│  │  │ ├── Login.tsx                                        │   │ │
│  │  │ ├── Dashboard.tsx                                    │   │ │
│  │  │ ├── EntityManager.tsx (CRUD)                        │   │ │
│  │  │ ├── ReservationWizard.tsx (5 pasos)                │   │ │
│  │  │ └── GenericTable.tsx (tablas reutilizables)         │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Context & Services                                   │   │ │
│  │  │ ├── AuthContext.tsx                                  │   │ │
│  │  │ ├── services/backend-db.ts (llamadas HTTP)         │   │ │
│  │  │ └── localStorage (sesión + token)                   │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Puertos: localhost:5173 (Vite dev server)                       │
└─────────────────────────────────────────────────────────────────┘
                                ⬇️
                        HTTP/REST API Calls
                        (JSON + JWT Token)
                                ⬇️
┌─────────────────────────────────────────────────────────────────┐
│                      SERVIDOR BACKEND                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Express.js + TypeScript                                    │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Servidor HTTP                                        │  │ │
│  │  │ - CORS habilitado                                    │  │ │
│  │  │ - Body parser JSON                                   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ⬇️                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Middleware                                           │  │ │
│  │  │ - auth.ts: Valida JWT de requests protegidas        │  │ │
│  │  │ - error: Maneja errores                             │  │ │
│  │  │ - logging: Registra requests (opcional)             │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ⬇️                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Router & Routes                                      │  │ │
│  │  │ ├── /api/auth/login (public)                        │  │ │
│  │  │ ├── /api/auth/register (public)                     │  │ │
│  │  │ ├── /api/users/* (protected)                        │  │ │
│  │  │ ├── /api/clients/* (protected)                      │  │ │
│  │  │ ├── /api/employees/* (protected)                    │  │ │
│  │  │ ├── /api/providers/* (protected)                    │  │ │
│  │  │ ├── /api/packages/* (protected)                     │  │ │
│  │  │ └── /api/reservations/* (protected)                 │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ⬇️                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Controllers (Lógica de negocio)                     │  │ │
│  │  │ ├── auth.ts: login, register, getProfile           │  │ │
│  │  │ ├── users.ts: CRUD usuarios                        │  │ │
│  │  │ ├── clients.ts: CRUD clientes                      │  │ │
│  │  │ ├── employees.ts: CRUD empleados                  │  │ │
│  │  │ ├── providers.ts: CRUD proveedores                │  │ │
│  │  │ ├── packages.ts: CRUD paquetes                    │  │ │
│  │  │ └── reservations.ts: crear, actualizar reservas   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ⬇️                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Utilities                                            │  │ │
│  │  │ ├── jwt.ts: Generar y verificar tokens             │  │ │
│  │  │ └── password.ts: Hash y compare con bcrypt         │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ⬇️                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Prisma ORM                                           │  │ │
│  │  │ - Type-safe database access                         │  │ │
│  │  │ - Migraciones automáticas                           │  │ │
│  │  │ - Query builder                                     │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Puerto: localhost:3000                                          │
└─────────────────────────────────────────────────────────────────┘
                                ⬇️
                        SQL Queries
                        (PostgreSQL Protocol)
                                ⬇️
┌─────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                                 │
│                   PostgreSQL 12+                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Tablas:                                                   │   │
│  │ ├── users (id, name, email, password, role, active)     │   │
│  │ ├── clients (id, fullName, docType, docNumber, ...)     │   │
│  │ ├── employees (id, fullName, position, hireDate, ...)   │   │
│  │ ├── providers (id, companyName, serviceType, ...)       │   │
│  │ ├── tour_packages (id, name, price, durationDays, ...)  │   │
│  │ ├── reservations (id, code, packageId, clientId, ...)   │   │
│  │ └── passengers (id, firstName, lastName, docNumber, ...) │   │
│  │                                                           │   │
│  │ Relaciones:                                              │   │
│  │ Reservation.clientId → Client.id (FK)                    │   │
│  │ Reservation.packageId → TourPackage.id (FK)              │   │
│  │ Passenger.reservationId → Reservation.id (FK, CASCADE)   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Puerto: localhost:5432                                          │
│  Base de datos: "muhu_travel"                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos principales

### 1️⃣ Flujo de Login

```
Usuario escribe email/pass
          ⬇️
Frontend: onClick → db.login(email, password)
          ⬇️
HTTP POST /api/auth/login { email, password }
          ⬇️
Backend: auth.controller.login()
  ├─ Buscar usuario en BD
  ├─ Comparar password con bcrypt
  ├─ Generar JWT token (válido 24h)
  └─ Devolver usuario + token
          ⬇️
Frontend: localStorage.setItem('muhu_token', token)
          ⬇️
AuthContext actualiza estado: { user, isAuthenticated: true }
          ⬇️
Redirigir a /dashboard
```

### 2️⃣ Flujo de CRUD (Ej: Crear cliente)

```
Usuario llena formulario → Hace click "Guardar"
          ⬇️
Frontend: db.createClient({ fullName, docType, docNumber, ... })
          ⬇️
HTTP POST /api/clients
  Headers: { Authorization: "Bearer <token>" }
  Body: { fullName, docType, docNumber, email, phone }
          ⬇️
Backend Middleware: authMiddleware()
  ├─ Extrae token del header
  ├─ Valida JWT
  └─ Si válido, continúa; si no, devuelve 401
          ⬇️
Backend Controller: clients.createClient()
  ├─ Valida datos (required fields, formato)
  ├─ Verifica si ya existe (por docType + docNumber)
  ├─ INSERT INTO clients (...) VALUES (...)
  └─ Devuelve cliente creado
          ⬇️
Frontend: Actualiza lista de clientes en UI
          ⬇️
Muestra notificación de éxito
```

### 3️⃣ Flujo de Crear Reserva (5 pasos)

```
PASO 1: Seleccionar paquete + fecha + cantidad
        → GET /api/packages
        → Calcula total estimado

PASO 2: Llenar datos de pasajeros
        → Valida en frontend (nombres, documentos)

PASO 3: Seleccionar método de pago
        → Se guarda en payload

PASO 4: Datos de facturación (cliente)
        → POST /api/clients/upsert
        → Crea o actualiza cliente

PASO 5: Confirmar
        → POST /api/reservations
        └─ Backend:
           ├─ Crea registro en DB
           ├─ Genera codigo (RES-2024-0001)
           ├─ Inserta pasajeros (relación 1:N)
           └─ Devuelve reserva con código
        → Frontend: Muestra "¡Éxito!" con código
```

### 4️⃣ Flujo de Actualización (PUT)

```
Usuario edita un campo y hace click "Actualizar"
          ⬇️
Frontend: db.updateEmployee(id, { status: "INACTIVE" })
          ⬇️
HTTP PUT /api/employees/:id
  Headers: { Authorization: "Bearer <token>" }
  Body: { status: "INACTIVE" }
          ⬇️
Backend: Valida token → Update en BD → Devuelve recurso actualizado
          ⬇️
Frontend: Actualiza tabla en UI
```

### 5️⃣ Flujo de Eliminación (DELETE)

```
Usuario hace click en botón "Eliminar"
          ⬇️
Confirmación: "¿Estás seguro?"
          ⬇️
Si acepta:
  Frontend: db.deleteEmployee(id)
          ⬇️
  HTTP DELETE /api/employees/:id
  Headers: { Authorization: "Bearer <token>" }
          ⬇️
  Backend: 
    - Empleados/Proveedores → UPDATE status = 'INACTIVE' (soft delete)
    - Packages → DELETE (hard delete)
  ⬇️
  Devuelve mensaje de éxito
          ⬇️
  Frontend: Recarga lista
```

---

## 🔐 Flujo de Autenticación con JWT

```
┌─────────────────────────────────────────────────────┐
│ 1. USUARIO HACE LOGIN                               │
│    POST /api/auth/login                             │
│    { email: "admin@muhutravel.com", password: ... } │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 2. BACKEND VERIFICA CONTRASEÑA                      │
│    password == bcrypt.compare(input, hash en BD)    │
│    ✅ Válida → continúa                             │
│    ❌ Inválida → devuelve 401                       │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 3. BACKEND GENERA JWT                               │
│    jwt.sign({                                       │
│      userId: "clu4a5x1l...",                        │
│      email: "admin@muhutravel.com",                 │
│      role: "ADMIN"                                  │
│    }, JWT_SECRET, { expiresIn: "24h" })             │
│                                                     │
│    Token = header.payload.signature                 │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 4. BACKEND DEVUELVE TOKEN AL FRONTEND               │
│    { user: {...}, token: "eyJ..." }                 │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 5. FRONTEND GUARDA TOKEN                            │
│    localStorage.setItem('muhu_token', token)        │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 6. FRONTEND HACE REQUEST PROTEGIDO                  │
│    GET /api/clients                                 │
│    Headers: {                                       │
│      Authorization: "Bearer eyJ..."                 │
│    }                                                │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 7. BACKEND VALIDA TOKEN (Middleware)                │
│    jwt.verify(token, JWT_SECRET)                    │
│    ✅ Válido y no expirado → continúa              │
│    ❌ Inválido o expirado → devuelve 401            │
└─────────────────────────────────────────────────────┘
                        ⬇️
┌─────────────────────────────────────────────────────┐
│ 8. BACKEND PROCESA REQUEST                          │
│    req.user = { userId, email, role }              │
│    Continúa con el controller                       │
│    ...                                              │
│    Devuelve datos solicitados                       │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Estructura de datos (Ejemplo)

### Usuario

```json
{
  "id": "clu4a5x1l0000l90s1a2b3c4",
  "name": "Admin User",
  "email": "admin@muhutravel.com",
  "password": "$2b$10$N9qo8uLOickgx2ZMRZo...",
  "role": "ADMIN",
  "active": true,
  "createdAt": "2024-11-20T15:30:00Z",
  "updatedAt": "2024-11-20T15:30:00Z"
}
```

### Cliente

```json
{
  "id": "clu4a5x2q0001l90s1a2b3c5",
  "fullName": "Juan Perez García",
  "docType": "DNI",
  "docNumber": "12345678",
  "email": "juan@example.com",
  "phone": "+51987654321",
  "createdAt": "2024-11-20T16:00:00Z",
  "updatedAt": "2024-11-20T16:00:00Z"
}
```

### Reserva

```json
{
  "id": "clu4a5x3k0002l90s1a2b3c6",
  "reservationCode": "RES-2024-0001",
  "packageId": "pkg_1",
  "package": { "id": "pkg_1", "name": "Cusco Mágico", "price": 450, ... },
  "clientId": "clu4a5x2q0001l90s1a2b3c5",
  "client": { "id": "...", "fullName": "Juan Perez García", ... },
  "travelDate": "2024-12-20T00:00:00Z",
  "adultCount": 2,
  "totalAmount": 900,
  "status": "CONFIRMED",
  "paymentMethod": "CREDIT_CARD",
  "couponCode": null,
  "passengers": [
    {
      "id": "pas_1",
      "firstName": "JUAN",
      "lastName": "PEREZ",
      "nationality": "Peru",
      "docType": "DNI",
      "docNumber": "12345678",
      "birthDate": "1990-05-15T00:00:00Z",
      "gender": "M"
    },
    {
      "id": "pas_2",
      "firstName": "MARIA",
      "lastName": "PEREZ",
      "nationality": "Peru",
      "docType": "DNI",
      "docNumber": "87654321",
      "birthDate": "1992-08-20T00:00:00Z",
      "gender": "F"
    }
  ],
  "dateCreated": "2024-11-20T17:00:00Z",
  "createdAt": "2024-11-20T17:00:00Z",
  "updatedAt": "2024-11-20T17:00:00Z"
}
```

---

## 🎯 Decisiones de diseño

| Aspecto | Decisión | Razón |
|--------|---------|-------|
| ORM | Prisma | Type-safe, migraciones, excelente DX |
| Auth | JWT | Stateless, escalable, standard |
| Hash | bcrypt | Seguro, salts automáticos |
| BD | PostgreSQL | Robusta, ACID, relaciones, free |
| API | REST | Simple, estándar, fácil de entender |
| Soft delete | Empleados/Proveedores | Auditoría, datos históricos |
| Hard delete | Packages | Limpieza de datos obsoletos |
| Framework | Express | Minimalista, flexible, enorme comunidad |

---

## 🚀 Stack resumido

```
Frontend:
  React 19
  TypeScript
  Vite
  Tailwind CSS
  React Router
  Recharts
  Lucide Icons

Backend:
  Node.js
  Express
  TypeScript
  Prisma
  PostgreSQL
  JWT (jsonwebtoken)
  bcrypt
  CORS

DevOps:
  Git
  npm/yarn
  Docker (opcional)
```

---

## ✅ Features implementadas

- ✅ Autenticación JWT
- ✅ Roles (ADMIN, AGENT)
- ✅ CRUD: Usuarios, Clientes, Empleados, Proveedores, Paquetes
- ✅ Reservas (5 pasos con validación)
- ✅ Soft delete (Empleados, Proveedores)
- ✅ Upsert de clientes
- ✅ Dashboard con estadísticas
- ✅ Tablas con búsqueda y paginación
- ✅ Interfaz responsive
- ✅ Transacciones de BD (opcional con Prisma)

---

## 📈 Escalabilidad

El sistema está preparado para:

- **Más usuarios:** PostgreSQL + índices
- **Más transacciones:** Caché (Redis), read replicas
- **Microservicios:** Separar dominos (auth, reservas, pagos)
- **Analytics:** Data warehouse, eventos
- **Mobile:** API REST funciona con iOS/Android
- **Real-time:** WebSockets para notificaciones

---

**Arquitectura finalizada el 20 de noviembre de 2024** ✅
