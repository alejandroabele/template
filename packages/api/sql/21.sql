ALTER TABLE `pintegralco`.`inventario` 
CHANGE COLUMN `punit` `punit` FLOAT NOT NULL ;

ALTER TABLE `presupuesto_manodeobra`
DROP FOREIGN KEY `fk_presupuesto_manodeobra_inventario`;
ALTER TABLE `presupuesto_manodeobra`
ADD CONSTRAINT `fk_presupuesto_manodeobra_inventario`
FOREIGN KEY (`inventarioId`) REFERENCES `inventario` (`inventarioId`)
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE `presupuesto_materiales`
DROP FOREIGN KEY `fk_presupuesto_materiales_inventario`;
ALTER TABLE `presupuesto_materiales`
ADD CONSTRAINT `fk_presupuesto_materiales_inventario`
FOREIGN KEY (`inventarioId`) REFERENCES `inventario` (`inventarioId`)
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE `presupuesto_suministros`
DROP FOREIGN KEY `fk_presupuesto_suministros_inventario`;
ALTER TABLE `presupuesto_suministros`
ADD CONSTRAINT `fk_presupuesto_suministros_inventario`
FOREIGN KEY (`inventarioId`) REFERENCES `inventario` (`inventarioId`)
ON DELETE RESTRICT
ON UPDATE CASCADE;



