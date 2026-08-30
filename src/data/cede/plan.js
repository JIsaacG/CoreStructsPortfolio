/**
 * The national plan, its monitor and the programmes that execute it.
 *
 * Invented in full for this demonstration: the plan, its five axes, every
 * objective, target, milestone and percentage. It is written the way a real
 * ten-year plan is written — an axis states an intention, an objective makes it
 * measurable, an indicator says how it will be known, and a milestone says when
 * — because that structure is what a planning module has to be able to hold.
 */

export const plan = {
  code: "PNTE 2026–2035",
  name: "Plan Nacional de Transformación Educativa",
  period: "2026–2035",
  title: "Una hoja de ruta para transformar la educación.",
  lead:
    "Diez años, cinco ejes y un compromiso verificable: cada objetivo del plan tiene una meta, " +
    "un indicador y una fecha, y su avance se publica aquí mismo mientras ocurre.",
  approved: "Aprobado en sesión ordinaria del 12 de marzo de 2026",
  summary:
    "El plan ordena la acción educativa de la próxima década alrededor de cinco ejes. No " +
    "sustituye las competencias de las instituciones que integran el sistema: define qué se " +
    "quiere lograr, cómo se medirá y quién responde por cada meta.\n\n" +
    "Su ciclo es anual. Cada año el Consejo publica el estado de los quince indicadores " +
    "estratégicos, revisa los programas asociados y somete a consulta pública los ajustes. Un " +
    "plan que no se revisa deja de ser un plan y pasa a ser un documento.",
  totals: {
    objectives: 5,
    indicators: 15,
    programmes: 28,
    milestones: 46,
    milestonesReached: 17,
  },
  progress: 34.6,
  horizon: [
    { year: "2026", label: "Instalación", text: "Línea base publicada y tablero en operación." },
    { year: "2028", label: "Primer corte", text: "Evaluación intermedia de los cinco ejes." },
    { year: "2031", label: "Revisión mayor", text: "Ajuste de metas con consulta pública nacional." },
    { year: "2035", label: "Cierre", text: "Evaluación final y rendición de cuentas del ciclo." },
  ],
};

/**
 * The five axes.
 *
 * `progress` is the share of the axis's own targets that has been reached; it
 * is written down rather than computed from the objectives because in a real
 * plan the weighting between objectives is a political decision, not an
 * average.
 */
export const axes = [
  {
    index: "01",
    id: "calidad",
    name: "Calidad y aprendizaje",
    lead: "Que cada estudiante aprenda lo que el nivel promete.",
    text:
      "Un sistema puede matricular a todos y seguir sin enseñar. Este eje pone la evidencia de " +
      "aprendizaje en el centro: evaluación nacional periódica, materiales alineados al " +
      "currículo y apoyo focalizado a los centros con resultados más bajos.",
    progress: 41.2,
    programmes: 7,
    objectives: [
      {
        name: "Sistema nacional de evaluación de aprendizajes en operación continua",
        indicator: "Centros evaluados en el ciclo",
        baseline: "18%",
        goal: "100% cada tres años",
        state: "curso",
      },
      {
        name: "Materiales y guías alineados al currículo en los tres niveles",
        indicator: "Grados con material alineado disponible",
        baseline: "34%",
        goal: "100%",
        state: "curso",
      },
      {
        name: "Acompañamiento pedagógico a centros con menor resultado",
        indicator: "Centros con acompañamiento anual",
        baseline: "620",
        goal: "3.400",
        state: "atencion",
      },
    ],
  },
  {
    index: "02",
    id: "inclusion",
    name: "Inclusión y equidad",
    lead: "Que el lugar de nacimiento deje de decidir la trayectoria educativa.",
    text:
      "Las brechas del sistema son territoriales antes que individuales. Este eje concentra la " +
      "inversión donde la cobertura y la permanencia son más bajas, amplía la educación " +
      "intercultural bilingüe y elimina barreras de acceso para estudiantes con discapacidad.",
    progress: 28.4,
    programmes: 6,
    objectives: [
      {
        name: "Reducir la brecha de cobertura urbano–rural en educación media",
        indicator: "Diferencia en puntos porcentuales",
        baseline: "22,6 puntos",
        goal: "8 puntos",
        state: "atencion",
      },
      {
        name: "Ampliar la educación intercultural bilingüe",
        indicator: "Estudiantes atendidos",
        baseline: "121.400",
        goal: "210.000",
        state: "curso",
      },
      {
        name: "Centros con condiciones de accesibilidad física",
        indicator: "Porcentaje de centros",
        baseline: "8,4%",
        goal: "45%",
        state: "atencion",
      },
    ],
  },
  {
    index: "03",
    id: "docente",
    name: "Profesionalización docente",
    lead: "Que enseñar sea una carrera con formación, apoyo y trayectoria.",
    text:
      "Ninguna reforma educativa supera la calidad de sus docentes. El eje articula la " +
      "formación inicial con la práctica, establece un ciclo de formación continua con " +
      "reconocimiento formal y ordena la carrera alrededor del desempeño y la permanencia en " +
      "centros de difícil acceso.",
    progress: 46.8,
    programmes: 6,
    objectives: [
      {
        name: "Docentes con formación acreditada para el nivel que imparten",
        indicator: "Porcentaje del personal docente",
        baseline: "81,3%",
        goal: "95%",
        state: "cumplido",
      },
      {
        name: "Ciclo de formación continua con reconocimiento en la carrera",
        indicator: "Docentes en formación continua al año",
        baseline: "31,4%",
        goal: "70%",
        state: "curso",
      },
      {
        name: "Incentivo a la permanencia en centros de difícil acceso",
        indicator: "Centros cubiertos por el esquema",
        baseline: "0",
        goal: "1.800",
        state: "curso",
      },
    ],
  },
  {
    index: "04",
    id: "digital",
    name: "Transformación digital",
    lead: "Que la infraestructura digital llegue al aula, no solo al informe.",
    text:
      "Conectar centros es la parte visible; sostener la conexión, formar a quien la usa y " +
      "producir contenido propio es la que decide si sirve. El eje avanza en las tres a la vez " +
      "y publica la conectividad operativa, no la contratada.",
    progress: 33.1,
    programmes: 5,
    objectives: [
      {
        name: "Conectividad operativa en centros educativos",
        indicator: "Porcentaje de centros conectados",
        baseline: "21,6%",
        goal: "85%",
        state: "curso",
      },
      {
        name: "Plataforma nacional de recursos educativos digitales",
        indicator: "Recursos publicados y alineados al currículo",
        baseline: "0",
        goal: "12.000",
        state: "curso",
      },
      {
        name: "Reducir la brecha digital en hogares de estudiantes",
        indicator: "Hogares sin conexión ni dispositivo",
        baseline: "61,8%",
        goal: "25%",
        state: "atencion",
      },
    ],
  },
  {
    index: "05",
    id: "gobernanza",
    name: "Gobernanza y transparencia",
    lead: "Que la información pública sea la base de toda decisión educativa.",
    text:
      "El eje sostiene a los otros cuatro: una base estadística única y abierta, expedientes " +
      "públicos de cada política y un mecanismo de consulta previa que deja constancia de cómo " +
      "cada aporte ciudadano fue considerado.",
    progress: 63.5,
    programmes: 4,
    objectives: [
      {
        name: "Catálogo de datos abiertos educativos completo y actualizado",
        indicator: "Conjuntos publicados con metodología",
        baseline: "4",
        goal: "40",
        state: "cumplido",
      },
      {
        name: "Consulta pública previa para toda política de alcance nacional",
        indicator: "Políticas sometidas a consulta",
        baseline: "40%",
        goal: "100%",
        state: "cumplido",
      },
      {
        name: "Publicación anual de rendición de cuentas por eje",
        indicator: "Informes publicados en plazo",
        baseline: "1 de 5",
        goal: "5 de 5",
        state: "curso",
      },
    ],
  },
];

/** Milestones, for the plan's timeline. */
export const milestones = [
  { date: "Marzo 2026", axis: "gobernanza", title: "Aprobación del plan", state: "cumplido", text: "El Consejo aprueba el plan y su tablero público de seguimiento." },
  { date: "Junio 2026", axis: "gobernanza", title: "Línea base publicada", state: "cumplido", text: "Los quince indicadores estratégicos quedan publicados con su metodología." },
  { date: "Agosto 2026", axis: "digital", title: "Primer corte de conectividad", state: "cumplido", text: "Se publica el levantamiento anual de conectividad operativa por centro." },
  { date: "Noviembre 2026", axis: "calidad", title: "Evaluación muestral de aprendizajes", state: "curso", text: "Aplicación de la primera evaluación nacional del ciclo." },
  { date: "Marzo 2027", axis: "docente", title: "Ciclo de formación continua", state: "previsto", text: "Entra en operación el reconocimiento formal en la carrera docente." },
  { date: "Julio 2027", axis: "inclusion", title: "Mapa de brechas territoriales", state: "previsto", text: "Publicación del instrumento de focalización de la inversión." },
  { date: "Marzo 2028", axis: "gobernanza", title: "Primera evaluación intermedia", state: "previsto", text: "Corte de medio término de los cinco ejes, con consulta pública." },
];

export const milestoneStates = {
  cumplido: { label: "Alcanzado", icon: "check" },
  curso: { label: "En curso", icon: "arrow" },
  previsto: { label: "Previsto", icon: "clock" },
};

/* ------------------------------------------------------------- programmes */

/**
 * The programmes that execute the plan.
 *
 * Twenty-eight in the plan's own count; the eight below are the ones with a
 * public record in the demonstration. Each names the axis it answers to, so no
 * programme exists outside the plan.
 */
export const programmes = [
  {
    code: "PRG-01",
    name: "Aprender en los primeros grados",
    axis: "calidad",
    scope: "Nacional",
    stage: "En ejecución",
    reach: "3.400 centros",
    text:
      "Acompañamiento pedagógico y material de lectura y matemática para los tres primeros " +
      "grados de educación básica, focalizado en los centros con resultados más bajos.",
  },
  {
    code: "PRG-04",
    name: "Territorios con mayor brecha",
    axis: "inclusion",
    scope: "Occidente y Oriente",
    stage: "En ejecución",
    reach: "6 departamentos",
    text:
      "Inversión concentrada en los territorios con menor cobertura de educación media: " +
      "transporte escolar, becas de permanencia y ampliación de la oferta local.",
  },
  {
    code: "PRG-07",
    name: "Educación intercultural bilingüe",
    axis: "inclusion",
    scope: "Territorios de pueblos indígenas y afrodescendientes",
    stage: "En ejecución",
    reach: "148.600 estudiantes",
    text:
      "Ampliación de la oferta bilingüe, formación de docentes hablantes y producción de " +
      "material educativo en lenguas originarias.",
  },
  {
    code: "PRG-11",
    name: "Carrera docente",
    axis: "docente",
    scope: "Nacional",
    stage: "En ejecución",
    reach: "78.240 docentes",
    text:
      "Ciclo de formación continua con reconocimiento formal, acompañamiento entre pares e " +
      "incentivo a la permanencia en centros de difícil acceso.",
  },
  {
    code: "PRG-14",
    name: "Escuelas conectadas",
    axis: "digital",
    scope: "Nacional",
    stage: "En ejecución",
    reach: "9.690 centros",
    text:
      "Conectividad operativa sostenida, no solo instalada: contratación, mantenimiento y " +
      "medición anual del servicio en el centro educativo.",
  },
  {
    code: "PRG-17",
    name: "Recursos educativos abiertos",
    axis: "digital",
    scope: "Nacional",
    stage: "En formulación",
    reach: "12.000 recursos previstos",
    text:
      "Plataforma pública de materiales alineados al currículo, con licencia abierta y " +
      "descarga para uso sin conexión.",
  },
  {
    code: "PRG-21",
    name: "Educación técnica y empleo",
    axis: "calidad",
    scope: "Nacional",
    stage: "En ejecución",
    reach: "486 centros",
    text:
      "Actualización de la oferta técnica con el sector productivo, prácticas formativas y " +
      "seguimiento de la inserción laboral de las personas egresadas.",
  },
  {
    code: "PRG-26",
    name: "Datos educativos abiertos",
    axis: "gobernanza",
    scope: "Nacional",
    stage: "En ejecución",
    reach: "40 conjuntos de datos",
    text:
      "Publicación sistemática de las bases estadísticas del sistema, con metodología, " +
      "diccionario de variables y series históricas comparables.",
  },
];

export const axisById = Object.fromEntries(axes.map((axis) => [axis.id, axis]));
