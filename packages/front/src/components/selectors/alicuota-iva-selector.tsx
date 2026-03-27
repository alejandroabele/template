"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AlicuotaIvaSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AlicuotaIvaSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Seleccionar alícuota",
}: AlicuotaIvaSelectorProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="21">21%</SelectItem>
        <SelectItem value="10.5">10.5%</SelectItem>
        <SelectItem value="0">0% (Exento)</SelectItem>
      </SelectContent>
    </Select>
  );
}
