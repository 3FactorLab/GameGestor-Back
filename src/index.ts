import express, { Application } from "express";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.router";
import gameRoutes from "./routes/game.router";
import userGameRoutes from "./routes/userGame.router";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { configureSecurity } from "./config/security";

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Seguridad base: helmet -> cors -> rate limit
configureSecurity(app);

// Documentación Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

// Rutas
app.use("/usuarios", userRoutes);
app.use("/usuarios", userGameRoutes);
app.use("/juegos", gameRoutes);

// Estáticos (uploads)
app.use("/uploads", express.static("uploads"));

// Ruta de prueba
app.get("/", (_req, res) => {
  res.json({ message: "API GameGestor TypeScript OK" });
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
    console.log(`Swagger en http://localhost:${port}/docs`);
  });
};

startServer();
