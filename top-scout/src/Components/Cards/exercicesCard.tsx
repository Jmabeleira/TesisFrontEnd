import { Box, LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MAX_SCORE, formatSprintTime, isTimeMetricId, scoreColor } from "../../utils/metrics";

export interface ExerciseResult {
  id: string;
  name: string;
  reps: number;
  score: number;
  level: string;
  description: string;
  repetitionScores: Array<{
    repetition: number;
    score: number | null;
    durationSeconds: number | null;
    criterio: string | null;
  }>;
}

const CardRoot = styled(Box)({
  borderRadius: "var(--ts-radius-sm)",
  border: "1px solid var(--ts-border)",
  background: "var(--ts-card)",
  padding: "14px 16px",
});

const ScoreBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "barColor",
})<{ barColor: string }>(({ barColor }) => ({
  height: 6,
  borderRadius: 999,
  backgroundColor: "var(--ts-progress-track)",
  "& .MuiLinearProgress-bar": { backgroundColor: barColor, borderRadius: 999 },
}));

function ExerciseResultCard({ exercise }: { exercise: ExerciseResult }) {
  if (isTimeMetricId(exercise.id)) {
    const times = exercise.repetitionScores.filter((item) => item.durationSeconds !== null);
    return (
      <CardRoot>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ts-dark)", mb: 0.35 }}>
          {exercise.name}
        </Typography>
        <Typography sx={{ color: "var(--ts-muted)", fontSize: "0.76rem", mb: 1.15 }}>
          {exercise.reps} {exercise.reps === 1 ? "repetición" : "repeticiones"}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {times.length > 0 ? times.map((item) => (
            <Box key={item.repetition} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.78rem", color: "var(--ts-muted)" }}>Rep {item.repetition}:</Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ts-dark)", fontFamily: "var(--ts-mono)" }}>
                {formatSprintTime(item.durationSeconds as number)}
              </Typography>
            </Box>
          )) : <Typography sx={{ fontSize: "0.78rem", color: "var(--ts-muted)" }}>Sin tiempos disponibles</Typography>}
        </Box>
      </CardRoot>
    );
  }

  const color = scoreColor(exercise.score);
  const percentage = Math.max(0, Math.min(100, (exercise.score / MAX_SCORE) * 100));

  return (
    <CardRoot>
      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ts-dark)", mb: 0.35 }}>
        {exercise.name}
      </Typography>
      <Typography sx={{ color: "var(--ts-muted)", fontSize: "0.76rem", mb: 1.15 }}>
        {exercise.reps} {exercise.reps === 1 ? "repetición" : "repeticiones"} · <Box component="span" sx={{ color, fontWeight: 700 }}>{exercise.score}/5</Box>
      </Typography>
      <ScoreBar variant="determinate" value={percentage} barColor={color} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.1 }}>
        <Box sx={{ width: 7, height: 7, flex: "0 0 auto", borderRadius: "50%", backgroundColor: color }} />
        <Typography sx={{ fontSize: "0.78rem", color: "var(--ts-muted)" }}>
          Nivel: <Box component="span" sx={{ color: "var(--ts-text)", fontWeight: 600 }}>{exercise.level || "Sin clasificar"}</Box>
        </Typography>
      </Box>
    </CardRoot>
  );
}

export default ExerciseResultCard;
