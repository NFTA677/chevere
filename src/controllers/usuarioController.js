const { Usuario, Pedido } = require('../models');
const { HttpError } = require('../middlewares/errores');
const crearCrud = require('./crudController');

module.exports = crearCrud(Usuario, {
  campos: ['nombre', 'email', 'telefono'],
  orden: { nombre: 1 },
  antesDeEliminar: async (usuario) => {
    if (await Pedido.exists({ usuario: usuario._id })) {
      throw new HttpError(409, 'No se puede eliminar: el usuario tiene pedidos');
    }
  },
});
