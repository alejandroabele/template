import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState, PaginationState, VisibilityState, ColumnFiltersState, ExpandedState, Updater } from '@tanstack/react-table';

interface SolcomTableState {
    sorting: SortingState;
    pagination: PaginationState;
    columnVisibility: VisibilityState;
    columnFilters: ColumnFiltersState;
    expanded: ExpandedState;
    rowSelection: Record<string, boolean>;
    selectedItemIds: number[];
    selectedSolcomIds: number[];
    setSorting: (updater: Updater<SortingState>) => void;
    setPagination: (updater: Updater<PaginationState>) => void;
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
    setExpanded: (updater: Updater<ExpandedState>) => void;
    setRowSelection: (updater: Updater<Record<string, boolean>>) => void;
    updateRowSelection: (updater: Updater<Record<string, boolean>>) => void;
    setSelectedItemIds: (ids: number[]) => void;
    setSelectedSolcomIds: (ids: number[]) => void;
}

export const useSolcomTableStore = create<SolcomTableState>()(
    persist(
        (set) => ({
            sorting: [
                { id: 'id', desc: true }
            ],
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
            columnVisibility: {},
            columnFilters: [],
            expanded: {},
            rowSelection: {},
            selectedItemIds: [],
            selectedSolcomIds: [],
            setSorting: (updater) => set((state) => ({
                sorting: typeof updater === 'function' ? updater(state.sorting) : updater,
            })),
            setPagination: (updater) => set((state) => ({
                pagination: typeof updater === 'function' ? updater(state.pagination) : updater,
            })),
            setColumnVisibility: (updater) => set((state) => ({
                columnVisibility: typeof updater === 'function' ? updater(state.columnVisibility) : updater,
            })),
            setColumnFilters: (updater) => set((state) => ({
                columnFilters: typeof updater === 'function' ? updater(state.columnFilters) : updater,
            })),
            setExpanded: (updater) => set((state) => ({
                expanded: typeof updater === 'function' ? updater(state.expanded) : updater,
            })),
            setRowSelection: (updater) => set((state) => ({
                rowSelection: typeof updater === 'function' ? updater(state.rowSelection) : updater,
            })),
            updateRowSelection: (updater) => set((state) => {
                const newRowSelection = typeof updater === 'function' ? updater(state.rowSelection) : updater;
                const selectedIds = Object.keys(newRowSelection)
                    .filter(key => newRowSelection[key])
                    .map(id => Number(id));
                return {
                    rowSelection: newRowSelection,
                    selectedSolcomIds: selectedIds,
                };
            }),
            setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),
            setSelectedSolcomIds: (ids) => set({ selectedSolcomIds: ids }),
        }),
        {
            name: 'solcom-table-state',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sorting: state.sorting,
                pagination: state.pagination,
                columnVisibility: state.columnVisibility,
                columnFilters: state.columnFilters,
                expanded: state.expanded,
            }),
        }
    )
);
