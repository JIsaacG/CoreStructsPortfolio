import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { iniciarRecorrido } from './world';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger);

const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll suave sincronizado con ScrollTrigger: un único control de scroll.
if (!movimientoReducido) {
  const lenis = new Lenis({ autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;
}

// Entradas al hacer scroll con IntersectionObserver.
const revelar = new IntersectionObserver(
  (entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.add('is-in');
      revelar.unobserve(entrada.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px' },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revelar.observe(el));

// Recorrido por la casa.
const recorrido = document.querySelector<HTMLElement>('[data-recorrido]');
if (recorrido) iniciarRecorrido(recorrido, movimientoReducido);

// Frase principal: cada palabra pasa del tono apagado al pleno, una a una y en orden de lectura.
document.querySelectorAll<HTMLElement>('[data-palabras]').forEach((bloque) => {
  const palabras = [...bloque.querySelectorAll<HTMLElement>('[data-palabra]')];
  if (movimientoReducido) {
    palabras.forEach((p) => p.classList.add('is-lit'));
    return;
  }
  ScrollTrigger.create({
    trigger: bloque,
    start: 'top 80%',
    end: 'bottom 45%',
    onUpdate: (self) => {
      const encendidas = Math.round(self.progress * palabras.length);
      palabras.forEach((p, i) => p.classList.toggle('is-lit', i < encendidas));
    },
  });
});
