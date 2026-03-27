-- ============================================================
-- MIGRACIÓN 95: Tabla presupuesto_item_trabajos
-- Relación muchos a muchos entre presupuesto_h y produccion_trabajos
-- para persistir la selección explícita de trabajos por ítem
-- ============================================================

CREATE TABLE `presupuesto_item_trabajos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `presupuesto_item_id` INT NOT NULL,
  `trabajo_id` INT NOT NULL,
  CONSTRAINT `fk_pit_item` FOREIGN KEY (`presupuesto_item_id`) REFERENCES `presupuesto_h` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pit_trabajo` FOREIGN KEY (`trabajo_id`) REFERENCES `produccion_trabajos` (`id`),
  UNIQUE KEY `uq_item_trabajo` (`presupuesto_item_id`, `trabajo_id`)
);

-- ============================================================
-- MIGRACIÓN 96: Poblar presupuesto_item_trabajos desde datos existentes
-- Para cada presupuesto_item que ya tiene materiales/suministros/manoDeObra
-- cargados, registrar los trabajos correspondientes
-- ============================================================

INSERT IGNORE INTO `presupuesto_item_trabajos` (`presupuesto_item_id`, `trabajo_id`)
SELECT DISTINCT `presupuestoItemId`, `trabajoId`
FROM (
  SELECT `presupuestoItemId`, `trabajoId` FROM `presupuesto_materiales` WHERE `trabajoId` IS NOT NULL AND `presupuestoItemId` IS NOT NULL
  UNION
  SELECT `presupuestoItemId`, `trabajoId` FROM `presupuesto_suministros` WHERE `trabajoId` IS NOT NULL AND `presupuestoItemId` IS NOT NULL
  UNION
  SELECT `presupuestoItemId`, `trabajoId` FROM `presupuesto_manodeobra` WHERE `trabajoId` IS NOT NULL AND `presupuestoItemId` IS NOT NULL
) AS trabajos_existentes;
