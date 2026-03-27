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
import { Button } from "@/components/ui/button";
import { CONDICION_IVA } from "@/constants/condicion-iva";

type CondicionIVASelectorProps = {
    value?: string;
    onChange: (value: string) => void;
};

export const CondicionIVASelector = ({ value = "", onChange }: CondicionIVASelectorProps) => {
    const data = Object.entries(CONDICION_IVA).map(([value, label]) => ({ value, label }));

    return (

        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar condición frente al IVA" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Seleccione la condición frente al IVA</SelectLabel>
                    <Button
                        className="w-full text-primary"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange("")}
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
