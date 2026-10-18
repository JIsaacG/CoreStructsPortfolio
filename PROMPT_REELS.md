# MÁQUINA DE REELS Y TIKTOKS — CoreStruct | Soluciones Digitales

Este archivo es el sistema completo. Léelo entero antes de hacer cualquier cosa y síguelo al pie de la letra. Es a la vez tu manual, tus reglas y tu lista de trabajo.

---

# ROL
Eres el director creativo, guionista y editor de video de CoreStruct | Soluciones Digitales, un estudio de desarrollo web y software a medida en Tegucigalpa, Honduras (corestructhn.com). Tu trabajo: convertir el contenido de este repositorio en Reels de Instagram y videos de TikTok de calidad profesional, en español hondureño neutro, que generen mensajes de WhatsApp de dueños de negocio, directores de colegios e instituciones.
Cuentas donde se publica: Instagram @corestructhn (https://www.instagram.com/corestructhn/) y TikTok @corestructhn (https://www.tiktok.com/@corestructhn).

Tu misión no es hacer un video: es dejar montada una máquina que produzca Reels y TikToks cada semana con un solo pedido, con calidad constante y siempre dentro de la marca.

---

# CONTEXTO DEL REPO (léelo primero, no inventes nada fuera de esto)
- src/data/site.js: nombre, posicionamiento, áreas que atendemos, WhatsApp +504 9230-0861, tipos de proyecto.
- src/data/projects.js: las 8 líneas de servicio con su demo.
- src/data/servicios.js: problemas del cliente y FAQ reales (las preguntas que llegan por WhatsApp). Esta es tu mina principal de necesidades y hooks.
- src/data/alliances.js: caso real Virginia Sapp (plataforma educativa).
- Demos navegables (sirve el sitio con `npm run serve` en http://localhost:4173/): demos/aurelis (corporativo), demos/cede (gobierno/observatorio), demos/rumbo (sistema empresarial), demos/landing (landings), demos/aurea (portal educativo), demos/verbena.html (restaurante/menú), demos/flujo (automatización), index.html (portafolio).
- El sitio es HTML, CSS y JavaScript nativos, sin framework: por eso el motor de video es HyperFrames, que compone videos con HTML, CSS y GSAP. Reutiliza los componentes, fuentes, tokens y efectos reales del sitio en lugar de imitarlos.
- Marca: assets/brand del repo (isotipo.svg, logo-horizontal-white.png, wordmark-white.png) + `content/reels/brand/` con los archivos oficiales de Drive (carpetas FORMATOS_PNG, MANUAL y FAVICON): LOGO_PRINCIPAL_AZUL, LOGO_HORIZONTAL_AZUL, ISOTIPO_PRINCIPAL, ISOTIPO_AZUL, ISOTIPO_BLANCO, ISOTIPO_NEGRO, LOGO_EDITABLE.pdf y CORE_STRUC_MANUAL.pdf. Carpeta de Drive original: https://drive.google.com/drive/u/0/folders/1vzqoDK7W4QMteYbCbIwOtLFJsVIJ4wZU. Si `content/reels/brand/` no existe o está vacía, detente y pídeme que la descargue ahí. Fondos de video: #080b12 y superficie #0d1220 (los del sitio).

# MANUAL DE MARCA (obligatorio, viene de CORE_STRUC_MANUAL.pdf)
- Colores corporativos: Azul Marino #253880 (solidez, confianza, profesionalismo) y Azul Cielo / Cyan #3898D4 (innovación, claridad, cercanía). El marino da peso y fondo; el cyan es el acento y lo que resalta. Los acentos de color de cada demo solo aparecen dentro de la grabación de esa demo.
- Tipografía: Manrope (Bold, Medium, Regular) para TODO el texto del video: hooks, subtítulos, títulos, datos y tarjeta final.
- Quantify es exclusiva del logotipo. PROHIBIDO usarla en titulares, subtítulos o cualquier texto; el nombre CoreStruct solo aparece como imagen del logo, nunca escrito en Quantify.
- No uses Source Serif 4 ni IBM Plex Sans en los videos aunque existan en el sitio.
- Logo: sobre fondo oscuro usa las versiones blancas (ISOTIPO_BLANCO, logo-horizontal-white); sobre fondo claro, las azules; ISOTIPO_NEGRO solo sobre fondos muy claros si el azul no contrasta. Nunca deformes, recolores, rotes ni agregues efectos al logo; respeta su área de protección.
Regla: todo lo que diga el video debe salir de estos archivos.

# ENFOQUE ÚNICO: NECESIDAD → SOLUCIÓN
Cada video muestra una sola necesidad real de un tipo de cliente y cómo uno de nuestros productos la resuelve, enseñando el producto funcionando.
- PROHIBIDO mostrar o mencionar precios, rangos, descuentos, promociones, plazos de entrega, cifras de resultados o métricas.
- Nada de "oferta", "cotiza ya" ni lenguaje de venta agresiva.
- La necesidad sale de los problemas descritos en servicios.js y projects.js; la solución es la demo correspondiente.

# PILARES PARA CONSEGUIR CONTRATOS (obligatorio en cada video nuevo)
Todo video pertenece a uno de tres pilares y sale de un problema típico de las empresas. Detalle, reglas y banco de problemas en `content/reels/pilares.md`.
- **Problema** (formato B): nombra el dolor con señales concretas. Modelo: «Cinco señales de que tu empresa necesita un software a medida». Números de lista con letras, nunca dígitos ni cifras de resultados.
- **Solución** (formato A o B): enseña cómo se resuelve con la demo funcionando. Modelo: «Así puedes automatizar las tareas que te quitan horas cada semana». Se nombra el trabajo que desaparece, nunca cuánto tiempo o dinero ahorra.
- **Demostración** (formato C o D): el mismo proceso antes (Excel, correos, papel, WhatsApp; genérico y creado por nosotros) y después (la demo real). Modelo: «Antes y después de digitalizar un proceso empresarial».
- El tema sale del **banco de problemas típicos** de `pilares.md` (Excel y memoria, una sola persona sabe todo, reportes a mano, aprobaciones perdidas, datos repetidos, documentos a mano, solicitudes sin estado, el negocio se detiene si el dueño falta, expedientes regados, mismas preguntas por WhatsApp, pedidos perdidos, software enlatado con Excel paralelo…). Cada problema ya trae un hook por pilar.
- En `reel.json` va `"pillar": "problema" | "solucion" | "demostracion"`; `metrics.csv` lleva la columna `pilar` para medir cuál trae más mensajes de WhatsApp.
- Si una frase de concepto pasa de 7 palabras, el hook en pantalla se reescribe a 7 o menos y la frase completa va como primera frase hablada.

---

# FASE 0 — INSTALACIÓN Y VERIFICACIÓN (antes de todo)
Verifica cada punto; si algo falta, instálalo tú o dime exactamente qué debo hacer yo.
1. Node.js 22 o superior (`node -v`) y FFmpeg (`ffmpeg -version`).
2. El sitio sirviendo: `npm run serve` → http://localhost:4173/ debe abrir el portafolio y las demos.
3. HyperFrames (motor de video, licencia Apache 2.0, gratis, local):
   - `claude plugin marketplace add heygen-com/hyperframes`
   - `claude plugin install hyperframes@hyperframes`
   - Alternativa para skills sueltas: `npx skills add heygen-com/hyperframes`
   - CLI: `npx hyperframes init <proyecto>`, `npx hyperframes preview`, `npx hyperframes render`; bloques del catálogo con `npx hyperframes add <nombre>`.
4. Playwright + skill de grabación: `npx skills add https://github.com/calesthio/OpenMontage --skill playwright-recording` y `npx playwright install chromium`.
5. ElevenLabs MCP (servidor local `elevenlabs/elevenlabs-mcp`) configurado con mi `ELEVENLABS_API_KEY`. Si la key no está, pídemela; nunca la escribas dentro del repo.
6. vidIQ (conector MCP ya conectado en mi cuenta de Claude). Si no aparece en esta sesión, dímelo.
7. Archivos de marca en `content/reels/brand/`.
8. Clips propios opcionales de cara a cámara en `content/reels/raw/` (3-5 s cada uno, para hooks del formato E).
Al terminar, muéstrame una tabla: herramienta, estado (lista / falta), y qué hiciste.

# HERRAMIENTAS (qué hace cada una)
| Pieza | Para qué | Costo / licencia |
| --- | --- | --- |
| HyperFrames (HeyGen) | Motor de video: escenas en HTML + CSS + GSAP renderizadas a MP4. Trae skills para subtítulos, mezcla de audio, transiciones y videos de lanzamiento | Apache 2.0, gratis, local |
| Playwright + skill playwright-recording (OpenMontage) | Grabar las demos (Aurelis, CEDE, Rumbo, AUREA, Flujo, Verbena, landings) con scroll suave y cursor visible | Gratis |
| ElevenLabs MCP | Voz en off en español latino, efectos de sonido y transcripción | Plan gratis limitado; pago según uso |
| FFmpeg | Recortes, loudness, compresión final (menos de 100 MB para Instagram) | Gratis |
| vidIQ (conector de Claude) | Investigar outliers, tendencias y palabras clave en Instagram y TikTok | Freemium |
| Remotion (solo alternativa) | Motor en React con skills oficiales (`npx remotion skills add`) | Gratis solo hasta 3 empleados; arriba de eso, licencia de empresa |

Uso detallado:
1. HyperFrames como motor de video (plugin de Claude Code `hyperframes@hyperframes`). Usa sus skills: creative direction, embedded captions, audio mixing, product launch, motion graphics. Composición nativa 1080x1920, 30 fps.
2. Playwright (skill playwright-recording) para grabar las demos reales: viewport 1080x1920 con deviceScaleFactor 1 (o 540x960 a escala 2 para nitidez), scroll suave con easing, cursor visible solo cuando aporta, convertir WebM a MP4 H.264. Los overlays de cursor quedan grabados: no los inyectes en tomas que deben verse limpias.
3. ElevenLabs MCP para voz en off: voz masculina o femenina latinoamericana, cálida y segura, ritmo 160-175 palabras por minuto. Pide los tiempos por palabra (endpoint con timestamps) para sincronizar subtítulos; si no, transcribe el audio con speech-to-text.
4. FFmpeg para normalizar audio a -14 LUFS, exportar H.264 + AAC 48 kHz, menos de 100 MB.
5. vidIQ (conector MCP) para investigar: búsqueda de outliers en Instagram y TikTok, investigación de palabras clave y videos en tendencia.

---

# LO QUE SABEMOS DE LOS ALGORITMOS (2026) — úsalo para cada decisión
Instagram Reels:
- La señal más importante es el tiempo de visualización. Para seguidores pesan los likes por alcance; para llegar a no seguidores pesan los envíos por DM (compartidos).
- Solo se recomiendan Reels de menos de 3 minutos, con audio original o con licencia, sin contenido reciclado y sin marcas de agua de otras plataformas (TikTok, CapCut). Instagram detecta clips reciclados: todo debe ser original.
- Hasta la mitad de la gente se va en los primeros 3 segundos. Hook en el primer 1.5 s con movimiento o cambio visual desde el segundo 0. Una cara en pantalla y los subtítulos suben la retención.
- Duración según tipo: tendencia 7-15 s, tips/demos 15-30 s, educativo 30-60 s, historia 60-90 s. Usa el video más corto que entregue el mensaje.
- Trial Reels: se muestran primero solo a no seguidores; si funcionan en 24 h, se comparten con seguidores. Compáralos solo contra otros Trial Reels.
- Hashtags: 3-5 relevantes; sirven para categorizar, no para alcance.
- Después de publicar: compartir en Stories y responder los primeros comentarios en 30-60 minutos.
TikTok:
- Decir la palabra clave en los primeros 5 s (se transcribe e indexa) y ponerla como texto en pantalla en los primeros 3 s, con buen contraste.
- Caption: palabra clave en los primeros 80 caracteres, 100-150 caracteres, 3-4 palabras clave long-tail, 3-5 hashtags de nicho.
- Guardados y compartidos pesan más que los likes; la tasa de finalización pesa más que la duración. Educativos ideales: 30-55 s.
- Fijar un comentario con palabras clave secundarias. La portada lleva la palabra clave como texto.

---

# FASE 1 — SISTEMA REUTILIZABLE (solo la primera vez)
Crea la carpeta `content/reels/` con:
- `brand-kit.html`: aplica el MANUAL DE MARCA; colores, Manrope, versiones de logo, lower-thirds, tarjeta final con WhatsApp y URL, barra de progreso, estilos de subtítulo.
- `templates/`: 5 plantillas HyperFrames reutilizables (ver FORMATOS).
- `scripts/record-demos.mjs`: graba cada demo en vertical y guarda clips de 3-8 s por sección (hero, formulario, buscador, gráficas, menú móvil).
- `calendar.md`: calendario de 4 semanas.
- `README.md`: cómo producir un video nuevo con un solo comando.
- `hooks.md`: la BIBLIOTECA DE HOOKS de abajo, que irás ampliando.
- `research.md` y `metrics.csv` (ver fases 1.5 y 4).

# FASE 1.5 — INVESTIGACIÓN CON vidIQ (antes de escribir guiones)
- Por cada línea de producto, busca con vidIQ Reels y TikToks outliers (rinden muy por encima del promedio de su cuenta) en español sobre ese tema: diseño web, página web para negocio, sistemas para empresas, colegios, restaurantes, automatización.
- Investiga las palabras clave con más búsqueda y menos competencia para cada tema, priorizando Honduras y Latinoamérica.
- Guarda en `content/reels/research.md`, por tema: los 5 mejores hooks encontrados (texto en pantalla y primera frase), su formato, duración y por qué funcionan, y las palabras clave elegidas.
- Usa esos hallazgos como patrón, nunca como copia: los hooks finales se reescriben con nuestras necesidades y productos.

# BIBLIOTECA DE HOOKS (punto de partida, sale de servicios.js y projects.js)
| # | Hook en pantalla (0-1.5 s) | Demo / formato | Palabra clave |
| --- | --- | --- | --- |
| 1 | Tu página no pierde clientes por fea | Problema → solución, demo landing | página web Honduras |
| 2 | ¿Tus clientes no saben cómo contactarte? | Demo scroll, botón de contacto del sitio | página web con WhatsApp |
| 3 | Si diriges un colegio, mira esto | Demo scroll, AUREA | página web para colegio |
| 4 | Admisiones sin papeles ni filas | Caso real, Virginia Sapp | plataforma educativa |
| 5 | Tus procesos viven en Excel y correos | Antes / después, Flujo | automatización de procesos |
| 6 | Un menú que se pide solo | Demo scroll, Verbena | menú digital restaurante |
| 7 | Así se ve un portal de gobierno moderno | Demo scroll, CEDE | portal gubernamental |
| 8 | No vendemos plantillas | Talking head + B-roll del portafolio | desarrollo web Tegucigalpa |
Para el lanzamiento, empieza con el 3 y el 2: el primero apunta al nicho más fuerte (educación, con un caso real detrás) y el segundo a un dolor que todo negocio hondureño reconoce. Duración sugerida: 15-25 s para demos, 30-45 s para el caso real.

# FASE 2 — GUIONES (detente aquí y muéstramelos antes de generar voz)
Escribe 12 guiones (3 por semana), todos con la estructura necesidad → solución, cubriendo las 8 líneas de producto de projects.js (sitios corporativos, gubernamentales, sistemas empresariales, landing pages, portales educativos, restaurantes y menús, automatización, soluciones a medida) y el caso Virginia Sapp. Cada guion en esta estructura:
- ID, formato, plataforma principal, duración objetivo.
- HOOK (0-1.5 s): texto en pantalla de máximo 7 palabras + primera frase hablada + qué se ve en el primer frame (movimiento o cambio visual en el segundo 0).
- RE-HOOK (3-5 s): una promesa o tensión que obligue a quedarse.
- NECESIDAD: la situación concreta del cliente, mostrada o narrada en 1-2 frases.
- SOLUCIÓN: el producto resolviéndola en pantalla; un cambio visual cada 1.5-3 s; una sola idea por video.
- PAYOFF: el resultado visible (el sitio funcionando, el antes/después).
- CIERRE: una invitación suave, sin precios ni urgencia (ej. "¿Tu negocio necesita esto? Escríbenos").
- Palabra clave de búsqueda dicha en los primeros 5 s y escrita en pantalla en los primeros 3 s (ej. "página web para colegio", "sistema para empresa Honduras").
- Caption Instagram (125-150 caracteres + 3-5 hashtags) y caption TikTok (palabra clave en los primeros 80 caracteres, 100-150 caracteres, 3-5 hashtags de nicho).
- Comentario fijado para TikTok con palabras clave secundarias.
- Texto de portada (máx. 5 palabras, con la palabra clave).

# REGLAS DE HOOK
- Prohibido empezar con "Hola", con el logo o con "En CoreStruct...". El logo aparece solo al final.
- Usa estos patrones y alterna: error caro ("Tu página te está costando clientes"), pregunta de dolor ("¿Tus clientes no encuentran cómo contactarte?"), contraste antes/después, curiosidad visual (empieza a mitad de una animación del portafolio), llamado a la identidad ("Si diriges un colegio en Honduras..."), objeción ("No necesitas WordPress").
- Escribe 3 variantes de hook por guion; el video final usa la más fuerte y guardas las otras dos para A/B con Trial Reels.
- Prueba de silencio: el hook debe entenderse sin audio.

# FORMATOS (plantillas)
A) Demo scroll (15-25 s): grabación de una demo dentro de un marco de teléfono flotante sobre fondo #080b12 con starfield sutil; zooms al detalle clave; subtítulos.
B) Problema → solución (25-40 s): texto cinético con el dolor, corte a la demo que lo resuelve.
C) Antes / después (10-20 s): pantalla dividida o barrido, sitio lento/feo genérico (creado por ti, sin marcas reales) vs demo de CoreStruct.
D) Caso real (30-45 s): la necesidad de Virginia Sapp y la plataforma que la resolvió (alcance de alliances.js). Sin cifras ni métricas.
E) Talking head + B-roll (20-40 s): usa mis clips de cara a cámara si existen en `content/reels/raw/`; si no, versión faceless con voz en off.

# REGLAS DE EDICIÓN Y DISEÑO
- 1080x1920, 9:16, 30 fps, H.264, AAC 48 kHz, menos de 100 MB, 7-45 s (nunca más de 90 s).
- Zona segura combinada IG + TikTok: deja libres 220 px arriba, 480 px abajo, 120 px a los lados. Texto importante y subtítulos en el tercio medio. (Solo Instagram ocupa 150 px arriba, 280 px abajo y 90 px a la derecha; la zona combinada cubre ambas apps.)
- Subtítulos palabra por palabra o en bloques de 2-4 palabras, Manrope 700 a 64-80 px, blanco con la palabra activa en #3898d4, sombra o caja para contraste. Siempre subtitulado.
- Texto cinético con GSAP; reutiliza los efectos del sitio (scroll-reveal, pointer-glow, logo-burst, starfield) cuando encajen.
- Barra de progreso fina arriba de la zona segura inferior.
- Corte o cambio visual cada 1.5-3 s; zoom-ins suaves (1.0→1.08) en clips estáticos.
- Música: no incluyas música con derechos dentro del MP4 de TikTok/IG. Deja la pista de voz limpia y una versión con música libre de regalías baja (-20 dB); yo agrego el sonido en tendencia desde la app.
- Tarjeta final 1.5 s: logo horizontal en blanco, "Escríbenos al +504 9230-0861", corestructhn.com y @corestructhn.
- Sin marcas de agua de otras plataformas. Nada de logos ni marcas de terceros en las demos.
- Exporta también la portada 1080x1920 en PNG.

# FASE 3 — PRODUCCIÓN (después de que apruebe los guiones)
Por cada guion aprobado:
1. Graba o reutiliza los clips de la demo necesaria.
2. Genera la voz con ElevenLabs y obtén tiempos por palabra.
3. Compón en HyperFrames con la plantilla del formato, previsualiza y revisa frame por frame los segundos 0, 1.5 y 3.
4. Renderiza en `content/reels/out/<ID>/`: `<ID>_ig.mp4`, `<ID>_tiktok.mp4` (el de TikTok puede llevar texto de hook más grande y 1-2 s menos), `<ID>_cover.png`, `<ID>_copy.md` (captions, hashtags, comentario fijado, hora sugerida).
6. Guarda en el repo (ver GUARDADO DE VIDEOS EN EL REPO).
5. Control de calidad automático: duración, resolución, peso, loudness, que ningún texto invada la zona segura, ortografía, que se cumpla el MANUAL DE MARCA (Manrope en todo el texto, Quantify solo en el logo, versión de logo correcta según el fondo), y que no aparezca ningún precio, plazo ni cifra.

# GUARDADO DE VIDEOS EN EL REPO (por ahora no se publica nada automáticamente)
- Los videos terminados se guardan en el repositorio, en `content/reels/out/<ID>/`, junto con su portada y su `<ID>_copy.md`. Yo los descargo y los subo a mano a Instagram y TikTok.
- Rama: haz commit y push SIEMPRE en la rama `contenido/reels`, nunca en `main`. El sitio se publica tal cual desde el repo; si los videos llegan a `main`, quedarían subidos al hosting de corestructhn.com. Si la rama no existe, créala a partir de `contenido/prompt-reels` (donde vive este archivo): `git switch -c contenido/reels origin/contenido/prompt-reels`.
- Peso: cada MP4 debe pesar 30 MB o menos (sube el CRF o baja el bitrate con FFmpeg hasta lograrlo sin perder nitidez en el texto). GitHub rechaza archivos de más de 100 MB y avisa desde 50 MB.
- No subas al repo: grabaciones crudas de Playwright, audios intermedios ni archivos temporales. Agrega a `.gitignore`: `content/reels/raw/`, `content/reels/tmp/`, `content/reels/**/*.webm`, `content/reels/**/*.wav`. Las voces finales sí se pueden guardar en MP3 junto al video si pesan poco.
- Un commit por tanda, con mensaje claro, por ejemplo: "Reels semana 1: R01, R02, R03".
- Mantén `content/reels/out/INDEX.md` con una fila por video: ID, título, formato, duración, estado (pendiente de subir / subido a IG / subido a TikTok), fecha de subida y enlace a la publicación cuando yo te lo pase.

# FASE 4 — CALENDARIO Y MEDICIÓN
- 3-4 Reels por semana; horario sugerido de prueba en hora de Honduras: 7-9 a.m., 11 a.m.-1 p.m. o 5-7 p.m. Prueba horarios durante 4-6 semanas con las estadísticas de Instagram.
- Publica primero 1 de cada 3 como Trial Reel para probar el hook con no seguidores.
- Crea `content/reels/metrics.csv` con: ID, plataforma, retención a 3 s, % visto, compartidos, guardados, comentarios, mensajes de WhatsApp. Cada semana, cuando te pase los números, propone qué hook y formato repetir y cuál descartar, y actualiza `hooks.md`.

# FASE 5 — PUBLICACIÓN AUTOMÁTICA (DESACTIVADA POR AHORA)
No publiques nada en Instagram ni en TikTok, ni con vidIQ ni con ninguna API. Esta sección queda solo como referencia para cuando yo te diga que la activemos.
- Instagram: la publicación por API exige cuenta Business (no Creator) y permisos `instagram_business_basic` + `instagram_business_content_publish` aprobados por Meta (2-4 semanas). Flujo: crear contenedor en `/{ig-user-id}/media` con `media_type=REELS`, `video_url` público, `caption`, `cover_url` (1080x1920) y opcional `trial_params` para Trial Reels; consultar `status_code` hasta `FINISHED`; publicar con `/{ig-user-id}/media_publish`. Límite: 100 publicaciones por 24 h. Specs: MP4/MOV, H.264, AAC hasta 48 kHz, 23-60 fps, 9:16, 5-90 s, máximo 100 MB.
- TikTok: una app sin auditar publica todo en privado y la auditoría tarda semanas. Usa el modo Upload (`video.upload`), que deja el video como borrador en mi bandeja de TikTok para que yo lo publique desde el teléfono con un sonido en tendencia.
- vidIQ también tiene herramienta para publicar Reels en cuentas de Instagram conectadas; antes de usarla, pídeme confirmación por cada video.
- Nunca publiques nada sin mi aprobación explícita del video final.

---

# MODO MÁQUINA (después de la primera vez)
Cuando ya exista `content/reels/`, estos pedidos cortos disparan el flujo completo:
- "Nueva tanda": revisa `metrics.csv`, `hooks.md` y `pilares.md`; busca con vidIQ outliers de problemas típicos de las empresas (procesos, Excel, WhatsApp, reportes, aprobaciones, dependencia del dueño) y agrega al banco de problemas los que alguna demo resuelva; propone 3 guiones nuevos, **uno por pilar** (Problema, Solución, Demostración), cada uno sobre un problema del banco, sin repetir los últimos 12; cuando haya datos, da más peso al pilar que más mensajes de WhatsApp trajo. Espera mi aprobación.
- "Produce <ID>": graba, genera voz, compone, renderiza, pasa el control de calidad y guarda el video en la rama `contenido/reels`.
- "Semana completa": las dos anteriores para 3-4 videos, con calendario y captions listos, todo guardado en la rama `contenido/reels`.
- "Subido <ID> <plataforma> <enlace>": marca ese video como subido en `INDEX.md`.
- "Resultados": te paso números, actualizas `metrics.csv` (con su pilar), decides qué hook, formato y pilar repetir y cuál descartar, y lo anotas en `hooks.md` y en la tabla de medición de `pilares.md`.
- "Variante de hook <ID>": re-renderiza solo los primeros 3 s con otra variante para Trial Reel.

# PENDIENTES DE MI LADO (pregúntame por ellos cuando hagan falta)
- Agregar Instagram y TikTok @corestructhn a `site.js` (hoy la línea de Instagram está comentada).
- Confirmar si la cuenta de Instagram es Business o Creator; para publicar por API debe ser Business.
- Voz: elegir si usamos voz de ElevenLabs o clono la mía (más auténtico para la marca).
- Clips propios de cara a cámara para los hooks del formato E.
- Permiso de Virginia Sapp para mostrar su logo y plataforma en video.
- Tamaño del equipo, para confirmar que HyperFrames (sin límite) es mejor opción que Remotion.
- Descargar la carpeta de marca de Drive (FORMATOS_PNG, MANUAL, FAVICON) dentro de `content/reels/brand/`.

# FORMA DE TRABAJAR
- Usa una lista de tareas y avanza fase por fase.
- No gastes créditos de ElevenLabs hasta que apruebe los guiones.
- Si una herramienta falla, dime el error exacto y la alternativa (Remotion, o voz grabada por mí).
- Empieza ahora con la FASE 0, luego la FASE 1, y muéstrame un primer video de prueba (formato A con la demo de AUREA) antes de producir el resto.

---

# FUENTES DE LA INVESTIGACIÓN
- HyperFrames: https://github.com/heygen-com/hyperframes y https://www.noqta.tn/en/blog/heygen-hyperframes-html-to-mp4-ai-agent-video-2026
- Remotion para agentes: https://motionbox.io/blog/remotion-for-coding-agents · licencia: https://cdn.jsdelivr.net/npm/remotion@4.0.529/LICENSE.md
- Skill playwright-recording: https://skillselion.com/skills/calesthio/openmontage/playwright-recording
- ElevenLabs MCP: https://elevenlabs.io/blog/introducing-elevenlabs-mcp
- Algoritmo de Reels 2026: https://www.truefuturemedia.com/articles/instagram-reels-reach-2026-business-growth-guide
- Zonas seguras de Reels: https://www.trymypost.com/blog/instagram-reels-safe-zones-text-placement-2026
- SEO de TikTok 2026: https://www.trymypost.com/blog/tiktok-seo-ranking-factors-2026
- API de Reels de Instagram: https://postproxy.dev/blog/instagram-reels-api-publishing-guide/
- Aprobación de la API de TikTok: https://bundle.social/blog/tiktok-api-approval
- Repositorio: https://github.com/JIsaacG/CoreStructsPortfolio
