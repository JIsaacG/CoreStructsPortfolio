/**
 * English for the AUREA demo — the fee calculator and the three signed-in
 * portals.
 *
 * The portals are the part of this demo that argues for the studio rather than
 * for the institution: "el alcance de CoreStruct no termina en el sitio
 * público: el mismo equipo construye el sistema detrás." That line, and the
 * virtual campus's admission that it is a preview and not an LMS, are the
 * honest framing of what is being shown, and they translate straight.
 *
 * Data rows are name / value / note triples. The generic span rule assembles
 * them; this file supplies the names and the notes.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurea";

export default {
  /* ------------------------------------------------------------ the charges */

  "Cargos adicionales por período. Cifras demostrativas.":
    "Additional charges per term. Illustrative figures.",
  "Se paga una sola vez, con la solicitud": "Paid once, with the application",
  "Por período · solo programas con laboratorio":
    "Per term · only on programmes with lab work",
  "Servicios tecnológicos": "Technology services",
  "Por período · campus virtual, correo y biblioteca digital":
    "Per term · virtual campus, email and digital library",
  "Derechos de graduación": "Graduation fee",
  "Último período": "Final term",

  /* ---------------------------------------------------------- the calculator */

  "Estima tu período completo.": "Estimate your whole term.",
  "La beca reduce el arancel y no los cargos administrativos, que es como se aplica de verdad. El plan de pago ajusta el total resultante.":
    "A scholarship reduces the tuition, not the administrative charges — which is how it actually " +
    "works. The payment plan then adjusts the resulting total.",
  "Asignaturas del período": "Modules this term",
  "Entre 3 y 6 es la carga habitual.": "Three to six is the usual load.",
  "Sin beca": "No scholarship",
  "Beca del 25 %": "25 % scholarship",
  "Beca del 40 %": "40 % scholarship",
  "Beca del 50 %": "50 % scholarship",
  "Beca del 60 %": "60 % scholarship",
  "Plan de pago": "Payment plan",
  "Pago de contado · 7 % de descuento sobre el período":
    "Paid in full · 7 % off the term",
  "Pago mensual · Sin recargo": "Monthly · no surcharge",
  "Diferido a 6 cuotas · 4 % de recargo administrativo":
    "Spread over 6 instalments · 4 % administration surcharge",
  "Estimación del período": "Term estimate",
  "Total aproximado del período": "Approximate total for the term",
  "Recibir información": "Get in touch",
  "Hablar con admisiones": "Talk to admissions",
  "Formas de pago": "Ways to pay",
  "Cómo se paga.": "How you pay.",

  /* ------------------------------------------------------ the virtual campus */

  "Andrea Núñez · Período II · 2026": "Andrea Núñez · Term II · 2026",
  "Una vista previa, no un LMS. Construir un entorno de aprendizaje completo son meses de trabajo y no diría nada que esta pantalla no diga: aquí están las seis superficies que tiene un curso y cómo se integrarían con el resto del portal.":
    "A preview, not an LMS. Building a complete learning environment is months of work and would say " +
    "nothing this screen does not: here are the six surfaces a course has, and how they would " +
    "integrate with the rest of the portal.",
  "Qué incluye cada curso": "What each course carries",
  "Cada asignatura con su programa, su docente y su avance.":
    "Each module with its syllabus, its teacher and its progress.",
  "Entregas con fecha, estado y retroalimentación del docente.":
    "Assignments with a due date, a status and the teacher's feedback.",
  "Lecturas, presentaciones y recursos, organizados por unidad.":
    "Readings, slides and resources, organised by unit.",
  "Grabaciones de sesión con marcadores por tema.":
    "Session recordings, with markers by topic.",
  "Cuestionarios, exámenes en línea y rúbricas publicadas de antemano.":
    "Quizzes, online exams and rubrics published in advance.",
  "Discusión por unidad, con moderación docente y respuesta entre pares.":
    "Discussion by unit, moderated by staff, with peer replies.",
  "En un despliegue real, esta vista se integra con el portal estudiantil y con el sistema académico: una sola cuenta, un solo calendario y las calificaciones publicadas una vez.":
    "In a real deployment this view integrates with the student portal and the academic system: one " +
    "account, one calendar, and grades published once.",
  "3 sin leer": "3 unread",
  "1 sin leer": "1 unread",
  "5 sin leer": "5 unread",
  "55% del programa cubierto": "55% of the syllabus covered",
  "58% del programa cubierto": "58% of the syllabus covered",
  "60% del programa cubierto": "60% of the syllabus covered",
  "62% del programa cubierto": "62% of the syllabus covered",

  '<span class="au-feed__course">Sistemas Operativos</span><span>Nuevo material: planificación de procesos (PDF)</span><span class="au-feed__when">hace 2 horas</span>':
    '<span class="au-feed__course">Operating Systems</span><span>New material: process scheduling ' +
    '(PDF)</span><span class="au-feed__when">2 hours ago</span>',
  '<span class="au-feed__course">Programación II</span><span>Retroalimentación publicada en Proyecto integrador · entrega 1</span><span class="au-feed__when">hace 5 horas</span>':
    '<span class="au-feed__course">Programming II</span><span>Feedback published on Capstone ' +
    'project · submission 1</span><span class="au-feed__when">5 hours ago</span>',
  '<span class="au-feed__course">Bases de Datos I</span><span>Nueva discusión en el foro de la unidad 3</span><span class="au-feed__when">ayer</span>':
    '<span class="au-feed__course">Databases I</span><span>New discussion in the unit 3 ' +
    'forum</span><span class="au-feed__when">yesterday</span>',

  /* ------------------------------------------------------- the student portal */

  "Andrea Núñez Bonilla": "Andrea Núñez Bonilla",
  "Buenos días, Andrea.": "Good morning, Andrea.",
  "Ingeniería en Sistemas · Tercer año · Período II · 2026 · Carné 20260418":
    "Systems Engineering · Third year · Term II · 2026 · ID 20260418",
  "Próxima clase": "Next class",
  "Laboratorio de cómputo B · Daniel Espinoza": "Computer lab B · Daniel Espinoza",
  "Mis clases · Período II · 2026": "My classes · Term II · 2026",
  "Historial de pagos": "Payment history",
  "Matrícula Período II": "Term II enrolment fee",
  "Presentación oral": "Oral presentation",
  "Constancia de estudios": "Certificate of enrolment",
  "Certificación de calificaciones": "Certified transcript",
  "Listo para descargar · solicitado el 1 sep 2026":
    "Ready to download · requested 1 Sep 2026",
  "Listo para descargar · solicitado el 15 ago 2026":
    "Ready to download · requested 15 Aug 2026",
  "En proceso · 6 días hábiles · solicitado el 3 sep 2026":
    "In progress · 6 working days · requested 3 Sep 2026",
  "Centro de documentos": "Document centre",
  "Esta pantalla demuestra que el alcance de CoreStruct no termina en el sitio público: el mismo equipo construye el sistema detrás.":
    "This screen shows that CoreStruct's scope does not stop at the public site: the same team " +
    "builds the system behind it.",
  "Ver el portal de padres": "See the parent portal",
  "Ver el campus virtual": "See the virtual campus",

  "Programación II · 4 sep 2026": "Programming II · 4 Sep 2026",
  "Inglés Técnico · 3 sep 2026": "Technical English · 3 Sep 2026",
  "Bases de Datos I · 2 sep 2026": "Databases I · 2 Sep 2026",
  "Probabilidad y Estadística · 30 ago 2026": "Probability and Statistics · 30 Aug 2026",
  "Daniel Espinoza · Lun · Mié · Vie 10:00": "Daniel Espinoza · Mon · Wed · Fri 10:00",
  "Sofía Brenes · Mar · Jue 14:00": "Sofía Brenes · Tue · Thu 14:00",
  "Óscar Benítez · Lun · Mié 16:00": "Óscar Benítez · Mon · Wed 16:00",
  "Lucía Mejía · Vie 14:00": "Lucía Mejía · Fri 14:00",

  /* The data rows on the two portals. */
  '<b>Al día</b><span class="au-datarow__end">25 sep 2026</span><span>Próximo vencimiento · Pago mensual sin recargo</span>':
    '<b>Up to date</b><span class="au-datarow__end">25 Sep 2026</span><span>Next payment due · ' +
    "Monthly, no surcharge</span>",
  '<b>Al día</b><span class="au-datarow__end">25 sep 2026</span><span>Próximo vencimiento · Diez cuotas · sin recargo</span>':
    '<b>Up to date</b><span class="au-datarow__end">25 Sep 2026</span><span>Next payment due · Ten ' +
    "instalments · no surcharge</span>",
  '<b>Beca Excelencia · 60 %</b><span>Beca vigente en este período</span>':
    "<b>Academic Excellence Scholarship · 60 %</b><span>Held this term</span>",
  '<b>Modelo entidad-relación del proyecto</b><span class="au-datarow__end">9 sep 2026</span><span>Bases de Datos I</span>':
    '<b>Entity-relationship model for the project</b><span class="au-datarow__end">9 Sep ' +
    "2026</span><span>Databases I</span>",
  '<b>Informe de planificación de procesos</b><span class="au-datarow__end">11 sep 2026</span><span>Sistemas Operativos</span>':
    '<b>Process scheduling report</b><span class="au-datarow__end">11 Sep ' +
    "2026</span><span>Operating Systems</span>",
  '<b>Proyecto integrador · entrega 2</b><span class="au-datarow__end">15 sep 2026</span><span>Programación II</span>':
    '<b>Capstone project · submission 2</b><span class="au-datarow__end">15 Sep ' +
    "2026</span><span>Programming II</span>",
  '<b>Feria de Carreras 2027</b><span class="au-datarow__end">18 sep 2026</span><span>Explanada Central</span>':
    '<b>Careers Fair 2027</b><span class="au-datarow__end">18 Sep 2026</span><span>Central ' +
    "Concourse</span>",
  '<b>Semana de Innovación</b><span class="au-datarow__end">3 oct 2026</span><span>Centro de Innovación</span>':
    '<b>Innovation Week</b><span class="au-datarow__end">3 Oct 2026</span><span>Innovation ' +
    "Centre</span>",
  '<b>Exámenes parciales</b><span class="au-datarow__end">13 oct 2026</span><span>Aulas asignadas</span>':
    '<b>Mid-term examinations</b><span class="au-datarow__end">13 Oct 2026</span><span>Assigned ' +
    "classrooms</span>",
  '<b>Saldo del período</b><span class="au-datarow__end">L 6,125</span>':
    '<b>Balance for the term</b><span class="au-datarow__end">L 6,125</span>',
  '<b>Plan de pago</b><span class="au-datarow__end">Pago mensual sin recargo</span>':
    '<b>Payment plan</b><span class="au-datarow__end">Monthly, no surcharge</span>',
  '<b>Próximo vencimiento</b><span class="au-datarow__end">25 de septiembre de 2026</span>':
    '<b>Next payment due</b><span class="au-datarow__end">25 September 2026</span>',
  "<b>Biblioteca digital</b><span>Bases de datos y repositorio</span>":
    "<b>Digital library</b><span>Databases and the repository</span>",
  "<b>Reservar sala de estudio</b><span>Bloques de dos horas</span>":
    "<b>Book a study room</b><span>Two-hour blocks</span>",
  "<b>Solicitar constancia</b><span>Tres días hábiles</span>":
    "<b>Request a certificate</b><span>Three working days</span>",
  "<b>Agendar tutoría</b><span>Lunes a viernes, 14:00 – 18:00</span>":
    "<b>Book a tutorial</b><span>Monday to Friday, 14:00 – 18:00</span>",
  "<b>Soporte tecnológico</b><span>Cuenta, acceso y laboratorios</span>":
    "<b>IT support</b><span>Account, access and laboratories</span>",
  '<b>Ejercicios de funciones · páginas 44 a 46</b><span class="au-datarow__end">9 sep 2026</span><span>Matemática I</span>':
    '<b>Functions exercises · pages 44 to 46</b><span class="au-datarow__end">9 Sep ' +
    "2026</span><span>Mathematics I</span>",
  '<b>Informe de laboratorio: célula vegetal</b><span class="au-datarow__end">10 sep 2026</span><span>Biología</span>':
    '<b>Lab report: the plant cell</b><span class="au-datarow__end">10 Sep ' +
    "2026</span><span>Biology</span>",

  "Sistemas Operativos": "Operating Systems",
  "Lucía Mejía": "Lucía Mejía",
};
