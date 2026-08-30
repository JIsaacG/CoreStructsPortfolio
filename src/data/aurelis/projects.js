/**
 * Case studies.
 *
 * The section a business reader uses to decide whether the company is credible,
 * so it is written as evidence: a named client, a country, a baseline, what was
 * done and what it moved. Three of them have a full record at
 * `/proyectos/<slug>`; all of them appear on the index.
 *
 * `featured` marks the one that headlines the home page.
 */

export const projects = [
  {
    id: "corredor",
    slug: "corredor-atlantico",
    featured: true,
    index: "01",
    client: "Transandina Logística",
    industry: "Logística",
    country: "Honduras · Guatemala · El Salvador",
    year: "2023 – 2025",
    service: "Infraestructura · Transformación digital",
    plate: "routes",
    caption: "Corredor multimodal · esquema de red",

    kicker: "Caso de éxito",
    title: "Transformando operaciones críticas a escala regional",
    summary:
      "Un operador logístico con seis terminales en tres países movía carga sobre " +
      "sistemas que no se hablaban entre sí. Rediseñamos la operación del corredor " +
      "completo y la instrumentamos punto por punto.",

    results: [
      { value: "-32 %", label: "Tiempo operativo", up: true },
      { value: "+46 %", label: "Capacidad", up: true },
      { value: "99,9 %", label: "Disponibilidad" },
      { value: "3", label: "Países" },
    ],

    /* The full record. */
    problem:
      "Transandina operaba seis terminales entre Puerto Cortés y San Salvador con tres " +
      "sistemas de gestión distintos, heredados de adquisiciones sucesivas. La consecuencia " +
      "no era informática sino operativa: nadie podía decir dónde estaba una unidad sin " +
      "llamar por teléfono, el tiempo de permanencia se estimaba a fin de mes y la capacidad " +
      "declarada de la red no coincidía con la que se lograba en un día cualquiera.\n\n" +
      "La dirección había presupuestado una ampliación de patio en dos terminales. El " +
      "encargo inicial fue evaluar esa inversión.",

    solution:
      "El estudio de capacidad mostró que las terminales no estaban saturadas: estaban " +
      "desbalanceadas. Dos operaban al 94 % mientras dos trabajaban al 51 %, y la asignación " +
      "se decidía por costumbre comercial, no por carga. La recomendación fue posponer la " +
      "obra y resolver primero la visibilidad.\n\n" +
      "Se instaló control de acceso e identificación de unidad en las seis terminales, se " +
      "unificaron los tres sistemas bajo un modelo de datos único y se construyó una capa de " +
      "asignación dinámica de andén. La obra civil se ejecutó después, reducida a una sola " +
      "terminal y a un tercio del monto originalmente previsto.",

    process: [
      { title: "Diagnóstico de red", text: "Ocho semanas midiendo permanencia real por terminal, por turno y por tipo de unidad." },
      { title: "Piloto en Puerto Cortés", text: "Identificación automática y asignación de andén en la terminal de mayor carga, con línea base previa." },
      { title: "Unificación", text: "Migración de las tres bases a un modelo común, con operación en paralelo durante sesenta días." },
      { title: "Despliegue regional", text: "Extensión a las cinco terminales restantes, incluida la obra de ampliación en una de ellas." },
    ],

    tech: [
      "Identificación automática de unidad (RFID + OCR de placa)",
      "Modelo de datos único sobre PostgreSQL",
      "Capa de asignación dinámica de andén",
      "Tableros por rol: patio, terminal y dirección",
      "Integración con el ERP existente vía API",
      "Enlace redundante entre terminales y centro de control",
    ],

    quote: {
      text:
        "Llegamos pidiendo una ampliación de patio y nos fuimos con la mitad de la obra y " +
        "el doble de capacidad. Lo importante es que primero midieron y después opinaron.",
      name: "Elena Vargas Sosa",
      role: "Directora de Operaciones",
      org: "Transandina Logística",
    },

    gallery: [
      { plate: "port", caption: "Terminal de Puerto Cortés · planta de patio" },
      { plate: "routes", caption: "Asignación dinámica · esquema" },
      { plate: "hall", caption: "Centro de control regional" },
    ],
  },

  {
    id: "hidrica",
    slug: "red-hidrica-meridian",
    index: "02",
    client: "Grupo Meridian",
    industry: "Infraestructura",
    country: "Colombia",
    year: "2022 – 2024",
    service: "Ingeniería · Operación y mantenimiento",
    plate: "span",
    caption: "Conducción principal · sección tipo",

    kicker: "Caso de éxito",
    title: "Cuarenta y dos kilómetros de conducción, sin cortar el servicio",
    summary:
      "Rehabilitación y sectorización de una red de conducción con pérdidas del 46 %, " +
      "ejecutada por tramos para mantener el suministro durante los veintiséis meses de obra.",

    results: [
      { value: "-31 %", label: "Pérdida física", up: true },
      { value: "42 km", label: "Conducción" },
      { value: "18", label: "Sectores medidos" },
      { value: "0", label: "Días sin servicio" },
    ],

    problem:
      "La red perdía el 46 % del agua producida y no existía medición intermedia: la única " +
      "cifra confiable era la de salida de planta. Sin sectorización era imposible saber si la " +
      "pérdida era fuga, consumo no registrado o error de macromedición, de modo que cada " +
      "presupuesto de reparación era una apuesta.",

    solution:
      "Se dividió la red en dieciocho sectores hidrométricos, cada uno con su propia " +
      "macromedición y control de presión. Con tres meses de datos por sector, la pérdida " +
      "quedó localizada: el 61 % se concentraba en cuatro tramos que sumaban once kilómetros.\n\n" +
      "La rehabilitación se ejecutó sobre esos tramos primero, con desvíos provisionales que " +
      "mantuvieron el servicio, y la operación posterior quedó bajo contrato de disponibilidad " +
      "con el indicador de pérdida como métrica principal.",

    process: [
      { title: "Sectorización", text: "División en dieciocho distritos con macromedición y válvulas de corte." },
      { title: "Medición", text: "Noventa días de registro continuo de caudal nocturno mínimo por sector." },
      { title: "Rehabilitación", text: "Sustitución de los cuatro tramos críticos con desvío provisional." },
      { title: "Operación", text: "Contrato de cinco años con indicador de pérdida y revisión trimestral." },
    ],

    tech: [
      "Macromedición electromagnética por sector",
      "Control de presión con válvulas reductoras pilotadas",
      "Telemetría por red celular con respaldo satelital",
      "Modelo hidráulico calibrado contra medición real",
      "Detección acústica de fuga sobre tramos priorizados",
    ],

    quote: {
      text:
        "Nos entregaron primero un mapa de dónde se perdía el agua y sólo después una " +
        "propuesta de obra. Fue la primera vez que un contratista nos dijo qué no había que hacer.",
      name: "Rodrigo Peña Ibarra",
      role: "Gerente de Infraestructura",
      org: "Grupo Meridian",
    },

    gallery: [
      { plate: "span", caption: "Cruce de conducción · sección" },
      { plate: "grid", caption: "Sectorización · esquema de red" },
      { plate: "cell", caption: "Estación de control de presión" },
    ],
  },

  {
    id: "norvik",
    slug: "subestacion-norvik",
    index: "03",
    client: "Norvik Energía",
    industry: "Energía",
    country: "Honduras",
    year: "2024 – 2025",
    service: "Ingeniería · Infraestructura",
    plate: "grid",
    caption: "Ampliación de subestación · alzado",

    kicker: "Caso de éxito",
    title: "Ampliar una subestación de 138 kV sin apagar la región",
    summary:
      "Dos bahías nuevas y el reemplazo del sistema de protecciones en una subestación en " +
      "servicio, con doce horas de parada total repartidas en dos ventanas nocturnas.",

    results: [
      { value: "12 h", label: "Parada total", up: true },
      { value: "2", label: "Bahías nuevas" },
      { value: "+65 MVA", label: "Capacidad" },
      { value: "0", label: "Eventos de protección" },
    ],

    problem:
      "La subestación operaba al límite de su capacidad firme y el sistema de protecciones " +
      "era electromecánico, sin registro de eventos. Cualquier ampliación exigía intervenir " +
      "una instalación energizada que alimenta a tres municipios y a dos clientes industriales " +
      "con contrato de continuidad.",

    solution:
      "La secuencia completa de maniobra se ensayó en simulador de protecciones antes de " +
      "tocar la instalación, con el personal de operación del cliente ejecutándola. La obra " +
      "se organizó para que todo el trabajo posible ocurriera con la instalación energizada, " +
      "dejando para las ventanas nocturnas únicamente lo que exigía corte.",

    process: [
      { title: "Ingeniería y estudio", text: "Coordinación de protecciones, estudio de cortocircuito y plan de maniobra." },
      { title: "Ensayo", text: "Simulación de la secuencia completa con el personal que la ejecutaría." },
      { title: "Obra energizada", text: "Estructura, canalización y cableado con la instalación en servicio." },
      { title: "Ventanas", text: "Dos cortes nocturnos de seis horas para conexión y pruebas finales." },
    ],

    tech: [
      "Protecciones numéricas con registro de eventos",
      "Coordinación verificada en simulador de red",
      "Telecontrol integrado al centro de despacho",
      "Malla de tierra ampliada y verificada por medición",
    ],

    quote: {
      text:
        "Ensayaron la maniobra con nuestra propia gente antes de ejecutarla. Cuando llegó la " +
        "noche del corte, nadie estaba improvisando.",
      name: "Carla Mejía Fonseca",
      role: "Jefa de Subestaciones",
      org: "Norvik Energía",
    },

    gallery: [
      { plate: "grid", caption: "Bahía de línea · alzado" },
      { plate: "hall", caption: "Sala de control y protecciones" },
      { plate: "tower", caption: "Edificio de mando · alzado" },
    ],
  },

  /* Listed on the index without a full record: shown as executed work, not as a
     dead link — the card carries its own figures and does not pretend to open. */
  {
    id: "talara",
    index: "04",
    client: "Cementos Talara",
    industry: "Industria",
    country: "Honduras",
    year: "2024",
    service: "Operación y mantenimiento",
    plate: "plant",
    caption: "Molienda · elevación de conjunto",
    title: "Disponibilidad contratada en molienda",
    summary:
      "Contrato de cinco años sobre servicios auxiliares de molienda, con la disponibilidad " +
      "como única métrica de pago.",
    results: [
      { value: "99,4 %", label: "Disponibilidad" },
      { value: "-22 %", label: "Costo de mantenimiento", up: true },
    ],
  },
  {
    id: "peninsular",
    index: "05",
    client: "Banco Peninsular",
    industry: "Sector corporativo",
    country: "Honduras · El Salvador",
    year: "2023",
    service: "Infraestructura · Tecnología",
    plate: "tower",
    caption: "Sede corporativa · alzado norte",
    title: "Continuidad eléctrica para dos centros de datos",
    summary:
      "Rediseño de la cadena de energía crítica de dos salas, con transferencia probada bajo " +
      "carga real y sin ventana de indisponibilidad.",
    results: [
      { value: "1,32", label: "PUE alcanzado" },
      { value: "+40 %", label: "Capacidad útil", up: true },
    ],
  },
  {
    id: "vega",
    index: "06",
    client: "Vega Minerals",
    industry: "Industria",
    country: "México",
    year: "2022 – 2023",
    service: "Sistemas y equipamiento",
    plate: "rotor",
    caption: "Conjunto rotor · corte",
    title: "Estandarización de flota de bombeo",
    summary:
      "Reemplazo de nueve conjuntos de bombeo por un diseño único, con inventario de repuesto " +
      "reducido a una sola familia.",
    results: [
      { value: "-28 %", label: "Capital en repuesto", up: true },
      { value: "9", label: "Conjuntos" },
    ],
  },
];

export const projectsIntro = {
  label: "Proyectos",
  title: "Trabajo entregado, con la cifra que lo respalda",
  text:
    "Una selección de contratos ejecutados entre 2022 y 2025. Las cifras son " +
    "demostrativas y corresponden a una empresa ficticia; la estructura es la que " +
    "usaría un expediente real.",
};

export const featured = () => projects.find((project) => project.featured);
export const withRecord = () => projects.filter((project) => project.slug);
export const byId = (id) => projects.find((project) => project.id === id);
