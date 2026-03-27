import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState, PaginationState, VisibilityState, ColumnFiltersState } from '@tanstack/react-table';

interface AppState {
    sorting: SortingState;
    pagination: PaginationState;
    columnVisibility: VisibilityState;
    columnFilters: ColumnFiltersState;
    setSorting: (updater: (oldSorting: SortingState) => SortingState) => void;
    setPagination: (updater: (oldPagination: PaginationState) => PaginationState) => void;
    setColumnVisibility: (updater: (oldVisibility: VisibilityState) => VisibilityState) => void;
    setColumnFilters: (updater: (oldFilters: ColumnFiltersState) => ColumnFiltersState) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            sorting: [],
            pagination: { pageIndex: 0, pageSize: 10 },
            columnVisibility: {},
            columnFilters: [],
            setSorting: (updater) => set((state) => ({ sorting: updater(state.sorting) })),
            setPagination: (updater) => set((state) => ({ pagination: updater(state.pagination) })),
            setColumnVisibility: (updater) => set((state) => ({ columnVisibility: updater(state.columnVisibility) })),
            setColumnFilters: (updater) => set((state) => ({ columnFilters: updater(state.columnFilters) })),
        }),
        {
            name: 'trailer-state',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sorting: state.sorting,
                pagination: state.pagination,
                columnVisibility: state.columnVisibility,
                columnFilters: state.columnFilters,
            }),
        }
    )
);
