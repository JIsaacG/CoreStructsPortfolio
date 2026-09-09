/**
 * English for the AUREA demo — the programme catalogue and the answers the FAQ
 * publishes as structured data.
 *
 * The catalogue's argument is that the technical baccalaureate is already worth
 * something before university: it hands over a school-leaving certificate and a
 * trade at the same time. That sentence is the reason the page exists and it is
 * translated as a claim, not as a slogan.
 *
 * The FAQ answers appear twice on the site — once as visible copy and once
 * inside a JSON-LD block for search engines. Only the body is listed here; the
 * "(Contenido demostrativo…)" parenthesis that closes each one is a rule, so a
 * new question needs no second entry.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurea";

export default {
  /* ---------------------------------------------------------- the catalogue */

  "Tres bachilleratos de educación media y seis licenciaturas, en un mismo campus. Filtra por nivel, modalidad y área de interés, o escribe lo que te interesa.":
    "Three upper secondary baccalaureates and six degrees, on one campus. Filter by level, mode and " +
    "field, or just type what you are after.",
  "Ingeniería, administración, psicología, diseño…":
    "Engineering, business, psychology, design…",
  "Ningún programa coincide con esos filtros. Prueba con menos criterios o limpia la búsqueda.":
    "No programme matches those filters. Try fewer criteria, or clear the search.",
  "Formación técnica": "Technical education",
  "Un bachillerato que ya vale en el mercado laboral.":
    "A school-leaving certificate that is already worth something at work.",
  "Los dos Bachilleratos Técnicos Profesionales entregan el título de educación media y una competencia técnica al mismo tiempo, con práctica profesional obligatoria en empresas aliadas.":
    "Both Technical Baccalaureates hand over the upper secondary certificate and a trade at the same " +
    "time, with a compulsory placement at a partner employer.",
  "Ver empresas aliadas": "See partner employers",
  Comparación: "Side by side",
  "Los nueve programas, lado a lado.": "All nine programmes, side by side.",
  "Duración, modalidad, carga y costo de referencia. Cifras demostrativas.":
    "Length, mode, workload and indicative cost. Illustrative figures.",
  Desde: "From",
  "¿Aún no decides?": "Still deciding?",
  "Programa una visita al campus y conversa con la coordinación de la carrera que te interesa.":
    "Book a campus visit and talk to the lead for the programme you have in mind.",
  "La calculadora estima el período completo con cargos adicionales y beca aplicada.":
    "The calculator estimates a full term with additional charges and any scholarship applied.",
  "¿Puedes pagarlo?": "Can you afford it?",
  "Cinco programas de beca, del 25 % al 80 %. El simulador indica a cuáles podrías aplicar.":
    "Five scholarship schemes, from 25 % to 80 %. The simulator tells you which ones you could apply " +
    "for.",

  /* ------------------------------------------------------- the FAQ, as data */

  "El 15 de septiembre de 2026 para el año lectivo 2027, en los dos niveles. La primera fecha prioritaria cierra el 30 de noviembre y es la que compite por el fondo completo de becas.":
    "15 September 2026 for the 2027 school year, at both levels. The first priority deadline closes on " +
    "30 November, and it is the one that competes for the full scholarship fund.",
  "Sí. La solicitud permite un programa principal y una segunda opción. Si no hay cupo en el primero, el expediente pasa automáticamente al segundo sin volver a presentar documentación.":
    "Yes. The application takes a first choice and a second. If there is no place on the first, the " +
    "file moves to the second automatically, with no documents to submit again.",
  "La solicitud se recibe igual mientras haya cupo. La diferencia es el orden de resolución y la disponibilidad del fondo de becas, que se asigna primero entre las solicitudes prioritarias.":
    "The application is still accepted as long as places remain. What changes is the order decisions " +
    "are made in, and how much of the scholarship fund is left — it goes first to the priority " +
    "applications.",
  "Hay dos convocatorias por proceso: el 10 y el 24 de febrero. Se puede presentar en ambas y se considera el mejor resultado.":
    "There are two sittings per round: 10 and 24 February. You may take both, and the better result " +
    "counts.",
  "Depende del nivel y del programa. Educación media se cobra por mensualidad y educación superior por asignatura. La calculadora de matrícula da una estimación completa por período, incluidos los cargos adicionales.":
    "It depends on the level and the programme. Upper secondary is charged monthly and higher " +
    "education by subject. The fee calculator gives a full estimate for a term, additional charges " +
    "included.",
  "7 % sobre el total del período si se cancela antes del inicio de clases. Es acumulable con beca y con el descuento por hermanos, hasta un tope del 80 % del arancel.":
    "7 % off the term total if you pay before classes start. It stacks with a scholarship and with the " +
    "sibling discount, up to a ceiling of 80 % of the fee.",
};
