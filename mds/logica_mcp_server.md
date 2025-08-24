# Lógica del Directorio `mcp-server/`

Este documento explica el propósito y la lógica del directorio `mcp-server/`, que contiene un proyecto independiente dentro de la estructura general de la concesionaria.

## Propósito y Rol

El `mcp-server` es un componente especializado que actúa como un **servidor del Protocolo de Contexto de Modelo (MCP)**. Su función principal es proporcionar capacidades de **automatización de navegador utilizando Playwright** para **Grandes Modelos de Lenguaje (LLMs)**. En esencia, permite que los LLMs interactúen con páginas web de manera programática.

### Funcionalidades Clave:

*   **Interacción con Páginas Web**: Permite a los LLMs navegar, hacer clic, rellenar formularios y realizar otras acciones en un entorno de navegador real.
*   **Capturas de Pantalla**: Capacidad para tomar capturas de pantalla de páginas web.
*   **Generación de Código de Prueba**: Puede generar código de prueba basado en interacciones con el navegador.
*   **Web Scraping**: Extraer información de páginas web.
*   **Ejecución de JavaScript**: Ejecutar código JavaScript directamente en el contexto del navegador.

Esto lo convierte en una herramienta poderosa para escenarios de automatización y pruebas impulsadas por IA, donde un LLM puede "entender" y "actuar" sobre una interfaz web.

## Tecnologías Clave

*   **Playwright**: Framework de automatización de navegadores.
*   **Model Context Protocol (MCP)**: Protocolo que permite a los LLMs interactuar con herramientas externas.
*   **TypeScript**: Lenguaje de programación utilizado para el desarrollo del servidor.
*   **Node.js**: Entorno de ejecución del servidor.
*   **Jest**: Framework de pruebas unitarias.
*   **Docusaurus**: Generador de sitios estáticos utilizado para la documentación.

## Estructura y Punto de Entrada (`src/index.ts`)

El archivo `mcp-server/src/index.ts` es el punto de entrada principal del servidor. Su lógica principal es:

1.  **Inicialización del Servidor MCP**: Crea una instancia de `Server` del SDK de MCP, asignándole un nombre (`playwright-mcp`) y una versión.
2.  **Definición de Herramientas**: Importa y utiliza `createToolDefinitions()` (definido en `src/tools.ts`) para cargar todas las funcionalidades de Playwright que se expondrán como "herramientas" para los LLMs.
3.  **Manejo de Solicitudes**: Importa y utiliza `setupRequestHandlers()` (definido en `src/requestHandler.ts`) para configurar cómo el servidor procesará las solicitudes entrantes de los LLMs, invocando las herramientas adecuadas.
4.  **Comunicación**: Utiliza `StdioServerTransport` para comunicarse a través de los flujos de entrada/salida estándar, lo que es común para herramientas de línea de comandos o procesos que interactúan con un proceso padre.
5.  **Manejo de Apagado Elegante**: Incluye lógica para un apagado limpio del servidor ante señales del sistema.

## Dependencias (`package.json`)

El archivo `mcp-server/package.json` lista las dependencias del proyecto, destacando:

*   `@modelcontextprotocol/sdk`: El SDK para implementar el protocolo MCP.
*   `@playwright/browser-*` y `playwright`: Las librerías de Playwright para el control de navegadores.
*   `mcp-evals`: Otra dependencia relacionada con el ecosistema MCP, probablemente para evaluaciones de modelos.

## Documentación (`docs/`)

El directorio `mcp-server/docs/` contiene la documentación completa del proyecto, generada utilizando **Docusaurus**. Esto incluye tutoriales, referencias de API y guías de uso, lo que subraya que `mcp-server` es una herramienta bien documentada y mantenida.

## Pruebas

El proyecto utiliza **Jest** para sus pruebas unitarias, ubicadas en el directorio `src/__tests__`. También se menciona el uso de `evals` para ejecutar evaluaciones, lo que sugiere un enfoque robusto en la calidad y el rendimiento de las funcionalidades expuestas.

## Relación con el Proyecto Principal de la Concesionaria

Es importante destacar que el `mcp-server` es un **proyecto independiente y especializado** dentro de la estructura general. No forma parte de la lógica de negocio central de la aplicación de la concesionaria (gestión de vehículos, finanzas, servicios, etc.). Su inclusión en este repositorio sugiere que podría ser una herramienta utilizada para el desarrollo, pruebas automatizadas, o alguna funcionalidad avanzada de IA relacionada con la concesionaria, pero opera de forma autónoma.