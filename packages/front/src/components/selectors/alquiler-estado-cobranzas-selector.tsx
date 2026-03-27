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
import { Button } from '@/components/ui/button'

type CategoriasSelectorProps = {
    value?: string; // Ajusta a string porque el formulario usará strings
    onChange: (value: string) => void;
};


export const AlquilerEstadoCobranzasSelector = ({ value = "", onChange }: CategoriasSelectorProps) => {
    const data = ['PENDIENTE', 'COBRADO']

    return (

        <Select value={`${value}`} onValueChange={onChange} >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={"Seleccionar"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Estado</SelectLabel>
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
                        data.map((estado) => (
                            <SelectItem key={estado} value={`${estado}`}>
                                {estado}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
