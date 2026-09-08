/**
 * The programme: its card, and its page.
 *
 * The card is the single most reused component in the portal — homepage
 * finder, full catalogue, mega menu adjacency, related programmes — so it
 * carries the filter attributes the collection engine reads. The build folds
 * the haystack with the same function the browser matches with, which is what
 * makes “psicologia” find “Psicología”.
 *
 * The page is the portal's deepest content type and the one a real
 * institution's search traffic actually lands on. It answers, in order, the
 * eight questions a prospective student asks: what is it, what will I be able
 * to do, what will I study, what do I need, what does it cost, who teaches it,
 * where does it lead, and what else do people ask.
 */

import { escape, fold, lempiras } from "../../src/data/aurea/format.js";
import {
  labelOf,
  levels,
  modalities,
  areas,
  programs,
  totalCredits,
  totalCourses,
} from "../../src/data/aurea/programs.js";
import { scholarships, fees } from "../../src/data/aurea/admissions.js";
import { facultyById } from "../../src/data/aurea/people.js";
import {
  accordion,
  actions,
  arrowLink,
  band,
  button,
  card,
  crumbs,
  demoTag,
  escape as esc,
  figure,
  figureRow,
  grid,
  head,
  note,
  page,
  sub,
} from "./blocks.mjs";
import { plate } from "./art.mjs";
import { breadcrumbSchema, pageHead } from "./shell.mjs";

/* -------------------------------------------------------------- the card */

export function programCard(ctx, program) {
  const levelText = program.levels.map((level) => labelOf(levels, level)).join(" · ");
  const modalityText = program.modalities.map((mode) => labelOf(modalities, mode)).join(" · ");

  const haystack = fold(
    [
      program.name,
      program.short,
      program.tagline,
      program.summary,
      levelText,
      modalityText,
      program.areas.map((area) => labelOf(areas, area)).join(" "),
      program.careers.join(" "),
      program.degree,
    ].join(" "),
  );

  return (
    `<a class="au-program" href="${sub(ctx, "programas", program.slug)}" data-item ` +
    `data-haystack="${escape(haystack)}" ` +
    `data-nivel="${escape(program.levels.join(" "))}" ` +
    `data-modalidad="${escape(program.modalities.join(" "))}" ` +
    `data-area="${escape(program.areas.join(" "))}">` +
    `<span class="au-program__cover">${plate(program.plate)}</span>` +
    `<span>` +
    `<span class="au-program__level">${escape(levelText)}</span>` +
    `<h3 class="au-program__title">${escape(program.name)}</h3>` +
    `<span class="au-program__tagline">${escape(program.tagline)}</span>` +
    `</span>` +
    `<span class="au-program__meta">` +
    `<span><b>${escape(program.duration)}</b></span>` +
    `<span>${escape(modalityText)}</span>` +
    `<span>Campus ${escape(program.campus)}</span>` +
    `</span></a>`
  );
}

/* -------------------------------------------------------------- the page */

/** The cost box: two pricing models, one component. */
function costBox(ctx, program) {
  const rows =
    program.costs.kind === "asignatura"
      ? [
          ["Matrícula por período", lempiras(program.costs.enrollment)],
          ["Por asignatura", lempiras(program.costs.perCourse)],
          [
            `Carga completa (${program.costs.coursesTypical})`,
            lempiras(program.costs.perCourse * program.costs.coursesTypical),
          ],
        ]
      : [
          ["Matrícula anual", lempiras(program.costs.enrollment)],
          ["Mensualidad", lempiras(program.costs.monthly)],
          [`Cuotas por año`, String(program.costs.months)],
        ];

  rows.push(["Cuota de admisión", lempiras(fees.registration)]);

  return (
    `<div class="au-progpage__box">` +
    `<h2 class="au-h--ui" style="font-size:var(--step-0);margin-bottom:0.6rem">Costos</h2>` +
    `<dl class="au-facts">` +
    rows
      .map(([label, value]) => `<div class="au-facts__row"><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`)
      .join("") +
    `</dl>` +
    `<p class="au-note">Cifras demostrativas. La calculadora estima el período completo con cargos adicionales y beca aplicada.</p>` +
    `<div style="margin-top:0.9rem">${button("Calcular mi matrícula", page(ctx, "costos", "calculadora"), { ghost: true, small: true })}</div>` +
    `</div>`
  );
}

export function programPage(ctx, program) {
  const levelText = program.levels.map((level) => labelOf(levels, level)).join(" · ");
  const modalityText = program.modalities.map((mode) => labelOf(modalities, mode)).join(" · ");
  const areaText = program.areas.map((area) => labelOf(areas, area)).join(" · ");

  const trail = [
    { label: "Inicio", route: "home" },
    { label: "Oferta académica", route: "oferta" },
    { label: program.short },
  ];

  const related = programs
    .filter((other) => other.slug !== program.slug)
    .filter((other) => other.areas.some((area) => program.areas.includes(area)) || other.levels.some((level) => program.levels.includes(level)))
    .slice(0, 3);

  const programScholarships = scholarships.filter((entry) => program.scholarships.includes(entry.id));
  const teachers = program.faculty.map((id) => facultyById(id)).filter(Boolean);

  /* -------------------------------------------------------------- header */

  const aside =
    `<p class="au-pagehead__lead">${escape(program.tagline)}</p>` +
    `<div class="au-actions" style="margin-top:1.4rem">` +
    button("Quiero estudiar esta carrera", page(ctx, "admisiones"), { gold: true }) +
    button("Descargar plan de estudios", null, {
      onDark: true,
      attrs: `data-download="Plan de estudios · ${esc(program.name)}" data-download-note="Plan demostrativo: ${totalCourses(program)} asignaturas y ${totalCredits(program)} unidades valorativas."`,
    }) +
    `</div>`;

  const header = pageHead({
    crumbs: crumbs(ctx, trail),
    label: levelText,
    title: program.name,
    aside,
  });

  /* --------------------------------------------------------------- facts */

  const factRows = [
    ["Duración", program.duration],
    ["Grado", program.degree],
    ["Modalidad", modalityText],
    ["Campus", program.campus],
    ["Jornada", program.shift],
    ["Área", areaText],
    ["Asignaturas", `${totalCourses(program)}`],
    ["Unidades valorativas", `${totalCredits(program)}`],
  ];

  const factsBox =
    `<div class="au-progpage__box au-progpage__box--dark">` +
    `<h2 class="au-h--ui" style="font-size:var(--step-0);margin-bottom:0.6rem">La carrera</h2>` +
    `<dl class="au-facts">` +
    factRows
      .map(([label, value]) => `<div class="au-facts__row"><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`)
      .join("") +
    `</dl></div>`;

  const scholarshipBox =
    `<div class="au-progpage__box">` +
    `<h2 class="au-h--ui" style="font-size:var(--step-0);margin-bottom:0.6rem">Becas disponibles</h2>` +
    `<ul class="au-tags" style="margin-bottom:0.7rem">` +
    programScholarships
      .map((entry) => `<li><span class="au-tag au-tag--gold">${escape(entry.name.replace("Beca ", ""))} · ${escape(entry.benefitShort)}</span></li>`)
      .join("") +
    `</ul>` +
    `<p class="au-note" style="margin-top:0">Requisitos y fechas en la página de becas. El simulador indica a cuáles podrías aplicar.</p>` +
    `<div style="margin-top:0.9rem">${button("Ver becas", page(ctx, "becas"), { ghost: true, small: true })}</div>` +
    `</div>`;

  /* ---------------------------------------------------------------- body */

  const intro =
    `<div class="au-progpage">` +
    `<div>` +
    `<div class="au-prose" data-reveal="fade">` +
    program.description
      .split("\n\n")
      .map((block) => `<p class="au-lead" style="margin-bottom:1rem">${escape(block.trim())}</p>`)
      .join("") +
    `</div>` +
    `<div class="au-figures" style="margin-top:2rem" data-reveal-group>` +
    program.highlights.map((item) => figure({ value: item.value, label: item.label })).join("") +
    `</div>` +
    `</div>` +
    `<aside class="au-progpage__aside">${factsBox}${costBox(ctx, program)}${scholarshipBox}</aside>` +
    `</div>`;

  const profile =
    head({ index: "01", label: "Perfil profesional", title: "Al graduarte, serás capaz de:", ui: true }) +
    `<div class="au-grid au-grid--2" data-reveal-group>` +
    program.profile
      .map(
        (item) =>
          `<div class="au-card au-card--flat"><p class="au-card__text" style="color:var(--ink);font-size:var(--step-0)">` +
          `${escape(item)}</p></div>`,
      )
      .join("") +
    `</div>`;

  const plan =
    head({
      index: "02",
      label: "Plan de estudios",
      title: `${totalCourses(program)} asignaturas · ${totalCredits(program)} unidades valorativas`,
      body: `Organizado en ${program.curriculum.length} ${program.curriculum.length > 3 ? "períodos" : "años"}. ${program.durationNote}.`,
      action: button("Descargar el plan", null, {
        ghost: true,
        small: true,
        attrs: `data-download="Plan de estudios · ${esc(program.name)}" data-download-note="Descarga simulada."`,
      }),
      ui: true,
    }) +
    `<div class="au-plan" data-reveal-group>` +
    program.curriculum
      .map(
        (term) =>
          `<div class="au-plan__term">` +
          `<div class="au-plan__head"><h3 class="au-plan__term-name">${escape(term.term)}</h3>` +
          `<span class="au-plan__year">${escape(term.label)}</span></div>` +
          `<ul class="au-plan__courses">` +
          term.courses
            .map(
              (course) =>
                `<li class="au-plan__course"><span>${escape(course.name)}</span>` +
                `<span class="au-plan__credits">${course.credits} UV</span></li>`,
            )
            .join("") +
          `</ul></div>`,
      )
      .join("") +
    `</div>`;

  const requirements =
    `<div style="display:grid;gap:clamp(1.5rem,3vw,3rem);grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))">` +
    `<div>` +
    head({ index: "03", label: "Admisión", title: "Requisitos", ui: true, split: false }) +
    `<ul class="au-scholarship__reqs" style="font-size:var(--step-0)">` +
    program.requirements.map((item) => `<li>${escape(item)}</li>`).join("") +
    `</ul>` +
    `<div style="margin-top:1.4rem">${arrowLink("Ver el proceso completo", page(ctx, "admisiones"))}</div>` +
    `</div>` +
    `<div>` +
    head({ index: "04", label: "Después", title: "Campo laboral", ui: true, split: false }) +
    `<ul class="au-scholarship__reqs" style="font-size:var(--step-0)">` +
    program.careers.map((item) => `<li>${escape(item)}</li>`).join("") +
    `</ul>` +
    `<div style="margin-top:1.4rem">${arrowLink("Empleabilidad y prácticas", page(ctx, "empleabilidad"))}</div>` +
    `</div></div>`;

  const staff =
    head({
      index: "05",
      label: "Quién enseña",
      title: "Docentes del programa",
      action: arrowLink("Directorio completo", page(ctx, "docentes")),
      ui: true,
    }) +
    grid(
      teachers.map((person) =>
        card({
          kicker: person.title,
          title: person.name,
          text: `${person.role}. ${person.research}`,
          foot: `<p class="au-card__kicker">${escape(person.courses.slice(0, 2).join(" · "))}</p>`,
          link: `${page(ctx, "docentes")}#${person.id}`,
        }),
      ),
      3,
    );

  const faq =
    head({ index: "06", label: "Preguntas frecuentes", title: `Sobre ${program.short}`, ui: true, split: false }) +
    accordion(program.faq);

  const relatedBlock = related.length
    ? head({ index: "07", label: "También podría interesarte", title: "Programas relacionados", ui: true, split: false }) +
      `<div class="au-grid au-grid--3" data-reveal-group>` +
      related.map((other) => programCard(ctx, other)).join("") +
      `</div>`
    : "";

  const closing =
    `<div class="au-callout" style="margin-top:clamp(2rem,4vw,3rem)">` +
    `<h3 class="au-callout__title">¿Listo para aplicar a ${escape(program.short)}?</h3>` +
    `<p>La solicitud toma unos quince minutos y se puede guardar a medio camino. ` +
    `La primera fecha prioritaria cierra el 30 de noviembre.</p>` +
    `<div class="au-actions" style="margin-top:0.6rem">` +
    button("Quiero estudiar esta carrera", page(ctx, "admisiones"), { solid: true }) +
    button("Programar una visita", page(ctx, "campus", "visita"), { ghost: true }) +
    `</div></div>`;

  const body = [
    header,
    band({ body: intro + `<div style="margin-top:1.5rem">${demoTag()}</div>` }),
    band({ tone: "tint", body: profile }),
    band({ body: plan }),
    band({ tone: "sunken", body: requirements }),
    band({ body: staff }),
    band({ tone: "tint", body: faq + closing }),
    relatedBlock ? band({ body: relatedBlock }) : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    meta: {
      title: program.name,
      description: `${program.summary} Programa demostrativo de AUREA, institución ficticia.`,
      canonical: `programas/${program.slug}.html`,
      ogType: "article",
      schema: [breadcrumbSchema(trail.map((item) => ({ ...item, path: item.route ? undefined : `programas/${program.slug}.html` })))],
    },
    current: "oferta",
    body,
  };
}
