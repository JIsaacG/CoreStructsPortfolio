/**
 * Renders the data in `src/data/` into `index.html`.
 *
 * The cards could just as easily be built in the browser, but rendering them at
 * build time keeps the content in the HTML source: it is indexable, it paints
 * with the first frame, and it survives with JavaScript switched off. Editing
 * `src/data/projects.js` and re-running `npm run build` is the whole workflow.
 *
 * Each region is delimited by `<!-- build:name -->` / `<!-- /build:name -->`,
 * and running twice produces the same file.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { alliances } from "../src/data/alliances.js";
import { mockups } from "../src/data/mockups.js";
import { projects } from "../src/data/projects.js";
import { navigation, site } from "../src/data/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(ROOT, "index.html");
const ISOTYPE = join(ROOT, "assets", "brand", "isotipo.svg");
const TOKENS = join(ROOT, "src", "styles", "tokens.css");

/** Where a card points until a real case study exists. */
const DEFAULT_PROJECT_HREF = "#contacto";

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * `**text**` becomes the lifted phrase inside an alliance paragraph. Applied
 * after escaping, so the data file can never inject markup of its own.
 */
const emphasise = (value) =>
  escape(value).replace(/\*\*(.+?)\*\*/g, '<strong class="alliance__lift">$1</strong>');

/** Read a custom property out of the token sheet, so colours are declared once. */
function token(name) {
  const css = readFileSync(TOKENS, "utf8");
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`tokens.css does not define --${name}`);
  return value;
}

/** Replace the body of a `<!-- build:name -->` region. */
function fill(html, name, content) {
  const region = new RegExp(
    `(<!--\\s*build:${name}\\s*-->)[\\s\\S]*?(<!--\\s*/build:${name}\\s*-->)`,
  );
  if (!region.test(html)) throw new Error(`index.html has no "${name}" build region`);
  return html.replace(region, `$1\n${content.trimEnd()}\n$2`);
}

/* ------------------------------------------------------------------- brand */

/** Pull the gradient defs and face paths out of the generated isotype. */
function readIsotype() {
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
function renderSprite({ defs, paths }) {
  const primary = token("brand-primary");
  const secondary = token("brand-secondary");
  return `    <svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>
        ${defs}
        <linearGradient id="mk-brand-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
        <symbol id="cs-isotipo" viewBox="0 0 362 422">${paths}</symbol>
      </defs>
    </svg>`;
}

function renderHeroMark({ paths }) {
  // Decorative: the wordmark right below it carries the accessible name.
  return `              <svg
                class="hero__mark-svg"
                viewBox="0 0 362 422"
                aria-hidden="true"
                focusable="false"
              >${paths}</svg>`;
}

/* ---------------------------------------------------------------- projects */

const SIZE_CLASS = {
  major: "project-card--major",
  minor: "project-card--minor",
  half: "project-card--half",
  wide: "project-card--wide",
};

/** Opt-in looks. A card takes one only when it opens a demo with a look of its
    own, so the card can preview the page instead of describing it. */
const VARIANT_CLASS = {
  brand: "project-card--brand",
  corporate: "project-card--corporate",
  systems: "project-card--systems",
  landing: "project-card--landing",
};

function renderProject(project) {
  const mockup = mockups[project.mockup];
  if (!mockup) throw new Error(`project "${project.title}" references unknown mockup "${project.mockup}"`);

  const sizeClass = SIZE_CLASS[project.size];
  if (!sizeClass) throw new Error(`project "${project.title}" has unknown size "${project.size}"`);

  const variantClass = project.variant ? VARIANT_CLASS[project.variant] : "";
  if (project.variant && !variantClass) {
    throw new Error(`project "${project.title}" has unknown variant "${project.variant}"`);
  }

  const classes = ["project-card", sizeClass, variantClass, project.offset && "project-card--offset"]
    .filter(Boolean)
    .join(" ");
  const titleId = `proyecto-${project.number}`;

  return `            <article class="${classes}" data-reveal="${escape(project.reveal ?? "far")}">
              <a
                class="project-card__link"
                href="${escape(project.href ?? DEFAULT_PROJECT_HREF)}"
                aria-label="${escape(project.title)} — hablemos de tu proyecto"
                data-pointer-glow
              >
                <div class="project-card__visual">
                  <svg
                    class="mk project-card__mockup"
                    viewBox="0 0 400 250"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                    focusable="false"
                  >${mockup.replace(/\s+/g, " ").trim()}</svg>
                </div>
                <div class="project-card__body">
                  <p class="project-card__meta">
                    <span class="project-card__index">${escape(project.number)}</span>
                    <span class="project-card__category">${escape(project.category)}</span>
                  </p>
                  <h3 class="project-card__title" id="${titleId}">${escape(project.title)}</h3>
                  <p class="project-card__text">${escape(project.description)}</p>
                  <p class="project-card__cta arrow-link">
                    <span class="arrow-link__line" aria-hidden="true"></span>
                    Explorar
                    <span class="arrow-link__arrow" aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </a>
            </article>`;
}

const renderProjects = () =>
  `          <div class="projects__grid">\n${projects.map(renderProject).join("\n")}\n          </div>`;

/* --------------------------------------------------------------- alliances */

/** The scannable index of what the platform covers, held beside the prose. */
const renderScope = (scope = []) =>
  !scope.length
    ? ""
    : `                    <div class="alliance__aside">
                      <p class="alliance__aside-label">Alcance</p>
                      <ul class="alliance__scope">
${scope
  .map((item) => `                        <li class="alliance__scope-item">${escape(item)}</li>`)
  .join("\n")}
                      </ul>
                    </div>`;

/** Only rendered once an alliance has a public URL to point at. */
const renderAllianceLink = (alliance) =>
  !alliance.href
    ? ""
    : `                  <p class="alliance__cta">
                    <a class="arrow-link" href="${escape(alliance.href)}" target="_blank" rel="noopener">
                      <span class="arrow-link__line" aria-hidden="true"></span>
                      Ver la plataforma
                      <span class="arrow-link__arrow" aria-hidden="true">&rarr;</span>
                    </a>
                  </p>`;

function renderAlliance(alliance) {
  const { logo } = alliance;

  const detail = [
    `                    <p class="alliance__text">${emphasise(alliance.description)}</p>`,
    renderScope(alliance.scope),
  ].filter(Boolean);

  const body = [
    `                  <p class="alliance__meta">
                    <span class="alliance__index">${escape(alliance.number)}</span>
                    <span class="alliance__kind">${escape(alliance.kind)}</span>
                  </p>
                  <h3 class="alliance__name">${escape(alliance.name)}</h3>
                  <div class="alliance__detail">
${detail.join("\n")}
                  </div>`,
    renderAllianceLink(alliance),
  ].filter(Boolean);

  return `            <li class="alliance" data-reveal="${escape(alliance.reveal ?? "far")}">
              <article class="alliance__panel" data-pointer-glow>
                <div class="alliance__brand">
                  <div class="alliance__plate">
                    <img
                      class="alliance__logo"
                      src="${escape(logo.src)}"
                      width="${escape(logo.width)}"
                      height="${escape(logo.height)}"
                      alt="${escape(logo.alt)}"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                <span class="alliance__seam" aria-hidden="true"></span>

                <div class="alliance__body">
${body.join("\n")}
                </div>
              </article>
            </li>`;
}

const renderAlliances = () =>
  `          <ul class="alliances__list">\n${alliances.map(renderAlliance).join("\n")}\n          </ul>`;

/* ----------------------------------------------------------------- contact */

const whatsappHref = (number) => `https://wa.me/${String(number).replace(/\D/g, "")}`;

function renderCta() {
  const { email, whatsapp } = site.contact;
  const buttons = [];

  if (email) {
    buttons.push(`            <a class="button button--primary button--large button--pulse" href="mailto:${escape(email)}">
              Hablemos
              <span class="button__arrow" aria-hidden="true">&rarr;</span>
            </a>`);
  }
  if (whatsapp) {
    buttons.push(`            <a
              class="button button--ghost button--large"
              href="${escape(whatsappHref(whatsapp))}"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
              <span class="button__arrow" aria-hidden="true">&rarr;</span>
            </a>`);
  }
  return buttons.join("\n");
}

/** Only channels that actually exist are rendered — no placeholder contacts. */
function renderChannels() {
  const { email, phone, location } = site.contact;
  const channels = [
    email && {
      label: "Correo",
      value: email,
      href: `mailto:${email}`,
    },
    phone && {
      label: "Teléfono",
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
    },
    location && { label: "Cobertura", value: location },
  ].filter(Boolean);

  if (!channels.length) return "";

  return `          <div class="contact__channels" data-reveal="far">
${channels
  .map(({ label, value, href }) => {
    const body = href
      ? `<a class="channel__value" href="${escape(href)}">${escape(value)}</a>`
      : `<span class="channel__value">${escape(value)}</span>`;
    return `            <p class="channel">
              <span class="channel__label">${escape(label)}</span>
              ${body}
            </p>`;
  })
  .join("\n")}
          </div>`;
}

function renderFooterMeta() {
  const links = [
    ...navigation.map((item) => ({ label: item.label, href: `#${item.id}` })),
    ...site.social.map((item) => ({ label: item.label, href: item.href, external: true })),
  ];

  return `        <div class="footer__meta">
${links
  .map(
    ({ label, href, external }) =>
      `          <a class="footer__link" href="${escape(href)}"${
        external ? ' target="_blank" rel="noopener"' : ""
      }>${escape(label)}</a>`,
  )
  .join("\n")}
          <span class="footer__note">
            &copy; <span data-current-year>${new Date().getFullYear()}</span>
            ${escape(site.name)}
          </span>
        </div>`;
}

/* -------------------------------------------------------------------- main */

const isotype = readIsotype();
let html = readFileSync(PAGE, "utf8");

html = fill(html, "sprite", renderSprite(isotype));
html = fill(html, "hero-mark", renderHeroMark(isotype));
html = fill(html, "projects", renderProjects());
html = fill(html, "alliances", renderAlliances());
html = fill(html, "cta", renderCta());
html = fill(html, "channels", renderChannels());
html = fill(html, "footer-meta", renderFooterMeta());

writeFileSync(PAGE, html);

console.log(
  `index.html  ${projects.length} projects · ${alliances.length} alliances · ` +
    `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`,
);
