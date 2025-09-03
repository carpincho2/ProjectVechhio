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
*   `frontend/authLogic.js`: Nuevo módulo JavaScript que encapsula la lógica de `updateAuthHeader` y la inicialización del estado de autenticación (`handleAuthInitialization`), importando `checkLogin` de `modulos.js`.
*   `frontend/index.html`: La página principal ahora carga `frontend/index.js` al final del `<body>`. Este script se encarga de inicializar la lógica de autenticación llamando a `handleAuthInitialization()` (definida en `authLogic.js`) en los eventos `DOMContentLoaded` y `pageshow` para asegurar que el estado de la sesión sea consistente y la interfaz de usuario se actualice (mostrar el perfil del usuario o los enlaces de login/registro) basándose en el estado actual de `localStorage`.
    *   **Nota:** La mayoría de las páginas HTML del frontend (`aboutUs.html`, `admin-finances.html`, `admin-services.html`, `admin-vehicles.html`, `certified.html`, `finance.html`, `panel-control.html`, `profile.html`, `service.html`, `vehicles.html`) ahora incluyen `frontend/main.js` y utilizan el `auth-container` dinámico en su cabecera para gestionar el estado de autenticación de la barra de navegación.
*   `frontend/index.js`: Contiene los event listeners `DOMContentLoaded` y `pageshow` que llaman a `handleAuthInitialization()` para inicializar el estado de autenticación de la interfaz de usuario.
*   `frontend/main.js`: Módulo JavaScript genérico que importa `handleAuthInitialization` de `authLogic.js` y lo llama en los eventos `DOMContentLoaded` y `pageshow`. Este script se utiliza en varias páginas HTML para inicializar la barra de navegación con el estado de autenticación.



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


---

# Variables CSS Globales

Para mantener la consistencia y facilitar el mantenimiento del estilo en el frontend, se ha implementado un sistema de variables CSS globales. Estas variables se definen en `:root` dentro de `frontend/styles.css` y se utilizan en todo el proyecto para gestionar colores y otros valores de estilo.

## Convención de Nombres y Uso

Las variables se agrupan por su propósito y siguen una convención de nombres clara:

*   **Colores Principales (`--btn-primary-bg`, `--btn-primary-hover-bg`, `--btn-secondary-bg`, `--btn-accent-bg`)**:
    *   `--btn-primary-bg`: Color de fondo para botones principales y enlaces destacados.
    *   `--btn-primary-hover-bg`: Color de fondo para el estado `hover` de los botones principales.
    *   `--btn-secondary-bg`: Color de fondo para botones secundarios (ej. confirmación, éxito).
    *   `--btn-accent-bg`: Color de fondo para botones o acentos especiales (ej. llamadas a la acción).

*   **Fondos (`--bg-main`, `--bg-header`, `--bg-card`)**:
    *   `--bg-main`: Color de fondo global de la aplicación.
    *   `--bg-header`: Color de fondo para el encabezado y la barra de navegación.
    *   `--bg-card`: Color de fondo para tarjetas, paneles y secciones.

*   **Texto (`--text-primary`, `--text-secondary`, `--text-on-light`)**:
    *   `--text-primary`: Color principal para el texto.
    *   `--text-secondary`: Color secundario para el texto (ej. texto de apoyo, descripciones).
    *   `--text-on-light`: Color de texto que se utiliza sobre fondos claros para asegurar la legibilidad.

*   **Estados (`--alert-error`, `--alert-success`, `--alert-warning`)**:
    *   `--alert-error`: Color para mensajes de error.
    *   `--alert-success`: Color para mensajes de éxito.
    *   `--alert-warning`: Color para mensajes de advertencia.

*   **Extras (`--border-default`, `--shadow-default`)**:
    *   `--border-default`: Color para bordes sutiles.
    *   `--shadow-default`: Color para sombras predeterminadas.

Esta estructura facilita la modificación de la paleta de colores y el mantenimiento general del estilo de la aplicación.
