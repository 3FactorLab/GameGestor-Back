import { Schema, model } from "mongoose";
import { IGameDocument } from "../types/game.type";

const gameSchema = new Schema<IGameDocument>(
  {
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
  },
  {
    collection: "juegos",
    timestamps: true,
  }
);

export const Game = model<IGameDocument>("Game", gameSchema);
