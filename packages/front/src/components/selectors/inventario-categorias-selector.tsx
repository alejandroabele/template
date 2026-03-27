import React from "react";
import { useGetInventarioCategoriasQuery } from "@/hooks/inventario-categoria";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectGroup,
} from "@/components/ui/select";
import { MAX_LIMIT } from "@/constants/query";
import { Button } from '@/components/ui/button'

type InventarioCategoriasSelectorProps = {
    value?: string; // Ajusta a string porque el formulario usará strings
    onChange: (value: string) => void;
    inventarioFamiliaId?: string | number
};

export const InventarioCategoriasSelector = ({ value = "", onChange, inventarioFamiliaId }: InventarioCategoriasSelectorProps) => {
    const { data, isLoading } = useGetInventarioCategoriasQuery({
        pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
        columnFilters: inventarioFamiliaId
            ? [{ id: 'inventarioFamiliaId', value: inventarioFamiliaId }]
            : [],
        globalFilter: "",
        sorting: [],
    });



    return (

        <Select value={`${value}`} onValueChange={onChange}
            disabled={!inventarioFamiliaId}

        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona una categoría"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
                    <Button
                        className="w-full text-primary"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onChange(''); // Borra la selección
                        }}
                    >
                        BORRAR SELECCIÓN
                    </Button>

                    {data &&
                        data.map((categoria) => (
                            <SelectItem key={categoria.id} value={`${categoria.id}`}>
                                {categoria.nombre}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
