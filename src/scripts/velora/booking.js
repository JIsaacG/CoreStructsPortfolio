/**
 * Velora — the booking widget.
 *
 * Four steps over one set of native radio groups. The script owns three things
 * and nothing else: which panel is showing, what the summary says, and which
 * time slots are free on the selected day. Selection, keyboard navigation and
 * grouping all belong to the radio inputs themselves.
 *
 * Availability travels in the markup (`data-taken` on each day) rather than in
 * a second copy of the data file, so the page ships one source of truth for it.
 */

const STEPS = 4;
/* Long enough to see the choice register, short enough not to feel like a wait. */
const ADVANCE_MS = 260;

const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function initBooking(root = document) {
  const widget = root.querySelector("[data-booking]");
  if (!widget) return;

  const panels = [...widget.querySelectorAll("[data-book-panel]")];
  const markers = [...widget.querySelectorAll("[data-book-step]")];
  const jumps = [...widget.querySelectorAll("[data-book-goto]")];
  const summary = widget.querySelector("[data-book-summary-value]");
  const next = widget.querySelector("[data-book-next]");
  const back = widget.querySelector("[data-book-back]");
  const done = widget.querySelector("[data-book-done]");
  const doneDetail = widget.querySelector("[data-book-done-detail]");
  const reset = widget.querySelector("[data-book-reset]");
  const slotInputs = [...widget.querySelectorAll("[data-book-input='slot']")];
  const empty = widget.querySelector("[data-book-empty]");

  let step = 1;
  let advanceTimer = 0;

  const chosen = (name) =>
    widget.querySelector(`[data-book-input='${name}']:checked`);

  /* --- Dates ------------------------------------------------------------------
     The seven chips are relative to whenever the page is opened, so the demo
     never shows a stale week. */
  const dates = [];
  for (const [index, label] of widget.querySelectorAll("[data-day]").entries()) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    dates.push(date);

    label.querySelector("[data-day-weekday]").textContent = WEEKDAYS[date.getDay()];
    label.querySelector("[data-day-number]").textContent = String(date.getDate());
  }

  const dayLabel = (index) => {
    const date = dates[index];
    if (!date) return "";
    return date.toLocaleDateString("es-HN", { weekday: "long", day: "numeric", month: "long" });
  };

  /* --- Availability ------------------------------------------------------------ */

  const takenFor = (dayIndex) => {
    const label = widget.querySelector(`[data-day='${dayIndex}']`);
    if (!label) return new Set();
    return new Set(
      (label.dataset.taken || "")
        .split(",")
        .filter(Boolean)
        .map(Number),
    );
  };

  function paintSlots() {
    const day = Number(chosen("day")?.value ?? 0);
    const taken = takenFor(day);
    let free = 0;

    slotInputs.forEach((input, index) => {
      const label = input.closest(".ve-option");
      const isTaken = taken.has(index);
      input.disabled = isTaken;
      label.toggleAttribute("data-taken", isTaken);
      if (isTaken && input.checked) input.checked = false;
      if (!isTaken) free++;
    });

    if (empty) empty.hidden = free > 0;
  }

  /* --- Summary ------------------------------------------------------------------ */

  function paintSummary() {
    const parts = [];
    const treatment = chosen("treatment");
    const professional = chosen("professional");
    const day = chosen("day");
    const slot = chosen("slot");

    if (treatment) parts.push(treatment.value);
    if (step >= 2 && professional) parts.push(professional.value);
    if (step >= 3 && day) parts.push(dayLabel(Number(day.value)));
    if (step >= 4 && slot) parts.push(`${slot.value} h`);

    summary.textContent = parts.length
      ? parts.join(" · ")
      : "Elige un tratamiento para empezar";
  }

  /* --- Steps --------------------------------------------------------------------- */

  function show(target, { focus = false } = {}) {
    step = Math.min(STEPS, Math.max(1, target));

    panels.forEach((panel) => {
      panel.classList.toggle("is-current", Number(panel.dataset.bookPanel) === step);
    });
    markers.forEach((marker) => {
      const index = Number(marker.dataset.bookStep);
      marker.classList.toggle("is-current", index === step);
      marker.classList.toggle("is-done", index < step);
    });

    back.hidden = step === 1;
    next.textContent = step === STEPS ? "Confirmar cita" : "Continuar";

    // Only the steps already answered are reachable from the rail.
    for (const button of jumps) {
      button.disabled = Number(button.dataset.bookGoto) >= step;
    }

    if (step === STEPS) paintSlots();
    paintSummary();

    // Moving forward should land the keyboard on the new choice, but only when
    // the move came from a control the user operated deliberately.
    if (focus) {
      const first = panels[step - 1].querySelector("input:not(:disabled)");
      first?.focus({ preventScroll: true });
    }
  }

  /* --- Wiring -------------------------------------------------------------------- */

  widget.addEventListener("change", (event) => {
    const input = event.target.closest("[data-book-input]");
    if (!input) return;

    if (input.dataset.bookInput === "day") paintSlots();
    paintSummary();

    // Picking an option is a decision; the widget takes the next step on its own
    // so the whole booking really is a handful of taps.
    if (step < STEPS && input.dataset.bookInput !== "slot") {
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => show(step + 1), ADVANCE_MS);
    }
  });

  next.addEventListener("click", () => {
    clearTimeout(advanceTimer);

    if (step < STEPS) {
      show(step + 1, { focus: true });
      return;
    }

    const slot = chosen("slot");
    if (!slot) {
      // Nothing chosen yet: say so where the answer would appear, rather than
      // failing silently.
      summary.textContent = "Elige un horario disponible para confirmar";
      panels[STEPS - 1].querySelector("input:not(:disabled)")?.focus({ preventScroll: true });
      return;
    }

    doneDetail.textContent = [
      chosen("treatment")?.value,
      chosen("professional")?.value,
      dayLabel(Number(chosen("day")?.value ?? 0)),
      `${slot.value} h`,
    ]
      .filter(Boolean)
      .join(" · ");

    done.hidden = false;
    done.setAttribute("tabindex", "-1");
    done.focus({ preventScroll: true });
  });

  back.addEventListener("click", () => {
    clearTimeout(advanceTimer);
    show(step - 1, { focus: true });
  });

  // A completed step on the rail is a way back to the choice it holds. It is a
  // real button rather than a click handler on the list item, so it is
  // reachable from the keyboard and disabled while it leads nowhere.
  for (const button of jumps) {
    button.addEventListener("click", () => {
      clearTimeout(advanceTimer);
      show(Number(button.dataset.bookGoto), { focus: true });
    });
  }

  reset.addEventListener("click", () => {
    done.hidden = true;
    show(3, { focus: true });
  });

  show(1);
}
