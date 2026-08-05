import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  HourglassTop as HourglassTopIcon,
  Error as ErrorIcon,
  VideoLibrary as VideoLibraryIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

/* ─── Paleta ─────────────────────────────────────────────────────── */
const COLORS = {
  bg: "var(--ts-bg)",
  card: "var(--ts-card)",
  cardBorder: "var(--ts-border)",
  text: "var(--ts-text)",
  textMuted: "var(--ts-muted)",
  textSubtle: "var(--ts-subtle)",
  green: "var(--ts-green-light)",
  greenDark: "var(--ts-green)",
  amber: "var(--ts-amber)",
  red: "var(--ts-danger)",
};

/* ─── Tipos ──────────────────────────────────────────────────────── */
type AnalysisStatus = "completed" | "processing" | "error";

interface AnalysisJob {
  id: string;
  title: string;
  displayDate: string;
  status: AnalysisStatus;
  overallScore?: number; // 1-5, solo si está completado
}

interface BackendJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | string;
  session_name?: string | null;
  original_filename?: string | null;
  exercise_id?: number | string | null;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
}

interface JobsResponse {
  items: BackendJob[];
}

/* ─── Animations ─────────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

/* ─── Styled ─────────────────────────────────────────────────────── */
const JobCard = styled(Box, {
  shouldForwardProp: (p) => p !== "status" && p !== "clickable",
})<{ status: AnalysisStatus; clickable?: boolean }>(({ status, clickable }) => {
  const borderColor =
    status === "completed" ? COLORS.green :
    status === "processing" ? COLORS.amber : COLORS.red;

  return {
    position: "relative",
    background: COLORS.card,
    borderRadius: "0 12px 12px 0",
    border: `1px solid ${COLORS.cardBorder}`,
    borderLeftColor: borderColor,
    borderLeftWidth: 3,
    padding: "18px 20px",
    cursor: clickable ? "pointer" : "default",
    transition: "background 0.2s, transform 0.15s",
    animation: `${fadeUp} 0.35s ease both`,
    "&:hover": clickable ? { background: "var(--ts-card-hover)", transform: "translateX(3px)" } : {},
  };
});

const ActionCard = styled(Box)({
  background: COLORS.card,
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: 14,
  padding: "22px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

const StartButton = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  background: COLORS.greenDark,
  borderRadius: 10,
  padding: "12px 20px",
  cursor: "pointer",
  transition: "background 0.2s, transform 0.15s",
  "&:hover": { background: COLORS.green, transform: "translateY(-1px)" },
});

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    timeZone: "America/Montevideo",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

function statusLabel(s: AnalysisStatus) {
  return s === "completed" ? "Completado" : s === "processing" ? "En proceso" : "Error";
}

function statusIcon(s: AnalysisStatus) {
  if (s === "completed") return <CheckCircleIcon sx={{ fontSize: 13 }} />;
  if (s === "processing") return <HourglassTopIcon sx={{ fontSize: 13, animation: `${pulse} 1.4s ease-in-out infinite` }} />;
  return <ErrorIcon sx={{ fontSize: 13 }} />;
}

function statusChipColor(s: AnalysisStatus) {
  if (s === "completed") return { bg: "rgba(58,164,84,0.12)", color: COLORS.green };
  if (s === "processing") return { bg: "rgba(232,168,56,0.12)", color: COLORS.amber };
  return { bg: "rgba(192,57,43,0.12)", color: COLORS.red };
}

function scoreColor(score: number) {
  return score >= 4 ? COLORS.green : score >= 3 ? COLORS.amber : COLORS.red;
}

function mapJobStatus(status: BackendJob["status"]): AnalysisStatus {
  if (status === "completed") return "completed";
  if (status === "failed") return "error";
  return "processing";
}

function mapBackendJob(job: BackendJob): AnalysisJob {
  const exerciseLabel = job.exercise_id ? `Ejercicio ${job.exercise_id}` : "Sesión";
  const filename = job.original_filename ? ` · ${job.original_filename}` : "";
  const sessionName = job.session_name?.trim();
  const title = sessionName ? `${sessionName} · ${exerciseLabel}` : `${exerciseLabel}${filename}`;
  const status = mapJobStatus(job.status);
  const displayDate =
    status === "processing"
      ? job.started_at ?? job.created_at
      : job.finished_at ?? job.created_at;

  return {
    id: job.id,
    title,
    displayDate,
    status,
  };
}

/* ─── Component ──────────────────────────────────────────────────── */
function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<AnalysisJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState("");

  // ── Fetch historial de análisis (carga inicial + polling cada 10s) ──
  useEffect(() => {
    const backendApi = import.meta.env.VITE_BACKEND_API ?? "";
    const endpoint = import.meta.env.VITE_ANALYSIS_ENDPOINT ?? "/api/v1/jobs";
    let isMounted = true;

    async function fetchJobs(isFirstLoad: boolean) {
      const controller = new AbortController();
      try {
        if (isFirstLoad) setLoadingJobs(true);
        setJobsError("");

        const res = await fetch(`${backendApi}${endpoint}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data: JobsResponse = await res.json();
        if (isMounted) setJobs((data.items ?? []).map(mapBackendJob));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (isMounted) setJobsError(err instanceof Error ? err.message : "No se pudieron cargar las sesiones.");
      } finally {
        if (isMounted && isFirstLoad) setLoadingJobs(false);
      }
      return controller;
    }

    fetchJobs(true); // carga inicial: no esperamos 30s para mostrar algo
    const intervalId = window.setInterval(() => fetchJobs(false), 10000); // refresco silencioso cada 10s

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime()
  );

  const completedCount = jobs.filter((j) => j.status === "completed").length;
  const processingCount = jobs.filter((j) => j.status === "processing").length;

  return (
    <Box className="ts-page" sx={{ minHeight: "100vh", background: COLORS.bg, p: { xs: 2, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", pt: { xs: 1, sm: 2 } }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <Box sx={{ mb: 5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Typography
            sx={{
              fontFamily: "var(--ts-font)",
              fontWeight: 800,
              fontSize: { xs: "1.6rem", sm: "2rem" },
              letterSpacing: "0",
              color: COLORS.text,
              lineHeight: 1.1,
            }}
          >
            Mis análisis
          </Typography>

          {/* Contador inline — reemplaza las stats cards */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {processingCount > 0 && (
              <Typography sx={{ fontSize: "0.78rem", color: COLORS.amber }}>
                {processingCount} en proceso
              </Typography>
            )}
            <Typography sx={{ fontSize: "0.78rem", color: COLORS.textSubtle }}>
              {completedCount} completados
            </Typography>
          </Box>
        </Box>

        {/* ── Layout 2 columnas ─────────────────────────────────── */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 300px" }, gap: 4, alignItems: "start" }}>

          {/* ── Lista de jobs ──────────────────────────────────── */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: COLORS.textSubtle,
                mb: 2,
              }}
            >
               Sesiones 
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {loadingJobs && (
                <Box sx={{ py: 2 }}>
                  <LinearProgress sx={{
                    borderRadius: 4,
                    backgroundColor: "rgba(48,137,70,0.12)",
                    "& .MuiLinearProgress-bar": { backgroundColor: COLORS.greenDark },
                  }} />
                  <Typography sx={{ mt: 1.5, fontSize: "0.78rem", color: COLORS.textMuted }}>
                    Cargando sesiones…
                  </Typography>
                </Box>
              )}

              {jobsError && !loadingJobs && (
                <Alert severity="error" sx={{
                  background: "rgba(192,57,43,0.08)",
                  border: "1px solid rgba(192,57,43,0.2)",
                  color: COLORS.red,
                  fontSize: "0.82rem",
                  borderRadius: 2,
                  "& .MuiAlert-icon": { color: COLORS.red },
                }}>
                  {jobsError}
                </Alert>
              )}

              {!loadingJobs && !jobsError && sortedJobs.length === 0 && (
                <Box sx={{
                  border: `1px dashed ${COLORS.cardBorder}`,
                  borderRadius: 2,
                  px: 2,
                  py: 3,
                  color: COLORS.textMuted,
                }}>
                  <Typography sx={{ fontSize: "0.86rem", fontWeight: 600, color: COLORS.text }}>
                    Todavía no hay sesiones.
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: "0.78rem", color: COLORS.textMuted }}>
                    Iniciá un nuevo análisis para ver el historial acá.
                  </Typography>
                </Box>
              )}

              {sortedJobs.map((job, i) => {
                const isClickable = job.status === "completed";
                const chipColor = statusChipColor(job.status);

                return (
                  <JobCard
                    key={job.id}
                    status={job.status}
                    clickable={isClickable}
                    onClick={() => isClickable && navigate(`/results/${job.id}`)}
                    sx={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{
                          fontFamily: "var(--ts-font)",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: job.status === "processing" ? COLORS.textMuted : COLORS.text,
                          mb: 0.75,
                        }}>
                          {job.title}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                          <Chip
                            icon={statusIcon(job.status)}
                            label={statusLabel(job.status)}
                            size="small"
                            sx={{
                              height: 22, fontSize: "0.7rem", fontWeight: 600,
                              backgroundColor: chipColor.bg, color: chipColor.color,
                              "& .MuiChip-icon": { color: chipColor.color },
                            }}
                          />
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 12, color: COLORS.textSubtle }} />
                            <Typography sx={{ fontSize: "0.72rem", color: COLORS.textSubtle }}>
                              {formatDate(job.displayDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Score / estado derecho */}
                      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 1 }}>
                        {job.status === "completed" && job.overallScore && (
                          <>
                            <Typography sx={{ fontFamily: "var(--ts-font)", fontWeight: 700, fontSize: "1.15rem", color: scoreColor(job.overallScore) }}>
                              {job.overallScore}
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: COLORS.textSubtle, lineHeight: 1, mt: "2px" }}>
                              /5
                            </Typography>
                            <Tooltip title="Ver resultados">
                              <IconButton size="small" sx={{ color: COLORS.textSubtle, ml: 0.5, "&:hover": { color: COLORS.green } }}>
                                <ArrowForwardIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {job.status === "processing" && (
                          <Typography sx={{ fontSize: "0.72rem", color: COLORS.amber, fontStyle: "italic" }}>
                            Procesando…
                          </Typography>
                        )}
                        {job.status === "error" && (
                          <Tooltip title="El análisis falló. Intentá de nuevo.">
                            <ErrorIcon sx={{ fontSize: 18, color: COLORS.red }} />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </JobCard>
                );
              })}
            </Box>
          </Box>

          {/* ── Panel derecho: nuevo análisis ─────────────────── */}
          <Box sx={{ position: { md: "sticky" }, top: { md: 32 } }}>
            <Typography sx={{
              fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: COLORS.textSubtle, mb: 2,
            }}>
              Nuevo análisis
            </Typography>

            <ActionCard>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(48,137,70,0.1)", border: `1px solid rgba(58,164,84,0.2)`,
                }}>
                  <VideoLibraryIcon sx={{ color: COLORS.green, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "var(--ts-font)", fontWeight: 600, fontSize: "0.92rem", color: COLORS.text }}>
                    Subir video de sesión
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: COLORS.textMuted, mt: 0.25 }}>
                    El modelo analiza técnica y rendimiento
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: COLORS.cardBorder }} />

              <StartButton onClick={() => navigate("/analysis")}>
                <AddIcon sx={{ color: COLORS.text, fontSize: 18 }} />
                <Typography sx={{ fontFamily: "var(--ts-font)", fontWeight: 600, fontSize: "0.88rem", color: COLORS.text }}>
                  Iniciar nuevo análisis
                </Typography>
              </StartButton>
            </ActionCard>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default Home;