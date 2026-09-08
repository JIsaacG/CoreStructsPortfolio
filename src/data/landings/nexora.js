/**
 * Nexora Group — an invented consulting firm, and the first of the three
 * landing demos.
 *
 * It stands in for every business that sells judgement rather than a product:
 * consultancies, engineering and architecture practices, law and finance
 * advisories, logistics and construction groups. The page therefore has to do
 * what those firms' pages have to do — establish authority in the first screen
 * and make one appointment feel like the obvious next step — without a single
 * photograph of people shaking hands.
 *
 * The copy follows problem → proposal → demonstration → proof → action, and
 * nothing in it is real: the figures, the clients and the cases exist for the
 * demonstration.
 */

export const nexora = {
  slug: "nexora",
  brand: {
    name: "Nexora",
    suffix: "Group",
    mark: "Estrategia · Tecnología · Crecimiento",
    sector: "Consultoría empresarial y transformación digital",
  },

  /* Off-white paper, carbon type, one deep petrol green. The green never
     carries a large surface: it is the index, the rule and the state. */
  theme: { accent: "#12463c", page: "#f6f4ef", ink: "#14161a" },

  nav: [
    { id: "resultados", label: "Resultados" },
    { id: "servicios", label: "Servicios" },
    { id: "metodo", label: "Método" },
    { id: "casos", label: "Casos" },
  ],

  hero: {
    eyebrow: "Estrategia · Tecnología · Crecimiento",
    title: "Transformamos empresas que están listas para avanzar.",
    lead:
      "Alineamos estrategia, procesos y tecnología para convertir organizaciones complejas en " +
      "operaciones más simples, eficientes y escalables.",
    primary: { label: "Solicitar consultoría", href: "#contacto" },
    secondary: { label: "Ver cómo trabajamos", href: "#metodo" },
    /* Read as a caption under the composition: the firm in three numbers. */
    stamps: [
      { value: "24", label: "Transformaciones implementadas" },
      { value: "11", label: "Industrias atendidas" },
      { value: "2016", label: "Operando desde" },
    ],
  },

  /* The visual beside the headline is a reading of one client's operation, not
     an illustration: a load curve, the split between manual and automated work,
     and the four indicators a steering committee actually asks about. */
  panel: {
    label: "Panel de transformación",
    client: "Cliente · Manufactura",
    period: "Ene – Dic",
    series: {
      caption: "Capacidad operativa disponible",
      before: [38, 41, 39, 44, 47, 46, 52, 55, 58, 63, 66, 71],
      after: [38, 44, 50, 58, 64, 71, 76, 80, 84, 88, 91, 94],
    },
    split: [
      { label: "Automatizado", value: 68 },
      { label: "Asistido", value: 22 },
      { label: "Manual", value: 10 },
    ],
    indicators: [
      { label: "Ciclo de pedido", value: "4.2 d", delta: "-46 %", positive: true },
      { label: "Retrabajo", value: "1.8 %", delta: "-62 %", positive: true },
      { label: "Adopción", value: "93 %", delta: "+28 pts", positive: true },
      { label: "Costo por unidad", value: "L 214", delta: "-19 %", positive: true },
    ],
  },

  trust: {
    title: "Equipos que confían en mejores decisiones.",
    note: "Marcas ficticias creadas para esta demostración.",
    /* Each logo is drawn from a shape primitive so six invented companies read
       as six real ones instead of six variations of the same badge. */
    logos: [
      { name: "Halden", kind: "arc" },
      { name: "Coventra", kind: "bars" },
      { name: "Meridia", kind: "diamond" },
      { name: "Klarvo", kind: "ring" },
      { name: "Serrano & Co.", kind: "stack" },
      { name: "Atlantiq", kind: "grid" },
    ],
  },

  results: {
    label: "Resultados",
    title: "Lo que cambia cuando la operación deja de improvisar.",
    text:
      "Promedios de los proyectos cerrados en los últimos tres años, medidos doce meses después " +
      "de la implementación.",
    items: [
      { to: 38, prefix: "+", suffix: "%", display: "+38%", label: "Eficiencia operativa" },
      { to: -52, suffix: "%", display: "-52%", label: "Procesos manuales" },
      { to: 24, prefix: "+", display: "+24", label: "Transformaciones implementadas" },
      { to: 98, suffix: "%", display: "98%", label: "Proyectos entregados según planificación" },
    ],
  },

  services: {
    label: "Servicios",
    title: "Seis frentes, un mismo objetivo: que la operación se sostenga sola.",
    text:
      "No entregamos un diagnóstico y nos vamos. Cada frente termina cuando el equipo del cliente " +
      "puede operarlo sin nosotros.",
    /* `art` names the visualisation drawn inside the card. Six cards, six
       different drawings — a bento grid where every tile is identical is just a
       table with rounded corners. */
    items: [
      {
        art: "compass",
        span: "wide",
        name: "Estrategia empresarial",
        text:
          "Dónde compite la empresa, con qué margen y contra quién. Salimos con tres decisiones " +
          "priorizadas, no con un plan de cien páginas.",
        meta: ["Diagnóstico competitivo", "Modelo de negocio", "Plan a 18 meses"],
      },
      {
        art: "layers",
        name: "Transformación digital",
        text: "El sistema que la operación necesita, elegido por lo que resuelve y no por su marca.",
        meta: ["Arquitectura", "Selección", "Adopción"],
      },
      {
        art: "flow",
        name: "Optimización de procesos",
        text: "Mapeamos el proceso real —no el documentado— y quitamos los pasos que nadie defiende.",
        meta: ["Mapa de valor", "Rediseño", "Estandarización"],
      },
      {
        art: "chart",
        name: "Análisis de datos",
        text: "Un tablero por comité, con las cinco cifras que gobiernan la decisión de esa mesa.",
        meta: ["Modelo de datos", "Indicadores", "Tableros"],
      },
      {
        art: "grid",
        name: "Implementación tecnológica",
        text: "Acompañamos la puesta en marcha: migración, integración y el primer trimestre de operación.",
        meta: ["Migración", "Integración", "Soporte"],
      },
      {
        art: "seat",
        span: "wide",
        name: "Consultoría ejecutiva",
        text:
          "Una silla externa en el comité de dirección. Preparamos la decisión, discutimos el " +
          "riesgo y damos seguimiento a lo acordado.",
        meta: ["Comité mensual", "Preparación de decisiones", "Seguimiento de acuerdos"],
      },
    ],
  },

  shift: {
    label: "Método",
    title: "De procesos complejos a operaciones claras.",
    text:
      "El cambio no ocurre el día de la presentación final. Ocurre en las ocho semanas en las que " +
      "el equipo empieza a trabajar distinto.",
    before: {
      title: "Antes",
      note: "Lo que encontramos el primer día",
      items: [
        "Procesos manuales",
        "Datos dispersos",
        "Falta de visibilidad",
        "Retrasos operativos",
      ],
    },
    bridge: {
      title: "Transformación",
      steps: [
        { stamp: "S 1–2", title: "Diagnóstico", text: "Entrevistas, observación en piso y lectura de los números reales." },
        { stamp: "S 3–4", title: "Rediseño", text: "El proceso objetivo, acordado con quienes lo van a ejecutar." },
        { stamp: "S 5–6", title: "Implementación", text: "Sistemas, reglas y responsables. Se opera en paralelo." },
        { stamp: "S 7–8", title: "Transferencia", text: "El equipo interno queda al mando; nosotros medimos y salimos." },
      ],
    },
    after: {
      title: "Después",
      note: "Lo que queda instalado",
      items: [
        "Procesos automatizados",
        "Información centralizada",
        "Indicadores en tiempo real",
        "Decisiones más rápidas",
      ],
    },
  },

  cases: {
    label: "Casos",
    title: "Tres operaciones, tres problemas distintos.",
    text: "Casos ficticios construidos para esta demostración a partir de proyectos de este tipo.",
    items: [
      {
        sector: "Manufactura",
        company: "Planta de empaque · 340 personas",
        problem:
          "Cada pedido pasaba por cuatro hojas de cálculo y dos personas que las conciliaban de memoria. " +
          "El ciclo de pedido tardaba 7.8 días y nadie sabía dónde se detenía.",
        action:
          "Mapeamos el flujo real, eliminamos once pasos de doble captura y conectamos producción con " +
          "el sistema de pedidos. Un solo registro, un solo dueño por etapa.",
        result: "Ciclo de pedido de 7.8 a 4.2 días, retrabajo del 4.7 % al 1.8 %.",
        metric: { value: "-46", suffix: "%", label: "Ciclo de pedido" },
      },
      {
        sector: "Servicios financieros",
        company: "Financiera regional · 12 sucursales",
        problem:
          "La aprobación de crédito dependía del criterio de cada sucursal. Las carteras no eran " +
          "comparables y el comité decidía con información de dos semanas atrás.",
        action:
          "Estandarizamos el expediente, definimos un modelo de riesgo común y montamos el tablero " +
          "que el comité revisa cada lunes con datos del cierre anterior.",
        result: "Tiempo de aprobación de 9 a 2 días y mora temprana un tercio menor.",
        metric: { value: "-78", suffix: "%", label: "Tiempo de aprobación" },
      },
      {
        sector: "Educación",
        company: "Institución privada · 4 200 estudiantes",
        problem:
          "Admisiones, matrícula y cobranza vivían en tres sistemas que no se hablaban. Cada ciclo " +
          "se perdían aspirantes entre el interés y la inscripción.",
        action:
          "Unificamos el expediente del aspirante de punta a punta y automatizamos el seguimiento " +
          "de los que quedaban a medio proceso.",
        result: "Conversión de aspirante a matriculado del 41 % al 63 %.",
        metric: { value: "+22", suffix: " pts", label: "Conversión a matrícula" },
      },
    ],
  },

  pitch:
    "Esta página es una demostración construida por CoreStruct. **Nexora no existe** — la " +
    "arquitectura, la tipografía y las animaciones que estás viendo, sí.",

  cta: {
    title: "Las empresas no necesitan más complejidad. Necesitan mejores sistemas.",
    text:
      "Una conversación de 45 minutos basta para saber si hay un problema que vale la pena resolver. " +
      "Si no lo hay, lo decimos.",
    primary: { label: "Hablemos de tu empresa", href: "#contacto" },
    fields: [
      { name: "nombre", label: "Nombre", type: "text", autocomplete: "name" },
      { name: "empresa", label: "Empresa", type: "text", autocomplete: "organization" },
      { name: "correo", label: "Correo corporativo", type: "email", autocomplete: "email" },
    ],
    focus: {
      label: "¿Qué quieres resolver?",
      options: ["Estrategia", "Procesos", "Tecnología", "Datos", "Aún no lo sé"],
    },
    submit: "Solicitar consultoría",
    disclaimer:
      "Formulario de demostración: no envía información a ningún servidor ni guarda lo que escribes.",
  },

  footer: {
    lines: ["Tegucigalpa · San Pedro Sula", "Consultoría empresarial y transformación digital"],
    columns: [
      { title: "Firma", links: [
        { label: "Servicios", href: "#servicios" },
        { label: "Método", href: "#metodo" },
      ] },
      { title: "Trabajo", links: [
        { label: "Resultados", href: "#resultados" },
        { label: "Casos", href: "#casos" },
        { label: "Contacto", href: "#contacto" },
      ] },
    ],
  },
};
