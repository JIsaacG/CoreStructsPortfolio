# Biblioteca de hooks

Punto de partida tomado de `src/data/servicios.js` y `src/data/projects.js`. Se amplía cada semana con lo que digan `metrics.csv` y la investigación (`research.md`).

Reglas que todo hook cumple:

- Texto en pantalla de **máximo 7 palabras**, visible entre 0 y 1.5 s, con movimiento desde el fotograma 0.
- **Prueba de silencio**: se entiende sin audio.
- Nunca empieza con "Hola", con el logo ni con "En CoreStruct…". El logo va solo al final.
- Sin precios, plazos, cifras ni "oferta" / "cotiza ya".
- Cada guion lleva **3 variantes**; el video usa la más fuerte y las otras dos se guardan para A/B con Trial Reels.
- Cada video pertenece a un **pilar** (Problema, Solución o Demostración, ver `pilares.md`) y sale de un problema del **banco de problemas típicos** de ese archivo, que ya trae un hook por pilar para cada problema.
- Alternar patrones: lista de señales («Cinco señales de que…», con el número en letras), error caro, pregunta de dolor, contraste antes/después, curiosidad visual, llamado a la identidad, objeción.

## Biblioteca base

| # | Hook en pantalla (0-1.5 s) | Demo / formato | Palabra clave | Patrón | De dónde sale |
| --- | --- | --- | --- | --- | --- |
| 1 | Tu página no pierde clientes por fea | B · Problema → solución, demo landing | página web Honduras | error caro | servicios.js: "La mayoría de las páginas no pierden clientes por feas." |
| 2 | ¿Tus clientes no saben cómo contactarte? | A · Demo scroll, botón de contacto del sitio | página web con WhatsApp | pregunta de dolor | servicios.js: "En Honduras el primer contacto casi nunca es un formulario: es un mensaje de WhatsApp." |
| 3 | Si diriges un colegio, mira esto | A · Demo scroll, AUREA | página web para colegio | llamado a la identidad | projects.js 05: portales educativos (AUREA) |
| 4 | Admisiones sin papeles ni filas | D · Caso real, Virginia Sapp | plataforma educativa | contraste | alliances.js: admisiones dentro de la plataforma |
| 5 | Tus procesos viven en Excel y correos | C · Antes / después, Flujo | automatización de procesos | error caro | projects.js 07 + servicios.js: "Casi toda operación termina corriendo sobre Excel y memoria." |
| 6 | Un menú que se pide solo | A · Demo scroll, Verbena | menú digital restaurante | curiosidad visual | projects.js 06: cartas digitales y pedidos en línea |
| 7 | Así luce un portal de gobierno moderno (antes "Así se ve…", 8 palabras) | A · Demo scroll, CEDE | portal gubernamental | curiosidad visual | projects.js 02: observatorio, normativa, transparencia |
| 8 | No vendemos plantillas | E · Talking head + B-roll del portafolio | desarrollo web Tegucigalpa | objeción | servicios.js: "No vendemos plantillas: cada proyecto se construye sobre cómo opera de verdad quien lo va a usar." |

Para el lanzamiento: primero el **3** (nicho educativo, con un caso real detrás) y el **2** (un dolor que todo negocio hondureño reconoce).

## Hooks de la prueba de pilares

| # | Hook en pantalla (0-1.5 s) | Pilar · formato | Palabra clave | Patrón | De dónde sale |
| --- | --- | --- | --- | --- | --- |
| 9 | Cinco señales de que necesitas un sistema | Problema · B, Rumbo | software a medida Honduras | lista de señales | servicios.js (Excel y memoria, Excel paralelo) + outlier vidIQ de lista de errores |
| 10 | Tareas que te roban horas cada semana | Solución · A, Flujo | automatización de procesos | error caro | servicios.js: "el trabajo repetitivo que hoy consume horas de alguien" |
| 11 | Antes y después de digitalizar un proceso | Demostración · C, Rumbo | digitalizar procesos empresa | contraste | projects.js 07 + outlier vidIQ "por fin dejas el Excel" |

Hooks de reserva para los tres pilares: columna por pilar del banco de problemas en `pilares.md` (P1-P15).

## Variantes ya escritas

Las 3 variantes de cada guion viven en `guiones.md`; las del video de prueba, en `videos/R00/reel.json`.

| Video | Variante usada | Variantes para Trial Reels |
| --- | --- | --- |
| R00 | Si diriges un colegio, mira esto | ¿Las familias encuentran tu colegio en el teléfono? · Tu colegio, completo en el teléfono |

## Resultados por hook

Se llena con los números de `metrics.csv` ("Resultados"). Repetir lo que retenga a 3 s por encima del promedio de la cuenta; descartar lo que quede por debajo dos veces seguidas.

| Hook | Pilar | Videos | Retención a 3 s (prom.) | Compartidos | Guardados | WhatsApp | Decisión |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | pendiente de datos |
