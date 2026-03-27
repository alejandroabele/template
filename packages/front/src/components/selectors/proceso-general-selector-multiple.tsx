import React from "react";
import { useGetProcesoGeneralQuery } from "@/hooks/proceso-general";
import { MAX_LIMIT } from "@/constants/query";
import { MultiSelect } from "@/components/ui/multi-select";

type ProcesoGeneralSelectorMultipleProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const ProcesoGeneralSelectorMultiple = ({
  value = [],
  onChange,
}: ProcesoGeneralSelectorMultipleProps) => {
  const { data, isLoading } = useGetProcesoGeneralQuery({
    pagination: { pageIndex: 0, pageSize: MAX_LIMIT },
    columnFilters: [],
    globalFilter: "",
    sorting: [],
  });

  const options =
    data?.map((proceso) => ({
      label: proceso.nombre,
      value: proceso.nombre,
    })) || [];

  return (
    <MultiSelect
      options={options}
      onValueChange={onChange}
      defaultValue={Array.isArray(value) ? value : []}
      placeholder={isLoading ? "Cargando..." : "Proceso..."}
      variant="inverted"
      modalPopover={true}
    />
  );
};
