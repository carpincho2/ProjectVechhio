
## error actual
al volver de panel control a index por el logo el header queda como si no tuviera logueado.

## error 1

Error al crear servicio: ValidationError [SequelizeValidationError]: notNull Violation: Service.userId cannot be null
    at InstanceValidator._validate (D:\2025\consecionaria\backend\node_modules\sequelize\lib\instance-validator.js:50:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async InstanceValidator._validateAndRunHooks (D:\2025\consecionaria\backend\node_modules\sequelize\lib\instance-validator.js:60:7)
    at async InstanceValidator.validate (D:\2025\consecionaria\backend\node_modules\sequelize\lib\instance-validator.js:54:12)
    at async model.save (D:\2025\consecionaria\backend\node_modules\sequelize\lib\model.js:2426:7)
    at async Service.create (D:\2025\consecionaria\backend\node_modules\sequelize\lib\model.js:1362:12)
    at async D:\2025\consecionaria\backend\routes\service.js:10:28 {
  errors: [
    ValidationErrorItem {
      message: 'Service.userId cannot be null',
      type: 'notNull Violation',
      path: 'userId',
      value: null,
      origin: 'CORE',
      instance: [Service],
      validatorKey: 'is_null',
      validatorName: null,
      validatorArgs: []
    }
  ]
}
## error reciente

G:\2025\consecionaria\backend\routes\service.js:10
                    const userId = req.user.id; // Obtener el ID del usuario del token
                          ^

SyntaxError: Identifier 'userId' has already been declared
    at wrapSafe (node:internal/modules/cjs/loader:1662:18)
    at Module._compile (node:internal/modules/cjs/loader:1704:20)
    at Object..js (node:internal/modules/cjs/loader:1895:10)
    at Module.load (node:internal/modules/cjs/loader:1465:32)
    at Function._load (node:internal/modules/cjs/loader:1282:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1487:12)
    at require (node:internal/modules/helpers:135:16)
    at Object.<anonymous> (G:\2025\consecionaria\backend\server.js:12:23


##  mensaje de la consola 
modulos.js:18 DEBUG modulos.js: Respuesta de /api/auth/check: {
  "loggedIn": true,
  "user": {
    "id": 1,
    "role": "superadmin",
    "username": "admincarpi",
    "iat": 1756611781,
    "exp": 1756698181
  }
}