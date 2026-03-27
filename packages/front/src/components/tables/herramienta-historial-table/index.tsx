"use client";

import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useHistorialHerramienta } from "@/hooks/herramienta";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

type Props = {
    herramientaId: number;
};

export function HerramientaHistorialTable({ herramientaId }: Props) {
    const { data = [], isLoading } = useHistorialHerramienta(herramientaId);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isLoading) return <SkeletonTable />;

    return <DataTable table={table} columns={columns} toolbar={true} />;
}
