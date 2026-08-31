/**
 * The operations log: every pedido, entrega, pago and ajuste that touched a
 * client account. `clientSlug` points at a record in `clients.js` — the
 * build resolves the name rather than storing it twice, so the two files
 * cannot quietly disagree about who a client is.
 *
 * Ordered newest first, against the frozen `RUMBO_TODAY` in `company.js`.
 * The dashboard's "Actividad reciente" is the first six of this list.
 */

export const operations = [
  { code: "OP-4821", date: "2026-08-24T09:12", type: "Pedido", clientSlug: "minimarket-la-terminal", responsible: "Óscar Reyes", amount: 9800, status: "Completado" },
  { code: "OP-4820", date: "2026-08-24T08:40", type: "Pago", clientSlug: "abarroteria-puerto", responsible: "Wendy Paz", amount: 5000, status: "Pendiente" },
  { code: "OP-4819", date: "2026-08-24T08:05", type: "Entrega", clientSlug: "super-la-economia", responsible: "Julio Cálix", amount: 22800, status: "Completado" },
  { code: "OP-4818", date: "2026-08-23T17:22", type: "Pedido", clientSlug: "minimarket-villanueva", responsible: "Katherine Suazo", amount: 6700, status: "Completado" },
  { code: "OP-4817", date: "2026-08-23T15:48", type: "Ajuste", clientSlug: "pulperia-el-progreso", responsible: "Wendy Paz", amount: -1200, status: "Completado" },
  { code: "OP-4816", date: "2026-08-23T11:30", type: "Entrega", clientSlug: "minimarket-la-terminal", responsible: "Julio Cálix", amount: 9800, status: "Completado" },
  { code: "OP-4815", date: "2026-08-22T16:05", type: "Pedido", clientSlug: "super-la-economia", responsible: "Óscar Reyes", amount: 22800, status: "Completado" },
  { code: "OP-4814", date: "2026-08-22T10:52", type: "Pago", clientSlug: "pulperia-dona-chinda", responsible: "Wendy Paz", amount: 4000, status: "Cancelado" },
  { code: "OP-4813", date: "2026-08-21T14:37", type: "Pedido", clientSlug: "minimarket-la-terminal", responsible: "Óscar Reyes", amount: 9800, status: "Completado" },
  { code: "OP-4812", date: "2026-08-21T09:15", type: "Entrega", clientSlug: "minimarket-villanueva", responsible: "Julio Cálix", amount: 5900, status: "Completado" },
  { code: "OP-4811", date: "2026-08-20T13:02", type: "Pago", clientSlug: "pulperia-el-progreso", responsible: "Wendy Paz", amount: 8000, status: "Completado" },
  { code: "OP-4810", date: "2026-08-19T16:41", type: "Pedido", clientSlug: "abarroteria-puerto", responsible: "Óscar Reyes", amount: 8300, status: "Completado" },
  { code: "OP-4809", date: "2026-08-19T09:28", type: "Pedido", clientSlug: "minimarket-villanueva", responsible: "Katherine Suazo", amount: 6700, status: "Completado" },
  { code: "OP-4808", date: "2026-08-18T15:10", type: "Ajuste", clientSlug: "minimarket-la-terminal", responsible: "Fabiola Núñez", amount: 350, status: "Completado" },
  { code: "OP-4807", date: "2026-08-15T11:47", type: "Entrega", clientSlug: "super-la-economia", responsible: "Julio Cálix", amount: 19400, status: "Completado" },
  { code: "OP-4806", date: "2026-08-15T08:33", type: "Pedido", clientSlug: "super-la-economia", responsible: "Óscar Reyes", amount: 19400, status: "Completado" },
];

export const OPERATION_STATUS_PILL = {
  Completado: "ok",
  Pendiente: "warn",
  Cancelado: "bad",
};
