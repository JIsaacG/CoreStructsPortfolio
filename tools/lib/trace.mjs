/**
 * Raster -> vector tracing for the CoreStruct isotype.
 *
 * The mark is built entirely from straight isometric edges, so contour
 * following plus Ramer-Douglas-Peucker reproduces it exactly rather than
 * approximately -- see `verify()` for the measured fidelity.
 */

/**
 * Split an RGBA bitmap into 4-connected opaque components, largest first.
 * @param {{width:number,height:number,data:Buffer}} bitmap
 * @returns {{ mask: Uint8Array, size: number, color: [number,number,number] }[]}
 */
export function components({ width, height, data }, alphaThreshold = 140) {
  const ink = new Uint8Array(width * height);
  for (let i = 0; i < ink.length; i++) ink[i] = data[i * 4 + 3] > alphaThreshold ? 1 : 0;

  const labels = new Int32Array(ink.length).fill(-1);
  const found = [];

  for (let seed = 0; seed < ink.length; seed++) {
    if (!ink[seed] || labels[seed] >= 0) continue;
    const id = found.length;
    const stack = [seed];
    labels[seed] = id;
    let size = 0, r = 0, g = 0, b = 0;

    while (stack.length) {
      const p = stack.pop();
      const x = p % width, y = (p - x) / width;
      size++;
      r += data[p * 4]; g += data[p * 4 + 1]; b += data[p * 4 + 2];
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const q = ny * width + nx;
        if (ink[q] && labels[q] < 0) { labels[q] = id; stack.push(q); }
      }
    }
    found.push({ id, size, color: [Math.round(r / size), Math.round(g / size), Math.round(b / size)] });
  }

  return found
    .sort((a, b) => b.size - a.size)
    .map(({ id, size, color }) => {
      const mask = new Uint8Array(ink.length);
      for (let i = 0; i < ink.length; i++) if (labels[i] === id) mask[i] = 1;
      return { mask, size, color };
    });
}

/**
 * Follow the pixel-lattice boundary of a mask, returning closed rings.
 * Outer rings run clockwise (screen axes) and holes counter-clockwise.
 * @returns {[number,number][][]}
 */
export function contours(mask, width, height) {
  const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : mask[y * width + x]);
  const edges = new Map();
  const add = (from, to) => {
    const key = `${from[0]},${from[1]}`;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push(to);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!at(x, y)) continue;
      if (!at(x, y - 1)) add([x, y], [x + 1, y]);
      if (!at(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
      if (!at(x, y + 1)) add([x + 1, y + 1], [x, y + 1]);
      if (!at(x - 1, y)) add([x, y + 1], [x, y]);
    }
  }

  const rings = [];
  while (edges.size) {
    const start = edges.keys().next().value.split(",").map(Number);
    const ring = [start];
    let current = start, previous = null;

    while (true) {
      const key = `${current[0]},${current[1]}`;
      const options = edges.get(key);
      if (!options?.length) break;

      let pick = 0;
      if (options.length > 1 && previous) {
        // Diagonal pinch points offer two continuations; always taking the
        // sharpest right turn keeps the ring simple instead of self-crossing.
        const inDir = [current[0] - previous[0], current[1] - previous[1]];
        let best = -Infinity;
        options.forEach((option, i) => {
          const d = [option[0] - current[0], option[1] - current[1]];
          const cross = inDir[0] * d[1] - inDir[1] * d[0];
          const dot = inDir[0] * d[0] + inDir[1] * d[1];
          const score = cross !== 0 ? (cross > 0 ? 2 : 0) : dot > 0 ? 1 : -1;
          if (score > best) { best = score; pick = i; }
        });
      }

      const next = options.splice(pick, 1)[0];
      if (!options.length) edges.delete(key);
      previous = current;
      current = next;
      if (current[0] === ring[0][0] && current[1] === ring[0][1]) break;
      ring.push(current);
    }
    if (ring.length > 3) rings.push(ring);
  }
  return rings;
}

/**
 * Ramer-Douglas-Peucker simplification of a closed ring.
 * `epsilon` around 1.6px collapses the pixel staircase of a 30 degree isometric
 * edge back into the single straight line it was drawn as.
 */
export function simplify(ring, epsilon) {
  const distanceSq = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const lengthSq = dx * dx + dy * dy;
    if (!lengthSq) return (p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2;
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSq));
    return (p[0] - a[0] - t * dx) ** 2 + (p[1] - a[1] - t * dy) ** 2;
  };

  // Anchor on the point farthest from the centroid so the ring is always cut
  // at a real corner, making the result independent of where tracing began.
  const centroid = ring.reduce(
    (acc, p) => [acc[0] + p[0] / ring.length, acc[1] + p[1] / ring.length],
    [0, 0],
  );
  let anchor = 0, farthest = -1;
  ring.forEach((p, i) => {
    const d = (p[0] - centroid[0]) ** 2 + (p[1] - centroid[1]) ** 2;
    if (d > farthest) { farthest = d; anchor = i; }
  });

  const rotated = [...ring.slice(anchor), ...ring.slice(0, anchor)];
  // keep(s, e) yields rotated[s]..rotated[e-1]; rotated[e] comes from the next span.
  const keep = (s, e) => {
    let max = 0, index = -1;
    for (let i = s + 1; i < e; i++) {
      const d = distanceSq(rotated[i], rotated[s], rotated[e]);
      if (d > max) { max = d; index = i; }
    }
    return max > epsilon * epsilon ? [...keep(s, index), ...keep(index, e)] : [rotated[s]];
  };

  const mid = Math.floor(rotated.length / 2);
  return [...keep(0, mid), ...keep(mid, rotated.length - 1), rotated[rotated.length - 1]];
}

/** Even-odd scanline fill, used to measure how well the vector matches the raster. */
export function rasterize(rings, width, height) {
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const scan = y + 0.5;
    const crossings = [];
    for (const ring of rings) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length];
        if ((a[1] <= scan && b[1] > scan) || (b[1] <= scan && a[1] > scan)) {
          crossings.push(a[0] + ((scan - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
        }
      }
    }
    crossings.sort((p, q) => p - q);
    for (let i = 0; i + 1 < crossings.length; i += 2) {
      const from = Math.max(0, Math.ceil(crossings[i] - 0.5));
      const to = Math.min(width - 1, Math.floor(crossings[i + 1] - 0.5));
      for (let x = from; x <= to; x++) mask[y * width + x] = 1;
    }
  }
  return mask;
}

/** Intersection-over-union between the traced vector and the source raster. */
export function verify(mask, rings, width, height) {
  const rendered = rasterize(rings, width, height);
  let intersection = 0, union = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] && rendered[i]) intersection++;
    if (mask[i] || rendered[i]) union++;
  }
  return intersection / union;
}

/** Serialise rings as a single SVG path `d` attribute. */
export function toPathData(rings, precision = 1) {
  const n = (v) => String(Number(v.toFixed(precision)));
  return rings.map((ring) => `M${ring.map((p) => `${n(p[0])} ${n(p[1])}`).join("L")}Z`).join("");
}

/**
 * Fit a linear gradient to a component: find the axis of strongest luminance
 * change, then average the colour in buckets along it.
 */
export function fitGradient(mask, { width, height, data }, stopCount = 7) {
  const pixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      const i = (y * width + x) * 4;
      pixels.push([x, y, data[i], data[i + 1], data[i + 2]]);
    }
  }

  let angle = 0, strongest = -1;
  for (let deg = 0; deg < 180; deg++) {
    const t = (deg * Math.PI) / 180, ux = Math.cos(t), uy = Math.sin(t);
    let n = 0, sp = 0, spp = 0, sv = 0, spv = 0;
    for (const [x, y, r, g, b] of pixels) {
      const proj = x * ux + y * uy, value = r + g + b;
      n++; sp += proj; spp += proj * proj; sv += value; spv += proj * value;
    }
    const correlation = Math.abs((n * spv - sp * sv) / Math.sqrt(n * spp - sp * sp));
    if (correlation > strongest) { strongest = correlation; angle = deg; }
  }

  const t = (angle * Math.PI) / 180, ux = Math.cos(t), uy = Math.sin(t);
  let min = Infinity, max = -Infinity;
  for (const [x, y] of pixels) {
    const proj = x * ux + y * uy;
    if (proj < min) min = proj;
    if (proj > max) max = proj;
  }

  const buckets = Array.from({ length: stopCount }, () => [0, 0, 0, 0]);
  for (const [x, y, r, g, b] of pixels) {
    const t01 = (x * ux + y * uy - min) / (max - min);
    const bucket = buckets[Math.min(stopCount - 1, Math.floor(t01 * stopCount))];
    bucket[0] += r; bucket[1] += g; bucket[2] += b; bucket[3]++;
  }

  const hex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
  const stops = buckets
    .map((bucket, i) => bucket[3] && {
      offset: i / (stopCount - 1),
      color: hex([bucket[0] / bucket[3], bucket[1] / bucket[3], bucket[2] / bucket[3]]),
    })
    .filter(Boolean);

  return {
    angle,
    from: [ux * min, uy * min],
    to: [ux * max, uy * max],
    stops,
  };
}
