// Contenido de la landing. Edificio, precios y asesora son de demostración:
// sustituir por datos confirmados del proyecto antes de publicar.
import entrada from '../assets/paseo/escena-1-entrada.webp';
import parking from '../assets/paseo/escena-2-parking.webp';
import living from '../assets/paseo/escena-3-living.webp';
import amenidades from '../assets/paseo/escena-4-amenidades.webp';
import apartamento from '../assets/paseo/escena-5-apartamento.webp';
import cocina from '../assets/paseo/escena-6-cocina.webp';
import bano from '../assets/paseo/escena-7-bano.webp';
import sala from '../assets/paseo/escena-8-sala.webp';
import terraza from '../assets/paseo/escena-9-terraza.webp';
import entradaMovil from '../assets/paseo/escena-1-entrada-movil.webp';
import parkingMovil from '../assets/paseo/escena-2-parking-movil.webp';
import livingMovil from '../assets/paseo/escena-3-living-movil.webp';
import amenidadesMovil from '../assets/paseo/escena-4-amenidades-movil.webp';
import apartamentoMovil from '../assets/paseo/escena-5-apartamento-movil.webp';
import cocinaMovil from '../assets/paseo/escena-6-cocina-movil.webp';
import banoMovil from '../assets/paseo/escena-7-bano-movil.webp';
import salaMovil from '../assets/paseo/escena-8-sala-movil.webp';
import terrazaMovil from '../assets/paseo/escena-9-terraza-movil.webp';

export const seo = {
  title: 'Torre Altavista — Apartamentos con amenidades · Demo de CoreStruct',
  description:
    'Recorre Torre Altavista: apartamentos de 2 y 3 habitaciones con piscina, gimnasio, parking techado y terraza con vista a la ciudad. Agenda tu visita con Alameda Bienes Raíces.',
};

export const marca = {
  nombre: 'Alameda',
  descriptor: 'Bienes Raíces',
};

export const proyecto = {
  nombre: 'Torre Altavista',
  zona: 'Tegucigalpa, Honduras',
  desde: 'L 4,380,000',
  pisos: 14,
  unidades: 96,
};

// Recorrido: cada parada tiene su póster y, salvo la última, el clip que la lleva a la siguiente,
// en dos formatos: horizontal (escritorio) y vertical 9:16 (`posterMovil`, `clipMovil`), que la
// página usa cuando la pantalla está en vertical.
// El póster es el primer fotograma de su clip, así el video entra encima sin saltos.
// `focus` es la posición horizontal (%) del encuadre en pantallas estrechas: el punto hacia el que
// se acerca la cámara en el clip de esa parada (rampa del parking, pasillo de la cocina, puerta del baño).
export const paseo = {
  paradas: [
    { id: 'inicio', lugar: 'Entrada', poster: entrada, posterMovil: entradaMovil, clip: `${import.meta.env.BASE_URL}video/clip-1-entrada-parking.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-1-entrada-parking-movil.mp4`, focus: 58 },
    { id: 'parking', lugar: 'Parking', poster: parking, posterMovil: parkingMovil, clip: `${import.meta.env.BASE_URL}video/clip-2-parking-living.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-2-parking-living-movil.mp4`, focus: 50 },
    { id: 'living', lugar: 'Living', poster: living, posterMovil: livingMovil, clip: `${import.meta.env.BASE_URL}video/clip-3-living-amenidades.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-3-living-amenidades-movil.mp4`, focus: 50 },
    { id: 'amenidades', lugar: 'Áreas recreativas', poster: amenidades, posterMovil: amenidadesMovil, clip: `${import.meta.env.BASE_URL}video/clip-4-amenidades-apartamento.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-4-amenidades-apartamento-movil.mp4`, focus: 50 },
    { id: 'apartamento', lugar: 'Apartamento', poster: apartamento, posterMovil: apartamentoMovil, clip: `${import.meta.env.BASE_URL}video/clip-5-apartamento-cocina.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-5-apartamento-cocina-movil.mp4`, focus: 50 },
    { id: 'cocina', lugar: 'Cocina', poster: cocina, posterMovil: cocinaMovil, clip: `${import.meta.env.BASE_URL}video/clip-6-cocina-bano.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-6-cocina-bano-movil.mp4`, focus: 69 },
    { id: 'bano', lugar: 'Baño', poster: bano, posterMovil: banoMovil, clip: `${import.meta.env.BASE_URL}video/clip-7-bano-sala.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-7-bano-sala-movil.mp4`, focus: 13 },
    { id: 'sala', lugar: 'Sala de estar', poster: sala, posterMovil: salaMovil, clip: `${import.meta.env.BASE_URL}video/clip-8-sala-terraza.mp4`, clipMovil: `${import.meta.env.BASE_URL}video/clip-8-sala-terraza-movil.mp4`, focus: 50 },
    { id: 'terraza', lugar: 'Terraza', poster: terraza, posterMovil: terrazaMovil, clip: null, clipMovil: null, focus: 55 },
  ],
};

export const nav = [
  { label: 'Recorrido', href: '#inicio' },
  { label: 'Modelos', href: '#modelos' },
  { label: 'Visita', href: '#proceso' },
  { label: 'Preguntas', href: '#preguntas' },
];

export const modelos = [
  {
    nombre: 'Tipo A',
    habitaciones: 2,
    banos: '2',
    area: '86 m²',
    parqueos: 1,
    precio: 'L 4,380,000',
  },
  {
    nombre: 'Tipo B',
    habitaciones: 3,
    banos: '2.5',
    area: '118 m²',
    parqueos: 2,
    precio: 'L 5,940,000',
    destacado: true,
  },
  {
    nombre: 'Penthouse',
    habitaciones: 3,
    banos: '3.5',
    area: '164 m²',
    parqueos: 2,
    precio: 'L 8,720,000',
  },
];

export const beneficios = [
  {
    icono: 'shield',
    titulo: 'Seguridad las 24 horas',
    detalle: 'Recepción, control de acceso con tarjeta y cámaras en parking y áreas comunes.',
  },
  {
    icono: 'lightning',
    titulo: 'Planta eléctrica',
    detalle: 'Respaldo total para ascensores, bombas de agua y áreas comunes.',
  },
  {
    icono: 'drop',
    titulo: 'Agua todo el año',
    detalle: 'Cisterna general de 180,000 litros con sistema hidroneumático.',
  },
  {
    icono: 'sun',
    titulo: 'Amenidades para toda la familia',
    detalle: 'Piscina, gimnasio, área de juegos, salón social y zona de parrillas.',
  },
];

export const pasos = [
  { titulo: 'Agenda tu visita', detalle: 'Elige día y hora. Te confirmamos por WhatsApp en menos de un día hábil.' },
  { titulo: 'Conoce el apartamento modelo', detalle: 'Una asesora te muestra las amenidades y el modelo que te interesa.' },
  { titulo: 'Recibe tu plan', detalle: 'Te entregamos el plan de pagos, opciones de financiamiento y los pasos para reservar.' },
];

export const faqs = [
  {
    pregunta: '¿Cuánto es la prima para reservar?',
    respuesta: 'Reservas con L 50,000 y completas la prima del 10 % en cuotas durante la construcción.',
  },
  {
    pregunta: '¿Aceptan financiamiento bancario?',
    respuesta: 'Sí. Trabajamos con los principales bancos del país y te ayudamos a preparar la documentación.',
  },
  {
    pregunta: '¿Cuánto es la cuota de mantenimiento?',
    respuesta: 'Desde L 2,350 al mes según el modelo. Incluye seguridad, limpieza, amenidades y planta eléctrica.',
  },
  {
    pregunta: '¿Se permiten mascotas?',
    respuesta: 'Sí. El reglamento permite mascotas pequeñas y medianas, con un área verde exclusiva para pasearlas.',
  },
  {
    pregunta: '¿El parking es techado?',
    respuesta: 'Sí. Está en dos sótanos con acceso controlado y cada apartamento tiene sus espacios asignados.',
  },
  {
    pregunta: '¿El recorrido en video muestra el edificio real?',
    respuesta:
      'En esta demo las escenas son ilustraciones de muestra. En la versión final se usan fotos y clips del proyecto.',
  },
];

export const asesora = {
  nombre: 'María Fernanda Rivera',
  iniciales: 'MR',
  cargo: 'Asesora inmobiliaria',
  horario: 'Lunes a sábado, 8:00 a 18:00',
};
