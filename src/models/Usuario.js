const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
  nombre:   { type: String, required: [true, 'El nombre es obligatorio'], trim: true, maxlength: 100 },
  email:    {
    type: String, required: [true, 'El email es obligatorio'], unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
  },
  telefono: { type: String, maxlength: 20 },
}, { timestamps: true, collection: 'usuarios' });

module.exports = model('Usuario', usuarioSchema);
