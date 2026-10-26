const { Error: MongooseError } = require('mongoose');

// Error con código HTTP
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function noEncontrado(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function manejarErrores(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Registro duplicado', detalles: Object.keys(err.keyValue || {}) });
  }
  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: Object.values(err.errors).map((e) => e.message) });
  }
  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({ error: `Valor inválido para "${err.path}"` });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : err.message });
}

module.exports = { HttpError, noEncontrado, manejarErrores };
