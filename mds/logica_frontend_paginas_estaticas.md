
# Lógica del Frontend: Páginas Estáticas/de Visualización

Este documento describe la lógica y el propósito de las páginas HTML del frontend que principalmente muestran contenido estático o sirven como contenedores para información, sin una interactividad compleja del lado del cliente.

## Estructura General y Elementos Comunes

La mayoría de estas páginas comparten una estructura similar:

*   **Encabezado (`<header>`)**: Contiene el logo de la concesionaria y enlaces de navegación a otras secciones de la aplicación (`vehicles.html`, `certified.html`, `finance.html`, `service.html`, `aboutUs.html`). También incluyen enlaces estáticos de "Login" y "Register".
*   **Estilos CSS**: Utilizan `styles.css` para estilos generales y un archivo CSS específico para la página (ej., `vechicles.css`, `finance.css`, `aboutUs.css`, `certified.css`) para estilos particulares de esa sección.
*   **Favicon**: Un icono de acceso directo para el navegador.

## Páginas Específicas

### 1. `index.html` (Página Principal)

*   **Propósito**: Es la página de aterrizaje de la aplicación. Presenta una visión general de la concesionaria, vehículos destacados y opciones de contacto.
*   **Contenido**: Incluye un banner principal, una sección de ubicaciones, una sección de vehículos destacados (con contenido estático de ejemplo), y un formulario de contacto básico.
*   **Elementos Dinámicos**: Contiene una sección de autenticación de usuario en el encabezado (`login-section` y `user-section`) que es gestionada dinámicamente por `modulos.js` para mostrar enlaces de login/registro o información del usuario logueado.
*   **Formulario de Contacto**: El formulario de contacto es puramente HTML y su atributo `action="#"` indica que no se envía a un endpoint de backend directamente sin JavaScript adicional.

### 2. `vehicles.html` (Página de Vehículos)

*   **Propósito**: Diseñada para mostrar una lista de vehículos y permitir opciones de filtrado.
*   **Contenido**: Presenta un título "Vehicles" y una sección de filtros con selectores para "Make", "Model", "Price Range", "Fuel Type" y "Year".
*   **Lógica (Cliente)**: Los selectores de filtro son elementos HTML estáticos. No hay un script JavaScript vinculado a esta página que maneje la lógica de filtrado o la carga dinámica de vehículos. Esto sugiere que la lista de vehículos y la funcionalidad de filtrado son actualmente estáticas o están pendientes de implementación del lado del cliente.

### 3. `finance.html` (Página de Financiación)

*   **Propósito**: Presentar las opciones de financiación que ofrece la concesionaria y un simulador de préstamos.
*   **Contenido**: Incluye descripciones de créditos flexibles, ventajas exclusivas y un formulario de "Simulador" con campos para el monto a financiar y el número de cuotas.
*   **Lógica (Cliente)**: El formulario del simulador es puramente HTML. No hay un script JavaScript vinculado a esta página que implemente la lógica de cálculo del simulador. Por lo tanto, el botón "Calcular" y la visualización del resultado son actualmente no funcionales desde la perspectiva del cliente.

### 4. `service.html` (Página de Servicios)

*   **Propósito**: Informar sobre los servicios técnicos ofrecidos y permitir a los usuarios solicitar un turno.
*   **Contenido**: Describe diferentes tipos de servicios (mantenimiento, revisión, frenos) y un formulario para "Solicitá tu turno" con campos para datos personales y del vehículo.
*   **Lógica (Cliente)**: El formulario de solicitud de turno es puramente HTML. No hay un script JavaScript vinculado a esta página que maneje el envío del formulario o la interacción con el backend para la solicitud de turnos. Es una representación estática de un formulario.

### 5. `profile.html` (Página de Perfil)

*   **Propósito**: Destinada a mostrar la información del perfil del usuario.
*   **Estado Actual**: El archivo `profile.html` está **vacío**. Sin embargo, `panel-control.js` (analizado previamente) contiene una función `fetchProfile()` que intenta cargar dinámicamente los datos del perfil desde el backend (`/api/profile`) y mostrarlos en la sección de perfil. Esto sugiere que `profile.html` está diseñado para ser un contenedor para contenido cargado por JavaScript, o que la implementación está incompleta.

### 6. `aboutUs.html` (Página "Sobre Nosotros")

*   **Propósito**: Proporcionar información sobre la concesionaria, su misión, visión y valores.
*   **Contenido**: Texto descriptivo y una imagen.
*   **Lógica (Cliente)**: Es una página de contenido puramente estático, sin interactividad del lado del cliente.

### 7. `certified.html` (Página de Vehículos Certificados)

*   **Propósito**: Informar sobre el programa de vehículos certificados de la concesionaria.
*   **Contenido**: Un banner, texto explicativo y un enlace a la página de vehículos.
*   **Lógica (Cliente)**: Es una página de contenido puramente estático, sin interactividad del lado del cliente.

## Archivos CSS

Cada página HTML utiliza `styles.css` para estilos globales y un archivo CSS específico (ej., `vechicles.css`, `finance.css`, `aboutUs.css`, `certified.css`) para aplicar estilos y diseño particulares a los elementos de esa página. Estos archivos definen la apariencia visual de la interfaz de usuario.