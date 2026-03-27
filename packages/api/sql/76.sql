-- Agregar campo persona_responsable_id a jornada_equipamiento
ALTER TABLE `jornada_equipamiento`
ADD COLUMN `persona_responsable_id` INT NULL AFTER `equipamiento_id`,
ADD CONSTRAINT `FK_jornada_equipamiento_persona_responsable`
  FOREIGN KEY (`persona_responsable_id`)
  REFERENCES `persona`(`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Crear índice para mejorar consultas
CREATE INDEX `IDX_jornada_equipamiento_persona_responsable` ON `jornada_equipamiento`(`persona_responsable_id`);
