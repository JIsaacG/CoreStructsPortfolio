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
npm run build:flujo    # src/data/flujo/*     ->  demos/flujo/*.html
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

src/
  data/                    CONTENIDO — es lo que se edita a diario
    site.js                nombre, textos meta, correo, teléfono, redes
    projects.js            las 8 tarjetas del portfolio
    alliances.js           los paneles de alianzas (logo + relato)
    mockups.js             los visuales SVG de cada tarjeta
    demos.js               el contenido de cada sitio de ejemplo
    bottle.js              la botella SVG que protagoniza el demo Verbena
  styles/
    main.css               punto de entrada del portfolio (orden de la cascada)
    demo.css               punto de entrada de los sitios de ejemplo
    tokens.css             color, tipografía, espacio, motion — fuente única
    fonts.css              @font-face de Manrope y de Quantify (la de marca)
    base.css               reset, fondo ambiental, foco, helpers
    layout.css             ritmo de secciones, conectores, bloque "statement"
    motion.css             sistema de scroll-reveal + prefers-reduced-motion
    components/            header, button, hero, wordmark, spotlight, projects,
                           mockup, alliances, manifesto, contact
    demo/                  shell, header, stage (la botella), hero, sections,
                           shop, footer — solo para las páginas de demos/
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
      main.js              arranque de un sitio de ejemplo
      stage.js             la botella pineada: keyframes medidos del layout
      flavours.js          el sabor en pantalla retiñe la botella y la página

tools/                     scripts de compilación (Node, sin dependencias)
  lib/png.mjs              códec PNG mínimo (decodificar, codificar, escalar)
  lib/trace.mjs            trazado raster -> vector del isotipo
  build-brand.mjs  build-css.mjs  build-content.mjs  build-demos.mjs
  build-aurelis.mjs  aurelis/    el portal corporativo
  build-cede.mjs     cede/       el portal gubernamental
  build-flujo.mjs    flujo/      la demo de automatización administrativa
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
dist/flujo.css             la de la demo de automatización
```

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
cierre. Todo eso era el producto describiéndose a sí mismo, y nada de eso se
podía pulsar. Ahora hay una sola sección con cuatro bloques y todos son
accionables: el riel de procesos, la solicitud, la ruta que produce y las
decisiones que la cierran. El registro no desapareció —los 15 expedientes siguen
teniendo su URL— pero pasó a ser una búsqueda (`Buscar expediente`, o `⌘K`) en
lugar de una tabla en medio del camino.

**Glasswing.** Fondo oscuro con tres cuerpos de color desenfocados detrás, y
sobre él paneles de vidrio: translúcidos, con `backdrop-filter` y un hilo de luz
en el borde superior. `glasswing.css` solo cambia el material —los tokens, no la
maquetación— y `console.css` añade los componentes que solo tiene la consola. La
única superficie opaca de la página es el documento que genera el flujo, porque
un PDF que brilla es un PDF que nadie se cree.

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
- **Formulario de cuatro campos.** Tenía once; siete no cambiaban nada de lo que
  el motor hacía con la solicitud, así que se siguen enviando, siguen en el
  documento y siguen en la bitácora, pero ya no son once cajas entre el visitante
  y el botón. Validación en `blur` y en vivo solo mientras se corrige, con el
  error como frase junto al campo.
- **Secuencia de automatización** de unos seis segundos: valida, cita la regla
  que aplicó, asigna a las personas que la regla eligió y arranca el flujo.
- **Aprobación interactiva** con tres salidas —aprobar, solicitar cambios,
  rechazar— porque una demo que solo deja decir que sí no está enseñando un
  flujo, está enseñando una animación.
- **Documento generado** con código de verificación, **notificación simulada**,
  **bitácora completa** y una **ficha por expediente** en
  `/solicitudes/SOL-2026-0148.html`, detrás de tres pestañas que solo se llenan
  cuando algo ha ocurrido en ellas.
- **Demo guiada** de unos 16 segundos que conduce el flujo entero sin que nadie
  toque nada, con pausa y salida siempre en pantalla.

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

**Todo es ficticio y lo dice en voz alta.** Las personas, los montos, los
códigos y el documento están inventados; el correo no se envía, el archivo no se
descarga y la marca de verificación no es un código legible. Las páginas son
`noindex` y el `schema.org` es `SoftwareApplication` con
`disambiguatingDescription` explícito.

```bash
npm run build:flujo    # regenera demos/flujo/*.html
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
2. **Datos de contacto reales** en `src/data/site.js`: el correo actual
   (`contacto@corestruct.com`) es un marcador; teléfono, WhatsApp y redes están
   en `null` y por eso no aparecen.
3. **Dominio definitivo**: sustituir `https://corestruct.com` en `src/data/site.js`,
   `index.html` (canonical + Open Graph), `robots.txt` y `sitemap.xml`.
4. **Capturas de proyectos reales** para reemplazar los mockups genéricos.
