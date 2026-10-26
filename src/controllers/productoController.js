const { isValidObjectId } = require('mongoose');
const { Producto, Categoria, Pedido } = require('../models');
const { HttpError } = require('../middlewares/errores');
const crearCrud = require('./crudController');

module.exports = crearCrud(Producto, {
  campos: ['nombre', 'precio', 'stock', 'categoria'],
  populate: { path: 'categoria', select: 'nombre' },
  orden: { nombre: 1 },
  // La categoría debe existir
  antesDeGuardar: async ({ categoria }) => {
    if (categoria !== undefined && !(isValidObjectId(categoria) && (await Categoria.exists({ _id: categoria })))) {
      throw new HttpError(400, `La categoría ${categoria} no existe`);
    }
  },
  antesDeEliminar: async (producto) => {
    if (await Pedido.exists({ 'detalles.producto': producto._id })) {
      throw new HttpError(409, 'No se puede eliminar: el producto está en pedidos');
    }
  },
});
