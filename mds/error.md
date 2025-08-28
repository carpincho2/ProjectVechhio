## error actual
Error en registro: ValidationError [SequelizeValidationError]: Validation error: Validation isEmail on email failed
    at InstanceValidator._validate (G:\2025\consecionaria\backend\node_modules\sequelize\lib\instance-validator.js:50:13)
    at async InstanceValidator._validateAndRunHooks (G:\2025\consecionaria\backend\node_modules\sequelize\lib\instance-validator.js:60:7)
    at async InstanceValidator.validate (G:\2025\consecionaria\backend\node_modules\sequelize\lib\instance-validator.js:54:12)
    at async model.save (G:\2025\consecionaria\backend\node_modules\sequelize\lib\model.js:2426:7)
    at async User.create (G:\2025\consecionaria\backend\node_modules\sequelize\lib\model.js:1362:12)
    at async G:\2025\consecionaria\backend\routes\auth.js:89:25 {
  errors: [
    ValidationErrorItem {
      message: 'Validation isEmail on email failed',
      type: 'Validation error',
      path: 'email',
      value: 'thebest@gmailcom',
      origin: 'FUNCTION',
      instance: [User],
      validatorKey: 'isEmail',
      validatorName: 'isEmail',
      validatorArgs: [Array],
      original: [Error]
    }
  ]
}


## error 1 
al volver de panel control a index por el logo el header queda como si no tuviera logueado.

## error 2

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

## error 3

en vehicles en momento de tener auto no se ve los filtros.