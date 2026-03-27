import React from "react";
import { useGetCuentasContablesQuery } from "@/hooks/cuenta-contable";
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

type CuentaContableSelectorProps = {
    value?: string;
    onChange: (value: string) => void;
};

export const CuentaContableSelector = ({ value = "", onChange }: CuentaContableSelectorProps) => {
    const { data, isLoading } = useGetCuentasContablesQuery({
        pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
        columnFilters: [],
        globalFilter: "",
        sorting: [],
    });

    return (
        <Select value={`${value}`} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona una cuenta contable"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Cuentas Contables</SelectLabel>
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
                        data.map((cuenta) => (
                            <SelectItem key={cuenta.id} value={`${cuenta.id}`}>
                                {cuenta.codigo} - {cuenta.descripcion}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
