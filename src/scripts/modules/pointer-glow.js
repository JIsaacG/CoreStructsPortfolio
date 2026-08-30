/**
 * The cyan light that follows the cursor across a project card.
 *
 * Only attached on devices with a real pointer, and only while the pointer is
 * actually over a card: the listener is added on enter and removed on leave, so
 * there is no page-wide pointermove handler running the rest of the time.
 */

export function initPointerGlow(root = document) {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!canHover.matches) return;

  const targets = root.querySelectorAll("[data-pointer-glow]");
  if (!targets.length) return;

  for (const target of targets) {
    let frame = 0;
    let pending = null;

    const paint = () => {
      frame = 0;
      if (!pending) return;
      target.style.setProperty("--pointer-x", `${pending.x}%`);
      target.style.setProperty("--pointer-y", `${pending.y}%`);
    };

    const onMove = (event) => {
      const box = target.getBoundingClientRect();
      pending = {
        x: (((event.clientX - box.left) / box.width) * 100).toFixed(1),
        y: (((event.clientY - box.top) / box.height) * 100).toFixed(1),
      };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    target.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      onMove(event);
      target.addEventListener("pointermove", onMove, { passive: true });
    });

    target.addEventListener("pointerleave", () => {
      target.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
    });
  }
}
