const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

/**
 * @swagger
 * tags:
 *   name: Vehiculos
 *   description: API para la gestión de vehículos
 */

/**
 * @swagger
 * /vehiculos:
 *   get:
 *     summary: Obtiene todos los vehículos
 *     tags: [Vehiculos]
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 */
router.get('/', vehiculoController.getVehiculos);

/**
 * @swagger
 * /vehiculos/test:
 *   get:
 *     summary: Crea un vehículo de prueba
 *     tags: [Vehiculos]
 *     responses:
 *       201:
 *         description: Vehículo de prueba creado
 */
router.get('/test', vehiculoController.crearVehiculoPrueba);

module.exports = router;
