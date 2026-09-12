/**
 * The service pages — one per thing a buyer actually types into Google.
 *
 * The portfolio home page sells CoreStruct. These sell a search: somebody types
 * "diseño de páginas web en Honduras", and the page that answers them has to be
 * about that and only that. One page cannot rank for three different queries —
 * it competes with itself, and Google picks whichever of the three it thinks
 * the page is most about, which is never all of them. So there is one page per
 * query, each with its own angle, and none of them repeats another.
 *
 * That last part is the constraint that shapes everything below. Two pages that
 * say the same thing in different words are duplicates, and Google indexes one
 * and drops the other. `desarrollo-web-tegucigalpa` therefore is not
 * `diseno-de-paginas-web-honduras` with the city swapped in: it is about what
 * changes when the client is in the same city — meeting in person, handing over
 * the site sitting next to whoever will run it — because that is the part a
 * national page genuinely cannot claim.
 *
 * `faq` is not decoration either. It becomes a `FAQPage` in the JSON-LD, and a
 * question answered in full is what an AI summary quotes. The questions are the
 * ones that arrive by WhatsApp before anyone asks for a price, which is also
 * why they are phrased the way a client phrases them rather than the way a
 * studio would.
 *
 * Add a page here and it builds, mirrors into English and enters the sitemap on
 * the next `npm run build`. Two things have to travel with it: an entry in
 * `src/i18n/en/servicios.js` for every Spanish string it introduces, and an
 * honest answer to whether CoreStruct does the thing the page is selling.
 */

/**
 * The `#servicios` band of the home page.
 *
 * This was a page, `/servicios/`: a hub whose only job was to introduce the
 * three below it. It is a band of `index.html` now, rendered by
 * `build-content.mjs`, and the old URL 301s to the anchor in `.htaccess`.
 * The site is one scroll with anchors, and the hub was the one place a click
 * left it.
 *
 * `title`, `description` and `slug` are what a page needed and the band does
 * not. They stay because nothing else holds them and because the day one of
 * these grows past a band again, it needs them back.
 */
export const serviciosIndex = {
  slug: "",
  title: "Servicios de desarrollo web y software en Honduras | CoreStruct",
  description:
    "Diseño de páginas web, desarrollo de sistemas a medida y desarrollo web en " +
    "Tegucigalpa. Servicios de CoreStruct para empresas e instituciones en todo Honduras.",
  h1: "Servicios de desarrollo web y software en Honduras",
  lede:
    "Tres formas de trabajar con nosotros, según lo que necesite tu operación: " +
    "un sitio que te presente, un sistema que te ordene por dentro, o las dos cosas.",
  intro:
    "CoreStruct es un estudio de desarrollo con base en Tegucigalpa que trabaja " +
    "para empresas e instituciones de todo Honduras y de Latinoamérica. No " +
    "vendemos plantillas: cada proyecto se construye sobre cómo opera de verdad " +
    "quien lo va a usar, y eso empieza por entender la operación antes de " +
    "escribir una línea de código.",
};

export const servicios = [
  /* ------------------------------------------------------------------- 01 */
  {
    slug: "diseno-de-paginas-web-honduras",
    serviceType: "Diseño de páginas web",
    title: "Diseño de páginas web en Honduras | CoreStruct",
    description:
      "Diseñamos páginas web para empresas e instituciones en Honduras: rápidas, " +
      "claras en el teléfono y pensadas para que un cliente te escriba. Cotiza tu sitio.",
    h1: "Diseño de páginas web en Honduras",
    lede:
      "Un sitio que carga rápido, se entiende en el teléfono y le responde a tu " +
      "cliente lo que quiere saber antes de que te escriba.",

    intro: {
      eyebrow: "El problema",
      title: "La mayoría de las páginas no pierden clientes por feas.",
      body:
        "Los pierden porque tardan en abrir, porque en el teléfono hay que hacer " +
        "zoom para leer, o porque el visitante llega buscando un precio, un " +
        "horario o un número de WhatsApp y tiene que adivinar dónde está. " +
        "Diseñar bien un sitio es, antes que nada, decidir qué ve primero " +
        "alguien que llegó con una pregunta y treinta segundos de paciencia.",
    },

    sections: [
      {
        title: "Diseñado para cómo se navega en Honduras",
        body:
          "Aquí la mayoría del tráfico llega desde un teléfono y con datos " +
          "móviles, no desde una oficina con fibra. Eso cambia decisiones " +
          "concretas: el peso de las imágenes, cuántas fuentes carga la página, " +
          "si el menú funciona con una sola mano. Nuestros sitios se construyen " +
          "en HTML, CSS y JavaScript estáticos, sin gestores pesados encima, " +
          "porque un sitio que abre en un segundo convierte más que uno bonito " +
          "que tarda seis.",
      },
      {
        title: "Y para cómo se cierra una venta aquí",
        body:
          "En Honduras el primer contacto casi nunca es un formulario: es un " +
          "mensaje de WhatsApp. Por eso el camino desde cualquier punto del " +
          "sitio hasta una conversación real es lo primero que diseñamos, y no " +
          "un botón que se agrega al final. El formulario sigue existiendo para " +
          "quien prefiere escribir, y llega a tu correo con el proyecto ya " +
          "clasificado por tipo.",
      },
      {
        title: "Y para que Google lo pueda encontrar",
        body:
          "Un sitio que no aparece en las búsquedas es un folleto caro. Cada " +
          "página que entregamos sale con su título y su descripción escritos " +
          "para lo que la gente busca, datos estructurados que le explican a " +
          "Google qué es tu empresa y dónde opera, sitemap, y una versión en " +
          "inglés cuando el negocio la necesita. Es trabajo que no se ve en " +
          "pantalla y es la diferencia entre existir y ser encontrado.",
      },
    ],

    includes: {
      title: "Qué incluye",
      items: [
        {
          name: "Diseño propio",
          body:
            "Nada de plantillas compradas. La estructura y la identidad se " +
            "arman sobre tu marca y sobre lo que tu cliente necesita decidir.",
        },
        {
          name: "Adaptación a teléfono, tableta y escritorio",
          body:
            "Una sola versión que funciona en las tres, revisada en pantallas " +
            "reales y no solo en el simulador del navegador.",
        },
        {
          name: "Velocidad de carga",
          body:
            "Imágenes comprimidas, fuentes reducidas a los caracteres que la " +
            "página usa, y nada que el visitante no vaya a ver descargándose " +
            "antes de tiempo.",
        },
        {
          name: "Preparación para buscadores",
          body:
            "Títulos, descripciones, datos estructurados, sitemap y robots.txt " +
            "configurados desde el primer día, no como un extra posterior.",
        },
        {
          name: "Contacto directo",
          body:
            "WhatsApp, correo y formulario, conectados a donde de verdad " +
            "atiendes, con copia a tu bandeja de cada solicitud.",
        },
        {
          name: "Accesibilidad",
          body:
            "Contraste suficiente, navegación con teclado y textos alternativos. " +
            "Sirve para quien lee con lector de pantalla y también para Google.",
        },
      ],
    },

    process: {
      title: "Cómo trabajamos",
      steps: [
        {
          name: "Conversación",
          body:
            "Una llamada o un mensaje. Qué vendes, a quién, y qué debería " +
            "pasar cuando alguien entre al sitio. Sin costo y sin compromiso.",
        },
        {
          name: "Propuesta",
          body:
            "Alcance, plazo y precio por escrito, con lo que entra y lo que no. " +
            "Si algo queda fuera, queda fuera en el documento y no en la factura.",
        },
        {
          name: "Diseño",
          body:
            "Te mostramos la página real en el navegador, no una imagen de cómo " +
            "se vería. Los ajustes se hacen sobre eso.",
        },
        {
          name: "Construcción",
          body:
            "Se arma el sitio completo con tus textos e imágenes, y se revisa " +
            "en teléfono antes de enseñártelo terminado.",
        },
        {
          name: "Publicación",
          body:
            "Dominio, certificado de seguridad, correo corporativo y alta en " +
            "Google Search Console. Te entregamos el sitio funcionando, no un " +
            "archivo comprimido.",
        },
      ],
    },

    faq: [
      {
        q: "¿Cuánto cuesta una página web en Honduras?",
        a:
          "Depende de cuántas páginas lleve y de si necesita funciones como " +
          "reservas, catálogo o pagos. Un sitio informativo de una empresa es " +
          "un proyecto distinto de una plataforma con área de clientes. Te " +
          "damos un precio cerrado por escrito después de la primera " +
          "conversación, y ese precio no se mueve durante el proyecto.",
      },
      {
        q: "¿Cuánto tarda?",
        a:
          "Una landing page suele tomar entre una y dos semanas. Un sitio " +
          "corporativo completo, entre tres y seis. El plazo depende sobre todo " +
          "de qué tan rápido llegan tus textos e imágenes, así que el " +
          "calendario se acuerda junto con esa entrega.",
      },
      {
        q: "¿Incluye el dominio y el hosting?",
        a:
          "Los configuramos y te acompañamos en la contratación, pero quedan a " +
          "tu nombre y bajo tu cuenta. El dominio de tu empresa es tuyo: nadie " +
          "debería poder dejarte sin sitio por un desacuerdo.",
      },
      {
        q: "¿Puedo actualizar el contenido yo mismo?",
        a:
          "Sí, si el proyecto lo necesita. Cuando el contenido cambia seguido " +
          "—noticias, catálogo, precios— montamos un panel para que lo edites " +
          "sin tocar código. Cuando cambia dos veces al año, un panel es una " +
          "complicación que no te conviene pagar, y te lo decimos.",
      },
      {
        q: "¿Aparecerá mi página en Google?",
        a:
          "El sitio sale preparado para que Google lo entienda e indexe, y lo " +
          "damos de alta en Search Console al publicar. Aparecer tarda semanas, " +
          "y posicionarse arriba de la competencia depende además de tu Perfil " +
          "de Empresa, de reseñas y de contenido sostenido. Te explicamos qué " +
          "toca hacer después, sin prometerte un primer lugar que nadie puede " +
          "garantizar.",
      },
      {
        q: "¿Trabajan con empresas fuera de Tegucigalpa?",
        a:
          "Sí. Trabajamos con clientes en San Pedro Sula, La Ceiba, Choluteca, " +
          "Comayagua y el resto del país, y también fuera de Honduras. Todo el " +
          "proceso funciona por videollamada y mensajería.",
      },
    ],
  },

  /* ------------------------------------------------------------------- 02 */
  {
    slug: "desarrollo-de-sistemas-honduras",
    serviceType: "Desarrollo de software a medida",
    title: "Desarrollo de sistemas a medida en Honduras | CoreStruct",
    description:
      "Desarrollamos sistemas empresariales a medida en Honduras: inventarios, " +
      "expedientes, reportes y automatización de procesos. Software hecho para tu operación.",
    h1: "Desarrollo de sistemas a medida en Honduras",
    lede:
      "Software construido sobre cómo trabaja tu empresa, en lugar de una " +
      "empresa reacomodada para caber en un software.",

    intro: {
      eyebrow: "El problema",
      title: "Casi toda operación termina corriendo sobre Excel y memoria.",
      body:
        "Un archivo que alguien actualiza, otro que se copió hace tres meses, y " +
        "un par de personas que son las únicas que saben cómo va realmente el " +
        "inventario. Funciona hasta que crece, hasta que esa persona se va, o " +
        "hasta que alguien pide un reporte de los últimos seis meses y no hay " +
        "forma de armarlo sin sentarse una tarde entera.",
    },

    sections: [
      {
        title: "Qué es un sistema a medida",
        body:
          "Es un programa hecho para una sola operación: la tuya. En lugar de " +
          "adaptar tus procesos a lo que un producto enlatado permite, se " +
          "construyen las pantallas, los permisos y los reportes que tu equipo " +
          "ya necesita. Sale más caro que una licencia mensual el primer año, y " +
          "deja de salirlo cuando el producto enlatado te obliga a contratar a " +
          "alguien para hacer a mano lo que no cubre.",
      },
      {
        title: "Lo que suele resolver",
        body:
          "Control de inventario y bodegas con existencias reales por sucursal. " +
          "Expedientes de clientes, pacientes o estudiantes en un solo lugar. " +
          "Flujos de aprobación donde cada solicitud tiene un estado y un " +
          "responsable visible. Reportes que se generan solos en lugar de " +
          "armarse a mano. Y accesos por rol, para que cada quien vea lo que le " +
          "toca y nada más.",
      },
      {
        title: "Construido para que lo opere tu gente",
        body:
          "Un sistema que el equipo no entiende es un sistema que el equipo " +
          "esquiva, y a los dos meses vuelve el Excel paralelo. Por eso " +
          "diseñamos las pantallas con las palabras que ya usa tu operación, " +
          "entregamos capacitación al personal que lo va a usar todos los días, " +
          "y dejamos el sistema andando con tus datos reales adentro, no con " +
          "datos de ejemplo.",
      },
      {
        title: "Y para que siga siendo tuyo",
        body:
          "El código es tuyo y queda documentado. No dependes de nosotros para " +
          "seguir existiendo: si mañana decides moverlo a otro equipo, se puede " +
          "mover. Es una condición incómoda para un proveedor y es la correcta " +
          "para un cliente.",
      },
    ],

    includes: {
      title: "Qué incluye",
      items: [
        {
          name: "Levantamiento del proceso",
          body:
            "Antes de programar, entender. Cómo entra el trabajo, por dónde " +
            "pasa, quién aprueba y dónde se traba hoy.",
        },
        {
          name: "Diseño de la base de datos",
          body:
            "La estructura donde vive la información, pensada para que los " +
            "reportes que vas a pedir en dos años se puedan armar.",
        },
        {
          name: "Pantallas y permisos",
          body:
            "Un perfil por tipo de usuario, con acceso a lo suyo. Bodega ve " +
            "bodega; gerencia ve todo; nadie ve lo que no le corresponde.",
        },
        {
          name: "Reportes",
          body:
            "Los que pides al inicio y la posibilidad de agregar otros después " +
            "sin rehacer el sistema.",
        },
        {
          name: "Capacitación y manual",
          body:
            "Sesiones con quienes lo van a usar y un documento al que puedan " +
            "volver cuando entre alguien nuevo.",
        },
        {
          name: "Soporte posterior",
          body:
            "Un periodo de acompañamiento después de arrancar, porque los " +
            "ajustes reales aparecen en la primera semana de uso.",
        },
      ],
    },

    process: {
      title: "Cómo trabajamos",
      steps: [
        {
          name: "Diagnóstico",
          body:
            "Nos sentamos con quien opera el proceso, no solo con quien lo " +
            "dirige. La diferencia entre lo que se supone que pasa y lo que " +
            "pasa es donde está el proyecto.",
        },
        {
          name: "Alcance por escrito",
          body:
            "Qué va a hacer el sistema en su primera versión, qué no, y qué " +
            "queda para una segunda etapa. Firmado antes de empezar.",
        },
        {
          name: "Entregas parciales",
          body:
            "Cada pocas semanas ves un módulo funcionando de verdad. Los " +
            "sistemas que se enseñan completos al final son los que se " +
            "entregan equivocados.",
        },
        {
          name: "Pruebas con datos reales",
          body:
            "Se carga información verdadera y se opera en paralelo con el " +
            "método anterior, hasta que el sistema demuestre que no pierde nada.",
        },
        {
          name: "Arranque y acompañamiento",
          body:
            "Puesta en marcha, capacitación y un periodo de soporte con " +
            "respuesta rápida mientras el equipo se acostumbra.",
        },
      ],
    },

    faq: [
      {
        q: "¿Cuánto cuesta desarrollar un sistema en Honduras?",
        a:
          "Varía mucho según cuántos procesos cubra y cuántos tipos de usuario " +
          "tenga. Un módulo puntual —control de inventario, por ejemplo— es un " +
          "proyecto de semanas; un sistema que cubre toda la operación es de " +
          "meses. Lo que sí es fijo es la forma: precio cerrado por etapa, " +
          "acordado antes de empezar esa etapa.",
      },
      {
        q: "¿Es mejor un sistema a medida o uno ya hecho?",
        a:
          "Si tu proceso es igual al de todos, compra el producto ya hecho: es " +
          "más barato y está probado. El desarrollo a medida vale la pena " +
          "cuando tu forma de trabajar es parte de tu ventaja, o cuando ningún " +
          "producto del mercado cubre lo que haces sin obligarte a llevar " +
          "procesos por fuera. Te lo decimos con honestidad en la primera " +
          "conversación, aunque la respuesta sea que no nos necesitas.",
      },
      {
        q: "¿Funciona sin internet?",
        a:
          "Se puede construir para que sí, y a veces hay que hacerlo. Si tienes " +
          "bodegas o sucursales con conexión inestable, el sistema se diseña " +
          "para seguir operando y sincronizar cuando vuelve el enlace. Es una " +
          "decisión que se toma al inicio, porque cambia la arquitectura.",
      },
      {
        q: "¿Se conecta con lo que ya usamos?",
        a:
          "En general sí. La mayoría de los sistemas contables y de facturación " +
          "permiten importar o exportar información, y cuando existe una " +
          "integración directa la usamos. Revisamos caso por caso qué permite " +
          "el software que ya tienes antes de prometer una conexión.",
      },
      {
        q: "¿Quién se queda con el código?",
        a:
          "Tú. El código fuente y la base de datos son del cliente, con su " +
          "documentación. Mantenemos el sistema si quieres que lo mantengamos, " +
          "no porque no tengas alternativa.",
      },
    ],
  },

  /* ------------------------------------------------------------------- 03 */
  {
    slug: "desarrollo-web-tegucigalpa",
    serviceType: "Desarrollo web",
    title: "Desarrollo web en Tegucigalpa | CoreStruct",
    description:
      "Desarrollo web en Tegucigalpa: sitios, plataformas y sistemas para empresas " +
      "de la capital, con reuniones presenciales y entrega acompañada. Hablemos.",
    h1: "Desarrollo web en Tegucigalpa",
    lede:
      "Estamos en la capital. Para un proyecto que vale meses de trabajo, poder " +
      "sentarse en la misma mesa sigue cambiando el resultado.",

    intro: {
      eyebrow: "Por qué importa la ciudad",
      title: "Contratar desarrollo es contratar a alguien con quien vas a discutir.",
      body:
        "No en el mal sentido: un proyecto bien hecho tiene desacuerdos, " +
        "cambios de opinión y decisiones que se toman mejor mirándose a la " +
        "cara. Trabajamos con clientes de todo el país por videollamada sin " +
        "problema, pero cuando el cliente está en Tegucigalpa aprovechamos lo " +
        "que la distancia cero permite, y no es poco.",
    },

    sections: [
      {
        title: "Reuniones donde está la operación",
        body:
          "Para un sitio informativo basta una llamada. Para un sistema que " +
          "va a manejar tu bodega, tu caja o tus expedientes, conviene que " +
          "alguien vaya a ver cómo se trabaja hoy. Media hora parado en el " +
          "lugar donde ocurre el proceso enseña cosas que no salen en ninguna " +
          "reunión virtual, y esas cosas son las que hacen que el sistema se " +
          "use o se abandone.",
      },
      {
        title: "Capacitación presencial al equipo",
        body:
          "Entregamos el sistema sentándonos con la gente que lo va a operar " +
          "todos los días: caja, bodega, recepción, administración. Es la parte " +
          "que más decide si un proyecto se adopta, y la que peor funciona por " +
          "videollamada con diez personas alrededor de una laptop.",
      },
      {
        title: "Lo mismo que hacemos para todo el país",
        body:
          "Estar en Tegucigalpa no define lo que construimos, solo cómo lo " +
          "acompañamos. El trabajo es el mismo que entregamos en San Pedro " +
          "Sula, La Ceiba o fuera de Honduras: sitios corporativos, portales " +
          "institucionales, plataformas y sistemas internos, con el mismo " +
          "estándar de velocidad, accesibilidad y preparación para buscadores.",
      },
    ],

    includes: {
      title: "Qué hacemos",
      items: [
        {
          name: "Sitios corporativos e institucionales",
          body:
            "La cara pública de una empresa, una fundación o una institución, " +
            "con la estructura que su tipo de visitante necesita.",
        },
        {
          name: "Landing pages de campaña",
          body:
            "Una sola página con un solo objetivo, para pauta o lanzamiento, " +
            "medida desde el primer día.",
        },
        {
          name: "Portales educativos",
          body:
            "Oferta académica, admisiones, calendario y áreas para estudiantes " +
            "y padres, administrables por el personal del centro.",
        },
        {
          name: "Portales gubernamentales y públicos",
          body:
            "Transparencia, trámites y datos abiertos, con los requisitos de " +
            "accesibilidad que un sitio público debe cumplir.",
        },
        {
          name: "Cartas digitales para restaurantes",
          body:
            "Menú que se actualiza desde el teléfono, se abre con código QR y " +
            "no obliga al cliente a descargar nada.",
        },
        {
          name: "Sistemas internos y automatización",
          body:
            "Inventarios, expedientes, aprobaciones y reportes; el trabajo " +
            "repetitivo que hoy consume horas de alguien.",
        },
      ],
    },

    process: {
      title: "Cómo empieza",
      steps: [
        {
          name: "Escríbenos",
          body:
            "Por WhatsApp o correo, con una idea general de lo que necesitas. " +
            "No hace falta que la tengas clara todavía.",
        },
        {
          name: "Nos reunimos",
          body:
            "En tu oficina, en un café o por videollamada, como prefieras. La " +
            "primera reunión no se cobra.",
        },
        {
          name: "Recibes una propuesta",
          body:
            "Alcance, plazo y precio por escrito, normalmente dentro de los " +
            "tres días siguientes.",
        },
      ],
    },

    faq: [
      {
        q: "¿Atienden solo en Tegucigalpa?",
        a:
          "No. Tegucigalpa es donde estamos, no el límite de donde trabajamos. " +
          "Tenemos proyectos con clientes de otras ciudades del país y de " +
          "fuera de Honduras; lo que cambia es que las reuniones son por " +
          "videollamada en lugar de presenciales.",
      },
      {
        q: "¿Se puede tener una reunión presencial antes de contratar?",
        a:
          "Sí, y es lo que recomendamos para proyectos grandes. La primera " +
          "reunión no tiene costo ni compromiso, y sirve tanto para que veas " +
          "cómo trabajamos como para que nosotros entendamos si somos el " +
          "equipo correcto para lo que necesitas.",
      },
      {
        q: "¿Trabajan con empresas pequeñas?",
        a:
          "Sí. Un negocio de tres personas con un proceso claro suele ser un " +
          "mejor proyecto que una empresa grande sin decisiones tomadas. Lo " +
          "que sí hacemos es ajustar el alcance al presupuesto real y decirlo " +
          "de frente cuando algo no cabe.",
      },
      {
        q: "¿En qué idiomas entregan los sitios?",
        a:
          "Español e inglés. Todo lo que construimos puede salir en las dos " +
          "versiones, enlazadas correctamente para que Google entienda que son " +
          "el mismo sitio en dos idiomas y muestre la que corresponde a cada " +
          "visitante. Este mismo sitio funciona así.",
      },
    ],
  },
];
