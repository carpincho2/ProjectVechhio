❌ Error al iniciar el servidor: Error
    at Database.<anonymous> (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:185:27)
    at G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:183:50
    at new Promise (<anonymous>)
    at Query.run (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\sqlite\query.js:183:12)
    at G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\sequelize.js:315:28
    at async SQLiteQueryInterface.addColumn (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\dialects\abstract\query-interface.js:184:12)
    at async User.sync (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\model.js:958:11)
    at async Sequelize.sync (G:\2025\Pane-concesionaria\backend\node_modules\sequelize\lib\sequelize.js:377:9)
    at async startServer (G:\2025\Pane-concesionaria\backend\server.js:81:9) {
  name: 'SequelizeDatabaseError',
  parent: [Error: SQLITE_ERROR: Cannot add a UNIQUE column] {
    errno: 1,
    code: 'SQLITE_ERROR',
    sql: 'ALTER TABLE `users` ADD `google_id` VARCHAR(255) UNIQUE;'
  },
  original: [Error: SQLITE_ERROR: Cannot add a UNIQUE column] {
    errno: 1,
    code: 'SQLITE_ERROR',
    sql: 'ALTER TABLE `users` ADD `google_id` VARCHAR(255) UNIQUE;'
  },
  sql: 'ALTER TABLE `users` ADD `google_id` VARCHAR(255) UNIQUE;',
  parameters: {}
}


