/**
 * The pinned bottle — the piece that makes a demo page feel like one continuous
 * shot instead of a stack of sections.
 *
 * The bottle is held by a `position: sticky` stage that spans several sections,
 * and its transform is driven by how far the page has scrolled through that
 * span. Nothing here animates on a timer: scroll position is the only clock.
 *
 * The keyframes are not hard-coded percentages. Each section inside the track
 * declares, via `data-stage-frame`, the state the mark should be in when that
 * section reaches the top of the stage, and those positions are measured from
 * the live layout. Rewriting the copy therefore re-times the animation on its own.
 *
 * The animation is deliberately unconditional: it runs on every viewport and
 * whatever the visitor's motion setting says, because it is the page's subject
 * rather than decoration on top of it. The only case it stands down for is a
 * page where this module never loaded — see the `html:not(.js)` rule in the
 * stylesheet, which un-pins the stage so a still bottle cannot cover the copy.
 */

/** The transform the mark rests at, and the full set of animatable properties. */
const REST = { x: 0, y: 0, scale: 1, rot: 0, split: 0, fade: 1 };

const KEYS = Object.keys(REST);

/** How fast the rendered value chases the scroll value. 1 = no smoothing. */
const CHASE = 0.14;

/** Below this the rendered and target states agree closely enough to stop drawing. */
const EPSILON = 0.0004;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Ease the travel between two keyframes so it settles instead of stopping. */
const smooth = (t) => t * t * (3 - 2 * t);

const lerp = (from, to, t) => from + (to - from) * t;

/** A malformed frame falls back to rest rather than taking the page down. */
function parseFrame(json) {
  if (!json) return { ...REST };
  try {
    return { ...REST, ...JSON.parse(json) };
  } catch {
    return { ...REST };
  }
}

/** Blend every property of two keyframes at once. */
function blend(from, to, t) {
  const state = {};
  for (const key of KEYS) state[key] = lerp(from[key], to[key], t);
  return state;
}

/**
 * Read the keyframes out of the DOM.
 *
 * Each entry is `{ at, state }`: the document scroll position at which the mark
 * should be exactly in `state`. Offsets are measured here, not stored, because
 * they change with every resize and every reflow of the copy.
 */
function readKeyframes(track, sections, stickyTop) {
  const trackBox = track.getBoundingClientRect();
  const trackTop = trackBox.top + window.scrollY;

  const frames = sections.map((section) => ({
    at: section.getBoundingClientRect().top + window.scrollY - stickyTop,
    state: parseFrame(section.dataset.stageFrame),
  }));

  // The last stretch: from the final section to the moment the track releases
  // the stage. Without it the mark would sit frozen for the whole last screenful.
  const release = trackTop + trackBox.height - window.innerHeight;
  const last = frames.at(-1);
  if (last && release > last.at) {
    frames.push({ at: release, state: { ...last.state, ...parseFrame(track.dataset.stageExit) } });
  }

  return frames;
}

/** The mark's state for a given scroll position. */
function stateAt(frames, scroll) {
  if (!frames.length) return { ...REST };
  if (scroll <= frames[0].at) return frames[0].state;

  for (let i = 1; i < frames.length; i += 1) {
    const previous = frames[i - 1];
    const current = frames[i];
    if (scroll >= current.at) continue;

    const span = current.at - previous.at;
    const t = span <= 0 ? 1 : clamp((scroll - previous.at) / span);
    return blend(previous.state, current.state, smooth(t));
  }

  return frames.at(-1).state;
}

export function initDemoStage() {
  const track = document.querySelector("[data-stage-track]");
  const stage = track?.querySelector("[data-stage]");
  const mark = stage?.querySelector("[data-stage-mark]");
  if (!track || !stage || !mark) return;

  const sections = [...track.querySelectorAll("[data-stage-frame]")];
  if (!sections.length) return;

  let frames = [];
  let rendered = { ...REST };
  let target = { ...REST };
  let frame = 0;

  const paint = () => {
    for (const key of KEYS) {
      mark.style.setProperty(`--mark-${key}`, key === "rot" ? `${rendered[key]}deg` : rendered[key]);
    }
  };

  /** Chase the target until the two states agree, then stop drawing. */
  const tick = () => {
    frame = 0;
    let moving = false;

    for (const key of KEYS) {
      const next = lerp(rendered[key], target[key], CHASE);
      if (Math.abs(target[key] - next) > EPSILON) {
        rendered[key] = next;
        moving = true;
      } else {
        rendered[key] = target[key];
      }
    }

    paint();
    if (moving) frame = requestAnimationFrame(tick);
  };

  const onScroll = () => {
    target = stateAt(frames, window.scrollY);
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const measure = () => {
    // The sticky offset is read from the declared style: the element's current
    // box only reports it while the stage is actually stuck.
    const declared = Number.parseFloat(getComputedStyle(stage).top);
    frames = readKeyframes(track, sections, Number.isFinite(declared) ? declared : 0);
    onScroll();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  // Late-loading fonts change section heights, and every keyframe is a measured
  // offset, so the track is re-measured once the text has settled.
  document.fonts?.ready.then(measure).catch(() => {});

  // Tells the stylesheet the engine is live and the stage may be pinned.
  track.classList.add("is-pinned");
  measure();
  // The first paint must not animate in from rest — snap to the real state.
  rendered = { ...target };
  paint();
}
