import { UserGame } from "../models/userGame.model";
import { Game } from "../models/game.model";
import { IUserGame, IUserGameDocument } from "../types/userGame.type";
import { Types } from "mongoose";
import { getOrCreateGameByExternalId } from "./game.service";

// Obtiene la biblioteca del usuario con datos básicos del juego
export const getUserLibrary = (
  userId: string
): Promise<IUserGameDocument[]> => {
  return UserGame.find({ userId })
    .populate("gameId", ["titulo", "genero", "plataformas", "desarrollador"])
    .exec();
};

// Crea o actualiza la entrada de un juego en la biblioteca del usuario
export const upsertUserGame = async (
  userId: string,
  gameId: string,
  data: Partial<IUserGame>
): Promise<IUserGameDocument> => {
  // Asegura que el juego exista para no guardar referencias rotas
  const exists = await Game.exists({ _id: new Types.ObjectId(gameId) });
  if (!exists) {
    throw new Error("El juego no existe");
  }

  const payload: Partial<IUserGame> = {
    userId: new Types.ObjectId(userId),
    gameId: new Types.ObjectId(gameId),
    ...data,
  };

  return UserGame.findOneAndUpdate(
    { userId, gameId },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();
};

// Actualiza campos de una relación existente
export const updateUserGame = (
  userId: string,
  gameId: string,
  data: Partial<IUserGame>
): Promise<IUserGameDocument | null> => {
  return UserGame.findOneAndUpdate({ userId, gameId }, data, {
    new: true,
  }).exec();
};

// Elimina un juego de la biblioteca del usuario
export const removeUserGame = (
  userId: string,
  gameId: string
): Promise<IUserGameDocument | null> => {
  return UserGame.findOneAndDelete({ userId, gameId }).exec();
};

// Recibe externalId, busca/crea el juego vía RAWG y luego upsert en biblioteca
export const upsertUserGameByExternalId = async (
  userId: string,
  externalId: string,
  data: Partial<IUserGame>
): Promise<IUserGameDocument> => {
  // Crea o trae el juego desde RAWG
  const game = await getOrCreateGameByExternalId(externalId);
  // Reutiliza la lógica de upsert con gameId interno
  return upsertUserGame(userId, game._id.toString(), data);
};
