# Explicación General del Proyecto: Concesionaria

## 1. Propósito del Proyecto

El proyecto "Concesionaria" es una aplicación web full-stack diseñada para simular el sitio web de una concesionaria de automóviles. Su objetivo es permitir a los usuarios ver un catálogo de vehículos, solicitar turnos de servicio y pedir cotizaciones de financiación. Además, cuenta con un panel de control para que los administradores puedan gestionar el contenido del sitio.

Este proyecto sirve como un caso de estudio práctico para aprender y aplicar tecnologías web modernas en un entorno realista, cubriendo desde la configuración del servidor y la base de datos hasta el desarrollo del frontend y la autenticación de usuarios.

## 2. Tecnologías Utilizadas

*   **Backend**: Node.js con el framework Express.js para crear la API REST.
*   **Base de Datos**: SQLite, un sistema de base de datos ligero basado en archivos, gestionado a través del ORM Sequelize para facilitar las interacciones con la base de datos.
*   **Autenticación**: JSON Web Tokens (JWT) para manejar sesiones de usuario seguras y proteger las rutas de la API.
*   **Frontend**: HTML, CSS y JavaScript puro (vanilla JS) para la interfaz de usuario.
*   **Servidor**: Se utiliza `nodemon` en el entorno de desarrollo para reiniciar automáticamente el servidor tras cada cambio en el código.

## 3. Estructura de Carpetas Principal

El proyecto está organizado en las siguientes carpetas principales:

```
/concesionaria
├── /backend/         # Contiene toda la lógica del servidor (API, base de datos).
├── /database/        # Almacena el archivo de la base de datos SQLite.
├── /frontend/        # Contiene todos los archivos del lado del cliente (HTML, CSS, JS, imágenes).
├── /mds/             # Documentación del proyecto en formato Markdown.
├── /nodejs/          # Contiene una versión portable de Node.js para facilitar la ejecución.
└── /scripsts/        # Scripts de utilidad para instalar y ejecutar el proyecto.
```

## Estructura de Directorios y Archivos Detallada

### Archivos en la Raíz del Proyecto

La raíz del proyecto contiene archivos de configuración y gestión esenciales que coordinan el funcionamiento de la aplicación.

*   **`.gitignore`**: Especifica qué archivos y carpetas deben ser ignorados por Git (el sistema de control de versiones). Esto es crucial para evitar subir archivos innecesarios como las dependencias de `node_modules` o archivos de configuración locales.

*   **`package.json` y `package-lock.json`**: Definen las dependencias y scripts del proyecto a nivel raíz. En este caso, su propósito principal es probablemente ejecutar herramientas de desarrollo o scripts que afecten tanto al frontend como al backend.

### Directorio `/database`

*   **Propósito**: Almacenar el archivo físico de la base de datos.
*   **`dealership.sqlite`**: Este es el archivo de la base de datos SQLite. A diferencia de sistemas como MySQL o PostgreSQL que corren como un servicio, SQLite almacena toda la base de datos en un único archivo. Esto hace que el proyecto sea muy portable y fácil de configurar, ya que no requiere un servidor de base de datos separado.

### Directorio `/scripsts` (Scripts Utilitarios)

*   **Propósito**: Facilitar la instalación y ejecución del proyecto, especialmente en un entorno portable.
*   **`instalar.bat`**: Un script de batch para Windows que probablemente instala todas las dependencias necesarias, tanto para el backend como para cualquier otra herramienta a nivel de proyecto. Ejecutar este script es el primer paso para configurar el entorno de desarrollo.
*   **`ejecutar.bat`**: Un script que inicia la aplicación. Seguramente ejecuta el servidor del backend (`server.js`) utilizando la versión portable de Node.js, haciendo que la aplicación se ponga en marcha sin necesidad de tener Node.js instalado globalmente en el sistema.

### Directorio `/mcp-server`

*   **Propósito**: Contener los archivos relacionados con `mcp-server` (Monster's Code Playground Server), una herramienta de desarrollo que parece estar integrada en el proyecto.
*   **Función**: `mcp-server` es un servidor de desarrollo local que actúa como un agente intermediario. Permite a herramientas externas (como un IDE o un asistente de IA) interactuar de forma segura con el entorno de desarrollo local. Facilita tareas como la ejecución de comandos, la lectura/escritura de archivos y la ejecución de tests de forma remota y segura.
*   **Archivos Clave**:
    *   `package.json`: Define las dependencias y scripts específicos para `mcp-server`.
    *   `src/index.ts`: El punto de entrada del servidor.
    *   `docs/`: Documentación específica sobre cómo usar y configurar `mcp-server`.
*   **Relevancia**: Este directorio es fundamental para la experiencia de desarrollo y la interacción con herramientas de asistencia, pero no forma parte del código de la aplicación de la concesionaria en sí (no se despliega en producción).