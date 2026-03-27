"use client";

import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { OrdenCompraItem } from "@/types";
import { columns, ExpandedRowComponent } from "./columns";

interface OrdenCompraItemsTableProps {
  items?: OrdenCompraItem[];
  onEditItem: (item: OrdenCompraItem) => void;
  showEditButton?: boolean;
}

export function OrdenCompraItemsTable({
  items = [],
  onEditItem,
  showEditButton = false,
}: OrdenCompraItemsTableProps) {
  const [expanded, setExpanded] = React.useState({});

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    state: {
      expanded,
    },
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      toolbar
      pagination={false}
      renderSubComponent={(row: OrdenCompraItem) => (
        <ExpandedRowComponent
          item={row}
          onEditItem={onEditItem}
          showEditButton={showEditButton}
        />
      )}
    />
  );
}
