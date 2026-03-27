import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PaginationState, ColumnFiltersState, Updater, ExpandedState } from '@tanstack/react-table';
import { ESTADO_OFERTA_CODIGOS, ESTADO_SOLCOM_CODIGOS } from '@/constants/compras';

interface SolcomOfertasTableState {
    pagination: PaginationState;
    columnFilters: ColumnFiltersState;
    expanded: ExpandedState;
    setPagination: (updater: Updater<PaginationState>) => void;
    setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
    setExpanded: (updater: Updater<ExpandedState>) => void;
}

export const useSolcomOfertasTableStore = create<SolcomOfertasTableState>()(
    persist(
        (set) => ({
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
            columnFilters: [
                {
                    id: "estado.codigo",
                    value: ESTADO_SOLCOM_CODIGOS.SOLC_AP,
                },
                {
                    id: "ofertaEstado.codigo",
                    value: ESTADO_OFERTA_CODIGOS.OF_VALIDACION,
                }
            ],
            expanded: {},
            setPagination: (updater) => set((state) => ({
                pagination: typeof updater === 'function' ? updater(state.pagination) : updater,
            })),
            setColumnFilters: (updater) => set((state) => ({
                columnFilters: typeof updater === 'function' ? updater(state.columnFilters) : updater,
            })),
            setExpanded: (updater) => set((state) => ({
                expanded: typeof updater === 'function' ? updater(state.expanded) : updater,
            })),
        }),
        {
            name: 'solcom-ofertas-table-state',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                pagination: state.pagination,
                columnFilters: state.columnFilters,
                expanded: state.expanded,
            }),
        }
    )
);
