import { Document, Types } from "mongoose";

export interface IGame {
  externalId?: string;
  titulo: string;
  genero?: string;
  plataformas?: string[];
  desarrollador?: string;
  lanzamiento?: string;
  modo?: string[];
  puntuacion?: number;
  coverUrl?: string;
}

export interface IGameDocument extends IGame, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
