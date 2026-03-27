import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useGetInventarioSubcategoriasQuery } from '@/hooks/inventario-subcategoria';
import React from 'react';

interface Props {
    onChange: (value: string) => void;
    value: string;
    disabled?: boolean;
    inventarioCategoriaId?: number | null;
}

export const InventarioSubcategoriasSelector: React.FC<Props> = ({
    onChange,
    value,
    disabled,
    inventarioCategoriaId
}) => {
    const { data, isLoading } = useGetInventarioSubcategoriasQuery({
        pagination: {
            pageIndex: 0,
            pageSize: 100
        },
        columnFilters: inventarioCategoriaId ? [
            { id: 'inventarioCategoriaId', value: inventarioCategoriaId }
        ] : [],
        sorting: [],
        globalFilter: ''
    });

    return (
        <Select 
            value={`${value}`} 
            onValueChange={onChange}
            disabled={!inventarioCategoriaId || disabled}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona una subcategoría"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Subcategorías</SelectLabel>
                    <Button
                        className="w-full text-primary"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onChange('');
                        }}
                    >
                        BORRAR SELECCIÓN
                    </Button>
                    {data &&
                        data.map((subcategoria) => (
                            <SelectItem key={subcategoria.id} value={`${subcategoria.id}`}>
                                {subcategoria.nombre}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
