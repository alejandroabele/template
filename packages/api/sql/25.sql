ALTER TABLE `pintegralco`.`presupuesto_h` 
CHANGE COLUMN `materiales_comision` `materiales_comision` VARCHAR(50) NOT NULL DEFAULT '0' ;

ALTER TABLE `pintegralco`.`presupuesto_h` 
CHANGE COLUMN `suministros_comision` `suministros_comision` VARCHAR(50) NOT NULL DEFAULT '0' ;

ALTER TABLE `pintegralco`.`presupuesto_h` 
CHANGE COLUMN `manodeobra_comision` `manodeobra_comision` VARCHAR(50) NOT NULL DEFAULT '0' ;
