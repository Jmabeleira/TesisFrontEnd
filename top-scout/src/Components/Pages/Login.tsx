import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Alert, Box, Typography, InputAdornment, IconButton, Tooltip } from "@mui/material";
import {
  AssessmentOutlined,
  BarChartOutlined,
  DarkMode,
  LightMode,
  LockOutlined,
  OndemandVideoOutlined,
  ShieldOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../../assets/logo-BJaTahkF.png";

type ThemeMode = "light" | "dark";

interface LoginFormProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const Shell = styled("main")({
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "radial-gradient(circle at 16% 18%, rgba(58,164,84,0.16), transparent 30%), linear-gradient(135deg, var(--ts-bg) 0%, var(--ts-bg) 58%, rgba(48,137,70,0.08) 100%)",
  color: "var(--ts-text)",
  "@media (max-width: 760px)": {
    padding: "18px",
  },
});

const LoginSurface = styled(Box)({
  width: "min(100%, 900px)",
  minHeight: 500,
  display: "grid",
  gridTemplateColumns: "42fr 58fr",
  overflow: "hidden",
  background: "color-mix(in srgb, var(--ts-card) 92%, transparent)",
  border: "1px solid var(--ts-border)",
  borderRadius: 20,
  boxShadow: "var(--ts-shadow-strong)",
  backdropFilter: "blur(20px)",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
    minHeight: "auto",
  },
});

const BrandPanel = styled(Box)({
  position: "relative",
  display: "grid",
  gridTemplateRows: "auto auto auto auto",
  alignContent: "start",
  rowGap: 18,
  minHeight: 500,
  padding: "30px 32px",
  background:
    "linear-gradient(145deg, rgba(8,14,13,0.96), rgba(26,37,32,0.92)), radial-gradient(circle at 74% 22%, rgba(58,164,84,0.32), transparent 34%)",
  color: "#f4f8f6",
  "@media (max-width: 900px)": {
    minHeight: "auto",
    rowGap: 14,
  },
  "@media (max-width: 560px)": {
    padding: "24px 22px",
  },
});

const FormPanel = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "48px 58px",
  background: "var(--ts-card)",
  "@media (max-width: 900px)": {
    padding: "42px 36px",
  },
  "@media (max-width: 560px)": {
    padding: "34px 22px 30px",
  },
});

const ThemeButton = styled(IconButton)({
  width: 34,
  height: 34,
  color: "var(--ts-muted)",
  border: "1px solid var(--ts-border)",
  borderRadius: 10,
  background: "var(--ts-input-bg)",
  "&:hover": {
    color: "var(--ts-text)",
    background: "rgba(58,164,84,0.1)",
  },
});

const BenefitItem = styled(Box)({
  display: "grid",
  gridTemplateColumns: "26px 1fr",
  alignItems: "center",
  gap: 10,
  color: "rgba(244,248,246,0.74)",
});

const BenefitIcon = styled(Box)({
  width: 26,
  height: 26,
  display: "grid",
  placeItems: "center",
  borderRadius: 10,
  color: "#8be3a3",
  background: "rgba(58,164,84,0.14)",
  border: "1px solid rgba(126,224,154,0.14)",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--ts-input-bg)",
    borderRadius: 10,
    color: "var(--ts-text)",
    fontSize: "0.86rem",
    "& fieldset": { borderColor: "var(--ts-input-border)" },
    "&:hover fieldset": { borderColor: "rgba(48,137,70,0.45)" },
    "&.Mui-focused fieldset": { borderColor: "var(--ts-green)", borderWidth: 1 },
  },
  "& .MuiOutlinedInput-input": {
    padding: "12px 14px",
  },
  "& .MuiInputLabel-root": {
    color: "var(--ts-muted)",
    fontSize: "0.82rem",
    "&.Mui-focused": { color: "var(--ts-green)" },
  },
  "& .MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
    transform: "translate(14px, 12px) scale(1)",
  },
  "& .MuiInputAdornment-root .MuiIconButton-root": {
    color: "var(--ts-muted)",
    "&:hover": { color: "var(--ts-text)" },
  },
});

const SubmitButton = styled(Button)({
  background: "var(--ts-green)",
  borderRadius: 10,
  padding: "10px 0",
  fontSize: "0.86rem",
  fontFamily: "var(--ts-font)",
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: "0.01em",
  color: "#fff",
  boxShadow: "none",
  "&:hover": {
    background: "var(--ts-green-light)",
    boxShadow: "none",
  },
  "&:active": { transform: "translateY(1px)" },
});

function LoginForm({ theme, onToggleTheme }: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      navigate("/home");
    } catch {
      setError("Credenciales incorrectas. Revisá tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <LoginSurface>
        <BrandPanel>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.35,
              width: "100%",
            }}
          >
            <img
              src={logo}
              alt="TopScout AI"
              style={{ width: 62, height: 62, objectFit: "contain" }}
            />
            <Typography
              sx={{
                fontFamily: "var(--ts-font)",
                fontWeight: 850,
                fontSize: "1rem",
                color: "#fff",
                letterSpacing: "0",
              }}
            >
              TopScout AI
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 360, mt: 1.4 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--ts-font)",
                fontWeight: 850,
                fontSize: { xs: "1.28rem", sm: "1.36rem", md: "1.42rem" },
                lineHeight: 1.16,
                letterSpacing: "0",
              }}
            >
              Evaluación de jugadores desde videos de entrenamiento
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 330 }}>
            <Typography
              sx={{
                color: "rgba(244,248,246,0.72)",
                fontSize: { xs: "0.8rem", md: "0.84rem" },
                lineHeight: 1.58,
              }}
            >
              Accede para la evaluación, seguimiento y reportes de rendimiento de jugadores.
            </Typography>
          </Box>

          <Stack spacing={1.35} sx={{ mt: 1.2, "@media (max-width: 560px)": { display: "none" } }}>
            <BenefitItem>
              <BenefitIcon>
                <OndemandVideoOutlined sx={{ fontSize: 14 }} />
              </BenefitIcon>
              <Typography sx={{ fontSize: "0.76rem", fontWeight: 560 }}>
                Análisis automático de videos
              </Typography>
            </BenefitItem>
            <BenefitItem>
              <BenefitIcon>
                <BarChartOutlined sx={{ fontSize: 14 }} />
              </BenefitIcon>
              <Typography sx={{ fontSize: "0.76rem", fontWeight: 560 }}>
                Métricas objetivas y comparables
              </Typography>
            </BenefitItem>
            <BenefitItem>
              <BenefitIcon>
                <AssessmentOutlined sx={{ fontSize: 14 }} />
              </BenefitIcon>
              <Typography sx={{ fontSize: "0.76rem", fontWeight: 560 }}>
                Resultados y reportes centralizados
              </Typography>
            </BenefitItem>
          </Stack>
        </BrandPanel>

        <FormPanel>
          <Box sx={{ position: "absolute", top: 22, right: 22 }}>
            <Tooltip title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}>
              <ThemeButton
                onClick={onToggleTheme}
                aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
              >
                {theme === "light" ? <DarkMode sx={{ fontSize: 16 }} /> : <LightMode sx={{ fontSize: 16 }} />}
              </ThemeButton>
            </Tooltip>
          </Box>

          <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: { xs: 1, md: 0 } }}>
            <Box
              sx={{
                mb: 3.4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.1,
                  mb: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "9px",
                    color: "var(--ts-green)",
                    background: "rgba(58,164,84,0.1)",
                  }}
                >
                  <LockOutlined sx={{ fontSize: 17 }} />
                </Box>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "var(--ts-font)",
                    fontWeight: 850,
                    fontSize: { xs: "1.35rem", sm: "1.48rem" },
                    color: "var(--ts-dark)",
                    lineHeight: 1.08,
                    letterSpacing: "0",
                  }}
                >
                  Iniciar sesión
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.82rem", color: "var(--ts-muted)", lineHeight: 1.55 }}>
                Ingresá tus credenciales para continuar.
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: "rgba(192,57,43,0.1)",
                  border: "1px solid rgba(192,57,43,0.25)",
                  color: "var(--ts-danger)",
                  fontSize: "0.82rem",
                  borderRadius: 2,
                  "& .MuiAlert-icon": { color: "var(--ts-danger)" },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={1.75}>
                <StyledTextField
                  required
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  fullWidth
                />
                <StyledTextField
                  required
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword((value) => !value)}
                            edge="end"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword
                              ? <VisibilityOff sx={{ fontSize: 17 }} />
                              : <Visibility sx={{ fontSize: 17 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <SubmitButton
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 0.75 }}
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </SubmitButton>
              </Stack>
            </form>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 3.2,
                color: "var(--ts-muted)",
                fontSize: "0.74rem",
              }}
            >
              <ShieldOutlined sx={{ fontSize: 15, color: "var(--ts-green)" }} />
              <Typography sx={{ fontSize: "0.74rem" }}>
                Sesión protegida con acceso privado.
              </Typography>
            </Box>
          </Box>
        </FormPanel>
      </LoginSurface>
    </Shell>
  );
}

export default LoginForm;
