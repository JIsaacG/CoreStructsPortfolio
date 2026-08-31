/**
 * The request form: validation, and the capture assistant above it.
 *
 * The validation is the ordinary, correct kind — validate on blur, then live
 * while a field is being corrected, never while it is first being typed into,
 * because that is the behaviour that makes a form feel like it is arguing with
 * you. Errors are sentences next to the field, the first bad field takes focus,
 * and the live region says what happened.
 *
 * The capture assistant reads nothing. It waits, then writes four values that
 * were in the module's data all along, and says so twice on screen. The point
 * it demonstrates — that a document a person would retype can fill the form
 * instead — is real; the extraction is not, and pretending otherwise would be
 * the one dishonest thing in the demonstration.
 */

import { extraction } from "../../data/flujo/workflows.js";

/* --------------------------------------------------------------- validation */

/** Every field the form will not submit without. */
const REQUIRED = ["solicitante", "area", "tipo", "concepto", "monto", "centro", "justificacion"];

/** `L 58,500.00`, `58.500,00`, `58500` → 58500. Anything else → NaN. */
export function parseAmount(raw) {
  const text = String(raw ?? "").replace(/[^\d.,-]/g, "").trim();
  if (!text) return Number.NaN;

  /* Whichever separator appears last is the decimal one; the other groups. */
  const lastComma = text.lastIndexOf(",");
  const lastDot = text.lastIndexOf(".");
  let normalised = text;

  if (lastComma > -1 && lastDot > -1) {
    normalised =
      lastComma > lastDot
        ? text.replace(/\./g, "").replace(",", ".")
        : text.replace(/,/g, "");
  } else if (lastComma > -1) {
    /* A lone comma with exactly three digits after it is a thousands mark. */
    normalised = /,\d{3}$/.test(text) ? text.replace(/,/g, "") : text.replace(",", ".");
  }

  const value = Number(normalised);
  return Number.isFinite(value) ? value : Number.NaN;
}

const fieldOf = (control) => control.closest(".wf-form__field");

/** The message for whatever is wrong with this control, or null if nothing is. */
function problem(control) {
  const value = control.value.trim();

  if (REQUIRED.includes(control.id) && !value) {
    return control.id === "monto"
      ? "El monto estimado es requerido."
      : control.dataset.wfRequiredMessage ?? defaultMessage(control);
  }

  if (control.id === "monto" && value) {
    const amount = parseAmount(value);
    if (Number.isNaN(amount)) return "Introduzca un monto numérico, por ejemplo 58500.";
    if (amount <= 0) return "El monto estimado debe ser mayor que cero.";
    if (amount > 100000000) return "El monto excede el límite del formulario.";
  }

  return null;
}

function defaultMessage(control) {
  const label = document.querySelector(`label[for="${control.id}"]`);
  const name = label ? label.textContent.replace("*", "").trim() : "Este campo";
  return `${name} es requerido.`;
}

/** Paint one field's state: invalid with a sentence, valid with a tick, or neither. */
function mark(control, message, { showValid = true } = {}) {
  const field = fieldOf(control);
  if (!field) return;

  const invalid = Boolean(message);
  field.toggleAttribute("data-invalid", invalid);
  field.toggleAttribute("data-valid", !invalid && showValid && control.value.trim() !== "");
  control.setAttribute("aria-invalid", String(invalid));

  const line = field.querySelector("[data-wf-error-text]");
  if (line && message) line.textContent = message;
  if (invalid) control.setAttribute("aria-describedby", `${control.id}-error`);
  else control.removeAttribute("aria-describedby");
}

/**
 * Wire the form up.
 *
 * Returns the two things the engine needs from it: a `validate()` that reports
 * whether the form may be submitted (and paints the reasons if not), and a
 * `read()` that hands back the request as an object.
 */
export function initForm(form, { onSubmit }) {
  const controls = [...form.querySelectorAll("[data-wf-field]")];
  const byId = Object.fromEntries(controls.map((control) => [control.id, control]));

  for (const control of controls) {
    if (control.readOnly) continue;

    control.addEventListener("blur", () => mark(control, problem(control)));
    control.addEventListener("input", () => {
      if (fieldOf(control)?.hasAttribute("data-invalid")) mark(control, problem(control));
    });
    control.addEventListener("change", () => mark(control, problem(control)));
  }

  const read = () => ({
    code: byId.codigo?.value ?? "",
    requester: byId.solicitante?.value.trim() ?? "",
    area: byId.area?.value ?? "",
    position: byId.cargo?.value.trim() ?? "",
    type: byId.tipo?.value ?? "",
    concept: byId.concepto?.value.trim() ?? "",
    amount: parseAmount(byId.monto?.value),
    costCentre: byId.centro?.value ?? "",
    priority: byId.prioridad?.value ?? "",
    supplier: byId.proveedor?.value.trim() ?? "",
    justification: byId.justificacion?.value.trim() ?? "",
    workflow: "compra",
  });

  const validate = () => {
    const failed = [];
    for (const control of controls) {
      if (control.readOnly) continue;
      const message = problem(control);
      mark(control, message);
      if (message) failed.push(control);
    }

    if (failed.length) {
      failed[0].focus({ preventScroll: true });
      failed[0].scrollIntoView({ block: "center", behavior: "smooth" });
    }
    return failed.length === 0;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validate()) onSubmit(read());
  });

  /** Write values in from outside — the capture assistant and the guided tour. */
  const fill = (values) => {
    for (const [id, value] of Object.entries(values)) {
      const control = byId[id];
      if (!control) continue;
      control.value = value;
      mark(control, problem(control));
      /* Setting `.value` fires nothing. The route panel beside the amount is
         listening for `input`, so a field written by the assistant has to
         announce itself the way a field written by a person does — otherwise
         the assistant fills in 58,500 and the circuit beside it goes on
         describing whatever was there before. */
      control.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  return { validate, read, fill, controls: byId, form };
}

/* ------------------------------------------------------------- the assistant */

/**
 * The capture assistant.
 *
 * Three visible beats — scanning, extracted, applied — because a component that
 * simply flips from "a file" to "four values" reads as a trick rather than as a
 * capability. The middle beat is where the visitor understands what is being
 * claimed.
 */
export function initCapture(root, { fill, toast }) {
  if (!root) return { scan: () => Promise.resolve(), use: () => {} };

  const scanButton = root.querySelector("[data-wf-scan]");
  const bar = root.querySelector("[data-wf-scanbar]");
  const status = root.querySelector("[data-wf-scanstatus]");
  const extracted = root.querySelector("[data-wf-extracted]");
  const useBox = root.querySelector("[data-wf-usebox]");
  const useButton = root.querySelector("[data-wf-use]");

  let scanned = false;

  const scan = () =>
    new Promise((resolve) => {
      if (scanned) return resolve();

      scanButton.disabled = true;
      scanButton.textContent = "Analizando…";
      bar.hidden = false;
      bar.classList.add("wf-progress--indeterminate");
      status.textContent = `Analizando ${extraction.file}…`;

      window.setTimeout(() => {
        scanned = true;
        bar.classList.remove("wf-progress--indeterminate");
        bar.hidden = true;
        status.textContent = `${extraction.fields.length} campos identificados en ${extraction.file}.`;
        extracted.hidden = false;
        useBox.hidden = false;
        scanButton.disabled = false;
        scanButton.textContent = "Analizar de nuevo";
        scanButton.hidden = true;
        resolve();
      }, 1900);
    });

  const use = () => {
    const values = Object.fromEntries(extraction.fields.map((f) => [f.key, f.value]));
    fill({
      proveedor: values.supplier ?? "",
      concepto: values.concept ?? "",
      monto: values.amount ?? "",
    });
    status.textContent = "Información aplicada al formulario.";
    useButton.disabled = true;
    useButton.textContent = "Información aplicada";
    toast?.(`Campos completados desde ${extraction.file} · extracción simulada`);
  };

  scanButton?.addEventListener("click", () => void scan());
  useButton?.addEventListener("click", use);

  return { scan, use };
}
