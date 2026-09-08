/**
 * The three private products, rendered as demonstrations.
 *
 * The public site argues that AUREA is a good school. These three argue that
 * whoever built the site can also build the thing students and families
 * actually log into every day — which is the harder sale and the bigger
 * contract, and the reason the brief asks for them.
 *
 * They are real interfaces: server-rendered panels, a working tablist with the
 * full keyboard contract, an attendance ring drawn from a number, tabular data
 * that a screen reader can navigate. What they are not is authenticated —
 * there is no back end, no session and no account, and the amber banner at the
 * top of each one says exactly that before the reader sees a single grade.
 */

import { escape, lempiras, longDate, shortDate } from "../../src/data/aurea/format.js";
import { institution, notice } from "../../src/data/aurea/institution.js";
import { parent, student, virtualCampus } from "../../src/data/aurea/portal.js";
import { arrowLink, button, escape as esc, page } from "./blocks.mjs";
import { isotype } from "./art.mjs";

/* ----------------------------------------------------------------- shell */

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

/**
 * The signed-in chrome.
 *
 * Deliberately unlike the public header: darker, denser, no navigation to the
 * marketing site except one way out. A product that looks like its own
 * brochure has not been designed as a product.
 */
function appBar(ctx, { productName, userName }) {
  return `      <header class="au-app__bar">
        <a class="au-app__brand" href="${page(ctx, "home")}">
          ${isotype()}<span>${escape(institution.name)}</span>
        </a>
        <span class="au-app__product">${escape(productName)}</span>
        <div class="au-app__end">
          <!--lang-switch-->
          <span class="au-app__user">
            <span class="au-app__avatar" aria-hidden="true">${escape(initials(userName))}</span>
            <span>${escape(userName)}</span>
          </span>
          <a class="au-btn au-btn--small au-btn--onDark" href="${page(ctx, "home")}">Salir</a>
        </div>
      </header>

      <p class="au-app__notice">
        <strong>${escape(notice.tag)}</strong>
        Demostración de interfaz. No hay sesión, no hay servidor y no hay cuenta: los datos de
        esta pantalla —notas, asistencia, saldos y personas— son invenciones creadas para mostrar
        cómo funcionaría un portal real.
        <a href="${page(ctx, "home")}">Volver al sitio de AUREA</a>
      </p>`;
}

/** The sidebar: a real tablist, with the panels already in the document. */
function appNav(sections) {
  return (
    `        <nav class="au-app__side" role="tablist" aria-orientation="vertical" aria-label="Secciones del portal">` +
    sections
      .map(
        (section, index) =>
          `<button class="au-app__navlink" type="button" role="tab" id="au-tab-${section.id}" ` +
          `aria-controls="au-panel-${section.id}" aria-selected="${index === 0}" ` +
          `tabindex="${index === 0 ? 0 : -1}">${escape(section.label)}` +
          (section.badge ? `<b>${escape(section.badge)}</b>` : "") +
          `</button>`,
      )
      .join("") +
    `</nav>`
  );
}

const appPanel = (section, index) =>
  `<div class="au-app__main" role="tabpanel" id="au-panel-${section.id}" ` +
  `aria-labelledby="au-tab-${section.id}"${index === 0 ? "" : " hidden"}>${section.body}</div>`;

const box = ({ title, body, tone = "", span = false, action = "" }) =>
  `<section class="au-panelbox${tone ? ` au-panelbox--${tone}` : ""}${span ? " au-panelbox--span2" : ""}">` +
  `<h2 class="au-panelbox__title">${escape(title)}${action}</h2>${body}</section>`;

/** A grade, coloured by band — and the number is always the value. */
const score = (value) =>
  `<span class="au-score au-score--${value >= 90 ? "high" : value >= 80 ? "mid" : "low"}">${value}</span>`;

/* ======================================================== student portal */

export function studentPortal(ctx) {
  const s = student;

  const resumen =
    `<div class="au-greet">` +
    `<h1 class="au-greet__hello">${escape(`${s.greeting}, ${s.name}.`)}</h1>` +
    `<p class="au-greet__meta">${escape(`${s.program} · ${s.year} · ${s.term} · Carné ${s.id}`)}</p>` +
    `</div>` +
    `<div class="au-app__grid">` +
    box({
      title: "Próxima clase",
      tone: "dark",
      body:
        `<div class="au-next">` +
        `<p class="au-next__course">${escape(s.nextClass.course)}</p>` +
        `<p class="au-next__time">${escape(s.nextClass.time)} · ${escape(s.nextClass.in)}</p>` +
        `<p class="au-next__where">${escape(s.nextClass.room)} · ${escape(s.nextClass.teacher)}</p>` +
        `</div>`,
    }) +
    box({
      title: "Estado de cuenta",
      body:
        `<p class="au-result__value" style="font-size:var(--step-2)">${escape(lempiras(s.account.balance))}</p>` +
        `<p class="au-datarow"><b>${escape(s.account.status)}</b>` +
        `<span class="au-datarow__end">${escape(shortDate(s.account.nextDue))}</span>` +
        `<span>Próximo vencimiento · ${escape(s.account.plan)}</span></p>` +
        `<p class="au-datarow"><b>${escape(s.account.scholarship)}</b>` +
        `<span>Beca vigente en este período</span></p>`,
    }) +
    box({
      title: "Entregas pendientes",
      body:
        s.pending
          .map(
            (item) =>
              `<p class="au-datarow"><b>${escape(item.task)}</b>` +
              `<span class="au-datarow__end">${escape(shortDate(item.due))}</span>` +
              `<span>${escape(item.course)}</span></p>`,
          )
          .join(""),
    }) +
    box({
      title: "Calificaciones recientes",
      span: true,
      body:
        s.grades
          .map(
            (grade) =>
              `<p class="au-datarow"><b>${escape(grade.item)}</b>` +
              `<span class="au-datarow__end">${score(grade.score)}</span>` +
              `<span>${escape(grade.course)} · ${escape(shortDate(grade.date))}</span></p>`,
          )
          .join(""),
    }) +
    box({
      title: "Próximos eventos",
      body:
        s.events
          .map(
            (event) =>
              `<p class="au-datarow"><b>${escape(event.title)}</b>` +
              `<span class="au-datarow__end">${escape(shortDate(event.date))}</span>` +
              `<span>${escape(event.place)}</span></p>`,
          )
          .join("") +
        `<p style="margin-top:0.6rem">${arrowLink("Calendario completo", page(ctx, "calendario"))}</p>`,
    }) +
    `</div>`;

  const clases =
    `<h2 class="au-panelbox__title" style="margin-bottom:0.4rem">Mis clases · ${escape(s.term)}</h2>` +
    `<div class="au-app__grid">` +
    s.courses
      .map(
        (course) =>
          `<section class="au-panelbox">` +
          `<p class="au-feed__course">${escape(course.code)}</p>` +
          `<h3 style="margin:0;font-size:var(--step-0)">${escape(course.name)}</h3>` +
          `<p class="au-greet__meta">${escape(course.teacher)} · ${escape(course.schedule)}</p>` +
          `<div class="au-progress"><div class="au-progress__fill" style="width:${course.progress}%"></div></div>` +
          `<p class="au-datarow"><b>Avance del curso</b>` +
          `<span class="au-datarow__end">${course.progress}%</span></p>` +
          `<p class="au-datarow"><b>Promedio actual</b>` +
          `<span class="au-datarow__end">${score(course.grade)}</span></p>` +
          `</section>`,
      )
      .join("") +
    `</div>`;

  const cuenta =
    `<div class="au-app__grid">` +
    box({
      title: "Resumen",
      body:
        `<p class="au-datarow"><b>Saldo del período</b><span class="au-datarow__end">${escape(lempiras(s.account.balance))}</span></p>` +
        `<p class="au-datarow"><b>Plan de pago</b><span class="au-datarow__end">${escape(s.account.plan)}</span></p>` +
        `<p class="au-datarow"><b>Beca</b><span class="au-datarow__end">${escape(s.account.scholarship)}</span></p>` +
        `<p class="au-datarow"><b>Próximo vencimiento</b><span class="au-datarow__end">${escape(longDate(s.account.nextDue))}</span></p>`,
    }) +
    box({
      title: "Historial de pagos",
      span: true,
      body:
        `<div class="au-scroller"><table class="au-table"><thead><tr>` +
        `<th scope="col">Fecha</th><th scope="col">Concepto</th>` +
        `<th scope="col" class="au-num">Monto</th><th scope="col">Estado</th></tr></thead><tbody>` +
        s.account.history
          .map(
            (row) =>
              `<tr><th scope="row">${escape(shortDate(row.date))}</th>` +
              `<td>${escape(row.concept)}</td>` +
              `<td class="au-num">${escape(lempiras(row.amount))}</td>` +
              `<td><span class="au-tag au-tag--ok">Pagado</span></td></tr>`,
          )
          .join("") +
        `</tbody></table></div>`,
    }) +
    `</div>`;

  const documentos =
    `<div class="au-app__grid">` +
    box({
      title: "Mis documentos",
      span: true,
      body:
        s.documents
          .map(
            (document_) =>
              `<p class="au-datarow"><b>${escape(document_.name)}</b>` +
              `<span class="au-datarow__end">` +
              (document_.state.startsWith("Listo")
                ? `<button class="au-btn au-btn--small au-btn--ghost" type="button" ` +
                  `data-download="${esc(document_.name)}" data-download-note="Documento del portal estudiantil demostrativo.">Descargar</button>`
                : `<span class="au-tag au-tag--soft">En proceso</span>`) +
              `</span><span>${escape(document_.state)} · solicitado el ${escape(shortDate(document_.date))}</span></p>`,
          )
          .join("") +
        `<p style="margin-top:0.8rem">${arrowLink("Centro de documentos", page(ctx, "documentos"))}</p>`,
    }) +
    box({
      title: "Accesos",
      body:
        s.shortcuts
          .map(
            (shortcut) =>
              `<p class="au-datarow"><b>${escape(shortcut.label)}</b><span>${escape(shortcut.note)}</span></p>`,
          )
          .join(""),
    }) +
    `</div>`;

  const sections = [
    { id: "resumen", label: "Resumen", body: resumen },
    { id: "clases", label: "Mis clases", badge: String(student.courses.length), body: clases },
    { id: "cuenta", label: "Estado de cuenta", body: cuenta },
    { id: "documentos", label: "Documentos", body: documentos },
  ];

  const body = `    <div class="au-app">
${appBar(ctx, { productName: "Portal estudiantil", userName: s.fullName })}

      <div class="au-app__body" id="contenido">
${appNav(sections)}
        <div>
${sections.map((section, index) => appPanel(section, index)).join("\n")}
        </div>
      </div>

      <div class="au-shell" style="padding-bottom:3rem">
        <p class="au-note">
          Esta pantalla demuestra que el alcance de CoreStruct no termina en el sitio público:
          el mismo equipo construye el sistema detrás.
        </p>
        <div class="au-actions">
          ${button("Ver el portal de padres", page(ctx, "portalPadres"), { ghost: true, small: true })}
          ${button("Ver el campus virtual", page(ctx, "campusVirtual"), { ghost: true, small: true })}
        </div>
      </div>
    </div>`;

  return {
    meta: {
      title: "Portal estudiantil · demostración",
      description:
        "Demostración del portal del estudiante de AUREA: próxima clase, cursos, " +
        "calificaciones, estado de cuenta y documentos. Datos ficticios, sin sesión ni servidor.",
      canonical: "demo/portal-estudiantil.html",
    },
    current: null,
    body,
    bare: true,
  };
}

/* ========================================================= parent portal */

export function parentPortal(ctx) {
  const p = parent;

  const resumen =
    `<div class="au-greet">` +
    `<h1 class="au-greet__hello">${escape(`Buenas tardes, ${p.guardian}.`)}</h1>` +
    `<p class="au-greet__meta">` +
    `${escape(`${p.child.name} · ${p.child.grade} · ${p.child.program} · Docente guía: ${p.child.guide}`)}</p>` +
    `</div>` +
    `<div class="au-app__grid">` +
    box({
      title: "Asistencia del período",
      body:
        `<div class="au-ring" data-ring="${p.attendance.rate}">` +
        `<svg viewBox="0 0 120 120" aria-hidden="true">` +
        `<circle class="au-ring__track" cx="60" cy="60" r="50"/>` +
        `<circle class="au-ring__arc" cx="60" cy="60" r="50"/></svg>` +
        `<span class="au-ring__value">${p.attendance.rate}%</span></div>` +
        `<p class="au-greet__meta" style="text-align:center">` +
        `${p.attendance.rate} % de asistencia · ${p.attendance.absences} ausencias y ` +
        `${p.attendance.late} tardanza en ${p.attendance.present} días</p>`,
    }) +
    box({
      title: "Estado de cuenta",
      body:
        `<p class="au-result__value" style="font-size:var(--step-2)">${escape(lempiras(p.account.balance))}</p>` +
        `<p class="au-datarow"><b>${escape(p.account.status)}</b>` +
        `<span class="au-datarow__end">${escape(shortDate(p.account.nextDue))}</span>` +
        `<span>Próximo vencimiento · ${escape(p.account.plan)}</span></p>`,
    }) +
    box({
      title: "Tareas pendientes",
      body:
        p.homework
          .filter((item) => item.state === "pendiente")
          .map(
            (item) =>
              `<p class="au-datarow"><b>${escape(item.task)}</b>` +
              `<span class="au-datarow__end">${escape(shortDate(item.due))}</span>` +
              `<span>${escape(item.subject)}</span></p>`,
          )
          .join(""),
    }) +
    box({
      title: "Avisos recientes",
      span: true,
      body:
        p.notices
          .map(
            (item) =>
              `<p class="au-datarow"><b>${escape(item.title)}</b>` +
              `<span class="au-datarow__end">${escape(shortDate(item.date))}</span>` +
              `<span>${escape(item.text)}</span></p>`,
          )
          .join(""),
    }) +
    box({
      title: "Docentes",
      body:
        p.teachers
          .map(
            (teacher) =>
              `<p class="au-datarow"><b>${escape(teacher.name)}</b>` +
              `<span>${escape(teacher.role)} · ${escape(teacher.hours)}</span></p>`,
          )
          .join(""),
    }) +
    `</div>`;

  const calificaciones =
    `<div class="au-app__grid">` +
    box({
      title: "Calificaciones por asignatura",
      span: true,
      body:
        `<div class="au-scroller"><table class="au-table"><thead><tr>` +
        `<th scope="col">Asignatura</th><th scope="col">Docente</th>` +
        `<th scope="col" class="au-num">Parcial</th><th scope="col" class="au-num">Promedio</th>` +
        `</tr></thead><tbody>` +
        p.grades
          .map(
            (row) =>
              `<tr><th scope="row">${escape(row.subject)}</th><td>${escape(row.teacher)}</td>` +
              `<td class="au-num">${score(row.partial)}</td>` +
              `<td class="au-num">${score(row.average)}</td></tr>`,
          )
          .join("") +
        `</tbody></table></div>`,
    }) +
    box({
      title: "Promedio general",
      body:
        `<p class="au-result__value" style="font-size:var(--step-3)">` +
        `${Math.round(p.grades.reduce((sum, row) => sum + row.average, 0) / p.grades.length)}</p>` +
        `<p class="au-greet__meta">Promedio ponderado del período en curso, sobre 100.</p>`,
    }) +
    `</div>`;

  const asistencia =
    `<div class="au-app__grid">` +
    box({
      title: "Registro del período",
      span: true,
      body:
        `<p class="au-greet__meta" style="margin-bottom:0.6rem">${escape(p.attendance.period)}</p>` +
        p.attendance.detail
          .map(
            (row) =>
              `<p class="au-datarow"><b>${escape(longDate(row.date))}</b>` +
              `<span class="au-datarow__end">` +
              `<span class="au-tag au-tag--${row.state === "ausencia" ? "warn" : "soft"}">` +
              `${escape(row.state === "ausencia" ? "Ausencia" : "Tardanza")}</span></span>` +
              `<span>${escape(row.note)}</span></p>`,
          )
          .join(""),
    }) +
    box({
      title: "Resumen",
      body:
        `<p class="au-datarow"><b>Días con registro</b><span class="au-datarow__end">${p.attendance.present}</span></p>` +
        `<p class="au-datarow"><b>Ausencias</b><span class="au-datarow__end">${p.attendance.absences}</span></p>` +
        `<p class="au-datarow"><b>Tardanzas</b><span class="au-datarow__end">${p.attendance.late}</span></p>`,
    }) +
    `</div>`;

  const reunion =
    `<div class="au-app__grid">` +
    box({
      title: "Solicitar una reunión",
      span: true,
      body:
        `<form data-demo-form="Reunión solicitada en la demostración. No se envió nada.">` +
        `<div class="au-formgrid">` +
        `<div class="au-field"><label class="au-field__label" for="au-r-docente">Docente</label>` +
        `<select class="au-select" id="au-r-docente" name="docente">` +
        p.teachers.map((teacher) => `<option>${escape(teacher.name)}</option>`).join("") +
        `</select></div>` +
        `<div class="au-field"><label class="au-field__label" for="au-r-cita">Horario disponible</label>` +
        `<select class="au-select" id="au-r-cita" name="cita">` +
        p.meetingSlots
          .map(
            (slot) =>
              `<option>${escape(`${shortDate(slot.date)} · ${slot.time} · ${slot.teacher}`)}</option>`,
          )
          .join("") +
        `</select></div>` +
        `<div class="au-field au-formgrid--wide"><label class="au-field__label" for="au-r-motivo">Motivo</label>` +
        `<textarea class="au-textarea" id="au-r-motivo" name="motivo" required></textarea></div>` +
        `</div>` +
        `<div class="au-actions">${button("Solicitar reunión", null, { solid: true, small: true, type: "submit" })}</div>` +
        `<p class="au-note">Demostración: la solicitud no se envía a nadie.</p>` +
        `</form>`,
    }) +
    box({
      title: "Comunicación",
      body:
        p.teachers
          .map(
            (teacher) =>
              `<p class="au-datarow"><b>${escape(teacher.name)}</b>` +
              `<span class="au-datarow__end"><a href="mailto:${escape(teacher.email)}">Escribir</a></span>` +
              `<span>${escape(teacher.hours)}</span></p>`,
          )
          .join(""),
    }) +
    `</div>`;

  const sections = [
    { id: "p-resumen", label: "Resumen", body: resumen },
    { id: "p-asistencia", label: "Asistencia", body: asistencia },
    { id: "p-notas", label: "Calificaciones", body: calificaciones },
    { id: "p-reunion", label: "Solicitar reunión", body: reunion },
  ];

  const body = `    <div class="au-app">
${appBar(ctx, { productName: "Portal de padres", userName: p.guardian })}

      <div class="au-app__body" id="contenido">
${appNav(sections)}
        <div>
${sections.map((section, index) => appPanel(section, index)).join("\n")}
        </div>
      </div>

      <div class="au-shell" style="padding-bottom:3rem">
        <p class="au-note">
          El portal de familias es, en la práctica, la interfaz más usada de una institución de
          educación media: se abre para una fecha, una nota o un saldo, casi siempre desde un
          teléfono.
        </p>
        <div class="au-actions">
          ${button("Ver el portal estudiantil", page(ctx, "portalEstudiante"), { ghost: true, small: true })}
          ${button("Volver a AUREA", page(ctx, "home"), { ghost: true, small: true })}
        </div>
      </div>
    </div>`;

  return {
    meta: {
      title: "Portal de padres · demostración",
      description:
        "Demostración del portal de familias de AUREA: asistencia, calificaciones, tareas, " +
        "avisos, estado de cuenta y solicitud de reunión. Datos ficticios.",
      canonical: "demo/portal-padres.html",
    },
    current: null,
    body,
    bare: true,
  };
}

/* ========================================================= virtual campus */

export function virtualCampusPage(ctx) {
  const v = virtualCampus;

  const body = `    <div class="au-app">
${appBar(ctx, { productName: "AUREA Virtual", userName: v.student })}

      <div class="au-app__body" id="contenido" style="grid-template-columns:1fr">
        <div class="au-app__main">
          <div class="au-greet">
            <h1 class="au-greet__hello">AUREA Virtual</h1>
            <p class="au-greet__meta">${escape(`${v.student} · ${v.term}`)}</p>
          </div>

          <p class="au-lead" style="max-width:62ch">
            Una vista previa, no un LMS. Construir un entorno de aprendizaje completo son meses
            de trabajo y no diría nada que esta pantalla no diga: aquí están las seis superficies
            que tiene un curso y cómo se integrarían con el resto del portal.
          </p>

          <div class="au-app__grid">
${v.courses
  .map(
    (course) =>
      `            <article class="au-vcourse">
              <div class="au-vcourse__head">
                <span class="au-vcourse__code">${escape(course.code)}</span>
                ${course.unread ? `<span class="au-tag">${course.unread} sin leer</span>` : ""}
              </div>
              <h2 class="au-vcourse__name">${escape(course.name)}</h2>
              <p class="au-greet__meta">${escape(course.teacher)}</p>
              <div class="au-progress"><div class="au-progress__fill" style="width:${course.progress}%"></div></div>
              <p class="au-greet__meta">${course.progress}% del programa cubierto</p>
            </article>`,
  )
  .join("\n")}
          </div>

          <div class="au-app__grid" style="margin-top:1.4rem">
            <section class="au-panelbox au-panelbox--span2">
              <h2 class="au-panelbox__title">Qué incluye cada curso</h2>
              <div class="au-app__grid">
${v.surfaces
  .map(
    (surface) =>
      `                <div><h3 style="font-size:var(--step-0);margin:0 0 0.2rem">${escape(surface.name)}</h3>` +
      `<p class="au-greet__meta">${escape(surface.text)}</p></div>`,
  )
  .join("\n")}
              </div>
            </section>

            <section class="au-panelbox">
              <h2 class="au-panelbox__title">Actividad reciente</h2>
              <ul class="au-feed">
${v.activity
  .map(
    (item) =>
      `                <li class="au-feed__item"><span class="au-feed__course">${escape(item.course)}</span>` +
      `<span>${escape(item.text)}</span><span class="au-feed__when">${escape(item.when)}</span></li>`,
  )
  .join("\n")}
              </ul>
            </section>
          </div>

          <div style="margin-top:2rem">
            <p class="au-note">
              En un despliegue real, esta vista se integra con el portal estudiantil y con el
              sistema académico: una sola cuenta, un solo calendario y las calificaciones
              publicadas una vez.
            </p>
            <div class="au-actions">
              ${button("Portal estudiantil", page(ctx, "portalEstudiante"), { ghost: true, small: true })}
              ${button("Portal de padres", page(ctx, "portalPadres"), { ghost: true, small: true })}
              ${button("Volver a AUREA", page(ctx, "home"), { ghost: true, small: true })}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return {
    meta: {
      title: "Campus virtual · demostración",
      description:
        "Vista previa del campus virtual de AUREA: cursos, tareas, materiales, videoclases, " +
        "evaluaciones y foros. Demostración de integración, no un LMS.",
      canonical: "demo/campus-virtual.html",
    },
    current: null,
    body,
    bare: true,
  };
}

/* Re-exported for the sitemap, which needs the three canonical paths. */
export const portalPaths = [
  "demo/portal-estudiantil.html",
  "demo/portal-padres.html",
  "demo/campus-virtual.html",
];
