const { isValidObjectId, startSession } = require('mongoose');
const { Pedido, Producto, Usuario } = require('../models');
const { HttpError } = require('../middlewares/errores');

const populate = [
  { path: 'usuario', select: 'nombre email' },
  { path: 'detalles.producto', select: 'nombre' },
];

async function buscar(id, session = null) {
  const pedido = isValidObjectId(id) ? await Pedido.findById(id).session(session).populate(populate) : null;
  if (!pedido) throw new HttpError(404, `Pedido con id ${id} no existe`);
  return pedido;
}

// Ejecuta todo dentro de una transacción: si algo falla, no se guarda nada
async function enTransaccion(fn) {
  const session = await startSession();
  try {
    return await session.withTransaction(() => fn(session));
  } finally {
    await session.endSession();
  }
}

module.exports = {
  listar: async (req, res) => {
    res.json(await Pedido.find().populate(populate).sort({ fecha: -1 }));
  },

  obtener: async (req, res) => {
    res.json(await buscar(req.params.id));
  },

  // Body: { usuario: "<id>", productos: [ { producto: "<id>", cantidad: 2 } ] }
  crear: async (req, res) => {
    const { usuario, productos } = req.body || {};
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new HttpError(400, 'Debe enviar "productos" con al menos un elemento');
    }

    let pedidoId;
    await enTransaccion(async (session) => {
      if (!isValidObjectId(usuario) || !(await Usuario.exists({ _id: usuario }).session(session))) {
        throw new HttpError(400, `El usuario ${usuario} no existe`);
      }

      const detalles = [];
      for (const { producto: productoId, cantidad } of productos) {
        if (!Number.isInteger(cantidad) || cantidad < 1) {
          throw new HttpError(400, 'La cantidad debe ser un entero mayor que 0');
        }
        const producto = isValidObjectId(productoId) ? await Producto.findById(productoId).session(session) : null;
        if (!producto) throw new HttpError(400, `El producto ${productoId} no existe`);

        // Descuenta stock solo si alcanza (operación atómica)
        const ok = await Producto.updateOne(
          { _id: producto._id, stock: { $gte: cantidad } },
          { $inc: { stock: -cantidad } },
          { session },
        );
        if (ok.modifiedCount === 0) {
          throw new HttpError(409, `Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock})`);
        }

        detalles.push({
          producto: producto._id,
          nombre: producto.nombre,
          cantidad,
          precioUnitario: producto.precio,
          subtotal: +(producto.precio * cantidad).toFixed(2),
        });
      }

      const total = +detalles.reduce((s, d) => s + d.subtotal, 0).toFixed(2);
      const [pedido] = await Pedido.create([{ usuario, detalles, total }], { session });
      pedidoId = pedido.id;
    });

    res.status(201).json(await buscar(pedidoId));
  },

  // Body: { estado: "pagado" }
  cambiarEstado: async (req, res) => {
    const estado = req.body?.estado;
    if (!Pedido.ESTADOS.includes(estado)) {
      throw new HttpError(400, `Estado inválido. Valores permitidos: ${Pedido.ESTADOS.join(', ')}`);
    }

    await enTransaccion(async (session) => {
      const pedido = await buscar(req.params.id, session);
      if (pedido.estado === 'cancelado') throw new HttpError(409, 'El pedido ya está cancelado');

      // Al cancelar se devuelve el stock
      if (estado === 'cancelado') {
        for (const d of pedido.detalles) {
          await Producto.updateOne({ _id: d.producto._id ?? d.producto }, { $inc: { stock: d.cantidad } }, { session });
        }
      }
      pedido.estado = estado;
      await pedido.save({ session });
    });

    res.json(await buscar(req.params.id));
  },

  eliminar: async (req, res) => {
    const pedido = await buscar(req.params.id);
    await pedido.deleteOne();
    res.status(204).end();
  },
};
