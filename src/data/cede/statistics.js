/**
 * The demonstration dataset.
 *
 * EVERY FIGURE IN THIS FILE IS INVENTED. Nothing here comes from a statistical
 * office, a ministry or a survey, and no number should ever be quoted as if it
 * described Honduras. What is real is the *shape*: the dimensions a national
 * education system actually reports on (level, sex, area, administration,
 * shift, modality, territory), the way a total decomposes across them, and the
 * fact that every disaggregation adds back up to its total.
 *
 * There is no random number generator anywhere in this file, on purpose. The
 * national series are authored by hand and everything else is derived from them
 * by documented formulas, so the portal shows the same figures on every build,
 * every machine and every year — a dashboard whose numbers move when you reload
 * it is a dashboard nobody can review.
 *
 * WHERE THE REAL DATA WOULD COME FROM. This module is the seam. A deployment
 * replaces the tables below with a fetch against the institutional statistics
 * service (SIIE/SACE-style school records, INE population frames for coverage
 * denominators, the payroll system for teaching staff) and everything above it
 * — charts, map, filters, tables, exports — keeps working unchanged, because
 * they all read through the query functions at the bottom, never the tables.
 */

import { byId, departments } from "./geography.js";

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
export const CURRENT_YEAR = 2026;
export const BASE_YEAR = 2019;

/** The reference the portal prints under every figure. Invented, and says so. */
export const SOURCE = "Fuente: CEDE · Sistema Nacional de Información Educativa (datos demostrativos)";

/* ------------------------------------------------------------ dimensions */

export const levels = [
  { id: "pre", name: "Prebásica", short: "Prebásica", ages: "3 a 5 años" },
  { id: "bas", name: "Básica", short: "Básica", ages: "6 a 14 años" },
  { id: "med", name: "Media", short: "Media", ages: "15 a 17 años" },
];

/** Básica is reported in cycles as well as in whole; coverage needs the split. */
export const cycles = [
  { id: "pre", name: "Prebásica" },
  { id: "c12", name: "Básica · I y II ciclo" },
  { id: "c3", name: "Básica · III ciclo" },
  { id: "med", name: "Media" },
];

export const sexes = [
  { id: "f", name: "Mujeres" },
  { id: "m", name: "Hombres" },
];

export const areas = [
  { id: "urbano", name: "Urbana" },
  { id: "rural", name: "Rural" },
];

export const administrations = [
  { id: "publica", name: "Pública" },
  { id: "privada", name: "Privada" },
  { id: "semioficial", name: "Semioficial" },
];

export const shifts = [
  { id: "matutina", name: "Matutina" },
  { id: "vespertina", name: "Vespertina" },
  { id: "nocturna", name: "Nocturna" },
  { id: "distancia", name: "A distancia" },
];

export const modalities = [
  { id: "presencial", name: "Presencial regular" },
  { id: "alternativa", name: "Modalidad alternativa" },
  { id: "distancia", name: "Educación a distancia" },
];

/* ------------------------------------------------- authored national series */

/**
 * National enrolment by level, 2019–2026.
 *
 * Hand-written so the curve has a story a reader recognises: a contraction in
 * 2020–2021, recovery from 2022 and slower growth after 2024, with upper
 * secondary recovering last. Invented figures, plausible shape.
 */
const NATIONAL_ENROLMENT = {
  2019: { pre: 289_000, bas: 1_421_000, med: 573_000 },
  2020: { pre: 281_500, bas: 1_402_000, med: 566_000 },
  2021: { pre: 274_000, bas: 1_386_500, med: 561_500 },
  2022: { pre: 285_500, bas: 1_398_000, med: 578_000 },
  2023: { pre: 296_000, bas: 1_412_000, med: 594_500 },
  2024: { pre: 303_500, bas: 1_424_500, med: 606_000 },
  2025: { pre: 309_000, bas: 1_433_000, med: 616_500 },
  2026: { pre: 314_500, bas: 1_441_000, med: 626_000 },
};

/** Schools and teaching staff, national totals. */
const NATIONAL_CENTRES = {
  2019: 22_780, 2020: 22_840, 2021: 22_905, 2022: 23_040,
  2023: 23_150, 2024: 23_265, 2025: 23_340, 2026: 23_410,
};

const NATIONAL_TEACHERS = {
  2019: 73_900, 2020: 74_450, 2021: 74_820, 2022: 75_640,
  2023: 76_430, 2024: 77_180, 2025: 77_760, 2026: 78_240,
};

/**
 * The department profile.
 *
 * Five numbers per territory, authored rather than generated, that give every
 * derived figure its texture: how urban the department is, and how it stands on
 * coverage, permanence, connectivity and technical provision (1.00 = national
 * average). A deployment deletes this table — the real system reports these
 * directly instead of shaping them.
 */
const PROFILE = {
  at: { urban: 0.55, coverage: 1.02, permanence: 1.01, connectivity: 1.06, technical: 1.04 },
  ch: { urban: 0.41, coverage: 0.98, permanence: 0.97, connectivity: 0.88, technical: 0.96 },
  cl: { urban: 0.36, coverage: 0.93, permanence: 0.94, connectivity: 0.79, technical: 0.85 },
  cm: { urban: 0.46, coverage: 1.01, permanence: 1.0, connectivity: 0.97, technical: 1.02 },
  cp: { urban: 0.32, coverage: 0.94, permanence: 0.95, connectivity: 0.76, technical: 0.88 },
  cr: { urban: 0.73, coverage: 1.08, permanence: 1.05, connectivity: 1.24, technical: 1.22 },
  ep: { urban: 0.33, coverage: 0.95, permanence: 0.96, connectivity: 0.78, technical: 0.9 },
  fm: { urban: 0.76, coverage: 1.09, permanence: 1.06, connectivity: 1.28, technical: 1.25 },
  gd: { urban: 0.21, coverage: 0.79, permanence: 0.85, connectivity: 0.48, technical: 0.62 },
  in: { urban: 0.26, coverage: 0.9, permanence: 0.92, connectivity: 0.66, technical: 0.8 },
  ib: { urban: 0.61, coverage: 1.0, permanence: 0.99, connectivity: 1.09, technical: 0.94 },
  lp: { urban: 0.27, coverage: 0.92, permanence: 0.93, connectivity: 0.7, technical: 0.83 },
  le: { urban: 0.19, coverage: 0.87, permanence: 0.9, connectivity: 0.58, technical: 0.74 },
  oc: { urban: 0.30, coverage: 0.93, permanence: 0.95, connectivity: 0.72, technical: 0.86 },
  ol: { urban: 0.31, coverage: 0.94, permanence: 0.94, connectivity: 0.74, technical: 0.89 },
  sb: { urban: 0.29, coverage: 0.93, permanence: 0.94, connectivity: 0.73, technical: 0.87 },
  va: { urban: 0.40, coverage: 0.97, permanence: 0.97, connectivity: 0.85, technical: 0.93 },
  yo: { urban: 0.43, coverage: 0.99, permanence: 0.98, connectivity: 0.9, technical: 1.0 },
};

export const profileOf = (id) => PROFILE[id];

/* ------------------------------------------------------------ distribution */

/**
 * Split a national total across the departments, exactly.
 *
 * Proportional shares leave a remainder that has to land somewhere; dropping it
 * is how a dashboard ends up with a map that does not add up to its own
 * headline. The largest-remainder method assigns every last unit, so the sum of
 * the eighteen departments is the national figure, to the unit, always.
 */
function distribute(total, shares) {
  const sum = Object.values(shares).reduce((a, b) => a + b, 0);
  const exact = Object.entries(shares).map(([id, share]) => ({
    id,
    value: (total * share) / sum,
  }));

  const floored = exact.map((item) => ({ ...item, floor: Math.floor(item.value) }));
  let left = total - floored.reduce((a, b) => a + b.floor, 0);

  const byRemainder = [...floored].sort(
    (a, b) => b.value - b.floor - (a.value - a.floor) || a.id.localeCompare(b.id),
  );
  for (const item of byRemainder) {
    if (left <= 0) break;
    item.floor += 1;
    left -= 1;
  }

  return Object.fromEntries(floored.map((item) => [item.id, item.floor]));
}

/**
 * How much of each level a department holds.
 *
 * Population is the base; the level tilts it. Upper secondary concentrates
 * where the population is urban (that is where the institutos are), lower
 * grades spread more evenly than population does.
 */
function levelShares(level) {
  return Object.fromEntries(
    departments.map((d) => {
      const { urban } = PROFILE[d.id];
      const tilt =
        level === "med" ? 0.72 + 0.56 * urban
        : level === "pre" ? 0.88 + 0.24 * urban
        : 1.08 - 0.16 * urban;
      return [d.id, d.weight * tilt];
    }),
  );
}

/** enrolment[year][level][deptId] — the base every other figure derives from. */
const ENROLMENT = Object.fromEntries(
  YEARS.map((year) => [
    year,
    Object.fromEntries(
      levels.map(({ id }) => [id, distribute(NATIONAL_ENROLMENT[year][id], levelShares(id))]),
    ),
  ]),
);

/** Schools follow population, tilted the other way: rural means more, smaller. */
const CENTRES = Object.fromEntries(
  YEARS.map((year) => [
    year,
    distribute(
      NATIONAL_CENTRES[year],
      Object.fromEntries(departments.map((d) => [d.id, d.weight * (1.42 - 0.62 * PROFILE[d.id].urban)])),
    ),
  ]),
);

/** Teaching staff follow enrolment, with a larger class size where it is urban. */
const TEACHERS = Object.fromEntries(
  YEARS.map((year) => [
    year,
    distribute(
      NATIONAL_TEACHERS[year],
      Object.fromEntries(
        departments.map((d) => {
          const enrolled = levels.reduce((sum, { id }) => sum + ENROLMENT[year][id][d.id], 0);
          return [d.id, enrolled / (27.4 + 7.2 * PROFILE[d.id].urban)];
        }),
      ),
    ),
  ]),
);

/* ------------------------------------------------------------------ splits */

/**
 * The four splits every enrolment figure carries.
 *
 * Each returns fractions that sum to 1, so a value can be decomposed by any
 * dimension without the parts drifting from the whole. The numbers are
 * invented; the structure — a national ratio, moved by level and by how urban
 * the territory is — is how these breakdowns actually behave.
 */
const SPLIT = {
  sex(level, urban) {
    /* Girls are a slight majority in upper secondary and a slight minority in
       the lower grades — a pattern the portal shows rather than smooths away. */
    const female =
      level === "med" ? 0.517 + 0.014 * (urban - 0.5)
      : level === "bas" ? 0.489 + 0.006 * (urban - 0.5)
      : 0.493;
    return { f: female, m: 1 - female };
  },

  area(level, urban) {
    /* Upper secondary is more urban than the territory it sits in: the offer
       concentrates in the municipal seats. */
    const share = level === "med" ? Math.min(0.97, urban + 0.13) : level === "pre" ? urban + 0.02 : urban;
    return { urbano: share, rural: 1 - share };
  },

  administration(level, urban) {
    const privada = (level === "med" ? 0.072 : 0.044) + 0.128 * urban * (level === "med" ? 1.1 : 1);
    const semioficial = level === "med" ? 0.042 : 0.021;
    return { publica: 1 - privada - semioficial, privada, semioficial };
  },

  shift(level, urban) {
    if (level === "med") {
      const nocturna = 0.055 + 0.09 * urban;
      const distancia = 0.048;
      const vespertina = 0.27 + 0.04 * urban;
      return { matutina: 1 - nocturna - distancia - vespertina, vespertina, nocturna, distancia };
    }
    const vespertina = level === "bas" ? 0.19 + 0.14 * urban : 0.12 + 0.08 * urban;
    return { matutina: 1 - vespertina - 0.004, vespertina, nocturna: 0.002, distancia: 0.002 };
  },

  modality(level) {
    return level === "med"
      ? { presencial: 0.879, alternativa: 0.073, distancia: 0.048 }
      : { presencial: 0.958, alternativa: 0.036, distancia: 0.006 };
  },
};

export const SPLIT_DIMENSIONS = {
  sexo: { key: "sex", options: sexes },
  area: { key: "area", options: areas },
  administracion: { key: "administration", options: administrations },
  jornada: { key: "shift", options: shifts },
  modalidad: { key: "modality", options: modalities },
};

/* ------------------------------------------------------------------ queries */

/**
 * The one function the whole portal reads enrolment through.
 *
 * `{ year, level, department }` narrows; anything omitted means "all". This is
 * the seam a deployment re-points at a real service: the charts, the map, the
 * tables and the exports never touch the tables above.
 */
export function enrolment({ year = CURRENT_YEAR, level = "all", department = "all" } = {}) {
  const wanted = level === "all" ? levels.map((l) => l.id) : [level];
  const table = ENROLMENT[year] ?? ENROLMENT[CURRENT_YEAR];

  return wanted.reduce((sum, id) => {
    const row = table[id];
    return sum + (department === "all"
      ? Object.values(row).reduce((a, b) => a + b, 0)
      : (row[department] ?? 0));
  }, 0);
}

/** The same figure, broken down by one of the five split dimensions. */
export function enrolmentBy(dimension, { year = CURRENT_YEAR, level = "all", department = "all" } = {}) {
  const spec = SPLIT_DIMENSIONS[dimension];
  if (!spec) throw new Error(`unknown dimension: ${dimension}`);

  const wantedLevels = level === "all" ? levels.map((l) => l.id) : [level];
  const wantedDepts = department === "all" ? departments.map((d) => d.id) : [department];
  const totals = Object.fromEntries(spec.options.map((option) => [option.id, 0]));

  for (const levelId of wantedLevels) {
    for (const deptId of wantedDepts) {
      const value = ENROLMENT[year][levelId][deptId];
      const fractions = SPLIT[spec.key](levelId, PROFILE[deptId].urban);
      for (const [key, fraction] of Object.entries(fractions)) {
        totals[key] += value * fraction;
      }
    }
  }

  /* Rounded at the end and reconciled against the total, so the parts of a
     stacked bar always add up to the bar. */
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const rounded = distribute(Math.round(total), totals);
  return spec.options.map((option) => ({
    id: option.id,
    name: option.name,
    value: rounded[option.id],
    share: total ? rounded[option.id] / Math.round(total) : 0,
  }));
}

/** Enrolment across the eighteen departments, for the map and the rankings. */
export const enrolmentByDepartment = ({ year = CURRENT_YEAR, level = "all" } = {}) =>
  departments.map((d) => ({
    id: d.id,
    name: d.name,
    value: enrolment({ year, level, department: d.id }),
  }));

/** A time series of any of the metrics below. */
export function series(metric, { level = "all", department = "all" } = {}) {
  return YEARS.map((year) => ({ year, value: metricFor(metric, { year, level, department }) }));
}

/* ------------------------------------------------------------- indicators */

/**
 * The derived indicators.
 *
 * Each is a rate, so each is built the same way: a national value for the year,
 * moved by the department's profile and clamped to a sane band. Coverage rises
 * slowly and the gaps close slowly, which is what makes the series readable —
 * an indicator that jumps five points a year is a data error, not a policy.
 */
const NATIONAL_RATES = {
  /* Net coverage by level. */
  cobertura_pre: { 2019: 43.1, 2020: 41.8, 2021: 41.2, 2022: 43.6, 2023: 45.2, 2024: 46.4, 2025: 47.3, 2026: 48.1 },
  cobertura_c12: { 2019: 86.4, 2020: 84.9, 2021: 84.1, 2022: 85.8, 2023: 87.1, 2024: 87.9, 2025: 88.4, 2026: 88.9 },
  cobertura_c3: { 2019: 47.8, 2020: 46.2, 2021: 45.6, 2022: 47.9, 2023: 49.8, 2024: 51.1, 2025: 52.0, 2026: 52.9 },
  cobertura_med: { 2019: 30.2, 2020: 29.1, 2021: 28.7, 2022: 30.4, 2023: 32.1, 2024: 33.4, 2025: 34.3, 2026: 35.2 },
  /* Permanence. */
  retencion: { 2019: 90.1, 2020: 88.4, 2021: 88.9, 2022: 90.3, 2023: 91.2, 2024: 91.8, 2025: 92.2, 2026: 92.6 },
  desercion: { 2019: 5.8, 2020: 7.2, 2021: 6.8, 2022: 5.6, 2023: 4.9, 2024: 4.5, 2025: 4.3, 2026: 4.1 },
  repitencia: { 2019: 5.4, 2020: 4.1, 2021: 4.6, 2022: 4.9, 2023: 4.4, 2024: 4.0, 2025: 3.8, 2026: 3.6 },
  transicion: { 2019: 82.4, 2020: 80.9, 2021: 81.6, 2022: 83.5, 2023: 85.0, 2024: 86.1, 2025: 86.8, 2026: 87.4 },
  sobreedad: { 2019: 17.2, 2020: 17.9, 2021: 18.1, 2022: 16.4, 2023: 15.1, 2024: 14.2, 2025: 13.5, 2026: 12.9 },
  /* Infrastructure and services. */
  electricidad: { 2019: 66.2, 2020: 67.4, 2021: 68.5, 2022: 70.1, 2023: 71.6, 2024: 72.8, 2025: 73.8, 2026: 74.7 },
  agua: { 2019: 60.4, 2020: 61.5, 2021: 62.4, 2022: 63.9, 2023: 65.3, 2024: 66.4, 2025: 67.4, 2026: 68.2 },
  conectividad: { 2019: 21.6, 2020: 24.8, 2021: 28.9, 2022: 32.4, 2023: 35.6, 2024: 38.1, 2025: 39.9, 2026: 41.4 },
  laboratorios: { 2019: 17.4, 2020: 17.9, 2021: 18.6, 2022: 19.8, 2023: 20.9, 2024: 21.7, 2025: 22.3, 2026: 22.8 },
  bibliotecas: { 2019: 15.1, 2020: 15.4, 2021: 15.9, 2022: 16.7, 2023: 17.5, 2024: 18.1, 2025: 18.6, 2026: 19.0 },
  accesibilidad: { 2019: 8.4, 2020: 8.9, 2021: 9.6, 2022: 10.8, 2023: 12.0, 2024: 12.9, 2025: 13.6, 2026: 14.2 },
  /* Technical and vocational education. */
  insercion_tecnica: { 2019: 56.2, 2020: 53.8, 2021: 55.1, 2022: 58.4, 2023: 60.6, 2024: 61.9, 2025: 62.8, 2026: 63.6 },
  /* Digital divide, reported as households of enrolled students. */
  brecha_digital: { 2019: 61.8, 2020: 58.4, 2021: 54.9, 2022: 51.2, 2023: 48.1, 2024: 45.7, 2025: 44.0, 2026: 42.5 },
};

/** Which profile index moves each rate, and how hard. */
const RATE_PROFILE = {
  cobertura_pre: ["coverage", 1.0], cobertura_c12: ["coverage", 0.45],
  cobertura_c3: ["coverage", 1.0], cobertura_med: ["coverage", 1.25],
  retencion: ["permanence", 0.55], desercion: ["permanence", -2.1],
  repitencia: ["permanence", -1.8], transicion: ["permanence", 0.95],
  sobreedad: ["permanence", -1.9], electricidad: ["connectivity", 0.7],
  agua: ["connectivity", 0.55], conectividad: ["connectivity", 1.15],
  laboratorios: ["technical", 1.1], bibliotecas: ["connectivity", 0.85],
  accesibilidad: ["connectivity", 0.9], insercion_tecnica: ["technical", 0.75],
  brecha_digital: ["connectivity", -0.8],
};

/**
 * One rate, for one year, for one territory.
 *
 * The department index is applied as a deviation from 1.00 scaled by the
 * indicator's sensitivity, then clamped: no invented figure is allowed to leave
 * the range its own definition permits.
 */
export function rate(metric, { year = CURRENT_YEAR, department = "all" } = {}) {
  const national = NATIONAL_RATES[metric]?.[year];
  if (national === undefined) return null;
  if (department === "all") return round1(national);

  const [index, sensitivity] = RATE_PROFILE[metric] ?? ["coverage", 1];
  const deviation = (PROFILE[department][index] - 1) * sensitivity;
  const value = national * (1 + deviation);
  return round1(Math.max(0.4, Math.min(99.4, value)));
}

const round1 = (n) => Math.round(n * 10) / 10;

/* ------------------------------------------------- the metric dispatcher */

/**
 * Everything the portal can ask for by name.
 *
 * The filters, the KPI tiles, the map and the comparator all speak this one
 * vocabulary, which is why adding an indicator does not mean touching a chart.
 */
export function metricFor(metric, { year = CURRENT_YEAR, level = "all", department = "all" } = {}) {
  switch (metric) {
    case "matricula":
      return enrolment({ year, level, department });
    case "centros":
      return department === "all" ? NATIONAL_CENTRES[year] : CENTRES[year][department];
    case "docentes":
      return department === "all" ? NATIONAL_TEACHERS[year] : TEACHERS[year][department];
    case "tecnica":
      return technicalEnrolment({ year, department });
    case "ratio": {
      const students = enrolment({ year, department });
      const staff = metricFor("docentes", { year, department });
      return round1(students / staff);
    }
    case "cobertura":
      return rate(level === "all" ? "cobertura_c12" : `cobertura_${level === "bas" ? "c12" : level}`, {
        year,
        department,
      });
    default:
      return rate(metric, { year, department });
  }
}

/** Technical upper-secondary enrolment: a share of `media`, tilted by profile. */
export function technicalEnrolment({ year = CURRENT_YEAR, department = "all" } = {}) {
  const wanted = department === "all" ? departments.map((d) => d.id) : [department];
  const total = wanted.reduce((sum, id) => {
    const media = ENROLMENT[year].med[id];
    /* A department with more technical provision sends more of its upper
       secondary through it — the profile index moves the share, not the level. */
    const share = 0.118 * (1 + (PROFILE[id].technical - 1) * 0.85);
    return sum + media * share * technicalGrowth(year);
  }, 0);
  return Math.round(total);
}

/** Technical provision has grown faster than upper secondary as a whole. */
const technicalGrowth = (year) => 0.9 + (year - BASE_YEAR) * 0.021;

/* ---------------------------------------------------------------- finance */

/**
 * The financing dashboard. Millions of lempiras, invented end to end.
 */
export const finance = {
  currency: "L",
  unit: "millones de lempiras",
  budget: {
    2019: { assigned: 38_420, executed: 35_180 },
    2020: { assigned: 39_960, executed: 35_640 },
    2021: { assigned: 41_180, executed: 37_490 },
    2022: { assigned: 42_740, executed: 39_320 },
    2023: { assigned: 44_310, executed: 41_180 },
    2024: { assigned: 45_890, executed: 42_960 },
    2025: { assigned: 47_260, executed: 44_520 },
    2026: { assigned: 48_620, executed: 44_430 },
  },
  byLevel: [
    { id: "pre", name: "Prebásica", value: 5_340 },
    { id: "bas", name: "Básica", value: 27_910 },
    { id: "med", name: "Media", value: 11_260 },
    { id: "otros", name: "Gestión y programas transversales", value: 4_110 },
  ],
  byProgramme: [
    { id: "calidad", name: "Calidad y aprendizaje", value: 9_840 },
    { id: "inclusion", name: "Inclusión y equidad", value: 7_620 },
    { id: "docente", name: "Profesionalización docente", value: 8_950 },
    { id: "digital", name: "Transformación digital", value: 6_180 },
    { id: "gobernanza", name: "Gobernanza y transparencia", value: 3_240 },
    { id: "operacion", name: "Operación del sistema", value: 12_790 },
  ],
  note:
    "Información demostrativa para fines de diseño. Las cifras presupuestarias de este " +
    "prototipo no corresponden a ningún presupuesto público real.",
};

/** Territorial distribution of investment, derived so it adds to the total. */
export function financeByDepartment(year = CURRENT_YEAR) {
  const total = finance.budget[year].assigned;
  const shares = Object.fromEntries(
    departments.map((d) => {
      const enrolled = enrolment({ year, department: d.id });
      /* Per-student investment is slightly higher where provision is thinner:
         a dispersed territory costs more to serve. */
      return [d.id, enrolled * (1.12 - 0.18 * PROFILE[d.id].urban)];
    }),
  );
  const spread = distribute(total, shares);
  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    value: spread[d.id],
    perStudent: Math.round((spread[d.id] * 1_000_000) / enrolment({ year, department: d.id })),
  }));
}

/* -------------------------------------------------------------- inclusion */

/**
 * Inclusion figures.
 *
 * Reported as students served, with the language the portal uses throughout:
 * populations are described, never labelled by deficit.
 */
export const inclusion = {
  groups: [
    {
      id: "rural",
      name: "Estudiantes en centros rurales",
      value: () => Math.round(enrolment({}) * 0.472),
      note: "Matrícula atendida en centros de área rural.",
    },
    {
      id: "indigena",
      name: "Educación intercultural bilingüe",
      value: () => 148_600,
      note: "Estudiantes en centros con oferta intercultural bilingüe.",
    },
    {
      id: "afro",
      name: "Comunidades afrodescendientes",
      value: () => 61_400,
      note: "Estudiantes en centros de comunidades afrodescendientes.",
    },
    {
      id: "discapacidad",
      name: "Estudiantes con discapacidad",
      value: () => 39_800,
      note: "Estudiantes con alguna discapacidad registrada que reciben apoyo educativo.",
    },
  ],
  series: {
    indigena: { 2019: 121_400, 2020: 124_900, 2021: 128_700, 2022: 133_100, 2023: 137_800, 2024: 141_900, 2025: 145_400, 2026: 148_600 },
    discapacidad: { 2019: 26_300, 2020: 27_900, 2021: 29_800, 2022: 32_100, 2023: 34_400, 2024: 36_400, 2025: 38_200, 2026: 39_800 },
    afro: { 2019: 51_900, 2020: 53_200, 2021: 54_600, 2022: 56_400, 2023: 58_100, 2024: 59_400, 2025: 60_500, 2026: 61_400 },
  },
};

/* ------------------------------------------------------------- comparison */

/** Every headline figure for one territory — the comparator's row. */
export function territoryRow(id, year = CURRENT_YEAR) {
  const dept = byId[id];
  return {
    id,
    name: dept ? dept.name : "Nacional",
    capital: dept?.capital ?? "—",
    municipalities: dept?.municipalities ?? 298,
    matricula: metricFor("matricula", { year, department: id }),
    centros: metricFor("centros", { year, department: id }),
    docentes: metricFor("docentes", { year, department: id }),
    ratio: metricFor("ratio", { year, department: id }),
    cobertura: rate("cobertura_c12", { year, department: id }),
    coberturaMedia: rate("cobertura_med", { year, department: id }),
    permanencia: rate("retencion", { year, department: id }),
    desercion: rate("desercion", { year, department: id }),
    transicion: rate("transicion", { year, department: id }),
    conectividad: rate("conectividad", { year, department: id }),
    tecnica: technicalEnrolment({ year, department: id }),
  };
}

/** Year-on-year change of a metric, as a signed percentage. */
export function variation(metric, { year = CURRENT_YEAR, level = "all", department = "all" } = {}) {
  const now = metricFor(metric, { year, level, department });
  const before = metricFor(metric, { year: year - 1, level, department });
  if (!before || year - 1 < BASE_YEAR) return null;
  return round1(((now - before) / before) * 100);
}
