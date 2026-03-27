import React from "react";
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

type PeriodicidadActualizacionProps = {
    value?: string; // Ajusta a string porque el formulario usará strings
    onChange: (value: string) => void;
};

export const PeriodicidadActualizacion = ({ value = "", onChange }: PeriodicidadActualizacionProps) => {
    const data = [
        { value: '1', label: 'MENSUAL' },
        { value: '3', label: 'TRIMESTRAL' },
        { value: '6', label: 'SEMESTRAL' },
        { value: '12', label: 'ANUAL' }
    ];

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={"Seleccionar periodicidad"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Seleccione la periodicidad de actualización de precios</SelectLabel>
                    <Button
                        className="w-full text-primary"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange('')} // Función para borrar la selección
                    >
                        BORRAR SELECCIÓN
                    </Button>
                    {data.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
