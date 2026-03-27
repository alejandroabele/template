-- Migración: 78.sql
-- Agregar campos específicos por tipo de equipamiento

-- Agregar nuevos campos a tabla equipamiento
ALTER TABLE `equipamiento` ADD COLUMN `vin` VARCHAR(100) NULL AFTER `numero_serie`;
ALTER TABLE `equipamiento` ADD COLUMN `hs_marcha` VARCHAR(100) NULL AFTER `horas_uso`;
ALTER TABLE `equipamiento` ADD COLUMN `capacidad_izaje` VARCHAR(100) NULL AFTER `capacidad_kg`;
ALTER TABLE `equipamiento` ADD COLUMN `cantidad_ejes` VARCHAR(100) NULL AFTER `capacidad_izaje`;
ALTER TABLE `equipamiento` ADD COLUMN `cantidad_auxilio` VARCHAR(100) NULL AFTER `cantidad_ejes`;

-- Índices en campos frecuentemente consultados
CREATE INDEX `IDX_equipamiento_vin` ON `equipamiento`(`vin`);
CREATE INDEX `IDX_equipamiento_patente` ON `equipamiento`(`patente`);
