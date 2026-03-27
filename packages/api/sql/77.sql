-- Migración: Cambiar relación trabajo de jornada a persona
-- Fecha: 2026-02-09

-- 1. Agregar columna produccion_trabajo_id a la tabla jornada_persona
ALTER TABLE `jornada_persona` 
ADD COLUMN `produccion_trabajo_id` INT NULL AFTER `persona_id`,
ADD CONSTRAINT `FK_jornada_persona_trabajo` FOREIGN KEY (`produccion_trabajo_id`) REFERENCES `produccion_trabajos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. Crear índice para mejorar performance
CREATE INDEX `IDX_jornada_persona_trabajo` ON `jornada_persona`(`produccion_trabajo_id`);

-- 3. Migrar datos existentes (si hay jornadas con trabajo asignado, asignar ese trabajo a todas las personas de la jornada)
UPDATE `jornada_persona` jp
INNER JOIN `jornada` j ON jp.`jornada_id` = j.`id`
SET jp.`produccion_trabajo_id` = j.`produccion_trabajo_id`
WHERE j.`produccion_trabajo_id` IS NOT NULL;

-- 4. Agregar columna tipo a la tabla jornada
ALTER TABLE `jornada`
ADD COLUMN `tipo` VARCHAR(50) NULL DEFAULT 'producto' AFTER `presupuesto_id`;

-- 5. Eliminar columna produccion_trabajo_id de la tabla jornada
ALTER TABLE `jornada` DROP COLUMN `produccion_trabajo_id`;
