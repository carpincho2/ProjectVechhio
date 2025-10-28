# Despliegue en Render — Instrucciones rápidas

Archivo de referencia para desplegar el proyecto y dejar todo listo para que el profe pruebe.

## 1) Preparar el repo (PowerShell)
- Subir cambios locales (ej.: cambios que ya se aplicaron para Render):
  git add .; git commit -m "Adapt render: engines, db config, oauth callback, safe startup, demo admin"; git push origin main

- (Opcional) Incluir DB de demo y uploads para que el profe vea datos reales:
  git add -f database/consecionaria.db uploads; git commit -m "Add demo DB and uploads"; git push origin main

> Nota: Forzar `database/consecionaria.db` al repo es práctico para demos, pero no recomendado en producción.

## 2) Ajustes en Render (Dashboard → Service Settings)
- Build Command: `npm install` (no usar `yarn` si el repo tiene package-lock.json)
- Start Command: `npm start`
- Environment: Node (Render detecta automáticamente)

## 3) Variables de entorno recomendadas (Environment → Add)
- SESSION_SECRET=valor_largo
- NODE_ENV=production
- ADMIN_USERNAME (opcional)
- ADMIN_EMAIL (opcional)
- ADMIN_PASSWORD (opcional)
- ADMIN_CREATION_SECRET (si vas a usar endpoint temporal)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL=https://<tu-servicio>.onrender.com/api/auth/google/callback
- DATABASE_URL (opcional, si vas a usar Postgres en Render)

## 4) Google OAuth (Google Cloud Console)
1. Ir a APIs & Services → Credentials → OAuth 2.0 Client IDs → editar la credencial.
2. En "Authorized redirect URIs" agregar exactamente:
   - `https://<tu-servicio>.onrender.com/api/auth/google/callback`
   - (opcional) `http://localhost:3000/api/auth/google/callback` para pruebas locales
3. Copiar `Client ID` y `Client Secret` a las env vars `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en Render.

## 5) Crear el superadmin (sin shell)
Opciones:

A) Creación automática al iniciar (recomendado para demo)
- Si en Render definiste `ADMIN_USERNAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`, el servidor intenta crear un superadmin si no existe cuando arranca (esto ya está implementado).
- Sólo redeploy después de configurar las env vars y el admin será creado.

B) Endpoint temporal (más controlado)
- Si preferís no redeployar, podemos habilitar un endpoint temporal `/api/admin/create?secret=<ADMIN_CREATION_SECRET>` que crea el admin cuando se llama (desde navegador/Postman).
- IMPORTANTE: eliminar o deshabilitar el endpoint después de usarlo.

## 6) Probar y depurar
- Probar estado básico: `https://<tu-servicio>.onrender.com/api/status`
- Probar login con Google: botón de login → redirige a Google → callback debe llevar a `https://<tu-servicio>.onrender.com/api/auth/google/callback`
- Logs en Render: Dashboard → Deploys → View logs. Buscar errores de DB, OAuth o rutas.

## 7) Problemas comunes y soluciones
- Error `redirect_uri_mismatch`: la URL exacta no está en "Authorized redirect URIs" de Google. Agregar la URI exacta.
- Error `no such table` (SQLite): asegurarse de que `database/consecionaria.db` exista en el repo o que `sequelize.sync()` cree las tablas. Ya se añadió manejo para evitar que el servidor caiga si falta `users_backup`.
- Warning sobre MemoryStore: para demo está bien, para producción usar un store (Redis).

## 8) Recomendaciones finales
- Para una entrega/preview al profe: usar SQLite con DB incluida en el repo (rápido y simple).
- Para producción o pruebas concurrentes: migrar a Postgres (`DATABASE_URL` en Render) y añadir `pg`/`pg-hstore` a dependencias.

---
Si querés, agrego el endpoint temporal para crear el admin o creo un README más detallado con capturas y comandos paso a paso. Dime qué preferís.
