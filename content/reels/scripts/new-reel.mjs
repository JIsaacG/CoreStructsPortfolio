#!/usr/bin/env node
/**
 * Crea un video nuevo a partir de una plantilla.
 *
 *   npm run new -- R13 B problema       # formato B, pilar Problema
 *   npm run new -- R14 solucion         # pilar Solución, formato sugerido (A)
 *   npm run new -- R01 A                # sin pilar (se puede agregar después)
 *
 * Pilares (pilares.md): problema · solucion · demostracion.
 * Formato sugerido por pilar: problema → B, solucion → A, demostracion → C.
 *
 * Escribe videos/<ID>/reel.json copiando templates/<formato>/reel.example.json.
 * Ese archivo es lo único que se edita: gancho, palabra clave, escenas
 * (clip, desde qué segundo, rótulo, subtítulo, zoom), cierre y copy.
 * Después: npm run produce -- <ID>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FORMATS, PILLARS, PILLAR_FORMAT, TEMPLATES, VIDEOS } from "./lib/paths.mjs";

const norm = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const [id, ...rest] = process.argv.slice(2);
const pillar = rest.map(norm).find((a) => PILLARS[a]);
const format = rest.find((a) => FORMATS[a]) || (pillar && PILLAR_FORMAT[pillar]);

if (!id || !FORMATS[format]) {
  console.log("Uso: npm run new -- <ID> [A|B|C|D|E] [problema|solucion|demostracion]");
  console.log("\nFormatos:");
  for (const [k, v] of Object.entries(FORMATS)) console.log(`  ${k}  ${v}`);
  console.log("\nPilares (ver pilares.md):");
  for (const [k, v] of Object.entries(PILLARS)) console.log(`  ${k.padEnd(13)} ${v}`);
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
if (pillar) example.pillar = pillar;
mkdirSync(dir, { recursive: true });
writeFileSync(file, JSON.stringify(example, null, 2) + "\n");
console.log(`✓ ${file}${pillar ? `  (pilar: ${pillar})` : ""}`);
if (!pillar) console.log('  ! Sin pilar: agrega "pillar": "problema" | "solucion" | "demostracion" en reel.json.');
console.log("  1. Elige el problema en pilares.md (banco de problemas) y edita gancho, palabra clave, escenas y copy.");
console.log("     Sin precios, plazos ni cifras de resultados.");
console.log("  2. Graba los clips que falten:   npm run record -- <demo>   (npm run record -- --list)");
console.log(`  3. Produce:                      npm run produce -- ${id}`);
console.log(`  4. Previsualiza o edita:         npm run preview -- ${id}`);
