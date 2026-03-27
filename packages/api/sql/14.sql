ALTER TABLE `pintegralco`.`presupuesto_h` 
DROP FOREIGN KEY `fk_presupuesto_h_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto_h` 
ADD CONSTRAINT `fk_presupuesto_h_presupuesto`
  FOREIGN KEY (`presupuestoId`)
  REFERENCES `pintegralco`.`presupuesto` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

  ALTER TABLE `pintegralco`.`presupuesto_facturacion` 
DROP FOREIGN KEY `fk_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto_facturacion` 
ADD CONSTRAINT `fk_presupuesto`
  FOREIGN KEY (`presupuesto_id`)
  REFERENCES `pintegralco`.`presupuesto` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


ALTER TABLE `pintegralco`.`presupuesto_cobro` 
DROP FOREIGN KEY `fk_presupuesto_cobro`;
ALTER TABLE `pintegralco`.`presupuesto_cobro` 
ADD CONSTRAINT `fk_presupuesto_cobro`
  FOREIGN KEY (`presupuesto_id`)
  REFERENCES `pintegralco`.`presupuesto` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `pintegralco`.`presupuesto_h_trabajos` 
DROP FOREIGN KEY `fk_presupuesto_h_trabajos_trabajo`;
ALTER TABLE `pintegralco`.`presupuesto_h_trabajos` 
ADD CONSTRAINT `fk_presupuesto_h_trabajos_trabajo`
  FOREIGN KEY (`trabajoId`)
  REFERENCES `pintegralco`.`produccion_trabajos` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `pintegralco`.`presupuesto_h_trabajos_imagen` 
DROP FOREIGN KEY `fk_presupuesto_h_trabajos_imagen`;
ALTER TABLE `pintegralco`.`presupuesto_h_trabajos_imagen` 
ADD CONSTRAINT `fk_presupuesto_h_trabajos_imagen`
  FOREIGN KEY (`presupuesto_h_trabajos_id`)
  REFERENCES `pintegralco`.`presupuesto_h_trabajos` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

DELETE FROM presupuesto_leido
WHERE presupuesto_id IS NOT NULL
AND presupuesto_id NOT IN (SELECT id FROM presupuesto);

ALTER TABLE presupuesto_leido
ADD CONSTRAINT fk_presupuesto_leido
FOREIGN KEY (presupuesto_id) REFERENCES presupuesto(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE presupuesto_manodeobra
DROP FOREIGN KEY fk_presupuesto_manodeobra_presupuestoh;

ALTER TABLE presupuesto_manodeobra
ADD CONSTRAINT fk_presupuesto_manodeobra_presupuestoh
FOREIGN KEY (presupuestoItemId) REFERENCES presupuesto_h(id) 
ON DELETE CASCADE
ON UPDATE CASCADE;


ALTER TABLE presupuesto_materiales
DROP FOREIGN KEY fk_presupuesto_materiales_presupuestoh;

ALTER TABLE presupuesto_materiales
ADD CONSTRAINT fk_presupuesto_materiales_presupuestoh
FOREIGN KEY (presupuestoItemId) REFERENCES presupuesto_h(id) 
ON DELETE CASCADE
ON UPDATE CASCADE;

DROP TABLE `pintegralco`.`presupuesto_proceso_general`;

ALTER TABLE `pintegralco`.`presupuesto_produccion` 
DROP FOREIGN KEY `fk_presupuesto_produccion_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto_produccion` 
ADD CONSTRAINT `fk_presupuesto_produccion_presupuesto`
  FOREIGN KEY (`presupuestoId`)
  REFERENCES `pintegralco`.`presupuesto` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE presupuesto_suministros
DROP FOREIGN KEY fk_presupuesto_suministros_presupuestoh;

ALTER TABLE presupuesto_suministros
ADD CONSTRAINT fk_presupuesto_suministros_presupuestoh
FOREIGN KEY (presupuestoItemId) REFERENCES presupuesto_h(id) 
ON DELETE CASCADE
ON UPDATE CASCADE;


DELETE FROM mensaje
WHERE presupuestoId IS NOT NULL
AND presupuestoId NOT IN (SELECT id FROM presupuesto);

DELETE FROM notificacion
WHERE presupuestoId IS NOT NULL
AND presupuestoId NOT IN (SELECT id FROM presupuesto);

ALTER TABLE notificacion
ADD CONSTRAINT fk_presupuesto_notificacion
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `pintegralco`.`orden` 
DROP FOREIGN KEY `fk_presupuesto_orden`,
DROP FOREIGN KEY `fk_cliente_orden`;

ALTER TABLE `pintegralco`.`presupuesto` 
DROP FOREIGN KEY `fk_orden_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto` 
DROP INDEX `fk_orden_presupuesto` ;

ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
DROP FOREIGN KEY `fk_presupuesto_manodeobra_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
DROP INDEX `presupuestoId` ;

ALTER TABLE `pintegralco`.`presupuesto_materiales` 
DROP FOREIGN KEY `fk_presupuesto_materiales_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto_materiales` 
DROP INDEX `presupuestoId` ;

ALTER TABLE `pintegralco`.`presupuesto_suministros` 
DROP FOREIGN KEY `fk_presupuesto_suministros_presupuesto`;
ALTER TABLE `pintegralco`.`presupuesto_suministros` 
DROP INDEX `presupuestoId` ;

ALTER TABLE `pintegralco`.`presupuesto_h_conceptos` 
DROP FOREIGN KEY `fk_presupuesto_h_conceptos_presupuesto`,
DROP FOREIGN KEY `fk_presupuesto_h_conceptos_presupuesto_h`;
ALTER TABLE `pintegralco`.`presupuesto_h_conceptos` 
ADD CONSTRAINT `fk_presupuesto_h_conceptos_presupuesto`
  FOREIGN KEY (`presupuestoId`)
  REFERENCES `pintegralco`.`presupuesto` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_presupuesto_h_conceptos_presupuesto_h`
  FOREIGN KEY (`presupuestohId`)
  REFERENCES `pintegralco`.`presupuesto_h` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `pintegralco`.`presupuesto_trabajocampo` 
DROP FOREIGN KEY `fk_presupuesto_trabajocampo_presupuesto`,
DROP FOREIGN KEY `fk_presupuesto_trabajocampo_presupuestoh`;
ALTER TABLE `pintegralco`.`presupuesto_trabajocampo` 
ADD CONSTRAINT `fk_presupuesto_trabajocampo_presupuesto`
  FOREIGN KEY (`presupuestoId`)
  REFERENCES `pintegralco`.`presupuesto` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_presupuesto_trabajocampo_presupuestoh`
  FOREIGN KEY (`presupuestohId`)
  REFERENCES `pintegralco`.`presupuesto_h` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;



