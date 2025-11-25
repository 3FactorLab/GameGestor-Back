import { Schema, model } from "mongoose";
import { IGameDocument } from "../types/game.type";

const gameSchema = new Schema<IGameDocument>(
  {
    externalId: {
      type: String,
      unique: true,
      sparse: true, // permite nulos y evita conflicto con seeds existentes
      trim: true,
    },
    titulo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    genero: { type: String },
    plataformas: { type: [String] }, // Array de strings
    desarrollador: { type: String },
    lanzamiento: { type: String },
    modo: { type: [String] },
    puntuacion: { type: Number },
    coverUrl: { type: String },
  },
  {
    collection: "juegos",
    timestamps: true,
  }
);

export const Game = model<IGameDocument>("Game", gameSchema);
