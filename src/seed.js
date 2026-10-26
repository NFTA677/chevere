// Borra los datos y carga datos de ejemplo: npm run seed
try { process.loadEnvFile(); } catch { /* sin .env */ }
const { mongoose, conectar } = require('./config/database');
const { Usuario, Categoria, Producto, Pedido } = require('./models');

(async () => {
  await conectar();
  await Promise.all([Usuario, Categoria, Producto, Pedido].map((M) => M.deleteMany({})));
  await Promise.all([Usuario, Categoria, Producto, Pedido].map((M) => M.init()));

  await Usuario.create([
    { nombre: 'Ana Torres', email: 'ana@correo.com', telefono: '3001112233' },
    { nombre: 'Luis Gómez', email: 'luis@correo.com', telefono: '3004445566' },
  ]);

  const [tec, hogar] = await Categoria.create([
    { nombre: 'Tecnología', descripcion: 'Computadores y accesorios' },
    { nombre: 'Hogar', descripcion: 'Artículos para la casa' },
  ]);

  await Producto.create([
    { nombre: 'Mouse inalámbrico', precio: 45000, stock: 20, categoria: tec._id },
    { nombre: 'Teclado mecánico', precio: 180000, stock: 10, categoria: tec._id },
    { nombre: 'Lámpara LED', precio: 60000, stock: 15, categoria: hogar._id },
  ]);

  console.log('Datos de ejemplo cargados');
  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect();
  process.exit(1);
});
