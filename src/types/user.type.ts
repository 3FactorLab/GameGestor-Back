import { Document, Types } from "mongoose";

// Interfaz base del usuario (sin métodos de Mongoose)
export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  nombre?: string; // ? significa "opcional"
  apellido?: string;
  telefono?: string;
  profilePicture?: string;
}

// Interfaz que extiende Document (para usar con Mongoose)
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
