import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { getPadron } from "@/services/afip";
import { PadronData } from "@/types";

export const useGetPadron = (cuit: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["afip-padron", cuit],
    queryFn: () => getPadron(cuit),
    enabled: enabled && !!cuit,
    retry: false,
  });
};

export const useCuitValidation = () => {
  const [cuitToValidate, setCuitToValidate] = useState<string>("");
  const [shouldValidate, setShouldValidate] = useState(false);

  const { data, isLoading, isError, error } = useGetPadron(
    cuitToValidate,
    shouldValidate
  );

  const validateCuit = useCallback((cuit: string) => {
    if (cuit && cuit.length >= 11) {
      setCuitToValidate(cuit);
      setShouldValidate(true);
    }
  }, []);

  const resetValidation = useCallback(() => {
    setShouldValidate(false);
  }, []);

  return {
    data,
    isLoading,
    isError,
    error,
    validateCuit,
    resetValidation,
  };
};
