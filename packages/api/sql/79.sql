-- Agregar campo tna (Tasa Nominal Anual) a la tabla banco

ALTER TABLE `banco`
ADD COLUMN `tna` VARCHAR(100) NULL AFTER `incluir_en_total`;
