# ARIS — Tu aliado en emergencias

PWA para móviles de salud y emergencias: asistencia por voz, alertas de tu zona y guías de primeros auxilios, construida en HTML, CSS y JavaScript sin frameworks.

![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-blue) ![PWA](https://img.shields.io/badge/PWA-instalable%20y%20offline-5A0FC8)

## Características

- **8 pantallas móviles** (390 × 844): Bienvenida, Registro, Inicio, Emergencia natural, Modo voz, Guía RCP, Alertas y Perfil
- **Instalable** como app (manifest + icons + atajos SOS/RCP/Alertas)
- **Offline**: service worker con precache del shell y de los audios de voz
- **Asistente por voz**: respuestas de audio precacheadas y transcripción simulada
- **Guía RCP interactiva**: 4 maniobras con escenas animadas, metrónomo de compresiones (Web Audio) y video-card con progreso
- **Sesión local**: registro y perfil persistidos en `localStorage`, saludo y ficha personalizados
- **Alertas vivas**: filtros, marcar como leídas, badges sincronizados entre pantallas

## Cómo ejecutar

La PWA requiere servirse por `https:` o `localhost` (por el service worker):

```bash
# cualquier servidor estático sirve; por ejemplo con Node:
npx serve .
# o con Python:
python -m http.server 8080
```

Abrí `index.html` en el navegador (o `http://localhost:8080/`) e instalá la app desde el menú del navegador si querés. También podés entrar directamente a `app.html` o ver el showcase en `prototype.html`.

## Estructura

```
index.html        # Punto de entrada principal (lanza la app automáticamente)
app.html          # La app PWA interactiva (8 pantallas móviles)
app-mobile.css    # Adaptación full-screen con safe-areas y vista desktop
pwa.js            # Router, sesión, instalación, SW
sw.js             # Service worker (soporte offline)
manifest.json     # Manifest de la PWA
icons/            # Iconos de la app (any + maskable)
app.js            # Interacciones del prototipo (guía, voz, filtros)
styles.css        # Estilos de las pantallas
prototype.html    # Prototipo estático (showcase de las 8 pantallas)
landing.html      # Landing promocional del prototipo
audio/            # Respuestas de voz del asistente (MP3)
```

## Notas

- Los datos, alertas y contactos mostrados son ficticios (prototipo de producto).
- `landing.html` enlaza `landing.css` / `landing.js`, que aún no están en el repo.
