/**
 * The quick-quote panel — the working half. `cotizador.js` is the entry point
 * every page still links, and all it does is pull this file in once the browser
 * is idle or the visitor actually reaches for a trigger. Nothing here changed in
 * the split: the module is the same one, it just arrives after the page instead
 * of alongside it.
 *
 * Every "Hablemos" / "Quiero un portal como este" / "Crear mi proyecto" on the
 * portfolio and inside the six demo families used to be a link: a `mailto:` on
 * the portfolio, a jump back to `index.html#contacto` from the demos. Both cost
 * the visitor the page they were reading. This replaces all of them with a
 * panel that opens over the page they are already on, collects four fields and
 * hands the whole thing to WhatsApp already written.
 *
 * It is deliberately self-contained: the markup is built here, the styles live
 * in one component sheet imported by all seven bundles, and the triggers are
 * found by delegation rather than wired per page. Adding the script tag to a
 * page is the entire integration — there is no per-page markup to keep in sync
 * across the 143 files this ships on.
 *
 * The destination is `site.contact.whatsapp` in `src/data/site.js`, and that is
 * the only place it appears.
 */

import { site } from "../data/site.js";

/* Below this width the panel stops being a column beside the page and becomes
   the page. Must match the breakpoint in `components/cotizador.css`: the drag
   gesture is only wired up when the sheet is the full-screen one. */
const SHEET_QUERY = "(max-width: 47.5rem)";

/* How far the sheet has to be pulled down before the release dismisses it. Low
   enough that a deliberate flick works, high enough that a thumb resting on the
   header while scrolling does not throw the form away. */
const DISMISS_PX = 110;

/* The site ships a Spanish tree and an English mirror under `en/`, and the
   mirror is built by translating HTML text runs — which cannot reach a string
   that only exists inside this module. So the panel carries its own two
   columns and picks between them from the document the script is running in,
   the same signal `build-i18n.mjs` sets. Anything unrecognised gets Spanish. */
const COPY = {
  es: {
    eyebrow: "Cotización rápida",
    title: "Hablemos de tu próximo proyecto.",
    close: "Cerrar el formulario",
    dismiss: "Cerrar",
    name: "Nombre completo",
    namePlaceholder: "Ej. Carlos Martínez",
    reach: "Correo o teléfono",
    reachPlaceholder: "correo@empresa.com o +504 0000-0000",
    kind: "Tipo de solución",
    detail: "Breve descripción",
    detailPlaceholder: "Cuéntanos qué necesitas resolver…",
    send: "Enviar",
    doneTitle: "Tu mensaje está listo",
    doneWhatsApp:
      "Abrimos WhatsApp con la solicitud ya escrita. Si no se abrió, revisa si el navegador bloqueó la ventana.",
    doneMail:
      "Abrimos tu correo con la solicitud ya escrita. Si no se abrió, revisa si el navegador bloqueó la ventana.",
    copySending: "Enviando una copia a nuestro correo…",
    copySent: "Copia recibida en nuestro correo. Te respondemos en horario laboral.",
    copyFailed:
      "No pudimos dejar la copia por correo. Termina el envío en WhatsApp, o escríbenos a",
    again: "Escribir otra solicitud",
    greeting: "Hola CoreStruct, quiero cotizar un proyecto.",
    fName: "Nombre",
    fReach: "Contacto",
    fKind: "Tipo de solución",
    fDetail: "Descripción",
    subject: "Cotización",
  },
  en: {
    eyebrow: "Quick quote",
    title: "Let us talk about your next project.",
    close: "Close the form",
    dismiss: "Close",
    name: "Full name",
    namePlaceholder: "e.g. Carlos Martínez",
    reach: "Email or phone",
    reachPlaceholder: "you@company.com or +504 0000-0000",
    kind: "Type of solution",
    detail: "Short description",
    detailPlaceholder: "Tell us what you need to solve…",
    send: "Send",
    doneTitle: "Your message is ready",
    doneWhatsApp:
      "We opened WhatsApp with your request already written. If nothing happened, check whether the browser blocked the window.",
    doneMail:
      "We opened your mail app with the request already written. If nothing happened, check whether the browser blocked the window.",
    copySending: "Sending a copy to our inbox…",
    copySent: "The copy reached our inbox. We reply during working hours.",
    copyFailed:
      "We could not leave the copy by email. Finish sending on WhatsApp, or write to us at",
    again: "Write another request",
    greeting: "Hello CoreStruct, I would like a quote for a project.",
    fName: "Name",
    fReach: "Contact",
    fKind: "Type of solution",
    fDetail: "Description",
    subject: "Quote request",
  },
};

/* `build-i18n.mjs` stamps the mirror's pages `lang="en"`; everything else is
   Spanish, and so is anything unrecognised. */
const lang = document.documentElement.lang?.slice(0, 2) === "en" ? "en" : "es";
const t = COPY[lang];

const { contact, quote } = site;

/** The service catalogue, in the language of the page. */
const types = quote?.types?.[lang] ?? quote?.types?.es ?? [];
const digits = String(contact.whatsapp ?? "").replace(/\D/g, "");
const hasWhatsApp = digits.length > 0;

/** Every address the panel offers, primary first, with duplicates dropped. */
const addresses = [...new Set([contact.email, ...(contact.emails ?? [])].filter(Boolean))];

/* The one place the outgoing channel is decided. Everything else — the button
   label, the icon, the confirmation copy — reads off this. */
const channel = hasWhatsApp ? "whatsapp" : "email";

/**
 * Where the copy of each request is mailed from.
 *
 * WhatsApp is the channel the visitor sees, and it is the one that can be
 * abandoned: the browser hands the message to WhatsApp already written, and
 * whether it is actually sent from there is out of the site's hands. So the
 * same four fields also go to a small server-side endpoint that mails them to
 * the studio, and a request that was typed out is never lost because someone
 * closed the WhatsApp tab without pressing send.
 *
 * `null` in `site.js` turns this half off; the panel then behaves exactly as
 * it did before, handing the request to WhatsApp and nothing else.
 *
 * The address is resolved against this module's own URL rather than against
 * the page. This file always sits in `<root>/src/scripts/`, so two
 * levels up is the root of the site wherever it is deployed — which is the one
 * thing a page cannot work out for itself: the panel runs on pages at three
 * different depths, and a root-relative `/api/…` would also break the moment
 * the site were served from a subdirectory rather than from a domain root.
 */
const SITE_ROOT = new URL("../../", import.meta.url);

const endpoint = contact.quoteEndpoint
  ? new URL(contact.quoteEndpoint, SITE_ROOT).href
  : null;

const ICONS = {
  spark:
    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">` +
    `<path d="M12 2.5l1.6 4.6 4.6 1.6-4.6 1.6L12 15l-1.6-4.7L5.8 8.7l4.6-1.6L12 2.5Z"/>` +
    `<path d="M18.5 14l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" opacity=".7"/>` +
    `</svg>`,
  close:
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
    `stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  send:
    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">` +
    `<path d="M2.2 11.1 20.6 3.3c.8-.3 1.6.5 1.3 1.3l-7.8 18.4c-.3.8-1.5.8-1.8-.1l-2.4-6.8-6.8-2.4c-.9-.3-.9-1.5.1-1.6Z"/></svg>`,
  check:
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">` +
    `<path d="m4 12.5 5.5 5.5L20 7"/></svg>`,
};

const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ markup */

function markup() {
  const options = types
    .map((type) => `<option value="${escape(type)}">${escape(type)}</option>`)
    .join("");

  return (
    `<button class="cs-quote__veil" type="button" data-quote-veil aria-label="${escape(t.dismiss)}"></button>` +
    `<div class="cs-quote__panel" role="dialog" aria-modal="true" aria-labelledby="cs-quote-title">` +
      `<span class="cs-quote__grip" aria-hidden="true"></span>` +
      `<button class="cs-quote__close" type="button" data-quote-close aria-label="${escape(t.close)}">` +
        ICONS.close +
      `</button>` +
      `<header class="cs-quote__head" data-quote-head>` +
        `<p class="cs-quote__eyebrow">${ICONS.spark} ${escape(t.eyebrow)}</p>` +
        `<h2 class="cs-quote__title" id="cs-quote-title">${escape(t.title)}</h2>` +
      `</header>` +
      `<div class="cs-quote__body" data-quote-body>` +
        `<form data-quote-form novalidate>` +
          `<label class="cs-quote__field">` +
            `<span class="cs-quote__label">${escape(t.name)} <span class="cs-quote__req">*</span></span>` +
            `<input class="cs-quote__input" name="nombre" type="text" autocomplete="name" ` +
              `placeholder="${escape(t.namePlaceholder)}" required />` +
          `</label>` +
          `<label class="cs-quote__field">` +
            `<span class="cs-quote__label">${escape(t.reach)} <span class="cs-quote__req">*</span></span>` +
            `<input class="cs-quote__input" name="contacto" type="text" autocomplete="email" ` +
              `placeholder="${escape(t.reachPlaceholder)}" required />` +
          `</label>` +
          `<label class="cs-quote__field">` +
            `<span class="cs-quote__label">${escape(t.kind)}</span>` +
            `<select class="cs-quote__select" name="tipo">${options}</select>` +
          `</label>` +
          `<label class="cs-quote__field">` +
            `<span class="cs-quote__label">${escape(t.detail)} <span class="cs-quote__req">*</span></span>` +
            `<textarea class="cs-quote__area" name="detalle" ` +
              `placeholder="${escape(t.detailPlaceholder)}" required></textarea>` +
          `</label>` +
          `<button class="cs-quote__submit" type="submit">${ICONS.send}${escape(t.send)}</button>` +
        `</form>` +
      `</div>` +
    `</div>`
  );
}

/**
 * The view the form is replaced by once the message has been handed off.
 *
 * The copy line starts as "sending" and is rewritten by `markCopy` when the
 * endpoint answers. It is rendered from the start rather than appended later so
 * the panel does not jump a line taller halfway through reading it.
 */
function confirmation() {
  const copy = endpoint
    ? `<p class="cs-quote__copy" data-quote-copy data-state="sending">` +
        `<span class="cs-quote__copy-mark" aria-hidden="true"></span>` +
        `<span data-quote-copy-text>${escape(t.copySending)}</span>` +
      `</p>`
    : "";

  return (
    `<div class="cs-quote__done">` +
      `<span class="cs-quote__done-mark">${ICONS.check}</span>` +
      `<h3 class="cs-quote__done-title">${escape(t.doneTitle)}</h3>` +
      `<p class="cs-quote__done-text">${escape(hasWhatsApp ? t.doneWhatsApp : t.doneMail)}</p>` +
      copy +
      `<button class="cs-quote__again" type="button" data-quote-again>${escape(t.again)}</button>` +
    `</div>`
  );
}

/* ------------------------------------------------------------------ module */

let root = null;
let opener = null;
let previousOverflow = "";

/** Built once, on the first open, so a page nobody clicks pays nothing. */
function mount() {
  if (root) return root;

  root = document.createElement("div");
  root.className = "cs-quote";
  root.hidden = true;
  root.innerHTML = markup();
  document.body.append(root);

  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-quote-veil], [data-quote-close]")) close();
    if (event.target.closest("[data-quote-again]")) reset();
  });

  root.addEventListener("submit", (event) => {
    event.preventDefault();
    send(event.target);
  });

  /* Focus must not be allowed to leave the panel while it is over the page:
     tabbing into the page behind a modal is how a keyboard user gets lost. */
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const stops = focusable();
    if (!stops.length) return;

    const first = stops[0];
    const last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  dragToDismiss();
  return root;
}

const focusable = () =>
  [
    ...root.querySelectorAll(
      "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])",
    ),
  ].filter((el) => el.offsetParent !== null || el === document.activeElement);

/**
 * Pulling the mobile sheet down closes it. The panel is the whole screen there,
 * so without this the close button is the only way back and it is at the top —
 * the far end of a one-handed reach.
 */
function dragToDismiss() {
  const panel = root.querySelector(".cs-quote__panel");
  const head = root.querySelector("[data-quote-head]");
  let start = 0;
  let travelled = 0;

  head.addEventListener(
    "touchstart",
    (event) => {
      if (!window.matchMedia(SHEET_QUERY).matches) return;
      start = event.touches[0].clientY;
      travelled = 0;
      root.dataset.dragging = "";
    },
    { passive: true },
  );

  head.addEventListener(
    "touchmove",
    (event) => {
      if (!("dragging" in root.dataset)) return;
      /* Upward movement is ignored rather than tracked: the sheet is already
         at its top stop, and following the finger up would tear it off the
         edge of the screen. */
      travelled = Math.max(0, event.touches[0].clientY - start);
      panel.style.transform = `translateY(${travelled}px)`;
    },
    { passive: true },
  );

  const release = () => {
    if (!("dragging" in root.dataset)) return;
    delete root.dataset.dragging;
    panel.style.transform = "";
    if (travelled > DISMISS_PX) close();
  };

  head.addEventListener("touchend", release);
  head.addEventListener("touchcancel", release);
}

function onKeydown(event) {
  if (event.key === "Escape") close();
}

/** Restores the form after a send, so a second request does not need a reload. */
function reset() {
  const body = root.querySelector("[data-quote-body]");
  delete root.dataset.touched;
  body.innerHTML = "";
  body.append(...buildForm());
  body.querySelector("input")?.focus();
}

/** The form markup, re-parsed. Cheaper to keep one source than to clone. */
function buildForm() {
  const host = document.createElement("div");
  host.innerHTML = markup();
  return [...host.querySelector("[data-quote-body]").children];
}

export function open(trigger = null) {
  mount();
  opener = trigger ?? document.activeElement;

  root.hidden = false;
  /* Two frames: one for the browser to lay the panel out at its off-screen
     start position, one for the class change to animate from it. A single
     rAF is enough in Chrome and not in Safari. */
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      root.dataset.state = "open";
    }),
  );

  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  document.addEventListener("keydown", onKeydown);

  /* Not the first field on touch: focusing an input raises the keyboard over
     the form the visitor has not read yet. */
  if (!window.matchMedia("(hover: none)").matches) {
    root.querySelector("input")?.focus({ preventScroll: true });
  }
}

export function close() {
  if (!root || root.hidden) return;

  delete root.dataset.state;
  document.documentElement.style.overflow = previousOverflow;
  document.removeEventListener("keydown", onKeydown);

  const panel = root.querySelector(".cs-quote__panel");
  const done = () => {
    root.hidden = true;
    panel.removeEventListener("transitionend", done);
  };
  panel.addEventListener("transitionend", done);
  /* A transition that never runs — reduced motion, a background tab — would
     otherwise leave the panel displayed but invisible, swallowing every click
     on the page underneath it. */
  setTimeout(done, 500);

  opener?.focus?.({ preventScroll: true });
  opener = null;
}

/**
 * Composes the request and sends it down both roads at once: the visitor's, to
 * WhatsApp with the message already written, and the studio's, to the inbox
 * through `api/contacto.php`.
 *
 * The two are deliberately independent. WhatsApp is what the visitor sees and
 * it is also the half that can quietly fail — the tab gets closed, the popup is
 * blocked, the desktop app never opens — so the mailed copy is what guarantees
 * a request that was typed out actually reaches someone. Neither waits for the
 * other, and neither can break the other.
 */
function send(form) {
  root.dataset.touched = "";
  if (!form.checkValidity()) {
    form.querySelector(":invalid")?.focus();
    return;
  }

  const data = new FormData(form);
  const value = (name) => String(data.get(name) ?? "").trim();

  const request = {
    nombre: value("nombre"),
    contacto: value("contacto"),
    tipo: value("tipo"),
    detalle: value("detalle"),
    idioma: lang,
    origen: window.location.href,
  };

  const lines = [
    t.greeting,
    "",
    `${t.fName}: ${request.nombre}`,
    `${t.fReach}: ${request.contacto}`,
    `${t.fKind}: ${request.tipo}`,
    "",
    `${t.fDetail}:`,
    request.detalle,
  ];

  /* Sent through a link rather than `location.href` so the page the visitor was
     reading is still there when they come back from WhatsApp. */
  const href =
    channel === "whatsapp"
      ? `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`
      : `mailto:${addresses[0]}?subject=${encodeURIComponent(
          `${t.subject} — ${request.tipo}`,
        )}&body=${encodeURIComponent(lines.join("\n"))}`;

  /* Opened first, and never after awaiting anything: a popup blocker only
     trusts a window opened synchronously inside the gesture that asked for it,
     and going to the network first would spend that trust. */
  window.open(href, "_blank", "noopener");

  root.querySelector("[data-quote-body]").innerHTML = confirmation();

  mailCopy(request);
}

/** Hands the same four fields to the endpoint that mails them to the studio. */
async function mailCopy(request) {
  if (!endpoint) return;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      /* The visitor is on their way to WhatsApp. `keepalive` is what lets the
         request finish even if this page is navigated away from or frozen the
         moment after it goes out. */
      keepalive: true,
    });

    const payload = await response.json().catch(() => ({}));

    if (response.ok && payload?.ok === true) {
      markCopy("sent");
      return;
    }

    /* Loud in the console, quiet in the panel. Whoever is looking at the page
       gets one line that says which half failed and why — the endpoint's own
       error code, or the HTTP status when the answer was not even JSON, which
       is what a missing `api/` or a server without PHP looks like from here. */
    warn(`el endpoint respondió ${response.status}`, payload);
    markCopy("failed");
  } catch (error) {
    /* Offline, blocked, or `api/contacto.php` was never uploaded. The request
       is still on its way through WhatsApp, so this is a footnote and not an
       error state for the whole panel. */
    warn("no se pudo llamar al endpoint", error);
    markCopy("failed");
  }
}

/** One console line, with the address actually used — that is the usual bug. */
function warn(reason, detail) {
  console.warn(
    `[cotizador] La copia por correo no salió: ${reason}.\n` +
      `  Endpoint: ${endpoint}\n` +
      `  Comprueba que api/contacto.php esté subido, que el servidor ejecute PHP\n` +
      `  y que api/config.php exista junto a él.`,
    detail ?? "",
  );
}

/** Rewrites the copy line in the confirmation once the endpoint has answered. */
function markCopy(state) {
  const line = root?.querySelector("[data-quote-copy]");
  const text = line?.querySelector("[data-quote-copy-text]");
  if (!line || !text) return;

  line.dataset.state = state;

  if (state === "sent") {
    text.textContent = t.copySent;
    return;
  }

  const address = addresses[0];
  text.innerHTML = address
    ? `${escape(t.copyFailed)} <a href="mailto:${escape(address)}">${escape(address)}</a>.`
    : `${escape(t.copyFailed)}.`;
}

/* ---------------------------------------------------------------- triggers */

/* What counts as a request to talk to the studio. `[data-cotizador]` is the
   explicit opt-in used on the portfolio, where `#contacto` also has to keep
   working as a plain scroll target for the nav. Inside the demos there is no
   such ambiguity: any link back to the portfolio's contact section is a
   visitor asking for a quote, and is answered here instead of by a page load
   that would lose them the demo they were exploring.

   The slash is what separates the two cases now that the links are clean. A
   demo reaches the portfolio by climbing — `../#contacto`, `../../#contacto`,
   `../../../#contacto` — and every one of those contains `/#contacto`. The
   portfolio's own nav link is the bare `#contacto`, which does not, so it
   still scrolls instead of opening the panel. */
const TRIGGER = '[data-cotizador], a[href*="/#contacto"]';

document.addEventListener("click", (event) => {
  const trigger = event.target.closest(TRIGGER);
  if (!trigger) return;
  /* Modified clicks are the visitor asking for a new tab; that is a legitimate
     thing to want from a link and the panel should not steal it. */
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

  event.preventDefault();
  open(trigger);
});

/* `index.html#cotizar` opens the panel on arrival, so a demo, an ad or a QR can
   link straight into the form from outside the site. */
if (window.location.hash === "#cotizar") open();
