/**
 * The isotype, in the two shapes a page can need it.
 *
 * It lives here rather than inside `build-content.mjs` because the service
 * pages need the same mark in their header and footer, and a second copy of
 * these twenty lines is a second place for the brand to drift. `build-content`
 * still owns where the mark goes on the home page; this only owns what it is.
 *
 * The source of truth is `assets/brand/isotipo.svg`, which `build-brand.mjs`
 * generates. Nothing here hard-codes a path or a colour: the faces come out of
 * that file and the gradient stops out of `tokens.css`.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const ISOTYPE = join(ROOT, "assets", "brand", "isotipo.svg");
const TOKENS = join(ROOT, "src", "styles", "tokens.css");

/** Read a custom property out of the token sheet, so colours are declared once. */
export function token(name) {
  const css = readFileSync(TOKENS, "utf8");
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`tokens.css does not define --${name}`);
  return value;
}

/** Pull the gradient defs and face paths out of the generated isotype. */
export function readIsotype() {
  const svg = readFileSync(ISOTYPE, "utf8");
  const defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
  const paths = svg.match(/<path[\s\S]*?\/>/g)?.join("");
  if (!defs || !paths) throw new Error("assets/brand/isotipo.svg is not in the expected shape");
  return { defs, paths };
}

/**
 * One hidden SVG holds every shared definition. The header and footer reference
 * the symbol with <use>; the hero cannot, because CSS does not cross into a
 * <use> shadow tree and the hero animates each face separately.
 */
export function renderSprite({ defs, paths }, indent = "    ") {
  const primary = token("brand-primary");
  const secondary = token("brand-secondary");
  return `${indent}<svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0">
${indent}  <defs>
${indent}    ${defs}
${indent}    <linearGradient id="mk-brand-gradient" x1="0" y1="0" x2="1" y2="1">
${indent}      <stop offset="0%" stop-color="${primary}" />
${indent}      <stop offset="100%" stop-color="${secondary}" />
${indent}    </linearGradient>
${indent}    <symbol id="cs-isotipo" viewBox="0 0 362 422">${paths}</symbol>
${indent}  </defs>
${indent}</svg>`;
}

/** The hero's own copy of the faces, animated individually. */
export function renderHeroMark({ paths }) {
  // Decorative: the wordmark right below it carries the accessible name.
  return `              <svg
                class="hero__mark-svg"
                viewBox="0 0 362 422"
                aria-hidden="true"
                focusable="false"
              >${paths}</svg>`;
}
