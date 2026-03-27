import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState, VisibilityState, ColumnFiltersState } from '@tanstack/react-table';

interface UbicacionesTableState {
    sorting: SortingState;
    columnVisibility: VisibilityState;
    columnFilters: ColumnFiltersState;
    setSorting: (updater: (old: SortingState) => SortingState) => void;
    setColumnVisibility: (updater: (old: VisibilityState) => VisibilityState) => void;
    setColumnFilters: (updater: (old: ColumnFiltersState) => ColumnFiltersState) => void;
}

export const useStore = create<UbicacionesTableState>()(
    persist(
        (set) => ({
            sorting: [],
            columnVisibility: {},
            columnFilters: [],
            setSorting: (updater) => set((state) => ({ sorting: updater(state.sorting) })),
            setColumnVisibility: (updater) => set((state) => ({ columnVisibility: updater(state.columnVisibility) })),
            setColumnFilters: (updater) => set((state) => ({ columnFilters: updater(state.columnFilters) })),
        }),
        {
            name: 'ubicaciones-table-state',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
