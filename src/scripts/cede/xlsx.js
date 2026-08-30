/**
 * A minimal XLSX writer — about a hundred lines, no dependencies.
 *
 * The brief asked for CSV, XLSX and PDF downloads and said the prototype could
 * simulate them. Simulating a download teaches a prospective client nothing, so
 * this writes a real workbook instead: an `.xlsx` is a ZIP of XML parts, and
 * ZIP allows entries to be *stored* rather than deflated, which removes the
 * only piece that would have needed a compression library.
 *
 * What it supports is exactly what a data table needs: one sheet, a header row,
 * text and numeric cells, and frozen headers. Numbers stay numbers, so the file
 * opens in a spreadsheet ready to sort and chart — which is the whole point of
 * publishing a table as a workbook rather than as an image of one.
 */

/* ------------------------------------------------------------------- CRC32 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/* --------------------------------------------------------------------- ZIP */

const encoder = new TextEncoder();

/**
 * Build a ZIP archive with every entry stored uncompressed.
 *
 * Stored entries are legal ZIP and every spreadsheet reads them; the cost is
 * file size, and a table of a few hundred rows is a few tens of kilobytes.
 */
function zip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;

  const u16 = (value) => [value & 0xff, (value >>> 8) & 0xff];
  const u32 = (value) => [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const data = encoder.encode(file.content);
    const crc = crc32(data);

    const local = [
      ...u32(0x04034b50),
      ...u16(20), // version needed
      ...u16(0x0800), // UTF-8 filenames
      ...u16(0), // stored
      ...u16(0), // time
      ...u16(0), // date
      ...u32(crc),
      ...u32(data.length),
      ...u32(data.length),
      ...u16(nameBytes.length),
      ...u16(0),
    ];

    chunks.push(new Uint8Array(local), nameBytes, data);

    central.push({
      name: nameBytes,
      crc,
      size: data.length,
      offset,
    });

    offset += local.length + nameBytes.length + data.length;
  }

  const directory = [];
  for (const entry of central) {
    const header = [
      ...u32(0x02014b50),
      ...u16(20),
      ...u16(20),
      ...u16(0x0800),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(entry.crc),
      ...u32(entry.size),
      ...u32(entry.size),
      ...u16(entry.name.length),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(0),
      ...u32(entry.offset),
    ];
    directory.push(new Uint8Array(header), entry.name);
  }

  const directorySize = directory.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array([
    ...u32(0x06054b50),
    ...u16(0),
    ...u16(0),
    ...u16(central.length),
    ...u16(central.length),
    ...u32(directorySize),
    ...u32(offset),
    ...u16(0),
  ]);

  return new Blob([...chunks, ...directory, end], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/* -------------------------------------------------------------------- XLSX */

const xmlEscape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** A1, B1 … the column letters a sheet addresses cells by. */
function cellRef(column, row) {
  let letters = "";
  let index = column;
  do {
    letters = String.fromCharCode(65 + (index % 26)) + letters;
    index = Math.floor(index / 26) - 1;
  } while (index >= 0);
  return `${letters}${row + 1}`;
}

/**
 * Build the workbook.
 *
 * `rows` is an array of arrays. A cell whose value is a finite number is
 * written as a number; everything else is written as an inline string, which
 * avoids the shared-string table without losing anything a report needs.
 */
export function toXlsx({ rows, sheetName = "Datos" }) {
  const sheetRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const reference = cellRef(columnIndex, rowIndex);
          const numeric = typeof value === "number" && Number.isFinite(value);
          if (numeric) return `<c r="${reference}"><v>${value}</v></c>`;
          const text = value === null || value === undefined ? "" : String(value);
          return `<c r="${reference}" t="inlineStr"${rowIndex === 0 ? ' s="1"' : ""}>` +
            `<is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  const widths = (rows[0] ?? [])
    .map((_, index) => {
      const longest = rows.reduce((max, row) => Math.max(max, String(row[index] ?? "").length), 10);
      return `<col min="${index + 1}" max="${index + 1}" width="${Math.min(52, longest + 4)}" customWidth="1"/>`;
    })
    .join("");

  const files = [
    {
      name: "[Content_Types].xml",
      content:
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
        `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
        `<Default Extension="xml" ContentType="application/xml"/>` +
        `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
        `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
        `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
        `</Types>`,
    },
    {
      name: "_rels/.rels",
      content:
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
        `</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      content:
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
        `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
        `<sheets><sheet name="${xmlEscape(sheetName.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content:
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
        `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
        `</Relationships>`,
    },
    {
      /* Two styles: the default, and a bold one for the header row. */
      name: "xl/styles.xml",
      content:
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
        `<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>` +
        `<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>` +
        `<fills count="1"><fill><patternFill patternType="none"/></fill></fills>` +
        `<borders count="1"><border/></borders>` +
        `<cellStyleXfs count="1"><xf/></cellStyleXfs>` +
        `<cellXfs count="2"><xf xfId="0"/><xf xfId="0" fontId="1" applyFont="1"/></cellXfs>` +
        `</styleSheet>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content:
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
        `<sheetViews><sheetView workbookViewId="0">` +
        `<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>` +
        `</sheetView></sheetViews>` +
        `<cols>${widths}</cols>` +
        `<sheetData>${sheetRows}</sheetData></worksheet>`,
    },
  ];

  return zip(files);
}
