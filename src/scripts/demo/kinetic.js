/**
 * The kinetic band — the name of the house, moving.
 *
 * Two rows of the brand name slide in opposite directions. Each row is the same
 * run of words printed twice, so looping is a subtraction: once a track has
 * travelled the width of one run it is put back by exactly that width, and the
 * second copy has already taken the first one's place.
 *
 * Scroll does not drive the band, it leans on it. The base speed is what the row
 * does when the page is still; the wheel is added on top and decays away, so a
 * flick down throws the words along and a flick up drags them back through their
 * own direction. The same delta also skews the type a degree or two, which is
 * what sells the throw as weight rather than as a speed change.
 *
 * Like the bottle, the loop is unconditional: it runs on every viewport and
 * whatever the visitor's motion setting says, because a band of type that never
 * moves is a wall of the same word repeated. It stands down for exactly two
 * things — a page where this module never loaded (the `html:not(.js)` rule
 * centres one run instead) and a band scrolled off screen, which nobody can see.
 */

/** How much a pixel of scroll is worth, in pixels of extra travel. */
const PUSH = 2.6;

/** How fast the push decays once the wheel stops. Per frame, at 60fps. */
const DECAY = 0.86;

/** Degrees of lean at full push, and the push that counts as full. */
const SKEW = 3;
const SKEW_FULL = 55;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initKinetic() {
  const band = document.querySelector("[data-kinetic]");
  if (!band) return;

  const tracks = [...band.querySelectorAll("[data-kinetic-track]")].map((element) => ({
    element,
    /* Pixels per second, signed: the sign is the row's direction, and the push
       is applied along it so both rows accelerate together. */
    speed: Number(element.dataset.kineticSpeed) || -40,
    run: element.firstElementChild,
    offset: 0,
    width: 1,
  }));
  if (!tracks.length) return;

  /* The wrap distance is one run's width. It changes with the viewport and with
     the font finishing loading, so it is measured rather than stored.

     The build emits two runs, which covers any screen narrower than one run of
     the name. A wider one would see the tail of the loop, so copies are added
     here until the track is a full viewport longer than its own wrap distance. */
  const measure = () => {
    for (const track of tracks) {
      track.width = track.run?.getBoundingClientRect().width || 1;
      track.offset = 0;

      const needed = Math.ceil(window.innerWidth / track.width) + 1;
      while (track.element.childElementCount < needed) {
        track.element.append(track.run.cloneNode(true));
      }
    }
  };

  measure();
  window.addEventListener("resize", measure, { passive: true });
  document.fonts?.ready.then(measure);

  let previousScroll = window.scrollY;
  let push = 0;
  let last = performance.now();
  let running = false;
  let request = 0;

  const frame = (now) => {
    /* A tab that was in the background hands back a delta of several seconds.
       Capping it keeps the band from jumping a screenful on the first frame. */
    const elapsed = Math.min(64, now - last) / 1000;
    last = now;

    const scroll = window.scrollY;
    push += (scroll - previousScroll) * PUSH;
    previousScroll = scroll;
    push *= DECAY ** (elapsed * 60);
    if (Math.abs(push) < 0.02) push = 0;

    for (const track of tracks) {
      const direction = Math.sign(track.speed) || 1;
      track.offset += track.speed * elapsed + push * elapsed * 60 * direction * 0.06;
      track.offset %= track.width;
      /* Held in (-width, 0]: the visible run is always the second copy moving
         into the space the first one left. */
      if (track.offset > 0) track.offset -= track.width;
      track.element.style.transform = `translate3d(${track.offset.toFixed(2)}px, 0, 0)`;
    }

    const lean = clamp(push / SKEW_FULL, -1, 1) * SKEW;
    band.style.setProperty("--kinetic-skew", `${lean.toFixed(2)}deg`);

    request = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    previousScroll = window.scrollY;
    request = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(request);
  };

  if (!("IntersectionObserver" in window)) {
    start();
    return;
  }

  /* Off screen the loop is invisible, so it is not worth a frame. */
  const observer = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { rootMargin: "20% 0px" },
  );
  observer.observe(band);
}
