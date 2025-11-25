import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateGame = [
  check("titulo")
    .exists()
    .withMessage("El título es obligatorio")
    .notEmpty()
    .withMessage("El título no puede estar vacío"),

  check("genero").optional().isString().withMessage("El género debe ser texto"),

  check("puntuacion")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("La puntuación debe ser entre 0 y 100"),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
