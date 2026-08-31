/**
 * The two kinds of page the demo has.
 *
 * `modulePage` is the console: pick one of six processes, fill four fields,
 * watch the engine validate the request, apply the amount rule, pick the people
 * that rule selected and start the flow — then authorise it as each of them in
 * turn and end on the document, the notification and the trail it produced.
 *
 * `requestPage` is one request's file: the five tabs a case worker would open.
 *
 * Both are written at build time, in full. The engine in the browser drives the
 * first one forward, but nothing on either page is *supplied* by JavaScript: a
 * reader with none still gets the route, the rule, the trail and the document,
 * because a demonstration that is blank until a script runs is a demonstration
 * of a script.
 */

import { escape, longDate } from "../../src/data/flujo/format.js";
import {
  advantages,
  approvals,
  approvalsFor,
  auditTrail,
  closingSteps,
  duration,
  escalation,
  extraction,
  featured,
  formOptions,
  impact,
  impactNote,
  miniDemos,
  moduleInfo,
  money,
  notification,
  processes,
  roleName,
  ruleFor,
  slaStatus,
  stateName,
  states,
  userFor,
  workflows,
} from "../../src/data/flujo/workflows.js";
import {
  approvalRecord,
  auditList,
  auditRow,
  personRow,
  slaBadge,
  statePill,
  track,
} from "../../src/scripts/flujo/render.js";
import {
  arrowLink,
  demoTag,
  flag,
  icon,
  simTag,
  verificationMark,
} from "./blocks.mjs";
import { hero, product } from "./shell.mjs";

/* ============================================================ small pieces */

/** One control of the request form, with its label, hint and error line. */
function field({
  id,
  label,
  value = "",
  type = "text",
  required = false,
  hint,
  error,
  options,
  textarea,
  locked = false,
  wide = false,
  placeholder,
  inputmode,
}) {
  const control = options
    ? `<span class="fx-select"><select class="fx-input" id="${id}" name="${id}"` +
      `${required ? " required" : ""} data-wf-field>` +
      options
        .map(
          (option) =>
            `<option value="${escape(option)}"${option === value ? " selected" : ""}>` +
            `${escape(option)}</option>`,
        )
        .join("") +
      `</select></span>`
    : textarea
      ? `<textarea class="fx-input" id="${id}" name="${id}" rows="3"` +
        `${required ? " required" : ""} data-wf-field>${escape(value)}</textarea>`
      : `<input class="fx-input${locked ? " wf-input--locked" : ""}" id="${id}" name="${id}" ` +
        `type="${type}" value="${escape(value)}"${required ? " required" : ""}` +
        `${locked ? " readonly" : ""}${placeholder ? ` placeholder="${escape(placeholder)}"` : ""}` +
        `${inputmode ? ` inputmode="${inputmode}"` : ""} data-wf-field />`;

  return (
    `<div class="wf-form__field${wide ? " wf-form__field--wide" : ""}">` +
    `<div class="wf-form__labelrow">` +
    `<label class="wf-form__label" for="${id}">${escape(label)}` +
    `${required ? '<span class="wf-req" aria-hidden="true"> *</span>' : ""}</label>` +
    `<span class="wf-ok">${icon("check")}Correcto</span>` +
    `</div>` +
    control +
    (hint ? `<p class="wf-form__hint">${escape(hint)}</p>` : "") +
    `<p class="wf-form__error" id="${id}-error">${icon("alert")}` +
    `<span data-wf-error-text>${escape(error ?? "Este campo es obligatorio.")}</span></p>` +
    `</div>`
  );
}

/** A definition list, the module's workhorse for "here are the facts". */
const facts = (items, className = "wf-fields") =>
  `<dl class="${className}">` +
  items
    .map((item) => `<div><dt>${escape(item.term)}</dt><dd>${item.html ?? escape(item.detail)}</dd></div>`)
    .join("") +
  `</dl>`;

/**
 * The five display stages of a request.
 *
 * The engine's route has ten steps, but three of them are the closing
 * automation and two are the intake; a person following their own purchase
 * order wants five. The approval stops in the middle are whatever the amount
 * rule selected, so a large request grows a stage and a small one loses two.
 */
function trackNodes(request, done = 0) {
  const stops = approvalsFor(request.workflow, request).map((step) => ({
    id: step.id,
    label: step.label,
    meta: userFor(step.role).name,
  }));

  const nodes = [
    { id: "submitted", label: "Solicitud creada", meta: request.requester },
    { id: "validation", label: "Validación automática", meta: "Automática" },
    ...stops,
    { id: "completed", label: "Finalización", meta: "Documento y archivo" },
  ];

  return nodes.map((node, index) => ({
    ...node,
    state: index < done ? "done" : index === done ? "current" : "pending",
  }));
}

/* ========================================================== 01 · the intro */

/**
 * The only prose left on the page, and two sentences of it are load-bearing.
 *
 * An earlier pass cut the introduction to a title and two chips, on the
 * principle that a console which has to be introduced has not been designed.
 * That went one cut too far: a visitor arriving cold could see what to press
 * and still not know what work any of it replaces. `purpose` is the answer, and
 * it is deliberately concrete — the errand, then the mechanism — rather than a
 * sentence about digital transformation.
 */
function intro() {
  return `        <header class="gw-intro">
          <div class="gw-intro__lead">
            <p class="gw-eyebrow">${escape(product.descriptor)} · ${escape(moduleInfo.tag)}</p>
            <h1 class="gw-intro__title">Ejecute una solicitud <em>de principio a fin</em>.</h1>
            <p class="gw-intro__purpose">${escape(moduleInfo.purpose)}</p>
          </div>
          <p class="gw-intro__actions">
            ${demoTag("Datos ficticios")}${demoTag("Sin servidor")}
          </p>
        </header>`;
}

/* ---------------------------------------------------------- what it replaces */

/**
 * One line of "and this is why", set where the thing is happening.
 *
 * Not a benefit bullet: it names the errand that the panel above it deletes, at
 * the moment the visitor is watching that panel do its work. Marked up as an
 * aside and set apart visually, so it reads as commentary rather than as one
 * more instruction to follow.
 */
const gain = (id) => {
  const item = advantages.find((entry) => entry.id === id);
  if (!item) return "";
  return (
    `<p class="gw-gain">` +
    `<span class="gw-gain__before">${escape(item.before)}</span>` +
    `<span class="gw-gain__after">${escape(item.after)}</span>` +
    `</p>`
  );
};

/* =========================================================== 02 · the rail */

/**
 * Six processes, as controls.
 *
 * Each one used to be a card with an index, an icon, a title, two lines of
 * description and a status line. It is now a chip: the description moved to the
 * tooltip and to the message the chip answers with, because the thing being
 * demonstrated is that one engine runs all six, and that claim is made by six
 * chips reacting to a press — not by six paragraphs saying so.
 *
 * The dot marks the two that open their own worked example.
 */
function rail() {
  const chips = processes
    .map((process) => {
      /* Three grades of chip, so a visitor can see what each one will do before
         pressing it: the one that runs end to end, the two that open a worked
         example, and the three that only name a process the engine would run.
         A row of six identical chips where half of them do nothing much is the
         opposite of intuitive. */
      const kind = process.full ? "full" : process.mini ? "example" : "soon";

      return (
        `<button class="gw-chip" type="button" data-wf-process="${escape(process.id)}"` +
        ` data-kind="${kind}"${process.full ? " data-full" : ""}` +
        ` aria-pressed="${process.full ? "true" : "false"}" title="${escape(process.text)}">` +
        icon(process.icon) +
        `<span class="gw-chip__name">${escape(process.title)}</span>` +
        (kind === "example" ? `<span class="gw-chip__dot" aria-hidden="true"></span>` : "") +
        `</button>`
      );
    })
    .join("");

  return `        <div class="gw-rail" id="proceso" role="group" aria-label="Procesos que corre el motor">
          ${chips}
        </div>`;
}

/* ========================================================== 03 · the spine */

/**
 * Where the request is, always on screen.
 *
 * The one component that never changes place across the four stages, because it
 * is the answer to the only question a visitor carries from stage to stage.
 * Painted at build time with every stop still pending — not one of them
 * "current", because nothing has been sent yet and a lit first marker over the
 * word "Sin enviar" is the interface contradicting itself. The route exists
 * before the request does, which is the point of a workflow engine; being able
 * to see it has not started is the point of drawing it this way.
 */
function spine() {
  return `        <div class="gw-pane gw-lit gw-spine">
          <div class="gw-spine__head">
            <p class="gw-spine__code" data-wf-code>Solicitud ${escape(featured.code)}</p>
            <span data-wf-state><span class="fx-state fx-state--mute">${icon("open")}Sin enviar</span></span>
          </div>
          <div data-wf-track-box>${track(trackNodes(featured, -1))}</div>
        </div>`;
}

/* ------------------------------------------------------------ panel heads */

/**
 * The head every zone of the console wears.
 *
 * A number, a name, and one line saying what to do with it. The number is the
 * whole reason it exists: three panels that each look equally important give a
 * first-time visitor nothing to start from, and "1 · Complete la solicitud"
 * answers the question before it is asked.
 */
const zoneHead = (step, title, hint, aside = "") =>
  `<div class="gw-panel__head">` +
  `<span class="gw-panel__lead">` +
  `<span class="gw-step" aria-hidden="true">${step}</span>` +
  `<span><span class="gw-panel__title">${escape(title)}</span>` +
  `<span class="gw-panel__hint">${escape(hint)}</span></span>` +
  `</span>` +
  aside +
  `</div>`;

/* ================================================== 04 · the capture action */

/**
 * Read the attachment, propose the fields. Two presses, three visible beats.
 *
 * It is an alternative to typing, not a prerequisite for it — the form arrives
 * already complete — so it introduces itself as one rather than sitting at the
 * top of the panel looking like step zero.
 */
function captureAssistant() {
  const fields = extraction.fields
    .map(
      (item) =>
        `<div><dt>${escape(item.label)}</dt>` +
        `<dd data-wf-extract="${escape(item.key)}">${escape(item.display ?? item.value)}</dd></div>`,
    )
    .join("");

  return `            <div class="wf-capture" data-wf-capture data-when-scripted>
              <p class="wf-capture__lead">Opcional: en vez de escribirlo, léalo del adjunto.</p>
              <div class="wf-file">
                <span class="wf-file__mark" aria-hidden="true">PDF</span>
                <span>
                  <span class="wf-file__name">${escape(extraction.file)}</span>
                  <span class="wf-file__meta">${escape(extraction.size)} · extracción simulada</span>
                </span>
                <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-scan>
                  ${icon("scan")}Leer adjunto
                </button>
              </div>

              <div class="wf-progress" data-wf-scanbar hidden>
                <span class="wf-progress__fill"></span>
              </div>
              <p class="fx-note" data-wf-scanstatus role="status" aria-live="polite"></p>

              <dl class="wf-capture__fields" data-wf-extracted hidden>${fields}</dl>

              <div class="fx-actions" data-wf-usebox hidden>
                <button class="fx-btn fx-btn--solid fx-btn--small" type="button" data-wf-use>
                  Usar información
                </button>
              </div>
            </div>`;
}

/* ==================================================== 05 · the request form */

/**
 * Four controls.
 *
 * The form had eleven. Seven of them — the code, the requester, their position,
 * the area, the type, the supplier, the justification — never changed what the
 * engine did with the request, so they are still submitted, still on the
 * generated document and still in the trail, but they are no longer eleven
 * boxes between a visitor and the button. What is left is what routes: the
 * concept, the amount, the cost centre and the priority.
 *
 * Every field arrives filled in. That is a deliberate reversal: the concept
 * used to be empty and required, so a visitor's first press of the primary
 * button was an error message rather than the demonstration. A demo whose main
 * action fails the first time you take it has taught you one thing, and it is
 * not about workflow engines. The form is now correct on arrival and everything
 * in it is still editable — the point is what changing it does.
 *
 * The amount carries three presets, because the whole demonstration turns on
 * watching the route change when it changes, and making someone type 240000 to
 * see the third band is a toll on the best moment in the page.
 */
function requestForm() {
  const presets = [18000, featured.amount, 240000]
    .map((amount) => {
      const rule = ruleFor(amount);
      return (
        `<button class="gw-preset" type="button" data-wf-preset="${amount}" ` +
        `aria-pressed="${amount === featured.amount ? "true" : "false"}" ` +
        `title="${escape(`${rule.approvals} aprobación(es)`)}">` +
        `${escape(money(amount, { cents: false }))}</button>`
      );
    })
    .join("");

  /* Submitted, recorded and printed — but never asked for. A demonstration
     should not make someone retype a justification to watch a rule fire. */
  const carried = [
    ["codigo", featured.code],
    ["solicitante", featured.requester],
    ["cargo", featured.position],
    ["area", featured.area],
    ["tipo", featured.type],
    ["proveedor", ""],
    ["justificacion", featured.justification],
  ]
    .map(
      ([id, value]) =>
        `<input type="hidden" id="${id}" name="${id}" value="${escape(value)}" readonly data-wf-field />`,
    )
    .join("");

  return `            <form class="wf-form" id="solicitud-form" novalidate data-wf-form>
              <fieldset data-wf-fieldset>
                <legend class="fx-sr">Datos de la solicitud de compra</legend>
                ${carried}

                <div class="wf-form__grid">
                  ${field({
                    id: "concepto",
                    label: "Concepto",
                    value: featured.concept,
                    required: true,
                    wide: true,
                    placeholder: "Qué se solicita",
                    error: "El concepto es requerido.",
                  })}

                  <div class="wf-form__field wf-form__field--wide gw-amount">
                    <div class="wf-form__labelrow">
                      <label class="wf-form__label" for="monto">Monto estimado (L)
                        <span class="wf-req" aria-hidden="true"> *</span></label>
                      <span class="wf-ok">${icon("check")}Correcto</span>
                    </div>
                    <input class="fx-input gw-amount__input" id="monto" name="monto" type="text"
                      inputmode="decimal" value="${featured.amount}" required data-wf-field />
                    <div class="gw-presets" data-wf-presets>
                      <span class="gw-presets__label">Pruebe:</span>${presets}
                    </div>
                    <p class="wf-form__error" id="monto-error">${icon("alert")}
                      <span data-wf-error-text>El monto estimado es requerido.</span></p>
                  </div>

                  ${field({
                    id: "centro",
                    label: "Centro de costo",
                    value: featured.costCentre,
                    options: formOptions.costCentres,
                    required: true,
                  })}
                  ${field({
                    id: "prioridad",
                    label: "Prioridad",
                    value: featured.priority,
                    options: formOptions.priorities,
                  })}
                </div>
              </fieldset>

              <div class="wf-form__foot">
                <p class="fx-note">Nada se transmite: todo ocurre en su navegador.</p>
                <button class="fx-btn fx-btn--solid" type="submit" data-wf-submit data-when-scripted>
                  Ejecutar automatización${icon("arrow")}
                </button>
                <span class="wf-sim" data-when-static>Envío no disponible sin JavaScript</span>
              </div>
            </form>`;
}

/* =================================================== 06 · the run sequence */

/** The five stages of the automation, played over about seven seconds. */
function runSequence() {
  const rule = ruleFor(featured.amount);

  const step = (index, title, body) =>
    `<li class="wf-step" data-state="idle" data-wf-step="${index}">` +
    `<span class="wf-step__mark">${index}</span>` +
    `<div class="wf-step__body"><p class="wf-step__title">${escape(title)}</p>${body}</div></li>`;

  const checks = (items) =>
    `<ul class="wf-checks">` +
    items
      .map(
        (item) =>
          `<li class="wf-check"><span class="wf-check__tick">${icon("check")}</span>` +
          `<span>${escape(item)}</span></li>`,
      )
      .join("") +
    `</ul>`;

  const assignees = approvalsFor(featured.workflow, featured)
    .map((stop) => personRow(userFor(stop.role), stop.role))
    .join("");

  return `          <div class="wf-run" data-wf-stage="run" hidden>
            <div class="wf-run__head">
              ${zoneHead(1, "Automatización", "Lo que el motor hace solo.", simTag("5 pasos"))}
              <div class="wf-progress"><span class="wf-progress__fill" data-wf-runbar></span></div>
            </div>

            <ol class="wf-run__steps">
              ${step(1, "Solicitud recibida", checks(["Información registrada"]))}
              ${step(
                2,
                "Validando información",
                checks([
                  "Campos completos",
                  "Documento adjunto",
                  "Centro de costo identificado",
                  "Monto detectado",
                ]),
              )}
              ${step(
                3,
                "Aplicando reglas administrativas",
                `<div class="wf-rulecard">
                   <p class="wf-rulecard__row">Monto solicitado:
                     <b data-wf-run-amount>${escape(money(featured.amount))}</b></p>
                   <p class="wf-rulecard__text" data-wf-run-rule>«${escape(rule.text)}»</p>
                   <p class="wf-rulecard__result">${icon("rule")}
                     <span data-wf-run-result>${rule.approvals} aprobaciones requeridas</span></p>
                   <p class="fx-note" data-wf-run-band>${escape(rule.band.note)}</p>
                 </div>`,
              )}
              ${step(
                4,
                "Asignando responsables",
                `<ul class="wf-assignees" data-wf-run-assignees>${assignees}</ul>`,
              )}
              ${step(
                5,
                "Flujo iniciado",
                `<div data-wf-run-track>${track(trackNodes(featured, 2))}</div>`,
              )}
            </ol>
          </div>`;
}

/* ==================================================== 07 · the closing run */

/**
 * The five automatic steps that fire once the last authorisation lands.
 *
 * It lives in the side column, under the decision panel, because the decision
 * panel hides itself the moment there is nothing left to decide — and a column
 * that empties out at the exact moment the workflow finishes is a column that
 * makes finishing look like a failure.
 */
function closingRun() {
  return `          <div class="gw-pane gw-lit gw-panel" data-wf-closing hidden>
            <div class="gw-panel__head">
              <span class="gw-panel__lead">
                <span class="gw-step gw-step--done" aria-hidden="true">${icon("check")}</span>
                <span><span class="gw-panel__title" data-wf-closing-title>Solicitud aprobada</span>
                <span class="gw-panel__hint">Cierre automático, sin intervención.</span></span>
              </span>
              ${simTag("Automático")}
            </div>
            <ul class="wf-closing">
              ${closingSteps
                .map(
                  (item) =>
                    `<li class="wf-closing__row"><span class="wf-closing__tick">${icon("check")}</span>` +
                    `<span>${escape(item.label)}</span>` +
                    `<span class="wf-closing__detail">${escape(item.detail)}</span></li>`,
                )
                .join("")}
            </ul>
            ${gain("documento")}
          </div>`;
}

/* ==================================================== 08 · the live route */

/**
 * The rule, watched instead of read.
 *
 * There used to be a section of three rule cards further down the page,
 * explaining that the amount decides the circuit. This is that section, except
 * it re-renders on every keystroke in the amount field and it is standing next
 * to the field while you type. Same data, same `ruleFor`, same three bands —
 * the difference is that nobody has to be told.
 */
function routePreview() {
  const rule = ruleFor(featured.amount);
  const stops = approvalsFor(featured.workflow, featured)
    .map((stop) => {
      const user = userFor(stop.role);
      return (
        `<li class="gw-stop">` +
        `<span class="gw-stop__avatar" aria-hidden="true">${escape(user.initials)}</span>` +
        `<span><span class="gw-stop__name">${escape(user.name)}</span>` +
        `<span class="gw-stop__role">${escape(roleName(stop.role))} · ${escape(duration(stop.sla ?? 24))}</span>` +
        `</span></li>`
      );
    })
    .join("");

  return `          <div class="gw-pane gw-lit gw-panel" data-wf-preview>
            <div class="gw-panel__head">
              <span class="gw-panel__lead">
                <span class="gw-step gw-step--live" aria-hidden="true">${icon("rule")}</span>
                <span><span class="gw-panel__title">¿Quién debe autorizar?</span>
                <span class="gw-panel__hint">Lo decide el monto. Se recalcula al escribir.</span></span>
              </span>
              ${simTag("En vivo")}
            </div>
            <div class="gw-route">
              <p class="gw-route__count">
                <span class="gw-route__n" data-wf-route-n>${rule.approvals}</span>
                <span class="gw-route__word" data-wf-route-word>aprobaciones requeridas</span>
              </p>
              <p class="gw-route__rule" data-wf-route-rule>${escape(rule.text)}</p>
              <ul class="gw-route__list" data-wf-route-list>${stops}</ul>
              ${gain("ruta")}
            </div>
          </div>`;
}

/* ==================================================== 08b · the empty step */

/**
 * Step two, before it exists.
 *
 * The decision panel is hidden until there is something to decide, which left
 * the console showing a step 1 and a step 3 and no step 2 at all — a gap that
 * reads as a missing piece rather than as a later one. This stands in its place
 * and says when it will arrive, so the shape of the whole demonstration is
 * legible in the first second.
 */
function waitingStep() {
  return `          <div class="gw-pane gw-panel gw-waiting" data-wf-waiting>
            ${zoneHead(2, "Resuelva", "Aparece en cuanto ejecute la automatización.")}
          </div>`;
}

/* ====================================================== 09 · the decision */

/**
 * Three buttons that change the outcome.
 *
 * Hidden until there is something to decide. The engine reveals it, names the
 * person whose turn it is, and moves it along the chain — so a visitor
 * authorises the same request as two different people and watches the same
 * screen answer differently each time.
 */
function decisionPanel() {
  const pendingStep = approvalsFor(featured.workflow, featured)[0];
  const pending = userFor(pendingStep.role);

  return `          <div class="gw-pane gw-lit gw-panel gw-zone" data-gw-zone="decide"
            data-wf-approval hidden>
            ${zoneHead(
              2,
              "Resuelva",
              "Usted decide en nombre de esta persona.",
              flag("Turno actual"),
            )}

            <div class="gw-decide__who">
              <span class="wf-person__avatar" aria-hidden="true">${escape(pending.initials)}</span>
              <span>
                <span class="gw-decide__name" data-wf-approver>${escape(pending.name)}</span>
                <span class="gw-decide__role" data-wf-approver-area>${escape(pending.position)}</span>
              </span>
            </div>

            <dl class="gw-decide__facts">
              <div><dt>Monto</dt><dd data-wf-amount>${escape(money(featured.amount))}</dd></div>
              <div><dt>Paso</dt><dd data-wf-step-label>${escape(pendingStep.label)}</dd></div>
            </dl>

            <div class="gw-decide__actions" data-when-scripted>
              <button class="fx-btn fx-btn--solid" type="button" data-wf-decide="aprobada">
                ${icon("check")}Aprobar
              </button>
              <div class="gw-decide__minor">
                <button class="fx-btn fx-btn--ghost" type="button" data-wf-decide="cambios">
                  ${icon("edit")}Cambios
                </button>
                <button class="fx-btn gw-btn--danger" type="button" data-wf-decide="rechazada">
                  ${icon("closed")}Rechazar
                </button>
              </div>
            </div>
            ${gain("turno")}
          </div>`;
}

/* ================================================== 10 · what it produced */

/** The document the workflow generates — the one opaque thing on the page. */
function generatedDocument() {
  const signatures = approvals
    .map(
      (entry) =>
        `<li class="wf-doc__sign"><b>${escape(entry.area)}</b>` +
        `<span>${escape(entry.name)} · ${escape(entry.date)}, ${escape(entry.time)}</span>` +
        `<i>${icon("check")}Aprobado</i></li>`,
    )
    .join("");

  return `<div class="wf-doc">
              <div class="wf-doc__band">
                <div>
                  <p class="wf-doc__org">Documento generado automáticamente</p>
                  <p class="wf-doc__kind">Solicitud de compra</p>
                </div>
                <span class="wf-doc__code">${escape(featured.code)}</span>
              </div>
              <div class="wf-doc__body">
                ${facts(
                  [
                    { term: "Código", detail: featured.code },
                    { term: "Solicitante", detail: featured.requester },
                    { term: "Área", detail: featured.area },
                    { term: "Centro de costo", detail: featured.costCentre },
                    { term: "Concepto", detail: featured.detail },
                    { term: "Monto", detail: money(featured.amount) },
                    { term: "Proveedor sugerido", detail: featured.supplier },
                    {
                      term: "Estado",
                      html: `<span class="fx-state fx-state--ok">${icon("check")}Aprobado</span>`,
                    },
                  ],
                  "wf-doc__facts",
                )}

                <div>
                  <p class="wf-doc__heading">Aprobaciones</p>
                  <ul class="wf-doc__signs">${signatures}</ul>
                </div>

                <div class="wf-doc__verify">
                  ${verificationMark(featured.verification)}
                  <div>
                    <p class="wf-doc__heading">Código de verificación</p>
                    <p class="wf-doc__verify-code">${escape(featured.verification)}</p>
                    <p class="fx-note" style="margin-top:.35rem">
                      Marca y código demostrativos. No corresponden a ningún registro
                      y no son legibles por un lector de códigos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="fx-actions" style="margin-top:1rem">
              <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-download>
                ${icon("download")}Descargar
              </button>
              <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-print>
                ${icon("print")}Imprimir
              </button>
            </div>`;
}

/** The message the requester would receive. Nothing is ever sent. */
function notificationPreview() {
  return `<div class="wf-mail">
              <div class="wf-mail__head">
                <span>${icon("mail")} Notificación al solicitante</span>
                ${simTag(notification.tag)}
              </div>
              <dl class="wf-mail__fields">
                <div class="wf-mail__row"><dt>Para</dt><dd>${escape(notification.to)}</dd></div>
                <div class="wf-mail__row"><dt>Asunto</dt><dd><b>${escape(notification.subject)}</b></dd></div>
              </dl>
              <div class="wf-mail__body"><p>${escape(notification.body)}</p></div>
            </div>`;
}

/* ==================================================== 11 · the consequences

   Three tabs, closed until something has happened in them. Everything here is
   the output of an action taken above it, which is exactly why none of it is
   allowed to occupy the page before the action is taken.
   -------------------------------------------------------------------------- */

function detail() {
  const tab = (id, label, selected = false) =>
    `<button class="gw-tab" type="button" role="tab" id="tab-${id}" ` +
    `aria-controls="panel-${id}" aria-selected="${selected}" tabindex="${selected ? 0 : -1}">` +
    `${escape(label)}</button>`;

  const panel = (id, label, body, selected = false) =>
    `<div class="wf-tabpanel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}" ` +
    `tabindex="0"${selected ? "" : " hidden"}>` +
    `<h2 class="fx-sr">${escape(label)}</h2>${body}</div>`;

  const approvalsPanel =
    `<p class="wf-subhead__note" data-wf-records-empty>` +
    `Cada autorización dejará aquí su responsable, su hora, su comentario y su resultado.</p>` +
    `<ul class="wf-records" data-wf-records></ul>`;

  const documentsPanel =
    `<div class="wf-empty" data-wf-doc-empty data-when-scripted>` +
    `El documento se genera solo, al completarse las aprobaciones.</div>` +
    `<div class="wf-stack" data-wf-doc-box data-when-static>` +
    generatedDocument() +
    notificationPreview() +
    `</div>`;

  /* The empty line lives inside the list rather than beside it: `seedAudit`
     replaces the list's contents wholesale the moment a request exists, which
     disposes of the placeholder without anything having to remember to. */
  const auditPanel =
    `<ol class="wf-audit" data-wf-audit>` +
    `<li class="wf-audit__empty" data-when-scripted>` +
    `La bitácora se escribe sola en cuanto envíe la solicitud.</li>` +
    auditTrail
      .slice(0, 4)
      .map((entry) => auditRow(entry).replace("<li ", "<li data-when-static "))
      .join("") +
    `</ol>` +
    gain("bitacora");

  /* The count of what the run actually left behind, filled from the page after
     the flow closes. It is the argument made arithmetically: four numbers a
     visitor watched being produced, including the one that stayed at zero. */
  const tally =
    `<dl class="gw-tally" data-wf-tally hidden>` +
    [
      ["approvals", "Autorización con constancia", "Autorizaciones con constancia"],
      ["docs", "Documento generado", "Documentos generados"],
      ["audit", "Asiento de bitácora", "Asientos de bitácora"],
      ["mail", "Correo que hubo que perseguir", "Correos que hubo que perseguir"],
    ]
      .map(
        ([key, one, many]) =>
          `<div><dt data-one="${escape(one)}" data-many="${escape(many)}">${escape(many)}</dt>` +
          `<dd data-wf-tally-${key}>0</dd></div>`,
      )
      .join("") +
    `</dl>`;

  return `        <div class="gw-pane gw-lit gw-detail gw-zone" data-gw-zone="result">
          ${zoneHead(3, "Lo que produjo", "Se llena solo, a medida que el flujo avanza.")}
          ${tally}
          <div class="gw-tabs" role="tablist" aria-label="Resultado del expediente">
            ${tab("aprobaciones", "Aprobaciones", true)}
            ${tab("documentos", "Documento")}
            ${tab("historial", "Bitácora")}
          </div>
          ${panel("aprobaciones", "Aprobaciones", approvalsPanel, true)}
          ${panel("documentos", "Documento", documentsPanel)}
          ${panel("historial", "Bitácora", auditPanel)}
        </div>`;
}

/* ==================================================== 12 · what it resolves

   The one section on the page that argues rather than demonstrates, and it is
   deliberately the last thing: a visitor who wants to press things reaches the
   console first and never has to scroll past a case for the product to get to
   the product. A visitor who wants to know what it is for finds it here, in
   four pairs and four figures, without any of it having been in the way.
   -------------------------------------------------------------------------- */

function whatItResolves() {
  const pairs = advantages
    .map(
      (item) =>
        `<li class="gw-why__item">` +
        `<p class="gw-why__name">${escape(item.title)}</p>` +
        `<p class="gw-why__before"><span>Antes</span>${escape(item.before)}</p>` +
        `<p class="gw-why__after"><span>Ahora</span>${escape(item.after)}</p>` +
        `</li>`,
    )
    .join("");

  const figures = impact
    .map(
      (item) =>
        `<div class="gw-figure"><p class="gw-figure__value">${escape(item.value)}</p>` +
        `<p class="gw-figure__label">${escape(item.label)}</p></div>`,
    )
    .join("");

  return `        <section class="gw-why" aria-labelledby="h-resuelve">
          <div class="gw-why__head">
            <h2 class="gw-why__title" id="h-resuelve">¿Qué resuelve?</h2>
            <p class="gw-why__sub">Cuatro trámites que el motor deja de pedirle a una persona.</p>
          </div>
          <ul class="gw-why__list">${pairs}</ul>
          <div class="gw-why__foot">
            <div class="gw-figures">${figures}</div>
            <p class="fx-note">${escape(impactNote)}</p>
          </div>
        </section>`;
}

/* ================================================ 13 · the two mini demos */

/** Vacations and per-diem, as native dialogs: the same engine, another route. */
function miniDialogs() {
  return Object.values(miniDemos)
    .map((demo) => {
      const chain =
        `<ol class="wf-chain">` +
        demo.chain
          .map(
            (label, index) =>
              (index ? `<li class="wf-chain__arrow" aria-hidden="true">${icon("arrowDown")}</li>` : "") +
              `<li class="wf-chain__step${index === 0 ? " wf-chain__step--start" : ""}` +
              `${index === demo.chain.length - 1 ? " wf-chain__step--end" : ""}">${escape(label)}</li>`,
          )
          .join("") +
        `</ol>`;

      return `    <dialog class="wf-modal" id="mini-${demo.id}" data-wf-modal="${demo.id}"
      aria-labelledby="mini-${demo.id}-title">
      <div class="wf-modal__head">
        <div>
          <h2 class="wf-modal__title" id="mini-${demo.id}-title">${escape(demo.title)}</h2>
          <p class="wf-modal__lead">${escape(demo.lead)}</p>
        </div>
        <button class="wf-modal__close" type="button" data-wf-modal-close
          aria-label="Cerrar">&times;</button>
      </div>
      <div class="wf-modal__body">
        ${facts(demo.fields.map((f) => ({ term: f.label, detail: f.value })))}
        <div>
          <p class="wf-doc__heading">Flujo de autorización</p>
          <div style="margin-top:.75rem">${chain}</div>
        </div>
      </div>
      <div class="wf-modal__foot">
        ${simTag("Ejemplo demostrativo")}
        <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-modal-close>
          Cerrar
        </button>
      </div>
    </dialog>`;
    })
    .join("\n\n");
}

/* ========================================================= the guided tour

   The narrator. Two lines rather than one: what the engine is doing, and what
   that replaces — the second is why the tour exists at all, so it gets its own
   line, its own rule and its own reading time. The progress bar is not
   decoration either: the explanations roughly doubled the running time, and a
   sequence whose end you cannot see is a sequence people leave.
   -------------------------------------------------------------------------- */

function tourBar() {
  return `    <div class="wf-guide" data-wf-guidebar role="status" aria-live="polite">
      <div class="wf-guide__track" aria-hidden="true">
        <span class="wf-guide__fill" data-wf-guide-progress></span>
      </div>
      <div class="wf-guide__body">
        <p class="wf-guide__text">
          <span class="wf-guide__step" data-wf-guide-step>Demo guiada</span>
          <span data-wf-guide-text>Preparando la demostración…</span>
        </p>
        <p class="wf-guide__gain" data-wf-guide-gain hidden></p>
      </div>
      <div class="wf-guide__actions">
        <button class="wf-guide__btn" type="button" data-wf-guide-pause>Pausar</button>
        <button class="wf-guide__btn" type="button" data-wf-guide-next>Siguiente</button>
        <button class="wf-guide__btn" type="button" data-wf-guide-skip>Salir</button>
      </div>
    </div>`;
}

/* =============================================================== the page */

/**
 * The console.
 *
 * One section, four blocks, and every one of them something a visitor can act
 * on: the processes, the request, the route it produces, and the decisions that
 * close it. Three of those blocks are numbered `gw-zone`s, and exactly one of
 * them carries `is-active` at any moment — the build hands the visitor the
 * first one already lit, and `main.js` moves the light along as the workflow
 * advances. It is the cheapest possible answer to "what do I do now". The fourteen sections this page used to have are down to this
 * because everything removed was the product describing itself — a dashboard of
 * invented figures, a register of fifteen rows, a table of response targets, a
 * before-and-after column, a panel of impact percentages — and none of it could
 * be pressed.
 */
export function modulePage(ctx) {
  const body = `      <section class="gw-console" aria-label="Consola de automatización">
${intro()}

${rail()}

${spine()}

        <div class="gw-deck" id="seguimiento">
          <div class="gw-pane gw-lit gw-panel gw-deck__main gw-zone is-active"
            data-gw-zone="form" id="solicitud">
            <div data-wf-stage="form">
              ${zoneHead(
                1,
                "Complete la solicitud",
                "Cambie el monto y mire cómo cambia la ruta de la derecha.",
                flag(featured.code),
              )}
${captureAssistant()}
${requestForm()}
            </div>

${runSequence()}
          </div>

          <aside class="gw-side" aria-label="Ruta, decisión y cierre">
${routePreview()}

${waitingStep()}

${decisionPanel()}

${closingRun()}
          </aside>
        </div>

${detail()}

${whatItResolves()}
      </section>

${tourBar()}

${miniDialogs()}`;

  return {
    meta: {
      title: moduleInfo.label,
      canonical: "",
      description:
        "Consola de automatización administrativa: una solicitud, la regla que la enruta, las " +
        "personas que la autorizan y el documento que produce. Datos ficticios.",
    },
    body,
    console: true,
  };
}
/* ==================================================== one request's file */

/**
 * The trail for a request that is not the featured one.
 *
 * Synthesised from its route and its timestamps rather than written by hand:
 * fifteen hand-written trails would be fifteen chances for one of them to
 * contradict the row it belongs to.
 */
function trailFor(request) {
  const route = approvalsFor(request.workflow, request);
  const open = states[request.state].open;
  const start = request.opened.split("T")[1];

  const at = (hours) => {
    const [h, m] = request.opened.split("T")[1].split(":").map(Number);
    const total = h * 60 + m + Math.round(hours * 60);
    return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const entries = [
    {
      time: start,
      actor: request.requester,
      kind: "person",
      title: "Solicitud creada",
      text: `${request.concept} · ${request.area}.`,
    },
    {
      time: start,
      actor: "Sistema",
      kind: "system",
      title: "Validación automática completada",
      text: "Campos obligatorios y centro de costo verificados.",
    },
    {
      time: start,
      actor: "Sistema",
      kind: "rule",
      title: "Regla aplicada",
      text:
        request.amount === null
          ? `Proceso ${workflows[request.workflow].label.toLowerCase()}: ${route.length} autorización(es).`
          : ruleFor(request.amount).text,
    },
  ];

  const span = (request.resolved ?? 0) || 1;
  route.forEach((step, index) => {
    const when = at((span * (index + 1)) / (route.length + 1));
    const isLast = index === route.length - 1;

    if (open && index > 0) return;

    entries.push({
      time: when,
      actor: userFor(step.role).name,
      kind: request.state === "rechazada" && isLast ? "rejection" : "approval",
      title:
        request.state === "rechazada" && isLast
          ? `${step.label} rechazó`
          : request.state === "cambios" && isLast
            ? `${step.label} solicitó cambios`
            : `${step.label} aprobó`,
      text: `Responsable: ${userFor(step.role).name}.`,
    });
  });

  if (request.escalated) {
    entries.push({
      time: at(request.sla),
      actor: "Sistema",
      kind: "escalation",
      title: "Escalamiento automático",
      text: `Tiempo objetivo de ${request.sla} horas superado. ${escalation.detail}`,
    });
  }

  if (!open && request.state !== "rechazada") {
    entries.push({
      time: at(span),
      actor: "Sistema",
      kind: "document",
      title: "Documento generado",
      text: `${request.code}.pdf archivado en el expediente.`,
    });
    entries.push({
      time: at(span),
      actor: "Sistema",
      kind: "notification",
      title: "Notificación preparada",
      text: "Envío simulado al solicitante.",
    });
  }

  return entries;
}

export function requestPage(ctx, request) {
  const isFeatured = request.code === featured.code;
  const status = slaStatus(request);
  const workflow = workflows[request.workflow];
  const done = states[request.state].open ? 2 : trackNodes(request).length;
  const trail = isFeatured ? auditTrail : trailFor(request);

  const records = isFeatured
    ? states[request.state].open
      ? []
      : approvals
    : states[request.state].open
      ? []
      : approvalsFor(request.workflow, request).map((step, index, all) => ({
          name: userFor(step.role).name,
          initials: userFor(step.role).initials,
          area: userFor(step.role).position,
          date: longDate(request.opened.slice(0, 10)),
          time: trail.filter((e) => e.kind === "approval" || e.kind === "rejection")[index]?.time ?? "—",
          outcome:
            index === all.length - 1 && request.state === "rechazada"
              ? "rechazada"
              : index === all.length - 1 && request.state === "cambios"
                ? "cambios"
                : "aprobada",
          comment:
            index === all.length - 1 && request.state === "rechazada"
              ? "No existe disponibilidad presupuestaria en el periodo solicitado."
              : "Revisado conforme al procedimiento interno.",
        }));

  const tab = (id, label, selected = false) =>
    `<button class="wf-tab" type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" ` +
    `aria-selected="${selected}" tabindex="${selected ? 0 : -1}">${escape(label)}</button>`;

  /* The heading is invisible while the tab strip works — the tab already names
     the panel — and becomes the panel's own title when the strip is gone. */
  const panel = (id, label, body, selected = false) =>
    `<div class="wf-tabpanel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}" ` +
    `tabindex="0"${selected ? "" : " hidden"}>` +
    `<h3 class="wf-tabpanel__title">${escape(label)}</h3>${body}</div>`;

  const summary = facts([
    { term: "Tipo", detail: workflow.label },
    { term: "Solicitante", detail: request.requester },
    { term: "Área", detail: request.area },
    { term: "Concepto", detail: request.concept },
    { term: "Monto", detail: money(request.amount) },
    { term: "Responsable actual", detail: roleName(request.responsible) },
    { term: "Fecha de registro", detail: longDate(request.opened.slice(0, 10)) },
    { term: "Estado", html: statePill(request.state) },
    { term: "Tiempo objetivo", detail: `${status.target} horas` },
    { term: states[request.state].open ? "Tiempo restante" : "Resolución", html: slaBadge(request) },
  ]);

  const documents =
    states[request.state].open || request.state === "rechazada"
      ? `<div class="wf-empty">Este expediente aún no ha generado un documento final.
           ${request.state === "rechazada" ? "La solicitud fue rechazada." : "Se generará al completar las aprobaciones."}</div>`
      : `<div class="wf-doc">
             <div class="wf-doc__band">
               <div>
                 <p class="wf-doc__org">Documento generado automáticamente</p>
                 <p class="wf-doc__kind">${escape(workflow.label)}</p>
               </div>
               <span class="wf-doc__code">${escape(request.code)}</span>
             </div>
             <div class="wf-doc__body">
               ${facts(
                 [
                   { term: "Código", detail: request.code },
                   { term: "Solicitante", detail: request.requester },
                   { term: "Área", detail: request.area },
                   { term: "Concepto", detail: request.concept },
                   { term: "Monto", detail: money(request.amount) },
                   {
                     term: "Estado",
                     html: `<span class="fx-state fx-state--ok">${icon("check")}Aprobado</span>`,
                   },
                 ],
                 "wf-doc__facts",
               )}
               <div class="wf-doc__verify">
                 ${verificationMark(`VFY-${request.code}`)}
                 <div>
                   <p class="wf-doc__heading">Código de verificación</p>
                   <p class="wf-doc__verify-code">VFY-${escape(request.code.slice(-8).replace("-", ""))}</p>
                   <p class="fx-note" style="margin-top:.35rem">
                     Marca y código demostrativos. No corresponden a ningún registro real.
                   </p>
                 </div>
               </div>
             </div>
           </div>`;

  const body = [
    hero({
      ctx,
      trail: [
        { label: "CoreStruct", href: "../../../index.html#proyectos" },
        { label: moduleInfo.label, href: "../index.html" },
        { label: request.code },
      ],
      label: `Expediente · ${workflow.label}`,
      title: request.code,
      lead: `${request.concept}. Solicitado por ${request.requester}, ${request.area}.`,
      fine: moduleInfo.disclaimer,
      meta: [
        { term: "Estado", detail: stateName(request.state) },
        { term: "Monto", detail: money(request.amount) },
        { term: "Responsable", detail: roleName(request.responsible) },
        { term: states[request.state].open ? "Tiempo restante" : "Resolución", detail: status.short },
      ],
    }),

    `      <section class="fx-section fx-section--tight">
        <div class="fx-shell">
          <div class="wf-panel">
            <div class="wf-panel__head">
              <div>
                <!-- A heading, not a paragraph: on this page it is the only
                     thing between the h1 and the panel titles inside the tabs,
                     and skipping it would leave the outline going h1 to h3. -->
                <h2 class="wf-panel__title">Seguimiento del expediente</h2>
                <p class="wf-panel__meta">${escape(workflow.label)} · registro
                  ${escape(longDate(request.opened.slice(0, 10)))}</p>
              </div>
              ${statePill(request.state)}
            </div>
            <div class="wf-panel__body wf-stack">
              ${track(trackNodes(request, done))}

              <div>
                <div class="wf-tabs" role="tablist" aria-label="Secciones del expediente">
                  ${tab("resumen", "Resumen", true)}
                  ${tab("aprobaciones", "Aprobaciones")}
                  ${tab("documentos", "Documentos")}
                  ${tab("historial", "Historial")}
                  ${tab("actividad", "Actividad")}
                </div>
                ${panel("resumen", "Resumen", summary, true)}
                ${panel(
                  "aprobaciones",
                  "Aprobaciones",
                  records.length
                    ? `<ul class="wf-records">${records.map(approvalRecord).join("")}</ul>`
                    : `<div class="wf-empty">Sin autorizaciones registradas todavía. La solicitud
                         está con ${escape(roleName(request.responsible))}.</div>`,
                )}
                ${panel("documentos", "Documentos", documents)}
                ${panel("historial", "Historial", auditList(trail))}
                ${panel(
                  "actividad",
                  "Actividad",
                  `<ul class="wf-assignees" style="grid-template-columns:minmax(0,1fr)">
                     ${personRow(userFor(request.responsible), request.responsible)}
                   </ul>
                   <p class="fx-note" style="margin-top:1rem">
                     Responsable actual del expediente. Persona ficticia.
                   </p>`,
                )}
              </div>
            </div>
          </div>

          <div class="fx-actions" style="margin-top:1.5rem">
            ${arrowLink("Volver a la consola", "../index.html")}
          </div>
        </div>
      </section>`,
  ].join("\n\n");

  return {
    meta: {
      title: `${request.code} · ${workflow.label}`,
      canonical: `solicitudes/${request.code}.html`,
      description:
        `Expediente demostrativo ${request.code}: ${request.concept}. Estado ` +
        `${stateName(request.state)}, responsable ${roleName(request.responsible)}. Datos ficticios.`,
    },
    body,
  };
}
