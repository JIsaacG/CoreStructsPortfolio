/**
 * English for the Aurelis Group demo — data sheets, FAQs and the home page.
 *
 * The specification tables and the questions-and-answers under each capability
 * are structured data as much as prose: they end up in the page and in its
 * JSON-LD, and a buyer reads them side by side with a competitor's. So the
 * units, the standards and the abbreviations are the ones an English data sheet
 * uses — IP rating, rated voltage, breaking capacity, BIL — and the decimal
 * comma of "1,5 × presión de diseño" becomes a decimal point.
 *
 * The answers keep their bluntness. Several of them decline to promise
 * something, and that is the point of including them.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurelis";

export default {
  /* ------------------------------------------------------- specification */

  "Grado de protección": "IP rating",
  "Tensión nominal": "Rated voltage",
  "Capacidad de interrupción": "Breaking capacity",
  "Nivel de aislamiento": "Insulation level",
  Configuración: "Configuration",
  "Distancia, diferencial de línea, sobrecorriente":
    "Distance, line differential, overcurrent",
  "Carga de TI": "IT load",
  "8 / 16 / 24 unidades de 42 U": "8 / 16 / 24 racks of 42 U",
  "Densidad por rack": "Density per rack",
  "Hasta 8 kW": "Up to 8 kW",
  "N+1 en clima · 2N en energía": "N+1 on cooling · 2N on power",
  "PUE de diseño": "Design PUE",
  "Autonomía de UPS": "UPS autonomy",
  "Detección y extinción": "Detection and suppression",
  "Aspiración + agente limpio": "Aspirating + clean agent",
  "Control de acceso": "Access control",
  "Doble factor con registro": "Two-factor with audit trail",
  "Altura manométrica": "Head",
  "Temperatura de servicio": "Service temperature",
  "Temperatura de operación": "Operating temperature",
  "Presión máxima de trabajo": "Maximum working pressure",
  "Material de carcasa": "Casing material",
  "Fundición dúctil / acero inoxidable 316": "Ductile iron / 316 stainless steel",
  "Peso del conjunto": "Assembly weight",
  "Peso en operación": "Operating weight",
  "Dimensiones máximas": "Maximum dimensions",
  "Material de tubería": "Pipework material",
  "Norma de tubería": "Pipework standard",
  "Presión de diseño": "Design pressure",
  "Hasta 40 bar": "Up to 40 bar",
  "Prueba hidrostática": "Hydrostatic test",
  "1,5 × presión de diseño": "1.5 × design pressure",
  Instrumentación: "Instrumentation",
  "4-20 mA / HART / bus de campo": "4–20 mA / HART / fieldbus",
  "Corriente de barra": "Busbar rating",
  "Capacidad de cortocircuito": "Short-circuit rating",
  "PLC de gama media, redundante opcional": "Mid-range PLC, redundancy optional",
  'Panel de 10" o 15", montaje en puerta': 'Door-mounted 10" or 15" HMI',
  "Norma de fabricación": "Manufacturing standard",
  "Entradas analógicas": "Analogue inputs",
  "4 × relé 5 A": "4 × 5 A relay",
  Alimentación: "Power supply",
  "Autonomía sin recarga": "Autonomy without recharge",
  "7 días": "7 days",

  /* ------------------------------------------ consulting: what clients ask */

  "¿Puede contratarse el estudio sin comprometer la ejecución?":
    "Can we commission the study without committing to the works?",
  "Sí, y es lo habitual. El estudio se cobra y se entrega por separado; contratar la obra con nosotros no es condición de nada.":
    "Yes, and it is the norm. The study is billed and delivered separately; awarding us the works is " +
    "not a condition of anything.",
  "¿Qué pasa si el estudio recomienda no invertir?":
    "What if the study recommends not investing?",
  "Se entrega igual, con la misma profundidad. Un estudio que sólo puede terminar en una recomendación de gastar no es un estudio.":
    "It is delivered anyway, in the same depth. A study that can only end in a recommendation to " +
    "spend is not a study.",
  "¿Quiénes firman el informe?": "Who signs the report?",
  "El equipo técnico que lo elaboró, nominalmente, junto con el director técnico del grupo.":
    "The technical team that produced it, by name, together with the group's technical director.",
  "¿Se entrega el modelo económico?": "Do we get the financial model?",
  "Sí, el archivo completo y sin bloquear, con sus supuestos y sus fuentes.":
    "Yes — the complete file, unlocked, with its assumptions and its sources.",

  /* ------------------------------------------ infrastructure: what clients ask */

  "¿Cómo se maneja el riesgo de plazo?": "How is schedule risk handled?",
  "Con hitos contractuales intermedios y una reserva de contingencia declarada por separado. Si un hito se compromete, el reporte lo dice esa misma semana, no en el cierre.":
    "With intermediate contractual milestones and a contingency reserve declared separately. If a " +
    "milestone is at risk, the report says so that same week, not at handover.",
  "¿Trabajan con contratos a suma alzada?": "Do you work on lump-sum contracts?",
  "Sí, cuando la ingeniería está lo bastante avanzada para que el alcance sea cerrado. Con ingeniería incompleta preferimos precios unitarios: una suma alzada sobre un alcance abierto termina en reclamación.":
    "Yes, when the engineering is far enough along for the scope to be closed. With incomplete " +
    "engineering we prefer unit rates: a lump sum over an open scope ends in a claim.",
  "¿Quién responde por la seguridad de los subcontratos?":
    "Who is accountable for subcontractor safety?",
  "Aurelis. El plan de seguridad es único para la obra y el personal subcontratado recibe la misma inducción y las mismas auditorías.":
    "Aurelis. There is one safety plan for the site, and subcontracted personnel get the same " +
    "induction and the same audits.",
  "¿Qué pasa si aparece una condición no prevista?":
    "What happens if an unforeseen condition turns up?",
  "Se levanta, se costea y se presenta antes de ejecutarla. Ningún trabajo adicional se factura sin autorización previa por escrito.":
    "It is recorded, priced and presented before it is carried out. No additional work is invoiced " +
    "without prior written authorisation.",

  /* ------------------------------------------- engineering: what clients ask */

  "¿Trabajan sobre ingeniería hecha por otro despacho?":
    "Will you work on engineering done by another practice?",
  "Sí. Empezamos con una revisión de compatibilidad y emitimos un informe de hallazgos antes de continuar; lo que asumimos queda declarado por escrito.":
    "Yes. We start with a compatibility review and issue a findings report before going further; " +
    "what we take responsibility for is set out in writing.",
  "¿Entregan el modelo o sólo los planos?": "Do you hand over the model or only the drawings?",
  "El modelo nativo es del cliente y se entrega con el proyecto, junto con los planos, la memoria de cálculo y el cómputo de materiales.":
    "The native model belongs to the client and is handed over with the project, along with the " +
    "drawings, the design calculations and the bill of materials.",
  "¿Qué normas aplican?": "Which standards apply?",
  "La que corresponda a la jurisdicción del proyecto. En la región trabajamos habitualmente con ASME, ASTM, IEC, ACI y las adecuaciones locales.":
    "Whichever the project's jurisdiction requires. In this region we normally work to ASME, ASTM, " +
    "IEC, ACI and the local amendments.",
  "¿Pueden hacerse cargo también de la construcción?":
    "Can you take on the construction as well?",
  "Sí, bajo contrato separado o integrado. La ingeniería se entrega igual si el cliente decide construir con otro contratista.":
    "Yes, under a separate or an integrated contract. The engineering is delivered just the same if " +
    "the client chooses to build with another contractor.",

  /* -------------------------------------------------- O&M: what clients ask */

  "¿Qué se considera indisponibilidad?": "What counts as unavailability?",
  "Se define en el contrato, evento por evento, antes de firmar. Las causas de fuerza mayor y las paradas solicitadas por el cliente se excluyen y quedan listadas de forma explícita.":
    "It is defined in the contract, event by event, before signing. Force majeure and client-" +
    "requested shutdowns are excluded and listed explicitly.",
  "¿El personal actual del cliente se conserva?": "Is the client's existing team kept on?",
  "En la mayoría de las transiciones sí, y suele ser lo más conveniente. La incorporación se acuerda antes de la firma, no después.":
    "In most transitions yes, and it is usually the better outcome. The transfer is agreed before " +
    "signing, not after.",
  "¿Qué visibilidad tiene el cliente?": "What visibility does the client have?",
  "Acceso completo al mismo tablero que usa nuestro centro de control, en tiempo real, más un reporte mensual firmado.":
    "Full access to the same dashboard our control centre uses, in real time, plus a signed monthly " +
    "report.",
  "¿Cuál es el plazo mínimo?": "What is the minimum term?",
  "Treinta y seis meses. Un compromiso de disponibilidad necesita al menos un ciclo completo de mantenimiento mayor para ser real.":
    "Thirty-six months. An availability commitment needs at least one full major-maintenance cycle " +
    "to mean anything.",

  /* -------------------------------------- equipment supply: what clients ask */

  "¿Venden equipo suelto o sólo dentro de un proyecto?":
    "Do you sell equipment on its own, or only within a project?",
  "Ambas cosas. El catálogo se cotiza por unidad, y el equipo puede integrarse a un proyecto propio o de un tercero.":
    "Both. The catalogue is quoted by unit, and the equipment can be integrated into a project of " +
    "ours or of a third party.",
  "¿Cuál es el plazo de entrega típico?": "What is the typical lead time?",
  "De ocho a dieciséis semanas según el conjunto, contadas desde la aprobación de planos de fabricación.":
    "Eight to sixteen weeks depending on the assembly, counted from approval of the fabrication " +
    "drawings.",
  "¿Qué garantía tiene el equipo?": "What warranty does the equipment carry?",
  "Veinticuatro meses desde la puesta en marcha o treinta desde el embarque, lo que ocurra primero. La garantía cubre también la mano de obra de reemplazo.":
    "Twenty-four months from commissioning or thirty from shipment, whichever comes first. The " +
    "warranty covers replacement labour as well.",
  "¿Se puede auditar el taller?": "Can the workshop be audited?",
  "Sí. Las auditorías de proveedor son habituales y se coordinan con quince días de aviso.":
    "Yes. Supplier audits are routine and are arranged on fifteen days' notice.",

  /* ------------------------------------------ digital: what clients ask */

  "¿Hay que cambiar el sistema de control?": "Does the control system have to be replaced?",
  "Casi nunca. Se integra con el existente mediante OPC UA, Modbus o el protocolo que ya esté en uso, y sólo se sustituye lo que impide medir.":
    "Almost never. We integrate with the existing one over OPC UA, Modbus or whatever protocol is " +
    "already in use, and replace only what stands in the way of measuring.",
  "¿Dónde quedan los datos?": "Where does the data live?",
  "Donde el cliente decida: en su propia infraestructura, en su nube o en la nuestra. El modelo de datos se entrega documentado en los tres casos.":
    "Wherever the client decides: on their own infrastructure, in their cloud or in ours. The data " +
    "model is delivered documented in all three cases.",
  "¿Cómo se protege la red industrial?": "How is the industrial network protected?",
  "Segmentación física entre la red de control y la de datos, tráfico unidireccional hacia la capa de análisis y acceso remoto sólo con doble factor y sesión registrada.":
    "Physical segmentation between the control network and the data network, one-way traffic to the " +
    "analytics layer, and remote access only with two-factor authentication and a recorded session.",
  "¿Qué pasa si el piloto no da resultado?": "What if the pilot does not work out?",
  "Se cierra ahí y se entrega el informe con lo aprendido. Un piloto que no demuestra beneficio no debe escalarse, y así queda escrito en el contrato.":
    "It stops there and the report is delivered with what was learned. A pilot that shows no benefit " +
    "should not be scaled up, and the contract says so.",

  /* ------------------------------------------------------------ home page */

  "Diseñamos, construimos": "We design, we build",
  "que no puede detenerse.": "that cannot stop.",
  "Aurelis integra ingeniería, construcción y operación bajo un solo responsable: desde el estudio de factibilidad hasta el mantenimiento del activo, con un compromiso medible sobre disponibilidad, costo y plazo.":
    "Aurelis brings engineering, construction and operations under one accountable party: from the " +
    "feasibility study to the maintenance of the asset, with a measurable commitment on " +
    "availability, cost and schedule.",
  "Conocer nuestras soluciones": "Explore our solutions",
  "Hablar con nuestro equipo": "Talk to our team",
  Desplácese: "Scroll",
  "Empresas que confían en nuestra experiencia": "Companies that rely on our experience",
  "La compañía": "The company",
  "Experiencia que convierte desafíos operativos en resultados medibles":
    "Experience that turns operational problems into measurable results",
  "Veintiocho años trabajando en instalaciones donde una hora de parada tiene un precio conocido. Esa restricción define cómo diseñamos, cómo construimos y cómo escribimos un contrato.":
    "Twenty-eight years working in facilities where an hour of downtime has a known price. That " +
    "constraint shapes how we design, how we build and how we write a contract.",
  "Operamos desde cinco oficinas permanentes y damos servicio en doce mercados, con ingeniería propia, taller propio y un centro de control que vigila los activos que mantenemos de forma continua.":
    "We operate from five permanent offices and serve twelve markets, with our own engineering, our " +
    "own workshop and a control centre watching the assets we maintain around the clock.",

  "Ver todas las soluciones": "See all solutions",
  "Ver capacidades para industria": "See capabilities for manufacturing",
  "Ver capacidades para energía": "See capabilities for energy",
  "Ver capacidades para infraestructura": "See capabilities for infrastructure",
  "Ver capacidades para tecnología": "See capabilities for technology",
  "Ver capacidades para logística": "See capabilities for logistics",
  "Ver capacidades para sector corporativo": "See capabilities for the corporate sector",

  "Por qué Aurelis": "Why Aurelis",
  "Cuatro razones que se pueden verificar": "Four reasons you can check",
  "No son valores de marca. Son las cuatro cosas que un cliente puede comprobar antes de firmar y auditar después.":
    "These are not brand values. They are the four things a client can verify before signing and " +
    "audit afterwards.",
  "350 proyectos ejecutados desde 1998, en industria, energía, infraestructura y logística. Las referencias se entregan con nombre, alcance y contacto, no como una lista de logotipos.":
    "350 projects delivered since 1998, across manufacturing, energy, infrastructure and logistics. " +
    "References are given with a name, a scope and a contact, not as a wall of logos.",
  Precisión: "Precision",
  "Cada propuesta parte de una línea base medida en sitio. Si el dato no existe, se levanta antes de cotizar; ningún compromiso se asume sobre una estimación heredada.":
    "Every proposal starts from a baseline measured on site. If the data does not exist, it is " +
    "gathered before we quote; no commitment is made on an inherited estimate.",
  "La misma estructura atiende una intervención de tres semanas y un programa multipaís de tres años, porque la ingeniería, el taller y la operación son capacidades internas y no subcontratos encadenados.":
    "The same organisation handles a three-week intervention and a three-year multi-country " +
    "programme, because engineering, the workshop and operations are in-house capabilities rather " +
    "than a chain of subcontracts.",
  "El equipo que diseña participa en la puesta en marcha. No existe la entrega por encima del muro: quien firmó el cálculo responde por cómo se comporta en operación.":
    "The team that designs takes part in commissioning. There is no throwing it over the wall: " +
    "whoever signed the calculation answers for how it behaves in service.",

  "De la estrategia a la ejecución": "From strategy to delivery",
  "Cuatro etapas con un entregable cerrado cada una. El cliente puede detener el programa al final de cualquiera de ellas y quedarse con algo que sirve por sí solo.":
    "Four stages, each with a closed deliverable. The client can stop the programme at the end of any " +
    "of them and be left with something useful on its own.",
  "Medición en sitio, revisión del expediente y entrevistas con quien opera el activo.":
    "On-site measurement, a review of the file, and interviews with the people who run the asset.",
  "Entregable · Diagnóstico con línea base": "Deliverable · Diagnostic with a baseline",
  Diseñar: "Design",
  "Alternativas costeadas con su riesgo y su plazo, y la ingeniería de la opción elegida.":
    "Costed options with their risk and their schedule, and the engineering for the one chosen.",
  "Entregable · Ingeniería y presupuesto cerrado":
    "Deliverable · Engineering and a firm budget",
  "Construcción, montaje o despliegue, con corte de avance semanal verificado en sitio.":
    "Construction, installation or rollout, with a weekly progress cut verified on site.",

  /* ---------------------------------------------------- rules and governance */

  "Cuatro reglas que no se negocian en contrato":
    "Four rules that are not negotiable in a contract",
  "La cifra antes que el adjetivo": "The figure before the adjective",
  "Ninguna propuesta sale sin una línea base medida y un objetivo verificable.":
    "No proposal leaves without a measured baseline and a verifiable target.",
  "Quien diseña, opera": "Whoever designs, operates",
  "El equipo de ingeniería acompaña la puesta en marcha. No hay entrega por encima del muro.":
    "The engineering team sees commissioning through. Nothing gets thrown over the wall.",
  "Seguridad como condición": "Safety as a condition",
  "Un trabajo que no puede hacerse con seguridad no se hace. Se rediseña o se rechaza.":
    "Work that cannot be done safely is not done. It is redesigned or it is turned down.",
  "Transparencia del costo": "Cost transparency",
  "Estructura de precios abierta, con horas, equipo y contingencia declarados por separado.":
    "An open price structure, with labour, plant and contingency declared separately.",

  "Quién responde por el trabajo": "Who answers for the work",
  "Un comité ejecutivo de cuatro personas, con responsabilidad directa sobre contratos, seguridad y resultado técnico.":
    "An executive committee of four, directly accountable for contracts, safety and technical " +
    "outcome.",
  "Veintidós años en gestión de proyectos de infraestructura. Dirige el grupo desde 2016.":
    "Twenty-two years in infrastructure project management. Has led the group since 2016.",
  "Director de Operaciones": "Operations Director",
  "Directora Técnica": "Technical Director",
  "Responsable de obra, talleres y los contratos de mantenimiento en los cinco países.":
    "Accountable for site works, the workshops and the maintenance contracts across the five " +
    "countries.",
  "Ingeniería de proceso y sistemas de control. Preside el comité de diseño.":
    "Process engineering and control systems. Chairs the design committee.",
  "Estructuración de contratos, alianzas industriales y relación con fabricantes.":
    "Contract structuring, industrial partnerships and manufacturer relationships.",

  "Cómo se decide": "How decisions are made",
  "La estructura de gobierno es la parte que un comprador corporativo revisa antes de firmar. Se detalla igual que se detallaría en un memorando de información.":
    "The governance structure is the part a corporate buyer reviews before signing. It is set out " +
    "here as it would be in an information memorandum.",
  "Consejo de administración": "Board of directors",
  "Siete miembros, tres de ellos independientes. Se reúne trimestralmente.":
    "Seven members, three of them independent. Meets quarterly.",
  "Comité de auditoría": "Audit committee",
  "Presidido por un consejero independiente. Estados financieros auditados externamente desde 2009.":
    "Chaired by an independent director. Financial statements externally audited since 2009.",
  "Comité de riesgo y seguridad": "Risk and safety committee",
  "Revisa incidentes, casi-accidentes y planes de continuidad cada mes.":
    "Reviews incidents, near misses and continuity plans every month.",
  "Código de conducta": "Code of conduct",
  "Aplicable a personal, proveedores y socios. Canal de denuncia gestionado por un tercero.":
    "Applies to staff, suppliers and partners. Whistleblowing channel run by a third party.",
  "Política anticorrupción": "Anti-bribery policy",
  "Debida diligencia obligatoria sobre contrapartes y agentes en los doce mercados.":
    "Mandatory due diligence on counterparties and agents across the twelve markets.",

  "Los compromisos ambientales, sociales y de gobernanza se publican con la misma métrica que los resultados operativos: si no se mide, no se declara.":
    "Environmental, social and governance commitments are published on the same terms as operating " +
    "results: if it is not measured, it is not claimed.",
  "Intensidad de emisiones por proyecto ejecutado frente a la línea base de 2019. Meta 2030: -60 %.":
    "Emissions intensity per project delivered against the 2019 baseline. 2030 target: -60 %.",
  "Personas empleadas de forma directa. 38 % del personal técnico son mujeres; la meta a 2030 es 45 %.":
    "People directly employed. 38 % of technical staff are women; the 2030 target is 45 %.",
  "Proveedores críticos evaluados en cumplimiento, seguridad laboral y trazabilidad de materiales.":
    "Critical suppliers assessed on compliance, occupational safety and material traceability.",

  /* ------------------------------------------------------- milestones, misc */

  "Telemetría, mantenimiento predictivo y la plataforma que hoy opera 4 800 activos.":
    "Telemetry, predictive maintenance and the platform now running 4,800 assets.",
  "Centro técnico europeo: sistemas de control, ciberseguridad industrial y homologaciones.":
    "European technical centre: control systems, industrial cyber security and type approvals.",
  "Plan de inversión a cinco años en capacidad de fabricación y energía propia.":
    "A five-year investment plan in manufacturing capacity and own generation.",

  '<span class="au-label__index">AG</span><span>Grupo de ingeniería, tecnología y operación</span>':
    '<span class="au-label__index">AG</span><span>An engineering, technology and operations ' +
    "group</span>",

  /* ------------------------------------------------------------ quotations */

  '<span class="au-quote__name">Elena Vargas Sosa</span><span class="au-quote__role">Directora de Operaciones</span><span class="au-quote__org">Transandina Logística</span>':
    '<span class="au-quote__name">Elena Vargas Sosa</span><span class="au-quote__role">Operations ' +
    'Director</span><span class="au-quote__org">Transandina Logística</span>',
  '<span class="au-quote__name">Rodrigo Peña Ibarra</span><span class="au-quote__role">Gerente de Infraestructura</span><span class="au-quote__org">Grupo Meridian</span>':
    '<span class="au-quote__name">Rodrigo Peña Ibarra</span><span class="au-quote__role">' +
    'Infrastructure Manager</span><span class="au-quote__org">Grupo Meridian</span>',
  '<span class="au-quote__name">Carla Mejía Fonseca</span><span class="au-quote__role">Jefa de Subestaciones</span><span class="au-quote__org">Norvik Energía</span>':
    '<span class="au-quote__name">Carla Mejía Fonseca</span><span class="au-quote__role">Head of ' +
    'Substations</span><span class="au-quote__org">Norvik Energía</span>',

  '<span class="au-insight__kind">Análisis</span> <span>18 de junio, 2026</span> <span>7 min</span>':
    '<span class="au-insight__kind">Analysis</span> <span>18 June 2026</span> <span>7 min</span>',
  '<span class="au-insight__kind">Análisis</span> <span>30 de abril, 2026</span> <span>6 min</span>':
    '<span class="au-insight__kind">Analysis</span> <span>30 April 2026</span> <span>6 min</span>',
  '<span class="au-insight__kind">Análisis</span> <span>11 de febrero, 2026</span> <span>5 min</span>':
    '<span class="au-insight__kind">Analysis</span> <span>11 February 2026</span> <span>5 min</span>',
};
