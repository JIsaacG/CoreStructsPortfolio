/**
 * Company-level content. Everything the page says about CoreStruct as an
 * organisation lives here, so copy and contact details are changed in one place.
 */

export const site = {
  name: "CoreStruct",
  legalName: "CoreStruct",
  url: "https://corestruct.com",
  locale: "es",

  title: "CoreStruct — Desarrollo de software y experiencias digitales",
  description:
    "Estudio de tecnología y desarrollo de software. Construimos sitios corporativos, " +
    "plataformas web, sistemas empresariales y automatizaciones a la medida de cada operación.",

  // TODO: replace with the real channels before going live. Anything left null
  // is simply not rendered, so the page never shows a placeholder address.
  contact: {
    email: "contacto@corestruct.com",
    phone: null,        // e.g. "+52 55 1234 5678"
    whatsapp: null,     // full international number, digits only: "525512345678"
    location: "Servicio remoto · Latinoamérica",
  },

  // Add entries as they exist; empty means the footer simply omits the list.
  social: [
    // { label: "LinkedIn", href: "https://www.linkedin.com/company/…" },
    // { label: "Instagram", href: "https://instagram.com/…" },
  ],
};

/** Primary navigation. `id` must match a section id in the page. */
export const navigation = [
  { id: "proyectos", label: "Proyectos" },
  { id: "capacidades", label: "Capacidades" },
  { id: "contacto", label: "Contacto" },
];
