/**
 * The six industries the group sells into.
 *
 * One entry feeds the tab panel on the home page and the row on `/industrias`.
 * Each carries four things that change together when a tab is selected — plate,
 * description, capabilities and a worked example — because a selector that only
 * swaps a paragraph is not worth the interaction it costs.
 */

export const industries = [
  {
    id: "industria",
    index: "01",
    name: "Industria",
    plate: "cell",
    caption: "Celda de ensamble · alzado de conjunto",
    title: "Manufactura y proceso",
    text:
      "Plantas donde una hora de parada se mide en producto no fabricado. Trabajamos " +
      "sobre la línea existente: ampliaciones sin detener la producción, servicios " +
      "auxiliares con disponibilidad contratada y medición que convierte la merma en " +
      "un número que alguien puede atacar.",
    capabilities: [
      "Ampliación de línea con ventana de parada acotada",
      "Servicios auxiliares: vapor, aire, frío y agua de proceso",
      "Mantenimiento predictivo sobre equipo rotativo",
      "Trazabilidad de lote y control estadístico de proceso",
      "Eficiencia energética por centro de consumo",
    ],
    example: {
      label: "Aplicación",
      text:
        "Planta de alimentos con tres líneas: se instrumentó el consumo por línea y se " +
        "reprogramó el arranque escalonado de compresores. La demanda máxima contratada " +
        "bajó sin tocar la producción.",
      figures: [
        { value: "-18 %", label: "Demanda máxima" },
        { value: "11 meses", label: "Retorno" },
      ],
    },
  },

  {
    id: "energia",
    index: "02",
    name: "Energía",
    plate: "grid",
    caption: "Línea de transmisión · alzado de vano",
    title: "Generación, transmisión y distribución",
    text:
      "Activos que responden ante un regulador y ante una curva de demanda. Diseñamos, " +
      "construimos y operamos subestaciones, líneas y plantas de generación, con el " +
      "expediente técnico que la fiscalización va a pedir.",
    capabilities: [
      "Subestaciones de media y alta tensión",
      "Líneas de transmisión y distribución",
      "Integración de generación distribuida y almacenamiento",
      "Protecciones, automatización y telecontrol",
      "Mantenimiento con disponibilidad comprometida",
    ],
    example: {
      label: "Aplicación",
      text:
        "Subestación de 138 kV ampliada en operación: la maniobra se ejecutó en dos " +
        "ventanas nocturnas de seis horas, con la secuencia ensayada previamente en " +
        "simulador de protecciones.",
      figures: [
        { value: "12 h", label: "Parada total" },
        { value: "0", label: "Eventos de protección" },
      ],
    },
  },

  {
    id: "infraestructura",
    index: "03",
    name: "Infraestructura",
    plate: "span",
    caption: "Viaducto atirantado · sección tipo",
    title: "Obra civil y redes",
    text:
      "Obra que se entrega a una administración o a un concesionario y tiene que durar " +
      "décadas. Estructura, agua, vialidad y edificación técnica, con control de calidad " +
      "documentado a nivel de cada elemento vaciado.",
    capabilities: [
      "Estructuras de concreto y acero",
      "Redes de agua potable y saneamiento",
      "Vialidad, drenaje y obras de contención",
      "Edificación técnica e industrial",
      "Rehabilitación de infraestructura existente",
    ],
    example: {
      label: "Aplicación",
      text:
        "Rehabilitación de una red de conducción de 42 km con sectorización y macromedición " +
        "por sector, ejecutada por tramos para mantener el servicio durante toda la obra.",
      figures: [
        { value: "-31 %", label: "Pérdida física" },
        { value: "42 km", label: "Conducción" },
      ],
    },
  },

  {
    id: "tecnologia",
    index: "04",
    name: "Tecnología",
    plate: "hall",
    caption: "Sala de datos · planta de conjunto",
    title: "Instalaciones críticas de TI",
    text:
      "Salas de datos y centros de control donde la instalación eléctrica y el clima son " +
      "el servicio, no el edificio. Diseño, construcción y operación bajo un compromiso de " +
      "disponibilidad con penalización asociada.",
    capabilities: [
      "Diseño y construcción de salas de datos",
      "Energía ininterrumpida, respaldo y transferencia",
      "Climatización de precisión y contención de pasillo",
      "Monitoreo de infraestructura y gestión de capacidad",
      "Ciberseguridad de la capa industrial",
    ],
    example: {
      label: "Aplicación",
      text:
        "Sala de 180 kW rediseñada con contención de pasillo frío y control de velocidad " +
        "variable en las unidades de precisión, sin ampliar la acometida eléctrica.",
      figures: [
        { value: "1,32", label: "PUE alcanzado" },
        { value: "+40 %", label: "Capacidad útil" },
      ],
    },
  },

  {
    id: "logistica",
    index: "05",
    name: "Logística",
    plate: "port",
    caption: "Terminal de contenedores · planta general",
    title: "Terminales, almacenes y transporte",
    text:
      "Instalaciones donde el rendimiento se mide en movimientos por hora. Obra, " +
      "equipamiento y sistemas para terminales, centros de distribución y patios de " +
      "maniobra, con la operación medida antes y después.",
    capabilities: [
      "Patios de maniobra, pavimentos y obra de terminal",
      "Equipamiento de manejo de carga y su mantenimiento",
      "Sistemas de gestión de patio y control de acceso",
      "Trazabilidad de unidad y tiempos de permanencia",
      "Eficiencia energética en frío y en iluminación",
    ],
    example: {
      label: "Aplicación",
      text:
        "Centro de distribución con control de acceso automatizado y asignación dinámica " +
        "de andén: el tiempo de permanencia por unidad se redujo sin aumentar la plantilla.",
      figures: [
        { value: "-27 %", label: "Permanencia" },
        { value: "+19 %", label: "Movimientos/hora" },
      ],
    },
  },

  {
    id: "corporativo",
    index: "06",
    name: "Sector corporativo",
    plate: "tower",
    caption: "Sede corporativa · alzado norte",
    title: "Sedes, campus y activos propios",
    text:
      "Edificios corporativos y campus donde el costo de operación se decide en el " +
      "proyecto. Diseño técnico, construcción y una operación posterior con indicadores " +
      "de consumo, confort y continuidad.",
    capabilities: [
      "Instalaciones técnicas de edificio y campus",
      "Gestión energética y automatización de edificio",
      "Continuidad eléctrica para áreas críticas",
      "Operación y mantenimiento de activo inmobiliario",
      "Adecuación a norma y certificación de edificio",
    ],
    example: {
      label: "Aplicación",
      text:
        "Sede corporativa de 14 000 m² con automatización de clima e iluminación por zona " +
        "de ocupación real, más una revisión trimestral de la curva de consumo.",
      figures: [
        { value: "-23 %", label: "Consumo anual" },
        { value: "14 000 m²", label: "Superficie" },
      ],
    },
  },
];

export const industriesIntro = {
  label: "Industrias",
  title: "Experiencia aplicada a cada industria",
  text:
    "La capacidad técnica es la misma; lo que cambia es la restricción. Estas son las " +
    "seis en las que el grupo tiene operación permanente.",
};
