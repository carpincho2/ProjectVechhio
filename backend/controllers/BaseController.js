const { successResponse, errorResponse, logger } = require('../utils');
const { withTransaction } = require('../utils');

class BaseController {
    constructor(model) {
        this.model = model;
        this.logger = logger;
    }

    // Método genérico para obtener todos los registros
    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            return successResponse(res, 200, items);
        } catch (error) {
            this.logger.error(`Error en getAll de ${this.model.name}:`, error);
            return errorResponse(res, 500, 'Error al obtener los registros');
        }
    }

    // Método genérico para obtener un registro por ID
    async getById(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
            if (!item) {
                return errorResponse(res, 404, 'Registro no encontrado');
            }
            return successResponse(res, 200, item);
        } catch (error) {
            this.logger.error(`Error en getById de ${this.model.name}:`, error);
            return errorResponse(res, 500, 'Error al obtener el registro');
        }
    }

    // Método genérico para crear un registro
    async create(req, res) {
        try {
            const item = await withTransaction(async (t) => {
                return await this.model.create(req.body, { transaction: t });
            });
            return successResponse(res, 201, item, 'Registro creado exitosamente');
        } catch (error) {
            this.logger.error(`Error en create de ${this.model.name}:`, error);
            return errorResponse(res, 500, 'Error al crear el registro');
        }
    }

    // Método genérico para actualizar un registro
    async update(req, res) {
        try {
            const [updated] = await withTransaction(async (t) => {
                return await this.model.update(req.body, {
                    where: { id: req.params.id },
                    transaction: t
                });
            });

            if (!updated) {
                return errorResponse(res, 404, 'Registro no encontrado');
            }

            const item = await this.model.findByPk(req.params.id);
            return successResponse(res, 200, item, 'Registro actualizado exitosamente');
        } catch (error) {
            this.logger.error(`Error en update de ${this.model.name}:`, error);
            return errorResponse(res, 500, 'Error al actualizar el registro');
        }
    }

    // Método genérico para eliminar un registro
    async delete(req, res) {
        try {
            const deleted = await withTransaction(async (t) => {
                return await this.model.destroy({
                    where: { id: req.params.id },
                    transaction: t
                });
            });

            if (!deleted) {
                return errorResponse(res, 404, 'Registro no encontrado');
            }

            return successResponse(res, 200, null, 'Registro eliminado exitosamente');
        } catch (error) {
            this.logger.error(`Error en delete de ${this.model.name}:`, error);
            return errorResponse(res, 500, 'Error al eliminar el registro');
        }
    }

    // Método genérico para paginación
    async getPaginated(req, res) {
        try {
            const { page = 0, size = 10 } = req.query;
            const { limit, offset } = this.getPagination(page, size);

            const data = await this.model.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const response = this.getPagingData(data, page, limit);
            return successResponse(res, 200, response);
        } catch (error) {
            this.logger.error(`Error en getPaginated de ${this.model.name}:`, error);
            return errorResponse(res, 500, 'Error al obtener los registros paginados');
        }
    }
}

module.exports = BaseController;