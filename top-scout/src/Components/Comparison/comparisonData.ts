import type { BackendJob, BackendMetric, ResultsResponse } from "../../services/jobsApi";
import {
  formatMetricName, isTimeMetricId, metricLabel, metricRepetitions, metricScore, normalizeRepetitionScores,
} from "../../utils/metrics";

/*
 * Arma la tabla comparativa a partir de los reportes tal como los devuelve el backend.
 * No se recalcula ni se agrega nada: cada celda es un valor presente en el reporte de
 * una evaluación, y cada evaluación es una fila propia.
 */

export type ColumnKind = "score" | "time" | "number";

export interface ComparisonColumn {
  key: string;
  label: string;
  unit?: string;
  kind: ColumnKind;
  decimals?: number;
  /** Define el sentido inicial al ordenar (mejor primero). */
  higherIsBetter: boolean;
}

export interface ComparisonRow {
  jobId: string;
  player: string;
  date: string | null;
  values: Record<string, number | null>;
  error?: string;
}

/* Valores de resumen con unidad física que el backend informa para algunas métricas. */
const SUMMARY_FIELDS: Record<string, Omit<ComparisonColumn, "key">> = {
  duracion_promedio_segundos: { label: "Duración promedio", unit: "s", kind: "number", decimals: 2, higherIsBetter: false },
  velocidad_maxima_m_s: { label: "Velocidad máxima", unit: "m/s", kind: "number", decimals: 2, higherIsBetter: true },
};

function finiteOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sprintCells(id: string, metric: BackendMetric) {
  const raw = Array.isArray(metric.repeticiones) ? metric.repeticiones : [];
  const name = formatMetricName(id);
  return normalizeRepetitionScores(raw).flatMap(({ repetition, durationSeconds }, index) => {
    const record = raw[index] && typeof raw[index] === "object" ? raw[index] as Record<string, unknown> : {};
    return [
      {
        column: { key: `${id}:rep${repetition}:time`, label: `${name} · Rep ${repetition}`, kind: "time", higherIsBetter: false } as ComparisonColumn,
        value: durationSeconds,
      },
      {
        column: { key: `${id}:rep${repetition}:speed`, label: `Vel. media · Rep ${repetition}`, unit: "km/h", kind: "number", decimals: 1, higherIsBetter: true } as ComparisonColumn,
        value: finiteOrNull(record.velocidad_media_km_h),
      },
    ];
  });
}

function scoreCells(id: string, metric: BackendMetric) {
  const evaluated = metricRepetitions(metric) > 0;
  const cells: Array<{ column: ComparisonColumn; value: number | null }> = [{
    column: { key: `${id}:score`, label: metricLabel(id, metric), unit: "/5", kind: "score", higherIsBetter: true },
    value: evaluated ? metricScore(metric) : null,
  }];
  const summary: Record<string, unknown> = metric.resumen ?? {};
  for (const [field, definition] of Object.entries(SUMMARY_FIELDS)) {
    if (field in summary) cells.push({ column: { key: `${id}:${field}`, ...definition }, value: finiteOrNull(summary[field]) });
  }
  return cells;
}

export function playerName(job: BackendJob): string {
  return job.session_name?.trim() || job.original_filename?.trim() || "Sin nombre";
}

export function buildComparison(
  jobs: BackendJob[],
  results: Record<string, ResultsResponse | Error>,
): { columns: ComparisonColumn[]; rows: ComparisonRow[] } {
  const columns = new Map<string, ComparisonColumn>();
  const rows: ComparisonRow[] = [];

  for (const job of jobs) {
    const result = results[job.id];
    if (!result) continue;
    const row: ComparisonRow = {
      jobId: job.id,
      player: playerName(job),
      date: job.finished_at ?? job.created_at ?? null,
      values: {},
    };

    if (result instanceof Error) {
      row.error = result.message;
    } else {
      for (const [id, metric] of Object.entries(result.report?.metricas ?? {})) {
        const cells = isTimeMetricId(id) ? sprintCells(id, metric) : scoreCells(id, metric);
        for (const { column, value } of cells) {
          if (!columns.has(column.key)) columns.set(column.key, column);
          row.values[column.key] = value;
        }
      }
    }
    rows.push(row);
  }

  return { columns: [...columns.values()], rows };
}

export type SortKey = "player" | "date" | string;
export type SortDirection = "asc" | "desc";

/** Ordena sin mutar; los valores faltantes van siempre al final. */
export function sortRows(rows: ComparisonRow[], key: SortKey, direction: SortDirection): ComparisonRow[] {
  const factor = direction === "asc" ? 1 : -1;
  const valueOf = (row: ComparisonRow): number | string | null => {
    if (key === "player") return row.player.toLocaleLowerCase("es");
    if (key === "date") return row.date ? new Date(row.date).getTime() : null;
    return row.values[key] ?? null;
  };

  return [...rows].sort((a, b) => {
    const va = valueOf(a);
    const vb = valueOf(b);
    if (va === null && vb === null) return 0;
    if (va === null) return 1;
    if (vb === null) return -1;
    if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb, "es") * factor;
    return ((va as number) - (vb as number)) * factor;
  });
}
