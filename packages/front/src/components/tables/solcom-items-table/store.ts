import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState, PaginationState, VisibilityState, ColumnFiltersState, Updater } from '@tanstack/react-table';

interface SolcomItemsTableState {
    sorting: SortingState;
    pagination: PaginationState;
    columnVisibility: VisibilityState;
    columnFilters: ColumnFiltersState;
    selectedItemIds: number[];
    rowSelection: Record<string, boolean>;
    setSorting: (updater: Updater<SortingState>) => void;
    setPagination: (updater: Updater<PaginationState>) => void;
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
    setSelectedItemIds: (ids: number[]) => void;
    setRowSelection: (updater: Updater<Record<string, boolean>>) => void;
    updateRowSelection: (updater: Updater<Record<string, boolean>>) => void;
}

export const useSolcomItemsTableStore = create<SolcomItemsTableState>()(
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
            selectedItemIds: [],
            rowSelection: {},
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
            setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),
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
                    selectedItemIds: selectedIds,
                };
            }),
        }),
        {
            name: 'solcom-items-table-state',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sorting: state.sorting,
                pagination: state.pagination,
                columnVisibility: state.columnVisibility,
                columnFilters: state.columnFilters,
                selectedItemIds: state.selectedItemIds,
                rowSelection: state.rowSelection,
            }),
        }
    )
);
