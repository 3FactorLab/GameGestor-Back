import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interfaz para el usuario decodificado
interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Middleware de autenticación
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const cabecera = req.headers["authorization"];

  if (!cabecera) {
    res.status(401).json({ message: "Falta la cabecera de autorización" });
    return;
  }

  const token = cabecera.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Usamos type assertion para añadir user a req
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Middleware para verificar rol de admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user as JwtPayload | undefined;

  if (user?.role !== "admin") {
    res.status(403).json({ message: "Acceso denegado: Requiere ser Admin" });
    return;
  }
  next();
};
