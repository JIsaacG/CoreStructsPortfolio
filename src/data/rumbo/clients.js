/**
 * Expedientes: the customer record a distributor actually needs — not a
 * contact card, but who they are, what they owe, and what happened on the
 * last few visits. Rumbo carries 184 of these; six are written out in full
 * here as the sample the demo shows. The dashboard's aggregate figures
 * (`company.js`) describe the full portfolio, not just these six.
 */

export const clients = [
  {
    slug: "minimarket-la-terminal",
    name: "Minimarket La Terminal",
    contact: "Marta Zelaya",
    zone: "San Pedro Sula — Centro",
    seller: "Óscar Reyes",
    status: "al-dia",
    balance: 12400,
    creditLimit: 40000,
    since: "2016-03-11",
    rtn: "0501-2016-004821",
    phone: "+504 9987-1123",
    address: "Barrio Guamilito, 3 cuadras del mercado, San Pedro Sula",
    notes: [
      { date: "2026-08-18", author: "Óscar Reyes", text: "Pide subir la línea de crédito para la temporada de fin de año." },
      { date: "2026-07-02", author: "Óscar Reyes", text: "Visita de rutina. Local ampliado, ahora con refrigerador nuevo." },
    ],
    orders: [
      { date: "2026-08-21", code: "PED-30142", amount: 9800, status: "Entregado" },
      { date: "2026-08-07", code: "PED-30051", amount: 11200, status: "Entregado" },
      { date: "2026-07-24", code: "PED-29918", amount: 8600, status: "Entregado" },
    ],
    documents: ["Contrato de crédito", "Copia de RTN", "Constancia de local"],
  },
  {
    slug: "pulperia-el-progreso",
    name: "Pulpería El Progreso",
    contact: "Denis Ordóñez",
    zone: "El Progreso, Yoro",
    seller: "Katherine Suazo",
    status: "mora",
    balance: 28650,
    creditLimit: 25000,
    since: "2019-09-04",
    rtn: "1801-2019-007743",
    phone: "+504 9456-7702",
    address: "Barrio El Edén, frente a la iglesia católica, El Progreso",
    notes: [
      { date: "2026-08-20", author: "Katherine Suazo", text: "Saldo sobre el límite de crédito. Acordó abono el 28 de agosto." },
      { date: "2026-08-05", author: "Cobranza", text: "Segunda llamada de recordatorio. Sin respuesta." },
    ],
    orders: [
      { date: "2026-07-30", code: "PED-29840", amount: 14300, status: "Entregado" },
      { date: "2026-07-09", code: "PED-29612", amount: 10100, status: "Entregado" },
      { date: "2026-06-18", code: "PED-29388", amount: 9500, status: "Cancelado" },
    ],
    documents: ["Contrato de crédito", "Copia de RTN"],
  },
  {
    slug: "super-la-economia",
    name: "Súper La Economía",
    contact: "Rosa Amaya",
    zone: "Choloma, Cortés",
    seller: "Óscar Reyes",
    status: "al-dia",
    balance: 4200,
    creditLimit: 60000,
    since: "2013-11-20",
    rtn: "0501-2013-002290",
    phone: "+504 9812-4456",
    address: "Colonia López Arellano, calle principal, Choloma",
    notes: [
      { date: "2026-08-11", author: "Óscar Reyes", text: "Cliente de mayor volumen de la zona. Pide catálogo de temporada escolar." },
    ],
    orders: [
      { date: "2026-08-22", code: "PED-30150", amount: 22800, status: "Entregado" },
      { date: "2026-08-15", code: "PED-30098", amount: 19400, status: "Entregado" },
      { date: "2026-08-01", code: "PED-29962", amount: 21100, status: "Entregado" },
    ],
    documents: ["Contrato de crédito", "Copia de RTN", "Solicitud de línea de crédito"],
  },
  {
    slug: "minimarket-villanueva",
    name: "Minimarket Villanueva",
    contact: "Elvin Cáceres",
    zone: "Villanueva, Cortés",
    seller: "Katherine Suazo",
    status: "al-dia",
    balance: 0,
    creditLimit: 20000,
    since: "2022-02-14",
    rtn: "0501-2022-011035",
    phone: "+504 9701-3390",
    address: "Barrio San José, salida a San Pedro Sula, Villanueva",
    notes: [
      { date: "2026-07-28", author: "Katherine Suazo", text: "Al día desde que abrió la cuenta. Buen candidato para subir línea." },
    ],
    orders: [
      { date: "2026-08-19", code: "PED-30130", amount: 6700, status: "Entregado" },
      { date: "2026-07-31", code: "PED-29949", amount: 5900, status: "Entregado" },
    ],
    documents: ["Contrato de crédito", "Copia de RTN"],
  },
  {
    slug: "abarroteria-puerto",
    name: "Abarrotería Puerto",
    contact: "Iris Maldonado",
    zone: "Puerto Cortés, Cortés",
    seller: "Óscar Reyes",
    status: "mora",
    balance: 16900,
    creditLimit: 30000,
    since: "2017-06-02",
    rtn: "0501-2017-005567",
    phone: "+504 9634-8821",
    address: "Barrio Barandillas, 2da avenida, Puerto Cortés",
    notes: [
      { date: "2026-08-19", author: "Cobranza", text: "Compromiso de pago parcial el 25 de agosto. Pendiente de confirmar." },
    ],
    orders: [
      { date: "2026-08-04", code: "PED-30006", amount: 8300, status: "Entregado" },
      { date: "2026-07-14", code: "PED-29704", amount: 8600, status: "Entregado" },
    ],
    documents: ["Contrato de crédito"],
  },
  {
    slug: "pulperia-dona-chinda",
    name: "Pulpería Doña Chinda",
    contact: "Herminia Portillo",
    zone: "La Lima, Cortés",
    seller: "Katherine Suazo",
    status: "bloqueado",
    balance: 34500,
    creditLimit: 18000,
    since: "2015-01-09",
    rtn: "0501-2015-003174",
    phone: "+504 9522-6610",
    address: "Barrio El Carmen, frente al parque, La Lima",
    notes: [
      { date: "2026-08-12", author: "Administración", text: "Línea de crédito suspendida hasta regularizar saldo. Solo contado." },
      { date: "2026-07-20", author: "Cobranza", text: "Tercer aviso de cobro enviado por escrito." },
    ],
    orders: [
      { date: "2026-06-26", code: "PED-29470", amount: 7200, status: "Entregado" },
      { date: "2026-06-05", code: "PED-29255", amount: 6800, status: "Entregado" },
    ],
    documents: ["Contrato de crédito", "Copia de RTN", "Aviso de suspensión"],
  },
];

export const STATUS_LABEL = {
  "al-dia": "Al día",
  mora: "En mora",
  bloqueado: "Bloqueado",
};

export const STATUS_PILL = {
  "al-dia": "ok",
  mora: "warn",
  bloqueado: "bad",
};
