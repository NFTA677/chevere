const { Schema, model } = require('mongoose');

const productoSchema = new Schema({
  nombre:    { type: String, required: [true, 'El nombre es obligatorio'], trim: true, maxlength: 120 },
  precio:    { type: Number, required: [true, 'El precio es obligatorio'], min: [0, 'El precio no puede ser negativo'] },
  stock:     { type: Number, required: true, default: 0, min: [0, 'El stock no puede ser negativo'] },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'La categoría es obligatoria'] },
}, { timestamps: true, collection: 'productos' });

module.exports = model('Producto', productoSchema);
