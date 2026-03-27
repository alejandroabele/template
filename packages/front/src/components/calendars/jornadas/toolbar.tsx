"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ToolbarProps {
  presupuestoId?: number;
  onAgregarJornada?: () => void;
}

export function Toolbar({ onAgregarJornada }: ToolbarProps) {
  return (
    <Button onClick={onAgregarJornada} size="sm">
      <Plus className="h-4 w-4 mr-2" />
      Crear Planificación
    </Button>
  );
}
