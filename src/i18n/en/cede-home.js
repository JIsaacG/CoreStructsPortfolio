/**
 * English for the CEDE demo — the methodology page, the back office and the
 * home page's illustrated sections.
 *
 * The methodology page carries the portal's best line: "Una cifra sin su método
 * es una opinión con decimales." It is an epigram and it has to survive as one;
 * a literal rendering loses the joke and the joke is the argument.
 *
 * The home page's five plates are described rather than photographed, and each
 * description explains why the drawing is drawn the way it is. Those captions
 * are about the illustration, not about the data, and the English keeps that
 * distinction.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/cede";

export default {
  /* ------------------------------------------------------- transition rate */

  "(Nuevos matriculados en primer curso de media en el año t ÷ aprobados del último grado de básica en el año t−1) × 100.":
    "(New enrolments in the first year of upper secondary in year t ÷ students passing the final " +
    "grade of basic education in year t−1) × 100.",
  "Es el punto de fuga más grande del sistema: mide el salto entre dos niveles que muchas veces no están en la misma comunidad.":
    "It is the system's biggest leak: it measures the jump between two levels that are often not in " +
    "the same community.",
  "No captura a quienes se matriculan tras una interrupción de más de un año lectivo.":
    "It does not capture students who enrol after a break of more than one school year.",

  /* ----------------------------------------------------------- methodology */

  "Cómo se produce la información que publica el Consejo.":
    "How the information the Council publishes is produced.",
  "Fuente, validación, periodicidad, desagregaciones, limitaciones y diccionario de variables. Una cifra sin su método es una opinión con decimales.":
    "Source, validation, frequency, disaggregations, limitations and the variable dictionary. A " +
    "figure without its method is an opinion with decimal places.",
  "Las series del portal se construyen sobre tres tipos de fuente: el registro administrativo de matrícula y centros, el registro de personal docente, y las proyecciones de población que sirven de denominador a las tasas de cobertura. Cada indicador declara de cuál de las tres proviene.":
    "The portal's series are built on three kinds of source: the administrative register of " +
    "enrolment and schools, the teaching staff register, and the population projections that serve " +
    "as the denominator of the coverage rates. Every indicator states which of the three it comes " +
    "from.",
  "En esta demostración las tres son simuladas. En un despliegue real, cada una corresponde a un sistema institucional distinto, con su propio responsable y su propio calendario de cierre.":
    "In this demonstration all three are simulated. In a real deployment each belongs to a different " +
    "institutional system, with its own owner and its own closing calendar.",
  "La cartografía es la excepción: los límites de los dieciocho departamentos son reales y provienen de geoBoundaries (gbOpen, ADM1), publicados bajo licencia CC BY 4.0. Se usan tal cual, proyectados y simplificados para pantalla; todo lo que se pinta sobre ellos es demostrativo.":
    "The mapping is the exception: the boundaries of the eighteen departments are real and come from " +
    "geoBoundaries (gbOpen, ADM1), published under a CC BY 4.0 licence. They are used as they are, " +
    "projected and simplified for screen; everything painted on top of them is illustrative.",
  Validación: "Validation",
  "Antes de publicarse, cada serie pasa por tres controles: consistencia interna (las desagregaciones suman el total), consistencia temporal (ninguna variación anual queda sin explicación documentada) y cruce entre registros (matrícula contra directorio de centros, y centros contra personal docente).":
    "Before publication, every series passes three checks: internal consistency (the disaggregations " +
    "sum to the total), consistency over time (no year-on-year change is left without a documented " +
    "explanation) and cross-checking between registers (enrolment against the school directory, and " +
    "schools against teaching staff).",
  "Cuando un control falla, la serie no se publica: se publica la nota que explica por qué no está.":
    "When a check fails, the series is not published: what is published is the note explaining why " +
    "it is not there.",
  "El levantamiento es anual y sigue el calendario aprobado por el Consejo: fecha de corte única para todos los reportantes, ventana de validación cruzada y fecha única de publicación. Los boletines semestrales no abren series nuevas: comentan las existentes.":
    "Collection is annual and follows the calendar the Council approves: a single cut-off date for " +
    "every reporting organisation, a cross-validation window and a single publication date. The " +
    "half-yearly bulletins open no new series: they comment on the existing ones.",
  "Toda cifra nacional se publica desagregada por nivel educativo, sexo, área, administración y departamento, y —cuando la fuente lo permite— por jornada y modalidad. Un promedio nacional que no puede desagregarse territorialmente no informa sobre un país con las diferencias del nuestro.":
    "Every national figure is published disaggregated by education level, sex, area, administration " +
    "and department, and — where the source allows — by session and route. A national average that " +
    "cannot be broken down territorially tells you nothing about a country as uneven as this one.",
  "Las tasas de cobertura dependen de la proyección de población usada como denominador: un cambio de proyección mueve el indicador sin que se haya movido la matrícula. Las tasas de permanencia dependen del registro de traslados entre centros. Los indicadores de infraestructura se construyen sobre declaración del centro, con verificación muestral posterior.":
    "The coverage rates depend on the population projection used as the denominator: changing the " +
    "projection moves the indicator without enrolment having moved. The retention rates depend on " +
    "the register of transfers between schools. The infrastructure indicators are built on what the " +
    "school reports, with sample verification afterwards.",
  "Estas limitaciones se publican junto a cada indicador, no en una nota al pie.":
    "These limitations are published next to each indicator, not in a footnote.",
  "Cada conjunto de datos se publica con su diccionario: nombre de la variable, tipo, unidad, valores admitidos y tratamiento de los datos faltantes. El diccionario forma parte de la descarga, no de una página aparte.":
    "Every dataset is published with its dictionary: variable name, type, unit, permitted values and " +
    "how missing data is handled. The dictionary is part of the download, not of a separate page.",
  "Cada variable, su tipo y su tratamiento.": "Every variable, its type and its handling.",
  "El diccionario forma parte de cada descarga, no de una página aparte: un archivo sin diccionario obliga a adivinar.":
    "The dictionary is part of every download, not of a separate page: a file without one forces you " +
    "to guess.",
  "Diccionario de variables de los conjuntos de datos del portal.":
    "Variable dictionary for the portal's datasets.",
  "Año lectivo de referencia.": "The school year the record refers to.",
  "18 códigos de dos letras": "18 two-letter codes",
  "Código territorial del portal.": "The portal's territorial code.",
  "Sexo registrado en la matrícula.": "Sex as recorded at enrolment.",
  "Área del centro educativo.": "The school's area.",
  "Régimen del centro.": "The school's status.",
  "Según indicador": "Depends on the indicator",
  "Vacío cuando el dato no está disponible; nunca cero por defecto.":
    "Empty when the figure is unavailable; never zero by default.",

  /* ------------------------------------------------------ the integration */

  "Capa de integración": "Integration layer",
  "Dónde se conecta un sistema real.": "Where a real system plugs in.",
  "Esta demostración calcula sus cifras en el navegador. La arquitectura está preparada para que cada una venga de su fuente institucional.":
    "This demonstration works its figures out in the browser. The architecture is ready for each of " +
    "them to come from its institutional source instead.",
  "Registro de matrícula y centros": "Enrolment and school register",
  "El módulo de estadísticas expone una sola función de consulta. Sustituirla por una llamada al servicio institucional de matrícula deja intactos los tableros, el mapa, los filtros, las tablas y las descargas.":
    "The statistics module exposes a single query function. Replacing it with a call to the " +
    "institutional enrolment service leaves the dashboards, the map, the filters, the tables and the " +
    "downloads untouched.",
  "Proyecciones de población": "Population projections",
  "Las tasas de cobertura necesitan un denominador demográfico. La integración correspondiente es un servicio de proyecciones por edad simple y territorio.":
    "The coverage rates need a demographic denominator. The integration for that is a projection " +
    "service by single year of age and territory.",
  "Registro de personal docente": "Teaching staff register",
  "La relación estudiante/docente y la formación acreditada se alimentan del sistema de personal, no del registro escolar.":
    "The student–teacher ratio and the accreditation figures are fed by the staff system, not by the " +
    "school register.",
  "Gestor de contenidos": "Content management",
  "Noticias, documentos, normativa, datasets, indicadores, eventos y consultas están modelados como colecciones, listas para administrarse desde un CMS sin tocar código.":
    "News, documents, regulations, datasets, indicators, events and consultations are modelled as " +
    "collections, ready to be administered from a CMS without touching any code.",

  /* ------------------------------------------------------------ the backoffice */

  'CEDE · Gestión de contenidos <span class="cd-admin__tag">Backoffice demostrativo</span>':
    'CEDE · Content management <span class="cd-admin__tag">Demonstration back office</span>',
  'Colecciones administrables <span class="cd-note">Sin tocar código</span>':
    'Editable collections <span class="cd-note">Without touching code</span>',
  "Sesión de demostración · no hay datos reales":
    "Demonstration session · no real data",
  "Secciones de gestión": "Management sections",
  Operación: "Operations",
  "Portal público": "Public portal",
  "Ver el portal": "View the portal",
  "Panel de gestión": "Management dashboard",
  "Nueva publicación": "New publication",
  "Backoffice demostrativo. Ninguna acción de esta pantalla modifica contenido: existe para mostrar que el portal público y las herramientas para operarlo son parte del mismo producto.":
    "A demonstration back office. Nothing on this screen changes any content: it exists to show that " +
    "the public portal and the tools for running it are part of the same product.",
  "Pendientes de revisión": "Awaiting review",
  "Dos noticias, un informe": "Two news items, one report",
  "Series de datos activas": "Active data series",
  "Última carga: 20 ago": "Last upload: 20 Aug",
  "Usuarios con acceso": "Users with access",
  "Secretaría del Consejo": "Council Secretariat",
  "publicó la noticia «Instituciones educativas coordinan una nueva agenda nacional de información».":
    "published the story “Education institutions agree a new national information agenda”.",
  "publicó la serie estadística 2026 y actualizó 8 conjuntos de datos.":
    "published the 2026 statistical series and updated 8 datasets.",
  "validó el cruce de matrícula contra el directorio de centros.":
    "validated the enrolment cross-check against the school directory.",
  "cargó el manual metodológico de indicadores (v1.2).":
    "uploaded the methodological manual of indicators (v1.2).",
  "registró tres resoluciones de la sesión 08/2026.":
    "recorded three resolutions from session 08/2026.",
  "amplió el plazo de la consulta CP-2026-04 en veinte días.":
    "extended consultation CP-2026-04 by twenty days.",
  "Perfiles de usuario": "User profiles",
  "Gestión total del portal y de los usuarios": "Full control of the portal and its users",
  "Series estadísticas, indicadores y datos abiertos":
    "Statistical series, indicators and open data",
  "Solo lectura y descarga de informes": "Read-only, with report downloads",

  /* ------------------------------------------------------ the consultation steps */

  '<span class="cd-steps__date">6 jul 2026</span><span class="cd-steps__label">Apertura del período de observaciones</span>':
    '<span class="cd-steps__date">6 Jul 2026</span><span class="cd-steps__label">Submissions ' +
    "open</span>",
  '<span class="cd-steps__date">6 ago 2026</span><span class="cd-steps__label">Ampliación del plazo por resolución del Consejo</span>':
    '<span class="cd-steps__date">6 Aug 2026</span><span class="cd-steps__label">Deadline extended ' +
    "by Council resolution</span>",
  '<span class="cd-steps__date">18 sep 2026</span><span class="cd-steps__label">Foro nacional de educación técnica</span>':
    '<span class="cd-steps__date">18 Sep 2026</span><span class="cd-steps__label">National ' +
    "technical education forum</span>",
  '<span class="cd-steps__date">30 sep 2026</span><span class="cd-steps__label">Cierre del período de observaciones</span>':
    '<span class="cd-steps__date">30 Sep 2026</span><span class="cd-steps__label">Submissions ' +
    "close</span>",
  '<span class="cd-steps__date">15 nov 2026</span><span class="cd-steps__label">Publicación del informe de respuestas razonadas</span>':
    '<span class="cd-steps__date">15 Nov 2026</span><span class="cd-steps__label">Reasoned response ' +
    "report published</span>",

  /* --------------------------------------------------------------- the home */

  "Articulamos instituciones, información y políticas para fortalecer un sistema educativo más inclusivo, transparente y preparado para el futuro.":
    "We bring institutions, information and policy together to build an education system that is " +
    "more inclusive, more transparent and readier for what comes next.",
  "Conocer la política educativa": "Read the education policy",
  "Mapa de Honduras con sus dieciocho departamentos, ilustración del portal":
    "Map of Honduras with its eighteen departments, the portal's illustration",
  '<span>Sistema Nacional de Información y Política Educativa</span> <span class="cd-demo cd-demo--onDark">Entidad ficticia · no es un sitio oficial</span>':
    "<span>National Education Information and Policy System</span> " +
    '<span class="cd-demo cd-demo--onDark">Fictional entity · not an official site</span>',
  '<span>18 departamentos · 298 municipios</span><span>Geometría oficial de referencia · datos ilustrativos</span>':
    "<span>18 departments · 298 municipalities</span><span>Official reference geometry · " +
    "illustrative data</span>",

  "Seis puertas de entrada al sistema educativo.":
    "Six ways into the education system.",
  "Cada sección responde a una necesidad concreta. Si sabe qué busca, este índice lo lleva en un clic; si no, el observatorio es el mejor punto de partida.":
    "Each section answers a specific need. If you know what you are looking for, this index gets you " +
    "there in one click; if you do not, the observatory is the best place to start.",
  "Datos educativos: ilustración de la sección": "Education data: section illustration",
  "Política educativa: ilustración de la sección": "Education policy: section illustration",
  "Plan estratégico: ilustración de la sección": "Strategic plan: section illustration",
  "Normativa: ilustración de la sección": "Regulations: section illustration",
  "Biblioteca: ilustración de la sección": "Library: section illustration",
  "Participación: ilustración de la sección": "Participation: section illustration",
  "Plan estratégico": "Strategic plan",
  "Diez tableros y dieciocho territorios, con series desde 2019.":
    "Ten dashboards and eighteen territories, with series going back to 2019.",
  "El marco que orienta las decisiones del sistema.":
    "The framework that guides the system's decisions.",
  "Plan Nacional 2026–2035 y su monitor público de avance.":
    "The National Plan 2026–2035 and its public progress monitor.",
  "Leyes, reglamentos, acuerdos y resoluciones del Consejo.":
    "Acts, regulations, agreements and resolutions of the Council.",
  "Consultas públicas abiertas y mecanismos de incidencia.":
    "Open public consultations and the ways to have a say.",

  /* -------------------------------------------------------- the five plates */

  "El sistema en imágenes": "The system in pictures",
  "Cinco láminas del sistema educativo.": "Five plates of the education system.",
  "No hay fotografías: el Consejo es una entidad ficticia y no tendría a quién retratar. Cada lámina se dibuja con los mismos datos que alimentan el observatorio, y lleva al pie la cifra que ilustra.":
    "There are no photographs: the Council is a fictional entity and would have nobody to " +
    "photograph. Each plate is drawn from the same data that feeds the observatory, and carries the " +
    "figure it illustrates underneath.",
  "Ver el observatorio completo": "See the full observatory",
  "Plano de un aula de treinta y cinco plazas, cuatro de ellas vacías":
    "Plan of a thirty-five place classroom, four of them empty",
  "Treinta y cinco plazas, cuatro vacías. Ese es el aula que describe la cobertura de educación básica al cierre del año lectivo.":
    "Thirty-five places, four empty. That is the classroom basic education coverage describes at the " +
    "close of the school year.",
  "Mapa de Honduras con sus dieciocho departamentos sombreados según su matrícula":
    "Map of Honduras with its eighteen departments shaded by enrolment",
  "Dieciocho departamentos y 298 municipios, sombreados según el peso de su matrícula: el mismo trazo oficial que colorea el observatorio.":
    "Eighteen departments and 298 municipalities, shaded by the weight of their enrolment: the same " +
    "official outline the observatory colours in.",
  "Un campo de figuras humanas repetidas, algunas destacadas":
    "A field of repeated human figures, some of them picked out",
  "Una plantilla se dibuja repetida: una sola figura sería un icono.":
    "A workforce is drawn repeated: a single figure would be an icon.",
  "Diagrama de una señal que alcanza parte de una retícula de centros educativos":
    "Diagram of a signal reaching part of a grid of schools",
  "Centros educativos alcanzados por la señal, y los que todavía no.":
    "The schools the signal reaches, and the ones it does not yet.",
  "Lámina técnica de dos ruedas dentadas engranadas con marcas de construcción":
    "Technical plate of two meshed gears with construction marks",
  "Competencias, dibujadas como lo que son: una lámina de taller.":
    "Skills, drawn as what they are: a workshop plate.",
  "Ilustraciones generadas con los datos del portal":
    "Illustrations generated from the portal's data",

  "Educación en cifras": "Education in figures",
  "Una lectura integral del sistema educativo, actualizada con el cierre del año lectivo 2026.":
    "A whole-system reading of education, updated at the close of the 2026 school year.",
  "Matrícula nacional": "National enrolment",
  "Permanencia en el sistema": "Staying in the system",
  "El sistema, territorio por territorio.": "The system, territory by territory.",
};
