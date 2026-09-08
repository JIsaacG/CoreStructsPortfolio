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

export const rules = [
  /* "24 de agosto de 2026" -> "24 August 2026" */
  {
    pattern: new RegExp(`(\\d{1,2}) de (${alternation(MONTHS)}) de (\\d{4})`, "i"),
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
];
