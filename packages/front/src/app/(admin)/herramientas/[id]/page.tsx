"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { PageTitle } from "@/components/ui/page-title";
import { useHerramienta } from "@/hooks/herramienta";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { CellColumn } from "@/components/ui/cell-column";
import { Button } from "@/components/ui/button";
import { HerramientaPrestarDialog } from "@/components/dialogs/herramienta-prestamo-dialog";
import { HerramientasDevolverDialog } from "@/components/dialogs/herramienta-devolucion-dialog";
import { HerramientaHistorialTable } from "@/components/tables/herramienta-historial-table";

const columnasPrestamoActivo: ColumnDef<any>[] = [
    {
        id: "persona",
        header: "Persona",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const persona = row.original.persona;
            return <CellColumn>{persona ? `${persona.nombre} ${persona.apellido}` : "-"}</CellColumn>;
        },
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad prestada",
        enableColumnFilter: false,
        cell: ({ row }) => <CellColumn>{row.getValue("cantidad")}</CellColumn>,
    },
    {
        accessorKey: "fechaPrestamo",
        header: "Desde",
        enableColumnFilter: false,
        cell: ({ row }) => {
            const fecha = row.getValue("fechaPrestamo") as string;
            return <CellColumn>{fecha ? new Date(fecha).toLocaleDateString("es-AR") : "-"}</CellColumn>;
        },
    },
    {
        id: "acciones",
        cell: ({ row }) => <AccionesPrestamoActivo prestamo={row.original} />,
    },
];

function AccionesPrestamoActivo({ prestamo }: { prestamo: any }) {
    const [open, setOpen] = useState(false);
    const personaNombre = prestamo.persona
        ? `${prestamo.persona.nombre} ${prestamo.persona.apellido}`
        : "";

    return (
        <>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                Registrar devolución
            </Button>
            <HerramientasDevolverDialog
                herramienta={prestamo.herramientaConPrestadas ?? { id: prestamo.productoId }}
                open={open}
                onClose={() => setOpen(false)}
                prestamo={{
                    personaId: prestamo.persona?.id,
                    personaNombre,
                    cantidad: Number(prestamo.cantidad),
                }}
            />
        </>
    );
}

export default function Page() {
    const params = useParams();
    const id = Number(params.id);

    const [openPrestar, setOpenPrestar] = useState(false);

    const { data: herramienta, isLoading } = useHerramienta(id);

    const prestadas = useMemo(
        () => (herramienta?.prestamosActivos ?? []).reduce((acc: number, p: any) => acc + Number(p.cantidad), 0),
        [herramienta?.prestamosActivos]
    );
    const herramientaConPrestadas = useMemo(
        () => herramienta ? { ...herramienta, prestadas } : undefined,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [herramienta?.id, prestadas]
    );
    const prestamosConHerramienta = useMemo(
        () => (herramienta?.prestamosActivos ?? []).map((p: any) => ({
            ...p,
            productoId: id,
            herramientaConPrestadas,
        })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [herramienta?.prestamosActivos, herramientaConPrestadas]
    );

    const tablePrestamos = useReactTable({
        data: prestamosConHerramienta,
        columns: columnasPrestamoActivo,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <SkeletonTable />;

    const disponibles = Number(herramienta?.stock ?? 0) - prestadas;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageTitle title={herramienta?.nombre ?? "Herramienta"} />
                <Button onClick={() => setOpenPrestar(true)}>Prestar</Button>
            </div>

            {herramientaConPrestadas && (
                <HerramientaPrestarDialog
                    herramienta={herramientaConPrestadas}
                    open={openPrestar}
                    onClose={() => setOpenPrestar(false)}
                />
            )}

            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="rounded border p-4">
                    <div className="text-muted-foreground">Stock total</div>
                    <div className="text-2xl font-semibold">{herramienta?.stock} {herramienta?.unidadMedida}</div>
                </div>
                <div className="rounded border p-4">
                    <div className="text-muted-foreground">Disponibles</div>
                    <div className="text-2xl font-semibold">{disponibles}</div>
                </div>
                <div className="rounded border p-4">
                    <div className="text-muted-foreground">Prestadas</div>
                    <div className="text-2xl font-semibold">{prestadas}</div>
                </div>
            </div>

            <div>
                <h2 className="mb-2 text-lg font-semibold">Préstamos activos</h2>
                {prestamosConHerramienta.length === 0
                    ? <p className="text-muted-foreground text-sm">No hay préstamos activos.</p>
                    : <DataTable table={tablePrestamos} columns={columnasPrestamoActivo} toolbar={true} />
                }
            </div>

            <div>
                <h2 className="mb-2 text-lg font-semibold">Historial</h2>
                <HerramientaHistorialTable herramientaId={id} />
            </div>
        </div>
    );
}
