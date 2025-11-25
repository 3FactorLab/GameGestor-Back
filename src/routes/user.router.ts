import { Router } from "express";
import { auth, isAdmin } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware"; // Middleware para gestionar subida de archivos
import { validateUser } from "../validators/user.validator";
import {
  loginController,
  getAllUsersController,
  getUserByUsernameController,
  createUserController,
  updateUserByUsernameController,
  deleteUserByUsernameController,
} from "../controllers/user.controller";

const router = Router();

router.post("/login", loginController);
router.post("/", validateUser, createUserController);

router.get("/", auth, getAllUsersController);
router.get("/:username", auth, getUserByUsernameController);
//router.put("/:username", auth, updateUserByUsernameController);
router.delete("/:username", auth, isAdmin, deleteUserByUsernameController);

router.put(
  "/:username",
  auth,
  upload.single("profilePicture"), // Middleware: Procesa el archivo 'profilePicture' antes del controlador
  updateUserByUsernameController
);

export default router;
