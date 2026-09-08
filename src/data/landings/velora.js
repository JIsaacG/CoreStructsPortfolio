/**
 * Velora — an invented aesthetic-medicine clinic, and the second landing demo.
 *
 * Where Nexora sells judgement, Velora sells a booking. Everything on the page
 * exists to move one visitor to one appointment, so the page carries a working
 * booking widget rather than a picture of one, and every section ends within
 * reach of it.
 *
 * It also stands in for every local premium service that lives on appointments:
 * clinics, studios, gyms, salons, restaurants, academies, hotels, real estate,
 * detailing. The structure — proof, choice, protocol, person, booking — is the
 * same for all of them.
 *
 * Nothing here is real. The doctor, the credentials, the ratings and the
 * results are written for the demonstration, and the page says so.
 */

export const velora = {
  slug: "velora",
  brand: {
    name: "Velora",
    mark: "Medicina estética y bienestar",
    sector: "Clínica de medicina estética — marca ficticia",
  },

  /* Ivory ground, soft black type, champagne as the metal, one terracotta that
     only ever appears at the size of a word. */
  theme: { accent: "#a8724f", page: "#faf7f2", ink: "#1f1a16" },

  nav: [
    { id: "reservar", label: "Reservar" },
    { id: "tratamientos", label: "Tratamientos" },
    { id: "resultados", label: "Resultados" },
    { id: "protocolo", label: "Protocolo" },
    { id: "equipo", label: "Equipo" },
  ],

  hero: {
    eyebrow: "Medicina estética · Tegucigalpa",
    title: ["Resultados naturales.", "Confianza que se nota."],
    lead:
      "Tratamientos personalizados diseñados para realzar tu belleza sin cambiar lo que te hace única.",
    primary: { label: "Reservar valoración", href: "#reservar" },
    secondary: { label: "Ver tratamientos", href: "#tratamientos" },
    rating: { score: "4.9", count: "480", text: "basado en más de 480 pacientes" },
    /* The two cards that float over the hero composition. They say the two
       things a first-time patient wants to know before anything else. */
    cards: [
      { label: "Próxima disponibilidad", value: "Jueves · 10:30 a. m." },
      { label: "Primera valoración", value: "45 min · sin costo" },
    ],
  },

  booking: {
    label: "Reserva",
    title: "Tu cita, en menos de un minuto.",
    text:
      "Elige el tratamiento, con quién y qué día. Te mostramos los horarios reales de la agenda " +
      "y confirmas en el momento.",
    steps: ["Tratamiento", "Profesional", "Fecha", "Horario"],
    treatments: [
      { id: "valoracion", name: "Valoración inicial", duration: "45 min", price: "Sin costo" },
      { id: "armonizacion", name: "Armonización facial", duration: "60 min", price: "Desde L 6 900" },
      { id: "laser", name: "Láser", duration: "40 min", price: "Desde L 3 400" },
      { id: "dermatologia", name: "Cuidado dermatológico", duration: "50 min", price: "Desde L 2 200" },
      { id: "rejuvenecimiento", name: "Rejuvenecimiento", duration: "75 min", price: "Desde L 8 400" },
      { id: "corporal", name: "Tratamiento corporal", duration: "90 min", price: "Desde L 5 100" },
    ],
    professionals: [
      { id: "adriana", name: "Dra. Adriana Solís", role: "Medicina estética facial", initials: "AS" },
      { id: "mariel", name: "Dra. Mariel Fonseca", role: "Dermatología clínica", initials: "MF" },
      { id: "equipo", name: "Primera disponible", role: "Cualquier profesional del equipo", initials: "VE" },
    ],
    /* Slots are fixed rather than generated: a demo that shuffles its own
       availability on every reload looks broken, not alive. */
    slots: ["09:00", "10:30", "11:15", "13:00", "14:45", "16:00", "17:30"],
    /* Which of the slots above are taken, by day index. The gaps are what make
       the agenda read as a real one. */
    taken: [
      [1, 3, 6],
      [0, 2],
      [2, 4, 5],
      [0, 1, 5, 6],
      [3],
      [0, 2, 4],
      [1, 2, 3, 4, 5, 6],
    ],
    hint: "Agenda de demostración: los horarios son ficticios y no se reserva nada.",
    confirm: {
      title: "Cita apartada",
      text: "Recibirías la confirmación por WhatsApp y un recordatorio el día anterior.",
      action: "Reservar otra fecha",
    },
  },

  treatments: {
    label: "Tratamientos",
    title: "Lo que hacemos, y para quién.",
    text:
      "Cada tratamiento empieza con una valoración. Si no es lo que necesitas, te lo decimos antes " +
      "de agendarlo.",
    items: [
      {
        art: "face",
        name: "Armonización facial",
        text: "Proporción antes que volumen. Trabajamos sobre tus rasgos, no sobre una plantilla.",
        detail: ["Ácido hialurónico", "Perfilado", "60 min"],
      },
      {
        art: "laser",
        name: "Láser",
        text: "Manchas, rojeces y textura. Sesiones cortas, sin detener tu semana.",
        detail: ["Fotorrejuvenecimiento", "Depilación", "40 min"],
      },
      {
        art: "derma",
        name: "Cuidado dermatológico",
        text: "Diagnóstico de piel y una rutina que puedas sostener en casa.",
        detail: ["Acné", "Rosácea", "50 min"],
      },
      {
        art: "renew",
        name: "Rejuvenecimiento",
        text: "Firmeza y luminosidad con protocolos graduales, sin cambios bruscos.",
        detail: ["Bioestimulación", "Peeling", "75 min"],
      },
      {
        art: "body",
        name: "Tratamientos corporales",
        text: "Contorno, textura y drenaje, con un plan medido sesión a sesión.",
        detail: ["Radiofrecuencia", "Drenaje", "90 min"],
      },
      {
        art: "consult",
        name: "Valoración personalizada",
        text: "45 minutos para entender tu piel, tus tiempos y tu presupuesto. Sin costo.",
        detail: ["Diagnóstico", "Plan escrito", "45 min"],
      },
    ],
  },

  results: {
    label: "Resultados",
    title: "Antes y después, sin retoques.",
    text:
      "Desliza para comparar. Las imágenes de esta demostración son ilustraciones, no pacientes " +
      "reales: una clínica en operación mostraría aquí sus propios casos, con consentimiento firmado.",
    slider: {
      before: "Antes",
      after: "Después · 8 semanas",
      caption: "Protocolo de rejuvenecimiento · 3 sesiones",
      hint: "Arrastra o usa las flechas del teclado",
    },
    figures: [
      { value: "480", suffix: "+", label: "Pacientes atendidas" },
      { value: "4.9", label: "Calificación promedio" },
      { value: "92", suffix: " %", label: "Regresa para un segundo protocolo" },
    ],
  },

  protocol: {
    label: "Protocolo",
    title: "Cómo trabajamos contigo.",
    text: "Cuatro momentos. Ninguno se salta, y el primero no se cobra.",
    steps: [
      {
        index: "01",
        name: "Valoración",
        text:
          "Revisamos tu piel, escuchamos qué te molesta y qué esperas. Si el tratamiento que " +
          "viniste a buscar no es el indicado, te lo decimos aquí.",
        meta: "45 minutos · sin costo",
      },
      {
        index: "02",
        name: "Plan personalizado",
        text:
          "Recibes por escrito el protocolo completo: sesiones, tiempos, costo total y qué " +
          "resultado es razonable esperar.",
        meta: "Entregado el mismo día",
      },
      {
        index: "03",
        name: "Tratamiento",
        text:
          "Sesiones en consultorio con la misma profesional de principio a fin. Sin sorpresas " +
          "en el precio ni en el procedimiento.",
        meta: "Según protocolo",
      },
      {
        index: "04",
        name: "Seguimiento",
        text:
          "Control a las dos y a las ocho semanas, con fotografía comparativa y ajustes si el " +
          "resultado lo pide.",
        meta: "Incluido en el plan",
      },
    ],
  },

  testimonials: {
    label: "Pacientes",
    title: "Lo que dicen quienes ya vinieron.",
    note: "Testimonios ficticios escritos para esta demostración.",
    /* One long testimonial anchors the composition and three short ones orbit
       it — a wall of equal quotes reads as filler. */
    feature: {
      quote:
        "Llegué pidiendo un tratamiento que había visto en internet y salí con otro, más simple y " +
        "más barato. Me explicaron por qué. Ocho semanas después entiendo la diferencia.",
      name: "Ana Lucía M.",
      detail: "Rejuvenecimiento · 3 sesiones",
      score: "5.0",
      initials: "AL",
    },
    items: [
      {
        quote: "Es la primera vez que salgo de una consulta con el precio total por escrito.",
        name: "Karla R.",
        detail: "Armonización facial",
        score: "5.0",
        initials: "KR",
      },
      {
        quote: "Nadie me notó nada distinto. Solo me preguntaron si había dormido bien. Eso quería.",
        name: "Daniela V.",
        detail: "Rejuvenecimiento",
        score: "4.8",
        initials: "DV",
      },
      {
        quote: "Tres sesiones de láser y por fin dejé de usar base todos los días.",
        name: "Sofía A.",
        detail: "Láser · manchas",
        score: "5.0",
        initials: "SA",
      },
    ],
  },

  nudge: {
    title: "¿No sabes qué tratamiento necesitas?",
    text: "Casi nadie lo sabe la primera vez. Para eso existe la valoración: 45 minutos, sin costo.",
    action: { label: "Agenda una valoración", href: "#reservar" },
  },

  doctor: {
    label: "Equipo",
    name: "Dra. Adriana Solís",
    role: "Directora médica · Medicina estética facial",
    story: [
      "Trabajé nueve años en dermatología clínica antes de dedicarme a la estética, y esa es la " +
      "razón por la que en Velora se dice que no con frecuencia: la mitad de lo que se pide en la " +
      "consulta no hace falta.",
      "Abrí la clínica en 2019 con una regla que no ha cambiado — nadie sale de aquí con un " +
      "tratamiento que no entiende, ni con un precio que no vio antes de empezar.",
    ],
    credentials: [
      "Especialidad en Dermatología · Universidad ficticia",
      "Certificación en medicina estética facial",
      "Miembro de la asociación (ficticia) de estética clínica",
    ],
    disclaimer:
      "Profesional y credenciales ficticios, creados exclusivamente para esta demostración.",
    stats: [
      { value: "9", label: "Años en dermatología" },
      { value: "2019", label: "Velora abre" },
      { value: "1 200", label: "Protocolos dirigidos" },
    ],
  },

  pitch:
    "Esta clínica no existe: es una demostración de CoreStruct. **La reserva, el comparador y la " +
    "agenda sí funcionan** — y así funcionarían con el sistema de tu negocio detrás.",

  cta: {
    title: "Tu mejor versión comienza con una conversación.",
    text:
      "La valoración dura 45 minutos, no cuesta nada y termina con un plan por escrito. " +
      "Decidir después es tu parte.",
    primary: { label: "Reservar mi valoración", href: "#reservar" },
    secondary: { label: "Escribir por WhatsApp", href: "#reservar" },
  },

  footer: {
    address: "Colonia Palmira, Tegucigalpa · Honduras",
    hours: ["Lunes a viernes · 9:00 – 18:00", "Sábado · 9:00 – 13:00"],
    columns: [
      {
        title: "Clínica",
        links: [
          { label: "Tratamientos", href: "#tratamientos" },
          { label: "Protocolo", href: "#protocolo" },
          { label: "Equipo", href: "#equipo" },
        ],
      },
      {
        title: "Citas",
        links: [
          { label: "Reservar", href: "#reservar" },
          { label: "Resultados", href: "#resultados" },
          { label: "Pacientes", href: "#pacientes" },
        ],
      },
    ],
  },
};
