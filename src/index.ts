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

//Definimos lo sestándares de seguridad: helmet -> cors -> express-rate-limit
//configureSecurity(app);

//Documentación conSwagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

// Rutas
app.use("/usuarios", userRoutes);
app.use("/usuarios", userGameRoutes);
app.use("/juegos", gameRoutes);

// Servir archivos estáticos
// Permite acceder a las imágenes subidas desde el navegador (ej: localhost:5000/uploads/foto.jpg)
app.use("/uploads", express.static("uploads"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API GameGestor TypeScript 🚀" });
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Servidor en http://localhost:${port}`);
  });
};

startServer();
