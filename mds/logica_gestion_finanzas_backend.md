
# Lógica del Flujo de Gestión de Finanzas del Backend

Este documento detalla la lógica implementada en el backend para la gestión de solicitudes de financiación, incluyendo la definición del modelo y las operaciones CRUD (Crear, Leer, Actualizar) a través de rutas API.

## Componentes Clave Involucrados

Los principales archivos que orquestan el flujo de gestión de finanzas son:

*   `backend/models/finance.js`: Define la estructura de los datos de las solicitudes de financiación en la base de datos.
*   `backend/routes/finances.js`: Contiene las rutas API para las operaciones de financiación.
*   `backend/middlewares/authmiddleware.js`: (Reutilizado) Provee el middleware `isAdmin` para proteger rutas.

## 1. Modelo de Finanzas (`backend/models/finance.js`)

Este archivo define el esquema del modelo `Finance` utilizando Sequelize. Cada solicitud de financiación en la base de datos tendrá los siguientes atributos:

*   **`id`**: Identificador único (entero, clave primaria, auto-incrementable).
*   **`amount`**: Monto de la financiación (decimal con 10 dígitos en total y 2 decimales, no nulo).
*   **`term`**: Plazo de la financiación en meses (entero, no nulo).
*   **`status`**: Estado de la solicitud (cadena, valor por defecto 'pending', ej: "pending", "approved", "rejected").
*   **`userId`**: ID del usuario asociado a la solicitud (entero, no nulo). Este campo es una clave foránea que referencia al modelo `User`.

Además, el modelo incluye `timestamps` (campos `createdAt` y `updatedAt` automáticos) y la tabla en la base de datos se llamará `finances`.

### Asociación con el Modelo `User`

El modelo `Finance` tiene una asociación `belongsTo` con el modelo `User` a través de la clave foránea `userId`. Esto significa que cada solicitud de financiación pertenece a un usuario específico.

## 2. Rutas de Finanzas (`backend/routes/finances.js`)

Este archivo maneja las solicitudes HTTP relacionadas con la gestión de solicitudes de financiación. Todas las rutas están protegidas por el middleware `isAdmin`, lo que indica que la gestión de finanzas es una función administrativa.

### 2.1. Crear Nueva Solicitud de Financiación (`POST /`)

*   **Propósito**: Permite crear una nueva solicitud de financiación en la base de datos.
*   **Lógica**: Recibe el `amount`, `term` y `userId` del cuerpo de la solicitud (`req.body`). Luego, crea un nuevo registro en la base de datos utilizando `db.Finance.create()`. Devuelve la nueva solicitud creada como una respuesta JSON con estado `201 Created`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

### 2.2. Obtener Todas las Solicitudes de Financiación (`GET /`)

*   **Propósito**: Permite obtener una lista de todas las solicitudes de financiación existentes en la base de datos.
*   **Lógica**: Realiza una consulta `findAll()` al modelo `db.Finance` y devuelve la lista de solicitudes como una respuesta JSON con estado `200 OK`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

### 2.3. Actualizar Solicitud de Financiación Existente (`PUT /:id`)

*   **Propósito**: Permite modificar los detalles de una solicitud de financiación existente.
*   **Lógica**: Recibe el `id` de la solicitud a actualizar y los nuevos datos (`amount`, `term`, `userId`). Primero, busca la solicitud por su `id`. Si no la encuentra, devuelve un estado `404 Not Found`. Si se encuentra, actualiza sus atributos utilizando `finance.update()`. Devuelve la solicitud actualizada con estado `200 OK`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

## Nota sobre `backend/controllers/financecontrol.js`

Se verificó el archivo `backend/controllers/financecontrol.js` y se encontró que está vacío. Esto indica que la lógica para la gestión de finanzas se implementa directamente dentro de las rutas definidas en `backend/routes/finances.js`, en lugar de delegarse a un controlador separado. Esta es una decisión de diseño consistente con otros módulos del backend en este proyecto.