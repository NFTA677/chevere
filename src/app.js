const express = require('express');
const rutas = require('./routes');
const { noEncontrado, manejarErrores } = require('./middlewares/errores');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    api: 'Tienda API - Express + Sequelize',
    endpoints: ['/api/usuarios', '/api/categorias', '/api/productos', '/api/pedidos'],
  });
});

app.use('/api', rutas);
app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
