/**
 * The forms on the landing demos.
 *
 * None of them has anywhere to post to, and pretending otherwise would be the
 * one dishonest thing on an otherwise honest demonstration. So the browser's
 * own validation runs, the submit is intercepted, and the page answers with the
 * confirmation the real implementation would show — announced to assistive
 * technology, because a status that only appears visually is not a status.
 */

/**
 * @param {Document|Element} root
 * @param {(form: HTMLFormElement) => void} [onSubmit] extra work per page,
 *        e.g. writing a generated summary into the confirmation panel
 */
export function initDemoForms(root = document, onSubmit) {
  for (const form of root.querySelectorAll("[data-demo-form]")) {
    const done = form.querySelector("[data-form-done]");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      // `novalidate` is never set, so an invalid form never reaches here.
      onSubmit?.(form);

      if (done) {
        done.hidden = false;
        // The status is the answer to the action, so it takes the focus with it.
        done.setAttribute("tabindex", "-1");
        done.focus({ preventScroll: true });
        done.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }

      form.querySelector("[data-form-submit], button[type='submit']")?.setAttribute("disabled", "");
    });

    // Editing after a send clears the confirmation: the panel must never
    // describe a state the fields no longer match.
    form.addEventListener("input", () => {
      if (done && !done.hidden) done.hidden = true;
      form.querySelector("[data-form-submit], button[type='submit']")?.removeAttribute("disabled");
    });
  }
}
