# Máquina de Reels y TikToks · CoreStruct

Produce Reels de Instagram y videos de TikTok de 1080x1920 a partir de las demos reales del sitio, con HyperFrames (video desde HTML + CSS + GSAP). El manual completo, las reglas y el enfoque necesidad → solución están en `PROMPT_REELS.md` (raíz de esta rama).

> Todo esto vive en la rama `contenido/reels`. **Nunca en `main`**: el sitio se publica desde `main` y los videos acabarían en el hosting.

## Un video nuevo, con un solo comando

```bash
cd content/reels
npm run setup                   # solo la primera vez: dependencias + Chromium de Playwright
npm run new -- R01 A            # crea videos/R01/reel.json desde la plantilla A
# … editar videos/R01/reel.json (gancho, palabra clave, escenas, copy) …
npm run produce -- R01 --record # graba las demos que usa, renderiza, exporta y revisa
```

`produce` deja en `out/R01/`:

| Archivo | Qué es |
| --- | --- |
| `R01_ig.mp4` | Versión Instagram. H.264 + AAC 48 kHz, 30 fps, ≤ 30 MB |
| `R01_tiktok.mp4` | Versión TikTok: gancho más grande y 1-2 s más corta |
| `R01_cover.png` | Portada 1080x1920 con el texto de portada y la palabra clave |
| `R01_copy.md` | Captions de IG y TikTok, hashtags, comentario fijado, hora sugerida |
| `R01_frames.png` | Fotogramas 0, 1.5, 3 s, mitad y final, para revisar a ojo |
| `R01_qa.md` | Control de calidad automático |

…y agrega la fila del video en `out/INDEX.md`.

Sin `--record` usa los clips ya grabados en `raw/clips/`. El sitio tiene que estar sirviéndose (`npm run serve` en la raíz, http://localhost:4173/); si no lo está, el grabador lo arranca solo. Otro puerto: `REELS_BASE_URL=http://localhost:4199`.

## Comandos

| Comando | Para qué |
| --- | --- |
| `npm run record -- --list` | Lista las demos y sus tomas |
| `npm run record -- aurea` | Graba todas las tomas de una demo (`aurea:hero,soy` para tomas concretas) |
| `npm run new -- <ID> <A-E>` | Crea `videos/<ID>/reel.json` desde una plantilla |
| `npm run build -- <ID> [ig\|tiktok\|cover]` | Genera `videos/<ID>/index.html` (proyecto HyperFrames) |
| `npm run preview -- <ID>` | Abre el video en HyperFrames Studio |
| `npm run produce -- <ID> [--record]` | Todo el flujo: build → check → render → FFmpeg → portada → copy → QA → INDEX |
| `npm run qa -- <ID>` | Repite solo el control de calidad |
| `npm run frames -- <video.mp4> [t1,t2,…]` | Hoja de fotogramas de cualquier video |
| `npm run test:templates` | Arma el ejemplo de cada plantilla, corre `hyperframes check` y saca fotogramas a `tmp/plantillas/` |

## Cómo está armado

```
content/reels/
  brand/                 manual y logos oficiales (FORMATOS_PNG, MANUAL)
  brand-kit.html         kit de marca: colores, Manrope, logos, subtítulos, tarjeta final
  templates/
    _shared/             motor común: skeleton.html, reel.css, reel.js, fonts.css, gsap.min.js
    A-demo-scroll/       format.css + reel.example.json
    B-problema-solucion/
    C-antes-despues/
    D-caso-real/
    E-talking-head/
  scripts/
    shots.mjs            qué se graba de cada demo
    record-demos.mjs     grabador fotograma por fotograma (Playwright)
    build.mjs            reel.json → proyecto HyperFrames
    produce.mjs          el comando único
    qa.mjs               control de calidad
  videos/<ID>/           reel.json (se edita) + index.html (generado) + assets/ (generado, no se sube)
  out/<ID>/              entregables finales (sí se suben) + INDEX.md
  raw/                   grabaciones crudas y clips de cara a cámara (no se suben)
  tmp/                   temporales (no se suben)
  hooks.md · research.md · calendar.md · guiones.md · metrics.csv
```

### reel.json

Lo único que se edita a mano. Campos principales:

- `keyword`: palabra clave. Sale como chip blanco con lupa desde el segundo 0.15.
- `hook.text`: gancho (máx. 7 palabras); `*palabra*` la pinta en cyan. `hook.variants`: las 3 variantes para A/B.
- `scenes`: en orden; la duración total es la suma de escenas + cierre + 1.5 s de tarjeta final. Tipos:
  - `demo`: `clip` (`aurea/hero`, de `npm run record -- --list`), `from` (segundo de la toma), `label` (chip superior), `caption` (subtítulo, se reparte solo en bloques de 2-3 palabras con la palabra activa en cyan; `captions: ["bloque 1", "bloque 2"]` para cortarlo a mano), `zoom` ([1, 1.08]) y `origin`.
  - `text`: `kicker` + `lines` en texto cinético grande (formatos B, D, E).
  - `cards`: `kicker`, `lines` e `items` en tarjetas (formato D).
  - `wipe`: antes / después dentro del teléfono; `wipeAt`, `before` (formato C).
  - `face`: clip propio de cara a cámara, `clip: "raw:cara-01.mp4"` (formato E).
- `cta`: invitación suave final (`¿Tu negocio necesita esto? *Escríbenos*`), con o sin `clip`.
- `variants.tiktok`: `trim` (acortar escenas) y `skip` (quitarlas).
- `music`: `null`, o `{ "src": "music/archivo.mp3", "db": -20 }` con licencia clara.
- `copy`: textos de portada, captions, hashtags, comentario fijado, hora.

### Grabación de demos

`record-demos.mjs` abre cada demo en un teléfono emulado (390x844, escala 2 → 780x1688, `isMobile`, `hasTouch`) con `reducedMotion: "no-preference"`, porque las animaciones del sitio son parte del producto. Captura **fotograma por fotograma**: el JavaScript de la página corre sobre el reloj falso de Playwright (1/30 s por fotograma) y las animaciones CSS se ralentizan con CDP (`Animation.setPlaybackRate`), así que el video sale nítido y a ritmo real aunque la captura sea lenta. Durante la grabación se ocultan el sello "DEMO" (lleva el isotipo: el logo solo va al final) y todo enlace o texto que mencione precios o costos.

Para agregar tomas (formularios, gráficas, menú móvil de otra demo) se edita `scripts/shots.mjs`.

### Control de calidad

`qa.mjs` revisa: duración, resolución, fps, códecs, peso ≤ 30 MB, loudness (-14 LUFS cuando hay audio), que ningún texto salga de la zona segura (120 px a los lados, 220 arriba, 480 abajo) en ningún momento, Manrope en todo el texto, Quantify ausente, logo blanco solo en la tarjeta final, palabra clave antes del segundo 3, ortografía básica, que no haya precios, plazos ni cifras (solo el WhatsApp lleva números) y el largo de los captions. `produce` además exige `hyperframes check` con 0 hallazgos antes de renderizar.

## Reglas que el sistema ya aplica

- 1080x1920, 30 fps, H.264 + AAC 48 kHz, 7-45 s, ≤ 30 MB por MP4.
- Gancho en el primer 1.5 s con movimiento desde el fotograma 0; nunca con el logo ni con "Hola".
- Subtítulos siempre: Manrope 700 a 72 px, blanco, palabra activa en #3898D4, caja oscura.
- Barra de progreso fina justo encima de la zona segura inferior.
- Tarjeta final de 1.5 s: logo horizontal blanco, "Escríbenos al +504 9230-0861", corestructhn.com, @corestructhn.
- Fondo #080b12 con superficie #0d1220 y estrellas sutiles con semilla.
- Sin música con derechos dentro del MP4: el sonido en tendencia se agrega desde la app.

## Pendiente (lado del usuario)

- Voz: ElevenLabs no estaba conectado en la sesión que montó esto. Elegir voz (ElevenLabs o clonar la propia) y conectar el MCP; entonces se agrega la pista de voz y los subtítulos se sincronizan con sus tiempos por palabra.
- vidIQ: validar `research.md` en una sesión donde el conector esté disponible.
- Clips de cara a cámara (3-5 s) en `raw/` para el formato E.
- Permiso de Virginia Sapp para mostrar su logo y su plataforma (formato D usa solo texto hasta entonces).
