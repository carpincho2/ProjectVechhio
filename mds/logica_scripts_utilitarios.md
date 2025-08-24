# Lógica del Directorio `scripsts/` (Scripts Utilitarios)

Este documento detalla el propósito y la lógica de los scripts ubicados en el directorio `scripsts/`, que están diseñados para facilitar la configuración y ejecución del servidor backend de la aplicación.

## Propósito General

El directorio `scripsts/` contiene scripts de automatización para entornos Windows (`.bat` files) que simplifican tareas como la instalación de dependencias y el inicio del servidor. Están diseñados para funcionar con una instalación portátil de Node.js, lo que permite un despliegue y ejecución más sencillos.

## Componentes Clave

### 1. `package.json`

Aunque este `package.json` describe un "servidor-express-portable" con una única dependencia (`express`), su función principal en este contexto es ser un archivo de configuración que puede ser **generado automáticamente** por `instalar.bat` si no existe. Esto asegura que el script `instalar.bat` tenga un `package.json` válido para ejecutar `npm install` dentro de su propio directorio, aunque las dependencias principales que se gestionan son las del backend.

### 2. `instalar.bat`

Este script de Windows se encarga de preparar el entorno y asegurar que las dependencias necesarias estén instaladas.

*   **Creación de `package.json`**: Si el archivo `package.json` no se encuentra en el directorio `scripsts/`, el script lo crea con la configuración básica para un "servidor-express-portable" y la dependencia `express`.
*   **Verificación de Node.js y npm**: Comprueba la existencia de los ejecutables `node.exe` y `npm.cmd` en el directorio `../nodejs/` (asumiendo una instalación portátil de Node.js en la raíz del proyecto).
*   **Instalación de Dependencias**: Ejecuta `npm install` utilizando la versión portátil de `npm`. Esto instalará la dependencia `express` para el `package.json` de `scripsts/`. Es importante notar que, para el funcionamiento completo del backend, las dependencias del `backend/` también deben estar instaladas (lo cual `ejecutar.bat` verifica).
*   **Manejo de Errores**: Incluye lógica para intentar un método alternativo de instalación si el primero falla.

### 3. `ejecutar.bat`

Este script de Windows es el punto de entrada para iniciar el servidor backend de la aplicación.

*   **Verificación de Dependencias del Backend**: Antes de iniciar el servidor, el script verifica que el directorio `../backend/node_modules` exista. Si no, indica al usuario que ejecute `instalar.bat` primero, lo que implica que `instalar.bat` debe haber gestionado la instalación de las dependencias del backend principal.
*   **Verificación de Node.js**: Asegura que el ejecutable `node.exe` esté presente en la ruta `../nodejs/`.
*   **Inicio del Servidor**: Muestra mensajes informativos y luego, después de un breve retraso, intenta abrir el navegador web en `http://localhost:3000`.
*   **Ejecución del Backend**: Cambia el directorio de trabajo a `../backend/` y ejecuta el archivo `server.js` del backend utilizando el ejecutable portátil de Node.js (`"..\nodejs\node.exe" server.js`).
*   **Control de Flujo**: El script permanece activo mientras el servidor se ejecuta y muestra un mensaje de "Servidor detenido" al finalizar.

## Relación con el Proyecto Principal

Aunque el `package.json` en `scripsts/` describe un pequeño servidor Express, la lógica de `ejecutar.bat` y `instalar.bat` indica claramente que estos scripts están diseñados para **gestionar el servidor backend principal** de la aplicación (ubicado en `backend/`). El `package.json` en `scripsts/` sirve más como un mecanismo de auto-configuración para los propios scripts, asegurando que tengan `express` disponible para cualquier necesidad interna, mientras que su función principal es orquestar el inicio del backend de la concesionaria.
