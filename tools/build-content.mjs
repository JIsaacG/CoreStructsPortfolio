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

import { readIsotype, renderHeroMark, renderSprite, token } from "./lib/brand.mjs";
import { alliances } from "../src/data/alliances.js";
import { mockups } from "../src/data/mockups.js";
import { projects } from "../src/data/projects.js";
import { navigation, site } from "../src/data/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(ROOT, "index.html");

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

/** Replace the body of a `<!-- build:name -->` region. */
function fill(html, name, content) {
  const region = new RegExp(
    `(<!--\\s*build:${name}\\s*-->)[\\s\\S]*?(<!--\\s*/build:${name}\\s*-->)`,
  );
  if (!region.test(html)) throw new Error(`index.html has no "${name}" build region`);
  return html.replace(region, `$1\n${content.trimEnd()}\n$2`);
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
                    ${escape(project.cta ?? "Explorar")}
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

/**
 * The number as a person reads it, derived from the digits rather than stored
 * twice — `site.js` holds the one form WhatsApp accepts, and a second, prettier
 * copy of the same number is exactly the kind of pair that drifts apart.
 *
 * Same split as the quote panel: everything past the last eight digits is the
 * country code, and the eight are the local number.
 */
function whatsappShown(number) {
  const digits = String(number).replace(/\D/g, "");
  return digits.length > 10
    ? `+${digits.slice(0, -8)} ${digits.slice(-8, -4)}-${digits.slice(-4)}`
    : `+${digits}`;
}

/**
 * The contact CTA.
 *
 * It stays an `<a>` with a real destination rather than becoming a `<button>`,
 * because the quote panel is an enhancement: `src/scripts/cotizador.js` claims
 * anything carrying `data-cotizador` and opens the form over the page instead,
 * and where the script has not run the same click still reaches the studio —
 * WhatsApp once the number is filled in, the inbox until then.
 */
function renderCta() {
  const { email, whatsapp } = site.contact;
  const fallback = whatsapp ? whatsappHref(whatsapp) : email ? `mailto:${email}` : null;
  if (!fallback) return "";

  const external = whatsapp ? `\n              target="_blank"\n              rel="noopener"` : "";

  return `            <a
              class="button button--primary button--large button--pulse"
              href="${escape(fallback)}"${external}
              data-cotizador
            >
              Hablemos
              <span class="button__arrow" aria-hidden="true">&rarr;</span>
            </a>`;
}

/** Only channels that actually exist are rendered — no placeholder contacts. */
function renderChannels() {
  const { email, emails = [], phone, whatsapp, location } = site.contact;
  const channels = [
    whatsapp && {
      label: "WhatsApp",
      value: whatsappShown(whatsapp),
      href: whatsappHref(whatsapp),
    },
    email && {
      label: "Correo",
      value: email,
      href: `mailto:${email}`,
    },
    ...emails.map((address) => ({
      label: "Correo",
      value: address,
      href: `mailto:${address}`,
    })),
    phone && {
      label: "Teléfono",
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
    },
    /* "Cobertura" rather than "Dirección": the value names the base city and
       the reach in one breath, and labelling it as an address would promise a
       street number the studio does not publish. It is also the only visible
       copy that matches the `address` in the JSON-LD — structured data that
       claims a city the page never mentions is the kind of mismatch Google
       discounts, so this row is what keeps that claim honest. */
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
    ...navigation.map((item) => ({ label: item.label, href: item.href ?? `#${item.id}` })),
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

/* --------------------------------------------------------------- manifesto */

/**
 * The closing statement, one `<span>` per word so the reveal can bring it in a
 * word at a time.
 *
 * The split happens here rather than in the markup because the sentence is not
 * the same length in every language: Spanish takes thirteen words to say it and
 * English eleven, so a hand-written set of spans would have to be maintained
 * twice and would drift the first time either sentence was edited.
 */
function renderManifesto() {
  const { quote, attribution } = site.manifesto;

  // `**…**` marks the run set in the contrasting face. Splitting on it first
  // means every word inside the run is lifted, not just the two that carry the
  // asterisks, and each word still gets its own span for the animation.
  const words = quote
    .split(/\*\*(.+?)\*\*/g)
    .flatMap((part, index) => {
      const lifted = index % 2 === 1;
      return part
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `<span>${lifted ? `<em>${escape(word)}</em>` : escape(word)}</span>`);
    })
    .join(" ");

  return `          <h2 class="manifesto__quote reveal-words" id="manifesto-quote">
            ${words}
          </h2>
          <p class="manifesto__attribution" data-reveal="fade">
            ${escape(attribution)}
          </p>`;
}

/* -------------------------------------------------------------------- main */

const isotype = readIsotype();
let html = readFileSync(PAGE, "utf8");

html = fill(html, "sprite", renderSprite(isotype));
html = fill(html, "hero-mark", renderHeroMark(isotype));
html = fill(html, "projects", renderProjects());
html = fill(html, "alliances", renderAlliances());
html = fill(html, "manifesto", renderManifesto());
html = fill(html, "cta", renderCta());
html = fill(html, "channels", renderChannels());
html = fill(html, "footer-meta", renderFooterMeta());

writeFileSync(PAGE, html);

console.log(
  `index.html  ${projects.length} projects · ${alliances.length} alliances · ` +
    `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`,
);
