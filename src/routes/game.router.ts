import { Router } from "express";
import { auth, isAdmin } from "../middleware/auth.middleware";
import { validateGame } from "../validators/game.validator";
import {
  getAllGamesController,
  getGameByTitleController,
  createGameController,
  updateGameByTitleController,
  deleteGameByTitleController,
} from "../controllers/game.controller";

const router = Router();

router.post("/", auth, validateGame, createGameController);
router.put("/:titulo", auth, validateGame, updateGameByTitleController);

router.get("/", auth, getAllGamesController);
router.get("/:titulo", auth, getGameByTitleController);
router.delete("/:titulo", auth, isAdmin, deleteGameByTitleController);

export default router;
