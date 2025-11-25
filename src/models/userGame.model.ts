import { Schema, model } from "mongoose";
import { IUserGameDocument } from "../types/userGame.type";

// Relación usuario-juego con datos propios del usuario sobre ese juego
const userGameSchema = new Schema<IUserGameDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    status: {
      type: String,
      enum: ["pendiente", "jugando", "pausado", "completado", "abandonado"],
      required: true,
      default: "pendiente",
    },
    score: { type: Number, min: 0, max: 100 },
    notes: { type: String, maxlength: 1000 },
    favorite: { type: Boolean, default: false },
    hoursPlayed: { type: Number, min: 0 },
  },
  {
    collection: "juegosUsuario",
    timestamps: true, // createdAt y updatedAt
  }
);

// Evita duplicar el mismo juego en la biblioteca del mismo usuario
userGameSchema.index({ userId: 1, gameId: 1 }, { unique: true });

export const UserGame = model<IUserGameDocument>("UserGame", userGameSchema);
