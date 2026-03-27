// import React from "react";
// import { useGetUnidadMedidasQuery } from "@/hooks/unidad-medida";
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectItem,
//     SelectLabel,
//     SelectGroup,
// } from "@/components/ui/select";
// import { MAX_LIMIT } from "@/constants/query";
// import { Button } from '@/components/ui/button'

// type UnidadesMedidaSelectorProps = {
//     value?: string; // Ajusta a string porque el formulario usará strings
//     onChange: (value: string) => void;
// };

// export const UnidadesMedidaSelector = ({ value = "", onChange }: UnidadesMedidaSelectorProps) => {
//     const { data, isLoading } = useGetUnidadMedidasQuery({
//         pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
//         columnFilters: [],
//         globalFilter: "",
//         sorting: [],
//     });



//     return (

//         <Select value={`${value}`} onValueChange={onChange} >
//             <SelectTrigger className="w-full">
//                 <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccione un valor"} />
//             </SelectTrigger>
//             <SelectContent>
//                 <SelectGroup>
//                     <SelectLabel>Unidades</SelectLabel>
//                     <Button
//                         className="w-full text-primary"
//                         variant="ghost"
//                         size="sm"

//                         onClick={() => {
//                             onChange(''); // Borra la selección
//                         }}
//                     >
//                         BORRAR SELECCIÓN
//                     </Button>

//                     {data &&
//                         data.map((categoria) => (
//                             <SelectItem key={categoria.id} value={`${categoria.id}`}>
//                                 {categoria.nombre}
//                             </SelectItem>
//                         ))}
//                 </SelectGroup>
//             </SelectContent>
//         </Select>
//     );
// };

import React from "react"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UNIDADES } from "@/constants/inventario"
type UnidadMedidaSelectorProps = {
    value?: string
    onChange: (value: string) => void
}

export const UnidadMedidaSelector = ({ value = "", onChange }: UnidadMedidaSelectorProps) => {
    const unidades = Object.entries(UNIDADES).map(([value, label]) => ({ value, label }))


    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar unidad de medida" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Unidades disponibles</SelectLabel>
                    <Button
                        className="w-full text-primary"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange("")}
                    >
                        BORRAR SELECCIÓN
                    </Button>
                    {unidades.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
