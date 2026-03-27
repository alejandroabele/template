-- ============================================================
-- MIGRACIÓN 88: Simplificar equipamiento → flota
-- ============================================================

SET sql_safe_updates = 0;

-- 1.1 Renombrar tabla equipamiento → flota
RENAME TABLE `equipamiento` TO `flota`;

-- 1.2 Agregar columna tipo ENUM y poblarla desde equipamiento_tipo
ALTER TABLE `flota`
  ADD COLUMN `tipo` ENUM('pickup','camion','auto') NULL AFTER `nombre`;

UPDATE `flota` f
JOIN `equipamiento_tipo` et ON et.`id` = f.`tipo_id`
SET f.`tipo` = CASE et.`codigo`
  WHEN 'camioneta' THEN 'pickup'
  WHEN 'camion'    THEN 'camion'
  WHEN 'auto'      THEN 'auto'
END
WHERE et.`codigo` IN ('camioneta', 'camion', 'auto');

-- Registros con tipo grua/bomba quedan con tipo NULL — se pueden eliminar o dejar
DELETE FROM `flota` WHERE `tipo` IS NULL;

ALTER TABLE `flota` MODIFY COLUMN `tipo` ENUM('pickup','camion','auto') NOT NULL;

-- 1.3 Eliminar columnas que ya no van y la FK a equipamiento_tipo
ALTER TABLE `flota`
  DROP FOREIGN KEY `FK_equipamiento_tipo`,
  DROP COLUMN `tipo_id`,
  DROP COLUMN `numero_serie`,
  DROP COLUMN `horas_uso`,
  DROP COLUMN `hs_marcha`,
  DROP COLUMN `capacidad_izaje`,
  DROP COLUMN `litros`,
  DROP COLUMN `presion_bar`;

-- 1.4 Agregar flota_id en jornada_equipamiento
ALTER TABLE `jornada_equipamiento`
  DROP FOREIGN KEY `FK_jornada_equipamiento_equipamiento`;

ALTER TABLE `jornada_equipamiento`
  ADD COLUMN `flota_id` INT NULL AFTER `equipamiento_id`,
  MODIFY COLUMN `equipamiento_id` INT NULL DEFAULT NULL,
  ADD CONSTRAINT `FK_jornada_equipamiento_flota` FOREIGN KEY (`flota_id`) REFERENCES `flota`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX `IDX_jornada_equipamiento_flota_id` ON `jornada_equipamiento`(`flota_id`);

-- Poblar flota_id (mismo ID, tabla fue renombrada)
UPDATE `jornada_equipamiento`
SET `flota_id` = `equipamiento_id`
WHERE `equipamiento_id` IS NOT NULL;

-- 1.5 Actualizar archivos: modelo 'equipamiento' → 'flota'
UPDATE `archivo` SET `modelo` = 'flota' WHERE `modelo` = 'equipamiento';

-- 1.6 Renombrar permisos de equipamiento → flota (preserva asignaciones de roles)
UPDATE `permissions` SET `codigo` = 'FLOTA_VER',      `descripcion` = 'Ver vehículos de flota',      `modulo` = 'flota'  WHERE `codigo` = 'EQUIPAMIENTO_VER';
UPDATE `permissions` SET `codigo` = 'FLOTA_CREAR',    `descripcion` = 'Crear vehículos de flota',    `modulo` = 'flota'  WHERE `codigo` = 'EQUIPAMIENTO_CREAR';
UPDATE `permissions` SET `codigo` = 'FLOTA_EDITAR',   `descripcion` = 'Editar vehículos de flota',   `modulo` = 'flota'  WHERE `codigo` = 'EQUIPAMIENTO_EDITAR';
UPDATE `permissions` SET `codigo` = 'FLOTA_ELIMINAR', `descripcion` = 'Eliminar vehículos de flota', `modulo` = 'flota'  WHERE `codigo` = 'EQUIPAMIENTO_ELIMINAR';
UPDATE `permissions` SET `codigo` = 'RUTA_FLOTA',     `descripcion` = 'Acceso a la página de flota', `modulo` = 'rutas'  WHERE `codigo` = 'RUTA_EQUIPAMIENTO';
-- Insertar los que no existían como EQUIPAMIENTO_* (fallback)
INSERT IGNORE INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
  ('FLOTA_VER',     'Ver vehículos de flota',      'flota'),
  ('FLOTA_CREAR',   'Crear vehículos de flota',    'flota'),
  ('FLOTA_EDITAR',  'Editar vehículos de flota',   'flota'),
  ('FLOTA_ELIMINAR','Eliminar vehículos de flota', 'flota'),
  ('RUTA_FLOTA',    'Acceso a la página de flota', 'rutas');

-- Eliminar permisos de equipamiento-tipo (ya no existe)
DELETE FROM `role_permissions` WHERE `permission_id` IN (SELECT `id` FROM `permissions` WHERE `codigo` IN ('EQUIPAMIENTO_TIPO_VER','EQUIPAMIENTO_TIPO_CREAR','EQUIPAMIENTO_TIPO_EDITAR','EQUIPAMIENTO_TIPO_ELIMINAR','RUTA_EQUIPAMIENTO_TIPO'));
DELETE FROM `permissions` WHERE `codigo` IN ('EQUIPAMIENTO_TIPO_VER','EQUIPAMIENTO_TIPO_CREAR','EQUIPAMIENTO_TIPO_EDITAR','EQUIPAMIENTO_TIPO_ELIMINAR','RUTA_EQUIPAMIENTO_TIPO');

-- 1.7 Renombrar tabla jornada_equipamiento → jornada_flota
RENAME TABLE `jornada_equipamiento` TO `jornada_flota`;
