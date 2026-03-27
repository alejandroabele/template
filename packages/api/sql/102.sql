-- Agrupaciones de rubros de cashflow (secciones visuales de primer nivel)

CREATE TABLE IF NOT EXISTS `cashflow_agrupacion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `tipo` ENUM('ingreso', 'egreso') NOT NULL,
  `orden` INT NOT NULL DEFAULT 0,
  `descripcion` TEXT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` INT NULL,
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_by` INT NULL,
  `deleted_at` DATETIME(6) NULL,
  `deleted_by` INT NULL
);

-- Vincular rubros a agrupaciones
ALTER TABLE `cashflow_rubro`
  ADD COLUMN `agrupacion_id` INT NULL AFTER `descripcion`,
  ADD CONSTRAINT `fk_cashflow_rubro_agrupacion` FOREIGN KEY (`agrupacion_id`) REFERENCES `cashflow_agrupacion` (`id`) ON DELETE SET NULL;

-- Agrupaciones base
INSERT INTO `cashflow_agrupacion` (`nombre`, `tipo`, `orden`) VALUES
  ('Ingresos', 'ingreso', 1),
  ('Egresos',  'egreso',  2);

-- Migrar rubros existentes: asignar a "Ingresos" si sus categorías son de tipo ingreso
UPDATE `cashflow_rubro` r
SET r.`agrupacion_id` = (SELECT `id` FROM `cashflow_agrupacion` WHERE `tipo` = 'ingreso' LIMIT 1)
WHERE EXISTS (
  SELECT 1 FROM `cashflow_categoria` c
  WHERE c.`rubro_id` = r.`id` AND c.`tipo` = 'ingreso'
)
AND NOT EXISTS (
  SELECT 1 FROM `cashflow_categoria` c
  WHERE c.`rubro_id` = r.`id` AND c.`tipo` = 'egreso'
);

-- Migrar rubros existentes: asignar a "Egresos" si sus categorías son de tipo egreso
UPDATE `cashflow_rubro` r
SET r.`agrupacion_id` = (SELECT `id` FROM `cashflow_agrupacion` WHERE `tipo` = 'egreso' LIMIT 1)
WHERE EXISTS (
  SELECT 1 FROM `cashflow_categoria` c
  WHERE c.`rubro_id` = r.`id` AND c.`tipo` = 'egreso'
)
AND NOT EXISTS (
  SELECT 1 FROM `cashflow_categoria` c
  WHERE c.`rubro_id` = r.`id` AND c.`tipo` = 'ingreso'
);

-- Permisos
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
  ('CASHFLOW_AGRUPACION_VER',      'Ver agrupaciones de cashflow',                    'cashflow'),
  ('CASHFLOW_AGRUPACION_CREAR',    'Crear agrupaciones de cashflow',                  'cashflow'),
  ('CASHFLOW_AGRUPACION_EDITAR',   'Editar agrupaciones de cashflow',                 'cashflow'),
  ('CASHFLOW_AGRUPACION_ELIMINAR', 'Eliminar agrupaciones de cashflow',               'cashflow'),
  ('RUTA_CASHFLOW_AGRUPACIONES',   'Acceso a página de agrupaciones de cashflow',     'rutas');
