import { Request, Response } from "express";
import {
  getUserLibrary,
  upsertUserGame,
  updateUserGame,
  removeUserGame,
  upsertUserGameByExternalId,
} from "../services/userGame.service";

// Obtiene la biblioteca del usuario autenticado
export const getMyLibraryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const library = await getUserLibrary(userId);
    res.json(library);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la biblioteca" });
  }
};

// Crea o actualiza un juego dentro de la biblioteca del usuario
export const upsertMyLibraryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const {
      gameId,
      externalId,
      status,
      score,
      notes,
      favorite,
      hoursPlayed,
    } = req.body;

    let userGame;

    // Permitir dos flujos: con gameId existente o creando desde externalId
    if (gameId) {
      userGame = await upsertUserGame(userId, gameId, {
        status,
        score,
        notes,
        favorite,
        hoursPlayed,
      });
    } else if (externalId) {
      userGame = await upsertUserGameByExternalId(userId, externalId, {
        status,
        score,
        notes,
        favorite,
        hoursPlayed,
      });
    } else {
      res
        .status(400)
        .json({ error: "Debes enviar gameId o externalId para crear/actualizar" });
      return;
    }

    res.status(201).json(userGame);
  } catch (error: any) {
    if (error?.message === "El juego no existe") {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error?.message?.includes("API_KEY_RAWG")) {
      res.status(500).json({ error: "Falta API_KEY_RAWG en el servidor" });
      return;
    }
    res.status(500).json({ error: "Error al guardar el juego en tu biblioteca" });
  }
};

// Actualiza campos de un juego ya presente en la biblioteca del usuario
export const updateMyLibraryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { gameId } = req.params;
    const { status, score, notes, favorite, hoursPlayed } = req.body;
    const updated = await updateUserGame(userId, gameId, {
      status,
      score,
      notes,
      favorite,
      hoursPlayed,
    });
    if (!updated) {
      res.status(404).json({ error: "Juego no encontrado en tu biblioteca" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el juego" });
  }
};

// Elimina un juego de la biblioteca del usuario
export const removeMyLibraryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { gameId } = req.params;
    const removed = await removeUserGame(userId, gameId);
    if (!removed) {
      res.status(404).json({ error: "Juego no encontrado en tu biblioteca" });
      return;
    }
    res.json({ message: "Juego eliminado de tu biblioteca" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el juego" });
  }
};
