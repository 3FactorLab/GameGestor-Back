🎮 API GameGestor (Node + TypeScript + MongoDB)
===============================================

API REST para gestionar usuarios y juegos con autenticación JWT, subida de imágenes y documentación Swagger. El objetivo es que cualquier miembro del equipo (incluidos juniors) pueda levantar el proyecto y entender rápidamente cómo fluyen las peticiones.

🧭 Tabla rápida de contenidos
- [🚀 Qué hace la app y stack](#-qué-hace-la-app-y-stack)
- [📂 Estructura de carpetas](#-estructura-de-carpetas-src)
- [🛠️ Puesta en marcha local](#️-puesta-en-marcha-local)
- [📜 Scripts de npm](#-scripts-de-npm)
- [🔑 Variables de entorno](#-variables-de-entorno)
- [🧱 Modelos y validaciones](#-modelos-y-validaciones)
- [🛡️ Seguridad y middlewares](#️-seguridad-y-middlewares)
- [🌐 Endpoints principales](#-endpoints-principales-resumen)
- [🌱 Seeds y datos de ejemplo](#-seeds-y-datos-de-ejemplo)
- [📖 Documentación Swagger](#-documentación-swagger)
- [🔄 Flujo típico de una petición](#-flujo-típico-de-una-petición)
- [🧭 Notas de calidad y próximos pasos](#-notas-de-calidad-y-próximos-pasos)

🚀 Qué hace la app y stack
- API REST de usuarios y juegos con CRUD básico.
- Login con JWT y roles (user/admin) para proteger rutas y operaciones sensibles.
- Subida de imagen de perfil de usuario con Multer (se guarda en uploads/).
- Stack: Node.js, Express 5, TypeScript, MongoDB/Mongoose, bcryptjs, express-validator, Swagger.

📂 Estructura de carpetas (src/)
- config/: conexión a MongoDB y configuración de seguridad (CORS, Helmet, rate limit).
- controllers/: orquestan cada petición y devuelven la respuesta HTTP.
- routes/: define endpoints y encadena middlewares.
- services/: lógica de negocio y acceso a Mongoose.
- models/: esquemas Mongoose para User y Game.
- validators/: reglas con express-validator para sanitizar entrada.
- middleware/: auth JWT, control de rol admin y subida de archivos.
- docs/: swaggerSpec para la documentación.
- types/: tipados compartidos (incluye extensión de Express.Request con user).
- uploads/: destino de imágenes subidas (servida como estático en /uploads).

🛠️ Puesta en marcha local
1) Requisitos: Node 18+ y MongoDB accesible (local o Atlas).
2) Instalación: `npm install`
3) Variables: crear un archivo `.env` en la raíz (ver sección siguiente).
4) Desarrollo: `npm run dev` arranca con recarga (ts-node-dev) en el puerto 5000 por defecto.
5) Producción: `npm run build` compila a dist/ y `npm start` ejecuta la versión compilada.
6) Documentación: visitar `http://localhost:5000/docs` para ver Swagger UI.

📜 Scripts de npm
- `npm run dev`: ejecuta src/index.ts con ts-node-dev (respawn y watch).
- `npm run build`: compila TypeScript a JavaScript en dist/.
- `npm start`: levanta la versión compilada desde dist/index.js.
- `npm run seeds`: carga los archivos seed-*.json en Mongo (limpia e inserta).

🔑 Variables de entorno
Crea un `.env` con:
```
DB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<db>
PORT=5000
JWT_SECRET=clave_larga_y_segura
JWT_EXPIRES_IN=24h
```
- DB_URI: cadena de conexión de MongoDB.
- PORT: puerto en el que se expone la API.
- JWT_SECRET y JWT_EXPIRES_IN: firma y caducidad de los tokens.

🧱 Modelos y validaciones
- User (usuarios): nombre, apellido, email, telefono, username (único), password (hash bcrypt), role (user|admin), profilePicture (ruta relativa en uploads/). Timestamps activados.
- Game (juegos): titulo (único), genero, plataformas[], desarrollador, lanzamiento, modo[], puntuacion. Timestamps activados.
- Validaciones: `validateUser` exige username, email válido y password de mínimo 6 caracteres. `validateGame` exige titulo y comprueba puntuacion 0-100.

🛡️ Seguridad y middlewares
- Autenticación JWT (`auth`): verifica la cabecera Authorization Bearer, adjunta `req.user` y devuelve 401 si es inválido.
- Autorización de rol (`isAdmin`): bloquea acciones sensibles para usuarios sin rol admin (por ejemplo, DELETE de juegos/usuarios).
- Subida de archivos (`upload.single("profilePicture")`): guarda imágenes JPEG/PNG hasta 5 MB en uploads/.
- CORS, Helmet y Rate Limiting: definidos en `configureSecurity` (config/security.ts). Están listos para usarse; activa la llamada en src/index.ts si se despliega en un entorno público.

🌐 Endpoints principales (resumen)
- Auth
  - POST `/usuarios/login`: devuelve JWT.
  - POST `/usuarios`: registro público con validación.
- Usuarios (requieren Bearer token salvo el registro y login)
  - GET `/usuarios`: lista usuarios.
  - GET `/usuarios/:username`: detalle.
  - PUT `/usuarios/:username`: actualiza datos y opcionalmente `profilePicture` (multipart/form-data).
  - DELETE `/usuarios/:username`: solo admin.
- Juegos (requieren Bearer token; DELETE también requiere admin)
  - GET `/juegos`: lista juegos.
  - GET `/juegos/:titulo`: detalle por título.
  - POST `/juegos`: crea juego (valida título y puntuación).
  - PUT `/juegos/:titulo`: actualiza juego.
  - DELETE `/juegos/:titulo`: borra juego.
- Documentación: `/docs` (UI) y `/docs.json` (OpenAPI).
- Estáticos: `/uploads/*` sirve las imágenes subidas.

🌱 Seeds y datos de ejemplo
- Archivos `seed-users.json` y `seed-games.json` en la raíz.
- Ejecuta `npm run seeds` tras configurar `.env`: conecta a Mongo, limpia las colecciones mapeadas y las repuebla según los seeds. El mapa modelo-archivo está en `src/seed.ts` (usa el prefijo seed-*.json).

🔄 Flujo típico de una petición
1) Router: la ruta aplica middlewares (auth, validaciones, subida de archivos).
2) Controlador: maneja la petición, atrapa errores y delega.
3) Servicio: ejecuta la lógica y consulta Mongoose.
4) Mongoose/MongoDB: persiste y devuelve documentos.
5) Respuesta: el controlador serializa el resultado a JSON.
Para más detalle visual, revisa `flujos.md` y `documents/Readme&POST.md`.

🧭 Notas de calidad y próximos pasos
- Añadir tests (Jest + Supertest) para auth, validaciones y roles (actualmente solo hay un placeholder en src/tests/health.test.ts).
- Activar `configureSecurity(app)` en `src/index.ts` para entornos públicos y ajustar CORS a los orígenes del frontend.
- Sustituir logs por un logger estructurado (p.ej. Winston) y añadir manejo de errores global.
