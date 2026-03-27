import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CashflowCategoria, CashflowTransaccion } from "@/types";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  getISOWeekYear,
  getISOWeek,
  addMonths,
  subMonths,
  format,
  addDays,
} from "date-fns";
import { es } from "date-fns/locale";

export type Vista = "semanal" | "semanal-mes" | "mensual" | "trimestral";

/**
 * Store que maneja los parámetros globales de la vista de cashflow y navegación.
 *
 * Responsabilidades:
 * - Vista activa (diaria, semanal, mensual, trimestral)
 * - Rango de fechas y navegación entre períodos
 * - Sincronización con URL parameters
 * - Si se incluye proyectado
 * - Modo de selección múltiple
 * - Estado de UI (colapsado, diálogos)
 *
 * NO hace llamadas a servicios ni procesa datos de dominio.
 * Cada componente de sección usa estos parámetros para hacer sus propias queries.
 */
interface CashflowState {
  // ========== PARÁMETROS GLOBALES DE VISTA ==========

  /** Vista activa */
  vista: Vista;

  /** Semana actual de referencia */
  currentWeek: Date;

  /** Rango de fechas para la vista actual */
  weekStart: Date;
  weekEnd: Date;
  monthStart: Date;
  monthEnd: Date;

  /** Array de días de la semana en formato yyyy-MM-dd */
  weekDays: string[];

  /** Año y mes actuales para navegación */
  currentYear: number;
  currentMonth: number;

  /** Si se incluyen transacciones proyectadas */
  incluirProyectado: boolean;

  /** Si se muestran los bancos asociados a las transacciones */
  mostrarBancos: boolean;

  /** Configuración de días hábiles para edición */
  diasHabilesPermitidos: number;

  /** Permitir edición sin límite de días */
  permitirEdicionSinLimite: boolean;

  // Acciones para parámetros globales y navegación
  setVista: (vista: Vista, updateUrl?: (vista: Vista) => void) => void;
  setCurrentWeek: (date: Date, updateUrl?: (date: Date) => void) => void;
  initializeFromUrl: (weekParam: string | null, vistaParam: string | null) => void;
  setIncluirProyectado: (value: boolean) => void;
  setMostrarBancos: (value: boolean) => void;
  setDiasHabilesPermitidos: (value: number) => void;
  setPermitirEdicionSinLimite: (value: boolean) => void;

  // Navegación
  goToPreviousWeek: (updateUrl?: (date: Date) => void) => void;
  goToNextWeek: (updateUrl?: (date: Date) => void) => void;
  goToCurrentWeek: (updateUrl?: (date: Date) => void) => void;
  goToPreviousMonth: (updateUrl?: (date: Date) => void) => void;
  goToNextMonth: (updateUrl?: (date: Date) => void) => void;
  goToCurrentMonth: (updateUrl?: (date: Date) => void) => void;
  goToPreviousYear: (updateUrl?: (date: Date) => void) => void;
  goToNextYear: (updateUrl?: (date: Date) => void) => void;
  goToCurrentYear: (updateUrl?: (date: Date) => void) => void;

  // ========== ESTADO DE UI (expansión/colapso) ==========

  expanded: {
    all: boolean; // Si está en modo expandir todo
    rubros: Set<string>; // Rubros expandidos manualmente
    categorias: Set<number>; // Categorías expandidas
    secciones: Set<string>; // Secciones expandidas (bancos, credito-disponible)
  };
  toggleCategory: (id: number) => void;
  toggleRubro: (key: string) => void;
  toggleSeccion: (key: string) => void;
  collapseAll: () => void;
  expandAll: () => void;

  // ========== SELECCIÓN MÚLTIPLE ==========

  selectionMode: boolean;
  selectedTransacciones: Set<number>;
  selectedTransaccionesMap: Map<number, CashflowTransaccion>;
  setSelectionMode: (value: boolean) => void;
  toggleTransaccionSelection: (id: number, transaccion?: CashflowTransaccion) => void;
  clearSelection: () => void;

  // ========== DIÁLOGOS ==========

  dialogOpen: boolean;
  changeDateDialogOpen: boolean;
  selectedCategoria: CashflowCategoria | null;
  selectedFecha: string;
  editingTransaccion: CashflowTransaccion | null;
  setDialogOpen: (open: boolean) => void;
  setChangeDateDialogOpen: (open: boolean) => void;
  openNewTransaction: (categoria: CashflowCategoria, fecha: string) => void;
  openEmptyTransaction: () => void;
  openEditTransaction: (transaccion: CashflowTransaccion) => void;
  closeDialogs: () => void;
}

// Helpers para parsear semana ISO
const parseISOWeek = (year: number, week: number): Date => {
  const jan4 = new Date(year, 0, 4);
  const firstWeekStart = startOfWeek(jan4, { weekStartsOn: 1 });
  return addWeeks(firstWeekStart, week - 1);
};

// Calcular rangos de fechas desde currentWeek
const calculateDateRanges = (currentWeek: Date) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1, locale: es });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1, locale: es });
  const monthStart = new Date(currentWeek.getFullYear(), 0, 1);
  const monthEnd = new Date(currentWeek.getFullYear(), 11, 31);
  const currentYear = currentWeek.getFullYear();
  const currentMonth = currentWeek.getMonth() + 1;

  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    weekDays.push(format(day, "yyyy-MM-dd"));
  }

  return {
    weekStart,
    weekEnd,
    monthStart,
    monthEnd,
    currentYear,
    currentMonth,
    weekDays,
  };
};

const initialWeek = new Date();
const initialRanges = calculateDateRanges(initialWeek);

export const useCashflowStore = create<CashflowState>()(
  persist((set, get) => ({
  // ========== VALORES INICIALES ==========

  // Parámetros globales
  vista: "semanal",
  currentWeek: initialWeek,
  ...initialRanges,
  incluirProyectado: false,
  mostrarBancos: false,
  diasHabilesPermitidos: 5,
  permitirEdicionSinLimite: false,

  // UI - Expansión/colapso
  // Estado inicial: bancos y crédito disponible colapsados, ingresos/egresos expandidos
  expanded: {
    all: false,
    rubros: new Set<string>(),
    categorias: new Set<number>(),
    secciones: new Set<string>(), // Las agrupaciones se expanden al hacer click
  },

  // Selección múltiple
  selectionMode: false,
  selectedTransacciones: new Set(),
  selectedTransaccionesMap: new Map(),

  // Diálogos
  dialogOpen: false,
  changeDateDialogOpen: false,
  selectedCategoria: null,
  selectedFecha: "",
  editingTransaccion: null,

  // ========== ACCIONES - PARÁMETROS GLOBALES ==========

  setVista: (vista, updateUrl) => {
    set({ vista });
    if (updateUrl) {
      updateUrl(vista);
    }
  },

  setCurrentWeek: (date, updateUrl) => {
    const ranges = calculateDateRanges(date);
    set({ currentWeek: date, ...ranges });
    if (updateUrl) {
      updateUrl(date);
    }
  },

  initializeFromUrl: (weekParam, vistaParam) => {
    let currentWeek = new Date();

    if (weekParam) {
      const [year, week] = weekParam.split("-W");
      if (year && week) {
        currentWeek = parseISOWeek(Number.parseInt(year), Number.parseInt(week));
      }
    }

    const vista = (vistaParam as Vista) || "semanal";
    const ranges = calculateDateRanges(currentWeek);

    set({ currentWeek, vista, ...ranges });
  },

  setIncluirProyectado: (value) => set({ incluirProyectado: value }),
  setMostrarBancos: (value) => set({ mostrarBancos: value }),
  setDiasHabilesPermitidos: (value) => set({ diasHabilesPermitidos: value }),
  setPermitirEdicionSinLimite: (value) => set({ permitirEdicionSinLimite: value }),

  // ========== ACCIONES - NAVEGACIÓN ==========

  goToPreviousWeek: (updateUrl) => {
    const currentWeek = get().currentWeek;
    const newWeek = subWeeks(currentWeek, 1);
    const ranges = calculateDateRanges(newWeek);
    set({ currentWeek: newWeek, ...ranges });
    if (updateUrl) {
      updateUrl(newWeek);
    }
  },

  goToNextWeek: (updateUrl) => {
    const currentWeek = get().currentWeek;
    const newWeek = addWeeks(currentWeek, 1);
    const ranges = calculateDateRanges(newWeek);
    set({ currentWeek: newWeek, ...ranges });
    if (updateUrl) {
      updateUrl(newWeek);
    }
  },

  goToCurrentWeek: (updateUrl) => {
    const newWeek = new Date();
    const ranges = calculateDateRanges(newWeek);
    set({ currentWeek: newWeek, ...ranges });
    if (updateUrl) {
      updateUrl(newWeek);
    }
  },

  goToPreviousMonth: (updateUrl) => {
    const currentWeek = get().currentWeek;
    const newMonth = subMonths(currentWeek, 1);
    const ranges = calculateDateRanges(newMonth);
    set({ currentWeek: newMonth, ...ranges });
    if (updateUrl) {
      updateUrl(newMonth);
    }
  },

  goToNextMonth: (updateUrl) => {
    const currentWeek = get().currentWeek;
    const newMonth = addMonths(currentWeek, 1);
    const ranges = calculateDateRanges(newMonth);
    set({ currentWeek: newMonth, ...ranges });
    if (updateUrl) {
      updateUrl(newMonth);
    }
  },

  goToCurrentMonth: (updateUrl) => {
    const newMonth = new Date();
    const ranges = calculateDateRanges(newMonth);
    set({ currentWeek: newMonth, ...ranges });
    if (updateUrl) {
      updateUrl(newMonth);
    }
  },

  goToPreviousYear: (updateUrl) => {
    const currentWeek = get().currentWeek;
    const newYear = new Date(currentWeek);
    newYear.setFullYear(newYear.getFullYear() - 1);
    const ranges = calculateDateRanges(newYear);
    set({ currentWeek: newYear, ...ranges });
    if (updateUrl) {
      updateUrl(newYear);
    }
  },

  goToNextYear: (updateUrl) => {
    const currentWeek = get().currentWeek;
    const newYear = new Date(currentWeek);
    newYear.setFullYear(newYear.getFullYear() + 1);
    const ranges = calculateDateRanges(newYear);
    set({ currentWeek: newYear, ...ranges });
    if (updateUrl) {
      updateUrl(newYear);
    }
  },

  goToCurrentYear: (updateUrl) => {
    const newYear = new Date();
    const ranges = calculateDateRanges(newYear);
    set({ currentWeek: newYear, ...ranges });
    if (updateUrl) {
      updateUrl(newYear);
    }
  },

  // ========== ACCIONES - UI COLAPSADO ==========

  toggleCategory: (id) =>
    set((state) => {
      const next = new Set(state.expanded.categorias);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expanded: { ...state.expanded, categorias: next, all: false } };
    }),

  toggleRubro: (key) =>
    set((state) => {
      const next = new Set(state.expanded.rubros);

      // Toggle: si está expandido lo colapsamos, si está colapsado lo expandimos
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return { expanded: { ...state.expanded, rubros: next, all: false } };
    }),

  toggleSeccion: (key) =>
    set((state) => {
      const next = new Set(state.expanded.secciones);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return { expanded: { ...state.expanded, secciones: next } };
    }),

  collapseAll: () =>
    set({
      expanded: {
        all: false,
        rubros: new Set(),
        categorias: new Set(),
        secciones: new Set(),
      },
    }),

  expandAll: () =>
    set({
      expanded: {
        all: true, // Esto expande todos los rubros automáticamente
        rubros: new Set(),
        categorias: new Set(),
        secciones: new Set<string>(["bancos", "credito-disponible"]), // expandAll expande bancos y crédito; las agrupaciones se expanden por IDs dinámicos
      },
    }),

  // ========== ACCIONES - SELECCIÓN MÚLTIPLE ==========

  setSelectionMode: (value) =>
    set({
      selectionMode: value,
      selectedTransacciones: new Set(),
      selectedTransaccionesMap: new Map(),
    }),

  toggleTransaccionSelection: (id, transaccion) =>
    set((state) => {
      const nextSet = new Set(state.selectedTransacciones);
      const nextMap = new Map(state.selectedTransaccionesMap);
      if (nextSet.has(id)) {
        nextSet.delete(id);
        nextMap.delete(id);
      } else {
        nextSet.add(id);
        if (transaccion) nextMap.set(id, transaccion);
      }
      return { selectedTransacciones: nextSet, selectedTransaccionesMap: nextMap };
    }),

  clearSelection: () =>
    set({
      selectionMode: false,
      selectedTransacciones: new Set(),
      selectedTransaccionesMap: new Map(),
    }),

  // ========== ACCIONES - DIÁLOGOS ==========

  setDialogOpen: (open) => set({ dialogOpen: open }),
  setChangeDateDialogOpen: (open) => set({ changeDateDialogOpen: open }),

  openNewTransaction: (categoria, fecha) =>
    set({
      selectedCategoria: categoria,
      selectedFecha: fecha,
      editingTransaccion: null,
      dialogOpen: true,
    }),

  openEmptyTransaction: () =>
    set({
      selectedCategoria: null,
      selectedFecha: "",
      editingTransaccion: null,
      dialogOpen: true,
    }),

  openEditTransaction: (transaccion) =>
    set({
      editingTransaccion: transaccion,
      selectedCategoria: null,
      selectedFecha: "",
      dialogOpen: true,
    }),

  closeDialogs: () =>
    set({
      dialogOpen: false,
      changeDateDialogOpen: false,
      selectedCategoria: null,
      selectedFecha: "",
      editingTransaccion: null,
    }),
  }), {
    name: "cashflow-expanded-state",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      incluirProyectado: state.incluirProyectado,
      mostrarBancos: state.mostrarBancos,
      expanded: {
        all: state.expanded.all,
        rubros: [...state.expanded.rubros],
        categorias: [...state.expanded.categorias],
        secciones: [...state.expanded.secciones],
      },
    }),
    onRehydrateStorage: () => (state) => {
      if (!state?.expanded) return;
      state.expanded = {
        all: state.expanded.all ?? false,
        rubros: new Set<string>(state.expanded.rubros ?? []),
        categorias: new Set<number>(state.expanded.categorias ?? []),
        secciones: new Set<string>(state.expanded.secciones ?? []),
      };
    },
  })
);
