// Contenido de la landing. Maison Verde es un restaurante ficticio: carta, precios, horario y
// dirección son de demostración. Las fotos son de Unsplash (ver `creditos`) y los clips se
// generaron con Wan2.2 en local a partir de ellas.
import inicio from '../assets/paseo/parada-1-inicio.webp';
import terraza from '../assets/paseo/parada-2-terraza.webp';
import desayuno from '../assets/paseo/parada-3-desayuno.webp';
import barra from '../assets/paseo/parada-4-barra.webp';
import cafe from '../assets/paseo/parada-5-cafe.webp';
import salon from '../assets/paseo/parada-6-salon.webp';
import fuertes from '../assets/paseo/parada-7-fuertes.webp';
import postres from '../assets/paseo/parada-8-postres.webp';
import jardin from '../assets/paseo/parada-9-jardin.webp';
import inicioMovil from '../assets/paseo/parada-1-inicio-movil.webp';
import terrazaMovil from '../assets/paseo/parada-2-terraza-movil.webp';
import desayunoMovil from '../assets/paseo/parada-3-desayuno-movil.webp';
import barraMovil from '../assets/paseo/parada-4-barra-movil.webp';
import cafeMovil from '../assets/paseo/parada-5-cafe-movil.webp';
import salonMovil from '../assets/paseo/parada-6-salon-movil.webp';
import fuertesMovil from '../assets/paseo/parada-7-fuertes-movil.webp';
import postresMovil from '../assets/paseo/parada-8-postres-movil.webp';
import jardinMovil from '../assets/paseo/parada-9-jardin-movil.webp';

export const seo = {
  title: 'Maison Verde — Restaurante con terraza y jardín en Tegucigalpa · Demo de CoreStruct',
  description:
    'Recorre Maison Verde de la terraza al postre: desayunos hasta mediodía, café de altura, cocina de autor y cenas en el jardín. Reserva tu mesa por WhatsApp.',
};

export const marca = {
  nombre: 'Maison Verde',
  descriptor: 'Cocina de autor',
};

export const restaurante = {
  zona: 'Tegucigalpa',
  horario: 'Todos los días, 7:00 a 22:00',
  direccion: 'Colonia Lomas del Guijarro, Tegucigalpa',
};

const video = (nombre: string) => `${import.meta.env.BASE_URL}video/${nombre}.mp4`;

// Recorrido: cada parada tiene su póster y, salvo la última, el clip que la lleva a la siguiente,
// en dos formatos: horizontal (escritorio) y vertical 9:16 (`posterMovil`, `clipMovil`), que la
// página usa cuando la pantalla está en vertical.
// El póster es el primer fotograma de su clip, así el video entra encima sin saltos.
// `focus` es la posición horizontal (%) del encuadre en pantallas estrechas y horizontales.
export const paseo = {
  paradas: [
    { id: 'inicio', lugar: 'La casa', poster: inicio, posterMovil: inicioMovil, clip: video('clip-1-casa-terraza'), clipMovil: video('clip-1-casa-terraza-movil'), focus: 45 },
    { id: 'terraza', lugar: 'Terraza', poster: terraza, posterMovil: terrazaMovil, clip: video('clip-2-terraza-desayuno'), clipMovil: video('clip-2-terraza-desayuno-movil'), focus: 50 },
    { id: 'desayunos', lugar: 'Desayunos', poster: desayuno, posterMovil: desayunoMovil, clip: video('clip-3-desayuno-barra'), clipMovil: video('clip-3-desayuno-barra-movil'), focus: 52 },
    { id: 'barra', lugar: 'La barra', poster: barra, posterMovil: barraMovil, clip: video('clip-4-barra-cafe'), clipMovil: video('clip-4-barra-cafe-movil'), focus: 40 },
    { id: 'cafe', lugar: 'Café', poster: cafe, posterMovil: cafeMovil, clip: video('clip-5-cafe-salon'), clipMovil: video('clip-5-cafe-salon-movil'), focus: 60 },
    { id: 'salon', lugar: 'El salón', poster: salon, posterMovil: salonMovil, clip: video('clip-6-salon-fuertes'), clipMovil: video('clip-6-salon-fuertes-movil'), focus: 50 },
    { id: 'fuertes', lugar: 'Platos fuertes', poster: fuertes, posterMovil: fuertesMovil, clip: video('clip-7-fuertes-postres'), clipMovil: video('clip-7-fuertes-postres-movil'), focus: 40 },
    { id: 'postres', lugar: 'Postres', poster: postres, posterMovil: postresMovil, clip: video('clip-8-postres-jardin'), clipMovil: video('clip-8-postres-jardin-movil'), focus: 55 },
    { id: 'jardin', lugar: 'El jardín', poster: jardin, posterMovil: jardinMovil, clip: null, clipMovil: null, focus: 60 },
  ],
};

export const nav = [
  { label: 'Recorrido', href: '#inicio' },
  { label: 'Carta', href: '#carta' },
  { label: 'Reservar', href: '#proceso' },
  { label: 'Preguntas', href: '#preguntas' },
];

// Carta de demostración. Las paradas del recorrido muestran los tres primeros platos de su sección.
export type Plato = { nombre: string; detalle: string; precio: string; etiqueta?: string };
export type Seccion = { titulo: string; horario: string; platos: Plato[] };
export const carta: Record<'desayunos' | 'cafe' | 'fuertes' | 'postres', Seccion> = {
  desayunos: {
    titulo: 'Desayunos',
    horario: '7:00 a 12:00',
    platos: [
      { nombre: 'Tostada de aguacate', detalle: 'Pan de masa madre, aguacate, tocino crujiente y huevo a la plancha', precio: 'L 245' },
      { nombre: 'Catracho de la casa', detalle: 'Frijoles colados, plátano maduro, queso seco, mantequilla y huevos al gusto', precio: 'L 225', etiqueta: 'El más pedido' },
      { nombre: 'Cesta de cruasanes', detalle: 'Tres cruasanes de mantequilla horneados cada mañana, con mermelada de la casa', precio: 'L 160' },
      { nombre: 'Bowl de frutas y yogur', detalle: 'Fruta de temporada, yogur griego, granola y miel de abeja', precio: 'L 175', etiqueta: 'Vegetariano' },
    ],
  },
  cafe: {
    titulo: 'Café y barra',
    horario: '7:00 a 22:00',
    platos: [
      { nombre: 'Espresso', detalle: 'Café de altura de Marcala, tostado medio', precio: 'L 55' },
      { nombre: 'Capuchino', detalle: 'Doble espresso con leche texturizada', precio: 'L 85' },
      { nombre: 'Cold brew de la casa', detalle: '18 horas de extracción en frío, con naranja', precio: 'L 95' },
      { nombre: 'Limonada de hierbabuena', detalle: 'Limón, hierbabuena y agua mineral', precio: 'L 80', etiqueta: 'Sin alcohol' },
    ],
  },
  fuertes: {
    titulo: 'Platos fuertes',
    horario: '12:00 a 22:00',
    platos: [
      { nombre: 'Wellington de lomito', detalle: 'Lomito en hojaldre con duxelles de hongos, puré de papa y demi-glace', precio: 'L 690', etiqueta: 'Para compartir' },
      { nombre: 'Pescado en costra de hierbas', detalle: 'Filete del día, vegetales asados y salsa de mantequilla blanca', precio: 'L 520' },
      { nombre: 'Risotto de hongos', detalle: 'Arroz arborio, hongos salteados, parmesano y aceite de trufa', precio: 'L 410', etiqueta: 'Vegetariano' },
      { nombre: 'Pollo al limón', detalle: 'Medio pollo asado con limón y tomillo, papas rústicas y ensalada', precio: 'L 380' },
    ],
  },
  postres: {
    titulo: 'Postres',
    horario: 'Todo el día',
    platos: [
      { nombre: 'Volcán de chocolate', detalle: 'Centro líquido de chocolate al 70 % con helado de vainilla', precio: 'L 210', etiqueta: 'El más pedido' },
      { nombre: 'Tres leches de coco', detalle: 'Bizcocho húmedo con leche de coco y coco tostado', precio: 'L 175' },
      { nombre: 'Parfait de frutos rojos', detalle: 'Crema de mascarpone, frutos rojos y crumble de almendra', precio: 'L 160' },
    ],
  },
};

export const beneficios = [
  { icono: 'tree', titulo: 'Terraza y jardín', detalle: 'Mesas al aire libre bajo sombrillas de día y bajo las luces de noche.' },
  { icono: 'users', titulo: 'Mesas para grupos', detalle: 'De 2 a 14 personas en el salón. Para más, reservamos el jardín completo.' },
  { icono: 'leaf', titulo: 'Opciones vegetarianas', detalle: 'Cada sección de la carta tiene al menos un plato sin carne.' },
  { icono: 'car', titulo: 'Parqueo con valet', detalle: 'Llegas a la puerta y nosotros estacionamos por ti.' },
];

export const pasos = [
  { titulo: 'Elige día, hora y personas', detalle: 'Llena el formulario o escríbenos por WhatsApp.' },
  { titulo: 'Te confirmamos en menos de una hora', detalle: 'Recibes la confirmación por WhatsApp con tu mesa asignada.' },
  { titulo: 'Llegas y tu mesa está lista', detalle: 'El valet te recibe en la puerta. Solo tienes que sentarte.' },
];

export const faqs = [
  {
    pregunta: '¿Necesito reservar?',
    respuesta: 'Entre semana casi siempre hay mesa. Los fines de semana y las cenas en el jardín se llenan: mejor reserva con un día de anticipación.',
  },
  {
    pregunta: '¿Hasta qué hora sirven desayunos?',
    respuesta: 'Todos los días de 7:00 a 12:00. Desde las 12:00 empieza la carta de almuerzos y cenas.',
  },
  {
    pregunta: '¿Tienen opciones vegetarianas o sin gluten?',
    respuesta: 'Sí. Cada sección de la carta tiene al menos un plato vegetariano, y la cocina adapta varios platos sin gluten si lo avisas al reservar.',
  },
  {
    pregunta: '¿Puedo celebrar un cumpleaños o un evento?',
    respuesta: 'Sí. Para grupos de hasta 14 personas basta con reservar; para más, cerramos el jardín y armamos un menú contigo.',
  },
  {
    pregunta: '¿Hay parqueo?',
    respuesta: 'Sí, con servicio de valet sin costo adicional durante tu visita.',
  },
  {
    pregunta: '¿Hacen pedidos a domicilio?',
    respuesta: 'Sí, por las aplicaciones de entrega de la ciudad. Casi toda la carta viaja bien, salvo el volcán de chocolate: ese se come aquí.',
  },
  {
    pregunta: '¿Este restaurante existe?',
    respuesta:
      'No. Maison Verde es una demostración de CoreStruct: las fotos son de bancos de imágenes y el recorrido en video se generó con IA a partir de ellas. Con las fotos y la carta de tu restaurante, la página funciona igual.',
  },
];

export const reservas = {
  responsable: 'Equipo de reservas',
  iniciales: 'MV',
  detalle: 'Respondemos de 7:00 a 21:00',
};

export const creditos = [
  { autor: 'Candes J', url: 'https://unsplash.com/@candesjaramillo' },
  { autor: 'Tim Wing', url: 'https://unsplash.com/@timwing78' },
  { autor: 'Rick Davis', url: 'https://unsplash.com/@rick1188' },
  { autor: 'Nguyễn Hiệp', url: 'https://unsplash.com/@hieptltb97' },
  { autor: 'Drew Gilliam', url: 'https://unsplash.com/@drewgilliam' },
  { autor: 'D5 Render', url: 'https://unsplash.com/@d5render' },
  { autor: 'Robby McCullough', url: 'https://unsplash.com/@mybbor' },
  { autor: 'American Heritage Chocolate', url: 'https://unsplash.com/@americanheritagechocolate' },
  { autor: 'avansear', url: 'https://unsplash.com/@avansear' },
];
