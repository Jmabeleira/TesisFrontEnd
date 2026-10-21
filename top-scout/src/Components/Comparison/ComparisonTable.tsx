import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Typography,
} from "@mui/material";
import { ErrorOutlined as ErrorOutlineIcon } from "@mui/icons-material";
import { formatDate } from "../../utils/format";
import { formatSprintTime, scoreColor } from "../../utils/metrics";
import {
  sortRows, type ComparisonColumn, type ComparisonRow, type SortDirection, type SortKey,
} from "./comparisonData";

const cellSx = {
  borderColor: "var(--ts-border)",
  color: "var(--ts-text)",
  fontSize: ".8rem",
  whiteSpace: "nowrap",
  py: 1.1,
} as const;

const headSx = {
  ...cellSx,
  background: "var(--ts-card)",
  color: "var(--ts-muted)",
  fontWeight: 700,
  fontSize: ".72rem",
  letterSpacing: ".04em",
  textTransform: "uppercase",
  "& .MuiTableSortLabel-root:hover, & .MuiTableSortLabel-root.Mui-active": { color: "var(--ts-green)" },
  "& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": { color: "var(--ts-green)" },
} as const;

// Primera columna fija para no perder de vista al jugador al desplazar horizontalmente.
const stickySx = { position: "sticky", left: 0, zIndex: 2, background: "var(--ts-card)" } as const;

function MissingValue() {
  return (
    <Tooltip title="Sin dato para esta evaluación">
      <Box component="span" sx={{ color: "var(--ts-subtle)" }}>—</Box>
    </Tooltip>
  );
}

function MetricValue({ column, value }: { column: ComparisonColumn; value: number | null | undefined }) {
  if (value === null || value === undefined) return <MissingValue />;
  if (column.kind === "score") {
    return (
      <Box component="span" sx={{ fontWeight: 700, color: scoreColor(value) }}>
        {value}
        <Box component="span" sx={{ color: "var(--ts-subtle)", fontWeight: 500 }}>/5</Box>
      </Box>
    );
  }
  if (column.kind === "time") {
    return <Box component="span" sx={{ fontFamily: "var(--ts-mono)", fontWeight: 700 }}>{formatSprintTime(value)}</Box>;
  }
  return (
    <Box component="span" sx={{ fontWeight: 600 }}>
      {value.toLocaleString("es-AR", { maximumFractionDigits: column.decimals ?? 2 })}
      {column.unit && <Box component="span" sx={{ color: "var(--ts-subtle)", fontWeight: 500 }}> {column.unit}</Box>}
    </Box>
  );
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
}

function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sortedRows = useMemo(() => sortRows(rows, sortKey, direction), [rows, sortKey, direction]);

  const handleSort = (key: SortKey, preferred: SortDirection) => {
    if (key === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection(preferred);
    }
  };

  const sortLabel = (key: SortKey, preferred: SortDirection, label: React.ReactNode) => (
    <TableSortLabel
      active={sortKey === key}
      direction={sortKey === key ? direction : preferred}
      onClick={() => handleSort(key, preferred)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <TableContainer className="ts-scroll" sx={{ maxHeight: "calc(100vh - 300px)", minHeight: 160 }}>
      <Table stickyHeader size="small" aria-label="Comparación de jugadores">
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headSx, ...stickySx, zIndex: 3 }}>{sortLabel("player", "asc", "Jugador / sesión")}</TableCell>
            <TableCell sx={headSx}>{sortLabel("date", "desc", "Fecha")}</TableCell>
            {columns.map((column) => (
              <TableCell key={column.key} sx={headSx} align="right">
                {sortLabel(
                  column.key,
                  column.higherIsBetter ? "desc" : "asc",
                  <span>
                    {column.label}
                    {column.kind === "number" && column.unit && <Box component="span" sx={{ textTransform: "none", ml: .5 }}>({column.unit})</Box>}
                  </span>,
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow
              key={row.jobId}
              hover
              onClick={() => navigate(`/results/${row.jobId}`)}
              sx={{
                cursor: "pointer",
                "&.MuiTableRow-hover:hover > td": { background: "var(--ts-card-hover)" },
              }}
            >
              <TableCell sx={{ ...cellSx, ...stickySx, fontWeight: 700, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: .75 }}>
                  {row.error && (
                    <Tooltip title={`No se pudieron cargar los resultados: ${row.error}`}>
                      <ErrorOutlineIcon sx={{ fontSize: 16, color: "var(--ts-danger)" }} />
                    </Tooltip>
                  )}
                  <Tooltip title={row.player}>
                    <Typography component="span" noWrap sx={{ fontSize: "inherit", fontWeight: "inherit" }}>{row.player}</Typography>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell sx={{ ...cellSx, color: "var(--ts-muted)" }}>
                {row.date ? formatDate(row.date) : <MissingValue />}
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key} sx={cellSx} align="right">
                  <MetricValue column={column} value={row.values[column.key]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ComparisonTable;
