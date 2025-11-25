import "dotenv/config";
import https from "https";
import { IGame } from "../types/game.type";

// Configuración de RAWG (se obtiene de .env)
const RAWG_BASE_URL = process.env.RAWG_BASE_URL || "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.API_KEY_RAWG;

// Hace la llamada a RAWG y devuelve el JSON ya parseado
const fetchFromRawg = (path: string): Promise<any> => {
  if (!RAWG_API_KEY) {
    return Promise.reject(
      new Error("Falta API_KEY_RAWG en las variables de entorno")
    );
  }

  const url = `${RAWG_BASE_URL}${path}${
    path.includes("?") ? "&" : "?"
  }key=${RAWG_API_KEY}`;

  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "GameGestor/1.0 (contact: alonvineba@gmail.com)",
        },
        timeout: 7000,
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Si RAWG responde con error, devolvemos el mensaje completo para depurar
          if (res.statusCode && res.statusCode >= 400) {
            const msg = `RAWG respondio con codigo ${res.statusCode}: ${data}`;
            console.error(msg);
            return reject(new Error(msg));
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            console.error("No se pudo parsear la respuesta de RAWG", err);
            reject(new Error("No se pudo parsear la respuesta de RAWG"));
          }
        });
      }
    );

    // Evita que la petición quede colgada
    req.on("timeout", () => {
      req.destroy(new Error("Timeout al llamar a RAWG"));
    });

    // Errores de red (DNS, conexión, etc.)
    req.on("error", (err) => {
      console.error("Error de red al llamar a RAWG", err);
      reject(err);
    });
  });
};

// Normaliza el juego de RAWG a nuestro modelo interno
const normalizeRawgGame = (rawg: any): IGame => {
  const modes: string[] = [];
  (rawg.tags || [])
    .map((t: any) => t?.name)
    .filter(Boolean)
    .forEach((tag: string) => {
      const lower = tag.toLowerCase();
      if (lower.includes("singleplayer")) modes.push("Un jugador");
      if (lower.includes("multiplayer")) modes.push("Multijugador");
    });

  return {
    externalId: rawg.id ? String(rawg.id) : undefined,
    titulo: rawg.name,
    genero: rawg.genres?.[0]?.name,
    plataformas: (rawg.platforms || [])
      .map((p: any) => p?.platform?.name)
      .filter(Boolean),
    desarrollador:
      rawg.developers?.[0]?.name || rawg.publishers?.[0]?.name || undefined,
    lanzamiento: rawg.released,
    modo: Array.from(new Set(modes)),
    puntuacion: rawg.metacritic,
    coverUrl: rawg.background_image,
  };
};

// Obtiene un juego desde RAWG por id externo y lo normaliza
export const fetchGameByExternalId = async (
  externalId: string
): Promise<IGame> => {
  const rawg = await fetchFromRawg(`/games/${externalId}`);
  return normalizeRawgGame(rawg);
};
