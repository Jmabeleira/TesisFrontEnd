/* ─── Tipos del backend (/api/v1/jobs) ───────────────────────────── */
export interface BackendJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | string;
  session_name?: string | null;
  original_filename?: string | null;
  exercise_id?: number | string | null;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
}

export interface JobsResponse {
  items: BackendJob[];
  total?: number;
}

interface MetricSummary { total_repeticiones?: number; puntaje?: number; nivel?: string; [key: string]: unknown; }
interface MetricStatistics { total_repeticiones?: number; puntaje_promedio?: number; nivel?: string; [key: string]: unknown; }

export interface BackendMetric {
  titulo?: string;
  descripcion?: string;
  repeticiones?: unknown[];
  resumen?: MetricSummary;
  estadisticas?: MetricStatistics;
}

export interface BackendArtifact {
  name: string;
  filename?: string;
  content_type?: string;
  download_url: string;
}

export interface ResultsResponse {
  job_id: string;
  status: string;
  session_name?: string | null;
  exercise_id?: number | string;
  report?: { video?: string; metricas?: Record<string, BackendMetric>; };
  artifacts?: BackendArtifact[];
}

/* ─── Endpoints ──────────────────────────────────────────────────── */
// El backend acepta como máximo 100 items por página.
const JOBS_PAGE_SIZE = 100;
const RESULTS_CONCURRENCY = 4;

export function jobsEndpoint(): string {
  const backendApi = import.meta.env.VITE_BACKEND_API ?? "";
  const endpoint = import.meta.env.VITE_ANALYSIS_ENDPOINT ?? "/api/v1/jobs";
  return `${backendApi}${endpoint}`;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

/** Recorre todas las páginas de /jobs (limit/offset) hasta cubrir `total`. */
export async function fetchAllJobs(
  { status, signal }: { status?: string; signal?: AbortSignal } = {},
): Promise<BackendJob[]> {
  const jobs: BackendJob[] = [];
  for (let offset = 0; ; offset += JOBS_PAGE_SIZE) {
    const params = new URLSearchParams({ limit: String(JOBS_PAGE_SIZE), offset: String(offset) });
    if (status) params.set("status", status);
    const page = await getJson<JobsResponse>(`${jobsEndpoint()}?${params}`, signal);
    const items = page.items ?? [];
    jobs.push(...items);
    const total = page.total ?? jobs.length;
    if (items.length < JOBS_PAGE_SIZE || jobs.length >= total) return jobs;
  }
}

export function fetchJobResults(jobId: string, signal?: AbortSignal): Promise<ResultsResponse> {
  return getJson<ResultsResponse>(`${jobsEndpoint()}/${encodeURIComponent(jobId)}/results`, signal);
}

/** Pide /results de varios jobs con concurrencia acotada; un fallo no corta al resto. */
export async function fetchResultsForJobs(
  jobIds: string[],
  signal?: AbortSignal,
): Promise<Map<string, ResultsResponse | Error>> {
  const output = new Map<string, ResultsResponse | Error>();
  const queue = [...jobIds];

  async function worker() {
    while (queue.length > 0) {
      if (signal?.aborted) return;
      const jobId = queue.shift() as string;
      try {
        output.set(jobId, await fetchJobResults(jobId, signal));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        output.set(jobId, err instanceof Error ? err : new Error("No se pudieron cargar los resultados."));
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(RESULTS_CONCURRENCY, jobIds.length) }, worker));
  return output;
}
