/**
 * The administrative automation module — data and workflow engine.
 *
 * This file is the whole model behind "Gestión Administrativa": the processes
 * the engine can run, the rules that decide who approves what, the people the
 * demonstration invents, the requests already in the register, and the audit
 * trail of the one request the visitor walks through end to end.
 *
 * It is imported by BOTH sides, like `table-render.js` and for the same reason:
 * the build writes the first paint of the module from these definitions and the
 * browser drives the interaction from the same ones, so a rule shown in the
 * "Automatización basada en reglas" section cannot drift from the rule that
 * actually routes a request when someone submits the form.
 *
 * EVERYTHING HERE IS INVENTED. The people do not exist, the amounts are not
 * budget figures, the request codes correspond to no register, and the approval
 * ladder is not any institution's procedure. A demonstration of an internal
 * administrative system has to be as explicit about that as the public portal is.
 */

/* -------------------------------------------------------------- the module */

export const moduleInfo = {
  label: "Gestión administrativa",
  title: "Procesos que avanzan sin depender del seguimiento manual.",
  lead:
    "Centralice solicitudes, aprobaciones, documentos, responsables y tiempos de respuesta " +
    "en una única experiencia digital.",
  tag: "Módulo demostrativo",
  disclaimer:
    "Los nombres, métricas, personas y procesos mostrados son ficticios y se utilizan " +
    "exclusivamente para demostrar las capacidades de la plataforma.",
  concept: "Solicitudes, aprobaciones y seguimiento en un solo flujo.",
  teaser: {
    title: "Procesos administrativos más simples",
    text:
      "Digitalice solicitudes, aprobaciones, documentos y seguimiento mediante flujos " +
      "diseñados alrededor de las reglas de su institución.",
    cta: "Ver automatización en acción",
  },
};

/* ------------------------------------------------------------------ format */

/** `58500` → `L 58,500.00`. The module's only money formatter. */
export function money(value, { cents = true } = {}) {
  if (value === null || value === undefined) return "—";
  const fixed = Number(value).toFixed(cents ? 2 : 0);
  const [whole, fraction] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `L ${grouped}${fraction ? `.${fraction}` : ""}`;
}

/**
 * The clock the whole module is measured against.
 *
 * A fixed instant rather than `Date.now()`: an SLA countdown driven by the wall
 * clock would show every request as long expired a week after the demo was
 * recorded, and the build and the browser would disagree about the same number.
 * Move this one value and every remaining-time figure moves with it.
 */
export const DEMO_NOW = "2026-08-30T11:20";

/** A local ISO stamp as minutes, with no timezone in the way. */
function minutesOf(iso) {
  const [date, time = "00:00"] = String(iso).split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) / 60000;
}

/** Hours elapsed between two local ISO stamps. */
export const hoursBetween = (from, to = DEMO_NOW) => (minutesOf(to) - minutesOf(from)) / 60;

/** `41.53` → `41h 32m`. */
export function duration(hours) {
  const total = Math.max(0, Math.round(hours * 60));
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, "0")}m`;
}

/* ------------------------------------------------------------------ states */

/**
 * The eight states a request can be in.
 *
 * `tone` drives the colour, `icon` the glyph and `label` the word — three
 * channels carrying one meaning, so the register stays readable to someone who
 * cannot separate the greens from the ambers.
 */
export const states = {
  recibida: { label: "Recibida", tone: "mute", icon: "open", open: true },
  validacion: { label: "En validación", tone: "info", icon: "clock", open: true },
  aprobacion: { label: "En aprobación", tone: "info", icon: "arrow", open: true },
  aprobada: { label: "Aprobada", tone: "ok", icon: "check", open: false },
  cambios: { label: "Cambios solicitados", tone: "warn", icon: "edit", open: true },
  rechazada: { label: "Rechazada", tone: "bad", icon: "closed", open: false },
  finalizada: { label: "Finalizada", tone: "ok", icon: "check", open: false },
  vencida: { label: "Vencida", tone: "bad", icon: "alert", open: true },
};

export const stateName = (key) => states[key]?.label ?? key;

/* ------------------------------------------------------------------- roles */

/** Who can act. Every person named in this module is invented. */
export const roles = {
  solicitante: { label: "Solicitante", area: "Área solicitante" },
  jefatura: { label: "Jefatura inmediata", area: "Jefatura del área" },
  administracion: { label: "Administración", area: "Dirección Administrativa" },
  finanzas: { label: "Finanzas", area: "Jefatura de Finanzas" },
  direccion: { label: "Dirección Ejecutiva", area: "Dirección Ejecutiva" },
  rrhh: { label: "RR. HH.", area: "Recursos Humanos" },
  liquidacion: { label: "Liquidación", area: "Tesorería" },
  sistema: { label: "Sistema", area: "Automático" },
};

export const roleName = (key) => roles[key]?.label ?? key;

export const demoUsers = [
  { id: "rivera", name: "Alejandro Rivera", role: "solicitante", area: "Administración", position: "Coordinación Administrativa", email: "alejandro.rivera@demo.local", initials: "AR" },
  { id: "lopez", name: "María López", role: "administracion", area: "Dirección Administrativa", position: "Dirección Administrativa", email: "maria.lopez@demo.local", initials: "ML" },
  { id: "mejia", name: "Carlos Mejía", role: "finanzas", area: "Finanzas", position: "Jefatura de Finanzas", email: "carlos.mejia@demo.local", initials: "CM" },
  { id: "paz", name: "Ricardo Paz", role: "direccion", area: "Dirección Ejecutiva", position: "Dirección Ejecutiva", email: "ricardo.paz@demo.local", initials: "RP" },
  { id: "lagos", name: "Andrea Lagos", role: "rrhh", area: "Recursos Humanos", position: "Jefatura de Personal", email: "andrea.lagos@demo.local", initials: "AL" },
  { id: "herrera", name: "Sofía Herrera", role: "jefatura", area: "Administración", position: "Jefatura de Servicios Generales", email: "sofia.herrera@demo.local", initials: "SH" },
];

export const userFor = (role) => demoUsers.find((user) => user.role === role) ?? demoUsers[0];

/* ------------------------------------------------------------------- rules */

/**
 * The amount ladder.
 *
 * One array read by three things: the routing engine, the "Automatización
 * basada en reglas" diagram, and the rule the processing sequence quotes back
 * at the visitor. They cannot disagree, because there is only one of them.
 */
export const amountBands = [
  {
    id: "baja",
    from: 0,
    to: 25000,
    when: "Monto menor a L 25,000",
    chain: ["jefatura"],
    note: "Una sola autorización: la jefatura inmediata del área solicitante.",
  },
  {
    id: "media",
    from: 25000,
    to: 100000,
    when: "Monto igual o mayor a L 25,000",
    chain: ["administracion", "finanzas"],
    note: "El visto bueno de jefatura se resuelve en el registro; autorizan Administración y Finanzas.",
  },
  {
    id: "alta",
    from: 100000,
    to: null,
    when: "Monto igual o mayor a L 100,000",
    chain: ["administracion", "finanzas", "direccion"],
    note: "Además de Administración y Finanzas, la Dirección Ejecutiva autoriza el gasto.",
  },
];

export const configurableNote =
  "Los flujos pueden configurarse de acuerdo con los procedimientos internos de cada organización.";

/** The band an amount falls into. */
export const bandFor = (amount) =>
  [...amountBands].reverse().find((band) => Number(amount ?? 0) >= band.from) ?? amountBands[0];

/**
 * The sentence the engine quotes when it routes a purchase request.
 *
 * Derived from the band rather than written beside it, so the wording a visitor
 * reads and the routing the engine performs are one decision.
 */
export function ruleFor(amount) {
  const band = bandFor(amount);
  const who = band.chain.map(roleName);
  const list = who.length > 1 ? `${who.slice(0, -1).join(", ")} y ${who.at(-1)}` : who[0];

  return {
    band,
    approvals: band.chain.length,
    text:
      band.id === "baja"
        ? "Solicitudes inferiores a L 25,000 requieren únicamente la autorización de la jefatura inmediata."
        : `Solicitudes superiores a ${money(band.from, { cents: false })} requieren aprobación de ${list}.`,
  };
}

/* --------------------------------------------------------------- workflows */

/**
 * The process definitions.
 *
 * Steps are declarative — id, label, type, responsible role, SLA, what follows,
 * and the condition under which the step exists at all — so a different
 * institution is a different definition rather than different code. `when` is a
 * predicate over the request; a step without one is always in the route.
 */
export const workflows = {
  compra: {
    id: "compra",
    label: "Solicitud de compra",
    short: "Compra",
    sla: 48,
    summary: "Adquisición de bienes o servicios con cargo a un centro de costo.",
    steps: [
      { id: "submitted", label: "Solicitud recibida", type: "inicio", role: "solicitante", next: "validation" },
      { id: "validation", label: "Validación automática", type: "automatico", role: "sistema", sla: 0.05, next: "routing" },
      { id: "routing", label: "Aplicación de reglas y asignación", type: "regla", role: "sistema", sla: 0.05, next: "managerApproval" },
      {
        id: "managerApproval",
        label: "Jefatura inmediata",
        type: "aprobacion",
        role: "jefatura",
        sla: 24,
        next: "administrationApproval",
        condition: "Monto menor a L 25,000",
        when: (request) => Number(request.amount ?? 0) < 25000,
      },
      {
        id: "administrationApproval",
        label: "Administración",
        type: "aprobacion",
        role: "administracion",
        sla: 24,
        next: "financeApproval",
        condition: "Monto igual o mayor a L 25,000",
        when: (request) => Number(request.amount ?? 0) >= 25000,
      },
      {
        id: "financeApproval",
        label: "Finanzas",
        type: "aprobacion",
        role: "finanzas",
        sla: 24,
        next: "executiveApproval",
        condition: "Monto igual o mayor a L 25,000",
        when: (request) => Number(request.amount ?? 0) >= 25000,
      },
      {
        id: "executiveApproval",
        label: "Dirección Ejecutiva",
        type: "aprobacion",
        role: "direccion",
        sla: 48,
        next: "documentGeneration",
        condition: "Monto igual o mayor a L 100,000",
        when: (request) => Number(request.amount ?? 0) >= 100000,
      },
      { id: "documentGeneration", label: "Generación de documento", type: "automatico", role: "sistema", next: "notification" },
      { id: "notification", label: "Notificación al solicitante", type: "automatico", role: "sistema", next: "completed" },
      { id: "completed", label: "Archivo y trazabilidad", type: "cierre", role: "sistema", next: null },
    ],
  },

  vacaciones: {
    id: "vacaciones",
    label: "Solicitud de vacaciones",
    short: "Permisos y vacaciones",
    sla: 24,
    summary: "Días de descanso, permisos y licencias del personal.",
    steps: [
      { id: "submitted", label: "Solicitud recibida", type: "inicio", role: "solicitante", next: "validation" },
      { id: "validation", label: "Verificación de saldo de días", type: "automatico", role: "sistema", sla: 0.05, next: "managerApproval" },
      { id: "managerApproval", label: "Jefatura inmediata", type: "aprobacion", role: "jefatura", sla: 12, next: "hrApproval" },
      { id: "hrApproval", label: "Recursos Humanos", type: "aprobacion", role: "rrhh", sla: 12, next: "documentGeneration" },
      { id: "documentGeneration", label: "Constancia de autorización", type: "automatico", role: "sistema", next: "completed" },
      { id: "completed", label: "Registro en expediente", type: "cierre", role: "sistema", next: null },
    ],
  },

  viaticos: {
    id: "viaticos",
    label: "Solicitud de viáticos",
    short: "Viáticos",
    sla: 24,
    summary: "Anticipo de gastos de misión y su posterior liquidación.",
    steps: [
      { id: "submitted", label: "Solicitud recibida", type: "inicio", role: "solicitante", next: "validation" },
      { id: "validation", label: "Validación de destino y tarifas", type: "automatico", role: "sistema", sla: 0.05, next: "managerApproval" },
      { id: "managerApproval", label: "Jefatura inmediata", type: "aprobacion", role: "jefatura", sla: 8, next: "administrationApproval" },
      { id: "administrationApproval", label: "Administración", type: "aprobacion", role: "administracion", sla: 8, next: "financeApproval" },
      { id: "financeApproval", label: "Finanzas", type: "aprobacion", role: "finanzas", sla: 8, next: "settlement" },
      { id: "settlement", label: "Liquidación", type: "cierre", role: "liquidacion", sla: 72, next: null },
    ],
  },
};

/**
 * The route one specific request takes through a definition.
 *
 * Filtering on `when` is the entire engine: the same ten steps produce a
 * one-approval circuit for a small purchase and a three-approval circuit for a
 * large one, with no second definition and no branch in the interface.
 */
export function routeFor(workflowId, request = {}) {
  const workflow = workflows[workflowId];
  return workflow ? workflow.steps.filter((step) => !step.when || step.when(request)) : [];
}

/** Just the human approval stops of a route. */
export const approvalsFor = (workflowId, request) =>
  routeFor(workflowId, request).filter((step) => step.type === "aprobacion");

/* --------------------------------------------------------------- processes */

/** The six entry points of the module. Only `compra` runs end to end. */
export const processes = [
  { index: "01", id: "compra", title: "Solicitud de compra", icon: "doc", text: "Bienes, servicios y suministros con cargo a un centro de costo.", full: true },
  { index: "02", id: "vacaciones", title: "Permisos y vacaciones", icon: "people", text: "Días de descanso, permisos y licencias del personal.", mini: true },
  { index: "03", id: "viaticos", title: "Viáticos", icon: "map", text: "Anticipo de gastos de misión y liquidación posterior.", mini: true },
  { index: "04", id: "proveedores", title: "Proveedores", icon: "book", text: "Alta, renovación y expediente documental de proveedores." },
  { index: "05", id: "mantenimiento", title: "Mantenimiento", icon: "bolt", text: "Reportes de infraestructura, equipos y servicios generales." },
  { index: "06", id: "administrativa", title: "Solicitud administrativa", icon: "edit", text: "Constancias, autorizaciones y trámites internos del personal." },
];

/** One engine, twelve processes. None of these is a separate system. */
export const engineProcesses = [
  { title: "Compras", text: "Requerimiento, cotización y autorización de gasto." },
  { title: "Vacaciones", text: "Saldo de días, reemplazo y constancia." },
  { title: "Viáticos", text: "Anticipo, misión y liquidación." },
  { title: "Reembolsos", text: "Comprobantes, revisión y pago." },
  { title: "Proveedores", text: "Alta, expediente y renovación." },
  { title: "Mantenimiento", text: "Reporte, asignación y cierre técnico." },
  { title: "Tecnología", text: "Accesos, equipos e incidencias." },
  { title: "Correspondencia", text: "Recepción, derivación y respuesta." },
  { title: "Documentos", text: "Elaboración, revisión y firma." },
  { title: "Contratación", text: "Requerimiento de personal y selección." },
  { title: "Constancias", text: "Solicitud, emisión y verificación." },
  { title: "Autorizaciones", text: "Permisos internos y excepciones." },
];

/* --------------------------------------------------------------------- SLA */

export const slaTargets = [
  { type: "Compras", hours: 48, note: "Desde el registro hasta la última autorización." },
  { type: "Viáticos", hours: 24, note: "El anticipo debe resolverse antes de la misión." },
  { type: "Permisos y vacaciones", hours: 24, note: "Jefatura y Recursos Humanos en el mismo día hábil." },
  { type: "Proveedores", hours: 72, note: "Incluye la revisión del expediente documental." },
  { type: "Mantenimiento", hours: 24, note: "La prioridad alta escala a las 8 horas." },
];

/** The share of the target beyond which a request is flagged before it expires. */
export const SLA_WARNING = 0.75;

/**
 * Where a request stands against its target.
 *
 * Three outcomes, and the third is the interesting one: an expired target does
 * not merely turn red, it escalates — which is the behaviour this module exists
 * to demonstrate.
 */
export function slaStatus(request, now = DEMO_NOW) {
  const target = request.sla ?? workflows[request.workflow]?.sla ?? 48;

  if (!states[request.state]?.open) {
    return {
      level: "closed",
      target,
      label: "Resuelta",
      detail: request.resolved ? `Resuelta en ${duration(request.resolved)}` : "Fuera de seguimiento",
      short: request.resolved ? duration(request.resolved) : "—",
    };
  }

  const elapsed = hoursBetween(request.opened, now);
  const remaining = target - elapsed;

  if (remaining <= 0) {
    return {
      level: "over",
      target,
      elapsed,
      remaining,
      label: "SLA excedido",
      detail: `Excedido por ${duration(-remaining)}`,
      short: `+${duration(-remaining)}`,
    };
  }

  if (remaining <= target * (1 - SLA_WARNING)) {
    return {
      level: "warn",
      target,
      elapsed,
      remaining,
      label: "Próxima a vencer",
      detail: `Quedan ${duration(remaining)}`,
      short: duration(remaining),
    };
  }

  return {
    level: "ok",
    target,
    elapsed,
    remaining,
    label: "Dentro del tiempo objetivo",
    detail: `Quedan ${duration(remaining)}`,
    short: duration(remaining),
  };
}

/* ----------------------------------------------------------- the request */

/** The request the visitor fills in, submits and follows to the end. */
export const featured = {
  code: "SOL-2026-0148",
  workflow: "compra",
  type: "Compra de bienes",
  requester: "Alejandro Rivera",
  email: "alejandro.rivera@demo.local",
  area: "Administración",
  position: "Coordinación Administrativa",
  concept: "3 computadoras portátiles",
  detail: "Adquisición de tres computadoras portátiles.",
  amount: 58500,
  costCentre: "Administración General",
  priority: "Normal",
  justification: "Renovación de equipo utilizado por el personal administrativo.",
  supplier: "Tecnología Central S.A.",
  attachment: "Cotizacion_Equipos.pdf",
  attachmentSize: "412 KB",
  opened: "2026-08-30T10:31",
  sla: 48,
  verification: "VFY-260830-0148",
  document: "SOL-2026-0148.pdf",
};

/** The options the form offers, so the select and the register agree. */
export const formOptions = {
  types: ["Compra de bienes", "Compra de servicios", "Suministros", "Mantenimiento"],
  costCentres: ["Administración General", "Secretaría Técnica", "Tecnología", "Servicios Generales", "Planificación"],
  priorities: ["Baja", "Normal", "Alta"],
  areas: ["Administración", "Planificación", "Tecnología", "Servicios Generales", "Estadística", "Comunicación"],
};

/** What the capture assistant "reads" out of the attached quotation. */
export const extraction = {
  file: featured.attachment,
  size: featured.attachmentSize,
  note: "Extracción simulada para fines demostrativos.",
  fields: [
    { key: "supplier", label: "Proveedor", value: "Tecnología Central S.A." },
    { key: "date", label: "Fecha del documento", value: "28/08/2026" },
    { key: "amount", label: "Monto", value: "58500" , display: "L 58,500.00" },
    { key: "concept", label: "Concepto", value: "3 computadoras portátiles" },
  ],
};

/* ------------------------------------------------------------- the register */

/**
 * Fifteen requests, invented.
 *
 * `opened` and `resolved` are what make the register behave: the SLA column is
 * computed from them against `DEMO_NOW`, so the table shows one request past
 * its target, two approaching it and the rest comfortably inside — the spread a
 * real register has, rather than a column of identical green badges.
 */
export const requests = [
  { code: "SOL-2026-0148", workflow: "compra", type: "Compra", concept: "3 computadoras portátiles", requester: "Alejandro Rivera", area: "Administración", amount: 58500, responsible: "administracion", state: "aprobacion", opened: "2026-08-30T10:31", sla: 48, featured: true },
  { code: "SOL-2026-0147", workflow: "viaticos", type: "Viáticos", concept: "Misión técnica a Comayagua", requester: "Lucía Fernández", area: "Planificación", amount: 8200, responsible: "finanzas", state: "aprobada", opened: "2026-08-29T08:14", sla: 24, resolved: 19.5 },
  { code: "SOL-2026-0146", workflow: "compra", type: "Mantenimiento", concept: "Reparación de aire acondicionado", requester: "Óscar Padilla", area: "Servicios Generales", amount: 12400, responsible: "jefatura", state: "recibida", opened: "2026-08-30T04:52", sla: 24 },
  { code: "SOL-2026-0145", workflow: "vacaciones", type: "Permisos", concept: "Vacaciones del 12 al 23 de octubre", requester: "Daniela Cruz", area: "Comunicación", amount: null, responsible: "rrhh", state: "aprobada", opened: "2026-08-28T09:40", sla: 24, resolved: 13.2 },
  { code: "SOL-2026-0144", workflow: "compra", type: "Compra", concept: "Licencias ofimáticas (25 puestos)", requester: "Marcela Zúniga", area: "Tecnología", amount: 104300, responsible: "direccion", state: "aprobacion", opened: "2026-08-28T15:22", sla: 48 },
  { code: "SOL-2026-0143", workflow: "compra", type: "Proveedores", concept: "Alta de proveedor de imprenta", requester: "Rodrigo Salgado", area: "Administración", amount: null, responsible: "administracion", state: "validacion", opened: "2026-08-29T16:48", sla: 72 },
  { code: "SOL-2026-0142", workflow: "compra", type: "Compra", concept: "Mobiliario de archivo", requester: "Karla Núñez", area: "Estadística", amount: 31900, responsible: "administracion", state: "vencida", opened: "2026-08-28T10:08", sla: 48, escalated: true },
  { code: "SOL-2026-0141", workflow: "viaticos", type: "Viáticos", concept: "Taller regional en Choluteca", requester: "Iván Bustillo", area: "Estadística", amount: 6450, responsible: "administracion", state: "aprobada", opened: "2026-08-26T11:30", sla: 24, resolved: 15.8 },
  { code: "SOL-2026-0140", workflow: "compra", type: "Compra", concept: "Suministros de oficina del trimestre", requester: "Patricia Andino", area: "Servicios Generales", amount: 18700, responsible: "jefatura", state: "finalizada", opened: "2026-08-26T08:02", sla: 48, resolved: 21.4 },
  { code: "SOL-2026-0139", workflow: "compra", type: "Mantenimiento", concept: "Cambio de luminarias del segundo nivel", requester: "Óscar Padilla", area: "Servicios Generales", amount: 9800, responsible: "administracion", state: "finalizada", opened: "2026-08-25T14:15", sla: 24, resolved: 18.9 },
  { code: "SOL-2026-0138", workflow: "vacaciones", type: "Administrativa", concept: "Constancia laboral", requester: "Jorge Medina", area: "Planificación", amount: null, responsible: "rrhh", state: "finalizada", opened: "2026-08-25T09:55", sla: 24, resolved: 4.6 },
  { code: "SOL-2026-0137", workflow: "compra", type: "Compra", concept: "Servidor de respaldo y almacenamiento", requester: "Marcela Zúniga", area: "Tecnología", amount: 147000, responsible: "administracion", state: "cambios", opened: "2026-08-29T09:12", sla: 48 },
  { code: "SOL-2026-0136", workflow: "vacaciones", type: "Permisos", concept: "Permiso por estudio", requester: "Andrea Lagos", area: "Comunicación", amount: null, responsible: "jefatura", state: "aprobada", opened: "2026-08-24T10:20", sla: 24, resolved: 9.1 },
  { code: "SOL-2026-0135", workflow: "compra", type: "Proveedores", concept: "Renovación de contrato de limpieza", requester: "Rodrigo Salgado", area: "Administración", amount: 42000, responsible: "finanzas", state: "rechazada", opened: "2026-08-23T13:40", sla: 72, resolved: 44.2 },
  { code: "SOL-2026-0134", workflow: "viaticos", type: "Viáticos", concept: "Sesión de Consejo en San Pedro Sula", requester: "Lucía Fernández", area: "Planificación", amount: 5300, responsible: "liquidacion", state: "finalizada", opened: "2026-08-23T07:50", sla: 24, resolved: 16.3 },
];

export const requestBy = (code) => requests.find((item) => item.code === code);

export const requestTypes = [...new Set(requests.map((item) => item.type))].sort();
export const requestAreas = [...new Set(requests.map((item) => item.area))].sort();

/* --------------------------------------------------------------- dashboard */

export const kpis = [
  { label: "Solicitudes del mes", value: "148", note: "Agosto de 2026" },
  { label: "Pendientes", value: "12", note: "Con responsable asignado" },
  { label: "Tiempo medio de resolución", value: "1.8", sup: "días", note: "Media de las 136 resueltas" },
  { label: "Dentro del tiempo objetivo", value: "94", sup: "%", note: "Nueve excedieron el plazo" },
];

export const byState = [
  { key: "aprobada", label: "Aprobadas", value: 92 },
  { key: "aprobacion", label: "En proceso", value: 31 },
  { key: "recibida", label: "Pendientes", value: 12 },
  { key: "rechazada", label: "Rechazadas", value: 13 },
];

/* ------------------------------------------------------------ the approvals */

/** The two authorisations SOL-2026-0148 needs, and what each one records. */
export const approvals = [
  {
    step: "administrationApproval",
    role: "administracion",
    name: "María López",
    area: "Dirección Administrativa",
    initials: "ML",
    date: "30 de agosto de 2026",
    time: "10:42",
    comment: "Solicitud conforme a los requerimientos administrativos.",
  },
  {
    step: "financeApproval",
    role: "finanzas",
    name: "Carlos Mejía",
    area: "Jefatura de Finanzas",
    initials: "CM",
    date: "30 de agosto de 2026",
    time: "11:18",
    comment: "Existe disponibilidad en el centro de costo Administración General.",
  },
];

/* ------------------------------------------------------------------ audit */

/**
 * The trail.
 *
 * The brief marks this as the most important section, and the reasoning is
 * sound: a workflow that cannot be audited is a workflow no institution will
 * adopt. Every entry names an actor, an action and a minute.
 */
export const auditTrail = [
  { time: "10:31", actor: "Alejandro Rivera", kind: "person", title: "Solicitud creada", text: "Registro de la solicitud SOL-2026-0148 con un documento adjunto." },
  { time: "10:31", actor: "Sistema", kind: "system", title: "Validación automática completada", text: "Campos obligatorios, adjunto, centro de costo y monto verificados." },
  { time: "10:31", actor: "Sistema", kind: "rule", title: "Regla de monto aplicada", text: "L 58,500.00 supera el umbral de L 25,000: se requieren dos autorizaciones." },
  { time: "10:32", actor: "Sistema", kind: "system", title: "Asignada a Administración", text: "Responsable: María López · tiempo objetivo 24 horas." },
  { time: "10:42", actor: "María López", kind: "approval", title: "Administración aprobó", text: "«Solicitud conforme a los requerimientos administrativos.»" },
  { time: "10:42", actor: "Sistema", kind: "system", title: "Asignada a Finanzas", text: "Responsable: Carlos Mejía · tiempo objetivo 24 horas." },
  { time: "11:18", actor: "Carlos Mejía", kind: "approval", title: "Finanzas aprobó", text: "«Existe disponibilidad en el centro de costo Administración General.»" },
  { time: "11:18", actor: "Sistema", kind: "document", title: "Documento generado", text: "SOL-2026-0148.pdf · código de verificación VFY-260830-0148." },
  { time: "11:19", actor: "Sistema", kind: "system", title: "Notificación preparada", text: "Destinatario: alejandro.rivera@demo.local · envío simulado." },
  { time: "11:19", actor: "Sistema", kind: "system", title: "Proceso finalizado", text: "Expediente archivado con su historial completo." },
];

/** What the closing sequence runs once the last approval lands. */
export const closingSteps = [
  { label: "Actualización de estado", detail: "En aprobación → Aprobada" },
  { label: "Generación de documento", detail: "SOL-2026-0148.pdf" },
  { label: "Registro en bitácora", detail: "10 asientos de auditoría" },
  { label: "Preparación de notificación", detail: "1 destinatario" },
  { label: "Archivo", detail: "Expediente 2026 · Administración" },
];

/** The message the requester would receive. Nothing is ever sent. */
export const notification = {
  to: featured.email,
  subject: `Solicitud ${featured.code} aprobada`,
  body:
    "Su solicitud ha completado el flujo de aprobación. Puede consultar el expediente " +
    "completo, las autorizaciones registradas y el documento generado desde el portal.",
  tag: "Simulación",
};

/* ------------------------------------------------------------- escalation */

export const escalation = {
  code: "SOL-2026-0142",
  responsible: "Administración",
  sla: 48,
  elapsed: "49h 12m",
  outcome: "Escalamiento automático",
  detail: "Dirección Administrativa notificada.",
  note:
    "Cuando una solicitud supera su tiempo objetivo, el motor la eleva al siguiente nivel de " +
    "responsabilidad y deja constancia del escalamiento en el historial del expediente.",
};

/* ---------------------------------------------------------- documentation */

export const documentPipeline = [
  { label: "Recibir", text: "Entrada por formulario, correo o ventanilla." },
  { label: "Registrar", text: "Número único, fecha y responsable." },
  { label: "Asignar", text: "Derivación por regla, no por criterio." },
  { label: "Revisar", text: "Observaciones dentro del expediente." },
  { label: "Aprobar", text: "Autorización con constancia nominal." },
  { label: "Generar", text: "Documento final con código de verificación." },
  { label: "Archivar", text: "Expediente cerrado y consultable." },
];

export const documentPipelineNote =
  "La misma arquitectura puede utilizarse para expedientes, correspondencia, resoluciones, " +
  "constancias y otros procesos documentales.";

/* ---------------------------------------------------------- before / after */

export const beforeAfter = {
  before: {
    label: "Antes",
    items: ["Correos", "WhatsApp", "Excel", "Documentos dispersos", "Seguimiento manual", "Sin trazabilidad"],
  },
  after: {
    label: "Después",
    items: [
      "Formulario centralizado",
      "Responsables automáticos",
      "Aprobaciones con constancia",
      "Control de tiempos",
      "Documentos generados",
      "Historial completo",
    ],
  },
};

export const impact = [
  { value: "−65 %", label: "Tiempo de procesamiento" },
  { value: "−80 %", label: "Seguimiento manual" },
  { value: "100 %", label: "Solicitudes trazables" },
  { value: "24/7", label: "Consulta de estado" },
];

export const impactNote =
  "Ejemplo ilustrativo del tipo de indicadores que una organización podría medir tras " +
  "digitalizar sus procesos.";

/* -------------------------------------------------------------- mini demos */

/** The two processes that prove the engine is not a single-purpose form. */
export const miniDemos = {
  vacaciones: {
    id: "vacaciones",
    title: "Solicitud de vacaciones",
    lead: "El mismo motor, otro formulario y otra cadena de autorización.",
    fields: [
      { label: "Empleado", value: "Daniela Cruz" },
      { label: "Fecha de inicio", value: "12 de octubre de 2026" },
      { label: "Fecha final", value: "23 de octubre de 2026" },
      { label: "Días solicitados", value: "10 días hábiles" },
      { label: "Reemplazo", value: "Andrea Lagos" },
      { label: "Comentario", value: "Saldo disponible: 18 días." },
    ],
    chain: ["Empleado", "Jefatura", "RR. HH.", "Aprobado"],
  },
  viaticos: {
    id: "viaticos",
    title: "Solicitud de viáticos",
    lead: "Cinco pasos, y dos de ellos ocurren después del viaje.",
    fields: [
      { label: "Destino", value: "Comayagua" },
      { label: "Fecha", value: "9 y 10 de septiembre de 2026" },
      { label: "Motivo", value: "Levantamiento de información en centros educativos" },
      { label: "Monto", value: "L 8,200.00" },
      { label: "Proyecto", value: "Serie estadística 2026" },
      { label: "Adjuntos", value: "Agenda_Mision.pdf" },
    ],
    chain: ["Solicitante", "Jefatura", "Administración", "Finanzas", "Liquidación"],
  },
};

/* ------------------------------------------------------------ persistence */

/** The one key the module writes. `Reiniciar demo` removes exactly this. */
export const STORAGE_KEY = "cede:gestion:v1";
