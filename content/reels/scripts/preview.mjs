#!/usr/bin/env node
/**
 * Abre un video en HyperFrames Studio para revisarlo o ajustarlo.
 *
 *   npm run preview -- R00          # variante Instagram
 *   npm run preview -- R00 tiktok
 *
 * Studio edita el index.html generado; los cambios duraderos van en reel.json
 * (el próximo build reescribe el HTML).
 */
import { build } from "./build.mjs";
import { hf } from "./lib/hf.mjs";

const [id, variant = "ig"] = process.argv.slice(2);
if (!id) {
  console.log("Uso: npm run preview -- <ID> [ig|tiktok]");
  process.exit(1);
}
const { dir } = build(id, variant);
process.exit(hf(["preview", dir]).status ?? 0);
