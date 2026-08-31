/**
 * Content for the two campaign landings behind the "Landing pages" card:
 * Cierzo (a service, booking a consultation) and Lumen (an event, reserving
 * a seat). Two objectives on purpose — a landing is judged on how well it
 * commits to one goal, and that only shows by contrast with a different one.
 *
 * Each entry is a complete page. `accent` sets the two brand properties every
 * shared demo component reads, same mechanism the rest of the demos use.
 */

export const cierzo = {
  slug: "servicios",
  brand: {
    name: "Cierzo",
    mark: "Consultoría estratégica",
    sector: "Consultoría de negocio — marca ficticia",
  },
  accent: { primary: "#1b0f2e", secondary: "#8b5cf6" },
  hero: {
    eyebrow: "Consultoría estratégica y operativa",
    title: "Un diagnóstico claro de tu operación, en dos semanas",
    lead:
      "Trabajamos con pymes que crecieron más rápido que sus procesos. Encontramos dónde se pierde el " +
      "tiempo y el margen, y salimos con un plan que tu equipo puede ejecutar sin contratar a nadie más.",
    primaryCta: "Agenda tu diagnóstico gratuito",
    secondaryCta: "Ver cómo trabajamos",
    meta: ["Sin costo · 45 minutos", "100% en línea", "Respuesta en 24 horas"],
  },
  features: [
    {
      title: "Diagnóstico sin compromiso",
      text: "Una sesión de 45 minutos para entender el problema real, no el síntoma que se ve primero.",
    },
    {
      title: "Plan accionable en 15 días",
      text: "Nada de informes de cien páginas: un plan corto, priorizado y con dueño para cada tarea.",
    },
    {
      title: "Acompañamiento hasta implementar",
      text: "Nos quedamos hasta que el cambio funciona en la operación diaria, no solo en la presentación.",
    },
  ],
  steps: [
    {
      title: "Diagnóstico",
      text: "Revisamos procesos, números y conversaciones con tu equipo para mapear dónde se atora la operación.",
    },
    {
      title: "Plan de acción",
      text: "Entregamos un plan corto y priorizado: qué cambiar primero, quién lo hace y qué se mide.",
    },
    {
      title: "Acompañamiento",
      text: "Trabajamos junto a tu equipo en la implementación, con revisiones quincenales hasta que el cambio se sostiene solo.",
    },
  ],
  testimonials: [
    {
      quote: "Llegamos con un problema de entregas tardías y salimos con un proceso que redujo el retraso promedio a la mitad.",
      author: "Gerente de operaciones",
      role: "Distribuidora de repuestos, San Pedro Sula",
    },
    {
      quote: "El plan era corto a propósito. Pudimos ejecutarlo con el equipo que ya teníamos, sin contratar a nadie.",
      author: "Dueña de negocio",
      role: "Cadena de clínicas dentales",
    },
  ],
  faq: [
    {
      question: "¿El diagnóstico tiene algún costo?",
      answer: "No. La primera sesión de 45 minutos es gratuita y no implica ningún compromiso posterior.",
    },
    {
      question: "¿Trabajan con negocios de cualquier tamaño?",
      answer: "Trabajamos mejor con equipos de 5 a 80 personas, donde los procesos ya no caben en la cabeza de una sola persona.",
    },
    {
      question: "¿Qué pasa después del plan de acción?",
      answer: "Si quieres acompañamiento en la implementación lo conversamos aparte; el plan es tuyo de todas formas.",
    },
    {
      question: "¿Es una consultoría real?",
      answer: "No. Cierzo es una marca ficticia construida para mostrar cómo luce una landing de servicios — no puedes contratarla.",
    },
  ],
  cta: {
    title: "¿Listo para ver dónde se está yendo el margen?",
    text: "Cuéntanos brevemente tu operación y te confirmamos un horario en menos de un día.",
    email: "hola@cierzo-demo.hn",
  },
  crosslink: { label: "Lumen", text: "una landing de lanzamiento", file: "evento.html" },
};

export const lumen = {
  slug: "evento",
  brand: {
    name: "Lumen",
    mark: "Encuentro de Innovación 2026",
    sector: "Conferencia de un día — marca ficticia",
  },
  accent: { primary: "#04211f", secondary: "#22d3c7" },
  hero: {
    eyebrow: "Encuentro anual · Estudio Lumen",
    title: "Un día completo sobre el futuro de tu industria",
    lead:
      "Seis conversaciones, cuatro industrias, un mismo lugar. Lumen reúne a quienes ya están construyendo " +
      "lo que el resto va a copiar en dos años — y te sientas en la misma mesa que ellos.",
    primaryCta: "Reservar mi lugar",
    secondaryCta: "Ver la agenda",
    meta: ["14 de noviembre de 2026", "San Pedro Sula, Honduras", "Cupo limitado a 200 personas"],
  },
  features: [
    {
      title: "Casos, no teoría",
      text: "Cada charla parte de una decisión real que alguien tomó, con los números de lo que salió bien y mal.",
    },
    {
      title: "Una sola sala",
      text: "Sin tracks paralelos: todos ven las mismas seis conversaciones y las comentan en los mismos descansos.",
    },
    {
      title: "Networking con intención",
      text: "Las mesas del almuerzo se arman por industria, no al azar, para que la conversación siga donde se quedó.",
    },
  ],
  agenda: [
    { time: "08:30", title: "Registro y café", speaker: null },
    { time: "09:00", title: "Apertura: el próximo salto no se ve venir", speaker: "Renata Ibarra, Estudio Lumen" },
    { time: "10:00", title: "De hoja de cálculo a plataforma: un año después", speaker: "Mario Villatoro, Grupo Andina" },
    { time: "12:30", title: "Almuerzo por industria", speaker: null },
    { time: "14:00", title: "Automatizar sin perder el criterio humano", speaker: "Cecilia Reyes, Puerto Norte Logística" },
    { time: "16:30", title: "Cierre y mesa de preguntas", speaker: "Todos los ponentes" },
  ],
  speakers: [
    { name: "Renata Ibarra", role: "Directora, Estudio Lumen" },
    { name: "Mario Villatoro", role: "VP de Tecnología, Grupo Andina" },
    { name: "Cecilia Reyes", role: "COO, Puerto Norte Logística" },
    { name: "Adrián Funes", role: "Fundador, Tejido Textil" },
  ],
  faq: [
    {
      question: "¿Cuánto cuesta el boleto?",
      answer: "El cupo es limitado a 200 personas; reserva tu lugar y te confirmamos el costo y las formas de pago por correo.",
    },
    {
      question: "¿Hay transmisión en línea?",
      answer: "No. Lumen es una experiencia presencial de un solo día, en una sola sala, sin transmisión.",
    },
    {
      question: "¿Qué incluye el boleto?",
      answer: "Acceso a las seis conversaciones, almuerzo por industria, materiales y los recesos de café.",
    },
    {
      question: "¿Es un evento real?",
      answer: "No. Lumen es una marca ficticia construida para mostrar cómo luce una landing de lanzamiento — no puedes reservar un lugar de verdad.",
    },
  ],
  cta: {
    title: "El cupo es de 200 personas y se llena rápido",
    text: "Reserva tu lugar y te escribimos con los detalles finales un mes antes del evento.",
    email: "reservas@lumen-demo.hn",
  },
  crosslink: { label: "Cierzo", text: "una landing de servicios", file: "servicios.html" },
};

export const landings = [cierzo, lumen];
