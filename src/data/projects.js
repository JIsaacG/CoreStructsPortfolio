/**
 * The portfolio grid.
 *
 * Each entry is one card. They currently describe the kinds of work CoreStruct
 * builds; as real case studies land, replace `title`/`description` and point
 * `href` at the case study — the layout does not need to change.
 *
 * size    'major' (7 cols) | 'minor' (5) | 'half' (6) | 'wide' (full-bleed feature)
 * offset  nudges the card down a row so the grid does not march in lockstep
 * reveal  which scroll-entrance variant to use (see motion.css)
 * mockup  key into src/data/mockups.js
 */

export const projects = [
  {
    number: "01",
    category: "Desarrollo web",
    title: "Sitios corporativos",
    description:
      "Presencia institucional a medida: rápida, accesible y construida para sostener la reputación de la marca en cualquier dispositivo.",
    mockup: "corporate",
    variant: "corporate",
    href: "demos/aurelis/index.html",
    size: "major",
    reveal: "far",
  },
  {
    number: "02",
    category: "Sector público",
    title: "Sitios gubernamentales",
    description:
      "Portales institucionales con observatorio de indicadores, normativa, transparencia y participación ciudadana.",
    mockup: "government",
    href: "demos/cede/index.html",
    size: "minor",
    offset: true,
    reveal: "rise",
  },
  {
    number: "03",
    category: "Software a medida",
    title: "Sistemas empresariales",
    description:
      "Expedientes, usuarios y operaciones en un sistema que se adapta a los procesos reales de la empresa.",
    mockup: "system",
    variant: "systems",
    href: "demos/rumbo/index.html",
    size: "minor",
    reveal: "rise",
  },
  {
    number: "04",
    category: "Conversión",
    title: "Landing pages",
    description:
      "Páginas de campaña enfocadas en un único objetivo: que la persona correcta dé el siguiente paso.",
    mockup: "landing",
    variant: "landing",
    href: "demos/landing/servicios.html",
    size: "major",
    reveal: "far",
  },
  {
    number: "05",
    category: "Educación",
    title: "Portales educativos",
    description:
      "Admisiones, preinscripción y gestión académica en un solo flujo, desde el primer clic hasta la inscripción confirmada.",
    mockup: "education",
    size: "wide",
    reveal: "scale",
  },
  {
    number: "06",
    category: "Gastronomía",
    title: "Restaurantes y menús",
    description:
      "Cartas digitales, catálogo de productos y pedidos en línea para restaurantes, cafeterías y marcas de bebidas.",
    mockup: "menu",
    variant: "brand",
    href: "demos/verbena.html",
    size: "half",
    reveal: "far",
  },
  {
    number: "07",
    category: "Integración",
    title: "Automatización",
    description:
      "Solicitudes, reglas de aprobación, documentos generados y trazabilidad: los procesos internos que hoy viven en correos y hojas de cálculo.",
    mockup: "automation",
    href: "demos/flujo/index.html",
    size: "half",
    offset: true,
    reveal: "rise",
  },
  {
    number: "08",
    category: "Ingeniería",
    title: "Soluciones a medida",
    description:
      "Cuando nada estándar encaja, diseñamos el software alrededor de la operación del cliente — no al revés.",
    mockup: "custom",
    size: "wide",
    reveal: "scale",
  },
];
