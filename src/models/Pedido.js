const { Schema, model } = require('mongoose');

// Detalle del pedido: va embebido dentro de cada pedido (estilo MongoDB)
const detalleSchema = new Schema({
  producto:       { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  nombre:         { type: String, required: true }, // nombre al momento de comprar
  cantidad:       { type: Number, required: true, min: 1 },
  precioUnitario: { type: Number, required: true },
  subtotal:       { type: Number, required: true },
}, { _id: false });

const pedidoSchema = new Schema({
  usuario:  { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha:    { type: Date, default: Date.now },
  estado:   { type: String, enum: ['pendiente', 'pagado', 'enviado', 'cancelado'], default: 'pendiente' },
  detalles: { type: [detalleSchema], validate: [(v) => v.length > 0, 'El pedido debe tener productos'] },
  total:    { type: Number, required: true, default: 0 },
}, { timestamps: true, collection: 'pedidos' });

pedidoSchema.statics.ESTADOS = ['pendiente', 'pagado', 'enviado', 'cancelado'];

module.exports = model('Pedido', pedidoSchema);
