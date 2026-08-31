/**
 * What the demonstration remembers between visits.
 *
 * One key, one shape, and a version on it. The point of persisting anything at
 * all is that a workflow which forgets your request the moment you scroll away
 * does not feel like a system — it feels like a slideshow. So the request you
 * filled in, the state it reached and the authorisations you recorded survive a
 * reload, and the "Reiniciar demo" control puts it all back.
 *
 * Storage can throw as well as return null — a private window, a browser set to
 * block site data, an origin with storage disabled — so every access is wrapped
 * and every failure degrades to "this visitor starts fresh", which is a correct
 * state rather than an error.
 */

import { STORAGE_KEY } from "../../data/flujo/workflows.js";

const VERSION = 1;

/** The empty state: nothing submitted, nothing decided. */
export const emptyState = () => ({
  v: VERSION,
  request: null,
  createdAt: null,
  decisions: [],
  closed: false,
});

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();

    const parsed = JSON.parse(raw);
    /* A stored shape from an older version of the module is not migrated: this
       is a demonstration, and starting clean is a better outcome than half a
       request rendered by code that no longer matches it. */
    if (!parsed || parsed.v !== VERSION) return emptyState();

    return {
      v: VERSION,
      request: parsed.request ?? null,
      createdAt: parsed.createdAt ?? null,
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      closed: Boolean(parsed.closed),
    };
  } catch {
    return emptyState();
  }
}

export function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, v: VERSION }));
    return true;
  } catch {
    /* Nothing to recover: the demo keeps working, it just will not be there
       tomorrow. Callers do not branch on this. */
    return false;
  }
}

export function clear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Already unavailable, which is the state we were asking for. */
  }
}

/** Whether anything has been stored worth offering to reset. */
export const hasProgress = (state) => Boolean(state.request) || state.decisions.length > 0;
