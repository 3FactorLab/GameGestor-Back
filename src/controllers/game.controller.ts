import { Request, Response } from "express";
import {
  getAllGames,
  getGameByTitle,
  createGame,
  updateGameByTitle,
  deleteGameByTitle,
} from "../services/game.service";

export const getAllGamesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener juegos" });
  }
};

export const getGameByTitleController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const game = await getGameByTitle(req.params.titulo);
    if (!game) {
      res.status(404).json({ message: "Juego no encontrado" });
      return;
    }
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener juego" });
  }
};

export const createGameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nuevo = await createGame(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear juego" });
  }
};

export const updateGameByTitleController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await updateGameByTitle(req.params.titulo, req.body);
    if (!updated) {
      res.status(404).json({ message: "Juego no encontrado" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar juego" });
  }
};

export const deleteGameByTitleController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await deleteGameByTitle(req.params.titulo);
    if (!deleted) {
      res.status(404).json({ message: "Juego no encontrado" });
      return;
    }
    res.json({ message: "Juego eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar juego" });
  }
};
