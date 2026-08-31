/**
 * The workflow engine, in the browser.
 *
 * It does three things. It plays the automation sequence after a request is
 * submitted — validate, apply the amount rule, assign the people the rule
 * selected, start the flow. It drives the approvals, recording each one and
 * moving the request along its route. And it runs the closing automation:
 * state, document, log, notification, archive.
 *
 * The routing decisions are not made here. `routeFor` and `ruleFor` in
 * `data/flujo/workflows.js` decide who approves what, and the same two
 * functions produced the rule diagram and the first paint of this page at build
 * time — so the circuit a visitor watches being applied is provably the circuit
 * the page documents.
 */

import {
  approvals as scriptedApprovals,
  approvalsFor,
  duration,
  featured,
  money,
  roleName,
  ruleFor,
  userFor,
} from "../../data/flujo/workflows.js";
import { approvalRecord, auditRow, personRow, statePill, track } from "./render.js";

/* -------------------------------------------------------------- scheduling */

/**
 * A cancellable, pausable wait.
 *
 * The guided tour needs to be able to stop the sequence between beats without
 * leaving a pile of orphaned timers behind, and a visitor who navigates away
 * mid-run should not have the page keep animating at them. One clock object
 * owns every timer the engine sets.
 */
export function createClock() {
  let timers = new Set();
  let paused = false;
  let cancelled = false;
  const waiters = new Set();

  const sleep = (ms) =>
    new Promise((resolve, reject) => {
      if (cancelled) return reject(new Error("cancelled"));

      const start = () => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          if (cancelled) reject(new Error("cancelled"));
          else resolve();
        }, ms);
        timers.add(id);
      };

      if (paused) waiters.add(start);
      else start();
    });

  return {
    sleep,
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
      for (const start of waiters) start();
      waiters.clear();
    },
    get paused() {
      return paused;
    },
    cancel() {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
      timers.clear();
      waiters.clear();
    },
    reset() {
      cancelled = false;
      paused = false;
      timers = new Set();
    },
  };
}

/* ------------------------------------------------------------------ clock */

const two = (n) => String(n).padStart(2, "0");

/** `HH:MM`, now. The visitor's own clock, because this is happening to them. */
const stamp = (offsetMinutes = 0) => {
  const now = new Date(Date.now() + offsetMinutes * 60000);
  return `${two(now.getHours())}:${two(now.getMinutes())}`;
};

const today = () =>
  new Date().toLocaleDateString("es-HN", { day: "numeric", month: "long", year: "numeric" });

/* ----------------------------------------------------------------- engine */

export function createEngine({ root, state, save, toast, showTab }) {
  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => [...scope.querySelectorAll(selector)];

  const clock = createClock();

  const dom = {
    formStage: $('[data-wf-stage="form"]'),
    runStage: $('[data-wf-stage="run"]'),
    runBar: $("[data-wf-runbar]"),
    steps: $$("[data-wf-step]"),

    follow: $("#seguimiento"),
    code: $("[data-wf-code]"),
    statePill: $("[data-wf-state]"),
    trackBox: $("[data-wf-track-box]"),

    approval: $("[data-wf-approval]"),
    approver: $("[data-wf-approver]"),
    approverArea: $("[data-wf-approver-area]"),
    amount: $("[data-wf-amount]"),
    stepLabel: $("[data-wf-step-label]"),

    closing: $("[data-wf-closing]"),
    closingTitle: $("[data-wf-closing-title]"),
    closingRows: $$(".wf-closing__row"),

    records: $("[data-wf-records]"),
    recordsEmpty: $("[data-wf-records-empty]"),
    docEmpty: $("[data-wf-doc-empty]"),
    docBox: $("[data-wf-doc-box]"),
    audit: $("[data-wf-audit]"),
  };

  /* The request currently on screen: whatever was stored, or the seeded one. */
  let request = state.request ?? { ...featured };

  const chain = () => approvalsFor(request.workflow ?? "compra", request);
  const approvedCount = () => state.decisions.filter((d) => d.outcome === "aprobada").length;
  const terminal = () => state.decisions.some((d) => d.outcome !== "aprobada");

  /* ------------------------------------------------------------- painting */

  const trackNodes = (done) => {
    const stops = chain().map((step) => ({
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

    const blockedAt = terminal() ? 2 + approvedCount() : -1;

    return nodes.map((node, index) => ({
      ...node,
      state:
        index === blockedAt
          ? "blocked"
          : index < done
            ? "done"
            : index === done
              ? "current"
              : "pending",
    }));
  };

  function paintTrack() {
    dom.trackBox.innerHTML = track(trackNodes(2 + approvedCount()));
  }

  function paintState() {
    const key = terminal()
      ? state.decisions.find((d) => d.outcome !== "aprobada").outcome
      : state.closed
        ? "finalizada"
        : approvedCount() >= chain().length
          ? "aprobada"
          : "aprobacion";
    dom.statePill.innerHTML = statePill(key);
    return key;
  }

  function paintSummary() {
    const values = {
      solicitante: request.requester,
      area: request.area,
      centro: request.costCentre,
      concepto: request.concept,
      monto: money(request.amount),
      proveedor: request.supplier || "—",
      prioridad: request.priority,
      justificacion: request.justification,
    };
    for (const [key, value] of Object.entries(values)) {
      const target = $(`[data-wf-sum="${key}"]`);
      if (target) target.textContent = value;
    }
    if (dom.code) dom.code.textContent = `Solicitud ${request.code}`;
  }

  function paintApproval() {
    const stops = chain();
    const index = approvedCount();

    if (terminal() || index >= stops.length) {
      dom.approval.hidden = true;
      return;
    }

    const step = stops[index];
    const user = userFor(step.role);
    dom.approval.hidden = false;
    dom.approver.textContent = user.name;
    dom.approverArea.textContent = user.position;
    dom.amount.textContent = money(request.amount);
    dom.stepLabel.textContent = step.label;
  }

  function paintRecords() {
    dom.records.innerHTML = state.decisions.map(approvalRecord).join("");
    dom.recordsEmpty.hidden = state.decisions.length > 0;
  }

  const addAudit = (entry) => dom.audit.insertAdjacentHTML("beforeend", auditRow(entry));

  /**
   * Start the trail again for a request the visitor has just created.
   *
   * `at` is stored with the request rather than read from the clock, so a
   * restored expediente rebuilds the same four opening entries it had — a trail
   * whose first line changes every time you reload is not a trail.
   */
  function seedAudit(at) {
    const rule = ruleFor(request.amount);

    dom.audit.innerHTML = [
      {
        time: at,
        actor: request.requester,
        kind: "person",
        title: "Solicitud creada",
        text: `${request.concept} · ${request.area}.`,
      },
      {
        time: at,
        actor: "Sistema",
        kind: "system",
        title: "Validación automática completada",
        text: "Campos obligatorios, adjunto, centro de costo y monto verificados.",
      },
      {
        time: at,
        actor: "Sistema",
        kind: "rule",
        title: "Regla de monto aplicada",
        text: `${money(request.amount)} · ${rule.text}`,
      },
      {
        time: at,
        actor: "Sistema",
        kind: "system",
        title: `Asignada a ${roleName(chain()[0]?.role ?? "administracion")}`,
        text: `Responsable: ${userFor(chain()[0]?.role ?? "administracion").name} · tiempo objetivo ${duration(
          chain()[0]?.sla ?? 24,
        )}.`,
      },
    ]
      .map(auditRow)
      .join("");
  }

  /* -------------------------------------------------------- the run sequence */

  function patchRun() {
    const rule = ruleFor(request.amount);

    const set = (selector, value) => {
      const node = $(selector);
      if (node) node.textContent = value;
    };

    set("[data-wf-run-amount]", money(request.amount));
    set("[data-wf-run-rule]", `«${rule.text}»`);
    set(
      "[data-wf-run-result]",
      `${rule.approvals} ${rule.approvals === 1 ? "aprobación requerida" : "aprobaciones requeridas"}`,
    );
    set("[data-wf-run-band]", rule.band.note);

    const assignees = $("[data-wf-run-assignees]");
    if (assignees) {
      assignees.innerHTML = chain()
        .map((step) => personRow(userFor(step.role), step.role))
        .join("");
    }

    const runTrack = $("[data-wf-run-track]");
    if (runTrack) runTrack.innerHTML = track(trackNodes(2));
  }

  /** Reveal one stage, tick its checklist, mark it done. */
  async function playStep(step, index) {
    step.dataset.state = "running";
    step.dataset.shown = "";
    dom.runBar.style.width = `${((index + 0.5) / dom.steps.length) * 100}%`;

    const checks = [...step.querySelectorAll(".wf-check")];
    await clock.sleep(320);

    for (const check of checks) {
      check.dataset.shown = "";
      await clock.sleep(260);
    }

    await clock.sleep(checks.length ? 300 : 520);
    step.dataset.state = "done";
    dom.runBar.style.width = `${((index + 1) / dom.steps.length) * 100}%`;
  }

  /**
   * The whole submission: about seven seconds of the system doing the work a
   * person would otherwise be doing by email.
   */
  async function run(nextRequest) {
    request = { ...request, ...nextRequest, code: featured.code };
    state.request = request;
    state.createdAt = stamp();
    state.decisions = [];
    state.closed = false;
    save(state);

    /* The form's own loading state, held long enough to register as one. A
       submit button that vanishes on the same frame it is pressed reads as a
       page jump rather than as work starting. */
    const submit = $("[data-wf-submit]");
    const fieldset = $("[data-wf-fieldset]");
    submit?.classList.add("wf-btn--busy");
    if (fieldset) fieldset.disabled = true;
    await clock.sleep(520);
    submit?.classList.remove("wf-btn--busy");

    patchRun();
    paintSummary();
    seedAudit(state.createdAt);

    dom.formStage.hidden = true;
    dom.runStage.hidden = false;

    for (const step of dom.steps) {
      step.dataset.state = "idle";
      delete step.dataset.shown;
      for (const check of step.querySelectorAll(".wf-check")) delete check.dataset.shown;
    }
    dom.runBar.style.width = "0%";

    for (const [index, step] of dom.steps.entries()) {
      await playStep(step, index);
      if (index < dom.steps.length - 1) await clock.sleep(140);
    }

    paintTrack();
    paintState();
    paintApproval();
    paintRecords();

    await clock.sleep(500);
    dom.follow.scrollIntoView({ behavior: "smooth", block: "start" });
    toast(`Solicitud ${request.code} registrada · ${ruleFor(request.amount).approvals} aprobación(es) requerida(s)`);
  }

  /* -------------------------------------------------------------- decisions */

  const COMMENTS = {
    aprobada: "Revisado y conforme al procedimiento administrativo interno.",
    cambios: "Se solicita ampliar la justificación y adjuntar una segunda cotización.",
    rechazada: "No existe disponibilidad presupuestaria en el centro de costo indicado.",
  };

  /** Record one decision and move the request wherever it now belongs. */
  async function decide(outcome) {
    const stops = chain();
    const index = approvedCount();
    if (terminal() || index >= stops.length) return;

    const step = stops[index];
    const user = userFor(step.role);
    /* When the circuit matches the scripted example, the scripted comment is
       used — it is the one written for that exact step, and it reads better
       than a generic line. */
    const scripted = scriptedApprovals.find((entry) => entry.step === step.id);

    const decision = {
      step: step.id,
      role: step.role,
      name: user.name,
      initials: user.initials,
      area: user.position,
      date: today(),
      time: stamp(),
      outcome,
      comment: outcome === "aprobada" ? (scripted?.comment ?? COMMENTS.aprobada) : COMMENTS[outcome],
    };

    state.decisions.push(decision);
    save(state);

    paintRecords();
    paintTrack();
    paintApproval();
    const key = paintState();

    addAudit({
      time: decision.time,
      actor: user.name,
      kind: outcome === "aprobada" ? "approval" : "rejection",
      title:
        outcome === "aprobada"
          ? `${step.label} aprobó`
          : outcome === "cambios"
            ? `${step.label} solicitó cambios`
            : `${step.label} rechazó`,
      text: `«${decision.comment}»`,
    });

    if (outcome !== "aprobada") {
      dom.closing.hidden = false;
      dom.closingTitle.textContent =
        outcome === "cambios" ? "Cambios solicitados" : "Solicitud rechazada";
      for (const row of dom.closingRows) row.hidden = true;
      toast(`${step.label}: ${outcome === "cambios" ? "cambios solicitados" : "solicitud rechazada"}`);
      return;
    }

    const nextIndex = approvedCount();
    if (nextIndex < stops.length) {
      const next = stops[nextIndex];
      addAudit({
        time: decision.time,
        actor: "Sistema",
        kind: "system",
        title: `Asignada a ${next.label}`,
        text: `Responsable: ${userFor(next.role).name} · tiempo objetivo ${duration(next.sla ?? 24)}.`,
      });
      toast(`${step.label} aprobó · turno de ${userFor(next.role).name}`);
      return;
    }

    void close();
  }

  /* ---------------------------------------------------------------- closing */

  /** State, document, log, notification, archive — the five automatic steps. */
  async function close() {
    dom.closing.hidden = false;
    dom.closingTitle.textContent = "Solicitud aprobada";

    for (const row of dom.closingRows) {
      row.hidden = false;
      delete row.dataset.done;
    }

    await clock.sleep(400);
    for (const row of dom.closingRows) {
      row.dataset.done = "";
      await clock.sleep(340);
    }

    state.closed = true;
    save(state);
    paintState();

    /* The document has been in the markup all along; this is where it stops
       being "what the flow will produce" and becomes "what the flow produced". */
    if (dom.docBox) delete dom.docBox.dataset.whenStatic;
    if (dom.docEmpty) dom.docEmpty.hidden = true;

    const at = stamp();
    addAudit({
      time: at,
      actor: "Sistema",
      kind: "document",
      title: "Documento generado",
      text: `${featured.document} · código de verificación ${featured.verification}.`,
    });
    addAudit({
      time: at,
      actor: "Sistema",
      kind: "notification",
      title: "Notificación preparada",
      text: `Destinatario: ${featured.email} · envío simulado.`,
    });
    addAudit({
      time: at,
      actor: "Sistema",
      kind: "system",
      title: "Proceso finalizado",
      text: "Expediente archivado con su historial completo.",
    });

    toast("Documento generado y expediente archivado");
    showTab?.("documentos");
  }

  /* --------------------------------------------------------------- restore */

  /**
   * Put the page back where the visitor left it.
   *
   * No animation: replaying seven seconds of processing at someone who has
   * already watched it once is not a demonstration, it is a delay.
   */
  function restore() {
    if (!state.request) return false;

    request = state.request;
    dom.formStage.hidden = true;
    dom.runStage.hidden = true;

    paintSummary();
    paintTrack();
    paintState();
    paintApproval();
    paintRecords();

    if (state.closed) {
      dom.closing.hidden = false;
      dom.closingTitle.textContent = "Solicitud aprobada";
      for (const row of dom.closingRows) row.dataset.done = "";
      if (dom.docBox) delete dom.docBox.dataset.whenStatic;
      if (dom.docEmpty) dom.docEmpty.hidden = true;
    } else if (terminal()) {
      const outcome = state.decisions.find((d) => d.outcome !== "aprobada").outcome;
      dom.closing.hidden = false;
      dom.closingTitle.textContent =
        outcome === "cambios" ? "Cambios solicitados" : "Solicitud rechazada";
      for (const row of dom.closingRows) row.hidden = true;
    }

    /* The trail is rebuilt rather than restored: the four opening entries come
       from the request, the rest from the stored decisions, and both use the
       minute they actually happened. */
    seedAudit(state.createdAt ?? "00:00");

    for (const decision of state.decisions) {
      addAudit({
        time: decision.time,
        actor: decision.name,
        kind: decision.outcome === "aprobada" ? "approval" : "rejection",
        title: `${roleName(decision.role)} ${
          decision.outcome === "aprobada"
            ? "aprobó"
            : decision.outcome === "cambios"
              ? "solicitó cambios"
              : "rechazó"
        }`,
        text: `«${decision.comment}»`,
      });
    }

    if (state.closed) {
      const at = state.decisions.at(-1)?.time ?? state.createdAt ?? "00:00";
      addAudit({
        time: at,
        actor: "Sistema",
        kind: "document",
        title: "Documento generado",
        text: `${featured.document} · código de verificación ${featured.verification}.`,
      });
      addAudit({
        time: at,
        actor: "Sistema",
        kind: "notification",
        title: "Notificación preparada",
        text: `Destinatario: ${featured.email} · envío simulado.`,
      });
      addAudit({
        time: at,
        actor: "Sistema",
        kind: "system",
        title: "Proceso finalizado",
        text: "Expediente archivado con su historial completo.",
      });
    }

    return true;
  }

  /* ------------------------------------------------------------------ wiring */

  for (const control of $$("[data-wf-decide]")) {
    control.addEventListener("click", () => void decide(control.dataset.wfDecide));
  }

  return {
    run,
    decide,
    restore,
    clock,
    get pending() {
      return !terminal() && approvedCount() < chain().length && Boolean(state.request);
    },
    get request() {
      return request;
    },
  };
}
