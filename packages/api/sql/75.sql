-- Crear tabla equipamiento_tipo
CREATE TABLE IF NOT EXISTS `equipamiento_tipo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `icono` VARCHAR(50) NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`)
);

-- Insertar tipos iniciales
INSERT INTO `equipamiento_tipo` (`codigo`, `nombre`, `descripcion`, `icono`) VALUES
('camioneta', 'Camioneta', 'Vehículos tipo pick-up', 'Truck'),
('auto', 'Automóvil', 'Vehículos livianos', 'Car'),
('grua', 'Grúa', 'Vehículos de carga pesada', 'Crane'),
('bomba', 'Bomba', 'Bombas de agua y combustible', 'Droplet');

-- Crear tabla equipamiento
CREATE TABLE IF NOT EXISTS `equipamiento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `tipo_id` INT NOT NULL,
  `descripcion` TEXT NULL,
  `modelo` VARCHAR(100) NULL,
  `marca` VARCHAR(100) NULL,
  `patente` VARCHAR(20) NULL,
  `numero_serie` VARCHAR(100) NULL,
  `anio` VARCHAR(100) NULL,
  `kilometraje` VARCHAR(100) NULL,
  `capacidad_kg` VARCHAR(100) NULL,
  `horas_uso` VARCHAR(100) NULL,
  `litros` VARCHAR(100) NULL,
  `presion_bar` VARCHAR(100) NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_equipamiento_tipo` FOREIGN KEY (`tipo_id`) REFERENCES `equipamiento_tipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Crear índice en tipo_id
CREATE INDEX `IDX_equipamiento_tipo_id` ON `equipamiento`(`tipo_id`);

-- Crear tabla jornada_equipamiento
CREATE TABLE IF NOT EXISTS `jornada_equipamiento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jornada_id` INT NOT NULL,
  `equipamiento_id` INT NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_jornada_equipamiento_jornada` FOREIGN KEY (`jornada_id`) REFERENCES `jornada`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_jornada_equipamiento_equipamiento` FOREIGN KEY (`equipamiento_id`) REFERENCES `equipamiento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Crear índices en claves foráneas de jornada_equipamiento
CREATE INDEX `IDX_jornada_equipamiento_jornada_id` ON `jornada_equipamiento`(`jornada_id`);
CREATE INDEX `IDX_jornada_equipamiento_equipamiento_id` ON `jornada_equipamiento`(`equipamiento_id`);

-- Insertar permisos de equipamiento
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('EQUIPAMIENTO_VER', 'Ver registros de equipamiento', 'equipamiento'),
('EQUIPAMIENTO_CREAR', 'Crear registros de equipamiento', 'equipamiento'),
('EQUIPAMIENTO_EDITAR', 'Editar registros de equipamiento', 'equipamiento'),
('EQUIPAMIENTO_ELIMINAR', 'Eliminar registros de equipamiento', 'equipamiento'),
('RUTA_EQUIPAMIENTO', 'Acceso a la página de equipamiento', 'rutas');

-- Insertar permisos de equipamiento_tipo
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('EQUIPAMIENTO_TIPO_VER', 'Ver tipos de equipamiento', 'equipamiento_tipo'),
('EQUIPAMIENTO_TIPO_CREAR', 'Crear tipos de equipamiento', 'equipamiento_tipo'),
('EQUIPAMIENTO_TIPO_EDITAR', 'Editar tipos de equipamiento', 'equipamiento_tipo'),
('EQUIPAMIENTO_TIPO_ELIMINAR', 'Eliminar tipos de equipamiento', 'equipamiento_tipo'),
('RUTA_EQUIPAMIENTO_TIPO', 'Acceso a la página de tipos de equipamiento', 'rutas');
