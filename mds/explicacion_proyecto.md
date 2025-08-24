# Explicación de la Estructura del Proyecto "Concesionaria"

Este documento detalla la organización y el propósito de los directorios y archivos clave dentro del proyecto "Concesionaria".

## Estructura General del Proyecto

El proyecto está dividido en componentes principales que reflejan una arquitectura típica de aplicación web, con un backend, un frontend y módulos adicionales para herramientas y scripts.

```
G:\2025\concesionaria\
├───.gitignore
├───package-lock.json
├───plan_proyecto_concesionaria.md
├───.git\...
├───backend\
├───database\
├───frontend\
├───mcp-server\
├───mds\
└───scripsts\
```

## Componentes Principales

### 1. `backend/`

Este directorio contiene la lógica del servidor (API REST) para la aplicación. Está construido con Node.js y Express.js, gestionando la autenticación, vehículos, finanzas y servicios.

**Archivos y Subdirectorios Clave:**

*   **`package.json` / `package-lock.json`**: Definen las dependencias del proyecto backend y sus versiones exactas.
*   **`server.js`**: El punto de entrada principal de la aplicación backend, donde se configura el servidor Express y se inician las rutas.
*   **`config/database.js`**: Contiene la configuración para la conexión a la base de datos.
*   **`controllers/`**: Aloja los controladores que manejan la lógica de negocio para las diferentes rutas (autenticación, finanzas, servicios, vehículos).
    *   `authcontrol.js`
    *   `financecontrol.js`
    *   `servicecontrol.js`
    *   `vehiclescontrol.js`
*   **`middlewares/authmiddleware.js`**: Contiene middleware para la autenticación y autorización de usuarios, protegiendo rutas específicas.
*   **`models/`**: Define los esquemas y modelos de datos para la base de datos (probablemente usando Mongoose si es MongoDB, o un ORM similar para SQL).
    *   `finance.js`
    *   `index.js`
    *   `services.js`
    *   `user.js`
    *   `vehiculos.js`
*   **`routes/`**: Define las rutas de la API y las asocia con los controladores correspondientes.
    *   `auth.js`
    *   `finances.js`
    *   `profile.js`
    *   `service.js`
    *   `vehicles.js`
*   **`scripts/createAdmin.js`**: Un script utilitario para crear un usuario administrador inicial.
*   **`uploads/`**: Probablemente para almacenar archivos subidos por los usuarios, como imágenes de vehículos.
*   **`node_modules/`**: Contiene todas las dependencias de Node.js instaladas para el backend.

### 2. `frontend/`

Este directorio contiene la interfaz de usuario (UI) de la aplicación, accesible a través del navegador web. Parece ser una aplicación web tradicional basada en HTML, CSS y JavaScript.

**Archivos y Subdirectorios Clave:**

*   **`index.html`**: La página principal de la aplicación.
*   **`login.html` / `register.html`**: Páginas para el inicio de sesión y registro de usuarios.
*   **`panel-control.html`**: Probablemente el dashboard o panel de administración/usuario.
*   **`vehicles.html` / `finance.html` / `service.html` / `profile.html` / `aboutUs.html` / `certified.html`**: Páginas específicas para diferentes secciones de la aplicación.
*   **`.css` files (e.g., `styles.css`, `loginregisterstyle.css`, `panel-control.css`)**: Archivos de estilos para dar formato a la interfaz de usuario.
*   **`.js` files (e.g., `login.js`, `modulos.js`, `panel-control.js`)**: Archivos JavaScript que manejan la interactividad del lado del cliente.
*   **`logos/`**: Contiene imágenes y logos utilizados en el frontend.
    *   `favicon_io/`: Iconos de la web para diferentes dispositivos.
*   **`node_modules/`**: Dependencias de JavaScript instaladas para el frontend (si usa alguna herramienta de construcción o librerías a través de npm/yarn).

### 3. `mcp-server/`

Este directorio parece contener un proyecto separado, posiblemente relacionado con "MCP" (Multi-Cloud Platform o similar), que podría ser una herramienta de desarrollo, un servidor de pruebas, o un componente de infraestructura. La presencia de archivos como `jest.config.cjs`, `tsconfig.json`, `Dockerfile`, y un directorio `docs` sugiere que es un proyecto de software con su propia configuración, pruebas y documentación.

**Archivos y Subdirectorios Clave:**

*   **`package.json` / `package-lock.json`**: Dependencias y scripts de este módulo.
*   **`jest.config.cjs` / `tsconfig.json`**: Archivos de configuración para pruebas (Jest) y TypeScript.
*   **`Dockerfile`**: Para la contenerización de esta parte de la aplicación.
*   **`docs/`**: Contiene la documentación del `mcp-server`, posiblemente generada con Docusaurus.
*   **`src/`**: Código fuente del `mcp-server`.
*   **`__tests__/`**: Pruebas unitarias para el código del `mcp-server`.
*   **`.github/workflows/`**: Configuraciones de CI/CD para GitHub Actions.
*   **`node_modules/`**: Dependencias de Node.js para este módulo.

### 4. `database/`

Este directorio está vacío en la estructura proporcionada, pero su nombre sugiere que está destinado a contener archivos relacionados con la base de datos. Esto podría incluir:

*   Scripts de inicialización de la base de datos.
*   Archivos de migración de esquemas.
*   Archivos de datos de ejemplo.
*   Configuraciones específicas de la base de datos que no estén en el backend.

### 5. `scripsts/`

Este directorio contiene scripts utilitarios, probablemente para automatizar tareas relacionadas con el desarrollo o despliegue del proyecto.

**Archivos Clave:**

*   **`ejecutar.bat`**: Un script de Windows para ejecutar alguna parte de la aplicación.
*   **`instalar.bat`**: Un script de Windows para instalar dependencias o configurar el entorno.
*   **`package.json` / `package-lock.json`**: Podría indicar que estos scripts también tienen sus propias dependencias de Node.js.

## Archivos en la Raíz del Proyecto

*   **`.gitignore`**: Especifica archivos y directorios que Git debe ignorar (ej. `node_modules/`, archivos de configuración local).
*   **`package-lock.json`**: Asegura que las dependencias de Node.js (si las hay en la raíz, o si es un monorepo) se instalen con las mismas versiones exactas en cualquier entorno.
*   **`plan_proyecto_concesionaria.md`**: Un documento Markdown que probablemente contiene el plan o la descripción general del proyecto.

Esta estructura permite una clara separación de responsabilidades entre el frontend y el backend, facilitando el desarrollo y mantenimiento de la aplicación.
