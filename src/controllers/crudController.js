const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../middlewares/errores');

// Genera las 5 operaciones CRUD para cualquier modelo de Mongoose
// - campos: los únicos campos que se aceptan del body
// - populate: relaciones a incluir en la respuesta
// - antesDeGuardar / antesDeEliminar: validaciones extra opcionales
function crearCrud(Modelo, { campos, populate = '', orden = { _id: 1 }, antesDeGuardar, antesDeEliminar }) {
  const filtrar = (body = {}) => Object.fromEntries(Object.entries(body).filter(([k]) => campos.includes(k)));

  const buscar = async (id) => {
    const doc = isValidObjectId(id) ? await Modelo.findById(id).populate(populate) : null;
    if (!doc) throw new HttpError(404, `${Modelo.modelName} con id ${id} no existe`);
    return doc;
  };

  return {
    buscar,
    listar: async (req, res) => {
      res.json(await Modelo.find().populate(populate).sort(orden));
    },
    obtener: async (req, res) => {
      res.json(await buscar(req.params.id));
    },
    crear: async (req, res) => {
      const datos = filtrar(req.body);
      if (antesDeGuardar) await antesDeGuardar(datos);
      const nuevo = await Modelo.create(datos);
      res.status(201).json(await buscar(nuevo.id));
    },
    actualizar: async (req, res) => {
      const doc = await buscar(req.params.id);
      const datos = filtrar(req.body);
      if (antesDeGuardar) await antesDeGuardar(datos);
      doc.set(datos);
      await doc.save();
      res.json(await buscar(doc.id));
    },
    eliminar: async (req, res) => {
      const doc = await buscar(req.params.id);
      if (antesDeEliminar) await antesDeEliminar(doc);
      await doc.deleteOne();
      res.status(204).end();
    },
  };
}

module.exports = crearCrud;
