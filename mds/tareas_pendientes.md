# Tareas Pendientes

*Última actualización: 2025-09-21*

## Completar Módulo de Estadísticas del Dashboard

**Objetivo**: Optimizar el cálculo de las estadísticas de Vehículos y Servicios para que se realicen en el backend, mejorando la eficiencia del panel de control.

### Estado Actual

- Las estadísticas de **Financiación** ya son eficientes (usan `GET /api/statistics/finances`).
- Las estadísticas de **Vehículos** y **Servicios** se calculan en el frontend (en `panel-control.js`), pidiendo todos los datos y contándolos en el navegador. Esto es lento e ineficiente.

### Plan de Acción

#### 1. Backend

- **Modificar `backend/controllers/statisticscontrol.js`**:
    - Añadir una nueva función `getVehicleStats` que cuente el total de vehículos y los separe por condición (`Nuevo`, `Usado`).
    - Añadir una nueva función `getServiceStats` que cuente el total de servicios y los separe por estado (`Programado`, `Completado`, `Pendiente`).

- **Modificar `backend/routes/statistics.js`**:
    - Añadir la ruta `GET /vehicles` para que use la nueva función `getVehicleStats`.
    - Añadir la ruta `GET /services` para que use la nueva función `getServiceStats`.
    - Asegurarse de que ambas rutas estén protegidas por el middleware de administrador (`verifyJWT`, `isAdmin`).

#### 2. Frontend

- **Modificar `frontend/panel-control.js`**:
    - Dentro de la función `fetchDashboardCounts`, eliminar las llamadas a `fetch('/api/vehicles')` y `fetch('/api/services')`.
    - Reemplazarlas por llamadas a las nuevas rutas: `fetch('/api/statistics/vehicles')` y `fetch('/api/statistics/services')`.
    - Usar la respuesta directa de estas nuevas rutas para rellenar los valores en el HTML del dashboard (`totalVehicles`, `newVehicles`, `scheduledServices`, etc.).
