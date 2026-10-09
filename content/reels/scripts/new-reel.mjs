#!/usr/bin/env node
/**
 * Crea un video nuevo a partir de una plantilla.
 *
 *   npm run new -- R01 A          # formato A: demo scroll
 *   npm run new -- R04 D          # formato D: caso real
 *
 * Escribe videos/<ID>/reel.json copiando templates/<formato>/reel.example.json.
 * Ese archivo es lo único que se edita: gancho, palabra clave, escenas
 * (clip, desde qué segundo, rótulo, subtítulo, zoom), cierre y copy.
 * Después: npm run produce -- <ID>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FORMATS, TEMPLATES, VIDEOS } from "./lib/paths.mjs";

const [id, format] = process.argv.slice(2);
if (!id || !FORMATS[format]) {
  console.log("Uso: npm run new -- <ID> <A|B|C|D|E>");
  for (const [k, v] of Object.entries(FORMATS)) console.log(`  ${k}  ${v}`);
  process.exit(1);
}
const dir = join(VIDEOS, id);
const file = join(dir, "reel.json");
if (existsSync(file)) {
  console.error(`Ya existe ${file}. Edítalo o borra la carpeta para empezar de nuevo.`);
  process.exit(1);
}
const example = JSON.parse(readFileSync(join(TEMPLATES, FORMATS[format], "reel.example.json"), "utf8"));
example.id = id;
example.format = format;
mkdirSync(dir, { recursive: true });
writeFileSync(file, JSON.stringify(example, null, 2) + "\n");
console.log(`✓ ${file}`);
console.log("  1. Edita gancho, palabra clave, escenas y copy (sin precios, plazos ni cifras).");
console.log("  2. Graba los clips que falten:   npm run record -- <demo>   (npm run record -- --list)");
console.log(`  3. Produce:                      npm run produce -- ${id}`);
console.log(`  4. Previsualiza o edita:         npm run preview -- ${id}`);
