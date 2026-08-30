/**
 * Newsroom: institutional news, the calendar and the knowledge centre.
 *
 * The register is deliberately dry. An institution that coordinates and
 * publishes information writes about sessions, methodologies and agreements —
 * not about achievements, leadership or milestones. There are no officials in
 * these articles and no adjectives of merit: what happened, who took part, what
 * it produces and where to read it.
 *
 * All of it is invented for the demonstration.
 */

export const newsCategories = [
  { id: "consejo", name: "Consejo" },
  { id: "datos", name: "Datos e información" },
  { id: "politica", name: "Política educativa" },
  { id: "participacion", name: "Participación" },
  { id: "tecnica", name: "Educación técnica" },
  { id: "docente", name: "Formación docente" },
];

/**
 * Eight articles. The first is the lead of the newsroom and of the home page.
 *
 * `body` is written as paragraphs separated by a blank line; the renderer turns
 * each into a `<p>`, so the data file never contains markup.
 */
export const articles = [
  {
    slug: "agenda-nacional-de-informacion-educativa",
    category: "datos",
    date: "2026-08-26",
    lead: true,
    title: "Instituciones educativas coordinan una nueva agenda nacional de información",
    summary:
      "Las entidades que integran el sistema acordaron un calendario común de levantamiento y " +
      "publicación estadística, con fechas de corte únicas para todos los reportantes.",
    reading: 4,
    body:
      "Las instituciones que integran el sistema educativo acordaron un calendario único de " +
      "levantamiento, validación y publicación de estadísticas educativas. Hasta ahora cada " +
      "instancia reportaba en fechas propias, lo que impedía comparar cifras del mismo año sin " +
      "advertencias metodológicas en cada tabla.\n\n" +
      "El acuerdo fija tres momentos: una fecha de corte de matrícula común, una ventana de " +
      "validación cruzada entre registros y una fecha única de publicación. La Secretaría " +
      "Técnica del Consejo asume la consolidación y publica las series con su documentación " +
      "metodológica en el catálogo de datos abiertos.\n\n" +
      "El calendario entra en vigencia con el levantamiento del presente año lectivo. Las " +
      "series anteriores se mantienen publicadas sin cambios, con una nota que indica la " +
      "diferencia de criterio para quien necesite compararlas.",
    related: ["metodologia-seguimiento-indicadores", "serie-estadistica-2026"],
  },
  {
    slug: "metodologia-seguimiento-indicadores",
    category: "datos",
    date: "2026-08-14",
    title: "Presentan la metodología para el seguimiento de indicadores educativos",
    summary:
      "El documento define fórmula, fuente, periodicidad y limitaciones de cada indicador del " +
      "sistema nacional, y queda disponible para consulta pública.",
    reading: 3,
    body:
      "El manual metodológico de indicadores educativos quedó disponible en la biblioteca " +
      "digital. Para cada indicador el documento establece su definición, la fórmula de " +
      "cálculo, la fuente de la que se alimenta, su periodicidad, las desagregaciones " +
      "obligatorias y —de forma explícita— lo que el indicador no permite afirmar.\n\n" +
      "La última sección es la menos habitual y la más importante: las limitaciones. Un " +
      "indicador de cobertura depende de la proyección de población usada como denominador, y " +
      "una tasa de deserción depende de que los traslados entre centros estén registrados. " +
      "Publicar esas condiciones junto a la cifra es lo que permite discutirla.\n\n" +
      "El manual se somete a observaciones técnicas durante sesenta días antes de su adopción " +
      "definitiva.",
    related: ["agenda-nacional-de-informacion-educativa", "serie-estadistica-2026"],
  },
  {
    slug: "espacio-de-dialogo-articulacion",
    category: "participacion",
    date: "2026-07-29",
    title: "Un nuevo espacio de diálogo fortalece la articulación del sistema educativo",
    summary:
      "La mesa técnica permanente reúne a representantes de educación pública, superior, " +
      "formación profesional, gobiernos locales y sociedad civil cuatro veces al año.",
    reading: 3,
    body:
      "Quedó instalada la mesa técnica permanente de articulación del sistema educativo, un " +
      "espacio de trabajo con calendario fijo y actas públicas. Reúne a las representaciones " +
      "de educación pública, educación superior, formación profesional, gobiernos locales, " +
      "sector productivo, docentes y sociedad civil.\n\n" +
      "La mesa no adopta decisiones vinculantes: prepara los expedientes técnicos que el " +
      "Consejo somete después a votación, y deja constancia de las posiciones que no lograron " +
      "consenso. Esa constancia se publica junto con el acta.\n\n" +
      "El primer ciclo de trabajo abordará la transición entre educación básica y media, el " +
      "punto donde el sistema pierde a más estudiantes.",
    related: ["consulta-educacion-tecnica", "sesion-ordinaria-agosto"],
  },
  {
    slug: "desafios-educacion-tecnica",
    category: "tecnica",
    date: "2026-07-10",
    title: "Especialistas analizan los desafíos de la educación técnica",
    summary:
      "Un foro técnico revisó la correspondencia entre la oferta formativa vigente y las " +
      "competencias que declara requerir el sector productivo.",
    reading: 4,
    body:
      "El foro técnico sobre educación técnica y profesional reunió a especialistas de " +
      "universidades, centros de formación y empresas para revisar la vigencia del catálogo de " +
      "familias profesionales.\n\n" +
      "La discusión se concentró en tres puntos: la velocidad con que envejecen los perfiles de " +
      "egreso en informática y energía, la dificultad de sostener talleres equipados fuera de " +
      "los grandes centros urbanos, y la falta de un seguimiento sistemático de la inserción " +
      "laboral de las personas egresadas.\n\n" +
      "Las conclusiones del foro se incorporan al expediente de los lineamientos de educación " +
      "técnica, actualmente en consulta pública.",
    related: ["consulta-educacion-tecnica", "familias-profesionales-actualizadas"],
  },
  {
    slug: "consulta-educacion-tecnica",
    category: "participacion",
    date: "2026-07-06",
    title: "Abierta la consulta pública sobre los lineamientos de educación técnica",
    summary:
      "El período de consulta permanece abierto hasta el 30 de septiembre y admite " +
      "observaciones de personas, centros educativos y organizaciones.",
    reading: 2,
    body:
      "El Consejo abrió el período de consulta pública sobre los lineamientos para el " +
      "fortalecimiento de la educación técnica. Cualquier persona, centro educativo u " +
      "organización puede presentar observaciones a través del formulario habilitado.\n\n" +
      "El expediente de la consulta incluye el borrador completo de los lineamientos, la nota " +
      "técnica que los fundamenta y el cronograma del proceso. Al cierre se publicará un " +
      "informe con todas las observaciones recibidas y la respuesta razonada a cada una, " +
      "indicando cuáles se incorporaron al texto final y por qué.\n\n" +
      "El plazo de consulta se amplió veinte días respecto de lo previsto inicialmente, a " +
      "solicitud de organizaciones territoriales.",
    related: ["desafios-educacion-tecnica", "espacio-de-dialogo-articulacion"],
  },
  {
    slug: "serie-estadistica-2026",
    category: "datos",
    date: "2026-08-20",
    title: "Publicada la serie estadística educativa 2026",
    summary:
      "La serie completa del año lectivo queda disponible en el observatorio y en el catálogo " +
      "de datos abiertos, en formatos reutilizables.",
    reading: 2,
    body:
      "La serie estadística del año lectivo 2026 está publicada. Incluye matrícula, centros " +
      "educativos, personal docente e indicadores de cobertura, permanencia e infraestructura, " +
      "con desagregación por nivel, sexo, área, administración y departamento.\n\n" +
      "Como toda serie del sistema, se publica simultáneamente en tres lugares: el observatorio " +
      "para consultarla, el catálogo de datos abiertos para descargarla y la biblioteca " +
      "digital para citarla junto a su documentación metodológica.\n\n" +
      "Los conjuntos están disponibles en CSV, XLSX y JSON, con licencia abierta y diccionario " +
      "de variables.",
    related: ["agenda-nacional-de-informacion-educativa", "metodologia-seguimiento-indicadores"],
  },
  {
    slug: "sesion-ordinaria-agosto",
    category: "consejo",
    date: "2026-08-06",
    title: "El Consejo aprueba en sesión ordinaria la publicación de la serie 2026",
    summary:
      "La sesión resolvió además ampliar el plazo de la consulta sobre educación técnica y " +
      "aprobó el informe semestral de avance del plan nacional.",
    reading: 2,
    body:
      "En su octava sesión ordinaria del año, el Consejo adoptó tres resoluciones: la " +
      "publicación de la serie estadística 2026, la ampliación del plazo de consulta pública " +
      "sobre educación técnica y la aprobación del informe semestral de avance del Plan " +
      "Nacional de Transformación Educativa.\n\n" +
      "El informe de avance registra diecisiete de los cuarenta y seis hitos previstos para el " +
      "primer tramo del plan y señala dos ejes con avance por debajo de lo programado: " +
      "inclusión y equidad, y transformación digital.\n\n" +
      "El acta de la sesión y las tres resoluciones están disponibles en el registro público de " +
      "resoluciones y acuerdos.",
    related: ["serie-estadistica-2026", "informe-avance-plan"],
  },
  {
    slug: "informe-avance-plan",
    category: "politica",
    date: "2026-07-24",
    title: "El informe semestral de avance del plan nacional registra 17 hitos alcanzados",
    summary:
      "El tablero público del plan actualiza el avance de los cinco ejes y detalla los dos que " +
      "requieren atención en el segundo semestre.",
    reading: 3,
    body:
      "El informe semestral de avance del Plan Nacional de Transformación Educativa 2026–2035 " +
      "registra diecisiete hitos alcanzados de los cuarenta y seis previstos para el primer " +
      "tramo, y un avance global del 34,6 %.\n\n" +
      "Gobernanza y transparencia es el eje con mayor avance, sostenido por la publicación del " +
      "catálogo de datos abiertos y la generalización de la consulta previa. Inclusión y " +
      "equidad y transformación digital avanzan por debajo de lo programado: en el primer caso " +
      "por el ritmo de las obras de accesibilidad, y en el segundo porque la conectividad " +
      "contratada no siempre se traduce en conectividad operativa.\n\n" +
      "El tablero del plan se actualiza con cada informe y permite seguir cada objetivo hasta " +
      "su indicador y su meta.",
    related: ["sesion-ordinaria-agosto", "espacio-de-dialogo-articulacion"],
  },
  {
    slug: "familias-profesionales-actualizadas",
    category: "tecnica",
    date: "2026-07-16",
    title: "Actualizados los perfiles de egreso de tres familias profesionales",
    summary:
      "Informática, energía y salud incorporan perfiles revisados con participación del sector " +
      "productivo y de los centros que imparten la oferta.",
    reading: 2,
    body:
      "El Consejo aprobó la actualización de los perfiles de egreso de tres familias " +
      "profesionales del catálogo nacional: informática y desarrollo digital, energía y " +
      "mantenimiento, y salud y cuidados.\n\n" +
      "La revisión se realizó con los centros que imparten la oferta y con representantes del " +
      "sector productivo, y modifica competencias específicas sin alterar la duración ni la " +
      "titulación de las carreras.\n\n" +
      "Los centros disponen de un año lectivo completo para adecuar sus programas, con " +
      "acompañamiento técnico durante el período de transición.",
    related: ["desafios-educacion-tecnica", "consulta-educacion-tecnica"],
  },
];

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

/* ------------------------------------------------------------------ agenda */

export const eventKinds = [
  { id: "sesion", name: "Sesión" },
  { id: "foro", name: "Foro" },
  { id: "consulta", name: "Consulta" },
  { id: "presentacion", name: "Presentación" },
  { id: "mesa", name: "Mesa técnica" },
];

/**
 * The institutional calendar.
 *
 * Ordered by date; the interface marks anything before the portal's reference
 * date as held and anything after it as upcoming.
 */
export const events = [
  { date: "2026-09-03", kind: "mesa", title: "Mesa técnica de articulación · segunda sesión", place: "Sede del Consejo · Tegucigalpa", text: "Transición entre educación básica y media: revisión del expediente técnico." },
  { date: "2026-09-10", kind: "sesion", title: "Sesión ordinaria 09/2026 del Consejo", place: "Sede del Consejo · Tegucigalpa", text: "Orden del día: informe de conectividad, ajustes al catálogo de datos abiertos." },
  { date: "2026-09-18", kind: "foro", title: "Foro nacional de educación técnica", place: "San Pedro Sula, Cortés", text: "Presentación de las conclusiones del foro técnico y discusión con centros formativos." },
  { date: "2026-09-30", kind: "consulta", title: "Cierre de la consulta sobre educación técnica", place: "En línea", text: "Último día para presentar observaciones a los lineamientos en consulta." },
  { date: "2026-10-08", kind: "presentacion", title: "Presentación del boletín estadístico semestral", place: "En línea", text: "Lectura de los principales movimientos de las series del primer semestre." },
  { date: "2026-10-22", kind: "mesa", title: "Mesa territorial · Occidente", place: "Santa Rosa de Copán, Copán", text: "Focalización de la inversión educativa en los territorios con mayor brecha." },
  { date: "2026-11-12", kind: "sesion", title: "Sesión ordinaria 11/2026 del Consejo", place: "Sede del Consejo · Tegucigalpa", text: "Orden del día: evaluación nacional de aprendizajes y calendario 2027." },
  { date: "2026-08-06", kind: "sesion", title: "Sesión ordinaria 08/2026 del Consejo", place: "Sede del Consejo · Tegucigalpa", text: "Serie estadística 2026, ampliación de consulta e informe semestral del plan.", held: true },
];

/* -------------------------------------------------------- knowledge centre */

/**
 * The knowledge centre.
 *
 * Where the analysis lives, as distinct from the news: pieces that argue
 * something and cite the series they argue it from.
 */
export const knowledge = [
  {
    slug: "brechas-territoriales",
    kind: "Investigación",
    theme: "Inclusión y equidad",
    date: "2026-06-30",
    title: "Brechas territoriales y oportunidades para ampliar el acceso educativo",
    summary:
      "La cobertura de educación media no se detiene por igual en todo el país: se detiene " +
      "donde la oferta local termina en noveno grado. El estudio ordena los territorios por " +
      "esa condición y estima el efecto de tres intervenciones posibles.",
    reading: 12,
  },
  {
    slug: "educacion-tecnica-competencias",
    kind: "Investigación",
    theme: "Educación técnica",
    date: "2026-05-14",
    title: "Educación técnica y nuevas competencias para el empleo",
    summary:
      "Contrasta las familias profesionales vigentes con la demanda declarada por el sector " +
      "productivo y propone un criterio de actualización que no dependa de revisiones " +
      "excepcionales.",
    reading: 10,
  },
  {
    slug: "futuro-profesion-docente",
    kind: "Estudio prospectivo",
    theme: "Formación docente",
    date: "2026-04-22",
    title: "El futuro de la profesión docente",
    summary:
      "Qué cambia en la enseñanza cuando la mitad del personal docente se renueva en una " +
      "década: formación inicial, inducción, carrera y condiciones de ejercicio.",
    reading: 14,
  },
  {
    slug: "transicion-basica-media",
    kind: "Estudio de cohorte",
    theme: "Permanencia",
    date: "2025-08-28",
    title: "La transición de básica a media: dónde se pierde el sistema",
    summary:
      "Sigue una cohorte completa desde primer grado y localiza, año por año y territorio por " +
      "territorio, el momento exacto en que se produce la salida.",
    reading: 11,
  },
];
