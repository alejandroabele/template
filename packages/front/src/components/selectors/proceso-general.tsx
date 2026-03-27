'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from 'use-debounce';
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import type { ProcesoGeneral } from '@/types';
import { useGetProcesoGeneralQuery } from '@/hooks/proceso-general';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchProps {
    selectedResult?: Pick<ProcesoGeneral, 'id' | 'nombre'>;
    onSelectResult: (product: Pick<ProcesoGeneral, 'id' | 'nombre'>) => void;
}

export function Search({ selectedResult, onSelectResult }: SearchProps) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSelectResult = (product: ProcesoGeneral) => {
        onSelectResult(product);
    };

    return (
        <Command
            shouldFilter={false}
            className="h-auto rounded-lg border border-b-0 shadow-md"
        >
            <CommandInput
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Buscar"
            />

            <SearchResults
                query={searchQuery}
                selectedResult={selectedResult}
                onSelectResult={handleSelectResult}
            />
        </Command>
    );
}

interface SearchResultsProps {
    query: string;
    selectedResult: SearchProps['selectedResult'];
    onSelectResult: SearchProps['onSelectResult'];
}

function SearchResults({
    query,
    selectedResult,
    onSelectResult,
}: SearchResultsProps) {
    const [debouncedSearchQuery] = useDebounce(query, 500);

    const enabled = !!debouncedSearchQuery;


    const {
        data, // Aquí aseguramos que data nunca sea undefined
        isLoading: isLoadingOrig,
        isError,
    } = useGetProcesoGeneralQuery({
        pagination: { pageIndex: 0, pageSize: 50 },
        columnFilters: [{ id: 'nombre', value: debouncedSearchQuery }],
        globalFilter: '',
        sorting: []
    });
    const isLoading = enabled && isLoadingOrig;

    // if (!enabled) return null;
    return (
        <CommandList>
            {/* TODO: these should have proper loading aria */}
            {isLoading && <div className="p-4 text-sm">Buscando...</div>}
            {!isError && !isLoading && !data?.length && (
                <div className="p-4 text-sm">No se encontraron registros</div>
            )}
            {isError && <div className="p-4 text-sm">Hubo un error en la busqueda</div>}

            {data?.map(({ id, nombre }) => {
                return (
                    <CommandItem
                        key={id}
                        onSelect={() => onSelectResult({ id, nombre })}
                        value={nombre}
                    >
                        <Check
                            className={cn(
                                'mr-2 h-4 w-4',
                                selectedResult?.id === id ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                        {nombre}
                    </CommandItem>
                );
            })}
        </CommandList>
    );

}

const POPOVER_WIDTH = 'w-full';

export function ProcesoGeneralSelector({ proceso, onChange, disabled = false }: { proceso?: ProcesoGeneral, onChange?: (proceso: ProcesoGeneral) => void, disabled?: boolean }) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Pick<ProcesoGeneral, 'id' | 'nombre'> | undefined>(proceso);
    const handleSetActive = React.useCallback((proceso: ProcesoGeneral) => {
        setSelected(proceso);
        // OPTIONAL: close the combobox upon selection
        if (onChange) {
            onChange(proceso)
        }
        setOpen(false);
    }, []);

    const displayName = selected ? selected.nombre : 'Seleccione proceso';

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild >
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn('justify-between w-full  text-wrap',)}
                    disabled={disabled}
                >
                    {displayName}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 " align="start">
                <Search selectedResult={selected} onSelectResult={handleSetActive} />
            </PopoverContent>
        </Popover>
    );
}
