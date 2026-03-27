import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState, PaginationState, VisibilityState, ColumnFiltersState, Updater } from '@tanstack/react-table';
import { ESTADO_OFERTA_CODIGOS, ESTADO_SOLCOM_CODIGOS } from '@/constants/compras';

interface OfertasActivasTableState {
    sorting: SortingState;
    pagination: PaginationState;
    columnVisibility: VisibilityState;
    columnFilters: ColumnFiltersState;
    setSorting: (updater: Updater<SortingState>) => void;
    setPagination: (updater: Updater<PaginationState>) => void;
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
}

export const useOfertasActivasTableStore = create<OfertasActivasTableState>()(
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
            columnFilters: [
                {
                    id: "solcomEstado.codigo",
                    value: ESTADO_SOLCOM_CODIGOS.SOLC_AP,
                },
                {
                    id: "estado.codigo",
                    value: ESTADO_OFERTA_CODIGOS.OF_VALIDACION,
                }
            ],
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
        }),
        {
            name: 'ofertas-activas-table-state',
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
