/**
 * The homepage.
 *
 * The brief's hardest instruction is the one this file exists to obey: the
 * portal contemplates twenty-eight pages of content and the homepage must not
 * try to show them. So every zone below is a *preview with a door* — enough to
 * answer the question and a link to where the answer continues — and the
 * things that only some visitors need (the calculator, the club explorer, the
 * document centre, the directory) are not here at all.
 *
 * The order is not editorial. It follows who arrives: the hero speaks to a
 * family considering the school, the shortcuts catch everybody else within one
 * screen, the audience switch resolves the rest, and only then does the page
 * start making an argument.
 */

import { escape, fold, shortDate } from "../../src/data/aurea/format.js";
import { audiences, contact, facts, institution } from "../../src/data/aurea/institution.js";
import { programs, levels, labelOf, areas } from "../../src/data/aurea/programs.js";
import { tracks, keyDates, scholarships } from "../../src/data/aurea/admissions.js";
import { highlighted } from "../../src/data/aurea/calendar.js";
import { articles, announcements } from "../../src/data/aurea/news.js";
import { clubs, sports, supportServices } from "../../src/data/aurea/life.js";
import { spaces } from "../../src/data/aurea/campus.js";
import { assistant } from "../../src/data/aurea/resources.js";
import { model } from "../../src/data/aurea/story.js";
import {
  actions,
  arrowLink,
  band,
  button,
  card,
  dateChip,
  demoTag,
  figure,
  figureRow,
  filters,
  grid,
  head,
  icon,
  note,
  page,
  sub,
} from "./blocks.mjs";
import { heroScene, plate } from "./art.mjs";
import { programCard } from "./program.mjs";

export const homeMeta = {
  title: "Instituto & Universidad",
  description:
    "Portal demostrativo de AUREA, una institución educativa ficticia: educación media y " +
    "superior, admisiones 2027, oferta académica, becas, calendario, vida estudiantil y " +
    "servicios digitales para toda la comunidad.",
  canonical: "",
};

/* -------------------------------------------------------------------- hero */

function hero(ctx) {
  const heroFacts = facts.slice(0, 3);

  return `      <section class="au-hero">
        <div class="au-hero__scene">${heroScene()}</div>
        <div class="au-hero__veil"></div>
        <div class="au-shell au-hero__inner">
          <p class="au-hero__eyebrow"><span class="au-hero__pulse"></span>Admisiones 2027 abiertas</p>

          <h1 class="au-hero__title">Aprende hoy.<em>Construye lo que sigue.</em></h1>

          <p class="au-hero__lead">
            Desde educación media hasta formación universitaria, AUREA combina conocimiento,
            tecnología y experiencia para preparar estudiantes capaces de transformar su entorno.
          </p>

          <div class="au-hero__actions">
            ${button("Conoce AUREA", page(ctx, "institucion"), { onDark: true })}
            ${button("Iniciar admisión", page(ctx, "admisiones"), { solid: true, icon: "arrow" })}
            <a class="au-hero__tour" href="${page(ctx, "campus", "tour")}">
              <span class="au-hero__play">${icon("play", "", 18)}</span>
              Conoce nuestro campus
            </a>
          </div>

          <div class="au-hero__facts">
${heroFacts
  .map(
    (fact) =>
      `            <div class="au-hero__fact"><b>${escape(`${fact.value.toLocaleString("es-HN")}${fact.suffix}`)}</b>` +
      `<span>${escape(fact.label)}</span></div>`,
  )
  .join("\n")}
          </div>
        </div>
      </section>`;
}

/* ----------------------------------------------------------- quick access */

const ACCESS = [
  { label: "Oferta académica", note: "Nueve programas", route: "oferta", icon: "cap" },
  { label: "Admisiones", note: "Cómo aplicar", route: "admisiones", icon: "edit" },
  { label: "Calendario", note: "Fechas y eventos", route: "calendario", icon: "calendar" },
  { label: "Becas y financiamiento", note: "Cinco programas", route: "becas", icon: "coin" },
  { label: "Visitar el campus", note: "Reserva un recorrido", route: "campus", hash: "visita", icon: "campus" },
  { label: "Portal estudiantil", note: "Notas, pagos y trámites", route: "portalEstudiante", icon: "user" },
];

function quickAccessStrip(ctx) {
  return `      <section class="au-quickaccess" aria-labelledby="au-necesitas">
        <div class="au-shell">
          <h2 class="au-sr" id="au-necesitas">¿Qué necesitas?</h2>
          <div class="au-quickaccess__grid">
${ACCESS.map(
  (item) =>
    `            <a class="au-access" href="${page(ctx, item.route, item.hash)}">` +
    `${icon(item.icon, "au-access__icon", 26)}` +
    `<span class="au-access__label">${escape(item.label)}</span>` +
    `<span class="au-access__note">${escape(item.note)}</span></a>`,
).join("\n")}
          </div>
        </div>
      </section>`;
}

/* --------------------------------------------------------- audience switch */

function audienceSwitch(ctx) {
  const tabs = audiences
    .map(
      (audience, index) =>
        `<button class="au-audience__tab" type="button" role="tab" id="au-aud-${audience.id}" ` +
        `aria-controls="au-audpanel-${audience.id}" aria-selected="${index === 0}" ` +
        `tabindex="${index === 0 ? 0 : -1}">${escape(audience.label)}</button>`,
    )
    .join("");

  const panels = audiences
    .map(
      (audience, index) =>
        `<div class="au-audience__panel" role="tabpanel" id="au-audpanel-${audience.id}" ` +
        `aria-labelledby="au-aud-${audience.id}"${index === 0 ? "" : " hidden"}>` +
        `<p class="au-audience__lead">${escape(audience.lead)}</p>` +
        `<ul class="au-audience__links">` +
        audience.links
          .map(
            (link) =>
              `<li><a class="au-audience__link" href="${page(ctx, link.route, link.hash)}">` +
              `${escape(link.label)}</a></li>`,
          )
          .join("") +
        `</ul></div>`,
    )
    .join("");

  return band({
    tone: "tint",
    tight: true,
    id: "soy",
    body:
      head({
        index: "01",
        label: "Accesos por audiencia",
        title: "Soy…",
        body:
          "Una institución con dos niveles atiende a cinco públicos con necesidades muy distintas. " +
          "Elige el tuyo y el portal se reordena alrededor de lo que sí necesitas.",
        ui: true,
      }) +
      `<div class="au-audience">` +
      `<div class="au-audience__tabs" role="tablist" aria-label="Elige tu perfil" ` +
      `aria-orientation="vertical" data-remember="audiencia">${tabs}</div>` +
      `<div>${panels}</div>` +
      `</div>`,
  });
}

/* ----------------------------------------------------------- programme finder */

/**
 * “Encuentra tu camino” — the finder, in its homepage form.
 *
 * The same collection engine as the full catalogue, with two filter rows
 * instead of three and all nine programmes rendered. Nine is few enough to
 * show whole; the full page adds modality, the area taxonomy and the
 * comparison, and is where a serious search continues.
 */
function finder(ctx) {
  const cards = programs.map((program) => programCard(ctx, program)).join("");

  return band({
    tone: "",
    id: "buscador",
    body:
      head({
        index: "02",
        label: "Buscador académico",
        title: "Encuentra tu camino.",
        body:
          "Nueve programas entre educación media y superior. Filtra por nivel o escribe lo que " +
          "te interesa: el buscador entiende “sistemas”, “psicología” o “diseño” sin acentos.",
        action: arrowLink("Ver la oferta completa", page(ctx, "oferta")),
      }) +
      `<div data-collection data-noun="programas" data-noun-one="programa">` +
      filters({
        searchLabel: "¿Qué quieres estudiar?",
        searchPlaceholder: "¿Qué quieres estudiar? Ingeniería, administración, diseño…",
        groups: [
          { key: "nivel", label: "Nivel", options: levels },
          { key: "area", label: "Área de interés", options: areas },
        ],
        countLabel: `${programs.length} programas`,
      }) +
      `<div class="au-grid au-grid--3" style="margin-top:1.6rem" data-reveal-group>${cards}</div>` +
      `<p class="au-empty" data-collection-empty hidden>Ningún programa coincide con esa búsqueda. Prueba con menos filtros o revisa la oferta completa.</p>` +
      `</div>`,
  });
}

/* ------------------------------------------------------------- why AUREA */

function why(ctx) {
  return band({
    tone: "dark",
    body:
      head({
        index: "03",
        label: "Por qué AUREA",
        title: "Veinticinco años de una sola idea.",
        body:
          "Que la educación se mide por lo que el egresado es capaz de hacer. Todo lo demás — " +
          "el tamaño de las secciones, las horas de laboratorio, la práctica obligatoria — es " +
          "consecuencia de eso.",
        action: `${demoTag("Cifras demostrativas", true)}`,
      }) +
      figureRow(
        facts.map((fact) =>
          figure({
            value: fact.value.toLocaleString("es-HN"),
            suffix: fact.suffix,
            label: fact.label,
            note: fact.note,
            count: fact.value,
          }),
        ),
      ) +
      `<div style="margin-top:clamp(2rem,4vw,3.5rem)">` +
      grid(
        model.pillars.map((pillar) =>
          card({
            kicker: pillar.name,
            title: pillar.experiences[0],
            text: pillar.text,
            className: "au-card--dark",
            level: 3,
          }),
        ),
        4,
      ) +
      `</div>` +
      `<div style="margin-top:2rem">${arrowLink("Conocer el modelo educativo", page(ctx, "institucion", "modelo"))}</div>`,
  });
}

/* ------------------------------------------------------------- admissions */

function admissions(ctx) {
  const steps_ = tracks[1].steps
    .slice(0, 6)
    .map(
      (step) =>
        `<li class="au-step"><span class="au-step__num">${escape(step.number)}</span>` +
        `<h3 class="au-step__title">${escape(step.title)}</h3>` +
        `<p class="au-step__text">${escape(step.text)}</p></li>`,
    )
    .join("");

  const dates = keyDates
    .slice(0, 4)
    .map(
      (entry) =>
        `<li class="au-date">${dateChip(entry.date)}` +
        `<h3 class="au-date__title">${escape(entry.title)}</h3>` +
        `<p class="au-date__text">${escape(entry.text)}</p></li>`,
    )
    .join("");

  return band({
    tone: "tint",
    id: "admisiones",
    body:
      head({
        index: "04",
        label: "Admisiones 2027",
        title: "Tu camino a AUREA comienza aquí.",
        body:
          "Seis pasos, entre septiembre y marzo. El proceso de educación media y el de " +
          "educación superior comparten la forma y casi nada más, así que están separados.",
        action: actions([
          button("Comenzar mi solicitud", page(ctx, "admisiones"), { solid: true }),
          button("Ver requisitos", page(ctx, "admisiones", "requisitos"), { ghost: true }),
        ]),
      }) +
      `<ol class="au-steps" data-reveal-group>${steps_}</ol>` +
      `<div class="au-split" style="margin-top:clamp(2.4rem,4vw,4rem)">` +
      `<div><h3 class="au-h--ui" style="margin-bottom:1rem">Fechas importantes</h3>` +
      `<ul class="au-dates">${dates}</ul>` +
      `<div style="margin-top:1.2rem">${arrowLink("Ver el calendario de admisiones", page(ctx, "admisiones", "fechas"))}</div></div>` +
      `<div class="au-card au-card--accent">` +
      `<p class="au-card__kicker">Becas 2027</p>` +
      `<h3 class="au-card__title">Que el costo no detenga tu talento.</h3>` +
      `<p class="au-card__text">Cinco programas de beca, del 25 % al 80 % del arancel. El expediente se recibe hasta el 15 de enero.</p>` +
      `<ul class="au-tags" style="margin:0.6rem 0">` +
      scholarships
        .map((entry) => `<li><span class="au-tag au-tag--gold">${escape(entry.name.replace("Beca ", ""))}</span></li>`)
        .join("") +
      `</ul>` +
      `<div class="au-card__foot">${arrowLink("Simular mi beca", page(ctx, "becas", "simulador"))}</div>` +
      `</div></div>`,
  });
}

/* -------------------------------------------------------- student life */

function life(ctx) {
  const featuredClubs = clubs.slice(0, 4);

  return band({
    tone: "",
    body:
      head({
        index: "05",
        label: "Vida estudiantil",
        title: "Aquí también sucede la educación.",
        body:
          "Cuarenta y dos clubes, cinco disciplinas federadas, cinco elencos artísticos y un " +
          "programa de voluntariado con registro de horas en el expediente.",
        action: arrowLink("Explorar la vida estudiantil", page(ctx, "vida")),
      }) +
      `<div class="au-grid au-grid--3" data-reveal-group>` +
      /* One picture-led card per domain, then the clubs as a strip. */
      [
        { plate: "deporte", kicker: "Deportes", title: `${sports.length} disciplinas federadas`, text: "Fútbol, baloncesto, voleibol, natación y atletismo, con equipos de media y de superior.", hash: "deportes" },
        { plate: "estudio", kicker: "Arte y cultura", title: "Cinco elencos permanentes", text: "Orquesta y coro, teatro, danza, fotografía y diseño, con temporada abierta al público.", hash: "arte" },
        { plate: "comunidad", kicker: "Voluntariado", title: "Manos AUREA", text: "Alfabetización digital, apoyo escolar y jornadas comunitarias en tres centros de la ciudad.", hash: "voluntariado" },
      ]
        .map(
          (item) =>
            `<a class="au-program" href="${page(ctx, "vida", item.hash)}">` +
            `<span class="au-program__cover">${plate(item.plate)}</span>` +
            `<span><span class="au-program__level">${escape(item.kicker)}</span>` +
            `<h3 class="au-program__title">${escape(item.title)}</h3>` +
            `<p class="au-program__tagline">${escape(item.text)}</p></span>` +
            `<span class="au-program__meta"><b>Ver más</b></span></a>`,
        )
        .join("") +
      `</div>` +
      `<div style="margin-top:1.6rem" class="au-grid au-grid--4" data-reveal-group>` +
      featuredClubs
        .map(
          (club) =>
            `<div class="au-club"><h3 class="au-club__name">${escape(club.name)}</h3>` +
            `<p class="au-club__meta"><span class="au-club__members">${club.members} miembros</span>` +
            `<span>${escape(club.meets)}</span></p></div>`,
        )
        .join("") +
      `</div>`,
  });
}

/* ----------------------------------------------------------------- events */

function events(ctx) {
  return band({
    tone: "sunken",
    body:
      head({
        index: "06",
        label: "Próximos eventos",
        title: "Lo que está pasando en AUREA.",
        action: actions([button("Ver todos los eventos", page(ctx, "calendario"), { ghost: true })]),
        ui: true,
      }) +
      grid(
        highlighted.map((event) =>
          card({
            kicker: `${shortDate(event.date)} · ${event.time}`,
            title: event.title,
            text: event.text,
            foot: `<p class="au-card__kicker">${escape(event.place)}</p>`,
            link: page(ctx, "calendario"),
          }),
        ),
        3,
      ),
  });
}

/* ------------------------------------------------------------------- news */

function news(ctx) {
  const [lead, ...rest] = articles.slice(0, 3);
  const pinned = announcements.filter((item) => item.level !== "informativo").slice(0, 3);

  return band({
    tone: "",
    id: "noticias",
    body:
      head({
        index: "07",
        label: "Actualidad",
        title: "AUREA hoy.",
        body: "Noticias de la institución y comunicados administrativos, que no son lo mismo y no se mezclan.",
        action: arrowLink("Ir a la sala de noticias", page(ctx, "noticias")),
      }) +
      `<div style="display:grid;gap:clamp(1rem,2vw,1.6rem)">` +
      `<a class="au-news au-news--wide" href="${sub(ctx, "noticias", lead.slug)}" data-reveal="fade">` +
      `<span class="au-news__cover">${plate(lead.plate)}</span>` +
      `<span class="au-news__body">` +
      `<span class="au-news__meta">${tagFor(lead)}<span>${escape(shortDate(lead.date))}</span></span>` +
      `<h3 class="au-news__title">${escape(lead.title)}</h3>` +
      `<p class="au-news__summary">${escape(lead.summary)}</p></span></a>` +
      `<div class="au-grid au-grid--2" data-reveal-group>` +
      rest
        .map(
          (article) =>
            `<a class="au-news" href="${sub(ctx, "noticias", article.slug)}">` +
            `<span class="au-news__cover">${plate(article.plate)}</span>` +
            `<span class="au-news__body">` +
            `<span class="au-news__meta">${tagFor(article)}<span>${escape(shortDate(article.date))}</span></span>` +
            `<h3 class="au-news__title">${escape(article.title)}</h3>` +
            `<p class="au-news__summary">${escape(article.summary)}</p></span></a>`,
        )
        .join("") +
      `</div></div>` +
      `<div style="margin-top:clamp(2rem,4vw,3rem)">` +
      `<h3 class="au-h--ui" style="margin-bottom:1rem">Comunicados</h3>` +
      `<div class="au-grid au-grid--3" data-reveal-group>` +
      pinned
        .map(
          (item) =>
            `<article class="au-ann au-ann--${item.level}">` +
            `<p class="au-ann__head"><span class="au-tag au-tag--soft">${escape(item.office)}</span>` +
            `<span>${escape(shortDate(item.date))}</span></p>` +
            `<h4 class="au-ann__title">${escape(item.title)}</h4>` +
            `<p class="au-ann__text">${escape(item.text)}</p></article>`,
        )
        .join("") +
      `</div>` +
      `<div style="margin-top:1.2rem">${arrowLink("Todos los comunicados", page(ctx, "noticias", "comunicados"))}</div>` +
      `</div>`,
  });
}

const tagFor = (article) =>
  `<span class="au-tag">${escape(article.category)}</span>`;

/* ----------------------------------------------------------------- campus */

function campus(ctx) {
  const featured = spaces.slice(0, 4);

  return band({
    tone: "dark",
    body:
      head({
        index: "08",
        label: "El campus",
        title: "Conoce dónde vas a aprender.",
        body:
          "Dieciocho laboratorios, una biblioteca de tres niveles, un centro de innovación de " +
          "seiscientos metros y cuatro mil metros de área verde.",
        action: actions([
          button("Tour virtual", page(ctx, "campus", "tour"), { onDark: true }),
          button("Programar un recorrido", page(ctx, "campus", "visita"), { gold: true }),
        ]),
      }) +
      grid(
        featured.map((space) =>
          card({
            kicker: space.kind,
            title: space.name,
            text: space.summary,
            className: "au-card--dark",
            link: page(ctx, "campus", "tour"),
          }),
        ),
        4,
      ),
  });
}

/* -------------------------------------------------------------- assistant */

function assistantPanel(ctx) {
  const buttons = assistant
    .map(
      (item, index) =>
        `<button class="au-assistant__q" type="button" data-assistant-q ` +
        `aria-pressed="${index === 0}" data-answer="${escape(item.a)}" ` +
        `data-href="${page(ctx, item.route, item.hash)}">${escape(item.q)}` +
        `<span aria-hidden="true">→</span></button>`,
    )
    .join("");

  const first = assistant[0];

  return band({
    tone: "",
    tight: true,
    body:
      `<div class="au-assistant" data-assistant>` +
      `<div><p class="au-label"><span>Respuestas rápidas</span></p>` +
      `<h2 class="au-h--ui" style="font-size:var(--step-2);margin-bottom:1rem">¿Tienes una pregunta?</h2>` +
      `<div class="au-assistant__qs">${buttons}</div>` +
      `<p class="au-note">Respuestas escritas de antemano, no un asistente automático. ` +
      `Para lo demás, ${`<a href="${page(ctx, "faq")}">las preguntas frecuentes</a>`} y ` +
      `${`<a href="${page(ctx, "contacto")}">contacto</a>`}.</p></div>` +
      `<div class="au-assistant__answer" data-assistant-answer aria-live="polite">` +
      `<p data-assistant-text>${escape(first.a)}</p>` +
      `<a class="au-link" data-assistant-link href="${page(ctx, first.route, first.hash)}">Ver la página completa</a>` +
      `</div></div>`,
  });
}

/* ------------------------------------------------------------------- CTA */

function cta(ctx) {
  return `      <section class="au-cta">
        <div class="au-shell au-cta__inner">
          <div>
            <p class="au-label"><span>Admisiones 2027</span></p>
            <h2 class="au-cta__title">Tu próximo capítulo puede comenzar aquí.</h2>
            <p class="au-cta__text">
              La primera fecha prioritaria cierra el 30 de noviembre y es la que compite por el
              fondo completo de becas.
            </p>
          </div>
          <div>
            ${actions([
              button("Iniciar admisiones", page(ctx, "admisiones"), { gold: true }),
              button("Programar una visita", page(ctx, "campus", "visita"), { onDark: true }),
            ])}
            <p class="au-note" style="color:var(--ink-onDark-muted);margin-top:1.2rem">
              ${escape(contact.campus)} · ${escape(contact.phone)}<br />
              ${escape(contact.admissions)} · ${escape(contact.addressNote)}
            </p>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ body */

export function homeBody(ctx) {
  return [
    hero(ctx),
    quickAccessStrip(ctx),
    audienceSwitch(ctx),
    finder(ctx),
    why(ctx),
    admissions(ctx),
    life(ctx),
    events(ctx),
    news(ctx),
    campus(ctx),
    assistantPanel(ctx),
    cta(ctx),
  ].join("\n\n");
}

/* Exported so the sitemap and the finder page can reuse the same summary. */
export const homeSummary = institution.summary;
export const homeFold = fold(institution.summary);
export const homeSupport = supportServices.length;
export const homeLevels = levels.map((level) => labelOf(levels, level.id));
