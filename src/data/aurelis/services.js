/**
 * The six capabilities, and everything each of their pages needs.
 *
 * One entry drives three places: the editorial block on the home page, the row
 * in `/servicios`, and the full page at `/servicios/<slug>`. Adding a seventh
 * capability is a seventh object here — no template is touched.
 *
 * The copy is written the way a company that does this work would write it:
 * what is delivered, under what conditions, measured how. Adjectives that
 * cannot be checked ("innovador", "de alta calidad") are deliberately absent.
 */

export const services = [
  {
    id: "ingenieria",
    slug: "ingenieria-y-diseno",
    index: "01",
    title: "Ingeniería y diseño",
    kicker: "Estudios, ingeniería básica y de detalle",
    plate: "rotor",
    caption: "Corte de conjunto rotor · Serie AX",

    summary:
      "Diseñamos instalaciones y equipos para operar donde la precisión y la continuidad " +
      "son condición del negocio, no una aspiración del pliego.",
    home: [
      "Estudios de factibilidad y evaluación de alternativas",
      "Ingeniería básica, de detalle y as-built",
      "Cálculo estructural, de proceso y de instalaciones",
    ],

    lead:
      "Desde el estudio de factibilidad hasta los planos de taller. Entregamos ingeniería " +
      "coordinada entre disciplinas, con modelo tridimensional, cómputo de materiales y una " +
      "trazabilidad de decisiones que sobrevive al proyecto.",

    facts: [
      { term: "Disciplinas integradas", value: "6" },
      { term: "Plazo típico de ingeniería básica", value: "8 – 14 semanas" },
      { term: "Entregable", value: "Modelo BIM + memoria + cómputo" },
    ],

    benefits: [
      {
        title: "Menos cambio en obra",
        text: "La coordinación entre disciplinas se resuelve en el modelo. En los últimos cuatro proyectos, las órdenes de cambio por interferencia bajaron del 9 % al 2,4 % del monto contratado.",
      },
      {
        title: "Costo cerrado antes de excavar",
        text: "El cómputo de materiales sale del mismo modelo que los planos, de modo que el presupuesto y el diseño no pueden divergir sin que alguien lo note.",
      },
      {
        title: "Operabilidad desde el plano",
        text: "El equipo de operación revisa el diseño antes de la emisión para construcción: accesos de mantenimiento, puntos de aislamiento y espacio de maniobra.",
      },
      {
        title: "Un expediente que se puede auditar",
        text: "Cada supuesto de cálculo queda referenciado a la norma que lo respalda y a la persona que lo aprobó.",
      },
    ],

    capabilities: [
      "Estudios de factibilidad técnica y económica",
      "Ingeniería conceptual, básica y de detalle",
      "Modelado BIM y coordinación multidisciplinaria",
      "Cálculo estructural, hidráulico y de proceso",
      "Especificación de equipo y evaluación técnica de ofertas",
      "Ingeniería as-built y expediente técnico del activo",
    ],

    applications: [
      { title: "Ampliación de planta", text: "Diseño de una línea nueva dentro de una instalación que no puede parar más de 72 horas." },
      { title: "Reemplazo de activo crítico", text: "Sustitución de equipo mayor con restricciones de acceso, izaje y espacio." },
      { title: "Cumplimiento normativo", text: "Adecuación de instalaciones existentes a una norma nueva, con levantamiento y plan por etapas." },
      { title: "Due diligence técnica", text: "Evaluación del estado real de un activo antes de una compra o una renovación de contrato." },
    ],

    process: [
      { title: "Levantamiento", text: "Medición en sitio, escaneo cuando el activo lo justifica, y revisión del expediente existente." },
      { title: "Alternativas", text: "Dos o tres opciones costeadas, con su riesgo y su plazo, para que la decisión sea del cliente." },
      { title: "Desarrollo", text: "Ingeniería de detalle con revisiones formales al 30 %, 60 % y 90 % de avance." },
      { title: "Acompañamiento", text: "Resolución de consultas de obra y actualización del modelo hasta el as-built." },
    ],

    faq: [
      { q: "¿Trabajan sobre ingeniería hecha por otro despacho?", a: "Sí. Empezamos con una revisión de compatibilidad y emitimos un informe de hallazgos antes de continuar; lo que asumimos queda declarado por escrito." },
      { q: "¿Entregan el modelo o sólo los planos?", a: "El modelo nativo es del cliente y se entrega con el proyecto, junto con los planos, la memoria de cálculo y el cómputo de materiales." },
      { q: "¿Qué normas aplican?", a: "La que corresponda a la jurisdicción del proyecto. En la región trabajamos habitualmente con ASME, ASTM, IEC, ACI y las adecuaciones locales." },
      { q: "¿Pueden hacerse cargo también de la construcción?", a: "Sí, bajo contrato separado o integrado. La ingeniería se entrega igual si el cliente decide construir con otro contratista." },
    ],

    industries: ["industria", "energia", "infraestructura"],
    caseRef: "corredor",
  },

  {
    id: "infraestructura",
    slug: "infraestructura",
    index: "02",
    title: "Infraestructura",
    kicker: "Construcción, montaje y puesta en marcha",
    plate: "span",
    caption: "Viaducto atirantado · sección tipo",

    summary:
      "Construimos y montamos obra industrial y civil con responsabilidad sobre el plazo, " +
      "el costo y la puesta en marcha del activo.",
    home: [
      "Obra civil e industrial bajo contrato llave en mano",
      "Montaje mecánico, eléctrico e instrumentación",
      "Pruebas, puesta en marcha y entrega documentada",
    ],

    lead:
      "Obra civil, montaje y puesta en marcha bajo un solo responsable. Trabajamos con " +
      "planificación por ruta crítica, control de avance físico semanal y un cierre documental " +
      "que deja el activo listo para operar y para auditar.",

    facts: [
      { term: "Proyectos entregados", value: "210" },
      { term: "Cumplimiento de plazo contractual", value: "94 %" },
      { term: "Incidentes con tiempo perdido (18 meses)", value: "0" },
    ],

    benefits: [
      {
        title: "Un solo responsable",
        text: "Civil, mecánico, eléctrico e instrumentación bajo el mismo contrato: no hay una frontera donde dos contratistas se señalen mutuamente.",
      },
      {
        title: "Avance físico, no avance declarado",
        text: "El corte semanal se mide contra cantidades instaladas y verificadas en sitio, no contra el porcentaje que el cronograma esperaba.",
      },
      {
        title: "Paradas planificadas al detalle",
        text: "Las ventanas de intervención se planifican hora a hora, con secuencia de aislamiento, pruebas y retorno a servicio ensayada antes de la parada.",
      },
      {
        title: "Entrega que sirve para operar",
        text: "El activo se entrega con dossier de calidad, protocolos firmados, planos as-built y capacitación al personal que va a operarlo.",
      },
    ],

    capabilities: [
      "Obra civil industrial: cimentaciones, estructuras y pavimentos",
      "Montaje mecánico de equipo estático y rotativo",
      "Instalaciones eléctricas de media y baja tensión",
      "Instrumentación y sistemas de control",
      "Pruebas, precomisionado y puesta en marcha",
      "Gestión de permisos, seguridad y personal de obra",
    ],

    applications: [
      { title: "Planta nueva", text: "Construcción completa desde movimiento de tierras hasta la primera producción certificada." },
      { title: "Ampliación en operación", text: "Obra dentro de una instalación activa, con aislamiento por zonas y control de interferencias." },
      { title: "Parada mayor", text: "Ventana programada de mantenimiento e intervención con secuencia crítica y personal reforzado." },
      { title: "Rehabilitación", text: "Recuperación de infraestructura existente con evaluación estructural previa." },
    ],

    process: [
      { title: "Planificación", text: "Ruta crítica, plan de seguridad, plan de calidad y logística de materiales antes de movilizar." },
      { title: "Movilización", text: "Instalación de faenas, inducción del personal y verificación documental de subcontratos." },
      { title: "Ejecución", text: "Avance con control de cantidades, no conformidades cerradas y corte semanal con el cliente." },
      { title: "Cierre", text: "Pruebas, puesta en marcha asistida, dossier de calidad y liberación formal del activo." },
    ],

    faq: [
      { q: "¿Cómo se maneja el riesgo de plazo?", a: "Con hitos contractuales intermedios y una reserva de contingencia declarada por separado. Si un hito se compromete, el reporte lo dice esa misma semana, no en el cierre." },
      { q: "¿Trabajan con contratos a suma alzada?", a: "Sí, cuando la ingeniería está lo bastante avanzada para que el alcance sea cerrado. Con ingeniería incompleta preferimos precios unitarios: una suma alzada sobre un alcance abierto termina en reclamación." },
      { q: "¿Quién responde por la seguridad de los subcontratos?", a: "Aurelis. El plan de seguridad es único para la obra y el personal subcontratado recibe la misma inducción y las mismas auditorías." },
      { q: "¿Qué pasa si aparece una condición no prevista?", a: "Se levanta, se costea y se presenta antes de ejecutarla. Ningún trabajo adicional se factura sin autorización previa por escrito." },
    ],

    industries: ["infraestructura", "energia", "logistica"],
    caseRef: "corredor",
  },

  {
    id: "operaciones",
    slug: "operacion-y-mantenimiento",
    index: "03",
    title: "Operación y mantenimiento",
    kicker: "Disponibilidad contratada del activo",
    plate: "cell",
    caption: "Celda de ensamble · alzado de conjunto",

    summary:
      "Asumimos la operación y el mantenimiento del activo con un compromiso de " +
      "disponibilidad medido, no con una promesa de atención.",
    home: [
      "Contratos de disponibilidad con penalización asociada",
      "Mantenimiento preventivo, correctivo y predictivo",
      "Centro de control con cobertura continua",
    ],

    lead:
      "Contratos donde lo que se compra es disponibilidad. Operamos el activo, mantenemos " +
      "el equipo y respondemos por un indicador acordado, con un centro de control que " +
      "vigila 4 800 puntos de medición de forma continua.",

    facts: [
      { term: "Activos bajo contrato", value: "4 800" },
      { term: "Disponibilidad media contratada", value: "99,4 %" },
      { term: "Cobertura del centro de control", value: "24 / 7" },
    ],

    benefits: [
      {
        title: "El riesgo cambia de lado",
        text: "El contrato se paga contra disponibilidad alcanzada. Si el activo no está disponible, la penalización es nuestra, no un descuento que hay que reclamar.",
      },
      {
        title: "Falla anticipada, no atendida",
        text: "El modelo predictivo sobre vibración, temperatura y consumo adelanta la intervención. En 2025, el 71 % de las intervenciones mayores se planificaron antes de la falla.",
      },
      {
        title: "Repuesto donde tiene que estar",
        text: "El inventario crítico se dimensiona por criticidad y plazo de reposición, no por costumbre. En dos contratos redujo el capital inmovilizado un 28 %.",
      },
      {
        title: "Un historial que se hereda",
        text: "Todo el historial de intervención queda en la plataforma del cliente. Si el contrato termina, la información se queda con el activo.",
      },
    ],

    capabilities: [
      "Contratos de operación con indicador de disponibilidad",
      "Mantenimiento preventivo y correctivo programado",
      "Diagnóstico predictivo por vibración, termografía y consumo",
      "Gestión de repuestos críticos y almacén técnico",
      "Centro de control y atención de eventos 24/7",
      "Capacitación y certificación del personal del cliente",
    ],

    applications: [
      { title: "Planta de proceso", text: "Operación de servicios auxiliares con compromiso de continuidad sobre la línea de producción." },
      { title: "Activo distribuido", text: "Mantenimiento de instalaciones repartidas geográficamente, con ruta y tiempo de respuesta acordados." },
      { title: "Flota de equipo rotativo", text: "Bombas, compresores y motores bajo programa predictivo con línea base medida." },
      { title: "Transición de operador", text: "Toma de operación de un activo existente, con inventario, levantamiento y plan de estabilización." },
    ],

    process: [
      { title: "Línea base", text: "Se mide el estado real del activo y el desempeño actual antes de comprometer un indicador." },
      { title: "Transición", text: "Noventa días de operación asistida, con el equipo saliente y el entrante en paralelo." },
      { title: "Régimen", text: "Operación en estado estable, con reporte mensual de indicadores y revisión trimestral de contrato." },
      { title: "Mejora", text: "Cada trimestre se compromete una acción de mejora con su ahorro estimado y su verificación posterior." },
    ],

    faq: [
      { q: "¿Qué se considera indisponibilidad?", a: "Se define en el contrato, evento por evento, antes de firmar. Las causas de fuerza mayor y las paradas solicitadas por el cliente se excluyen y quedan listadas de forma explícita." },
      { q: "¿El personal actual del cliente se conserva?", a: "En la mayoría de las transiciones sí, y suele ser lo más conveniente. La incorporación se acuerda antes de la firma, no después." },
      { q: "¿Qué visibilidad tiene el cliente?", a: "Acceso completo al mismo tablero que usa nuestro centro de control, en tiempo real, más un reporte mensual firmado." },
      { q: "¿Cuál es el plazo mínimo?", a: "Treinta y seis meses. Un compromiso de disponibilidad necesita al menos un ciclo completo de mantenimiento mayor para ser real." },
    ],

    industries: ["industria", "energia", "corporativo"],
    caseRef: "hidrica",
  },

  {
    id: "digital",
    slug: "transformacion-digital",
    index: "04",
    title: "Transformación digital",
    kicker: "Telemetría, datos y sistemas de operación",
    plate: "hall",
    caption: "Sala de datos · planta de conjunto",

    summary:
      "Instrumentamos la operación y convertimos la señal en decisiones: telemetría, " +
      "trazabilidad y sistemas que el personal de planta realmente usa.",
    home: [
      "Telemetría industrial e integración con control existente",
      "Plataforma de datos operativos y mantenimiento predictivo",
      "Ciberseguridad industrial bajo IEC 62443",
    ],

    lead:
      "Digitalizar una operación no es instalar un tablero. Es medir lo que antes se " +
      "estimaba, conectarlo con el sistema que ya existe y dejar a la gente de planta con " +
      "una herramienta que responde más rápido que la hoja de cálculo que sustituye.",

    facts: [
      { term: "Puntos de medición integrados", value: "4 800" },
      { term: "Latencia del tablero de planta", value: "< 2 s" },
      { term: "Nivel de seguridad objetivo", value: "IEC 62443 SL-2" },
    ],

    benefits: [
      {
        title: "Medición donde había estimación",
        text: "Consumo, rendimiento y disponibilidad dejan de calcularse a fin de mes. La discusión pasa a ser sobre qué hacer, no sobre si el dato es correcto.",
      },
      {
        title: "Se integra, no se reemplaza",
        text: "Trabajamos sobre el control que ya está instalado. Cambiar el PLC de una planta que funciona rara vez es la parte que devuelve el dinero.",
      },
      {
        title: "Seguridad desde la arquitectura",
        text: "Segmentación de red, diodos de datos donde corresponde y ningún acceso remoto sin doble factor y registro. La red industrial no se expone para ver un gráfico.",
      },
      {
        title: "Adopción medida",
        text: "El proyecto no se cierra al desplegar: se cierra cuando el uso semanal por parte del personal de planta se sostiene tres meses.",
      },
    ],

    capabilities: [
      "Instrumentación y adquisición de datos en planta",
      "Integración con SCADA, PLC e históricos existentes",
      "Plataforma de datos operativos y tableros por rol",
      "Modelos de mantenimiento predictivo sobre señal real",
      "Ciberseguridad industrial y segmentación de red",
      "Integración con ERP y sistemas de gestión de activos",
    ],

    applications: [
      { title: "Visibilidad de planta", text: "Un tablero único de producción, consumo y paradas para operación y dirección." },
      { title: "Mantenimiento predictivo", text: "Detección temprana de degradación en equipo rotativo a partir de vibración y consumo." },
      { title: "Trazabilidad de lote", text: "Registro automático de parámetros por lote para auditoría y reclamación de calidad." },
      { title: "Eficiencia energética", text: "Medición por centro de consumo y detección de desviaciones contra la curva esperada." },
    ],

    process: [
      { title: "Diagnóstico", text: "Qué se mide hoy, con qué precisión, y qué decisión se está tomando sin dato." },
      { title: "Piloto", text: "Una línea o un área, con alcance cerrado y un beneficio medible en noventa días." },
      { title: "Escalamiento", text: "Extensión al resto de la planta una vez que el piloto sostuvo su resultado." },
      { title: "Operación", text: "Soporte, evolución del modelo y revisión semestral del valor entregado." },
    ],

    faq: [
      { q: "¿Hay que cambiar el sistema de control?", a: "Casi nunca. Se integra con el existente mediante OPC UA, Modbus o el protocolo que ya esté en uso, y sólo se sustituye lo que impide medir." },
      { q: "¿Dónde quedan los datos?", a: "Donde el cliente decida: en su propia infraestructura, en su nube o en la nuestra. El modelo de datos se entrega documentado en los tres casos." },
      { q: "¿Cómo se protege la red industrial?", a: "Segmentación física entre la red de control y la de datos, tráfico unidireccional hacia la capa de análisis y acceso remoto sólo con doble factor y sesión registrada." },
      { q: "¿Qué pasa si el piloto no da resultado?", a: "Se cierra ahí y se entrega el informe con lo aprendido. Un piloto que no demuestra beneficio no debe escalarse, y así queda escrito en el contrato." },
    ],

    industries: ["industria", "logistica", "tecnologia"],
    caseRef: "hidrica",
  },

  {
    id: "consultoria",
    slug: "consultoria-estrategica",
    index: "05",
    title: "Consultoría estratégica",
    kicker: "Decisiones de capital y capacidad",
    plate: "report",
    caption: "Informe de capacidad · edición interna",

    summary:
      "Acompañamos decisiones de inversión y capacidad con el mismo rigor técnico con " +
      "el que después habría que ejecutarlas.",
    home: [
      "Evaluación de capacidad y planes maestros de sitio",
      "Estructuración técnica y económica de inversiones",
      "Due diligence de activos y de proveedores",
    ],

    lead:
      "Estudios que terminan en una recomendación con número y con plazo. Trabajamos con " +
      "equipos que después tienen que construir y operar lo recomendado, que es lo que " +
      "mantiene los supuestos dentro de lo posible.",

    facts: [
      { term: "Estudios entregados", value: "140" },
      { term: "Plazo típico", value: "6 – 12 semanas" },
      { term: "Entregable", value: "Informe + modelo económico + plan" },
    ],

    benefits: [
      {
        title: "Supuestos que resisten la obra",
        text: "Los costos y plazos del estudio salen de la misma base de datos con la que la división de infraestructura cotiza obra real.",
      },
      {
        title: "Alternativas, no una sola tesis",
        text: "Cada estudio compara al menos tres caminos, incluido el de no invertir, con su valor presente y su riesgo declarado.",
      },
      {
        title: "Un plan que alguien puede ejecutar",
        text: "La recomendación llega con secuencia, responsables, hitos y el punto exacto donde conviene detenerse a revisar.",
      },
      {
        title: "Independencia declarada",
        text: "Si el estudio recomienda una tecnología que no proveemos, así se escribe. Cualquier conflicto de interés se declara en el informe.",
      },
    ],

    capabilities: [
      "Plan maestro de sitio y evaluación de capacidad",
      "Estructuración técnico-económica de proyectos de capital",
      "Due diligence técnica de activos y adquisiciones",
      "Evaluación de riesgo operativo y continuidad de negocio",
      "Estrategia de mantenimiento y ciclo de vida del activo",
      "Análisis de eficiencia energética e intensidad de emisiones",
    ],

    applications: [
      { title: "Decisión de ampliar", text: "Si conviene ampliar, mudar o tercerizar capacidad, con el número que sostiene cada opción." },
      { title: "Compra de un activo", text: "Estado real, pasivo técnico oculto y costo de puesta a punto antes de cerrar la operación." },
      { title: "Plan a cinco años", text: "Secuencia de inversión que ordena qué se hace primero y qué puede esperar sin comprometer la operación." },
      { title: "Continuidad", text: "Identificación de los puntos únicos de falla y el costo real de cubrirlos." },
    ],

    process: [
      { title: "Encuadre", text: "Se acuerda la pregunta que el estudio debe responder y el criterio con el que se decidirá." },
      { title: "Levantamiento", text: "Datos de operación, visita a sitio y entrevistas con quien opera, no sólo con quien dirige." },
      { title: "Modelo", text: "Alternativas costeadas, análisis de sensibilidad y prueba de los supuestos que más pesan." },
      { title: "Recomendación", text: "Informe, presentación al consejo si se requiere, y plan de ejecución por etapas." },
    ],

    faq: [
      { q: "¿Puede contratarse el estudio sin comprometer la ejecución?", a: "Sí, y es lo habitual. El estudio se cobra y se entrega por separado; contratar la obra con nosotros no es condición de nada." },
      { q: "¿Qué pasa si el estudio recomienda no invertir?", a: "Se entrega igual, con la misma profundidad. Un estudio que sólo puede terminar en una recomendación de gastar no es un estudio." },
      { q: "¿Quiénes firman el informe?", a: "El equipo técnico que lo elaboró, nominalmente, junto con el director técnico del grupo." },
      { q: "¿Se entrega el modelo económico?", a: "Sí, el archivo completo y sin bloquear, con sus supuestos y sus fuentes." },
    ],

    industries: ["corporativo", "industria", "energia"],
    caseRef: "corredor",
  },

  {
    id: "sistemas",
    slug: "sistemas-y-equipamiento",
    index: "06",
    title: "Sistemas y equipamiento",
    kicker: "Fabricación propia y equipo especificado",
    plate: "plant",
    caption: "Planta de proceso · elevación general",

    summary:
      "Fabricamos e integramos equipo para condiciones donde el catálogo estándar no " +
      "alcanza, con respaldo de repuesto y servicio en la región.",
    home: [
      "Fabricación de skids, tableros y estructura a medida",
      "Integración de equipo mayor y sistemas de control",
      "Repuesto y servicio con inventario regional",
    ],

    lead:
      "Taller propio para lo que el catálogo no cubre: skids de proceso, tableros de " +
      "control, estructura y conjuntos rotativos. Con especificación, fabricación, " +
      "pruebas en fábrica y respaldo de repuesto desde la región.",

    facts: [
      { term: "Superficie de taller", value: "4 200 m²" },
      { term: "Conjuntos entregados al año", value: "180" },
      { term: "Disponibilidad de repuesto crítico", value: "72 h" },
    ],

    benefits: [
      {
        title: "Probado antes de salir",
        text: "Cada conjunto se prueba en fábrica con el protocolo que el cliente presencia o audita. Lo que llega a sitio ya funcionó una vez.",
      },
      {
        title: "Especificado para la condición real",
        text: "Altitud, temperatura, calidad de energía y agresividad del ambiente entran en la especificación. Un equipo dimensionado para otro clima falla dos años después.",
      },
      {
        title: "Repuesto en la región",
        text: "Inventario crítico en Tegucigalpa y Ciudad de México: 72 horas frente a las seis a diez semanas de una importación.",
      },
      {
        title: "Documentación que permite mantener",
        text: "Planos, lista de materiales, parámetros y procedimientos se entregan con el equipo, no bajo un contrato de servicio aparte.",
      },
    ],

    capabilities: [
      "Fabricación de skids de proceso y patines de bombeo",
      "Tableros eléctricos y de control con pruebas en fábrica",
      "Estructura metálica y soportería a medida",
      "Reacondicionamiento de equipo rotativo",
      "Integración y programación de sistemas de control",
      "Gestión de repuesto crítico e inventario en consignación",
    ],

    applications: [
      { title: "Equipo para condición extrema", text: "Altitud, ambiente salino o temperatura fuera del rango de catálogo." },
      { title: "Reemplazo de equipo descontinuado", text: "Conjunto equivalente cuando el fabricante original ya no da soporte." },
      { title: "Estandarización de flota", text: "Unificación de tableros y repuestos en instalaciones que crecieron sin criterio común." },
      { title: "Planta modular", text: "Conjuntos prefabricados que reducen el trabajo en sitio y la ventana de parada." },
    ],

    process: [
      { title: "Especificación", text: "Condición de operación, norma aplicable y criterio de aceptación acordados por escrito." },
      { title: "Fabricación", text: "Producción en taller con control dimensional y trazabilidad de material." },
      { title: "Pruebas", text: "Protocolo en fábrica con el cliente presente o representado, y acta firmada." },
      { title: "Servicio", text: "Instalación, puesta en marcha y respaldo de repuesto durante la vida del equipo." },
    ],

    faq: [
      { q: "¿Venden equipo suelto o sólo dentro de un proyecto?", a: "Ambas cosas. El catálogo se cotiza por unidad, y el equipo puede integrarse a un proyecto propio o de un tercero." },
      { q: "¿Cuál es el plazo de entrega típico?", a: "De ocho a dieciséis semanas según el conjunto, contadas desde la aprobación de planos de fabricación." },
      { q: "¿Qué garantía tiene el equipo?", a: "Veinticuatro meses desde la puesta en marcha o treinta desde el embarque, lo que ocurra primero. La garantía cubre también la mano de obra de reemplazo." },
      { q: "¿Se puede auditar el taller?", a: "Sí. Las auditorías de proveedor son habituales y se coordinan con quince días de aviso." },
    ],

    industries: ["industria", "energia", "logistica"],
    caseRef: "hidrica",
  },
];

export const servicesIntro = {
  label: "Soluciones",
  title: "Capacidades diseñadas para avanzar",
  text:
    "Seis capacidades que se contratan por separado y funcionan mejor combinadas. " +
    "La mayoría de nuestros contratos empiezan por una y terminan cubriendo tres.",
};

export const byId = (id) => services.find((service) => service.id === id);
