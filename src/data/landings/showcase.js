/**
 * The three landing demos, as the portfolio presents them.
 *
 * This is the index behind the "Landing pages" card: a CoreStruct page rather
 * than a client one, so it keeps the portfolio's identity and lets the three
 * projects supply the colour. Each entry carries the accent of the page it
 * opens, which is what the card preview and the opening transition are tinted
 * with — clicking a card should feel like entering the page it showed you.
 */

export const showcase = {
  eyebrow: "Proyectos · Landing pages",
  title: "Tres landings, tres negocios distintos.",
  lead:
    "Cada una está construida para un tipo de cliente diferente, con su propia identidad, su " +
    "propia tipografía y sus propias piezas interactivas. Ninguna es una plantilla de la otra.",
  note: "Las tres son marcas ficticias creadas por CoreStruct para demostrar el trabajo.",

  projects: [
    {
      number: "01",
      slug: "nexora",
      name: "Nexora Group",
      category: "Corporate Experience",
      description:
        "Una experiencia corporativa diseñada para convertir estrategia y confianza en " +
        "oportunidades comerciales.",
      accent: "#12463c",
      paper: "#f6f4ef",
      ink: "#14161a",
      /* What the demo actually proves, in the words a prospect would use. */
      features: [
        "Composición editorial y tipografía serif",
        "Panel de datos animado y contadores",
        "Storytelling ligado al scroll",
        "Formulario de contacto calificado",
      ],
      preview: "editorial",
    },
    {
      number: "02",
      slug: "velora",
      name: "Velora",
      category: "Conversion Experience",
      description:
        "Una landing enfocada en convertir atención en reservas mediante diseño, confianza y una " +
        "experiencia optimizada.",
      accent: "#a8724f",
      paper: "#faf7f2",
      ink: "#1f1a16",
      features: [
        "Widget de reserva de cuatro pasos",
        "Comparador antes / después arrastrable",
        "Protocolo animado con el scroll",
        "CTAs contextuales y WhatsApp",
      ],
      preview: "arch",
    },
    {
      number: "03",
      slug: "orbita",
      name: "Orbita Supply",
      category: "Commerce Experience",
      description:
        "Una experiencia comercial diseñada para presentar productos, facilitar decisiones de " +
        "compra y convertir visitantes en clientes y cotizaciones.",
      accent: "#0a5cff",
      paper: "#ffffff",
      ink: "#0b0d12",
      features: [
        "Buscador que filtra el catálogo",
        "Ficha de producto en modal",
        "Comparador de hasta tres equipos",
        "Configurador B2B que genera cotización",
      ],
      preview: "catalog",
    },
  ],

  cta: {
    title: "¿Quieres una landing así para tu negocio?",
    text:
      "Estas tres se construyeron para demostrar el trabajo. La tuya se construye alrededor de tu " +
      "producto, tu operación y la acción que necesitas que ocurra.",
    action: { label: "Hablemos de tu proyecto", href: "../../index.html#contacto" },
  },
};
