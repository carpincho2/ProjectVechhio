# 📅 Plan del Proyecto – Concesionaria

## 🔹 **Fase 1 – Entorno y organización (Semana 1)**
- Organizar carpetas:  
  ```
  /server
    /frontend   ← HTML, CSS, imágenes
    /backend    ← Node.js + Express + Sequelize
    /database   ← dealership.sqlite
    /nodejs     ← Node portable
  ```
- Crear `/backend/package.json` y correr `npm install` con dependencias:  
  ```
  express sequelize sqlite3 bcrypt jsonwebtoken dotenv nodemon
  ```
- Configurar `/backend/config/database.js` para usar SQLite.  

✅ Resultado: backend inicial + conexión a DB lista.
**Estado Actual**: ✅ **COMPLETADA**.

---

## 🔹 **Fase 2 – Modelos y base de datos (Semanas 2–3)**
- Crear modelos Sequelize en `/backend/models`:  
  - `User` → login y registro.  
  - `Vehicle` → inventario de autos.  
  - `Service` → turnos de taller.  
  - `Finance` → solicitudes de financiación.  
- Probar con `sequelize.sync()` que se creen las tablas en `dealership.sqlite`.  

✅ Resultado: base de datos funcionando.
**Estado Actual**: ✅ **COMPLETADA**.

---

## 🔹 **Fase 3 – Autenticación (Semana 4)**
- Backend:  
  - `/register` → crear usuario (con bcrypt).  
  - `/login` → devolver token JWT.  
  - Middleware `authMiddleware.js` → proteger rutas.  
- Frontend:  
  - Conectar `register.html` y `login.html` con `fetch`.  
  - Guardar token en `localStorage`.  

✅ Resultado: sistema de login y registro.
**Estado Actual**: ✅ **COMPLETADA**.
*   **Implementación**: El backend ha sido refactorizado para usar tokens JWT para la autenticación y el frontend ha sido actualizado para enviar credenciales vía `fetch`, recibir y almacenar el token JWT en `localStorage`, y enviar el token en las cabeceras de las solicitudes autenticadas. Se ha eliminado la lógica de sesión del backend.

---

## 🔹 **Fase 4 – CRUD de vehículos (Semana 5)**
- Backend:  
  - `POST /vehicles`  
  - `GET /vehicles` (con filtros)  
  - `PUT /vehicles/:id`  
  - `DELETE /vehicles/:id`  
- Frontend:  
  - Mostrar lista en `vehicles.html`.  
  - Filtros dinámicos (marca, precio, año).  

✅ Resultado: catálogo dinámico de autos.
**Estado Actual**: ⚠️ **PARCIALMENTE COMPLETADA**.*   **Backend**: ✅ **COMPLETADA**. `POST`, `GET` (con filtros), `PUT`, `DELETE` implementados.
*   **Frontend**: ✅ **COMPLETADA**. La página `vehicles.html` ahora carga dinámicamente la lista de vehículos y permite filtrarlos.

---

## 🔹 **Fase 5 – Servicios y financiación (Semana 6)**
- Backend:  
  - `POST /services` y `GET /services` (turnos).  
  - `POST /finance` y `GET /finance` (solicitudes).  
- Frontend:  
  - `service.html`: formulario que guarda turnos en DB.  
  - `finance.html`: simulador de cuotas + guardar solicitud.  

✅ Resultado: turnos y financiación conectados al backend.
**Estado Actual**: ⚠️ **PARCIALMENTE COMPLETADA**.
*   **Backend**: APIs para `POST`/`GET` de servicios y finanzas implementadas.
*   **Frontend**: ✅ **COMPLETADA**. La gestión dinámica de servicios y finanzas en el panel de administración está implementada. **PENDIENTE**: Los formularios públicos (`service.html`, `finance.html`) aún no están conectados al backend.

---

## 🔹 **Fase 6 – Integración (Semana 7)**
- Usuarios logueados: ver sus turnos y solicitudes.  
- Admin: panel para gestionar vehículos y solicitudes.  
- Validaciones con JS en el frontend.  

✅ Resultado: sistema integrado completo.
**Estado Actual**: ⚠️ **PARCIALMENTE COMPLETADA**.
*   **Admin Panel**: El panel administrativo está bien desarrollado y cumple con la gestión para el rol de administrador.
*   **Gestión de Usuarios (SuperAdmin)**: ✅ **COMPLETADA**. Panel para listar usuarios y cambiar sus roles.
*   **Usuarios Logueados (Datos Propios)**: ✅ **PARCIALMENTE COMPLETADA**. Se ha implementado la página de perfil (`profile.html`) donde un usuario puede ver su propia información (usuario, email, rol). **PENDIENTE**: Aún no se muestran los turnos o solicitudes de financiación del usuario.
*   **Validaciones JS en Frontend**: **PENDIENTE**. Validaciones básicas existen, pero validaciones JavaScript más extensas para todos los formularios podrían estar ausentes.

---

## 🔹 **Fase 7 – Extras (Semana 8, si sobra tiempo)**
- Dashboard con estadísticas (ej: cantidad de autos cargados, turnos dados).  
  *   **Implementación**: El dashboard ahora muestra estadísticas dinámicas para vehículos (total, nuevos, usados), servicios (programados, completados, pendientes) y finanzas (ingresos mensuales, solicitudes totales, aprobadas), obtenidas directamente del backend.
- Modo oscuro/claro en frontend.  

✅ Resultado: detalles que sorprenden al profe.
**Estado Actual**: ✅ **COMPLETADA**.
*   La funcionalidad de dashboard con estadísticas ha sido implementada.

---

📌 **Entrega final**:  
- Web portable en pendrive.  
- Funcionalidades principales:  
  - Registro/login.  
  - Catálogo de autos.  
  - Turnos de taller.  
  - Solicitudes de financiación.  
- Extras opcionales para sumar puntos.

**Estado Actual de la Entrega Final**:
*   **Web portable**: ✅ **COMPLETADA**. La estructura con `nodejs/` y los scripts `scripsts/` sugieren portabilidad.
*   **Funcionalidades principales**:
    *   **Registro/login**: ✅ **COMPLETADA** (con desviación a sesiones).
    *   **Catálogo de autos**: ⚠️ **PARCIALMENTE COMPLETADA**. Backend casi completo, frontend público estático.
    *   **Turnos de taller**: ⚠️ **PARCIALMENTE COMPLETADA**. Backend completo, frontend público estático.
    *   **Solicitudes de financiación**: ⚠️ **PARCIALMENTE COMPLETADA**. Backend completo, frontend público estático.
*   **Extras opcionales**: ❌ **PENDIENTE**.