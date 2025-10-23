✅ Base de datos conectada y autenticada.
❌ Error al iniciar el servidor: Error
    at Database.<anonymous> (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:185:27)
    at G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:183:50
    at new Promise (<anonymous>)
    at Query.run (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:183:12)
    at G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\sequelize.js:315:28
    at async SQLiteQueryInterface.changeColumn (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query-interface.js:43:7)
    at async User.sync (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\model.js:984:11)
    at async Sequelize.sync (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\sequelize.js:377:9)
    at async startServer (G:\2025\Pane-concesionaria\backend\server.js:81:9) {
  name: 'SequelizeUniqueConstraintError',
  errors: [
    ValidationErrorItem {
      message: 'id must be unique',
      type: 'unique violation',
      path: 'id',
      value: null,
      origin: 'DB',
      instance: null,
      validatorKey: 'not_unique',
      validatorName: null,
      validatorArgs: []
    }
  ],
  parent: [Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: users_backup.id] {
    errno: 19,
    code: 'SQLITE_CONSTRAINT',
    sql: 'INSERT INTO `users_backup` SELECT `id`, `username`, `email`, `password`, `google_id`, `role`, `created_at`, `updated_at` FROM `users`;'
  },
  original: [Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: users_backup.id] {
    errno: 19,
    code: 'SQLITE_CONSTRAINT',
    sql: 'INSERT INTO `users_backup` SELECT `id`, `username`, `email`, `password`, `google_id`, `role`, `created_at`, `updated_at` FROM `users`;'
  },
  fields: [ 'id' ],
  sql: 'INSERT INTO `users_backup` SELECT `id`, `username`, `email`, `password`, `google_id`, `role`, `created_at`, `updated_at` FROM `users`;'
}

[i] Servidor detenido
Press any key to continue . . .