# Documentación del Frontend

Este documento centraliza la explicación de toda la lógica del lado del cliente de la aplicación, desde la autenticación y el panel de control hasta las páginas de visualización estática.

---

# Lógica del Frontend: Autenticación y Panel de Control

Este documento detalla la lógica implementada en el frontend para el proceso de autenticación (login y registro) y la interacción con el panel de control administrativo.

## Componentes Clave Involucrados

Los principales archivos que orquestan este flujo son:

*   `frontend/login.html`: Página HTML para el inicio de sesión.
*   `frontend/register.html`: Página HTML para el registro de nuevos usuarios.
*   `frontend/login.js`: Script JavaScript que maneja la lógica del lado del cliente para el login y la visualización de mensajes.
*   `frontend/modulos.js`: Módulo JavaScript que contiene funciones compartidas, incluyendo la verificación del estado de la sesión (`checkLogin`).
*   `frontend/index.html`: Página principal que ahora coordina la verificación de sesión y la actualización de la interfaz de usuario.

# Documentación del Frontend

Este documento centraliza la explicación de toda la lógica del lado del cliente de la aplicación, desde la autenticación y el panel de control hasta las páginas de visualización estática.

---

# Lógica del Frontend: Autenticación y Panel de Control

Este documento detalla la lógica implementada en el frontend para el proceso de autenticación (login y registro) y la interacción con el panel de control administrativo.

## Componentes Clave Involucrados

Los principales archivos que orquestan este flujo son:

*   `frontend/login.html`: Página HTML para el inicio de sesión.
*   `frontend/register.html`: Página HTML para el registro de nuevos usuarios.
*   `frontend/login.js`: Script JavaScript que maneja la lógica del lado del cliente para el login y la visualización de mensajes.
*   `frontend/panel-control.html`: Página HTML del panel de control administrativo.
*   `frontend/panel-control.js`: Script JavaScript que maneja la interactividad y la comunicación con el backend para el panel de control.
*   `frontend/modulos.js`: Contiene la función `checkLogin` que verifica la validez del token JWT con el backend y limpia `localStorage` si el token es inválido. Esta función ahora es exportada y no se ejecuta automáticamente al cargar el módulo.
*   `frontend/index.html`: La página principal ahora importa `checkLogin` de `modulos.js`. En los eventos `DOMContentLoaded` y `pageshow`, `index.html` primero `await`s la ejecución de `checkLogin` para asegurar que el estado de la sesión sea consistente, y luego llama a `updateAuthHeader` para actualizar la interfaz de usuario (mostrar el perfil del usuario o los enlaces de login/registro) basándose en el estado actual de `localStorage`.
*   `frontend/styles.css`: Contiene las reglas de estilo para la aplicación. Se ha modificado la regla para `#user-section` de `display: none;` a `display: flex;` para asegurar que el `div` del perfil sea visible cuando se inyecta dinámicamente en el DOM.

## 1. Página de Login (`frontend/login.html` y `frontend/login.js`)

### 1.1. Estructura HTML (`login.html`)

*   Define un formulario HTML (`<form id="loginForm" action="/api/auth/login" method="POST">`) con campos para `username` (o email) y `password`.
*   Incluye elementos `div` con `id="errorMessage"` y `id="successMessage"` para mostrar mensajes dinámicamente al usuario.
*   El atributo `action` del formulario apunta a la ruta `/api/auth/login` del backend, indicando que los datos se enviarán a esta API mediante una solicitud `POST`.
*   Contiene un enlace a `register.html` para usuarios que no tienen cuenta.
*   Carga el script `login.js` de forma diferida (`defer`).

### 1.2. Lógica JavaScript (`login.js`)

*   **Manejo de Mensajes desde URL**: Al cargar la página (`DOMContentLoaded`), el script lee los parámetros `error` y `success` de la URL (`window.location.search`). Esto permite que el backend redirija al frontend con mensajes de estado después de un intento de login o registro.
*   **Funciones `displayMessage` y `clearMessages`**: Controlan la visibilidad, el contenido y el estilo de los elementos `errorMessage` y `successMessage`.
*   **Redirección por Rol**: Después de un login o registro exitoso, el script guarda el token JWT y el rol del usuario en `localStorage`. Redirige a `/panel-control.html` si el rol es `admin` o `superadmin`, y a `/index.html` en caso contrario.

## 2. Página de Registro (`frontend/register.html`)

*   Similar al login, pero para crear nuevos usuarios. La lógica de redirección también considera los roles `admin` y `superadmin`.

## 3. Panel de Control Administrativo (`frontend/panel-control.html` y `frontend/panel-control.js`)

Este es el corazón de la interfaz de administración.

### 3.1. Estructura HTML (`panel-control.html`)

*   **Barra Lateral (`.sidebar`)**: Contiene enlaces de navegación a las diferentes secciones. Se ha añadido un enlace a la sección de "Gestionar Usuarios" (`#users`) que está oculto por defecto.
*   **Sección de Gestión de Usuarios**: Se ha añadido una nueva sección (`<div id="users">`) que contiene una tabla (`#users-table`) para listar los usuarios del sistema.
*   **Estadísticas Dinámicas**: Los elementos `<span>` dentro de las tarjetas de estadísticas en la sección de Dashboard (`id="totalVehicles"`, `id="newVehicles"`, `id="usedVehicles"`, `id="scheduledServices"`, `id="completedServices"`, `id="pendingServices"`, `id="monthlyIncome"`, `id="totalFinanceRequests"`, `id="approvedFinances"`) ahora tienen IDs para permitir la actualización dinámica de sus valores.

### 3.2. Lógica JavaScript (`panel-control.js`)

*   **Visibilidad por Rol**: Al inicializar, el script comprueba el rol del usuario guardado en `localStorage`. Si el rol es `superadmin`, muestra el enlace de navegación a "Gestionar Usuarios".
*   **`fetchVehicles()`**: Implementada para obtener y mostrar dinámicamente la lista de vehículos en la tabla `#vehicles-table`. Incluye el encabezado `Authorization` para peticiones autenticadas.
*   **`fetchServices()`**: Implementada para obtener y mostrar dinámicamente la lista de solicitudes de servicio en la tabla `#services-table`. Incluye el encabezado `Authorization` para peticiones autenticadas.
*   **`fetchFinances()`**: Implementada para obtener y mostrar dinámicamente la lista de solicitudes de financiación en la tabla `#finances-table`. Incluye el encabezado `Authorization` para peticiones autenticadas.
*   **`fetchUsers()`**: Nueva función que se llama al acceder a la sección `#users`. Realiza una petición `GET` a `/api/users` (ruta protegida) para obtener la lista de todos los usuarios.
*   **`fetchDashboardCounts()`**: Nueva función que obtiene el número total de vehículos, servicios y solicitudes de financiación del backend y actualiza los elementos correspondientes en el Dashboard. **Se ha mejorado para calcular y mostrar también el número de vehículos 'Nuevos' y 'Usados' basándose en la propiedad `condition` de los vehículos obtenidos del backend, y para actualizar dinámicamente las estadísticas de servicios (programados, completados, pendientes) y finanzas (ingresos mensuales, solicitudes totales, aprobadas) basándose en los datos obtenidos de sus respectivas APIs.**
*   **Renderizado de Tablas**: Las funciones `fetchVehicles`, `fetchServices`, `fetchFinances` y `fetchUsers` pueblan dinámicamente sus respectivas tablas con los datos obtenidos del backend.
*   **Actualización de Roles**: Se ha añadido un `eventListener` a la tabla de usuarios. Al hacer clic en "Guardar", se envía una petición `PUT` a `/api/users/:id/role` con el nuevo rol seleccionado, actualizando al usuario en la base de datos. Se muestra una notificación de éxito o error.
*   **Manejo de Acciones (Ver/Editar/Eliminar)**: La función `handleActionButtonClick` maneja las operaciones de ver, editar y **eliminar** elementos (vehículos, servicios, finanzas). Ahora incluye el encabezado `Authorization` en todas las peticiones `fetch` para asegurar que las operaciones estén correctamente autenticadas.
*   **Navegación**: La función `showSection` ha sido actualizada para manejar la nueva sección `users` y llamar a `fetchUsers` cuando corresponda. También se ha modificado para llamar a `fetchDashboardCounts()` cuando se muestra la sección `dashboard`.
*   **Inicialización**: La función `initialize()` ahora llama a `fetchDashboardCounts()` al cargar la página para asegurar que las estadísticas se muestren desde el principio.

## 4. Página de Perfil (`frontend/profile.html` y `frontend/profile.js`)

Esta página permite a un usuario logueado ver su propia información de perfil.

### 4.1. Estructura HTML (`profile.html`)

*   Contiene una cabecera (`<header>`) consistente con el resto del sitio para mantener la navegación y la identidad visual.
*   La sección principal (`<main>`) muestra una "tarjeta de perfil" (`.profile-card`) donde se visualizarán los datos.
*   Dentro de la tarjeta, hay placeholders (`<span>`) con IDs como `profile-username`, `profile-email`, y `profile-role` que se rellenan dinámicamente.
*   Incluye un contenedor (`#admin-link-container`) con un enlace al Panel de Control, que está oculto por defecto (`style="display: none;"`).

### 4.2. Lógica JavaScript (`profile.js`)

*   **Verificación de Token**: Al cargar la página, el script primero comprueba si existe un `jwtToken` en `localStorage`. Si no existe, redirige inmediatamente al usuario a `login.html`.
*   **Petición de Datos**: Si el token existe, realiza una petición `fetch` a la ruta protegida `/api/profile` del backend, incluyendo el token en la cabecera `Authorization`.
*   **Renderizado de Datos**: Si la petición es exitosa, el script parsea la respuesta JSON y utiliza los datos (`username`, `email`, `role`) para rellenar los placeholders correspondientes en el HTML.
*   **Lógica de Administrador**: Después de rellenar los datos, el script comprueba si `user.role === 'admin'` o `user.role === 'superadmin'`. Si es verdadero, cambia el estilo del contenedor `#admin-link-container` a `display: 'block'`, haciendo visible el enlace al panel de control.
*   **Manejo de Errores y Logout**: El script maneja posibles errores (ej. token expirado) limpiando `localStorage` y redirigiendo al login. También añade la funcionalidad al botón de "Logout" para cerrar la sesión.

---

# Lógica del Frontend: Páginas Estáticas/de Visualización

Este documento describe la lógica y el propósito de las páginas HTML del frontend que principalmente muestran contenido estático o sirven como contenedores para información, sin una interactividad compleja del lado del cliente.

## Páginas Específicas

### `vehicles.html` (Página de Vehículos)

*   **Propósito**: Mostrar un catálogo dinámico y filtrable de todos los vehículos disponibles.
*   **Contenido**: Presenta un título y una sección de filtros (`<div class="filters">`) con menús desplegables para marca, modelo, rango de precios, condición y año. Cada `<select>` tiene un atributo `name` que corresponde a la clave de filtrado en el backend. Contiene un `div` con `id="vehicle-list"` para las tarjetas de vehículos.
*   **Lógica (Cliente)**: La página está vinculada al script `frontend/vehicles.js`.
    *   **`vehicles.js`**:
        1.  **Carga Inicial**: Al cargar la página, realiza una petición `fetch` inicial a `/api/vehicles` para mostrar todos los vehículos.
        2.  **Escucha de Eventos**: Añade un `eventListener` al contenedor de los filtros (`.filters`) que se activa con cualquier cambio en los menús desplegables.
        3.  **Aplicación de Filtros**: Cuando un filtro cambia, la función `applyFilters` se ejecuta. Esta lee los valores actuales de todos los menús `<select>`, construye una cadena de consulta (query string) como `brand=Ford&year=2023`, y vuelve a llamar a la función `fetchAndDisplayVehicles` con esta cadena.
        4.  **Renderizado Dinámico**: La función `fetchAndDisplayVehicles` es ahora capaz de enviar la cadena de consulta a la API. El backend procesa estos filtros y devuelve una lista de vehículos que coinciden con los criterios, que luego se renderiza en la página.
*   **Estado Actual**: La visualización y el filtrado de vehículos son completamente funcionales.

## 1. Página de Login (`frontend/login.html` y `frontend/login.js`)

### 1.1. Estructura HTML (`login.html`)

*   Define un formulario HTML (`<form id="loginForm" action="/api/auth/login" method="POST">`) con campos para `username` (o email) y `password`.
*   Incluye elementos `div` con `id="errorMessage"` y `id="successMessage"` para mostrar mensajes dinámicamente al usuario.
*   El atributo `action` del formulario apunta a la ruta `/api/auth/login` del backend, indicando que los datos se enviarán a esta API mediante una solicitud `POST`.
*   Contiene un enlace a `register.html` para usuarios que no tienen cuenta.
*   Carga el script `login.js` de forma diferida (`defer`).

### 1.2. Lógica JavaScript (`login.js`)

*   **Manejo de Mensajes desde URL**: Al cargar la página (`DOMContentLoaded`), el script lee los parámetros `error` y `success` de la URL (`window.location.search`). Esto permite que el backend redirija al frontend con mensajes de estado después de un intento de login o registro.
*   **Funciones `displayMessage` y `clearMessages`**: Controlan la visibilidad, el contenido y el estilo de los elementos `errorMessage` y `successMessage`.
*   **Redirección por Rol**: Después de un login o registro exitoso, el script guarda el token JWT y el rol del usuario en `localStorage`. Redirige a `/panel-control.html` si el rol es `admin` o `superadmin`, y a `/index.html` en caso contrario.

## 2. Página de Registro (`frontend/register.html`)

*   Similar al login, pero para crear nuevos usuarios. La lógica de redirección también considera los roles `admin` y `superadmin`.

## 3. Panel de Control Administrativo (`frontend/panel-control.html` y `frontend/panel-control.js`)

Este es el corazón de la interfaz de administración.

### 3.1. Estructura HTML (`panel-control.html`)

*   **Barra Lateral (`.sidebar`)**: Contiene enlaces de navegación a las diferentes secciones. Se ha añadido un enlace a la sección de "Gestionar Usuarios" (`#users`) que está oculto por defecto.
*   **Sección de Gestión de Usuarios**: Se ha añadido una nueva sección (`<div id="users">`) que contiene una tabla (`#users-table`) para listar los usuarios del sistema.
*   **Estadísticas Dinámicas**: Los elementos `<span>` dentro de las tarjetas de estadísticas en la sección de Dashboard (`id="totalVehicles"`, `id="newVehicles"`, `id="usedVehicles"`, `id="scheduledServices"`, `id="completedServices"`, `id="pendingServices"`, `id="monthlyIncome"`, `id="totalFinanceRequests"`, `id="approvedFinances"`) ahora tienen IDs para permitir la actualización dinámica de sus valores.

### 3.2. Lógica JavaScript (`panel-control.js`)

*   **Visibilidad por Rol**: Al inicializar, el script comprueba el rol del usuario guardado en `localStorage`. Si el rol es `superadmin`, muestra el enlace de navegación a "Gestionar Usuarios".
*   **`fetchVehicles()`**: Implementada para obtener y mostrar dinámicamente la lista de vehículos en la tabla `#vehicles-table`. Incluye el encabezado `Authorization` para peticiones autenticadas.
*   **`fetchServices()`**: Implementada para obtener y mostrar dinámicamente la lista de solicitudes de servicio en la tabla `#services-table`. Incluye el encabezado `Authorization` para peticiones autenticadas.
*   **`fetchFinances()`**: Implementada para obtener y mostrar dinámicamente la lista de solicitudes de financiación en la tabla `#finances-table`. Incluye el encabezado `Authorization` para peticiones autenticadas.
*   **`fetchUsers()`**: Nueva función que se llama al acceder a la sección `#users`. Realiza una petición `GET` a `/api/users` (ruta protegida) para obtener la lista de todos los usuarios.
*   **`fetchDashboardCounts()`**: Nueva función que obtiene el número total de vehículos, servicios y solicitudes de financiación del backend y actualiza los elementos correspondientes en el Dashboard. **Se ha mejorado para calcular y mostrar también el número de vehículos 'Nuevos' y 'Usados' basándose en la propiedad `condition` de los vehículos obtenidos del backend.**
*   **Renderizado de Tablas**: Las funciones `fetchVehicles`, `fetchServices`, `fetchFinances` y `fetchUsers` pueblan dinámicamente sus respectivas tablas con los datos obtenidos del backend.
*   **Actualización de Roles**: Se ha añadido un `eventListener` a la tabla de usuarios. Al hacer clic en "Guardar", se envía una petición `PUT` a `/api/users/:id/role` con el nuevo rol seleccionado, actualizando al usuario en la base de datos. Se muestra una notificación de éxito o error.
*   **Manejo de Acciones (Ver/Editar/Eliminar)**: La función `handleActionButtonClick` maneja las operaciones de ver, editar y **eliminar** elementos (vehículos, servicios, finanzas). Ahora incluye el encabezado `Authorization` en todas las peticiones `fetch` para asegurar que las operaciones estén correctamente autenticadas.
*   **Navegación**: La función `showSection` ha sido actualizada para manejar la nueva sección `users` y llamar a `fetchUsers` cuando corresponda. También se ha modificado para llamar a `fetchDashboardCounts()` cuando se muestra la sección `dashboard`.
*   **Inicialización**: La función `initialize()` ahora llama a `fetchDashboardCounts()` al cargar la página para asegurar que las estadísticas se muestren desde el principio.

## 4. Página de Perfil (`frontend/profile.html` y `frontend/profile.js`)

Esta página permite a un usuario logueado ver su propia información de perfil.

### 4.1. Estructura HTML (`profile.html`)

*   Contiene una cabecera (`<header>`) consistente con el resto del sitio para mantener la navegación y la identidad visual.
*   La sección principal (`<main>`) muestra una "tarjeta de perfil" (`.profile-card`) donde se visualizarán los datos.
*   Dentro de la tarjeta, hay placeholders (`<span>`) con IDs como `profile-username`, `profile-email`, y `profile-role` que se rellenan dinámicamente.
*   Incluye un contenedor (`#admin-link-container`) con un enlace al Panel de Control, que está oculto por defecto (`style="display: none;"`).

### 4.2. Lógica JavaScript (`profile.js`)

*   **Verificación de Token**: Al cargar la página, el script primero comprueba si existe un `jwtToken` en `localStorage`. Si no existe, redirige inmediatamente al usuario a `login.html`.
*   **Petición de Datos**: Si el token existe, realiza una petición `fetch` a la ruta protegida `/api/profile` del backend, incluyendo el token en la cabecera `Authorization`.
*   **Renderizado de Datos**: Si la petición es exitosa, el script parsea la respuesta JSON y utiliza los datos (`username`, `email`, `role`) para rellenar los placeholders correspondientes en el HTML.
*   **Lógica de Administrador**: Después de rellenar los datos, el script comprueba si `user.role === 'admin'` o `user.role === 'superadmin'`. Si es verdadero, cambia el estilo del contenedor `#admin-link-container` a `display: 'block'`, haciendo visible el enlace al panel de control.
*   **Manejo de Errores y Logout**: El script maneja posibles errores (ej. token expirado) limpiando `localStorage` y redirigiendo al login. También añade la funcionalidad al botón de "Logout" para cerrar la sesión.

---

# Lógica del Frontend: Páginas Estáticas/de Visualización

Este documento describe la lógica y el propósito de las páginas HTML del frontend que principalmente muestran contenido estático o sirven como contenedores para información, sin una interactividad compleja del lado del cliente.

## Páginas Específicas

### `vehicles.html` (Página de Vehículos)

*   **Propósito**: Mostrar un catálogo dinámico y filtrable de todos los vehículos disponibles.
*   **Contenido**: Presenta un título y una sección de filtros (`<div class="filters">`) con menús desplegables para marca, modelo, rango de precios, condición y año. Cada `<select>` tiene un atributo `name` que corresponde a la clave de filtrado en el backend. Contiene un `div` con `id="vehicle-list"` para las tarjetas de vehículos.
*   **Lógica (Cliente)**: La página está vinculada al script `frontend/vehicles.js`.
    *   **`vehicles.js`**:
        1.  **Carga Inicial**: Al cargar la página, realiza una petición `fetch` inicial a `/api/vehicles` para mostrar todos los vehículos.
        2.  **Escucha de Eventos**: Añade un `eventListener` al contenedor de los filtros (`.filters`) que se activa con cualquier cambio en los menús desplegables.
        3.  **Aplicación de Filtros**: Cuando un filtro cambia, la función `applyFilters` se ejecuta. Esta lee los valores actuales de todos los menús `<select>`, construye una cadena de consulta (query string) como `brand=Ford&year=2023`, y vuelve a llamar a la función `fetchAndDisplayVehicles` con esta cadena.
        4.  **Renderizado Dinámico**: La función `fetchAndDisplayVehicles` es ahora capaz de enviar la cadena de consulta a la API. El backend procesa estos filtros y devuelve una lista de vehículos que coinciden con los criterios, que luego se renderiza en la página.
*   **Estado Actual**: La visualización y el filtrado de vehículos son completamente funcionales.