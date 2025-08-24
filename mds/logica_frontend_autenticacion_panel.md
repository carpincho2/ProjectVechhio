# Lógica del Frontend: Autenticación y Panel de Control

Este documento detalla la lógica implementada en el frontend para el proceso de autenticación (login y registro) y la interacción con el panel de control administrativo.

## Componentes Clave Involucrados

Los principales archivos que orquestan este flujo son:

*   `frontend/login.html`: Página HTML para el inicio de sesión.
*   `frontend/register.html`: Página HTML para el registro de nuevos usuarios.
*   `frontend/login.js`: Script JavaScript que maneja la lógica del lado del cliente para el login y la visualización de mensajes.
*   `frontend/panel-control.html`: Página HTML del panel de control administrativo.
*   `frontend/panel-control.js`: Script JavaScript que maneja la interactividad y la comunicación con el backend para el panel de control.

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
*   **Validación Básica del Formulario**: Se añade un `eventListener` al evento `submit` del `loginForm`.
    *   Antes de enviar, se limpian los mensajes anteriores.
    *   Verifica que los campos `username` y `password` no estén vacíos. Si lo están, previene el envío del formulario (`e.preventDefault()`) y muestra un mensaje de error al usuario.
*   **Envío del Formulario**: Si la validación del lado del cliente pasa, el formulario se envía a `/api/auth/login` y el backend maneja la autenticación y la redirección.

## 2. Página de Registro (`frontend/register.html`)

### 2.1. Estructura HTML (`register.html`)

*   Define un formulario HTML (`<form action="/api/auth/register" method="POST">`) con campos para `username`, `email`, `password` y `confirm` (confirmación de contraseña).
*   El atributo `action` del formulario apunta a la ruta `/api/auth/register` del backend, indicando que los datos se enviarán a esta API mediante una solicitud `POST`.
*   **Nota Importante**: A diferencia de `login.html`, este archivo *no* incluye un script JavaScript dedicado (`<script src="login.js"></script>`). Esto implica que el envío del formulario de registro es una **sumisión directa de HTML**, y cualquier mensaje de error o éxito después del registro es manejado por la redirección del backend (probablemente a `login.html` con parámetros de URL, o directamente a la página principal si el registro es exitoso).

## 3. Panel de Control Administrativo (`frontend/panel-control.html` y `frontend/panel-control.js`)

Este es el corazón de la interfaz de administración, donde los usuarios (presumiblemente administradores) pueden gestionar vehículos, servicios y finanzas.

### 3.1. Estructura HTML (`panel-control.html`)

*   **Barra Lateral (`.sidebar`)**: Contiene enlaces de navegación (`.nav-link`) para las diferentes secciones del panel (Dashboard, Gestión de Vehículos, Gestión de Servicios, Gestión de Finanzas, Mi Perfil).
*   **Contenido Principal (`.main-content`)**: Contiene múltiples secciones (`.section`) con IDs únicos (ej., `id="dashboard"`, `id="vehicles"`, etc.). Solo una de estas secciones es visible a la vez (la que tiene la clase `active`).
*   **Sección de Vehículos**: Incluye un formulario (`id="add-vehicle-form"`) para añadir nuevos vehículos (con campos para marca, modelo, año, precio, condición, kilometraje, imagen y descripción) y una tabla (`id="vehicles-table"`) para listar los vehículos existentes.
*   **Sección de Servicios**: Incluye un formulario (`id="add-service-form"`) para añadir nuevos servicios y una tabla (`id="services-table"`) para listar los servicios.
*   **Sección de Finanzas**: Incluye una tabla (`id="finances-table"`) para listar las solicitudes de financiación.
*   **Notificaciones**: Un `div` (`id="notification"`) para mostrar mensajes de éxito o error al usuario.
*   **Cierre de Sesión**: Un enlace (`/logout`) para cerrar la sesión del usuario.
*   Carga el script `panel-control.js` al final del `<body>`.

### 3.2. Lógica JavaScript (`panel-control.js`)

Este script es el motor interactivo del panel de control.

*   **Inicialización (`DOMContentLoaded`)**: Se ejecuta cuando el DOM está completamente cargado, obteniendo referencias a todos los elementos HTML necesarios.
*   **`showNotification(message, isSuccess)`**: Función utilitaria para mostrar mensajes temporales de éxito o error en la interfaz de usuario.
*   **`showSection(sectionId)`**: Controla la visibilidad de las secciones del panel.
    *   Oculta todas las secciones y luego muestra la sección correspondiente al `sectionId` proporcionado.
    *   Actualiza la clase `active` en los enlaces de navegación para reflejar la sección actual.
    *   Actualiza el hash de la URL (`window.history.replaceState`) para permitir la navegación directa a secciones específicas.
    *   **Carga de Datos Dinámica**: Cuando se cambia a una sección (vehículos, servicios, finanzas, perfil), llama a la función `fetch` correspondiente (`fetchVehicles()`, `fetchServices()`, etc.) para cargar los datos más recientes desde el backend.
*   **Funciones `fetchVehicles()`, `fetchServices()`, `fetchFinances()`, `fetchProfile()`**:
    *   Realizan solicitudes `GET` asíncronas a las APIs del backend (ej., `/api/vehicles`, `/api/services`, `/api/finances`, `/api/profile`).
    *   Procesan la respuesta JSON y actualizan dinámicamente el contenido de las tablas (`vehicles-table`, `services-table`, `finances-table`) o la sección de perfil.
    *   Manejan errores de red o de la API mostrando notificaciones.
*   **Manejo de Formularios de Añadir (Vehículos y Servicios)**:
    *   Los formularios (`add-vehicle-form`, `add-service-form`) tienen `eventListeners` para el evento `submit`.
    *   Previenen el envío por defecto del formulario.
    *   Crean un objeto `FormData` para enviar los datos del formulario, incluyendo archivos (para vehículos).
    *   Realizan solicitudes `POST` asíncronas a las APIs correspondientes (`/api/vehicles`, `/api/services`).
    *   En caso de éxito, muestran una notificación, resetean el formulario y recargan la lista de elementos.
    *   Manejan errores mostrando notificaciones.
*   **Botones de Acción en Tablas (Ver, Editar, Eliminar)**:
    *   La función `attachActionButtonListeners()` adjunta `eventListeners` a los botones de acción (`.btn-view`, `.btn-edit`, `.btn-delete`) en las tablas.
    *   **`handleActionButtonClick(e)`**: Es la función principal que maneja los clics en estos botones.
        *   Identifica la acción (`view`, `edit`, `delete`) y el `id` del elemento.
        *   Maneja la eliminación de vehículos, servicios y finanzas.
        *   Maneja la edición de vehículos, servicios y finanzas.
        *   Maneja la visualización de detalles de vehículos, servicios y finanzas.
*   **Manejo de Cierre de Sesión**: Los enlaces de cierre de sesión (`a[href="/logout"]`) tienen un `eventListener` que muestra una notificación de sesión cerrada y redirige al usuario a `index.html` después de un breve retraso.
*   **Carga Inicial de la Página**: Al cargar la página, el script verifica si hay un hash en la URL (`window.location.hash`). Si lo hay, muestra la sección correspondiente. De lo contrario, muestra la sección `dashboard` por defecto. También realiza una carga inicial de vehículos (`fetchVehicles()`).

En resumen, `panel-control.js` es el cerebro del panel administrativo, gestionando la navegación, la carga y manipulación de datos en tiempo real, y la interacción con el usuario a través de formularios y botones de acción.