/**
 * Orbita — the product sheet.
 *
 * A native `<dialog>`, opened with `showModal()`. That single choice supplies
 * the focus trap, the Escape key, the inert background and the backdrop, all of
 * which are hard to rebuild correctly and easy to get wrong.
 *
 * Each product's sheet ships in the page as an inert `<template>`; opening one
 * clones it into the dialog. So the content is authored at build time like the
 * rest of the page, and the script never assembles markup from strings.
 */

export function initSheet(root = document) {
  const dialog = root.querySelector("[data-sheet-dialog]");
  const content = root.querySelector("[data-sheet-content]");
  if (!dialog || !content) return;

  const added = dialog.querySelector("[data-sheet-added]");
  let opener = null;

  const open = (id) => {
    const template = root.querySelector(`[data-sheet-for="${CSS.escape(id)}"]`);
    if (!template) return;

    content.replaceChildren(template.content.cloneNode(true));
    if (added) added.hidden = true;

    // The dialog is labelled by whichever product is in it at the time.
    const title = content.querySelector("[data-sheet-title]");
    if (title) {
      title.id = "ob-sheet-title";
      dialog.setAttribute("aria-labelledby", title.id);
      dialog.removeAttribute("aria-label");
    }

    dialog.showModal();
    // Long sheets remember nothing from the previous product.
    dialog.scrollTop = 0;
  };

  for (const button of root.querySelectorAll("[data-open-sheet]")) {
    button.addEventListener("click", () => {
      opener = button;
      open(button.dataset.openSheet);
    });
  }

  dialog.querySelector("[data-sheet-close]")?.addEventListener("click", () => dialog.close());

  // Clicking the backdrop is the other way everyone expects to close a modal.
  // The dialog element itself fills the backdrop, so the test is whether the
  // click landed outside its box rather than on some child.
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;
    if (outside) dialog.close();
  });

  // Whatever opened the sheet gets the focus back when it closes.
  dialog.addEventListener("close", () => {
    opener?.focus({ preventScroll: true });
    opener = null;
  });

  // "Add to quote" has no cart behind it, and the sheet says so; what it does
  // is confirm the action the way the real one would.
  content.addEventListener("click", (event) => {
    if (!event.target.closest("[data-sheet-quote]")) return;
    if (added) added.hidden = false;
  });
}
