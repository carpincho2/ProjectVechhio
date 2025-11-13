# 📸 Configurar Cloudinary para Imágenes

Esta guía te explica cómo configurar Cloudinary para almacenar las imágenes de forma persistente. **Cloudinary es gratuito y funciona perfectamente en Render**.

## ✅ Ventajas de Cloudinary

- **25 GB de almacenamiento gratis**
- **25 GB de ancho de banda mensual gratis**
- **Funciona en Render** - No hay problemas de almacenamiento temporal
- **CDN global** - Las imágenes se cargan rápido desde cualquier lugar
- **Optimización automática** - Redimensiona y optimiza imágenes automáticamente

## 📋 Pasos para Configurar

### 1. Crear cuenta en Cloudinary

1. Ve a: https://cloudinary.com/
2. Haz clic en **Sign Up for Free**
3. Completa el registro (puedes usar tu cuenta de Google/GitHub)

### 2. Obtener tus credenciales

1. Una vez logueado, ve a tu **Dashboard**
2. En la sección **Account Details**, encontrarás:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env` en la carpeta `backend/`:

```env
# Configuración de Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Ejemplo completo:**
```env
CLOUDINARY_CLOUD_NAME=myapp
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Configurar en Render

Si estás usando Render, agrega las variables de entorno en:
1. Ve a tu servicio en Render
2. **Environment** → **Environment Variables**
3. Agrega:
   - `CLOUDINARY_CLOUD_NAME` = tu cloud name
   - `CLOUDINARY_API_KEY` = tu API key
   - `CLOUDINARY_API_SECRET` = tu API secret

### 5. Instalar la dependencia

En tu servidor, ejecuta:

```bash
cd backend
npm install cloudinary
```

O si estás en Render, simplemente haz push de los cambios (ya está en package.json).

### 6. Reiniciar el Servidor

Después de configurar las variables, reinicia tu servidor:

```bash
npm start
```

Deberías ver en la consola:
```
✅ Cloudinary configurado correctamente
```

## 🎯 Cómo Funciona

El sistema ahora:
1. **Si Cloudinary está configurado**: Sube las imágenes a Cloudinary y guarda la URL completa en la base de datos
2. **Si Cloudinary NO está configurado**: Usa almacenamiento local (como antes)

Las imágenes se almacenan en la carpeta `vehicles/` en tu cuenta de Cloudinary.

## 📊 Límites del Plan Gratuito

- **25 GB de almacenamiento**
- **25 GB de ancho de banda/mes**
- **25,000 transformaciones/mes**

Para la mayoría de aplicaciones, esto es más que suficiente.

## 🔒 Seguridad

- **NUNCA** compartas tu API Secret
- **NUNCA** la subas a Git (usa `.env` que está en `.gitignore`)
- Si sospechas que está comprometida, genera una nueva en Cloudinary Dashboard

## 🧪 Probar la Configuración

1. Sube una imagen de un vehículo desde el panel de control
2. Verifica que la imagen se muestre correctamente
3. Revisa tu dashboard de Cloudinary para ver la imagen subida

## ❓ Solución de Problemas

### Error: "Invalid API Key"
- Verifica que `CLOUDINARY_API_KEY` sea correcta
- Verifica que `CLOUDINARY_API_SECRET` sea correcta
- Asegúrate de copiar las credenciales completas sin espacios

### Las imágenes no se suben
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs del servidor para ver errores específicos
- Asegúrate de que `cloudinary` esté instalado: `npm install cloudinary`

### Las imágenes antiguas dan 404
- Las imágenes antiguas que se guardaron localmente seguirán dando 404
- Las nuevas imágenes se subirán a Cloudinary automáticamente
- Puedes re-subir las imágenes de los vehículos existentes para migrarlas a Cloudinary

## 📚 Referencias

- [Documentación de Cloudinary](https://cloudinary.com/documentation)
- [Dashboard de Cloudinary](https://cloudinary.com/console)

