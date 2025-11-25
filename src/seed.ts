import "dotenv/config"; // ⚡ Carga las variables del archivo .env
import { connectDB } from "./config/db";
import { Game } from "./models/game.model";
import { User } from "./models/user.model";
import fs from "fs";
import path from "path";
import { Model } from "mongoose";

// Mapa de modelos: asocia el nombre del archivo seed con su modelo correspondiente
const modelMap: Record<string, Model<any>> = {
  games: Game,
  users: User,
  // Añade aquí más modelos según sea necesario
  // ejemplo: categories: Category,
};

const loadSeeds = async () => {
  try {
    await connectDB();

    // Directorio raíz del proyecto
    const rootDir = path.join(__dirname, "..");

    // Buscar todos los archivos que coincidan con el patrón seed-*.json
    const files = fs.readdirSync(rootDir).filter((file) => {
      return file.startsWith("seed-") && file.endsWith(".json");
    });

    if (files.length === 0) {
      console.log("⚠️  No se encontraron archivos seed-*.json");
      process.exit(0);
    }

    console.log(`📦 Encontrados ${files.length} archivo(s) de seeds\n`);

    // Procesar cada archivo seed
    for (const file of files) {
      // Extraer el nombre del modelo del nombre del archivo
      // Ejemplo: "seed-games.json" -> "games"
      const modelName = file.replace("seed-", "").replace(".json", "");

      // Buscar el modelo correspondiente
      const Model = modelMap[modelName];

      if (!Model) {
        console.log(
          `⚠️  Modelo no encontrado para: ${file} (buscando: ${modelName})`
        );
        continue;
      }

      // Leer y parsear el archivo JSON
      const filePath = path.join(rootDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Limpiar la colección e insertar los datos
      await Model.deleteMany({});
      const result = await Model.insertMany(data);

      console.log(`✅ ${result.length} registro(s) cargado(s) en ${modelName}`);
    }

    console.log("\n🎉 Seeds cargados exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al cargar seeds:", error);
    process.exit(1);
  }
};

loadSeeds();
