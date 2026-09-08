/**
 * The portal's drawn imagery.
 *
 * AUREA does not exist, so it has no campus to photograph, no laboratory to
 * shoot and no students to portrait. Stock photography of real people standing
 * in for an invented institution would be the single dishonest element on a
 * site whose whole argument is that everything on it is declared fiction — and
 * a school portal that shows strangers is worse than one that shows nothing.
 *
 * So the pictures are drawn, out of the material the institution is actually
 * made of: desks, benches, shelves, court lines, staves, screens, trees. Every
 * plate is a diagram given enough scale to work as an image.
 *
 * PURE: data in, a string of SVG out, and not one colour literal. Marks carry
 * classes and `styles/aurea/art.css` decides what they look like, so a change
 * of palette restyles the whole gallery without re-rendering a plate.
 *
 * Two tones. `deep` sits on the navy grounds (hero, page heads, card covers);
 * `paper` sits on light surfaces. The geometry is identical.
 */

import { escape } from "../../src/data/aurea/format.js";

/* ------------------------------------------------------------------- util */

const n = (value) => Math.round(value * 100) / 100;

/* Patterns need document-unique ids and a page may carry twenty plates. A
   counter is enough: the build writes each page in a single pass. */
let seq = 0;
const uid = () => `au-art-${++seq}`;

/**
 * The plate, and its safe band.
 *
 * Every scene is composed inside 320 × 240 and every scene keeps what matters
 * inside y ∈ [34, 206]. A plate is 4:3 and is always shown `slice`d into a
 * wider box — 16:9 for card covers, much wider for the hero — so the top and
 * the bottom are cut before anyone sees them. The band is a constraint on the
 * drawings rather than on the CSS: a plate that had to be letterboxed to be
 * seen whole would have stopped being an image.
 */
const W = 320;
const H = 240;

function frame(label, body, { tone = "deep", width = W, height = H, className = "" } = {}) {
  return (
    `<svg class="au-art au-art--${tone}${className ? ` ${className}` : ""}" ` +
    `viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" ` +
    `role="img" aria-label="${escape(label)}">${body}</svg>`
  );
}

/**
 * Ground and lattice.
 *
 * The dot lattice is the motif that makes twenty different drawings read as
 * one series. It is a `<pattern>` rather than six hundred circles: a plate then
 * costs a line of markup instead of a paragraph.
 */
function ground(step = 11, radius = 1, width = W, height = H) {
  const id = uid();
  return (
    `<defs><pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">` +
    `<circle class="au-art__dot" cx="${step / 2}" cy="${step / 2}" r="${radius}"/></pattern></defs>` +
    `<rect class="au-art__ground" width="${width}" height="${height}"/>` +
    `<rect width="${width}" height="${height}" fill="url(#${id})"/>`
  );
}

/** A standing figure, at architectural scale and without a face. */
function figure(x, y, scale = 1) {
  const h = 18 * scale;
  return (
    `<g class="au-art__figure">` +
    `<circle cx="${n(x)}" cy="${n(y - h)}" r="${n(2.6 * scale)}"/>` +
    `<rect x="${n(x - 2.4 * scale)}" y="${n(y - h + 3.4 * scale)}" width="${n(4.8 * scale)}" ` +
    `height="${n(h - 3.4 * scale)}" rx="${n(2.2 * scale)}"/></g>`
  );
}

/** A tree: a trunk and a crown, drawn small enough to be read as landscape. */
function tree(x, y, scale = 1) {
  return (
    `<g class="au-art__figure">` +
    `<rect x="${n(x - 1)}" y="${n(y - 7 * scale)}" width="2" height="${n(7 * scale)}"/>` +
    `<circle cx="${n(x)}" cy="${n(y - 11 * scale)}" r="${n(6 * scale)}"/></g>`
  );
}

/* --------------------------------------------------------------- the plates */

/** Aula — a seating plan seen from the back of the room. */
function aula() {
  const desks = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const spread = 1 + row * 0.16;
      const x = 160 + (col - 2) * 44 * spread;
      const y = 118 + row * 24;
      const w = 30 * spread;
      const accent = row === 1 && col === 3;
      desks.push(
        `<g class="${accent ? "au-art__accent" : "au-art__mass-2"}">` +
          `<rect x="${n(x - w / 2)}" y="${n(y)}" width="${n(w)}" height="4" rx="1"/>` +
          `<circle cx="${n(x)}" cy="${n(y + 10)}" r="${n(3 * spread)}"/></g>`,
      );
    }
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="86" y="42" width="148" height="52" rx="2"/>` +
    `<path class="au-art__line" d="M96 56h84M96 66h112M96 76h62"/>` +
    `<path class="au-art__gold-line" d="M188 76h34"/>` +
    desks.join("")
  );
}

/** Laboratorio — a bench, a flask and a rack of instruments. */
function laboratorio() {
  const jars = [];
  for (let i = 0; i < 6; i++) {
    const x = 46 + i * 20;
    const h = 10 + ((i * 7) % 16);
    jars.push(
      `<rect class="au-art__mass-2" x="${x}" y="${n(96 - h)}" width="11" height="${h}" rx="1.5"/>`,
    );
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="34" y="96" width="252" height="6" rx="2"/>` +
    `<rect class="au-art__mass" x="34" y="158" width="252" height="6" rx="2"/>` +
    jars.join("") +
    /* The flask: the one accented object, and the only closed shape. */
    `<path class="au-art__accent" d="M196 108v22l-20 30a5 5 0 0 0 4 8h40a5 5 0 0 0 4-8l-20-30v-22z"/>` +
    `<path class="au-art__line" d="M192 108h20"/>` +
    `<path class="au-art__line--faint au-art__line" d="M60 118h96M60 130h72M60 142h84"/>` +
    figure(266, 158, 1.15) +
    figure(248, 158, 1.05)
  );
}

/** Oficina — a desk, a screen and a bar series. */
function oficina() {
  const bars = [40, 62, 48, 78, 58, 88];
  return (
    ground() +
    `<rect class="au-art__mass" x="52" y="52" width="150" height="92" rx="3"/>` +
    `<rect class="au-art__glass" x="62" y="62" width="130" height="72" rx="2"/>` +
    bars
      .map(
        (value, index) =>
          `<rect class="${index === 5 ? "au-art__accent" : "au-art__mass-2"}" ` +
          `x="${74 + index * 20}" y="${n(126 - value * 0.62)}" width="12" height="${n(value * 0.62)}" rx="1"/>`,
      )
      .join("") +
    `<rect class="au-art__mass-2" x="42" y="152" width="236" height="7" rx="2"/>` +
    `<rect class="au-art__mass" x="220" y="86" width="58" height="58" rx="3"/>` +
    `<path class="au-art__line" d="M232 102h34M232 114h26M232 126h30"/>` +
    figure(96, 190, 1.2) +
    figure(130, 190, 1.1)
  );
}

/** Código — an editor with the cursor on the accent line. */
function codigo() {
  const lines = [];
  for (let i = 0; i < 9; i++) {
    const indent = [0, 1, 2, 2, 1, 2, 3, 2, 0][i];
    const width = 40 + ((i * 37) % 96);
    lines.push(
      `<rect class="${i === 5 ? "au-art__accent" : "au-art__mass-2"}" ` +
        `x="${n(76 + indent * 11)}" y="${n(70 + i * 14)}" width="${width}" height="5" rx="2.5"/>`,
    );
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="52" y="46" width="216" height="152" rx="4"/>` +
    `<path class="au-art__line" d="M52 62h216"/>` +
    `<circle class="au-art__figure" cx="64" cy="54" r="2.6"/>` +
    `<circle class="au-art__figure" cx="74" cy="54" r="2.6"/>` +
    `<circle class="au-art__figure" cx="84" cy="54" r="2.6"/>` +
    `<path class="au-art__line--faint au-art__line" d="M66 70v112"/>` +
    lines.join("") +
    `<rect class="au-art__gold" x="176" y="138" width="2.5" height="12" rx="1"/>`
  );
}

/** Campaña — a signal spreading across a set of surfaces. */
function campana() {
  const arcs = [26, 44, 62, 80]
    .map(
      (r, index) =>
        `<circle class="${index === 0 ? "au-art__accent-line" : "au-art__line au-art__line--faint"}" ` +
        `cx="92" cy="120" r="${r}" fill="none"/>`,
    )
    .join("");

  return (
    ground() +
    arcs +
    `<circle class="au-art__accent" cx="92" cy="120" r="7"/>` +
    [0, 1, 2]
      .map(
        (i) =>
          `<g><rect class="au-art__mass" x="${196 + (i % 2) * 8}" y="${64 + i * 50}" width="80" height="38" rx="3"/>` +
          `<path class="au-art__line" d="M${206 + (i % 2) * 8} ${78 + i * 50}h48M${206 + (i % 2) * 8} ${88 + i * 50}h32"/></g>`,
      )
      .join("") +
    `<path class="au-art__line--faint au-art__line" d="M156 120h40"/>`
  );
}

/** Estudio — an easel, a grid and a row of swatches. */
function estudio() {
  const swatches = [0, 1, 2, 3, 4]
    .map(
      (i) =>
        `<rect class="${i === 2 ? "au-art__gold" : "au-art__mass-2"}" x="${52 + i * 26}" y="176" ` +
        `width="20" height="20" rx="3"/>`,
    )
    .join("");

  const gridLines = [];
  for (let i = 1; i < 5; i++) {
    gridLines.push(`<path class="au-art__line--faint au-art__line" d="M${96 + i * 26} 52v96"/>`);
    gridLines.push(`<path class="au-art__line--faint au-art__line" d="M96 ${52 + i * 20}h104"/>`);
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="96" y="52" width="104" height="96" rx="2"/>` +
    gridLines.join("") +
    `<path class="au-art__accent-line" d="M110 128c18-46 44-58 76-64"/>` +
    `<circle class="au-art__accent" cx="186" cy="64" r="5"/>` +
    `<path class="au-art__line" d="M128 148l-14 44M168 148l14 44M148 148v34"/>` +
    swatches +
    `<rect class="au-art__mass-2" x="222" y="60" width="52" height="88" rx="3"/>` +
    `<path class="au-art__line" d="M232 76h32M232 88h24M232 100h30M232 112h20"/>`
  );
}

/** Series — a value over time, with the axis it needs to mean anything. */
function series() {
  const values = [34, 48, 42, 66, 58, 78, 88, 82, 104];
  const step = 26;
  const points = values.map((value, index) => [46 + index * step, n(178 - value)]);
  const path = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");

  return (
    ground() +
    [0, 1, 2, 3]
      .map((i) => `<path class="au-art__line--faint au-art__line" d="M40 ${72 + i * 28}h240"/>`)
      .join("") +
    values
      .map(
        (value, index) =>
          `<rect class="au-art__mass-2" x="${n(40 + index * step)}" y="${n(178 - value * 0.5)}" ` +
          `width="13" height="${n(value * 0.5)}" rx="1.5"/>`,
      )
      .join("") +
    `<path class="au-art__accent-line" d="${path}" fill="none"/>` +
    points
      .map(([x, y], index) =>
        index === points.length - 1
          ? `<circle class="au-art__gold" cx="${x}" cy="${y}" r="5"/>`
          : `<circle class="au-art__accent" cx="${x}" cy="${y}" r="2.6"/>`,
      )
      .join("") +
    `<path class="au-art__line" d="M40 178h240"/>`
  );
}

/** Círculo — chairs arranged for a group, seen from above. */
function circulo() {
  const seats = [];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = 160 + Math.cos(angle) * 66;
    const y = 120 + Math.sin(angle) * 58;
    seats.push(
      `<g class="${i === 2 ? "au-art__accent" : "au-art__mass-2"}">` +
        `<circle cx="${n(x)}" cy="${n(y)}" r="9"/></g>`,
    );
  }

  return (
    ground() +
    `<ellipse class="au-art__line--faint au-art__line" cx="160" cy="120" rx="66" ry="58" fill="none"/>` +
    `<ellipse class="au-art__mass" cx="160" cy="120" rx="34" ry="28"/>` +
    seats.join("") +
    `<path class="au-art__gold-line" d="M160 62v-16"/>`
  );
}

/** Biblioteca — shelves, and one table with a lamp. */
function biblioteca() {
  const shelves = [];
  for (let row = 0; row < 3; row++) {
    const y = 52 + row * 34;
    shelves.push(`<rect class="au-art__mass" x="34" y="${y + 24}" width="252" height="4" rx="1"/>`);
    for (let i = 0; i < 22; i++) {
      const x = 38 + i * 11.4;
      const h = 14 + ((i * 5 + row * 3) % 10);
      const accent = row === 1 && i === 9;
      shelves.push(
        `<rect class="${accent ? "au-art__accent" : "au-art__mass-2"}" x="${n(x)}" ` +
          `y="${n(y + 24 - h)}" width="8" height="${h}" rx="1"/>`,
      );
    }
  }

  return (
    ground() +
    shelves.join("") +
    `<rect class="au-art__mass" x="96" y="176" width="128" height="5" rx="2"/>` +
    `<path class="au-art__gold-line" d="M160 176v-14"/>` +
    `<circle class="au-art__gold" cx="160" cy="158" r="6"/>` +
    figure(112, 176, 0.9) +
    figure(208, 176, 0.9)
  );
}

/** Taller — a workbench, a printer and the object it is making. */
function taller() {
  return (
    ground() +
    `<rect class="au-art__mass" x="42" y="150" width="236" height="8" rx="2"/>` +
    /* The printer: a frame with a moving head. */
    `<rect class="au-art__mass-2" x="60" y="66" width="88" height="84" rx="3"/>` +
    `<path class="au-art__line" d="M60 96h88M104 66v30"/>` +
    `<rect class="au-art__accent" x="94" y="90" width="20" height="8" rx="2"/>` +
    `<rect class="au-art__mass" x="86" y="126" width="36" height="8" rx="1"/>` +
    /* Hand tools on a pegboard. */
    `<rect class="au-art__mass-2" x="176" y="60" width="102" height="90" rx="3"/>` +
    [0, 1, 2, 3, 4, 5]
      .map(
        (i) =>
          `<rect class="au-art__mass" x="${188 + (i % 3) * 30}" y="${76 + Math.floor(i / 3) * 40}" ` +
          `width="18" height="28" rx="2"/>`,
      )
      .join("") +
    `<circle class="au-art__gold" cx="266" cy="72" r="4"/>` +
    figure(158, 190, 1.2)
  );
}

/** Cómputo — a laboratory of workstations, one of them in use. */
function computo() {
  const stations = [];
  for (let row = 0; row < 3; row++) {
    const y = 92 + row * 40;
    stations.push(`<rect class="au-art__mass" x="34" y="${y + 26}" width="252" height="5" rx="2"/>`);
    for (let col = 0; col < 5; col++) {
      const x = 44 + col * 50;
      const lit = row === 1 && col === 2;
      stations.push(
        `<g><rect class="${lit ? "au-art__glass" : "au-art__mass-2"}" x="${x}" y="${y}" ` +
          `width="34" height="22" rx="2"/>` +
          `<rect class="au-art__mass-2" x="${x + 14}" y="${y + 22}" width="6" height="4"/></g>`,
      );
      if (lit) {
        stations.push(
          `<path class="au-art__accent-line" d="M${x + 6} ${y + 8}h14M${x + 6} ${y + 14}h20"/>`,
        );
      }
    }
  }

  return ground() + stations.join("") + figure(160, 92, 1.1) + `<path class="au-art__gold-line" d="M34 214h252"/>`;
}

/** Carpeta — the administrative record: a ledger, a sheet and a seal. */
function carpeta() {
  const rows = [];
  for (let i = 0; i < 7; i++) {
    rows.push(
      `<path class="au-art__line au-art__line--faint" d="M126 ${86 + i * 15}h108"/>`,
    );
  }

  return (
    ground() +
    /* Three folders, offset, behind the sheet. */
    `<rect class="au-art__mass" x="52" y="74" width="150" height="112" rx="4"/>` +
    `<rect class="au-art__mass-2" x="66" y="66" width="150" height="112" rx="4"/>` +
    `<rect class="au-art__mass" x="80" y="58" width="150" height="112" rx="4"/>` +
    /* The sheet on top. */
    `<rect class="au-art__mass-2" x="114" y="62" width="132" height="112" rx="3"/>` +
    rows.join("") +
    `<path class="au-art__accent-line" d="M126 71h44"/>` +
    /* The seal: the one closed mark on the plate. */
    `<circle class="au-art__gold" cx="228" cy="160" r="15"/>` +
    `<circle class="au-art__line" cx="228" cy="160" r="21" fill="none"/>` +
    figure(74, 208, 1.1)
  );
}

/** Auditorio — arcs of seats facing a stage. */
function auditorio() {
  const rows = [];
  for (let row = 0; row < 5; row++) {
    const radius = 58 + row * 20;
    const seats = 9 + row * 3;
    for (let i = 0; i < seats; i++) {
      const t = i / (seats - 1);
      const angle = Math.PI * (0.14 + t * 0.72);
      const x = 160 + Math.cos(angle) * radius;
      const y = 76 + Math.sin(angle) * radius * 0.86;
      const accent = row === 2 && i === Math.floor(seats / 2);
      rows.push(
        `<rect class="${accent ? "au-art__accent" : "au-art__mass-2"}" x="${n(x - 5)}" ` +
          `y="${n(y - 3.5)}" width="10" height="7" rx="2"/>`,
      );
    }
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="106" y="44" width="108" height="26" rx="3"/>` +
    `<path class="au-art__gold-line" d="M120 58h80"/>` +
    rows.join("")
  );
}

/** Deporte — court markings and the ball. */
function deporte() {
  return (
    ground() +
    `<rect class="au-art__mass" x="40" y="56" width="240" height="132" rx="4"/>` +
    `<path class="au-art__line" d="M160 56v132"/>` +
    `<circle class="au-art__line" cx="160" cy="122" r="26" fill="none"/>` +
    `<path class="au-art__line" d="M40 90h34v64H40M280 90h-34v64h34"/>` +
    `<path class="au-art__line--faint au-art__line" d="M40 122h240"/>` +
    `<circle class="au-art__accent" cx="212" cy="98" r="7"/>` +
    `<path class="au-art__gold-line" d="M74 148l24-18 22 14"/>` +
    figure(98, 168, 0.95) +
    figure(226, 160, 0.95)
  );
}

/** Patio — the explanade: paths, trees and people crossing. */
function patio() {
  return (
    ground() +
    `<path class="au-art__line" d="M0 176h320M46 240V152q0-14 14-14h200q14 0 14 14v88"/>` +
    `<rect class="au-art__mass" x="34" y="86" width="76" height="52" rx="3"/>` +
    `<rect class="au-art__mass" x="126" y="70" width="68" height="68" rx="3"/>` +
    `<rect class="au-art__mass" x="210" y="94" width="76" height="44" rx="3"/>` +
    `<rect class="au-art__glass" x="140" y="84" width="40" height="24" rx="2"/>` +
    tree(70, 176, 1.1) +
    tree(252, 176, 1) +
    tree(232, 172, 0.8) +
    `<rect class="au-art__gold" x="140" y="168" width="40" height="4" rx="2"/>` +
    figure(112, 200, 1.15) +
    figure(132, 204, 1.05) +
    figure(196, 198, 1.1) +
    figure(214, 202, 0.95)
  );
}

/** Colaborativo — one big table, a wall of notes. */
function colab() {
  const notes = [];
  for (let i = 0; i < 12; i++) {
    const x = 176 + (i % 4) * 26;
    const y = 58 + Math.floor(i / 4) * 26;
    notes.push(
      `<rect class="${i === 5 ? "au-art__gold" : "au-art__mass-2"}" x="${x}" y="${y}" ` +
        `width="19" height="19" rx="2"/>`,
    );
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="166" y="46" width="120" height="96" rx="3"/>` +
    notes.join("") +
    `<ellipse class="au-art__mass-2" cx="96" cy="140" rx="56" ry="26"/>` +
    `<ellipse class="au-art__accent" cx="96" cy="140" rx="18" ry="8"/>` +
    figure(52, 132, 0.85) +
    figure(96, 108, 0.85) +
    figure(140, 132, 0.85) +
    figure(96, 186, 0.9)
  );
}

/** Energía — a building instrumented, and the trace it produces. */
function energia() {
  const dots = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const on = (row + col) % 3 !== 0;
      dots.push(
        `<circle class="${on ? "au-art__accent" : "au-art__mass-2"}" cx="${n(64 + col * 22)}" ` +
          `cy="${n(70 + row * 22)}" r="4"/>`,
      );
    }
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="46" y="54" width="106" height="118" rx="3"/>` +
    dots.join("") +
    `<path class="au-art__line" d="M152 112h28"/>` +
    `<rect class="au-art__mass-2" x="180" y="72" width="102" height="80" rx="3"/>` +
    `<path class="au-art__gold-line" d="M190 128l14-22 12 16 14-34 12 26 14-18 12 10"/>` +
    `<path class="au-art__line--faint au-art__line" d="M190 140h84"/>` +
    figure(96, 196, 1.1)
  );
}

/** Debate — two lecterns and the argument between them. */
function debate() {
  return (
    ground() +
    `<path class="au-art__mass" d="M62 190v-46q0-6 6-6h34q6 0 6 6v46z"/>` +
    `<path class="au-art__mass" d="M212 190v-46q0-6 6-6h34q6 0 6 6v46z"/>` +
    figure(85, 138, 1.25) +
    figure(235, 138, 1.25) +
    `<path class="au-art__accent-line" d="M112 92h44a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-30l-10 10v-10h-4a6 6 0 0 1-6-6V98a6 6 0 0 1 6-6z"/>` +
    `<path class="au-art__line" d="M208 60h-42a6 6 0 0 0-6 6v14a6 6 0 0 0 6 6h28l10 10V86h4a6 6 0 0 0 6-6V66a6 6 0 0 0-6-6z"/>` +
    `<path class="au-art__gold-line" d="M40 190h240"/>`
  );
}

/** Mapa — routes between places, without pretending to be a real map. */
function mapa() {
  const pins = [
    [78, 92],
    [176, 68],
    [246, 122],
    [126, 158],
    [216, 184],
  ];

  return (
    ground() +
    `<path class="au-art__line--faint au-art__line" d="M78 92 176 68 246 122 216 184 126 158Z"/>` +
    `<path class="au-art__accent-line" d="M78 92C120 60 168 62 176 68s52 34 70 54"/>` +
    pins
      .map(
        ([x, y], index) =>
          `<g class="${index === 0 ? "au-art__gold" : "au-art__accent"}">` +
          `<circle cx="${x}" cy="${y}" r="${index === 0 ? 6 : 4.5}"/></g>`,
      )
      .join("") +
    [1, 2, 3, 4]
      .map((i) => `<path class="au-art__line--faint au-art__line" d="M20 ${58 + i * 34}h280"/>`)
      .join("")
  );
}

/** Comunidad — households, and the link between them. */
function comunidad() {
  const houses = [
    [66, 150],
    [128, 132],
    [192, 152],
    [252, 128],
  ];

  return (
    ground() +
    `<path class="au-art__line--faint au-art__line" d="M66 150 128 132 192 152 252 128"/>` +
    houses
      .map(
        ([x, y], index) =>
          `<g class="${index === 1 ? "au-art__accent" : "au-art__mass-2"}">` +
          `<path d="M${x - 20} ${y}l20-16 20 16v34h-40z"/></g>` +
          `<rect class="au-art__glass" x="${x - 6}" y="${y + 10}" width="12" height="14" rx="1"/>`,
      )
      .join("") +
    `<path class="au-art__gold-line" d="M40 184h240"/>` +
    figure(96, 184, 0.9) +
    figure(158, 184, 0.9) +
    figure(222, 184, 0.9)
  );
}

/* ------------------------------------------------------ the gallery plates

   Sixteen more scenes, drawn for the gallery rather than for a card cover.
   They carry the same vocabulary as the first twenty — ground, lattice, mass,
   line, figure, one accent — because a gallery of thirty-six drawings only
   works as a gallery if every one of them is recognisably the same hand.
   -------------------------------------------------------------------------- */

/** Música — a staff, its notes, and the stand they are read from. */
function musica() {
  const notes = [
    [72, 118], [104, 106], [132, 124], [166, 100], [196, 112], [226, 94], [256, 118],
  ];

  return (
    ground() +
    [0, 1, 2, 3, 4]
      .map((i) => `<path class="au-art__line au-art__line--faint" d="M44 ${94 + i * 12}h232"/>`)
      .join("") +
    notes
      .map(
        ([x, y], index) =>
          `<g class="${index === 3 ? "au-art__accent" : "au-art__mass-2"}">` +
          `<ellipse cx="${x}" cy="${y}" rx="7" ry="5.2" transform="rotate(-18 ${x} ${y})"/>` +
          `<rect x="${x + 5}" y="${y - 26}" width="2.2" height="26" rx="1"/></g>`,
      )
      .join("") +
    /* The stand: three legs and a lectern, the only thing at human scale. */
    `<path class="au-art__line" d="M160 152v46M138 198h44M160 152l-30-8M160 152l30-8"/>` +
    `<rect class="au-art__mass" x="118" y="138" width="84" height="9" rx="2" transform="rotate(-6 160 142)"/>`
  );
}

/** Teatro — the proscenium, its curtains and one lit figure. */
function teatro() {
  return (
    ground() +
    `<path class="au-art__mass" d="M34 44h252v14H34z"/>` +
    /* Two curtains, drawn as folds rather than as drapes. */
    `<path class="au-art__mass-2" d="M34 58h58l-10 118H34z"/>` +
    `<path class="au-art__mass-2" d="M286 58h-58l10 118h48z"/>` +
    [0, 1, 2]
      .map(
        (i) =>
          `<path class="au-art__line au-art__line--faint" d="M${46 + i * 14} 58l-${4 + i * 2} 118` +
          `M${274 - i * 14} 58l${4 + i * 2} 118"/>`,
      )
      .join("") +
    /* The spotlight: a cone, and the only accent on the plate. */
    `<path class="au-art__glass" d="M160 58 214 176h-108z"/>` +
    `<rect class="au-art__mass" x="90" y="176" width="140" height="6" rx="2"/>` +
    figure(160, 176, 1.5) +
    `<circle class="au-art__gold" cx="160" cy="52" r="5"/>`
  );
}

/** Danza — three figures and the arcs their movement leaves behind. */
function danza() {
  return (
    ground() +
    `<path class="au-art__line au-art__line--faint" d="M40 186h240"/>` +
    `<path class="au-art__accent-line" d="M62 152c26-44 62-52 96-30"/>` +
    `<path class="au-art__line" d="M112 168c34-52 78-56 112-24"/>` +
    `<path class="au-art__gold-line" d="M172 178c28-36 56-42 82-22"/>` +
    figure(88, 186, 1.7) +
    figure(158, 186, 2.05) +
    figure(232, 186, 1.6) +
    `<circle class="au-art__accent" cx="158" cy="128" r="4.5"/>`
  );
}

/** Natación — the pool from above: lanes, blocks and one swimmer. */
function natacion() {
  const lanes = [];
  for (let i = 0; i < 6; i++) {
    const y = 76 + i * 20;
    lanes.push(`<path class="au-art__line au-art__line--faint" d="M44 ${y}h232"/>`);
  }

  return (
    ground() +
    `<rect class="au-art__glass" x="44" y="66" width="232" height="120" rx="3"/>` +
    lanes.join("") +
    /* The starting blocks, along the near edge. */
    [0, 1, 2, 3, 4, 5, 6]
      .map((i) => `<rect class="au-art__mass" x="${40 + i * 33.4}" y="188" width="20" height="9" rx="2"/>`)
      .join("") +
    /* One swimmer, and the wake behind them. */
    `<path class="au-art__accent-line" d="M60 126c18-8 30 8 46 0s28 8 44 0"/>` +
    `<circle class="au-art__accent" cx="160" cy="126" r="6"/>` +
    `<path class="au-art__gold-line" d="M44 66h232"/>`
  );
}

/** Baloncesto — the key, the hoop and the shot. */
function baloncesto() {
  return (
    ground() +
    `<path class="au-art__line" d="M40 190h240"/>` +
    `<rect class="au-art__mass" x="112" y="46" width="96" height="58" rx="3"/>` +
    `<rect class="au-art__mass-2" x="140" y="74" width="40" height="30" rx="2"/>` +
    /* Hoop and net. */
    `<path class="au-art__gold-line" d="M144 108h32"/>` +
    [0, 1, 2, 3]
      .map((i) => `<path class="au-art__line au-art__line--faint" d="M${146 + i * 9} 108l${4 - i * 2.5} 16"/>`)
      .join("") +
    /* The arc of the shot. */
    `<path class="au-art__accent-line" d="M236 168C224 96 190 86 162 104" fill="none"/>` +
    `<circle class="au-art__accent" cx="238" cy="172" r="8"/>` +
    figure(238, 196, 1.5) +
    figure(96, 196, 1.35)
  );
}

/** Graduación — a field of caps, and one of them in the air. */
function graduacion() {
  const caps = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 52 + col * 44 + (row % 2) * 12;
      const y = 118 + row * 26;
      caps.push(
        `<g class="au-art__mass-2"><path d="M${x} ${y}l18-8 18 8-18 8z"/>` +
          `<path d="M${x + 8} ${y + 3.5}v7h20v-7"/></g>`,
      );
    }
  }

  return (
    ground() +
    caps.join("") +
    /* The one that is not in formation. */
    `<g class="au-art__accent"><path d="M186 52l22-10 22 10-22 10z" transform="rotate(-16 208 52)"/></g>` +
    `<path class="au-art__gold-line" d="M208 68c-4 18-2 30 6 40" fill="none"/>` +
    `<path class="au-art__line au-art__line--faint" d="M40 106h240"/>`
  );
}

/** Feria — a row of stands under their canopies. */
function feria() {
  const stalls = [];
  for (let i = 0; i < 4; i++) {
    const x = 40 + i * 62;
    const accent = i === 2;
    stalls.push(
      `<g class="${accent ? "au-art__accent" : "au-art__mass-2"}">` +
        `<path d="M${x} ${86}l26-22 26 22z"/></g>` +
        `<rect class="au-art__mass" x="${x + 4}" y="86" width="44" height="56" rx="2"/>` +
        `<path class="au-art__line au-art__line--faint" d="M${x + 12} 100h28M${x + 12} 112h20"/>` +
        `<rect class="au-art__mass-2" x="${x + 2}" y="142" width="48" height="5" rx="2"/>`,
    );
  }

  return (
    ground() +
    `<path class="au-art__gold-line" d="M34 60h252"/>` +
    stalls.join("") +
    `<path class="au-art__line" d="M34 176h252"/>` +
    figure(74, 176, 1.2) +
    figure(126, 180, 1.1) +
    figure(190, 176, 1.25) +
    figure(240, 180, 1.05)
  );
}

/** Robótica — an arm, its joints, and what it is holding. */
function robotica() {
  return (
    ground() +
    `<rect class="au-art__mass" x="52" y="176" width="72" height="16" rx="3"/>` +
    /* Three segments, three joints. */
    `<path class="au-art__line" d="M88 176V126l58-32 46 34" stroke-width="7" stroke-linecap="round"/>` +
    `<circle class="au-art__mass-2" cx="88" cy="176" r="11"/>` +
    `<circle class="au-art__mass-2" cx="88" cy="126" r="9"/>` +
    `<circle class="au-art__mass-2" cx="146" cy="94" r="9"/>` +
    /* The gripper and the cube it has picked up. */
    `<path class="au-art__accent-line" d="M186 122v18M204 122v18"/>` +
    `<rect class="au-art__accent" x="182" y="140" width="26" height="26" rx="3"/>` +
    /* The bench it works over, and the parts waiting on it. */
    `<rect class="au-art__mass" x="150" y="176" width="118" height="6" rx="2"/>` +
    `<rect class="au-art__mass-2" x="222" y="158" width="18" height="18" rx="2"/>` +
    `<rect class="au-art__mass-2" x="246" y="164" width="14" height="12" rx="2"/>` +
    `<path class="au-art__gold-line" d="M52 62h60"/>`
  );
}

/** Fotografía — a contact sheet, with one frame chosen. */
function fotografia() {
  const frames = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 54 + col * 56;
      const y = 62 + row * 44;
      const chosen = row === 1 && col === 2;
      frames.push(
        `<rect class="${chosen ? "au-art__glass" : "au-art__mass-2"}" x="${x}" y="${y}" ` +
          `width="46" height="34" rx="2"/>`,
      );
      if (chosen) {
        frames.push(
          `<rect class="au-art__accent-line" x="${x - 3}" y="${y - 3}" width="52" height="40" rx="3" fill="none"/>`,
        );
      }
    }
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="42" y="50" width="236" height="146" rx="3"/>` +
    frames.join("") +
    /* The sprocket holes down both edges: what says "film" in two marks. */
    [0, 1, 2, 3, 4, 5, 6]
      .map(
        (i) =>
          `<rect class="au-art__dot" x="46" y="${58 + i * 20}" width="5" height="8" rx="1"/>` +
          `<rect class="au-art__dot" x="269" y="${58 + i * 20}" width="5" height="8" rx="1"/>`,
      )
      .join("") +
    `<circle class="au-art__gold" cx="160" cy="212" r="4"/>`
  );
}

/** Jardín — the green areas: a path, trees and a bench. */
function jardin() {
  return (
    ground() +
    `<path class="au-plan-art__green" d="M0 150h320v90H0z" opacity="0.5"/>` +
    `<path class="au-art__line" d="M0 176c58-26 104-26 160 0s102 26 160 0"/>` +
    `<path class="au-art__line au-art__line--faint" d="M0 196c58-26 104-26 160 0s102 26 160 0"/>` +
    tree(52, 168, 1.9) +
    tree(104, 176, 1.4) +
    tree(258, 166, 2.1) +
    tree(216, 174, 1.5) +
    /* The bench: the one built object, and the accent. */
    `<g class="au-art__accent"><rect x="140" y="152" width="52" height="5" rx="2"/>` +
    `<rect x="140" y="136" width="52" height="4" rx="2"/></g>` +
    `<path class="au-art__line" d="M146 157v14M186 157v14"/>` +
    figure(96, 208, 1.1) +
    figure(118, 212, 1)
  );
}

/** Cafetería — tables from above, and the counter they queue at. */
function cafeteria() {
  const tables = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 72 + col * 58;
      const y = 108 + row * 40;
      const accent = row === 1 && col === 1;
      tables.push(
        `<circle class="${accent ? "au-art__accent" : "au-art__mass-2"}" cx="${x}" cy="${y}" r="13"/>` +
          [0, 1, 2, 3]
            .map((i) => {
              const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
              return (
                `<circle class="au-art__mass" cx="${n(x + Math.cos(angle) * 21)}" ` +
                `cy="${n(y + Math.sin(angle) * 21)}" r="5"/>`
              );
            })
            .join(""),
      );
    }
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="34" y="46" width="252" height="26" rx="4"/>` +
    `<path class="au-art__gold-line" d="M46 59h60M120 59h40"/>` +
    tables.join("") +
    `<path class="au-art__line au-art__line--faint" d="M34 84h252"/>`
  );
}

/** Ceremonia — the podium, the banners and the hall in front of it. */
function ceremonia() {
  const seats = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 9; col++) {
      seats.push(
        `<rect class="au-art__mass-2" x="${38 + col * 28}" y="${142 + row * 18}" ` +
          `width="19" height="10" rx="2"/>`,
      );
    }
  }

  return (
    ground() +
    /* Three banners, the middle one accented. */
    [0, 1, 2]
      .map(
        (i) =>
          `<path class="${i === 1 ? "au-art__gold" : "au-art__mass-2"}" ` +
          `d="M${106 + i * 54} 34h30v56l-15-10-15 10z"/>`,
      )
      .join("") +
    `<rect class="au-art__mass" x="132" y="104" width="56" height="30" rx="3"/>` +
    figure(160, 104, 1.4) +
    `<path class="au-art__line" d="M34 138h252"/>` +
    seats.join("")
  );
}

/** Microscopio — the instrument, and what it is looking at. */
function microscopio() {
  return (
    ground() +
    /* The instrument, left. */
    `<path class="au-art__mass" d="M62 194h76v8H62z"/>` +
    `<path class="au-art__line" d="M100 194v-34" stroke-width="6" stroke-linecap="round"/>` +
    `<path class="au-art__mass-2" d="M86 160h28l-4-52a10 10 0 0 0-20 0z"/>` +
    `<rect class="au-art__mass" x="72" y="150" width="56" height="6" rx="2"/>` +
    `<rect class="au-art__accent" x="88" y="146" width="24" height="5" rx="2"/>` +
    `<circle class="au-art__mass-2" cx="130" cy="82" r="10"/>` +
    /* The field of view, right: the same accent, magnified. */
    `<circle class="au-art__glass" cx="222" cy="126" r="52"/>` +
    `<circle class="au-art__line" cx="222" cy="126" r="52" fill="none"/>` +
    [
      [206, 108, 9], [236, 116, 7], [214, 142, 8], [242, 148, 6], [196, 132, 5],
    ]
      .map(
        ([x, y, r], index) =>
          `<circle class="${index === 0 ? "au-art__accent" : "au-art__mass-2"}" cx="${x}" cy="${y}" r="${r}"/>`,
      )
      .join("") +
    `<path class="au-art__gold-line" d="M164 126h6"/>`
  );
}

/** Ajedrez — the board, and the two pieces still on it. */
function ajedrez() {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 0) continue;
      squares.push(
        `<rect class="au-art__mass-2" x="${52 + col * 27}" y="${58 + row * 17}" width="27" height="17"/>`,
      );
    }
  }

  const piece = (x, y, cls) =>
    `<g class="${cls}"><ellipse cx="${x}" cy="${y}" rx="10" ry="4"/>` +
    `<path d="M${x - 6} ${y}c0-14 12-14 12 0z"/><circle cx="${x}" cy="${y - 18}" r="6"/></g>`;

  return (
    ground() +
    `<rect class="au-art__mass" x="52" y="58" width="216" height="136" rx="2"/>` +
    squares.join("") +
    `<rect class="au-art__line" x="52" y="58" width="216" height="136" rx="2" fill="none"/>` +
    piece(120, 142, "au-art__figure") +
    piece(201, 108, "au-art__accent") +
    `<path class="au-art__gold-line" d="M52 202h216"/>`
  );
}

/** Examen — desks, spaced, and the one paper already turned over. */
function examen() {
  const desks = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const x = 44 + col * 50;
      const y = 82 + row * 32;
      const marked = row === 2 && col === 1;
      desks.push(
        `<rect class="au-art__mass-2" x="${x}" y="${y}" width="38" height="18" rx="2"/>` +
          `<rect class="${marked ? "au-art__accent" : "au-art__mass"}" x="${x + 9}" y="${y + 4}" ` +
          `width="20" height="11" rx="1"/>`,
      );
    }
  }

  return (
    ground() +
    `<rect class="au-art__mass" x="112" y="40" width="96" height="26" rx="2"/>` +
    `<path class="au-art__gold-line" d="M124 53h34"/>` +
    desks.join("") +
    `<path class="au-art__line au-art__line--faint" d="M34 214h252"/>`
  );
}

/** Tutoría — two people, one table, one open book. */
function tutoria() {
  return (
    ground() +
    `<ellipse class="au-art__mass" cx="160" cy="150" rx="86" ry="30"/>` +
    /* The book, open, at the centre — the accent and the subject. */
    `<path class="au-art__accent" d="M124 146c14-8 26-8 34 0v14c-8-8-20-8-34 0z"/>` +
    `<path class="au-art__accent" d="M196 146c-14-8-26-8-34 0v14c8-8 20-8 34 0z"/>` +
    `<path class="au-art__line" d="M160 146v14"/>` +
    figure(96, 148, 1.7) +
    figure(226, 148, 1.7) +
    `<path class="au-art__line au-art__line--faint" d="M40 190h240"/>` +
    `<rect class="au-art__mass-2" x="222" y="60" width="56" height="44" rx="3"/>` +
    `<path class="au-art__line au-art__line--faint" d="M232 74h36M232 84h26"/>` +
    `<path class="au-art__gold-line" d="M42 66h44"/>`
  );
}

/* ----------------------------------------------------------- the registry */

const PLATES = {
  aula,
  computo,
  carpeta,
  laboratorio,
  musica,
  teatro,
  danza,
  natacion,
  baloncesto,
  graduacion,
  feria,
  robotica,
  fotografia,
  jardin,
  cafeteria,
  ceremonia,
  microscopio,
  ajedrez,
  examen,
  tutoria,
  oficina,
  codigo,
  campana,
  estudio,
  series,
  circulo,
  biblioteca,
  taller,
  auditorio,
  deporte,
  patio,
  colab,
  energia,
  debate,
  mapa,
  comunidad,
};

const LABELS = {
  aula: "Ilustración: un aula vista desde el fondo, con pupitres y pizarra",
  computo: "Ilustración: un laboratorio de cómputo con estaciones de trabajo",
  carpeta: "Ilustración: expedientes, una hoja de registro y un sello",
  laboratorio: "Ilustración: un laboratorio con mesa de trabajo, instrumentos y un matraz",
  oficina: "Ilustración: un escritorio con una pantalla y un gráfico de barras",
  codigo: "Ilustración: un editor de código con el cursor en una línea",
  campana: "Ilustración: una señal que se propaga hacia varias piezas de comunicación",
  estudio: "Ilustración: un caballete con una retícula y una fila de muestras de color",
  series: "Ilustración: una serie de valores en el tiempo sobre su eje",
  circulo: "Ilustración: sillas dispuestas en círculo, vistas desde arriba",
  biblioteca: "Ilustración: estanterías de libros y una mesa de lectura con lámpara",
  taller: "Ilustración: un taller con impresora 3D, herramientas y banco de trabajo",
  auditorio: "Ilustración: filas curvas de butacas frente a un escenario",
  deporte: "Ilustración: las marcas de una cancha vistas desde arriba, con un balón",
  patio: "Ilustración: la explanada del campus con edificios, árboles y personas",
  colab: "Ilustración: una mesa de trabajo colectiva frente a un muro de notas",
  energia: "Ilustración: un edificio instrumentado con sensores y su curva de consumo",
  debate: "Ilustración: dos atriles enfrentados y los turnos de palabra entre ellos",
  mapa: "Ilustración: rutas trazadas entre varios puntos",
  comunidad: "Ilustración: viviendas conectadas entre sí y personas alrededor",
  musica: "Ilustración: un pentagrama con notas y un atril",
  teatro: "Ilustración: un escenario con telones, un cono de luz y una figura",
  danza: "Ilustración: tres figuras en movimiento y los arcos que trazan",
  natacion: "Ilustración: una piscina vista desde arriba, con carriles y poyetes",
  baloncesto: "Ilustración: un tablero de baloncesto y la trayectoria de un tiro",
  graduacion: "Ilustración: birretes en formación y uno lanzado al aire",
  feria: "Ilustración: una fila de puestos bajo sus toldos, con visitantes",
  robotica: "Ilustración: un brazo robótico sujetando una pieza sobre un banco",
  fotografia: "Ilustración: una hoja de contactos con un fotograma seleccionado",
  jardin: "Ilustración: áreas verdes con árboles, un sendero y una banca",
  cafeteria: "Ilustración: mesas redondas vistas desde arriba y un mostrador",
  ceremonia: "Ilustración: un podio con estandartes frente a filas de sillas",
  microscopio: "Ilustración: un microscopio y el campo de visión que produce",
  ajedrez: "Ilustración: un tablero de ajedrez con dos piezas en juego",
  examen: "Ilustración: pupitres separados con una hoja sobre cada uno",
  tutoria: "Ilustración: dos personas frente a una mesa con un libro abierto",
};

/** One plate, by key. Unknown keys fall back rather than throwing: a plate is
    decoration, and a missing one must never take down a page. */
export function plate(name, { tone = "deep", className = "" } = {}) {
  const draw = PLATES[name] ?? PLATES.aula;
  const label = LABELS[name] ?? LABELS.aula;
  return frame(label, draw(), { tone, className });
}

/**
 * A stable plate for a record that has no `plate` of its own.
 *
 * Covers vary by subject rather than at random, so the same article gets the
 * same drawing on every build and on every page that lists it.
 */
const KEYS = Object.keys(PLATES);
export function plateFor(seed, options) {
  const text = String(seed);
  let value = 0;
  for (let index = 0; index < text.length; index++) {
    value = (value * 31 + text.charCodeAt(index)) % 100000;
  }
  return plate(KEYS[value % KEYS.length], options);
}

/* --------------------------------------------------------------- the hero */

/**
 * The campus at scale.
 *
 * Not a plate: a 16:6 band composed to be cropped hard on a phone and read as
 * a skyline on a monitor, so everything that identifies it — the tower, the
 * lit windows, the people on the explanade — sits in the right-hand two thirds
 * where the text is not.
 */
export function heroScene() {
  const HW = 1200;
  const HH = 520;

  const windows = [];
  for (let i = 0; i < 44; i++) {
    const col = i % 11;
    const row = Math.floor(i / 11);
    const lit = (i * 7) % 5 < 2;
    windows.push(
      `<rect class="${lit ? "au-art__glass" : "au-art__mass"}" x="${740 + col * 26}" ` +
        `y="${168 + row * 34}" width="16" height="20" rx="1.5"/>`,
    );
  }

  const crowd = [
    [706, 470, 1.5],
    [742, 476, 1.35],
    [788, 466, 1.4],
    [852, 478, 1.3],
    [906, 470, 1.45],
    [968, 474, 1.35],
    [1042, 468, 1.4],
    [1096, 476, 1.3],
  ]
    .map(([x, y, s]) => figure(x, y, s))
    .join("");

  const lattice = uid();

  return (
    `<svg class="au-art au-art--deep" viewBox="0 0 ${HW} ${HH}" preserveAspectRatio="xMidYMid slice" ` +
    `role="img" aria-label="Ilustración del campus de AUREA: edificios, explanada arbolada y estudiantes cruzando">` +
    `<defs><pattern id="${lattice}" width="18" height="18" patternUnits="userSpaceOnUse">` +
    `<circle class="au-art__dot" cx="9" cy="9" r="1.4"/></pattern></defs>` +
    `<rect class="au-art__ground" width="${HW}" height="${HH}"/>` +
    `<rect width="${HW}" height="${HH}" fill="url(#${lattice})"/>` +
    /* Low block, left of the tower. */
    `<rect class="au-art__mass" x="470" y="268" width="230" height="176" rx="4"/>` +
    `<path class="au-art__line" d="M470 316h230M470 364h230M470 412h230"/>` +
    /* The tower — the mark of the campus. */
    `<rect class="au-art__mass-2" x="722" y="140" width="308" height="304" rx="5"/>` +
    windows.join("") +
    `<path class="au-art__gold-line" d="M722 140h308"/>` +
    /* The auditorium, right. */
    `<path class="au-art__mass" d="M1052 444V332q0-46 46-46h72q46 0 46 46v112z"/>` +
    `<path class="au-art__line" d="M1052 372h164"/>` +
    /* The explanade. */
    `<path class="au-art__line" d="M420 444h780"/>` +
    `<rect class="au-art__accent" x="736" y="440" width="140" height="4" rx="2"/>` +
    tree(520, 444, 2.4) +
    tree(596, 448, 2) +
    tree(1176, 444, 2.2) +
    crowd +
    `</svg>`
  );
}

/* ------------------------------------------------------------ the plan */

/**
 * The tour plan.
 *
 * The only drawing in the portal that is a diagram before it is a picture: the
 * eight hotspots are positioned on it in percentages, so its blocks have to
 * stay recognisable underneath them. Deliberately sparse for that reason.
 */
export function campusPlan() {
  return (
    `<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid meet" role="img" ` +
    `aria-label="Plano esquemático del campus AUREA con sus ocho espacios principales">` +
    `<rect class="au-plan-art__ground" width="600" height="420"/>` +
    /* Green mass and paths first, so the blocks sit on top of them. */
    `<path class="au-plan-art__green" d="M40 250h150v130H40zM420 40h140v110H420z"/>` +
    `<path class="au-plan-art__path" d="M60 190h480M300 40v340M180 190v190M430 100v290"/>` +
    /* Blocks, in the order of the tour stops. */
    `<rect class="au-plan-art__block" x="110" y="82" width="130" height="86" rx="4"/>` +
    `<rect class="au-plan-art__block--lit" x="278" y="60" width="132" height="76" rx="4"/>` +
    `<rect class="au-plan-art__block" x="396" y="150" width="150" height="80" rx="4"/>` +
    `<rect class="au-plan-art__block--lit" x="316" y="248" width="140" height="86" rx="4"/>` +
    `<rect class="au-plan-art__block" x="196" y="206" width="104" height="76" rx="4"/>` +
    `<rect class="au-plan-art__block" x="212" y="300" width="150" height="66" rx="4"/>` +
    `<rect class="au-plan-art__block" x="52" y="248" width="130" height="98" rx="4"/>` +
    `<rect class="au-plan-art__block" x="454" y="46" width="98" height="62" rx="4"/>` +
    `<text class="au-plan-art__label" x="40" y="404">CAMPUS CENTRAL · PLANO ESQUEMÁTICO</text>` +
    `</svg>`
  );
}

/* -------------------------------------------------------------- the map */

/** The contact map: a schematic of an invented address, labelled as such. */
export function locationMap() {
  return (
    `<svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet" role="img" ` +
    `aria-label="Mapa esquemático de la ubicación demostrativa del campus">` +
    `<rect class="au-plan-art__ground" width="600" height="380"/>` +
    [70, 140, 210, 280, 350]
      .map((y) => `<path class="au-plan-art__path" d="M0 ${y}h600" opacity="0.45"/>`)
      .join("") +
    [90, 200, 310, 420, 520]
      .map((x) => `<path class="au-plan-art__path" d="M${x} 0v380" opacity="0.45"/>`)
      .join("") +
    `<path class="au-plan-art__path" d="M0 210h600" stroke-width="6"/>` +
    `<rect class="au-plan-art__block--lit" x="212" y="128" width="196" height="118" rx="5"/>` +
    `<rect class="au-plan-art__green" x="212" y="252" width="196" height="52" rx="4"/>` +
    `<circle fill="var(--gold)" cx="310" cy="187" r="9"/>` +
    `<text class="au-plan-art__label" x="220" y="118">CAMPUS CENTRAL AUREA</text>` +
    `<text class="au-plan-art__label" x="20" y="366">UBICACIÓN DEMOSTRATIVA · NO CORRESPONDE A UN LUGAR REAL</text>` +
    `</svg>`
  );
}

/* ----------------------------------------------------------- the wordmark */

/**
 * The mark: a keystone arch.
 *
 * Three pillars and an arc — the shape an institution uses to say it holds
 * something up — with the keystone in the gold. Drawn rather than lettered, so
 * it stays sharp at 20px in a browser tab and inverts cleanly on the footer.
 */
export function isotype() {
  return (
    `<svg class="au-logo__mark" viewBox="0 0 44 44" aria-hidden="true" focusable="false">` +
    `<path class="au-mark__arc" d="M6 34V22a16 16 0 0 1 32 0v12" fill="none"/>` +
    `<path class="au-mark__key" d="M22 4l7 7H15z"/>` +
    `<rect class="au-mark__pillar" x="9" y="26" width="4" height="14" rx="1"/>` +
    `<rect class="au-mark__pillar" x="20" y="20" width="4" height="20" rx="1"/>` +
    `<rect class="au-mark__pillar" x="31" y="26" width="4" height="14" rx="1"/>` +
    `<rect class="au-mark__pillar" x="6" y="40" width="32" height="3" rx="1.5"/>` +
    `</svg>`
  );
}

/* ------------------------------------------------------- decorative band */

/**
 * The page-head texture.
 *
 * Not a picture — a field. It sits behind the title of every interior page at
 * 40 % opacity, so its job is to give the navy some structure and then get out
 * of the way.
 */
export function bandArt() {
  const id = uid();
  return (
    `<svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">` +
    `<defs><pattern id="${id}" width="20" height="20" patternUnits="userSpaceOnUse">` +
    `<circle class="au-art__dot" cx="10" cy="10" r="1.4"/></pattern></defs>` +
    `<rect width="1200" height="320" fill="url(#${id})"/>` +
    `<path class="au-art__line au-art__line--faint" d="M820 320V128a48 48 0 0 1 48-48h132a48 48 0 0 1 48 48v192"/>` +
    `<path class="au-art__line au-art__line--faint" d="M700 320V180h80M1096 320V180h72"/>` +
    `<rect class="au-art__accent" x="868" y="76" width="132" height="3" rx="1.5"/>` +
    `</svg>`
  );
}
