const { Categoria, Producto } = require('../models');
const { HttpError } = require('../middlewares/errores');
const crearCrud = require('./crudController');

module.exports = crearCrud(Categoria, {
  campos: ['nombre', 'descripcion'],
  orden: { nombre: 1 },
  antesDeEliminar: async (categoria) => {
    if (await Producto.exists({ categoria: categoria._id })) {
      throw new HttpError(409, 'No se puede eliminar: la categoría tiene productos');
    }
  },
});
