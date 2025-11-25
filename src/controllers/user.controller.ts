import { Request, Response } from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
} from "../services/user.service";
import jwt from "jsonwebtoken";

// Login
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN as any }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error en el login" });
  }
};

// Crear usuario
export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nuevo = await createUser(req.body);

    const token = jwt.sign(
      { id: nuevo._id, username: nuevo.username, role: nuevo.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN as any }
    );

    res.status(201).json({
      user: {
        _id: nuevo._id,
        username: nuevo.username,
        email: nuevo.email,
        telefono: nuevo.telefono,
        role: nuevo.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// Obtener todos
export const getAllUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener por username
export const getUserByUsernameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserByUsername(req.params.username);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Actualizar
export const updateUserByUsernameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updateData = req.body;

    // Si hay archivo subido (req.file), guardamos su ruta en los datos a actualizar
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }
    const updated = await updateUserByUsername(req.params.username, updateData);
    if (!updated) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar
export const deleteUserByUsernameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await deleteUserByUsername(req.params.username);
    if (!deleted) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
