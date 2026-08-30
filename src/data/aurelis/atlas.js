/**
 * The world map for "Capacidad global. Atención local."
 *
 * A tile provider would be a third-party request, a cookie and a frame budget
 * for what is, on this page, a backdrop for five points — so the map is drawn
 * instead. Continents are stored as coarse lon/lat outlines and rasterised at
 * build time into a dot matrix: a handful of polygon vertices are far easier to
 * keep right than two thousand hand-placed cells, and the grid smooths the
 * approximation into something deliberately abstract rather than merely wrong.
 *
 * Projection is equirectangular, cropped to the inhabited band (78°N – 56°S) so
 * the plate is not two-thirds empty ocean and ice.
 */

/* ---------------------------------------------------------------- geometry */

export const MAP = {
  width: 1200,
  height: 620,
  lonMin: -180,
  lonMax: 180,
  latMax: 78,
  latMin: -56,
  /** Degrees per dot. 5° reads as a matrix; finer reads as a smudge. */
  step: 4.5,
};

/** lon/lat -> plate coordinates. */
export function project(lon, lat) {
  const x = ((lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * MAP.width;
  const y = ((MAP.latMax - lat) / (MAP.latMax - MAP.latMin)) * MAP.height;
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

/**
 * Coarse continental outlines, [lon, lat] pairs.
 *
 * These are deliberately low-resolution: at 4.5° per dot, anything finer than
 * about five degrees of coastline is discarded by the raster anyway. They are
 * shape, not cartography.
 */
const LAND = [
  // North America, including Alaska and the Canadian mainland
  [
    [-168, 65], [-162, 70], [-140, 70], [-124, 70], [-110, 69], [-95, 69],
    [-88, 73], [-75, 73], [-64, 61], [-56, 51], [-66, 45], [-70, 42],
    [-75, 37], [-81, 31], [-80, 25], [-83, 28], [-88, 30], [-94, 29],
    [-97, 26], [-98, 20], [-95, 16], [-88, 15], [-83, 9], [-79, 9],
    [-84, 13], [-90, 14], [-96, 16], [-105, 20], [-110, 24], [-114, 31],
    [-117, 33], [-124, 40], [-125, 48], [-133, 54], [-141, 60], [-152, 59],
    [-160, 55], [-166, 60],
  ],
  // Greenland
  [[-45, 60], [-30, 68], [-20, 73], [-25, 82], [-45, 83], [-58, 80], [-55, 68]],
  // South America
  [
    [-81, 0], [-79, -6], [-76, -14], [-71, -18], [-70, -24], [-72, -37],
    [-75, -46], [-70, -55], [-65, -55], [-63, -41], [-58, -35], [-53, -33],
    [-48, -26], [-40, -21], [-35, -8], [-44, -2], [-50, 1], [-60, 6],
    [-70, 11], [-77, 8],
  ],
  // Africa
  [
    [-17, 15], [-17, 22], [-10, 30], [0, 36], [11, 37], [20, 32], [32, 31],
    [35, 23], [43, 12], [51, 12], [48, 4], [41, -2], [40, -11], [35, -19],
    [32, -26], [26, -34], [18, -35], [12, -17], [9, -1], [9, 4], [3, 6],
    [-8, 4], [-13, 8],
  ],
  // Eurasia
  [
    [-10, 36], [-8, 44], [-1, 49], [5, 53], [10, 57], [18, 65], [24, 71],
    [40, 68], [55, 71], [70, 73], [90, 76], [110, 76], [130, 73], [150, 71],
    [170, 68], [180, 65], [180, 58], [162, 58], [153, 50], [142, 46],
    [132, 43], [127, 37], [122, 30], [118, 23], [110, 19], [106, 10],
    [100, 2], [97, 8], [99, 15], [94, 18], [90, 22], [87, 21], [80, 15],
    [77, 8], [72, 20], [67, 24], [60, 25], [57, 23], [50, 28], [45, 38],
    [36, 36], [28, 37], [20, 40], [14, 38], [8, 44], [0, 41], [-6, 36],
  ],
  // Australia
  [
    [113, -22], [114, -27], [118, -34], [129, -32], [138, -35], [146, -39],
    [150, -37], [153, -28], [146, -19], [142, -11], [135, -12], [130, -12],
    [125, -14], [117, -20],
  ],
  // Indonesia and the Philippines, coarse
  [[95, 6], [104, 2], [110, -2], [118, -4], [125, -9], [115, -9], [104, -7], [96, 2]],
  [[119, 6], [126, 8], [125, 17], [121, 18], [118, 10]],
  // New Zealand, Japan, the British Isles and Madagascar: too small for the
  // grid to catch from a polygon, so they are drawn as their own short chains.
  [[166, -46], [172, -43], [175, -40], [178, -38], [174, -36], [172, -41]],
  [[130, 32], [136, 35], [141, 40], [143, 44], [140, 38], [134, 34]],
  [[-10, 52], [-6, 55], [-3, 58], [-2, 54], [-5, 50]],
  [[43, -12], [50, -16], [47, -25], [44, -20]],
];

/** Even-odd point-in-polygon. */
function inside(lon, lat, ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      hit = !hit;
    }
  }
  return hit;
}

/**
 * The land matrix as one `<path>`.
 *
 * One path rather than two thousand `<circle>` elements: the browser parses a
 * single `d` attribute far faster than it builds a thousand DOM nodes, and the
 * page carries this map on every view.
 */
export function landPath(radius = 2) {
  const parts = [];
  for (let lat = MAP.latMax; lat > MAP.latMin; lat -= MAP.step) {
    for (let lon = MAP.lonMin; lon < MAP.lonMax; lon += MAP.step) {
      if (!LAND.some((ring) => inside(lon, lat, ring))) continue;
      /* Integers only: the grid is 4.5 degrees coarse, so a hundredth of a
         pixel of precision is two thousand wasted characters. */
      const [fx, fy] = project(lon, lat);
      const x = Math.round(fx);
      const y = Math.round(fy);
      const d = radius * 2;
      parts.push(
        `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${d} 0a${radius} ${radius} 0 1 0-${d} 0`,
      );
    }
  }
  return parts.join("");
}

/** Meridians and parallels, every 30°. */
export function graticulePath() {
  const parts = [];
  for (let lon = MAP.lonMin; lon <= MAP.lonMax; lon += 30) {
    const [x] = project(lon, 0);
    parts.push(`M${x} 0V${MAP.height}`);
  }
  for (let lat = 60; lat >= -40; lat -= 20) {
    const [, y] = project(0, lat);
    parts.push(`M0 ${y}H${MAP.width}`);
  }
  return parts.join("");
}
