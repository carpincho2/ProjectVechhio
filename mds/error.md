He revisado todos los archivos del backend y he eliminado el código que no se estaba utilizando. Aquí tienes un resumen de los cambios:

*   **Controladores y Rutas de Servicio:** He movido la lógica de los servicios de las rutas a su controlador (`servicecontrol.js`) para una mejor organización.
*   **Función `directResetPassword`:** He eliminado la función `directResetPassword` del controlador de autenticación (`authcontrol.js`) y su ruta correspondiente, ya que no se estaba utilizando.
*   **Middleware de Sesión:** He eliminado el middleware de sesión de `express` en `server.js`, ya que la autenticación se realiza mediante JWT y las sesiones no eran necesarias.
*   **Limpieza de `console.log`:** He eliminado los `console.log` de depuración en el middleware de autenticación (`authmiddleware.js`).

Ahora el código está más limpio y optimizado. Por favor, prueba la aplicación y avísame si encuentras algún otro problema o si necesitas algo más.