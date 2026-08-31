/**
 * Internal staff and the roles that gate what they can touch. The two
 * vendedores here are the same "Óscar Reyes" and "Katherine Suazo" who show
 * up as `seller` on the client records in `clients.js` — a user and an
 * expediente both point at the same person on purpose.
 */

export const users = [
  {
    name: "Marlon Estrada",
    role: "Administrador",
    area: "Dirección",
    email: "marlon.estrada@rumbo-demo.hn",
    status: "activo",
    lastAccess: "2026-08-24",
  },
  {
    name: "Fabiola Núñez",
    role: "Supervisor de ventas",
    area: "Valle de Sula",
    email: "fabiola.nunez@rumbo-demo.hn",
    status: "activo",
    lastAccess: "2026-08-24",
  },
  {
    name: "Óscar Reyes",
    role: "Vendedor",
    area: "San Pedro Sula, Choloma, Puerto Cortés",
    email: "oscar.reyes@rumbo-demo.hn",
    status: "activo",
    lastAccess: "2026-08-23",
  },
  {
    name: "Katherine Suazo",
    role: "Vendedor",
    area: "El Progreso, Villanueva, La Lima",
    email: "katherine.suazo@rumbo-demo.hn",
    status: "activo",
    lastAccess: "2026-08-24",
  },
  {
    name: "Julio Cálix",
    role: "Bodega",
    area: "Centro de distribución",
    email: "julio.calix@rumbo-demo.hn",
    status: "activo",
    lastAccess: "2026-08-22",
  },
  {
    name: "Wendy Paz",
    role: "Cobranza",
    area: "Cartera vencida",
    email: "wendy.paz@rumbo-demo.hn",
    status: "activo",
    lastAccess: "2026-08-24",
  },
  {
    name: "Diego Handal",
    role: "Vendedor",
    area: "Zona norte — en incorporación",
    email: "diego.handal@rumbo-demo.hn",
    status: "invitado",
    lastAccess: null,
  },
  {
    name: "Sandra Bustillo",
    role: "Bodega",
    area: "Centro de distribución",
    email: "sandra.bustillo@rumbo-demo.hn",
    status: "suspendido",
    lastAccess: "2026-06-30",
  },
];

export const USER_STATUS_LABEL = {
  activo: "Activo",
  invitado: "Invitado",
  suspendido: "Suspendido",
};

export const USER_STATUS_PILL = {
  activo: "ok",
  invitado: "info",
  suspendido: "bad",
};

/** A permission a role either has or does not — the matrix `usuarios.html`
    renders below the staff table. */
export const permissions = ["Ver expedientes", "Editar expedientes", "Aprobar crédito", "Gestionar usuarios", "Ver reportes"];

export const roles = [
  { role: "Administrador", grants: [true, true, true, true, true] },
  { role: "Supervisor de ventas", grants: [true, true, true, false, true] },
  { role: "Vendedor", grants: [true, true, false, false, false] },
  { role: "Cobranza", grants: [true, false, false, false, true] },
  { role: "Bodega", grants: [true, false, false, false, false] },
];
