/**
 * English for the AUREA demo — the interface of the three signed-in products:
 * the virtual campus, the student portal and the parent portal.
 *
 * These are application labels rather than prose, so they are translated the
 * way a product is: short, in the register a student would actually read on a
 * dashboard — "Work due" rather than "Pending submissions", "Late" rather than
 * "Tardiness". The attendance vocabulary keeps the distinction the portal draws
 * between an absence, a late arrival and an excused one, because that is the
 * whole point of the panel.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurea";

export default {
  /* ------------------------------------------------------ the virtual campus */

  "Mis cursos": "My courses",
  Materiales: "Materials",
  Videoclases: "Video lessons",
  Evaluaciones: "Assessments",
  Foros: "Forums",
  "Videoclase disponible: memoria virtual":
    "Video lesson available: virtual memory",
  ayer: "yesterday",

  /* ------------------------------------------------------ the student portal */

  "Mis clases": "My classes",
  "10:00 – 11:40 · en 35 minutos": "10:00 – 11:40 · in 35 minutes",
  "Entregas pendientes": "Work due",
  "Calificaciones recientes": "Recent grades",
  "Parcial I": "Midterm I",
  "Laboratorio 3": "Lab 3",
  "Tarea 4": "Assignment 4",
  "Calendario completo": "Full calendar",
  "Karla Medrano · Mar · Jue 8:00": "Karla Medrano · Tue · Thu 8:00",
  Beca: "Scholarship",
  "Beca Excelencia · 60 %": "Excellence Scholarship · 60 %",
  "Mensualidad agosto": "August monthly fee",
  "Mensualidad julio": "July monthly fee",
  "Mis documentos": "My documents",
  "En proceso": "In progress",
  Accesos: "Shortcuts",
  "Cursos, materiales y entregas": "Courses, materials and submissions",

  /* ------------------------------------------------------- the parent portal */

  SM: "SM",
  Asistencia: "Attendance",
  Calificaciones: "Grades",
  "Avisos recientes": "Recent notices",
  Tardanza: "Late",
  "Justificada · enfermedad": "Excused · illness",
  Ausencias: "Absences",
  Tardanzas: "Late arrivals",
  Asignatura: "Subject",
  Parcial: "Midterm",
  Promedio: "Average",
  "Promedio general": "Overall average",
  "Horario disponible": "Available slot",
  "17 sep 2026 · 15:00 · Rodrigo Alvarenga": "17 Sep 2026 · 15:00 · Rodrigo Alvarenga",
};
