-- Módulo de Simulaciones de Cashflow

CREATE TABLE IF NOT EXISTS `cashflow_simulacion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `tipo` VARCHAR(50) NOT NULL COMMENT 'desde_cero | desde_actual',
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` INT NULL,
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_by` INT NULL,
  `deleted_at` DATETIME(6) NULL,
  `deleted_by` INT NULL
);

CREATE TABLE IF NOT EXISTS `cashflow_simulacion_transaccion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `simulacion_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  `banco_id` INT NULL,
  `fecha` VARCHAR(255) NOT NULL,
  `monto` DECIMAL(18, 2) NOT NULL,
  `descripcion` TEXT NULL,
  `conciliado` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` INT NULL,
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_by` INT NULL,
  `deleted_at` DATETIME(6) NULL,
  `deleted_by` INT NULL,
  CONSTRAINT `fk_cst_simulacion` FOREIGN KEY (`simulacion_id`) REFERENCES `cashflow_simulacion` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cst_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `cashflow_categoria` (`id`),
  CONSTRAINT `fk_cst_banco` FOREIGN KEY (`banco_id`) REFERENCES `banco` (`id`),
  INDEX `idx_cst_simulacion_fecha` (`simulacion_id`, `fecha`)
);

INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
  ('CASHFLOW_SIMULACION_VER',      'Ver simulaciones de cashflow',      'cashflow'),
  ('CASHFLOW_SIMULACION_CREAR',    'Crear simulaciones de cashflow',    'cashflow'),
  ('CASHFLOW_SIMULACION_EDITAR',   'Editar simulaciones de cashflow',   'cashflow'),
  ('CASHFLOW_SIMULACION_ELIMINAR', 'Eliminar simulaciones de cashflow', 'cashflow'),
  ('RUTA_CASHFLOW_SIMULACIONES',   'Acceso a página de simulaciones de cashflow', 'rutas');
