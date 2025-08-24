# Lógica de los Archivos Raíz del Proyecto

Este documento explica el propósito y la función de los archivos clave ubicados en la raíz del directorio del proyecto.

## 1. `.gitignore`

*   **Propósito**: Este archivo es utilizado por Git (el sistema de control de versiones) para especificar qué archivos y directorios deben ser ignorados y no incluidos en el repositorio. Esto es crucial para mantener el repositorio limpio, evitar la inclusión de archivos temporales, de configuración local, dependencias de módulos o datos sensibles.
*   **Elementos Clave Ignorados en este Proyecto**:
    *   `node_modules/`: Directorios que contienen las dependencias de Node.js instaladas localmente.
    *   `npm-debug.log*`, `yarn-debug.log*`, `.pnpm-debug.log*`: Archivos de registro de depuración de gestores de paquetes.
    *   `.env`: Archivos que suelen contener variables de entorno sensibles (como claves API, credenciales de base de datos).
    *   `.DS_Store`, `Thumbs.db`: Archivos generados por sistemas operativos (macOS y Windows, respectivamente).
    *   `dist/`, `build/`: Directorios que contienen los artefactos de compilación o construcción del proyecto.
    *   `*.sqlite`, `*.db`: Archivos de bases de datos locales.
    *   `*.bak`: Archivos de respaldo.
    *   `gemini.md`: Un archivo específico relacionado con la interacción de la CLI de Gemini.
    *   `nodejs/`: El directorio que contiene la instalación portátil de Node.js utilizada por los scripts utilitarios.
*   **Importancia**: Asegura que solo el código fuente y los archivos esenciales del proyecto sean versionados, facilitando la colaboración y la seguridad.

## 2. `package-lock.json`

*   **Propósito**: Este archivo es generado automáticamente por `npm` (el gestor de paquetes de Node.js) y su función principal es "bloquear" las versiones exactas de todas las dependencias del proyecto (incluyendo las sub-dependencias). Esto garantiza que cualquier persona que instale el proyecto obtenga exactamente las mismas versiones de los paquetes, lo que ayuda a prevenir problemas de compatibilidad y asegura compilaciones reproducibles.
*   **Observación en este Proyecto**: El `package-lock.json` en la raíz del proyecto es bastante minimalista (`"packages": {}`). Esto indica que no hay dependencias directas definidas en un `package.json` a nivel de la raíz del proyecto. Esto es común en proyectos que siguen una estructura de monorepo, donde cada subdirectorio (`backend/`, `frontend/`, `mcp-server/`, `scripsts/`) gestiona sus propias dependencias y tiene su propio `package-lock.json`.

## 3. `plan_proyecto_concesionaria.md`

*   **Propósito (Esperado)**: Basado en su nombre y extensión (`.md` para Markdown), este archivo probablemente estaba destinado a ser un documento de planificación del proyecto, una descripción general, un resumen de requisitos o un plan de desarrollo para la aplicación de la concesionaria.
*   **Observación**: A pesar de haber sido listado en el contexto inicial del directorio, este archivo **no fue encontrado** en la raíz del proyecto durante la revisión actual. Esto podría deberse a que fue eliminado, movido o no se incluyó en la versión actual del repositorio.

Estos archivos raíz son fundamentales para la gestión del proyecto, el control de versiones y la reproducibilidad del entorno de desarrollo.