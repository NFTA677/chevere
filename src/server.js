try { process.loadEnvFile(); } catch { /* sin .env: usa variables del sistema */ }
const app = require('./app');
const { conectar } = require('./config/database');
const models = require('./models');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await conectar();
    // Crea las colecciones e índices (email único, etc.) si no existen
    await Promise.all(Object.values(models).map((M) => M.init()));
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (err) {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  }
})();
