"use client";

import { Suspense } from "react";
import { ComparativasOferta } from "@/components/features/comparativas-oferta";
import { useSearchParams } from "next/navigation";
import { useGetOfertasByIdsQuery } from "@/hooks/oferta";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

function CompararOfertasContent() {
  const searchParams = useSearchParams();
  const ofertasParam = searchParams.get("ofertas");
  const ofertaIds = ofertasParam
    ? ofertasParam.split(",").map((id) => parseInt(id, 10))
    : [];

  const { data: ofertas = [], isLoading } = useGetOfertasByIdsQuery(ofertaIds);

  if (isLoading) {
    return (
      <div className="container  py-6">
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="container  py-6">
      <ComparativasOferta ofertas={ofertas} />
    </div>
  );
}

export default function CompararOfertasPage() {
  return (
    <Suspense
      fallback={
        <div className="container  py-6">
          <SkeletonTable />
        </div>
      }
    >
      <CompararOfertasContent />
    </Suspense>
  );
}
