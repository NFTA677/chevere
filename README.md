# Tienda API – Express + MongoDB Atlas

API REST de una tienda en línea hecha con **Node.js (JavaScript)**, el framework **Express** y **Mongoose** (ODM, el "ORM" de MongoDB) conectada a **MongoDB Atlas**.

## Cómo ejecutarlo

1. Crear el archivo `.env` en la raíz (ya existe en este equipo):
   ```env
   MONGODB_URI="mongodb+srv://USUARIO:CLAVE@cluster0.mn1sdvd.mongodb.net/tienda?retryWrites=true&w=majority&appName=Cluster0"
   PORT=3000
   ```
   > El `.env` tiene la contraseña: **no subirlo a GitHub** (ya está en `.gitignore`).
2. Comandos:
   ```bash
   npm install        # instala dependencias
   npm run seed       # borra y carga datos de ejemplo en Atlas
   npm start          # inicia en http://localhost:3000
   npm run dev        # igual, pero se reinicia al guardar cambios
   ```

Si sale un error de conexión, revisa en Atlas → **Network Access** que tu IP actual esté permitida.

## Estructura (patrón MVC)

```
src/
├── config/database.js       # conexión a MongoDB Atlas con Mongoose
├── models/                  # Modelos (un esquema = una colección)
│   ├── Usuario.js
│   ├── Categoria.js
│   ├── Producto.js
│   ├── Pedido.js            # incluye los detalles embebidos
│   └── index.js
├── controllers/             # lógica de cada recurso
├── routes/index.js          # endpoints de Express
├── middlewares/errores.js   # manejo central de errores
├── app.js                   # configuración de Express
├── server.js                # arranque del servidor
└── seed.js                  # datos de ejemplo
docs/
└── tablas-y-diagrama.md     # colecciones ordenadas + diagrama entidad-relación
postman/
└── tienda-api.postman_collection.json
```

## Endpoints

Base: `http://localhost:3000/api`

| Método | Ruta                    | Descripción                          |
|--------|-------------------------|--------------------------------------|
| GET    | /usuarios               | Listar usuarios                      |
| GET    | /usuarios/:id           | Obtener un usuario                   |
| POST   | /usuarios               | Crear usuario                        |
| PUT    | /usuarios/:id           | Actualizar usuario                   |
| DELETE | /usuarios/:id           | Eliminar usuario                     |
| GET/POST/PUT/DELETE | /categorias[/:id] | CRUD de categorías            |
| GET/POST/PUT/DELETE | /productos[/:id]  | CRUD de productos (incluye categoría) |
| GET    | /pedidos                | Listar pedidos con detalles          |
| GET    | /pedidos/:id            | Obtener pedido                       |
| POST   | /pedidos                | Crear pedido (descuenta stock)       |
| PATCH  | /pedidos/:id/estado     | Cambiar estado (cancelar devuelve stock) |
| DELETE | /pedidos/:id            | Eliminar pedido                      |

Los ids son de MongoDB (texto de 24 caracteres). Ejemplos de body:

```json
POST /api/productos
{ "nombre": "Audífonos", "precio": 95000, "stock": 8, "categoria": "<id de categoría>" }

POST /api/pedidos
{
  "usuario": "<id de usuario>",
  "productos": [
    { "producto": "<id de producto>", "cantidad": 2 }
  ]
}
```

### Códigos de respuesta

| Código | Significado                                   |
|--------|-----------------------------------------------|
| 200    | OK                                            |
| 201    | Creado                                        |
| 204    | Eliminado (sin contenido)                     |
| 400    | Datos inválidos                               |
| 404    | No encontrado                                 |
| 409    | Conflicto (duplicado, sin stock, en uso)      |
| 500    | Error interno                                 |

## Pruebas con Postman

1. Ejecutar `npm run seed` y `npm start`.
2. En Postman: **Import** → `postman/tienda-api.postman_collection.json`.
3. Clic derecho en la colección → **Run collection** → **Run**.

La colección tiene 33 peticiones con 45 pruebas automáticas (CRUD completo, validaciones, stock, estados y errores). Las peticiones guardan los ids que crean, así que deben correrse en orden.

## Base de datos

Ver [docs/tablas-y-diagrama.md](docs/tablas-y-diagrama.md) para las colecciones ordenadas, las relaciones y el diagrama entidad-relación.
