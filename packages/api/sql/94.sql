-- ============================================================
-- MIGRACIÓN 94: Agregar campo tipo a presupuesto_h
-- ============================================================

SET sql_safe_updates = 0;

-- Agregar columna tipo (nullable para compatibilidad con registros existentes)
ALTER TABLE `presupuesto_h`
  ADD COLUMN `tipo` VARCHAR(50) NULL AFTER `receta_id`;

-- ============================================================
-- MIGRACIÓN 95: OT de mantenimiento interno de recursos
-- ============================================================


-- 1. Nuevo proceso general EN_MANTENIMIENTO (ID 25)
INSERT INTO `proceso_general` (`id`, `nombre`, `color`)
VALUES (25, 'EN MANTENIMIENTO', '#0b8100');

-- 2. Nuevo trabajo de producción tipo mantenimiento
INSERT INTO `produccion_trabajos` (`nombre`, `tipo`, `color`)
VALUES ('PREVENTIVO', 'mantenimiento', '#0b8100'),
       ('CORRECTIVO', 'mantenimiento', '#EF4444');


-- 3. Asegurar que comprador sea nullable (puede ya serlo)
ALTER TABLE `presupuesto`
  MODIFY COLUMN `comprador` VARCHAR(100) NULL;
