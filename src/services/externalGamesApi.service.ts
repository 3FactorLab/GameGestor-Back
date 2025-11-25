import https from "https";
import { IGame } from "../types/game.type";

const RAWG_BASE_URL = process.env.RAWG_BASE_URL || "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.API_KEY_RAWG;

// Llama al endpoint de detalle de RAWG y devuelve los datos JSON
const fetchFromRawg = (path: string): Promise<any> => {
	if (!RAWG_API_KEY) {
		return Promise.reject(
			new Error("Falta API_KEY_RAWG en las variables de entorno")
		);
	}

	const url = `${RAWG_BASE_URL}${path}${path.includes("?") ? "&" : "?"}key=${RAWG_API_KEY}`;

	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					if (res.statusCode && res.statusCode >= 400) {
						return reject(
							new Error(`RAWG respondió con código ${res.statusCode}: ${data}`)
						);
					}
					try {
						const parsed = JSON.parse(data);
						resolve(parsed);
					} catch (err) {
						reject(new Error("No se pudo parsear la respuesta de RAWG"));
					}
				});
			})
			.on("error", (err) => reject(err));
	});
};

// Normaliza el juego de RAWG al modelo interno de Game
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

// Obtiene un juego desde RAWG por id externo
export const fetchGameByExternalId = async (externalId: string): Promise<IGame> => {
	const rawg = await fetchFromRawg(`/games/${externalId}`);
	return normalizeRawgGame(rawg);
};
