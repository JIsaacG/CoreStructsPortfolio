/**
 * Generative rules — the copy that is a format rather than a phrase.
 *
 * The demos between them render several hundred dates: a school calendar, a
 * statistical series, a request register, a customer's order history. None of
 * those strings were written by anybody; they are what a date formatter
 * produced. Listing each as a dictionary entry would be enormous, would go
 * stale the moment a date changed, and would say nothing about the others.
 *
 * A rule is `{ pattern, replace }`, and it only fires when it matches a run end
 * to end — see `applyRules` in `tools/lib/i18n.mjs`. That restriction matters:
 * a rule allowed to match halfway would leave a half-translated sentence and
 * take it out of the coverage report at the same time.
 *
 * Order counts; the first rule that matches wins.
 */

const MONTHS = {
  enero: "January", febrero: "February", marzo: "March", abril: "April",
  mayo: "May", junio: "June", julio: "July", agosto: "August",
  septiembre: "September", setiembre: "September", octubre: "October",
  noviembre: "November", diciembre: "December",
};

const SHORT = {
  ene: "Jan", feb: "Feb", mar: "Mar", abr: "Apr", may: "May", jun: "Jun",
  jul: "Jul", ago: "Aug", sep: "Sep", set: "Sep", oct: "Oct", nov: "Nov", dic: "Dec",
};

const WEEKDAYS = {
  lunes: "Monday", martes: "Tuesday", miércoles: "Wednesday", jueves: "Thursday",
  viernes: "Friday", sábado: "Saturday", domingo: "Sunday",
};

const WEEKDAYS_SHORT = {
  lun: "Mon", mar: "Tue", mié: "Wed", jue: "Thu", vie: "Fri", sáb: "Sat", dom: "Sun",
};

const alternation = (map) => Object.keys(map).join("|");
const lower = (value) => value.toLowerCase();

/* English capitalises months and weekdays wherever they fall, so the Spanish
   casing is not carried across: "enero" is "January", not "january". */

/**
 * Runs that carry no language at all: a reference code, a money amount, an
 * address. They are matched so that they come back accounted for rather than
 * sitting in the report forever as something nobody had looked at.
 */
const VERBATIM = [
  /-?L\s?[\d.,]+/, // Lempira amounts: "L 22,800", "-L 1,200"
  /[A-Z]{2,5}-[\dA-Z]+(?:-[\dA-Z]+)*/, // reference codes: "PED-30142", "AG-LG-101"
  /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/, // e-mail addresses
  /\+?\d[\d\s()-]{6,}\d/, // telephone numbers
  /\+?\d+h\s?\d+m/, // elapsed times: "44h 12m", "+1h 12m"
  /\d{1,2}:\d{2}(?::\d{2})?/, // clock times
];

/**
 * The units a data sheet is written in. A run made only of digits, separators
 * and these is a quantity, and a quantity is the same in both languages.
 */
const UNIT =
  "kVA|MVA|kWp|kWh|MWh|kV|kA|kW|Wp|VA|mAh|Ah|Hz|mm|cm|km|m³/h|m³|m²|m|bar|psi|°C|°F|" +
  "kg|t|MB|KB|GB|TB|Nm|BIL|Gr\\.B|UV|U|%|V|A|W|min|h|s|kbps|Mbps";

/** Standards bodies, whose designations are international. */
const STANDARD = "IEC|ISO|ASME|ASTM|ACI|EN|NFPA|IEEE|ANSI|DIN|API|NEMA|UL|RETIE|SL";

export const rules = [
  ...VERBATIM.map((pattern) => ({ pattern, replace: (match) => match })),

  /* "IEC 61850 / DNP3", "ASME B31.3", "IEC 62443 SL-2" — designations, not words. */
  {
    pattern: new RegExp(`(?:${STANDARD})[\\s·-]*[\\dA-Za-z][\\dA-Za-z.\\-/]*(?:[\\s·/+,-]+[\\dA-Za-z.\\-/]+)*`),
    replace: (match) => match,
  },

  /* "1 250 / 2 000 A", "60 – 480 m³/h", "6,0 × 2,4 × 2,9 m", "12 minutos a plena carga"
     is deliberately NOT matched: it has words in it and belongs in a dictionary. */
  {
    pattern: new RegExp(
      `[+-]?[\\d][\\d.,\\s×/+–-]*(?:${UNIT})(?:[\\s/·,×–-]+[+-]?[\\d.,\\s]*(?:${UNIT})?)*`,
    ),
    replace: (match) => match,
  },

  /* A URL is a URL. */
  { pattern: /https?:\/\/\S+/, replace: (match) => match },

  /* "PDF · 2,6 MB" -> "PDF · 2.6 MB": the decimal separator changes with the
     language, which is the only thing about a file size that does. */
  {
    pattern: /(PDF|XLSX|DOCX|PPTX|DWG|DXF|ZIP|CSV|JSON|XML)\s*·\s*([\d.,]+)\s*(KB|MB|GB)/i,
    replace: (_all, kind, size, unit) => `${kind} · ${size.replace(",", ".")} ${unit}`,
  },

  /* "148 páginas · 6,2 MB" — the weight of a document in the library. */
  {
    pattern: /(\d+)\s+páginas\s*·\s*([\d.,]+)\s*(KB|MB|GB)/i,
    replace: (_all, pages, size, unit) => `${pages} pages · ${size.replace(",", ".")} ${unit}`,
  },

  /* "8 – 12 semanas", "3 meses", "18 días" — a duration in the plural. */
  {
    pattern: /([\d]+(?:\s*[–-]\s*[\d]+)?)\s+(semanas|semana|meses|mes|días|día|años|año|horas|hora|minutos|minuto)/i,
    replace: (_all, count, unit) => {
      const WORDS = {
        semana: "week", semanas: "weeks", mes: "month", meses: "months",
        día: "day", días: "days", año: "year", años: "years",
        hora: "hour", horas: "hours", minuto: "minute", minutos: "minutes",
      };
      return `${count} ${WORDS[unit.toLowerCase()]}`;
    },
  },

  /* A range between two quantities: "-10 °C a 140 °C" -> "-10 °C to 140 °C". Both
     sides must be numeric, so "Lunes a viernes" cannot reach this. */
  {
    pattern: new RegExp(
      `([+-]?[\\d][\\d.,\\s]*(?:${UNIT})?) a ([+-]?[\\d][\\d.,\\s]*(?:${UNIT})?)`,
    ),
    replace: (_all, from, to) => `${from} to ${to}`,
  },

  /* "24 de agosto de 2026" -> "24 August 2026" */
  {
    pattern: new RegExp(`(\\d{1,2}) de (${alternation(MONTHS)}) de (\\d{4})`, "i"),
    replace: (_all, day, month, year) => `${day} ${MONTHS[lower(month)]} ${year}`,
  },

  /* "11 de febrero, 2026" — the form the editorial pages date articles with. */
  {
    pattern: new RegExp(`(\\d{1,2}) de (${alternation(MONTHS)}),\\s*(\\d{4})`, "i"),
    replace: (_all, day, month, year) => `${day} ${MONTHS[lower(month)]} ${year}`,
  },

  /* "24 de agosto" -> "24 August" */
  {
    pattern: new RegExp(`(\\d{1,2}) de (${alternation(MONTHS)})`, "i"),
    replace: (_all, day, month) => `${day} ${MONTHS[lower(month)]}`,
  },

  /* "agosto de 2026" -> "August 2026" */
  {
    pattern: new RegExp(`(${alternation(MONTHS)}) de (\\d{4})`, "i"),
    replace: (_all, month, year) => `${MONTHS[lower(month)]} ${year}`,
  },

  /* "24 ago 2026" -> "24 Aug 2026" */
  {
    pattern: new RegExp(`(\\d{1,2}) (${alternation(SHORT)})\\.? (\\d{4})`, "i"),
    replace: (_all, day, month, year) => `${day} ${SHORT[lower(month)]} ${year}`,
  },

  /* "24 ago" -> "24 Aug" */
  {
    pattern: new RegExp(`(\\d{1,2}) (${alternation(SHORT)})\\.?`, "i"),
    replace: (_all, day, month) => `${day} ${SHORT[lower(month)]}`,
  },

  /* "ago 2026" -> "Aug 2026" */
  {
    pattern: new RegExp(`(${alternation(SHORT)})\\.? (\\d{4})`, "i"),
    replace: (_all, month, year) => `${SHORT[lower(month)]} ${year}`,
  },

  /* "lunes 24 de agosto" -> "Monday 24 August" */
  {
    pattern: new RegExp(
      `(${alternation(WEEKDAYS)}) (\\d{1,2}) de (${alternation(MONTHS)})(?: de (\\d{4}))?`,
      "i",
    ),
    replace: (_all, day, date, month, year) =>
      `${WEEKDAYS[lower(day)]} ${date} ${MONTHS[lower(month)]}${year ? ` ${year}` : ""}`,
  },

  /* A month or a weekday on its own — a calendar heading, a column label. */
  {
    pattern: new RegExp(`(${alternation(MONTHS)})`, "i"),
    replace: (_all, month) => MONTHS[lower(month)],
  },
  {
    pattern: new RegExp(`(${alternation(WEEKDAYS)})`, "i"),
    replace: (_all, day) => WEEKDAYS[lower(day)],
  },
  {
    pattern: new RegExp(`(${alternation(WEEKDAYS_SHORT)})\\.?`, "i"),
    replace: (_all, day) => WEEKDAYS_SHORT[lower(day)],
  },

  /* ------------------------------------------------------------- templates */

  /* Sentence shapes the generators produce once per record. Each captures the
     pieces that vary and puts them back through `t`, so the shape is written
     here once and the vocabulary inside it stays with the site's dictionary. */

  /* "PDF · 740 KB · 31 páginas" — the weight line under a legal instrument. */
  {
    pattern: /(PDF|XLSX|DOCX|ZIP|CSV)\s*·\s*([\d.,]+)\s*(KB|MB|GB)\s*·\s*(\d+)\s*páginas/i,
    replace: (_all, kind, size, unit, pages) =>
      `${kind} · ${size.replace(",", ".")} ${unit} · ${pages} pages`,
  },

  /* A row of two to five `<span>`s, each holding one field: the shape the
     registers use for a document's type, subject, date and weight. The rule
     fires only when every field is separately covered — otherwise it stands
     aside and lets the run be reported, rather than shipping Spanish inside an
     English-looking template. */
  {
    pattern: /(?:<span[^>]*>[^<]*<\/span>){2,5}/,
    replace: (all, t) => {
      const spans = [...all.matchAll(/<span([^>]*)>([^<]*)<\/span>/g)];
      if (!spans.every(([, , field]) => t.known(field))) return undefined;
      // The attributes come back untouched: only the field between the tags is
      // copy, and an inline style is not.
      return spans.map(([, attrs, field]) => `<span${attrs}>${t(field)}</span>`).join("");
    },
  },

  /* "PDF · 18 abr 2021", "Página · 15 ene 2026" — a format and a date, the line
     under every document in the transparency register. */
  {
    pattern: /(PDF|XLSX|CSV|JSON|ZIP|DOCX|Página|Video|Vídeo) · (.+)/,
    replace: (_all, kind, rest, t) => `${t(kind)} · ${t(rest)}`,
  },

  /* "41.2 % de avance", "Indicador de seguimiento: …", "Objetivos del eje 01…"
     — three more shapes the plan and the policy pages repeat per strand. */
  {
    pattern: /([\d.,]+\s*%) de avance/,
    replace: (_all, value) => `${value} complete`,
  },
  {
    pattern: /Indicador de seguimiento: (.+)/,
    replace: (_all, subject, t) => `Monitoring indicator: ${t(subject)}`,
  },
  {
    pattern: /Objetivos del eje (\d+)\. Metas y líneas base demostrativas\./,
    replace: (_all, strand) =>
      `Objectives of strand ${strand}. Illustrative targets and baselines.`,
  },

  /* "pp" is percentage points in both languages. */
  { pattern: /[+-−]?\s*[\d.,]+\s*pp/, replace: (match) => match },

  /* "26 ago · 09:12" — the back office stamps its activity log this way. */
  {
    pattern: new RegExp(`(\d{1,2} (?:${alternation(SHORT)})\.?) · (\d{1,2}:\d{2})`, "i"),
    replace: (_all, date, time, t) => `${t(date)} · ${time}`,
  },

  /* "148 observaciones", "3.400 centros", "78.240 docentes" — a count and the
     thing counted. Spanish groups thousands with a full stop and English with a
     comma, so the number moves as well as the noun. */
  {
    pattern: /([\d][\d.,\s]*)\s+(observaciones|observación|centros|centro|estudiantes|docentes|recursos|instrumentos|departamentos|municipios|publicaciones|programas|conjuntos|artículos|páginas|equipos)/i,
    replace: (_all, count, noun, t) => {
      const NOUNS = {
        observación: "submission", observaciones: "submissions",
        centro: "school", centros: "schools",
        estudiantes: "students", docentes: "teachers",
        recursos: "resources", instrumentos: "instruments",
        departamentos: "departments", municipios: "municipalities",
        publicaciones: "publications", programas: "programmes",
        conjuntos: "datasets", "artículos": "items",
        "páginas": "pages", equipos: "products",
      };
      const grouped = /^\d{1,3}(\.\d{3})+$/.test(count.trim())
        ? count.trim().replace(/\./g, ",")
        : count.trim();
      return `${grouped} ${NOUNS[noun.toLowerCase()] ?? t(noun)}`;
    },
  },

  /* "ACUERDO CEDE 014-2026" — the reference of a Council resolution. */
  {
    pattern: /ACUERDO CEDE (.+)/,
    replace: (_all, reference) => `RESOLUTION CEDE ${reference}`,
  },

  /* "Calendarios · PDF · 180 KB · actualizado el 20 ago 2026 · Toda la
     comunidad" — the metadata line under every document in the centre. */
  {
    pattern: /(.+?) · (PDF|XLSX|DOCX|ZIP|CSV) · ([\d.,]+ (?:KB|MB|GB)) · actualizado el (.+?) · (.+)/,
    replace: (_all, category, kind, size, date, audience, t) =>
      `${t(category)} · ${kind} · ${size.replace(",", ".")} · updated ${t(date)} · ${t(audience)}`,
  },

  /* The comparison strip repeats four shapes for every figure it shows. */
  { pattern: /Actual (.+)/, replace: (_all, value) => `Current ${value}` },
  { pattern: /Meta (\d.*)/, replace: (_all, value) => `Target ${value}` },
  { pattern: /Meta (\d{4}): (.+)/, replace: (_all, year, value) => `${year} target: ${value}` },
  { pattern: /([\d.,]+) puntos/, replace: (_all, value) => `${value} points` },
  { pattern: /([\d.,]+) registros/, replace: (_all, value) => `${value} records` },
  {
    pattern: /([+-−—]?\s*[\d.,—]*\s*(?:pp|%)) vs\. (\d{4})/,
    replace: (_all, value, year) => `${value} vs. ${year}`,
  },

  /* The observatory builds the same handful of captions round each of its ten
     indicators. Naming the shapes here rather than the results keeps the
     indicator names in one place and stops them drifting apart between a chart
     title, a map label and an accessible name for the same figure. */
  {
    pattern: /Serie histórica · (.+)/,
    replace: (_all, subject, t) => `Historical series · ${t(subject)}`,
  },
  {
    pattern: /Mapa de Honduras por departamento · (.+)/,
    replace: (_all, subject, t) => `Map of Honduras by department · ${t(subject)}`,
  },
  {
    pattern: /Indicador · (.+)/,
    replace: (_all, subject, t) => `Indicator · ${t(subject)}`,
  },
  {
    pattern: /(.+) por departamento(, (\d{4}))?/,
    replace: (_all, subject, _tail, year, t) =>
      `${t(subject)} by department${year ? `, ${year}` : ""}`,
  },
  {
    pattern: /(.+), (\d{4}) a (\d{4})/,
    replace: (_all, subject, from, to, t) => `${t(subject)}, ${from} to ${to}`,
  },
  {
    pattern: /Comparación de (.+)/,
    replace: (_all, subject, t) => `Comparison of ${t(subject)}`,
  },
  {
    pattern: /Línea base (.+)/,
    replace: (_all, value) => `Baseline ${value}`,
  },

  /* "Tasa de finalización…: 78.9 % de una meta de 88.0 %" — a progress bar on
     the SDG 4 board, one per target. */
  {
    pattern: /(.+): (.+?) de una meta de (.+)/,
    replace: (_all, subject, value, target, t) =>
      `${t(subject)}: ${value} against a target of ${target}`,
  },

  /* "<something> · CEDE", "<something> · AUREA" — every page title on the two
     portals. The part before the separator is already in the dictionary as a
     heading, so the title needs no second entry of its own. */
  {
    pattern: /(.+) · (CEDE|AUREA)/,
    replace: (_all, subject, site, t) => `${t(subject)} · ${site}`,
  },

  /* Every AUREA notice prints when it was issued and how long it stands:
     "5 sep 2026 · vigente hasta 19 sep 2026". Both ends go back through the
     date rules, so a new notice needs no entry of its own. */
  {
    pattern: /(.+) · vigente hasta (.+)/,
    replace: (_all, from, until, t) => `${t(from)} · in force until ${t(until)}`,
  },

  /* The parenthesis AUREA appends to every structured FAQ answer, which is what
     keeps an invented fee or deadline from reading as a real one. */
  {
    pattern: /(.+) \(Contenido demostrativo: AUREA es una institución ficticia\.\)/,
    replace: (_all, body, t) =>
      `${t(body)} (Illustrative content: AUREA is a fictional institution.)`,
  },

  /* The disclaimer every AUREA page description ends with. */
  {
    pattern: /(.+) (Programa|Noticia) demostrativ[ao] de AUREA, institución ficticia\./,
    replace: (_all, body, kind, t) =>
      `${t(body)} An illustrative AUREA ${kind === "Programa" ? "programme" : "news story"}; ` +
      "AUREA is a fictional institution.",
  },

  /* "Consulta pública demostrativa: <draft>" and "<sentence> Datos
     demostrativos." — two wrappers the generators put round copy that is
     already translated on its own. */
  {
    pattern: /Consulta pública demostrativa: (.+)/,
    replace: (_all, subject, t) => `Illustrative public consultation: ${t(subject)}`,
  },
  {
    pattern: /(.+[.:]) Datos demostrativos\./,
    replace: (_all, subject, t) => `${t(subject)} Illustrative data.`,
  },
  {
    pattern: /Matrícula por (.+)/,
    replace: (_all, subject, t) => `Enrolment by ${t(subject)}`,
  },

  /* The accessible name on every region of a choropleth. There are eighteen
     departments across ten indicators, so this shape appears some hundreds of
     times and would otherwise be hundreds of dictionary entries that differ
     only in a number. */
  {
    pattern: /(.+?): (.+?)\. Ver detalle de (.+)/,
    replace: (_all, place, value, again, t) =>
      `${t(place)}: ${value}. View details for ${t(again)}`,
  },

  /* "Calidad y aprendizaje: 41.2 % de avance" — a progress bar's label. */
  {
    pattern: /(.+?): ([\d.,]+\s*%) de avance/,
    replace: (_all, label, value, t) => `${t(label)}: ${value} complete`,
  },

  /* Chart axes and legends count in thousands: "21 mil–109 mil" -> "21k–109k". */
  {
    pattern: /([\d.,]+) mil\s*[–-]\s*([\d.,]+) mil/,
    replace: (_all, from, to) => `${from}k–${to}k`,
  },
  { pattern: /([\d.,]+) mil/, replace: (_all, value) => `${value}k` },

  /* "Marzo 2026" — a month and a year with no preposition between them. */
  {
    pattern: new RegExp(`(${alternation(MONTHS)})\\s+(\\d{4})`, "i"),
    replace: (_all, month, year) => `${MONTHS[lower(month)]} ${year}`,
  },

  /* "23 de agosto de 2026 · 11:55" — a filing stamp. */
  {
    pattern: /(.+? de .+? de \d{4}) · (\d{1,2}:\d{2})/,
    replace: (_all, date, time, t) => `${t(date)} · ${time}`,
  },

  /* "Solicitud de compra · registro 23 de agosto de 2026" */
  {
    pattern: /(.+) · registro (.+)/,
    replace: (_all, subject, date, t) => `${t(subject)} · filed ${t(date)}`,
  },

  /* "Renovación de contrato de limpieza. Solicitado por Rodrigo Salgado, Administración." */
  {
    pattern: /(.+)\. Solicitado por (.+), (.+)\./,
    replace: (_all, subject, person, area, t) =>
      `${t(subject)}. Requested by ${t(person)}, ${t(area)}.`,
  },

  /* "SOL-2026-0134.pdf archivado en el expediente." */
  {
    pattern: /(\S+\.pdf) archivado en el expediente\./,
    replace: (_all, file) => `${file} filed in the record.`,
  },

  /* "Sesión de Consejo en San Pedro Sula · Planificación." — subject over area. */
  {
    pattern: /(.+) · ([^·]+)\./,
    replace: (_all, subject, area, t) => `${t(subject)} · ${t(area)}.`,
  },

  /* Ranges the calendars print: "24 – 28 de agosto", "Ene – Dic". */
  {
    pattern: new RegExp(`(\\d{1,2})\\s*[–-]\\s*(\\d{1,2}) de (${alternation(MONTHS)})`, "i"),
    replace: (_all, from, to, month) => `${from}–${to} ${MONTHS[lower(month)]}`,
  },
  {
    pattern: new RegExp(
      `(${alternation(SHORT)})\\.?\\s*[–-]\\s*(${alternation(SHORT)})\\.?`,
      "i",
    ),
    replace: (_all, from, to) => `${SHORT[lower(from)]}–${SHORT[lower(to)]}`,
  },

  /* A calendar entry that spans several days prints both ends in full:
     "3 oct 2026 – 7 oct 2026". Neither end matches the single-date rule on its
     own, because a rule only fires on a whole run, so the span is written out
     here rather than listed once per event. */
  {
    pattern: new RegExp(
      `(\\d{1,2}) (${alternation(SHORT)})\\.? (\\d{4})\\s*[–-]\\s*` +
        `(\\d{1,2}) (${alternation(SHORT)})\\.? (\\d{4})`,
      "i",
    ),
    replace: (_all, fromDay, fromMonth, fromYear, toDay, toMonth, toYear) =>
      `${fromDay} ${SHORT[lower(fromMonth)]} ${fromYear} – ` +
      `${toDay} ${SHORT[lower(toMonth)]} ${toYear}`,
  },

  /* The same span inside a single month: "3 – 7 oct 2026". */
  {
    pattern: new RegExp(
      `(\\d{1,2})\\s*[–-]\\s*(\\d{1,2}) (${alternation(SHORT)})\\.? (\\d{4})`,
      "i",
    ),
    replace: (_all, from, to, month, year) =>
      `${from}–${to} ${SHORT[lower(month)]} ${year}`,
  },
];
