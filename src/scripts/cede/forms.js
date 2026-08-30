/**
 * Forms.
 *
 * The prototype never transmits anything, and says so — but the flow it
 * demonstrates is the real one: client-side validation with a message per
 * field, focus moved to the first problem, a receipt number on success, and a
 * live region so a screen reader hears the outcome instead of missing it.
 *
 * `novalidate` is on the form because the browser's own bubbles cannot be
 * styled, translated or announced consistently; the constraints themselves are
 * still declared in the HTML and read back from it here.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A plausible file-number for the confirmation, stable within a session. */
let sequence = 0;
const receipt = () => {
  sequence += 1;
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  return `CEDE-${stamp}-${String(sequence).padStart(4, "0")}`;
};

function fieldOf(control) {
  return control.closest(".cd-form__field");
}

function setInvalid(control, invalid) {
  const field = fieldOf(control);
  if (!field) return;
  field.toggleAttribute("data-invalid", invalid);
  control.setAttribute("aria-invalid", String(invalid));

  const message = field.querySelector(".cd-form__error");
  if (message) {
    if (invalid && !message.id) message.id = `${control.id || control.name}-error`;
    if (invalid) control.setAttribute("aria-describedby", message.id);
    else control.removeAttribute("aria-describedby");
  }
}

function validate(control) {
  const value = control.value.trim();
  if (control.required && !value) return false;
  if (control.type === "email" && value && !EMAIL.test(value)) return false;
  return true;
}

export function initForms() {
  for (const form of document.querySelectorAll("[data-form]")) {
    const controls = [...form.querySelectorAll("input, textarea, select")].filter(
      (control) => control.required || control.type === "email",
    );

    for (const control of controls) {
      /* Validate on blur, then live while a field is being corrected — never
         while it is first being typed into, which is the behaviour that makes a
         form feel like it is arguing with you. */
      control.addEventListener("blur", () => setInvalid(control, !validate(control)));
      control.addEventListener("input", () => {
        if (fieldOf(control)?.hasAttribute("data-invalid")) setInvalid(control, !validate(control));
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const invalid = controls.filter((control) => !validate(control));
      for (const control of controls) setInvalid(control, invalid.includes(control));

      const status = form.querySelector("[data-form-status]");

      if (invalid.length) {
        status?.classList.remove("is-visible");
        invalid[0].focus();
        invalid[0].scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }

      const number = receipt();
      const line = form.querySelector("[data-form-receipt]");
      if (line) line.textContent = `Número de expediente: ${number}`;

      status?.classList.add("is-visible");
      status?.scrollIntoView({ block: "center", behavior: "smooth" });
      form.reset();
      for (const control of controls) setInvalid(control, false);
    });
  }
}
