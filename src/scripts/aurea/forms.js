/**
 * The simulated actions: the visit booking, the contact form, the downloads
 * and the meeting request.
 *
 * Every one of them is a demonstration of a flow that a real deployment would
 * wire to a back end, and every one of them is explicit about it. The rule
 * this file follows, without exception:
 *
 *   NOTHING IS SENT, NOTHING IS STORED, AND THE CONFIRMATION SAYS SO.
 *
 * A demo that shows “¡Gracias! Te contactaremos pronto” has told the visitor
 * something untrue about a message that went nowhere. The confirmations here
 * name the fiction in the same breath as the success, which is both honest and
 * — for a portfolio piece — the more persuasive of the two options, because it
 * shows the flow *and* the judgement.
 */

import { $, $$, toast } from "./dom.js";

/* -------------------------------------------------------------- the visit */

/**
 * Schedule a campus visit.
 *
 * The one form with real logic behind it: Saturday has a shorter list of
 * times, and the control enforces it rather than explaining it in fine print.
 * That is the difference between a mock-up of a booking form and a
 * demonstration of one.
 */
function initVisit() {
  const form = $("[data-visit-form]");
  if (!form) return;

  const date = $('[name="fecha"]', form);
  const time = $('[name="horario"]', form);
  const confirmation = $("[data-visit-confirm]");
  const summary = $("[data-visit-summary]");

  const weekday = JSON.parse(form.dataset.slots ?? "[]");
  const saturday = JSON.parse(form.dataset.slotsSat ?? "[]");

  function syncSlots() {
    if (!date?.value || !time) return;

    const [year, month, day] = date.value.split("-").map(Number);
    const dow = new Date(year, month - 1, day).getDay();

    if (dow === 0) {
      time.innerHTML = '<option value="">Domingo: sin visitas</option>';
      time.disabled = true;
      return;
    }

    const slots = dow === 6 ? saturday : weekday;
    const chosen = time.value;
    time.disabled = false;
    time.innerHTML = slots
      .map((slot) => `<option value="${slot}"${slot === chosen ? " selected" : ""}>${slot}</option>`)
      .join("");
  }

  date?.addEventListener("change", syncSlots);
  syncSlots();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    if (!data.get("fecha") || !data.get("horario")) {
      toast("Elige una fecha y un horario disponibles.");
      return;
    }

    const kindLabel =
      form.querySelector(`[name="tipo"]:checked`)?.closest("label")?.textContent.trim() ?? "Visita";

    if (summary) {
      summary.innerHTML = [
        ["Tipo de visita", kindLabel],
        ["Fecha", String(data.get("fecha"))],
        ["Horario", String(data.get("horario"))],
        ["Visitantes", String(data.get("visitantes") ?? "—")],
        ["Contacto", String(data.get("correo") ?? "—")],
      ]
        .map(([label, value]) => `<div class="au-result__row"><dt>${label}</dt><dd>${value}</dd></div>`)
        .join("");
    }

    if (confirmation) {
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.hidden = true;
    toast("Visita reservada en la demostración. No se envió ninguna solicitud.");
  });

  $("[data-visit-again]")?.addEventListener("click", () => {
    if (confirmation) confirmation.hidden = true;
    form.hidden = false;
    form.reset();
    syncSlots();
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ------------------------------------------------------------ every other */

/**
 * The generic demo form.
 *
 * Any `<form data-demo-form="…">` gets the same treatment: native validation
 * runs first, then the action is acknowledged through the live region and the
 * form is reset. The message is per-form, so “solicitud enviada” never appears
 * on a form that requests a brochure.
 */
function initDemoForms() {
  for (const form of $$("[data-demo-form]")) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      toast(form.dataset.demoForm);
      form.reset();

      const echo = $(`#${form.dataset.echo}`);
      if (echo) echo.hidden = false;
    });
  }
}

/* --------------------------------------------------------------- downloads */

/**
 * Simulated downloads.
 *
 * The document centre lists eighteen documents and the programme pages offer a
 * plan of study each. Shipping twenty-seven invented PDFs to make the buttons
 * work would add megabytes to a demonstration, so the button generates a short
 * text file that names the document and states what it is. The interface says
 * “descarga simulada” before the click, so nobody is surprised by what arrives.
 */
function initDownloads() {
  for (const button of $$("[data-download]")) {
    button.addEventListener("click", () => {
      const title = button.dataset.download;
      const note = button.dataset.downloadNote ?? "";

      const body = [
        `${title}`,
        "",
        "Documento demostrativo del portal AUREA.",
        "",
        "AUREA es una institución educativa ficticia creada como demostración",
        "de portafolio. Este archivo no contiene información académica real y",
        "no sustituye a ningún documento oficial.",
        note ? `\n${note}` : "",
        "",
        `Generado el ${new Date().toLocaleDateString("es-HN")}.`,
      ].join("\n");

      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.txt`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast(`Descarga simulada: ${title}.`);
    });
  }
}

export function initForms() {
  initVisit();
  initDemoForms();
  initDownloads();
}
