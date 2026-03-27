import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState, PaginationState, VisibilityState, ColumnFiltersState } from '@tanstack/react-table';

interface AppState {
    sorting: SortingState;  // Este es un arreglo de ColumnSort[] como SortingState
    pagination: PaginationState;  // Estado para la paginación
    columnVisibility: VisibilityState;  // Estado para la visibilidad de columnas
    columnFilters: ColumnFiltersState;  // Estado para los filtros de columnas
    setSorting: (updater: (oldSorting: SortingState) => SortingState) => void;  // Solo un updater
    setPagination: (updater: (oldPagination: PaginationState) => PaginationState) => void;  // Solo un updater
    setColumnVisibility: (updater: (oldVisibility: VisibilityState) => VisibilityState) => void;  // Solo un updater
    setColumnFilters: (updater: (oldFilters: ColumnFiltersState) => ColumnFiltersState) => void;  // Solo un updater
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            sorting: [],  // Inicializamos el estado de sorting
            pagination: {
                pageIndex: 0,
                pageSize: 10,  // Valor inicial de la paginación
            },
            columnVisibility: {},  // Inicializamos la visibilidad de las columnas
            columnFilters: [],  // Inicializamos los filtros de las columnas
            setSorting: (updater) => set((state) => ({
                sorting: updater(state.sorting),  // Aplicamos el updater de sorting
            })),
            setPagination: (updater) => set((state) => ({
                pagination: updater(state.pagination),  // Aplicamos el updater de paginación
            })),
            setColumnVisibility: (updater) => set((state) => ({
                columnVisibility: updater(state.columnVisibility),  // Aplicamos el updater de visibilidad de columnas
            })),
            setColumnFilters: (updater) => set((state) => ({
                columnFilters: updater(state.columnFilters),  // Aplicamos el updater de filtros de columnas
            })),
        }),
        {
            name: 'inventario-state',  // Persistimos el estado en localStorage
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sorting: state.sorting,  // Persistimos solo el estado de sorting
                pagination: state.pagination,  // Persistimos el estado de paginación
                columnVisibility: state.columnVisibility,  // Persistimos el estado de visibilidad
                columnFilters: state.columnFilters,  // Persistimos los filtros de columnas
            }),
        }
    )
);
