DROP TABLE `pintegralco`.`ordenh`;
DROP TABLE `pintegralco`.`ordenh_deprecated`;
DROP TABLE `pintegralco`.`viapublica_factura`;
ALTER TABLE presupuesto DROP FOREIGN KEY fk_presupuesto_viapublica;
ALTER TABLE mensaje_viapublica DROP FOREIGN KEY fk_viapublica;

DROP TABLE viapublica;
UPDATE `pintegralco`.`proceso_general` SET `color` = '#f59e0b' WHERE (`id` = '14');
UPDATE `pintegralco`.`proceso_general` SET `nombre` = 'PERDIDA/ SUSPENDIDA' WHERE (`id` = '11');

ALTER TABLE presupuesto_h_adicional 
DROP FOREIGN KEY fk_presupuesto_h_adicional_presupuesto_h;
ALTER TABLE presupuesto_h_archs 
DROP FOREIGN KEY fk_presupuesto_h_archs_presupuesto_h;

ALTER TABLE presupuesto_h_trabajos
DROP FOREIGN KEY fk_presupuesto_h_trabajos_presupuesto_h;

ALTER TABLE presupuesto_h_trabajos
DROP FOREIGN KEY fk_presupuesto_h_trabajos_presupuesto;