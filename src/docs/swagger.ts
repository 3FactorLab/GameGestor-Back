import swaggerJSDoc from "swagger-jsdoc";

//http://localhost:5000/docs
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API GameGestor",
      version: "1.0.0",
      description: "Endpoints de usuarios y juegos con JWT",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string", format: "password" },
          },
          example: {
            username: "aloloco",
            password: "123456",
          },
        },
        LoginResponse: {
          type: "object",
          properties: { token: { type: "string" } },
        },
        User: {
          type: "object",
          required: ["username", "password"],
          properties: {
            _id: { type: "string" },
            nombre: { type: "string" },
            apellido: { type: "string" },
            email: { type: "string", format: "email" },
            telefono: { type: "string" },
            username: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
          },
          example: {
            username: "aloloco",
            password: "123456",
            email: "alonso@admin.com",
            nombre: "Alonso",
            apellido: "Viñe",
            telefono: "666777888",
            role: "admin",
          },
        },
        Game: {
          type: "object",
          required: ["titulo"],
          properties: {
            _id: { type: "string" },
            titulo: { type: "string" },
            genero: { type: "string" },
            plataformas: { type: "array", items: { type: "string" } },
            desarrollador: { type: "string" },
            lanzamiento: { type: "string" },
            modo: { type: "array", items: { type: "string" } },
            puntuacion: { type: "number" },
            coverUrl: { type: "string" },
          },
          example: {
            titulo: "The Witcher 3: Wild Hunt",
            genero: "RPG",
            plataformas: ["PC", "PS4", "Xbox One", "Nintendo Switch"],
            desarrollador: "CD Projekt Red",
            lanzamiento: "2015",
            modo: ["Un jugador"],
            puntuacion: 93,
            coverUrl: "https://example.com/witcher3.jpg",
          },
        },
        UserGame: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            gameId: { type: "string" },
            status: {
              type: "string",
              enum: [
                "pendiente",
                "jugando",
                "pausado",
                "completado",
                "abandonado",
              ],
            },
            score: { type: "number", minimum: 0, maximum: 100 },
            notes: { type: "string", maxLength: 1000 },
            favorite: { type: "boolean" },
            hoursPlayed: { type: "number", minimum: 0 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          example: {
            userId: "60f1c2a3b4c5d6e7f8a9b0c1",
            gameId: "60f1c2a3b4c5d6e7f8a9b0c2",
            status: "jugando",
            score: 95,
            notes: "Rejugando con todos los DLC",
            favorite: true,
            hoursPlayed: 120,
          },
        },
        UserGameCreateRequest: {
          type: "object",
          required: ["gameId"],
          properties: {
            gameId: { type: "string" },
            status: {
              type: "string",
              enum: [
                "pendiente",
                "jugando",
                "pausado",
                "completado",
                "abandonado",
              ],
            },
            score: { type: "number", minimum: 0, maximum: 100 },
            notes: { type: "string", maxLength: 1000 },
            favorite: { type: "boolean" },
            hoursPlayed: { type: "number", minimum: 0 },
          },
          example: {
            gameId: "60f1c2a3b4c5d6e7f8a9b0c2",
            status: "pendiente",
            favorite: true,
          },
        },
        UserGameUpdateRequest: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "pendiente",
                "jugando",
                "pausado",
                "completado",
                "abandonado",
              ],
            },
            score: { type: "number", minimum: 0, maximum: 100 },
            notes: { type: "string", maxLength: 1000 },
            favorite: { type: "boolean" },
            hoursPlayed: { type: "number", minimum: 0 },
          },
          example: {
            status: "completado",
            score: 98,
            notes: "Finalizado con final Frenzy",
            favorite: true,
            hoursPlayed: 180,
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/usuarios/login": {
        post: {
          tags: ["Usuarios"],
          summary: "Login y obtén token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            "401": { description: "Credenciales inválidas" },
          },
        },
      },
      "/usuarios": {
        post: {
          tags: ["Usuarios"],
          summary: "Crear usuario",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
                example: {
                  username: "nuevoUser",
                  password: "123456",
                  email: "nuevo@example.com",
                  nombre: "Nuevo",
                  apellido: "Usuario",
                  telefono: "600000000",
                  role: "user",
                },
              },
            },
          },
          responses: { "201": { description: "Creado" } },
        },
        get: {
          tags: ["Usuarios"],
          summary: "Listar usuarios",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
      "/usuarios/{username}": {
        get: {
          tags: ["Usuarios"],
          summary: "Obtener usuario",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "username",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "404": { description: "No encontrado" },
          },
        },
        put: {
          tags: ["Usuarios"],
          summary: "Actualizar usuario",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "username",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          responses: {
            "200": { description: "Actualizado" },
            "404": { description: "No encontrado" },
          },
        },
        delete: {
          tags: ["Usuarios"],
          summary: "Eliminar usuario (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "username",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Eliminado" },
            "404": { description: "No encontrado" },
          },
        },
      },
      "/usuarios/me/library": {
        get: {
          tags: ["Biblioteca"],
          summary: "Listar biblioteca personal",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UserGame" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Biblioteca"],
          summary: "Añadir o actualizar un juego en la biblioteca",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  allOf: [{ $ref: "#/components/schemas/UserGameCreateRequest" }],
                  description:
                    "Envia gameId (ObjectId ya existente) o externalId (RAWG); al menos uno es obligatorio",
                },
                example: {
                  externalId: "3498",
                  status: "pendiente",
                  favorite: true,
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Creado/Actualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserGame" },
                },
              },
            },
            "404": { description: "Juego no existe" },
          },
        },
      },
      "/usuarios/me/library/{gameId}": {
        put: {
          tags: ["Biblioteca"],
          summary: "Actualizar datos de un juego en la biblioteca",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "gameId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserGameUpdateRequest" },
                example: {
                  status: "completado",
                  score: 90,
                  favorite: true,
                },
              },
            },
          },
          responses: {
            "200": { description: "Actualizado" },
            "404": { description: "No encontrado" },
          },
        },
        delete: {
          tags: ["Biblioteca"],
          summary: "Eliminar un juego de la biblioteca",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "gameId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Eliminado" },
            "404": { description: "No encontrado" },
          },
        },
      },
      "/juegos": {
        post: {
          tags: ["Juegos"],
          summary: "Crear juego",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Game" },
                example: {
                  titulo: "Demo Game",
                  genero: "Acción",
                  plataformas: ["PC", "PS5"],
                  desarrollador: "Demo Studio",
                  lanzamiento: "2024",
                  modo: ["Un jugador"],
                  puntuacion: 85,
                  coverUrl: "https://example.com/demo.jpg",
                },
              },
            },
          },
          responses: { "201": { description: "Creado" } },
        },
        get: {
          tags: ["Juegos"],
          summary: "Listar juegos",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Game" },
                  },
                },
              },
            },
          },
        },
      },
      "/juegos/{titulo}": {
        get: {
          tags: ["Juegos"],
          summary: "Obtener juego",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "titulo",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "OK" },
            "404": { description: "No encontrado" },
          },
        },
        put: {
          tags: ["Juegos"],
          summary: "Actualizar juego",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "titulo",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Game" },
              },
            },
          },
          responses: {
            "200": { description: "Actualizado" },
            "404": { description: "No encontrado" },
          },
        },
        delete: {
          tags: ["Juegos"],
          summary: "Eliminar juego (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "titulo",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Eliminado" },
            "404": { description: "No encontrado" },
          },
        },
      },
      "/juegos/external/{externalId}": {
        post: {
          tags: ["Juegos"],
          summary: "Crear u obtener juego desde RAWG por externalId",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "externalId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "201": {
              description: "Creado/Obtenido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Game" },
                },
              },
            },
            "500": { description: "Error al consultar la API externa" },
          },
        },
      },
    },
  },
  apis: [],
});
