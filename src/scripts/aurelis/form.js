/**
 * The contact form.
 *
 * Five states, all real: normal, focus, error, sending, success. What is
 * simulated is only the request — a demo has no backend — and the page says so
 * next to the form rather than pretending otherwise.
 *
 * Validation runs on submit and then, per field, on every change: a field that
 * has already been marked wrong should clear itself as soon as it is right,
 * while a field the visitor has not reached yet should stay silent.
 */

const MESSAGES = {
  valueMissing: "Este campo es obligatorio.",
  typeMismatch: "Revise el formato de este dato.",
  tooShort: "El texto es demasiado corto.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The message a control should show, or an empty string when it is valid. */
function problem(control) {
  if (control.type === "checkbox") {
    return control.checked ? "" : "Debe aceptar el aviso de privacidad para continuar.";
  }

  const value = control.value.trim();
  if (control.required && !value) return MESSAGES.valueMissing;
  if (!value) return "";

  if (control.type === "email" && !EMAIL.test(value)) {
    return "Escriba un correo válido, por ejemplo nombre@empresa.com.";
  }
  if (control.tagName === "TEXTAREA" && value.length < 20) {
    return "Cuéntenos un poco más: al menos veinte caracteres.";
  }
  if (control.type === "tel" && value.replace(/[^\d]/g, "").length < 8) {
    return "El teléfono parece incompleto.";
  }
  return "";
}

function show(control, message) {
  const field = control.closest("[data-field]");
  const output = field?.querySelector("[data-error]");
  if (!field || !output) return !message;

  field.dataset.state = message ? "error" : "";
  output.textContent = message;
  control.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

export function initForm() {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const status = form.querySelector("[data-status]");
  const submit = form.querySelector("[data-submit]");
  const controls = [...form.querySelectorAll("input, select, textarea")];

  const setStatus = (state, message) => {
    if (!status) return;
    status.dataset.state = state ?? "";
    status.textContent = message ?? "";
  };

  for (const control of controls) {
    /* Only re-validate a control that has already failed once. Marking a field
       wrong while someone is still typing in it is a scolding, not help. */
    const revalidate = () => {
      if (control.closest("[data-field]")?.dataset.state === "error") {
        show(control, problem(control));
      }
    };
    control.addEventListener("input", revalidate);
    control.addEventListener("change", revalidate);
    control.addEventListener("blur", () => {
      if (control.value || control.type === "checkbox") show(control, problem(control));
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submit?.getAttribute("aria-disabled") === "true") return;

    let firstBad = null;
    for (const control of controls) {
      const message = problem(control);
      if (message && !firstBad) firstBad = control;
      show(control, message);
    }

    if (firstBad) {
      setStatus("error", "Revise los campos marcados antes de enviar.");
      firstBad.focus();
      return;
    }

    setStatus("sending", "Enviando consulta…");
    submit?.setAttribute("aria-disabled", "true");

    /* The simulated round trip. A real deployment replaces this block with a
       fetch() to the endpoint; the states around it do not change. */
    setTimeout(() => {
      submit?.removeAttribute("aria-disabled");
      form.reset();
      for (const control of controls) show(control, "");
      setStatus(
        "success",
        "Consulta registrada. En una implementación real recibiría respuesta en menos de 24 horas hábiles.",
      );
    }, 1400);
  });
}
