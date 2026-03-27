import React from "react";
import { useGetPresupuestoItemsQuery } from "@/hooks/presupuesto-item";
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

type PresupuestoItemSelectorProps = {
    value?: string; // Ajusta a string porque el formulario usará strings
    onChange: (value: string) => void;
    presupuestoId?: number | undefined
    disabled?: boolean
};

export const PresupuestoItemSelector = ({ value = "", onChange, presupuestoId, disabled }: PresupuestoItemSelectorProps) => {

    const columnFilters = presupuestoId ? [{
        id: 'presupuestoId', value: presupuestoId
    }] : []

    const { data, isLoading } = useGetPresupuestoItemsQuery({
        pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
        columnFilters,
        globalFilter: "",
        sorting: [],
    });



    return (

        <Select value={`${value}`} onValueChange={onChange} disabled={disabled} >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona un item"} />
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
                                N° {categoria.id} - {categoria.descripcion}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
