/**
 * The home page's own copy.
 *
 * Sections that exist only here — the hero, the introduction, the four pillars,
 * the methodology and the closing call to action. Everything else on the home
 * page is a projection of `services`, `industries`, `projects` or `insights`,
 * so a change to a service reaches the home page without being written twice.
 */

export const hero = {
  eyebrow: "Grupo de ingeniería, tecnología y operación",
  /* Three lines, raised one after the other by the shared reveal system. */
  lines: ["Diseñamos, construimos", "y operamos infraestructura", "que no puede detenerse."],
  lead:
    "Aurelis integra ingeniería, construcción y operación bajo un solo responsable: " +
    "desde el estudio de factibilidad hasta el mantenimiento del activo, con un " +
    "compromiso medible sobre disponibilidad, costo y plazo.",
  actions: [
    { label: "Conocer nuestras soluciones", route: "servicios", solid: true },
    { label: "Hablar con nuestro equipo", route: "contacto" },
  ],
  cue: "Desplácese",
  plate: "plant",
};

export const clientsTitle = "Empresas que confían en nuestra experiencia";

export const intro = {
  label: "La compañía",
  title: "Experiencia que convierte desafíos operativos en resultados medibles",
  body: [
    "Veintiocho años trabajando en instalaciones donde una hora de parada tiene un precio " +
      "conocido. Esa restricción define cómo diseñamos, cómo construimos y cómo escribimos " +
      "un contrato.",
    "Operamos desde cinco oficinas permanentes y damos servicio en doce mercados, con " +
      "ingeniería propia, taller propio y un centro de control que vigila los activos que " +
      "mantenemos de forma continua.",
  ],
  action: { label: "Conocer Aurelis", route: "empresa" },
};

export const pillars = {
  label: "Por qué Aurelis",
  title: "Cuatro razones que se pueden verificar",
  text:
    "No son valores de marca. Son las cuatro cosas que un cliente puede comprobar antes " +
    "de firmar y auditar después.",
  items: [
    {
      index: "01",
      title: "Experiencia",
      text:
        "350 proyectos ejecutados desde 1998, en industria, energía, infraestructura y " +
        "logística. Las referencias se entregan con nombre, alcance y contacto, no como " +
        "una lista de logotipos.",
    },
    {
      index: "02",
      title: "Precisión",
      text:
        "Cada propuesta parte de una línea base medida en sitio. Si el dato no existe, se " +
        "levanta antes de cotizar; ningún compromiso se asume sobre una estimación heredada.",
    },
    {
      index: "03",
      title: "Escalabilidad",
      text:
        "La misma estructura atiende una intervención de tres semanas y un programa " +
        "multipaís de tres años, porque la ingeniería, el taller y la operación son " +
        "capacidades internas y no subcontratos encadenados.",
    },
    {
      index: "04",
      title: "Acompañamiento",
      text:
        "El equipo que diseña participa en la puesta en marcha. No existe la entrega por " +
        "encima del muro: quien firmó el cálculo responde por cómo se comporta en operación.",
    },
  ],
};

export const method = {
  label: "Metodología",
  title: "De la estrategia a la ejecución",
  text:
    "Cuatro etapas con un entregable cerrado cada una. El cliente puede detener el " +
    "programa al final de cualquiera de ellas y quedarse con algo que sirve por sí solo.",
  steps: [
    {
      index: "01",
      title: "Entender",
      text: "Medición en sitio, revisión del expediente y entrevistas con quien opera el activo.",
      out: "Entregable · Diagnóstico con línea base",
    },
    {
      index: "02",
      title: "Diseñar",
      text: "Alternativas costeadas con su riesgo y su plazo, y la ingeniería de la opción elegida.",
      out: "Entregable · Ingeniería y presupuesto cerrado",
    },
    {
      index: "03",
      title: "Implementar",
      text: "Construcción, montaje o despliegue, con corte de avance semanal verificado en sitio.",
      out: "Entregable · Activo probado y documentado",
    },
    {
      index: "04",
      title: "Optimizar",
      text: "Operación asistida, indicadores en régimen y una mejora comprometida por trimestre.",
      out: "Entregable · Reporte de desempeño trimestral",
    },
  ],
};

export const atlas = {
  label: "Presencia internacional",
  title: "Capacidad global. Atención local.",
  text:
    "Cinco oficinas permanentes y operación en doce mercados. El equipo que atiende un " +
    "contrato está en el mismo huso horario que la planta.",
  note:
    "Los puntos marcan oficinas permanentes. La operación de proyecto alcanza doce mercados " +
    "en América y Europa.",
  legend: ["Oficina permanente", "Taller propio en Tegucigalpa y Ciudad de México"],
};

export const testimonials = {
  label: "Clientes",
  title: "Lo que dicen quienes ya firmaron",
  items: [
    {
      text:
        "Su equipo entendió nuestra operación antes de proponer una sola solución. Esa " +
        "diferencia se notó después, cuando hubo que decidir con la planta detenida.",
      name: "Elena Vargas Sosa",
      role: "Directora de Operaciones",
      org: "Transandina Logística",
    },
    {
      text:
        "Nos recomendaron gastar menos de lo que teníamos aprobado. No es la respuesta que " +
        "esperábamos de un contratista y es la razón por la que seguimos trabajando con ellos.",
      name: "Rodrigo Peña Ibarra",
      role: "Gerente de Infraestructura",
      org: "Grupo Meridian",
    },
    {
      text:
        "Ensayaron la maniobra con nuestra propia gente antes de ejecutarla. Cuando llegó la " +
        "noche del corte, nadie estaba improvisando.",
      name: "Carla Mejía Fonseca",
      role: "Jefa de Subestaciones",
      org: "Norvik Energía",
    },
  ],
};

export const cta = {
  title: "Conversemos sobre su próximo desafío",
  text:
    "Nuestro equipo puede ayudarle a identificar la solución más adecuada para su " +
    "organización, incluso si el resultado del análisis es que no hace falta un proyecto.",
  actions: [
    { label: "Hablar con un especialista", route: "contacto", solid: true },
    { label: "Solicitar información", route: "contacto", hash: "formulario" },
  ],
};

/** The section index printed in every label: `01 / 12  LA COMPAÑÍA`. */
export const sectionOrder = [
  "clientes",
  "compania",
  "soluciones",
  "industrias",
  "caso",
  "razones",
  "metodologia",
  "certificaciones",
  "presencia",
  "testimonios",
  "recursos",
  "contacto",
];
