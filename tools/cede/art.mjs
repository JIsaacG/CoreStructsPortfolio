/**
 * The portal's drawn imagery.
 *
 * A public institution that invented itself cannot show photographs of itself:
 * there is no classroom to photograph, no minister to portrait, and stock
 * imagery would be the one dishonest thing on a site whose whole argument is
 * that it publishes only what it can source. So the pictures are drawn, and
 * they are drawn out of the same material the rest of the portal is made of —
 * seats, territories, sheets, networks, series. Every plate is a diagram given
 * enough scale to work as an image.
 *
 * PURE, like `charts.js`: data in, a string of SVG out, no colour literals.
 * Marks carry classes and `cede/art.css` decides what they look like, so the
 * high-contrast theme restyles the whole gallery without re-rendering a plate.
 *
 * Two tones. `deep` sits on the navy grounds (the gallery band); `light` sits
 * on paper (card covers, document thumbnails). The geometry is identical.
 */

import { escape } from "../../src/data/cede/format.js";
import { CARD_MAP, MAP, byId, departments } from "../../src/data/cede/geography.js";

/* ------------------------------------------------------------------- util */

const n = (value) => Math.round(value * 100) / 100;

/* Patterns need document-unique ids and a page may carry twenty plates. A
   counter is enough: the build writes each page in a single pass. */
let seq = 0;
const uid = () => `cd-art-${++seq}`;

/** The plate. Every scene is composed inside this box. */
const W = 320;
const H = 240;

/**
 * A stable small integer from a string.
 *
 * Covers vary by their subject rather than at random, so the same article gets
 * the same drawing on every build and on every page that lists it.
 */
function hash(seed) {
  const text = String(seed);
  let value = 0;
  for (let index = 0; index < text.length; index++) {
    value = (value * 31 + text.charCodeAt(index)) % 100000;
  }
  return value;
}

function frame(label, body, { tone = "deep", width = W, height = H, className = "" } = {}) {
  return (
    `<svg class="cd-art cd-art--${tone}${className ? ` ${className}` : ""}" ` +
    `viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" ` +
    `role="img" aria-label="${escape(label)}">${body}</svg>`
  );
}

/**
 * Ground and lattice.
 *
 * The dot lattice is the hero's, at plate scale — one motif repeated across
 * every picture is what keeps ten different drawings reading as one series. It
 * is a `<pattern>` rather than five hundred circles: a plate then costs a line
 * of markup instead of a paragraph.
 */
/** The lattice on its own, for scenes that need a second, clipped copy of it. */
function lattice(step = 11, radius = 1) {
  const id = uid();
  return {
    id,
    defs:
      `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">` +
      `<circle class="cd-art__dot" cx="${step / 2}" cy="${step / 2}" r="${radius}"/></pattern>`,
  };
}

function ground(step = 11, radius = 1, width = W, height = H) {
  const { id, defs } = lattice(step, radius);
  return (
    `<defs>${defs}</defs>` +
    `<rect class="cd-art__ground" width="${width}" height="${height}"/>` +
    `<rect width="${width}" height="${height}" fill="url(#${id})"/>`
  );
}

/* ----------------------------------------------------------------- plates */

/**
 * Matrícula — a seating plan.
 *
 * Thirty-five places, four of them empty. The picture says what the coverage
 * figure says, in the one unit every reader already understands: a chair.
 */
function matricula() {
  const seats = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const index = row * 7 + col;
      const x = 35 + col * 38;
      const y = 92 + row * 27;
      const filled = index % 9 !== 4;
      seats.push(
        `<g class="cd-art__seat${filled ? " is-on" : ""}">` +
          `<circle cx="${x + 11}" cy="${y}" r="4"/>` +
          `<rect x="${x}" y="${y + 6.5}" width="22" height="6.5" rx="1"/></g>`,
      );
    }
  }

  return (
    ground() +
    `<rect class="cd-art__slab" x="35" y="40" width="250" height="13" rx="1"/>` +
    `<path class="cd-art__rule" d="M35 63h250"/>` +
    `<path class="cd-art__accent-line" d="M35 63h96"/>` +
    seats.join("")
  );
}

/**
 * Territorio — the country, quantised.
 *
 * The same official geometry the hero draws, at a third of the size and read
 * as a value rather than as a silhouette: each department takes a step of the
 * sequential ramp from its own weight, and the hero's three anchors return.
 */
function territorio() {
  const scale = 0.288;
  const x = (W - MAP.width * scale) / 2;
  const y = (H - MAP.height * scale) / 2;

  const shapes = departments
    .map(
      (department, index) =>
        `<path class="cd-art__dep cd-art__dep--${Math.min(4, Math.floor(department.weight / 3.4))}" ` +
        `d="${department.path}" style="--i:${index}"/>`,
    )
    .join("");

  const pins = ["fm", "cr", "at"]
    .map((id) => byId[id])
    .map(
      (department) =>
        `<circle class="cd-art__pin-halo" cx="${department.label.x}" cy="${department.label.y}" r="26"/>` +
        `<circle class="cd-art__pin" cx="${department.label.x}" cy="${department.label.y}" r="9"/>`,
    )
    .join("");

  return ground() + `<g transform="translate(${n(x)} ${n(y)}) scale(${scale})">${shapes}${pins}</g>`;
}

/**
 * Conectividad — coverage as a signal.
 *
 * Four arcs out of one node and a field of centres, a third of them wired.
 * Nothing here is a value: the plate is the subject of the connectivity
 * indicator, not the indicator.
 */
function conectividad() {
  const source = { x: 52, y: 196 };

  const arcs = [46, 84, 122, 160]
    .map(
      (radius, index) =>
        `<path class="cd-art__arc" style="--i:${index}" d="M${source.x} ${source.y - radius} ` +
        `A${radius} ${radius} 0 0 1 ${source.x + radius} ${source.y}"/>`,
    )
    .join("");

  const nodes = [];
  const links = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 78 + col * 40;
      const y = 56 + row * 42;
      const wired = (row * 6 + col) % 3 === 0;
      if (wired) links.push(`<path class="cd-art__link" d="M${source.x} ${source.y}L${x} ${y}"/>`);
      nodes.push(
        `<rect class="cd-art__node${wired ? " is-on" : ""}" x="${x - 6}" y="${y - 6}" ` +
          `width="12" height="12" rx="1"/>`,
      );
    }
  }

  return (
    ground() +
    `<g class="cd-art__links">${links.join("")}</g>` +
    arcs +
    nodes.join("") +
    `<circle class="cd-art__source" cx="${source.x}" cy="${source.y}" r="7"/>`
  );
}

/**
 * Docentes — the workforce as a field.
 *
 * Forty glyphs on a staggered grid, six of them marked. A person drawn forty
 * times is a body of people; drawn once it would only be an icon.
 */
function docentes() {
  const people = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const index = row * 8 + col;
      const x = 30 + col * 37 + (row % 2) * 18;
      const y = 46 + row * 38;
      if (x > W - 22) continue;
      people.push(
        `<g class="cd-art__person${index % 7 === 3 ? " is-on" : ""}">` +
          `<circle cx="${x}" cy="${y}" r="7"/>` +
          `<path d="M${x - 12} ${y + 26}a12 12 0 0 1 24 0z"/></g>`,
      );
    }
  }
  return ground() + people.join("");
}

/**
 * Biblioteca — what the Council publishes.
 *
 * Three sheets, offset, hatched with the lines of a text they do not need to
 * contain, and the front one carrying a chart. It is the cover of a report,
 * seen from slightly above.
 */
function biblioteca() {
  const sheet = (x, y, rotation, klass) =>
    `<g class="cd-art__sheet ${klass}" transform="rotate(${rotation} ${x + 60} ${y + 78})">` +
    `<rect x="${x}" y="${y}" width="120" height="156" rx="1"/></g>`;

  const bars = [22, 34, 16, 40, 28]
    .map(
      (height, index) =>
        `<rect class="cd-art__accent-fill" x="${122 + index * 17}" y="${120 - height}" ` +
        `width="10" height="${height}"/>`,
    )
    .join("");

  const lines = Array.from(
    { length: 5 },
    (_, index) => `<path class="cd-art__hatch" d="M122 ${140 + index * 14}h${index === 4 ? 46 : 76}"/>`,
  ).join("");

  return (
    ground() +
    sheet(58, 44, -7, "cd-art__sheet--back") +
    sheet(74, 40, -3, "cd-art__sheet--mid") +
    `<g class="cd-art__sheet cd-art__sheet--front"><rect x="108" y="34" width="106" height="174" rx="1"/></g>` +
    `<path class="cd-art__rule" d="M122 54h78"/>` +
    `<path class="cd-art__accent-line" d="M122 54h30"/>` +
    bars +
    lines
  );
}

/**
 * Educación técnica — a schematic.
 *
 * Two toothed wheels in mesh, drawn as an engineering plate: a construction
 * circle, centre marks, a dimension line. The subject is competence, and the
 * honest picture of competence is a drawing something could be built from.
 */
function tecnica() {
  const wheel = (cx, cy, radius, teeth, klass) => {
    const marks = Array.from({ length: teeth }, (_, index) => {
      const angle = (index / teeth) * Math.PI * 2;
      return (
        `<path d="M${n(cx + Math.cos(angle) * radius)} ${n(cy + Math.sin(angle) * radius)}` +
        `L${n(cx + Math.cos(angle) * (radius + 11))} ${n(cy + Math.sin(angle) * (radius + 11))}"/>`
      );
    }).join("");

    return (
      `<g class="cd-art__wheel ${klass}">` +
      `<circle cx="${cx}" cy="${cy}" r="${radius}"/>` +
      `<circle class="cd-art__wheel-hub" cx="${cx}" cy="${cy}" r="${n(radius * 0.32)}"/>` +
      marks +
      `</g>`
    );
  };

  const crosshair = (cx, cy) => `<path class="cd-art__mark" d="M${cx - 14} ${cy}h28M${cx} ${cy - 14}v28"/>`;

  return (
    ground() +
    `<circle class="cd-art__construction" cx="118" cy="108" r="76"/>` +
    wheel(118, 108, 52, 16, "cd-art__wheel--main") +
    wheel(232, 164, 30, 11, "cd-art__wheel--accent") +
    crosshair(118, 108) +
    crosshair(232, 164) +
    `<path class="cd-art__dim" d="M118 212h114M118 206v12M232 206v12"/>`
  );
}

/**
 * Participación — the hemicycle.
 *
 * Five arcs of seats around an empty rostrum, three quarters of them taken.
 * The room is drawn from above because a consultation is a room, not a form.
 */
function participacion() {
  const cx = 160;
  const cy = 218;
  const seats = [];

  [58, 82, 106, 130, 154].forEach((radius, ring) => {
    const count = 9 + ring * 3;
    for (let index = 0; index < count; index++) {
      const angle = Math.PI + (index + 0.5) * (Math.PI / count);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (y < 26) continue;
      seats.push(
        `<circle class="cd-art__seat-dot${(ring + index) % 4 ? " is-on" : ""}" ` +
          `cx="${n(x)}" cy="${n(y)}" r="4.6"/>`,
      );
    }
  });

  return (
    ground() +
    seats.join("") +
    `<rect class="cd-art__slab" x="${cx - 26}" y="${cy - 36}" width="52" height="10" rx="1"/>` +
    `<path class="cd-art__accent-line" d="M${cx - 26} ${cy - 20}h52"/>`
  );
}

/**
 * Datos abiertos — the matrix.
 *
 * A table with the words taken out: eleven columns of eight rows shaded on the
 * sequential ramp. It is what a dataset looks like before anyone has asked it
 * a question.
 */
function datos() {
  const cells = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 11; col++) {
      /* Deterministic and faintly diagonal: real data is never flat and never
         noise, and a random texture would read as one or the other. */
      const step = (row * 3 + col * 5 + ((row * col) % 4)) % 6;
      cells.push(
        `<rect class="cd-art__cell cd-art__cell--${step >= 5 ? "none" : step}" ` +
          `x="${18 + col * 27}" y="${44 + row * 21}" width="23" height="17" rx="1"/>`,
      );
    }
  }

  return (
    ground() +
    `<path class="cd-art__rule" d="M18 34h284"/>` +
    `<path class="cd-art__accent-line" d="M18 34h68"/>` +
    cells.join("")
  );
}

/**
 * Trayectoria — a series, at the size of a picture.
 *
 * The shape every line chart in the portal draws, enlarged past the point
 * where it reports anything, which is what turns it into an image. The dashed
 * projection is the plan; the solid line is the record.
 */
function trayectoria() {
  const points = [12, 26, 22, 40, 52, 48, 66, 78, 92];
  const step = (W - 48) / (points.length - 1);
  const at = (index) => ({ x: n(24 + index * step), y: n(206 - points[index] * 1.55) });

  const path = points.map((_, index) => `${index ? "L" : "M"}${at(index).x} ${at(index).y}`).join("");
  const grid = [206, 160, 114, 68].map((y) => `<path class="cd-art__grid" d="M24 ${y}h${W - 48}"/>`).join("");
  const dots = points
    .map((_, index) => (index % 2 ? "" : `<circle class="cd-art__point" cx="${at(index).x}" cy="${at(index).y}" r="4.5"/>`))
    .join("");

  return (
    ground() +
    grid +
    `<path class="cd-art__area" d="${path}L${W - 24} 206L24 206Z"/>` +
    `<path class="cd-art__series" d="${path}"/>` +
    `<path class="cd-art__projection" d="M${at(8).x} ${at(8).y}L296 34"/>` +
    dots
  );
}

/**
 * Normativa — the register.
 *
 * A stack of ruled entries and a seal. Law, in a portal, is a list that can be
 * cited; the plate draws the list and the citation.
 */
function normativa() {
  const entries = Array.from({ length: 6 }, (_, index) => {
    const y = 44 + index * 29;
    return (
      `<g class="cd-art__entry${index === 1 ? " is-on" : ""}">` +
      `<rect x="34" y="${y}" width="252" height="20" rx="1"/>` +
      `<path class="cd-art__hatch" d="M46 ${y + 10}h${index % 2 ? 128 : 168}"/>` +
      `<rect class="cd-art__entry-tag" x="248" y="${y + 6}" width="24" height="8" rx="1"/>` +
      `</g>`
    );
  }).join("");

  return (
    ground() +
    entries +
    `<circle class="cd-art__seal" cx="264" cy="212" r="26"/>` +
    `<circle class="cd-art__seal-inner" cx="264" cy="212" r="17"/>` +
    `<path class="cd-art__mark" d="M256 212l6 6 12-13"/>`
  );
}

const SCENES = {
  matricula,
  territorio,
  conectividad,
  docentes,
  biblioteca,
  tecnica,
  participacion,
  datos,
  trayectoria,
  normativa,
};

export const SCENE_KINDS = Object.keys(SCENES);

/**
 * A plate.
 *
 * `label` becomes its accessible name — a picture that carries meaning is
 * never `aria-hidden`, and none of these are decoration.
 */
export function plate(kind, { label, tone = "deep", className = "" } = {}) {
  return frame(label ?? kind, (SCENES[kind] ?? matricula)(), { tone, className });
}

/* ----------------------------------------------------------------- covers */

/**
 * The card cover.
 *
 * A wide, shallow band at the head of a card: the same vocabulary at a scale
 * where it reads as texture rather than as a diagram. Cards are ranked by
 * their title, not by their picture, so a cover must never out-shout one.
 */
const COVER_W = 320;
const COVER_H = 116;

function coverSeries(offset) {
  const points = Array.from({ length: 9 }, (_, index) => ({
    x: 16 + index * 36,
    y: n(62 - (Math.sin((index + offset) * 0.9) * 18 + Math.sin((index + offset) * 0.4) * 12)),
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join("");

  return (
    `<path class="cd-art__area" d="${path}L304 104L16 104Z"/>` +
    `<path class="cd-art__series" d="${path}"/>` +
    points
      .filter((_, index) => index % 3 === 0)
      .map((point) => `<circle class="cd-art__point" cx="${point.x}" cy="${point.y}" r="3.6"/>`)
      .join("")
  );
}

function coverBars(offset) {
  return Array.from({ length: 12 }, (_, index) => {
    const height = 22 + ((index * 13 + offset * 7) % 46);
    return (
      `<rect class="cd-art__bar${index % 4 === offset % 4 ? " is-on" : ""}" ` +
      `x="${16 + index * 25}" y="${100 - height}" width="15" height="${height}" rx="1"/>`
    );
  }).join("");
}

function coverGrid(offset) {
  const cells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) {
      const step = (row * 2 + col * 3 + offset) % 6;
      cells.push(
        `<rect class="cd-art__cell cd-art__cell--${step >= 5 ? "none" : step}" ` +
          `x="${14 + col * 23}" y="${16 + row * 22}" width="19" height="18" rx="1"/>`,
      );
    }
  }
  return cells.join("");
}

function coverNetwork(offset) {
  const nodes = Array.from({ length: 7 }, (_, index) => ({
    x: 30 + index * 43,
    y: n(58 + Math.sin((index + offset) * 1.3) * 26),
  }));

  const links = nodes
    .slice(0, -1)
    .map(
      (node, index) =>
        `<path class="cd-art__link" d="M${node.x} ${node.y}L${nodes[index + 1].x} ${nodes[index + 1].y}"/>`,
    )
    .join("");

  const marks = nodes
    .map((node, index) => {
      const lead = index === offset % 7;
      return (
        `<circle class="cd-art__node-dot${lead ? " is-on" : ""}" cx="${node.x}" cy="${node.y}" ` +
        `r="${lead ? 9 : 6}"/>`
      );
    })
    .join("");

  return `<g class="cd-art__links">${links}</g>${marks}`;
}

function coverSheets(offset) {
  const lines = Array.from(
    { length: 5 },
    (_, index) =>
      `<path class="cd-art__hatch" d="M132 ${34 + index * 15}h${index === 4 ? 74 : 132 - ((index + offset) % 3) * 22}"/>`,
  ).join("");

  return (
    `<g class="cd-art__sheet cd-art__sheet--mid"><rect x="34" y="20" width="66" height="82" rx="1"/></g>` +
    `<g class="cd-art__sheet cd-art__sheet--front"><rect x="56" y="12" width="60" height="94" rx="1"/></g>` +
    `<path class="cd-art__accent-line" d="M66 30h30"/>` +
    lines
  );
}

function coverSeats(offset) {
  const seats = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 14; col++) {
      seats.push(
        `<circle class="cd-art__seat-dot${(row * 14 + col + offset) % 5 ? " is-on" : ""}" ` +
          `cx="${18 + col * 22}" cy="${28 + row * 30}" r="5.2"/>`,
      );
    }
  }
  return seats.join("");
}

/**
 * The territory at card size.
 *
 * `CARD_MAP` rather than the eighteen departments: a cover is 116 pixels tall,
 * where the borders would be invisible and the geometry would cost ten times
 * what the whole drawing is worth. The lattice shows through the silhouette,
 * which is the hero's treatment at a hundredth of the payload.
 */
function coverMap() {
  const clip = uid();
  const dots = lattice(7, 0.9);
  const scale = 0.9;
  const place =
    `translate(${n((COVER_W - CARD_MAP.width * scale) / 2)} ` +
    `${n((COVER_H - CARD_MAP.height * scale) / 2)}) scale(${scale})`;

  return (
    `<defs>${dots.defs}<clipPath id="${clip}">` +
    `<path transform="${place}" d="${CARD_MAP.path}"/></clipPath></defs>` +
    `<g transform="${place}"><path class="cd-art__dep cd-art__dep--1" d="${CARD_MAP.path}"/>` +
    `<path class="cd-art__outline" d="${CARD_MAP.path}"/></g>` +
    `<rect clip-path="url(#${clip})" width="${COVER_W}" height="${COVER_H}" fill="url(#${dots.id})"/>`
  );
}

/** The register at cover size: four ruled entries, one of them cited. */
function coverRegistro(offset) {
  return Array.from({ length: 4 }, (_, index) => {
    const y = 16 + index * 23;
    return (
      `<g class="cd-art__entry${index === offset % 4 ? " is-on" : ""}">` +
      `<rect x="20" y="${y}" width="280" height="17" rx="1"/>` +
      `<path class="cd-art__hatch" d="M30 ${y + 8.5}h${index % 2 ? 150 : 196}"/>` +
      `<rect class="cd-art__entry-tag" x="268" y="${y + 5}" width="22" height="7" rx="1"/></g>`
    );
  }).join("");
}

const COVERS = {
  serie: coverSeries,
  barras: coverBars,
  malla: coverGrid,
  red: coverNetwork,
  hojas: coverSheets,
  asamblea: coverSeats,
  registro: coverRegistro,
  mapa: coverMap,
};

export const COVER_KINDS = Object.keys(COVERS);

/**
 * A cover for a card.
 *
 * `seed` is the subject — a slug, a title — so a given card keeps a given
 * drawing forever, and two cards side by side never collide.
 */
export function cover(kind, { seed = "", label, tone = "light", className = "" } = {}) {
  const draw = COVERS[kind] ?? coverSeries;

  return frame(label ?? "Ilustración", ground(9, 0.9, COVER_W, COVER_H) + draw(hash(seed) % 7), {
    tone,
    width: COVER_W,
    height: COVER_H,
    className: `cd-art--cover${className ? ` ${className}` : ""}`,
  });
}

/* ---------------------------------------------------------------- emblems */

/**
 * The emblem of a strategic axis.
 *
 * Line art on a 64-unit grid at one weight, no fills: the five axes are peers
 * and nothing in the drawing may rank them. Each states its axis in a single
 * geometric idea — a target, unequal bars levelled, a rising rostrum, a
 * signal, a balance.
 */
const EMBLEMS = {
  calidad:
    '<circle cx="32" cy="32" r="21"/><circle cx="32" cy="32" r="12"/>' +
    '<circle class="cd-art__emblem-dot" cx="32" cy="32" r="4"/>' +
    '<path d="M32 4v7M32 53v7M4 32h7M53 32h7"/>',
  inclusion:
    '<path d="M10 52h44"/><path d="M17 52V34M27 52V24M37 52V40M47 52V28"/>' +
    '<path class="cd-art__emblem-accent" d="M10 16h44"/>' +
    '<path d="M17 34l10-10 10 16 10-12"/>',
  docente:
    '<path d="M12 54h40"/><path d="M21 54V40h9v14M35 54V26h9v28"/>' +
    '<path class="cd-art__emblem-accent" d="M14 30l18-16 18 16"/>' +
    '<circle class="cd-art__emblem-dot" cx="32" cy="10" r="4"/>',
  digital:
    '<path d="M8 34a34 34 0 0 1 48 0"/><path d="M18 43a20 20 0 0 1 28 0"/>' +
    '<circle class="cd-art__emblem-dot" cx="32" cy="52" r="4"/>' +
    '<path class="cd-art__emblem-accent" d="M32 8v10"/>',
  gobernanza:
    '<path d="M32 8v46M14 20h36"/><path d="M14 20 6 40h16zM50 20l-8 20h16z"/>' +
    '<path class="cd-art__emblem-accent" d="M6 40a8 8 0 0 0 16 0M42 40a8 8 0 0 0 16 0"/>' +
    '<path d="M18 54h28"/>',
};

export function emblem(id, { className = "" } = {}) {
  return (
    `<svg class="cd-art__emblem${className ? ` ${className}` : ""}" viewBox="0 0 64 64" ` +
    `aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" ` +
    `stroke-linecap="round" stroke-linejoin="round">${EMBLEMS[id] ?? EMBLEMS.calidad}</svg>`
  );
}
