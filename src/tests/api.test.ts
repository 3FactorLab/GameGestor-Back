import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

// Mock de servicios para evitar usar la BD real en estos tests de humo
jest.mock("../services/user.service", () => ({
  loginUser: jest.fn().mockResolvedValue({
    _id: "user123",
    username: "aloloco",
    role: "admin",
  }),
}));

jest.mock("../services/userGame.service", () => ({
  // Simula que crear/actualizar en biblioteca con externalId funciona
  upsertUserGameByExternalId: jest.fn().mockResolvedValue({
    userId: "user123",
    gameId: "game123",
    status: "pendiente",
    favorite: true,
  }),
  // Biblioteca vacía por defecto
  getUserLibrary: jest.fn().mockResolvedValue([]),
}));

// Mock de auth: inyecta un usuario en req.user y deja pasar siempre
jest.mock("../middleware/auth.middleware", () => ({
  auth: (req: any, _res: any, next: any) => {
    req.user = { id: "user123", username: "aloloco", role: "admin" };
    next();
  },
  isAdmin: (_req: any, _res: any, next: any) => next(),
}));

// App mínima para pruebas: monta rutas de usuarios y biblioteca
const app = express();
app.use(express.json());
app.use("/usuarios", require("../routes/user.router").default);
app.use("/usuarios", require("../routes/userGame.router").default);

describe("API básica", () => {
  beforeAll(() => {
    // Secret de pruebas para firmar/verificar tokens
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  test("login devuelve token con credenciales seed", async () => {
    const res = await request(app)
      .post("/usuarios/login")
      .send({ username: "aloloco", password: "123456" })
      .expect(200);

    expect(res.body.token).toBeDefined();
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET!);
    expect((decoded as any).username).toBe("aloloco");
  });

  test("añadir a biblioteca con externalId devuelve 201", async () => {
    const token = jwt.sign(
      { id: "user123", username: "aloloco", role: "admin" },
      process.env.JWT_SECRET!
    );

    const res = await request(app)
      .post("/usuarios/me/library")
      .set("Authorization", `Bearer ${token}`)
      .send({ externalId: "3498", status: "pendiente", favorite: true })
      .expect(201);

    expect(res.body).toHaveProperty("userId", "user123");
    expect(res.body).toHaveProperty("status", "pendiente");
  });
});
