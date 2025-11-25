import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const statusEnum = ["pendiente", "jugando", "pausado", "completado", "abandonado"];

export const validateUserGameCreate = [
  check("gameId")
    .optional()
    .isMongoId()
    .withMessage("gameId debe ser un ObjectId válido"),
  check("externalId")
    .optional()
    .isString()
    .withMessage("externalId debe ser texto"),
  check("status")
    .optional()
    .isIn(statusEnum)
    .withMessage(`status debe ser uno de: ${statusEnum.join(", ")}`),
  check("score").optional().isFloat({ min: 0, max: 100 }),
  check("notes").optional().isLength({ max: 1000 }),
  check("favorite").optional().isBoolean(),
  check("hoursPlayed").optional().isFloat({ min: 0 }),
  (req: Request, res: Response, next: NextFunction): void => {
    const result = validationResult(req);
    const customErrors: any[] = [];

    if (!req.body.gameId && !req.body.externalId) {
      customErrors.push({
        type: "field",
        value: undefined,
        msg: "Debes enviar gameId o externalId",
        path: "gameId|externalId",
        location: "body",
      });
    }

    const allErrors = [...result.array(), ...customErrors];

    if (allErrors.length > 0) {
      res.status(400).json({ errors: allErrors });
      return;
    }
    next();
  },
];

export const validateUserGameUpdate = [
  check("status")
    .optional()
    .isIn(statusEnum)
    .withMessage(`status debe ser uno de: ${statusEnum.join(", ")}`),
  check("score").optional().isFloat({ min: 0, max: 100 }),
  check("notes").optional().isLength({ max: 1000 }),
  check("favorite").optional().isBoolean(),
  check("hoursPlayed").optional().isFloat({ min: 0 }),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
