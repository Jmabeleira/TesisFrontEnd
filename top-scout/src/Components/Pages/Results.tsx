import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  Alert, Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Paper, ToggleButton,
  ToggleButtonGroup, Tooltip, Typography,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon, Close as CloseIcon, ContentCopy as ContentCopyIcon,
  DataObject as DataObjectIcon, FitnessCenter as FitnessCenterIcon,
  InsertChartOutlined as ChartIcon, MovieOutlined as MovieIcon,
  ViewAgenda as ViewAgendaIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ExerciseResultCard, { type ExerciseResult } from "../Cards/exercicesCard";

interface MetricSummary { total_repeticiones?: number; puntaje?: number; nivel?: string; }
interface MetricStatistics { total_repeticiones?: number; puntaje_promedio?: number; nivel?: string; }
interface BackendMetric {
  titulo?: string;
  descripcion?: string;
  repeticiones?: unknown[];
  resumen?: MetricSummary;
  estadisticas?: MetricStatistics;
}
interface BackendArtifact {
  name: string;
  filename?: string;
  content_type?: string;
  download_url: string;
}
interface ResultsResponse {
  job_id: string;
  status: string;
  session_name?: string | null;
  exercise_id?: number | string;
  report?: { video?: string; metricas?: Record<string, BackendMetric>; };
  artifacts?: BackendArtifact[];
}

interface JobStatusResponse { status?: string; }

const RESULTS_RETRY_DELAY_MS = 2000;

const Panel = styled(Paper)(({ theme }) => ({
  borderRadius: "var(--ts-radius)", background: "var(--ts-card)",
  border: "1px solid var(--ts-border)", boxShadow: "var(--ts-shadow)",
  padding: theme.spacing(2.5),
}));

const VideoFrame = styled(Box)({
  width: "100%", aspectRatio: "16 / 9", overflow: "hidden",
  borderRadius: "var(--ts-radius-sm)", background: "var(--ts-video-bg)",
  "& video": { width: "100%", height: "100%", display: "block", objectFit: "contain" },
});

const ScrollArea = styled(Box)({
  maxHeight: "calc(100vh - 310px)", minHeight: 180, overflowY: "auto", paddingRight: 5,
  scrollbarWidth: "thin", scrollbarColor: "rgba(48,137,70,.35) transparent",
  "&::-webkit-scrollbar": { width: 6 }, "&::-webkit-scrollbar-thumb": { background: "rgba(48,137,70,.35)", borderRadius: 6 },
});

const CodeBlock = styled("pre")({
  margin: 0, padding: 16, borderRadius: "var(--ts-radius-sm)", background: "var(--ts-video-bg)",
  color: "var(--ts-light)", fontFamily: "var(--ts-mono)", fontSize: ".75rem", lineHeight: 1.6, overflowX: "auto",
});

const MetricCardTrigger = styled(Box)({
  cursor: "pointer",
  borderRadius: "var(--ts-radius-sm)",
  transition: "transform .15s ease, opacity .15s ease",
  "&:hover": { transform: "translateY(-1px)" },
  "&:active": { transform: "translateY(0)", opacity: 0.85 },
});

function scoreColor(score: number) {
  if (score >= 4) return "var(--ts-success)";
  if (score >= 3) return "var(--ts-warning)";
  return "var(--ts-error)";
}

function formatMetricName(name: string) {
  const label = name.replaceAll("_", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatMetricTitle(title: string) {
  return title.replace(/\s*\(conducci[oó]n\)\s*$/i, "").trim();
}

function scoreLevel(score: number, repetitions: number) {
  if (repetitions === 0) return "Sin evaluar";
  if (score >= 4) return "Excelente";
  if (score >= 3) return "Bueno";
  return "A mejorar";
}

function normalizeRepetitionScores(repeticiones: unknown[] | undefined) {
  if (!Array.isArray(repeticiones)) return [];

  return repeticiones.flatMap((entry, index) => {
    if (typeof entry === "number") {
      return [{ repetition: index + 1, score: entry, durationSeconds: null }];
    }

    if (typeof entry === "string") {
      const parsed = Number(entry);
      return Number.isNaN(parsed)
        ? [{ repetition: index + 1, score: null, durationSeconds: null }]
        : [{ repetition: index + 1, score: parsed, durationSeconds: null }];
    }

    if (entry && typeof entry === "object") {
      const record = entry as Record<string, unknown>;
      const maybeScore = record.score ?? record.puntaje ?? record.valor ?? record.rating;
      const maybeDuration = record.duration_seconds ?? record.durationSeconds ?? record.duracion_segundos ?? record.duracion_seconds ?? record.duration ?? record.duracion;
      const maybeRepetition = record.id ?? record.repeticion ?? record.rep ?? record.numero ?? record.index;
      const parsedScore = typeof maybeScore === "number" ? maybeScore : Number(maybeScore);
      const parsedDuration = typeof maybeDuration === "number" ? maybeDuration : Number(maybeDuration);
      const parsedRepetition = typeof maybeRepetition === "number"
        ? maybeRepetition
        : typeof maybeRepetition === "string"
          ? Number(maybeRepetition)
          : index + 1;
      const hasScore = maybeScore !== undefined && maybeScore !== null && !Number.isNaN(parsedScore);
      const hasDuration = maybeDuration !== undefined && maybeDuration !== null && !Number.isNaN(parsedDuration);
      return [{ repetition: Number.isFinite(parsedRepetition) ? parsedRepetition : index + 1, score: hasScore ? parsedScore : null, durationSeconds: hasDuration ? parsedDuration : null }];
    }

    return [{ repetition: index + 1, score: null, durationSeconds: null }];
  });
}

function isChartArtifact(artifact: BackendArtifact) {
  return artifact.name.includes("chart")
    || artifact.name.includes("grafica")
    || artifact.content_type?.startsWith("image/") === true;
}

function chartCopy(name: string) {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes("acceler")) {
    return { title: "Aceleración y desaceleración", subtitle: "Evolución del ritmo durante cada repetición." };
  }
  if (normalizedName.includes("distance") || normalizedName.includes("distancia")) {
    return { title: "Distancia pie-balón", subtitle: "Variación de la distancia respecto al balón durante el ejercicio." };
  }
  return { title: formatMetricName(name), subtitle: "Representación gráfica generada durante el análisis." };
}

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [view, setView] = useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(jobId));
  const [error, setError] = useState(jobId ? "" : "No se encontró el identificador del análisis.");
  const [artifactUrls, setArtifactUrls] = useState<Record<string, string>>({});
  const [selectedMetric, setSelectedMetric] = useState<ExerciseResult | null>(null);
  const navigationState = location.state as { exerciseType?: string; videoName?: string; videoUrl?: string; sessionName?: string } | undefined;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [jobId]);

  useEffect(() => {
    if (!jobId || !loading) return;
    const redirectTimer = window.setTimeout(() => navigate("/home", { replace: true }), 3000);
    return () => window.clearTimeout(redirectTimer);
  }, [jobId, loading, navigate]);

  useEffect(() => {
    if (!jobId) return;
    const controller = new AbortController();
    const backendApi = import.meta.env.VITE_BACKEND_API ?? "";
    const jobsEndpoint = import.meta.env.VITE_ANALYSIS_ENDPOINT ?? "/api/v1/jobs";
    const baseEndpoint = `${backendApi}${jobsEndpoint}/${encodeURIComponent(jobId)}`;
    async function loadResults() {
      try {
        setLoading(true); setError("");
        while (!controller.signal.aborted) {
          const statusResponse = await fetch(baseEndpoint, { signal: controller.signal });
          if (!statusResponse.ok) throw new Error(`Error ${statusResponse.status}: ${statusResponse.statusText}`);
          const job = await statusResponse.json() as JobStatusResponse;
          const status = job.status?.toLowerCase();
          if (status === "failed" || status === "error") {
            throw new Error("El análisis no pudo completarse.");
          }
          if (status === "completed" || status === "completado") break;
          await new Promise<void>((resolve) => window.setTimeout(resolve, RESULTS_RETRY_DELAY_MS));
        }
        if (controller.signal.aborted) return;
        const response = await fetch(`${baseEndpoint}/results`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        setData(await response.json());
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar los resultados.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    loadResults();
    return () => controller.abort();
  }, [jobId]);

  const results = useMemo<ExerciseResult[]>(() => Object.entries(data?.report?.metricas ?? {}).map(([id, metric]) => {
    const reps = metric.resumen?.total_repeticiones
      ?? metric.estadisticas?.total_repeticiones
      ?? metric.repeticiones?.length
      ?? 0;
    const score = metric.resumen?.puntaje ?? metric.estadisticas?.puntaje_promedio ?? 0;
    return {
      id,
      name: metric.titulo ? formatMetricTitle(metric.titulo) : formatMetricName(id),
      reps,
      score,
      level: metric.resumen?.nivel ?? metric.estadisticas?.nivel ?? scoreLevel(score, reps),
      description: metric.descripcion ?? "",
      repetitionScores: normalizeRepetitionScores(metric.repeticiones),
    };
  }), [data]);
  const rawJson = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const overallScore = useMemo(() => {
    const evaluatedResults = results.filter((item) => item.reps > 0);
    return evaluatedResults.length
      ? Math.round((evaluatedResults.reduce((sum, item) => sum + item.score, 0) / evaluatedResults.length) * 10) / 10
      : 0;
  }, [results]);
  const exerciseType = String(navigationState?.exerciseType ?? data?.exercise_id ?? data?.report?.video?.match(/ejercicio-(\d+)/i)?.[1] ?? "—");
  const chartArtifacts = useMemo(() => (data?.artifacts ?? []).filter(isChartArtifact), [data]);
  const hasCharts = exerciseType !== "2" && chartArtifacts.length > 0;
  const uploadedVideoName = navigationState?.videoName ?? data?.report?.video ?? "Video analizado";
  const sessionName = navigationState?.sessionName ?? data?.session_name?.trim() ?? "";
  const completed = data?.status?.toLowerCase() === "completed" || data?.status?.toLowerCase() === "completado";

  useEffect(() => {
    if (!jobId || !data) return;
    const controller = new AbortController();
    const backendApi = import.meta.env.VITE_BACKEND_API ?? "";
    const jobsEndpoint = import.meta.env.VITE_ANALYSIS_ENDPOINT ?? "/api/v1/jobs";
    const baseEndpoint = `${backendApi}${jobsEndpoint}/${encodeURIComponent(jobId)}`;
    const declaredArtifacts = data.artifacts ?? [];
    const artifactsToLoad = declaredArtifacts.length > 0
      ? declaredArtifacts.filter((artifact) => artifact.name === "annotated_video" || isChartArtifact(artifact))
      : [{ name: "annotated_video", download_url: `${baseEndpoint}/artifacts/annotated_video` }];
    const objectUrls: string[] = [];

    Promise.allSettled(artifactsToLoad.map(async (artifact) => {
      const downloadUrl = artifact.download_url.startsWith("http")
        ? artifact.download_url
        : `${backendApi}${artifact.download_url}`;
      const response = await fetch(downloadUrl, { signal: controller.signal });
      if (!response.ok) throw new Error(`No se pudo cargar ${artifact.name}`);
      const url = URL.createObjectURL(await response.blob());
      objectUrls.push(url);
      return [artifact.name, url] as const;
    })).then((artifacts) => {
      if (!controller.signal.aborted) {
        setArtifactUrls(Object.fromEntries(artifacts.flatMap((item) => item.status === "fulfilled" ? [item.value] : [])));
      }
    });

    return () => { controller.abort(); objectUrls.forEach(URL.revokeObjectURL); };
  }, [data, jobId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJson); setCopied(true); window.setTimeout(() => setCopied(false), 1500);
  };

  const contextChip = { height: 30, background: "var(--ts-card)", border: "1px solid var(--ts-border)", color: "var(--ts-text)", fontWeight: 600, fontSize: ".76rem" };

  return (
    <Box className="ts-page" sx={{ minHeight: "100vh", px: { xs: 2, sm: 3, lg: 4 }, pb: 5 }}>
      <Box className="ts-container ts-container--wide">
        {loading && <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 10 }}><CircularProgress /><Typography sx={{ color: "var(--ts-muted)", fontSize: ".85rem" }}>Procesando el video. Volverás al inicio en unos segundos.</Typography></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && data && <>
          <Box component="header" sx={{ mb: 2.5 }}>
            <Typography component="h1" className="ts-title" sx={{ fontFamily: "var(--ts-font)", fontSize: { xs: "1.8rem", sm: "2.15rem" } }}>Resultados del análisis</Typography>
            <Typography className="ts-subtitle">Evaluación automática generada a partir del video procesado.</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {sessionName && <Chip label={sessionName} size="small" sx={{ ...contextChip, fontWeight: 700 }} />}
              <Chip label={`Ejercicio ${exerciseType}`} size="small" sx={contextChip} />
              <Chip label={`Puntaje promedio: ${overallScore}/5`} size="small" sx={{ ...contextChip, color: scoreColor(overallScore) }} />
              <Chip icon={<CheckCircleIcon />} label={`Estado: ${completed ? "Completado" : data.status}`} size="small" sx={{ ...contextChip, "& .MuiChip-icon": { color: completed ? "var(--ts-success)" : "var(--ts-warning)", fontSize: 16 } }} />
              <Chip icon={<MovieIcon />} label="Video procesado" size="small" sx={{ ...contextChip, "& .MuiChip-icon": { color: "var(--ts-green)", fontSize: 16 } }} />
            </Box>
          </Box>

          <Grid container spacing={2.5} sx={{ alignItems: "flex-start" }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Panel elevation={0}>
                  <Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ts-dark)" }}>Video procesado</Typography>
                  <Typography sx={{ mt: .5, mb: 2, color: "var(--ts-muted)", fontSize: ".82rem" }}>Visualización del análisis con detecciones, tracking y métricas superpuestas.</Typography>
                  <VideoFrame>
                    {artifactUrls.annotated_video ? <video src={artifactUrls.annotated_video} controls /> : <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "var(--ts-muted)" }}><Box sx={{ textAlign: "center" }}><FitnessCenterIcon /><Typography sx={{ fontSize: ".82rem", mt: 1 }}>No se pudo cargar el video procesado.</Typography></Box></Box>}
                  </VideoFrame>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mt: 1.25 }}>
                    <Typography sx={{ fontSize: ".72rem", color: "var(--ts-muted)" }}>{uploadedVideoName}</Typography>
                    <Tooltip title={data.job_id}><Typography sx={{ fontSize: ".68rem", color: "var(--ts-subtle)", fontFamily: "var(--ts-mono)" }}>ID: {data.job_id.slice(0, 12)}{data.job_id.length > 12 ? "…" : ""}</Typography></Tooltip>
                  </Box>
                </Panel>

                {hasCharts && <Box component="section" sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}><ChartIcon sx={{ color: "var(--ts-green)", fontSize: 21 }} /><Typography component="h2" sx={{ fontWeight: 750, fontSize: "1.15rem", color: "var(--ts-dark)" }}>Análisis gráfico</Typography></Box>
                  <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                    {chartArtifacts.map(({ name }) => {
                      const { title, subtitle } = chartCopy(name);
                      return <Panel key={name} elevation={0}>
                      <Typography component="h3" sx={{ fontWeight: 700, fontSize: ".98rem", color: "var(--ts-dark)" }}>{title}</Typography>
                      <Typography sx={{ color: "var(--ts-muted)", fontSize: ".78rem", mt: .35, mb: 1.5 }}>{subtitle}</Typography>
                      {artifactUrls[name] ? <Box component="img" src={artifactUrls[name]} alt={title} sx={{ width: "100%", display: "block", borderRadius: 1, background: "#fff" }} /> : <Alert severity="warning">No se pudo cargar esta gráfica.</Alert>}
                    </Panel>;})}
                  </Box>
                </Box>}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Panel elevation={0} sx={{ position: { md: "sticky" }, top: { md: 92 } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 2 }}>
                  <Box><Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ts-dark)" }}>Resumen de métricas</Typography><Typography sx={{ color: "var(--ts-muted)", fontSize: ".73rem", mt: .3 }}>{results.length} métricas evaluadas · tocá una métrica para ver el detalle</Typography></Box>
                  <ToggleButtonGroup value={view} exclusive size="small" onChange={(_, value) => value && setView(value)} sx={{ "& .MuiToggleButton-root": { p: .65, color: "var(--ts-muted)", borderColor: "var(--ts-border)", "&.Mui-selected": { color: "var(--ts-green)", background: "rgba(48,137,70,.1)" } } }}>
                    <ToggleButton value="formatted" aria-label="Vista resumida"><Tooltip title="Vista resumida"><ViewAgendaIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
                    <ToggleButton value="raw" aria-label="Datos técnicos"><Tooltip title="Datos técnicos"><DataObjectIcon sx={{ fontSize: 17 }} /></Tooltip></ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                {view === "formatted" ? <Box sx={{ display: "flex", flexDirection: "column", gap: 1.15 }}>{results.map((item) => (
                  <MetricCardTrigger
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedMetric(item)}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedMetric(item); } }}
                    aria-label={`Ver detalle de ${item.name}`}
                  >
                    <ExerciseResultCard exercise={item} />
                  </MetricCardTrigger>
                ))}</Box> : <ScrollArea sx={{ position: "relative" }}><IconButton size="small" onClick={handleCopy} aria-label="Copiar JSON" sx={{ position: "absolute", top: 8, right: 12, color: copied ? "var(--ts-success)" : "var(--ts-muted)" }}><ContentCopyIcon sx={{ fontSize: 16 }} /></IconButton><CodeBlock>{rawJson}</CodeBlock></ScrollArea>}
              </Panel>
            </Grid>
          </Grid>

          {results.some((item) => item.description) && <Box component="section" sx={{ width: "100%", mt: 2.5 }}>
            <Panel elevation={0}>
              <Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--ts-dark)", mb: .5 }}>Observaciones del análisis</Typography>
              <Typography sx={{ color: "var(--ts-muted)", fontSize: ".8rem", mb: 2 }}>Detalle y recomendaciones para cada métrica evaluada.</Typography>
              <Grid container spacing={2}>{results.filter((item) => item.description).map((item) => <Grid key={item.id} size={{ xs: 12, md: 6 }}><Box sx={{ borderLeft: `3px solid ${scoreColor(item.score)}`, pl: 1.5, py: .25 }}><Typography sx={{ fontWeight: 700, fontSize: ".86rem", color: "var(--ts-dark)", mb: .4 }}>{item.name}</Typography><Typography sx={{ color: "var(--ts-muted)", fontSize: ".8rem", lineHeight: 1.55 }}>{item.description}</Typography></Box></Grid>)}</Grid>
            </Panel>
          </Box>}

          <Dialog
            open={Boolean(selectedMetric)}
            onClose={() => setSelectedMetric(null)}
            maxWidth="xs"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: "var(--ts-radius)", background: "var(--ts-card)", border: "1px solid var(--ts-border)" } } }}
          >
            {selectedMetric && <>
              <DialogTitle sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, fontWeight: 700, fontSize: "1.05rem", color: "var(--ts-dark)" }}>
                {selectedMetric.name}
                <IconButton size="small" onClick={() => setSelectedMetric(null)} aria-label="Cerrar" sx={{ mt: -0.5, mr: -0.5, color: "var(--ts-muted)" }}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ pt: 0 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip label={`Puntaje: ${selectedMetric.score}/5`} size="small" sx={{ fontWeight: 600, fontSize: ".75rem", color: scoreColor(selectedMetric.score), border: "1px solid var(--ts-border)", background: "var(--ts-card)" }} />
                  <Chip label={`Repeticiones: ${selectedMetric.reps}`} size="small" sx={{ fontWeight: 600, fontSize: ".75rem", color: "var(--ts-text)", border: "1px solid var(--ts-border)", background: "var(--ts-card)" }} />
                  <Chip label={selectedMetric.level} size="small" sx={{ fontWeight: 600, fontSize: ".75rem", color: "var(--ts-text)", border: "1px solid var(--ts-border)", background: "var(--ts-card)" }} />
                </Box>
                <Typography sx={{ color: "var(--ts-muted)", fontSize: ".85rem", lineHeight: 1.6, mb: 2 }}>
                  {selectedMetric.description || "No hay observaciones adicionales para esta métrica."}
                </Typography>

                <Typography sx={{ fontWeight: 700, fontSize: ".85rem", color: "var(--ts-dark)", mb: 1 }}>
                  Puntaje por repetición
                </Typography>
                {selectedMetric.repetitionScores.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {selectedMetric.repetitionScores.map(({ repetition, score, durationSeconds }) => {
                      const hasScore = score !== null;
                      const displayValue = hasScore
                        ? String(score)
                        : durationSeconds !== null
                          ? `${durationSeconds.toFixed(2).replace(/\.?0+$/, "")} s`
                          : "Sin puntaje";
                      const colorValue = hasScore ? scoreColor(score) : "var(--ts-muted)";

                      return (
                        <Box
                          key={`${selectedMetric.id}-${repetition}`}
                          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, px: 1, py: 0.75, borderRadius: 1, background: "rgba(48, 137, 70, 0.06)", border: "1px solid var(--ts-border)" }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: ".8rem", color: "var(--ts-dark)" }}>
                            Rep {repetition}:
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: ".8rem", color: colorValue }}>
                            {displayValue}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography sx={{ color: "var(--ts-muted)", fontSize: ".8rem" }}>
                    No hay puntajes por repetición disponibles para esta métrica.
                  </Typography>
                )}
              </DialogContent>
            </>}
          </Dialog>
        </>}
      </Box>
    </Box>
  );
}

export default Results;