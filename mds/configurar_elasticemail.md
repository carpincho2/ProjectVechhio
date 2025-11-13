# 📧 Configurar ElasticEmail

Esta guía te explica cómo configurar ElasticEmail para enviar emails desde tu aplicación. **Funciona perfectamente en Render** ya que usa API REST, no SMTP.

## ✅ Ventajas de ElasticEmail

- **100 emails gratis por día** en el plan gratuito
- **Funciona en Render** - No hay problemas de bloqueo SMTP
- **API REST** - Más rápido y confiable que SMTP
- **Fácil de configurar** - Solo necesitas una API Key

## 📋 Pasos para Configurar

### 1. Crear cuenta en ElasticEmail

1. Ve a: https://elasticemail.com/
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener tu API Key

1. Una vez logueado, ve a **Settings** → **API Keys**
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "ProjectVechhio")
4. **Copia la API Key** que se genera

### 3. Verificar tu dominio o usar el email de prueba

- **Opción 1 (Recomendado)**: Verifica tu dominio en ElasticEmail
- **Opción 2**: Usa el email de prueba que ElasticEmail te proporciona (suele ser algo como `noreply@elasticemail.com`)

### 4. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env` en la carpeta `backend/`:

```env
# Configuración de ElasticEmail
ELASTICEMAIL_API_KEY=tu_api_key_aqui
ELASTICEMAIL_FROM_EMAIL=tuemail@tudominio.com

# Nombre que aparecerá como remitente (opcional)
EMAIL_FROM_NAME=ProjectVechhio

# Email para pruebas en desarrollo (opcional)
TEST_EMAIL=carpijefe@gmail.com
```

**Ejemplo completo:**
```env
ELASTICEMAIL_API_KEY=12345678-1234-1234-1234-123456789012
ELASTICEMAIL_FROM_EMAIL=noreply@elasticemail.com
EMAIL_FROM_NAME=ProjectVechhio
TEST_EMAIL=carpijefe@gmail.com
```

### 5. Configurar en Render

Si estás usando Render, agrega las variables de entorno en:
1. Ve a tu servicio en Render
2. **Environment** → **Environment Variables**
3. Agrega:
   - `ELASTICEMAIL_API_KEY` = tu API key
   - `ELASTICEMAIL_FROM_EMAIL` = tu email verificado
   - `EMAIL_FROM_NAME` = ProjectVechhio (opcional)

### 6. Reiniciar el Servidor

Después de configurar las variables, reinicia tu servidor:

```bash
npm start
```

Deberías ver en la consola:
```
✅ ElasticEmail configurado correctamente
```

## 🎯 Cómo Funciona

El sistema usa **ElasticEmail API REST** para enviar emails.

- No requiere SMTP (funciona en Render sin problemas)
- Usa HTTPS para mayor seguridad
- Timeout de 30 segundos configurado

## 📊 Límites del Plan Gratuito

- **100 emails por día** gratis
- **Sin límite de almacenamiento**
- **Soporte por email**

Si necesitas más emails, puedes:
- Actualizar a un plan de pago (muy económico)
- Usar múltiples cuentas de ElasticEmail

## 🔒 Seguridad

- **NUNCA** compartas tu API Key
- **NUNCA** la subas a Git (usa `.env` que está en `.gitignore`)
- Si sospechas que está comprometida, genera una nueva en ElasticEmail

## 🧪 Probar el Envío

Puedes probar el envío de emails usando el endpoint de contacto o cualquier funcionalidad que envíe emails en tu aplicación.

## ❓ Solución de Problemas

### Error: "Invalid API Key"
- Verifica que `ELASTICEMAIL_API_KEY` sea correcta
- Asegúrate de copiar la API Key completa sin espacios

### Error: "From email address is not verified"
- Verifica tu email en ElasticEmail
- O usa el email de prueba que ElasticEmail te proporciona
- Ve a **Settings** → **Domains** para verificar tu dominio

### Error: "Rate limit exceeded"
- Has alcanzado el límite de 100 emails/día del plan gratuito
- Espera 24 horas o actualiza a un plan de pago

### Los emails no llegan
- Revisa la carpeta de **Spam**
- Verifica que el email destino sea válido
- Revisa los logs del servidor para ver errores específicos
- Revisa el dashboard de ElasticEmail para ver el estado de los envíos

## 📚 Referencias

- [Documentación de ElasticEmail](https://elasticemail.com/api-documentation/)
- [Panel de Control de ElasticEmail](https://elasticemail.com/account/)

