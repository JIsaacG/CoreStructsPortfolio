/**
 * The portal's imagery.
 *
 * A demo has no photo library, and the brief rules out the obvious substitute:
 * stock photography looks like stock photography, and a corporate site that
 * runs on it reads as a template. So every image slot on Aurelis is a drawn
 * technical plate — an elevation, a section, a perspective — in the vocabulary
 * an engineering firm actually publishes in.
 *
 * They are generated rather than written out as literal path data: a lattice
 * pylon is a loop, a rack of servers is a perspective transform, a container
 * yard is a seeded scatter. That keeps the source readable and the output
 * identical between builds.
 *
 * PATH DATA, NOT ELEMENTS. Everything here builds `d` strings and emits one
 * element per *role*, not per line — a curtain wall of two hundred mullions is
 * a single `<path>`. The first version of this file drew them as separate
 * elements and put 2 700 SVG nodes on the home page, which cost 1.7 s of first
 * paint; the same drawing in merged paths is under 400 and paints immediately.
 *
 * Every plate draws in four roles only — hair, line, mass, accent — declared in
 * `src/styles/aurelis/plate.css`, so a plate inherits the whole visual language
 * by using the right class and never names a colour.
 *
 * REPLACING A PLATE WITH A PHOTOGRAPH: the markup around it (`figure.au-plate`,
 * a fixed aspect box, a caption) is exactly what a real image needs. Swap the
 * `<svg>` for an `<img>` in the `plate()` renderer and nothing else moves.
 */

/* --------------------------------------------------------------- primitives */

const W = 1200;
const H = 750;

const n = (value) => Math.round(value * 100) / 100;

/* One element per role. `d` is expected to already hold every sub-path. */
const hair = (d) => (d ? `<path class="au-plate__hair" d="${d}"/>` : "");
const line = (d) => (d ? `<path class="au-plate__line" d="${d}"/>` : "");
const thin = (d) => (d ? `<path class="au-plate__line au-plate__line--thin" d="${d}"/>` : "");
const mass = (d) => (d ? `<path class="au-plate__mass" d="${d}"/>` : "");
const fill = (d) => (d ? `<path class="au-plate__fill" d="${d}"/>` : "");
const accent = (d) => (d ? `<path class="au-plate__accent" d="${d}"/>` : "");
const accentFill = (d) => (d ? `<path class="au-plate__accent-fill" d="${d}"/>` : "");

/** Sub-path builders. All of them return `d` fragments, never elements. */
const box = (x, y, w, h) => `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;
const poly = (points) => `M${points.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}z`;
const seg = (points) => `M${points.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}`;
const dot = (x, y, r) =>
  `M${n(x - r)} ${n(y)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
const circle = dot;

/** Concatenate `count` sub-paths into one `d`. */
const seq = (count, fn) => Array.from({ length: count }, (_, i) => fn(i)).join("");

/** Deterministic noise, so a scattered yard looks scattered and never changes. */
function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* ------------------------------------------------------------- furniture */

/**
 * The border every plate carries: a construction grid, corner ticks, and one
 * dimension rule with a plate code. It is what makes a drawing read as a
 * document rather than as an illustration. Three paths in total.
 */
function furniture(code, span) {
  const grid =
    seq(Math.ceil(W / 60), (i) => `M${i * 60} 0V${H}`) +
    seq(Math.ceil(H / 60), (i) => `M0 ${i * 60}H${W}`);

  const ticks = [
    [28, 28, 26, 26],
    [W - 28, 28, -26, 26],
    [28, H - 28, 26, -26],
    [W - 28, H - 28, -26, -26],
  ]
    .map(([x, y, dx, dy]) => `M${x} ${y}h${dx}M${x} ${y}v${dy}`)
    .join("");

  const dimension = span
    ? thin(`M60 ${H - 34}h${W - 120}M60 ${H - 42}v16M${W - 60} ${H - 42}v16`) +
      `<text class="au-plate__type" x="${W / 2}" y="${H - 46}" text-anchor="middle">${span}</text>`
    : "";

  return (
    `<g opacity="0.5">${hair(grid)}</g><g opacity="0.55">${thin(ticks)}</g>` +
    `<text class="au-plate__type au-plate__type--accent" x="40" y="${H - 46}">${code}</text>` +
    dimension
  );
}

/** Water: horizontal dashes that thicken with distance. One path. */
function water(top, seed) {
  const random = rng(seed);
  let d = "";
  for (let y = top; y < H; y += 13) {
    const rows = 2 + Math.floor(((y - top) / (H - top)) * 3);
    for (let i = 0; i < rows; i++) {
      d += `M${n(random() * (W - 160) + 40)} ${y}h${n(30 + random() * 130)}`;
    }
  }
  return hair(d);
}

/* ------------------------------------------------------------------ plates */

/** Process plant elevation: silos, stack, hall, pipe rack, cooling tower. */
function plant() {
  const ground = 640;

  const siloAt = [90, 178, 266];
  const silos =
    mass(siloAt.map((x) => `M${x} ${ground}V330a35 12 0 0 1 70 0v${ground - 330}z`).join("")) +
    thin(
      siloAt.map((x) => `M${x} 330a35 12 0 0 0 70 0M${x + 26} 318h18v-16h-18z`).join(""),
    ) +
    hair(siloAt.map((x) => seq(3, (i) => `M${x} ${400 + i * 70}h70`)).join(""));

  const stack =
    mass(poly([[372, ground], [386, 130], [416, 130], [430, ground]])) +
    hair(seq(4, (i) => `M${376 + i * 3.4} ${560 - i * 105}h${48 - i * 6.8}`)) +
    thin("M384 130h34v-12h-34z");

  const hall =
    mass(box(500, 404, 304, ground - 404)) +
    thin(seq(4, (i) => `M${500 + i * 76} 404l38 -34l38 34`) + `M600 ${ground}v-58h64v58`) +
    hair(seq(5, (i) => seq(3, (j) => box(520 + i * 58, 440 + j * 60, 38, 34))));

  const cooling =
    mass(
      "M886 640C912 540 934 470 940 392L940 344L1022 344L1022 392C1028 470 1050 540 1076 640Z",
    ) +
    thin("M940 344a41 11 0 0 0 82 0") +
    hair(seq(4, (i) => `M${900 + i * 4} ${580 - i * 60}h${162 - i * 8}`));

  /* The rack ties the whole elevation together, so it is the one element the
     accent colour is spent on. */
  const rack =
    line("M60 520h1080M60 548h1080") +
    thin(seq(12, (i) => `M${90 + i * 92} 520v${ground - 520}`)) +
    accent("M60 534h700");

  return (
    furniture("AG-PL-014", "ELEVACIÓN · PLANTA DE PROCESO") +
    hair(`M0 ${ground}h${W}` + seq(3, (i) => `M${960 + i * 26} ${330 - i * 14}c-30 -46 26 -70 -4 -116`)) +
    silos +
    stack +
    hall +
    cooling +
    rack +
    line(`M0 ${ground}h${W}`) +
    fill(box(0, ground, W, 8))
  );
}

/** Cable-stayed viaduct: deck, pylon, stays, arches, water. */
function span() {
  const deck = 360;
  const surface = 654;

  const stays = thin(
    seq(9, (i) => {
      const offset = (i + 1) * 62 + 40;
      return `M600 118L${600 - offset} ${deck}M600 118L${600 + offset} ${deck}`;
    }),
  );

  const pylon =
    mass(poly([[584, deck], [594, 110], [606, 110], [616, deck]])) +
    thin("M588 300h24M590 210h20M594 110h12v-22h-12z");

  const piers = [155, 1045];
  const pier =
    mass(piers.map((x) => box(x - 15, deck + 14, 30, surface - deck - 14)).join("")) +
    hair(piers.map((x) => `M${x - 15} ${surface - 40}h30`).join(""));

  const arches = thin(
    `M155 ${deck + 14}Q370 ${deck + 190} 585 ${deck + 14}` +
      `M615 ${deck + 14}Q830 ${deck + 190} 1045 ${deck + 14}`,
  );

  return (
    furniture("AG-IN-021", "SECCIÓN · VIADUCTO ATIRANTADO") +
    water(surface, 8801) +
    stays +
    arches +
    pier +
    pylon +
    fill(box(0, deck, W, 16)) +
    line(`M0 ${deck}h${W}M0 ${deck + 16}h${W}`) +
    hair(seq(30, (i) => `M${20 + i * 40} ${deck}v-16`) + `M0 ${surface}h${W}`) +
    accent(`M0 ${deck - 1}h${W}`)
  );
}

/** Data hall in one-point perspective. */
function hall() {
  const vpx = 600;
  const vpy = 372;
  const floor = 752;
  const ceil = 30;

  const onFloor = (x, t) => [x + (vpx - x) * t, floor + (vpy - floor) * t];

  const perspective = hair(
    seq(9, (i) => {
      const t = 0.1 + i * 0.09;
      const [lx, y] = onFloor(0, t);
      return `M${n(lx)} ${n(y)}H${n(W - lx)}`;
    }) +
      seq(7, (i) => `M${i * 200} ${floor}L${vpx} ${vpy}M${i * 200} ${ceil}L${vpx} ${vpy}`),
  );

  /* Racks recede along both aisles. A vertical of height h at depth t is drawn
     h * (1 - t) tall, which is all the perspective this needs. */
  const row = (nearX, seed) => {
    const random = rng(seed);
    let faces = "";
    let leds = "";
    let ticks = "";

    for (let i = 0; i < 6; i++) {
      const t1 = 0.04 + i * 0.135;
      const t2 = t1 + 0.108;
      const [x1, y1] = onFloor(nearX, t1);
      const [x2, y2] = onFloor(nearX, t2);
      const top1 = y1 - 330 * (1 - t1);
      const top2 = y2 - 330 * (1 - t2);
      faces += poly([[x1, top1], [x2, top2], [x2, y2], [x1, y1]]);

      for (let j = 0; j < 6; j++) {
        const f = 0.12 + j * 0.14;
        const ax = x1 + (x2 - x1) * f;
        const ay = top1 + (top2 - top1) * f;
        const h = y1 - top1;
        if (random() > 0.45) leds += `M${n(ax)} ${n(ay + h * 0.18)}v${n(h * 0.08)}`;
        else ticks += `M${n(ax)} ${n(ay + h * 0.3)}v${n(h * 0.36)}`;
      }
    }
    return mass(faces) + hair(ticks) + accent(leds);
  };

  const trays = thin(
    seq(2, (i) => {
      const x = 240 + i * 720;
      return `M${x} 150L${vpx} ${vpy - 40}M${x} 176L${vpx} ${vpy - 34}`;
    }),
  );

  /* The cold aisle: the one lit surface in the room. */
  const aisle = fill(
    poly([onFloor(430, 0.02), onFloor(770, 0.02), onFloor(770, 0.86), onFloor(430, 0.86)]),
  );

  return (
    furniture("AG-DC-006", "PLANTA · SALA DE DATOS") +
    perspective +
    aisle +
    trays +
    row(150, 4471) +
    row(1050, 9137) +
    accent(seg([onFloor(600, 0.04), onFloor(600, 0.9)]))
  );
}

/** Transmission line: lattice pylons over contoured ground. */
function grid() {
  const base = 620;

  const contours = hair(
    seq(6, (i) => {
      const y = base + 14 + i * 22;
      return `M0 ${y}C180 ${y - 26} 300 ${y + 20} 470 ${y - 8}S820 ${y + 24} 1200 ${y - 14}`;
    }) + `M0 ${base}h${W}`,
  );

  const pylon = (cx, topY, halfBase, halfTop) => {
    const height = base - topY;
    const at = (t) => ({
      y: base - height * t,
      half: halfBase + (halfTop - halfBase) * t,
    });

    let legs = seg([[cx - halfBase, base], [cx - halfTop, topY]]);
    legs += seg([[cx + halfBase, base], [cx + halfTop, topY]]);

    let braces = "";
    let rungs = "";
    for (let i = 0; i < 9; i++) {
      const a = at(i / 9);
      const b = at((i + 1) / 9);
      braces += seg([[cx - a.half, a.y], [cx + b.half, b.y]]);
      braces += seg([[cx + a.half, a.y], [cx - b.half, b.y]]);
      rungs += `M${n(cx - b.half)} ${n(b.y)}h${n(b.half * 2)}`;
    }

    let arms = "";
    let hangers = "";
    let insulators = "";
    for (const [t, spread] of [
      [0.7, 5.4],
      [0.88, 3.8],
    ]) {
      const a = at(t);
      const reach = halfTop * spread;
      arms += `M${n(cx - reach)} ${n(a.y)}h${n(reach * 2)}`;
      hangers += seg([[cx - reach, a.y], [cx - a.half, a.y - 34]]);
      hangers += seg([[cx + reach, a.y], [cx + a.half, a.y - 34]]);
      for (const x of [cx - reach, cx + reach]) {
        hangers += `M${n(x)} ${n(a.y)}v22`;
        insulators += box(x - 4, a.y + 22, 8, 10);
      }
    }

    return line(legs + arms) + thin(braces + hangers) + hair(rungs) + fill(insulators);
  };

  /* Conductors sag; a straight line between towers is the tell of a drawing
     that has never seen one. */
  const armY = (topY, t) => base - (base - topY) * t;
  const conductor = (x1, x2, y, sag) => `M${x1} ${y}Q${(x1 + x2) / 2} ${y + sag} ${x2} ${y}`;

  const conductors = thin(
    conductor(104, 544, armY(150, 0.7) + 22, 68) +
      conductor(256, 696, armY(150, 0.7) + 22, 68) +
      conductor(558, 948, armY(210, 0.7) + 22, 54) +
      conductor(682, 1072, armY(210, 0.7) + 22, 54) +
      conductor(126, 566, armY(150, 0.88) + 22, 48) +
      conductor(234, 674, armY(150, 0.88) + 22, 48),
  );

  return (
    furniture("AG-EN-032", "ALZADO · LÍNEA DE TRANSMISIÓN") +
    contours +
    conductors +
    pylon(180, 150, 46, 14) +
    pylon(620, 150, 46, 14) +
    pylon(1010, 210, 38, 12) +
    accent("M0 92h150M1050 92h150")
  );
}

/** Container terminal: two ship-to-shore cranes, a yard and a vessel. */
function port() {
  const quay = 574;

  const crane = (x) => {
    const boom = quay - 300;
    return (
      line(
        `M${x - 78} ${quay}V${boom}M${x + 78} ${quay}V${boom}` +
          `M${x - 250} ${boom}h580`,
      ) +
      thin(
        `M${x - 78} ${quay - 60}h156` +
          seq(3, (i) => seg([[x - 78, quay - 90 - i * 70], [x + 78, quay - 150 - i * 70]])) +
          `M${x - 250} ${boom + 16}h580` +
          seg([[x, boom - 96], [x - 250, boom]]) +
          seg([[x, boom - 96], [x + 330, boom]]) +
          `M${x} ${boom}v-96`,
      ) +
      fill(box(x + 150, boom + 16, 44, 26) + box(x + 156, quay - 162, 32, 22)) +
      accent(`M${x + 172} ${boom + 42}v96`)
    );
  };

  const random = rng(20240);
  let stacks = "";
  let highlight = "";
  for (let i = 0; i < 46; i++) {
    const x = 70 + Math.floor(random() * 13) * 84;
    const height = 1 + Math.floor(random() * 4);
    for (let j = 0; j < height; j++) {
      const glyph = box(x, quay - 26 - j * 22, 74, 20);
      if (random() > 0.88) highlight += glyph;
      else stacks += glyph;
    }
  }

  const vessel =
    mass("M760 640C760 700 800 726 866 726H1180C1196 726 1200 716 1196 700L1176 640Z") +
    thin("M796 640v-46h300v46M1116 540v-40") +
    hair(seq(8, (i) => `M${820 + i * 44} 594v-30`)) +
    fill(box(1090, 540, 70, 54));

  return (
    furniture("AG-LG-047", "PLANTA · TERMINAL DE CONTENEDORES") +
    water(quay + 66, 3319) +
    mass(stacks) +
    fill(highlight) +
    accent(highlight) +
    crane(300) +
    crane(720) +
    fill(box(0, quay, W, 10)) +
    line(`M0 ${quay}h${W}`) +
    vessel +
    hair(seq(14, (i) => `M${40 + i * 84} ${quay + 24}v10`))
  );
}

/** Rotor assembly, drawn as a dimensioned section. */
function rotor() {
  const cx = 600;
  const cy = 368;

  /* Blades are drawn as tapered quads swept around the hub — a real aerofoil
     section would be illegible at this size. */
  const blades = seq(14, (i) => {
    const a = (i / 14) * Math.PI * 2;
    const p = (r, angle) => [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
    return poly([p(148, a), p(292, a + 0.045), p(292, a + 0.105), p(148, a + 0.13)]);
  });

  const rims = seq(8, (i) => {
    const a = (i / 8) * Math.PI * 2 + 0.39;
    return seg([
      [cx + Math.cos(a) * 268, cy + Math.sin(a) * 268],
      [cx + Math.cos(a) * 296, cy + Math.sin(a) * 296],
    ]);
  });

  return (
    furniture("AG-SY-058", "") +
    hair(
      `M${cx - 340} ${cy}h680M${cx} ${cy - 330}v660` +
        circle(cx, cy, 268) +
        circle(cx, cy, 118) +
        seq(9, (i) => `M${cx - 96 + i * 14} ${cy - 96}l52 52`),
    ) +
    mass(blades + circle(cx, cy, 62)) +
    line(circle(cx, cy, 300) + circle(cx, cy, 148) + circle(cx, cy, 30)) +
    thin(`M${cx - 26} ${cy}h52M${cx} ${cy - 26}v52` + rims) +
    accent(`M${cx + 118} ${cy}a118 118 0 0 1 -59 102`) +
    thin(
      `M${cx - 292} ${cy + 316}h584M${cx - 292} ${cy + 308}v16M${cx + 292} ${cy + 308}v16`,
    ) +
    `<text class="au-plate__type" x="${cx}" y="${cy + 302}" text-anchor="middle">Ø 584</text>`
  );
}

/** Corporate tower elevation with its neighbours and podium. */
function tower() {
  const ground = 648;

  const curtain = (x, y, w, h, cols, rows) =>
    seq(cols - 1, (i) => `M${n(x + ((i + 1) * w) / cols)} ${y}v${h}`) +
    seq(rows - 1, (i) => `M${x} ${n(y + ((i + 1) * h) / rows)}h${w}`);

  const blocks =
    box(126, 372, 194, ground - 372) +
    box(880, 300, 214, ground - 300) +
    box(432, 128, 336, ground - 128) +
    box(470, 74, 260, 54) +
    box(330, 556, 540, ground - 556);

  const mullions =
    curtain(126, 372, 194, ground - 372, 5, 11) +
    curtain(880, 300, 214, ground - 300, 6, 13) +
    curtain(432, 128, 336, ground - 128, 8, 22) +
    curtain(470, 74, 260, 54, 6, 2) +
    curtain(330, 556, 540, ground - 556, 12, 2) +
    seq(9, (i) => `M0 ${ground + 12 + i * 11}h${W}`);

  return (
    furniture("AG-AR-002", "ALZADO NORTE · SEDE CORPORATIVA") +
    mass(blocks) +
    hair(mullions) +
    thin(
      "M432 232h336M432 470h336M126 372h194M880 300h214M880 256h214v44" +
        "M330 556h540M556 74v-34h88v34",
    ) +
    fill(box(560, 596, 80, ground - 596)) +
    accent("M600 40v-26") +
    line(`M0 ${ground}h${W}`)
  );
}

/** Robotic assembly cell: conveyor, six-axis arm, safety envelope. */
function cell() {
  const floor = 636;
  const belt = 520;

  const conveyor =
    mass(box(70, belt, 1060, 20)) +
    hair(seq(22, (i) => `M${94 + i * 48} ${belt}v20`)) +
    thin(
      `M70 ${belt + 20}h1060` +
        seq(9, (i) => `M${120 + i * 118} ${belt + 20}v${floor - belt - 20}`),
    );

  let parts = "";
  let hot = "";
  for (let i = 0; i < 6; i++) {
    const x = 130 + i * 176;
    if (i === 3) hot += box(x, belt - 34, 62, 34);
    else parts += box(x, belt - 30, 58, 30);
  }

  const arm =
    mass(
      poly([[560, belt], [700, belt], [682, 452], [578, 452]]) +
        poly([[602, 442], [658, 442], [742, 250], [692, 236]]) +
        poly([[706, 246], [748, 258], [886, 356], [860, 392]]),
    ) +
    thin(
      "M600 452h60v-22h-60zM886 356l34 24M912 348l24 18l-18 30l-26 -14M918 396l30 18M918 396l24 32",
    ) +
    hair("M630 447a92 92 0 0 0 92 -92M727 253a76 76 0 0 1 76 76");

  const fence =
    hair(seq(34, (i) => `M${330 + i * 24} 300v${floor - 300}`)) +
    thin(`M330 300h792M330 ${floor}h792M330 300v336M1122 300v336`);

  const gantry = thin("M240 150h740") + hair(seq(6, (i) => `M${300 + i * 128} 150v42`));

  return (
    furniture("AG-OP-039", "CELDA DE ENSAMBLE · ALZADO") +
    hair(`M0 ${floor}h${W}`) +
    gantry +
    fill(box(690, 150, 66, 26)) +
    fence +
    conveyor +
    mass(parts) +
    fill(hot) +
    accent(hot) +
    arm +
    line(`M0 ${floor}h${W}`)
  );
}

/** Route network over terrain — the logistics corridor. */
function routes() {
  const random = rng(77123);

  const terrain = seq(9, (i) => {
    const y = 120 + i * 66;
    return `M0 ${y}C220 ${y - 34} 340 ${y + 30} 560 ${y - 6}S900 ${y + 32} 1200 ${y - 18}`;
  });

  const nodes = [
    [188, 250],
    [430, 172],
    [620, 392],
    [878, 232],
    [1024, 508],
    [350, 560],
  ];

  const legs =
    "M188 250C300 190 350 160 430 172M430 172C520 200 560 320 620 392" +
    "M620 392C720 340 800 250 878 232M878 232C960 300 1000 420 1024 508" +
    "M350 560C440 520 540 460 620 392";

  let halos = "";
  let rings = "";
  let dots = "";
  let stems = "";
  nodes.forEach(([x, y], i) => {
    const r = i === 2 ? 22 : 14;
    halos += circle(x, y, r + 12);
    rings += circle(x, y, r);
    if (i !== 2) dots += circle(x, y, 5);
    stems += `M${x} ${y - r - 22}v12`;
  });

  return (
    furniture("AG-LG-101", "ESQUEMA · CORREDOR MULTIMODAL") +
    hair(terrain + halos + seq(60, () => `M${n(random() * W)} ${n(random() * H)}h3`)) +
    thin(legs + stems) +
    accent("M188 250C300 190 350 160 430 172C520 200 560 320 620 392") +
    line(rings) +
    fill(dots) +
    accentFill(circle(620, 392, 7))
  );
}

/** An editorial plate for reports and insights: sheets, a chart, a rule. */
function report() {
  const sheets = [
    [150, 200, 420, 470],
    [186, 164, 420, 470],
    [222, 128, 560, 500],
    [486, 322, 620, 320],
  ];
  const paper = sheets.map((s) => box(...s)).join("");

  let bars = "";
  let hot = "";
  for (let i = 0; i < 9; i++) {
    const h = 40 + ((i * 47) % 130);
    const glyph = box(520 + i * 46, 420 - h, 26, h);
    if (i === 6) hot += glyph;
    else bars += glyph;
  }

  return (
    furniture("AG-IR-077", "") +
    mass(paper) +
    thin(paper + "M262 188h360M520 424h414") +
    hair(
      seq(9, (i) => `M262 ${248 + i * 22}h${360 - (i % 4) * 60}`) +
        seq(7, (i) => `M520 ${470 + i * 22}h${330 - (i % 3) * 70}`),
    ) +
    fill(bars) +
    accentFill(hot) +
    accent("M262 214h120")
  );
}

/**
 * Leadership portrait.
 *
 * A drawn face would be worse than no face, and a stock headshot is exactly
 * what the brief rules out — so the slot is filled with an honest placeholder:
 * a monogram on a hairline field, in the frame a real photograph will occupy.
 */
function portrait(initials = "AG") {
  const letters = String(initials).slice(0, 2).toUpperCase();
  return (
    `<g opacity="0.4">${hair(
      seq(13, (i) => `M${i * 100} 0V${H}`) + seq(8, (i) => `M0 ${i * 100}H${W}`),
    )}</g>` +
    hair("M600 0v750M0 375h1200") +
    thin("M300 130h600v490H300z") +
    accent("M300 130h120M780 620h120") +
    `<text x="600" y="430" text-anchor="middle" class="au-plate__type" ` +
    `style="font-size:210px;letter-spacing:0.06em;fill:none;stroke:currentColor;` +
    `stroke-width:1.6;opacity:0.55">${letters}</text>` +
    `<text x="600" y="560" text-anchor="middle" class="au-plate__type au-plate__type--accent">RETRATO CORPORATIVO</text>`
  );
}

/* ------------------------------------------------------------------ export */

/** Every plate the portal can ask for, by key. */
export const plates = {
  plant,
  span,
  hall,
  grid,
  port,
  rotor,
  tower,
  cell,
  routes,
  report,
  portrait,
};

/**
 * Render one plate to a complete `<svg>`.
 * `slice` fills its box the way `object-fit: cover` fills an image box, which
 * is what lets the same drawing sit in a 21:9 band and in a 4:5 portrait.
 */
export function plateSvg(key, argument) {
  const draw = plates[key];
  if (!draw) throw new Error(`unknown plate: ${key}`);
  return (
    `<svg class="au-plate__art" viewBox="0 0 ${W} ${H}" ` +
    `preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">` +
    `${draw(argument)}</svg>`
  );
}
