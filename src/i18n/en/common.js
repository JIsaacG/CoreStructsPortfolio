/**
 * Vocabulary shared across the demos.
 *
 * These are the words that turn up in four or five different sites at once —
 * a table header, a nav item, a form label, the studio's own footer line. They
 * live here rather than in any one site's file because a term translated in one
 * place and missed in another is exactly the failure this whole layer exists to
 * prevent, and because `loadDictionary` refuses two different translations of
 * the same key, which makes this file the place that keeps them consistent.
 *
 * A word that means different things in different sites does *not* belong here.
 * It goes in each site's own file, where the context is known.
 */

export default {
  /* ------------------------------------------------------------ navigation */

  Inicio: "Home",
  Panel: "Dashboard",
  Documentos: "Documents",
  Publicaciones: "Publications",
  Galería: "Gallery",
  Catálogo: "Catalogue",
  Actividad: "Activity",
  "Actividad reciente": "Recent activity",
  Liderazgo: "Leadership",
  Oficinas: "Offices",
  Accesibilidad: "Accessibility",
  "Quiénes somos": "About us",
  "Preguntas frecuentes": "Frequently asked questions",
  Planificación: "Planning",
  Comunicación: "Communications",
  Estadística: "Statistics",
  Tecnología: "Technology",
  Beneficios: "Benefits",
  Acompañamiento: "Support",
  "Seguridad de la información": "Information security",
  "Secretaría Técnica": "Technical Secretariat",

  /* --------------------------------------------------------------- actions */

  Cerrar: "Close",
  Salir: "Sign out",
  Descargar: "Download",
  "Ver más": "See more",
  Resumen: "Summary",

  /* ---------------------------------------------- table headers, form fields */

  Estado: "Status",
  Tipo: "Type",
  Fecha: "Date",
  Monto: "Amount",
  Área: "Area",
  Código: "Code",
  Nombre: "Name",
  Mensaje: "Message",
  Asunto: "Subject",
  Motivo: "Reason",
  Horario: "Hours",
  País: "Country",
  Aplicación: "Application",

  /* ---------------------------------- shared beyond one demo */

  Dirección: "Address",
  Cliente: "Client",
  Clientes: "Clients",
  Responsable: "Owner",
  Ruta: "Breadcrumb",
  Pie: "Footer",
  Redes: "Social",
  Entrega: "Delivery",
  Disponibilidad: "Availability",
  Características: "Specifications",
  Protocolo: "Protocol",
  Cotización: "Quotation",
  "Solicitar cotización": "Request a quote",
  "Correo corporativo": "Work email",
  "Transformación digital": "Digital transformation",
  Energía: "Energy",
  "Casa matriz": "Head office",
  Tegucigalpa: "Tegucigalpa",
  Group: "Group",
  AL: "AL",
  "Buscar expediente": "Search records",
  "Sitio de ejemplo · CoreStruct": "Sample site · CoreStruct",

  /* Lettered into the portfolio's own card artwork. */
  AURELIS: "AURELIS",
  VERBENA: "VERBENA",

  /* -------------------------------------------------- the studio's own mark */

  "· sitio de ejemplo de CoreStruct": "· a CoreStruct sample site",
  DEMO: "DEMO",
  PDF: "PDF",
  LinkedIn: "LinkedIn",

  /* --------------------------------------- places and codes, left as they are */

  HN: "HN",
  Colombia: "Colombia",
  México: "Mexico",
  Comayagua: "Comayagua",
  "San Pedro Sula": "San Pedro Sula",
  "La Ceiba": "La Ceiba",
  Roatán: "Roatán",

  /* The rest of the `areaServed` list in the portfolio's JSON-LD, and the
     department the address names. Honduran places keep their Spanish spelling
     in English prose — there is no English exonym for any of them — so these
     map to themselves, which is how this file records "we looked". */
  Choluteca: "Choluteca",
  Danlí: "Danlí",
  "Puerto Cortés": "Puerto Cortés",
  "Francisco Morazán": "Francisco Morazán",
};
