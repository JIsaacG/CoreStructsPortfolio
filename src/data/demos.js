/**
 * The demo sites behind the "Explorar" links in the portfolio grid.
 *
 * Each entry renders one complete, self-contained website into `demos/<slug>.html`
 * — header, hero, sections, shop, footer — for a *fictional* brand. They exist so
 * a visitor can see the kind of site CoreStruct builds instead of reading about
 * it, so the copy is written as that brand would write it, not as a description
 * of a service. The badge in the corner is what keeps the fiction honest.
 *
 * project  the number of the card in src/data/projects.js that links here
 * accent   the two base brand colours; the build derives the rgb() tokens
 * flavours drive both the shop and the bottle: scrolling past one re-tints the
 *          pinned bottle and the whole page with its `tint`
 */

export const demos = [
  /* ------------------------------------------------------------------- 01 */
  {
    project: "01",
    slug: "verbena",
    service: "Sitio de marca",
    brand: {
      name: "Verbena",
      mark: "Bebidas de autor",
      sector: "Tienda de bebidas artesanales",
      since: "2014",
    },
    accent: { primary: "#3d1230", secondary: "#e0518a" },

    hero: {
      eyebrow: "Fermentado en frío · Lote corto",
      lines: ["Cinco sabores.", "Una botella."],
      lead:
        "Infusiones botánicas fermentadas en frío durante catorce días. Sin azúcar añadida, " +
        "sin concentrados, sin nada que no puedas pronunciar.",
      actions: [
        { label: "Ver los sabores", href: "#sabores", primary: true },
        { label: "Ir a la tienda", href: "#tienda" },
      ],
      cue: "Desliza para destaparla",
    },

    /* Each flavour is one scroll beat: the bottle recolours as it passes. */
    flavours: [
      {
        id: "hibisco",
        name: "Hibisco & Cardamomo",
        short: "Hibisco",
        tint: "#e0518a",
        deep: "#5c1030",
        note: "Floral · Seco",
        text:
          "Flor de jamaica macerada en frío con cardamomo verde partido a mano. Ácida al " +
          "principio, larga y seca al final. La que convence a quien dice que no le gustan las bebidas dulces.",
        pairs: "Quesos curados, cerdo, tarde de calor",
        abv: "0 %",
        price: "L 68",
      },
      {
        id: "toronja",
        name: "Toronja & Romero",
        short: "Toronja",
        tint: "#f0783c",
        deep: "#5e2410",
        note: "Cítrico · Amargo",
        text:
          "Toronja rosada prensada con la cáscara dentro, romero fresco y un pellizco de sal " +
          "de mar. El amargo no se esconde: es la razón por la que existe.",
        pairs: "Pescado, aceitunas, el primer trago del día",
        abv: "0 %",
        price: "L 68",
      },
      {
        id: "maracuya",
        name: "Maracuyá & Jengibre",
        short: "Maracuyá",
        tint: "#f0b93c",
        deep: "#5e3f08",
        note: "Tropical · Picante",
        text:
          "Pulpa de maracuyá fermentada catorce días con jengibre rallado en crudo. Pica al " +
          "final, cuando ya te la habías tomado entera.",
        pairs: "Comida picante, mariscos, sobremesa larga",
        abv: "0 %",
        price: "L 72",
      },
      {
        id: "menta",
        name: "Menta & Pepino",
        short: "Menta",
        tint: "#48c99a",
        deep: "#0d4030",
        note: "Herbal · Limpio",
        text:
          "Pepino sin semilla y menta piperita cortada la misma mañana. La más ligera de las " +
          "cinco y la única que se acaba antes de que te des cuenta.",
        pairs: "Ensaladas, calor de mediodía, después de correr",
        abv: "0 %",
        price: "L 64",
      },
      {
        id: "mora",
        name: "Mora & Laurel",
        short: "Mora",
        tint: "#9b6bf0",
        deep: "#2c1258",
        note: "Oscuro · Especiado",
        text:
          "Mora de altura y hoja de laurel tostada. Fermentación de veintiún días, la más larga " +
          "del catálogo. Se sirve casi a temperatura de vino.",
        pairs: "Chocolate amargo, carnes rojas, noche de invierno",
        abv: "0 %",
        price: "L 78",
      },
    ],

    flavoursIntro: {
      label: "Los sabores",
      title: "Cinco fermentaciones, ni una repetida",
      text:
        "Cada sabor tiene su propio tiempo de reposo, su propia botella y su propia razón de existir. " +
        "Ninguno es la versión light del anterior.",
    },

    spec: {
      label: "La receta",
      title: "Qué lleva dentro",
      note: "Los mismos cinco elementos en las cinco botellas. Lo único que cambia es la botánica.",
      items: [
        { value: "500", unit: "ml", name: "Agua de manantial", text: "Filtrada por gravedad, sin tratamiento químico, embotellada en el mismo valle." },
        { value: "14", unit: "días", name: "Fermentación en frío", text: "A cuatro grados. Es lento a propósito: el frío guarda el aroma que el calor rompe." },
        { value: "120", unit: "g", name: "Botánica fresca", text: "Cortada la misma semana. Nada deshidratado, nada en polvo, nada de concentrado." },
        { value: "0", unit: "g", name: "Azúcar añadida", text: "El dulce que queda es el que la fruta traía puesto." },
        { value: "1", unit: "%", name: "Cultivo madre", text: "El mismo cultivo desde 2014. Se alimenta cada semana y no se ha muerto todavía." },
      ],
    },

    story: {
      label: "La casa",
      title: "Cómo llegamos hasta aquí",
      steps: [
        { stamp: "2014", title: "La primera tanda", text: "Veinte litros de hibisco en la cocina de una casa alquilada. Se vendieron en un mercado de sábado en cuatro horas." },
        { stamp: "2017", title: "La bodega", text: "Una nave con temperatura controlada. El cultivo madre se mudó en una hielera, en el asiento del copiloto." },
        { stamp: "2020", title: "Cinco sabores", text: "Menta y Mora entraron al catálogo. Fue el año en que dejamos de llamarlo experimento." },
        { stamp: "2023", title: "La botella", text: "Vidrio retornable de 500 ml. Dos de cada tres vuelven, y cada vuelta descuenta diez lempiras." },
        { stamp: "Hoy", title: "Doce mil botellas", text: "Al mes, y ni una sola con un ingrediente que no quepa en la etiqueta." },
      ],
    },

    shop: {
      label: "La tienda",
      title: "Llévate la caja",
      text: "Envío en frío a todo el país. Caja de seis botellas del mismo sabor, o mezcla las cinco.",
      packs: [
        { name: "Caja mixta", detail: "Seis botellas · las cinco recetas", price: "L 395", tag: "La más pedida", featured: true },
        { name: "Caja sencilla", detail: "Seis botellas · un solo sabor", price: "L 372" },
        { name: "Suscripción", detail: "Seis botellas cada mes · cancela cuando quieras", price: "L 330 / mes", tag: "-12 %" },
      ],
      note: "Precios en lempiras, con vidrio incluido. Devuelve la botella y te descontamos L 10 en la siguiente caja.",
    },

    cta: {
      title: "¿Quieres un sitio así para tu marca?",
      text:
        "Verbena no existe: es una demostración construida por CoreStruct para mostrar cómo se " +
        "ve una tienda de marca hecha a medida. La tuya se diseña alrededor de tu producto.",
      action: { label: "Hablemos de tu proyecto", href: "../index.html#contacto" },
    },
  },
];

/** Navigation is identical on every demo: the sections are always the same. */
export const demoNavigation = [
  { id: "sabores", label: "Sabores" },
  { id: "receta", label: "Receta" },
  { id: "casa", label: "La casa" },
  { id: "tienda", label: "Tienda" },
];
