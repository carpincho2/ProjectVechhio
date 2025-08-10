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
 *     summary: Obtiene todos los vehículos con paginación, filtrado y ordenamiento
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo por el que ordenar (ej. 'precio' o '-precio' para descendente)
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Filtrar por marca de vehículo
 *       - in: query
 *         name: modelo
 *         schema:
 *           type: string
 *         description: Filtrar por modelo de vehículo
 *       - in: query
 *         name: año
 *         schema:
 *           type: integer
 *         description: Filtrar por año del vehículo
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Número de vehículos en la respuesta actual
 *                 total:
 *                   type: integer
 *                   description: Número total de vehículos disponibles
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehiculos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: No se encontraron vehículos
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
