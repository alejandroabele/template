-- ============================================================
-- MIGRACIÓN 92: Migrar flota a alquiler_recurso
-- ============================================================

SET sql_safe_updates = 0;

-- 1. Renombrar el dato existente CAMIONES → FLOTA
UPDATE `alquiler_recurso` SET `tipo` = 'FLOTA' WHERE `tipo` = 'CAMIONES';

-- 2. Modificar el enum para reemplazar CAMIONES por FLOTA
ALTER TABLE `alquiler_recurso`
  MODIFY COLUMN `tipo` VARCHAR(255) NOT NULL;

-- 3. Agregar columna recurso_id en flota (nullable primero) con FK
ALTER TABLE `flota`
  ADD COLUMN `recurso_id` INT NULL AFTER `nombre`,
  ADD CONSTRAINT `FK_flota_recurso`
    FOREIGN KEY (`recurso_id`) REFERENCES `alquiler_recurso`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX `IDX_flota_recurso_id` ON `flota`(`recurso_id`);

-- 4. Crear un registro en alquiler_recurso por cada flota (usando nombre como código)
--    Usamos un bloque procedural para mapear IDs uno a uno
DROP PROCEDURE IF EXISTS `migrar_flota_a_recurso`;

DELIMITER $$

CREATE PROCEDURE `migrar_flota_a_recurso`()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_id INT;
  DECLARE v_nombre VARCHAR(255);
  DECLARE v_recurso_id INT;

  DECLARE cur CURSOR FOR SELECT `id`, `nombre` FROM `flota` WHERE `recurso_id` IS NULL;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO v_id, v_nombre;
    IF done THEN
      LEAVE read_loop;
    END IF;

    INSERT INTO `alquiler_recurso` (`codigo`, `tipo`)
    VALUES (v_nombre, 'FLOTA');

    SET v_recurso_id = LAST_INSERT_ID();

    UPDATE `flota` SET `recurso_id` = v_recurso_id WHERE `id` = v_id;
  END LOOP;

  CLOSE cur;
END$$

DELIMITER ;

CALL `migrar_flota_a_recurso`();
DROP PROCEDURE IF EXISTS `migrar_flota_a_recurso`;

-- 5. Hacer recurso_id NOT NULL una vez poblado
ALTER TABLE `flota`
  MODIFY COLUMN `recurso_id` INT NOT NULL;

-- 6. Eliminar columna nombre de flota
ALTER TABLE `flota`
  DROP COLUMN `nombre`;
