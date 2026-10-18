/**
 * Copia la compilación de Astro a demos/torre-altavista/: `npm run publicar`.
 *
 * Astro escribe rutas absolutas desde `base` (/demos/torre-altavista/...). Aquí
 * se vuelven relativas, por dos razones del portafolio:
 *   - `npm run check` resuelve cada href/src contra la carpeta de la página, y
 *     una ruta absoluta no existe en disco.
 *   - el sitio también se sirve desde una subcarpeta (XAMPP, /CoreStructsPortfolio/),
 *     donde una ruta absoluta apuntaría fuera del proyecto.
 *
 * Solo se reemplazan index.html y _astro/. Los clips de video/ se copian si la
 * compilación los trae, pero nunca se borran: si public/video/ está vacío (no se
 * versiona), los ya publicados se quedan como están.
 */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROYECTO = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(PROYECTO, 'dist');
const DESTINO = join(PROYECTO, '..', '..', 'demos', 'torre-altavista');
const BASE = '/demos/torre-altavista/';

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('No existe dist/index.html: ejecuta primero `astro build`.');
  process.exit(1);
}

// En el HTML, todo cuelga de la carpeta de la página. Solo se tocan las rutas que
// empiezan en `/` (atributos, srcset, url()); las URL completas, como og:image,
// tienen que seguir siendo absolutas.
const ABSOLUTA = /(["'\s,(])\/demos\/torre-altavista\//g;
const html = readFileSync(join(DIST, 'index.html'), 'utf8').replace(ABSOLUTA, '$1./');
if (ABSOLUTA.test(html)) throw new Error('Quedaron rutas absolutas en index.html');

// En CSS y JS, las referencias a _astro/ se resuelven desde la propia carpeta _astro/
// (CSS) o desde el documento (fetch de los clips en JS).
const ASTRO = join(DIST, '_astro');
for (const archivo of readdirSync(ASTRO, { recursive: true })) {
  const ruta = join(ASTRO, archivo);
  if (/\.css$/.test(archivo)) {
    const css = readFileSync(ruta, 'utf8');
    writeFileSync(ruta, css.replaceAll(`${BASE}_astro/`, './'));
  } else if (/\.js$/.test(archivo)) {
    const js = readFileSync(ruta, 'utf8');
    if (js.includes(BASE)) writeFileSync(ruta, js.replaceAll(BASE, './'));
  }
}

rmSync(join(DESTINO, 'index.html'), { force: true });
rmSync(join(DESTINO, '_astro'), { recursive: true, force: true });
cpSync(DIST, DESTINO, { recursive: true });
writeFileSync(join(DESTINO, 'index.html'), html);

const clips = existsSync(join(DESTINO, 'video')) ? readdirSync(join(DESTINO, 'video')).length : 0;
console.log(`Publicado en demos/torre-altavista/ (${clips} clips en video/).`);
