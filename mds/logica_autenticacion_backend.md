# Lógica del Flujo de Autenticación del Backend

Este documento detalla la lógica implementada en el backend para la gestión de usuarios, incluyendo el registro, inicio de sesión, verificación de sesión y cierre de sesión, así como la protección de rutas para administradores.

## Componentes Clave Involucrados

Los principales archivos que orquestan el flujo de autenticación son:

*   `backend/models/user.js`: Define la estructura de los datos del usuario en la base de datos.
*   `backend/routes/auth.js`: Contiene las rutas API para las operaciones de autenticación (login, register, check, logout).
*   `backend/middlewares/authmiddleware.js`: Provee un middleware para verificar el rol de administrador.

## 1. Modelo de Usuario (`backend/models/user.js`)

Este archivo define el esquema del modelo `User` utilizando Sequelize. Cada usuario en la base de datos tendrá los siguientes atributos:

*   **`id`**: Identificador único (entero, clave primaria, auto-incrementable).
*   **`username`**: Nombre de usuario (cadena, no nulo, único, longitud entre 3 y 30 caracteres).
*   **`email`**: Correo electrónico (cadena, no nulo, único, formato de email válido).
*   **`password`**: Contraseña (cadena, no nulo, longitud entre 6 y 100 caracteres). Esta contraseña se almacena *hasheada* por seguridad.
*   **`role`**: Rol del usuario (cadena, valor por defecto 'user', puede ser 'user' o 'admin').

Además, el modelo incluye `timestamps` (campos `createdAt` y `updatedAt` automáticos) y la tabla en la base de datos se llamará `users`.

## 2. Rutas de Autenticación (`backend/routes/auth.js`)

Este archivo maneja las solicitudes HTTP relacionadas con la autenticación y la sesión del usuario.

### 2.1. Proceso de Login (`POST /login`)

1.  **Recepción de Credenciales**: La ruta recibe el `username` (que puede ser el nombre de usuario o el email) y la `password` del cuerpo de la solicitud.
2.  **Búsqueda de Usuario**: Busca un usuario en la base de datos que coincida con el `username` proporcionado (ya sea por `username` o por `email`).
3.  **Verificación de Existencia**: Si no se encuentra ningún usuario, se redirige al usuario a la página de login con un mensaje de error.
4.  **Verificación de Contraseña**: Utiliza `bcrypt.compare()` para comparar la contraseña proporcionada por el usuario con la contraseña hasheada almacenada en la base de datos. Si no coinciden, se redirige con un mensaje de error.
5.  **Creación de Sesión**: Si las credenciales son válidas, se crea un objeto de sesión (`req.session.user`) que almacena el `id`, `username`, `email`, `role` y un indicador `loggedIn: true` del usuario.
6.  **Redirección por Rol**: El usuario es redirigido a `/panel-control` si su rol es 'admin', o a `/` (la página principal) si es un usuario normal.
7.  **Manejo de Errores**: Cualquier error durante el proceso es capturado y se redirige al usuario a la página de login con un mensaje de error genérico.

### 2.2. Proceso de Registro (`POST /register`)

1.  **Recepción de Datos**: La ruta recibe `username`, `email`, `password` y `confirm` (confirmación de contraseña) del cuerpo de la solicitud.
2.  **Validación de Contraseñas**: Verifica que `password` y `confirm` sean idénticas. Si no, redirige con un error.
3.  **Verificación de Usuario Existente**: Busca si ya existe un usuario con el mismo `username` o `email` en la base de datos. Si es así, redirige con un error.
4.  **Hash de Contraseña**: Utiliza `bcrypt.hash()` para hashear la `password` proporcionada. Se usa un `saltRounds` de 10 para la seguridad del hash.
5.  **Creación de Usuario**: Se crea un nuevo registro de usuario en la base de datos con el `username`, `email`, la `password` hasheada y un `role` por defecto de 'user'.
6.  **Creación de Sesión**: Similar al login, se crea un objeto de sesión para el nuevo usuario registrado.
7.  **Redirección por Rol**: El usuario es redirigido a `/panel-control` si el rol del nuevo usuario es 'admin' (aunque por defecto es 'user'), o a `/` si es un usuario normal.
8.  **Manejo de Errores**: Cualquier error durante el proceso es capturado y se redirige al usuario a la página de registro con un mensaje de error genérico.

### 2.3. Verificación de Sesión (`GET /check`)

Esta ruta permite al frontend verificar si un usuario está actualmente logueado. Si `req.session.user` existe y `loggedIn` es `true`, devuelve un JSON indicando `loggedIn: true` y los datos del usuario. De lo contrario, devuelve `loggedIn: false`.

### 2.4. Cierre de Sesión (`GET /logout`)

Esta ruta destruye la sesión del usuario (`req.session.destroy()`). Una vez que la sesión es destruida, el usuario es redirigido a la página principal (`/`).

## 3. Middleware de Administrador (`backend/middlewares/authmiddleware.js`)

Este archivo exporta una función `isAdmin` que actúa como un middleware. Su propósito es proteger rutas específicas que solo deben ser accesibles por usuarios con rol de 'admin'.

*   **Lógica**: Verifica si `req.session.user` existe y si el `role` del usuario en la sesión es 'admin'.
*   **Acceso Permitido**: Si el usuario es un administrador, llama a `next()` para pasar el control a la siguiente función middleware o al controlador de la ruta.
*   **Acceso Denegado**: Si el usuario no es un administrador, responde con un estado `403 Forbidden` y un mensaje de error.

## Nota sobre `backend/controllers/authcontrol.js`

Se observó la existencia del archivo `backend/controllers/authcontrol.js` que contiene funciones `register` y `login` que utilizan `jsonwebtoken` para la creación de tokens. Sin embargo, las rutas de autenticación en `backend/routes/auth.js` implementan directamente la lógica de autenticación utilizando `req.session` y `bcrypt`, sin hacer uso de las funciones exportadas por `authcontrol.js`. Esto sugiere que `authcontrol.js` podría ser un código no utilizado o una implementación alternativa no integrada en el flujo actual de autenticación basado en sesiones. El flujo de autenticación actual se basa en sesiones y no en tokens JWT para la gestión de la autenticación del usuario.