import type { BackendMetric } from "../services/jobsApi";

/* Helpers de presentación de métricas, compartidos por Resultados y Comparación. */

export const MAX_SCORE = 5;
const TIME_METRIC_IDS = new Set(["sprint_20m"]);

export function isTimeMetricId(id: string): boolean {
  return TIME_METRIC_IDS.has(id);
}

export function formatSprintTime(seconds: number): string {
  const totalTenths = Math.max(0, Math.round(seconds * 10));
  const minutes = Math.floor(totalTenths / 600);
  const secs = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${tenths}`;
}

export function scoreColor(score: number): string {
  if (score >= 4) return "var(--ts-success)";
  if (score >= 3) return "var(--ts-warning)";
  return "var(--ts-error)";
}

const METRIC_TITLE_OVERRIDES: Record<string, string> = {
  tecnica_carrera: "Técnica de Carrera",
  sprint_20m: "Tiempo",
};

export function formatMetricName(name: string): string {
  if (METRIC_TITLE_OVERRIDES[name]) return METRIC_TITLE_OVERRIDES[name];
  const label = name.replaceAll("_", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMetricTitle(title: string): string {
  return title.replace(/\s*\(conducci[oó]n\)\s*$/i, "").trim();
}

export function metricLabel(id: string, metric: BackendMetric): string {
  return metric.titulo ? formatMetricTitle(metric.titulo) : formatMetricName(id);
}

export function metricRepetitions(metric: BackendMetric): number {
  return metric.resumen?.total_repeticiones
    ?? metric.estadisticas?.total_repeticiones
    ?? metric.repeticiones?.length
    ?? 0;
}

/** Puntaje 1-5 tal como lo informa el backend; null si no está disponible. */
export function metricScore(metric: BackendMetric): number | null {
  const score = metric.resumen?.puntaje ?? metric.estadisticas?.puntaje_promedio;
  return typeof score === "number" && Number.isFinite(score) ? score : null;
}

export interface RepetitionScore {
  repetition: number;
  score: number | null;
  durationSeconds: number | null;
  criterio: string | null;
}

export function normalizeRepetitionScores(repeticiones: unknown[] | undefined): RepetitionScore[] {
  if (!Array.isArray(repeticiones)) return [];

  return repeticiones.flatMap((entry, index) => {
    if (typeof entry === "number") {
      return [{ repetition: index + 1, score: entry, durationSeconds: null, criterio: null }];
    }

    if (typeof entry === "string") {
      const parsed = Number(entry);
      return Number.isNaN(parsed)
        ? [{ repetition: index + 1, score: null, durationSeconds: null, criterio: null }]
        : [{ repetition: index + 1, score: parsed, durationSeconds: null, criterio: null }];
    }

    if (entry && typeof entry === "object") {
      const record = entry as Record<string, unknown>;
      const maybeScore = record.score ?? record.puntaje ?? record.valor ?? record.rating;
      const maybeDuration = record.duration_seconds ?? record.durationSeconds ?? record.duracion_segundos ?? record.duracion_seconds ?? record.duration ?? record.duracion ?? record.tiempo_segundos;
      const maybeRepetition = record.id ?? record.repeticion ?? record.rep ?? record.numero ?? record.index;
      const maybeCriterio = record.criterio ?? record.criteria ?? record.comentario ?? record.observacion;
      const parsedScore = typeof maybeScore === "number" ? maybeScore : Number(maybeScore);
      const parsedDuration = typeof maybeDuration === "number" ? maybeDuration : Number(maybeDuration);
      const parsedRepetition = typeof maybeRepetition === "number"
        ? maybeRepetition
        : typeof maybeRepetition === "string"
          ? Number(maybeRepetition)
          : index + 1;
      const hasScore = maybeScore !== undefined && maybeScore !== null && !Number.isNaN(parsedScore);
      const hasDuration = maybeDuration !== undefined && maybeDuration !== null && !Number.isNaN(parsedDuration);
      const criterio = typeof maybeCriterio === "string" && maybeCriterio.trim() ? maybeCriterio.trim() : null;
      return [{
        repetition: Number.isFinite(parsedRepetition) ? parsedRepetition : index + 1,
        score: hasScore ? parsedScore : null,
        durationSeconds: hasDuration ? parsedDuration : null,
        criterio,
      }];
    }

    return [{ repetition: index + 1, score: null, durationSeconds: null, criterio: null }];
  });
}
