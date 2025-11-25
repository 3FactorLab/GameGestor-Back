# Diagrama de Flujo: Petición **POST** para crear un usuario (Express + TypeScript + Mongoose + MongoDB)

Este documento describe paso a paso qué ocurre desde que Postman envía una petición **POST** hasta que se crea un usuario en la base de datos y se devuelve la respuesta.

---

## 📤 1. Postman envía la petición

**Ejemplo:**

``` typescript
POST http://localhost:3002/usuarios
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "username": "juanito",
  "nombre": "Juan",
  "email": "juan@gmail.com"
}
```

---

## 🛣️ 2. Express recibe la petición en `src/index.ts`

```ts
app.use("/usuarios", userRoutes);
```

- Express detecta que la ruta empieza por `/usuarios`.
- Redirige la petición a `src/routes/user.routes.ts`.

---

## 🔀 3. El router detecta el endpoint `POST /usuarios`

En `src/routes/user.routes.ts`:

```ts
router.post("/", async (req, res) => {
  const nuevo = await createUser(req.body);
  res.status(201).json(nuevo);
});
```

Acciones:

- `req.body` contiene los datos enviados desde Postman.
- Se llama a la función de servicio:  
  **`createUser(req.body)`**

---

## 🧩 4. El router delega la lógica al SERVICE

En `src/services/user.service.ts`:

```ts
export const createUser = (data: any) => User.create(data);
```

El service:

- Llama a **`User.create()`** de Mongoose.
- Pasa los datos del usuario a la base de datos.

---

## ⚙️ 5. Mongoose procesa la operación

Mongoose realiza:

- Validación del schema (definido en `src/models/user.model.ts`).
- Comprobación del campo `username` (único).
- Preparación del documento.
- Envío de la operación `insertOne` a MongoDB.

---

## 🗄️ 6. MongoDB escribe el documento

MongoDB:

- Genera un `_id`.
- Inserta el documento en la colección `usuarios`.
- Devuelve el usuario creado a Mongoose.

Ejemplo:

```json
{
  "_id": "671b1dxxx",
  "username": "juanito",
  "nombre": "Juan",
  "email": "juan@gmail.com",
  "__v": 0
}
```

---

## 🔁 7. Mongoose entrega el resultado al service

`User.create()` → devuelve el nuevo usuario ya guardado.

---

## 📦 8. El service devuelve el resultado al router

`createUser()` devuelve el usuario creado.

---

## 📤 9. El router envía la respuesta final a Express/Postman

```ts
res.status(201).json(nuevo);
```

Express convierte el objeto a JSON y lo envía como respuesta HTTP.

---

## 📥 10. Postman recibe el resultado

```json
{
  "_id": "671b1dxxx",
  "username": "juanito",
  "nombre": "Juan",
  "email": "juan@gmail.com"
}
```

---

# 🧭 Diagrama Visual Resumido

```
Postman
   ↓ POST /usuarios
Express (src/index.ts)
   ↓ ruta /usuarios
Router (src/routes/user.routes.ts)
   ↓ createUser(req.body)
Service (src/services/user.service.ts)
   ↓ User.create()
Mongoose
   ↓ INSERT
MongoDB
   ↑ documento creado
Mongoose
   ↑ objeto creado
Service
   ↑ resultado
Router
   ↑ res.json(...)
Express
   ↑ respuesta HTTP
Postman
```
          ┌─────────────────────────────┐
          │         src/index.ts        │
          │-----------------------------│
          │ await connectDB();          │
          │ app.use("/usuarios", ... )  │
          └──────────────┬──────────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │         src/config/db.ts         │
        │----------------------------------│
        │ mongoose.connect(dbUrl)          │
        │   │                              │
        │   ▼                              │
        │  🔌 CREA UNA CONEXIÓN GLOBAL     │
        │     dentro de Mongoose           │
        └──────────────────┬───────────────┘
                           │
                           ▼
      ┌────────────────────────────────────────┐
      │        src/models/user.model.ts        │
      │--------------------------------------- │
      │ const userSchema = new Schema(...)     │
      │ export const User = model("User", ...) │
      └───────────────┬────────────────────────┘
                      │
                      ▼
        ◤ TODOS LOS MODELOS USAN LA MISMA ◥
        ◣ CONEXIÓN CREADA EN db.ts        ◢

                      │
                      ▼

       ┌──────────────────────────────────────┐
       │      src/services/user.service.ts    │
       │--------------------------------------│
       │ User.find()                          │
       │ User.findOne()                       │
       │ User.create()                        │
       │ User.update()                        │
       │ User.delete()                        │
       └──────────────────┬───────────────────┘
                          │
                          ▼
              🔽 OPERACIONES EN MONGO 🔽

┌──────────────────────────────────────────────────────┐
│                     MongoDB                           │
│-------------------------------------------------------│
│   almacena documentos                                 │
│   colecciones (usuarios, etc.)                        │
│   guarda, busca, actualiza, elimina                   │
└──────────────────────────────────────────────────────┘

---

# 🎮 Flujo: Petición **POST** para crear un juego (Con Controlador)

Este flujo es similar al de usuarios, pero incluye una capa adicional explícita: el **Controlador**.

## 1. Postman envía la petición

```
POST http://localhost:3002/juegos
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "titulo": "Super Mario Bros",
  "genero": "Plataformas",
  "plataformas": ["NES"],
  "desarrollador": "Nintendo",
  "lanzamiento": "1985",
  "puntuacion": 10
}
```

---

## 2. Express recibe la petición

En `src/index.ts`:
```ts
app.use("/juegos", gameRoutes);
```

---

## 3. El Router detecta el endpoint

En `src/routes/game.routes.ts`:

```ts
router.post("/", createGameController);
```

Aquí la diferencia principal: **El router llama al CONTROLLER**, no directamente al servicio.

---

## 4. El Controlador procesa la petición

En `src/controllers/game.controller.ts`:

```ts
export const createGameController = async (req: Request, res: Response) => {
  try {
    const nuevo = await createGame(req.body); // Llama al servicio
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: ... });
  }
};
```

El controlador se encarga de:
- Recibir `req` y `res` (Tipados con TypeScript).
- Manejar errores (try/catch).
- Responder al cliente (`res.json`).

---

## 5. El Servicio interactúa con Mongoose

En `src/services/game.service.ts`:

```ts
export const createGame = (data: any) => Game.create(data);
```

---

## 6. Mongoose y MongoDB

Igual que en el flujo de usuarios, Mongoose valida el esquema (`src/models/game.model.ts`) y guarda en MongoDB.

---

## 🧭 Diagrama Visual (Juegos)

```
Postman
   ↓ POST /juegos
Express
   ↓
Router (src/routes/game.routes.ts)
   ↓ createGameController
Controlador (src/controllers/game.controller.ts) 👈 CAPA EXTRA
   ↓ createGame(data)
Service (src/services/game.service.ts)
   ↓ Game.create()
Mongoose/MongoDB
```

---

# 🔐 Autenticación y Seguridad

Hemos implementado un sistema completo de seguridad. Aquí te explico cómo funciona cada pieza.

## 1. Encriptación de Contraseñas (Bcrypt)

Nunca guardamos contraseñas reales.
- **Al crear usuario:** El servicio usa `bcrypt.hash(password, 10)` para convertir "123" en `$2a$10$Kj8...`.
- **Al hacer login:** Usamos `bcrypt.compare()` para verificar si la contraseña coincide con el hash guardado.

## 2. Login y Tokens (JWT)

Para acceder a la API, primero necesitas un "pase VIP" (Token).

### **Paso 1: Login**
Envía tus credenciales:

```
POST /usuarios/login
{
  "username": "tu_usuario",
  "password": "tu_password"
}
```

Si son correctas, recibirás:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Paso 2: Usar el Token**
Para cualquier otra petición (ej: `GET /juegos`), debes poner el token en la cabecera:

- **Key:** `Authorization`
- **Value:** `Bearer TU_TOKEN_AQUI`

## 3. Middleware de Protección (`src/middleware/auth.middleware.ts`)

Es el "portero" de la API. Se coloca en las rutas privadas:

```ts
router.get("/", auth, getAllGamesController);
```

1.  Busca la cabecera `Authorization`.
2.  Verifica que el token sea válido y no haya caducado (usando `jwt.verify`).
3.  Si todo está bien, deja pasar (`next()`). Si no, devuelve error 401.

---

# 🛡️ Validación de Datos

Para evitar que entren datos "basura", usamos `express-validator`.

## Ejemplo: Crear Usuario

Antes de llegar al controlador, los datos pasan por `validateUser`:

```ts
router.post("/", validateUser, createUserController);
```

Reglas actuales:
- **username:** Obligatorio y no vacío.
- **email:** Debe ser un formato de email válido.
- **password:** Mínimo 6 caracteres.

Si envías datos incorrectos, recibirás un error 400 con los detalles:

```json
{
  "errors": [
    {
      "msg": "El password debe tener al menos 6 caracteres",
      "path": "password",
      ...
    }
  ]
}
```

---

# 📜 Scripts del Proyecto

Este proyecto usa **TypeScript**, por lo que los comandos son un poco diferentes a un proyecto de Node.js puro.

### 🛠️ Desarrollo
Para levantar el servidor en modo desarrollo (con recarga automática):
```bash
npm run dev
```
*Usa `ts-node-dev` para ejecutar los archivos .ts directamente.*

### 🏗️ Producción
Para compilar el código TypeScript a JavaScript (carpeta `dist/`):
```bash
npm run build
```

Para ejecutar el código compilado:
```bash
npm start
```

### 🌱 Semillas (Seeds)
Para rellenar la base de datos con datos de prueba:
```bash
npm run seeds
```

---

# 🚀 Mejoras Futuras

Esta sección documenta posibles mejoras para implementar en el futuro.

## 🔥 Prioridad Alta

### 1. Paginación
Implementar paginación en los endpoints de listado para mejorar el rendimiento con grandes volúmenes de datos.

**Ejemplo:**
```
GET /juegos?page=1&limit=20
GET /usuarios?page=2&limit=10
```

**Beneficios:**
- Mejor rendimiento
- Reducción de carga en el servidor
- Mejor experiencia de usuario

---

### 2. Búsqueda y Filtros
Permitir búsquedas y filtros avanzados en los juegos.

**Ejemplos:**
```
GET /juegos?genero=RPG
GET /juegos?plataforma=PC&puntuacion=90
GET /juegos?search=zelda
```

**Beneficios:**
- Funcionalidad esencial para el usuario
- Facilita encontrar juegos específicos

---

### 3. Relaciones Usuario-Juego (Biblioteca Personal)
Crear un sistema de biblioteca personal donde los usuarios puedan:
- Marcar juegos como favoritos
- Establecer estados: "Jugando", "Completado", "Pendiente"
- Añadir notas personales

**Endpoints propuestos:**
```
POST /usuarios/me/biblioteca
GET /usuarios/me/biblioteca
PUT /usuarios/me/biblioteca/:juegoId
DELETE /usuarios/me/biblioteca/:juegoId
```

**Beneficios:**
- Funcionalidad core de un gestor de juegos
- Mayor engagement del usuario

---

## 🛡️ Seguridad y Robustez

### 4. Rate Limiting
Implementar límites de peticiones para prevenir abusos y ataques DDoS.

**Librería:** `express-rate-limit`

**Configuración sugerida:**
- 100 peticiones por IP cada 15 minutos
- Límites más estrictos para endpoints sensibles (login, registro)

**Beneficios:**
- Protección contra ataques
- Prevención de spam

---

### 5. CORS Configurado
Configurar CORS para permitir peticiones desde el frontend.

**Librería:** `cors`

```ts
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true 
}));
```

**Beneficios:**
- Preparación para frontend
- Control de orígenes permitidos

---

### 6. Helmet.js
Añadir headers de seguridad HTTP automáticamente.

**Librería:** `helmet`

**Beneficios:**
- Protección contra XSS
- Protección contra clickjacking
- Headers de seguridad estándar

---

## 🔄 Mejoras de Autenticación

### 7. Refresh Tokens
Implementar tokens de refresco para mejorar la experiencia de usuario.

**Flujo:**
1. Login devuelve `accessToken` (corta duración) + `refreshToken` (larga duración)
2. Cuando el accessToken expira, usar refreshToken para obtener uno nuevo
3. No es necesario volver a hacer login

**Beneficios:**
- Mejor UX (no desconectar cada 2 horas)
- Más seguro que tokens de larga duración

---

### 8. Recuperación de Contraseña
Implementar flujo de "Olvidé mi contraseña".

**Flujo:**
1. Usuario solicita reset
2. Se envía email con token temporal
3. Usuario usa token para establecer nueva contraseña

**Requiere:**
- Servicio de email (Nodemailer, SendGrid)
- Tokens temporales en BD

---

## 📊 Mejoras de Datos

### 9. Timestamps Automáticos
Añadir `createdAt` y `updatedAt` a todos los modelos.

```ts
{ timestamps: true }
```

**Beneficios:**
- Auditoría
- Ordenar por fecha de creación

---

### 10. Soft Delete
Implementar borrado lógico en lugar de físico.

**Concepto:**
- Añadir campo `deletedAt`
- No borrar registros, solo marcarlos como eliminados
- Filtrar registros eliminados en las consultas

**Beneficios:**
- Recuperación de datos
- Auditoría completa

---

## 🧪 Testing y Calidad

### 11. Tests Automatizados
Implementar tests unitarios e integración.

**Librería:** Jest o Mocha

**Ejemplos de tests:**
- ¿Devuelve 403 si un user intenta borrar un juego?
- ¿El login devuelve un token válido?
- ¿La validación rechaza emails inválidos?

**Beneficios:**
- Confianza en los cambios
- Prevención de regresiones

---

### 12. Logging Profesional
Sustituir `console.log` por un sistema de logging estructurado.

**Librerías:** Winston o Pino

**Beneficios:**
- Logs estructurados
- Niveles de log (info, warn, error)
- Rotación de archivos

---

## 🚀 Funcionalidades Avanzadas

### 13. Subida de Imágenes
Permitir que los juegos tengan portadas.

**Servicios:** Cloudinary, AWS S3

**Beneficios:**
- Mejor presentación visual
- Gestión de assets

---

### 14. Notificaciones por Email
Enviar emails en eventos importantes.

**Ejemplos:**
- Email de bienvenida al registrarse
- Notificación cuando un admin elimina tu juego favorito

**Servicios:** Nodemailer, SendGrid

---

### 15. WebSockets
Implementar comunicación en tiempo real.

**Casos de uso:**
- Notificaciones en vivo
- Chat entre usuarios
- Actualizaciones de estado

**Librería:** Socket.io

---

### 16. Exportar/Importar Biblioteca
Permitir a los usuarios exportar su biblioteca en JSON/CSV.

**Beneficios:**
- Portabilidad de datos
- Backup personal

---

## 📈 Analíticas

### 17. Estadísticas de Uso
Implementar métricas y estadísticas.

**Ejemplos:**
- Juegos más populares
- Géneros más jugados
- Usuarios más activos

**Beneficios:**
- Insights de negocio
- Mejora de producto

---

# 1. 🛡️ Seguridad (Prioridad Alta)
Actualmente tu API es funcional pero vulnerable a ataques comunes.

Helmet: Protege contra vulnerabilidades conocidas de cabeceras HTTP.
CORS: Controla quién puede consumir tu API (ahora mismo cualquiera o nadie dependiendo del entorno).
Rate Limiting: Evita ataques de fuerza bruta o DDoS limitando el número de peticiones por IP.
Sanitización: Limpiar los datos de entrada para evitar inyecciones NoSQL/XSS.
2. 🧪 Testing (Calidad)
No veo librerías de test en tu 
package.json
.

Jest + Supertest: Para crear tests unitarios y de integración. Es vital para asegurar que "lo que funcionaba ayer, siga funcionando hoy" tras tus cambios.
3. 🚨 Manejo de Errores Global
Ahora mismo usas try/catch en cada controlador repetitivamente.

Global Error Handler: Un middleware único que capture todos los errores. Esto limpia tu código (menos try/catch) y estandariza las respuestas de error (siempre devolver el mismo formato JSON).
4. 📝 Logs y Monitorización
Usas console.log, que no es ideal para producción.

Morgan: Para ver en consola qué peticiones llegan (método, url, status, tiempo).
Winston: Para guardar logs en archivos (errores, info) y tener un historial si algo falla.
5. 🧹 Calidad de Código (DX)
ESLint + Prettier: Para forzar un estilo de código consistente y evitar errores tontos automáticamente.
Husky: Para ejecutar validaciones antes de cada commit (evita subir código roto).