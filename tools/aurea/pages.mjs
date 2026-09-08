/**
 * Every page of the portal except the homepage, the programme pages and the
 * three product demonstrations.
 *
 * One exported builder per page. Each returns `{ meta, current, body }` and,
 * where it needs one, an `islands` string with the JSON the browser modules
 * read. The build in `tools/build-aurea.mjs` does the rest.
 *
 * The recurring shape is deliberate and worth naming once: a navy page head, a
 * band of prose or figures, and then the working part — a catalogue, a
 * calculator, a calendar. Interior pages of an institutional site are visited
 * with a question already formed, so the answer comes before the argument.
 */

import { escape, fold, longDate, shortDate, lempiras, dateParts } from "../../src/data/aurea/format.js";
import {
  audiences,
  contact,
  facts,
  institution,
  notice,
} from "../../src/data/aurea/institution.js";
import {
  areas,
  labelOf,
  levels,
  modalities,
  programs,
  totalCourses,
  totalCredits,
} from "../../src/data/aurea/programs.js";
import {
  checklist,
  documents as admissionDocs,
  fees,
  financing,
  keyDates,
  scholarships,
  simulatorOptions,
  tracks,
} from "../../src/data/aurea/admissions.js";
import {
  allEvents,
  audiencesFilter,
  categories,
  defaultMonth,
  eventsOfMonth,
} from "../../src/data/aurea/calendar.js";
import { announcements, articles, newsCategories } from "../../src/data/aurea/news.js";
import { authorities, faculty, facultyAreas, offices } from "../../src/data/aurea/people.js";
import { spaces, tourStops, visitFacts, visitOptions } from "../../src/data/aurea/campus.js";
import {
  arts,
  clubCategories,
  clubs,
  culturalEvents,
  service,
  sports,
  sportsResults,
  supportServices,
} from "../../src/data/aurea/life.js";
import { centers, projects, publications, researchFacts, stateLabel } from "../../src/data/aurea/research.js";
import { alumni, employability, international } from "../../src/data/aurea/network.js";
import { gallery, galleryCategories, featuredGallery, byId as galleryById } from "../../src/data/aurea/gallery.js";
import {
  documentCategories,
  documents,
  faqAudiences,
  faqs,
  libraryFacts,
  libraryItems,
  libraryTypes,
} from "../../src/data/aurea/resources.js";
import { mission, model, purpose, timeline, weekInPractice } from "../../src/data/aurea/story.js";
import {
  accordion,
  actions,
  arrowLink,
  band,
  button,
  callout,
  card,
  crumbs,
  feature,
  lightbox,
  mosaic,
  strip,
  tile,
  dateChip,
  demoTag,
  empty,
  figure,
  figureRow,
  filters,
  grid,
  head,
  icon,
  list,
  note,
  page,
  prose,
  quote,
  steps,
  sub,
  table,
  tag,
  timeline as timelineBlock,
} from "./blocks.mjs";
import { campusPlan, locationMap, plate } from "./art.mjs";
import { programCard } from "./program.mjs";
import { breadcrumbSchema, faqSchema, island, pageHead } from "./shell.mjs";

/* --------------------------------------------------------------- helpers */

const trailOf = (label) => [{ label: "Inicio", route: "home" }, { label }];

/**
 * The head band, with the breadcrumb already built.
 *
 * The crumb falls back to the section `label`, not to the `title`: several
 * titles are whole sentences (“Lo que está pasando en AUREA.”) and a sentence
 * in a breadcrumb is unreadable at the top of a page.
 */
const opener = (ctx, { label, title, lead, crumbLabel, aside, art }) =>
  pageHead({
    crumbs: crumbs(ctx, trailOf(crumbLabel ?? label ?? title)),
    label,
    title,
    lead,
    aside,
    art,
  });

/** A programme has a laboratory unless it is a pure business programme. */
export const hasLab = (program) =>
  program.areas.some((area) => ["tecnologia", "creatividad", "salud"].includes(area)) ||
  program.slug === "bachillerato-ciencias-humanidades";

/* ===========================================================================
   INSTITUCIÓN
   ======================================================================== */

export function institutionPage(ctx) {
  const body = [
    opener(ctx, {
      label: "La institución",
      art: "graduacion",
      crumbLabel: "Institución",
      title: purpose.title,
      lead: purpose.lead,
    }),

    band({
      id: "proposito",
      body:
        `<div class="au-split">` +
        `<div class="au-prose" data-reveal="fade">${prose(purpose.body, "au-lead")}</div>` +
        `<div><h2 class="au-h--ui" style="font-size:var(--step-1);margin-bottom:0.9rem">Cuatro compromisos</h2>` +
        `<div class="au-grid au-grid--2" data-reveal-group>` +
        purpose.pillars
          .map((pillar) => card({ kicker: pillar.label, title: pillar.text, className: "au-card--flat", level: 3 }))
          .join("") +
        `</div></div></div>`,
    }),

    band({
      tone: "sunken",
      body: strip(["aula", "laboratorio", "biblioteca", "patio"]),
      tight: true,
    }),

    band({
      tone: "tint",
      id: "historia",
      body:
        head({
          index: "01",
          label: "Nuestra historia",
          title: "De cuarenta y dos estudiantes a ocho mil cuatrocientos.",
          body: "Veinticinco años en seis momentos. Fechas y cifras demostrativas.",
        }) + timelineBlock(timeline),
    }),

    band({
      id: "mision",
      body:
        head({ index: "02", label: "Misión, visión y valores", title: "Lo que decimos que hacemos." }) +
        `<div style="display:grid;gap:clamp(1.2rem,3vw,2.4rem);grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));margin-bottom:clamp(2rem,4vw,3rem)">` +
        `<div class="au-card au-card--accent"><p class="au-card__kicker">Misión</p>` +
        `<p class="au-lead" style="margin:0">${escape(mission.mission)}</p></div>` +
        `<div class="au-card au-card--accent"><p class="au-card__kicker">Visión</p>` +
        `<p class="au-lead" style="margin:0">${escape(mission.vision)}</p></div>` +
        `</div>` +
        grid(
          mission.values.map((value) => card({ title: value.name, text: value.text, className: "au-card--flat" })),
          3,
        ),
    }),

    band({
      tone: "dark",
      id: "modelo",
      body:
        head({
          index: "03",
          label: "Modelo educativo",
          title: model.title,
          body: model.lead,
        }) +
        `<div style="margin-bottom:clamp(2rem,4vw,3rem)">` +
        feature({
          plate: "taller",
          caption: "Centro de Innovación. Ilustración demostrativa.",
          body:
            `<p class="au-lead" style="color:var(--ink-onDark)">Un modelo educativo se demuestra en el ` +
            `horario, no en el folleto. Estos cuatro pilares tienen horas, espacios y evaluación ` +
            `asignados, y la sección de abajo dice exactamente cuántas.</p>` +
            `<div style="margin-top:1.2rem">${arrowLink("Cómo se reparte una semana", page(ctx, "institucion", "modelo"))}</div>`,
        }) +
        `</div>` +
        grid(
          model.pillars.map((pillar) =>
            card({
              kicker: pillar.name,
              title: pillar.experiences[0],
              text: pillar.text,
              foot:
                `<ul class="au-tags">` +
                pillar.experiences
                  .slice(1)
                  .map((experience) => `<li>${tag(experience, "soft")}</li>`)
                  .join("") +
                `</ul>`,
              className: "au-card--dark",
            }),
          ),
          4,
        ) +
        `<div style="margin-top:clamp(2rem,4vw,3rem)">` +
        `<h3 class="au-h--ui" style="color:var(--white);margin-bottom:1rem">Cómo se reparte una semana</h3>` +
        `<div class="au-figures" data-reveal-group>` +
        weekInPractice
          .map((slice) => figure({ value: `${slice.share}`, suffix: " %", label: slice.label, note: slice.note }))
          .join("") +
        `</div>` +
        `<p class="au-note">${escape(notice.dataShort)}. La distribución es una descripción del diseño curricular, no una medición.</p>` +
        `</div>`,
    }),

    band({
      tone: "tint",
      id: "autoridades",
      body:
        head({
          index: "04",
          label: "Autoridades",
          title: "Quién responde por qué.",
          action: arrowLink("Directorio institucional completo", page(ctx, "directorio")),
        }) +
        grid(
          authorities.map((person) =>
            card({
              kicker: `${person.role} · desde ${person.since}`,
              title: person.name,
              text: `${person.title}. ${person.text}`,
            }),
          ),
          3,
        ),
    }),

    band({
      body:
        `<div class="au-split au-split--even au-split--center">` +
        quote(
          "No enseñamos para el examen. Enseñamos para el momento, dos o diez años después, en " +
            "que alguien tiene un problema delante y ninguna instrucción de qué hacer con él.",
          "Elena Villalta · Rectora",
        ) +
        `<div>${figureRow(facts.slice(0, 4).map((fact) => figure({ value: fact.value.toLocaleString("es-HN"), suffix: fact.suffix, label: fact.label, count: fact.value })))}` +
        `<p class="au-note">${escape(notice.dataShort)}</p></div></div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Institución",
      description:
        "Historia, misión, visión, valores, modelo educativo y autoridades de AUREA, " +
        "institución educativa ficticia creada como demostración de portafolio.",
      canonical: "institucion.html",
      schema: [breadcrumbSchema(trailOf("Institución"))],
    },
    current: "institucion",
    body,
  };
}

/* ===========================================================================
   OFERTA ACADÉMICA
   ======================================================================== */

export function offerPage(ctx) {
  const mediaPrograms = programs.filter((program) => program.levels.includes("media"));
  const superiorPrograms = programs.filter((program) => program.levels.includes("licenciatura"));

  const comparison = table({
    caption: "Comparación de los nueve programas. Costos y cifras demostrativos.",
    columns: [
      { label: "Programa" },
      { label: "Nivel" },
      { label: "Duración" },
      { label: "Modalidad" },
      { label: "Asignaturas", num: true },
      { label: "UV", num: true },
      { label: "Desde", num: true },
    ],
    rows: programs.map((program) => [
      `<a href="${sub(ctx, "programas", program.slug)}">${escape(program.short)}</a>`,
      escape(program.levels.map((level) => labelOf(levels, level)).join(" · ")),
      escape(program.duration),
      escape(program.modalities.map((mode) => labelOf(modalities, mode)).join(" · ")),
      String(totalCourses(program)),
      String(totalCredits(program)),
      escape(
        program.costs.kind === "asignatura"
          ? `${lempiras(program.costs.perCourse)} / asignatura`
          : `${lempiras(program.costs.monthly)} / mes`,
      ),
    ]),
  });

  const body = [
    opener(ctx, {
      label: "Oferta académica",
      art: "aula",
      title: "Encuentra tu camino.",
      lead:
        "Tres bachilleratos de educación media y seis licenciaturas, en un mismo campus. " +
        "Filtra por nivel, modalidad y área de interés, o escribe lo que te interesa.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Comparar programas", "#comparar", { onDark: true })}${button("Calcular costos", page(ctx, "costos", "calculadora"), { gold: true })}</div>`,
    }),

    band({
      id: "buscador",
      body:
        `<div data-collection data-noun="programas" data-noun-one="programa">` +
        filters({
          searchLabel: "¿Qué quieres estudiar?",
          searchPlaceholder: "Ingeniería, administración, psicología, diseño…",
          groups: [
            { key: "nivel", label: "Nivel", options: levels },
            { key: "modalidad", label: "Modalidad", options: modalities },
            { key: "area", label: "Área de interés", options: areas },
          ],
          countLabel: `${programs.length} programas`,
        }) +
        `<div id="media" data-item-section style="margin-top:clamp(2rem,4vw,3rem)">` +
        `<h2 class="au-h--ui" style="font-size:var(--step-2);margin-bottom:1.2rem">Educación Media</h2>` +
        `<div class="au-grid au-grid--3" data-reveal-group>` +
        mediaPrograms.map((program) => programCard(ctx, program)).join("") +
        `</div></div>` +
        `<div id="superior" data-item-section style="margin-top:clamp(2.4rem,4vw,3.5rem)">` +
        `<h2 class="au-h--ui" style="font-size:var(--step-2);margin-bottom:1.2rem">Educación Superior</h2>` +
        `<div class="au-grid au-grid--3" data-reveal-group>` +
        superiorPrograms.map((program) => programCard(ctx, program)).join("") +
        `</div></div>` +
        empty("Ningún programa coincide con esos filtros. Prueba con menos criterios o limpia la búsqueda.") +
        `</div>`,
    }),

    band({
      tone: "sunken",
      id: "tecnico",
      body:
        head({
          index: "01",
          label: "Formación técnica",
          title: "Un bachillerato que ya vale en el mercado laboral.",
          body:
            "Los dos Bachilleratos Técnicos Profesionales entregan el título de educación media " +
            "y una competencia técnica al mismo tiempo, con práctica profesional obligatoria en " +
            "empresas aliadas.",
          action: arrowLink("Ver empresas aliadas", page(ctx, "empleabilidad", "empresas")),
        }) +
        `<div class="au-grid au-grid--2" data-reveal-group>` +
        programs
          .filter((program) => program.levels.includes("tecnico"))
          .map((program) => programCard(ctx, program))
          .join("") +
        `</div>`,
    }),

    band({
      id: "comparar",
      body:
        head({
          index: "02",
          label: "Comparación",
          title: "Los nueve programas, lado a lado.",
          body: "Duración, modalidad, carga y costo de referencia. Cifras demostrativas.",
          action: demoTag(),
          ui: true,
        }) + comparison,
    }),

    band({
      tone: "tint",
      body:
        `<div style="display:grid;gap:clamp(1.2rem,3vw,2.4rem);grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))">` +
        [
          { title: "¿Aún no decides?", text: "Programa una visita al campus y conversa con la coordinación de la carrera que te interesa.", label: "Programar visita", route: "campus", hash: "visita" },
          { title: "¿Cuánto cuesta?", text: "La calculadora estima el período completo con cargos adicionales y beca aplicada.", label: "Abrir calculadora", route: "costos", hash: "calculadora" },
          { title: "¿Puedes pagarlo?", text: "Cinco programas de beca, del 25 % al 80 %. El simulador indica a cuáles podrías aplicar.", label: "Simular beca", route: "becas", hash: "simulador" },
        ]
          .map(
            (item) =>
              `<div class="au-card"><h2 class="au-card__title au-h--ui" style="font-size:var(--step-1)">${escape(item.title)}</h2>` +
              `<p class="au-card__text">${escape(item.text)}</p>` +
              `<div class="au-card__foot">${arrowLink(item.label, page(ctx, item.route, item.hash))}</div></div>`,
          )
          .join("") +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Oferta académica",
      description:
        "Nueve programas demostrativos de AUREA: tres bachilleratos de educación media y seis " +
        "licenciaturas, con buscador por nivel, modalidad y área de interés.",
      canonical: "oferta-academica.html",
      schema: [breadcrumbSchema(trailOf("Oferta académica"))],
    },
    current: "oferta",
    body,
  };
}

/* ===========================================================================
   ADMISIONES
   ======================================================================== */

export function admissionsPage(ctx) {
  const trackTabs = tracks
    .map(
      (track, index) =>
        `<button class="au-tab" type="button" role="tab" id="au-track-${track.id}" ` +
        `aria-controls="au-trackpanel-${track.id}" aria-selected="${index === 0}" ` +
        `tabindex="${index === 0 ? 0 : -1}">${escape(track.label)}</button>`,
    )
    .join("");

  const trackPanels = tracks
    .map(
      (track, index) =>
        `<div class="au-tabpanel" role="tabpanel" id="au-trackpanel-${track.id}" ` +
        `aria-labelledby="au-track-${track.id}"${index === 0 ? "" : " hidden"}>` +
        `<p class="au-lead" style="max-width:60ch;margin-bottom:1.6rem">${escape(track.lead)}</p>` +
        steps(track.steps) +
        `</div>`,
    )
    .join("");

  const checkItems = checklist
    .map(
      (item) =>
        `<li><label class="au-check">` +
        `<input type="checkbox" value="${escape(item.id)}"${item.done ? " checked" : ""} />` +
        `<span class="au-check__box" aria-hidden="true"></span>` +
        `<span class="au-check__label"><b>${escape(item.label)}</b><span>${escape(item.note)}</span></span>` +
        `</label></li>`,
    )
    .join("");

  const done = checklist.filter((item) => item.done).length;
  const startPct = Math.round((done / checklist.length) * 100);

  const dateList = keyDates
    .map(
      (entry) =>
        `<li class="au-date">${dateChip(entry.date)}` +
        `<h3 class="au-date__title">${escape(entry.title)}</h3>` +
        `<span class="au-row__end">${tag(entry.state === "abierta" ? "Abierta" : "Próxima", entry.state === "abierta" ? "ok" : "")}</span>` +
        `<p class="au-date__text">${escape(entry.text)}</p></li>`,
    )
    .join("");

  const docsFor = (kind, title) =>
    `<div><h3 class="au-h--ui" style="margin-bottom:0.8rem">${escape(title)}</h3>` +
    `<ul class="au-scholarship__reqs" style="font-size:var(--step--1)">` +
    admissionDocs[kind]
      .map((doc) => `<li><b>${escape(doc.label)}</b> — ${escape(doc.note)}</li>`)
      .join("") +
    `</ul></div>`;

  const body = [
    opener(ctx, {
      label: "Admisiones 2027",
      art: "examen",
      crumbLabel: "Admisiones",
      title: "Tu camino a AUREA comienza aquí.",
      lead:
        "El proceso completo, las fechas, los documentos y una demostración de cómo se vería " +
        "el seguimiento de tu solicitud en un portal real.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Comenzar mi solicitud", "#checklist", { gold: true })}${button("Ver fechas", "#fechas", { onDark: true })}</div>`,
    }),

    band({
      id: "media",
      body:
        head({
          index: "01",
          label: "El proceso",
          title: "Dos niveles, dos procesos.",
          body:
            "Comparten la forma y casi nada más: quién aplica, qué se evalúa y qué tiene que " +
            "traer la familia son distintos, y unificarlos en una sola lista los volvería vagos a los dos.",
          ui: true,
        }) +
        `<div class="au-tabs" role="tablist" aria-label="Nivel educativo">${trackTabs}</div>` +
        trackPanels +
        `<p class="au-sr" id="superior">Educación superior</p>`,
    }),

    band({
      tone: "tint",
      id: "checklist",
      body:
        head({
          index: "02",
          label: "Seguimiento de solicitud",
          title: "Tu solicitud, paso a paso.",
          body:
            "Una demostración funcional del panel que vería un aspirante. Marca lo que ya " +
            "hiciste: el avance se guarda en tu navegador y nada se envía a ningún servidor.",
          ui: true,
        }) +
        `<div class="au-checklist" data-checklist data-progress="${startPct}">` +
        `<div class="au-checklist__head">` +
        `<h3 class="au-h--ui" style="font-size:var(--step-1)">Tu solicitud</h3>` +
        `<p class="au-checklist__pct" data-checklist-pct>${startPct}%</p></div>` +
        `<div class="au-meter"><div class="au-meter__fill" data-checklist-fill style="width:${startPct}%"></div></div>` +
        `<p class="au-sr" data-checklist-status role="status" aria-live="polite">` +
        `${done} de ${checklist.length} pasos completados · ${startPct}% de la solicitud</p>` +
        `<ul class="au-checklist__items">${checkItems}</ul>` +
        `</div>` +
        note(
          "Demostración frontend. No hay formulario detrás, no se recopila información y el " +
            "estado vive únicamente en este navegador.",
        ),
    }),

    band({
      id: "requisitos",
      body:
        head({
          index: "03",
          label: "Documentación",
          title: "Qué tienes que traer.",
          body: "Se admite copia digital para la revisión de la solicitud; los originales se presentan en la matrícula.",
          ui: true,
        }) +
        `<div class="au-split au-split--even">` +
        docsFor("media", "Educación Media") +
        docsFor("superior", "Educación Superior") +
        `</div>` +
        `<div style="margin-top:2rem">${callout({
          title: "Egresados de AUREA",
          text: "Quien completa educación media en AUREA queda exento de la prueba de admisión al continuar a cualquiera de las seis licenciaturas de la institución.",
        })}</div>`,
    }),

    band({
      tone: "sunken",
      id: "fechas",
      body:
        head({
          index: "04",
          label: "Calendario de admisiones",
          title: "Fechas importantes.",
          action: actions([
            button("Ver el calendario completo", page(ctx, "calendario"), { ghost: true }),
            demoTag("Fechas demostrativas"),
          ]),
          ui: true,
        }) + `<ul class="au-dates">${dateList}</ul>`,
    }),

    band({
      body:
        `<div style="display:grid;gap:clamp(1.5rem,4vw,3rem);grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))">` +
        card({
          kicker: "Becas",
          title: "Que el costo no detenga tu talento.",
          text: "Cinco programas del 25 % al 80 %. El expediente se recibe hasta el 15 de enero.",
          foot: arrowLink("Ver becas", page(ctx, "becas")),
          accent: true,
        }) +
        card({
          kicker: "Costos",
          title: "Cuánto cuesta, sin llamar por teléfono.",
          text: "Aranceles publicados y una calculadora que estima el período completo.",
          foot: arrowLink("Abrir calculadora", page(ctx, "costos", "calculadora")),
          accent: true,
        }) +
        card({
          kicker: "Campus",
          title: "Ven a verlo antes de decidir.",
          text: "Recorridos de lunes a sábado, sin costo, con la coordinación de tu carrera.",
          foot: arrowLink("Programar visita", page(ctx, "campus", "visita")),
          accent: true,
        }) +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Admisiones",
      description:
        "Proceso de admisión demostrativo de AUREA para educación media y superior: seis pasos, " +
        "requisitos, documentación, fechas 2027 y un checklist interactivo de solicitud.",
      canonical: "admisiones.html",
      schema: [breadcrumbSchema(trailOf("Admisiones"))],
    },
    current: "admisiones",
    body,
  };
}

/* ===========================================================================
   BECAS
   ======================================================================== */

export function scholarshipsPage(ctx) {
  const cards = scholarships
    .map(
      (entry) =>
        `<article class="au-scholarship" data-scholarship="${escape(entry.id)}" id="${escape(entry.id)}">` +
        `<p class="au-card__kicker">${escape(entry.quota)}</p>` +
        `<h3 class="au-card__title">${escape(entry.name)}</h3>` +
        `<p class="au-scholarship__benefit">${escape(entry.benefit)}</p>` +
        `<p class="au-card__text">${escape(entry.summary)}</p>` +
        `<ul class="au-scholarship__reqs">` +
        entry.requirements.map((requirement) => `<li>${escape(requirement)}</li>`).join("") +
        `</ul>` +
        `<p class="au-card__kicker">Cierre: ${escape(longDate(entry.deadline))} · ${escape(entry.renewable)}</p>` +
        `<div class="au-card__foot">${button("Solicitar esta beca", page(ctx, "admisiones", "checklist"), { ghost: true, small: true })}</div>` +
        `</article>`,
    )
    .join("");

  const simulator =
    `<form class="au-checklist" data-scholarship-form>` +
    `<div class="au-checklist__head">` +
    `<h3 class="au-h--ui" style="font-size:var(--step-1)">Simulador de beca</h3>` +
    demoTag("Simulador demostrativo") +
    `</div>` +
    `<div class="au-formgrid">` +
    `<div class="au-field"><label class="au-field__label" for="au-promedio">Promedio académico</label>` +
    `<input class="au-input" id="au-promedio" name="promedio" type="number" min="0" max="100" step="1" value="90" required />` +
    `<span class="au-field__hint">Del último año cursado, de 0 a 100.</span></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-actividad">Actividades extracurriculares</label>` +
    `<select class="au-select" id="au-actividad" name="actividad">` +
    simulatorOptions.activities
      .map((option) => `<option value="${escape(option.id)}">${escape(option.label)}</option>`)
      .join("") +
    `</select></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-necesidad">Necesidad financiera</label>` +
    `<select class="au-select" id="au-necesidad" name="necesidad">` +
    simulatorOptions.needs
      .map((option) => `<option value="${escape(option.id)}">${escape(option.label)}</option>`)
      .join("") +
    `</select></div>` +
    `</div>` +
    `<div class="au-actions">${button("Ver opciones", null, { solid: true, type: "submit" })}` +
    `<button class="au-btn au-btn--ghost" type="reset">Limpiar</button></div>` +
    `<div class="au-result" data-scholarship-result hidden tabindex="-1">` +
    `<p class="au-result__label">Resultado de la simulación</p>` +
    `<p class="au-result__value" data-scholarship-headline>—</p>` +
    `<p style="margin:0;color:var(--ink-soft);font-size:var(--step--1)" data-scholarship-detail></p>` +
    `</div>` +
    note(notice.simulator) +
    `</form>`;

  const body = [
    opener(ctx, {
      label: "Becas y financiamiento",
      art: "ceremonia",
      crumbLabel: "Becas",
      title: "Que el costo no detenga tu talento.",
      lead:
        "Cinco programas de beca, del 25 % al 80 % del arancel, más descuentos por pago " +
        "anticipado, por hermanos y por convenio empresarial.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Simular mi beca", "#simulador", { gold: true })}${button("Calcular costos", page(ctx, "costos", "calculadora"), { onDark: true })}</div>`,
    }),

    band({
      tone: "tint",
      tight: true,
      body: feature({
        plate: "graduacion",
        caption: "Promoción 2026. Ilustración demostrativa.",
        flip: true,
        body:
          `<p class="au-label"><span>El fondo de becas</span></p>` +
          `<h2 style="margin-bottom:0.8rem">Uno de cada tres estudiantes tiene beca.</h2>` +
          `<p class="au-lead">El sistema existe para que el ingreso familiar no decida quién ` +
          `estudia. Cinco programas, del 25 % al 80 % del arancel, acumulables con los ` +
          `descuentos por hermanos y por convenio hasta un tope del 80 %.</p>` +
          `<div style="margin-top:1.2rem">${demoTag("Cifra demostrativa")}</div>`,
      }),
    }),

    band({
      id: "programas",
      body:
        head({
          index: "01",
          label: "Programas de beca",
          title: "Cinco caminos, un mismo expediente.",
          body: `Todos cierran el ${longDate(scholarships[0].deadline)}. El estudio socioeconómico se agenda desde la misma solicitud.`,
          action: demoTag("Criterios demostrativos"),
        }) +
        `<div class="au-grid au-grid--3" data-reveal-group>${cards}</div>`,
    }),

    band({
      tone: "tint",
      id: "simulador",
      body:
        head({
          index: "02",
          label: "Simulador",
          title: "¿A cuáles podrías aplicar?",
          body:
            "Indica tu perfil y el simulador marca los programas compatibles arriba. No evalúa, " +
            "no reserva y no estima probabilidad: dice a cuáles podrías presentar expediente.",
          ui: true,
        }) + simulator,
    }),

    band({
      id: "financiamiento",
      body:
        head({ index: "03", label: "Financiamiento", title: "Además de las becas.", ui: true }) +
        grid(
          financing.map((item) => card({ title: item.title, text: item.text, className: "au-card--flat" })),
          3,
        ) +
        `<div style="margin-top:2rem">${callout({
          kind: "gold",
          title: "Tope acumulado",
          text: "Beca y descuentos son acumulables hasta un máximo del 80 % del arancel. El descuento por hermanos aplica mientras ambos estén matriculados de forma simultánea.",
        })}</div>`,
    }),
  ].join("\n\n");

  /* The simulator's rules, for the browser. Coarse on purpose — see
     `data/aurea/admissions.js`. */
  const rules = scholarships.map((entry) => ({
    id: entry.id,
    name: entry.name,
    grade: entry.criteria.grade,
    activity: entry.criteria.activity,
    need: entry.criteria.need,
  }));

  return {
    meta: {
      title: "Becas y financiamiento",
      description:
        "Cinco programas de beca demostrativos de AUREA — Excelencia, Deportiva, Artística, " +
        "Socioeconómica y Liderazgo — con requisitos, fechas y un simulador de elegibilidad.",
      canonical: "becas.html",
      schema: [breadcrumbSchema(trailOf("Becas"))],
    },
    current: "admisiones",
    body,
    islands: island("au-scholarships", rules),
  };
}

/* ===========================================================================
   COSTOS
   ======================================================================== */

export function costsPage(ctx) {
  const rows = programs.map((program) => [
    `<a href="${sub(ctx, "programas", program.slug)}">${escape(program.short)}</a>`,
    escape(program.levels.map((level) => labelOf(levels, level)).join(" · ")),
    escape(lempiras(program.costs.enrollment)),
    escape(
      program.costs.kind === "asignatura"
        ? `${lempiras(program.costs.perCourse)} / asignatura`
        : `${lempiras(program.costs.monthly)} / mes`,
    ),
    escape(hasLab(program) ? "Sí" : "No"),
  ]);

  const extras = table({
    caption: "Cargos adicionales por período. Cifras demostrativas.",
    columns: [{ label: "Concepto" }, { label: "Monto", num: true }, { label: "Aplicación" }],
    rows: [
      [escape(fees.registrationLabel), escape(lempiras(fees.registration)), escape(fees.registrationNote)],
      ...fees.extras.map((extra) => [escape(extra.label), escape(lempiras(extra.amount)), escape(extra.note)]),
    ],
  });

  const calculator =
    `<form class="au-checklist" data-cost-form>` +
    `<div class="au-checklist__head">` +
    `<h3 class="au-h--ui" style="font-size:var(--step-1)">Calculadora de matrícula</h3>` +
    demoTag("Simulador demostrativo") +
    `</div>` +
    `<div class="au-formgrid">` +
    `<div class="au-field"><label class="au-field__label" for="au-programa">Programa</label>` +
    `<select class="au-select" id="au-programa" name="programa">` +
    programs.map((program) => `<option value="${escape(program.slug)}">${escape(program.name)}</option>`).join("") +
    `</select></div>` +
    `<div class="au-field" data-cost-courses-field><label class="au-field__label" for="au-asignaturas">Asignaturas del período</label>` +
    `<input class="au-input" id="au-asignaturas" name="asignaturas" type="number" min="1" max="8" step="1" value="5" />` +
    `<span class="au-field__hint">Entre 3 y 6 es la carga habitual.</span></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-beca">Beca aproximada</label>` +
    `<select class="au-select" id="au-beca" name="beca">` +
    fees.discounts.map((entry) => `<option value="${escape(entry.id)}">${escape(entry.label)}</option>`).join("") +
    `</select></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-plan">Plan de pago</label>` +
    `<select class="au-select" id="au-plan" name="plan">` +
    fees.plans
      .map(
        (plan) =>
          `<option value="${escape(plan.id)}"${plan.id === "mensual" ? " selected" : ""}>${escape(plan.label)} · ${escape(plan.note)}</option>`,
      )
      .join("") +
    `</select></div>` +
    `</div>` +
    `<div class="au-result">` +
    `<p class="au-result__label">Estimación del período</p>` +
    `<dl class="au-result__rows" data-cost-rows></dl>` +
    `<div class="au-result__row au-result__row--total"><dt>Total aproximado del período</dt>` +
    `<dd data-cost-total>—</dd></div>` +
    `<p style="margin:0;color:var(--ink-muted);font-size:var(--step--1)">Equivalente a <b data-cost-monthly>—</b></p>` +
    `</div>` +
    `<div class="au-actions">${button("Recibir información", null, { solid: true, type: "submit" })}` +
    `${button("Hablar con admisiones", page(ctx, "contacto"), { ghost: true })}</div>` +
    note(notice.simulator) +
    `</form>`;

  const body = [
    opener(ctx, {
      label: "Costos",
      art: "series",
      title: "Lo que cuesta, publicado.",
      lead:
        "Educación media se cobra por mensualidad y educación superior por asignatura. Los dos " +
        "modelos están abajo, con los cargos adicionales y una calculadora que suma el período completo.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Abrir la calculadora", "#calculadora", { gold: true })}${button("Ver becas", page(ctx, "becas"), { onDark: true })}</div>`,
    }),

    band({
      id: "aranceles",
      body:
        head({
          index: "01",
          label: "Aranceles 2027",
          title: "Por programa.",
          action: demoTag("Cifras demostrativas"),
          ui: true,
        }) +
        table({
          caption: "Aranceles de referencia por programa. Cifras demostrativas.",
          columns: [
            { label: "Programa" },
            { label: "Nivel" },
            { label: "Matrícula", num: true },
            { label: "Arancel", num: true },
            { label: "Laboratorio" },
          ],
          rows,
        }) +
        `<div style="margin-top:2rem">${extras}</div>`,
    }),

    band({
      tone: "tint",
      id: "calculadora",
      body:
        head({
          index: "02",
          label: "Calculadora",
          title: "Estima tu período completo.",
          body:
            "La beca reduce el arancel y no los cargos administrativos, que es como se aplica " +
            "de verdad. El plan de pago ajusta el total resultante.",
          ui: true,
        }) + calculator,
    }),

    band({
      body:
        head({ index: "03", label: "Formas de pago", title: "Cómo se paga.", ui: true }) +
        grid(
          financing.map((item) => card({ title: item.title, text: item.text, className: "au-card--flat" })),
          3,
        ),
    }),
  ].join("\n\n");

  const costData = {
    programs: Object.fromEntries(
      programs.map((program) => [
        program.slug,
        {
          name: program.name,
          kind: program.costs.kind,
          enrollment: program.costs.enrollment,
          monthly: program.costs.monthly ?? null,
          months: program.costs.months ?? null,
          perCourse: program.costs.perCourse ?? null,
          coursesTypical: program.costs.coursesTypical ?? null,
          lab: hasLab(program),
        },
      ]),
    ),
    fees,
  };

  return {
    meta: {
      title: "Costos y aranceles",
      description:
        "Aranceles demostrativos de los nueve programas de AUREA, cargos adicionales, formas de " +
        "pago y una calculadora de matrícula por período.",
      canonical: "costos.html",
      schema: [breadcrumbSchema(trailOf("Costos"))],
    },
    current: "admisiones",
    body,
    islands: island("au-costs", costData),
  };
}

/* ===========================================================================
   CALENDARIO
   ======================================================================== */

export function calendarPage(ctx) {
  const monthEvents = eventsOfMonth(defaultMonth.year, defaultMonth.month);

  const legend = categories
    .map(
      (category) =>
        `<span class="au-cal__key"><span class="au-cal__swatch" style="background:var(--cal-${category.id}, var(--blue))"></span>` +
        `${escape(category.label)}</span>`,
    )
    .join("");

  const exportMenu = (event) =>
    `<span class="au-export" data-export="${escape(event.id)}">` +
    `<button class="au-btn au-btn--small au-btn--ghost" type="button" data-export-toggle ` +
    `aria-expanded="false" aria-haspopup="true">Agregar a mi calendario</button>` +
    `<span class="au-export__menu" data-export-menu hidden>` +
    `<button class="au-export__item" type="button" data-export-target="google">Google Calendar</button>` +
    `<button class="au-export__item" type="button" data-export-target="outlook">Outlook</button>` +
    `<button class="au-export__item" type="button" data-export-target="ical">Apple Calendar · iCal</button>` +
    `<button class="au-export__item" type="button" data-export-target="descargar">Descargar .ics</button>` +
    `</span></span>`;

  const listItems = allEvents
    .map((event) => {
      const range = event.endDate ? `${shortDate(event.date)} – ${shortDate(event.endDate)}` : shortDate(event.date);
      return (
        `<li class="au-event" data-event="${escape(event.id)}">` +
        dateChip(event.date) +
        `<h3 class="au-row__title">${escape(event.title)}</h3>` +
        `<span class="au-row__end">${tag(labelOf(categories, event.category))}</span>` +
        `<p class="au-event__meta"><span>${escape(range)}</span><span>${escape(event.time)}</span>` +
        `<span>${escape(event.place)}</span>` +
        `<span>${escape(labelOf(audiencesFilter, event.audience))}</span></p>` +
        `<p class="au-event__text">${escape(event.text)}</p>` +
        `<p class="au-event__actions">${exportMenu(event)}</p>` +
        `</li>`
      );
    })
    .join("");

  const chips = (key, options) =>
    options
      .map(
        (option) =>
          `<button class="au-chip" type="button" data-cal-filter="${key}" ` +
          `data-value="${escape(option.id)}" aria-pressed="false">${escape(option.label)}</button>`,
      )
      .join("");

  /* The build renders the opening month; `scripts/aurea/calendar.js` re-renders
     it from the same objects when the reader moves. */
  const initialGrid = buildMonthGrid(defaultMonth.year, defaultMonth.month, monthEvents);

  const body = [
    opener(ctx, {
      label: "Calendario institucional",
      art: "auditorio",
      crumbLabel: "Calendario",
      title: "Lo que está pasando en AUREA.",
      lead:
        "Filtra por tipo de actividad y por audiencia, y exporta cualquier evento a tu propio " +
        "calendario. Todas las fechas son demostrativas.",
    }),

    band({
      id: "proximos",
      body:
        head({
          index: "01",
          label: "Agenda",
          title: "Todo el año lectivo.",
          body:
            "Veintisiete actividades entre septiembre de 2026 y julio de 2027, incluidas las " +
            "fechas de admisión, que viven en un solo lugar y se muestran en los dos.",
          ui: true,
        }) +
        `<div class="au-cal" data-calendar data-year="${defaultMonth.year}" data-month="${defaultMonth.month}">` +
        `<div class="au-filters">` +
        `<div class="au-filters__row"><p class="au-filters__legend" id="au-cal-cat">Tipo de actividad</p>` +
        `<div class="au-chips" role="group" aria-labelledby="au-cal-cat">${chips("category", categories)}</div></div>` +
        `<div class="au-filters__row"><p class="au-filters__legend" id="au-cal-aud">Audiencia</p>` +
        `<div class="au-chips" role="group" aria-labelledby="au-cal-aud">${chips("audience", audiencesFilter)}</div></div>` +
        `<div class="au-filters__foot">` +
        `<p class="au-filters__count" data-cal-count aria-live="polite">${allEvents.length} eventos</p>` +
        `<span class="au-cal__legend">${legend}</span>` +
        `</div></div>` +
        `<div class="au-cal__bar">` +
        `<div class="au-cal__nav">` +
        `<button class="au-iconbtn" type="button" data-cal-prev aria-label="Mes anterior">←</button>` +
        `<p class="au-cal__month" data-cal-month role="status" aria-live="polite">septiembre 2026</p>` +
        `<button class="au-iconbtn" type="button" data-cal-next aria-label="Mes siguiente">→</button>` +
        `</div>` +
        `<div class="au-cal__views" role="group" aria-label="Vista del calendario">` +
        `<button class="au-cal__view" type="button" data-cal-view="mes" aria-pressed="true">Mes</button>` +
        `<button class="au-cal__view" type="button" data-cal-view="lista" aria-pressed="false">Lista</button>` +
        `</div></div>` +
        `<div class="au-scroller" data-cal-gridwrap>` +
        `<div class="au-cal__grid" data-cal-grid role="grid" aria-label="Calendario mensual">${initialGrid}</div>` +
        `</div>` +
        `<ul class="au-cal__list" data-cal-list hidden>${listItems}</ul>` +
        `<p class="au-empty" data-cal-empty hidden>Ningún evento coincide con esos filtros.</p>` +
        `</div>` +
        note(
          "El archivo .ics se genera en tu navegador a partir de los datos del evento. No se " +
            "envía nada a ningún servidor para producirlo.",
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Calendario institucional",
      description:
        "Calendario demostrativo de AUREA: eventos académicos, de admisiones, deportivos, " +
        "culturales e institucionales, filtrables por audiencia y exportables a Google, Outlook e iCal.",
      canonical: "calendario.html",
      schema: [breadcrumbSchema(trailOf("Calendario"))],
    },
    current: "vida",
    body,
    islands: island("au-events", allEvents),
  };
}

const DOW = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/** The opening month, rendered server-side so the page works without scripts. */
function buildMonthGrid(year, month, monthEvents) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);

  for (let day = 1; day <= days; day++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      day,
      events: monthEvents.filter((event) => {
        const end = event.endDate ?? event.date;
        return iso >= event.date && iso <= end;
      }),
    });
  }

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    DOW.map((day) => `<div class="au-cal__dow" role="columnheader">${day}</div>`).join("") +
    cells
      .map((cell) => {
        if (!cell) return '<div class="au-cal__day au-cal__day--out" aria-hidden="true"></div>';
        const marks = cell.events
          .map(
            (event) =>
              `<button class="au-cal__event" type="button" data-cat="${escape(event.category)}" ` +
              `data-goto="${escape(event.id)}">${escape(event.title)}</button>`,
          )
          .join("");
        return `<div class="au-cal__day"><span class="au-cal__num">${cell.day}</span>${marks}</div>`;
      })
      .join("")
  );
}

/* ===========================================================================
   NOTICIAS
   ======================================================================== */

export function newsroomPage(ctx) {
  const cards = articles
    .map(
      (article) =>
        `<a class="au-news" href="${sub(ctx, "noticias", article.slug)}" data-item ` +
        `data-haystack="${escape(fold(`${article.title} ${article.summary} ${article.category}`))}" ` +
        `data-categoria="${escape(article.category)}">` +
        `<span class="au-news__cover">${plate(article.plate)}</span>` +
        `<span class="au-news__body">` +
        `<span class="au-news__meta">${tag(labelOf(newsCategories, article.category))}` +
        `<span>${escape(shortDate(article.date))}</span></span>` +
        `<h3 class="au-news__title">${escape(article.title)}</h3>` +
        `<p class="au-news__summary">${escape(article.summary)}</p></span></a>`,
    )
    .join("");

  const notices = announcements
    .map(
      (item) =>
        `<article class="au-ann au-ann--${item.level}">` +
        `<p class="au-ann__head">${tag(item.office, "soft")}` +
        `<span>${escape(shortDate(item.date))} · vigente hasta ${escape(shortDate(item.until))}</span>` +
        `${item.level === "urgente" ? tag("Urgente", "alert") : ""}</p>` +
        `<h3 class="au-ann__title">${escape(item.title)}</h3>` +
        `<p class="au-ann__text">${escape(item.text)}</p></article>`,
    )
    .join("");

  const body = [
    opener(ctx, {
      label: "Actualidad",
      art: "campana",
      crumbLabel: "Noticias",
      title: "AUREA hoy.",
      lead:
        "Dos tipos de publicación, deliberadamente separados: noticias, que se leen por interés, " +
        "y comunicados, que se leen por obligación.",
    }),

    band({
      body:
        head({ index: "01", label: "Noticias", title: "Lo que contamos.", ui: true }) +
        `<div data-collection data-noun="noticias" data-noun-one="noticia">` +
        filters({
          searchLabel: "Buscar en las noticias",
          searchPlaceholder: "Buscar una noticia…",
          groups: [{ key: "categoria", label: "Categoría", options: newsCategories }],
          countLabel: `${articles.length} noticias`,
        }) +
        `<div class="au-grid au-grid--3" style="margin-top:1.6rem" data-reveal-group>${cards}</div>` +
        empty("Ninguna noticia coincide con esa búsqueda.") +
        `</div>`,
    }),

    band({
      tone: "tint",
      id: "comunicados",
      body:
        head({
          index: "02",
          label: "Comunicados",
          title: "Lo que hay que saber.",
          body:
            "Avisos administrativos con oficina responsable y ventana de vigencia. Un comunicado " +
            "no es una noticia y mezclarlos entierra el que importa.",
          ui: true,
        }) +
        `<div style="display:grid;gap:0.9rem" data-reveal-group>${notices}</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Noticias y comunicados",
      description:
        "Sala de noticias demostrativa de AUREA: artículos por categoría y comunicados " +
        "administrativos con oficina responsable y vigencia.",
      canonical: "noticias.html",
      schema: [breadcrumbSchema(trailOf("Noticias"))],
    },
    current: "noticias",
    body,
  };
}

/**
 * The band behind a headline gets a different drawing from the one in the
 * article, so the page carries two images instead of the same one twice.
 */
const ARTICLE_HEAD_ART = {
  investigacion: "microscopio",
  institucional: "ceremonia",
  estudiantes: "feria",
  deportes: "baloncesto",
  comunidad: "jardin",
  internacional: "mapa",
};

const plateForArticle = (article) => ARTICLE_HEAD_ART[article.category] ?? "campana";

export function articlePage(ctx, article) {
  const trail = [
    { label: "Inicio", route: "home" },
    { label: "Noticias", route: "noticias" },
    { label: article.title },
  ];

  const related = articles.filter((other) => other.slug !== article.slug).slice(0, 3);

  const body = [
    `      <section class="au-pagehead">
        <div class="au-pagehead__art">${plate(plateForArticle(article))}</div>
        <div class="au-pagehead__veil"></div>
        <div class="au-shell au-pagehead__inner">
          <div class="au-pagehead__text">
            ${crumbs(ctx, trail)}
            <p class="au-label"><span>${escape(labelOf(newsCategories, article.category))}</span></p>
            <h1 class="au-pagehead__title" style="max-width:22ch">${escape(article.title)}</h1>
            <p class="au-pagehead__lead">${escape(article.summary)}</p>
            <p class="au-note" style="color:var(--ink-onDark-muted);margin:0">
              ${escape(longDate(article.date))} · ${escape(article.author)} ·
              ${escape(`${Math.max(2, Math.round(article.words / 200))} min de lectura`)}
            </p>
          </div>
        </div>
      </section>`,

    band({
      narrow: true,
      body:
        `<figure style="margin:0 0 clamp(1.5rem,3vw,2.5rem);border-radius:var(--radius);overflow:hidden;aspect-ratio:16/9">` +
        plate(article.plate) +
        `</figure>` +
        (article.lead ? `<p class="au-lead" style="margin-bottom:1.4rem">${escape(article.lead)}</p>` : "") +
        `<div class="au-prose">` +
        article.body.map((block) => `<p class="au-prose__p">${escape(block)}</p>`).join("") +
        `</div>` +
        `<div style="margin-top:2rem">${demoTag("Noticia demostrativa")}</div>` +
        note(
          "Las personas, los proyectos y las declaraciones de esta nota son invenciones creadas " +
            "para esta demostración.",
        ),
    }),

    band({
      tone: "tint",
      body:
        head({ index: "", label: "Seguir leyendo", title: "Más de AUREA", ui: true, split: false }) +
        `<div class="au-grid au-grid--3" data-reveal-group>` +
        related
          .map(
            (other) =>
              `<a class="au-news" href="${sub(ctx, "noticias", other.slug)}">` +
              `<span class="au-news__cover">${plate(other.plate)}</span>` +
              `<span class="au-news__body">` +
              `<span class="au-news__meta">${tag(labelOf(newsCategories, other.category))}` +
              `<span>${escape(shortDate(other.date))}</span></span>` +
              `<h3 class="au-news__title">${escape(other.title)}</h3>` +
              `<p class="au-news__summary">${escape(other.summary)}</p></span></a>`,
          )
          .join("") +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: article.title,
      description: `${article.summary} Noticia demostrativa de AUREA, institución ficticia.`,
      canonical: `noticias/${article.slug}.html`,
      ogType: "article",
      schema: [breadcrumbSchema(trail)],
    },
    current: "noticias",
    body,
  };
}

/* ===========================================================================
   VIDA ESTUDIANTIL
   ======================================================================== */

export function lifePage(ctx) {
  const clubCards = clubs
    .map(
      (club) =>
        `<article class="au-club" data-item data-categoria="${escape(club.category)}" ` +
        `data-nivel="${escape(club.level)}" ` +
        `data-haystack="${escape(fold(`${club.name} ${club.text} ${labelOf(clubCategories, club.category)}`))}">` +
        `<p class="au-card__kicker">${escape(labelOf(clubCategories, club.category))}</p>` +
        `<h3 class="au-club__name">${escape(club.name)}</h3>` +
        `<p class="au-card__text">${escape(club.text)}</p>` +
        `<p class="au-club__meta"><span class="au-club__members">${club.members} miembros</span>` +
        `<span>${escape(club.meets)}</span><span>${escape(club.place)}</span></p>` +
        `</article>`,
    )
    .join("");

  const body = [
    opener(ctx, {
      label: "Vida estudiantil",
      art: "danza",
      title: "Aquí también sucede la educación.",
      lead:
        "Cuarenta y dos clubes, cinco disciplinas federadas, cinco elencos artísticos y un " +
        "programa de voluntariado con registro de horas en el expediente.",
    }),

    band({
      id: "clubes",
      body:
        head({
          index: "01",
          label: "Clubes y organizaciones",
          title: "Encuentra el tuyo.",
          body: "Catorce organizaciones detalladas en esta demostración, de un total de cuarenta y dos.",
          ui: true,
        }) +
        `<div data-collection data-noun="clubes" data-noun-one="club">` +
        filters({
          searchLabel: "Buscar organizaciones",
          searchPlaceholder: "Buscar organizaciones…",
          groups: [
            { key: "categoria", label: "Categoría", options: clubCategories },
            {
              key: "nivel",
              label: "Nivel",
              options: [
                { id: "media", label: "Educación Media" },
                { id: "superior", label: "Universidad" },
                { id: "todos", label: "Ambos niveles" },
              ],
            },
          ],
          countLabel: `${clubs.length} clubes`,
        }) +
        `<div class="au-grid au-grid--3" style="margin-top:1.6rem" data-reveal-group>${clubCards}</div>` +
        empty("Ningún club coincide con esos filtros.") +
        `</div>`,
    }),

    band({
      tone: "dark",
      id: "deportes",
      body:
        head({
          index: "02",
          label: "Deportes",
          title: "Cinco disciplinas, dos niveles.",
          body: "Equipos representativos, torneo interclases y liga interinstitucional.",
          action: demoTag("Resultados demostrativos", true),
        }) +
        grid(
          sports.map((sport) =>
            card({ kicker: sport.teams, title: sport.name, text: sport.note, className: "au-card--dark" }),
          ),
          5,
        ) +
        `<div style="margin-top:clamp(2rem,4vw,3rem)">` +
        `<h3 class="au-h--ui" style="color:var(--white);margin-bottom:1rem">Resultados recientes</h3>` +
        `<ul class="au-list" style="border-top-color:var(--navy-600)">` +
        sportsResults
          .map(
            (result) =>
              `<li class="au-row" style="border-bottom-color:var(--navy-600)">` +
              `<h4 class="au-row__title" style="color:var(--white)">${escape(result.event)}</h4>` +
              `<span class="au-row__end">${tag(result.tone === "win" ? "Victoria" : result.tone === "loss" ? "Derrota" : "Participación", result.tone === "win" ? "ok" : result.tone === "loss" ? "alert" : "soft")}</span>` +
              `<p class="au-row__meta" style="color:var(--ink-onDark-muted)">${escape(shortDate(result.date))} · ${escape(result.result)}</p>` +
              `</li>`,
          )
          .join("") +
        `</ul></div>`,
    }),

    band({
      id: "arte",
      body:
        head({
          index: "03",
          label: "Arte y cultura",
          title: "Cinco elencos permanentes.",
          action: arrowLink("Ver la agenda cultural", page(ctx, "calendario")),
          ui: true,
        }) +
        `<div style="margin-bottom:clamp(1.5rem,3vw,2.5rem)">` +
        strip(["teatro", "musica", "danza", "fotografia"]) +
        `</div>` +
        grid(
          arts.map((art) => card({ title: art.name, text: art.text, className: "au-card--flat" })),
          5,
        ) +
        `<div style="margin-top:2rem"><h3 class="au-h--ui" style="margin-bottom:1rem">Próximas presentaciones</h3>` +
        `<ul class="au-list">` +
        culturalEvents
          .map(
            (event) =>
              `<li class="au-row"><h4 class="au-row__title">${escape(event.title)}</h4>` +
              `<span class="au-row__end">${escape(shortDate(event.date))}</span>` +
              `<p class="au-row__meta">${escape(event.place)}</p></li>`,
          )
          .join("") +
        `</ul></div>`,
    }),

    band({
      tone: "tint",
      id: "voluntariado",
      body:
        `<div class="au-split au-split--center">` +
        `<div>` +
        head({ index: "04", label: "Servicio", title: service.title, ui: true, split: false }) +
        `<p class="au-lead">${escape(service.text)}</p>` +
        `<div style="margin-top:1.6rem">${figureRow(service.facts.map((fact) => figure(fact)))}</div>` +
        `</div>` +
        `<figure style="margin:0;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10">${plate("comunidad")}</figure>` +
        `</div>`,
    }),

    band({
      tone: "sunken",
      id: "galeria",
      body:
        head({
          index: "05",
          label: "Galería",
          title: "Aquí es donde pasa.",
          body:
            `${gallery.length} escenas del campus, las aulas, la cancha y el escenario. Se ` +
            "filtran por área y se abren a tamaño completo.",
          action: arrowLink("Ver la galería completa", page(ctx, "galeria")),
        }) +
        mosaic(
          ["explanada", "teatro-montaje", "cancha-futbol", "orquesta", "graduacion-2026", "piscina", "compania-danza"]
            .map((id) => galleryById(id))
            .filter(Boolean),
        ) +
        lightbox(),
    }),

    band({
      body:
        head({
          index: "06",
          label: "Acompañamiento",
          title: "No tienes que hacerlo solo.",
          body: "Ocho servicios, todos sin costo para el estudiante.",
          action: arrowLink("Apoyo al estudiante", page(ctx, "apoyo")),
          ui: true,
        }) +
        grid(
          supportServices
            .slice(0, 4)
            .map((item) => card({ title: item.name, text: item.text, foot: `<p class="au-card__kicker">${escape(item.cost)}</p>` })),
          4,
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Vida estudiantil",
      description:
        "Clubes, deportes, arte, cultura y voluntariado en AUREA: catorce organizaciones " +
        "demostrativas con explorador por categoría y nivel.",
      canonical: "vida-estudiantil.html",
      schema: [breadcrumbSchema(trailOf("Vida estudiantil"))],
    },
    current: "vida",
    body,
  };
}

/* ===========================================================================
   CAMPUS
   ======================================================================== */

export function campusPage(ctx) {
  const hotspots = tourStops
    .map(
      (stop) =>
        `<button class="au-tour__spot" type="button" data-tour-spot="${escape(stop.space)}" ` +
        `style="left:${stop.x}%;top:${stop.y}%" aria-pressed="false">` +
        `<span>${escape(stop.label)}</span></button>`,
    )
    .join("");

  const panels = spaces
    .map((space) => {
      const stop = tourStops.find((entry) => entry.space === space.id);
      if (!stop) return "";
      return (
        `<div class="au-tour__panel" data-tour-panel="${escape(space.id)}" hidden>` +
        `<div class="au-tour__cover">${plate(space.plate)}</div>` +
        `<p class="au-card__kicker">${escape(space.kind)}</p>` +
        `<h3 class="au-card__title">${escape(space.name)}</h3>` +
        `<p class="au-card__text">${escape(space.detail)}</p>` +
        `<div class="au-figures">${space.facts.map((fact) => figure(fact)).join("")}</div>` +
        `</div>`
      );
    })
    .join("");

  const visitForm =
    `<form class="au-checklist" data-visit-form ` +
    `data-slots="${escape(JSON.stringify(visitOptions.slots))}" ` +
    `data-slots-sat="${escape(JSON.stringify(visitOptions.saturdaySlots))}">` +
    `<div class="au-checklist__head">` +
    `<h3 class="au-h--ui" style="font-size:var(--step-1)">Programar una visita</h3>` +
    demoTag("Reserva demostrativa") +
    `</div>` +
    `<fieldset style="border:0;padding:0;margin:0">` +
    `<legend class="au-field__label" style="margin-bottom:0.5rem">Tipo de visita</legend>` +
    `<div class="au-options">` +
    visitOptions.kinds
      .map(
        (kind, index) =>
          `<label class="au-option"><input type="radio" name="tipo" value="${escape(kind.id)}"` +
          `${index === 0 ? " checked" : ""} />${escape(kind.label)}</label>`,
      )
      .join("") +
    `</div>` +
    `<p class="au-field__hint" style="margin-top:0.5rem">` +
    visitOptions.kinds.map((kind) => escape(`${kind.label}: ${kind.note}`)).join(" · ") +
    `</p></fieldset>` +
    `<div class="au-formgrid">` +
    `<div class="au-field"><label class="au-field__label" for="au-visitantes">Número de visitantes</label>` +
    `<select class="au-select" id="au-visitantes" name="visitantes">` +
    visitOptions.sizes.map((size) => `<option value="${escape(size.label)}">${escape(size.label)}</option>`).join("") +
    `</select></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-fecha">Fecha</label>` +
    `<input class="au-input" id="au-fecha" name="fecha" type="date" value="2026-09-22" min="2026-09-08" max="2027-07-31" required /></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-horario">Horario</label>` +
    `<select class="au-select" id="au-horario" name="horario" required>` +
    visitOptions.slots.map((slot) => `<option value="${escape(slot)}">${escape(slot)}</option>`).join("") +
    `</select>` +
    `<span class="au-field__hint">Los sábados solo hay recorridos por la mañana.</span></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-nombre">Nombre y apellido</label>` +
    `<input class="au-input" id="au-nombre" name="nombre" type="text" autocomplete="name" required /></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-correo">Correo electrónico</label>` +
    `<input class="au-input" id="au-correo" name="correo" type="email" autocomplete="email" required /></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-tel">Teléfono</label>` +
    `<input class="au-input" id="au-tel" name="telefono" type="tel" autocomplete="tel" /></div>` +
    `</div>` +
    `<div class="au-actions">${button("Programar visita", null, { solid: true, type: "submit" })}</div>` +
    note(
      "Demostración: el formulario valida y confirma en pantalla, pero no envía ninguna " +
        "solicitud ni almacena tus datos.",
    ) +
    `</form>` +
    /* One grid child, not two: the confirmation belongs under the form it
       replaces, and as a sibling it would land in the column beside it. */
    `<div class="au-result" data-visit-confirm hidden style="margin-top:1.2rem">` +
    `<p class="au-result__label">Visita reservada · demostración</p>` +
    `<p class="au-result__value">¡Listo!</p>` +
    `<dl class="au-result__rows" data-visit-summary></dl>` +
    `<p style="margin:0;color:var(--ink-soft);font-size:var(--step--1)">` +
    `En un portal real recibirías un correo de confirmación con el punto de encuentro. ` +
    `Aquí no se envió nada.</p>` +
    `<div class="au-actions"><button class="au-btn au-btn--ghost au-btn--small" type="button" data-visit-again>` +
    `Programar otra visita</button></div></div>`;

  const body = [
    opener(ctx, {
      label: "El campus",
      art: "jardin",
      crumbLabel: "Campus",
      title: "Conoce dónde vas a aprender.",
      lead:
        "Dieciocho laboratorios, una biblioteca de tres niveles, un centro de innovación de " +
        "seiscientos metros cuadrados y cuatro mil metros de área verde.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Tour virtual", "#tour", { gold: true })}${button("Programar recorrido", "#visita", { onDark: true })}</div>`,
    }),

    band({
      id: "espacios",
      body:
        head({
          index: "01",
          label: "Espacios",
          title: "Ocho lugares que vas a usar.",
          body: "Cada uno con lo que de verdad importa saber de él: cuántos caben y hasta qué hora abre.",
        }) +
        `<div style="margin-bottom:clamp(1.5rem,3vw,2.5rem)">` +
        mosaic(
          ["explanada", "biblioteca-niveles", "auditorio-lleno", "laboratorio-computo", "areas-verdes", "comedor", "salas-abiertas"]
            .map((id) => galleryById(id))
            .filter(Boolean),
        ) +
        lightbox() +
        `</div>` +
        grid(
          spaces.map((space) =>
            card({
              kicker: space.kind,
              title: space.name,
              text: space.summary,
              foot: `<p class="au-card__kicker">${escape(space.facts.map((fact) => `${fact.value} ${fact.label}`).join(" · "))}</p>`,
            }),
          ),
          4,
        ),
    }),

    band({
      tone: "dark",
      id: "tour",
      body:
        head({
          index: "02",
          label: "Tour virtual",
          title: "Recorre el campus desde aquí.",
          body:
            "Un plano con ocho puntos. Se recorre con el mouse o con las flechas del teclado, " +
            "y pesa unos pocos kilobytes en lugar de los megabytes de un modelo tridimensional.",
          action: demoTag("Plano esquemático · lugar ficticio", true),
        }) +
        `<div class="au-tour" data-tour>` +
        `<div class="au-tour__plan">${campusPlan()}${hotspots}</div>` +
        `<div>${panels}</div>` +
        `</div>`,
    }),

    band({
      tone: "tint",
      id: "visita",
      body:
        head({
          index: "03",
          label: "Visita al campus",
          title: "Ven a verlo antes de decidir.",
          body: "Recorridos guiados de lunes a sábado, sin costo, con la coordinación del nivel o de la carrera que te interesa.",
          ui: true,
        }) +
        `<div class="au-split">` +
        `<div>${visitForm}</div>` +
        `<div>${figureRow(visitFacts.map((fact) => figure(fact)))}` +
        `<div style="margin-top:1.5rem">${callout({
          title: "¿Vienes con un grupo?",
          text: "Las delegaciones de centros educativos a partir de diez personas se coordinan directamente con Admisiones, con recorrido y sesión informativa a medida.",
        })}</div>` +
        `<div style="margin-top:1rem">${arrowLink("Escribir a Admisiones", page(ctx, "contacto"))}</div></div>` +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Campus",
      description:
        "Campus demostrativo de AUREA: ocho espacios, tour virtual con plano interactivo y " +
        "reserva de visitas guiadas.",
      canonical: "campus.html",
      schema: [breadcrumbSchema(trailOf("Campus"))],
    },
    current: "institucion",
    body,
  };
}

/* ===========================================================================
   INVESTIGACIÓN
   ======================================================================== */

export function researchPage(ctx) {
  const body = [
    opener(ctx, {
      label: "Investigación e innovación",
      art: "microscopio",
      crumbLabel: "Investigación",
      title: "Conocimiento que sale del aula.",
      lead:
        "Cuatro centros, seis proyectos activos y treinta y un estudiantes de grado vinculados. " +
        "Todo demostrativo.",
    }),

    band({
      body:
        figureRow(
          researchFacts.map((fact) =>
            figure({ value: fact.value, label: fact.label, count: Number(fact.value) || undefined }),
          ),
        ) +
        note(notice.dataShort) +
        `<div style="margin-top:clamp(2rem,4vw,3rem)">${strip(["microscopio", "robotica", "energia", "codigo"])}</div>`,
    }),

    band({
      tone: "tint",
      id: "centros",
      body:
        head({ index: "01", label: "Centros", title: "Dónde se investiga." }) +
        `<div class="au-grid au-grid--2" data-reveal-group>` +
        centers
          .map(
            (center) =>
              `<article class="au-card">` +
              `<div style="aspect-ratio:16/9;border-radius:var(--radius-sm);overflow:hidden;margin-bottom:0.6rem">${plate(center.plate)}</div>` +
              `<p class="au-card__kicker">Desde ${escape(center.since)} · ${escape(center.lead)}</p>` +
              `<h3 class="au-card__title">${escape(center.name)}</h3>` +
              `<p class="au-card__text">${escape(center.summary)}</p>` +
              `<ul class="au-tags">` +
              center.lines.map((line) => `<li>${tag(line, "soft")}</li>`).join("") +
              `</ul>` +
              `<div class="au-figures" style="margin-top:0.8rem">${center.facts.map((fact) => figure(fact)).join("")}</div>` +
              `</article>`,
          )
          .join("") +
        `</div>`,
    }),

    band({
      id: "proyectos",
      body:
        head({ index: "02", label: "Proyectos", title: "En qué se trabaja ahora.", ui: true }) +
        `<ul class="au-list">` +
        projects
          .map(
            (project) =>
              `<li class="au-row"><h3 class="au-row__title">${escape(project.title)}</h3>` +
              `<span class="au-row__end">${tag(stateLabel[project.state], project.state === "curso" ? "ok" : project.state === "previsto" ? "soft" : "")}</span>` +
              `<p class="au-row__meta">${escape(centers.find((center) => center.id === project.center)?.name ?? "")} · ` +
              `${escape(project.period)} · ${escape(project.team)}</p>` +
              `<p class="au-row__text">${escape(project.text)}</p></li>`,
          )
          .join("") +
        `</ul>`,
    }),

    band({
      tone: "sunken",
      id: "publicaciones",
      body:
        head({ index: "03", label: "Publicaciones", title: "Lo publicado.", action: demoTag("Referencias ficticias"), ui: true }) +
        table({
          caption: "Publicaciones demostrativas. Ni los títulos ni las revistas existen.",
          columns: [{ label: "Título" }, { label: "Autoría" }, { label: "Medio" }, { label: "Año", num: true }],
          rows: publications.map((item) => [
            escape(item.title),
            escape(item.authors),
            escape(item.venue),
            escape(item.year),
          ]),
        }) +
        `<div style="margin-top:1.5rem">${arrowLink("Repositorio institucional", page(ctx, "biblioteca"))}</div>`,
    }),

    band({
      body:
        `<div class="au-grid au-grid--3" data-reveal-group>` +
        card({
          kicker: "Vinculación",
          title: "Empleabilidad",
          text: "Bolsa de empleo, prácticas profesionales y ocho empresas aliadas.",
          foot: arrowLink("Ver empleabilidad", page(ctx, "empleabilidad")),
          link: page(ctx, "empleabilidad"),
        }) +
        card({
          kicker: "Vinculación",
          title: "Internacional",
          text: "Movilidad académica, convenios y estudiantes internacionales.",
          foot: arrowLink("Ver internacional", page(ctx, "internacional")),
          link: page(ctx, "internacional"),
        }) +
        card({
          kicker: "Vinculación",
          title: "Red AUREA",
          text: "Seis mil doscientos egresados, educación continua y directorio profesional.",
          foot: arrowLink("Ver egresados", page(ctx, "egresados")),
          link: page(ctx, "egresados"),
        }) +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Investigación e innovación",
      description:
        "Cuatro centros de investigación demostrativos de AUREA, seis proyectos y sus " +
        "publicaciones, con estudiantes de grado vinculados.",
      canonical: "investigacion.html",
      schema: [breadcrumbSchema(trailOf("Investigación"))],
    },
    current: "investigacion",
    body,
  };
}

/* ===========================================================================
   DOCENTES
   ======================================================================== */

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

export function facultyPage(ctx) {
  const cards = faculty
    .map((person) => {
      const detailId = `au-doc-${person.id}`;
      return (
        `<article class="au-person" id="${escape(person.id)}" data-item ` +
        `data-area="${escape(person.area)}" ` +
        `data-programa="${escape(person.programs.join(" "))}" ` +
        `data-haystack="${escape(fold(`${person.name} ${person.title} ${person.role} ${person.courses.join(" ")} ${person.research}`))}">` +
        `<span class="au-person__mark" aria-hidden="true">${escape(initials(person.name))}</span>` +
        `<div class="au-person__body">` +
        `<h3 class="au-person__name">${escape(person.name)}</h3>` +
        `<p class="au-person__title">${escape(person.title)}</p>` +
        `<p class="au-person__title"><b>${escape(person.role)}</b></p>` +
        `<p class="au-card__text">${escape(person.bio)}</p>` +
        `<p class="au-person__title"><a href="mailto:${escape(person.email)}">${escape(person.email)}</a></p>` +
        `<p><button class="au-btn au-btn--small au-btn--ghost" type="button" data-toggle ` +
        `aria-expanded="false" aria-controls="${detailId}">Ver perfil</button></p>` +
        `</div>` +
        `<div class="au-person__detail" id="${detailId}" hidden>` +
        `<div><h4>Formación</h4><ul>${person.education.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></div>` +
        `<div><h4>Asignaturas</h4><ul>${person.courses.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></div>` +
        `<div><h4>Investigación</h4><p>${escape(person.research)}</p></div>` +
        `<div><h4>Publicaciones</h4><ul>${person.publications.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></div>` +
        `<div><h4>Atención</h4><p>${escape(person.office)} · ${escape(person.hours)}</p></div>` +
        `</div></article>`
      );
    })
    .join("");

  const body = [
    opener(ctx, {
      label: "Docentes",
      art: "tutoria",
      title: "Quién enseña en AUREA.",
      lead:
        "Doce perfiles demostrativos de una planta de ciento cuarenta docentes. Busca por " +
        "nombre, por asignatura o por línea de investigación.",
    }),

    band({
      body:
        head({ index: "01", label: "Planta docente", title: "Busca un profesor.", ui: true }) +
        `<div data-collection data-noun="docentes" data-noun-one="docente">` +
        filters({
          searchLabel: "Buscar profesor",
          searchPlaceholder: "Buscar profesor, asignatura o área…",
          groups: [
            { key: "area", label: "Facultad o área", options: facultyAreas },
            {
              key: "programa",
              label: "Programa",
              options: programs.map((program) => ({ id: program.slug, label: program.short })),
            },
          ],
          countLabel: `${faculty.length} docentes`,
        }) +
        `<div class="au-grid au-grid--2" style="margin-top:1.6rem" data-reveal-group>${cards}</div>` +
        empty("Ningún docente coincide con esa búsqueda.") +
        `</div>` +
        note(
          "Las personas de este directorio son invenciones. Los nombres combinan apellidos " +
            "comunes al azar y no corresponden a ningún académico real.",
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Docentes",
      description:
        "Directorio demostrativo de la planta docente de AUREA, con formación, asignaturas, " +
        "líneas de investigación y horarios de atención.",
      canonical: "docentes.html",
      schema: [breadcrumbSchema(trailOf("Docentes"))],
    },
    current: "institucion",
    body,
  };
}

/* ===========================================================================
   DIRECTORIO
   ======================================================================== */

export function directoryPage(ctx) {
  const cards = offices
    .map(
      (office) =>
        `<article class="au-office" id="${escape(office.id)}" data-item ` +
        `data-haystack="${escape(fold(`${office.name} ${office.lead} ${office.does}`))}">` +
        `<h3 class="au-office__name">${escape(office.name)}</h3>` +
        `<p class="au-office__lead">${escape(office.lead)}</p>` +
        `<p class="au-office__does">${escape(office.does)}</p>` +
        `<div class="au-office__contact">` +
        `<a href="mailto:${escape(office.email)}">${escape(office.email)}</a>` +
        `<span>${escape(office.phone)}</span>` +
        `<span>${escape(office.place)}</span>` +
        `<span>${escape(office.hours)}</span>` +
        `</div></article>`,
    )
    .join("");

  const body = [
    opener(ctx, {
      label: "Directorio institucional",
      art: "oficina",
      crumbLabel: "Directorio",
      title: "A quién escribirle.",
      lead:
        "Doce oficinas, ordenadas por cuántas visitas reciben y no por el organigrama. Cada una " +
        "declara qué resuelve, dónde está y a qué hora.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Directorio de docentes", page(ctx, "docentes"), { onDark: true })}</div>`,
    }),

    band({
      body:
        head({
          index: "01",
          label: "Oficinas",
          title: "Doce oficinas, por trámite.",
          body: "Busca por lo que necesitas resolver —una constancia, una beca, un acceso— y no por el nombre del departamento.",
          ui: true,
        }) +
        `<div data-collection data-noun="oficinas" data-noun-one="oficina">` +
        filters({
          searchLabel: "Buscar en el directorio",
          searchPlaceholder: "Constancia, beca, matrícula, soporte…",
          countLabel: `${offices.length} oficinas`,
        }) +
        `<div class="au-grid au-grid--3" style="margin-top:1.6rem" data-reveal-group>${cards}</div>` +
        empty("Ninguna oficina coincide con esa búsqueda. Prueba con el trámite que necesitas.") +
        `</div>` +
        note(`${notice.dataShort}. Los correos y teléfonos son ficticios.`),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Directorio institucional",
      description:
        "Doce oficinas demostrativas de AUREA con lo que resuelve cada una, correo, teléfono, " +
        "ubicación y horario de atención.",
      canonical: "directorio.html",
      schema: [breadcrumbSchema(trailOf("Directorio"))],
    },
    current: "institucion",
    body,
  };
}

/* ===========================================================================
   BIBLIOTECA
   ======================================================================== */

export function libraryPage(ctx) {
  const rows = libraryItems
    .map(
      (item) =>
        `<li class="au-row" data-item data-tipo="${escape(item.type)}" ` +
        `data-haystack="${escape(fold(`${item.title} ${item.author} ${item.area} ${labelOf(libraryTypes, item.type)}`))}">` +
        `<h3 class="au-row__title">${escape(item.title)}</h3>` +
        `<span class="au-row__end">${tag(labelOf(libraryTypes, item.type))}</span>` +
        `<p class="au-row__meta">${escape(item.author)} · ${escape(item.year)} · ${escape(item.area)}</p>` +
        `<p class="au-row__text">${escape(item.note)}</p></li>`,
    )
    .join("");

  const body = [
    opener(ctx, {
      label: "Biblioteca y repositorio",
      art: "biblioteca",
      crumbLabel: "Biblioteca",
      title: "Busca libros, artículos y recursos.",
      lead:
        "Catálogo físico, bases de datos suscritas y el repositorio institucional de acceso " +
        "abierto, con tesis a texto completo.",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Ir a la biblioteca digital", page(ctx, "portalEstudiante"), { gold: true })}</div>`,
    }),

    band({
      tight: true,
      body:
        `<h2 class="au-sr">La biblioteca en cifras</h2>` +
        figureRow(libraryFacts.map((fact) => figure(fact))) +
        note(notice.dataShort),
    }),

    band({
      tone: "tint",
      body:
        head({ index: "01", label: "Catálogo", title: "Busca en el acervo.", ui: true }) +
        `<div data-collection data-noun="recursos" data-noun-one="recurso">` +
        filters({
          searchLabel: "Buscar en el catálogo",
          searchPlaceholder: "Busca libros, artículos y recursos…",
          groups: [{ key: "tipo", label: "Tipo de recurso", options: libraryTypes }],
          countLabel: `${libraryItems.length} recursos`,
        }) +
        `<ul class="au-list" style="margin-top:1.6rem">${rows}</ul>` +
        empty("Ningún recurso coincide con esa búsqueda.") +
        `</div>`,
    }),

    band({
      body:
        head({ index: "01", label: "Servicios", title: "Además del préstamo.", ui: true }) +
        grid(
          [
            { title: "Salas de estudio", text: "Catorce salas grupales reservables desde el portal en bloques de dos horas." },
            { title: "Formación de usuarios", text: "Talleres de búsqueda, gestión bibliográfica y citación, abiertos a los dos niveles." },
            { title: "Horario extendido", text: "En semanas de examen, de 6:30 a 22:00 de lunes a sábado." },
            { title: "Acceso de egresados", text: "Catálogo y bases de datos con carné de egresado vigente, de por vida." },
          ].map((item) => card({ title: item.title, text: item.text, className: "au-card--flat" })),
          4,
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Biblioteca",
      description:
        "Biblioteca demostrativa de AUREA: catálogo, revistas, repositorio institucional, tesis " +
        "y recursos digitales, con buscador por tipo.",
      canonical: "biblioteca.html",
      schema: [breadcrumbSchema(trailOf("Biblioteca"))],
    },
    current: "vida",
    body,
  };
}

/* ===========================================================================
   APOYO AL ESTUDIANTE
   ======================================================================== */

export function supportPage(ctx) {
  const body = [
    opener(ctx, {
      label: "Apoyo al estudiante",
      art: "circulo",
      title: "No tienes que hacerlo solo.",
      lead:
        "Ocho servicios de acompañamiento, todos sin costo para el estudiante. Cada uno declara " +
        "dónde está, cuándo abre y qué resuelve.",
    }),

    band({
      tight: true,
      body: strip(["tutoria", "circulo", "biblioteca", "computo"]),
    }),

    band({
      body:
        head({
          index: "01",
          label: "Servicios",
          title: "Ocho formas de pedir ayuda.",
          body: "Ninguna tiene costo para el estudiante, y decirlo explícitamente es la mitad del punto.",
          ui: true,
        }) +
        `<div class="au-grid au-grid--2" data-reveal-group>` +
        supportServices
          .map(
            (item) =>
              `<article class="au-card" id="${escape(item.id)}">` +
              `<p class="au-card__kicker">${escape(item.cost)}</p>` +
              `<h3 class="au-card__title">${escape(item.name)}</h3>` +
              `<p class="au-card__text">${escape(item.text)}</p>` +
              `<div class="au-office__contact"><span>${escape(item.where)}</span><span>${escape(item.when)}</span></div>` +
              `</article>`,
          )
          .join("") +
        `</div>`,
    }),

    band({
      tone: "tint",
      body:
        `<div class="au-split au-split--even">` +
        callout({
          title: "Accesibilidad como requisito, no como añadido",
          text:
            "Los ajustes razonables se solicitan al matricularse o en cualquier momento del año, " +
            "y se aplican a materiales, evaluación y espacios. El protocolo completo está en el " +
            "centro de documentos.",
        }) +
        callout({
          kind: "gold",
          title: "Si la situación cambia",
          text:
            "Ante una circunstancia sobreviniente —económica, de salud o familiar— el caso se " +
            "revisa dentro del período en curso y no en la próxima convocatoria. Acercarse antes " +
            "del vencimiento cambia lo que se puede hacer.",
        }) +
        `</div>` +
        `<div class="au-actions" style="margin-top:2rem">` +
        button("Ver documentos y protocolos", page(ctx, "documentos"), { ghost: true }) +
        button("Escribir a Bienestar Estudiantil", page(ctx, "directorio"), { ghost: true }) +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Apoyo al estudiante",
      description:
        "Ocho servicios demostrativos de acompañamiento en AUREA: orientación, tutorías, " +
        "bienestar, inclusión y accesibilidad, empleabilidad, becas, soporte y biblioteca.",
      canonical: "apoyo-estudiantil.html",
      schema: [breadcrumbSchema(trailOf("Apoyo al estudiante"))],
    },
    current: "vida",
    body,
  };
}

/* ===========================================================================
   EMPLEABILIDAD
   ======================================================================== */

export function employabilityPage(ctx) {
  const body = [
    opener(ctx, {
      label: "Empleabilidad",
      art: "feria",
      title: employability.title,
      lead: employability.lead,
    }),

    band({
      body:
        figureRow(employability.facts.map((fact) => figure(fact))) +
        note(`${notice.dataShort}. Los indicadores no corresponden a ninguna medición real.`) +
        `<div style="margin-top:clamp(2rem,4vw,3rem)">${strip(["feria", "oficina", "carpeta", "graduacion"])}</div>`,
    }),

    band({
      tone: "tint",
      id: "servicios",
      body:
        head({ index: "01", label: "Servicios", title: "Qué hace la oficina.", ui: true }) +
        grid(
          employability.services.map((item) => card({ title: item.name, text: item.text })),
          4,
        ),
    }),

    band({
      id: "empresas",
      body:
        head({
          index: "02",
          label: "Empresas aliadas",
          title: "Dónde practican y trabajan.",
          body: "Ocho empresas ficticias: ninguna organización real aparece respaldando esta demostración.",
          action: demoTag("Empresas ficticias"),
          ui: true,
        }) +
        table({
          caption: "Empresas aliadas demostrativas.",
          columns: [{ label: "Empresa" }, { label: "Sector" }, { label: "Vinculación" }],
          rows: employability.partners.map((partner) => [
            escape(partner.name),
            escape(partner.sector),
            escape(partner.note),
          ]),
        }),
    }),

    band({
      tone: "dark",
      id: "bolsa",
      body:
        `<div class="au-split au-split--center">` +
        `<div>` +
        `<p class="au-label"><span>Bolsa de empleo</span></p>` +
        `<h2 style="color:var(--white);max-width:18ch">Publicaciones verificadas, abiertas a estudiantes de último año y egresados.</h2>` +
        `<p class="au-lead" style="color:var(--ink-onDark);margin-top:1rem">` +
        `Filtro por carrera y por nivel de experiencia, con revisión de hoja de vida y ` +
        `simulación de entrevista antes de postular.</p>` +
        `<div class="au-actions" style="margin-top:1.4rem">` +
        button("Entrar al portal estudiantil", page(ctx, "portalEstudiante"), { gold: true }) +
        button("Red de egresados", page(ctx, "egresados"), { onDark: true }) +
        `</div></div>` +
        `<figure style="margin:0;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10">${plate("oficina")}</figure>` +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Empleabilidad",
      description:
        "Bolsa de empleo, prácticas profesionales, orientación y empresas aliadas de AUREA. " +
        "Indicadores y empresas demostrativos.",
      canonical: "empleabilidad.html",
      schema: [breadcrumbSchema(trailOf("Empleabilidad"))],
    },
    current: "investigacion",
    body,
  };
}

/* ===========================================================================
   EGRESADOS
   ======================================================================== */

export function alumniPage(ctx) {
  const body = [
    opener(ctx, { label: "Egresados",
      art: "comunidad", title: alumni.title, lead: alumni.lead }),

    band({ tight: true, body: figureRow(alumni.facts.map((fact) => figure(fact))) + note(notice.dataShort) }),

    band({
      tight: true,
      body: feature({
        plate: "ceremonia",
        caption: "Encuentro anual de egresados. Ilustración demostrativa.",
        body:
          `<p class="au-label"><span>La red</span></p>` +
          `<h2 style="margin-bottom:0.8rem">No es una lista de correo.</h2>` +
          `<p class="au-lead">Acceso vitalicio a la biblioteca y a las bases de datos, 40 % de ` +
          `descuento en educación continua, bolsa de empleo permanente y un directorio ` +
          `profesional que se usa.</p>`,
      }),
    }),

    band({
      tone: "tint",
      id: "beneficios",
      body:
        head({ index: "01", label: "Beneficios", title: "Lo que la red incluye.", ui: true }) +
        grid(
          alumni.benefits.map((item) => card({ title: item.name, text: item.text, className: "au-card--flat" })),
          3,
        ),
    }),

    band({
      id: "historias",
      body:
        head({ index: "02", label: "Historias", title: "Tres egresados." }) +
        `<div class="au-grid au-grid--3" data-reveal-group>` +
        alumni.stories
          .map(
            (story) =>
              `<article class="au-card">` +
              `<p class="au-card__kicker">${escape(story.program)} · ${escape(story.year)}</p>` +
              `<h3 class="au-card__title">${escape(story.name)}</h3>` +
              `<p class="au-card__text">${escape(story.now)}</p>` +
              `<blockquote class="au-quote" style="font-size:var(--step-0);margin-top:0.6rem">` +
              `${escape(story.quote)}</blockquote></article>`,
          )
          .join("") +
        `</div>` +
        note("Personas y trayectorias ficticias."),
    }),

    band({
      tone: "sunken",
      id: "continua",
      body:
        head({
          index: "03",
          label: "Educación continua",
          title: "Volver, sin volver a matricularse.",
          body: "40 % de descuento para egresados con carné vigente.",
          ui: true,
        }) +
        table({
          caption: "Programas de educación continua demostrativos.",
          columns: [{ label: "Programa" }, { label: "Duración" }, { label: "Modalidad" }],
          rows: alumni.continuing.map((item) => [escape(item.name), escape(item.duration), escape(item.mode)]),
        }) +
        `<div class="au-actions" style="margin-top:1.5rem">` +
        button("Bolsa de empleo", page(ctx, "empleabilidad", "bolsa"), { ghost: true }) +
        button("Solicitar constancia", page(ctx, "documentos"), { ghost: true }) +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Egresados",
      description:
        "Red AUREA: beneficios, historias, educación continua y directorio profesional para " +
        "seis mil doscientos egresados demostrativos.",
      canonical: "egresados.html",
      schema: [breadcrumbSchema(trailOf("Egresados"))],
    },
    current: "investigacion",
    body,
  };
}

/* ===========================================================================
   INTERNACIONAL
   ======================================================================== */

export function internationalPage(ctx) {
  const body = [
    opener(ctx, { label: "Internacional",
      art: "mapa", title: international.title, lead: international.lead }),

    band({ tight: true, body: figureRow(international.facts.map((fact) => figure(fact))) + note(notice.dataShort) }),

    band({
      tone: "tint",
      id: "movilidad",
      body:
        head({ index: "01", label: "Movilidad", title: "Salir un período.", ui: true }) +
        `<div class="au-grid au-grid--3" data-reveal-group>` +
        international.mobility
          .map(
            (item) =>
              `<article class="au-card"><h3 class="au-card__title">${escape(item.name)}</h3>` +
              `<p class="au-card__text">${escape(item.text)}</p>` +
              `<div class="au-card__foot"><h4 class="au-card__kicker">Requisitos</h4>` +
              `<ul class="au-scholarship__reqs">` +
              item.requirements.map((requirement) => `<li>${escape(requirement)}</li>`).join("") +
              `</ul></div></article>`,
          )
          .join("") +
        `</div>`,
    }),

    band({
      id: "entrantes",
      body:
        head({
          index: "02",
          label: "Estudiantes internacionales",
          title: "Venir a estudiar a AUREA.",
          body: "Cinco pasos. El trámite migratorio depende de las autoridades y no de la institución, y el proceso lo dice antes de que alguien lo pregunte.",
          ui: true,
        }) + steps(international.incoming),
    }),

    band({
      tone: "sunken",
      id: "convenios",
      body:
        head({ index: "03", label: "Convenios", title: "Con quién.", action: demoTag("Instituciones ficticias"), ui: true }) +
        table({
          caption: "Convenios demostrativos. Ninguna de estas instituciones existe.",
          columns: [{ label: "Institución" }, { label: "País" }, { label: "Alcance" }],
          rows: international.agreements.map((item) => [
            escape(item.name),
            escape(item.country),
            escape(item.scope),
          ]),
        }),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Internacional",
      description:
        "Movilidad académica, convenios y admisión de estudiantes internacionales en AUREA. " +
        "Instituciones y cifras demostrativas.",
      canonical: "internacional.html",
      schema: [breadcrumbSchema(trailOf("Internacional"))],
    },
    current: "investigacion",
    body,
  };
}

/* ===========================================================================
   DOCUMENTOS
   ======================================================================== */

export function documentsPage(ctx) {
  const rows = documents
    .map(
      (item) =>
        `<li class="au-row" data-item data-categoria="${escape(item.category)}" ` +
        `data-haystack="${escape(fold(`${item.title} ${item.audience} ${labelOf(documentCategories, item.category)}`))}">` +
        `<h3 class="au-row__title">${escape(item.title)}</h3>` +
        `<span class="au-row__end">` +
        `<button class="au-btn au-btn--small au-btn--ghost" type="button" ` +
        `data-download="${escape(item.title)}" data-download-note="Formato original: ${escape(item.format)} · ${escape(item.size)}.">` +
        `Descargar</button></span>` +
        `<p class="au-row__meta">${escape(labelOf(documentCategories, item.category))} · ${escape(item.format)} · ` +
        `${escape(item.size)} · actualizado el ${escape(shortDate(item.updated))} · ${escape(item.audience)}</p>` +
        `</li>`,
    )
    .join("");

  const body = [
    opener(ctx, {
      label: "Documentos y recursos",
      art: "carpeta",
      crumbLabel: "Documentos",
      title: "El centro documental.",
      lead:
        "Dieciocho documentos demostrativos: calendarios, reglamentos, formularios, planes de " +
        "estudio y guías, con búsqueda y filtro por categoría.",
    }),

    band({
      body:
        head({ index: "01", label: "Centro documental", title: "Busca un documento.", ui: true }) +
        `<div data-collection data-noun="documentos" data-noun-one="documento">` +
        filters({
          searchLabel: "Buscar documentos",
          searchPlaceholder: "Reglamento, calendario, formulario, plan…",
          groups: [{ key: "categoria", label: "Categoría", options: documentCategories }],
          countLabel: `${documents.length} documentos`,
        }) +
        `<ul class="au-list" style="margin-top:1.6rem">${rows}</ul>` +
        empty("Ningún documento coincide con esa búsqueda.") +
        `</div>` +
        note(
          "Descargas simuladas: en lugar de dieciocho PDF inventados, el botón genera un archivo " +
            "de texto que nombra el documento y declara que es demostrativo.",
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Documentos y recursos",
      description:
        "Centro documental demostrativo de AUREA con calendarios, reglamentos, formularios, " +
        "planes de estudio y guías, filtrables por categoría.",
      canonical: "documentos.html",
      schema: [breadcrumbSchema(trailOf("Documentos"))],
    },
    current: "institucion",
    body,
  };
}

/* ===========================================================================
   FAQ
   ======================================================================== */

export function faqPage(ctx) {
  const groups = faqAudiences
    .map((group) => {
      const items = faqs.filter((item) => item.group === group.id);
      if (!items.length) return "";

      return (
        `<div data-item-section id="faq-${escape(group.id)}" style="margin-top:clamp(2rem,4vw,3rem)">` +
        `<h2 class="au-h--ui" style="font-size:var(--step-2);margin-bottom:1rem">${escape(group.label)}</h2>` +
        items
          .map(
            (item) =>
              `<div class="au-acc" data-item data-grupo="${escape(group.id)}" ` +
              `data-haystack="${escape(fold(`${item.q} ${item.a}`))}" style="border-top:0">` +
              `<div class="au-acc__item">` +
              `<h3><button class="au-acc__btn" type="button" data-acc-btn aria-expanded="false" ` +
              `aria-controls="faq-${escape(group.id)}-${faqs.indexOf(item)}">` +
              `<span>${escape(item.q)}</span><span class="au-acc__sign" aria-hidden="true"></span></button></h3>` +
              `<div class="au-acc__panel" id="faq-${escape(group.id)}-${faqs.indexOf(item)}">` +
              `<p>${escape(item.a)}</p></div></div></div>`,
          )
          .join("") +
        `</div>`
      );
    })
    .join("");

  const body = [
    opener(ctx, {
      label: "Preguntas frecuentes",
      art: "debate",
      title: "Lo que más nos preguntan.",
      lead:
        "Veinticuatro respuestas agrupadas por audiencia. Busca por palabra o filtra por el " +
        "tema que te interesa.",
    }),

    band({
      body:
        `<div data-collection data-noun="preguntas" data-noun-one="pregunta">` +
        filters({
          searchLabel: "Buscar en las preguntas frecuentes",
          searchPlaceholder: "Beca, matrícula, equivalencias, visa…",
          groups: [{ key: "grupo", label: "Tema", options: faqAudiences }],
          countLabel: `${faqs.length} preguntas`,
        }) +
        groups +
        empty("Ninguna pregunta coincide con esa búsqueda. Escríbenos y la respondemos.") +
        `</div>` +
        `<div style="margin-top:2.5rem">${callout({
          title: "¿No está aquí?",
          text: "Admisiones responde por correo en un día hábil, y el directorio institucional dice qué oficina resuelve cada trámite.",
        })}</div>` +
        `<div class="au-actions" style="margin-top:1.2rem">` +
        button("Contacto", page(ctx, "contacto"), { solid: true }) +
        button("Directorio institucional", page(ctx, "directorio"), { ghost: true }) +
        `</div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Preguntas frecuentes",
      description:
        "Veinticuatro preguntas frecuentes demostrativas sobre admisiones, pagos, educación " +
        "media, universidad, becas, estudiantes internacionales y documentación en AUREA.",
      canonical: "preguntas-frecuentes.html",
      schema: [breadcrumbSchema(trailOf("Preguntas frecuentes")), faqSchema(faqs.slice(0, 12))],
    },
    current: "admisiones",
    body,
  };
}

/* ===========================================================================
   CONTACTO
   ======================================================================== */

export function contactPage(ctx) {
  const form =
    `<form class="au-checklist" data-demo-form="Mensaje registrado en la demostración. No se envió nada.">` +
    `<div class="au-checklist__head">` +
    `<h3 class="au-h--ui" style="font-size:var(--step-1)">Escríbenos</h3>` +
    demoTag("Formulario demostrativo") +
    `</div>` +
    `<div class="au-formgrid">` +
    `<div class="au-field"><label class="au-field__label" for="au-c-nombre">Nombre</label>` +
    `<input class="au-input" id="au-c-nombre" name="nombre" type="text" autocomplete="name" required /></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-c-correo">Correo electrónico</label>` +
    `<input class="au-input" id="au-c-correo" name="correo" type="email" autocomplete="email" required /></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-c-tema">Tema</label>` +
    `<select class="au-select" id="au-c-tema" name="tema">` +
    offices.map((office) => `<option value="${escape(office.id)}">${escape(office.name)}</option>`).join("") +
    `</select></div>` +
    `<div class="au-field"><label class="au-field__label" for="au-c-perfil">Soy</label>` +
    `<select class="au-select" id="au-c-perfil" name="perfil">` +
    audiences.map((audience) => `<option value="${escape(audience.id)}">${escape(audience.label)}</option>`).join("") +
    `</select></div>` +
    `<div class="au-field au-formgrid--wide"><label class="au-field__label" for="au-c-mensaje">Mensaje</label>` +
    `<textarea class="au-textarea" id="au-c-mensaje" name="mensaje" required></textarea></div>` +
    `</div>` +
    `<div class="au-actions">${button("Enviar mensaje", null, { solid: true, type: "submit" })}</div>` +
    note("Demostración: el formulario valida pero no envía ni almacena nada.") +
    `</form>`;

  const body = [
    opener(ctx, {
      label: "Contacto",
      art: "colab",
      title: "Dónde estamos y a quién escribir.",
      lead: `${contact.campus}. ${contact.hours}. Todos los datos de contacto son demostrativos.`,
    }),

    band({
      id: "mapa",
      body:
        `<div class="au-map">` +
        `<div class="au-map__frame">${locationMap()}` +
        `<p class="au-map__note">${escape(contact.map.note)}: AUREA es una institución ficticia y esta ubicación no corresponde a un lugar real.</p></div>` +
        `<div>` +
        `<h2 class="au-h--ui" style="font-size:var(--step-2);margin-bottom:1rem">${escape(contact.campus)}</h2>` +
        `<dl class="au-facts">` +
        [
          ["Dirección", `${contact.address}, ${contact.addressCity}`],
          ["Teléfono", contact.phone],
          ["WhatsApp", contact.whatsapp],
          ["Correo general", contact.email],
          ["Admisiones", contact.admissions],
          ["Horario", contact.hours],
        ]
          .map(
            ([label, value]) =>
              `<div class="au-facts__row"><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`,
          )
          .join("") +
        `</dl>` +
        note(`${contact.addressNote} · ${contact.phoneNote} · ${contact.emailNote}`) +
        `<div class="au-actions" style="margin-top:1.2rem">` +
        button("Programar una visita", page(ctx, "campus", "visita"), { solid: true }) +
        button("Ver el directorio", page(ctx, "directorio"), { ghost: true }) +
        `</div></div></div>`,
    }),

    band({
      tone: "tint",
      id: "escribir",
      body:
        `<div class="au-split">` +
        form +
        `<div>` +
        `<h2 class="au-h--ui" style="font-size:var(--step-1);margin-bottom:1rem">Departamentos</h2>` +
        `<ul class="au-list">` +
        offices
          .slice(0, 6)
          .map(
            (office) =>
              `<li class="au-row"><h3 class="au-row__title" style="font-size:var(--step--1)">${escape(office.name)}</h3>` +
              `<span class="au-row__end"><a href="mailto:${escape(office.email)}">Escribir</a></span>` +
              `<p class="au-row__meta">${escape(office.phone)}</p></li>`,
          )
          .join("") +
        `</ul>` +
        `<div style="margin-top:1.2rem">${arrowLink("Directorio completo", page(ctx, "directorio"))}</div>` +
        `</div></div>`,
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Contacto",
      description:
        "Datos de contacto demostrativos de AUREA: dirección, teléfonos, correos por " +
        "departamento, horario y formulario de mensaje.",
      canonical: "contacto.html",
      schema: [breadcrumbSchema(trailOf("Contacto"))],
    },
    current: "institucion",
    body,
  };
}

/* ===========================================================================
   GALERÍA
   ======================================================================== */

/**
 * “AUREA en imágenes.”
 *
 * The page a prospective family looks at before it reads anything. Thirty
 * drawn scenes in a dense mosaic, filterable by the six areas of institutional
 * life, with a lightbox that walks them with the arrow keys.
 *
 * It reuses the collection engine that drives the seven catalogues, so the
 * filter behaves exactly like the programme finder — and, like every other
 * catalogue in this portal, all thirty tiles are in the HTML before a script
 * runs. With JavaScript off the page is still a composed grid of thirty
 * labelled figures.
 */
export function galleryPage(ctx) {
  const body = [
    opener(ctx, {
      label: "Galería",
      crumbLabel: "Galería",
      title: "AUREA en imágenes.",
      lead:
        `${gallery.length} escenas del campus, las aulas, la cancha, el escenario y el ` +
        "laboratorio. Todas dibujadas: AUREA no existe y no hay nada que fotografiar.",
      art: "patio",
      aside: `<div class="au-actions" style="margin-top:1.4rem">${button("Conocer el campus", page(ctx, "campus"), { gold: true })}${button("Vida estudiantil", page(ctx, "vida"), { onDark: true })}</div>`,
    }),

    band({
      body:
        `<div data-collection data-noun="imágenes" data-noun-one="imagen">` +
        filters({
          searchLabel: "Buscar en la galería",
          searchPlaceholder: "Biblioteca, laboratorio, teatro, cancha…",
          groups: [{ key: "categoria", label: "Área", options: galleryCategories }],
          countLabel: `${gallery.length} imágenes`,
        }) +
        `<div style="margin-top:1.6rem">${mosaic(gallery)}</div>` +
        empty("Ninguna imagen coincide con esa búsqueda.") +
        `</div>` +
        lightbox() +
        note(
          "Todas las escenas están dibujadas con el mismo vocabulario gráfico —fondo, retícula, " +
            "masa, línea, figura y un solo acento— porque una galería solo funciona como galería " +
            "si sus piezas se reconocen como la misma mano. Una fotografía de archivo de personas " +
            "reales sería el único elemento deshonesto de un sitio cuyo argumento entero es que " +
            "todo en él es ficción declarada.",
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Galería",
      description:
        "Treinta escenas del campus, las aulas, el deporte, el arte, la comunidad y la " +
        "investigación en AUREA, institución ficticia. Galería filtrable con visor.",
      canonical: "galeria.html",
      schema: [breadcrumbSchema(trailOf("Galería"))],
    },
    current: "vida",
    body,
  };
}

/* ===========================================================================
   BUSCAR · 404
   ======================================================================== */

export function searchPage(ctx) {
  const body = [
    opener(ctx, {
      label: "Búsqueda",
      art: "computo",
      crumbLabel: "Buscar",
      title: "¿Qué estás buscando?",
      lead:
        "El buscador global cubre programas, noticias, eventos, docentes, documentos y páginas. " +
        "Se abre desde cualquier página con el botón Buscar o con la tecla /.",
    }),

    band({
      body:
        `<div class="au-actions" style="margin-bottom:2rem">` +
        `<button class="au-btn au-btn--solid" type="button" data-search-toggle aria-expanded="false" ` +
        `aria-controls="au-search">Abrir el buscador</button></div>` +
        head({ index: "01", label: "Mientras tanto", title: "Los destinos más buscados.", ui: true }) +
        grid(
          [
            { title: "Oferta académica", text: "Los nueve programas, con filtros por nivel, modalidad y área.", route: "oferta" },
            { title: "Admisiones", text: "El proceso, los requisitos y las fechas de 2027.", route: "admisiones" },
            { title: "Costos y becas", text: "Aranceles publicados, calculadora y cinco programas de beca.", route: "costos" },
            { title: "Calendario", text: "Eventos filtrables por categoría y audiencia.", route: "calendario" },
            { title: "Documentos", text: "Reglamentos, formularios, calendarios y planes de estudio.", route: "documentos" },
            { title: "Directorio", text: "Qué resuelve cada oficina, y cómo contactarla.", route: "directorio" },
          ].map((item) =>
            card({ title: item.title, text: item.text, link: page(ctx, item.route) }),
          ),
          3,
        ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Buscar",
      description: "Buscador global del portal demostrativo de AUREA.",
      canonical: "buscar.html",
      schema: [breadcrumbSchema(trailOf("Buscar"))],
    },
    current: null,
    body,
  };
}

export function notFoundPage(ctx) {
  const body = [
    opener(ctx, {
      label: "Error 404",
      title: "Esta página no existe.",
      crumbLabel: "Página no encontrada",
      lead:
        "Puede que el enlace esté desactualizado o que la dirección tenga un error. Desde aquí " +
        "puedes volver a lo que se busca con más frecuencia.",
    }),

    band({
      body:
        head({ label: "Destinos frecuentes", title: "Quizá buscabas esto.", ui: true, split: false }) +
        grid(
        [
          { title: "Inicio", text: "Volver a la portada del portal.", route: "home" },
          { title: "Oferta académica", text: "Los nueve programas de AUREA.", route: "oferta" },
          { title: "Admisiones", text: "El proceso y las fechas de 2027.", route: "admisiones" },
          { title: "Contacto", text: "A quién escribirle según el trámite.", route: "contacto" },
        ].map((item) => card({ title: item.title, text: item.text, link: page(ctx, item.route) })),
        4,
      ),
    }),
  ].join("\n\n");

  return {
    meta: {
      title: "Página no encontrada",
      description: "La página solicitada no existe en el portal demostrativo de AUREA.",
      canonical: "404.html",
    },
    current: null,
    body,
  };
}
