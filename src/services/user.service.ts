import { User } from "../models/user.model";
import { IUser, IUserDocument } from "../types/user.type";
import bcrypt from "bcryptjs";

// Crear usuario
export const createUser = async (data: IUser): Promise<IUserDocument> => {
  const passwordEncriptada = await bcrypt.hash(data.password, 10);
  data.password = passwordEncriptada;
  return User.create(data);
};

// Login
export const loginUser = async (
  username: string,
  password: string
): Promise<IUserDocument | null> => {
  const user = await User.findOne({ username });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

// Obtener todos
export const getAllUsers = (): Promise<IUserDocument[]> => {
  return User.find();
};

// Obtener por username
export const getUserByUsername = (
  username: string
): Promise<IUserDocument | null> => {
  return User.findOne({ username });
};

// Actualizar
export const updateUserByUsername = (
  username: string,
  data: Partial<IUser>
): Promise<IUserDocument | null> => {
  return User.findOneAndUpdate({ username }, data, { new: true });
};

// Eliminar
export const deleteUserByUsername = (
  username: string
): Promise<IUserDocument | null> => {
  return User.findOneAndDelete({ username });
};
