# CoreStruct — Portfolio corporativo

Sitio de una sola página, estático, construido con HTML, CSS y JavaScript nativos.
**Sin dependencias de runtime y sin framework**: lo que se publica es exactamente lo
que hay en el repositorio.

---

## Cómo verlo

> **Importante:** el sitio debe abrirse por HTTP, **no** con doble clic sobre
> `index.html`. Con `file://` el navegador bloquea por CORS los módulos ES, las
> fuentes y el manifest, y verás errores en consola.

### Opción A — servidor incluido (recomendado para desarrollar)

```bash
npm run serve      # http://localhost:4173/
```

No instala nada: usa el servidor de `tools/serve.mjs`, que ya trae los tipos MIME
correctos y desactiva la caché.

### Opción B — XAMPP

Copia o enlaza la carpeta dentro de `htdocs` y entra por
`http://localhost/CoreStructsPortfolio/`. Al ser archivos estáticos no hace falta
PHP ni base de datos.

En Windows, un enlace simbólico evita duplicar el proyecto (PowerShell como
administrador):

```powershell
New-Item -ItemType SymbolicLink -Path C:\xampp1\htdocs\CoreStructsPortfolio -Target C:\xampp1\CoreStructsPortfolio
```

### Publicar

Sube el repositorio completo tal cual a cualquier hosting estático (Apache, Nginx,
Netlify, Vercel, GitHub Pages). No hay paso de compilación en el servidor: `dist/`
y `assets/brand/` ya vienen generados y versionados.

---

## Compilación

Node 18+ solo hace falta para **regenerar** cosas, no para servir el sitio.

```bash
npm run build          # los pasos de abajo, en orden
npm run build:brand    # assets/source/*.png  ->  assets/brand/*
npm run build:css      # src/styles/*.css     ->  dist/*.css
npm run build:content  # src/data/*.js        ->  index.html
npm run build:demos    # src/data/demos.js    ->  demos/verbena.html
npm run build:aurelis  # src/data/aurelis/*   ->  demos/aurelis/*.html
npm run build:cede     # src/data/cede/*      ->  demos/cede/*.html
npm run build:aurea    # src/data/aurea/*     ->  demos/aurea/*.html
npm run build:flujo    # src/data/flujo/*     ->  demos/flujo/*.html
npm run build:rumbo    # src/data/rumbo/*     ->  demos/rumbo/*.html
npm run build:landing  # src/data/landings/*  ->  demos/landing/*.html
npm run check          # validación previa a publicar
```

`npm run build:map` no forma parte de `npm run build`: reconstruye
`src/data/cede/geography.js` desde el GeoJSON de límites administrativos y solo
hace falta si se sustituye esa fuente.

`npm run check` falla si hay un asset roto, un ancla sin destino, más de un `<h1>`,
un salto de nivel de encabezado, una imagen sin `alt`, una variable CSS inexistente
o un `calc()` con los espacios rotos. Las páginas de `demos/` pasan las mismas
comprobaciones, más una propia: tienen que ser `noindex`.

---

## Estructura

```
index.html                 la página (el contenido se inyecta al compilar)
favicon.ico  robots.txt  sitemap.xml  site.webmanifest

api/                       lo único que se ejecuta en el servidor (PHP)
  contacto.php             recibe el formulario y lo manda al buzón
  smtp.php                 cliente SMTP mínimo, sin dependencias
  config.php               lee la configuración del entorno — sin secretos
  .env.example             qué variables hacen falta (plantilla versionada)
  .env                     credenciales solo para local — NO está en el repo

src/
  data/                    CONTENIDO — es lo que se edita a diario
    site.js                nombre, textos meta, correo, teléfono, redes
    projects.js            las 8 tarjetas del portfolio
    alliances.js           los paneles de alianzas (logo + relato)
    mockups.js             los visuales SVG de cada tarjeta
    demos.js               el contenido de cada sitio de ejemplo
    bottle.js              la botella SVG que protagoniza el demo Verbena
    rumbo/                 company.js, clients.js, users.js, operations.js,
                           format.js — el modelo del panel interno de Rumbo
    landings/              nexora.js, velora.js, orbita.js, showcase.js — el
                           contenido de las tres landing pages y del índice
                           que las presenta
  styles/
    main.css               punto de entrada del portfolio (orden de la cascada)
    demo.css               punto de entrada de los sitios de ejemplo
    nexora.css  velora.css  orbita.css   una por landing page
    showcase.css           el índice de las tres landings (identidad CoreStruct)
    tokens.css             color, tipografía, espacio, motion — fuente única
    fonts.css              @font-face de Manrope y de Quantify (la de marca)
    base.css               reset, fondo ambiental, foco, helpers
    layout.css             ritmo de secciones, conectores, bloque "statement"
    motion.css             sistema de scroll-reveal + prefers-reduced-motion
    components/            header, button, hero, wordmark, spotlight, projects,
                           mockup, alliances, manifesto, contact
    demo/                  shell, header, stage (la botella), hero, sections,
                           shop, footer, dashboard (paneles, tablas, pills de
                           Rumbo) — solo para las páginas de demos/
    lp/                    lo único que comparten las tres landings: fonts
                           (Manrope, Source Serif 4, IBM Plex Sans), reset
                           dirigido por tokens y kit (badge, pitch, firma de
                           cierre, botón flotante)
    nexora/ velora/ orbita/  la identidad de cada landing: tokens propios,
                           header, hero y secciones
    showcase/              la galería de las tres landings
  scripts/
    main.js                arranque
    modules/
      header.js            estado frosted, menú móvil, sección activa
      scroll-metrics.js    publica el scroll a CSS como custom properties
      scroll-reveal.js     IntersectionObserver + stagger
      pointer-glow.js      el realce cian dentro de una tarjeta al pasar por ella
      pointer-spotlight.js la luz de la página: sigue al cursor con retardo
                           y se deforma según la velocidad
      starfield.js         el campo ambiental de motas de marca que sube
                           detrás de toda la página
      logo-burst.js        las chispas azules que suelta el isotipo del hero
                           al hacer clic o tocarlo
    demo/
      main.js              arranque de Verbena (suma la botella, el fizz, el sabor)
      shell.js             arranque de Rumbo: header + reveal, sin la maquinaria
                           de la botella
    lp/                    lo que comparten las tres landings: counters.js
                           (contadores animados), track.js (progreso de scroll
                           como custom property) y demo-form.js (formularios sin
                           backend, con confirmación anunciada)
    nexora/main.js         header, reveals, contadores y el track del método
    velora/                booking.js (el widget de reserva de cuatro pasos),
                           compare.js (el antes/después) y main.js
    orbita/                parallax.js, search.js, sheet.js (el <dialog> de la
                           ficha), compare.js (la tabla) y configurator.js
    showcase/main.js       la transición de tarjeta a proyecto
      stage.js             la botella pineada: keyframes medidos del layout
      flavours.js          el sabor en pantalla retiñe la botella y la página
    rumbo/
      filters.js           filtro y búsqueda de las tablas de expedientes y
                           operaciones — mejora progresiva, la tabla ya está
                           completa en el HTML sin este script

tools/                     scripts de compilación (Node, sin dependencias)
  lib/png.mjs              códec PNG mínimo (decodificar, codificar, escalar)
  lib/trace.mjs            trazado raster -> vector del isotipo
  build-brand.mjs  build-css.mjs  build-content.mjs  build-demos.mjs
  build-aurelis.mjs  aurelis/    el portal corporativo
  build-cede.mjs     cede/       el portal gubernamental
  build-aurea.mjs    aurea/      el portal educativo
  build-flujo.mjs    flujo/      la demo de automatización administrativa
  build-rumbo.mjs    rumbo/      el sistema interno de una distribuidora
  build-landings.mjs landings/  las tres landing pages y su índice
  build-map.mjs              GeoJSON -> src/data/cede/geography.js
  check.mjs  serve.mjs

assets/
  alianzas/                logotipos de los aliados (original + recorte que usa la web)
  source/                  exportaciones originales de marca (no se tocan)
                           + hnd-adm1.geojson (límites administrativos, CC BY 4.0)
  brand/                   assets generados que usa el sitio
  fonts/                   Manrope, IBM Plex Sans y Source Serif 4 (OFL),
                           Quantify (marca) + sus licencias
demos/                     los sitios de ejemplo generados (marcas ficticias)
dist/corestruct.css        hoja de estilos compilada del portfolio
dist/demo.css              hoja de estilos compilada de los sitios de ejemplo
dist/aurelis.css           la del portal corporativo
dist/cede.css              la del portal gubernamental
dist/aurea.css             la del portal educativo
dist/flujo.css             la de la demo de automatización
dist/nexora.css            la de la landing corporativa
dist/velora.css            la de la landing de conversión
dist/orbita.css            la de la landing comercial
dist/showcase.css          la del índice de las tres landings
```

Rumbo no suma un `dist/*.css` propio: comparte `dist/demo.css` con Verbena, igual
que comparte `src/scripts/demo/shell.js` en vez de `main.js`. Le basta con
retintar `--brand-primary` / `--brand-secondary` y sumar el componente que le
falta (`demo/dashboard.css`).

Las tres landings van al otro extremo, y por la misma razón que Aurelis, CEDE y
Flujo: son tres empresas distintas, no tres esquemas de color. Cada una abre su
propia paleta, su propio emparejamiento tipográfico y sus propias piezas
interactivas, así que cada una carga su bundle. Lo único que comparten está en
`src/styles/lp/` — el reset, las declaraciones de tipografía y el marco de
CoreStruct — y en `src/scripts/lp/`.

El portal gubernamental sigue la misma división, en su propio espacio de nombres:

```
src/data/cede/       institution.js  statistics.js  indicators.js  plan.js
                     policy.js  documents.js  newsroom.js  participation.js
                     transparency.js  format.js  geography.js (GENERADO)
src/styles/cede/     tokens, fonts, base, reveal, header, hero, sections,
                     charts, dashboard, tables, footer
src/scripts/cede/    main, nav, a11y, observatory, render, search, forms,
                     download, xlsx, datasets, reveal, ui
                     charts.js y table-render.js son PUROS: los usan la
                     compilación y el navegador
tools/cede/          blocks, shell, home, observatory, pages
```

El portal educativo hace lo mismo, y suma tres interfaces privadas que ninguno
de los otros necesita:

```
src/data/aurea/      institution.js  programs.js  admissions.js  calendar.js
                     news.js  people.js  campus.js  life.js  research.js
                     network.js  resources.js  portal.js  story.js  format.js
src/styles/aurea/    tokens, fonts, base, reveal, header, hero, sections,
                     modules, portal, art, footer
src/scripts/aurea/   main, nav, search, collections, admissions, calendar,
                     tour, forms, ui, reveal, dom
                     collections.js es UN SOLO motor de filtrado para siete
                     catálogos distintos
tools/aurea/         blocks, shell, art, home, program, pages, portals
```

La demo de automatización ocupa su propio espacio de nombres y no comparte nada
en tiempo de ejecución con los anteriores:

```
src/data/flujo/      workflows.js  (el modelo entero: procesos, reglas,
                     personas, solicitudes, SLA, bitácora)  format.js
src/styles/flujo/    tokens, fonts, base, shell, workflow
src/scripts/flujo/   main, engine, form, state, tour, ui
                     render.js es PURO: lo usan la compilación y el navegador
tools/flujo/         blocks, shell, page
```

---

## Los sitios de ejemplo

`Explorar` en una tarjeta del portfolio abre un sitio completo en `demos/`, no una
imagen: header, hero, secciones, tienda y pie, con HTML real y sin dependencias.
Sirven para enseñar el trabajo en lugar de describirlo.

El primero es **Verbena**, una tienda de bebidas artesanales con cinco sabores. Su
mecánica es la del scroll animado: una botella queda fijada con `position: sticky`
mientras las secciones pasan a su alrededor, y gira, se aleja, se vacía y **cambia
de sabor** — color, etiqueta y el acento de toda la página — según qué receta esté
cruzando el centro de la pantalla.

Los keyframes no son porcentajes escritos a mano: cada sección declara en
`data-stage-frame` el estado que debe alcanzar la botella cuando llega arriba, y
`stage.js` mide esas posiciones del layout real. Reescribir un texto vuelve a
sincronizar la animación sola.

La animación corre **en todos los dispositivos y con cualquier ajuste de
movimiento del sistema**: es el tema de la página, no un adorno encima, así que
`demo.css` levanta a propósito el recorte que `motion.css` aplica bajo
`prefers-reduced-motion` (el portfolio sí lo respeta). En móvil no hay una
segunda columna a la que mover la botella, así que se queda centrada detrás del
texto, atenuada, y conserva el giro, la escala, el vaciado y el cambio de sabor.

La única condición para fijarla es que `stage.js` esté vivo: el módulo añade
`is-pinned` al arrancar y el CSS solo fija el escenario con esa clase. Si el
script no cargara, una botella quieta a tamaño completo taparía el texto.

Las marcas son **inventadas**. Cada página lo dice en la chapa fija de la esquina,
en el pie y en el cierre, y va marcada `noindex` para que ninguna empresa ficticia
aparezca en un buscador como si existiera.

```bash
npm run build:demos    # regenera demos/*.html desde src/data/demos.js
```

### CEDE — el portal gubernamental

La tarjeta **02 · Sitios gubernamentales** abre `demos/cede/`: 43 páginas de un
portal público completo para el **Consejo Estratégico para el Desarrollo
Educativo**, una entidad **ficticia**. Es el demo más grande del repositorio y el
que enseña la parte del trabajo que no se ve en una landing: información pública,
estadística, normativa y participación.

Lo que trae:

- **Observatorio** (`/datos`) con diez tableros, ocho dimensiones de filtrado y
  series 2019–2026. Una sola barra de filtros gobierna la página entera: al
  cambiarla se redibujan todos los gráficos, el mapa y la línea que dice qué
  porción se está mirando.
- **Mapa real de Honduras** con sus 18 departamentos. Es geometría de verdad
  —proyectada, simplificada y convertida a SVG por `tools/build-map.mjs`— y
  funciona como un filtro más: se puede recorrer con el teclado y al elegir un
  departamento le sigue todo el observatorio.
- **Fichas de indicador** con definición, fórmula, periodicidad, desagregaciones
  y —lo que casi nunca se publica— las limitaciones de cada uno.
- **Comparador territorial**, **datos abiertos**, **normativa** con buscador,
  **resoluciones**, **biblioteca**, **transparencia**, **participación** con
  consultas públicas, **actualidad** y un **backoffice** demostrativo en
  `/gestion-demo` que no está enlazado desde la navegación pública.

Tres decisiones que conviene conocer antes de tocarlo:

**Todas las cifras son inventadas y ninguna es aleatoria.** `statistics.js` no
usa un generador de números: las series nacionales están escritas a mano y el
resto se deriva de ellas con fórmulas documentadas, repartiendo los totales por
el método del mayor resto. Por eso los 18 departamentos suman exactamente el
total nacional, las desagregaciones suman su propio total, y el portal muestra
las mismas cifras en cada compilación. Un tablero cuyos números cambian al
recargar no lo puede revisar nadie.

**Los gráficos se dibujan con el mismo código en Node y en el navegador.**
`src/scripts/cede/charts.js` es puro: recibe datos y devuelve SVG. La
compilación lo llama para meter gráficos de verdad en el HTML que se descarga, y
el navegador lo vuelve a llamar —con el ancho real del contenedor— cuando cambia
un filtro o el tamaño de la ventana. No hay una segunda implementación que se
pueda desincronizar.

**Lo pesado se carga cuando hace falta.** El observatorio arrastra los
renderizadores, todo el modelo estadístico y la geometría de los 18
departamentos; el buscador arrastra todas las colecciones de contenido para
armar su índice. Ninguno de los dos se carga por defecto: el observatorio entra
con un `import()` solo si la página tiene un gráfico o un mapa, y el índice del
buscador se construye al enfocar la caja. Una página como `/institucion` baja
58 KB de JavaScript en vez de 269 KB.

**Las descargas son reales.** CSV, XLSX y JSON se generan serializando la tabla
que acompaña a cada gráfico, así que el archivo contiene exactamente las cifras
que se estaban viendo, filtros incluidos. El XLSX lo escribe
`src/scripts/cede/xlsx.js`, unas cien líneas sin dependencias: un `.xlsx` es un
ZIP de XML y ZIP admite entradas sin comprimir, que es lo único que hacía falta.

La ficción se declara en la barra institucional, en la chapa de la esquina, en el
pie de cada página y junto a cada bloque de cifras. Las páginas son `noindex` y
el `schema.org` es `Organization`, nunca `GovernmentOrganization`: el tipo de
esquema es una afirmación de hecho, y esta entidad no existe.

```bash
npm run build:cede     # regenera demos/cede/*.html
npm run build:map      # solo si se sustituye el GeoJSON de límites
```

**Cartografía.** Los límites administrativos vienen de
[geoBoundaries](https://www.geoboundaries.org) (gbOpen, ADM1), bajo licencia
**CC BY 4.0**; el original está en `assets/source/hnd-adm1.geojson`. La
atribución aparece en el pie de todas las páginas del portal y en su página de
metodología. El encuadre es continental: Islas del Cisne quedaría a 250 km de la
costa y añadiría un tercio de océano vacío a la página, así que se omite del
dibujo (en un despliegue real iría en un recuadro).

---

### AUREA — el portal educativo

La tarjeta **05 · Portales educativos** abre `demos/aurea/`: 42 páginas del
ecosistema digital completo de **AUREA · Instituto & Universidad**, una
institución **ficticia** que imparte educación media y educación superior en un
mismo campus. Es el demo pensado para que un director, un rector o un propietario
vea el sitio y piense «esto podría ser el portal de nuestra institución».

Lo que trae:

- **Buscador académico** con nueve programas —tres bachilleratos y seis
  licenciaturas— filtrables por nivel, modalidad y área de interés, y una
  **página por carrera** con perfil de egreso, plan de estudios completo,
  requisitos, campo laboral, costos, becas, docentes y preguntas frecuentes.
- **Admisiones** con los dos procesos separados (media y superior), la
  documentación de cada uno, las fechas de 2027 y un **checklist de solicitud**
  que guarda el avance en el navegador.
- **Simulador de becas** y **calculadora de matrícula**: cinco programas de beca
  con criterios, y una estimación por período que distingue los dos modelos de
  cobro reales de la institución —mensualidad en media, asignatura en superior.
- **Calendario institucional** con dos taxonomías cruzadas (tipo de actividad y
  audiencia), vista de mes y de lista, y **exportación real** a `.ics`, Google
  Calendar y Outlook.
- **Galería** de treinta y dos escenas en mosaico, filtrable por área, con
  visor a tamaño completo que se recorre con las flechas del teclado. La misma
  pieza aparece recortada en la portada, en vida estudiantil y en campus.
- **Vida estudiantil** con explorador de clubes, deportes y arte; **campus** con
  tour de plano interactivo y reserva de visitas; **investigación**, **docentes**,
  **directorio**, **biblioteca**, **documentos**, **egresados**,
  **empleabilidad**, **internacional** y **preguntas frecuentes**, todos con
  buscador y filtros.
- **Tres productos privados**: portal estudiantil, portal de padres y una vista
  previa del campus virtual. Son la respuesta a la pregunta que hace un director
  después de ver la portada: «¿y también hacen la parte en la que entran los
  estudiantes?».

Cinco decisiones que conviene conocer antes de tocarlo:

**Un solo motor de filtrado para siete catálogos.** El buscador de programas, el
explorador de clubes, la biblioteca, el centro de documentos, las preguntas
frecuentes, el directorio de docentes y la sala de noticias son la misma
interacción, así que `src/scripts/aurea/collections.js` la implementa una vez y
la gobierna el marcado. La regla que la sostiene: **todos los resultados están
en el HTML antes de que corra un script.** El filtro oculta filas, nunca las
pide, y por eso el catálogo funciona sin JavaScript, se imprime completo y lo
encuentra el buscador del propio navegador.

**El plegado de acentos ocurre dos veces, a propósito.** La compilación escribe
los `data-haystack` con `fold()` de `src/data/aurea/format.js` y el navegador
compara con el `fold()` de `src/scripts/aurea/dom.js`. Son la misma función en
los dos lados porque tienen que coincidir carácter por carácter: si divergen,
alguien escribe «psicologia» y la fila que decía «Psicología» deja de aparecer.

**Las imágenes están dibujadas.** AUREA no existe: no hay campus que fotografiar
ni estudiantes que retratar, y una fotografía de archivo de personas reales sería
el único elemento deshonesto de un sitio cuyo argumento entero es que todo en él
es ficción declarada. Así que `tools/aurea/art.mjs` dibuja treinta y seis láminas
—aulas, laboratorios, estanterías, canchas, escenarios, pentagramas, piscinas,
birretes, patios— con la misma lógica que `cede/art.mjs`: datos entran, SVG sale,
y ni un solo literal de color.

Todas comparten el mismo vocabulario gráfico: fondo, retícula de puntos, masa,
línea, figura y **un solo acento por lámina**. Esa restricción es lo que hace que
treinta y seis dibujos se lean como una galería y no como una carpeta de
clip-art. Cada lámina se dibuja en dos tonos —`deep` sobre el azul institucional
y `paper` sobre papel— y el mosaico alterna los dos, porque treinta y dos piezas
en azul son un rectángulo oscuro enorme, no una galería.

**El visor no duplica nada.** Las láminas ya están en el mosaico, así que
`src/scripts/aurea/gallery.js` clona el SVG de la ficha en la que se hizo clic en
lugar de renderizar treinta y dos dibujos por segunda vez: la mitad del peso, y
la garantía de que lo que se abre es exactamente lo que estaba en pantalla. Sin
JavaScript el mosaico sigue siendo un mosaico de treinta y dos figuras
etiquetadas; el visor es aumento, no contenido.

**Nada se envía y la interfaz lo dice.** Los simuladores, la reserva de visita,
el formulario de contacto y las descargas son demostraciones de flujo; cada
confirmación nombra la ficción en la misma frase en la que anuncia el éxito. Un
demo que responde «¡Gracias! Te contactaremos pronto» ha mentido sobre un mensaje
que no llegó a ninguna parte.

La ficción se declara en la barra superior, en la chapa de la esquina, en el pie
de cada página, junto a cada bloque de cifras y en la franja ámbar que encabeza
los tres portales privados. Las páginas son `noindex` y el `schema.org` es
`Organization`, nunca `EducationalOrganization` ni `Course`: una tarjeta de
carrera inventada en un resultado de búsqueda es exactamente el daño que hay que
evitar.

```bash
npm run build:aurea    # regenera demos/aurea/*.html
```

---

### Flujo — la demo de automatización administrativa

La tarjeta **07 · Automatización** abre `demos/flujo/`: una consola y 15 fichas
de expediente. No es un ERP ni pretende serlo. Es una sola solicitud de compra
recorriendo el circuito completo —solicitud, validación, reglas, asignación,
aprobación, documento, notificación, archivo— para que un director
administrativo entienda en menos de un minuto qué trabajo dejaría de hacer por
correo, Excel y WhatsApp.

Es un demo **aparte**: no vive dentro del portal gubernamental, tiene su marca,
su bundle y su propio espacio de nombres.

**La página es la consola.** La versión anterior tenía catorce secciones: un
héroe, un panel de indicadores, un registro de nueve columnas, una tabla de
plazos, tres tarjetas de reglas, un antes/después, un bloque de impacto y un
cierre. Nada de eso se podía pulsar. Ahora hay una sola sección con cuatro
bloques y todos son accionables: el riel de procesos, la solicitud, la ruta que
produce y las decisiones que la cierran. El registro no desapareció —los 15
expedientes siguen teniendo su URL— pero pasó a ser una búsqueda
(`Buscar expediente`, o `⌘K`) en lugar de una tabla en medio del camino.

**El argumento vive en tres registros, y ninguno estorba al anterior.** El
primer recorte se pasó de largo: quedó claro qué pulsar y dejó de estar claro
para qué servía. La respuesta no fue devolver la sección de beneficios, sino
repartirla.

1. `moduleInfo.purpose`, dos frases bajo el título, dice qué trabajo se
   sustituye antes de que nadie pulse nada. Concretas a propósito —el recado
   primero, el mecanismo después— en vez de una frase sobre transformación
   digital.
2. `advantages` ancla cada par *antes → ahora* al panel donde el visitante está
   viendo esa misma cosa ocurrir: la ronda de correos junto a la ruta que la
   elimina, la firma perseguida junto al turno, el retecleo junto al documento
   generado, la arqueología de correos junto a la bitácora. Van marcados como
   comentario, no como una instrucción más.
3. `¿Qué resuelve?` es la única sección que argumenta en vez de demostrar, y por
   eso es lo último de la página: quien quiere pulsar llega antes a la consola y
   nunca tiene que bajar por un alegato para llegar al producto.

La demo guiada es la quinta capa y la más explícita: ocho pausas de lectura en
las que el motor se detiene con el resultado ya en pantalla y explica qué
trabajo acaba de dejar de hacer una persona.

Dos detalles del narrador que solo aparecen al probarlo. El `hold` de cada
compás se cuenta en tics de 120 ms en vez de en un `sleep` largo, porque
`clock.pause()` solo aplaza las esperas que aún no han empezado — un temporizador
ya lanzado sigue corriendo — así que una pausa de cuatro segundos hecha de una
sola pieza ignoraba `Pausar` y avanzaba un compás entero, que es justo cuando
alguien lo pulsa. Y `Siguiente` marca una bandera en lugar de resolver una
promesa, para que también funcione mientras corre la acción de un compás: la
petición se recuerda y se salta la pausa siguiente, en vez de que la pulsación
no haga nada. El botón se deshabilita cuando no hay pausa que saltar, porque
salta la explicación, no el trabajo.

Y entre la demostración y el alegato hay una cuarta cosa: `tally.js` cuenta lo
que la ejecución dejó —autorizaciones con constancia, documentos, asientos de
bitácora y correos perseguidos— leyéndolo de la propia página en vez de llevar
la cuenta aparte, así que la tira no puede afirmar nada que la pantalla detrás
no muestre. El cuarto número se queda en cero, que es justamente por lo que
está ahí.

**Glasswing, en grafito.** Fondo oscuro neutro con tres pozos de luz
desenfocados detrás, y sobre él paneles de vidrio: translúcidos, con
`backdrop-filter` y un hilo de luz en el borde superior. La paleta es acromática
a propósito — no hay ningún tono de marca en la interfaz, así que el único color
que ve un visitante es un estado (aprobado, en riesgo, rechazado) y significa
exactamente eso. `glasswing.css` solo cambia el material —los tokens, no la
maquetación— y `console.css` añade los componentes que solo tiene la consola. La
única superficie opaca de la página es el documento que genera el flujo, porque
un PDF que brilla es un PDF que nadie se cree.

**Tres pasos numerados, y solo uno encendido.** La consola muestra a la vez
`1 Complete la solicitud`, `2 Resuelva` y `3 Lo que produjo`, y en cada momento
exactamente uno lleva `is-active`: los otros bajan a 0,76 de opacidad y vuelven
al pasar el ratón o al recibir el foco. `stages.js` no sabe nada del flujo —
observa el atributo `hidden` del panel de decisión, que es la misma señal que
lee una persona, y por eso aciertan todos los caminos (enviar, aprobar,
rechazar, la demo guiada y una sesión restaurada) sin que ninguno tenga que
avisar. El paso 2 existe desde el primer fotograma como un marco punteado que
dice cuándo aparecerá, porque un `1` y un `3` sin `2` se leen como una pieza que
falta, no como una que viene después.

Lo que trae:

- **El motor.** `src/data/flujo/workflows.js` define los pasos de forma
  declarativa —`id`, `label`, `type`, `responsibleRole`, `sla`, `next`,
  `condition`, `when`— y `routeFor()` filtra por la condición. Los mismos diez
  pasos producen un circuito de una aprobación para una compra pequeña y de tres
  para una grande, sin una segunda definición y sin una bifurcación en la
  interfaz. Cambiar de institución es cambiar la definición.
- **La regla, en vivo.** El panel «Ruta de autorización» se vuelve a dibujar en
  cada pulsación del campo de monto, con las mismas `ruleFor()` y
  `approvalsFor()` que usan la compilación y el motor. Tres atajos de monto
  cubren las tres bandas, así que ver la tercera no cuesta teclear 240000. Es la
  sección de reglas de antes, convertida en algo que se mira en lugar de leerse.
- **Formulario de cuatro campos, ya rellenos.** Tenía once; siete no cambiaban
  nada de lo que el motor hacía con la solicitud, así que se siguen enviando,
  siguen en el documento y siguen en la bitácora, pero ya no son once cajas entre
  el visitante y el botón. Llegan completos a propósito: antes el concepto estaba
  vacío y era obligatorio, así que la primera pulsación del botón principal
  devolvía un error en lugar de la demostración. Validación en `blur` y en vivo
  solo mientras se corrige, con el error como frase junto al campo.
- **Secuencia de automatización** de unos seis segundos: valida, cita la regla
  que aplicó, asigna a las personas que la regla eligió y arranca el flujo.
- **Aprobación interactiva** con tres salidas —aprobar, solicitar cambios,
  rechazar— porque una demo que solo deja decir que sí no está enseñando un
  flujo, está enseñando una animación.
- **Documento generado** con código de verificación, **notificación simulada**,
  **bitácora completa** y una **ficha por expediente** en
  `/solicitudes/SOL-2026-0148.html`, detrás de tres pestañas que solo se llenan
  cuando algo ha ocurrido en ellas.
- **Demo guiada narrada** de unos 55 segundos que conduce el flujo entero sin
  que nadie toque nada. Cada uno de los ocho compases hace algo y después se
  detiene a decir qué compra eso: la narración explica el mecanismo, y una
  segunda línea —marcada aparte— nombra el recado que desaparece. La versión
  anterior duraba dieciséis segundos y solo narraba el mecanismo, que es
  enseñarle software competente a alguien que sigue sin saber por qué lo
  querría. Como las pausas la duplicaron, el narrador lleva barra de progreso, y
  `Pausar`, `Siguiente` y `Salir` están siempre en pantalla.

Tres decisiones que conviene conocer:

**El reloj está congelado.** `DEMO_NOW` fija el instante contra el que se miden
todos los SLA. Con `Date.now()` cada solicitud aparecería vencida una semana
después de grabar la demo, y la compilación y el navegador discreparían sobre el
mismo número. Con un instante fijo, el registro muestra siempre lo mismo: una
solicitud pasada de plazo, una a punto de vencer y el resto holgadas — el reparto
que tiene un registro real.

**La página está completa antes de que corra un script.** La ruta, la regla, la
bitácora y el documento están en el HTML que se descarga;
`render.js` es puro y lo usan las dos partes, así que una aprobación que añade el
navegador sale idéntica a una que escribió la compilación. Sin JavaScript se ve
el expediente ya terminado en lugar de una pantalla en blanco.

**El contraste está medido, no estimado.** El fondo bajo cualquier texto es un
panel de vidrio desenfocado sobre un degradado sobre una retícula, así que
ningún valor de la hoja de estilos lo predice. `tools/` no lo comprueba, pero el
procedimiento sí está fijado: se pinta una plancha del mismo fotograma con todos
los glifos en `transparent`, se muestrea el píxel real bajo cada etiqueta y se
compone encima el color propio del texto con su alfa y la cadena de `opacity` de
sus ancestros. Con eso se fijaron los valores atenuados de la consola; el peor
de la página queda en 5,4:1.

Un detalle que cuesta una medición falsa: `text-decoration-color` está fijado
explícitamente en la línea tachada del *antes*, así que sobrevive a
`color: transparent` y pinta una raya justo por el punto de muestreo. Si la
plancha no lo neutraliza también, esa línea se mide contra su propio tachado y
sale 3,2:1 en vez de 8:1.

**Todo es ficticio y lo dice en voz alta.** Las personas, los montos, los
códigos y el documento están inventados; el correo no se envía, el archivo no se
descarga y la marca de verificación no es un código legible. Las páginas son
`noindex` y el `schema.org` es `SoftwareApplication` con
`disambiguatingDescription` explícito.

```bash
npm run build:flujo    # regenera demos/flujo/*.html
```

---

### Rumbo — el sistema interno de una distribuidora

La tarjeta **03 · Sistemas empresariales** abre `demos/rumbo/`: el panel que el
propio personal de una distribuidora mayorista ficticia usaría — un tablero, el
registro de clientes (expedientes), el personal y sus roles, y la bitácora de
operaciones. No es la web pública de Rumbo, es lo que hay detrás de ella.

Lo que trae:

- **Panel** con cuatro indicadores, seis semanas de ventas en una barra simple
  y la actividad reciente — pedidos, entregas, pagos y ajustes con quién los
  hizo y a qué cliente tocaron.
- **Expedientes**: seis clientes de muestra sobre una cartera declarada de 184,
  cada uno con su saldo, su vendedor, su historial de pedidos, sus notas de
  visita y sus documentos. La lista se filtra por estado y se busca por
  cliente o zona sin recargar la página.
- **Usuarios** con rol, área y último acceso, más la matriz de **roles y
  permisos** debajo — quién puede ver un expediente no es lo mismo que quién
  puede aprobar un crédito.
- **Operaciones**: la bitácora completa, filtrable por tipo (pedido, entrega,
  pago, ajuste) y buscable por cliente o responsable.

Dos decisiones que conviene conocer:

**El filtro es mejora progresiva, no el contenido.** `src/scripts/rumbo/filters.js`
oculta filas con `hidden`, nunca las quita del HTML: los seis expedientes, los
ocho usuarios y las dieciséis operaciones están completos en la página que se
descarga. Sin JavaScript se ve el registro entero en vez de una tabla vacía
esperando datos.

**El reloj está congelado**, mismo motivo que en Flujo: `RUMBO_TODAY` en
`company.js` fija qué significa "hoy" en todo el demo, para que el panel
muestre siempre el mismo reparto entre pedidos completados, un pago pendiente
y un ajuste cancelado — el que tiene un registro real.

```bash
npm run build:rumbo    # regenera demos/rumbo/*.html
```

---

### Nexora, Velora y Orbita — las landing pages

La tarjeta **04 · Landing pages** abre `demos/landing/index.html`, un índice que
presenta tres proyectos. Tres y no uno porque una landing se juzga por qué tan
bien se compromete con un solo objetivo, y eso solo se nota comparándola con
otras que persiguen objetivos distintos — y porque tres identidades visuales
separadas dicen algo que una sola no puede decir.

- **Nexora Group** (`nexora.html`) — *Corporate Experience*. Una consultoría.
  Estética editorial sobre papel cálido, titulares en Source Serif 4 e interfaz
  en Manrope, un verde petróleo que nunca ocupa una superficie grande. Trae un
  panel de datos animado, contadores, un bento de servicios donde cada tarjeta
  dibuja algo distinto, la narración *antes → transformación → después* ligada
  al scroll, tres casos y un formulario corto.
- **Velora** (`velora.html`) — *Conversion Experience*. Una clínica estética. Marfil,
  negro suave y champán; el emparejamiento tipográfico invertido (Manrope de
  display, Source Serif 4 de lectura) y el arco como motivo. Trae el widget de
  reserva de cuatro pasos, el comparador antes/después arrastrable, el protocolo
  animado con el scroll y CTAs contextuales.
- **Orbita Supply** (`orbita.html`) — *Commerce Experience*. Una distribuidora de
  equipo. Blanco, azul eléctrico y dos zonas negras; Manrope para lo que se lee
  e IBM Plex Sans para lo que se verifica. Trae buscador que filtra el catálogo,
  ficha de producto en `<dialog>`, comparador de hasta tres equipos y un
  configurador B2B que convierte una plantilla en una cotización.

Cada demo cierra con la misma firma —«Project by CoreStruct»— y lleva una línea
discreta a media página que devuelve al contacto del portafolio: son piezas
comerciales además de piezas de portafolio.

Ninguna tiene backend, y las tres lo dicen donde importa: la agenda de Velora
avisa que los horarios son ficticios, la ficha de Orbita avisa que no hay
checkout, y los formularios confirman en la página en vez de fingir un envío.
Es la única parte del repositorio donde eso importa, porque «reserva tu cita»
sin un lugar real donde escribir sería la única mentira del conjunto.

Los productos, precios, marcas, testimonios, credenciales y cifras son
inventados. Las tres páginas son `noindex`, y cada una lo declara en la esquina.

```bash
npm run build:landing  # regenera demos/landing/*.html
```

---

## Editar el contenido

Casi todo se cambia en `src/data/` y luego `npm run build:content`.

**Cambiar una tarjeta del portfolio** — `src/data/projects.js`:

```js
{
  number: "01",
  category: "Desarrollo web",
  title: "Sitios corporativos",
  description: "Máximo dos líneas.",
  mockup: "corporate",   // clave de src/data/mockups.js
  size: "major",         // major=7col · minor=5col · half=6col · wide=12col
  offset: true,          // baja la tarjeta para romper la simetría
  reveal: "far",         // far · rise · scale · left · right · fade
  href: "/casos/acme",   // opcional; por defecto apunta a #contacto
}
```

El ritmo de la rejilla lo marca la secuencia de `size`. Ahora es
7/5 · 5/7 · 12 · 6/6 · 12, que es lo que evita que parezca un muro de tarjetas.

**Cuando haya proyectos reales:** cambia `title`, `description` y `href`, y sustituye
`mockup` por una captura real. La maquetación no necesita tocarse.

**Añadir una alianza** — `src/data/alliances.js`:

```js
{
  number: "01",
  name: "Virginia Sapp",
  kind: "Institución educativa",   // etiqueta pequeña sobre el nombre
  logo: {
    src: "assets/alianzas/virginia-sapp.png",
    width: 202, height: 280,       // medidas reales: evitan el salto de layout
    alt: "Logotipo institucional de Virginia Sapp",
  },
  description: "Creamos … una **plataforma que va más allá**: …",
  scope: ["Presencia institucional", "Admisiones"],  // el índice "Alcance"
  href: null,                      // con URL aparece el enlace "Ver la plataforma"
  reveal: "far",
}
```

En `description`, lo que va entre `**dobles asteriscos**` se levanta del gris del
párrafo; el resto es texto plano y se escapa al compilar. El logotipo se muestra
sobre una placa clara porque es obra de otra marca: se respeta el fondo para el
que fue dibujado en vez de teñirlo. Deja en `assets/alianzas/` el archivo
original y una versión recortada a su contenido, que es la que enlaza la página.

**Datos de contacto** — `src/data/site.js`. Los canales con valor `null` no se
renderizan, así que la página nunca muestra un teléfono o una red inventados.

---

## Sistema visual

Todo el color, tipografía, espaciado y motion está en `src/styles/tokens.css`.
Ningún componente escribe un color de marca a mano.

| Token                | Valor     | Uso                                   |
| -------------------- | --------- | ------------------------------------- |
| `--brand-primary`    | `#253880` | identidad, gradientes, cara "C" del cubo |
| `--brand-secondary`  | `#3898d4` | acentos, hover, líneas, indicadores   |
| `--background`       | `#080b12` | fondo                                 |
| `--surface`          | `#0d1220` | superficies                           |
| `--text-muted`       | `rgb(255 255 255 / .65)` | texto secundario       |
| `--border`           | `rgb(255 255 255 / .10)` | bordes                 |

### Tipografía

- **Manrope** (400–800) para toda la interfaz. Se sirve desde el propio dominio,
  en un archivo variable por subconjunto, con `font-display: swap`. Licencia
  SIL OFL 1.1 incluida en `assets/fonts/Manrope-OFL.txt`.
- **Quantify** v3 (Saidi Alfianor, Sentype Foundry) queda reservada a la marca: el
  logotipo CoreStruct se compone con ella como texto real —clase `.wordmark`— en
  vez de servirse como PNG. Va subconjunta a Latin-1 y sin hinting (65 KB de TTF
  quedan en 12 KB de WOFF2) y con `font-display: block`, porque un logotipo pintado
  un instante con otra tipografía se lee como marca rota. Es una display incompleta
  para el castellano —no trae ñ, ni raya ni semirraya—, así que no sale del
  lettering de marca: el resto de la página es Manrope.
  **Licencia: gratis solo para uso personal** (`assets/fonts/Quantify-EULA.txt`).
- **IBM Plex Sans** y **Source Serif 4** son del portal gubernamental y solo se
  cargan ahí: la serif para lo que la institución *dice* (titulares, mandato,
  aperturas) y Plex para lo que la institución *hace* (navegación, tablas,
  tableros, formularios y cada cifra). Ambas son variables, subconjunto latino,
  servidas desde el propio dominio y bajo SIL OFL 1.1 — un portal público que
  pide su tipografía a un tercero le entrega a ese tercero el registro de quién
  leyó qué.

### Assets de marca

El isotipo original medía 362×422 px, poco para presidir un hero en pantalla retina.
Como está dibujado solo con aristas isométricas rectas, `build-brand.mjs` lo devuelve
a vector por seguimiento de contornos; la compilación **falla** si la fidelidad baja
de 0.98 IoU frente al original (hoy: 0.987–0.989). De ese vector se rasterizan
después los iconos y la tarjeta Open Graph, en vez de escalar el PNG.

---

## El formulario "Hablemos"

Cada "Hablemos", "Quiero un portal como este" y "Crear mi proyecto" del sitio abre
el mismo panel: `src/scripts/cotizador.js`, cuatro campos, encima de la página que
se estaba leyendo. Al enviarlo salen **dos** cosas a la vez, y son independientes
a propósito:

1. **WhatsApp**, con el mensaje ya redactado, hacia `site.contact.whatsapp`. Es lo
   que la persona ve, y es también la mitad que puede quedarse a medias: basta con
   que cierre la pestaña sin pulsar enviar.
2. **Una copia por correo** a `site.contact.email`, vía `api/contacto.php`. Esta es
   la que garantiza que una solicitud escrita llegue a alguien. Si falla, el panel
   lo dice y ofrece la dirección; la solicitud sigue viva por WhatsApp.

La ventana de WhatsApp se abre **antes** de tocar la red: un bloqueador de ventanas
solo confía en la que se abre dentro del clic que la pidió, y esperar a la respuesta
del servidor gastaría esa confianza.

### Qué hace falta en el servidor

Es lo único del proyecto que no es estático. Necesita **PHP 8** con `openssl`
(Hostinger lo trae de serie) y el directorio `api/` subido junto al resto.

**Ningún archivo del repositorio lleva credenciales.** Las cuatro que hacen falta se
cargan en hPanel → tu sitio → *Variables de entorno*:

| Clave | Valor |
| --- | --- |
| `SMTP_USER` | el buzón que se autentica |
| `SMTP_PASS` | su contraseña |
| `MAIL_FROM` | el mismo buzón que `SMTP_USER` |
| `MAIL_TO` | a dónde llegan las solicitudes |

`api/.env.example` lista esas y las opcionales (`SMTP_HOST`, `SMTP_PORT`,
`SMTP_SECURE`, `MAIL_FROM_NAME`, `ALLOWED_ORIGINS`, `RATE_LIMIT`, `RATE_WINDOW`,
`MAIL_DEBUG`), con sus valores por defecto. El botón *Importar .env* del panel
acepta ese formato tal cual.

`MAIL_FROM` tiene que ser la misma cuenta que se autentica: Hostinger rechaza
enviar en nombre de otra dirección, y es lo que hace que SPF y DKIM cuadren y el
correo no caiga en spam.

Para desarrollo, `cp api/.env.example api/.env` y rellenarlo. Ese archivo está en
`.gitignore`, y el entorno real siempre le gana — un `.env` olvidado en el servidor
no puede pisar lo que esté configurado en el panel.

### Comprobar que funciona

Abrir `https://corestructhn.com/api/contacto.php` en el navegador. Lo que responda
dice exactamente en qué punto está:

| Respuesta | Significado |
| --- | --- |
| `{"ok":false,"error":"method_not_allowed"}` | todo correcto: PHP corre, archivos subidos, variables leídas |
| `{"ok":false,"error":"server_misconfigured","missing":[…]}` | falta lo que nombra `missing` en Variables de entorno |
| el código PHP en pantalla, o un 404 | el servidor no ejecuta PHP, o `api/` no se subió |

Y un envío de verdad:

```bash
curl -X POST https://corestructhn.com/api/contacto.php \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Prueba","contacto":"tu@correo.com","detalle":"Probando"}'
```

`{"ok":true}` es la respuesta buena. Si falla, `MAIL_DEBUG=true` devuelve el diálogo
SMTP completo en el JSON — el código numérico del servidor es lo único que sirve para
depurar entrega de correo. **Quitarlo después**: ese diálogo describe la conversación
con el buzón.

Los demás códigos: `422` faltan campos, `429` se superó el tope por IP (cinco cada
diez minutos), `403` la llamada venía de otro dominio, `502` el servidor de correo
rechazó el mensaje.

Desde el propio sitio, si la copia no sale, la consola del navegador imprime el
motivo y la dirección exacta a la que llamó.

---

## Accesibilidad y rendimiento

- Un solo `<h1>`, jerarquía de encabezados sin saltos, HTML semántico, skip link.
- `prefers-reduced-motion`: desaparece todo el movimiento y solo quedan fundidos.
- Objetivos táctiles de 44 px como mínimo, foco visible, navegación por teclado.
- Las animaciones se limitan a `transform` y `opacity`. `--scroll-progress` mueve
  una barra compuesta; el fondo usa una copia escalonada (`--ambient-progress`)
  para no repintar el viewport completo en cada frame.
- El cian de la página lo lleva el spotlight del cursor: un solo elemento fijo y
  redondo que únicamente cambia `transform`, con el bucle rAF apagándose en
  cuanto alcanza al puntero. Sin ratón o con `prefers-reduced-motion` no existe,
  y el lavado de fondo sube para compensar.
- Ninguna sección usa `overflow: hidden` sobre sus resplandores: recortarlos en el
  borde de la sección dibujaba una línea recta a lo ancho de la pantalla.
- Sin peticiones a terceros: ni fuentes, ni analítica, ni CDNs.
- El contenido se genera al compilar, no en el navegador: la página es indexable
  y se pinta en el primer frame. Si el JavaScript no llega a ejecutarse, un
  temporizador en `index.html` desactiva el ocultado para que nada quede invisible.

---

## Pendiente de aportar

1. **Licencia comercial de Quantify**: la que está en el repositorio es la descarga
   gratuita de DaFont, válida solo para uso personal, y este sitio es uso comercial.
   Escribir a la fundición (correo en `assets/fonts/Quantify-EULA.txt`) antes de
   publicar, o sustituir el logotipo por el arte del logo.
2. **Redes sociales** en `src/data/site.js`: `social` está vacío y `phone` en
   `null`, y por eso no aparecen. WhatsApp (`+504 9230-0861`) y el correo
   (`contacto@corestructhn.com`) ya son los reales.
3. **Dominio definitivo**: `site.url` sigue siendo `https://corestruct.com`
   mientras que el correo y el SMTP ya son de `corestructhn.com`. Hay que decidir
   cuál es el bueno y sustituirlo en `src/data/site.js`, `index.html`
   (canonical + Open Graph), `robots.txt` y `sitemap.xml`. El endpoint no hay que
   tocarlo: acepta siempre al dominio desde el que se sirve.
4. **Capturas de proyectos reales** para reemplazar los mockups genéricos.
