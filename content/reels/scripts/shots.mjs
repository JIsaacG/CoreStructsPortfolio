/**
 * Lista de tomas que graba `record-demos.mjs`.
 *
 * Cada demo tiene sus tomas de 3 a 8 s. Una toma es una ruta del sitio y una
 * pequeña coreografía en el tiempo de la toma (segundos):
 *
 *   { at, scroll: { to, offset, dur, ease } }  desplaza la página con easing.
 *       `to` es un número (px absolutos), "+300" (relativo), o un selector CSS.
 *   { at, tap: "selector" }                    toca un elemento (móvil).
 *   { at, type: { sel, text, cps } }           escribe letra por letra.
 *
 * Campos de la toma:
 *   name     nombre del archivo: raw/clips/<demo>/<name>.mp4
 *   path     ruta dentro del sitio
 *   dur      duración en segundos (3 a 8)
 *   start    dónde arranca la cámara: px, selector o 0
 *   offset   px que se dejan por encima del selector de `start`
 *   preroll  segundos de página que corren ANTES del primer fotograma.
 *            0 graba la animación de entrada desde el principio.
 *   setup    pasos fuera de cámara antes de `start` ({ tap }, { scrollTo }, { wait: s }):
 *            dejan la demo en un estado (formulario enviado, panel abierto).
 *   steps    la coreografía
 *
 * REGLAS (no se negocian):
 * - Nada de precios: costos.html, becas con porcentajes y cualquier tabla de
 *   aranceles NO se graba.
 * - Nada de cifras de resultados: se ocultan los bloques de datos
 *   (ej. `.au-hero__facts`) y no se graban secciones de estadísticas.
 * - El sello "DEMO · sitio de ejemplo de CoreStruct" lleva el isotipo: se oculta
 *   en la grabación, porque el logo solo aparece en la tarjeta final.
 */

/** Sellos de demo de cada familia (llevan el isotipo de CoreStruct). */
export const ALWAYS_HIDE = [".au-badge", ".cd-badge", ".dm-badge", ".fx-badge", ".lp-badge", ".lp-pitch", ".lp-outro"];

/**
 * Textos que mencionan precios, costos o plazos. Las demos tienen enlaces como
 * "Costos y aranceles" o "Calculadora de matrícula": se ocultan en la
 * grabación (el elemento más pequeño que los contiene: enlace, botón, ítem o
 * párrafo), porque los videos no muestran ni mencionan precios.
 */
export const HIDE_TEXT = String.raw`\b(costos?|aranceles?|cuesta|precios?|tarifas?|descuentos?|promoci[oó]n|cotiza|calculadora de matr[ií]cula|plazos?|d[ií]as h[aá]biles|desde L|\bL\.?\s?\d|\$\s?\d|\d+\s?%|m[aá]s de \d|\d+\s?h(\s?\d+\s?m)?\b)`;

export const demos = {
  /* ------------------------------------------------------------ AUREA */
  aurea: {
    label: "AUREA · portal educativo",
    hide: [".au-hero__facts"],
    shots: [
      {
        name: "hero",
        path: "/demos/aurea/index.html",
        dur: 6,
        start: 0,
        preroll: 0,
        steps: [{ at: 2.0, scroll: { to: 600, dur: 3.6, ease: "inOutCubic" } }],
      },
      {
        name: "accesos",
        path: "/demos/aurea/index.html",
        dur: 5,
        start: ".au-quickaccess",
        offset: 70,
        preroll: 0.8,
        steps: [{ at: 0.6, scroll: { to: "+380", dur: 3.6, ease: "inOutSine" } }],
      },
      {
        name: "soy",
        path: "/demos/aurea/index.html",
        dur: 6,
        start: "#soy",
        offset: 10,
        preroll: 0.8,
        steps: [
          { at: 0.9, tap: "#au-aud-familia" },
          { at: 2.6, scroll: { to: "+260", dur: 1.8, ease: "inOutSine" } },
          { at: 4.6, tap: "#au-aud-estudiante" },
        ],
      },
      {
        name: "buscador",
        path: "/demos/aurea/index.html",
        dur: 7,
        start: "#au-collection-q",
        offset: 230,
        preroll: 0.8,
        steps: [
          { at: 0.5, tap: "#au-collection-q" },
          { at: 0.9, type: { sel: "#au-collection-q", text: "sistemas", cps: 7 } },
          { at: 3.4, scroll: { to: "+330", dur: 2.4, ease: "inOutCubic" } },
        ],
      },
      {
        name: "admisiones",
        path: "/demos/aurea/index.html",
        dur: 6,
        start: "#admisiones",
        offset: 0,
        preroll: 0.8,
        steps: [{ at: 0.5, scroll: { to: "+760", dur: 5.2, ease: "inOutSine" } }],
      },
      {
        name: "menu",
        path: "/demos/aurea/index.html",
        dur: 5,
        start: 0,
        preroll: 1.6,
        steps: [
          { at: 0.7, tap: ".au-burger" },
          { at: 2.5, tap: '[aria-controls="au-panel-admisiones"]' },
        ],
      },
      {
        name: "cta",
        path: "/demos/aurea/index.html",
        dur: 4,
        start: ".au-cta",
        offset: 120,
        preroll: 0.8,
        steps: [{ at: 0.3, scroll: { to: "+140", dur: 3.4, ease: "inOutSine" } }],
      },
      {
        name: "oferta",
        path: "/demos/aurea/oferta-academica.html",
        dur: 6,
        start: 0,
        preroll: 0,
        steps: [{ at: 2.2, scroll: { to: 900, dur: 3.6, ease: "inOutCubic" } }],
      },
      {
        name: "calendario",
        path: "/demos/aurea/calendario.html",
        dur: 6,
        start: 0,
        preroll: 0,
        steps: [{ at: 2.0, scroll: { to: 1000, dur: 3.8, ease: "inOutCubic" } }],
      },
    ],
  },

  /* ---------------------------------------------- Tomas genéricas por demo */
  // Las demás demos arrancan con dos tomas que no dependen de selectores:
  // la entrada del hero y un recorrido. Agrega tomas finas (menú, formulario,
  // gráficas) cuando un guion aprobado las pida.
  aurelis: generic("Aurelis · sitio corporativo", "/demos/aurelis/index.html", {
    // Cifras de resultados (años, mercados, proyectos), plazos de respuesta y horarios.
    hide: [".au-hero__rail", ".au-stat", ".au-pagehead__meta"],
    shots: [
      // R02: la página de contacto y su formulario.
      {
        name: "contacto",
        path: "/demos/aurelis/contacto.html",
        dur: 6,
        start: 0,
        preroll: 0,
        steps: [{ at: 1.6, scroll: { to: "#formulario", offset: 40, dur: 2.2, ease: "inOutCubic" } }, { at: 4.0, tap: "#nombre" }, { at: 4.2, type: { sel: "#nombre", text: "Ana Martínez", cps: 9 } }],
      },
      {
        name: "menu",
        path: "/demos/aurelis/index.html",
        dur: 4,
        start: 0,
        preroll: 1.4,
        steps: [{ at: 0.6, tap: ".au-burger" }],
      },
    ],
  }),
  cede: generic("CEDE · portal de gobierno", "/demos/cede/index.html", {
    // El presupuesto de transparencia es pura cifra: no se graba.
    hide: ["#presupuesto", ".cd-hero__figures", ".cd-hero__figures-note", ".cd-hero__plate-caption", ".cd-chart", ".cd-plate__value", ".cd-change", ".cd-board__wide", ".cd-stat", ".cd-kpi", ".cd-pagehero__meta"],
    shots: [
      {
        name: "menu",
        path: "/demos/cede/index.html",
        dur: 5,
        start: 0,
        preroll: 1.4,
        steps: [{ at: 0.6, tap: ".cd-burger" }],
      },
      {
        name: "normativa",
        path: "/demos/cede/normativa.html",
        dur: 6,
        start: 0,
        preroll: 0.6,
        steps: [{ at: 0.8, scroll: { to: "#buscador", offset: 60, dur: 1.6, ease: "inOutCubic" } }, { at: 2.6, tap: "#n-q" }, { at: 2.9, type: { sel: "#n-q", text: "educación", cps: 8 } }],
      },
      {
        name: "transparencia",
        path: "/demos/cede/transparencia.html",
        dur: 6,
        start: 0,
        preroll: 0.6,
        steps: [{ at: 1.0, scroll: { to: "#categorias", offset: 40, dur: 1.8, ease: "inOutCubic" } }, { at: 3.4, scroll: { to: "+520", dur: 2.4, ease: "inOutSine" } }],
      },
      {
        name: "participacion",
        path: "/demos/cede/participacion.html",
        dur: 6,
        start: 0,
        preroll: 0.6,
        steps: [{ at: 1.0, scroll: { to: "#como", offset: 40, dur: 1.8, ease: "inOutCubic" } }, { at: 3.4, scroll: { to: "#consultas", offset: 40, dur: 2.2, ease: "inOutSine" } }],
      },
    ],
  }),
  rumbo: generic("Rumbo · sistema empresarial", "/demos/rumbo/index.html"),
  landing: generic("Landings · índice", "/demos/landing/index.html"),
  velora: generic("Velora · landing", "/demos/landing/velora.html", {
    // Calificación, cifras de resultados y horario de la próxima cita.
    hide: [".ve-rating", ".ve-figure", ".ve-float-card", ".ve-nudge", ".ve-foot", ".lp-outro", ".ve-doctor__stats"],
    shots: [
      {
        name: "menu",
        path: "/demos/landing/velora.html",
        dur: 4,
        start: 0,
        preroll: 1.4,
        steps: [{ at: 0.6, tap: ".ve-burger" }],
      },
      {
        name: "reservar",
        path: "/demos/landing/velora.html",
        dur: 6,
        start: "#reservar",
        offset: 20,
        preroll: 0.8,
        steps: [{ at: 0.6, scroll: { to: "+620", dur: 4.6, ease: "inOutSine" } }],
      },
      {
        name: "whatsapp",
        path: "/demos/landing/velora.html",
        dur: 5,
        start: ".ve-cta",
        offset: 260,
        preroll: 0.8,
        steps: [{ at: 0.4, scroll: { to: ".ve-cta__actions", offset: 420, dur: 2.4, ease: "inOutCubic" } }],
      },
    ],
  }),
  nexora: generic("Nexora · landing", "/demos/landing/nexora.html"),
  orbita: generic("Órbita · landing", "/demos/landing/orbita.html"),
  verbena: generic("Verbena · menú de restaurante", "/demos/verbena.html", {
    hide: [".dm-product__price", ".dm-flavour__price", ".dm-pack__price", "#corestruct"],
    shots: [
      {
        name: "sabores",
        path: "/demos/verbena.html",
        dur: 6,
        start: "#sabores",
        offset: 0,
        preroll: 0.8,
        steps: [{ at: 0.5, scroll: { to: "+1100", dur: 5.2, ease: "inOutSine" } }],
      },
      {
        name: "tienda",
        path: "/demos/verbena.html",
        dur: 6,
        start: "#tienda",
        offset: 0,
        preroll: 0.8,
        steps: [{ at: 0.5, scroll: { to: ".dm-rack", offset: 60, dur: 1.8, ease: "inOutCubic" } }, { at: 3.0, tap: ".dm-product__add" }, { at: 3.6, scroll: { to: "+420", dur: 2.2, ease: "inOutSine" } }],
      },
    ],
  }),
  flujo: generic("Flujo · automatización", "/demos/flujo/index.html", {
    // Los montos en lempiras y la regla que los cita no salen en video.
    hide: [".gw-amount", ".gw-presets", ".gw-route__rule", ".wf-rulecard", ".gw-decide__facts", ".gw-tally"],
    shots: [
      {
        name: "ejecutar",
        path: "/demos/flujo/index.html",
        dur: 7,
        start: "[data-wf-submit]",
        offset: 520,
        preroll: 0.8,
        // El toque llega tarde a propósito: R05 lo revela con el barrido en 4.5 s.
        steps: [{ at: 4.3, tap: "[data-wf-submit]" }, { at: 4.7, scroll: { to: "[data-wf-stage=run]", offset: 120, dur: 1.4, ease: "inOutCubic" } }],
      },
      {
        name: "aprobar",
        path: "/demos/flujo/index.html",
        dur: 6,
        setup: [{ tap: "[data-wf-submit]" }, { wait: 6 }],
        start: "[data-wf-approval]",
        offset: 160,
        preroll: 0.3,
        steps: [{ at: 1.6, tap: '[data-wf-decide="aprobada"]' }, { at: 3.0, scroll: { to: "[data-wf-closing]", offset: 160, dur: 1.6, ease: "inOutCubic" } }],
      },
      {
        name: "documento",
        path: "/demos/flujo/index.html",
        dur: 6,
        // Dos aprobaciones (Administración y Finanzas) cierran el expediente.
        setup: [{ tap: "[data-wf-submit]" }, { wait: 6 }, { tap: '[data-wf-decide="aprobada"]' }, { wait: 2.5 }, { tap: '[data-wf-decide="aprobada"]' }, { wait: 4 }],
        start: ".gw-tabs",
        offset: 120,
        preroll: 0.3,
        steps: [{ at: 0.8, tap: "#tab-documentos" }, { at: 2.0, scroll: { to: "+520", dur: 3.4, ease: "inOutSine" } }],
      },
    ],
  }),
  portafolio: generic("Portafolio CoreStruct", "/index.html", { portfolio: true }),
};

function generic(label, path, { portfolio = false, hide = [], shots = [] } = {}) {
  return {
    label,
    hide,
    // El portafolio ES la marca: se puede grabar para el formato E (B-roll),
    // pero nunca dentro de los primeros 1.5 s de un video.
    portfolio,
    shots: [
      {
        name: "hero",
        path,
        dur: 5,
        start: 0,
        preroll: 0,
        steps: [{ at: 2.4, scroll: { to: 560, dur: 2.4, ease: "inOutCubic" } }],
      },
      {
        name: "recorrido",
        path,
        dur: 8,
        start: 700,
        preroll: 0.8,
        steps: [{ at: 0.3, scroll: { to: "+2200", dur: 7.4, ease: "inOutSine" } }],
      },
      ...shots,
    ],
  };
}
