import "dotenv/config";
import fs from "fs";
import path from "path";
import { Model } from "mongoose";
import { connectDB } from "./config/db";
import { Game } from "./models/game.model";
import { User } from "./models/user.model";
import { UserGame } from "./models/userGame.model";

// Mapa base de modelos: nombre de archivo seed -> modelo
const modelMap: Record<string, Model<any>> = {
  games: Game,
  users: User,
  userGames: UserGame,
};

// Handler específico para userGames: mapea username y título de juego a sus ObjectId
const seedUserGames = async (data: any[]) => {
  await UserGame.deleteMany({});

  const users = await User.find({}, { username: 1 });
  const games = await Game.find({}, { titulo: 1 });
  const userMap = new Map(users.map((u) => [u.username, u._id]));
  const gameMap = new Map(games.map((g) => [g.titulo, g._id]));

  const docs: any[] = [];

  for (const item of data) {
    const userId = userMap.get(item.username);
    const gameId = gameMap.get(item.gameTitle);

    if (!userId || !gameId) {
      console.log(
        `⚠️  Seed userGames omitido: user=${item.username} game=${item.gameTitle}`
      );
      continue;
    }

    docs.push({
      userId,
      gameId,
      status: item.status || "pendiente",
      score: item.score,
      notes: item.notes,
      favorite: item.favorite ?? false,
      hoursPlayed: item.hoursPlayed,
    });
  }

  if (docs.length === 0) {
    console.log("⚠️  No se cargaron userGames (faltan referencias válidas)");
    return;
  }

  const result = await UserGame.insertMany(docs);
  console.log(`🗂️  ${result.length} registro(s) cargado(s) en userGames`);
};

const loadSeeds = async () => {
  try {
    await connectDB();

    const rootDir = path.join(__dirname, "..");

    // Buscar todos los archivos seed-*.json
    const files = fs
      .readdirSync(rootDir)
      .filter((file) => file.startsWith("seed-") && file.endsWith(".json"))
      // Aseguramos que userGames vaya al final (depende de users y games)
      .sort((a, b) => {
        const isUGA = a.includes("userGames");
        const isUGB = b.includes("userGames");
        if (isUGA && !isUGB) return 1;
        if (!isUGA && isUGB) return -1;
        return a.localeCompare(b);
      });

    if (files.length === 0) {
      console.log("😕  No se encontraron archivos seed-*.json");
      process.exit(0);
    }

    console.log(`📦 Encontrados ${files.length} archivo(s) de seeds\n`);

    for (const file of files) {
      const modelName = file.replace("seed-", "").replace(".json", "");
      const Model = modelMap[modelName];

      if (!Model) {
        console.log(
          `⚠️  Modelo no encontrado para: ${file} (buscando: ${modelName})`
        );
        continue;
      }

      const filePath = path.join(rootDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      if (modelName === "userGames") {
        await seedUserGames(data);
        continue;
      }

      await Model.deleteMany({});
      const result = await Model.insertMany(data);

      console.log(`📥 ${result.length} registro(s) cargado(s) en ${modelName}`);
    }

    console.log("\n✅ Seeds cargados exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al cargar seeds:", error);
    process.exit(1);
  }
};

loadSeeds();
