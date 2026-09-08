/**
 * Admissions: the tracker, the scholarship simulator and the cost calculator.
 *
 * The three interfaces that turn an admissions page from a description of a
 * process into a demonstration of one. None of them has a back end, none of
 * them submits anything, and all three say so on screen — which is not
 * boilerplate but a design constraint: a simulator that looks like a
 * resolution is worse than no simulator, and a family that mistakes an
 * estimate for a quotation has been misled by the interface, not by the
 * disclaimer they did not read.
 *
 * The numbers come from JSON islands written by the build, so the browser and
 * the server compute from the same figures and the printed page cannot
 * disagree with the calculated one.
 */

import { $, $$, lempiras, store, toast } from "./dom.js";

/* ------------------------------------------------------------- the tracker */

/**
 * The application checklist.
 *
 * Progress is derived from what is ticked — never stored as a number — so the
 * bar cannot drift from the boxes. The state persists per browser, which is
 * exactly what a real applicant portal does between sessions.
 */
function initChecklist() {
  const root = $("[data-checklist]");
  if (!root) return;

  const boxes = $$('input[type="checkbox"]', root);
  const fill = $("[data-checklist-fill]", root);
  const pct = $("[data-checklist-pct]", root);
  const status = $("[data-checklist-status]", root);

  const saved = store.get("checklist");
  if (saved) {
    const done = new Set(saved.split(","));
    for (const box of boxes) box.checked = done.has(box.value);
  }

  function update(announce) {
    const done = boxes.filter((box) => box.checked);
    const percent = Math.round((done.length / boxes.length) * 100);

    if (fill) fill.style.width = `${percent}%`;
    if (pct) pct.textContent = `${percent}%`;
    if (status) {
      status.textContent =
        `${done.length} de ${boxes.length} pasos completados · ${percent}% de la solicitud`;
    }

    root.setAttribute("data-progress", String(percent));
    if (announce) store.set("checklist", done.map((box) => box.value).join(","));
  }

  for (const box of boxes) box.addEventListener("change", () => update(true));
  update(false);
}

/* ------------------------------------------------------ scholarship simulator */

/**
 * What the simulator is allowed to say.
 *
 * It reports which programmes a profile could *apply* to. It does not score,
 * it does not rank, it does not reserve and it does not estimate a
 * probability, because none of those would be true and all of them would be
 * believed. The criteria are coarse for the same reason.
 */
function initScholarships() {
  const form = $("[data-scholarship-form]");
  if (!form) return;

  const island = document.getElementById("au-scholarships");
  if (!island) return;

  let rules = [];
  try {
    rules = JSON.parse(island.textContent);
  } catch {
    return;
  }

  const output = $("[data-scholarship-result]");
  const headline = $("[data-scholarship-headline]");
  const detail = $("[data-scholarship-detail]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const grade = Number(data.get("promedio"));
    const activity = String(data.get("actividad") ?? "ninguna");
    const need = String(data.get("necesidad") ?? "baja");

    if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
      toast("Ingresa un promedio entre 0 y 100.");
      return;
    }

    const matched = rules.filter((rule) => {
      if (grade < rule.grade) return false;

      if (rule.activity) {
        const allowed = Array.isArray(rule.activity) ? rule.activity : [rule.activity];
        if (!allowed.includes(activity)) return false;
      }

      if (rule.need && !rule.need.includes(need)) return false;
      return true;
    });

    const ids = new Set(matched.map((rule) => rule.id));
    for (const card of $$("[data-scholarship]")) {
      card.dataset.match = ids.has(card.dataset.scholarship) ? "yes" : "no";
    }

    if (headline) {
      headline.textContent =
        matched.length === 0
          ? "Ninguna coincidencia con este perfil"
          : matched.length === 1
            ? "Podrías aplicar a 1 programa de becas"
            : `Podrías aplicar a ${matched.length} programas de becas`;
    }

    if (detail) {
      detail.textContent = matched.length
        ? `Coinciden: ${matched.map((rule) => rule.name).join(", ")}. Aplicar no garantiza la beca: la resolución la emite Bienestar Estudiantil tras revisar el expediente completo.`
        : "Con un promedio o un perfil distinto podrían abrirse otras opciones. Bienestar Estudiantil revisa casos particulares fuera de estos criterios.";
    }

    if (output) {
      output.hidden = false;
      output.focus?.();
    }

    toast(
      matched.length
        ? `Simulación completada: ${matched.length} programa(s) compatibles.`
        : "Simulación completada: sin coincidencias con este perfil.",
    );
  });

  form.addEventListener("reset", () => {
    for (const card of $$("[data-scholarship]")) delete card.dataset.match;
    if (output) output.hidden = true;
  });
}

/* -------------------------------------------------------- cost calculator */

/**
 * The tuition estimate.
 *
 * Two pricing models, because AUREA genuinely has two: educación media is
 * charged monthly and educación superior per course. Rather than average them
 * into one misleading figure, the calculator switches its own controls when
 * the programme changes — the number of courses disappears for a bachillerato,
 * and the number of monthly instalments appears.
 *
 * Order of operations matters and is fixed here: the scholarship reduces
 * tuition only (never the fees, which is how a real institution applies it),
 * and the payment plan adjusts the resulting total.
 */
function initCalculator() {
  const form = $("[data-cost-form]");
  if (!form) return;

  const island = document.getElementById("au-costs");
  if (!island) return;

  let data;
  try {
    data = JSON.parse(island.textContent);
  } catch {
    return;
  }

  const rows = $("[data-cost-rows]");
  const total = $("[data-cost-total]");
  const monthly = $("[data-cost-monthly]");
  const courseField = $("[data-cost-courses-field]");
  const programSelect = $('[name="programa"]', form);

  function currentProgram() {
    return data.programs[programSelect?.value] ?? Object.values(data.programs)[0];
  }

  function syncControls() {
    const program = currentProgram();
    if (courseField) courseField.hidden = program.kind !== "asignatura";
  }

  function compute() {
    const program = currentProgram();
    const form_ = new FormData(form);

    const courses = Math.max(1, Math.min(8, Number(form_.get("asignaturas")) || program.coursesTypical || 5));
    const discount = data.fees.discounts.find((entry) => entry.id === form_.get("beca")) ?? data.fees.discounts[0];
    const plan = data.fees.plans.find((entry) => entry.id === form_.get("plan")) ?? data.fees.plans[1];

    /* Tuition — the part a scholarship reduces. */
    const tuition =
      program.kind === "asignatura"
        ? program.perCourse * courses
        : program.monthly * program.months;

    const tuitionLabel =
      program.kind === "asignatura"
        ? `Asignaturas · ${courses} × ${lempiras(program.perCourse)}`
        : `Mensualidades · ${program.months} × ${lempiras(program.monthly)}`;

    /* Fees — never discounted. Laboratory only where the programme has one. */
    const extras = data.fees.extras.filter(
      (extra) => extra.id !== "graduacion" && (extra.id !== "laboratorio" || program.lab),
    );
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.amount, 0);

    const scholarship = Math.round(tuition * discount.rate);
    const subtotal = program.enrollment + tuition - scholarship + extrasTotal;
    const adjustment = Math.round(subtotal * plan.modifier);
    const grandTotal = subtotal + adjustment;

    const instalments = program.kind === "asignatura" ? 5 : program.months;

    if (rows) {
      const lines = [
        ["Matrícula del período", lempiras(program.enrollment)],
        [tuitionLabel, lempiras(tuition)],
      ];

      if (scholarship > 0) lines.push([`Beca aplicada · ${discount.label}`, `− ${lempiras(scholarship)}`]);
      for (const extra of extras) lines.push([extra.label, lempiras(extra.amount)]);
      if (adjustment !== 0) {
        lines.push([plan.label, `${adjustment > 0 ? "+ " : "− "}${lempiras(Math.abs(adjustment))}`]);
      }

      rows.innerHTML = lines
        .map(
          ([label, value]) =>
            `<div class="au-result__row"><dt>${label}</dt><dd>${value}</dd></div>`,
        )
        .join("");
    }

    if (total) total.textContent = lempiras(grandTotal);
    if (monthly) {
      monthly.textContent = `${lempiras(Math.round(grandTotal / instalments))} × ${instalments} cuotas`;
    }
  }

  programSelect?.addEventListener("change", () => {
    syncControls();
    compute();
  });

  for (const control of $$("select, input", form)) {
    control.addEventListener("change", compute);
    control.addEventListener("input", compute);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    toast("Solicitud de información registrada en la demo. No se envió nada.");
  });

  syncControls();
  compute();
}

export function initAdmissions() {
  initChecklist();
  initScholarships();
  initCalculator();
}
