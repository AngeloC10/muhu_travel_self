# Guía de Pruebas - Muhu Travel Management System

Este documento describe todas las pruebas implementadas en el sistema: **6 pruebas unitarias**, **6 pruebas de integración** y **7 pruebas de sistema (E2E)**.

---

## 📋 Resumen de Pruebas

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| **Unitarias** | 6 | `backend/src/utils/*.test.ts` |
| **Integración** | 6 | `backend/tests/integration.test.ts` |
| **Sistema (E2E)** | 7 | `tests/e2e/*.spec.ts` |
| **TOTAL** | **19** | - |

---

## 🔧 Instalación de Dependencias

### Backend (Unitarias e Integración)

```bash
cd backend
npm install --save-dev vitest supertest @types/supertest
```

### Frontend (E2E)

```bash
# Desde la raíz del proyecto
npm install --save-dev @playwright/test
npx playwright install chromium
```

---

## 🧪 Pruebas Unitarias (6)

### Descripción
Prueban funciones individuales de utilidad sin dependencias externas.

### Ubicación
- `backend/src/utils/password.test.ts` (3 tests)
- `backend/src/utils/jwt.test.ts` (3 tests)

### Tests Implementados

#### Password Utils (3)
1. ✅ Debe hashear correctamente una contraseña
2. ✅ Debe comparar correctamente contraseñas (match)
3. ✅ Debe fallar al comparar contraseñas incorrectas

#### JWT Utils (3)
1. ✅ Debe generar un token JWT válido
2. ✅ Debe verificar correctamente un token válido
3. ✅ Debe rechazar un token inválido

### Comando para Ejecutar

```bash
cd backend
npm test
```

---

## 🔗 Pruebas de Integración (6)

### Descripción
Prueban la integración entre controladores, middleware y base de datos simulando requests HTTP.

### Ubicación
- `backend/tests/integration.test.ts`

### Tests Implementados

#### Autenticación (4)
1. ✅ Login exitoso con credenciales válidas (Admin)
2. ✅ Login fallido con credenciales inválidas
3. ✅ Login exitoso como Agente
4. ✅ Registro fallido sin contraseña de administrador

#### Endpoints Protegidos (2)
1. ✅ Acceso denegado a `/api/packages` sin token
2. ✅ Acceso permitido a `/api/packages` con token válido de Agente

### Comando para Ejecutar

```bash
cd backend
npm test
```

**Nota:** Las pruebas unitarias e integración se ejecutan juntas con `npm test`.

---

## 🌐 Pruebas de Sistema (E2E) (7)

### Descripción
Prueban flujos completos de usuario en el navegador, simulando interacciones reales.

### Ubicación
- `tests/e2e/auth.spec.ts` (3 tests)
- `tests/e2e/rbac.spec.ts` (1 test)
- `tests/e2e/packages.spec.ts` (1 test)
- `tests/e2e/clients.spec.ts` (1 test)
- `tests/e2e/reservation.spec.ts` (1 test)

### Tests Implementados

#### Autenticación (3)
1. ✅ Login exitoso como Administrador
2. ✅ Login exitoso como Agente
3. ✅ Login fallido con credenciales inválidas

#### Control de Acceso - RBAC (1)
4. ✅ Agente no puede ver "Usuarios Sistema" (solo Admin)

#### Gestión de Paquetes (1)
5. ✅ Admin puede crear un nuevo paquete turístico

#### Gestión de Clientes (1)
6. ✅ Búsqueda de clientes existentes

#### Flujo de Reservas (1)
7. ✅ Crear una reserva completa:
   - Seleccionar paquete y fecha
   - Ingresar datos de pasajeros
   - Seleccionar método de pago
   - Completar facturación
   - Confirmar reserva

### Comando para Ejecutar

```bash
# Desde la raíz del proyecto

# Ejecutar todas las pruebas E2E
npx playwright test

# Ejecutar en modo visual (ver navegador)
npx playwright test --headed

# Ejecutar prueba específica
npx playwright test auth.spec.ts

# Ver reporte HTML
npx playwright show-report
```

### ⚠️ Requisitos Previos para E2E

Las pruebas E2E requieren que **ambos servidores estén corriendo**:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:5173`

---

## 📊 Ejecutar Todas las Pruebas

### Opción 1: Ejecutar por Separado

```bash
# 1. Pruebas Unitarias e Integración
cd backend
npm test

# 2. Pruebas E2E (requiere servidores corriendo)
cd ..
npx playwright test
```

### Opción 2: Script Combinado

Puedes agregar este script a tu `package.json` raíz:

```json
{
  "scripts": {
    "test:all": "cd backend && npm test && cd .. && npx playwright test"
  }
}
```

Luego ejecutar:
```bash
npm run test:all
```

---

## 🎯 Cobertura de Pruebas

| Componente | Tipo de Prueba | Cobertura |
|------------|----------------|-----------|
| Utils (Password, JWT) | Unitarias | ✅ 100% |
| Auth API | Integración | ✅ Login, Register |
| Protected Routes | Integración | ✅ Middleware |
| Login Flow | E2E | ✅ Admin, Agent |
| RBAC | E2E | ✅ Role-based access |
| Packages | E2E | ✅ CRUD Admin |
| Clients | E2E | ✅ Search |
| Reservations | E2E | ✅ Complete flow |

---

## 🐛 Debugging

### Ver Tests en Acción (E2E)
```bash
npx playwright test --headed --debug
```

### Ver Logs de Backend
```bash
cd backend
npm run dev
# Los logs aparecerán aquí
```

### Inspeccionar Tests Fallidos (E2E)
```bash
npx playwright show-report
```

---

## 📝 Notas Importantes

1. **Base de Datos**: Las pruebas de integración usan la misma base de datos de desarrollo. Asegúrate de tener data seed.
   
2. **Credenciales de Prueba**:
   - Admin: `admin@muhu.com` / `admin123`
   - Agente: `agente@muhu.com` / `agent123`

3. **Timeouts**: Las pruebas E2E tienen timeouts de 60 segundos por defecto.

4. **CI/CD**: Para integración continua, considera usar:
   ```bash
   npx playwright test --reporter=github
   ```

---

## ✅ Resultado Final

**Total:** 19/19 pruebas pasando ✅

- **Unitarias:** 6/6 ✅
- **Integración:** 6/6 ✅  
- **Sistema (E2E):** 7/7 ✅
