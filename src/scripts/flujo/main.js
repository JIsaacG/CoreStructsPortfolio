/**
 * Entry point for the Flujo demo.
 *
 * Both kinds of page load this one module. Each initialiser looks for its own
 * markup and returns immediately when the page does not have it, which is why
 * the fifteen request files can share a bundle with the module page without
 * paying for the workflow engine they have no use for.
 *
 * Nothing here supplies content. The register, the rules, the targets, the
 * trail and the document are all in the HTML before this runs; these modules
 * make a page that already reads into a page you can drive.
 */

import { createEngine } from "./engine.js";
import { initCapture, initForm } from "./form.js";
import { clear, load, save } from "./state.js";
import { createTour } from "./tour.js";
import {
  initChooser,
  initDialogs,
  initDocumentActions,
  initRegister,
  initReset,
  initTabs,
  initToast,
} from "./ui.js";

const toast = initToast();
const showTab = initTabs();
const openDialog = initDialogs();

initRegister();
initDocumentActions(toast);
initChooser({ openDialog, toast });

/* One value that would be wrong the moment the year turned. */
for (const year of document.querySelectorAll("[data-current-year]")) {
  year.textContent = String(new Date().getFullYear());
}

/* ------------------------------------------------------------ the engine */

/* Only the module page carries a workflow. The request files stop here. */
const formElement = document.querySelector("[data-wf-form]");

if (formElement) {
  const state = load();

  initReset({ clear });

  const engine = createEngine({
    root: document,
    state,
    save,
    toast,
    showTab,
  });

  const form = initForm(formElement, {
    onSubmit: (request) => void engine.run(request),
  });

  const capture = initCapture(document.querySelector("[data-wf-capture]"), {
    fill: form.fill,
    toast,
  });

  /* A visitor coming back mid-workflow is put back where they were, without
     replaying seven seconds of processing they have already watched. */
  const restored = engine.restore();
  if (restored) {
    toast("Se restauró la solicitud de esta demostración desde su navegador.");
  }

  const tour = createTour({ engine, form, capture, toast, clock: engine.clock });

  /* The tour drives the workflow from an empty form. Asked for one on a page
     that already holds a finished request, it clears the dataset and reloads —
     and leaves a note to itself, so the tour starts on the clean page rather
     than making the visitor press the button a second time. */
  const RESUME = "flujo:tour";

  const startFresh = () => {
    try {
      sessionStorage.setItem(RESUME, "1");
    } catch {
      /* Without session storage the reload simply lands on a clean page and the
         visitor presses the button again: a worse first second, not a failure. */
    }
    clear();
    location.reload();
  };

  for (const trigger of document.querySelectorAll("[data-wf-tour]")) {
    trigger.addEventListener("click", () => {
      if (restored || state.request) startFresh();
      else tour.start();
    });
  }

  try {
    if (sessionStorage.getItem(RESUME)) {
      sessionStorage.removeItem(RESUME);
      tour.start();
    }
  } catch {
    /* Nothing pending, because nothing could have been stored. */
  }
}
