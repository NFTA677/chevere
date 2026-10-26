// Relaciones (ver docs/tablas-y-diagrama.md):
//   Producto.categoria -> Categoria
//   Pedido.usuario     -> Usuario
//   Pedido.detalles[].producto -> Producto
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Pedido = require('./Pedido');

module.exports = { Usuario, Categoria, Producto, Pedido };
