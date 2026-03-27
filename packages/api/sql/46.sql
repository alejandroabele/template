ALTER TABLE `pintegralco`.`cashflow_categoria` 
ADD COLUMN `codigo` VARCHAR(45) NULL;

INSERT INTO `pintegralco`.`cashflow_categoria` (`nombre`, `tipo`, `protegida`, `metodo_pago_id`, `codigo`) VALUES ('DESCUBIERTOS BANCOS', 'ingreso', '1', NULL, '1');
INSERT INTO `pintegralco`.`cashflow_categoria` (`nombre`, `tipo`, `protegida`, `metodo_pago_id`, `codigo`) VALUES ('DEVOLUCION DESCUBIERTOS', 'egreso', '1', NULL, '2');

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Código único del permiso (ej: PRESUPUESTOS_LISTAR)',
  `descripcion` VARCHAR(255) NULL COMMENT 'Descripción del permiso',
  `modulo` VARCHAR(100) NULL COMMENT 'Módulo al que pertenece el permiso',
  PRIMARY KEY (`id`),
  INDEX `idx_codigo` (`codigo`)
);

-- Renombrar tabla permiso a roles y agregar nuevas columnas
ALTER TABLE `permiso` RENAME TO `roles`;

-- Agregar columnas nuevas a la tabla roles (antes permiso)
ALTER TABLE `roles`
  ADD COLUMN `descripcion` VARCHAR(255) NULL,
  ADD COLUMN `parent_id` INT NULL COMMENT 'ID del rol padre (para herencia)',
  ADD COLUMN `nivel` INT NULL COMMENT 'Nivel jerárquico del rol';

-- Agregar índices para las nuevas columnas
ALTER TABLE `roles`
  ADD INDEX `idx_parent_id` (`parent_id`),
  ADD INDEX `idx_nivel` (`nivel`);

-- Tabla de relación roles-permisos
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  INDEX `idx_role_id` (`role_id`),
  INDEX `idx_permission_id` (`permission_id`)
);
