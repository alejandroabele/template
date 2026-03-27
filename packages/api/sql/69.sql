-- Crear tabla reserva
CREATE TABLE IF NOT EXISTS `reserva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observaciones` TEXT NULL,
  `presupuesto_id` INT NULL,
  `trabajo_id` INT NULL,
  `centro_costo_id` INT NULL,
  `persona_id` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`)
);

-- Agregar campo reserva_id a inventario_reservas
ALTER TABLE `inventario_reservas`
ADD COLUMN `reserva_id` INT NULL AFTER `centro_costo_id`;

-- Crear tabla reserva_item (items de la reserva)
CREATE TABLE IF NOT EXISTS `reserva_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reserva_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad` varchar(255) NOT NULL,
  `observaciones` TEXT NULL,
  `inventario_reserva_id` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_reserva_item_reserva` (`reserva_id`),
  INDEX `idx_reserva_item_producto` (`producto_id`)
);

-- Agregar campos persona_id y reserva_id a movimiento_inventario
ALTER TABLE `movimiento_inventario`
ADD COLUMN `persona_id` INT NULL AFTER `orden_compra_item_id`,
ADD COLUMN `reserva_id` INT NULL AFTER `persona_id`;

-- Insertar permisos de Reserva
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RESERVA_VER', 'Ver reservas de inventario', 'reserva'),
('RESERVA_CREAR', 'Crear reservas de inventario', 'reserva'),
('RESERVA_EDITAR', 'Editar reservas de inventario', 'reserva'),
('RESERVA_ELIMINAR', 'Eliminar reservas de inventario', 'reserva'),
('RUTA_RESERVAS', 'Acceso a la página de reservas', 'rutas'),
('RUTA_RESERVAS_CREAR', 'Acceso a la página de crear reserva', 'rutas'),
('RUTA_INVENTARIO_INGRESO_MERCADERIA', 'Ingreso mercaderia', 'rutas'),
('RUTA_INVENTARIO_EGRESO_MASIVO', 'Egreso masivo', 'rutas');

-- Agregar campos de auditoría a cashflow_categoria
ALTER TABLE `cashflow_categoria`
ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `protegida`,
ADD COLUMN `created_by` INT NULL AFTER `created_at`,
ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_by`,
ADD COLUMN `updated_by` INT NULL AFTER `updated_at`,
ADD COLUMN `deleted_at` TIMESTAMP NULL AFTER `updated_by`,
ADD COLUMN `deleted_by` INT NULL AFTER `deleted_at`;

-- Agregar campos de auditoría a cashflow_transaccion
ALTER TABLE `cashflow_transaccion`
ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `tipo_transaccion`,
ADD COLUMN `created_by` INT NULL AFTER `created_at`,
ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_by`,
ADD COLUMN `updated_by` INT NULL AFTER `updated_at`,
ADD COLUMN `deleted_at` TIMESTAMP NULL AFTER `updated_by`,
ADD COLUMN `deleted_by` INT NULL AFTER `deleted_at`;
