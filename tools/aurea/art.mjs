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

/* ----------------------------------------------------------- the registry */

const PLATES = {
  aula,
  computo,
  carpeta,
  laboratorio,
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
