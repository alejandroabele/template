-- Migración 83: Aumentar tamaño de columna descripcion en cashflow_transaccion
-- Fecha: 2026-02-20
-- Motivo: Soportar descripciones largas en cobros masivos con múltiples facturas

ALTER TABLE cashflow_transaccion
MODIFY COLUMN descripcion TEXT NULL;
