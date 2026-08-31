/**
 * The renderers the build and the browser share.
 *
 * PURE, and that is the point: the build writes the first paint of a request's
 * track, its approvals and its audit trail, and the browser rewrites exactly
 * those three things as the visitor drives the workflow forward. If the two
 * sides drew them separately they would drift, and the demonstration would show
 * one interface before you touch it and a slightly different one after.
 *
 * It lives under `src/scripts/` rather than `tools/` because both sides import
 * it — the build through `tools/flujo/blocks.mjs`, the browser directly.
 */

import { escape } from "../../data/flujo/format.js";
import { money, roleName, slaStatus, states } from "../../data/flujo/workflows.js";

/* -------------------------------------------------------------------- icons */

/* A deliberately tiny subset of the build's icon set: only the glyphs that
   appear inside something the browser re-renders. */
const PATHS = {
  check: '<path d="m3 8.5 3.2 3.2L13 5"/>',
  clock: '<circle cx="8" cy="8" r="6"/><path d="M8 4.6V8l2.4 1.6"/>',
  alert: '<path d="M8 2.5 14.5 13.5h-13z"/><path d="M8 6.5v3M8 11.6v.1"/>',
  arrow: '<path d="M2 8h11M9.5 4.5 13 8l-3.5 3.5"/>',
  open: '<circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/>',
  closed: '<circle cx="8" cy="8" r="6"/><path d="M5.5 8h5"/>',
  edit: '<path d="M11.2 2.8 13.2 4.8 5.5 12.5 2.8 13.2l.7-2.7z"/>',
  doc: '<path d="M4 2.2h5l3 3v8.6H4z"/><path d="M9 2.2v3h3"/>',
  rule: '<path d="M8 2.4v3.2M8 10.4v3.2"/><rect x="4.6" y="5.6" width="6.8" height="4.8" rx="1"/>',
  user: '<circle cx="8" cy="5.4" r="2.6"/><path d="M3 13.4c0-2.8 2.2-5 5-5s5 2.2 5 5"/>',
  cog: '<circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6"/>',
  mail: '<path d="M2.4 4h11.2v8H2.4z"/><path d="m2.4 4.6 5.6 4 5.6-4"/>',
};

export const icon = (name, className = "") =>
  `<svg class="fx-icon${className ? ` ${className}` : ""}" width="16" height="16" viewBox="0 0 16 16" ` +
  `aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" ` +
  `stroke-linecap="round" stroke-linejoin="round">${PATHS[name] ?? PATHS.arrow}</svg>`;

/* --------------------------------------------------------------- the state */

/**
 * A request's state, as colour + icon + word.
 *
 * All three channels, always. A register read by someone who cannot separate
 * the greens from the ambers has to lose nothing, and "Aprobada" is the part
 * that actually says so.
 */
export function statePill(key) {
  const state = states[key];
  if (!state) return "";
  return (
    `<span class="fx-state fx-state--${state.tone}">${icon(state.icon)}${escape(state.label)}</span>`
  );
}

/* ----------------------------------------------------------------- the SLA */

/**
 * Time left against the target.
 *
 * Four outcomes rather than three: a closed request reports how long it took,
 * which is the number a manager actually wants from the rows that are done.
 */
export function slaBadge(request) {
  const status = slaStatus(request);
  const glyph = status.level === "over" ? "alert" : status.level === "closed" ? "check" : "clock";
  const tone = status.level === "closed" ? "" : ` wf-sla--${status.level}`;
  return (
    `<span class="wf-sla${tone}" title="${escape(status.detail)}">` +
    `${icon(glyph)}${escape(status.short)}</span>`
  );
}

/* --------------------------------------------------------------- the track */

/**
 * Where a request is, as a list of stages.
 *
 * `state` per node is one of done / current / pending / blocked. The component
 * is the same markup in both directions — the stylesheet lays it on a row above
 * 52rem and down the page below it — so a phone gets a vertical timeline rather
 * than a squeezed horizontal one.
 */
export function track(nodes, { wide = true } = {}) {
  const glyphFor = (state) =>
    state === "done" ? icon("check") : state === "blocked" ? icon("alert") : "";

  return (
    `<ol class="wf-track${wide ? " wf-track--wide" : ""}" data-wf-track>` +
    nodes
      .map(
        (node) =>
          `<li class="wf-track__node" data-state="${escape(node.state)}" data-step="${escape(node.id ?? "")}">` +
          `<span class="wf-track__dot">${glyphFor(node.state)}</span>` +
          `<span><span class="wf-track__label">${escape(node.label)}</span>` +
          (node.meta ? `<span class="wf-track__meta">${escape(node.meta)}</span>` : "") +
          `</span></li>`,
      )
      .join("") +
    `</ol>`
  );
}

/* ------------------------------------------------------- an approval record */

/**
 * What one authorisation leaves behind.
 *
 * Responsible, area, date, time, comment and outcome — the six things the brief
 * asks every approval to record, and the six an auditor would ask for.
 */
export function approvalRecord(entry) {
  const outcome =
    entry.outcome === "rechazada"
      ? { label: "Rechazado", tone: "bad", glyph: "closed" }
      : entry.outcome === "cambios"
        ? { label: "Cambios solicitados", tone: "warn", glyph: "edit" }
        : { label: "Aprobado", tone: "ok", glyph: "check" };

  return (
    `<li class="wf-record" data-outcome="${escape(entry.outcome ?? "aprobada")}">` +
    `<div class="wf-record__top">` +
    `<div class="wf-record__who">` +
    `<span class="wf-person__avatar" aria-hidden="true">${escape(entry.initials ?? "··")}</span>` +
    `<span><span class="wf-record__name">${escape(entry.name)}</span>` +
    `<span class="wf-record__area">${escape(entry.area)}</span></span></div>` +
    `<span class="fx-state fx-state--${outcome.tone}">${icon(outcome.glyph)}${outcome.label}</span>` +
    `</div>` +
    `<p class="wf-record__when">${escape(entry.date)} · ${escape(entry.time)}</p>` +
    (entry.comment ? `<p class="wf-record__comment">${escape(entry.comment)}</p>` : "") +
    `</li>`
  );
}

/* ---------------------------------------------------------- an audit entry */

const AUDIT_GLYPH = {
  person: "user",
  system: "cog",
  rule: "rule",
  approval: "check",
  document: "doc",
  escalation: "alert",
  rejection: "closed",
  notification: "mail",
};

export function auditRow(entry) {
  return (
    `<li class="wf-audit__row" data-kind="${escape(entry.kind)}">` +
    `<span class="wf-audit__time">${escape(entry.time)}</span>` +
    `<span class="wf-audit__dot">${icon(AUDIT_GLYPH[entry.kind] ?? "cog")}</span>` +
    `<span><span class="wf-audit__title">${escape(entry.title)}</span>` +
    `<span class="wf-audit__text">${escape(entry.text)}</span>` +
    `<span class="wf-audit__actor">${escape(entry.actor)}</span></span></li>`
  );
}

export const auditList = (entries) =>
  `<ol class="wf-audit" data-wf-audit>${entries.map(auditRow).join("")}</ol>`;

/* --------------------------------------------------------------- a person */

export const personRow = (person, roleKey) =>
  `<li class="wf-person">` +
  `<span class="wf-person__avatar" aria-hidden="true">${escape(person.initials)}</span>` +
  `<span><span class="wf-person__name">${escape(person.name)}</span>` +
  `<span class="wf-person__role">${escape(roleName(roleKey ?? person.role))} · ${escape(person.position)}</span>` +
  `</span></li>`;

/* ------------------------------------------------------------ a register row */

export const REGISTER_COLUMNS = [
  { label: "Código", key: "code" },
  { label: "Tipo", key: "type" },
  { label: "Solicitante", key: "requester" },
  { label: "Área", key: "area" },
  { label: "Fecha", key: "date" },
  { label: "Monto", key: "amount", numeric: true },
  { label: "Responsable", key: "responsible" },
  { label: "Estado", key: "state" },
  { label: "Tiempo", key: "sla" },
];

/**
 * One row of the register, as cells.
 *
 * Shared with the build so a row re-rendered after a filter cannot come out
 * different from the row the build wrote. The code cell carries the subject
 * underneath it: nine columns is already the most a register can hold, and
 * "SOL-2026-0148" on its own tells a reader nothing about what it is for.
 */
export const registerCells = (request, href, date) => [
  `<a class="wf-code" href="${escape(href)}">${escape(request.code)}</a>` +
    `<span class="wf-audit__text">${escape(request.concept)}</span>`,
  escape(request.type),
  escape(request.requester),
  escape(request.area),
  escape(date),
  money(request.amount, { cents: false }),
  escape(roleName(request.responsible)),
  statePill(request.state),
  slaBadge(request),
];
