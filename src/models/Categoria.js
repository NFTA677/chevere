const { Schema, model } = require('mongoose');

const categoriaSchema = new Schema({
  nombre:      { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true, maxlength: 80 },
  descripcion: { type: String },
}, { timestamps: true, collection: 'categorias' });

module.exports = model('Categoria', categoriaSchema);
