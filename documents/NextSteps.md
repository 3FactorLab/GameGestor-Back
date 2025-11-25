# NextSteps

Añadir tests (Jest + Supertest) para login, /juegos/external/:id, /usuarios/me/library (con externalId y gameId), y validaciones.

Manejo fino de RAWG: si quieres UX mejor, captura códigos 4xx/429/5xx y devuelve mensajes claros (rate limit, not found, timeout).

Activar configureSecurity(app) y ajustar CORS al dominio del front.

Opcional: endpoints de filtro/paginación en /juegos para dar soporte a listados en el front.
