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
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, RefreshCcw, Lock } from 'lucide-react'; // Importando iconos de Lucid
import { TIPO_MOVIMIENTO } from "@/constants/inventario";

type TipoMovimientoSelectorProps = {
    value?: string;
    onChange: (value: string) => void;
};

export const TipoMovimientoSelector = ({ value = "", onChange }: TipoMovimientoSelectorProps) => {
    const data = [
        {
            value: TIPO_MOVIMIENTO.IN,
            label: 'Ingreso (IN)',
            description: 'Agregar stock al inventario',
            icon: <ArrowUp className="h-4 w-4 text-green-600" />
        },
        {
            value: TIPO_MOVIMIENTO.OUT,
            label: 'Salida (OUT)',
            description: 'Retirar stock del inventario',
            icon: <ArrowDown className="h-4 w-4 text-red-600" />
        },
        {
            value: TIPO_MOVIMIENTO.AJUSTE,
            label: 'Ajuste (AJUSTE)',
            description: 'Corregir cantidad total de stock',
            icon: <RefreshCcw className="h-4 w-4 text-orange-600" />
        },
        {
            value: TIPO_MOVIMIENTO.RESERVA,
            label: 'Reserva (RESERVA)',
            description: 'Reservar stock para uso específico',
            icon: <Lock className="h-4 w-4 text-blue-600" />
        }
    ];

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={"Seleccionar tipo de movimiento"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Tipo de Movimiento</SelectLabel>
                    {/* <Button
                        className="w-full text-primary"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange('')} // Función para borrar la selección
                    >
                        BORRAR SELECCIÓN
                    </Button> */}
                    {data.map(({ value, label, description, icon }) => (
                        <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                                {icon}
                                <div>
                                    <div className="font-medium">{label}</div>
                                    <div className="text-xs text-muted-foreground">{description}</div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
