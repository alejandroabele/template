import React from "react";
import { useGetCategoriasQuery } from "@/hooks/categorias";
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

type CategoriasSelectorProps = {
    value?: string; // Ajusta a string porque el formulario usará strings
    onChange: (value: string) => void;
};

export const CategoriasSelector = ({ value = "", onChange }: CategoriasSelectorProps) => {
    const { data, isLoading } = useGetCategoriasQuery({
        pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
        columnFilters: [],
        globalFilter: "",
        sorting: [],
    });



    return (

        <Select value={`${value}`} onValueChange={onChange} >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona una familia"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Familias</SelectLabel>
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
