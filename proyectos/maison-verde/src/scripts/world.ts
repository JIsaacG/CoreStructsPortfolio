import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Clave = { y: number; v: number };

// Interpola un valor por tramos según la posición de scroll.
const porTramos = (y: number, claves: Clave[]) => {
  if (y <= claves[0].y) return claves[0].v;
  for (let i = 1; i < claves.length; i++) {
    const a = claves[i - 1];
    const b = claves[i];
    if (y <= b.y) return a.v + (b.v - a.v) * ((y - a.y) / (b.y - a.y || 1));
  }
  return claves[claves.length - 1].v;
};

const limitar = gsap.utils.clamp(0, 1);

// Recorrido por la casa: el scroll mueve el tiempo de los clips (o funde las fotos mientras el clip no ha cargado).
// `w` es la posición en el paseo: 0 en la primera parada, 1 en la segunda, 1.5 a medio camino hacia la tercera.
// El clip `i` lleva de la parada `i` a la `i + 1`; al pasar la última parada el video queda en su fotograma final.
export function iniciarRecorrido(seccion: HTMLElement, movimientoReducido: boolean) {
  const escenario = seccion.querySelector<HTMLElement>('[data-escenario]');
  if (!escenario) return;
  const paradas = [...seccion.querySelectorAll<HTMLElement>('[data-parada]')];
  const fotos = [...escenario.querySelectorAll<HTMLElement>('[data-foto]')];
  const enlaces = [...escenario.querySelectorAll<HTMLAnchorElement>('[data-ir]')];
  const relleno = escenario.querySelector<HTMLElement>('[data-riel]');
  const pista = escenario.querySelector<HTMLElement>('[data-pista]');
  const clips = [...escenario.querySelectorAll<HTMLVideoElement>('[data-clip]')];
  const ultima = paradas.length - 1;
  const focos = paradas.map((p) => Number(p.dataset.focus ?? 50));
  // En vertical se usan los pósters y clips 9:16, que ya vienen encuadrados para el teléfono.
  const vertical = window.matchMedia('(orientation: portrait)');

  // Cada parada llega cuando su artículo toca el borde superior.
  const marcas = paradas.map((parada) => ScrollTrigger.create({ trigger: parada, start: 'top top' }));
  const listo = clips.map(() => false);
  let actual = -1;
  let w = 0;
  let activo = 0;
  let mostrado = -1;
  let tiempo = 0;
  let pedidoEn = 0;

  const marcarActual = (indice: number) => {
    if (indice === actual) return;
    actual = indice;
    paradas.forEach((p, i) => p.classList.toggle('es-actual', i === indice));
    enlaces.forEach((a, i) => a.setAttribute('aria-current', String(i === indice)));
  };

  // El clip entra en cuanto su fotograma está pintado; si no ha cargado se ven las fotos.
  const mostrar = () => {
    if (mostrado !== activo) {
      mostrado = activo;
      clips.forEach((clip, i) => clip.classList.toggle('es-visible', i === activo));
    }
    escenario.dataset.modo = 'video';
  };

  // Una sola búsqueda en curso por video: la siguiente usa el tiempo más reciente.
  // WebKit a veces deja una búsqueda colgada varios segundos: pasados 400 ms se vuelve a pedir.
  const buscar = (clip: HTMLVideoElement) => {
    pedidoEn = performance.now();
    clip.currentTime = tiempo;
  };
  const sincronizar = () => {
    const clip = clips[activo];
    if (!clip || !listo[activo]) {
      delete escenario.dataset.modo;
      return;
    }
    if (clip.seeking) {
      if (performance.now() - pedidoEn > 400) buscar(clip);
      return;
    }
    if (Math.abs(clip.currentTime - tiempo) > 0.01) buscar(clip);
    else mostrar();
  };

  clips.forEach((clip, i) =>
    clip.addEventListener('seeked', () => {
      if (i !== activo) return;
      mostrar();
      sincronizar();
    }),
  );

  // Encuadre horizontal en pantallas estrechas, donde solo se ve la franja central del video.
  // En cada parada mira hacia el punto al que se acerca la cámara; a mitad del clip, cuando la
  // cámara ya lo centró, vuelve al centro; y llega a la siguiente parada con su propio encuadre.
  const clavesFoco = (fin: number) =>
    marcas.flatMap((m, i) => {
      const siguiente = i < ultima ? marcas[i + 1].start : fin;
      const clave = { y: m.start, v: focos[i] };
      return i < clips.length ? [clave, { y: m.start + (siguiente - m.start) * 0.55, v: 50 }] : [clave];
    });

  const pintar = (self: ScrollTrigger) => {
    const y = self.scroll();
    w = porTramos(y, [...marcas.map((m, i) => ({ y: m.start, v: i })), { y: self.end, v: paradas.length }]);
    const en = Math.min(w, ultima);

    marcarActual(Math.round(en));
    // Cerca de la parada (o en el tramo final, que no tiene clip) la cámara está detenida.
    const quieta = Math.abs(w - Math.round(en)) < 0.22 || w >= ultima;
    paradas[actual]?.classList.toggle('es-quieta', quieta);
    paradas.forEach((p, i) => { if (i !== actual) p.classList.remove('es-quieta'); });
    const foco = vertical.matches ? 50 : porTramos(y, clavesFoco(self.end));
    escenario.style.setProperty('--foco-x', `${foco}%`);
    escenario.style.setProperty('--avance', String(limitar(w * 1.5)));
    if (relleno) relleno.style.transform = `scaleY(${en / ultima})`;
    if (pista) pista.style.opacity = String(limitar(1 - w * 4));

    // Fotos (debajo de los clips): cada una aparece en la segunda mitad del tramo anterior.
    fotos.forEach((foto, i) => {
      foto.style.opacity = String(i === 0 ? 1 : limitar((w - i + 0.5) / 0.5));
      if (!movimientoReducido) foto.style.transform = `scale(${1 + 0.06 * limitar(w - i)})`;
    });

    if (!clips.length) return;
    activo = Math.min(clips.length - 1, Math.floor(w));
    const { duration } = clips[activo];
    if (listo[activo]) tiempo = Math.min((w - activo) * duration, duration - 0.05);
    sincronizar();
  };

  const tramo = ScrollTrigger.create({
    trigger: seccion,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: pintar,
    onRefresh: pintar,
  });
  pintar(tramo);

  // Con movimiento reducido o ahorro de datos se quedan las fotos.
  const ahorroDatos = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (!clips.length || movimientoReducido || ahorroDatos) return;

  // Los clips se cargan de uno en uno: primero el del tramo actual y luego el más cercano.
  const distancia = (i: number) => {
    if (i === activo) return -1;
    if (i > w) return i - w;
    return w - (i + 1) + 0.5;
  };
  const cola = clips.map((_, i) => i);
  const rutaDe = (clip: HTMLVideoElement) =>
    (vertical.matches ? clip.dataset.srcMovil : undefined) ?? clip.dataset.src ?? '';
  // Cada cambio de orientación abre una ronda nueva: lo que siga cargando de la anterior se descarta.
  let ronda = 0;

  const cargarSiguiente = async () => {
    const miRonda = ronda;
    cola.sort((a, b) => distancia(a) - distancia(b));
    const i = cola.shift();
    if (i === undefined) return;
    const clip = clips[i];
    const ruta = rutaDe(clip);
    clip.preload = 'auto';

    const cargar = (src: string) =>
      new Promise<boolean>((resolve) => {
        const bien = () => {
          clip.removeEventListener('error', mal);
          resolve(true);
        };
        const mal = () => {
          clip.removeEventListener('loadeddata', bien);
          resolve(false);
        };
        clip.addEventListener('loadeddata', bien, { once: true });
        clip.addEventListener('error', mal, { once: true });
        clip.src = src;
      });

    // El clip se descarga entero (blob) para que buscar fotogramas no dependa de la red.
    let origen = ruta;
    try {
      const respuesta = await fetch(ruta);
      if (!respuesta.ok) throw new Error(respuesta.statusText);
      const blob = await respuesta.blob();
      origen = URL.createObjectURL(new Blob([blob], { type: 'video/mp4' }));
    } catch {
      origen = ruta;
    }
    if (miRonda !== ronda) return;

    let ok = await cargar(origen);
    // Safari puede rechazar el video servido desde blob: (error 4) aunque sea video/mp4: se usa la
    // URL directa, que el servidor entrega con Content-Type video/mp4 y peticiones por rangos.
    if (!ok && origen.startsWith('blob:') && miRonda === ronda) {
      URL.revokeObjectURL(origen);
      ok = await cargar(ruta);
    }
    if (miRonda !== ronda) return;
    if (ok) {
      // iOS no pinta los fotogramas buscados hasta que el video se reprodujo una vez.
      await clip.play().catch(() => {});
      clip.pause();
      listo[i] = true;
      pintar(tramo);
    }
    cargarSiguiente();
  };

  // Al girar el teléfono cambia el formato: se vuelven a cargar los clips del formato nuevo.
  vertical.addEventListener('change', () => {
    ronda++;
    clips.forEach((clip, i) => {
      if (clip.src.startsWith('blob:')) URL.revokeObjectURL(clip.src);
      clip.classList.remove('es-visible');
      listo[i] = false;
    });
    mostrado = -1;
    cola.splice(0, cola.length, ...clips.map((_, i) => i));
    pintar(tramo);
    cargarSiguiente();
  });

  // Revisión periódica: termina las búsquedas pendientes aunque el usuario ya no haga scroll.
  window.setInterval(() => {
    if (listo[activo] && !document.hidden) sincronizar();
  }, 250);

  if (document.readyState === 'complete') cargarSiguiente();
  else window.addEventListener('load', cargarSiguiente, { once: true });
}
