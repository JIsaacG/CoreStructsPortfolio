/**
 * Renders the Rumbo internal-systems demo into `demos/rumbo/`.
 *
 * Rumbo is the demo behind the "Sistemas empresariales" card: a small
 * wholesale distributor's own back office — a dashboard, the client register
 * (expedientes), the staff and their roles, and the operations log — built to
 * show a business owner the kind of internal tool CoreStruct builds, not only
 * the site the public sees.
 *
 * Same contract as the rest of the site: content lives in `src/data/rumbo/`,
 * markup is emitted here at build time, and the output is static HTML with
 * the register already in it. `npm run build:rumbo`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { brand, kpis, RUMBO_TODAY, weeklySales } from "../src/data/rumbo/company.js";
import { clients, STATUS_LABEL, STATUS_PILL } from "../src/data/rumbo/clients.js";
import { operations, OPERATION_STATUS_PILL } from "../src/data/rumbo/operations.js";
import { escape, longDate, money, shortDate } from "../src/data/rumbo/format.js";
import { permissions, roles, users, USER_STATUS_LABEL, USER_STATUS_PILL } from "../src/data/rumbo/users.js";
import { asset, clientHref, context, document_, ORIGIN, page } from "./rumbo/shell.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "rumbo");

const clientBySlug = new Map(clients.map((client) => [client.slug, client]));

/* ------------------------------------------------------------------ pieces */

const pill = (label, kind) => `<span class="dm-pill dm-pill--${kind}">${escape(label)}</span>`;

const docIcon =
  '<svg class="dm-doc__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" ' +
  'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M4 2.2h5l3 3v8.6H4z"/><path d="M9 2.2v3h3"/></svg>';

function statTiles() {
  const tiles = kpis
    .map(
      (kpi) => `          <div class="dm-stat">
            <p class="dm-stat__label">${escape(kpi.label)}</p>
            <p class="dm-stat__value">${escape(kpi.value)}</p>
            <p class="dm-stat__delta dm-stat__delta--${kpi.direction}">${escape(kpi.delta)}</p>
          </div>`,
    )
    .join("\n");
  return `        <div class="dm-stats" data-reveal-group="80">\n${tiles}\n        </div>`;
}

function barChart() {
  const max = Math.max(...weeklySales.map((week) => week.amount));
  const bars = weeklySales
    .map((week) => {
      const heightPct = Math.max(6, Math.round((week.amount / max) * 100));
      return `            <div class="dm-chart__bar" title="${escape(week.label)}: ${escape(money(week.amount))}">
              <div class="dm-chart__fill" style="--bar-height:${heightPct}%"></div>
              <span class="dm-chart__label">${escape(week.label)}</span>
            </div>`;
    })
    .join("\n");
  return `          <div class="dm-chart">\n${bars}\n          </div>`;
}

function activityFeed(ctx, entries) {
  const items = entries
    .map((op) => {
      const client = clientBySlug.get(op.clientSlug);
      return `            <li class="dm-feed__item">
              <span class="dm-feed__dot" aria-hidden="true"></span>
              <span class="dm-feed__body">
                <span class="dm-feed__text">${escape(op.type)} — <a class="dm-table__link" href="${clientHref(ctx, op.clientSlug)}">${escape(client?.name ?? "Cliente")}</a></span>
                <span class="dm-feed__meta">${escape(op.responsible)} · ${escape(money(op.amount))}</span>
              </span>
              <span class="dm-feed__when">${escape(shortDate(op.date))}</span>
            </li>`;
    })
    .join("\n");
  return `          <ul class="dm-feed">\n${items}\n          </ul>`;
}

/* -------------------------------------------------------------------- pages */

function homePage(ctx) {
  const body = `      <div class="dm-page-head dm-shell">
        <div class="dm-page-head__row">
          <div>
            <h1 class="dm-page-head__title" data-reveal="fade">Panel</h1>
            <p class="dm-page-head__text" data-reveal="fade">
              ${escape(brand.legalName)} · hoy es ${escape(longDate(RUMBO_TODAY))}
            </p>
          </div>
        </div>
      </div>

      <div class="dm-section dm-shell">
${statTiles()}

        <div class="dm-panels dm-panels--split" style="margin-block-start: var(--space-lg)">
          <div class="dm-panel" data-reveal="rise">
            <h2 class="dm-panel__title">Ventas de las últimas 6 semanas</h2>
${barChart()}
          </div>
          <div class="dm-panel" data-reveal="rise">
            <h2 class="dm-panel__title">Actividad reciente</h2>
${activityFeed(ctx, operations.slice(0, 6))}
          </div>
        </div>
      </div>`;

  return {
    meta: {
      title: `Panel — ${brand.name}`,
      description: `Panel interno de ${brand.legalName}: pedidos, cartera por cobrar, clientes activos y entregas del día.`,
    },
    current: "panel",
    body,
  };
}

function clientsIndexPage(ctx) {
  const filterButtons = [
    { value: "all", label: "Todos" },
    { value: "al-dia", label: "Al día" },
    { value: "mora", label: "En mora" },
    { value: "bloqueado", label: "Bloqueado" },
  ]
    .map(
      ({ value, label }) =>
        `            <button type="button" class="dm-filter" data-filter="${value}" aria-pressed="${value === "all"}">${escape(label)}</button>`,
    )
    .join("\n");

  const rows = clients
    .map((client) => {
      const search = `${client.name} ${client.zone}`.toLowerCase();
      return `            <tr data-row data-filterval="${client.status}" data-search="${escape(search)}">
              <td>
                <a class="dm-table__link" href="${clientHref(ctx, client.slug)}">${escape(client.name)}</a>
                <span class="dm-table__sub">${escape(client.zone)}</span>
              </td>
              <td>${escape(client.seller)}</td>
              <td data-numeric>${escape(money(client.balance))}</td>
              <td>${pill(STATUS_LABEL[client.status], STATUS_PILL[client.status])}</td>
            </tr>`;
    })
    .join("\n");

  const body = `      <div class="dm-page-head dm-shell">
        <h1 class="dm-page-head__title" data-reveal="fade">Expedientes</h1>
        <p class="dm-page-head__text" data-reveal="fade">
          ${clients.length} clientes de muestra sobre una cartera de 184. Cada fila abre la ficha completa: contacto, historial de pedidos, notas de visita y documentos.
        </p>
      </div>

      <div class="dm-section dm-shell" data-table>
        <div class="dm-toolbar">
          <div class="dm-filterbar" data-filter-group>
${filterButtons}
          </div>
          <input class="dm-search" type="search" data-search placeholder="Buscar por cliente o zona…" aria-label="Buscar expediente" />
        </div>

        <div class="dm-table-wrap">
          <table class="dm-table">
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Vendedor</th>
                <th scope="col" data-numeric>Saldo</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
          <p class="dm-table-empty" data-table-empty>Ningún expediente coincide con ese filtro.</p>
        </div>
      </div>`;

  return {
    meta: {
      title: `Expedientes — ${brand.name}`,
      description: `Registro de clientes de ${brand.name}: saldo, vendedor asignado y estado de cuenta.`,
    },
    current: "expedientes",
    body,
  };
}

function clientPage(ctx, client) {
  const orderRows = client.orders
    .map(
      (order) => `                  <tr>
                    <td>${escape(shortDate(order.date))}</td>
                    <td>${escape(order.code)}</td>
                    <td data-numeric>${escape(money(order.amount))}</td>
                    <td>${pill(order.status, order.status === "Entregado" ? "ok" : order.status === "Cancelado" ? "bad" : "warn")}</td>
                  </tr>`,
    )
    .join("\n");

  const notes = client.notes
    .map(
      (note) => `            <li class="dm-note-card">
              <span class="dm-note-card__meta">${escape(shortDate(note.date))} · ${escape(note.author)}</span>
              ${escape(note.text)}
            </li>`,
    )
    .join("\n");

  const documents = client.documents
    .map((doc) => `            <li class="dm-doc">${docIcon}${escape(doc)}</li>`)
    .join("\n");

  const body = `      <div class="dm-page-head dm-shell">
        <p class="dm-record__code" data-reveal="fade"><a class="dm-table__link" href="${page(ctx, "expedientes.html")}">Expedientes</a> / ${escape(client.name)}</p>
        <div class="dm-record__header" data-reveal="fade">
          <div>
            <h1 class="dm-record__title">${escape(client.name)}</h1>
            <p class="dm-page-head__text">${escape(client.zone)} · vendedor ${escape(client.seller)}</p>
          </div>
          ${pill(STATUS_LABEL[client.status], STATUS_PILL[client.status])}
        </div>
        <div class="dm-record__figures">
          <div>
            <p class="dm-record__figure-label">Saldo actual</p>
            <p class="dm-record__figure-value">${escape(money(client.balance))}</p>
          </div>
          <div>
            <p class="dm-record__figure-label">Límite de crédito</p>
            <p class="dm-record__figure-value">${escape(money(client.creditLimit))}</p>
          </div>
          <div>
            <p class="dm-record__figure-label">Cliente desde</p>
            <p class="dm-record__figure-value">${escape(shortDate(client.since))}</p>
          </div>
        </div>
      </div>

      <div class="dm-section dm-shell">
        <div class="dm-panels dm-panels--split">
          <div>
            <div class="dm-panel" data-reveal="rise">
              <h2 class="dm-panel__title">Historial de pedidos</h2>
              <div class="dm-table-wrap">
                <table class="dm-table">
                  <thead>
                    <tr>
                      <th scope="col">Fecha</th>
                      <th scope="col">Pedido</th>
                      <th scope="col" data-numeric>Monto</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
${orderRows}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="dm-panel" data-reveal="rise" style="margin-block-start: var(--space-md)">
              <h2 class="dm-panel__title">Notas de visita</h2>
              <ul class="dm-notes">
${notes}
              </ul>
            </div>
          </div>

          <div>
            <div class="dm-panel" data-reveal="rise">
              <h2 class="dm-panel__title">Datos de contacto</h2>
              <dl class="dm-deflist">
                <dt>Contacto</dt><dd>${escape(client.contact)}</dd>
                <dt>Teléfono</dt><dd>${escape(client.phone)}</dd>
                <dt>Dirección</dt><dd>${escape(client.address)}</dd>
                <dt>RTN</dt><dd>${escape(client.rtn)}</dd>
              </dl>
            </div>

            <div class="dm-panel" data-reveal="rise" style="margin-block-start: var(--space-md)">
              <h2 class="dm-panel__title">Documentos</h2>
              <ul class="dm-doclist">
${documents}
              </ul>
            </div>
          </div>
        </div>
      </div>`;

  return {
    meta: {
      title: `${client.name} — ${brand.name}`,
      description: `Ficha de ${client.name}, ${client.zone}: saldo, historial de pedidos y notas de visita.`,
    },
    current: "expedientes",
    body,
  };
}

function usersPage(ctx) {
  const filterButtons = [
    { value: "all", label: "Todos" },
    { value: "activo", label: "Activo" },
    { value: "invitado", label: "Invitado" },
    { value: "suspendido", label: "Suspendido" },
  ]
    .map(
      ({ value, label }) =>
        `            <button type="button" class="dm-filter" data-filter="${value}" aria-pressed="${value === "all"}">${escape(label)}</button>`,
    )
    .join("\n");

  const rows = users
    .map(
      (user) => `            <tr data-row data-filterval="${user.status}" data-search="${escape(user.name.toLowerCase())}">
              <td>${escape(user.name)}<span class="dm-table__sub">${escape(user.email)}</span></td>
              <td>${escape(user.role)}</td>
              <td>${escape(user.area)}</td>
              <td>${user.lastAccess ? escape(shortDate(user.lastAccess)) : "—"}</td>
              <td>${pill(USER_STATUS_LABEL[user.status], USER_STATUS_PILL[user.status])}</td>
            </tr>`,
    )
    .join("\n");

  const permHeadings = permissions.map((label) => `                <th scope="col">${escape(label)}</th>`).join("\n");
  const roleRows = roles
    .map((entry) => {
      const cells = entry.grants
        .map((granted) => `                  <td>${granted ? '<span data-yes>✓</span>' : '<span data-no>—</span>'}</td>`)
        .join("\n");
      return `                <tr>
                  <th scope="row">${escape(entry.role)}</th>
${cells}
                </tr>`;
    })
    .join("\n");

  const body = `      <div class="dm-page-head dm-shell">
        <h1 class="dm-page-head__title" data-reveal="fade">Usuarios</h1>
        <p class="dm-page-head__text" data-reveal="fade">
          Personal con acceso al panel, su rol y su último ingreso.
        </p>
      </div>

      <div class="dm-section dm-shell" data-table>
        <div class="dm-toolbar">
          <div class="dm-filterbar" data-filter-group>
${filterButtons}
          </div>
        </div>

        <div class="dm-table-wrap">
          <table class="dm-table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Rol</th>
                <th scope="col">Área</th>
                <th scope="col">Último acceso</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
          <p class="dm-table-empty" data-table-empty>Ningún usuario coincide con ese filtro.</p>
        </div>

        <div class="dm-panel" data-reveal="rise" style="margin-block-start: var(--space-lg)">
          <h2 class="dm-panel__title">Roles y permisos</h2>
          <div class="dm-table-wrap">
            <table class="dm-roles">
              <thead>
                <tr>
                  <th scope="col">Rol</th>
${permHeadings}
                </tr>
              </thead>
              <tbody>
${roleRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;

  return {
    meta: {
      title: `Usuarios — ${brand.name}`,
      description: `Personal de ${brand.name} con acceso al panel interno, sus roles y permisos.`,
    },
    current: "usuarios",
    body,
  };
}

function operationsPage(ctx) {
  const filterButtons = [
    { value: "all", label: "Todos" },
    { value: "Pedido", label: "Pedidos" },
    { value: "Entrega", label: "Entregas" },
    { value: "Pago", label: "Pagos" },
    { value: "Ajuste", label: "Ajustes" },
  ]
    .map(
      ({ value, label }) =>
        `            <button type="button" class="dm-filter" data-filter="${value}" aria-pressed="${value === "all"}">${escape(label)}</button>`,
    )
    .join("\n");

  const rows = operations
    .map((op) => {
      const client = clientBySlug.get(op.clientSlug);
      const search = `${client?.name ?? ""} ${op.responsible}`.toLowerCase();
      return `            <tr data-row data-filterval="${escape(op.type)}" data-search="${escape(search)}">
              <td>${escape(shortDate(op.date))}</td>
              <td>${escape(op.type)}</td>
              <td><a class="dm-table__link" href="${clientHref(ctx, op.clientSlug)}">${escape(client?.name ?? "Cliente")}</a></td>
              <td>${escape(op.responsible)}</td>
              <td data-numeric>${escape(money(op.amount))}</td>
              <td>${pill(op.status, OPERATION_STATUS_PILL[op.status])}</td>
            </tr>`;
    })
    .join("\n");

  const body = `      <div class="dm-page-head dm-shell">
        <h1 class="dm-page-head__title" data-reveal="fade">Operaciones</h1>
        <p class="dm-page-head__text" data-reveal="fade">
          Bitácora de pedidos, entregas, pagos y ajustes — lo que hoy vive repartido entre correo, WhatsApp y una hoja de cálculo.
        </p>
      </div>

      <div class="dm-section dm-shell" data-table>
        <div class="dm-toolbar">
          <div class="dm-filterbar" data-filter-group>
${filterButtons}
          </div>
          <input class="dm-search" type="search" data-search placeholder="Buscar por cliente o responsable…" aria-label="Buscar operación" />
        </div>

        <div class="dm-table-wrap">
          <table class="dm-table">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Tipo</th>
                <th scope="col">Cliente</th>
                <th scope="col">Responsable</th>
                <th scope="col" data-numeric>Monto</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
          <p class="dm-table-empty" data-table-empty>Ninguna operación coincide con ese filtro.</p>
        </div>
      </div>`;

  return {
    meta: {
      title: `Operaciones — ${brand.name}`,
      description: `Bitácora de pedidos, entregas, pagos y ajustes de ${brand.name}.`,
    },
    current: "operaciones",
    body,
  };
}

/* ------------------------------------------------------------------- write */

const written = [];

function emit(path, build) {
  const depth = path.split("/").length - 1;
  const ctx = context(depth);
  const { meta, current, body } = build(ctx);

  const html = document_({ ctx, meta, current, body });
  const file = join(OUT, ...path.split("/"));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);

  written.push({ path, bytes: Buffer.byteLength(html) });
}

emit("index.html", homePage);
emit("expedientes.html", clientsIndexPage);
emit("usuarios.html", usersPage);
emit("operaciones.html", operationsPage);

for (const client of clients) {
  emit(`expedientes/${client.slug}.html`, (ctx) => clientPage(ctx, client));
}

/* ---------------------------------------------------------------- sitemap */

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. ${brand.name} es una empresa ficticia y sus páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .map(({ path }) => {
      const loc = `${ORIGIN}/${path === "index.html" ? "" : path}`;
      const priority = path === "index.html" ? "1.0" : path.includes("/") ? "0.5" : "0.7";
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(OUT, "sitemap.xml"), sitemap);

/* ----------------------------------------------------------------- report */

const total = written.reduce((sum, item) => sum + item.bytes, 0);
for (const { path, bytes } of written) {
  console.log(`  demos/rumbo/${path.padEnd(38)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(
  `  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB · ` +
    `${clients.length} expedientes, ${users.length} usuarios, ${operations.length} operaciones`,
);
