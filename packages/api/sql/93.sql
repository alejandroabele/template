-- ============================================================
-- MIGRACIÓN 93: Vincular equipamiento a alquiler_recurso
-- ============================================================

SET sql_safe_updates = 0;

-- 1. Agregar recurso_id en equipamiento (nullable, sin migración de datos)
ALTER TABLE `equipamiento`
  ADD COLUMN `recurso_id` INT NULL AFTER `id`,
  ADD CONSTRAINT `FK_equipamiento_recurso`
    FOREIGN KEY (`recurso_id`) REFERENCES `alquiler_recurso`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX `IDX_equipamiento_recurso_id` ON `equipamiento`(`recurso_id`);

-- 2. Eliminar columna codigo de equipamiento (vive en alquiler_recurso.codigo)
ALTER TABLE `equipamiento`
  DROP COLUMN `codigo`;
