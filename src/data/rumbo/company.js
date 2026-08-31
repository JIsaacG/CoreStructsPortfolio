/**
 * Rumbo — the fictitious wholesale distributor behind the "Sistemas
 * empresariales" card. It sells consumer goods to independent corner stores
 * (pulperías, minimarkets) across the Valle de Sula, and the demo is the
 * internal panel its own staff would use: who owes what, who is assigned
 * where, and what happened today.
 *
 * The clock is frozen, same reasoning as Flujo's `DEMO_NOW`: with a real
 * `Date.now()` every balance and "hace X días" would drift out of sync with
 * itself a week after this was written. `RUMBO_TODAY` is what "hoy" means
 * everywhere in this demo.
 */

export const RUMBO_TODAY = "2026-08-24";

export const brand = {
  name: "Rumbo",
  legalName: "Rumbo Distribución, S. de R.L.",
  tagline: "Distribución mayorista",
  sector: "Distribuidora de consumo masivo — ficticia",
  founded: 2011,
  hq: "San Pedro Sula, Cortés",
};

export const navigation = [
  { id: "panel", label: "Panel", href: "index.html" },
  { id: "expedientes", label: "Expedientes", href: "expedientes.html" },
  { id: "usuarios", label: "Usuarios", href: "usuarios.html" },
  { id: "operaciones", label: "Operaciones", href: "operaciones.html" },
];

/** The four dashboard tiles. `delta` is against the same day last week. */
export const kpis = [
  { label: "Pedidos hoy", value: "27", delta: "+4 vs. semana pasada", direction: "up" },
  { label: "Cartera por cobrar", value: "L 486,200", delta: "12 clientes en mora", direction: "down" },
  { label: "Clientes activos", value: "184", delta: "+6 este mes", direction: "up" },
  { label: "Entregas en ruta", value: "9", delta: "3 rutas, 2 zonas", direction: "up" },
];

/** Six weeks of one series, in lempiras. Written by hand, not generated —
    a chart whose numbers change on every rebuild is not one anyone can
    review twice and compare notes on. */
export const weeklySales = [
  { label: "Sem. 1", amount: 612000 },
  { label: "Sem. 2", amount: 588000 },
  { label: "Sem. 3", amount: 671000 },
  { label: "Sem. 4", amount: 705000 },
  { label: "Sem. 5", amount: 664000 },
  { label: "Sem. 6", amount: 742000 },
];
