/**
 * English for the service pages under `/servicios/`.
 *
 * Scoped rather than global: "Diseño" is "Design" here and "Design" is a
 * discipline elsewhere in the demos, and "Reportes" is "Reports" for a business
 * system and "Reporting" for a ministry's transparency page. A scoped file lets
 * each be right without arguing with the other.
 *
 * Two things these translations do not do.
 *
 * They do not drop Honduras. The English mirror of the home page trades the
 * country for the region, because an English-speaking buyer shopping for a
 * nearshore team searches for the region. These pages are different: somebody
 * reading them in English is usually already looking at this specific studio,
 * and where it sits is the fact they are checking.
 *
 * And they do not soften the honest answers. "We cannot promise you a first
 * place" is the line most likely to be cut in translation and the one most
 * worth keeping — a page that promises a ranking is a page that will be
 * measured against the promise.
 */

export const scope = "servicios";

export default {
  /* ------------------------------------------------------------- metadata */

  "Servicios de desarrollo web y software en Honduras | CoreStruct":
    "Web Development & Software Services in Honduras | CoreStruct",
  "Diseño de páginas web en Honduras | CoreStruct":
    "Web Design in Honduras | CoreStruct",
  "Desarrollo de sistemas a medida en Honduras | CoreStruct":
    "Custom Software Development in Honduras | CoreStruct",
  "Desarrollo web en Tegucigalpa | CoreStruct":
    "Web Development in Tegucigalpa | CoreStruct",

  "Diseño de páginas web, desarrollo de sistemas a medida y desarrollo web en Tegucigalpa. Servicios de CoreStruct para empresas e instituciones en todo Honduras.":
    "Web design, custom software development and web development in Tegucigalpa. " +
    "CoreStruct services for companies and institutions across Honduras.",
  "Diseñamos páginas web para empresas e instituciones en Honduras: rápidas, claras en el teléfono y pensadas para que un cliente te escriba. Cotiza tu sitio.":
    "We design websites for companies and institutions in Honduras: fast, clear on a " +
    "phone, and built so a client actually gets in touch. Get a quote for your site.",
  "Desarrollamos sistemas empresariales a medida en Honduras: inventarios, expedientes, reportes y automatización de procesos. Software hecho para tu operación.":
    "We build custom business systems in Honduras: inventory, records, reporting and " +
    "process automation. Software made for how your operation actually runs.",
  "Desarrollo web en Tegucigalpa: sitios, plataformas y sistemas para empresas de la capital, con reuniones presenciales y entrega acompañada. Hablemos.":
    "Web development in Tegucigalpa: sites, platforms and systems for companies in the " +
    "capital, with in-person meetings and a handover we sit through. Let's talk.",

  /* --------------------------------------------------------- shared labels */

  /* "Servicios" itself is already global, in core.js — and so is everything
     the old hub said, because that copy is on the home page now and a scoped
     entry cannot reach a page at the root. See the "services band" section
     there. */
  "El problema": "The problem",
  "Qué incluye": "What it includes",
  "Qué hacemos": "What we do",
  "Cómo trabajamos": "How we work",
  "Cómo empieza": "How it starts",
  "Preguntas frecuentes": "Frequently asked questions",
  "Cotizar mi proyecto": "Get a quote",
  "¿Hablamos de tu proyecto?": "Shall we talk about your project?",
  "Cuéntanos qué necesitas y te respondemos con alcance, plazo y precio por escrito. La primera conversación no tiene costo.":
    "Tell us what you need and we come back with scope, timeline and price in writing. " +
    "The first conversation is free.",
  Ruta: "Breadcrumb",

  /* ------------------------------------------- 01 · web design in Honduras */


  "La mayoría de las páginas no pierden clientes por feas.":
    "Most websites do not lose clients for being ugly.",
  "Los pierden porque tardan en abrir, porque en el teléfono hay que hacer zoom para leer, o porque el visitante llega buscando un precio, un horario o un número de WhatsApp y tiene que adivinar dónde está. Diseñar bien un sitio es, antes que nada, decidir qué ve primero alguien que llegó con una pregunta y treinta segundos de paciencia.":
    "They lose them because they are slow to open, because reading on a phone means " +
    "zooming in, or because the visitor arrived looking for a price, an opening time or a " +
    "WhatsApp number and has to guess where it is. Designing a site well is, before " +
    "anything else, deciding what somebody sees first when they arrive with a question " +
    "and thirty seconds of patience.",

  "Diseñado para cómo se navega en Honduras": "Designed for how people browse in Honduras",
  "Aquí la mayoría del tráfico llega desde un teléfono y con datos móviles, no desde una oficina con fibra. Eso cambia decisiones concretas: el peso de las imágenes, cuántas fuentes carga la página, si el menú funciona con una sola mano. Nuestros sitios se construyen en HTML, CSS y JavaScript estáticos, sin gestores pesados encima, porque un sitio que abre en un segundo convierte más que uno bonito que tarda seis.":
    "Here, most traffic arrives from a phone on mobile data, not from an office on fibre. " +
    "That changes concrete decisions: how heavy the images are, how many fonts the page " +
    "loads, whether the menu works one-handed. Our sites are built in static HTML, CSS and " +
    "JavaScript, with no heavy platform on top, because a site that opens in one second " +
    "converts better than a beautiful one that takes six.",

  "Y para cómo se cierra una venta aquí": "And for how a sale actually closes here",
  "En Honduras el primer contacto casi nunca es un formulario: es un mensaje de WhatsApp. Por eso el camino desde cualquier punto del sitio hasta una conversación real es lo primero que diseñamos, y no un botón que se agrega al final. El formulario sigue existiendo para quien prefiere escribir, y llega a tu correo con el proyecto ya clasificado por tipo.":
    "In Honduras the first contact is almost never a form: it is a WhatsApp message. So the " +
    "path from any point on the site to a real conversation is the first thing we design, " +
    "not a button added at the end. The form still exists for people who prefer to write, " +
    "and it reaches your inbox with the project already sorted by type.",

  "Y para que Google lo pueda encontrar": "And so Google can find it",
  "Un sitio que no aparece en las búsquedas es un folleto caro. Cada página que entregamos sale con su título y su descripción escritos para lo que la gente busca, datos estructurados que le explican a Google qué es tu empresa y dónde opera, sitemap, y una versión en inglés cuando el negocio la necesita. Es trabajo que no se ve en pantalla y es la diferencia entre existir y ser encontrado.":
    "A site that never shows up in search is an expensive brochure. Every page we deliver " +
    "ships with its title and description written for what people actually search, " +
    "structured data telling Google what your company is and where it operates, a sitemap, " +
    "and an English version when the business needs one. It is work nobody sees on screen, " +
    "and it is the difference between existing and being found.",

  "Diseño propio": "Original design",
  "Nada de plantillas compradas. La estructura y la identidad se arman sobre tu marca y sobre lo que tu cliente necesita decidir.":
    "No bought templates. Structure and identity are built around your brand and around " +
    "the decision your client is trying to make.",
  "Adaptación a teléfono, tableta y escritorio": "Phone, tablet and desktop",
  "Una sola versión que funciona en las tres, revisada en pantallas reales y no solo en el simulador del navegador.":
    "One version that works on all three, checked on real screens and not only in the " +
    "browser's simulator.",
  "Velocidad de carga": "Loading speed",
  "Imágenes comprimidas, fuentes reducidas a los caracteres que la página usa, y nada que el visitante no vaya a ver descargándose antes de tiempo.":
    "Compressed images, fonts cut down to the characters the page actually uses, and " +
    "nothing the visitor will not see downloading ahead of time.",
  "Preparación para buscadores": "Search-engine groundwork",
  "Títulos, descripciones, datos estructurados, sitemap y robots.txt configurados desde el primer día, no como un extra posterior.":
    "Titles, descriptions, structured data, sitemap and robots.txt configured from day one, " +
    "not as a later add-on.",
  "Contacto directo": "Direct contact",
  "WhatsApp, correo y formulario, conectados a donde de verdad atiendes, con copia a tu bandeja de cada solicitud.":
    "WhatsApp, email and a form, wired to where you actually answer, with a copy of every " +
    "request in your inbox.",
  Accesibilidad: "Accessibility",
  "Contraste suficiente, navegación con teclado y textos alternativos. Sirve para quien lee con lector de pantalla y también para Google.":
    "Sufficient contrast, keyboard navigation and alternative text. It serves anyone " +
    "reading with a screen reader, and it serves Google too.",

  Conversación: "A conversation",
  "Una llamada o un mensaje. Qué vendes, a quién, y qué debería pasar cuando alguien entre al sitio. Sin costo y sin compromiso.":
    "A call or a message. What you sell, to whom, and what should happen when somebody " +
    "lands on the site. Free, and with no commitment.",
  Propuesta: "A proposal",
  "Alcance, plazo y precio por escrito, con lo que entra y lo que no. Si algo queda fuera, queda fuera en el documento y no en la factura.":
    "Scope, timeline and price in writing, with what is in and what is not. If something is " +
    "excluded, it is excluded in the document and not in the invoice.",
  Diseño: "Design",
  "Te mostramos la página real en el navegador, no una imagen de cómo se vería. Los ajustes se hacen sobre eso.":
    "We show you the real page in a browser, not a picture of how it would look. Changes " +
    "are made on that.",
  Construcción: "Build",
  "Se arma el sitio completo con tus textos e imágenes, y se revisa en teléfono antes de enseñártelo terminado.":
    "The full site is assembled with your copy and images, and checked on a phone before we " +
    "show it to you finished.",
  Publicación: "Launch",
  "Dominio, certificado de seguridad, correo corporativo y alta en Google Search Console. Te entregamos el sitio funcionando, no un archivo comprimido.":
    "Domain, security certificate, business email and registration in Google Search " +
    "Console. We hand over a site that is running, not a zip file.",

  "¿Cuánto cuesta una página web en Honduras?":
    "How much does a website cost in Honduras?",
  "Depende de cuántas páginas lleve y de si necesita funciones como reservas, catálogo o pagos. Un sitio informativo de una empresa es un proyecto distinto de una plataforma con área de clientes. Te damos un precio cerrado por escrito después de la primera conversación, y ese precio no se mueve durante el proyecto.":
    "It depends on how many pages it has and whether it needs features like booking, a " +
    "catalogue or payments. An informational company site is a different project from a " +
    "platform with a client area. We give you a fixed price in writing after the first " +
    "conversation, and that price does not move during the project.",
  "¿Cuánto tarda?": "How long does it take?",
  "Una landing page suele tomar entre una y dos semanas. Un sitio corporativo completo, entre tres y seis. El plazo depende sobre todo de qué tan rápido llegan tus textos e imágenes, así que el calendario se acuerda junto con esa entrega.":
    "A landing page usually takes one to two weeks. A full corporate site, three to six. " +
    "The timeline depends mostly on how quickly your copy and images arrive, so the " +
    "calendar is agreed together with that handover.",
  "¿Incluye el dominio y el hosting?": "Does it include the domain and hosting?",
  "Los configuramos y te acompañamos en la contratación, pero quedan a tu nombre y bajo tu cuenta. El dominio de tu empresa es tuyo: nadie debería poder dejarte sin sitio por un desacuerdo.":
    "We configure them and walk you through the purchase, but they stay in your name and " +
    "under your account. Your company's domain is yours: nobody should be able to take " +
    "your site away over a disagreement.",
  "¿Puedo actualizar el contenido yo mismo?": "Can I update the content myself?",
  "Sí, si el proyecto lo necesita. Cuando el contenido cambia seguido —noticias, catálogo, precios— montamos un panel para que lo edites sin tocar código. Cuando cambia dos veces al año, un panel es una complicación que no te conviene pagar, y te lo decimos.":
    "Yes, if the project needs it. When content changes often — news, catalogue, prices — we " +
    "build an admin panel so you can edit without touching code. When it changes twice a " +
    "year, a panel is a complication you should not be paying for, and we say so.",
  "¿Aparecerá mi página en Google?": "Will my site show up on Google?",
  "El sitio sale preparado para que Google lo entienda e indexe, y lo damos de alta en Search Console al publicar. Aparecer tarda semanas, y posicionarse arriba de la competencia depende además de tu Perfil de Empresa, de reseñas y de contenido sostenido. Te explicamos qué toca hacer después, sin prometerte un primer lugar que nadie puede garantizar.":
    "The site ships ready for Google to understand and index, and we register it in Search " +
    "Console at launch. Showing up takes weeks, and ranking above your competition also " +
    "depends on your Business Profile, on reviews and on sustained content. We explain what " +
    "comes next, without promising you a first place nobody can guarantee.",
  "¿Trabajan con empresas fuera de Tegucigalpa?":
    "Do you work with companies outside Tegucigalpa?",
  "Sí. Trabajamos con clientes en San Pedro Sula, La Ceiba, Choluteca, Comayagua y el resto del país, y también fuera de Honduras. Todo el proceso funciona por videollamada y mensajería.":
    "Yes. We work with clients in San Pedro Sula, La Ceiba, Choluteca, Comayagua and the " +
    "rest of the country, and outside Honduras too. The whole process works over video " +
    "calls and messaging.",

  /* ------------------------------------------ 02 · custom software systems */


  "Casi toda operación termina corriendo sobre Excel y memoria.":
    "Almost every operation ends up running on spreadsheets and memory.",
  "Un archivo que alguien actualiza, otro que se copió hace tres meses, y un par de personas que son las únicas que saben cómo va realmente el inventario. Funciona hasta que crece, hasta que esa persona se va, o hasta que alguien pide un reporte de los últimos seis meses y no hay forma de armarlo sin sentarse una tarde entera.":
    "One file somebody updates, another that was copied three months ago, and one or two " +
    "people who are the only ones who really know where the inventory stands. It works " +
    "until it grows, until that person leaves, or until somebody asks for a report on the " +
    "last six months and there is no way to put it together without losing an afternoon.",

  "Qué es un sistema a medida": "What a custom system is",
  "Es un programa hecho para una sola operación: la tuya. En lugar de adaptar tus procesos a lo que un producto enlatado permite, se construyen las pantallas, los permisos y los reportes que tu equipo ya necesita. Sale más caro que una licencia mensual el primer año, y deja de salirlo cuando el producto enlatado te obliga a contratar a alguien para hacer a mano lo que no cubre.":
    "It is a program made for one operation: yours. Instead of bending your processes to " +
    "what an off-the-shelf product allows, we build the screens, permissions and reports " +
    "your team already needs. It costs more than a monthly licence in the first year, and " +
    "stops costing more the moment the off-the-shelf product forces you to hire somebody to " +
    "do by hand what it does not cover.",

  "Lo que suele resolver": "What it usually solves",
  "Control de inventario y bodegas con existencias reales por sucursal. Expedientes de clientes, pacientes o estudiantes en un solo lugar. Flujos de aprobación donde cada solicitud tiene un estado y un responsable visible. Reportes que se generan solos en lugar de armarse a mano. Y accesos por rol, para que cada quien vea lo que le toca y nada más.":
    "Inventory and warehouse control with real stock per branch. Client, patient or student " +
    "records in one place. Approval flows where every request has a status and a visible " +
    "owner. Reports that generate themselves instead of being assembled by hand. And " +
    "role-based access, so each person sees what is theirs and nothing else.",

  "Construido para que lo opere tu gente": "Built for your people to operate",
  "Un sistema que el equipo no entiende es un sistema que el equipo esquiva, y a los dos meses vuelve el Excel paralelo. Por eso diseñamos las pantallas con las palabras que ya usa tu operación, entregamos capacitación al personal que lo va a usar todos los días, y dejamos el sistema andando con tus datos reales adentro, no con datos de ejemplo.":
    "A system the team does not understand is a system the team works around, and two months " +
    "later the parallel spreadsheet is back. So we design the screens using the words your " +
    "operation already uses, train the people who will use it every day, and leave the " +
    "system running with your real data inside it, not sample data.",

  "Y para que siga siendo tuyo": "And for it to stay yours",
  "El código es tuyo y queda documentado. No dependes de nosotros para seguir existiendo: si mañana decides moverlo a otro equipo, se puede mover. Es una condición incómoda para un proveedor y es la correcta para un cliente.":
    "The code is yours and it is documented. You do not depend on us to keep operating: if " +
    "tomorrow you decide to move it to another team, it can be moved. That is an " +
    "uncomfortable condition for a vendor and the right one for a client.",

  "Levantamiento del proceso": "Process discovery",
  "Antes de programar, entender. Cómo entra el trabajo, por dónde pasa, quién aprueba y dónde se traba hoy.":
    "Understand before building. How work comes in, where it goes, who approves it and " +
    "where it gets stuck today.",
  "Diseño de la base de datos": "Database design",
  "La estructura donde vive la información, pensada para que los reportes que vas a pedir en dos años se puedan armar.":
    "The structure the information lives in, shaped so the reports you will ask for in two " +
    "years can actually be built.",
  "Pantallas y permisos": "Screens and permissions",
  "Un perfil por tipo de usuario, con acceso a lo suyo. Bodega ve bodega; gerencia ve todo; nadie ve lo que no le corresponde.":
    "One profile per kind of user, with access to their own. The warehouse sees the " +
    "warehouse; management sees everything; nobody sees what is not theirs.",
  Reportes: "Reports",
  "Los que pides al inicio y la posibilidad de agregar otros después sin rehacer el sistema.":
    "The ones you ask for at the start, and the ability to add more later without rebuilding " +
    "the system.",
  "Capacitación y manual": "Training and a manual",
  "Sesiones con quienes lo van a usar y un documento al que puedan volver cuando entre alguien nuevo.":
    "Sessions with the people who will use it, and a document they can go back to when " +
    "somebody new joins.",
  "Soporte posterior": "Support afterwards",
  "Un periodo de acompañamiento después de arrancar, porque los ajustes reales aparecen en la primera semana de uso.":
    "A period of support after go-live, because the real adjustments show up in the first " +
    "week of use.",

  Diagnóstico: "Diagnosis",
  "Nos sentamos con quien opera el proceso, no solo con quien lo dirige. La diferencia entre lo que se supone que pasa y lo que pasa es donde está el proyecto.":
    "We sit down with the people who run the process, not only the people who direct it. " +
    "The gap between what is supposed to happen and what happens is where the project is.",
  "Alcance por escrito": "Scope in writing",
  "Qué va a hacer el sistema en su primera versión, qué no, y qué queda para una segunda etapa. Firmado antes de empezar.":
    "What the system will do in its first version, what it will not, and what is left for a " +
    "second stage. Signed before we start.",
  "Entregas parciales": "Partial deliveries",
  "Cada pocas semanas ves un módulo funcionando de verdad. Los sistemas que se enseñan completos al final son los que se entregan equivocados.":
    "Every few weeks you see a module genuinely working. Systems that are only shown " +
    "complete at the end are the ones that get delivered wrong.",
  "Pruebas con datos reales": "Testing with real data",
  "Se carga información verdadera y se opera en paralelo con el método anterior, hasta que el sistema demuestre que no pierde nada.":
    "Real information is loaded and run in parallel with the previous method, until the " +
    "system proves it loses nothing.",
  "Arranque y acompañamiento": "Go-live and support",
  "Puesta en marcha, capacitación y un periodo de soporte con respuesta rápida mientras el equipo se acostumbra.":
    "Rollout, training, and a period of fast-response support while the team settles in.",

  "¿Cuánto cuesta desarrollar un sistema en Honduras?":
    "How much does building a system cost in Honduras?",
  "Varía mucho según cuántos procesos cubra y cuántos tipos de usuario tenga. Un módulo puntual —control de inventario, por ejemplo— es un proyecto de semanas; un sistema que cubre toda la operación es de meses. Lo que sí es fijo es la forma: precio cerrado por etapa, acordado antes de empezar esa etapa.":
    "It varies a great deal with how many processes it covers and how many kinds of user it " +
    "has. A single module — inventory control, say — is a project of weeks; a system " +
    "covering a whole operation is months. What is fixed is the shape: a closed price per " +
    "stage, agreed before that stage begins.",
  "¿Es mejor un sistema a medida o uno ya hecho?":
    "Is a custom system better than an off-the-shelf one?",
  "Si tu proceso es igual al de todos, compra el producto ya hecho: es más barato y está probado. El desarrollo a medida vale la pena cuando tu forma de trabajar es parte de tu ventaja, o cuando ningún producto del mercado cubre lo que haces sin obligarte a llevar procesos por fuera. Te lo decimos con honestidad en la primera conversación, aunque la respuesta sea que no nos necesitas.":
    "If your process is the same as everyone else's, buy the off-the-shelf product: it is " +
    "cheaper and it is proven. Custom development is worth it when the way you work is part " +
    "of your advantage, or when nothing on the market covers what you do without forcing " +
    "you to run processes on the side. We tell you honestly in the first conversation, even " +
    "when the answer is that you do not need us.",
  "¿Funciona sin internet?": "Does it work without internet?",
  "Se puede construir para que sí, y a veces hay que hacerlo. Si tienes bodegas o sucursales con conexión inestable, el sistema se diseña para seguir operando y sincronizar cuando vuelve el enlace. Es una decisión que se toma al inicio, porque cambia la arquitectura.":
    "It can be built that way, and sometimes it has to be. If you have warehouses or " +
    "branches on an unstable connection, the system is designed to keep operating and sync " +
    "when the link comes back. That decision is taken at the start, because it changes the " +
    "architecture.",
  "¿Se conecta con lo que ya usamos?": "Does it connect to what we already use?",
  "En general sí. La mayoría de los sistemas contables y de facturación permiten importar o exportar información, y cuando existe una integración directa la usamos. Revisamos caso por caso qué permite el software que ya tienes antes de prometer una conexión.":
    "Generally yes. Most accounting and invoicing systems allow information to be imported " +
    "or exported, and where a direct integration exists we use it. We check case by case " +
    "what the software you already have allows before promising a connection.",
  "¿Quién se queda con el código?": "Who owns the code?",
  "Tú. El código fuente y la base de datos son del cliente, con su documentación. Mantenemos el sistema si quieres que lo mantengamos, no porque no tengas alternativa.":
    "You do. The source code and the database belong to the client, with their " +
    "documentation. We maintain the system if you want us to maintain it, not because you " +
    "have no alternative.",

  /* ------------------------------------------ 03 · web development, capital */


  "Por qué importa la ciudad": "Why the city matters",
  "Contratar desarrollo es contratar a alguien con quien vas a discutir.":
    "Hiring a developer means hiring somebody you are going to argue with.",
  "No en el mal sentido: un proyecto bien hecho tiene desacuerdos, cambios de opinión y decisiones que se toman mejor mirándose a la cara. Trabajamos con clientes de todo el país por videollamada sin problema, pero cuando el cliente está en Tegucigalpa aprovechamos lo que la distancia cero permite, y no es poco.":
    "Not in a bad way: a project done well has disagreements, changes of mind and decisions " +
    "that are better taken face to face. We work with clients across the country over video " +
    "with no trouble, but when the client is in Tegucigalpa we use what zero distance " +
    "allows, and it is not a small thing.",

  "Reuniones donde está la operación": "Meetings where the work happens",
  "Para un sitio informativo basta una llamada. Para un sistema que va a manejar tu bodega, tu caja o tus expedientes, conviene que alguien vaya a ver cómo se trabaja hoy. Media hora parado en el lugar donde ocurre el proceso enseña cosas que no salen en ninguna reunión virtual, y esas cosas son las que hacen que el sistema se use o se abandone.":
    "For an informational site a call is enough. For a system that will run your warehouse, " +
    "your till or your records, somebody should go and see how the work is done today. Half " +
    "an hour standing where the process happens teaches things no virtual meeting surfaces, " +
    "and those things are what decide whether the system gets used or abandoned.",

  "Capacitación presencial al equipo": "In-person training for the team",
  "Entregamos el sistema sentándonos con la gente que lo va a operar todos los días: caja, bodega, recepción, administración. Es la parte que más decide si un proyecto se adopta, y la que peor funciona por videollamada con diez personas alrededor de una laptop.":
    "We hand the system over sitting with the people who will operate it every day: till, " +
    "warehouse, reception, administration. It is the part that most decides whether a " +
    "project is adopted, and the part that works worst over video with ten people crowded " +
    "around one laptop.",

  "Lo mismo que hacemos para todo el país": "The same work we do for the whole country",
  "Estar en Tegucigalpa no define lo que construimos, solo cómo lo acompañamos. El trabajo es el mismo que entregamos en San Pedro Sula, La Ceiba o fuera de Honduras: sitios corporativos, portales institucionales, plataformas y sistemas internos, con el mismo estándar de velocidad, accesibilidad y preparación para buscadores.":
    "Being in Tegucigalpa does not define what we build, only how we accompany it. The work " +
    "is the same one we deliver in San Pedro Sula, La Ceiba or outside Honduras: corporate " +
    "sites, institutional portals, platforms and internal systems, to the same standard of " +
    "speed, accessibility and search-engine groundwork.",

  "Sitios corporativos e institucionales": "Corporate and institutional sites",
  "La cara pública de una empresa, una fundación o una institución, con la estructura que su tipo de visitante necesita.":
    "The public face of a company, a foundation or an institution, with the structure its " +
    "kind of visitor needs.",
  "Landing pages de campaña": "Campaign landing pages",
  "Una sola página con un solo objetivo, para pauta o lanzamiento, medida desde el primer día.":
    "A single page with a single goal, for paid media or a launch, measured from day one.",
  "Oferta académica, admisiones, calendario y áreas para estudiantes y padres, administrables por el personal del centro.":
    "Programmes, admissions, calendar and areas for students and parents, administered by " +
    "the institution's own staff.",
  "Portales gubernamentales y públicos": "Government and public portals",
  "Transparencia, trámites y datos abiertos, con los requisitos de accesibilidad que un sitio público debe cumplir.":
    "Transparency, procedures and open data, meeting the accessibility requirements a public " +
    "site has to satisfy.",
  "Cartas digitales para restaurantes": "Digital menus for restaurants",
  "Menú que se actualiza desde el teléfono, se abre con código QR y no obliga al cliente a descargar nada.":
    "A menu updated from a phone, opened with a QR code, with nothing for the diner to " +
    "download.",
  "Sistemas internos y automatización": "Internal systems and automation",
  "Inventarios, expedientes, aprobaciones y reportes; el trabajo repetitivo que hoy consume horas de alguien.":
    "Inventory, records, approvals and reporting: the repetitive work that consumes " +
    "somebody's hours today.",

  Escríbenos: "Write to us",
  "Por WhatsApp o correo, con una idea general de lo que necesitas. No hace falta que la tengas clara todavía.":
    "By WhatsApp or email, with a general idea of what you need. It does not have to be " +
    "clear yet.",
  "Nos reunimos": "We meet",
  "En tu oficina, en un café o por videollamada, como prefieras. La primera reunión no se cobra.":
    "At your office, over coffee or on a video call, whichever you prefer. The first meeting " +
    "is free.",
  "Recibes una propuesta": "You get a proposal",
  "Alcance, plazo y precio por escrito, normalmente dentro de los tres días siguientes.":
    "Scope, timeline and price in writing, usually within three days.",

  "¿Atienden solo en Tegucigalpa?": "Do you only serve Tegucigalpa?",
  "No. Tegucigalpa es donde estamos, no el límite de donde trabajamos. Tenemos proyectos con clientes de otras ciudades del país y de fuera de Honduras; lo que cambia es que las reuniones son por videollamada en lugar de presenciales.":
    "No. Tegucigalpa is where we are, not the limit of where we work. We have projects with " +
    "clients in other cities and outside Honduras; what changes is that meetings happen over " +
    "video instead of in person.",
  "¿Se puede tener una reunión presencial antes de contratar?":
    "Can we meet in person before hiring you?",
  "Sí, y es lo que recomendamos para proyectos grandes. La primera reunión no tiene costo ni compromiso, y sirve tanto para que veas cómo trabajamos como para que nosotros entendamos si somos el equipo correcto para lo que necesitas.":
    "Yes, and it is what we recommend for large projects. The first meeting has no cost and " +
    "no commitment, and it serves both for you to see how we work and for us to understand " +
    "whether we are the right team for what you need.",
  "¿Trabajan con empresas pequeñas?": "Do you work with small companies?",
  "Sí. Un negocio de tres personas con un proceso claro suele ser un mejor proyecto que una empresa grande sin decisiones tomadas. Lo que sí hacemos es ajustar el alcance al presupuesto real y decirlo de frente cuando algo no cabe.":
    "Yes. A three-person business with a clear process is usually a better project than a " +
    "large company that has not made its decisions. What we do is fit the scope to the real " +
    "budget, and say plainly when something does not fit.",
  "¿En qué idiomas entregan los sitios?": "What languages do you deliver sites in?",
  "Español e inglés. Todo lo que construimos puede salir en las dos versiones, enlazadas correctamente para que Google entienda que son el mismo sitio en dos idiomas y muestre la que corresponde a cada visitante. Este mismo sitio funciona así.":
    "Spanish and English. Everything we build can ship in both, linked correctly so Google " +
    "understands they are the same site in two languages and shows each visitor the right " +
    "one. This very site works that way.",
};
