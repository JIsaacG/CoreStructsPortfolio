/**
 * The alliances: institutions whose digital operation we build and keep.
 *
 * This list grows slowly on purpose — one panel per relationship, not one per
 * deliverable — so each entry can afford the room a logo and a paragraph need.
 *
 * `description` accepts `**…**` around the phrase that defines the work; the
 * build lifts it out of the muted paragraph colour. Everything else is plain
 * text. `href` stays null until there is a public URL to point at.
 */

export const alliances = [
  {
    number: "01",
    name: "Virginia Sapp",
    kind: "Institución educativa",
    logo: {
      src: "assets/alianzas/virginia-sapp.png",
      width: 202,
      height: 280,
      alt: "Logotipo institucional de Virginia Sapp",
    },
    description:
      "Creamos para Virginia Sapp una **plataforma educativa digital que va más allá " +
      "de una página web**: centraliza su presencia institucional, admisiones, " +
      "contenidos, recursos académicos y herramientas interactivas en una experiencia " +
      "moderna, administrable y preparada para crecer junto con la institución.",
    scope: [
      "Presencia institucional",
      "Admisiones",
      "Contenidos y recursos",
      "Herramientas interactivas",
    ],
    href: null,
    reveal: "far",
  },
];
