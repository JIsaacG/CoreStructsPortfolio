/**
 * The chrome every Aurelis page carries: document head, header with its mega
 * menus, the mobile panel, the footer, and the badge that keeps the fiction
 * honest.
 *
 * All of it is emitted at build time. A visitor gets real HTML with the
 * navigation already in it — nothing here waits for JavaScript to exist.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { company, footer, navigation, routes } from "../../src/data/aurelis/company.js";
import { services } from "../../src/data/aurelis/services.js";
import { industries } from "../../src/data/aurelis/industries.js";
import { products } from "../../src/data/aurelis/products.js";
import { projects } from "../../src/data/aurelis/projects.js";
import { asset, escape, figure, page, sub } from "./blocks.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * The domain the canonical and Open Graph tags are written against.
 *
 * `.example` is the TLD reserved for documentation, which is exactly what this
 * is: the tags demonstrate the structure a real deployment needs, without
 * claiming a domain that does not belong to anyone. Replace this one constant
 * and every page's canonical, OG and JSON-LD follow.
 */
export const ORIGIN = "https://www.aurelisgroup.example";

/* ------------------------------------------------------------------- head */

/**
 * `<head>`, complete: metadata, social cards, the preloaded typeface, the
 * structured data for the page, and the pre-paint script that lets the reveal
 * system hide content only when it can be trusted to show it again.
 */
export function head(ctx, meta) {
  const title = `${meta.title} · ${company.full}`;
  const description = meta.description.replace(/\s+/g, " ").trim().slice(0, 300);
  const canonical = `${ORIGIN}/${meta.canonical ?? ""}`;

  const schema = [organizationSchema(), ...(meta.schema ?? [])];

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${escape(canonical)}" />

    <!-- Aurelis Group is invented. A demonstration company must never reach a
         search result as a real one, so every page of the portal is noindex. -->
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#0b0d10" />
    <meta name="color-scheme" content="light" />

    <meta property="og:type" content="${escape(meta.ogType ?? "website")}" />
    <meta property="og:site_name" content="${escape(company.full)}" />
    <meta property="og:locale" content="es_HN" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${escape(canonical)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />

    <link rel="icon" href="${asset(ctx, "favicon.ico")}" sizes="32x32" />

    <link
      rel="preload"
      href="${asset(ctx, "assets/fonts/manrope-latin.woff2")}"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <link rel="stylesheet" href="${asset(ctx, "dist/aurelis.css")}" />

    <script type="application/ld+json">
${JSON.stringify(schema.length === 1 ? schema[0] : schema, null, 6).replace(/^/gm, "      ")}
    </script>

    <!-- Marks the document scripted before first paint so the reveal system may
         hide what it is about to animate, and un-marks it if the behaviour
         module never loads — nothing is ever left invisible. -->
    <script>
      document.documentElement.classList.add("js");
      setTimeout(function () {
        if (!document.documentElement.dataset.revealsReady) {
          document.documentElement.classList.remove("js");
        }
      }, 2500);
    </script>`;
}

/* --------------------------------------------------------- structured data */

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.full,
    legalName: company.legalName,
    url: `${ORIGIN}/`,
    foundingDate: company.founded,
    description: company.summary,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard Morazán 1420",
      addressLocality: "Tegucigalpa",
      addressCountry: "HN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+504 2200 4100",
      email: "contacto@aurelisgroup.demo",
      availableLanguage: ["es", "en"],
    },
  };
}

export const breadcrumbSchema = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${ORIGIN}/${item.path ?? ""}`,
  })),
});

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

/* ----------------------------------------------------------------- header */

/**
 * The mega panels.
 *
 * Two sections earn one — the two a visitor browses rather than looks up. Each
 * is an index of that section plus one featured item with a plate, so the menu
 * is not a wall of links.
 */
function megaPanels(ctx) {
  const column = (heading, links) =>
    `<div class="au-mega__col"><p class="au-mega__heading">${escape(heading)}</p>` +
    links
      .map(
        (item) =>
          `<a class="au-mega__link" href="${escape(item.href)}">` +
          `<span class="au-mega__name">${item.index ? `<b>${escape(item.index)}</b>` : ""}` +
          `${escape(item.label)}</span>` +
          `${item.text ? `<span class="au-mega__text">${escape(item.text)}</span>` : ""}</a>`,
      )
      .join("") +
    `</div>`;

  const feature = (title, text, target, plateKey, caption) =>
    `<div class="au-mega__feature">${figure(plateKey, caption, { reveal: false, ratio: "" })}` +
    `<p class="au-mega__feature-title">${escape(title)}</p>` +
    `<p class="au-mega__text">${escape(text)}</p>` +
    `<a class="au-link" href="${escape(target)}">Ver más</a></div>`;

  const serviceLinks = services.map((service) => ({
    index: service.index,
    label: service.title,
    text: service.kicker,
    href: sub(ctx, "servicios", service.slug),
  }));

  const industryLinks = industries.map((industry) => ({
    index: industry.index,
    label: industry.name,
    href: `${page(ctx, "industrias")}#${industry.id}`,
  }));

  const featured = projects.find((project) => project.featured);

  const panel = (id, inner) =>
    `      <div class="au-mega" id="au-mega-${id}" data-mega-panel="${id}" hidden>
        <div class="au-mega__inner">${inner}</div>
      </div>`;

  return [
    panel(
      "soluciones",
      column("Capacidades", serviceLinks.slice(0, 3)) +
        column(" ", serviceLinks.slice(3)) +
        column("Por industria", industryLinks) +
        feature(
          featured.title,
          featured.summary,
          sub(ctx, "proyectos", featured.slug),
          featured.plate,
          "Caso de éxito",
        ),
    ),
    panel(
      "productos",
      column(
        "Catálogo",
        products.slice(0, 3).map((product) => ({
          index: product.index,
          label: product.name,
          text: product.family,
          href: sub(ctx, "productos", product.slug),
        })),
      ) +
        column(
          " ",
          products.slice(3).map((product) => ({
            index: product.index,
            label: product.name,
            text: product.family,
            href: sub(ctx, "productos", product.slug),
          })),
        ) +
        column("Servicios", [
          { label: "Todas las capacidades", href: page(ctx, "servicios") },
          { label: "Operación y mantenimiento", href: sub(ctx, "servicios", "operacion-y-mantenimiento") },
          { label: "Sistemas y equipamiento", href: sub(ctx, "servicios", "sistemas-y-equipamiento") },
          { label: "Solicitar cotización", href: page(ctx, "contacto", "formulario") },
        ]) +
        feature(
          products[0].name,
          products[0].summary,
          sub(ctx, "productos", products[0].slug),
          products[0].plate,
          products[0].family,
        ),
    ),
    panel(
      "industrias",
      column("Industrias", industryLinks.slice(0, 3)) +
        column(" ", industryLinks.slice(3)) +
        column("Proyectos", [
          { label: "Todos los proyectos", href: page(ctx, "proyectos") },
          ...projects
            .filter((project) => project.slug)
            .map((project) => ({
              label: project.client,
              text: project.industry,
              href: sub(ctx, "proyectos", project.slug),
            })),
        ]) +
        feature(
          "Análisis e informes",
          "Publicaciones del equipo técnico sobre capacidad, continuidad y medición.",
          page(ctx, "recursos"),
          "report",
          "Recursos",
        ),
    ),
  ].join("\n");
}

/** The logotype: a drawn mark plus letterspaced caps and a descriptor. */
export function logo(ctx, { footer: inFooter = false } = {}) {
  const mark =
    `<svg class="au-logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false" ` +
    `fill="none" stroke="currentColor" stroke-width="1.6">` +
    /* An A cut from a prism: two rising strokes, a bar, and a corner tick. The
       mark has to survive being 20px tall in a browser tab. */
    `<path d="M4 27 16 4l12 23"/><path d="M9.4 18.5h13.2"/>` +
    `<path d="M16 4v23" stroke-opacity="0.35"/></svg>`;

  return (
    `<a class="au-logo" href="${page(ctx, "home")}"${inFooter ? "" : ' aria-label="Aurelis Group, inicio"'}>` +
    mark +
    `<span class="au-logo__type"><span class="au-logo__name">${escape(company.name)} ` +
    `<span style="opacity:.55">${escape(company.suffix)}</span></span>` +
    `<span class="au-logo__sub">${escape(company.descriptor)}</span></span></a>`
  );
}

const CARET =
  '<svg class="au-nav__caret" viewBox="0 0 12 8" aria-hidden="true" focusable="false" ' +
  'fill="none" stroke="currentColor" stroke-width="1.6"><path d="m1 2 5 5 5-5"/></svg>';

export function header(ctx, current) {
  const items = navigation
    .map((item) => {
      const isCurrent = item.route === current;
      const target = page(ctx, item.route);
      /* The label stays a real link and the disclosure is its own control: with
         no JavaScript the section index is one click away, and with a keyboard
         the panel is one key away. */
      const disclosure = item.mega
        ? `<button class="au-nav__disc" type="button" aria-expanded="false" ` +
          `aria-controls="au-mega-${item.mega}" aria-label="Abrir el menú de ${escape(item.label)}" ` +
          `data-mega-toggle="${item.mega}">${CARET}</button>`
        : "";

      return (
        `          <li class="au-nav__item"${item.mega ? ` data-mega-item="${item.mega}"` : ""}` +
        `${isCurrent ? ' aria-current="true"' : ""}>` +
        `<a class="au-nav__link" href="${target}"${isCurrent ? ' aria-current="page"' : ""}>` +
        `${escape(item.label)}</a>${disclosure}</li>`
      );
    })
    .join("\n");

  return `    <header class="au-header" data-header>
      <div class="au-header__bar">
${logo(ctx)}
        <nav class="au-nav" aria-label="Principal">
          <ul class="au-nav__list">
${items}
          </ul>
        </nav>

        <div class="au-header__end">
          <a class="au-header__contact" href="${page(ctx, "contacto")}">Contacto</a>
          <a class="au-btn au-btn--gold au-header__cta" href="${page(ctx, "contacto", "formulario")}">
            Hablar con un especialista
          </a>
          <button
            class="au-burger"
            type="button"
            aria-expanded="false"
            aria-controls="au-panel"
            aria-label="Abrir el menú"
            data-panel-toggle
          >
            <span class="au-burger__bar"></span>
            <span class="au-burger__bar"></span>
          </button>
        </div>
      </div>

${megaPanels(ctx)}
    </header>

${mobilePanel(ctx)}`;
}

/** The narrow-viewport menu: the whole site map, one level deep. */
function mobilePanel(ctx) {
  const group = (item) => {
    const subLinks =
      item.mega === "soluciones"
        ? services.map((service) => ({
            label: service.title,
            href: sub(ctx, "servicios", service.slug),
          }))
        : item.mega === "productos"
          ? products.map((product) => ({
              label: product.name,
              href: sub(ctx, "productos", product.slug),
            }))
          : item.mega === "industrias"
            ? industries.map((industry) => ({
                label: industry.name,
                href: `${page(ctx, "industrias")}#${industry.id}`,
              }))
            : [];

    return (
      `      <div class="au-panel__group">` +
      `<a class="au-panel__link" href="${page(ctx, item.route)}">${escape(item.label)}` +
      `<b>${escape(String(navigation.indexOf(item) + 1).padStart(2, "0"))}</b></a>` +
      (subLinks.length
        ? `<div class="au-panel__sub">${subLinks
            .map((link) => `<a href="${escape(link.href)}">${escape(link.label)}</a>`)
            .join("")}</div>`
        : "") +
      `</div>`
    );
  };

  return `    <div class="au-panel" id="au-panel" data-panel>
${navigation.map(group).join("\n")}
      <div class="au-panel__actions">
        <a class="au-btn au-btn--gold" href="${page(ctx, "contacto", "formulario")}">Hablar con un especialista</a>
        <a class="au-btn" href="${page(ctx, "contacto")}">Contacto</a>
      </div>
    </div>`;
}

/* ----------------------------------------------------------------- footer */

export function siteFooter(ctx) {
  const columns = footer.columns
    .map(
      (column) =>
        `          <div class="au-footer__col"><p class="au-footer__heading">${escape(column.heading)}</p>` +
        column.links
          .map(
            (link) =>
              `<a class="au-footer__link" href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`,
          )
          .join("") +
        `</div>`,
    )
    .join("\n");

  const legalBlock = footer.legalBlock
    .map(
      (item) =>
        `<div><dt>${escape(item.term)}</dt><dd>${escape(item.detail)}</dd></div>`,
    )
    .join("");

  const legalLinks = footer.legalLinks
    .map((item) => `<a href="#${escape(item.hash)}">${escape(item.label)}</a>`)
    .join("");

  return `      <footer class="au-footer">
        <div class="au-shell">
          <div class="au-footer__top">
            <div class="au-footer__brand">
${logo(ctx, { footer: true })}
              <p class="au-footer__pitch">${escape(footer.pitch)}</p>
            </div>
${columns}
          </div>

          <dl class="au-footer__legalblock">${legalBlock}</dl>

          <!-- The legal pages a corporate site is required to carry. In the demo
               they resolve to this notice; in a deployment each becomes a page. -->
          <div class="au-footer__legalblock" id="aviso">
            <div>
              <dt>Aviso de la demostración</dt>
              <dd>
                Aurelis Group es una empresa ficticia. Los datos, cifras, clientes,
                certificaciones y proyectos de este sitio son material de demostración
                creado por CoreStruct. Privacidad, cookies, términos y accesibilidad
                apuntan a este aviso porque en la demo no existen esas páginas; la
                arquitectura está preparada para alojarlas.
              </dd>
            </div>
          </div>

          <div class="au-footer__bottom">
            <p>&copy; <span data-current-year>2026</span> ${escape(company.legalName)}. Empresa ficticia · demostración.</p>
            <nav class="au-footer__legal" aria-label="Legal">${legalLinks}</nav>
            <nav class="au-footer__social" aria-label="Redes">
              <a href="${page(ctx, "contacto")}">LinkedIn</a>
            </nav>
          </div>
        </div>
      </footer>`;
}

/* ------------------------------------------------------------------ badge */

/** The CoreStruct isotype, for the badge that credits the demo. */
function isotype() {
  const svg = readFileSync(join(ROOT, "assets", "brand", "isotipo.svg"), "utf8");
  const defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1] ?? "";
  const paths = svg.match(/<path[\s\S]*?\/>/g)?.join("") ?? "";
  return {
    defs: defs.replace(/\s+/g, " ").trim(),
    paths: paths.replace(/\s+/g, " ").trim(),
  };
}

const MARK = isotype();

/**
 * The one element on the page that is not part of the fiction: a permanent,
 * fixed credit saying the company is invented and who built the page.
 */
export function badge(ctx) {
  return `    <svg class="au-sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>${MARK.defs}</defs>
    </svg>

    <a class="au-badge" href="${asset(ctx, "index.html")}#proyectos">
      <svg class="au-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${MARK.paths}</svg>
      <span class="au-badge__tag">Demo</span>
      <span class="au-badge__label">Empresa ficticia<span class="au-badge__more"> · sitio de ejemplo de CoreStruct</span></span>
    </a>`;
}

/* ------------------------------------------------------------------- page */

/** Assemble a complete document. */
export function document_({ ctx, meta, current, body, dark = false }) {
  void dark;
  return `<!doctype html>
<html lang="es">
  <head>
${head(ctx, meta)}
  </head>

  <body>
    <a class="au-skip" href="#contenido">Saltar al contenido</a>

${badge(ctx)}

${header(ctx, current)}

    <main id="contenido">
${body}
    </main>

${siteFooter(ctx)}

    <script type="module" src="${asset(ctx, "src/scripts/aurelis/main.js")}"></script>
  </body>
</html>
`;
}

export { routes };
