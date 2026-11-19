# Asistente IA para negocios · Codelab

Página de venta del **Asistente IA de Codelab**: un asistente para la web de cada cliente que responde 24/7 con la información de su negocio, capta contactos y avisa al equipo cuando no sabe algo.

Incluye una **demo interactiva** con tres negocios ficticios (clínica dental, gimnasio e inmobiliaria): el visitante chatea como si fuera un cliente y, al lado, ve en directo el panel que recibiría el negocio (consultas, contactos captados).

- `bot.js` – base de conocimiento de los negocios de ejemplo y el motor de la demo (respuestas por intención y captación de nombre y teléfono). Para añadir un negocio, copia uno de los perfiles de `BOT_PROFILES`.
- `i18n.js` – textos en castellano y catalán, y el correo de contacto (`EMAIL`).
- Tema claro y oscuro, adaptado a móvil.

La demo funciona sin servidor y no envía datos a ningún sitio. La versión para clientes necesita un pequeño servidor que conecte el chat con un modelo de IA y guarde las conversaciones y los contactos.
