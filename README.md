# Asistente IA para negocios · Codelab

Asistente con **inteligencia artificial** para la web de cualquier negocio: responde 24/7 solo con la información del negocio, en el idioma del cliente, y cuando alguien quiere cita o que le llamen, le pide nombre y teléfono y lo guarda como contacto.

## Partes

- **Página de venta** (`index.html`): con demo real (tres negocios ficticios) y panel en directo.
- **Servidor** (`worker/`): Cloudflare Worker gratuito con Workers AI (Llama 3.3) y base de datos D1 en la UE.
  - En producción: https://codelab-asistente.codelab-pauizel.workers.dev
- **Widget para instalar en la web de un cliente** (una línea antes de `</body>`):
  ```html
  <script src="https://codelab-asistente.codelab-pauizel.workers.dev/widget.js" data-negocio="ID-DEL-NEGOCIO" defer></script>
  ```
  Opciones: `data-modo="integrado" data-contenedor="#id"` para mostrarlo dentro de la página; `data-idioma="es|ca|en"`.
- **Panel de administración**: https://codelab-asistente.codelab-pauizel.workers.dev/admin
  Crear y editar negocios (información, colores, saludos, sugerencias), ver y exportar contactos y leer las conversaciones.

## Puesta en marcha y mantenimiento

```bash
cd worker
npx wrangler secret put ADMIN_PASSWORD     # contraseña del panel (obligatoria)
npx wrangler deploy                        # publicar cambios
```

Base de datos: `schema.sql` (tablas) y `seed.sql` (negocios de demostración). Los datos de los negocios marcados como demostración se borran cada día automáticamente.
