/**
 * The map section — five pins on a drawn city, five cards beside it.
 *
 * The page ships with an illustration, not with a map: a real map is an iframe,
 * and an iframe loaded on scroll is a third party the visitor never asked for.
 * The embed is built here, on the first click, and from then on only its `src`
 * changes — picking a second place moves the map that is already there.
 *
 * Every control the module handles is a working link to Google Maps in the
 * markup, so the section survives this file failing to load: pins and card names
 * open the same place in a new tab. What the module does is intercept that click
 * and answer it in place instead — which is why a modified click (new tab, new
 * window) is let through untouched.
 *
 * Selection is one value. Pin and card both read it, and hover is treated as a
 * provisional selection so that pointing at a card lights its pin without
 * disturbing the place actually chosen.
 */

/** The keyless Google embed: a coordinate, a zoom, and no API contract. */
const embed = (lat, lng, zoom) =>
  `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=es&output=embed`;

export function initPlaces() {
  const section = document.querySelector("[data-places]");
  if (!section) return;

  const paper = section.querySelector(".dm-map__paper");
  const live = section.querySelector("[data-map-live]");
  const cards = [...section.querySelectorAll("[data-place]")];
  const pins = [...section.querySelectorAll("[data-place-pin]")];
  if (!paper || !live || !cards.length) return;

  const byId = new Map(cards.map((card) => [card.dataset.place, card]));

  let selected = null;
  let hovered = null;
  let frame = null;
  let caption = null;

  /* Whatever the pointer is on wins over what was chosen, so the map keeps its
     place while the reader runs down the list. */
  const paint = () => {
    const lit = hovered ?? selected;
    for (const card of cards) card.classList.toggle("is-active", card.dataset.place === lit);
    for (const pin of pins) pin.classList.toggle("is-active", pin.dataset.placePin === lit);
  };

  /** The frame, its title bar and the way back. Built once, on first use. */
  const build = () => {
    if (frame) return frame;

    frame = document.createElement("iframe");
    frame.className = "dm-map__frame";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allow = "fullscreen";

    const bar = document.createElement("div");
    bar.className = "dm-map__bar";

    caption = document.createElement("p");
    caption.className = "dm-map__title";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "dm-map__close";
    back.textContent = "Volver al mapa";
    back.addEventListener("click", close);

    bar.append(caption, back);
    live.append(frame, bar);
    return frame;
  };

  const open = (id) => {
    const card = byId.get(id);
    if (!card) return;

    const { placeLat: lat, placeLng: lng, placeZoom: zoom, placeName: name } = card.dataset;
    build();
    frame.title = `Mapa de ${name}`;
    frame.src = embed(lat, lng, zoom || 16);

    const kind = document.createElement("span");
    kind.textContent = card.querySelector(".dm-place__kind")?.textContent ?? "";
    caption.replaceChildren(kind, document.createTextNode(name));

    selected = id;
    paper.classList.add("is-live");
    paint();
  };

  function close() {
    paper.classList.remove("is-live");
    selected = null;
    hovered = null;
    paint();
    /* The frame keeps its `src`: reopening the same place should not refetch a
       map the browser already has. */
  }

  /** Ctrl, ⌘, shift or a middle click means "somewhere else" — leave it alone. */
  const intercepted = (event) =>
    event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

  for (const pin of pins) {
    pin.addEventListener("click", (event) => {
      if (!intercepted(event)) return;
      event.preventDefault();
      open(pin.dataset.placePin);
    });
    pin.addEventListener("pointerenter", () => {
      hovered = pin.dataset.placePin;
      paint();
    });
    pin.addEventListener("pointerleave", () => {
      hovered = null;
      paint();
    });
  }

  for (const card of cards) {
    const id = card.dataset.place;

    card.querySelector("[data-place-open]")?.addEventListener("click", (event) => {
      if (!intercepted(event)) return;
      event.preventDefault();
      open(id);
    });

    card.addEventListener("pointerenter", () => {
      hovered = id;
      paint();
    });
    card.addEventListener("pointerleave", () => {
      hovered = null;
      paint();
    });
    /* Keyboard reaches the card through its link; the pin should light up for
       that too, or tabbing the list leaves the map dead. */
    card.addEventListener("focusin", () => {
      hovered = id;
      paint();
    });
    card.addEventListener("focusout", () => {
      hovered = null;
      paint();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && paper.classList.contains("is-live")) close();
  });
}
