import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../../assets/logo-BJaTahkF.png";

const HIDDEN_ON: string[] = ["/", "/login"];

const Bar = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 100,
  height: 72,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  background: "var(--ts-black)",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 3),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(0, 4),
  },
}));

const BarInner = styled(Box)({
  width: "100%",
  maxWidth: "var(--ts-content-max)",
  height: "100%",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

interface TopBarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

function TopBar({ theme, onToggleTheme }: TopBarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_ON.includes(pathname.toLowerCase())) return null;

  const handleLogout = () => {
    // TODO: cuando haya auth, limpiar el token aca antes de redirigir:
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Bar>
      <BarInner>
        {/* Logo / marca */}
        <Box
          onClick={() => navigate("/home")}
          sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer" }}
        >
          <img className="ts-logo ts-logo--topbar" src={logo} alt="Logo" />
          <Typography
            sx={{
              fontFamily: "var(--ts-font)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#fff",
              letterSpacing: "0",
            }}
          >
            Top Scout AI
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}>
            <IconButton
              size="small"
              onClick={onToggleTheme}
              aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
              sx={{
                color: "rgba(255,255,255,0.72)",
                borderRadius: "8px",
                "&:hover": {
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {theme === "light"
                ? <DarkModeIcon sx={{ fontSize: 18 }} />
                : <LightModeIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Cerrar sesion">
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{
                color: "rgba(255,255,255,0.72)",
                gap: 0.75,
                borderRadius: "8px",
                px: 1.2,
                py: 0.7,
                "&:hover": {
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: 17 }} />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontFamily: "var(--ts-font)",
                  fontWeight: 600,
                }}
              >
                Salir
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </BarInner>
    </Bar>
  );
}

export default TopBar;
