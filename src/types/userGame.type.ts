import { Document, Types } from "mongoose";

// Estados posibles de un juego en la biblioteca personal del usuario
export type UserGameStatus =
  | "pendiente"
  | "jugando"
  | "pausado"
  | "completado"
  | "abandonado";

// Datos que guardamos por cada relación usuario-juego
export interface IUserGame {
  userId: Types.ObjectId;
  gameId: Types.ObjectId;
  status: UserGameStatus;
  score?: number;
  notes?: string;
  favorite?: boolean;
  hoursPlayed?: number;
}

// Documento con metadatos de Mongoose
export interface IUserGameDocument extends IUserGame, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
