/**
 * English for the Rumbo demo — the internal system.
 *
 * Rumbo is an invented wholesale distributor in northern Honduras, and the demo
 * is its back office: a customer register, an operations log, a user list. The
 * register is the one an internal tool is written in — short labels, no
 * marketing, and the vocabulary of the trade rather than of software.
 *
 * Two things are deliberately left in Spanish. The people, the shops and the
 * places are proper nouns in a Honduran market: "Pulpería Doña Chinda" is the
 * name over the door, and "Choloma" is a town. And the money stays in
 * lempiras, because the operation it describes is priced in lempiras. Both are
 * listed here mapped to themselves, so the coverage report can tell a decision
 * from an oversight.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/rumbo";

export default {
  /* -------------------------------------------------------- brand and shell */

  Rumbo: "Rumbo",
  "Distribución mayorista": "Wholesale distribution",
  "Rumbo Distribución, S. de R.L. · Distribuidora de consumo masivo — ficticia":
    "Rumbo Distribución, S. de R.L. · FMCG distributor — fictional",
  "Sitio de ejemplo · CoreStruct": "Sample site · CoreStruct",
  Pie: "Footer",

  Expedientes: "Customers",
  Operaciones: "Operations",
  Usuarios: "Users",

  'Marca ficticia. Sitio de ejemplo construido por <a href="../../../index.html">CoreStruct</a> © <span data-current-year>2026</span>.':
    'Fictional brand. Sample site built by <a href="../../../index.html">CoreStruct</a> © ' +
    "<span data-current-year>2026</span>.",
  'Marca ficticia. Sitio de ejemplo construido por <a href="../../index.html">CoreStruct</a> © <span data-current-year>2026</span>.':
    'Fictional brand. Sample site built by <a href="../../index.html">CoreStruct</a> © ' +
    "<span data-current-year>2026</span>.",

  /* ------------------------------------------------------- names and places */

  "Minimarket La Terminal": "Minimarket La Terminal",
  "Minimarket Villanueva": "Minimarket Villanueva",
  "Pulpería El Progreso": "Pulpería El Progreso",
  "Pulpería Doña Chinda": "Pulpería Doña Chinda",
  "Súper La Economía": "Súper La Economía",
  "Abarrotería Puerto": "Abarrotería Puerto",
  "/ Minimarket Villanueva": "/ Minimarket Villanueva",

  "Óscar Reyes": "Óscar Reyes",
  "Katherine Suazo": "Katherine Suazo",
  "Julio Cálix": "Julio Cálix",
  "Wendy Paz": "Wendy Paz",
  "Fabiola Núñez": "Fabiola Núñez",
  "Marlon Estrada": "Marlon Estrada",
  "Diego Handal": "Diego Handal",
  "Sandra Bustillo": "Sandra Bustillo",
  "Elvin Cáceres": "Elvin Cáceres",
  "Denis Ordóñez": "Denis Ordóñez",
  "Iris Maldonado": "Iris Maldonado",
  "Marta Zelaya": "Marta Zelaya",
  "Herminia Portillo": "Herminia Portillo",
  "Rosa Amaya": "Rosa Amaya",

  "San Pedro Sula — Centro": "San Pedro Sula — Centro",
  "Villanueva, Cortés": "Villanueva, Cortés",
  "Choloma, Cortés": "Choloma, Cortés",
  "Puerto Cortés, Cortés": "Puerto Cortés, Cortés",
  "El Progreso, Yoro": "El Progreso, Yoro",
  "La Lima, Cortés": "La Lima, Cortés",
  "Valle de Sula": "Valle de Sula",
  "San Pedro Sula, Choloma, Puerto Cortés": "San Pedro Sula, Choloma, Puerto Cortés",
  "El Progreso, Villanueva, La Lima": "El Progreso, Villanueva, La Lima",

  "Barrio Barandillas, 2da avenida, Puerto Cortés":
    "Barrio Barandillas, 2da avenida, Puerto Cortés",
  "Barrio Guamilito, 3 cuadras del mercado, San Pedro Sula":
    "Barrio Guamilito, three blocks from the market, San Pedro Sula",
  "Barrio San José, salida a San Pedro Sula, Villanueva":
    "Barrio San José, on the San Pedro Sula road, Villanueva",
  "Barrio El Carmen, frente al parque, La Lima":
    "Barrio El Carmen, opposite the park, La Lima",
  "Barrio El Edén, frente a la iglesia católica, El Progreso":
    "Barrio El Edén, opposite the Catholic church, El Progreso",
  "Colonia López Arellano, calle principal, Choloma":
    "Colonia López Arellano, main street, Choloma",

  /* ----------------------------------------------------------- the register */

  "Expedientes — Rumbo · Demo de CoreStruct": "Customers — Rumbo · A CoreStruct demo",
  "Registro de clientes de Rumbo: saldo, vendedor asignado y estado de cuenta.":
    "Rumbo's customer register: balance, assigned rep and account status.",
  "6 clientes de muestra sobre una cartera de 184. Cada fila abre la ficha completa: contacto, historial de pedidos, notas de visita y documentos.":
    "Six sample customers out of a book of 184. Every row opens the full record: contact details, " +
    "order history, visit notes and documents.",
  "Buscar por cliente o zona…": "Search by customer or area…",
  "Ningún expediente coincide con ese filtro.": "No customer matches that filter.",

  "Al día": "Up to date",
  "En mora": "Overdue",
  Bloqueado: "Blocked",
  Todos: "All",
  Vendedor: "Sales rep",
  Saldo: "Balance",
  "Saldo actual": "Current balance",
  "Límite de crédito": "Credit limit",
  "Cliente desde": "Customer since",
  RTN: "Tax ID",

  /* ------------------------------------------------------ a customer record */

  "Datos de contacto": "Contact details",
  "Historial de pedidos": "Order history",
  "Notas de visita": "Visit notes",
  "Contrato de crédito": "Credit agreement",
  "Copia de RTN": "Copy of tax ID",
  "Constancia de local": "Proof of premises",
  "Aviso de suspensión": "Suspension notice",
  "Solicitud de línea de crédito": "Credit line application",

  '<a class="dm-table__link" href="../expedientes.html">Expedientes</a> / Abarrotería Puerto':
    '<a class="dm-table__link" href="../expedientes.html">Customers</a> / Abarrotería Puerto',
  '<a class="dm-table__link" href="../expedientes.html">Expedientes</a> / Minimarket La Terminal':
    '<a class="dm-table__link" href="../expedientes.html">Customers</a> / Minimarket La Terminal',
  '<a class="dm-table__link" href="../expedientes.html">Expedientes</a> / Pulpería Doña Chinda':
    '<a class="dm-table__link" href="../expedientes.html">Customers</a> / Pulpería Doña Chinda',
  '<a class="dm-table__link" href="../expedientes.html">Expedientes</a> / Pulpería El Progreso':
    '<a class="dm-table__link" href="../expedientes.html">Customers</a> / Pulpería El Progreso',
  '<a class="dm-table__link" href="../expedientes.html">Expedientes</a> / Súper La Economía':
    '<a class="dm-table__link" href="../expedientes.html">Customers</a> / Súper La Economía',

  "Abarrotería Puerto — Rumbo · Demo de CoreStruct":
    "Abarrotería Puerto — Rumbo · A CoreStruct demo",
  "Minimarket La Terminal — Rumbo · Demo de CoreStruct":
    "Minimarket La Terminal — Rumbo · A CoreStruct demo",
  "Minimarket Villanueva — Rumbo · Demo de CoreStruct":
    "Minimarket Villanueva — Rumbo · A CoreStruct demo",
  "Pulpería Doña Chinda — Rumbo · Demo de CoreStruct":
    "Pulpería Doña Chinda — Rumbo · A CoreStruct demo",
  "Pulpería El Progreso — Rumbo · Demo de CoreStruct":
    "Pulpería El Progreso — Rumbo · A CoreStruct demo",
  "Súper La Economía — Rumbo · Demo de CoreStruct":
    "Súper La Economía — Rumbo · A CoreStruct demo",

  "Ficha de Abarrotería Puerto, Puerto Cortés, Cortés: saldo, historial de pedidos y notas de visita.":
    "Record for Abarrotería Puerto, Puerto Cortés, Cortés: balance, order history and visit notes.",
  "Ficha de Minimarket La Terminal, San Pedro Sula — Centro: saldo, historial de pedidos y notas de visita.":
    "Record for Minimarket La Terminal, San Pedro Sula — Centro: balance, order history and visit notes.",
  "Ficha de Minimarket Villanueva, Villanueva, Cortés: saldo, historial de pedidos y notas de visita.":
    "Record for Minimarket Villanueva, Villanueva, Cortés: balance, order history and visit notes.",
  "Ficha de Pulpería Doña Chinda, La Lima, Cortés: saldo, historial de pedidos y notas de visita.":
    "Record for Pulpería Doña Chinda, La Lima, Cortés: balance, order history and visit notes.",
  "Ficha de Pulpería El Progreso, El Progreso, Yoro: saldo, historial de pedidos y notas de visita.":
    "Record for Pulpería El Progreso, El Progreso, Yoro: balance, order history and visit notes.",
  "Ficha de Súper La Economía, Choloma, Cortés: saldo, historial de pedidos y notas de visita.":
    "Record for Súper La Economía, Choloma, Cortés: balance, order history and visit notes.",

  "Puerto Cortés, Cortés · vendedor Óscar Reyes": "Puerto Cortés, Cortés · rep Óscar Reyes",
  "San Pedro Sula — Centro · vendedor Óscar Reyes": "San Pedro Sula — Centro · rep Óscar Reyes",
  "Villanueva, Cortés · vendedor Katherine Suazo":
    "Villanueva, Cortés · rep Katherine Suazo",
  "La Lima, Cortés · vendedor Katherine Suazo": "La Lima, Cortés · rep Katherine Suazo",
  "El Progreso, Yoro · vendedor Katherine Suazo": "El Progreso, Yoro · rep Katherine Suazo",
  "Choloma, Cortés · vendedor Óscar Reyes": "Choloma, Cortés · rep Óscar Reyes",

  /* The rows of the register, each a shop name over its town. */
  '<a class="dm-table__link" href="expedientes/minimarket-la-terminal.html">Minimarket La Terminal</a> <span class="dm-table__sub">San Pedro Sula — Centro</span>':
    '<a class="dm-table__link" href="expedientes/minimarket-la-terminal.html">Minimarket La Terminal</a> <span class="dm-table__sub">San Pedro Sula — Centro</span>',
  '<a class="dm-table__link" href="expedientes/pulperia-el-progreso.html">Pulpería El Progreso</a> <span class="dm-table__sub">El Progreso, Yoro</span>':
    '<a class="dm-table__link" href="expedientes/pulperia-el-progreso.html">Pulpería El Progreso</a> <span class="dm-table__sub">El Progreso, Yoro</span>',
  '<a class="dm-table__link" href="expedientes/super-la-economia.html">Súper La Economía</a> <span class="dm-table__sub">Choloma, Cortés</span>':
    '<a class="dm-table__link" href="expedientes/super-la-economia.html">Súper La Economía</a> <span class="dm-table__sub">Choloma, Cortés</span>',
  '<a class="dm-table__link" href="expedientes/minimarket-villanueva.html">Minimarket Villanueva</a> <span class="dm-table__sub">Villanueva, Cortés</span>':
    '<a class="dm-table__link" href="expedientes/minimarket-villanueva.html">Minimarket Villanueva</a> <span class="dm-table__sub">Villanueva, Cortés</span>',
  '<a class="dm-table__link" href="expedientes/abarroteria-puerto.html">Abarrotería Puerto</a> <span class="dm-table__sub">Puerto Cortés, Cortés</span>':
    '<a class="dm-table__link" href="expedientes/abarroteria-puerto.html">Abarrotería Puerto</a> <span class="dm-table__sub">Puerto Cortés, Cortés</span>',
  '<a class="dm-table__link" href="expedientes/pulperia-dona-chinda.html">Pulpería Doña Chinda</a> <span class="dm-table__sub">La Lima, Cortés</span>':
    '<a class="dm-table__link" href="expedientes/pulperia-dona-chinda.html">Pulpería Doña Chinda</a> <span class="dm-table__sub">La Lima, Cortés</span>',

  /* The visit notes. Dates are written out here rather than left to the date
     rules, because the whole note is one dictionary entry. */
  '<span class="dm-note-card__meta">19 ago 2026 · Cobranza</span> Compromiso de pago parcial el 25 de agosto. Pendiente de confirmar.':
    '<span class="dm-note-card__meta">19 Aug 2026 · Collections</span> Agreed a part payment on ' +
    "25 August. Yet to be confirmed.",
  '<span class="dm-note-card__meta">18 ago 2026 · Óscar Reyes</span> Pide subir la línea de crédito para la temporada de fin de año.':
    '<span class="dm-note-card__meta">18 Aug 2026 · Óscar Reyes</span> Asking for a higher credit ' +
    "line for the end-of-year season.",
  '<span class="dm-note-card__meta">02 jul 2026 · Óscar Reyes</span> Visita de rutina. Local ampliado, ahora con refrigerador nuevo.':
    '<span class="dm-note-card__meta">02 Jul 2026 · Óscar Reyes</span> Routine visit. Shop has ' +
    "been extended and now has a new chiller.",
  '<span class="dm-note-card__meta">28 jul 2026 · Katherine Suazo</span> Al día desde que abrió la cuenta. Buen candidato para subir línea.':
    '<span class="dm-note-card__meta">28 Jul 2026 · Katherine Suazo</span> Up to date since the ' +
    "account was opened. Good candidate for a higher line.",
  '<span class="dm-note-card__meta">12 ago 2026 · Administración</span> Línea de crédito suspendida hasta regularizar saldo. Solo contado.':
    '<span class="dm-note-card__meta">12 Aug 2026 · Administration</span> Credit line suspended ' +
    "until the balance is settled. Cash only.",
  '<span class="dm-note-card__meta">20 jul 2026 · Cobranza</span> Tercer aviso de cobro enviado por escrito.':
    '<span class="dm-note-card__meta">20 Jul 2026 · Collections</span> Third written payment ' +
    "reminder sent.",
  '<span class="dm-note-card__meta">20 ago 2026 · Katherine Suazo</span> Saldo sobre el límite de crédito. Acordó abono el 28 de agosto.':
    '<span class="dm-note-card__meta">20 Aug 2026 · Katherine Suazo</span> Balance over the credit ' +
    "limit. Agreed a payment on 28 August.",
  '<span class="dm-note-card__meta">05 ago 2026 · Cobranza</span> Segunda llamada de recordatorio. Sin respuesta.':
    '<span class="dm-note-card__meta">05 Aug 2026 · Collections</span> Second reminder call. No ' +
    "answer.",
  '<span class="dm-note-card__meta">11 ago 2026 · Óscar Reyes</span> Cliente de mayor volumen de la zona. Pide catálogo de temporada escolar.':
    '<span class="dm-note-card__meta">11 Aug 2026 · Óscar Reyes</span> Highest-volume customer in ' +
    "the area. Asking for the back-to-school catalogue.",

  /* --------------------------------------------------------------- the panel */

  "Panel — Rumbo · Demo de CoreStruct": "Dashboard — Rumbo · A CoreStruct demo",
  "Panel interno de Rumbo Distribución, S. de R.L.: pedidos, cartera por cobrar, clientes activos y entregas del día.":
    "Rumbo Distribución, S. de R.L.'s internal dashboard: orders, receivables, active customers and " +
    "the day's deliveries.",
  "Rumbo Distribución, S. de R.L. · hoy es 24 de agosto de 2026":
    "Rumbo Distribución, S. de R.L. · today is 24 August 2026",

  "Pedidos hoy": "Orders today",
  "Cartera por cobrar": "Receivables",
  "Clientes activos": "Active customers",
  "Entregas en ruta": "Deliveries out",
  "+4 vs. semana pasada": "+4 vs. last week",
  "12 clientes en mora": "12 customers overdue",
  "+6 este mes": "+6 this month",
  "3 rutas, 2 zonas": "3 routes, 2 areas",
  "Ventas de las últimas 6 semanas": "Sales over the last 6 weeks",

  "Sem. 1": "Wk 1",
  "Sem. 2": "Wk 2",
  "Sem. 3": "Wk 3",
  "Sem. 4": "Wk 4",
  "Sem. 5": "Wk 5",
  "Sem. 6": "Wk 6",
  "Sem. 1: L 612,000": "Wk 1: L 612,000",
  "Sem. 2: L 588,000": "Wk 2: L 588,000",
  "Sem. 3: L 671,000": "Wk 3: L 671,000",
  "Sem. 4: L 705,000": "Wk 4: L 705,000",
  "Sem. 5: L 664,000": "Wk 5: L 664,000",
  "Sem. 6: L 742,000": "Wk 6: L 742,000",

  /* ------------------------------------------------------------- operations */

  "Operaciones — Rumbo · Demo de CoreStruct": "Operations — Rumbo · A CoreStruct demo",
  "Bitácora de pedidos, entregas, pagos y ajustes de Rumbo.":
    "Rumbo's log of orders, deliveries, payments and adjustments.",
  "Bitácora de pedidos, entregas, pagos y ajustes — lo que hoy vive repartido entre correo, WhatsApp y una hoja de cálculo.":
    "A log of orders, deliveries, payments and adjustments — what today is scattered across email, " +
    "WhatsApp and a spreadsheet.",
  "Buscar por cliente o responsable…": "Search by customer or owner…",
  "Buscar operación": "Search operations",
  "Ninguna operación coincide con ese filtro.": "No operation matches that filter.",

  Pedido: "Order",
  Pedidos: "Orders",
  Entrega: "Delivery",
  Entregas: "Deliveries",
  Pago: "Payment",
  Pagos: "Payments",
  Ajuste: "Adjustment",
  Ajustes: "Adjustments",
  Bodega: "Warehouse",
  Entregado: "Delivered",
  Completado: "Completed",
  Cancelado: "Cancelled",
  Pendiente: "Pending",
  "Pedido —": "Order —",
  "Entrega —": "Delivery —",
  "Pago —": "Payment —",
  "Ajuste —": "Adjustment —",
  "Óscar Reyes · L 9,800": "Óscar Reyes · L 9,800",
  "Julio Cálix · L 22,800": "Julio Cálix · L 22,800",
  "Julio Cálix · L 9,800": "Julio Cálix · L 9,800",
  "Wendy Paz · L 5,000": "Wendy Paz · L 5,000",
  "Katherine Suazo · L 6,700": "Katherine Suazo · L 6,700",
  "Wendy Paz · -L 1,200": "Wendy Paz · -L 1,200",

  /* ------------------------------------------------------------------ users */

  "Usuarios — Rumbo · Demo de CoreStruct": "Users — Rumbo · A CoreStruct demo",
  "Personal de Rumbo con acceso al panel interno, sus roles y permisos.":
    "Rumbo staff with access to the internal dashboard, their roles and their permissions.",
  "Personal con acceso al panel, su rol y su último ingreso.":
    "Staff with dashboard access, their role and their last sign-in.",
  "Ningún usuario coincide con ese filtro.": "No user matches that filter.",

  Rol: "Role",
  "Último acceso": "Last sign-in",
  Administrador: "Administrator",
  "Supervisor de ventas": "Sales supervisor",
  Cobranza: "Collections",
  Administración: "Administration",
  "Centro de distribución": "Distribution centre",
  "Cartera vencida": "Overdue accounts",
  "Zona norte — en incorporación": "Northern area — onboarding",
  Activo: "Active",
  Invitado: "Invited",
  Suspendido: "Suspended",

  /* Name over work address — both proper nouns, both unchanged. */
  'Fabiola Núñez<span class="dm-table__sub">fabiola.nunez@rumbo-demo.hn</span>':
    'Fabiola Núñez<span class="dm-table__sub">fabiola.nunez@rumbo-demo.hn</span>',
  'Óscar Reyes<span class="dm-table__sub">oscar.reyes@rumbo-demo.hn</span>':
    'Óscar Reyes<span class="dm-table__sub">oscar.reyes@rumbo-demo.hn</span>',
  'Julio Cálix<span class="dm-table__sub">julio.calix@rumbo-demo.hn</span>':
    'Julio Cálix<span class="dm-table__sub">julio.calix@rumbo-demo.hn</span>',

  "Roles y permisos": "Roles and permissions",
  "Ver expedientes": "View customers",
  "Editar expedientes": "Edit customers",
  "Aprobar crédito": "Approve credit",
  "Ver reportes": "View reports",
  "Gestionar usuarios": "Manage users",
};
