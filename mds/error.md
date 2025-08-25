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
