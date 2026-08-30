/**
 * The B2B catalogue.
 *
 * The brief asks that the same architecture serve a company that sells products
 * rather than services, so the portal carries a real catalogue: a listing page
 * and a full sheet per product — description, features, specification table,
 * applications, downloads, certifications and a quotation request.
 *
 * There is deliberately no cart. A corporate catalogue's call to action is a
 * quotation, and pricing that depends on volume, incoterm and lead time does not
 * belong on a public page.
 *
 * `downloads` are demonstration entries: they point at the contact page rather
 * than at a file, so the demo never offers a document it does not have.
 */

export const products = [
  {
    id: "ax360",
    slug: "serie-ax-360",
    index: "01",
    family: "Bombeo de proceso",
    name: "Serie AX-360",
    tagline: "Conjunto de bombeo centrífugo para servicio continuo",
    plate: "rotor",
    caption: "Conjunto rotor AX-360 · corte",
    summary:
      "Bomba centrífuga de una etapa montada en patín, dimensionada para servicio continuo " +
      "en condiciones de altitud y temperatura fuera del rango de catálogo estándar.",
    lead:
      "El conjunto llega probado en fábrica, alineado sobre bancada y con la instrumentación " +
      "ya cableada a bornera. En sitio se conecta succión, descarga y potencia: la puesta en " +
      "marcha típica es de una jornada.",
    features: [
      { title: "Probado bajo carga", text: "Ensayo hidráulico y de vibración en banco antes del embarque, con curva certificada por unidad." },
      { title: "Sello mecánico de cartucho", text: "Reemplazo sin desarmar el conjunto ni realinear: la intervención baja de seis horas a noventa minutos." },
      { title: "Bancada de resina epóxica", text: "Amortigua vibración y mantiene la alineación bajo dilatación térmica." },
      { title: "Instrumentación integrada", text: "Vibración, temperatura de rodamiento y presión diferencial cableadas a una sola bornera." },
    ],
    specs: [
      ["Caudal nominal", "60 – 480 m³/h"],
      ["Altura manométrica", "12 – 96 m"],
      ["Temperatura de servicio", "-10 °C a 140 °C"],
      ["Presión máxima de trabajo", "25 bar"],
      ["Material de carcasa", "Fundición dúctil / acero inoxidable 316"],
      ["Sello", "Cartucho simple o doble presurizado"],
      ["Motor", "IE3, 400/460 V, 50/60 Hz"],
      ["Grado de protección", "IP55 (IP66 opcional)"],
      ["Peso del conjunto", "480 – 1 240 kg"],
    ],
    applications: [
      "Agua de proceso y servicios auxiliares",
      "Trasiego en planta de alimentos y bebidas",
      "Impulsión en redes de conducción sectorizadas",
      "Recirculación en circuito de enfriamiento",
    ],
    certifications: ["ISO 9001", "ASME B73.1", "IEC 60034"],
    downloads: [
      { name: "Ficha técnica AX-360", meta: "PDF · 1,8 MB" },
      { name: "Curvas de desempeño", meta: "PDF · 640 KB" },
      { name: "Manual de instalación y mantenimiento", meta: "PDF · 4,2 MB" },
    ],
    lead_time: "10 – 14 semanas",
  },

  {
    id: "tc200",
    slug: "tablero-tc-200",
    index: "02",
    family: "Control y automatización",
    name: "Tablero TC-200",
    tagline: "Tablero de control industrial con pruebas en fábrica",
    plate: "hall",
    caption: "Tablero TC-200 · disposición interna",
    summary:
      "Tablero de control y fuerza construido a medida, con protocolo de pruebas en fábrica " +
      "presenciado por el cliente y documentación de mantenimiento incluida.",
    lead:
      "Cada tablero se fabrica contra un diagrama aprobado y se prueba punto por punto antes " +
      "de embarcar: continuidad, aislamiento, secuencia lógica y simulación de entradas y salidas.",
    features: [
      { title: "Protocolo FAT documentado", text: "Prueba funcional completa en taller, con acta firmada y video del ensayo de secuencia." },
      { title: "Borneras identificadas por lazo", text: "Cada conductor lleva la identificación del diagrama, de modo que el as-built no se pierde en la primera intervención." },
      { title: "Ventilación filtrada", text: "Presión positiva con filtro reemplazable, para ambiente con polvo de proceso." },
      { title: "Reserva declarada", text: "20 % de espacio y de canalización libres, para que la primera ampliación no obligue a cambiar el tablero." },
    ],
    specs: [
      ["Tensión nominal", "400 / 460 V, 3F + N + T"],
      ["Corriente de barra", "250 – 1 600 A"],
      ["Capacidad de cortocircuito", "35 kA / 1 s"],
      ["Grado de protección", "IP54 interior · IP65 intemperie"],
      ["Controlador", "PLC de gama media, redundante opcional"],
      ["Comunicación", "Modbus TCP, Profinet, OPC UA"],
      ["Interfaz", "Panel de 10\" o 15\", montaje en puerta"],
      ["Norma de fabricación", "IEC 61439-1/2"],
    ],
    applications: [
      "Control de estaciones de bombeo",
      "Automatización de línea de producción",
      "Arranque y protección de equipo rotativo",
      "Telecontrol de instalaciones remotas",
    ],
    certifications: ["IEC 61439", "ISO 9001", "IEC 62443 SL-2"],
    downloads: [
      { name: "Ficha técnica TC-200", meta: "PDF · 1,2 MB" },
      { name: "Protocolo de pruebas tipo", meta: "PDF · 880 KB" },
      { name: "Plantilla de diagrama unifilar", meta: "DWG · 2,4 MB" },
    ],
    lead_time: "8 – 12 semanas",
  },

  {
    id: "sk500",
    slug: "skid-sk-500",
    index: "03",
    family: "Conjuntos modulares",
    name: "Skid SK-500",
    tagline: "Módulo de proceso prefabricado sobre patín",
    plate: "plant",
    caption: "Skid de proceso · elevación",
    summary:
      "Módulo de proceso completo — tubería, instrumentación, control y estructura — armado " +
      "y probado en taller para reducir el trabajo en sitio a la conexión de servicios.",
    lead:
      "El skid existe para acortar la ventana de parada. Todo lo que puede hacerse en taller " +
      "se hace en taller: en obra queda la cimentación, cuatro bridas y la acometida.",
    features: [
      { title: "Ventana de montaje corta", text: "El trabajo en sitio baja de semanas a días, que es donde está el costo real de una parada." },
      { title: "Prueba hidrostática previa", text: "Tubería probada y radiografiada en taller, con el expediente de soldadura completo." },
      { title: "Estructura de izaje calculada", text: "Puntos de izaje verificados por cálculo, con el plan de maniobra incluido en el suministro." },
      { title: "Transportable por carretera", text: "Dimensionado dentro del gálibo de transporte regional, sin permiso de carga especial." },
    ],
    specs: [
      ["Dimensiones máximas", "6,0 × 2,4 × 2,9 m"],
      ["Peso en operación", "3 – 14 t"],
      ["Material de tubería", "AC A106 Gr.B / AI 304L / AI 316L"],
      ["Presión de diseño", "Hasta 40 bar"],
      ["Prueba hidrostática", "1,5 × presión de diseño"],
      ["Instrumentación", "4-20 mA / HART / bus de campo"],
      ["Estructura", "Acero estructural A36 galvanizado"],
      ["Norma de tubería", "ASME B31.3"],
    ],
    applications: [
      "Estación de bombeo prefabricada",
      "Dosificación química en planta de agua",
      "Intercambio térmico modular",
      "Planta piloto y ampliación por capacidad",
    ],
    certifications: ["ASME B31.3", "ASME IX", "ISO 9001"],
    downloads: [
      { name: "Ficha técnica SK-500", meta: "PDF · 2,1 MB" },
      { name: "Gálibo de transporte y plan de izaje", meta: "PDF · 1,5 MB" },
      { name: "Especificación de soldadura tipo", meta: "PDF · 720 KB" },
    ],
    lead_time: "12 – 16 semanas",
  },

  {
    id: "tm40",
    slug: "telemetria-tm-40",
    index: "04",
    family: "Telemetría",
    name: "Unidad TM-40",
    tagline: "Estación remota de telemetría para activo distribuido",
    plate: "grid",
    caption: "Estación remota TM-40 · esquema",
    summary:
      "Unidad remota autónoma para medición y telecontrol de instalaciones sin energía " +
      "permanente ni cobertura fija, con respaldo solar y enlace redundante.",
    lead:
      "Pensada para el pozo, la válvula y la subestación rural: el sitio donde la medición " +
      "hace falta y no hay ni acometida ni señal confiable.",
    features: [
      { title: "Autonomía de siete días", text: "Banco de baterías y panel dimensionados para una semana sin sol, no para un día promedio." },
      { title: "Enlace redundante", text: "Celular como enlace principal y satelital como respaldo, con conmutación automática y registro del corte." },
      { title: "Almacenamiento local", text: "Noventa días de registro en la unidad: si el enlace cae, el dato no se pierde." },
      { title: "Instalación sin obra", text: "Poste, panel y gabinete en una jornada, sin cimentación ni permiso de construcción." },
    ],
    specs: [
      ["Entradas analógicas", "8 × 4-20 mA aisladas"],
      ["Entradas digitales", "16 × contacto seco"],
      ["Salidas", "4 × relé 5 A"],
      ["Alimentación", "Solar 120 Wp + banco 100 Ah"],
      ["Autonomía sin recarga", "7 días"],
      ["Comunicación", "LTE Cat-M1 + respaldo satelital"],
      ["Protocolo", "MQTT / Modbus TCP / DNP3"],
      ["Temperatura de operación", "-20 °C a 60 °C"],
      ["Grado de protección", "IP66"],
    ],
    applications: [
      "Macromedición en sectores hidrométricos",
      "Telecontrol de válvulas y compuertas",
      "Monitoreo de subestación rural",
      "Medición ambiental y de nivel en cuenca",
    ],
    certifications: ["IEC 61010", "IP66", "ISO 27001"],
    downloads: [
      { name: "Ficha técnica TM-40", meta: "PDF · 940 KB" },
      { name: "Guía de dimensionamiento solar", meta: "PDF · 1,1 MB" },
      { name: "Mapa de registros Modbus", meta: "XLSX · 210 KB" },
    ],
    lead_time: "6 – 8 semanas",
  },

  {
    id: "hv138",
    slug: "bahia-hv-138",
    index: "05",
    family: "Media y alta tensión",
    name: "Bahía HV-138",
    tagline: "Bahía de línea prearmada para 138 kV",
    plate: "grid",
    caption: "Bahía de línea · alzado",
    summary:
      "Conjunto de bahía de línea con estructura, aparamenta, protecciones y malla, " +
      "entregado como un solo suministro con ingeniería y coordinación incluidas.",
    lead:
      "Comprar una bahía por partes obliga a alguien a integrarla, y ese alguien acaba siendo " +
      "el cliente. Aquí la coordinación de protecciones llega con el equipo.",
    features: [
      { title: "Protecciones coordinadas", text: "El estudio de coordinación y los ajustes vienen con el suministro, verificados en simulador." },
      { title: "Estructura calculada por sitio", text: "Viento, sismo y nivel de contaminación de la zona entran en el cálculo, no un caso genérico." },
      { title: "Montaje con la instalación en servicio", text: "Secuencia planificada para que el corte se limite a la conexión final." },
      { title: "Telecontrol listo", text: "Integración al centro de despacho probada en fábrica contra el protocolo del cliente." },
    ],
    specs: [
      ["Tensión nominal", "138 kV"],
      ["Corriente nominal", "1 250 / 2 000 A"],
      ["Capacidad de interrupción", "31,5 / 40 kA"],
      ["Nivel de aislamiento", "650 kV BIL"],
      ["Configuración", "Barra simple, doble barra o interruptor y medio"],
      ["Protecciones", "Distancia, diferencial de línea, sobrecorriente"],
      ["Telecontrol", "IEC 61850 / DNP3"],
      ["Norma", "IEC 62271"],
    ],
    applications: [
      "Ampliación de subestación existente",
      "Conexión de generación distribuida",
      "Alimentación de cliente industrial en alta tensión",
      "Refuerzo de red de transmisión",
    ],
    certifications: ["IEC 62271", "IEC 61850", "ISO 9001"],
    downloads: [
      { name: "Ficha técnica HV-138", meta: "PDF · 2,6 MB" },
      { name: "Configuraciones tipo de barra", meta: "PDF · 1,4 MB" },
      { name: "Lista de señales IEC 61850", meta: "XLSX · 380 KB" },
    ],
    lead_time: "20 – 28 semanas",
  },

  {
    id: "cc900",
    slug: "centro-cc-900",
    index: "06",
    family: "Instalaciones críticas",
    name: "Módulo CC-900",
    tagline: "Sala de datos modular con energía y clima integrados",
    plate: "hall",
    caption: "Módulo de sala · planta de conjunto",
    summary:
      "Sala de datos prefabricada de hasta 90 kW de carga de TI, con energía ininterrumpida, " +
      "climatización de precisión y monitoreo entregados como un solo sistema.",
    lead:
      "Para la organización que necesita una sala y no un proyecto de construcción: el módulo " +
      "llega armado, se conecta a acometida y queda operando con su protocolo de pruebas firmado.",
    features: [
      { title: "Contención de pasillo frío", text: "Separación física de flujos: el mismo equipo de clima sostiene más carga de TI." },
      { title: "Energía redundante", text: "Doble vía desde el tablero hasta el rack, con transferencia probada bajo carga real." },
      { title: "Monitoreo incluido", text: "Energía, clima, acceso y detección temprana de incendio en un solo tablero, integrable al SOC del cliente." },
      { title: "Ampliable por módulo", text: "La capacidad crece agregando módulos, sin rediseñar la instalación existente." },
    ],
    specs: [
      ["Carga de TI", "30 / 60 / 90 kW"],
      ["Racks", "8 / 16 / 24 unidades de 42 U"],
      ["Densidad por rack", "Hasta 8 kW"],
      ["Redundancia", "N+1 en clima · 2N en energía"],
      ["PUE de diseño", "1,35"],
      ["Autonomía de UPS", "12 minutos a plena carga"],
      ["Detección y extinción", "Aspiración + agente limpio"],
      ["Control de acceso", "Doble factor con registro"],
    ],
    applications: [
      "Sala primaria para empresa mediana",
      "Sitio de contingencia y recuperación",
      "Nodo de borde en planta o terminal",
      "Reemplazo de sala existente sin ventana de parada",
    ],
    certifications: ["ISO 27001", "IEC 62443", "NFPA 75"],
    downloads: [
      { name: "Ficha técnica CC-900", meta: "PDF · 3,1 MB" },
      { name: "Memoria de cálculo térmico tipo", meta: "PDF · 1,7 MB" },
      { name: "Protocolo de pruebas de transferencia", meta: "PDF · 620 KB" },
    ],
    lead_time: "14 – 20 semanas",
  },
];

export const productsIntro = {
  label: "Productos",
  title: "Catálogo corporativo",
  text:
    "Equipo fabricado e integrado por el grupo. Cada ficha incluye especificación, " +
    "aplicaciones, certificaciones y descargas técnicas. No hay carrito: la operación " +
    "se cierra con una cotización, que es como se compra este equipo.",
};

export const byId = (id) => products.find((product) => product.id === id);
