/**
 * Orbita Supply — an invented equipment distributor, and the third landing demo.
 *
 * This is the commercial one. Nexora sells judgement and Velora sells a
 * booking; Orbita has to sell *things*, which is a different job: the visitor
 * has to be able to find a product, understand it, put it next to another one,
 * and ask for a price — without the page turning into a marketplace.
 *
 * So the page carries four working pieces of front-end that a catalogue site
 * actually needs: a search, a product sheet, a comparison table and a B2B
 * configurator that produces a quote. None of them has a backend, and the page
 * says so wherever it matters.
 *
 * Prices are in lempiras and invented. Brands are invented too — a demo must
 * never imply a distribution agreement that does not exist.
 */

/* Every product carries the same shape, which is what lets the same card, the
   same sheet and the same comparison row render any of them. `keywords` is the
   one field a visitor never sees: it is what a person actually types — "laptop",
   "router", "cámara" — next to what the catalogue calls the thing. Without it a
   search for "proyector" misses the product whose page says "proyección". */
const product = (data) => ({ availability: "En existencia", warranty: "2 años", ...data });

export const orbita = {
  slug: "orbita",
  brand: {
    name: "Orbita",
    suffix: "Supply",
    mark: "Equipos y tecnología para empresas",
    sector: "Distribución de equipo y tecnología empresarial — marca ficticia",
  },

  /* Near-white ground, carbon type, electric blue, and two black zones that
     carry the weight. */
  theme: { accent: "#0a5cff", page: "#ffffff", ink: "#0b0d12" },

  nav: [
    { id: "catalogo", label: "Catálogo" },
    { id: "comparar", label: "Comparar" },
    { id: "equipar", label: "Equipar" },
    { id: "empresas", label: "Empresas" },
    { id: "cotizar", label: "Cotizar" },
  ],

  hero: {
    eyebrow: "Tecnología para tu empresa",
    title: "El equipo correcto cambia la forma en que trabajas.",
    lead:
      "Tecnología, equipos y soluciones seleccionadas para empresas que necesitan rendimiento, " +
      "confiabilidad y soporte.",
    primary: { label: "Explorar equipos", href: "#catalogo" },
    secondary: { label: "Solicitar cotización", href: "#cotizar" },
    /* The tags that float over the showcase. Four, no more: the composition is
       the product, not the labels on it. */
    tags: [
      { label: "Nuevo", art: "laptop", x: 20, y: 22, depth: 3 },
      { label: "Empresarial", art: "monitor", x: 72, y: 16, depth: 2 },
      { label: "Entrega rápida", art: "printer", x: 80, y: 74, depth: 3 },
      { label: "Garantía", art: "phone", x: 15, y: 78, depth: 1.5 },
    ],
  },

  search: {
    title: "¿Qué estás buscando?",
    placeholder: "Laptop, proyector, impresora, router…",
    hint: "Buscador de demostración: filtra el catálogo de esta página, sin servidor detrás.",
    suggestions: [
      "Laptop empresarial",
      "Proyector",
      "Impresora",
      "Monitor",
      "Router",
      "Equipo de oficina",
    ],
    empty: "No hay equipos que coincidan. Prueba con otra palabra o pide una cotización a medida.",
  },

  categories: {
    label: "Categorías",
    title: "Ocho líneas, un solo proveedor.",
    text: "Todo lo que una operación necesita para funcionar, cotizado en una sola propuesta.",
    items: [
      { id: "computacion", name: "Computación", art: "laptop", count: "48 equipos" },
      { id: "impresion", name: "Impresión", art: "printer", count: "26 equipos" },
      { id: "redes", name: "Redes", art: "router", count: "31 equipos" },
      { id: "av", name: "Audio y video", art: "projector", count: "22 equipos" },
      { id: "oficina", name: "Oficina", art: "chair", count: "54 artículos" },
      { id: "energia", name: "Energía", art: "ups", count: "18 equipos" },
      { id: "seguridad", name: "Seguridad", art: "camera", count: "29 equipos" },
      { id: "accesorios", name: "Accesorios", art: "accessory", count: "112 artículos" },
    ],
  },

  catalog: {
    label: "Catálogo",
    title: "Equipos seleccionados para trabajar mejor.",
    text:
      "Diez equipos del catálogo, uno por línea, con la ficha completa de cada uno. Toca " +
      "cualquiera para ver especificaciones, garantía y disponibilidad.",
    items: [
      product({
        id: "orbitbook-pro-14",
        keywords: "laptop portátil notebook computadora empresarial",
        name: "OrbitBook Pro 14",
        category: "Computación",
        art: "laptop",
        tag: "Más vendido",
        price: "L 29,990",
        priceNote: "Desde",
        summary: "La máquina estándar para equipos que trabajan fuera del escritorio.",
        specs: [
          "Intel Core Ultra 7",
          "16 GB RAM",
          "512 GB SSD",
          "14″ 2.8K",
        ],
        sheet: {
          features: [
            "Chasis de aluminio de 1.29 kg",
            "Batería de 14 horas en uso mixto",
            "Lector de huella y cámara con obturador",
            "Dos Thunderbolt 4, HDMI y lector SD",
          ],
          delivery: "Entrega en 48 horas en Tegucigalpa y San Pedro Sula",
          stock: "24 unidades disponibles",
        },
      }),
      product({
        id: "orbitbook-air-13",
        keywords: "laptop portátil notebook computadora ligera empresarial remoto",
        name: "OrbitBook Air 13",
        category: "Computación",
        art: "laptop",
        price: "L 22,400",
        priceNote: "Desde",
        summary: "Ligera y silenciosa, para trabajo administrativo y equipos remotos.",
        specs: ["Intel Core Ultra 5", "16 GB RAM", "512 GB SSD", "13.3″ FHD+"],
        sheet: {
          features: [
            "0.99 kg, sin ventilador",
            "Batería de 16 horas",
            "Teclado retroiluminado",
            "Wi-Fi 6E y 5G opcional",
          ],
          delivery: "Entrega en 48 horas",
          stock: "31 unidades disponibles",
        },
      }),
      product({
        id: "orbitview-27",
        keywords: "monitor pantalla display escritorio empresarial",
        name: "OrbitView 27",
        category: "Computación",
        art: "monitor",
        tag: "Empresarial",
        price: "L 8,450",
        summary: "Un cable para video, datos y carga. El monitor que ordena el escritorio.",
        specs: ["27″ QHD IPS", "100 Hz", "USB-C 90 W", "Base ajustable"],
        sheet: {
          features: [
            "Cobertura sRGB del 99 %",
            "Hub USB de cuatro puertos",
            "Montaje VESA 100",
            "Modo de bajo parpadeo",
          ],
          delivery: "Entrega en 72 horas",
          stock: "40 unidades disponibles",
        },
      }),
      product({
        id: "printcore-m450",
        keywords: "impresora impresoras multifuncional toner láser oficina",
        name: "PrintCore M450",
        category: "Impresión",
        art: "printer",
        price: "L 12,300",
        summary: "Láser monocromática para oficinas que imprimen todos los días.",
        specs: ["45 ppm", "Dúplex automático", "Red y Wi-Fi", "Bandeja 550 hojas"],
        sheet: {
          features: [
            "Ciclo mensual de 100 000 páginas",
            "Tóner de alto rendimiento (12 000 páginas)",
            "Impresión segura con PIN",
            "Panel táctil de 4.3″",
          ],
          delivery: "Entrega en 72 horas · instalación incluida",
          stock: "12 unidades disponibles",
        },
      }),
      product({
        id: "netlink-ax6000",
        keywords: "router wifi inalámbrico access point switch red",
        name: "NetLink AX6000",
        category: "Redes",
        art: "router",
        price: "L 6,900",
        summary: "Cobertura estable para cuarenta dispositivos sin equipo de red dedicado.",
        specs: ["Wi-Fi 6", "6 Gbps", "8 puertos Gigabit", "VLAN y VPN"],
        sheet: {
          features: [
            "Hasta 120 clientes simultáneos",
            "Dos puertos 2.5 GbE",
            "Administración en la nube",
            "Red de invitados aislada",
          ],
          delivery: "Entrega en 48 horas",
          stock: "27 unidades disponibles",
        },
      }),
      product({
        id: "visionbeam-4k",
        keywords: "proyector proyectores videobeam sala de reuniones aula",
        name: "VisionBeam 4K",
        category: "Audio y video",
        art: "projector",
        tag: "Nuevo",
        price: "L 27,500",
        summary: "Proyección láser para salas de reuniones y aulas con luz de día.",
        specs: ["4K UHD", "3 500 lúmenes", "Láser 20 000 h", "HDMI · USB-C"],
        sheet: {
          features: [
            "Corrección de geometría en cuatro esquinas",
            "Encendido en ocho segundos",
            "Altavoces de 2 × 10 W",
            "Control por red",
          ],
          delivery: "Entrega en 5 días · montaje opcional",
          stock: "8 unidades disponibles",
        },
      }),
      product({
        id: "powerhub-pro",
        keywords: "ups respaldo batería regulador energía servidor",
        name: "PowerHub Pro",
        category: "Energía",
        art: "ups",
        price: "L 18,200",
        summary: "Respaldo de doble conversión para servidores y equipos críticos.",
        specs: ["3 000 VA", "Doble conversión", "Rack 2U", "Gestión SNMP"],
        sheet: {
          features: [
            "Autonomía de 22 minutos a media carga",
            "Baterías reemplazables en caliente",
            "Pantalla LCD y apagado programado",
            "Ampliable con banco externo",
          ],
          delivery: "Entrega en 5 días",
          stock: "6 unidades disponibles",
        },
      }),
      product({
        id: "orbitdesk-ergo",
        keywords: "silla sillas mobiliario escritorio equipo de oficina ergonómica",
        name: "OrbitDesk Ergo",
        category: "Oficina",
        art: "chair",
        price: "L 4,750",
        summary: "La silla que sostiene ocho horas de trabajo sin convertirse en una queja.",
        specs: ["Malla transpirable", "Soporte lumbar", "Brazos 4D", "Hasta 120 kg"],
        sheet: {
          features: [
            "Ajuste de altura, profundidad e inclinación",
            "Base de aluminio pulido",
            "Ruedas silenciosas para piso duro",
            "Ensamblada y entregada lista para usar",
          ],
          delivery: "Entrega en 72 horas · armado incluido",
          stock: "36 unidades disponibles",
        },
      }),
      product({
        id: "orbitkit-esencial",
        keywords: "teclado mouse periféricos accesorios equipo de oficina",
        name: "OrbitKit Esencial",
        category: "Accesorios",
        art: "accessory",
        price: "L 2,180",
        summary: "Teclado, mouse y base en un solo código de compra para altas de personal.",
        specs: ["Teclado inalámbrico", "Mouse silencioso", "Base para laptop", "Un receptor"],
        sheet: {
          features: [
            "Un solo receptor para ambos periféricos",
            "Autonomía de 18 meses",
            "Base con inclinación de seis posiciones",
            "Empaque individual, listo para entregar",
          ],
          delivery: "Entrega en 24 horas",
          stock: "84 kits disponibles",
        },
      }),
      product({
        id: "orbitcam-360",
        keywords: "cámara camara videovigilancia cctv seguridad",
        name: "OrbitCam 360",
        category: "Seguridad",
        art: "camera",
        price: "Consultar",
        availability: "Bajo pedido",
        summary: "Cámara panorámica con analítica local para accesos y bodegas.",
        specs: ["360° · 8 MP", "Visión nocturna", "PoE", "Analítica en el borde"],
        sheet: {
          features: [
            "Detección de línea y de zona",
            "Almacenamiento local en microSD",
            "Carcasa IP66",
            "Integración con NVR estándar",
          ],
          delivery: "Bajo pedido · 10 a 15 días",
          stock: "Sujeto a proyecto",
        },
      }),
    ],
    sheet: {
      quote: "Agregar a cotización",
      buy: "Comprar ahora",
      note: "Demostración: no hay carrito ni pasarela de pago detrás de estos botones.",
      added: "Agregado a la cotización",
    },
  },

  compare: {
    label: "Comparador",
    title: "Compara y elige mejor.",
    text: "Elige hasta tres equipos y míralos lado a lado. En móvil se recorre en horizontal.",
    limit: 3,
    rows: ["Pantalla", "Procesador", "RAM", "Almacenamiento", "Peso", "Garantía", "Precio"],
    items: [
      {
        id: "air-13",
        name: "OrbitBook Air 13",
        art: "laptop",
        values: ["13.3″ FHD+", "Core Ultra 5", "16 GB", "512 GB SSD", "0.99 kg", "2 años", "L 22,400"],
      },
      {
        id: "pro-14",
        name: "OrbitBook Pro 14",
        art: "laptop",
        values: ["14″ 2.8K", "Core Ultra 7", "16 GB", "512 GB SSD", "1.29 kg", "2 años", "L 29,990"],
      },
      {
        id: "max-16",
        name: "OrbitBook Max 16",
        art: "laptop",
        values: ["16″ 3.2K", "Core Ultra 9", "32 GB", "1 TB SSD", "1.86 kg", "3 años", "L 44,900"],
      },
      {
        id: "desk-mini",
        name: "OrbitDesk Mini",
        art: "desktop",
        values: ["No incluye", "Core Ultra 5", "16 GB", "512 GB SSD", "1.2 kg", "3 años", "L 17,600"],
      },
      {
        id: "station-24",
        name: "OrbitStation 24",
        art: "aio",
        values: ["24″ FHD", "Core Ultra 7", "16 GB", "1 TB SSD", "5.4 kg", "3 años", "L 26,800"],
      },
    ],
    hint: "Selecciona hasta tres equipos",
  },

  configurator: {
    label: "Configurador",
    title: "Equipa tu empresa.",
    text:
      "Dinos qué vas a equipar y para cuánta gente. Preparamos la configuración y la convertimos " +
      "en una propuesta.",
    spaces: [
      { id: "oficina", name: "Oficina", note: "Puestos de trabajo fijos" },
      { id: "reuniones", name: "Sala de reuniones", note: "Proyección y videollamada" },
      { id: "laboratorio", name: "Laboratorio", note: "Equipo de cómputo intensivo" },
      { id: "educativo", name: "Centro educativo", note: "Aulas y laboratorios" },
      { id: "sucursal", name: "Sucursal", note: "Atención y punto de venta" },
      { id: "remoto", name: "Equipo remoto", note: "Entrega a domicilio" },
    ],
    peopleLabel: "¿Cuántas personas?",
    people: { min: 1, max: 250, step: 1, value: 20 },
    needsLabel: "¿Qué necesitas?",
    /* `per` is how many units each person needs; `each` is one unit per N
       people. The two rules cover every line the configurator produces. */
    needs: [
      { id: "computadoras", name: "Computadoras", unit: "laptops", per: 1, price: 25400, checked: true },
      { id: "monitores", name: "Monitores", unit: "monitores", per: 1, price: 8450, checked: true },
      { id: "impresoras", name: "Impresoras", unit: "impresoras", each: 10, price: 12300, checked: true },
      { id: "red", name: "Networking", unit: "solución de red", fixed: 1, price: 24900, checked: true },
      { id: "ups", name: "UPS", unit: "respaldos", per: 1, price: 4200, checked: true },
    ],
    submit: "Generar cotización",
    result: {
      title: "Configuración preparada",
      note: "Estimado de referencia. La propuesta final se ajusta al modelo y al volumen.",
      action: "Recibir cotización",
    },
  },

  promo: {
    label: "Promoción",
    title: "Renueva tu oficina.",
    text:
      "Un paquete cerrado para equipos de diez personas: cómputo, pantallas, impresión y red, " +
      "instalado y funcionando.",
    items: [
      "10 laptops OrbitBook Pro 14",
      "10 monitores OrbitView 27",
      "1 impresora empresarial PrintCore M450",
      "1 solución Wi-Fi NetLink para toda la planta",
      "Instalación y configuración incluidas",
    ],
    price: { note: "Desde", value: "L 396,500", detail: "IVA incluido · financiamiento a 12 meses disponible" },
    action: { label: "Solicitar propuesta", href: "#cotizar" },
  },

  brands: {
    title: "Trabajamos con las marcas que tu empresa ya conoce.",
    note:
      "Marcas ficticias creadas para esta demostración. Un sitio en producción mostraría aquí las " +
      "marcas que realmente distribuye.",
    items: ["Nordkil", "Vantec", "Lumidex", "Kestrel", "Arqon", "Bytrix"],
  },

  why: {
    label: "Por qué comprar aquí",
    title: "Cuatro razones, todas verificables.",
    items: [
      {
        art: "shield",
        name: "Garantía",
        text: "Productos respaldados y soporte posterior a la compra, con reemplazo mientras dura el diagnóstico.",
      },
      {
        art: "truck",
        name: "Entrega",
        text: "Distribución rápida para empresas y proyectos, con despacho promedio en 48 horas.",
      },
      {
        art: "advice",
        name: "Asesoría",
        text: "Te ayudamos a elegir el equipo correcto para el trabajo que vas a hacer con él.",
      },
      {
        art: "b2b",
        name: "Soluciones B2B",
        text: "Cotizaciones, licitaciones y proyectos adaptados al tamaño de cada organización.",
      },
    ],
  },

  flow: {
    title: "No vendemos cajas. Equipamos operaciones.",
    text:
      "El equipo es la parte fácil. Lo que hace la diferencia es lo que pasa antes de comprarlo y " +
      "después de instalarlo.",
    steps: [
      { name: "Necesidad", text: "Qué se va a hacer con el equipo, y para cuánta gente." },
      { name: "Asesoría", text: "Qué modelo lo resuelve y cuál está de más." },
      { name: "Cotización", text: "Propuesta cerrada, con tiempos y condiciones." },
      { name: "Suministro", text: "Despacho coordinado, en una sola entrega." },
      { name: "Instalación", text: "Puesta en marcha y configuración en sitio." },
      { name: "Soporte", text: "Acompañamiento posterior y reposición de garantía." },
    ],
  },

  industries: {
    title: "Soluciones adaptadas al tamaño y operación de cada organización.",
    items: [
      "Empresas",
      "Colegios",
      "Universidades",
      "Clínicas",
      "Hoteles",
      "Restaurantes",
      "Constructoras",
      "Gobierno",
      "Pymes",
    ],
  },

  voices: {
    label: "Clientes",
    title: "Lo que dicen las operaciones que equipamos.",
    note: "Testimonios ficticios escritos para esta demostración.",
    items: [
      {
        quote:
          "Necesitábamos equipar nuestra nueva oficina sin coordinar cinco proveedores distintos. " +
          "Llegó todo en una entrega y funcionando el mismo día.",
        name: "Director de Operaciones",
        company: "Grupo Aldeva · 60 puestos",
      },
      {
        quote:
          "Nos dijeron que el modelo que habíamos pedido era más de lo que necesitábamos. " +
          "Terminamos gastando menos de lo presupuestado.",
        name: "Gerente Administrativa",
        company: "Colegio San Marcelo",
      },
      {
        quote:
          "La cotización llegó en menos de un día y con los tiempos de entrega por escrito. " +
          "Con eso pudimos cerrar la licitación.",
        name: "Jefe de Compras",
        company: "Constructora Perenne",
      },
    ],
  },

  metrics: [
    { to: 2500, prefix: "+", display: "+2,500", label: "Equipos entregados" },
    { to: 180, prefix: "+", display: "+180", label: "Empresas atendidas" },
    { to: 48, suffix: " h", display: "48 h", label: "Tiempo promedio de despacho" },
    { to: 98, suffix: "%", display: "98%", label: "Clientes recurrentes" },
  ],

  quote: {
    label: "Cotización",
    title: "¿Necesitas varios equipos?",
    text: "Cuéntanos qué necesitas y preparamos una propuesta adaptada a tu empresa.",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", autocomplete: "name", required: true },
      { name: "empresa", label: "Empresa", type: "text", autocomplete: "organization", required: true },
      { name: "correo", label: "Correo", type: "email", autocomplete: "email", required: true },
      { name: "telefono", label: "Teléfono", type: "tel", autocomplete: "tel", required: false },
    ],
    need: {
      label: "¿Qué necesitas?",
      options: ["Computación", "Impresión", "Redes", "Audio y video", "Energía", "Proyecto completo"],
    },
    amount: { label: "Cantidad aproximada", options: ["1 – 5", "6 – 20", "21 – 50", "Más de 50"] },
    submit: "Recibir cotización",
    disclaimer: "Formulario de demostración: no envía nada ni guarda lo que escribes.",
    done: "Solicitud registrada. En una implementación real, esta cotización llegaría al equipo comercial de inmediato.",
  },

  pitch:
    "Buscador, ficha de producto, comparador y configurador: **todo funciona aquí, sin backend**. " +
    "Con el catálogo y el inventario de tu empresa detrás, funcionaría igual — con datos reales.",

  cta: {
    title: "El equipo que tu empresa necesita. Sin complicaciones.",
    text: "Desde un dispositivo hasta la implementación tecnológica de toda una operación.",
    primary: { label: "Explorar catálogo", href: "#catalogo" },
    secondary: { label: "Solicitar cotización", href: "#cotizar" },
  },

  footer: {
    lines: ["Bulevar Morazán, Tegucigalpa · Honduras", "Lunes a viernes · 8:00 – 17:30"],
    columns: [
      {
        title: "Catálogo",
        links: [
          { label: "Equipos destacados", href: "#catalogo" },
          { label: "Categorías", href: "#categorias" },
          { label: "Comparador", href: "#comparar" },
        ],
      },
      {
        title: "Empresas",
        links: [
          { label: "Equipar mi empresa", href: "#equipar" },
          { label: "Cómo trabajamos", href: "#empresas" },
          { label: "Cotizar", href: "#cotizar" },
        ],
      },
    ],
  },
};
