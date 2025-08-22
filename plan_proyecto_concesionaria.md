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

---

## 🔹 **Fase 2 – Modelos y base de datos (Semanas 2–3)**
- Crear modelos Sequelize en `/backend/models`:  
  - `User` → login y registro.  
  - `Vehicle` → inventario de autos.  
  - `Service` → turnos de taller.  
  - `Finance` → solicitudes de financiación.  
- Probar con `sequelize.sync()` que se creen las tablas en `dealership.sqlite`.  

✅ Resultado: base de datos funcionando.

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

---

## 🔹 **Fase 5 – Servicios y financiación (Semana 6)**
- Backend:  
  - `POST /services` y `GET /services` (turnos).  
  - `POST /finance` y `GET /finance` (solicitudes).  
- Frontend:  
  - `service.html`: formulario que guarda turnos en DB.  
  - `finance.html`: simulador de cuotas + guardar solicitud.  

✅ Resultado: turnos y financiación conectados al backend.

---

## 🔹 **Fase 6 – Integración (Semana 7)**
- Usuarios logueados: ver sus turnos y solicitudes.  
- Admin: panel para gestionar vehículos y solicitudes.  
- Validaciones con JS en el frontend.  

✅ Resultado: sistema integrado completo.

---

## 🔹 **Fase 7 – Extras (Semana 8, si sobra tiempo)**
- Exportar turnos/solicitudes a PDF.  
- Dashboard con estadísticas (ej: cantidad de autos cargados, turnos dados).  
- Modo oscuro/claro en frontend.  

✅ Resultado: detalles que sorprenden al profe.

---

📌 **Entrega final**:  
- Web portable en pendrive.  
- Funcionalidades principales:  
  - Registro/login.  
  - Catálogo de autos.  
  - Turnos de taller.  
  - Solicitudes de financiación.  
- Extras opcionales para sumar puntos.

