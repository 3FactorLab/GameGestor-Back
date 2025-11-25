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
  // Intentamos hacer match por título si ya existe en seeds/base
  const byTitle = await Game.findOne({ titulo: normalized.titulo });
  if (byTitle) {
    // Si no tenía externalId, lo añadimos y actualizamos campos nuevos
    if (!byTitle.externalId) byTitle.externalId = normalized.externalId;
    byTitle.coverUrl = byTitle.coverUrl || normalized.coverUrl;
    byTitle.genero = byTitle.genero || normalized.genero;
    byTitle.plataformas = byTitle.plataformas?.length
      ? byTitle.plataformas
      : normalized.plataformas;
    byTitle.desarrollador = byTitle.desarrollador || normalized.desarrollador;
    byTitle.lanzamiento = byTitle.lanzamiento || normalized.lanzamiento;
    byTitle.modo = byTitle.modo?.length ? byTitle.modo : normalized.modo;
    byTitle.puntuacion = byTitle.puntuacion || normalized.puntuacion;
    await byTitle.save();
    return byTitle;
  }

  const created = await Game.create(normalized);
  return created;
};
