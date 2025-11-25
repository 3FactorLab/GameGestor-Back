# Changelog

- 2025-11-25: Añadido soporte de juegos externos (RAWG) con servicio dedicado, modelo Game extendido (externalId/coverUrl), endpoint `POST /juegos/external/:externalId`, y documentación Swagger/README actualizada para reflejar el flujo de cacheo.
- 2025-11-25: Biblioteca permite añadir juegos mediante `externalId` (RAWG) o `gameId`; valida ambos, crea el juego si falta y lo enlaza en un paso. Swagger/README ajustados.
- 2025-11-25: Fix validator de biblioteca para no acceder a propiedad privada `errors`; ahora combina `result.array()` con errores custom.
- 2025-11-25: Seeds de usuarios actualizados con hash conocido de bcrypt (contraseña `123456`) para facilitar pruebas de login.
- 2025-11-25: Añadidos usuarios seed `raulr`, `luciaj`, `danielv` para alinear con entradas de userGames y evitar omisiones.
- 2025-11-25: Mejorada llamada a RAWG con User-Agent, timeout y logs; errores externos devuelven 502 con detalle.
- 2025-11-25: getOrCreateGameByExternalId ahora reusa juegos existentes por título (si no tienen externalId) para evitar duplicados por índice único; import dotenv en externalGamesApi.service.
- 2025-11-25: Reescrito index.ts para activar configureSecurity y limpiar comentarios; externalGamesApi.service ahora documentado.
