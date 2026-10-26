const mongoose = require('mongoose');

// En las respuestas JSON: "id" en vez de "_id" y sin "__v"
mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id; },
});

async function conectar(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('Falta MONGODB_URI en el archivo .env');
  await mongoose.connect(uri);
  console.log(`MongoDB conectado: ${mongoose.connection.host} / ${mongoose.connection.name}`);
}

module.exports = { mongoose, conectar };
