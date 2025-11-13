# 📸 Configurar ImgBB para Imágenes

Esta guía te explica cómo configurar ImgBB como alternativa a Cloudinary. **ImgBB es completamente gratuito, no requiere tarjeta de crédito y funciona perfectamente en Render**.

## ✅ Ventajas de ImgBB

- **100% Gratis** - Sin límites estrictos
- **No requiere tarjeta de crédito** - A diferencia de Cloudinary
- **API simple** - Fácil de configurar
- **Funciona en Render** - No hay problemas de almacenamiento temporal
- **Sin verificación complicada** - Solo necesitas una API key

## 📋 Pasos para Configurar

### 1. Crear cuenta en ImgBB

1. Ve a: https://imgbb.com/
2. Haz clic en **Sign Up** (puedes usar tu cuenta de Google)
3. Completa el registro

### 2. Obtener tu API Key

1. Una vez logueado, ve a: https://api.imgbb.com/
2. Haz clic en **Get API Key**
3. Completa el formulario (nombre del proyecto, etc.)
4. **Copia la API Key** que se genera

### 3. Configurar Variables de Entorno

Agrega esta variable a tu archivo `.env` en la carpeta `backend/`:

```env
# Configuración de ImgBB (alternativa a Cloudinary)
IMGBB_API_KEY=tu_api_key_aqui
```

**Ejemplo completo:**
```env
IMGBB_API_KEY=1234567890abcdef1234567890abcdef
```

### 4. Configurar en Render

Si estás usando Render, agrega la variable de entorno en:
1. Ve a tu servicio en Render
2. **Environment** → **Environment Variables**
3. Agrega:
   - `IMGBB_API_KEY` = tu API key

### 5. Instalar la dependencia

La dependencia `form-data` ya está en el package.json. Si necesitas instalarla:

```bash
cd backend
npm install form-data
```

### 6. Reiniciar el Servidor

Después de configurar la variable, reinicia tu servidor:

```bash
npm start
```

Deberías ver en la consola:
```
✅ ImgBB configurado correctamente (alternativa a Cloudinary)
```

## 🎯 Cómo Funciona

El sistema ahora tiene **prioridad**:
1. **ImgBB** (si está configurado) - Se usa primero
2. **Cloudinary** (si está configurado y ImgBB no) - Se usa como alternativa
3. **Almacenamiento local** (si ninguno está configurado)

Las imágenes se suben directamente a ImgBB y se guarda la URL completa en la base de datos.

## 📊 Límites

ImgBB es muy generoso con su plan gratuito:
- **Sin límite de almacenamiento** (prácticamente)
- **Sin límite de ancho de banda**
- **Sin límite de imágenes**

## 🔒 Seguridad

- **NUNCA** compartas tu API Key
- **NUNCA** la subas a Git (usa `.env` que está en `.gitignore`)
- Si sospechas que está comprometida, genera una nueva en ImgBB

## 🧪 Probar la Configuración

1. Sube una imagen de un vehículo desde el panel de control
2. Verifica que la imagen se muestre correctamente
3. La URL debería ser algo como: `https://i.ibb.co/...`

## ❓ Solución de Problemas

### Error: "Invalid API Key"
- Verifica que `IMGBB_API_KEY` sea correcta
- Asegúrate de copiar la API Key completa sin espacios
- Verifica que la API Key esté activa en tu cuenta de ImgBB

### Las imágenes no se suben
- Verifica que la variable de entorno esté configurada correctamente
- Revisa los logs del servidor para ver errores específicos
- Asegúrate de que `form-data` esté instalado: `npm install form-data`

### Las imágenes antiguas dan 404
- Las imágenes antiguas que se guardaron localmente seguirán dando 404
- Las nuevas imágenes se subirán a ImgBB automáticamente
- Puedes re-subir las imágenes de los vehículos existentes para migrarlas a ImgBB

## 📚 Referencias

- [API de ImgBB](https://api.imgbb.com/)
- [Documentación de ImgBB](https://help.imgbb.com/)

