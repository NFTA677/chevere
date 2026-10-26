const { Router } = require('express');
const usuarios = require('../controllers/usuarioController');
const categorias = require('../controllers/categoriaController');
const productos = require('../controllers/productoController');
const pedidos = require('../controllers/pedidoController');

const router = Router();

// Rutas CRUD estándar: GET / , GET /:id , POST / , PUT /:id , DELETE /:id
function rutasCrud(ruta, c) {
  router.get(ruta, c.listar);
  router.get(`${ruta}/:id`, c.obtener);
  router.post(ruta, c.crear);
  if (c.actualizar) router.put(`${ruta}/:id`, c.actualizar);
  router.delete(`${ruta}/:id`, c.eliminar);
}

rutasCrud('/usuarios', usuarios);
rutasCrud('/categorias', categorias);
rutasCrud('/productos', productos);
rutasCrud('/pedidos', pedidos);
router.patch('/pedidos/:id/estado', pedidos.cambiarEstado);

module.exports = router;
