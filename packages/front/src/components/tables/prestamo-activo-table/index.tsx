"use client";

import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { usePrestamosActivos } from "@/hooks/herramienta";
import { columns } from "./columns";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export function PrestamoActivoTable() {
    const { data = [], isLoading } = usePrestamosActivos();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (isLoading) return <SkeletonTable />;

    return <DataTable table={table} columns={columns} toolbar={true} />;
}
