/**
 * Convierte minutos a formato HH:mm (ej: 125 → "02:05")
 */
export function minutosAHHmm(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Parsea un string "YYYY-MM-DD HH:mm:ss" con offset Argentina (-03:00)
 * y retorna el timestamp en milisegundos.
 */
function parseArgentina(s: string): number {
  return new Date(s.replace(" ", "T") + "-03:00").getTime();
}

/**
 * Calcula la duración en minutos entre dos strings "YYYY-MM-DD HH:mm:ss"
 * usando el offset Argentina (-03:00).
 */
export function duracionMinutos(inicio: string, fin: string): number {
  return Math.max(0, Math.floor((parseArgentina(fin) - parseArgentina(inicio)) / 60000));
}

/**
 * Filtra un array de items por rango de fechas "YYYY-MM-DD".
 * Si rango es null, devuelve todos los items.
 * El campo debe ser un string "YYYY-MM-DD HH:mm:ss".
 */
export function filtrarPorRango<T>(
  items: T[],
  campo: keyof T,
  rango: { from: string; to: string } | null
): T[] {
  if (!rango) return items;

  const tsDesde = parseArgentina(rango.from + " 00:00:00");
  const tsHasta = parseArgentina(rango.to + " 23:59:59");

  return items.filter((item) => {
    const val = item[campo];
    if (typeof val !== "string" || !val) return false;
    const ts = parseArgentina(val);
    return ts >= tsDesde && ts <= tsHasta;
  });
}

/**
 * Agrupa items por día acumulando minutos trabajados (solo registros con inicio y fin).
 * Retorna { fecha: "dd/MM", minutos: number, horas: number }[] ordenado por fecha ASC.
 */
export function agruparPorDia<T extends Record<string, unknown>>(
  items: T[],
  campoDia: keyof T,
  campoFin?: keyof T,
): { fecha: string; minutos: number; horas: number }[] {
  const mapa: Record<string, number> = {};
  for (const item of items) {
    const inicio = item[campoDia];
    if (typeof inicio !== "string" || !inicio) continue;
    const dia = inicio.slice(0, 10);
    let min = 0;
    if (campoFin) {
      const fin = item[campoFin];
      if (typeof fin === "string" && fin) {
        min = duracionMinutos(inicio, fin);
      }
    } else {
      min = 1; // fallback: contar sesiones como 1 min si no hay fin
    }
    mapa[dia] = (mapa[dia] ?? 0) + min;
  }
  return Object.entries(mapa)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, minutos]) => ({
      fecha: `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`,
      minutos,
      horas: parseFloat((minutos / 60).toFixed(1)),
    }));
}
