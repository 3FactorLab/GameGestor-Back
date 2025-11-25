import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.DB_URI;

    if (!dbUri) {
      throw new Error("DB_URI no está definida en las variables de entorno");
    }

    await mongoose.connect(dbUri);
    console.log("📀 MongoDB conectado");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};
