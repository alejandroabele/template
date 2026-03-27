ALTER TABLE `pintegralco`.`receta_inventario` 
CHANGE COLUMN `cantidad` `cantidad` FLOAT NULL ;

ALTER TABLE `pintegralco`.`presupuesto_materiales` 
CHANGE COLUMN `cantidad` `cantidad` FLOAT NOT NULL DEFAULT '0' ;

ALTER TABLE `pintegralco`.`presupuesto_suministros` 
CHANGE COLUMN `cantidad` `cantidad` FLOAT NOT NULL DEFAULT '0' ;

ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
CHANGE COLUMN `cantidad` `cantidad` FLOAT NOT NULL DEFAULT '0' ;
