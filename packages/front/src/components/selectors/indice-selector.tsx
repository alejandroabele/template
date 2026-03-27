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
import type { Indice } from '@/types';
import { useGetIndicesQuery } from '@/hooks/indice';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchProps {
    selectedResult?: Pick<Indice, 'id' | 'nombre' | 'porcentaje'>;
    onSelectResult: (indice: Pick<Indice, 'id' | 'nombre' | 'porcentaje'>) => void;
}

export function Search({ selectedResult, onSelectResult }: SearchProps) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSelectResult = (indice: Indice) => {
        onSelectResult(indice);
    };

    return (
        <Command
            shouldFilter={false}
            className="h-auto rounded-lg border border-b-0 shadow-md"
        >
            <CommandInput
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Search for indice"
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
    } = useGetIndicesQuery({
        pagination: { pageIndex: 0, pageSize: 10 },
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

            {data?.map(({ id, nombre, porcentaje }) => {
                return (
                    <CommandItem
                        key={id}
                        onSelect={() => onSelectResult({ id, nombre, porcentaje })}
                        value={nombre}
                    >
                        <Check
                            className={cn(
                                'mr-2 h-4 w-4',
                                selectedResult?.id === id ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                        {nombre} - {porcentaje}%
                    </CommandItem>
                );
            })}
        </CommandList>
    );

}

const POPOVER_WIDTH = 'w-[250px]';

export function IndiceSelector({ indice, onChange }: { indice?: Indice, onChange?: (cliente: Indice) => void }) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Pick<Indice, 'id' | 'nombre' | 'porcentaje'> | undefined>(indice);
    const handleSetActive = React.useCallback((indice: Indice) => {
        setSelected(indice);
        if (onChange) {
            onChange(indice)
        }
        setOpen(false);
    }, []);

    const displayName = selected ? `${selected.nombre} - ${selected.porcentaje}%` : 'Seleccione Indice';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn('justify-between ',)}
                >
                    {displayName}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Search selectedResult={selected} onSelectResult={handleSetActive} />
            </PopoverContent>
        </Popover>
    );
}
