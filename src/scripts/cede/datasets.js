/**
 * Turning a catalogue entry into an actual table of data.
 *
 * The open-data page could have offered placeholder files. Instead each entry
 * declares which series it is made of, and the rows are generated here from the
 * same module the charts read — so the file a visitor downloads holds the very
 * numbers the portal drew, in long format, with the column names the data
 * dictionary documents.
 *
 * The row counts published in the catalogue are the counts these functions
 * produce; they are not decoration.
 */

import { departments } from "../../data/cede/geography.js";
import {
  YEARS,
  enrolment,
  levels,
  metricFor,
  rate,
  technicalEnrolment,
} from "../../data/cede/statistics.js";

/** The eighteen indicators of the consolidated territorial table. */
const TERRITORIAL_METRICS = [
  { id: "matricula", label: "Matrícula", kind: "count" },
  { id: "centros", label: "Centros educativos", kind: "count" },
  { id: "docentes", label: "Personal docente", kind: "count" },
  { id: "ratio", label: "Relación estudiante/docente", kind: "decimal" },
  { id: "tecnica", label: "Matrícula técnica", kind: "count" },
  { id: "cobertura_pre", label: "Cobertura prebásica", kind: "rate" },
  { id: "cobertura_c12", label: "Cobertura básica I y II ciclo", kind: "rate" },
  { id: "cobertura_c3", label: "Cobertura básica III ciclo", kind: "rate" },
  { id: "cobertura_med", label: "Cobertura media", kind: "rate" },
  { id: "retencion", label: "Retención", kind: "rate" },
  { id: "desercion", label: "Deserción", kind: "rate" },
  { id: "repitencia", label: "Repitencia", kind: "rate" },
  { id: "transicion", label: "Transición a media", kind: "rate" },
  { id: "sobreedad", label: "Sobreedad", kind: "rate" },
  { id: "electricidad", label: "Centros con electricidad", kind: "rate" },
  { id: "agua", label: "Centros con agua", kind: "rate" },
  { id: "conectividad", label: "Centros con conectividad", kind: "rate" },
  { id: "brecha_digital", label: "Hogares sin conexión ni dispositivo", kind: "rate" },
];

const INFRASTRUCTURE = [
  ["electricidad", "Acceso a electricidad"],
  ["agua", "Acceso a agua"],
  ["conectividad", "Conectividad a internet"],
  ["laboratorios", "Laboratorio o taller"],
  ["bibliotecas", "Biblioteca o centro de recursos"],
  ["accesibilidad", "Accesibilidad física"],
];

const PERMANENCE = [
  ["retencion", "Retención"],
  ["desercion", "Deserción intranual"],
  ["repitencia", "Repitencia"],
  ["transicion", "Transición a media"],
  ["sobreedad", "Sobreedad"],
];

const COVERAGE = [
  ["cobertura_pre", "Prebásica"],
  ["cobertura_c12", "Básica I y II ciclo"],
  ["cobertura_c3", "Básica III ciclo"],
  ["cobertura_med", "Media"],
];

/**
 * Build the rows of one dataset.
 *
 * Long format throughout — one observation per row — because that is the shape
 * that survives being loaded into anything, from a spreadsheet to a notebook.
 */
export function buildDatasetRows(dataset) {
  const rows = [];

  switch (dataset.slug) {
    case "matricula-por-nivel":
      for (const year of YEARS) {
        for (const department of departments) {
          for (const level of levels) {
            rows.push([
              year,
              department.id,
              department.name,
              level.id,
              level.name,
              enrolment({ year, level: level.id, department: department.id }),
            ]);
          }
        }
      }
      return {
        header: ["anio", "departamento", "departamento_nombre", "nivel", "nivel_nombre", "matricula"],
        rows,
      };

    case "centros-educativos":
    case "personal-docente": {
      const metric = dataset.slug === "centros-educativos" ? "centros" : "docentes";
      for (const year of YEARS) {
        for (const department of departments) {
          rows.push([
            year,
            department.id,
            department.name,
            metricFor(metric, { year, department: department.id }),
          ]);
        }
      }
      return { header: ["anio", "departamento", "departamento_nombre", metric], rows };
    }

    case "cobertura-educativa":
      for (const year of YEARS) {
        for (const department of departments) {
          for (const [metric, label] of COVERAGE) {
            rows.push([year, department.id, department.name, metric, label, rate(metric, { year, department: department.id })]);
          }
        }
      }
      return {
        header: ["anio", "departamento", "departamento_nombre", "indicador", "indicador_nombre", "valor_porcentaje"],
        rows,
      };

    case "permanencia-escolar":
      for (const year of YEARS) {
        for (const department of departments) {
          for (const [metric, label] of PERMANENCE) {
            rows.push([year, department.id, department.name, metric, label, rate(metric, { year, department: department.id })]);
          }
        }
      }
      return {
        header: ["anio", "departamento", "departamento_nombre", "indicador", "indicador_nombre", "valor_porcentaje"],
        rows,
      };

    case "infraestructura-servicios":
      for (const year of YEARS) {
        for (const department of departments) {
          for (const [metric, label] of INFRASTRUCTURE) {
            rows.push([year, department.id, department.name, metric, label, rate(metric, { year, department: department.id })]);
          }
        }
      }
      return {
        header: ["anio", "departamento", "departamento_nombre", "indicador", "indicador_nombre", "centros_porcentaje"],
        rows,
      };

    case "educacion-tecnica":
      for (const year of YEARS) {
        for (const department of departments) {
          rows.push([year, department.id, department.name, "matricula_tecnica", technicalEnrolment({ year, department: department.id })]);
          rows.push([year, department.id, department.name, "insercion_laboral", rate("insercion_tecnica", { year, department: department.id })]);
        }
      }
      return { header: ["anio", "departamento", "departamento_nombre", "indicador", "valor"], rows };

    default:
      for (const year of YEARS) {
        for (const department of departments) {
          for (const metric of TERRITORIAL_METRICS) {
            const value =
              metric.kind === "rate"
                ? rate(metric.id, { year, department: department.id })
                : metricFor(metric.id, { year, department: department.id });
            rows.push([year, department.id, department.name, metric.id, metric.label, value, metric.kind]);
          }
        }
      }
      return {
        header: [
          "anio",
          "departamento",
          "departamento_nombre",
          "indicador",
          "indicador_nombre",
          "valor",
          "unidad",
        ],
        rows,
      };
  }
}
