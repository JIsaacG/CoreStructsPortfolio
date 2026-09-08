/**
 * The gallery lightbox.
 *
 * One tile at full size, with its caption, a counter and arrow keys. It is the
 * only overlay in the portal that has to show an *image* rather than a list,
 * so it is the only one that needs its own module.
 *
 * The drawing is not duplicated. Every plate is already in the mosaic, so the
 * lightbox clones the SVG out of the tile that was clicked — which halves the
 * page weight against rendering thirty plates twice, and guarantees that what
 * opens is exactly what was on screen.
 *
 * Without JavaScript the mosaic is still a mosaic: thirty labelled figures in
 * a composed grid. The lightbox is magnification, not content.
 */

import { $, $$, trapFocus } from "./dom.js";

export function initGallery() {
  const grid = $("[data-gallery]");
  const box = $("[data-lightbox]");
  if (!grid || !box) return;

  const stage = $("[data-lightbox-stage]", box);
  const title = $("[data-lightbox-title]", box);
  const category = $("[data-lightbox-cat]", box);
  const caption = $("[data-lightbox-caption]", box);
  const count = $("[data-lightbox-count]", box);
  const bar = $("[data-bar]");
  const trap = trapFocus(box);

  let lastFocus = null;
  let index = 0;

  /** Only the tiles a filter has left visible: the arrows walk what is shown. */
  const visibleTiles = () => $$("[data-tile]", grid).filter((tile) => !tile.hidden);

  function render() {
    const tiles = visibleTiles();
    const tile = tiles[index];
    if (!tile || !stage) return;

    const art = $(".au-tile__art svg", tile);
    stage.replaceChildren(art ? art.cloneNode(true) : document.createTextNode(""));

    if (title) title.textContent = tile.dataset.title ?? "";
    if (category) category.textContent = tile.dataset.catLabel ?? "";
    if (caption) caption.textContent = tile.dataset.caption ?? "";
    if (count) count.textContent = `${index + 1} / ${tiles.length}`;
  }

  function open(tile) {
    const tiles = visibleTiles();
    index = Math.max(0, tiles.indexOf(tile));
    lastFocus = document.activeElement;

    render();
    box.dataset.open = "";
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "lightbox";
    if (bar) bar.dataset.hidden = "";
    document.addEventListener("keydown", trap);
    $("[data-lightbox-close]", box)?.focus();
  }

  function close() {
    delete box.dataset.open;
    document.body.style.overflow = "";
    delete document.documentElement.dataset.overlay;
    if (bar) delete bar.dataset.hidden;
    document.removeEventListener("keydown", trap);
    lastFocus?.focus();
  }

  function step(delta) {
    const tiles = visibleTiles();
    if (!tiles.length) return;
    /* Wraps, because a gallery that dead-ends at both edges makes the reader
       check which end they are at instead of looking at the pictures. */
    index = (index + delta + tiles.length) % tiles.length;
    render();
  }

  grid.addEventListener("click", (event) => {
    const tile = event.target.closest("[data-tile]");
    if (tile) open(tile);
  });

  $("[data-lightbox-close]", box)?.addEventListener("click", close);
  $("[data-lightbox-prev]", box)?.addEventListener("click", () => step(-1));
  $("[data-lightbox-next]", box)?.addEventListener("click", () => step(1));

  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  document.addEventListener("keydown", (event) => {
    if (box.dataset.open === undefined) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
  });
}
