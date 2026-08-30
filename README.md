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
npm run build          # los tres pasos de abajo
npm run build:brand    # assets/source/*.png  ->  assets/brand/*
npm run build:css      # src/styles/*.css     ->  dist/corestruct.css
npm run build:content  # src/data/*.js        ->  index.html
npm run check          # validación previa a publicar
```

`npm run check` falla si hay un asset roto, un ancla sin destino, más de un `<h1>`,
un salto de nivel de encabezado, una imagen sin `alt`, una variable CSS inexistente
o un `calc()` con los espacios rotos.

---

## Estructura

```
index.html                 la página (el contenido se inyecta al compilar)
favicon.ico  robots.txt  sitemap.xml  site.webmanifest

src/
  data/                    CONTENIDO — es lo que se edita a diario
    site.js                nombre, textos meta, correo, teléfono, redes
    projects.js            las 8 tarjetas del portfolio
    capabilities.js        las filas de capacidades
    mockups.js             los visuales SVG de cada tarjeta
  styles/
    main.css               punto de entrada (define el orden de la cascada)
    tokens.css             color, tipografía, espacio, motion — fuente única
    fonts.css              @font-face de Manrope y de Quantify (la de marca)
    base.css               reset, fondo ambiental, foco, helpers
    layout.css             ritmo de secciones, conectores, bloque "statement"
    motion.css             sistema de scroll-reveal + prefers-reduced-motion
    components/            header, button, hero, wordmark, spotlight, projects,
                           mockup, capabilities, manifesto, contact
  scripts/
    main.js                arranque
    modules/
      header.js            estado frosted, menú móvil, sección activa
      scroll-metrics.js    publica el scroll a CSS como custom properties
      scroll-reveal.js     IntersectionObserver + stagger
      pointer-glow.js      el realce cian dentro de una tarjeta al pasar por ella
      pointer-spotlight.js la luz de la página: sigue al cursor con retardo
                           y se deforma según la velocidad

tools/                     scripts de compilación (Node, sin dependencias)
  lib/png.mjs              códec PNG mínimo (decodificar, codificar, escalar)
  lib/trace.mjs            trazado raster -> vector del isotipo
  build-brand.mjs  build-css.mjs  build-content.mjs  check.mjs  serve.mjs

assets/
  source/                  exportaciones originales de marca (no se tocan)
  brand/                   assets generados que usa el sitio
  fonts/                   Manrope (OFL) y Quantify (marca) + sus licencias
dist/corestruct.css        hoja de estilos compilada (es la que enlaza la página)
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
