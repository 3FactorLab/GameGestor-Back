import { Game } from "../models/game.model";
import { IGame, IGameDocument } from "../types/game.type";
import { fetchGameByExternalId } from "./externalGamesApi.service";

export const getAllGames = (): Promise<IGameDocument[]> => {
  return Game.find();
};

export const getGameByTitle = (
  titulo: string
): Promise<IGameDocument | null> => {
  return Game.findOne({ titulo });
};

export const createGame = (data: IGame): Promise<IGameDocument> => {
  return Game.create(data);
};

export const updateGameByTitle = (
  titulo: string,
  data: Partial<IGame>
): Promise<IGameDocument | null> => {
  return Game.findOneAndUpdate({ titulo }, data, { new: true });
};

export const deleteGameByTitle = (
  titulo: string
): Promise<IGameDocument | null> => {
  return Game.findOneAndDelete({ titulo });
};

// Obtiene o crea un juego a partir de un id externo (RAWG)
export const getOrCreateGameByExternalId = async (
  externalId: string
): Promise<IGameDocument> => {
  // Si ya existe en cache, lo devolvemos
  const existing = await Game.findOne({ externalId });
  if (existing) return existing;

  // Consultamos RAWG y normalizamos
  const normalized = await fetchGameByExternalId(externalId);
  const created = await Game.create(normalized);
  return created;
};
