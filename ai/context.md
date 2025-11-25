# Context

- 2025-11-25T00:00:00Z
  - Acciones: Añadido soporte de juegos externos RAWG (servicio https, normalización y caching). Ruta `POST /juegos/external/:externalId` y Swagger actualizado. Se amplió modelo Game con `externalId` y `coverUrl`.
  - Decisiones: Usar https nativo en lugar de fetch/axios para evitar dependencias nuevas y mantener TS sin DOM libs. `externalId` marcado como unique+sparse para no romper seeds existentes.
  - Próximos pasos: Integrar `getOrCreateGameByExternalId` en los flujos de biblioteca (`/usuarios/me/library`) para aceptar externalId directamente; añadir tests de estos casos.
  - Archivos tocados: src/models/game.model.ts, src/types/game.type.ts, src/services/externalGamesApi.service.ts, src/services/game.service.ts, src/controllers/game.controller.ts, src/routes/game.router.ts, src/docs/swagger.ts, README.md.
  - Notas/Riesgos: Falta manejo directo de externalId en biblioteca (requiere ajuste de payload). API_KEY_RAWG debe estar en .env; si falta, el servicio lanza error. Sin tests automáticos aún.

- 2025-11-25T00:00:00Z
  - Acciones: Biblioteca ahora acepta `externalId` (RAWG) además de `gameId`; el backend crea/recupera el juego y lo enlaza en un paso. README y Swagger ajustados. Validator admite ambos campos.
  - Decisiones: Reutilizar `getOrCreateGameByExternalId` en userGame.service; validar presencia de al menos uno (gameId/externalId) antes de upsert.
  - Próximos pasos: Añadir tests para flujos con externalId; manejar mejor los errores de RAWG (timeouts/rate limit) si aparecen.
  - Archivos tocados: src/services/userGame.service.ts, src/controllers/userGame.controller.ts, src/validators/userGame.validator.ts, README.md, src/docs/swagger.ts.
  - Notas/Riesgos: Requiere API_KEY_RAWG configurada. Manejo de errores de red aún básico (500 genérico). Sin pruebas automatizadas.

- 2025-11-25T00:00:00Z
  - Acciones: Corregido validator de biblioteca para no mutar la propiedad privada `errors` de express-validator; ahora agrega errores personalizados en un array combinado.
  - Decisiones: Usar `result.array()` + array custom para validar presencia de `gameId` o `externalId`.
  - Próximos pasos: Añadir tests que cubran el caso sin gameId/externalId para evitar regresiones.
  - Archivos tocados: src/validators/userGame.validator.ts.
  - Notas/Riesgos: Sin tests automáticos; revisar en próximos commits.

- 2025-11-25T00:00:00Z
  - Acciones: Actualizado seed de usuarios con un hash conocido de bcrypt (contraseña en claro: `123456`) para facilitar login en pruebas.
  - Decisiones: Unificar el hash en todos los usuarios seed para simplificar las pruebas.
  - Próximos pasos: Reejecutar `npm run seeds` antes de probar login; seguir con tests automatizados pendientes.
  - Archivos tocados: seed-users.json.
  - Notas/Riesgos: La contraseña de seeds es pública (solo para desarrollo); no usar en producción.

- 2025-11-25T00:00:00Z
  - Acciones: Añadidos usuarios seed que faltaban para mapear relaciones de userGames (`raulr`, `luciaj`, `danielv`) con el mismo hash de prueba.
  - Decisiones: Mantener la contraseña única de pruebas para todos los seeds y evitar omisiones en `userGames`.
  - Próximos pasos: Reejecutar `npm run seeds` y verificar que no haya warnings de omisión en userGames.
  - Archivos tocados: seed-users.json.
  - Notas/Riesgos: Solo válido para desarrollo; revisar siempre credenciales antes de desplegar.

- 2025-11-25T00:00:00Z
  - Acciones: Añadido User-Agent y timeout en la llamada a RAWG, con log de errores; el controlador ahora devuelve 502 con mensaje de RAWG en fallos externos.
  - Decisiones: Mejorar trazabilidad de fallos externos y cumplir el requisito de User-Agent de RAWG.
  - Próximos pasos: Probar de nuevo `/juegos/external/{id}` con clave en .env; si sigue fallando, revisar restricciones de red.
  - Archivos tocados: src/services/externalGamesApi.service.ts, src/controllers/game.controller.ts.
  - Notas/Riesgos: Si no hay salida a red, seguirá fallando; en ese caso se necesita permitir tráfico o mockear.

- 2025-11-25T00:00:00Z
  - Acciones: Añadido import de dotenv en externalGamesApi.service y se mejoró getOrCreateGameByExternalId para evitar errores de duplicado: si el título ya existe (p.ej., seeding), se actualiza el registro existente con externalId y campos faltantes en lugar de crear uno nuevo.
  - Decisiones: Priorizar reutilizar juegos por título cuando no hay externalId para no romper la unicidad de `titulo`.
  - Próximos pasos: Probar de nuevo `/juegos/external/3498` (GTA V) y otros IDs; si ya está el título en seeds, debe asociar el externalId sin duplicar.
  - Archivos tocados: src/services/externalGamesApi.service.ts, src/services/game.service.ts.
  - Notas/Riesgos: Coincidencias por título pueden fallar si el naming difiere; en ese caso se requeriría un mapping más robusto.

- 2025-11-25T00:00:00Z
  - Acciones: Se reescribió `src/index.ts` para activar configureSecurity y limpiar comentarios corruptos; se añadió documentación mínima en externalGamesApi.service.ts.
  - Decisiones: Aplicar seguridad base (helmet/cors/rate limit) por defecto.
  - Próximos pasos: Ajustar CORS en config/security según el dominio del frontend; añadir tests pendientes.
  - Archivos tocados: src/index.ts, src/services/externalGamesApi.service.ts.
  - Notas/Riesgos: Comentarios de seguridad deben revisarse cuando se configuren orígenes permitidos.
