import { Game } from "../models/game.model";
import { IGame, IGameDocument } from "../types/game.type";

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
