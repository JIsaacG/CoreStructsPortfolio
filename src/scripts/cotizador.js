/**
 * El panel de cotización, en dos piezas: esta y la que hace el trabajo.
 *
 * El panel entero —marcado, copia en dos idiomas, validación, el gesto de
 * arrastre del móvil, el envío a WhatsApp y la copia al endpoint— son 22 KB de
 * `cotizador-panel.js`. Eran, hasta este archivo, 22 KB que se descargaban,
 * se parseaban y se ejecutaban en las 292 páginas del sitio, en cada visita,
 * antes de que nadie hubiera pulsado nada. La inmensa mayoría de las visitas no
 * abre el panel nunca, y todas lo pagaban igual.
 *
 * Este archivo ocupa su lugar en el `<script>` de esas 292 páginas —la ruta no
 * cambia, y por eso no hubo que tocar ni una— y no hace más que esperar. El
 * panel llega por `import()` dinámico cuando de verdad hace falta:
 *
 *   · en cuanto el navegador está ocioso, que en la práctica es medio segundo
 *     después de pintar la página. Para cuando alguien lea el hero, baje y
 *     pulse "Hablemos", el módulo lleva rato listo y el panel abre igual de
 *     instantáneo que antes.
 *   · al primer clic, si ese clic llega antes que el ocio —un visitante que
 *     entra directo al botón—. Entonces sí se espera la descarga, y son 8 KB
 *     comprimidos contra un servidor que ya está caliente.
 *   · de inmediato si la URL trae `#cotizar`, que es el enlace que abre el
 *     formulario al llegar y no puede quedarse esperando a nada.
 *
 * El reparto de responsabilidades después de la carga es la parte delicada. El
 * panel trae su propio listener de clic sobre `document` —así se integra en las
 * páginas sin markup por página—, de modo que en cuanto se evalúa hay dos
 * escuchando lo mismo. `loaded` es lo que evita que ambos contesten: desde ese
 * momento este se aparta y deja pasar el evento al del panel, que es el que
 * manda. No se desengancha el listener, se vuelve transparente — quitarlo
 * dejaría un hueco entre la carga y el siguiente evento.
 */

/* La misma definición que usa el panel, palabra por palabra. Está duplicada a
   sabiendas: importarla de allí obligaría a descargar el módulo entero para
   saber qué es un disparador, que es justo lo que este archivo existe para no
   hacer. Si una cambia, la otra cambia con ella. */
const TRIGGER = '[data-cotizador], a[href*="/#contacto"]';

/** La promesa de la descarga, creada una sola vez por mucho que se pida. */
let loading = null;
/** El módulo ya evaluado: a partir de aquí, él escucha y este calla. */
let loaded = null;

function load() {
  loading ??= import("./cotizador-panel.js").then((module) => {
    loaded = module;
    return module;
  });
  return loading;
}

/**
 * Un clic anterior a la carga se atiende aquí y se abre en cuanto llegue el
 * módulo. Solo el último cuenta: entre el clic y la descarga caben más clics
 * —un botón que no responde se pulsa otra vez, es lo que hace cualquiera—, y
 * `open()` llamado dos veces guarda el `overflow` del documento cuando ya lo
 * había puesto en `hidden`, así que al cerrar el panel la página se quedaría
 * sin poder desplazarse. Un solo hueco para el trigger pendiente, y una sola
 * apertura por descarga.
 */
let queued = null;

function openWhenReady(trigger) {
  const first = queued === null;
  queued = trigger;
  if (!first) return;

  load().then((module) => {
    const target = queued;
    queued = null;
    module.open(target);
  });
}

document.addEventListener("click", (event) => {
  /* Ya está el panel en pie: su propio listener atiende este mismo evento. */
  if (loaded) return;

  const trigger = event.target.closest?.(TRIGGER);
  if (!trigger) return;
  /* Las mismas excepciones que hace el panel: un clic con modificador es
     alguien pidiendo una pestaña nueva, y eso es cosa del enlace. */
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

  event.preventDefault();
  openWhenReady(trigger);
});

/* `#cotizar` abre el formulario nada más llegar —lo usan los demos, un anuncio
   o un QR para entrar directo a la cotización—. Eso lo resuelve el propio panel
   al evaluarse; lo único que hace falta aquí es no hacerle esperar al ocio. */
if (window.location.hash === "#cotizar") {
  load();
} else {
  /* `requestIdleCallback` es el momento exacto que se busca: el navegador avisa
     cuando terminó de pintar y no tiene nada mejor que hacer. Safari todavía no
     lo trae, y ahí el temporizador hace de sustituto — más tosco, pero cae bien
     pasado el primer pintado, que es lo único que importa. */
  const idle =
    window.requestIdleCallback ?? ((task) => window.setTimeout(task, 1200));
  idle(() => load(), { timeout: 3000 });
}
