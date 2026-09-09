/**
 * English for the Aurelis Group demo — the case studies and the three articles.
 *
 * This is the longest-form writing in the portfolio, and the part where a
 * literal translation would do the most damage. The pieces argue: each one
 * opens on a scene, names the mistake everyone makes, and closes on a line that
 * lands. Where Spanish reaches for a subordinate clause, English is allowed a
 * full stop, because the rhythm is the argument.
 *
 * The pull quotes are the test. "Instrumentar bien no genera información nueva.
 * Elimina una discusión vieja, que es más valioso." only works if the English
 * keeps the same shape and the same flatness.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurelis";

export default {
  /* -------------------------------------------------------- the project index */

  "Trabajo entregado, con la cifra que lo respalda": "Work delivered, with the figure behind it",
  "Una selección de contratos ejecutados entre 2022 y 2025. Las cifras son demostrativas y corresponden a una empresa ficticia; la estructura es la que usaría un expediente real.":
    "A selection of contracts delivered between 2022 and 2025. The figures are illustrative and " +
    "belong to a fictional company; the structure is the one a real project file would use.",

  "Logística · Honduras · Guatemala · El Salvador":
    "Logistics · Honduras · Guatemala · El Salvador",
  "Energía · Honduras": "Energy · Honduras",
  "Industria · México": "Manufacturing · Mexico",
  "Sector corporativo · Honduras · El Salvador":
    "Corporate sector · Honduras · El Salvador",
  "Infraestructura · Transformación digital": "Infrastructure · Digital transformation",
  "Ingeniería · Operación y mantenimiento": "Engineering · Operations and maintenance",
  "Ingeniería · Infraestructura": "Engineering · Infrastructure",

  "Contrato de cinco años sobre servicios auxiliares de molienda, con la disponibilidad como única métrica de pago.":
    "A five-year contract on milling utilities, with availability as the only payment metric.",
  "Costo de mantenimiento": "Maintenance cost",
  "Continuidad eléctrica para dos centros de datos":
    "Electrical continuity for two data centres",
  "Rediseño de la cadena de energía crítica de dos salas, con transferencia probada bajo carga real y sin ventana de indisponibilidad.":
    "A redesign of the critical power chain in two halls, with transfer tested under real load and " +
    "no window of unavailability.",
  "Estandarización de flota de bombeo": "Standardising a pumping fleet",
  "Reemplazo de nueve conjuntos de bombeo por un diseño único, con inventario de repuesto reducido a una sola familia.":
    "Nine pumping sets replaced by a single design, with the spares inventory reduced to one family.",

  /* ---------------------------------------------- case study: the corridor */

  '<b>01</b><strong>Diagnóstico de red</strong><span>Ocho semanas midiendo permanencia real por terminal, por turno y por tipo de unidad.</span>':
    "<b>01</b><strong>Network diagnostic</strong><span>Eight weeks measuring actual dwell time by " +
    "terminal, by shift and by vehicle type.</span>",
  '<b>02</b><strong>Piloto en Puerto Cortés</strong><span>Identificación automática y asignación de andén en la terminal de mayor carga, con línea base previa.</span>':
    "<b>02</b><strong>Pilot at Puerto Cortés</strong><span>Automatic identification and bay " +
    "allocation at the busiest terminal, against a prior baseline.</span>",
  '<b>03</b><strong>Unificación</strong><span>Migración de las tres bases a un modelo común, con operación en paralelo durante sesenta días.</span>':
    "<b>03</b><strong>Consolidation</strong><span>Migration of the three databases to a common " +
    "model, running in parallel for sixty days.</span>",
  '<b>04</b><strong>Despliegue regional</strong><span>Extensión a las cinco terminales restantes, incluida la obra de ampliación en una de ellas.</span>':
    "<b>04</b><strong>Regional rollout</strong><span>Extension to the remaining five terminals, " +
    "including the expansion works at one of them.</span>",
  "<b>Elena Vargas Sosa</b> · Directora de Operaciones, Transandina Logística":
    "<b>Elena Vargas Sosa</b> · Operations Director, Transandina Logística",

  "Transandina operaba seis terminales entre Puerto Cortés y San Salvador con tres sistemas de gestión distintos, heredados de adquisiciones sucesivas. La consecuencia no era informática sino operativa: nadie podía decir dónde estaba una unidad sin llamar por teléfono, el tiempo de permanencia se estimaba a fin de mes y la capacidad declarada de la red no coincidía con la que se lograba en un día cualquiera.":
    "Transandina ran six terminals between Puerto Cortés and San Salvador on three different " +
    "management systems, inherited from successive acquisitions. The consequence was not an IT " +
    "problem but an operational one: nobody could say where a vehicle was without picking up the " +
    "phone, dwell time was estimated at month end, and the network's declared capacity did not match " +
    "what it actually achieved on any given day.",
  "La dirección había presupuestado una ampliación de patio en dos terminales. El encargo inicial fue evaluar esa inversión.":
    "The board had budgeted a yard expansion at two terminals. The original brief was to appraise " +
    "that investment.",
  "El estudio de capacidad mostró que las terminales no estaban saturadas: estaban desbalanceadas. Dos operaban al 94 % mientras dos trabajaban al 51 %, y la asignación se decidía por costumbre comercial, no por carga. La recomendación fue posponer la obra y resolver primero la visibilidad.":
    "The capacity study showed the terminals were not saturated: they were unbalanced. Two were " +
    "running at 94 % while two ran at 51 %, and allocation was decided by commercial habit rather " +
    "than by load. The recommendation was to postpone the works and fix visibility first.",
  "Se instaló control de acceso e identificación de unidad en las seis terminales, se unificaron los tres sistemas bajo un modelo de datos único y se construyó una capa de asignación dinámica de andén. La obra civil se ejecutó después, reducida a una sola terminal y a un tercio del monto originalmente previsto.":
    "Access control and vehicle identification were installed at all six terminals, the three systems " +
    "were brought under a single data model, and a dynamic bay allocation layer was built on top. " +
    "The civil works followed, cut back to one terminal and to a third of the original budget.",
  "Identificación automática de unidad (RFID + OCR de placa)":
    "Automatic vehicle identification (RFID + plate OCR)",
  "Modelo de datos único sobre PostgreSQL": "A single data model on PostgreSQL",
  "Capa de asignación dinámica de andén": "Dynamic bay allocation layer",
  "Tableros por rol: patio, terminal y dirección":
    "Dashboards by role: yard, terminal and board",
  "Integración con el ERP existente vía API": "Integration with the existing ERP over an API",
  "Enlace redundante entre terminales y centro de control":
    "Redundant link between the terminals and the control centre",
  "Terminal de Puerto Cortés · planta de patio": "Puerto Cortés terminal · yard plan",
  "Asignación dinámica · esquema": "Dynamic allocation · schematic",
  "Centro de control regional": "Regional control centre",
  "“Llegamos pidiendo una ampliación de patio y nos fuimos con la mitad de la obra y el doble de capacidad. Lo importante es que primero midieron y después opinaron.”":
    "“We came asking for a yard expansion and left with half the works and twice the capacity. What " +
    "mattered is that they measured first and gave an opinion second.”",

  /* ------------------------------------------------- case study: the water main */

  '<b>01</b><strong>Sectorización</strong><span>División en dieciocho distritos con macromedición y válvulas de corte.</span>':
    "<b>01</b><strong>Sectorisation</strong><span>Division into eighteen districts with bulk meters " +
    "and isolation valves.</span>",
  '<b>02</b><strong>Medición</strong><span>Noventa días de registro continuo de caudal nocturno mínimo por sector.</span>':
    "<b>02</b><strong>Measurement</strong><span>Ninety days of continuous minimum night flow logging " +
    "per district.</span>",
  '<b>03</b><strong>Rehabilitación</strong><span>Sustitución de los cuatro tramos críticos con desvío provisional.</span>':
    "<b>03</b><strong>Rehabilitation</strong><span>Replacement of the four critical sections with a " +
    "temporary bypass.</span>",
  '<b>04</b><strong>Operación</strong><span>Contrato de cinco años con indicador de pérdida y revisión trimestral.</span>':
    "<b>04</b><strong>Operation</strong><span>A five-year contract with a loss indicator and a " +
    "quarterly review.</span>",
  "<b>Rodrigo Peña Ibarra</b> · Gerente de Infraestructura, Grupo Meridian":
    "<b>Rodrigo Peña Ibarra</b> · Infrastructure Manager, Grupo Meridian",

  "La red perdía el 46 % del agua producida y no existía medición intermedia: la única cifra confiable era la de salida de planta. Sin sectorización era imposible saber si la pérdida era fuga, consumo no registrado o error de macromedición, de modo que cada presupuesto de reparación era una apuesta.":
    "The network was losing 46 % of the water it produced and there was no intermediate metering: the " +
    "only reliable figure was the one leaving the works. Without district metering it was impossible " +
    "to tell whether the loss was leakage, unbilled consumption or a bulk-meter error, so every " +
    "repair budget was a gamble.",
  "Se dividió la red en dieciocho sectores hidrométricos, cada uno con su propia macromedición y control de presión. Con tres meses de datos por sector, la pérdida quedó localizada: el 61 % se concentraba en cuatro tramos que sumaban once kilómetros.":
    "The network was divided into eighteen district metered areas, each with its own bulk meter and " +
    "pressure control. With three months of data per district, the loss was located: 61 % of it was " +
    "concentrated in four sections totalling eleven kilometres.",
  "La rehabilitación se ejecutó sobre esos tramos primero, con desvíos provisionales que mantuvieron el servicio, y la operación posterior quedó bajo contrato de disponibilidad con el indicador de pérdida como métrica principal.":
    "Rehabilitation went to those sections first, with temporary bypasses that kept the supply " +
    "running, and the operation afterwards was placed under an availability contract with the loss " +
    "indicator as the headline metric.",
  "Macromedición electromagnética por sector": "Electromagnetic bulk metering per district",
  "Control de presión con válvulas reductoras pilotadas":
    "Pressure control with pilot-operated reducing valves",
  "Telemetría por red celular con respaldo satelital":
    "Cellular telemetry with satellite back-up",
  "Modelo hidráulico calibrado contra medición real":
    "Hydraulic model calibrated against real measurement",
  "Detección acústica de fuga sobre tramos priorizados":
    "Acoustic leak detection on the prioritised sections",
  "Cruce de conducción · sección": "Main crossing · section",
  "Sectorización · esquema de red": "Sectorisation · network schematic",
  "Estación de control de presión": "Pressure control station",
  "“Nos entregaron primero un mapa de dónde se perdía el agua y sólo después una propuesta de obra. Fue la primera vez que un contratista nos dijo qué no había que hacer.”":
    "“They gave us a map of where the water was going first, and a works proposal only afterwards. It " +
    "was the first time a contractor told us what not to do.”",

  /* ------------------------------------------------ case study: the substation */

  '<b>01</b><strong>Ingeniería y estudio</strong><span>Coordinación de protecciones, estudio de cortocircuito y plan de maniobra.</span>':
    "<b>01</b><strong>Engineering and study</strong><span>Protection coordination, short-circuit " +
    "study and switching plan.</span>",
  '<b>02</b><strong>Ensayo</strong><span>Simulación de la secuencia completa con el personal que la ejecutaría.</span>':
    "<b>02</b><strong>Rehearsal</strong><span>Simulation of the complete sequence with the people " +
    "who would carry it out.</span>",
  '<b>03</b><strong>Obra energizada</strong><span>Estructura, canalización y cableado con la instalación en servicio.</span>':
    "<b>03</b><strong>Live works</strong><span>Steelwork, containment and cabling with the " +
    "substation in service.</span>",
  '<b>04</b><strong>Ventanas</strong><span>Dos cortes nocturnos de seis horas para conexión y pruebas finales.</span>':
    "<b>04</b><strong>Windows</strong><span>Two six-hour night outages for the connection and the " +
    "final tests.</span>",
  "<b>Carla Mejía Fonseca</b> · Jefa de Subestaciones, Norvik Energía":
    "<b>Carla Mejía Fonseca</b> · Head of Substations, Norvik Energía",

  "La subestación operaba al límite de su capacidad firme y el sistema de protecciones era electromecánico, sin registro de eventos. Cualquier ampliación exigía intervenir una instalación energizada que alimenta a tres municipios y a dos clientes industriales con contrato de continuidad.":
    "The substation was running at the limit of its firm capacity and the protection system was " +
    "electromechanical, with no event recording. Any extension meant working on a live installation " +
    "feeding three municipalities and two industrial customers on continuity contracts.",
  "La secuencia completa de maniobra se ensayó en simulador de protecciones antes de tocar la instalación, con el personal de operación del cliente ejecutándola. La obra se organizó para que todo el trabajo posible ocurriera con la instalación energizada, dejando para las ventanas nocturnas únicamente lo que exigía corte.":
    "The complete switching sequence was rehearsed on a protection simulator before anything was " +
    "touched, with the client's own operators running it. The works were organised so that as much " +
    "as possible happened with the substation live, leaving only what required an outage for the " +
    "night windows.",
  "Protecciones numéricas con registro de eventos": "Numerical protection with event recording",
  "Coordinación verificada en simulador de red": "Coordination verified on a network simulator",
  "Telecontrol integrado al centro de despacho": "Telecontrol integrated with the dispatch centre",
  "Malla de tierra ampliada y verificada por medición":
    "Earthing grid extended and verified by measurement",
  "Sala de control y protecciones": "Control and protection room",
  "Edificio de mando · alzado": "Control building · elevation",
  "“Ensayaron la maniobra con nuestra propia gente antes de ejecutarla. Cuando llegó la noche del corte, nadie estaba improvisando.”":
    "“They rehearsed the switching with our own people before carrying it out. When the night of the " +
    "outage came, nobody was improvising.”",

  /* --------------------------------------------------------- the resource index */

  "Análisis, informes y novedades": "Analysis, reports and news",
  "Lo que el equipo técnico publica cuando un problema se repite lo suficiente como para merecer una respuesta escrita.":
    "What the technical team publishes when a problem recurs often enough to deserve a written answer.",
  "Capacidad industrial en Centroamérica · Edición 2026":
    "Industrial capacity in Central America · 2026 edition",
  "Utilización, cuellos de botella y planes de inversión declarados en 140 instalaciones de la región. Disponible bajo solicitud.":
    "Utilisation, bottlenecks and declared investment plans across 140 facilities in the region. " +
    "Available on request.",
  "Continuidad eléctrica y costo de la interrupción":
    "Electrical continuity and the cost of interruption",
  "Qué cuesta realmente una hora sin energía en ocho sectores industriales, y cuánto de esa exposición es evitable. Disponible bajo solicitud.":
    "What an hour without power actually costs across eight industrial sectors, and how much of that " +
    "exposure is avoidable. Available on request.",
  "Aurelis amplía su centro técnico en Madrid": "Aurelis expands its technical centre in Madrid",
  "La sede europea suma un laboratorio de pruebas de protecciones y duplica el equipo de ciberseguridad industrial.":
    "The European office adds a protection testing laboratory and doubles the industrial cyber " +
    "security team.",
  "Los informes se entregan bajo solicitud": "Reports are delivered on request",
  "Es como se distribuye este material en la práctica: el informe llega por correo tras una solicitud identificada. El formulario de contacto ya contempla el caso.":
    "It is how this material is actually distributed: the report arrives by email after an identified " +
    "request. The contact form already covers it.",
  "Solicitar un informe": "Request a report",

  "<span>18 de junio, 2026</span><span>7 min</span>":
    "<span>18 June 2026</span><span>7 min</span>",
  "<span>30 de abril, 2026</span><span>6 min</span>":
    "<span>30 April 2026</span><span>6 min</span>",
  "<span>11 de febrero, 2026</span><span>5 min</span>":
    "<span>11 February 2026</span><span>5 min</span>",
  "<span>22 de enero, 2026</span><span>2 min</span>":
    "<span>22 January 2026</span><span>2 min</span>",
  "<span>Mayo 2026</span><span>48 páginas</span>":
    "<span>May 2026</span><span>48 pages</span>",
  "<span>Marzo 2026</span><span>32 páginas</span>":
    "<span>March 2026</span><span>32 pages</span>",

  "Joaquín Vidal Ferrer · Director de Operaciones":
    "Joaquín Vidal Ferrer · Operations Director",

  /* ------------------------------------- article: the figure nobody measures */

  "Hay una escena que se repite en plantas de sectores que no tienen nada que ver entre sí. La reunión mensual de operación empieza, aparece el número de rendimiento, y los primeros cuarenta minutos se van en establecer si ese número es real. Producción lo calcula de una forma, mantenimiento de otra, y el sistema de gestión tiene una tercera versión.":
    "There is a scene that repeats itself in plants from sectors with nothing in common. The monthly " +
    "operations meeting starts, the yield figure appears, and the first forty minutes go on " +
    "establishing whether that figure is real. Production calculates it one way, maintenance " +
    "another, and the management system has a third version.",
  "Cuando por fin hay acuerdo sobre la cifra, queda poco tiempo para lo único que importaba: decidir qué hacer con ella.":
    "By the time everyone agrees on the number, there is little time left for the only thing that " +
    "mattered: deciding what to do about it.",
  "El problema casi nunca es la falta de sensores": "The problem is almost never missing sensors",
  "En los diagnósticos que hacemos, la conclusión más frecuente no es que falte instrumentación. Es que la que existe no está reconciliada: dos medidores en serie que no coinciden, un totalizador que se reinicia con cada corte de energía, un dato de producción que se captura a mano al cierre del turno y otro que sale del PLC.":
    "In the diagnostics we run, the commonest finding is not that instrumentation is missing. It is " +
    "that what exists has never been reconciled: two meters in series that disagree, a totaliser " +
    "that resets on every power cut, one production figure captured by hand at the end of the shift " +
    "and another coming out of the PLC.",
  "Añadir un tercer medidor a esa situación no resuelve nada. Produce una tercera cifra en discusión.":
    "Adding a third meter to that situation solves nothing. It produces a third figure to argue about.",
  "Tres cosas que sí lo resuelven": "Three things that do solve it",
  "Una fuente declarada por cada indicador: qué instrumento, qué cálculo, qué frecuencia. Escrito y visible en el mismo tablero donde aparece el número.":
    "A declared source for each indicator: which instrument, which calculation, which frequency. " +
    "Written down and visible on the same dashboard the number appears on.",
  "Reconciliación automática entre mediciones redundantes, con la desviación expuesta en lugar de escondida.":
    "Automatic reconciliation between redundant measurements, with the discrepancy shown rather than " +
    "hidden.",
  "Trazabilidad hacia atrás: poder abrir cualquier cifra del reporte mensual hasta la lectura que la originó.":
    "Traceability backwards: being able to open any figure in the monthly report down to the reading " +
    "it came from.",
  "El efecto secundario": "The side effect",
  "En los proyectos donde esto se resolvió primero, el beneficio inmediato no fue una mejora de rendimiento. Fue que las reuniones cambiaron de tema. Cuando el dato deja de estar en disputa, la conversación se mueve hacia la causa, y la causa es lo único sobre lo que alguien puede actuar.":
    "In the projects where this was fixed first, the immediate benefit was not a gain in yield. It " +
    "was that the meetings changed subject. Once the figure stops being disputed, the conversation " +
    "moves to the cause, and the cause is the only thing anybody can act on.",
  "Instrumentar bien no genera información nueva. Elimina una discusión vieja, que es más valioso.":
    "Instrumenting properly does not generate new information. It ends an old argument, which is " +
    "worth more.",
  "Es también la parte más barata de cualquier programa de digitalización, y la que más veces se salta porque no se ve en una demostración.":
    "It is also the cheapest part of any digitisation programme, and the one most often skipped " +
    "because it does not show up in a demo.",

  /* ------------------------------- article: modernising a plant that cannot stop */

  "En las evaluaciones que hemos hecho en los últimos tres años, el factor que más veces descartó una alternativa técnicamente buena no fue el costo de inversión. Fue el tiempo de parada que exigía. Una planta de proceso que factura por hora tiene un precio implícito para cada hora detenida, y ese número suele ser mayor que la diferencia entre las dos opciones que se están comparando.":
    "In the appraisals we have run over the last three years, the factor that most often ruled out a " +
    "technically sound option was not the capital cost. It was the downtime it required. A process " +
    "plant that bills by the hour has an implicit price for every hour it is stopped, and that " +
    "number is usually larger than the difference between the two options being compared.",
  "El error habitual es tratar la ventana como un dato del final: se diseña la solución, se calcula lo que cuesta detenerse y entonces empieza la negociación. Invertir ese orden cambia el resultado del proyecto.":
    "The usual mistake is to treat the window as something you work out at the end: design the " +
    "solution, calculate what stopping costs, and then start negotiating. Reversing that order " +
    "changes the outcome of the project.",
  "1. Definir la ventana antes que la solución": "1. Define the window before the solution",
  "La primera pregunta de un proyecto de modernización no debería ser qué tecnología conviene, sino cuántas horas consecutivas puede estar detenido el activo y con cuánta anticipación se puede programar la parada. Con esas dos cifras sobre la mesa, buena parte del catálogo de alternativas desaparece antes de gastar una hora de ingeniería en ella.":
    "The first question in an upgrade project should not be which technology suits, but how many " +
    "consecutive hours the asset can be down and how far in advance the shutdown can be scheduled. " +
    "With those two figures on the table, a good part of the catalogue of options disappears before " +
    "an hour of engineering is spent on it.",
  "En una de las plantas que evaluamos, la ventana máxima era de setenta y dos horas una vez al año. Esa restricción, planteada al principio, llevó directamente a una solución modular que en un escenario sin límite de parada habría sido más cara y menos elegante — y que fue la única ejecutable.":
    "At one of the plants we appraised, the maximum window was seventy-two hours once a year. Put on " +
    "the table at the start, that constraint led straight to a modular solution which, in a scenario " +
    "with no shutdown limit, would have been dearer and less elegant — and which was the only one " +
    "that could actually be built.",
  "2. Mover trabajo fuera de la ventana": "2. Move work outside the window",
  "Todo lo que pueda fabricarse, cablearse, programarse y probarse en taller reduce el riesgo de la parada dos veces: acorta el trabajo en sitio y traslada los errores a un lugar donde corregirlos no cuesta producción. Un módulo prefabricado que llega probado convierte semanas de montaje en días de conexión.":
    "Anything that can be built, wired, programmed and tested in the workshop reduces the risk of the " +
    "shutdown twice over: it shortens the work on site and moves the mistakes somewhere fixing them " +
    "costs no production. A prefabricated module that arrives tested turns weeks of installation " +
    "into days of connection.",
  "Lo mismo aplica al trabajo que puede hacerse con la instalación energizada o en operación. En la ampliación de una subestación de 138 kV, el 84 % de las horas-hombre se ejecutaron con la instalación en servicio; a la ventana nocturna sólo llegó lo que exigía corte.":
    "The same goes for work that can be done with the installation live or running. On the extension " +
    "of a 138 kV substation, 84 % of the man-hours were worked with the substation in service; only " +
    "what required an outage reached the night window.",
  "3. Ensayar la secuencia, no sólo planificarla":
    "3. Rehearse the sequence, do not just plan it",
  "Un plan de maniobra revisado en una sala de reuniones y un plan ensayado por la gente que va a ejecutarlo son documentos distintos. El ensayo — en simulador, en maqueta o en seco sobre la instalación — es donde aparecen los pasos que faltaban, las llaves que no estaban y las dos operaciones que alguien había supuesto simultáneas.":
    "A switching plan reviewed in a meeting room and a plan rehearsed by the people who will carry it " +
    "out are two different documents. The rehearsal — on a simulator, on a mock-up, or dry on the " +
    "installation — is where the missing steps turn up, along with the keys nobody had and the two " +
    "operations somebody had assumed were simultaneous.",
  "Ensayar con el personal que ejecutará, no con el que planificó":
    "Rehearse with the people who will do it, not the people who planned it",
  "Cronometrar cada paso y sumar los tiempos reales, no los estimados":
    "Time every step and add up the real durations, not the estimated ones",
  "Definir el punto de no retorno y el criterio para abortar antes de llegar a él":
    "Define the point of no return, and the criterion for aborting before you reach it",
  "Preparar la vuelta atrás con el mismo detalle que el avance":
    "Prepare the rollback in the same detail as the plan itself",
  "4. Aceptar que la ventana puede no alcanzar":
    "4. Accept that the window may not be enough",
  "La conclusión honesta de algunos estudios es que el trabajo no cabe. Cuando eso ocurre, las salidas son tres: dividirlo en varias ventanas con una configuración intermedia estable, construir capacidad redundante temporal, o aceptar una parada mayor y planificarla con un año de anticipación. Las tres son caras. Descubrirlo durante la parada lo es mucho más.":
    "The honest conclusion of some studies is that the work does not fit. When that happens there are " +
    "three ways out: split it across several windows with a stable intermediate configuration, build " +
    "temporary redundant capacity, or accept a longer shutdown and plan it a year ahead. All three " +
    "are expensive. Finding out during the shutdown is far more so.",
  "El costo de una parada no planificada no se compara con el de la obra. Se compara con el de la producción que no ocurrió.":
    "The cost of an unplanned shutdown is not measured against the cost of the works. It is measured " +
    "against the production that never happened.",
  "La modernización de un activo en operación es, antes que un problema técnico, un problema de secuencia. Los proyectos que salen bien casi siempre se decidieron en las primeras semanas, cuando alguien preguntó cuánto tiempo había y diseñó hacia atrás desde ahí.":
    "Upgrading an asset in service is a sequencing problem before it is a technical one. The projects " +
    "that go well were almost always decided in the first few weeks, when somebody asked how much " +
    "time there was and designed backwards from the answer.",

  /* ------------------------------------- article: what buying availability means */

  "En un contrato de mantenimiento tradicional, el cliente compra horas y repuestos. Si el equipo falla, paga la reparación. En un contrato de disponibilidad, compra un resultado: el activo debe estar disponible un porcentaje acordado del tiempo, y si no lo está, el proveedor asume una penalización.":
    "Under a traditional maintenance contract, the client buys hours and spares. If the equipment " +
    "fails, they pay for the repair. Under an availability contract, they buy an outcome: the asset " +
    "must be available for an agreed percentage of the time, and if it is not, the supplier takes a " +
    "penalty.",
  "La diferencia parece contractual y es operativa. Cambia por completo los incentivos de quien mantiene el equipo.":
    "The difference looks contractual and is operational. It completely changes the incentives of " +
    "whoever maintains the equipment.",
  "El incentivo se invierte": "The incentive reverses",
  "Bajo un contrato por horas, un proveedor gana más cuando el equipo falla más. Nadie lo diría en voz alta, pero la estructura de precios lo dice sola. Bajo un contrato de disponibilidad, cada falla es un costo propio, y por eso el proveedor invierte en detectarla antes: la medición predictiva deja de ser un servicio adicional que hay que vender y pasa a ser una defensa de su propio margen.":
    "Under a time-and-materials contract, a supplier earns more when the equipment fails more. Nobody " +
    "would say so out loud, but the price structure says it for them. Under an availability " +
    "contract, every failure is a cost to the supplier, which is why they invest in catching it " +
    "early: predictive monitoring stops being an add-on service to be sold and becomes a defence of " +
    "their own margin.",
  "Cuatro condiciones sin las cuales no funciona": "Four conditions it does not work without",
  "Un contrato de disponibilidad mal escrito genera más conflicto que el esquema que reemplaza. Estas son las condiciones que, en nuestra experiencia, separan uno que funciona de uno que termina en arbitraje.":
    "A badly written availability contract generates more conflict than the arrangement it replaces. " +
    "These are the conditions that, in our experience, separate one that works from one that ends in " +
    "arbitration.",
  "Una línea base medida. Comprometer un 99,4 % sin saber en cuánto está hoy el activo es una apuesta, no un contrato.":
    "A measured baseline. Committing to 99.4 % without knowing where the asset stands today is a " +
    "gamble, not a contract.",
  "Una definición de indisponibilidad acordada evento por evento, con las exclusiones escritas antes de firmar.":
    "A definition of unavailability agreed event by event, with the exclusions written down before " +
    "signing.",
  "Medición que ambas partes ven en tiempo real, sobre la misma fuente de datos.":
    "Measurement both parties see in real time, from the same data source.",
  "Un plazo suficiente para que quepa al menos un ciclo completo de mantenimiento mayor.":
    "A term long enough to contain at least one full major-maintenance cycle.",
  "Qué pasa con el personal": "What happens to the staff",
  "La pregunta que más aparece en la mesa es qué ocurre con el equipo de mantenimiento existente. En la mayoría de las transiciones que hemos hecho, conservarlo fue la mejor decisión: conoce el activo, conoce sus manías y su incorporación acorta la curva de aprendizaje de meses a semanas. Lo que cambia no es la gente, es a quién reporta el indicador.":
    "The question that comes up most is what happens to the existing maintenance team. In most of the " +
    "transitions we have run, keeping them was the better decision: they know the asset, they know " +
    "its quirks, and bringing them across cuts the learning curve from months to weeks. What changes " +
    "is not the people; it is who the indicator reports to.",
  "Cuándo no conviene": "When it is the wrong instrument",
  "Un contrato de disponibilidad no tiene sentido sobre un activo al final de su vida útil, ni sobre uno cuyo modo de falla depende de una variable que el operador no controla — calidad de la materia prima, por ejemplo, o estabilidad de la red eléctrica. En esos casos el precio del riesgo se dispara y termina siendo más caro que asumirlo internamente.":
    "An availability contract makes no sense on an asset at the end of its life, nor on one whose " +
    "failure mode depends on a variable the operator does not control — raw material quality, say, " +
    "or the stability of the grid. In those cases the price of the risk climbs until it costs more " +
    "than carrying it in-house.",
  "Si el proveedor no puede influir en la causa de la falla, cobrará por asumirla igual. Y cobrará bien.":
    "If the supplier cannot influence the cause of the failure, they will still charge for carrying " +
    "it. And they will charge well.",
  "El instrumento sirve cuando el riesgo puede ser gestionado por quien lo asume. Esa es toda la regla.":
    "The instrument works when the risk can be managed by whoever carries it. That is the whole rule.",

  /* ------------------------------------------------- consulting service page */

  '<b>01</b><strong>Encuadre</strong><span>Se acuerda la pregunta que el estudio debe responder y el criterio con el que se decidirá.</span>':
    "<b>01</b><strong>Framing</strong><span>Agreeing the question the study has to answer and the " +
    "criterion the decision will be made on.</span>",
  '<b>02</b><strong>Levantamiento</strong><span>Datos de operación, visita a sitio y entrevistas con quien opera, no sólo con quien dirige.</span>':
    "<b>02</b><strong>Fieldwork</strong><span>Operating data, a site visit and interviews with the " +
    "people who run it, not only those who manage it.</span>",
  '<b>03</b><strong>Modelo</strong><span>Alternativas costeadas, análisis de sensibilidad y prueba de los supuestos que más pesan.</span>':
    "<b>03</b><strong>Model</strong><span>Costed options, sensitivity analysis and a test of the " +
    "assumptions that carry the most weight.</span>",
  '<b>04</b><strong>Recomendación</strong><span>Informe, presentación al consejo si se requiere, y plan de ejecución por etapas.</span>':
    "<b>04</b><strong>Recommendation</strong><span>Report, a board presentation if one is needed, " +
    "and a staged delivery plan.</span>",
  "Estudios que terminan en una recomendación con número y con plazo. Trabajamos con equipos que después tienen que construir y operar lo recomendado, que es lo que mantiene los supuestos dentro de lo posible.":
    "Studies that end in a recommendation with a number and a date. We work with teams who then have " +
    "to build and run what was recommended, which is what keeps the assumptions inside the realm of " +
    "the possible.",
  "Plazo típico": "Typical duration",
  "Informe + modelo económico + plan": "Report + financial model + plan",
  "Consultoría estratégica en una línea": "Strategic consulting in one line",
  "Plan maestro de sitio y evaluación de capacidad":
    "Site master plan and capacity assessment",

  /* -------------------------------------------------------------- TM-40 uses */

  "Monitoreo de subestación rural": "Rural substation monitoring",
  "Medición ambiental y de nivel en cuenca": "Environmental and level monitoring in a catchment",
  "Ficha técnica TM-40": "TM-40 data sheet",
  "Guía de dimensionamiento solar": "Solar sizing guide",
  "Mapa de registros Modbus": "Modbus register map",
};
