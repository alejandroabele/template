ALTER TABLE `presupuesto_h` 
DROP FOREIGN KEY `fk_presupuesto_h_receta`;

ALTER TABLE `presupuesto_h` 
ADD CONSTRAINT `fk_presupuesto_h_receta` 
FOREIGN KEY (`receta_id`) REFERENCES `receta` (`id`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `presupuesto` 
DROP FOREIGN KEY `fk_vendedor`;

ALTER TABLE `presupuesto` 
ADD CONSTRAINT `fk_vendedor` 
FOREIGN KEY (`vendedorId`) REFERENCES `usuario` (`id`) ON DELETE RESTRICT;
