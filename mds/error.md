
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

## error 2s

en vehicles en momento de tener autos no se ve los filtros.


## error nuevo 


[DEBUG] Se ha llamado a la función forgotPassword.
[DEBUG] Identifier recibido del frontend: Pane
[DEBUG] Ha ocurrido un error en el bloque catch: Error
    at Database.<anonymous> (G:\2025\consecionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:185:27)
    at G:\2025\consecionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:183:50
    at new Promise (<anonymous>)
    at Query.run (G:\2025\consecionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:183:12)
    at G:\2025\consecionaria\backend\node_modules\sequelize\lib\sequelize.js:315:28
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async SQLiteQueryInterface.select (G:\2025\consecionaria\backend\node_modules\sequelize\lib\dialects\abstract\query-interface.js:407:12)
    at async User.findAll (G:\2025\consecionaria\backend\node_modules\sequelize\lib\model.js:1140:21)
    at async User.findOne (G:\2025\consecionaria\backend\node_modules\sequelize\lib\model.js:1240:12)
    at async exports.forgotPassword (G:\2025\consecionaria\backend\controllers\authcontrol.js:20:22) {
  name: 'SequelizeDatabaseError',
  parent: [Error: SQLITE_ERROR: no such column: reset_password_token] {
    errno: 1,
    code: 'SQLITE_ERROR',
    sql: "SELECT `id`, `username`, `email`, `password`, `role`, `reset_password_token` AS `resetPasswordToken`, `reset_password_expires` AS `resetPasswordExpires`, `created_at` AS `createdAt`, `updated_at` AS `updatedAt` FROM `users` AS `User` WHERE (`User`.`email` = 'Pane' OR `User`.`username` = 'Pane') LIMIT 1;"
  },
  original: [Error: SQLITE_ERROR: no such column: reset_password_token] {
    errno: 1,
    code: 'SQLITE_ERROR',
    sql: "SELECT `id`, `username`, `email`, `password`, `role`, `reset_password_token` AS `resetPasswordToken`, `reset_password_expires` AS `resetPasswordExpires`, `created_at` AS `createdAt`, `updated_at` AS `updatedAt` FROM `users` AS `User` WHERE (`User`.`email` = 'Pane' OR `User`.`username` = 'Pane') LIMIT 1;"
  },
  sql: "SELECT `id`, `username`, `email`, `password`, `role`, `reset_password_token` AS `resetPasswordToken`, `reset_password_expires` AS `resetPasswordExpires`, `created_at` AS `createdAt`, `updated_at` AS `updatedAt` FROM `users` AS `User` WHERE (`User`.`email` = 'Pane' OR `User`.`username` = 'Pane') LIMIT 1;",
  parameters: {}
}
