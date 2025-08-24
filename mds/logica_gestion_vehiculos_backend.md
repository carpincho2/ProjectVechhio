# Lógica del Flujo de Gestión de Vehículos del Backend

Este documento detalla la lógica implementada en el backend para la gestión de vehículos, incluyendo la definición del modelo, las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) a través de rutas API y la configuración de carga de imágenes.

## Componentes Clave Involucrados

Los principales archivos que orquestan el flujo de gestión de vehículos son:

*   `backend/models/vehiculos.js`: Define la estructura de los datos de los vehículos en la base de datos.
*   `backend/routes/vehicles.js`: Contiene las rutas API para las operaciones de vehículos.
*   `backend/middlewares/authmiddleware.js`: (Reutilizado) Provee el middleware `isAdmin` para proteger rutas.

## 1. Modelo de Vehículo (`backend/models/vehiculos.js`)

Este archivo define el esquema del modelo `Vehiculo` utilizando Sequelize. Cada vehículo en la base de datos tendrá los siguientes atributos:

*   **`id`**: Identificador único (entero, clave primaria, auto-incrementable).
*   **`brand`**: Marca del vehículo (cadena, no nulo).
*   **`model`**: Modelo del vehículo (cadena, no nulo).
*   **`year`**: Año de fabricación (entero, no nulo).
*   **`price`**: Precio (decimal con 10 dígitos en total y 2 decimales, no nulo).
*   **`color`**: Color del vehículo (cadena, puede ser nulo).
*   **`mileage`**: Kilometraje (entero, puede ser nulo).
*   **`status`**: Estado del vehículo (cadena, valor por defecto 'available', ej: "disponible", "vendido", "reservado").
*   **`condition`**: Condición del vehículo (cadena, no nulo, ej: "Nuevo", "Usado").
*   **`image`**: URL o ruta de la imagen del vehículo (cadena, puede ser nulo).
*   **`description`**: Descripción detallada del vehículo (texto, puede ser nulo).

Además, el modelo incluye `timestamps` (campos `createdAt` y `updatedAt` automáticos) y la tabla en la base de datos se llamará `vehiculos`.

## 2. Rutas de Vehículos (`backend/routes/vehicles.js`)

Este archivo maneja las solicitudes HTTP relacionadas con la gestión de vehículos. Utiliza `multer` para la carga de imágenes y el middleware `isAdmin` para proteger las rutas que requieren permisos de administrador.

### 2.1. Configuración de Carga de Imágenes (Multer)

Se configura `multer` para manejar la subida de archivos. Las imágenes se guardan en la carpeta `uploads/` dentro del backend. El nombre de cada archivo de imagen se genera de forma única utilizando la marca de tiempo actual (`Date.now()`) y la extensión original del archivo.

### 2.2. Obtener Todos los Vehículos (`GET /`)

*   **Propósito**: Permite obtener una lista de todos los vehículos disponibles en la base de datos.
*   **Lógica**: Realiza una consulta `findAll()` al modelo `db.Vehiculo` y devuelve la lista de vehículos como una respuesta JSON con estado `200 OK`.
*   **Acceso**: Esta ruta es pública y no requiere autenticación.

### 2.3. Obtener Vehículo por ID (`GET /:id`)

*   **Propósito**: Permite obtener los detalles de un vehículo específico utilizando su `id`.
*   **Lógica**: Busca un vehículo por su clave primaria (`findByPk()`). Si el vehículo no se encuentra, devuelve un estado `404 Not Found`. Si se encuentra, devuelve los detalles del vehículo como JSON con estado `200 OK`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`, lo que significa que solo los usuarios con rol de administrador pueden acceder a ella.

### 2.4. Crear Nuevo Vehículo (`POST /`)

*   **Propósito**: Permite añadir un nuevo vehículo a la base de datos.
*   **Lógica**: Recibe los datos del vehículo del cuerpo de la solicitud (`req.body`) y, si se sube una imagen, la procesa con `multer` y guarda su ruta. Luego, crea un nuevo registro en la base de datos utilizando `db.Vehiculo.create()`. Devuelve el nuevo vehículo creado con estado `201 Created`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin` y requiere la subida de una imagen (opcionalmente, si el campo `image` es nulo).

### 2.5. Actualizar Vehículo Existente (`PUT /:id`)

*   **Propósito**: Permite modificar los detalles de un vehículo existente.
*   **Lógica**: Recibe el `id` del vehículo a actualizar y los nuevos datos. Primero, busca el vehículo por `id`. Si no lo encuentra, devuelve `404 Not Found`. Si se encuentra, actualiza sus atributos utilizando `vehicle.update()`. Si se sube una nueva imagen, la reemplaza. Devuelve el vehículo actualizado con estado `200 OK`.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin` y también puede manejar la subida de una nueva imagen.

### 2.6. Eliminar Vehículo (`DELETE /:id`)

*   **Propósito**: Eliminar un vehículo de la base de datos.
*   **Lógica**: Actualmente, esta ruta devuelve un estado `501 Not Implemented` y un mensaje indicando que la funcionalidad de eliminación aún no está implementada.
*   **Acceso**: Esta ruta está protegida por el middleware `isAdmin`.

## Nota sobre `backend/controllers/vehiclescontrol.js`

Se verificó el archivo `backend/controllers/vehiclescontrol.js` y se encontró que está vacío. Esto indica que la lógica para la gestión de vehículos se implementa directamente dentro de las rutas definidas en `backend/routes/vehicles.js`, en lugar de delegarse a un controlador separado. Esto es una decisión de diseño válida, aunque a menudo los proyectos más grandes separan la lógica en controladores para una mejor organización.