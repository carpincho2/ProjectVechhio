# Documentación del Backend

Este documento centraliza la explicación de toda la lógica del lado del servidor de la aplicación.

---
# Lógica de Autenticación (Backend)

Este documento detalla la lógica implementada en el backend para la autenticación de usuarios, utilizando un esquema de JSON Web Tokens (JWT).

## Componentes Clave Involucrados

Los principales componentes que orquestan la autenticación son:

*   **Modelo**: `models/user.js` (Define la estructura del usuario en la base de datos).
*   **Controlador**: `controllers/authcontrol.js` (Contiene la lógica para registrar y loguear usuarios).
*   **Rutas**: `routes/auth.js` (Expone las rutas `/register` y `/login` para la API).
*   **Middleware**: `middlewares/authmiddleware.js` (Protege las rutas que requieren autenticación).

## 1. Modelo de Usuario (`models/user.js`)

*   **Definición**: Utiliza Sequelize para definir el modelo `User` con los siguientes campos:
    *   `id`: Clave primaria autoincremental.
    *   `username`: Nombre de usuario, debe ser único.
    *   `email`: Email, debe ser único y tener un formato válido.
    *   `password`: Contraseña del usuario.
    *   `role`: Rol del usuario (`user` o `admin`), con `user` como valor por defecto.
*   **Seguridad**: No se almacena la contraseña en texto plano. Se utiliza `bcrypt` para hashearla antes de guardarla en la base de datos.

## 2. Controlador de Autenticación (`controllers/authcontrol.js`)

Este archivo maneja la lógica de negocio para el registro y el inicio de sesión.

### 2.1. Registro (`register`)

*   **Entrada**: Recibe `username`, `email` y `password` del cuerpo de la solicitud (`req.body`).
*   **Proceso**:
    1.  **Validación**: Comprueba si ya existe un usuario con el mismo `username` o `email`. Si es así, devuelve un error 400.
    2.  **Hashing de Contraseña**: Utiliza `bcrypt.hash()` para encriptar la contraseña proporcionada. El "salt round" (factor de coste) se define en una variable de entorno (`process.env.SALT_ROUNDS`) para mayor seguridad y flexibilidad.
    3.  **Creación de Usuario**: Crea un nuevo registro en la tabla `User` con los datos proporcionados y la contraseña hasheada.
    4.  **Generación de Token**: Llama a la función `generateToken` para crear un JWT para el nuevo usuario.
    5.  **Respuesta**: Devuelve un estado 201 (Creado) con un mensaje de éxito y el token JWT.
*   **Manejo de Errores**: Captura cualquier error durante el proceso y devuelve un estado 500 (Error del Servidor).

### 2.2. Inicio de Sesión (`login`)

*   **Entrada**: Recibe `username` y `password` del cuerpo de la solicitud.
*   **Proceso**:
    1.  **Búsqueda de Usuario**: Busca al usuario en la base de datos por su `username`. Si no lo encuentra, devuelve un error 404.
    2.  **Verificación de Contraseña**: Utiliza `bcrypt.compare()` para comparar la contraseña proporcionada con el hash almacenado en la base de datos. Si no coinciden, devuelve un error 401 (No autorizado).
    3.  **Generación de Token**: Si la contraseña es correcta, genera un nuevo JWT para el usuario.
    4.  **Respuesta**: Devuelve un estado 200 (OK) con un mensaje de éxito, el token JWT y los datos del usuario (excluyendo la contraseña).

### 2.3. Generación de Token (`generateToken`)

*   **Función Auxiliar**: No es un controlador, sino una función interna.
*   **Proceso**:
    *   Utiliza `jwt.sign()` para crear el token.
    *   **Payload**: El contenido del token incluye el `id`, `username` y `role` del usuario. Esto permite que el backend identifique al usuario y sus permisos en futuras solicitudes.
    *   **Secreto**: Firma el token con una clave secreta almacenada en una variable de entorno (`process.env.JWT_SECRET`).
    *   **Expiración**: El token está configurado para expirar en un tiempo determinado (`1h`), definido en `process.env.JWT_EXPIRES_IN`.

## 3. Rutas de Autenticación (`routes/auth.js`)

*   **Definición**: Utiliza `express.Router()` para definir las rutas de la API relacionadas con la autenticación.
*   **Rutas Expuestas**:
    *   `POST /register`: Mapea esta ruta a la función `register` del `authcontrol`.
    *   `POST /login`: Mapea esta ruta a la función `login` del `authcontrol`.

## 4. Middleware de Autenticación (`middlewares/authmiddleware.js`)

Este es un componente crucial para la seguridad de la API.

*   **`verifyJWT`**:
    *   **Propósito**: Es un middleware que se puede añadir a cualquier ruta que necesite ser protegida.
    *   **Proceso**:
        1.  **Extracción del Token**: Busca el token en la cabecera `Authorization` de la solicitud (en el formato `Bearer <token>`).
        2.  **Verificación**: Si el token existe, utiliza `jwt.verify()` para decodificarlo y verificar su validez usando el `JWT_SECRET`.
        3.  **Adjuntar Usuario**: Si el token es válido, el payload decodificado (que contiene `id`, `username`, `role`) se adjunta al objeto `req` (`req.user`).
        4.  **Continuación**: Llama a `next()` para permitir que la solicitud continúe hacia el controlador de la ruta protegida.
    *   **Manejo de Errores**: Si no hay token o si este es inválido, el middleware detiene la solicitud y devuelve un error 401 o 403.
*   **`isAdmin`**:
    *   **Propósito**: Middleware adicional para rutas que solo pueden ser accedidas por administradores.
    *   **Proceso**: Se ejecuta *después* de `verifyJWT` y comprueba si `req.user.role` es igual a `'admin'`.
    *   **Respuesta**: Si no es admin, devuelve un error 403 (Prohibido).

En resumen, el sistema de autenticación está diseñado para ser seguro y escalable, separando responsabilidades y utilizando estándares como JWT y bcrypt para proteger los datos y el acceso a la API.

---
# Lógica de Gestión de Vehículos (Backend)

Este documento describe la lógica del backend para gestionar el inventario de vehículos (operaciones CRUD: Crear, Leer, Actualizar, Eliminar).

## Componentes Clave

*   **Modelo**: `models/vehiculos.js`
*   **Controlador**: `controllers/vehiclescontrol.js`
*   **Rutas**: `routes/vehicles.js`
*   **Middleware**: `middlewares/authmiddleware.js` (para proteger las rutas de creación, actualización y eliminación).

## 1. Modelo de Vehículo (`models/vehiculos.js`)

Define la estructura de un vehículo en la base de datos con los siguientes campos:

*   `id`: Clave primaria.
*   `brand` (marca), `model` (modelo), `year` (año), `price` (precio).
*   `condition` (estado: 'Nuevo' o 'Usado').
*   `mileage` (kilometraje).
*   `image` (ruta a la imagen del vehículo).
*   `description` (descripción detallada).

## 2. Controlador de Vehículos (`controllers/vehiclescontrol.js`)

Contiene la lógica para cada operación CRUD.

### 2.1. `getAllVehicles` (Obtener todos los vehículos con filtros)

*   **Ruta**: `GET /api/vehicles`
*   **Acceso**: Público.
*   **Lógica**:
    *   La función ahora puede recibir filtros a través de parámetros de consulta (query params) en la URL (ej. `?brand=Ford&year=2023`).
    *   Extrae los posibles filtros (`brand`, `model`, `year`, `price`, `condition`) de `req.query`.
    *   Construye dinámicamente un objeto `where` para la consulta de Sequelize.
    *   Si se provee un filtro, se añade a la consulta. Para el precio, puede manejar rangos (ej. `price=20000-40000`).
    *   Realiza la consulta `Vehicle.findAll({ where })` a la base de datos.
    *   Devuelve la lista de vehículos filtrada o la lista completa si no se especifican filtros.

### 2.2. `getVehicleById` (Obtener un vehículo por su ID)

*   **Ruta**: `GET /api/vehicles/:id`
*   **Acceso**: Público.
*   **Lógica**:
    *   Busca un vehículo por su `id` (obtenido de los parámetros de la ruta, `req.params.id`).
    *   Si lo encuentra, lo devuelve como JSON con estado 200.
    *   Si no lo encuentra, devuelve un error 404 (No encontrado).

### 2.3. `createVehicle` (Añadir un nuevo vehículo)

*   **Ruta**: `POST /api/vehicles`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Extrae los datos del vehículo del cuerpo de la solicitud (`req.body`).
    *   Maneja la subida de la imagen del vehículo. El nombre del archivo se guarda en `req.file.filename`.
    *   Crea un nuevo registro en la tabla `Vehicles` con los datos proporcionados.
    *   Devuelve el vehículo recién creado con un estado 201 (Creado).

### 2.4. `updateVehicle` (Actualizar un vehículo existente)

*   **Ruta**: `PUT /api/vehicles/:id`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Busca el vehículo por su `id`. Si no existe, devuelve un error 404.
    *   Actualiza los campos del vehículo con los datos enviados en `req.body`.
    *   Si se sube una nueva imagen, actualiza también el campo `image`.
    *   Devuelve el vehículo actualizado con un estado 200.

### 2.5. `deleteVehicle` (Eliminar un vehículo)

*   **Ruta**: `DELETE /api/vehicles/:id`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Busca el vehículo por su `id`. Si no existe, devuelve un error 404.
    *   Elimina el registro de la base de datos.
    *   Devuelve un mensaje de éxito con un estado 200.

## 3. Rutas de Vehículos (`routes/vehicles.js`)

Este archivo mapea las rutas de la API a las funciones del controlador.

*   `router.get('/', getAllVehicles)`: Ruta pública para listar todos los vehículos.
*   `router.get('/:id', getVehicleById)`: Ruta pública para ver un vehículo.
*   `router.post('/', verifyJWT, isAdmin, createVehicle)`: Ruta protegida para crear.
*   `router.put('/:id', verifyJWT, isAdmin, updateVehicle)`: Ruta protegida para actualizar.
*   `router.delete('/:id', verifyJWT, isAdmin, deleteVehicle)`: Ruta protegida para eliminar.

El sistema está diseñado para que cualquier persona pueda ver el catálogo de vehículos, pero solo los administradores puedan modificarlo.

---
# Lógica de Gestión de Servicios (Backend)

Este documento explica la lógica del backend para la gestión de solicitudes de servicios de taller.

## Componentes Clave

*   **Modelo**: `models/services.js`
*   **Controlador**: `controllers/servicecontrol.js`
*   **Rutas**: `routes/service.js`
*   **Middleware**: `middlewares/authmiddleware.js`

## 1. Modelo de Servicio (`models/services.js`)

Define la estructura de una solicitud de servicio con los siguientes campos:

*   `id`: Clave primaria.
*   `userId`: ID del usuario que solicita el servicio (clave foránea).
*   `vehicleId`: ID del vehículo asociado (opcional, puede ser un texto si el vehículo no está en la DB).
*   `serviceType` (tipo de servicio: 'Mantenimiento', 'Reparación', etc.).
*   `requestDate` (fecha solicitada para el turno).
*   `status` (estado: 'Pendiente', 'Confirmado', 'Completado').
*   `comments` (comentarios adicionales del usuario).

## 2. Controlador de Servicios (`controllers/servicecontrol.js`)

### 2.1. `getAllServices` (Obtener todas las solicitudes de servicio)

*   **Ruta**: `GET /api/services`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Obtiene todas las solicitudes de servicio de la base de datos.
    *   Para enriquecer la respuesta, realiza un `include` de Sequelize para traer también los datos del usuario (`User`) asociado a cada solicitud.
    *   Devuelve la lista completa de servicios.

### 2.2. `createService` (Crear una nueva solicitud de servicio)

*   **Ruta**: `POST /api/services`
*   **Acceso**: Privado (requiere autenticación).
*   **Middleware**: `verifyJWT`.
*   **Lógica**:
    *   El `userId` se obtiene del token del usuario autenticado (`req.user.id`), asegurando que un usuario solo pueda crear solicitudes para sí mismo.
    *   Los demás datos (`serviceType`, `requestDate`, etc.) se toman de `req.body`.
    *   Crea el nuevo registro en la tabla `Services`.
    *   Devuelve la solicitud creada con un estado 201.

### 2.3. `updateServiceStatus` (Actualizar el estado de una solicitud)

*   **Ruta**: `PUT /api/services/:id`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Permite a un administrador cambiar el estado de una solicitud (ej., de 'Pendiente' a 'Confirmado').
    *   Busca el servicio por su `id`.
    *   Actualiza el campo `status` con el valor de `req.body.status`.
    *   Devuelve el servicio actualizado.

### 2.4. `deleteService` (Eliminar una solicitud de servicio)

*   **Ruta**: `DELETE /api/services/:id`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Elimina una solicitud de servicio de la base de datos.
    *   Devuelve un mensaje de confirmación.

## 3. Rutas de Servicios (`routes/service.js`)

*   `router.get('/', verifyJWT, isAdmin, getAllServices)`: Los administradores ven todas las solicitudes.
*   `router.post('/', verifyJWT, createService)`: Un usuario logueado puede crear una solicitud.
*   `router.put('/:id', verifyJWT, isAdmin, updateServiceStatus)`: Un administrador puede actualizar el estado.
*   `router.delete('/:id', verifyJWT, isAdmin, deleteService)`: Un administrador puede eliminar una solicitud.

El flujo permite que los usuarios creen sus solicitudes, pero la gestión (ver todas, actualizar, eliminar) está restringida a los administradores.

---
# Lógica de Gestión de Finanzas (Backend)

Este documento detalla la lógica del backend para la gestión de solicitudes de financiación.

## Componentes Clave

*   **Modelo**: `models/finance.js`
*   **Controlador**: `controllers/financecontrol.js`
*   **Rutas**: `routes/finances.js`
*   **Middleware**: `middlewares/authmiddleware.js`

## 1. Modelo de Financiación (`models/finance.js`)

Define la estructura de una solicitud de financiación con campos como:

*   `id`: Clave primaria.
*   `userId`: ID del usuario que realiza la solicitud.
*   `vehicleId`: ID del vehículo que se desea financiar.
*   `amount` (monto solicitado).
*   `term` (plazo en meses).
*   `status` (estado: 'Pendiente', 'Aprobado', 'Rechazado').
*   `applicantDetails` (un campo JSON para almacenar detalles del solicitante, como ingresos, historial, etc.).

## 2. Controlador de Finanzas (`controllers/financecontrol.js`)

### 2.1. `getAllFinances` (Obtener todas las solicitudes de financiación)

*   **Ruta**: `GET /api/finances`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Obtiene todas las solicitudes de financiación.
    *   Utiliza `include` de Sequelize para adjuntar la información del `User` y del `Vehicle` a cada solicitud, proporcionando una vista completa.
    *   Devuelve la lista de solicitudes.

### 2.2. `createFinanceRequest` (Crear una solicitud de financiación)

*   **Ruta**: `POST /api/finances`
*   **Acceso**: Privado (requiere autenticación).
*   **Middleware**: `verifyJWT`.
*   **Lógica**:
    *   El `userId` se extrae del token (`req.user.id`).
    *   Los demás detalles se toman de `req.body`.
    *   Crea un nuevo registro en la tabla `Finances`.
    *   Devuelve la solicitud creada con un estado 201.

### 2.3. `updateFinanceStatus` (Actualizar el estado de una solicitud)

*   **Ruta**: `PUT /api/finances/:id`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Permite a un administrador cambiar el estado de la solicitud.
    *   Actualiza el campo `status` con el valor de `req.body.status`.
    *   Devuelve el servicio actualizado.

### 2.4. `deleteFinanceRequest` (Eliminar una solicitud)

*   **Ruta**: `DELETE /api/finances/:id`
*   **Acceso**: Privado (requiere rol de 'admin').
*   **Middleware**: `verifyJWT`, `isAdmin`.
*   **Lógica**:
    *   Elimina la solicitud de la base de datos.
    *   Devuelve un mensaje de confirmación.

## 3. Rutas de Finanzas (`routes/finances.js`)

*   `router.get('/', verifyJWT, isAdmin, getAllFinances)`: Administradores ven todas las solicitudes.
*   `router.post('/', verifyJWT, createFinanceRequest)`: Usuarios logueados crean solicitudes.
*   `router.put('/:id', verifyJWT, isAdmin, updateFinanceStatus)`: Administradores actualizan el estado.
*   `router.delete('/:id', verifyJWT, isAdmin, deleteFinanceRequest)`: Administradores eliminan solicitudes.

Al igual que con los servicios, los usuarios inician el proceso y los administradores lo gestionan.

---
# Lógica de Gestión de Usuarios (Backend)

Esta sección describe la lógica para la gestión de usuarios, como listar usuarios y cambiar sus roles.

## Componentes Clave

*   **Modelo**: `models/user.js` (Modificado para incluir el rol `superadmin`)
*   **Controlador**: `controllers/usercontrol.js`
*   **Rutas**: `routes/users.js`
*   **Middleware**: `middlewares/authmiddleware.js` (Modificado para incluir `isSuperAdmin`)

## 1. Modelo de Usuario (`models/user.js`)

*   El campo `role` ahora acepta los valores: `'user'`, `'admin'`, y `'superadmin'`.

## 2. Middleware (`middlewares/authmiddleware.js`)

*   **`isSuperAdmin`**: Nuevo middleware que restringe el acceso solo a usuarios con el rol `superadmin`.
*   **`isAdmin`**: Modificado para que también permita el acceso a los `superadmin`.

## 3. Controlador de Usuarios (`controllers/usercontrol.js`)

### 3.1. `getAllUsers`

*   **Ruta**: `GET /api/users`
*   **Acceso**: Privado (requiere rol de `superadmin`).
*   **Lógica**: Devuelve una lista de todos los usuarios, excluyendo el campo `password` de la respuesta para mantener la seguridad.

### 3.2. `updateUserRole`

*   **Ruta**: `PUT /api/users/:id/role`
*   **Acceso**: Privado (requiere rol de `superadmin`).
*   **Lógica**:
    *   Recibe el nuevo `role` desde el cuerpo de la solicitud.
    *   Valida que el rol sea uno de los permitidos.
    *   Busca al usuario por su `id` y actualiza su campo `role`.
    *   Incluye lógica para prevenir que un superadmin se degrade a sí mismo accidentalmente.

## 4. Rutas de Usuarios (`routes/users.js`)

*   Define las rutas para la gestión de usuarios y las protege con el middleware `isSuperAdmin`.
    *   `GET /`: Llama a `getAllUsers`.
    *   `PUT /:id/role`: Llama a `updateUserRole`.

---
# Gestión del Servidor Local

Este documento describe cómo iniciar y gestionar el servidor de la aplicación utilizando los scripts proporcionados.

## 1. Script `ejecutar.bat`

El script `ejecutar.bat` es la herramienta principal para interactuar con el servidor de desarrollo local. Proporciona un menú interactivo con las siguientes opciones:

*   **1. Iniciar Servidor**: Inicia el servidor Node.js del backend.
    *   **Comportamiento al Detener (Ctrl+C)**: Si el servidor se detiene manualmente presionando `Ctrl+C` en la consola donde se ejecuta `ejecutar.bat`, el script ahora regresará automáticamente al menú principal, permitiendo al usuario elegir otra acción (reiniciar, salir, etc.) sin tener que ejecutar el `.bat` de nuevo.
*   **2. Reiniciar Servidor**: Detiene todos los procesos de Node.js en el sistema (utilizando `taskkill /f /im node.exe`) y luego reinicia el servidor.
    *   **Advertencia**: Esta opción es agresiva y cerrará *todos* los procesos de Node.js que estén corriendo en tu máquina. Úsala con precaución si tienes otros proyectos de Node.js activos.
*   **3. Salir**: Termina la ejecución del script.

### Uso

Para utilizar el script, simplemente haz doble clic en `ejecutar.bat` o ejecútalo desde la línea de comandos. Sigue las instrucciones del menú.