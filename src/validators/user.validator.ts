import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateUser = [
  check("username")
    .exists()
    .withMessage("El username es obligatorio")
    .notEmpty()
    .withMessage("El username no puede estar vacío"),

  check("email")
    .exists()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  check("password")
    .exists()
    .withMessage("El password es obligatorio")
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres"),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
