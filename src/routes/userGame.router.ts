import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import {
  getMyLibraryController,
  upsertMyLibraryController,
  updateMyLibraryController,
  removeMyLibraryController,
} from "../controllers/userGame.controller";
import {
  validateUserGameCreate,
  validateUserGameUpdate,
} from "../validators/userGame.validator";

const router = Router();

// Biblioteca del usuario autenticado
router.get("/me/library", auth, getMyLibraryController);
router.post("/me/library", auth, validateUserGameCreate, upsertMyLibraryController);
router.put(
  "/me/library/:gameId",
  auth,
  validateUserGameUpdate,
  updateMyLibraryController
);
router.delete("/me/library/:gameId", auth, removeMyLibraryController);

export default router;
