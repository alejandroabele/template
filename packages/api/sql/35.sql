ALTER TABLE `pintegralco`.`inventario` 
CHANGE COLUMN `descripcion` `descripcion` VARCHAR(255) COLLATE 'utf8mb3_spanish_ci' NULL DEFAULT NULL ;


SET SQL_SAFE_UPDATES = 0;
UPDATE inventario
SET deleted_at = NOW(),
deleted_by = 75

ALTER TABLE `pintegralco`.`inventario` 
CHANGE COLUMN `descripcion` `descripcion` VARCHAR(255) COLLATE 'utf8mb3_spanish_ci' NULL DEFAULT NULL ;
