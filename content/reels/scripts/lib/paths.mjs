/**
 * Rutas compartidas de la máquina de Reels.
 * Todo se resuelve desde aquí para que los scripts funcionen sin importar
 * desde qué carpeta se llamen.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REELS = resolve(join(dirname(fileURLToPath(import.meta.url)), "..", ".."));
export const SITE = resolve(REELS, "..", "..");
export const TEMPLATES = join(REELS, "templates");
export const SHARED = join(TEMPLATES, "_shared");
export const VIDEOS = join(REELS, "videos");
export const OUT = join(REELS, "out");
export const RAW = join(REELS, "raw");
export const CLIPS = join(RAW, "clips");
export const TMP = join(REELS, "tmp");
export const BRAND = join(REELS, "brand", "FORMATOS_PNG");

/** Carpeta de cada formato. La letra es lo que se escribe en reel.json. */
export const FORMATS = {
  A: "A-demo-scroll",
  B: "B-problema-solucion",
  C: "C-antes-despues",
  D: "D-caso-real",
  E: "E-talking-head",
};

/**
 * Pilares de contenido para conseguir contratos (ver pilares.md).
 * Cada video pertenece a uno; se rotan y se miden por separado.
 */
export const PILLARS = {
  problema: "Problema · nombra el dolor y las señales (patrón: «Cinco señales de que…»)",
  solucion: "Solución · enseña cómo se resuelve (patrón: «Así puedes…»)",
  demostracion: "Demostración · antes y después del proceso digitalizado",
};
/** Formato sugerido por pilar cuando no se indica uno. */
export const PILLAR_FORMAT = { problema: "B", solucion: "A", demostracion: "C" };

/** El sitio se sirve con `npm run serve` (raíz del repo). */
export const BASE_URL = process.env.REELS_BASE_URL || "http://localhost:4173";
