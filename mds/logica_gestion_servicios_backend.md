
# Lógica del Flujo de Gestión de Servicios del Backend

Este documento detalla la lógica implementada en el backend para la gestión de solicitudes de servicios, incluyendo la definición del modelo y las operaciones CRUD (Crear, Leer, Actualizar) a través de rutas API.

## Componentes Clave Involucrados

Los principales archivos que orquestan el flujo de gestión de servicios son:

*   `backend/models/services.js`: Define la estructura de los datos de las solicitudes de servicios en la base de datos.
*   `backend/routes/service.js`: Contiene las rutas API para las operaciones de servicios.
*   `backend/middlewares/authmiddleware.js`: (Reutilizado) Provee el middleware `isAdmin` para proteger rutas.

## 1. Modelo de Servicio (`backend/models/services.js`)

Este archivo define el esquema del modelo `Service` utilizando Sequelize. Cada solicitud de servicio en la base de datos tendrá los siguientes atributos:

*   **`id`**: Identificador único (entero, clave primaria, auto-incrementable).
*   **`type`**: Tipo de servicio (cadena, no nulo, ej: "mantenimiento", "reparacion").
*   **`date`**: Fecha del servicio (fecha, no nulo).
*   **`status`**: Estado de la solicitud (cadena, valor por defecto 'scheduled', ej: "scheduled", "completed", "cancelled").
*   **`userId`**: ID del usuario asociado a la solicitud (entero, no nulo). Este campo es una clave foránea que referencia al modelo `User`.
*   **`vehicleId`**: ID del vehículo asociado al servicio (entero, puede ser nulo). Este campo es una clave foránea que referencia al modelo `Vehiculo`.

Además, el modelo incluye `timestamps` (campos `createdAt` y `updatedAt` automáticos) y la tabla en la base de datos se llamará `services`.

### Asociaciones con otros Modelos

El modelo `Service` tiene las siguientes asociaciones:

*   **`belongsTo` con `User`**: Cada servicio pertenece a un usuario a través de la clave foránea `userId`.
*   **`belongsTo` con `Vehiculo`**: Cada servicio puede estar asociado a un vehículo a través de la clave foránea `vehicleId` (opcional).

## 2. Rutas de Servicios (`backend/routes/service.js`)

Este archivo maneja las solicitudes HTTP relacionadas con la gestión de solicitudes de servicios. Todas las rutas están protegidas por el middleware `isAdmin`, lo que indica que la gestión de servicios es una función administrativa.

### 2.1. Crear Nueva Solicitud de Servicio (`POST /`)

*   **Propósito**: Permite crear una nueva solicitud de servicio en la base de datos.
*   **Lógica**: Recibe el `type`, `date`, `status`, `userId` y `vehicleId` del cuerpo de la solicitud (`req.body`). Luego, crea un nuevo registro en la base de datos utilizando `db.Service.create()`. Devuelve la nueva solicitud creada como una respuesta JSON con estado `201 Created`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

### 2.2. Obtener Todas las Solicitudes de Servicio (`GET /`)

*   **Propósito**: Permite obtener una lista de todas las solicitudes de servicio existentes en la base de datos.
*   **Lógica**: Realiza una consulta `findAll()` al modelo `db.Service` y devuelve la lista de solicitudes como una respuesta JSON con estado `200 OK`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

### 2.3. Actualizar Solicitud de Servicio Existente (`PUT /:id`)

*   **Propósito**: Permite modificar los detalles de una solicitud de servicio existente.
*   **Lógica**: Recibe el `id` de la solicitud a actualizar y los nuevos datos (`type`, `date`, `status`, `userId`, `vehicleId`). Primero, busca la solicitud por su `id`. Si no la encuentra, devuelve un estado `404 Not Found`. Si se encuentra, actualiza sus atributos utilizando `service.update()`. Devuelve la solicitud actualizada con estado `200 OK`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

## Nota sobre `backend/controllers/servicecontrol.js`

Se verificó el archivo `backend/controllers/servicecontrol.js` y se encontró que está vacío. Esto indica que la lógica para la gestión de servicios se implementa directamente dentro de las rutas definidas en `backend/routes/service.js`, en lugar de delegarse a un controlador separado. Esta es una decisión de diseño consistente con otros módulos del backend en este proyecto.