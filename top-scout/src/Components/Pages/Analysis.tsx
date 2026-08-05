import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  PlayCircle as PlayCircleIcon,
  Delete as DeleteIcon,
  VideoFile as VideoFileIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

/* ─── Tokens — mismas variables CSS que el resto de la app ───────── */
const C = {
  bg:          "var(--ts-bg)",
  card:        "var(--ts-card)",
  border:      "var(--ts-border)",
  text:        "var(--ts-text)",
  dark:        "var(--ts-dark)",
  muted:       "var(--ts-muted)",
  subtle:      "var(--ts-subtle)",
  green:       "var(--ts-green)",
  greenLight:  "var(--ts-green-light)",
  amber:       "var(--ts-amber)",
  danger:      "var(--ts-danger)",
  inputBg:     "var(--ts-input-bg)",
  inputBorder: "var(--ts-input-border)",
  videoBg:     "var(--ts-video-bg)",
  shadow:      "var(--ts-shadow)",
  cardHover:   "var(--ts-card-hover)",
  radius:      "var(--ts-radius)",
  radiusSm:    "var(--ts-radius-sm)",
};

/* ─── Animations ─────────────────────────────────────────────────── */
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.04); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled ─────────────────────────────────────────────────────── */
const PageCard = styled(Box)({
  background:   C.card,
  border:       `1px solid ${C.border}`,
  borderRadius: C.radius,
  boxShadow:    C.shadow,
  padding:      "36px 32px",
  width:        "100%",
  maxWidth:     620,
});

const DropZone = styled(Box, {
  shouldForwardProp: (p) => p !== "isDragging",
})<{ isDragging?: boolean }>(({ isDragging }) => ({
  display:        "flex",
  flexDirection:  "column",
  alignItems:     "center",
  justifyContent: "center",
  gap:            16,
  minHeight:      200,
  borderRadius:   C.radiusSm,
  border:         `1.5px dashed`,
  borderColor:    isDragging ? C.greenLight : "rgba(48,137,70,0.3)",
  background:     isDragging ? "rgba(58,164,84,0.05)" : "transparent",
  cursor:         "pointer",
  transition:     "border-color 0.2s, background 0.2s",
  "&:hover": {
    borderColor: C.green,
    background:  "rgba(48,137,70,0.03)",
  },
}));

const IconRing = styled(Box, {
  shouldForwardProp: (p) => p !== "active",
})<{ active?: boolean }>(({ active }) => ({
  width:      52,
  height:     52,
  borderRadius: "50%",
  display:    "flex",
  alignItems: "center",
  justifyContent: "center",
  background: active ? "rgba(48,137,70,0.15)" : "rgba(48,137,70,0.08)",
  animation:  active ? `${pulse} 2s ease-in-out infinite` : "none",
}));

const VideoWrapper = styled(Box)({
  borderRadius: C.radiusSm,
  overflow:    "hidden",
  background:  C.videoBg,
  animation:   `${fadeIn} 0.3s ease`,
  "& video": {
    width:      "100%",
    display:    "block",
    maxHeight:  280,
    objectFit:  "contain",
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: C.inputBg,
    borderRadius:    C.radiusSm,
    color:           C.text,
    fontSize:        "0.88rem",
    "& fieldset":           { borderColor: C.inputBorder },
    "&:hover fieldset":     { borderColor: C.muted },
    "&.Mui-focused fieldset": { borderColor: C.green, borderWidth: 1 },
  },
  "& .MuiInputLabel-root": {
    color:    C.muted,
    fontSize: "0.85rem",
    "&.Mui-focused": { color: C.green },
  },
  "& .MuiInputBase-input::placeholder": {
    color:   C.subtle,
    opacity: 1,
  },
});

const StyledSelect = styled(Select)({
  backgroundColor: C.inputBg,
  borderRadius:    C.radiusSm,
  color:           C.text,
  fontSize:        "0.88rem",
  "& .MuiOutlinedInput-notchedOutline":         { borderColor: C.inputBorder },
  "&:hover .MuiOutlinedInput-notchedOutline":   { borderColor: C.muted },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: C.green, borderWidth: 1 },
  "& .MuiSelect-icon": { color: C.muted },
});

const SubmitButton = styled(Box, {
  shouldForwardProp: (p) => p !== "disabled",
})<{ disabled?: boolean }>(({ disabled }) => ({
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  gap:            8,
  background:     disabled ? C.border : C.green,
  borderRadius:   C.radiusSm,
  padding:        "12px 20px",
  cursor:         disabled ? "not-allowed" : "pointer",
  transition:     "background 0.2s, transform 0.15s",
  ...(!disabled && {
    "&:hover": { background: C.greenLight, transform: "translateY(-1px)" },
  }),
}));

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{
    fontSize:      "0.72rem",
    fontWeight:    600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color:         C.subtle,
    mb:            1,
  }}>
    {children}
  </Typography>
);

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ─── Types ──────────────────────────────────────────────────────── */
interface VideoMeta {
  name: string;
  size: number;
  type: string;
  duration: number;
  url: string;
}

/* ─── Component ──────────────────────────────────────────────────── */
function Analysis() {
  const [isDragging,   setIsDragging]   = useState(false);
  const [video,        setVideo]        = useState<VideoMeta | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState("");
  const [exerciseType, setExerciseType] = useState("2");
  const [sessionName,  setSessionName]  = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef  = useRef<File | null>(null);
  const navigate = useNavigate();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    setLoading(true);
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    const tmp = document.createElement("video");
    tmp.preload = "metadata";
    tmp.src = url;
    tmp.onloadedmetadata = () => {
      setVideo({ name: file.name, size: file.size, type: file.type, duration: tmp.duration, url });
      setLoading(false);
    };
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearVideo = () => {
    if (video) URL.revokeObjectURL(video.url);
    setVideo(null);
    fileRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  };

  const canSubmit = !!video && !loading && !submitting && sessionName.trim().length > 0;

  const startAnalysis = async () => {
    if (!canSubmit || !fileRef.current) return;
    setSubmitting(true);
    setSubmitError("");

    const backendApi     = import.meta.env.VITE_BACKEND_API       ?? "";
    const endpoint       = import.meta.env.VITE_ANALYSIS_ENDPOINT ?? "/api/v1/jobs";

    const formData = new FormData();
    formData.append("video",          fileRef.current);
    formData.append("session_name",   sessionName.trim());
    formData.append("exercise_id",    exerciseType);
    formData.append("render_workers", "1");
    formData.append("use_cache",      "false");

    try {
      const res = await fetch(`${backendApi}${endpoint}`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data  = await res.json();
      const jobId: string = data.job_id ?? data.id ?? "job_001";
      navigate(`/results/${jobId}`, {
        state: { exerciseType, videoName: video!.name, sessionName },
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo iniciar el análisis. Intentá de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <Box className="ts-page ts-page--center">
      <Box className="ts-container">

        {/* Header */}
        <Box className="ts-header">
          <Typography className="ts-title">Nuevo análisis</Typography>
          <Typography className="ts-subtitle">
            Subí un video y configurá la sesión antes de enviarla al modelo.
          </Typography>
        </Box>

        <PageCard>
          <Stack spacing={3}>

            {/* Nombre de sesión */}
            <Box>
              <SectionLabel>Nombre de la sesión</SectionLabel>
              <StyledTextField
                fullWidth
                size="small"
                placeholder="Ej: Sesión tarde — control de pelota"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </Box>

            {/* Tipo de ejercicio */}
            <Box>
              <SectionLabel>Tipo de ejercicio</SectionLabel>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: C.muted, fontSize: "0.85rem", "&.Mui-focused": { color: C.green } }}>
                  Ejercicio
                </InputLabel>
                <StyledSelect
                  value={exerciseType}
                  label="Ejercicio"
                  onChange={(e) => setExerciseType(e.target.value as string)}
                >
                  <MenuItem value="2">Ejercicio 2</MenuItem>
                  <MenuItem value="6">Ejercicio 6</MenuItem>
                </StyledSelect>
              </FormControl>
            </Box>

            {/* Video */}
            <Box>
              <SectionLabel>Video</SectionLabel>

              {!video ? (
                <DropZone
                  isDragging={isDragging}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />

                  {loading ? (
                    <Box sx={{ width: "55%", textAlign: "center" }}>
                      <Typography sx={{ color: C.muted, mb: 1.5, fontSize: "0.82rem" }}>
                        Cargando video…
                      </Typography>
                      <LinearProgress sx={{
                        borderRadius: 4,
                        backgroundColor: "rgba(48,137,70,0.12)",
                        "& .MuiLinearProgress-bar": { backgroundColor: C.green },
                      }} />
                    </Box>
                  ) : (
                    <>
                      <IconRing active={isDragging}>
                        <CloudUploadIcon sx={{ fontSize: 24, color: C.green }} />
                      </IconRing>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: C.dark }}>
                          {isDragging ? "Soltá el video aquí" : "Arrastrá un video o hacé clic"}
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontSize: "0.76rem", color: C.subtle }}>
                          MP4, MOV, WebM, AVI
                        </Typography>
                      </Box>
                    </>
                  )}
                </DropZone>
              ) : (
                <Box sx={{ animation: `${fadeIn} 0.3s ease` }}>
                  <VideoWrapper>
                    <video ref={videoRef} src={video.url} controls autoPlay={false} />
                  </VideoWrapper>

                  <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                      <CheckCircleIcon sx={{ fontSize: 15, color: C.green, flexShrink: 0 }} />
                      <Typography noWrap sx={{ fontSize: "0.8rem", color: C.text, maxWidth: { xs: 140, sm: 280 } }}>
                        {video.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
                      <Chip
                        icon={<VideoFileIcon sx={{ fontSize: "13px !important" }} />}
                        label={formatBytes(video.size)}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem", backgroundColor: "rgba(48,137,70,0.1)", color: C.muted, "& .MuiChip-icon": { color: C.green } }}
                      />
                      <Chip
                        icon={<PlayCircleIcon sx={{ fontSize: "13px !important" }} />}
                        label={formatDuration(video.duration)}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem", backgroundColor: "rgba(48,137,70,0.1)", color: C.muted, "& .MuiChip-icon": { color: C.green } }}
                      />
                      <IconButton
                        size="small"
                        onClick={clearVideo}
                        disabled={submitting}
                        sx={{ color: C.subtle, p: 0.4, "&:hover": { color: C.danger, background: "rgba(179,38,30,0.08)" } }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Cambiar video */}
                  <Box
                    component="label"
                    htmlFor="replace-input"
                    sx={{
                      display: "inline-flex", alignItems: "center", gap: 0.75, mt: 1.5,
                      px: 1.5, py: 0.6, borderRadius: 2,
                      border: `1px solid ${C.border}`,
                      color: C.muted, fontSize: "0.78rem", cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: C.green, color: C.green, background: "rgba(48,137,70,0.05)" },
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 14 }} />
                    Cambiar video
                    <input id="replace-input" type="file" accept="video/*" hidden
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Error */}
            {submitError && (
              <Alert severity="error" sx={{
                background: "rgba(179,38,30,0.08)",
                border: `1px solid rgba(179,38,30,0.2)`,
                color: C.danger,
                fontSize: "0.82rem",
                borderRadius: 2,
                "& .MuiAlert-icon": { color: C.danger },
              }}>
                {submitError}
              </Alert>
            )}

            {/* Submit */}
            <SubmitButton disabled={!canSubmit} onClick={startAnalysis}>
              {submitting ? (
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: C.muted }}>
                  Enviando…
                </Typography>
              ) : (
                <>
                  <CheckCircleIcon sx={{ fontSize: 17, color: canSubmit ? "#fff" : C.subtle }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: canSubmit ? "#fff" : C.subtle }}>
                    Confirmar y analizar
                  </Typography>
                </>
              )}
            </SubmitButton>

            {!sessionName.trim() && video && !submitting && (
              <Typography sx={{ fontSize: "0.75rem", color: C.muted, textAlign: "center", mt: -1 }}>
                Agregá un nombre a la sesión para continuar
              </Typography>
            )}

          </Stack>
        </PageCard>
      </Box>
    </Box>
  );
}

export default Analysis;
