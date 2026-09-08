/**
 * The institutional calendar.
 *
 * A school calendar is a filtering problem, not a display problem. A parent of
 * a tenth-grader and a fourth-year engineering student share a campus and
 * almost no dates, so every event carries two independent taxonomies —
 * `category` (what kind of thing it is) and `audience` (who it concerns) — and
 * the interface lets a reader cross them.
 *
 * The admissions dates are not repeated here: `keyDates` from `admissions.js`
 * is folded in below, so a deadline moved in one file moves in both the
 * admissions timeline and the calendar.
 *
 * Every date is invented, and the academic year runs September 2026 to
 * July 2027 so the demo always opens on a month with something in it.
 */

import { keyDates } from "./admissions.js";

export const categories = [
  { id: "academico", label: "Académico" },
  { id: "admisiones", label: "Admisiones" },
  { id: "deportes", label: "Deportes" },
  { id: "arte", label: "Arte y Cultura" },
  { id: "institucional", label: "Institucional" },
  { id: "padres", label: "Padres" },
];

export const audiencesFilter = [
  { id: "media", label: "Educación Media" },
  { id: "superior", label: "Universidad" },
  { id: "todos", label: "Toda la comunidad" },
];

/* The month the calendar opens on. Written here rather than derived from the
   clock: a demo that opens on an empty month looks broken, and the fiction is
   dated anyway. */
export const defaultMonth = { year: 2026, month: 8 }; /* month is 0-indexed: septiembre */

/** Events, in no particular order — the renderers sort. */
const events = [
  {
    id: "feria-carreras",
    date: "2026-09-18",
    time: "9:00 – 16:00",
    place: "Explanada Central",
    category: "admisiones",
    audience: "todos",
    title: "Feria de Carreras 2027",
    text:
      "Las nueve carreras, con docentes y estudiantes de cada programa atendiendo en su " +
      "propio módulo. Laboratorios abiertos y charlas de veinte minutos cada hora.",
    featured: true,
  },
  {
    id: "open-campus",
    date: "2026-09-25",
    time: "8:30 – 12:30",
    place: "Campus Central",
    category: "admisiones",
    audience: "todos",
    title: "Open Campus",
    text:
      "Recorrido guiado por aulas, laboratorios, biblioteca y centro deportivo, con " +
      "sesión de admisiones y financiamiento para familias.",
    featured: true,
  },
  {
    id: "semana-innovacion",
    date: "2026-10-03",
    endDate: "2026-10-07",
    time: "Todo el día",
    place: "Centro de Innovación",
    category: "academico",
    audience: "superior",
    title: "Semana de Innovación",
    text:
      "Cinco días de talleres, demostraciones y presentación de los proyectos " +
      "integradores de tercer y cuarto año. Abierta al público.",
    featured: true,
  },
  {
    id: "reunion-padres-media",
    date: "2026-09-11",
    time: "17:00 – 19:00",
    place: "Auditorio Aurea",
    category: "padres",
    audience: "media",
    title: "Reunión general de padres · Educación Media",
    text: "Presentación del año lectivo, calendario de evaluaciones y equipo docente por sección.",
  },
  {
    id: "induccion-primer-ingreso",
    date: "2026-09-08",
    time: "7:30 – 12:00",
    place: "Auditorio Aurea",
    category: "academico",
    audience: "todos",
    title: "Inducción de primer ingreso",
    text: "Jornada de bienvenida: campus virtual, biblioteca, reglamento y asignación de tutor.",
  },
  {
    id: "torneo-interclases",
    date: "2026-09-26",
    time: "8:00 – 17:00",
    place: "Centro Deportivo",
    category: "deportes",
    audience: "media",
    title: "Torneo Interclases de Fútbol",
    text: "Fase de grupos de décimo a duodécimo grado. La final se juega el 10 de octubre.",
  },
  {
    id: "concierto-otono",
    date: "2026-09-30",
    time: "19:00",
    place: "Auditorio Aurea",
    category: "arte",
    audience: "todos",
    title: "Concierto de la Orquesta AUREA",
    text: "Programa de cuerdas y coro con obras de repertorio latinoamericano. Entrada libre.",
  },
  {
    id: "examenes-parciales",
    date: "2026-10-13",
    endDate: "2026-10-17",
    time: "Según horario",
    place: "Aulas asignadas",
    category: "academico",
    audience: "todos",
    title: "Exámenes parciales",
    text: "Primer parcial de educación media y evaluación de medio período en las licenciaturas.",
  },
  {
    id: "muestra-diseno",
    date: "2026-10-22",
    time: "17:00 – 21:00",
    place: "Galería del Centro de Innovación",
    category: "arte",
    audience: "superior",
    title: "Muestra de Portafolios · Diseño Digital",
    text: "Revisión abierta de los portafolios de tercer año, con jurado de profesionales invitados.",
  },
  {
    id: "jornada-cientifica",
    date: "2026-10-29",
    time: "8:00 – 15:00",
    place: "Laboratorios A y B",
    category: "academico",
    audience: "media",
    title: "Jornada Científica de Educación Media",
    text: "Presentación de los proyectos de investigación de undécimo y duodécimo grado.",
  },
  {
    id: "entrega-notas-media",
    date: "2026-11-06",
    time: "14:00 – 18:00",
    place: "Aulas por sección",
    category: "padres",
    audience: "media",
    title: "Entrega de calificaciones · Primer parcial",
    text: "Atención individual con el docente guía. Cita reservable desde el portal de padres.",
  },
  {
    id: "torneo-baloncesto",
    date: "2026-11-14",
    time: "9:00 – 18:00",
    place: "Gimnasio Central",
    category: "deportes",
    audience: "todos",
    title: "Copa AUREA de Baloncesto",
    text: "Encuentro interinstitucional con seis centros invitados. Ramas femenina y masculina.",
  },
  {
    id: "aniversario",
    date: "2026-11-20",
    time: "10:00",
    place: "Explanada Central",
    category: "institucional",
    audience: "todos",
    title: "Aniversario institucional · 25 años",
    text: "Acto conmemorativo, reconocimiento a docentes con más de una década y develación del mural de egresados.",
  },
  {
    id: "foro-empleabilidad",
    date: "2026-11-27",
    time: "8:00 – 13:00",
    place: "Auditorio Aurea",
    category: "academico",
    audience: "superior",
    title: "Foro de Empleabilidad y Feria Laboral",
    text: "Veintidós empresas aliadas reciben hojas de vida y realizan entrevistas en sitio.",
  },
  {
    id: "festival-navideno",
    date: "2026-12-11",
    time: "18:00",
    place: "Explanada Central",
    category: "arte",
    audience: "todos",
    title: "Festival de Fin de Año",
    text: "Elencos de danza, teatro y música, con muestra de los clubes y feria gastronómica.",
  },
  {
    id: "examenes-finales",
    date: "2026-12-01",
    endDate: "2026-12-09",
    time: "Según horario",
    place: "Aulas asignadas",
    category: "academico",
    audience: "todos",
    title: "Exámenes finales del período",
    text: "Cierre del primer período universitario y del segundo parcial de educación media.",
  },
  {
    id: "receso",
    date: "2026-12-15",
    endDate: "2027-01-12",
    time: "Todo el día",
    place: "Campus cerrado",
    category: "institucional",
    audience: "todos",
    title: "Receso de fin de año",
    text: "Actividades administrativas suspendidas. Admisiones atiende en línea del 5 al 12 de enero.",
  },
  {
    id: "taller-padres-digital",
    date: "2027-01-22",
    time: "17:30 – 19:30",
    place: "Laboratorio C",
    category: "padres",
    audience: "media",
    title: "Taller para familias · Acompañamiento digital",
    text: "Cómo leer el portal de padres, configurar alertas y acompañar el uso de tecnología en casa.",
  },
  {
    id: "simulacro-prueba",
    date: "2027-01-31",
    time: "8:00 – 11:00",
    place: "Aulas 201–210",
    category: "admisiones",
    audience: "todos",
    title: "Simulacro de prueba de admisión",
    text: "Prueba de práctica sin costo para aspirantes, con retroalimentación el mismo día.",
  },
  {
    id: "natacion",
    date: "2027-02-20",
    time: "8:00 – 14:00",
    place: "Piscina Semiolímpica",
    category: "deportes",
    audience: "todos",
    title: "Festival de Natación",
    text: "Competencia interna por categorías y exhibición del equipo representativo.",
  },
  {
    id: "inicio-clases",
    date: "2027-04-05",
    time: "7:00",
    place: "Campus Central",
    category: "institucional",
    audience: "todos",
    title: "Inicio del año lectivo 2027",
    text: "Primer día de clases para educación media y para el período universitario I-2027.",
  },
];

/**
 * The admissions deadlines, promoted to calendar events.
 *
 * The calendar is where a reader goes to see the year; a deadline that only
 * lived on the admissions page would be missing from it. Mapping rather than
 * copying is what keeps the two from drifting.
 */
const admissionEvents = keyDates.map((entry) => ({
  id: `admision-${entry.date}`,
  date: entry.date,
  time: "Todo el día",
  place: "En línea y Campus Central",
  category: "admisiones",
  audience: "todos",
  title: entry.title,
  text: entry.text,
  fromAdmissions: true,
}));

/** Everything, sorted by date. */
export const allEvents = [...events, ...admissionEvents].sort((a, b) => a.date.localeCompare(b.date));

/** The three the homepage promotes. */
export const highlighted = events.filter((event) => event.featured);

export const eventsOfMonth = (year, month) =>
  allEvents.filter((event) => {
    const [y, m] = event.date.split("-").map(Number);
    return y === year && m - 1 === month;
  });

/**
 * The export formats offered on every event.
 *
 * The demo writes a real `.ics` in the browser rather than linking a service:
 * an iCal file is fourteen lines of text, every calendar application on earth
 * imports it, and it is the one export that does not send the reader’s plans
 * to a third party. The Google and Outlook buttons build a normal add-event
 * URL, which is what those two actually accept.
 */
export const exportTargets = [
  { id: "google", label: "Google Calendar" },
  { id: "outlook", label: "Outlook" },
  { id: "ical", label: "Apple Calendar · iCal" },
  { id: "descargar", label: "Descargar .ics" },
];
