/**
 * Every page of the portal that is not the home page.
 *
 * Six index pages, four families of detail page, the company page and contact.
 * They share one construction — a dark page header with breadcrumbs, then
 * zones, then the closing call to action — so a visitor who arrives on a
 * product sheet from a search result is in the same building as one who came
 * through the front door.
 */

import {
  certifications,
  company,
  contact as contactData,
  governance,
  history,
  leadership,
  sustainability,
  values,
} from "../../src/data/aurelis/company.js";
import { cta as homeCta } from "../../src/data/aurelis/home.js";
import { industries, industriesIntro } from "../../src/data/aurelis/industries.js";
import { insights, insightsIntro } from "../../src/data/aurelis/insights.js";
import { products, productsIntro } from "../../src/data/aurelis/products.js";
import { projects, projectsIntro, byId as projectById } from "../../src/data/aurelis/projects.js";
import { services, servicesIntro, byId as serviceById } from "../../src/data/aurelis/services.js";
import { closingCta } from "./home.mjs";
import {
  arrowLink,
  block,
  bullets,
  button,
  crumbs,
  escape,
  faq,
  figure,
  head,
  metrics,
  page,
  plate,
  prose,
  quote,
  results,
  steps,
  sub,
} from "./blocks.mjs";
import { breadcrumbSchema, faqSchema, ORIGIN } from "./shell.mjs";

/* -------------------------------------------------------------- page header */

/**
 * The dark band every interior page opens with.
 * `facts` is the row of definition pairs that turns a header into a record.
 */
function pageHead(ctx, { trail, label, title, lead, plate: plateKey, facts }) {
  return `      <section class="au-pagehead au-dark">
        <div class="au-pagehead__backdrop">${plate(plateKey, { reveal: false })}</div>
        <div class="au-pagehead__scrim"></div>
        <div class="au-pagehead__body">
          ${crumbs(ctx, trail)}
          ${label ? `<p class="au-tag au-tag--accent">${escape(label)}</p>` : ""}
          <h1 class="au-h1 au-pagehead__title">${escape(title)}</h1>
          ${lead ? `<p class="au-lead au-pagehead__lead">${escape(lead)}</p>` : ""}
          ${
            facts && facts.length
              ? `<dl class="au-pagehead__meta">${facts
                  .map(
                    (fact) =>
                      `<div class="au-pagehead__fact"><dt>${escape(fact.term)}</dt>` +
                      `<dd>${escape(fact.value)}</dd></div>`,
                  )
                  .join("")}</dl>`
              : ""
          }
        </div>
      </section>`;
}

const shell = (inner, extra = "") =>
  `      <section class="au-section${extra ? ` ${extra}` : ""}">
        <div class="au-shell">
${inner}
        </div>
      </section>`;

const crumbHome = { label: "Inicio", route: "home" };

/* =========================================================== index: servicios */

export function servicesIndex(ctx) {
  const rows = services
    .map(
      (service) => `          <a class="au-entry" href="${sub(ctx, "servicios", service.slug)}" data-reveal="fade">
            <p class="au-entry__index">${escape(service.index)}</p>
            <div>
              <h2 class="au-entry__title">${escape(service.title)}</h2>
              <p class="au-entry__kicker">${escape(service.kicker)}</p>
            </div>
            <div>
              <p class="au-entry__text">${escape(service.summary)}</p>
              <div class="au-entry__tags">${service.home
                .map((item) => `<span class="au-tag">${escape(item)}</span>`)
                .join("")}</div>
            </div>
            <span class="au-entry__go au-link" aria-hidden="true">Ver</span>
          </a>`,
    )
    .join("\n");

  return {
    meta: {
      title: servicesIntro.title,
      description:
        "Seis capacidades: ingeniería y diseño, infraestructura, operación y mantenimiento, " +
        "transformación digital, consultoría estratégica y sistemas y equipamiento.",
      canonical: "servicios.html",
      schema: [
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Soluciones", path: "servicios.html" },
        ]),
      ],
    },
    current: "servicios",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Soluciones" }],
        label: "Soluciones",
        title: servicesIntro.title,
        lead: servicesIntro.text,
        plate: "plant",
        facts: [
          { term: "Capacidades", value: "6" },
          { term: "Mercados atendidos", value: "12" },
          { term: "Proyectos ejecutados", value: "350+" },
        ],
      }),
      shell(`          <div class="au-index" data-reveal-group>\n${rows}\n          </div>`),
      closingCta(ctx, homeCta),
    ].join("\n\n"),
  };
}

/* ========================================================== detail: servicio */

export function servicePage(ctx, service) {
  const related = service.industries
    .map((id) => industries.find((industry) => industry.id === id))
    .filter(Boolean);

  const project = projectById(service.caseRef);

  const benefits = service.benefits
    .map(
      (item) => `            <article class="au-pillar" data-reveal="rise">
              <h3 class="au-pillar__title">${escape(item.title)}</h3>
              <p class="au-pillar__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  const applications = service.applications
    .map(
      (item) => `            <article class="au-value" data-reveal="fade">
              <h3 class="au-value__title">${escape(item.title)}</h3>
              <p class="au-value__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  const relatedCards = related
    .map(
      (industry) => `            <a class="au-related__item" href="${page(ctx, "industrias")}#${industry.id}">
              <p class="au-related__kind">Industria</p>
              <h3 class="au-related__title">${escape(industry.name)}</h3>
              <p class="au-related__text">${escape(industry.title)}</p>
            </a>`,
    )
    .join("\n");

  const body = [
    pageHead(ctx, {
      trail: [crumbHome, { label: "Soluciones", route: "servicios" }, { label: service.title }],
      label: service.kicker,
      title: service.title,
      lead: service.lead,
      plate: service.plate,
      facts: service.facts,
    }),

    shell(
      `          <div class="au-split au-split--wide">
            <div class="au-split__figure" data-reveal="fade">${figure(
              service.plate,
              service.caption,
              { index: service.index },
            )}</div>
            <div class="au-split__body" data-reveal="fade">
              <h2 class="au-h3">${escape(service.title)} en una línea</h2>
              <p class="au-body" style="margin-top:1rem">${escape(service.summary)}</p>
              ${bullets(service.capabilities)}
            </div>
          </div>`,
    ),

    shell(
      head({
        index: "01",
        total: "05",
        label: "Beneficios",
        title: "Qué cambia para el cliente",
      }) + `          <div class="au-pillars" data-reveal-group>\n${benefits}\n          </div>`,
    ),

    shell(
      head({
        index: "02",
        total: "05",
        label: "Aplicaciones",
        title: "Dónde se aplica",
        body: "Los cuatro encargos que más veces llegan a esta capacidad.",
      }) + `          <div class="au-values" data-reveal-group>\n${applications}\n          </div>`,
      "au-section--tight",
    ),

    shell(
      head({
        index: "03",
        total: "05",
        label: "Proceso",
        title: "Cómo se ejecuta",
      }) + steps(service.process),
    ),

    project
      ? shell(
          head({
            index: "04",
            total: "05",
            label: "Caso de éxito",
            title: project.title,
            body: project.summary,
            action: project.slug
              ? button("Ver proyecto", sub(ctx, "proyectos", project.slug), { solid: true })
              : "",
          }) +
            `          <div class="au-case">
            <div class="au-case__figure" data-reveal="scale">${figure(
              project.plate,
              project.caption,
            )}</div>
            <div class="au-case__body" data-reveal="fade">
              <p class="au-case__meta">
                <span>Cliente <b>${escape(project.client)}</b></span>
                <span>País <b>${escape(project.country)}</b></span>
              </p>
              ${results(project.results)}
            </div>
          </div>`,
          "au-dark",
        )
      : "",

    shell(
      head({
        index: "05",
        total: "05",
        label: "Industrias relacionadas",
        title: "Dónde tenemos operación permanente",
      }) + `          <div class="au-related">\n${relatedCards}\n          </div>`,
      "au-section--tight",
    ),

    shell(
      head({
        index: "FAQ",
        label: "Preguntas frecuentes",
        title: "Lo que preguntan antes de contratar",
      }) + faq(service.faq),
    ),

    closingCta(ctx, homeCta),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    meta: {
      title: service.title,
      description: `${service.summary} ${service.lead}`,
      canonical: `servicios/${service.slug}.html`,
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          serviceType: service.kicker,
          description: service.summary,
          provider: { "@type": "Organization", name: company.full },
          areaServed: "Latinoamérica y Europa",
          url: `${ORIGIN}/servicios/${service.slug}.html`,
        },
        faqSchema(service.faq),
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Soluciones", path: "servicios.html" },
          { label: service.title, path: `servicios/${service.slug}.html` },
        ]),
      ],
    },
    current: "servicios",
    body,
  };
}

/* ========================================================= index: industrias */

export function industriesIndex(ctx) {
  const sections = industries
    .map(
      (industry) => `      <section class="au-section" id="${industry.id}">
        <div class="au-shell">
          <div class="au-split au-split--wide">
            <div class="au-split__figure" data-reveal="fade">${figure(
              industry.plate,
              industry.caption,
              { index: industry.index },
            )}</div>
            <div class="au-split__body" data-reveal="fade">
              <p class="au-label"><span class="au-label__index">${escape(industry.index)}</span>
                <span>${escape(industry.name)}</span></p>
              <h2 class="au-h2" style="margin:1rem 0">${escape(industry.title)}</h2>
              <p class="au-body">${escape(industry.text)}</p>
              ${bullets(industry.capabilities)}
              <div class="au-industry__case">
                <p class="au-industry__case-label">${escape(industry.example.label)}</p>
                <p class="au-industry__case-text">${escape(industry.example.text)}</p>
                <div class="au-industry__case-figure">${industry.example.figures
                  .map(
                    (item) =>
                      `<div><b>${escape(item.value)}</b><span>${escape(item.label)}</span></div>`,
                  )
                  .join("")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>`,
    )
    .join("\n\n");

  return {
    meta: {
      title: industriesIntro.title,
      description:
        "Industria, energía, infraestructura, tecnología, logística y sector corporativo: " +
        "las seis industrias con operación permanente del grupo.",
      canonical: "industrias.html",
      schema: [
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Industrias", path: "industrias.html" },
        ]),
      ],
    },
    current: "industrias",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Industrias" }],
        label: "Industrias",
        title: industriesIntro.title,
        lead: industriesIntro.text,
        plate: "grid",
        facts: [
          { term: "Industrias", value: "6" },
          { term: "Oficinas permanentes", value: "5" },
          { term: "Mercados", value: "12" },
        ],
      }),
      sections,
      closingCta(ctx, homeCta),
    ].join("\n\n"),
  };
}

/* ========================================================== index: productos */

export function productsIndex(ctx) {
  const cards = products
    .map(
      (product) => `            <a class="au-card" href="${sub(ctx, "productos", product.slug)}" data-reveal="rise">
              <div class="au-card__figure">${figure(product.plate, "", { reveal: false })}</div>
              <p class="au-card__kicker">${escape(product.family)}</p>
              <h2 class="au-card__title">${escape(product.name)}</h2>
              <p class="au-card__text">${escape(product.summary)}</p>
              <p class="au-card__foot"><span>Ficha técnica</span><span>${escape(
                product.lead_time,
              )}</span></p>
            </a>`,
    )
    .join("\n");

  return {
    meta: {
      title: productsIntro.title,
      description:
        "Catálogo corporativo B2B: bombeo de proceso, tableros de control, skids modulares, " +
        "telemetría, bahías de alta tensión y salas de datos modulares.",
      canonical: "productos.html",
      schema: [
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Productos", path: "productos.html" },
        ]),
      ],
    },
    current: "productos",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Productos" }],
        label: "Catálogo",
        title: productsIntro.title,
        lead: productsIntro.text,
        plate: "rotor",
        facts: [
          { term: "Familias", value: "6" },
          { term: "Superficie de taller", value: "4 200 m²" },
          { term: "Repuesto crítico", value: "72 h" },
        ],
      }),
      shell(`          <div class="au-cards" data-reveal-group>\n${cards}\n          </div>`),
      closingCta(ctx, homeCta),
    ].join("\n\n"),
  };
}

/* ========================================================= detail: producto */

export function productPage(ctx, product) {
  const features = product.features
    .map(
      (item) => `            <article class="au-value" data-reveal="fade">
              <h3 class="au-value__title">${escape(item.title)}</h3>
              <p class="au-value__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  const specs = product.specs
    .map(([term, value]) => `<tr><th scope="row">${escape(term)}</th><td>${escape(value)}</td></tr>`)
    .join("");

  const downloads = product.downloads
    .map(
      (item) => `            <a class="au-download" href="${page(ctx, "contacto", "formulario")}">
              <span class="au-download__name">${escape(item.name)}</span>
              <span class="au-download__meta">${escape(item.meta)}</span>
            </a>`,
    )
    .join("\n");

  const body = [
    pageHead(ctx, {
      trail: [crumbHome, { label: "Productos", route: "productos" }, { label: product.name }],
      label: product.family,
      title: product.name,
      lead: product.tagline,
      plate: product.plate,
      facts: [
        { term: "Familia", value: product.family },
        { term: "Plazo de entrega", value: product.lead_time },
        { term: "Certificaciones", value: product.certifications.join(" · ") },
      ],
    }),

    shell(
      `          <div class="au-split au-split--wide">
            <div class="au-split__figure" data-reveal="fade">${figure(
              product.plate,
              product.caption,
              { index: product.index },
            )}</div>
            <div class="au-split__body" data-reveal="fade">
              <h2 class="au-h3">Descripción</h2>
              <p class="au-body" style="margin-top:1rem">${escape(product.summary)}</p>
              <p class="au-body">${escape(product.lead)}</p>
              <div style="margin-top:1.5rem">${button(
                "Solicitar cotización",
                page(ctx, "contacto", "formulario"),
                { solid: true },
              )}</div>
            </div>
          </div>`,
    ),

    shell(
      head({ index: "01", total: "04", label: "Características", title: "Qué distingue a este equipo" }) +
        `          <div class="au-values" data-reveal-group>\n${features}\n          </div>`,
    ),

    shell(
      head({ index: "02", total: "04", label: "Especificaciones", title: "Ficha técnica" }) +
        `          <div class="au-split">
            <div class="au-split__figure" data-reveal="fade">
              <table class="au-specs">
                <caption class="au-visually-hidden">Especificaciones técnicas de ${escape(
                  product.name,
                )}</caption>
                <tbody>${specs}</tbody>
              </table>
            </div>
            <div class="au-split__body" data-reveal="fade">
              <h3 class="au-h3">Aplicaciones</h3>
              ${bullets(product.applications)}
              <h3 class="au-h3" style="margin-top:2.5rem">Certificaciones</h3>
              <div class="au-entry__tags">${product.certifications
                .map((item) => `<span class="au-tag au-tag--accent">${escape(item)}</span>`)
                .join("")}</div>
            </div>
          </div>`,
      "au-section--tight",
    ),

    shell(
      head({
        index: "03",
        total: "04",
        label: "Descargas",
        title: "Documentación técnica",
        body:
          "En la demostración las descargas abren el formulario de contacto: un catálogo real " +
          "entrega aquí el PDF, con o sin registro previo según la política comercial.",
      }) + `          <div class="au-downloads">\n${downloads}\n          </div>`,
      "au-section--tight",
    ),

    shell(
      head({
        index: "04",
        total: "04",
        label: "Cotización",
        title: "Cómo se compra este equipo",
        body:
          "Sin carrito: el precio depende del volumen, del incoterm y del plazo. Envíe la " +
          "condición de operación y recibirá una propuesta técnica y económica.",
        action: button("Solicitar cotización", page(ctx, "contacto", "formulario"), { solid: true }),
      }),
      "au-dark",
    ),
  ].join("\n\n");

  return {
    meta: {
      title: `${product.name} — ${product.family}`,
      description: `${product.summary} ${product.tagline}`,
      canonical: `productos/${product.slug}.html`,
      ogType: "product",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          category: product.family,
          description: product.summary,
          brand: { "@type": "Brand", name: company.full },
          manufacturer: { "@type": "Organization", name: company.legalName },
          url: `${ORIGIN}/productos/${product.slug}.html`,
          additionalProperty: product.specs.map(([term, value]) => ({
            "@type": "PropertyValue",
            name: term,
            value,
          })),
        },
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Productos", path: "productos.html" },
          { label: product.name, path: `productos/${product.slug}.html` },
        ]),
      ],
    },
    current: "productos",
    body,
  };
}

/* ========================================================== index: proyectos */

export function projectsIndex(ctx) {
  const cards = projects
    .map((project) => {
      const target = project.slug ? sub(ctx, "proyectos", project.slug) : null;
      const inner = `              <div class="au-card__figure">${figure(project.plate, "", {
        reveal: false,
      })}</div>
              <p class="au-card__kicker">${escape(project.industry)} · ${escape(project.country)}</p>
              <h2 class="au-card__title">${escape(project.title)}</h2>
              <p class="au-card__text">${escape(project.summary)}</p>
              ${results(project.results)}
              <p class="au-card__foot"><span>${escape(project.client)}</span><span>${escape(
                project.year,
              )}</span></p>`;

      return target
        ? `            <a class="au-card" href="${target}" data-reveal="rise">\n${inner}\n            </a>`
        : `            <article class="au-card" data-reveal="rise">\n${inner}\n            </article>`;
    })
    .join("\n");

  return {
    meta: {
      title: projectsIntro.title,
      description:
        "Proyectos ejecutados entre 2022 y 2025 en logística, infraestructura, energía, " +
        "industria y sector corporativo, con los resultados medidos de cada contrato.",
      canonical: "proyectos.html",
      schema: [
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Proyectos", path: "proyectos.html" },
        ]),
      ],
    },
    current: "proyectos",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Proyectos" }],
        label: "Proyectos",
        title: projectsIntro.title,
        lead: projectsIntro.text,
        plate: "routes",
        facts: [
          { term: "Proyectos ejecutados", value: "350+" },
          { term: "Países", value: "12" },
          { term: "Retención de clientes", value: "98 %" },
        ],
      }),
      shell(`          <div class="au-cards" data-reveal-group>\n${cards}\n          </div>`),
      closingCta(ctx, homeCta),
    ].join("\n\n"),
  };
}

/* ========================================================= detail: proyecto */

export function projectPage(ctx, project) {
  const facts = [
    { term: "Cliente", value: project.client },
    { term: "Industria", value: project.industry },
    { term: "País", value: project.country },
    { term: "Periodo", value: project.year },
    { term: "Servicios", value: project.service },
  ];

  const aside = `          <aside class="au-record__aside">
            <dl class="au-record__facts">${facts
              .map(
                (fact) =>
                  `<div><dt>${escape(fact.term)}</dt><dd>${escape(fact.value)}</dd></div>`,
              )
              .join("")}</dl>
            <div style="margin-top:2rem">${button(
              "Hablar con el equipo",
              page(ctx, "contacto", "formulario"),
              { solid: true },
            )}</div>
          </aside>`;

  const gallery = project.gallery
    ? shell(
        head({ index: "GAL", label: "Galería", title: "El proyecto en planta" }) +
          `          <div class="au-gallery" data-reveal-group>${project.gallery
            .map((item, index) =>
              figure(item.plate, item.caption, {
                index: String(index + 1).padStart(2, "0"),
                ratio: index === 0 ? "wide" : "square",
              }),
            )
            .join("")}</div>`,
        "au-section--tight",
      )
    : "";

  const body = [
    pageHead(ctx, {
      trail: [crumbHome, { label: "Proyectos", route: "proyectos" }, { label: project.client }],
      label: project.kicker ?? "Caso de éxito",
      title: project.title,
      lead: project.summary,
      plate: project.plate,
      facts: facts.slice(0, 3),
    }),

    shell(
      `          <div data-reveal="fade">${results(project.results)}</div>`,
      "au-dark au-section--tight",
    ),

    shell(
      `        <div class="au-record">
${aside}
          <div class="au-record__main">
            ${block("El problema", prose(project.problem))}
            ${block("La solución", prose(project.solution))}
            ${block("Proceso", steps(project.process))}
            ${block("Tecnologías aplicadas", bullets(project.tech))}
          </div>
        </div>`,
    ),

    gallery,

    project.quote
      ? shell(
          `          <div class="au-pull" data-reveal="fade">
            <p class="au-pull__text">&ldquo;${escape(project.quote.text)}&rdquo;</p>
            <p class="au-note"><b>${escape(project.quote.name)}</b> · ${escape(
              project.quote.role,
            )}, ${escape(project.quote.org)}</p>
          </div>`,
          "au-section--tight",
        )
      : "",

    closingCta(ctx, homeCta),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    meta: {
      title: project.title,
      description: `${project.summary} Cliente: ${project.client}. ${project.country}.`,
      canonical: `proyectos/${project.slug}.html`,
      ogType: "article",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: project.title,
          description: project.summary,
          author: { "@type": "Organization", name: company.full },
          publisher: { "@type": "Organization", name: company.full },
          about: project.industry,
          url: `${ORIGIN}/proyectos/${project.slug}.html`,
        },
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Proyectos", path: "proyectos.html" },
          { label: project.client, path: `proyectos/${project.slug}.html` },
        ]),
      ],
    },
    current: "proyectos",
    body,
  };
}

/* ========================================================== index: recursos */

export function resourcesIndex(ctx) {
  const cards = insights
    .map((item) => {
      const target = item.slug
        ? sub(ctx, "recursos", item.slug)
        : page(ctx, "contacto", "formulario");
      const inner = `              <div class="au-card__figure">${figure(item.plate, "", {
        reveal: false,
      })}</div>
              <p class="au-card__kicker">${escape(item.kind)}</p>
              <h2 class="au-card__title">${escape(item.title)}</h2>
              <p class="au-card__text">${escape(item.summary)}</p>
              <p class="au-card__foot"><span>${escape(item.dateLabel)}</span><span>${escape(
                item.read,
              )}</span></p>`;
      return `            <a class="au-card" href="${target}" data-reveal="rise">\n${inner}\n            </a>`;
    })
    .join("\n");

  return {
    meta: {
      title: insightsIntro.title,
      description:
        "Análisis, informes y novedades del equipo técnico de Aurelis Group sobre capacidad " +
        "industrial, continuidad operativa y medición.",
      canonical: "recursos.html",
      schema: [
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Recursos", path: "recursos.html" },
        ]),
      ],
    },
    current: "recursos",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Recursos" }],
        label: "Recursos",
        title: insightsIntro.title,
        lead: insightsIntro.text,
        plate: "report",
        facts: [
          { term: "Publicaciones", value: "6" },
          { term: "Informes bajo solicitud", value: "3" },
          { term: "Actualización", value: "Trimestral" },
        ],
      }),
      shell(`          <div class="au-cards" data-reveal-group>\n${cards}\n          </div>`),
      shell(
        head({
          index: "REG",
          label: "Informes",
          title: "Los informes se entregan bajo solicitud",
          body:
            "Es como se distribuye este material en la práctica: el informe llega por correo " +
            "tras una solicitud identificada. El formulario de contacto ya contempla el caso.",
          action: button("Solicitar un informe", page(ctx, "contacto", "formulario"), {
            solid: true,
          }),
        }),
        "au-dark au-section--tight",
      ),
    ].join("\n\n"),
  };
}

/* ========================================================== detail: artículo */

export function articlePage(ctx, article) {
  const body = article.body
    .map((node) => {
      if (node.type === "h") return `<h2>${escape(node.text)}</h2>`;
      if (node.type === "list")
        return `<ul>${node.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;
      if (node.type === "quote") return `<blockquote>${escape(node.text)}</blockquote>`;
      return `<p>${escape(node.text)}</p>`;
    })
    .join("");

  return {
    meta: {
      title: article.title,
      description: article.summary,
      canonical: `recursos/${article.slug}.html`,
      ogType: "article",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.summary,
          datePublished: article.date,
          author: { "@type": "Person", name: article.author },
          publisher: { "@type": "Organization", name: company.full },
          url: `${ORIGIN}/recursos/${article.slug}.html`,
        },
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Recursos", path: "recursos.html" },
          { label: article.title, path: `recursos/${article.slug}.html` },
        ]),
      ],
    },
    current: "recursos",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Recursos", route: "recursos" }, { label: article.kind }],
        label: article.kind,
        title: article.title,
        lead: article.summary,
        plate: article.plate,
        facts: [
          { term: "Autor", value: `${article.author} · ${article.authorRole}` },
          { term: "Publicado", value: article.dateLabel },
          { term: "Lectura", value: article.read },
        ],
      }),
      shell(`          <div class="au-article" data-reveal="fade">${body}</div>`),
      closingCta(ctx, homeCta),
    ].join("\n\n"),
  };
}

/* ============================================================ page: empresa */

export function companyPage(ctx) {
  const milestones = history.milestones
    .map(
      (item) => `            <li class="au-milestone" data-reveal="fade">
              <p class="au-milestone__year">${escape(item.year)}</p>
              <p class="au-milestone__title">${escape(item.title)}</p>
              <p class="au-milestone__text">${escape(item.text)}</p>
            </li>`,
    )
    .join("\n");

  const people = leadership.people
    .map(
      (person) => `            <article class="au-person" data-reveal="rise">
              <div class="au-person__figure">${figure("portrait", "", {
                arg: person.initials,
                reveal: false,
              })}</div>
              <h3 class="au-person__name">${escape(person.name)}</h3>
              <p class="au-person__role">${escape(person.role)}</p>
              <p class="au-person__text">${escape(person.text)}</p>
            </article>`,
    )
    .join("\n");

  const valueItems = values.items
    .map(
      (item) => `            <article class="au-value" data-reveal="fade">
              <h3 class="au-value__title">${escape(item.title)}</h3>
              <p class="au-value__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  const govern = governance.items
    .map((item) => `<div><dt>${escape(item.term)}</dt><dd>${escape(item.detail)}</dd></div>`)
    .join("");

  const pillars = sustainability.pillars
    .map(
      (item) => `            <article class="au-triple__item" data-reveal="fade">
              <h3 class="au-triple__title">${escape(item.title)}</h3>
              <p class="au-triple__figure">${escape(item.figure)}</p>
              <p class="au-triple__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  return {
    meta: {
      title: "Empresa",
      description:
        "Aurelis Group: historia desde 1998, propósito, valores, liderazgo, gobierno " +
        "corporativo y compromisos de sostenibilidad.",
      canonical: "empresa.html",
      schema: [
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Empresa", path: "empresa.html" },
        ]),
      ],
    },
    current: "empresa",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Empresa" }],
        label: "Empresa",
        title: "Construida para generar valor a largo plazo",
        lead:
          "Un grupo de ingeniería, tecnología y operación constituido en 1998, con capacidad " +
          "propia en las tres etapas: diseñar, construir y mantener.",
        plate: "tower",
        facts: company.figures.map((figureItem) => ({
          term: figureItem.label,
          value: `${figureItem.value}${figureItem.sup ?? ""}`,
        })),
      }),

      shell(
        `          <div class="au-split au-split--wide">
            <div class="au-split__figure" data-reveal="fade">${figure(
              "tower",
              "Sede corporativa · alzado norte",
              { index: "01" },
            )}</div>
            <div class="au-split__body" data-reveal="fade">
              <h2 class="au-h2">Quiénes somos</h2>
              <p class="au-body" style="margin-top:1.5rem">
                Aurelis nació en 1998 como una firma de mantenimiento industrial con cuatro
                ingenieros y un contrato. Lo que la convirtió en un grupo no fue crecer, sino
                dejar de subcontratar la parte crítica: primero el taller, después la ingeniería
                y por último la operación.
              </p>
              <p class="au-body">
                Hoy esas tres capacidades conviven bajo un mismo contrato, que es lo que permite
                comprometer disponibilidad y no sólo entrega. Es también la razón por la que la
                empresa rechaza trabajos que no puede sostener después de la puesta en marcha.
              </p>
              <p class="au-body">
                El propósito no está escrito como una frase de marca: la organización existe
                para que activos que la gente necesita —agua, energía, carga, producción—
                sigan funcionando de forma previsible.
              </p>
            </div>
          </div>`,
      ),

      shell(`          ${metrics(company.figures)}`, "au-section--tight"),

      shell(
        head({
          index: "01",
          total: "05",
          label: history.label,
          title: history.title,
          id: "historia",
        }) + `          <ol class="au-timeline" data-reveal-group>\n${milestones}\n          </ol>`,
      ),

      shell(
        head({ index: "02", total: "05", label: values.label, title: values.title }) +
          `          <div class="au-values" data-reveal-group>\n${valueItems}\n          </div>`,
        "au-section--tight",
      ),

      shell(
        head({
          index: "03",
          total: "05",
          label: leadership.label,
          title: leadership.title,
          body: leadership.text,
          id: "liderazgo",
        }) + `          <div class="au-people" data-reveal-group>\n${people}\n          </div>`,
      ),

      shell(
        head({
          index: "04",
          total: "05",
          label: governance.label,
          title: governance.title,
          body: governance.text,
          id: "gobierno",
        }) + `          <dl class="au-govern">${govern}</dl>`,
        "au-section--tight",
      ),

      shell(
        head({
          index: "05",
          total: "05",
          label: sustainability.label,
          title: sustainability.title,
          body: sustainability.text,
          id: "sostenibilidad",
        }) + `          <div class="au-triple" data-reveal-group>\n${pillars}\n          </div>`,
        "au-dark au-dark--navy",
      ),

      shell(
        head({
          index: "ISO",
          label: certifications.label,
          title: "Certificaciones vigentes",
          body: certifications.text,
        }) +
          `          <div class="au-certs" data-reveal-group>${certifications.items
            .map(
              (item) =>
                `<article class="au-cert"><p class="au-cert__name">${escape(item.name)}</p>` +
                `<p class="au-cert__code">${escape(item.code)}</p>` +
                `<p class="au-cert__text">${escape(item.text)}</p></article>`,
            )
            .join("")}</div>`,
        "au-section--tight",
      ),

      closingCta(ctx, homeCta),
    ].join("\n\n"),
  };
}

/* =========================================================== page: contacto */

/**
 * The contact page.
 *
 * A real form: required fields, `type` and `autocomplete` on every control, a
 * consent checkbox, and a status region the module writes into. The submit is
 * simulated — there is no backend behind a demo — but everything up to the
 * request is what a deployment would ship.
 */
export function contactPage(ctx) {
  const field = ({ id, label: text, type = "text", required, autocomplete, options, textarea }) => {
    const control = textarea
      ? `<textarea class="au-field__control" id="${id}" name="${id}"${
          required ? " required" : ""
        } aria-describedby="${id}-error" placeholder="Describa brevemente el alcance o la consulta"></textarea>`
      : options
        ? `<select class="au-field__control" id="${id}" name="${id}"${
            required ? " required" : ""
          } aria-describedby="${id}-error"><option value="">Seleccione una opción</option>${options
            .map((option) => `<option>${escape(option)}</option>`)
            .join("")}</select>`
        : `<input class="au-field__control" id="${id}" name="${id}" type="${type}"${
            required ? " required" : ""
          }${autocomplete ? ` autocomplete="${autocomplete}"` : ""} aria-describedby="${id}-error" />`;

    return `              <div class="au-field" data-field>
                <label class="au-field__label" for="${id}">${escape(text)}${
                  required ? ' <span class="au-req" aria-hidden="true">*</span>' : ""
                }</label>
                ${control}
                <p class="au-field__error" id="${id}-error" data-error></p>
              </div>`;
  };

  const form = `            <form class="au-form" novalidate data-form>
              <div class="au-form__row au-form__row--two">
${field({ id: "nombre", label: "Nombre", required: true, autocomplete: "name" })}
${field({ id: "empresa", label: "Empresa", required: true, autocomplete: "organization" })}
              </div>
              <div class="au-form__row au-form__row--two">
${field({ id: "cargo", label: "Cargo", autocomplete: "organization-title" })}
${field({ id: "correo", label: "Correo corporativo", type: "email", required: true, autocomplete: "email" })}
              </div>
              <div class="au-form__row au-form__row--two">
${field({ id: "telefono", label: "Teléfono", type: "tel", autocomplete: "tel" })}
${field({ id: "servicio", label: "Servicio de interés", required: true, options: contactData.services })}
              </div>
${field({ id: "mensaje", label: "Mensaje", required: true, textarea: true })}

              <div class="au-check" data-field data-consent>
                <input type="checkbox" id="privacidad" name="privacidad" required
                  aria-describedby="privacidad-error" />
                <label for="privacidad">
                  He leído y acepto el <a href="#aviso">aviso de privacidad</a> y autorizo el
                  tratamiento de mis datos para responder a esta consulta.
                  <span class="au-field__error" id="privacidad-error" data-error></span>
                </label>
              </div>

              <div class="au-form__foot">
                <button class="au-btn au-btn--solid au-form__submit" type="submit" data-submit>
                  Enviar consulta
                </button>
                <p class="au-form__status" role="status" aria-live="polite" data-status></p>
              </div>
            </form>`;

  const channels = [
    { label: "Correo", value: contactData.email, href: `mailto:${contactData.email}` },
    { label: "Teléfono", value: contactData.phone, href: `tel:${contactData.phoneHref}` },
    { label: "Dirección", value: contactData.address },
    { label: "Horario", value: contactData.hours },
    { label: "LinkedIn", value: contactData.linkedin, note: "Perfil corporativo" },
  ]
    .map(
      (channel) => `              <div class="au-channel">
                <p class="au-channel__label">${escape(channel.label)}</p>
                ${
                  channel.href
                    ? `<a class="au-channel__value" href="${escape(channel.href)}">${escape(
                        channel.value,
                      )}</a>`
                    : `<p class="au-channel__value">${escape(channel.value)}</p>`
                }
                ${channel.note ? `<p class="au-channel__note">${escape(channel.note)}</p>` : ""}
              </div>`,
    )
    .join("\n");

  return {
    meta: {
      title: "Contacto",
      description:
        "Hable con un especialista de Aurelis Group: ingeniería, infraestructura, operación, " +
        "transformación digital, consultoría y equipamiento industrial.",
      canonical: "contacto.html",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contacto — Aurelis Group",
          url: `${ORIGIN}/contacto.html`,
        },
        breadcrumbSchema([
          { label: "Inicio", path: "" },
          { label: "Contacto", path: "contacto.html" },
        ]),
      ],
    },
    current: "contacto",
    body: [
      pageHead(ctx, {
        trail: [crumbHome, { label: "Contacto" }],
        label: "Contacto",
        title: "Hablemos de su operación",
        lead:
          "Escriba lo que necesita resolver, no el producto que cree necesitar. La primera " +
          "conversación es técnica y no tiene costo.",
        plate: "hall",
        facts: [
          { term: "Respuesta", value: "Menos de 24 h hábiles" },
          { term: "Oficinas", value: "5 países" },
          { term: "Horario", value: contactData.hours },
        ],
      }),

      `      <section class="au-section" id="formulario">
        <div class="au-shell">
          <div class="au-contact">
            <div class="au-contact__form" data-reveal="fade">
              <h2 class="au-h3" style="margin-bottom:2rem">Enviar una consulta</h2>
${form}
              <p class="au-note" style="margin-top:1.5rem">
                Demostración: el envío se simula en el navegador y no viaja a ningún servidor.
                La validación, los estados y el mensaje de confirmación son los reales.
              </p>
            </div>

            <div class="au-contact__aside" data-reveal="fade" id="canales">
              <h2 class="au-h3" style="margin-bottom:2rem">Canales directos</h2>
              <div class="au-channels">
${channels}
              </div>
              <div style="margin-top:2.5rem">${figure(
                "tower",
                "Torre Aurelis · Tegucigalpa",
                { reveal: false, ratio: "square" },
              )}</div>
            </div>
          </div>
        </div>
      </section>`,

      shell(
        head({
          index: "FAQ",
          label: "Antes de escribir",
          title: "Tres preguntas que ahorran una reunión",
        }) +
          faq([
            {
              q: "¿Atienden proyectos fuera de sus cinco oficinas?",
              a: "Sí. La operación de proyecto alcanza doce mercados; lo que evaluamos antes de comprometernos es si podemos sostener el servicio posterior en esa ubicación.",
            },
            {
              q: "¿Cuál es el tamaño mínimo de contrato?",
              a: "No hay mínimo para un diagnóstico o un estudio. Para contratos de operación con compromiso de disponibilidad, el plazo mínimo es de treinta y seis meses.",
            },
            {
              q: "¿Pueden firmar un acuerdo de confidencialidad antes de la primera reunión?",
              a: "Sí, y es lo habitual cuando la consulta involucra datos de producción. Envíe su formato o solicite el nuestro en el mismo formulario.",
            },
          ]),
        "au-section--tight",
      ),
    ].join("\n\n"),
  };
}

export { serviceById };
