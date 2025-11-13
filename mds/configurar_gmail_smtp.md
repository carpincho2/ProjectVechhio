# 📧 Configurar Gmail SMTP Gratis

Esta guía te explica cómo configurar el envío de emails usando Gmail SMTP de forma **completamente gratuita**.

## ✅ Ventajas de usar Gmail SMTP

- **100% Gratis** - No requiere servicios de pago
- **Hasta 500 emails por día** - Suficiente para la mayoría de aplicaciones
- **Fácil de configurar** - Solo necesitas tu cuenta de Gmail
- **Confiable** - Usa la infraestructura de Google

## 📋 Pasos para Configurar

### 1. Habilitar la Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Ve a **Seguridad** → **Verificación en 2 pasos**
3. Activa la verificación en 2 pasos si no la tienes activada

### 2. Generar una Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. O ve a **Seguridad** → **Verificación en 2 pasos** → **Contraseñas de aplicaciones**
3. Selecciona:
   - **Aplicación**: "Correo"
   - **Dispositivo**: "Otro (nombre personalizado)" y escribe "Node.js App"
4. Haz clic en **Generar**
5. **Copia la contraseña de 16 caracteres** que aparece (ejemplo: `abcd efgh ijkl mnop`)

⚠️ **Importante**: Esta contraseña es diferente a tu contraseña de Gmail normal. Úsala solo para aplicaciones.

### 3. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env` en la carpeta `backend/`:

```env
# Configuración de Gmail SMTP (GRATIS)
GMAIL_USER=tuemail@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Nombre que aparecerá como remitente (opcional)
EMAIL_FROM_NAME=ProjectVechhio

# Email para pruebas en desarrollo (opcional)
TEST_EMAIL=carpijefe@gmail.com
```

**Ejemplo completo:**
```env
GMAIL_USER=carpijefe@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM_NAME=ProjectVechhio
TEST_EMAIL=carpijefe@gmail.com
```

### 4. Reiniciar el Servidor

Después de configurar las variables, reinicia tu servidor:

```bash
npm start
```

Deberías ver en la consola:
```
✅ Gmail SMTP configurado correctamente
```

## 🎯 Cómo Funciona

El sistema ahora tiene **dos métodos de envío**:

1. **Gmail SMTP** (si está configurado `GMAIL_USER` y `GMAIL_APP_PASSWORD`) - **SIEMPRE se prioriza** ⭐
2. **Resend** (si está configurado `RESEND_API_KEY`) - Solo se usa si Gmail NO está configurado

**Gmail siempre tiene prioridad** - Si tienes Gmail configurado, se usará Gmail aunque también tengas Resend configurado.

## 📊 Límites de Gmail

- **500 emails por día** para cuentas gratuitas
- **2,000 emails por día** para Google Workspace (pago)

Si necesitas enviar más emails, considera:
- Usar múltiples cuentas de Gmail
- Actualizar a Google Workspace
- Usar un servicio como Resend (tiene plan gratuito con límites)

## 🔒 Seguridad

- **NUNCA** compartas tu contraseña de aplicación
- **NUNCA** la subas a Git (usa `.env` que está en `.gitignore`)
- Si sospechas que está comprometida, genera una nueva en https://myaccount.google.com/apppasswords

## 🧪 Probar el Envío

Puedes probar el envío de emails usando el endpoint de contacto o cualquier funcionalidad que envíe emails en tu aplicación.

## ❓ Solución de Problemas

### Error: "Invalid login"
- Verifica que `GMAIL_USER` sea tu email completo (ej: `usuario@gmail.com`)
- Verifica que `GMAIL_APP_PASSWORD` sea la contraseña de aplicación de 16 caracteres (sin espacios o con espacios, ambos funcionan)

### Error: "Less secure app access"
- Ya no es necesario habilitar "acceso de aplicaciones menos seguras"
- Solo necesitas la contraseña de aplicación

### Los emails no llegan
- Revisa la carpeta de **Spam**
- Verifica que el email destino sea válido
- Revisa los logs del servidor para ver errores específicos

### Límite de envío alcanzado
- Gmail limita a 500 emails/día en cuentas gratuitas
- Espera 24 horas o usa otra cuenta de Gmail

## 📚 Referencias

- [Contraseñas de aplicaciones de Google](https://support.google.com/accounts/answer/185833)
- [Nodemailer con Gmail](https://nodemailer.com/usage/using-gmail/)

