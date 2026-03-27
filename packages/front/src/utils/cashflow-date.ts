import { subDays, isWeekend, parse, startOfDay, isBefore } from "date-fns";

/**
 * Calcula los días hábiles hacia atrás desde una fecha dada
 */
export const getBusinessDaysAgo = (
    days: number,
    fromDate: Date = new Date()
): Date => {
    let current = new Date(fromDate);
    let businessDaysCount = 0;

    // Empezamos desde el día anterior
    current = subDays(current, 1);

    while (businessDaysCount < days) {
        if (!isWeekend(current)) {
            businessDaysCount++;
        }
        if (businessDaysCount < days) {
            current = subDays(current, 1);
        }
    }

    return current;
};

/**
 * Determina si una fecha está deshabilitada según los días hábiles configurados
 * @param dateString - Fecha en formato yyyy-MM-dd
 * @param vista - Vista actual del cashflow
 * @param diasHabiles - Cantidad de días hábiles permitidos para edición (por defecto 5)
 * @param permitirEdicionSinLimite - Si es true, permite editar cualquier fecha (por defecto false)
 */
export const isDateDisabled = (
    dateString: string,
    vista: "semanal" | "semanal-mes" | "mensual" | "trimestral",
    diasHabiles: number = 5,
    permitirEdicionSinLimite: boolean = false
): boolean => {
    // Si está habilitada la edición sin límite, nunca deshabilitar (excepto vistas especiales)
    if (permitirEdicionSinLimite) {
        // En vista mensual y trimestral, siempre deshabilitado
        if (vista === "mensual" || vista === "trimestral")
            return true;
        return false;
    }

    // En vista mensual y trimestral, siempre deshabilitado
    if (vista === "mensual" || vista === "trimestral")
        return true;

    // Para vistas semanal y semanal-mes, verificar días hábiles
    const date = startOfDay(parse(dateString, "yyyy-MM-dd", new Date()));
    const cutoffDate = startOfDay(getBusinessDaysAgo(diasHabiles));
    return isBefore(date, cutoffDate);
};
