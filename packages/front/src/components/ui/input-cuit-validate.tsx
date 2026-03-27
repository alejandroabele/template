"use client";

import * as React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCuitValidation } from "@/hooks/afip";
import { PadronData } from "@/types";

export interface InputCuitValidateProps extends Omit<React.ComponentProps<"input">, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onInputValidate?: (data: PadronData) => void;
}

const InputCuitValidate = React.forwardRef<HTMLInputElement, InputCuitValidateProps>(
  ({ className, value = "", onChange, onInputValidate, ...props }, ref) => {
    const { 
      data, 
      isLoading, 
      isError, 
      validateCuit,
      resetValidation
    } = useCuitValidation();

    const handleValidate = () => {
      if (value && value.length >= 11) {
        validateCuit(value);
      }
    };

    React.useEffect(() => {
      if (data && onInputValidate) {
        onInputValidate(data);
        resetValidation(); // Reset query state
      }
    }, [data, onInputValidate, resetValidation]);

    React.useEffect(() => {
      if (isError) {
        resetValidation(); // Reset query state on error
      }
    }, [isError, resetValidation]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <div className="relative">
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleInputChange}
          placeholder="Ingrese CUIT (11 dígitos)"
          maxLength={11}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8 w-8 p-0"
          onClick={handleValidate}
          disabled={isLoading || !value || value.length < 11}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
        {isError && (
          <p className="text-sm text-destructive mt-1">
            Error al validar CUIT. Verifique el número ingresado.
          </p>
        )}
      </div>
    );
  }
);

InputCuitValidate.displayName = "InputCuitValidate";

export { InputCuitValidate };
