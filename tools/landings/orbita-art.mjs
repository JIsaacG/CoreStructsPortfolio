/**
 * Orbita — the product renders.
 *
 * A catalogue without pictures is a price list, and stock photography of real
 * hardware would put other companies' products on an invented distributor's
 * page. So every device on this landing is drawn: twelve technical renders on a
 * shared 160×120 box, with a shared palette and a shared light direction, which
 * is what makes eight different products look like one catalogue.
 *
 * The drawings read CSS custom properties (`--ink`, `--panel`, `--blue`), so a
 * render on the white catalogue and the same render on the black B2B band pick
 * up their surroundings instead of needing a second copy.
 */

import { escape } from "./shell.mjs";

/* Shared paint. Screens carry the accent so the eye lands on them first. */
const BODY = 'fill="var(--render-body)" stroke="var(--render-line)" stroke-width="1.4" stroke-linejoin="round"';
const DEEP = 'fill="var(--render-deep)" stroke="var(--render-line)" stroke-width="1.4" stroke-linejoin="round"';
const SCREEN = 'fill="var(--render-screen)"';
const LINE = 'fill="none" stroke="var(--render-line)" stroke-width="1.4" stroke-linecap="round"';
const SOFT = 'fill="none" stroke="var(--render-soft)" stroke-width="1.4" stroke-linecap="round"';

const RENDERS = {
  laptop: `
    <rect x="34" y="20" width="92" height="58" rx="4" ${BODY}/>
    <rect x="40" y="26" width="80" height="46" rx="2" ${SCREEN}/>
    <path d="M46 62h24M46 55h44M46 48h30" ${SOFT}/>
    <path d="M22 78h116l6 12a3 3 0 0 1-3 4H19a3 3 0 0 1-3-4Z" ${DEEP}/>
    <path d="M66 86h28" ${LINE}/>`,

  monitor: `
    <rect x="20" y="14" width="120" height="72" rx="4" ${BODY}/>
    <rect x="26" y="20" width="108" height="60" rx="2" ${SCREEN}/>
    <path d="M34 68h30M34 58h56M34 48h40" ${SOFT}/>
    <path d="M72 86h16v10H72Z" ${DEEP}/>
    <path d="M56 100h48" stroke-width="4" stroke-linecap="round" fill="none" stroke="var(--render-line)"/>`,

  printer: `
    <path d="M40 18h80v22H40Z" ${DEEP}/>
    <rect x="26" y="40" width="108" height="44" rx="5" ${BODY}/>
    <rect x="96" y="50" width="26" height="12" rx="2" ${SCREEN}/>
    <path d="M38 74h44" ${SOFT}/>
    <path d="M46 84h68v14H46Z" ${DEEP}/>
    <path d="M56 18h48v10H56Z" fill="var(--render-paper)" stroke="var(--render-line)" stroke-width="1.4"/>`,

  router: `
    <rect x="30" y="56" width="100" height="30" rx="6" ${BODY}/>
    <path d="M46 46v-18M80 42v-24M114 46v-18" ${LINE}/>
    <circle cx="46" cy="26" r="3.5" fill="var(--render-line)"/>
    <circle cx="80" cy="16" r="3.5" fill="var(--render-line)"/>
    <circle cx="114" cy="26" r="3.5" fill="var(--render-line)"/>
    <circle cx="46" cy="71" r="4" fill="var(--render-screen)"/>
    <circle cx="60" cy="71" r="4" fill="var(--render-screen)" opacity="0.55"/>
    <circle cx="74" cy="71" r="4" fill="var(--render-screen)" opacity="0.3"/>
    <path d="M96 71h24" ${SOFT}/>`,

  projector: `
    <rect x="24" y="34" width="104" height="46" rx="8" ${BODY}/>
    <circle cx="56" cy="57" r="15" ${DEEP}/>
    <circle cx="56" cy="57" r="8" ${SCREEN}/>
    <path d="M96 48h20M96 58h20M96 68h12" ${SOFT}/>
    <path d="M136 40l14-10M136 57h18M136 74l14 10" ${SOFT}/>
    <path d="M46 80v8M112 80v8" ${LINE}/>`,

  ups: `
    <rect x="24" y="34" width="112" height="52" rx="4" ${BODY}/>
    <rect x="34" y="44" width="40" height="22" rx="2" ${SCREEN}/>
    <path d="M42 76h22" ${SOFT}/>
    <circle cx="96" cy="55" r="7" ${LINE}/>
    <circle cx="118" cy="55" r="7" ${LINE}/>
    <path d="M92 76h32" ${SOFT}/>
    <path d="M52 30l-6-14h10l-4-10" fill="none" stroke="var(--render-screen)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,

  camera: `
    <path d="M36 74a44 44 0 0 1 88 0Z" ${BODY}/>
    <path d="M30 74h100" ${LINE}/>
    <circle cx="80" cy="56" r="17" ${DEEP}/>
    <circle cx="80" cy="56" r="9" ${SCREEN}/>
    <circle cx="86" cy="50" r="2.6" fill="var(--render-paper)"/>
    <path d="M80 74v14" ${LINE}/>
    <path d="M62 92h36" stroke-width="4" stroke-linecap="round" fill="none" stroke="var(--render-line)"/>`,

  chair: `
    <path d="M54 14h50a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H54a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z" ${BODY}/>
    <path d="M58 26h42M58 36h28" ${SOFT}/>
    <path d="M50 58h58a6 6 0 0 1 6 6v6a4 4 0 0 1-4 4H48a4 4 0 0 1-4-4v-6a6 6 0 0 1 6-6Z" ${DEEP}/>
    <path d="M79 74v14" ${LINE}/>
    <path d="M56 100l23-12 23 12M79 88v10" ${LINE}/>
    <circle cx="56" cy="101" r="3" fill="var(--render-line)"/>
    <circle cx="102" cy="101" r="3" fill="var(--render-line)"/>
`,

  accessory: `
    <rect x="20" y="52" width="60" height="34" rx="4" ${BODY}/>
    <path d="M28 60h44M28 68h44M28 76h26" ${SOFT}/>
    <path d="M104 40c10 0 18 9 18 20v14c0 7-8 12-18 12s-18-5-18-12V60c0-11 8-20 18-20Z" ${BODY}/>
    <path d="M104 42v16" ${LINE}/>
    <circle cx="104" cy="64" r="3" fill="var(--render-screen)"/>`,

  phone: `
    <rect x="58" y="12" width="44" height="86" rx="8" ${BODY}/>
    <rect x="63" y="20" width="34" height="70" rx="4" ${SCREEN}/>
    <path d="M72 30h16M70 42h20M70 52h14" ${SOFT}/>
    <path d="M74 16h12" ${LINE}/>`,

  desktop: `
    <rect x="40" y="40" width="80" height="42" rx="6" ${BODY}/>
    <circle cx="56" cy="61" r="5" fill="var(--render-screen)"/>
    <path d="M72 55h34M72 61h34M72 67h22" ${SOFT}/>
    <path d="M46 82v8M114 82v8" ${LINE}/>
    <path d="M52 30h56" ${SOFT}/>`,

  aio: `
    <rect x="26" y="16" width="108" height="62" rx="4" ${BODY}/>
    <rect x="32" y="22" width="96" height="50" rx="2" ${SCREEN}/>
    <path d="M40 60h24M40 50h48M40 40h34" ${SOFT}/>
    <path d="M62 78h36l10 20H52Z" ${DEEP}/>`,

  shield: `
    <path d="M80 16l40 14v26c0 22-16 38-40 46-24-8-40-24-40-46V30Z" ${BODY}/>
    <path d="M62 60l14 14 24-28" fill="none" stroke="var(--render-screen)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,

  truck: `
    <path d="M14 34h68v40H14Z" ${BODY}/>
    <path d="M82 46h26l16 18v10H82Z" ${DEEP}/>
    <path d="M8 74h140" ${LINE}/>
    <circle cx="44" cy="82" r="9" ${BODY}/>
    <circle cx="106" cy="82" r="9" ${BODY}/>
    <path d="M22 46h32M22 56h20" ${SOFT}/>`,

  advice: `
    <path d="M22 22h74a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H52L34 88V72h-12a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8Z" ${BODY}/>
    <path d="M34 40h48M34 52h30" ${SOFT}/>
    <circle cx="122" cy="40" r="18" fill="var(--render-screen)"/>
    <path d="M116 40l5 5 10-11" fill="none" stroke="var(--render-paper)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,

  b2b: `
    <rect x="16" y="34" width="48" height="52" rx="4" ${BODY}/>
    <rect x="96" y="20" width="48" height="66" rx="4" ${DEEP}/>
    <path d="M26 46h12M26 58h12M26 70h12" ${SOFT}/>
    <path d="M106 32h12M106 44h12M106 56h12M106 68h12" ${SOFT}/>
    <path d="M64 60h32" fill="none" stroke="var(--render-screen)" stroke-width="3" stroke-linecap="round"/>
    <path d="M88 54l8 6-8 6" fill="none" stroke="var(--render-screen)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
};

/**
 * One product render.
 * @param {string} kind key of RENDERS
 * @param {string} [className] extra class for the wrapper
 */
export function render(kind, className = "") {
  const art = RENDERS[kind];
  if (!art) throw new Error(`orbita: unknown render "${kind}"`);
  return `<svg class="ob-render${className ? ` ${className}` : ""}" viewBox="0 0 160 112" aria-hidden="true" focusable="false">${art}</svg>`;
}

/**
 * The hero showcase: four devices at different depths with a label pinned to
 * each. The depths are what the pointer parallax multiplies, so the composition
 * separates as the cursor moves instead of sliding as one picture.
 */
export function showcase(tags) {
  const pieces = tags
    .map(
      (tag) => `          <div
            class="ob-showcase__piece ob-showcase__piece--${escape(tag.art)}"
            style="--x: ${tag.x}%; --y: ${tag.y}%; --depth: ${tag.depth}"
          >
            ${render(tag.art)}
            <span class="ob-showcase__tag">${escape(tag.label)}</span>
          </div>`,
    )
    .join("\n");

  return `      <div class="ob-showcase" data-parallax>
        <div class="ob-showcase__stage">
          <div class="ob-showcase__hero-piece" style="--depth: 1">
            ${render("laptop", "ob-render--hero")}
          </div>
${pieces}
        </div>
      </div>`;
}

/** A brand plate: an invented wordmark on a neutral tile. */
export function brandPlate(name) {
  return `            <li class="ob-plate">
              <span class="ob-plate__dot" aria-hidden="true"></span>
              ${escape(name)}
            </li>`;
}
