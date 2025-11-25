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
    },
  },
  apis: [],
});
