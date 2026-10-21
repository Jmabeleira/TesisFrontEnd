export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    timeZone: "America/Montevideo",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}
