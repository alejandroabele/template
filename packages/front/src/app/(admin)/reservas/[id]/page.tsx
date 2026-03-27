"use client";

import { useGetReservaByIdQuery } from "@/hooks/reserva";
import { PageTitle } from "@/components/ui/page-title";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { useParams } from "next/navigation";
import ReservaForm from "@/components/forms/reserva-form";

export default function ReservaDetallePage() {
    const params = useParams();
    const id = Number(params.id);
    const { data: reserva, isLoading } = useGetReservaByIdQuery(id);

    if (isLoading) {
        return <SkeletonChart />
    }


    return (
        <>
            <PageTitle title="Detalle de Reserva" />
            <ReservaForm data={reserva} />
        </>
    );
}
