/**
 * The guided demonstration.
 *
 * Twelve to eighteen seconds that drive the whole workflow without the visitor
 * touching anything: choose the process, read the attachment, apply what it
 * found, submit, authorise twice, and end on the generated document.
 *
 * Two rules govern it. It narrates what is happening — a sequence that moves on
 * its own without saying why is a screensaver — and it never takes the controls
 * away: pause and exit are on screen the whole time, Escape ends it, and the
 * visitor clicking anything themselves is not blocked at any point.
 */

/* The whole script is budgeted at twelve to eighteen seconds. Most of that is
   the processing sequence, which has to run at its own honest pace; the waits
   around it are the slack, and they are deliberately tight — a guided demo that
   outlasts a prospect's patience has demonstrated the wrong thing. */
const step = (label, text, action) => ({ label, text, action });

export function createTour({ engine, form, capture, toast, clock }) {
  const bar = document.querySelector("[data-wf-guidebar]");
  const stepLabel = document.querySelector("[data-wf-guide-step]");
  const stepText = document.querySelector("[data-wf-guide-text]");
  const pauseButton = document.querySelector("[data-wf-guide-pause]");
  const skipButton = document.querySelector("[data-wf-guide-skip]");

  let running = false;

  const scrollTo = (selector) =>
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const say = (index, total, label, text) => {
    if (stepLabel) stepLabel.textContent = `Paso ${index} de ${total} · ${label}`;
    if (stepText) stepText.textContent = text;
  };

  /**
   * The script.
   *
   * Each beat does one thing a person would do, and the engine does the rest —
   * the tour has no privileged access, it presses the same buttons.
   */
  const script = [
    step("Proceso", "Elegimos «Solicitud de compra»: el único de los seis con el flujo completo.", async () => {
      scrollTo("#proceso");
      await clock.sleep(800);
    }),

    step("Captura", "El asistente lee el adjunto y propone los campos que puede completar.", async () => {
      scrollTo("#solicitud");
      await clock.sleep(400);
      await capture.scan();
      await clock.sleep(300);
    }),

    step("Formulario", "Aplicamos la información extraída: proveedor, concepto y monto.", async () => {
      capture.use();
      await clock.sleep(700);
    }),

    step("Automatización", "Enviamos la solicitud. El motor valida, aplica la regla de monto y asigna.", async () => {
      await engine.run(form.read());
      await clock.sleep(200);
    }),

    step("Aprobación", "Administración autoriza. La decisión queda registrada con hora y comentario.", async () => {
      scrollTo("#seguimiento");
      await clock.sleep(500);
      await engine.decide("aprobada");
      await clock.sleep(900);
    }),

    step("Aprobación", "Finanzas autoriza. Con esto la solicitud completa su circuito.", async () => {
      await engine.decide("aprobada");
      await clock.sleep(1900);
    }),

    step("Cierre", "Documento generado, notificación preparada y expediente archivado.", async () => {
      await clock.sleep(600);
    }),
  ];

  async function play() {
    running = true;
    document.body.dataset.tour = "running";
    bar?.classList.add("is-open");
    if (pauseButton) pauseButton.textContent = "Pausar";

    try {
      for (const [index, beat] of script.entries()) {
        say(index + 1, script.length, beat.label, beat.text);
        await beat.action();
      }

      say(script.length, script.length, "Fin", "El expediente quedó cerrado y trazable de principio a fin.");
      await clock.sleep(1500);
      stop({ quiet: true });
      toast("Demo guiada completada. Puede reiniciarla desde la barra superior.");
    } catch {
      /* `clock.cancel()` rejects whatever was pending — that is the exit path
         for pressing Salir, and there is nothing to report about it. */
    }
  }

  function stop({ quiet = false } = {}) {
    if (!running) return;
    running = false;
    clock.cancel();
    clock.reset();
    document.body.removeAttribute("data-tour");
    bar?.classList.remove("is-open");
    if (!quiet) toast("Demo guiada interrumpida. Puede continuar manualmente.");
  }

  function start() {
    if (running) return;
    clock.reset();
    void play();
  }

  pauseButton?.addEventListener("click", () => {
    if (!running) return;
    if (clock.paused) {
      clock.resume();
      pauseButton.textContent = "Pausar";
    } else {
      clock.pause();
      pauseButton.textContent = "Reanudar";
    }
  });

  skipButton?.addEventListener("click", () => stop());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && running) stop();
  });

  return { start, stop, get running() { return running; } };
}
