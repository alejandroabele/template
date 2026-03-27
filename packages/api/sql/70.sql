-- Crear tabla cashflow_rubro
CREATE TABLE IF NOT EXISTS `cashflow_rubro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columna rubro_id a cashflow_categoria
ALTER TABLE `cashflow_categoria`
ADD COLUMN `rubro_id` INT NULL AFTER `codigo`;


-- Insertar permisos para cashflow_rubro
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('CASHFLOW_RUBRO_VER', 'Ver rubros de cashflow', 'cashflow'),
('CASHFLOW_RUBRO_CREAR', 'Crear rubros de cashflow', 'cashflow'),
('CASHFLOW_RUBRO_EDITAR', 'Editar rubros de cashflow', 'cashflow'),
('CASHFLOW_RUBRO_ELIMINAR', 'Eliminar rubros de cashflow', 'cashflow'),
('RUTA_CASHFLOW_RUBROS', 'Acceso a la página de rubros de cashflow', 'rutas');
