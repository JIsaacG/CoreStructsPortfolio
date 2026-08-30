/**
 * Turns the Honduras administrative boundaries into the SVG the portal draws:
 * `assets/source/hnd-adm1.geojson` -> `src/data/cede/geography.js`.
 *
 * The map is real geography — the eighteen departments of Honduras, their true
 * outlines — because a national information portal that draws an approximated
 * country is not one. Everything the map is *coloured by* is invented; the
 * shape underneath it is not.
 *
 * Source: geoBoundaries (gbOpen, ADM1, simplified), CC BY 4.0 —
 * https://www.geoboundaries.org. The pipeline projects to Web Mercator, drops
 * rings too small to survive at screen size, simplifies with Douglas–Peucker in
 * final units, and rounds to one decimal. Run it again only if the boundaries
 * are replaced: `node tools/build-map.mjs`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "assets", "source", "hnd-adm1.geojson");
const OUTPUT = join(ROOT, "src", "data", "cede", "geography.js");

/* The drawing surface. 1000 units wide; the height follows the country. */
const WIDTH = 1000;
const PADDING = 6;
/* Two thousandths of the country's width: the smallest wiggle worth a vertex at
   the sizes this map is ever drawn. */
const TOLERANCE = WIDTH * 0.002;
/* A ring smaller than this share of its department disappears at screen size —
   except where the islands ARE the department, so there is an absolute floor. */
const RING_SHARE = 0.02;
const RING_FLOOR = 0.6;

/**
 * What the portal needs to know about each department beyond its outline.
 *
 * `weight` is a share of national population, used only to give the invented
 * statistics a believable shape — a department with more people gets more
 * students. The names, the capitals and the counts of municipalities are
 * geography, not statistics: they are real and stay real.
 */
const META = {
  "Atlántida": { id: "at", capital: "La Ceiba", municipalities: 8, region: "norte", weight: 4.6 },
  "Choluteca": { id: "ch", capital: "Choluteca", municipalities: 16, region: "sur", weight: 4.8 },
  "Colón": { id: "cl", capital: "Trujillo", municipalities: 10, region: "norte", weight: 3.4 },
  "Comayagua": { id: "cm", capital: "Comayagua", municipalities: 21, region: "centro", weight: 5.4 },
  "Copán": { id: "cp", capital: "Santa Rosa de Copán", municipalities: 23, region: "occidente", weight: 4.0 },
  "Cortés": { id: "cr", capital: "San Pedro Sula", municipalities: 12, region: "norte", weight: 17.5 },
  "El Paraíso": { id: "ep", capital: "Yuscarán", municipalities: 19, region: "centro", weight: 5.0 },
  "Francisco Morazán": { id: "fm", capital: "Tegucigalpa", municipalities: 28, region: "centro", weight: 16.8 },
  "Gracias a Dios": { id: "gd", capital: "Puerto Lempira", municipalities: 6, region: "oriente", weight: 1.0 },
  "Intibucá": { id: "in", capital: "La Esperanza", municipalities: 17, region: "occidente", weight: 2.7 },
  "Islas de la Bahía": { id: "ib", capital: "Roatán", municipalities: 4, region: "norte", weight: 0.8 },
  "La Paz": { id: "lp", capital: "La Paz", municipalities: 19, region: "centro", weight: 2.2 },
  "Lempira": { id: "le", capital: "Gracias", municipalities: 28, region: "occidente", weight: 3.4 },
  "Ocotepeque": { id: "oc", capital: "Nueva Ocotepeque", municipalities: 16, region: "occidente", weight: 1.6 },
  "Olancho": { id: "ol", capital: "Juticalpa", municipalities: 23, region: "oriente", weight: 5.8 },
  "Santa Bárbara": { id: "sb", capital: "Santa Bárbara", municipalities: 28, region: "occidente", weight: 4.6 },
  "Valle": { id: "va", capital: "Nacaome", municipalities: 9, region: "sur", weight: 1.9 },
  "Yoro": { id: "yo", capital: "Yoro", municipalities: 11, region: "norte", weight: 6.3 },
};

/** geoBoundaries writes the islands in English; the portal is in Spanish. */
const RENAME = { "Bay Islands": "Islas de la Bahía" };

/**
 * The frame stops at the continental shelf.
 *
 * Islas del Cisne belongs to Islas de la Bahía and sits at 17.4°N, 250 km off
 * the coast. Drawn to scale it adds a third of empty ocean to the page and
 * shrinks the country everyone came to read. A production portal puts it in an
 * inset; the demo leaves the frame continental and says so.
 */
const FRAME_NORTH = 16.7;

/* ------------------------------------------------------------- projection */

/** Web Mercator, unscaled. At 13–16°N the distortion is imperceptible, but the
    country is wide enough that plate carrée would visibly stretch it. */
const project = ([lon, lat]) => [
  (lon * Math.PI) / 180,
  Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)),
];

/* ---------------------------------------------------------- simplification */

/** Perpendicular distance from `p` to the segment `a`–`b`. */
function distance(p, a, b) {
  const [x, y] = p;
  let [ax, ay] = a;
  const [bx, by] = b;
  let dx = bx - ax;
  let dy = by - ay;

  if (dx !== 0 || dy !== 0) {
    const t = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      ax = bx;
      ay = by;
    } else if (t > 0) {
      ax += dx * t;
      ay += dy * t;
    }
  }
  dx = x - ax;
  dy = y - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Douglas–Peucker, iterative so a long coastline cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];

  while (stack.length) {
    const [first, last] = stack.pop();
    let index = -1;
    let furthest = tolerance;

    for (let i = first + 1; i < last; i++) {
      const d = distance(points[i], points[first], points[last]);
      if (d > furthest) {
        furthest = d;
        index = i;
      }
    }

    if (index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, i) => keep[i]);
}

/** Twice the signed area of a ring — sign gives winding, magnitude gives size. */
const area2 = (ring) =>
  ring.reduce((sum, [x, y], i) => {
    const [nx, ny] = ring[(i + 1) % ring.length];
    return sum + (x * ny - nx * y);
  }, 0);

/* -------------------------------------------------------------------- read */

const geo = JSON.parse(readFileSync(SOURCE, "utf8"));

/** Every polygon of a feature, as a flat list of rings. */
function ringsOf(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flat();
}

const features = geo.features.map((feature) => {
  const name = RENAME[feature.properties.shapeName] ?? feature.properties.shapeName;
  const meta = META[name];
  if (!meta) throw new Error(`no metadata for department "${name}"`);
  const rings = ringsOf(feature.geometry)
    .filter((ring) => ring.every(([, lat]) => lat <= FRAME_NORTH))
    .map((ring) => ring.map(project));
  return { name, meta, rings };
});

/* ---------------------------------------------------------------- fit page */

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

for (const feature of features) {
  for (const ring of feature.rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const scale = (WIDTH - PADDING * 2) / (maxX - minX);
const HEIGHT = Math.round((maxY - minY) * scale + PADDING * 2);
/* y is flipped: latitude grows north, SVG grows down. */
const toPage = ([x, y]) => [(x - minX) * scale + PADDING, (maxY - y) * scale + PADDING];

/* ------------------------------------------------------------------- write */

const round = (n) => Math.round(n * 10) / 10;

const departments = features
  .map(({ name, meta, rings }) => {
    const paged = rings.map((ring) => ring.map(toPage));
    const sizes = paged.map((ring) => Math.abs(area2(ring)) / 2);
    const largest = Math.max(...sizes);

    const kept = paged
      .map((ring, index) => ({ ring, size: sizes[index] }))
      .filter(({ size }) => size >= largest * RING_SHARE || size >= RING_FLOOR)
      .sort((a, b) => b.size - a.size);

    const path = kept
      .map(({ ring }) => {
        const simplified = simplify(ring, TOLERANCE);
        const [start, ...rest] = simplified;
        return (
          `M${round(start[0])} ${round(start[1])}` +
          rest.map(([x, y]) => `L${round(x)} ${round(y)}`).join("") +
          "Z"
        );
      })
      .join("");

    /* The label anchor: the centroid of the biggest ring, which for every
       department here lands inside its own outline. */
    const main = kept[0].ring;
    const factor = area2(main) * 3;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < main.length; i++) {
      const [x0, y0] = main[i];
      const [x1, y1] = main[(i + 1) % main.length];
      const cross = x0 * y1 - x1 * y0;
      cx += (x0 + x1) * cross;
      cy += (y0 + y1) * cross;
    }

    return {
      id: meta.id,
      name,
      capital: meta.capital,
      municipalities: meta.municipalities,
      region: meta.region,
      weight: meta.weight,
      cx: round(cx / factor),
      cy: round(cy / factor),
      path,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

/**
 * A second, much coarser cut of the same geometry.
 *
 * The portfolio card that opens this demo needs the country at 200 units wide
 * inside a 400×250 canvas. The full outline would be 19 KB of path data in a
 * page that is 47 KB in total — so the card gets its own simplification, ten
 * times looser and rounded to whole units, which at that size is
 * indistinguishable from the real thing.
 */
const CARD_WIDTH = 200;
const cardScale = CARD_WIDTH / WIDTH;
const cardTolerance = 12;

const cardPath = features
  .map(({ rings }) => {
    const paged = rings.map((ring) => ring.map(toPage));
    const largest = paged.reduce((best, ring) =>
      Math.abs(area2(ring)) > Math.abs(area2(best)) ? ring : best,
    );
    const simplified = simplify(largest, cardTolerance);
    const [start, ...rest] = simplified.map(([x, y]) => [
      Math.round(x * cardScale),
      Math.round(y * cardScale),
    ]);
    return `M${start[0]} ${start[1]}${rest.map(([x, y]) => `L${x} ${y}`).join("")}Z`;
  })
  .join("");

const body = departments
  .map(
    (d) =>
      `  {\n` +
      `    id: "${d.id}",\n` +
      `    name: "${d.name}",\n` +
      `    capital: "${d.capital}",\n` +
      `    municipalities: ${d.municipalities},\n` +
      `    region: "${d.region}",\n` +
      `    weight: ${d.weight},\n` +
      `    label: { x: ${d.cx}, y: ${d.cy} },\n` +
      `    path: "${d.path}",\n` +
      `  },`,
  )
  .join("\n");

const file = `/**
 * The eighteen departments of Honduras, as SVG.
 *
 * GENERATED by \`node tools/build-map.mjs\` from
 * \`assets/source/hnd-adm1.geojson\` — do not edit by hand.
 *
 * Boundaries: geoBoundaries (gbOpen ADM1, simplified), CC BY 4.0,
 * https://www.geoboundaries.org. Projected to Web Mercator, fitted to a
 * ${WIDTH}×${HEIGHT} box, simplified to ${TOLERANCE} units and rounded to one
 * decimal. The frame is continental: Islas del Cisne (17.4°N, part of Islas de
 * la Bahía) would add a third of empty ocean to the page, so it is left out —
 * in a production portal it belongs in an inset.
 *
 * The geometry, the names, the capitals and the counts of municipalities are
 * real. \`weight\` is a share of national population and exists only to give the
 * demonstration statistics a believable shape: every figure the portal draws on
 * top of this map is invented.
 */

export const MAP = { width: ${WIDTH}, height: ${HEIGHT} };

/**
 * The same country at card size, simplified ten times harder.
 *
 * Used by the portfolio card that opens this demo, where the full outline would
 * cost more bytes than the rest of the page.
 */
export const CARD_MAP = {
  width: ${CARD_WIDTH},
  height: ${Math.round(HEIGHT * cardScale)},
  path: "${cardPath}",
};

/** Grouping used by the portal's territorial filters. Demonstration grouping. */
export const regions = [
  { id: "norte", name: "Litoral y valle norte" },
  { id: "occidente", name: "Occidente" },
  { id: "centro", name: "Centro" },
  { id: "sur", name: "Sur" },
  { id: "oriente", name: "Oriente" },
];

export const departments = [
${body}
];

/** Lookup by the two-letter code the filters, charts and map share. */
export const byId = Object.fromEntries(departments.map((d) => [d.id, d]));

export const departmentName = (id) => byId[id]?.name ?? "Nacional";
`;

writeFileSync(OUTPUT, file);

const bytes = Buffer.byteLength(file);
const vertices = departments.reduce((n, d) => n + (d.path.match(/L/g)?.length ?? 0), 0);
console.log(
  `  src/data/cede/geography.js  ${(bytes / 1024).toFixed(1)} KB · ` +
    `${departments.length} departamentos · ${vertices} vértices · ${WIDTH}×${HEIGHT}`,
);
