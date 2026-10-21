import { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, FormControl, InputLabel, LinearProgress, MenuItem, Paper, Select, Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { EXERCISES } from "../../constants/exercises";
import { fetchAllJobs, fetchResultsForJobs, type BackendJob, type ResultsResponse } from "../../services/jobsApi";
import ComparisonTable from "../Comparison/ComparisonTable";
import { buildComparison } from "../Comparison/comparisonData";

const Panel = styled(Paper)(({ theme }) => ({
  borderRadius: "var(--ts-radius)", background: "var(--ts-card)",
  border: "1px solid var(--ts-border)", boxShadow: "var(--ts-shadow)",
  padding: theme.spacing(2.5),
}));

const progressSx = {
  borderRadius: 4,
  backgroundColor: "rgba(48,137,70,0.12)",
  "& .MuiLinearProgress-bar": { backgroundColor: "var(--ts-green)" },
};

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <Box sx={{ border: "1px dashed var(--ts-border)", borderRadius: 2, px: 2, py: 3 }}>
      <Typography sx={{ fontSize: ".86rem", fontWeight: 600, color: "var(--ts-text)" }}>{title}</Typography>
      <Typography sx={{ mt: .5, fontSize: ".78rem", color: "var(--ts-muted)" }}>{detail}</Typography>
    </Box>
  );
}

function Comparison() {
  const [exerciseId, setExerciseId] = useState("");
  const [jobs, setJobs] = useState<BackendJob[] | null>(null);
  const [jobsError, setJobsError] = useState("");
  // Caché por jobId: cambiar de ejercicio y volver no repite las consultas.
  const [results, setResults] = useState<Record<string, ResultsResponse | Error>>({});

  // Todas las evaluaciones finalizadas, recorriendo la paginación del backend.
  useEffect(() => {
    const controller = new AbortController();
    fetchAllJobs({ status: "completed", signal: controller.signal })
      .then(setJobs)
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setJobsError(err instanceof Error ? err.message : "No se pudieron cargar las evaluaciones.");
      });
    return () => controller.abort();
  }, []);

  const exerciseJobs = useMemo(
    () => (jobs ?? []).filter((job) => job.status === "completed" && String(job.exercise_id) === exerciseId),
    [jobs, exerciseId],
  );
  const pendingIds = useMemo(() => exerciseJobs.map((job) => job.id).filter((id) => !(id in results)), [exerciseJobs, results]);

  useEffect(() => {
    if (pendingIds.length === 0) return;
    const controller = new AbortController();
    fetchResultsForJobs(pendingIds, controller.signal).then((loaded) => {
      if (!controller.signal.aborted) setResults((current) => ({ ...current, ...Object.fromEntries(loaded) }));
    });
    return () => controller.abort();
  }, [pendingIds]);

  const { columns, rows } = useMemo(() => buildComparison(exerciseJobs, results), [exerciseJobs, results]);
  const loadingJobs = jobs === null && !jobsError;
  const loadingResults = pendingIds.length > 0;
  const exerciseLabel = EXERCISES.find((exercise) => exercise.id === exerciseId)?.label;

  return (
    <Box className="ts-page" sx={{ minHeight: "100vh", px: { xs: 2, sm: 3, lg: 4 }, pb: 5 }}>
      <Box className="ts-container ts-container--wide">
        <Box component="header" sx={{ mb: 2.5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography component="h1" className="ts-title" sx={{ fontFamily: "var(--ts-font)", fontWeight: 800, fontSize: { xs: "1.8rem", sm: "2.15rem" } }}>
              Comparar jugadores
            </Typography>
            <Typography className="ts-subtitle">
              Resultados de todas las evaluaciones finalizadas de un mismo ejercicio.
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="comparison-exercise-label" sx={{ color: "var(--ts-muted)", fontSize: ".85rem" }}>Ejercicio</InputLabel>
            <Select
              labelId="comparison-exercise-label"
              value={exerciseId}
              label="Ejercicio"
              onChange={(event) => setExerciseId(event.target.value)}
              sx={{
                backgroundColor: "var(--ts-input-bg)", borderRadius: "var(--ts-radius-sm)", color: "var(--ts-text)", fontSize: ".88rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--ts-input-border)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--ts-muted)" },
                "& .MuiSelect-icon": { color: "var(--ts-muted)" },
              }}
            >
              {EXERCISES.map((exercise) => (
                <MenuItem key={exercise.id} value={exercise.id}>{exercise.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Panel elevation={0}>
          {exerciseId && !jobsError && (
            <Box sx={{ mb: 2 }}>
              <Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ts-dark)" }}>{exerciseLabel}</Typography>
              <Typography sx={{ color: "var(--ts-muted)", fontSize: ".75rem", mt: .3 }}>
                {loadingJobs
                  ? "Buscando evaluaciones…"
                  : `${exerciseJobs.length} ${exerciseJobs.length === 1 ? "evaluación finalizada" : "evaluaciones finalizadas"} · tocá una fila para ver el detalle · hacé clic en una columna para ordenar`}
              </Typography>
            </Box>
          )}

          {jobsError && <Alert severity="error">{jobsError}</Alert>}

          {!jobsError && !exerciseId && (
            <EmptyState title="Seleccioná un ejercicio." detail="Se van a listar todas las evaluaciones finalizadas de ese ejercicio con sus métricas." />
          )}

          {!jobsError && exerciseId && (loadingJobs || loadingResults) && (
            <Box sx={{ py: 1.5 }}>
              <LinearProgress sx={progressSx} />
              <Typography sx={{ mt: 1.5, fontSize: ".78rem", color: "var(--ts-muted)" }}>
                {loadingJobs ? "Cargando evaluaciones…" : `Cargando resultados (${exerciseJobs.length - pendingIds.length}/${exerciseJobs.length})…`}
              </Typography>
            </Box>
          )}

          {!jobsError && exerciseId && !loadingJobs && exerciseJobs.length === 0 && (
            <EmptyState title="No hay evaluaciones finalizadas para este ejercicio." detail="Cuando se complete un análisis de este ejercicio va a aparecer acá." />
          )}

          {!jobsError && exerciseId && !loadingResults && rows.length > 0 && (
            <>
              {columns.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>Las evaluaciones no incluyen métricas para comparar.</Alert>
              )}
              <ComparisonTable key={exerciseId} columns={columns} rows={rows} />
            </>
          )}
        </Panel>
      </Box>
    </Box>
  );
}

export default Comparison;
