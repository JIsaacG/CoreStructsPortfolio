/**
 * The guided demonstration.
 *
 * It drives the whole workflow without the visitor touching anything — choose
 * the process, read the attachment, apply what it found, submit, authorise
 * twice, and end on the generated document — and after each thing it does, it
 * stops and says what that just bought the organisation.
 *
 * The pause is the point. An earlier version narrated only the mechanism and
 * ran in sixteen seconds, which demonstrated a competent piece of software to
 * somebody who still did not know why they would want it. Every beat now
 * carries two lines: what is happening, and what work it replaces. The second
 * one needs to be read, so the beat holds after its action instead of moving
 * on, and the hold is sized to the sentence rather than being a flat delay.
 *
 * Three rules govern it. It never takes the controls away — pause, skip-ahead
 * and exit are on screen the whole time and Escape ends it. It never blocks the
 * visitor from clicking things themselves. And because the pauses make it
 * roughly twice as long as it was, it shows how far along it is, so nobody is
 * waiting on a sequence whose end they cannot see.
 */

const step = ({ label, text, gain, hold = 3400, action }) => ({ label, text, gain, hold, action });

export function createTour({ engine, form, capture, toast, clock }) {
  const bar = document.querySelector("[data-wf-guidebar]");
  const stepLabel = document.querySelector("[data-wf-guide-step]");
  const stepText = document.querySelector("[data-wf-guide-text]");
  const stepGain = document.querySelector("[data-wf-guide-gain]");
  const progress = document.querySelector("[data-wf-guide-progress]");
  const pauseButton = document.querySelector("[data-wf-guide-pause]");
  const nextButton = document.querySelector("[data-wf-guide-next]");
  const skipButton = document.querySelector("[data-wf-guide-skip]");

  let running = false;

  const scrollTo = (selector) =>
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const say = (index, total, beat) => {
    if (stepLabel) stepLabel.textContent = `Paso ${index} de ${total} · ${beat.label}`;
    if (stepText) stepText.textContent = beat.text;
    if (stepGain) {
      stepGain.textContent = beat.gain ?? "";
      stepGain.hidden = !beat.gain;
    }
    if (progress) progress.style.width = `${(index / total) * 100}%`;
  };

  /**
   * The pause between beats, which is the part a visitor actually controls.
   *
   * Counted out in short ticks instead of one long sleep, and that is not
   * incidental. `clock.pause()` only defers sleeps that have not started yet —
   * a timer already running keeps running — so a four-second hold implemented
   * as a single sleep would ignore `Pausar` and advance a whole beat anyway,
   * which is precisely when somebody presses it. Ticking means the hold stalls
   * on the next tick and resumes exactly where it stopped.
   *
   * `Siguiente` sets a flag rather than resolving a promise, so it also works
   * while a beat's action is still running: the request is remembered and the
   * hold that follows is skipped instead of the press doing nothing.
   */
  const TICK = 120;
  let skipRequested = false;

  const setNextEnabled = (enabled) => {
    if (nextButton) nextButton.disabled = !enabled;
  };

  async function hold(ms) {
    setNextEnabled(true);
    try {
      for (let left = ms; left > 0 && !skipRequested; left -= TICK) {
        await clock.sleep(Math.min(TICK, left));
      }
    } finally {
      skipRequested = false;
      setNextEnabled(false);
    }
  }

  /**
   * The script.
   *
   * Each beat does one thing a person would do and the engine does the rest —
   * the tour has no privileged access, it presses the same buttons — and then
   * names the errand that thing deletes. The `gain` lines are deliberately
   * about the organisation rather than about the software: nobody buys a
   * routing engine, they buy not having to chase a signature.
   */
  const script = [
    step({
      label: "Proceso",
      text: "Elegimos «Solicitud de compra»: el único de los seis con el flujo completo.",
      gain:
        "Un solo motor corre los seis. Añadir un proceso nuevo es escribir su definición, " +
        "no comprar otro sistema ni formar otra vez a nadie.",
      hold: 4200,
      action: async () => {
        scrollTo("#proceso");
        await clock.sleep(800);
      },
    }),

    step({
      label: "Captura",
      text: "El asistente lee el adjunto y propone los campos que puede completar.",
      gain:
        "Los datos entran una sola vez, desde el documento que ya existía. Menos tecleo y, " +
        "sobre todo, menos erratas que corregir tres pasos después.",
      hold: 4200,
      action: async () => {
        scrollTo("#solicitud");
        await clock.sleep(400);
        await capture.scan();
        await clock.sleep(300);
      },
    }),

    step({
      label: "Formulario",
      text: "Aplicamos lo extraído. El monto reescribe la ruta de autorización al instante.",
      gain:
        "La política de la institución vive en la regla, no en la memoria de quien lleva más " +
        "años. Nadie tiene que recordar quién firma cada tramo.",
      hold: 4400,
      action: async () => {
        capture.use();
        await clock.sleep(700);
      },
    }),

    step({
      label: "Automatización",
      text: "Ejecutamos. El motor valida, aplica la regla de monto y asigna responsables.",
      gain:
        "Lo que era una ronda de correos hasta dar con el responsable ocurre antes de que " +
        "nadie abra el expediente.",
      hold: 4000,
      action: async () => {
        await engine.run(form.read());
        await clock.sleep(200);
      },
    }),

    step({
      label: "Aprobación",
      text: "Administración autoriza. La decisión queda registrada con hora y comentario.",
      gain:
        "Cada visto bueno deja constancia. Una auditoría deja de ser una excavación en " +
        "bandejas de correo de hace ocho meses.",
      hold: 4200,
      action: async () => {
        scrollTo("#seguimiento");
        await clock.sleep(500);
        await engine.decide("aprobada");
        await clock.sleep(900);
      },
    }),

    step({
      label: "Aprobación",
      text: "Finanzas autoriza. Con esto la solicitud completa su circuito.",
      gain:
        "El expediente siempre sabe de quién es el turno y cuánto lleva ahí, así que una " +
        "solicitud no se queda parada sin que nadie lo note.",
      hold: 4200,
      action: async () => {
        await engine.decide("aprobada");
        await clock.sleep(1900);
      },
    }),

    step({
      label: "Cierre",
      text: "Documento generado, notificación preparada y expediente archivado.",
      gain:
        "El documento final sale con sus firmas y su código de verificación. Nadie vuelve a " +
        "teclear lo mismo en un formato aparte para dejarlo por escrito.",
      hold: 4600,
      action: async () => {
        await clock.sleep(600);
      },
    }),

    step({
      label: "Fin",
      text: "El expediente quedó cerrado y trazable de principio a fin.",
      gain:
        "Dos autorizaciones con constancia, un documento generado, diez asientos de bitácora " +
        "y cero correos que perseguir. Puede repetirlo usted mismo con otro monto.",
      hold: 4400,
      action: async () => {},
    }),
  ];

  /* A tour that was exited while paused leaves its loop parked on a wait that
     `clock.cancel()` never settles. Harmless on its own, but if the visitor
     then starts the tour again and the old loop ever woke, two scripts would be
     pressing the same buttons. The token makes the stale one stand down. */
  let generation = 0;

  async function play() {
    const mine = ++generation;
    running = true;
    skipRequested = false;
    document.body.dataset.tour = "running";
    bar?.classList.add("is-open");
    if (pauseButton) pauseButton.textContent = "Pausar";
    setNextEnabled(false);

    try {
      for (const [index, beat] of script.entries()) {
        if (mine !== generation) return;
        say(index + 1, script.length, beat);
        await beat.action();
        if (mine !== generation) return;
        /* The hold comes after the action, so the sentence about what it bought
           lands on a screen that is already showing the result. */
        await hold(beat.hold);
      }
      if (mine !== generation) return;

      stop({ quiet: true });
      toast("Demo guiada completada. Puede repetirla desde la barra superior.");
    } catch {
      /* `clock.cancel()` rejects whatever was pending — that is the exit path
         for pressing Salir, and there is nothing to report about it. */
    }
  }

  function stop({ quiet = false } = {}) {
    if (!running) return;
    running = false;
    generation += 1;
    skipRequested = false;
    setNextEnabled(false);
    clock.cancel();
    clock.reset();
    document.body.removeAttribute("data-tour");
    bar?.classList.remove("is-open");
    if (progress) progress.style.width = "0%";
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

  /* Skipping ahead resumes first: a paused clock would swallow the next beat's
     own waits and the tour would look like it had frozen on the following step. */
  nextButton?.addEventListener("click", () => {
    if (!running) return;
    if (clock.paused) {
      clock.resume();
      if (pauseButton) pauseButton.textContent = "Pausar";
    }
    skipRequested = true;
  });

  skipButton?.addEventListener("click", () => stop());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && running) stop();
  });

  return { start, stop, get running() { return running; } };
}
