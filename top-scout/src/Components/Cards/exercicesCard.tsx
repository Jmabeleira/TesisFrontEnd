import { Box, LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface ExerciseResult {
  id: string;
  name: string;
  reps: number;
  score: number;
  level: string;
  description: string;
  repetitionScores: Array<{ repetition: number; score: number | null; durationSeconds: number | null }>;
}

const MAX_SCORE = 5;

function scoreColor(score: number): string {
  if (score >= 4) return "var(--ts-success)";
  if (score >= 3) return "var(--ts-warning)";
  return "var(--ts-error)";
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
