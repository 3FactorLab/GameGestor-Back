import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const configureSecurity = (app: Application) => {
  // Controlas desde qué dominios se puede hacer peticiones al backend

  // Autorizo desde donde suele levantar el frontend Angular
  const allowedOrigins = ["http://localhost:4200"];
  /*
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir herramientas como Postman (sin origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("No permitido por CORS"), false);
      },
      credentials: true, // si vas a usar cookies/autenticación
    })
  );*/
  //Autorizamos desde cualquier origen ------------- Solo desarrollo
  app.use(cors());

  // Añade un middleware que pone cabeceras HTTP seguras por defecto
  app.use(helmet());

  // Limita el número de peticiones por IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // límite por IP
      message: { error: "Demasiadas peticiones, inténtalo más tarde." },
      standardHeaders: true, // pone info en cabeceras RateLimit-*
      legacyHeaders: false, // desactiva X-RateLimit-*
    })
  );
};
