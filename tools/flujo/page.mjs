/**
 * The two kinds of page the demo has.
 *
 * `modulePage` is the demonstration itself: choose a process, fill the request,
 * watch it be validated and routed, authorise it as two different people, and
 * end with a generated document, a notification and a complete audit trail —
 * then the register, the rules, the targets and the twelve other processes the
 * same engine runs.
 *
 * `requestPage` is one request's file: the five tabs a case worker would open.
 *
 * Both are written at build time, in full. The engine in the browser drives the
 * first one forward, but nothing on either page is *supplied* by JavaScript: a
 * reader with none still gets the register, the rules, the trail and the
 * document, because a demonstration that is blank until a script runs is a
 * demonstration of a script.
 */

import { escape, longDate, shortDate } from "../../src/data/flujo/format.js";
import {
  amountBands,
  approvals,
  approvalsFor,
  auditTrail,
  beforeAfter,
  byState,
  closingSteps,
  configurableNote,
  demoUsers,
  documentPipeline,
  documentPipelineNote,
  duration,
  engineProcesses,
  escalation,
  extraction,
  featured,
  formOptions,
  impact,
  impactNote,
  kpis,
  miniDemos,
  moduleInfo,
  money,
  notification,
  processes,
  requestAreas,
  requestBy,
  requestTypes,
  requests,
  roleName,
  ruleFor,
  slaStatus,
  slaTargets,
  stateName,
  states,
  userFor,
  workflows,
} from "../../src/data/flujo/workflows.js";
import {
  REGISTER_COLUMNS,
  approvalRecord,
  auditList,
  personRow,
  registerCells,
  slaBadge,
  statePill,
  track,
} from "../../src/scripts/flujo/render.js";
import {
  arrowLink,
  button,
  demoTag,
  flag,
  head,
  icon,
  note,
  page,
  requestHref,
  simTag,
  table,
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

/* ============================================================== 01 · hero */

function moduleHero(ctx) {
  const actions =
    button("Crear solicitud", "#solicitud", { solid: true, icon: "arrow" }) +
    `<button class="fx-btn fx-btn--onDark" type="button" data-wf-tour>` +
    `Ver demo guiada${icon("arrow")}</button>` +
    button("Ver proceso demostrativo", "#seguimiento", { onDark: true });

  return hero({
    ctx,
    trail: [
      { label: "CoreStruct", href: "../../index.html#proyectos" },
      { label: moduleInfo.label },
    ],
    label: `${product.descriptor} · ${moduleInfo.tag}`,
    title: moduleInfo.title,
    lead: moduleInfo.lead,
    actions,
    fine: moduleInfo.disclaimer,
    meta: [
      { term: "Concepto", detail: moduleInfo.concept },
      { term: "Proceso completo", detail: "Solicitud de compra" },
      { term: "Procesos del motor", detail: `${engineProcesses.length} configurables` },
      { term: "Datos", detail: "Ficticios · sin backend" },
    ],
  });
}

/* ================================================== 02 · what do you need */

function chooser() {
  const tiles = processes
    .map((process) => {
      const state = process.full
        ? "Flujo completo"
        : process.mini
          ? "Flujo demostrativo disponible"
          : "Flujo demostrativo disponible";

      return (
        `<button class="wf-process" type="button" data-wf-process="${escape(process.id)}"` +
        `${process.full ? " data-full aria-pressed=\"true\"" : ' aria-pressed="false"'}>` +
        `<span class="wf-process__index">${escape(process.index)}</span>` +
        `<span class="wf-process__title">${icon(process.icon)}${escape(process.title)}</span>` +
        `<span class="wf-process__text">${escape(process.text)}</span>` +
        `<span class="wf-process__state">${escape(state)}</span>` +
        `</button>`
      );
    })
    .join("");

  return `      <section class="fx-section" id="proceso" aria-labelledby="h-proceso">
        <div class="fx-shell">
          ${head({
            id: "h-proceso",
            index: "01",
            label: "El proceso",
            title: "¿Qué necesita gestionar?",
            body:
              "Seis procesos internos, un mismo motor. La solicitud de compra está desarrollada " +
              "de principio a fin: formulario, reglas, aprobaciones, documento y archivo.",
          })}
          <div class="wf-processes">${tiles}</div>
        </div>
      </section>`;
}

/* ====================================================== 03 · the request */

function captureAssistant() {
  const fields = extraction.fields
    .map(
      (item) =>
        `<div><dt>${escape(item.label)}</dt>` +
        `<dd data-wf-extract="${escape(item.key)}">${escape(item.display ?? item.value)}</dd></div>`,
    )
    .join("");

  return `<div class="wf-capture" data-wf-capture data-when-scripted>
              <div class="wf-capture__top">
                <p class="wf-capture__label">${icon("scan")}Asistente de captura</p>
                ${simTag("Extracción simulada")}
              </div>

              <div class="wf-file">
                <span class="wf-file__mark" aria-hidden="true">PDF</span>
                <span>
                  <span class="wf-file__name">${escape(extraction.file)}</span>
                  <span class="wf-file__meta">${escape(extraction.size)} · adjunto de ejemplo</span>
                </span>
                <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-scan>
                  Analizar documento
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
                <p class="fx-note" style="align-self:center">${escape(extraction.note)}</p>
              </div>
            </div>`;
}

function requestForm() {
  return `<form class="wf-form" id="solicitud-form" novalidate data-wf-form>
              <fieldset data-wf-fieldset>
                <legend class="fx-sr">Datos de la solicitud de compra</legend>
                <div class="wf-form__grid">
                  ${field({
                    id: "codigo",
                    label: "Número de solicitud",
                    value: featured.code,
                    locked: true,
                    hint: "Asignado automáticamente por el sistema.",
                  })}
                  ${field({
                    id: "solicitante",
                    label: "Solicitante",
                    value: featured.requester,
                    required: true,
                    error: "El nombre del solicitante es requerido.",
                  })}
                  ${field({
                    id: "area",
                    label: "Área",
                    value: featured.area,
                    options: formOptions.areas,
                    required: true,
                  })}
                  ${field({
                    id: "cargo",
                    label: "Cargo",
                    value: featured.position,
                    hint: "Determina el nivel de jefatura que resuelve el visto bueno.",
                  })}
                  ${field({
                    id: "tipo",
                    label: "Tipo",
                    value: featured.type,
                    options: formOptions.types,
                    required: true,
                  })}
                  ${field({
                    id: "concepto",
                    label: "Concepto",
                    value: "",
                    required: true,
                    placeholder: "Qué se solicita",
                    error: "El concepto es requerido.",
                  })}
                  ${field({
                    id: "monto",
                    label: "Monto estimado (L)",
                    value: "",
                    type: "text",
                    inputmode: "decimal",
                    required: true,
                    placeholder: "0.00",
                    hint: "El monto decide cuántas autorizaciones necesita la solicitud.",
                    error: "El monto estimado es requerido.",
                  })}
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
                  ${field({
                    id: "proveedor",
                    label: "Proveedor sugerido",
                    value: "",
                    placeholder: "Opcional",
                  })}
                  ${field({
                    id: "justificacion",
                    label: "Justificación",
                    value: featured.justification,
                    textarea: true,
                    required: true,
                    wide: true,
                    error: "La justificación es requerida.",
                  })}
                </div>

                <div class="wf-form__field wf-form__field--wide" style="margin-top:1rem">
                  <span class="wf-form__label">Adjunto</span>
                  <div class="wf-file">
                    <span class="wf-file__mark" aria-hidden="true">PDF</span>
                    <span>
                      <span class="wf-file__name">${escape(featured.attachment)}</span>
                      <span class="wf-file__meta">${escape(featured.attachmentSize)} · adjunto simulado</span>
                    </span>
                    ${simTag("Sin carga real")}
                  </div>
                </div>
              </fieldset>

              <div class="wf-form__foot">
                <p class="fx-note">
                  Ningún dato se transmite. La solicitud se procesa en su navegador y se conserva
                  únicamente en este equipo.
                </p>
                <button class="fx-btn fx-btn--solid" type="submit" data-wf-submit data-when-scripted>
                  Enviar solicitud
                </button>
                <span class="wf-sim" data-when-static>Envío no disponible sin JavaScript</span>
              </div>
            </form>`;
}

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

  return `<div class="wf-run" data-wf-stage="run" hidden>
              <div class="wf-run__head">
                <p class="fx-label"><span>Automatización</span></p>
                <h3 class="wf-run__title">Procesando solicitud</h3>
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

/* ================================================== 04 · following it through */

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
                  ${icon("download")}Descargar documento
                </button>
                <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-print>
                  ${icon("print")}Imprimir
                </button>
                <span class="wf-sim" style="align-self:center">${escape(featured.document)}</span>
              </div>`;
}

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
                <div class="wf-mail__body">
                  <p>${escape(notification.body)}</p>
                </div>
              </div>
              <p class="fx-note" style="margin-top:.75rem">
                No se envía ningún correo. La vista muestra el mensaje que el flujo prepararía al
                cerrar el expediente.
              </p>`;
}

/**
 * The follow-up panel: track, pending approval, and the five tabs.
 *
 * Written at build time in the state the register says the request is in —
 * validated, routed, waiting on Administración — so the page is a complete
 * account of a real case before anyone touches it. The engine advances it from
 * there.
 */
function followUp() {
  const pending = approvals[0];
  const pendingStep = approvalsFor(featured.workflow, featured)[0];
  const sla = slaStatus(requestBy(featured.code));

  const tab = (id, label, selected = false) =>
    `<button class="wf-tab" type="button" role="tab" id="tab-${id}" ` +
    `aria-controls="panel-${id}" aria-selected="${selected}" tabindex="${selected ? 0 : -1}">` +
    `${escape(label)}</button>`;

  /* The heading is invisible while the tab strip works — the tab already names
     the panel — and becomes the panel's own title when the strip is gone. */
  const panel = (id, label, body, selected = false) =>
    `<div class="wf-tabpanel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}" ` +
    `tabindex="0"${selected ? "" : " hidden"}>` +
    `<h3 class="wf-tabpanel__title">${escape(label)}</h3>${body}</div>`;

  /* The five values a visitor can change on the form carry a key, so the engine
     can rewrite exactly those and leave the rest of the summary alone. */
  const live = (key, value) => `<span data-wf-sum="${key}">${escape(value)}</span>`;

  const summary =
    facts([
      { term: "Tipo", detail: workflows[featured.workflow].label },
      { term: "Solicitante", html: live("solicitante", featured.requester) },
      { term: "Área", html: live("area", featured.area) },
      { term: "Centro de costo", html: live("centro", featured.costCentre) },
      { term: "Concepto", html: live("concepto", featured.concept) },
      { term: "Monto", html: live("monto", money(featured.amount)) },
      { term: "Proveedor sugerido", html: live("proveedor", featured.supplier) },
      { term: "Prioridad", html: live("prioridad", featured.priority) },
      { term: "Adjunto", detail: `${featured.attachment} (${featured.attachmentSize})` },
      {
        term: "Tiempo objetivo",
        html: `${slaBadge(requestBy(featured.code))} <span class="fx-note">de ${sla.target} horas</span>`,
      },
    ]) +
    `<p class="fx-note" style="margin-top:1rem" data-wf-sum="justificacion">` +
    `${escape(featured.justification)}</p>`;

  const approvalsPanel =
    `<p class="wf-subhead__note" data-wf-records-empty>` +
    `Aún no hay autorizaciones registradas. Cada una dejará constancia de responsable, área, ` +
    `fecha, hora, comentario y resultado.</p>` +
    `<ul class="wf-records" data-wf-records></ul>`;

  const documentsPanel =
    `<div class="wf-empty" data-wf-doc-empty data-when-scripted>` +
    `El documento se genera automáticamente al completar las aprobaciones.</div>` +
    `<div class="wf-stack" data-wf-doc-box data-when-static>` +
    generatedDocument() +
    notificationPreview() +
    `</div>`;

  return `      <section class="fx-section fx-section--surface" id="seguimiento" aria-labelledby="h-seguimiento">
        <div class="fx-shell">
          ${head({
            id: "h-seguimiento",
            index: "03",
            label: "Seguimiento",
            title: "La solicitud, desde que entra hasta que se archiva.",
            body:
              "El expediente completo en una sola pantalla: en qué paso está, quién debe " +
              "resolver, cuánto tiempo queda, qué se aprobó y qué documento produjo.",
          })}

          <div class="wf-panel">
            <div class="wf-panel__head">
              <div>
                <p class="wf-panel__title" data-wf-code>Solicitud ${escape(featured.code)}</p>
                <p class="wf-panel__meta">${escape(workflows[featured.workflow].label)} ·
                  ${escape(featured.area)} · ${escape(longDate(featured.opened.slice(0, 10)))}</p>
              </div>
              <span data-wf-state>${statePill("aprobacion")}</span>
            </div>

            <div class="wf-panel__body wf-stack">
              <div data-wf-track-box>${track(trackNodes(featured, 2))}</div>

              <div class="wf-approval" data-wf-approval>
                <div class="wf-approval__top">
                  <div>
                    <p class="fx-label"><span>Pendiente de aprobación</span></p>
                    <p class="wf-approval__title" data-wf-approver>${escape(pending.name)}</p>
                    <p class="wf-panel__meta" data-wf-approver-area>${escape(pending.area)}</p>
                  </div>
                  ${flag("Turno actual")}
                </div>

                <dl class="wf-approval__facts">
                  <div><dt>Monto</dt><dd data-wf-amount>${escape(money(featured.amount))}</dd></div>
                  <div><dt>Paso</dt><dd data-wf-step-label>${escape(pendingStep.label)}</dd></div>
                  <div><dt>Tiempo objetivo</dt><dd>${escape(duration(pendingStep.sla))}</dd></div>
                </dl>

                <div class="wf-approval__actions" data-when-scripted>
                  <button class="fx-btn fx-btn--solid" type="button" data-wf-decide="aprobada">
                    ${icon("check")}Aprobar
                  </button>
                  <button class="fx-btn fx-btn--ghost" type="button" data-wf-decide="cambios">
                    ${icon("edit")}Solicitar cambios
                  </button>
                  <button class="fx-btn wf-btn--danger" type="button" data-wf-decide="rechazada">
                    ${icon("closed")}Rechazar
                  </button>
                </div>
              </div>

              <div class="wf-stack" data-wf-closing hidden>
                <div class="wf-subhead">
                  <h3 class="wf-subhead__title" data-wf-closing-title>Solicitud aprobada</h3>
                  <p class="wf-subhead__note">${escape(featured.code)}</p>
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
              </div>

              <div>
                <div class="wf-tabs" role="tablist" aria-label="Secciones del expediente">
                  ${tab("resumen", "Resumen", true)}
                  ${tab("aprobaciones", "Aprobaciones")}
                  ${tab("documentos", "Documentos")}
                  ${tab("historial", "Historial")}
                  ${tab("actividad", "Actividad")}
                </div>
                ${panel("resumen", "Resumen", summary, true)}
                ${panel("aprobaciones", "Aprobaciones", approvalsPanel)}
                ${panel("documentos", "Documentos", documentsPanel)}
                ${panel(
                  "historial",
                  "Historial",
                  `<p class="wf-subhead__note" style="margin-bottom:1rem">Cada acción del expediente
                     queda registrada con su hora y su responsable.</p>` +
                    auditList(auditTrail.slice(0, 4)),
                )}
                ${panel(
                  "actividad",
                  "Actividad",
                  `<ul class="wf-assignees" style="grid-template-columns:minmax(0,1fr)">
                     ${demoUsers
                       .slice(0, 3)
                       .map((user) => personRow(user))
                       .join("")}
                   </ul>
                   <p class="fx-note" style="margin-top:1rem">
                     Personas asignadas al expediente. Todas son ficticias y existen únicamente
                     para demostrar el circuito de responsabilidades.
                   </p>`,
                )}
              </div>
            </div>
          </div>
        </div>
      </section>`;
}

/* ================================================ 05 · the request itself */

function requestSection() {
  return `      <section class="fx-section fx-section--sunken" id="solicitud" aria-labelledby="h-solicitud">
        <div class="fx-shell">
          ${head({
            id: "h-solicitud",
            index: "02",
            label: "Solicitud de compra",
            title: "Un formulario que ya sabe a quién enviar la solicitud.",
            body:
              "Complete el monto y el concepto — o deje que el asistente los lea del adjunto — y " +
              "el motor decide el circuito de autorización antes de que nadie mire el expediente.",
          })}

          <div class="wf-panel">
            <div class="wf-panel__head">
              <div>
                <p class="wf-panel__title">Nueva solicitud</p>
                <p class="wf-panel__meta">Formulario de compra · tiempo objetivo 48 horas</p>
              </div>
              ${flag(moduleInfo.tag)}
            </div>
            <div class="wf-panel__body wf-stack">
              <div data-wf-stage="form">
                ${captureAssistant()}
                ${requestForm()}
              </div>
              ${runSequence()}
            </div>
          </div>
        </div>
      </section>`;
}

/* ================================================= 06 · the dashboard */

function dashboard() {
  const total = byState.reduce((sum, item) => sum + item.value, 0);

  const tiles = kpis
    .map(
      (item) =>
        `<div class="fx-figure"><p class="fx-figure__label">${escape(item.label)}</p>` +
        `<p class="fx-figure__value">${escape(item.value)}` +
        `${item.sup ? `<sup>${escape(item.sup)}</sup>` : ""}</p>` +
        `<p class="fx-figure__note">${escape(item.note)}</p></div>`,
    )
    .join("");

  const bars = byState
    .map((item) => {
      const share = Math.round((item.value / total) * 100);
      return (
        `<div class="wf-bar" data-tone="${escape(states[item.key].tone)}">` +
        `<div class="wf-bar__top"><span class="wf-bar__label">${statePill(item.key)}` +
        `<span class="fx-note">${escape(item.label)}</span></span>` +
        `<span class="wf-bar__value">${item.value}</span></div>` +
        `<div class="wf-bar__track"><span class="wf-bar__fill" style="width:${share}%"></span></div>` +
        `</div>`
      );
    })
    .join("");

  return `      <section class="fx-section" id="panel" aria-labelledby="h-panel">
        <div class="fx-shell">
          ${head({
            id: "h-panel",
            index: "04",
            label: "Panel administrativo",
            title: "Cuántas, de quién, en qué estado y en cuánto tiempo.",
            body:
              "Las cuatro cifras que una jefatura administrativa revisa cada lunes, calculadas " +
              "sobre el registro y no sobre una hoja de cálculo que alguien recuerda actualizar.",
            action: demoTag("Datos demostrativos"),
          })}

          <div class="fx-figures fx-figures--4">${tiles}</div>

          <div class="wf-split" style="margin-top:2rem">
            <div>
              <div class="wf-subhead">
                <h3 class="wf-subhead__title">Solicitudes por estado</h3>
                <p class="wf-subhead__note">${total} solicitudes del mes</p>
              </div>
              <div class="wf-bars">${bars}</div>
            </div>
            ${note(
              "Todos los valores de este panel son demostrativos. En una implementación real " +
                "provienen del mismo registro que alimenta la tabla de solicitudes, de modo que el " +
                "indicador y el expediente nunca discrepan.",
            )}
          </div>
        </div>
      </section>`;
}

/* ================================================== 07 · the register */

function register(ctx) {
  const rows = requests.map((request) => ({
    attrs:
      ` data-state="${escape(request.state)}" data-type="${escape(request.type)}"` +
      ` data-area="${escape(request.area)}" data-day="${escape(request.opened.slice(0, 10))}"` +
      ` data-text="${escape(
        `${request.code} ${request.concept} ${request.requester} ${request.area} ${request.type} ${stateName(request.state)}`.toLowerCase(),
      )}"`,
    cells: registerCells(request, requestHref(ctx, request.code), shortDate(request.opened)),
  }));

  const options = (items) =>
    items.map((item) => `<option value="${escape(item)}">${escape(item)}</option>`).join("");

  const days = [...new Set(requests.map((r) => r.opened.slice(0, 10)))].sort().reverse();

  return `      <section class="fx-section fx-section--surface" id="solicitudes" aria-labelledby="h-solicitudes">
        <div class="fx-shell">
          ${head({
            id: "h-solicitudes",
            index: "05",
            label: "Registro",
            title: "Todas las solicitudes, buscables por cualquier campo.",
            body:
              "Quince expedientes demostrativos. Cada código abre su ficha completa con " +
              "resumen, aprobaciones, documentos, historial y actividad.",
          })}

          <div class="fx-toolbar" data-wf-filters>
            <div class="fx-toolbar__row">
              <div class="fx-field">
                <label class="fx-field__label" for="f-q">Buscar</label>
                <input class="fx-input" id="f-q" type="search" data-wf-search
                  placeholder="Código, concepto o solicitante" autocomplete="off" />
              </div>
              <div class="fx-field">
                <label class="fx-field__label" for="f-state">Estado</label>
                <span class="fx-select"><select class="fx-input" id="f-state" data-wf-filter="state">
                  <option value="all">Todos los estados</option>
                  ${Object.entries(states)
                    .map(([key, value]) => `<option value="${key}">${escape(value.label)}</option>`)
                    .join("")}
                </select></span>
              </div>
              <div class="fx-field">
                <label class="fx-field__label" for="f-type">Tipo</label>
                <span class="fx-select"><select class="fx-input" id="f-type" data-wf-filter="type">
                  <option value="all">Todos los tipos</option>${options(requestTypes)}
                </select></span>
              </div>
              <div class="fx-field">
                <label class="fx-field__label" for="f-area">Área</label>
                <span class="fx-select"><select class="fx-input" id="f-area" data-wf-filter="area">
                  <option value="all">Todas las áreas</option>${options(requestAreas)}
                </select></span>
              </div>
              <div class="fx-field">
                <label class="fx-field__label" for="f-day">Fecha</label>
                <span class="fx-select"><select class="fx-input" id="f-day" data-wf-filter="day">
                  <option value="all">Todas las fechas</option>
                  ${days.map((day) => `<option value="${day}">${escape(longDate(day))}</option>`).join("")}
                </select></span>
              </div>
            </div>
            <div class="fx-toolbar__foot">
              <span data-wf-count>${requests.length} solicitudes</span>
              <button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-clear>
                Limpiar filtros
              </button>
            </div>
          </div>

          <div data-wf-register>
            ${table({
              columns: REGISTER_COLUMNS,
              rows,
              caption:
                "Registro demostrativo de solicitudes administrativas. Personas, montos y códigos ficticios.",
            })}
          </div>
          <p class="wf-empty" data-wf-noresults hidden>
            Ninguna solicitud coincide con los filtros aplicados.
          </p>
        </div>
      </section>`;
}

/* ============================================= 08 · targets and escalation */

function targets() {
  const rows = slaTargets.map((item) => ({
    cells: [
      escape(item.type),
      `${item.hours} horas`,
      escape(item.note),
    ],
  }));

  const watching = requests
    .filter((request) => states[request.state].open)
    .map((request) => ({ request, status: slaStatus(request) }))
    .sort((a, b) => (a.status.remaining ?? 0) - (b.status.remaining ?? 0))
    .slice(0, 4);

  return `      <section class="fx-section" id="tiempos" aria-labelledby="h-tiempos">
        <div class="fx-shell">
          ${head({
            id: "h-tiempos",
            index: "06",
            label: "Tiempo objetivo",
            title: "Cada tipo de solicitud tiene un plazo, y el plazo se vigila solo.",
            body:
              "El motor cuenta las horas desde el registro. Al acercarse al límite avisa; al " +
              "superarlo, escala la solicitud sin que nadie tenga que reclamarla.",
          })}

          <div class="wf-split">
            <div>
              ${table({
                columns: [
                  { label: "Proceso", key: "type" },
                  { label: "Tiempo objetivo", key: "hours" },
                  { label: "Criterio", key: "note" },
                ],
                rows,
                caption: "Tiempos objetivo demostrativos por tipo de proceso.",
              })}
            </div>

            <div class="wf-stack">
              <div>
                <div class="wf-subhead">
                  <h3 class="wf-subhead__title">En vigilancia ahora</h3>
                  <p class="wf-subhead__note">Ordenadas por tiempo restante</p>
                </div>
                <ul class="wf-records" style="gap:.5rem">
                  ${watching
                    .map(
                      ({ request, status }) =>
                        `<li class="wf-person" style="grid-template-columns:minmax(0,1fr) auto">` +
                        `<span><span class="wf-person__name">${escape(request.code)}</span>` +
                        `<span class="wf-person__role">${escape(request.concept)} · ` +
                        `${escape(roleName(request.responsible))}</span></span>` +
                        `<span>${slaBadge(request)}</span></li>` +
                        (status.level === "over" || status.level === "warn"
                          ? `<li class="fx-note" style="padding-left:.25rem">` +
                            `${status.level === "over" ? "SLA excedido · escalada automáticamente" : "Atención · próxima a vencer"}</li>`
                          : ""),
                    )
                    .join("")}
                </ul>
              </div>

              <div class="wf-escalation">
                <p class="wf-escalation__title">${icon("alert")}${escape(escalation.outcome)}</p>
                <dl class="wf-escalation__facts">
                  <div><dt>Solicitud</dt><dd>${escape(escalation.code)}</dd></div>
                  <div><dt>Responsable</dt><dd>${escape(escalation.responsible)}</dd></div>
                  <div><dt>Tiempo objetivo</dt><dd>${escalation.sla} horas</dd></div>
                  <div><dt>Transcurrido</dt><dd>${escape(escalation.elapsed)}</dd></div>
                </dl>
                <p class="fx-note" style="color:var(--ink)"><b>${escape(escalation.detail)}</b></p>
                <p class="fx-note">${escape(escalation.note)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>`;
}

/* ==================================================== 09 · business rules */

function rules() {
  const chain = (steps) =>
    `<ol class="wf-chain">` +
    steps
      .map(
        (step, index) =>
          (index ? `<li class="wf-chain__arrow" aria-hidden="true">${icon("arrowDown")}</li>` : "") +
          `<li class="wf-chain__step${step.kind ? ` wf-chain__step--${step.kind}` : ""}">` +
          `${escape(step.label)}</li>`,
      )
      .join("") +
    `</ol>`;

  const cards = amountBands
    .map(
      (band) =>
        `<div class="wf-rule">` +
        `<div><span class="wf-rule__if">Si</span>` +
        `<p class="wf-rule__cond">${escape(band.when)}</p></div>` +
        `<div><span class="wf-rule__if">Entonces</span>` +
        chain([
          { label: "Solicitante", kind: "start" },
          ...band.chain.map((role) => ({ label: roleName(role) })),
          { label: "Aprobada", kind: "end" },
        ]) +
        `</div>` +
        `<p class="wf-rule__note">${escape(band.note)}</p>` +
        `</div>`,
    )
    .join("");

  return `      <section class="fx-section fx-section--sunken" id="reglas" aria-labelledby="h-reglas">
        <div class="fx-shell">
          ${head({
            id: "h-reglas",
            index: "07",
            label: "Reglas",
            title: "Automatización basada en reglas, no en criterio.",
            body:
              "El circuito de autorización se decide por el contenido de la solicitud. Estas tres " +
              "reglas son las que acaba de ejecutar el formulario de arriba: la misma definición " +
              "gobierna el diagrama y el motor.",
          })}

          <div class="wf-rules">${cards}</div>

          <p class="fx-note fx-note--boxed" style="margin-top:1.5rem">
            <b>${escape(configurableNote)}</b> Las reglas mostradas son ficticias y sirven para
            ilustrar el mecanismo: umbrales, responsables y número de niveles se definen en la
            implementación.
          </p>
        </div>
      </section>`;
}

/* ================================================= 10 · one engine, many */

function engine() {
  const tiles = engineProcesses
    .map((item, index) => {
      const mini = index === 1 ? "vacaciones" : index === 2 ? "viaticos" : null;
      const inner =
        `<span class="wf-engine__title">${escape(item.title)}` +
        `${mini ? icon("arrow") : ""}</span>` +
        `<span class="wf-engine__text">${escape(item.text)}</span>`;

      return mini
        ? `<button class="wf-engine__item" type="button" data-wf-mini="${mini}">${inner}</button>`
        : `<div class="wf-engine__item">${inner}</div>`;
    })
    .join("");

  return `      <section class="fx-section" id="motor" aria-labelledby="h-motor">
        <div class="fx-shell">
          ${head({
            id: "h-motor",
            index: "08",
            label: "El motor",
            title: "Un motor. Diferentes procesos.",
            body:
              "Cambiar de proceso no es cambiar de sistema: es cambiar la definición del flujo. " +
              "Vacaciones y viáticos abren su ejemplo para mostrarlo.",
          })}
          <div class="wf-engine">${tiles}</div>
        </div>
      </section>`;
}

/** The two mini demos, as native dialogs. */
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
        <p class="fx-note">
          Ejemplo de reutilización del motor: mismo formulario, misma bitácora, misma pantalla de
          seguimiento — otra definición de pasos y responsables. Datos ficticios.
        </p>
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

/* ============================================= 11 · the documentary chain */

function documentary() {
  const stages = documentPipeline
    .map(
      (stage, index) =>
        `<li class="wf-pipeline__stage">` +
        `<span class="wf-pipeline__index">${String(index + 1).padStart(2, "0")}</span>` +
        `<p class="wf-pipeline__label">${escape(stage.label)}</p>` +
        `<p class="wf-pipeline__text">${escape(stage.text)}</p></li>`,
    )
    .join("");

  return `      <section class="fx-section fx-section--surface" id="documental" aria-labelledby="h-documental">
        <div class="fx-shell">
          ${head({
            id: "h-documental",
            index: "09",
            label: "Procesos documentales",
            title: "De expediente a documento final.",
            body: documentPipelineNote,
          })}
          <ol class="wf-pipeline">${stages}</ol>
        </div>
      </section>`;
}

/* ================================================== 12 · before and after */

function comparison() {
  const side = (data, after) =>
    `<div class="wf-compare__side${after ? " wf-compare__side--after" : ""}">` +
    `<p class="wf-compare__label">${escape(data.label)}</p>` +
    `<ul class="wf-compare__list">` +
    data.items
      .map(
        (item) =>
          `<li>${icon(after ? "check" : "closed")}<span>${escape(item)}</span></li>`,
      )
      .join("") +
    `</ul></div>`;

  return `      <section class="fx-section" id="comparacion" aria-labelledby="h-comparacion">
        <div class="fx-shell">
          ${head({
            id: "h-comparacion",
            index: "10",
            label: "El cambio",
            title: "Del seguimiento manual al control digital.",
            body:
              "La columna de la izquierda no es un error de nadie: es lo que ocurre cuando un " +
              "proceso crece sin una herramienta que lo sostenga.",
          })}
          <div class="wf-compare">
            ${side(beforeAfter.before, false)}
            ${side(beforeAfter.after, true)}
          </div>
        </div>
      </section>`;
}

/* ========================================================= 13 · impact */

function impactSection() {
  const items = impact
    .map(
      (item) =>
        `<div class="wf-impact__item"><p class="wf-impact__value">${escape(item.value)}</p>` +
        `<p class="wf-impact__label">${escape(item.label)}</p></div>`,
    )
    .join("");

  return `      <section class="fx-section fx-section--dark fx-dark" id="impacto" aria-labelledby="h-impacto">
        <div class="fx-shell">
          <header class="fx-head fx-head--split" id="h-impacto">
            <p class="fx-label"><span class="fx-label__index">11</span><span>Impacto potencial</span>
            </p>
            <h2 class="fx-head__title">Impacto potencial</h2>
            <div class="fx-head__aside">
              <p>${escape(impactNote)}</p>
              <div class="fx-actions" style="margin-top:1rem">${demoTag("Simulación", true)}</div>
            </div>
          </header>
          <div class="wf-impact">${items}</div>
        </div>
      </section>`;
}

/* ============================================================ 14 · closing */

function closingCall(ctx) {
  return `      <section class="fx-cta fx-dark">
        <div class="fx-shell fx-cta__inner">
          <div>
            <p class="fx-label"><span>Adaptable</span></p>
            <h2 class="fx-cta__title">Cada organización tiene procesos diferentes.</h2>
          </div>
          <div>
            <p class="fx-cta__text">
              Los flujos de solicitud, aprobación, documentación y seguimiento pueden adaptarse a
              las reglas, responsables y niveles de autorización de cada institución.
            </p>
            <div class="fx-actions" style="margin-top:1.5rem">
              <a class="fx-btn fx-btn--solid" href="#motor">Explorar otro proceso${icon("arrow")}</a>
              <a class="fx-btn fx-btn--onDark" href="${page(ctx, "../../index.html")}#proyectos">
                Volver al portafolio
              </a>
            </div>
          </div>
        </div>
      </section>`;
}

/* ========================================================= the guided tour */

function tourBar() {
  return `    <div class="wf-guide" data-wf-guidebar role="status" aria-live="polite">
      <p class="wf-guide__text">
        <span class="wf-guide__step" data-wf-guide-step>Demo guiada</span>
        <span data-wf-guide-text>Preparando la demostración…</span>
      </p>
      <div class="wf-guide__actions">
        <button class="wf-guide__btn" type="button" data-wf-guide-pause>Pausar</button>
        <button class="wf-guide__btn" type="button" data-wf-guide-skip>Salir</button>
      </div>
    </div>`;
}

/* =============================================================== the page */

export function modulePage(ctx) {
  const body = [
    moduleHero(ctx),
    chooser(),
    requestSection(),
    followUp(),
    dashboard(),
    register(ctx),
    targets(),
    rules(),
    engine(),
    documentary(),
    comparison(),
    impactSection(),
    closingCall(ctx),
    tourBar(),
    miniDialogs(),
  ].join("\n\n");

  return {
    meta: {
      title: moduleInfo.label,
      canonical: "",
      description:
        "Demostración de automatización administrativa: solicitudes, validación, reglas de " +
        "aprobación, responsables, tiempos de respuesta, documentos generados y trazabilidad " +
        "completa. Datos ficticios.",
    },
    body,
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
            ${arrowLink("Volver al registro de solicitudes", "../index.html#solicitudes")}
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
