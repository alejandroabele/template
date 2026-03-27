-- ============================================
-- MIGRACIÓN 85: PERMISOS PANEL OPERARIO
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_PANEL_OPERARIO', 'Acceso al panel de operarios (tablet)', 'rutas'),
('RUTA_ESTADISTICAS_PRODUCCION', 'Acceso a estadísticas de producción', 'rutas');

ALTER TABLE jornada_persona
  ADD COLUMN inicio VARCHAR(30) NULL AFTER produccion_trabajo_id,
  ADD COLUMN fin VARCHAR(30) NULL AFTER inicio;

CREATE TABLE IF NOT EXISTS `refrigerio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `persona_id` INT NOT NULL,
  `inicio` VARCHAR(30) NOT NULL,
  `fin` VARCHAR(30) NULL,
  `created_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_at` DATETIME(6) NULL,
  `updated_by` INT NULL,
  `deleted_at` DATETIME(6) NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_refrigerio_persona_id` (`persona_id`),
  INDEX `idx_refrigerio_inicio` (`inicio`),
  CONSTRAINT `fk_refrigerio_persona` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`id`)
);
