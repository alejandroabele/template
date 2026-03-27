-- Crear tabla ubicacion para gestión de ubicaciones físicas como activo

CREATE TABLE IF NOT EXISTS `ubicacion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recurso_id` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` INT NULL,
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_by` INT NULL,
  `deleted_at` DATETIME(6) NULL,
  `deleted_by` INT NULL,
  CONSTRAINT `fk_ubicacion_recurso` FOREIGN KEY (`recurso_id`) REFERENCES `alquiler_recurso` (`id`) ON DELETE CASCADE
);

INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
  ('UBICACION_VER',      'Ver ubicaciones',      'ubicacion'),
  ('UBICACION_CREAR',    'Crear ubicaciones',    'ubicacion'),
  ('UBICACION_EDITAR',   'Editar ubicaciones',   'ubicacion'),
  ('UBICACION_ELIMINAR', 'Eliminar ubicaciones', 'ubicacion'),
  ('RUTA_UBICACIONES',   'Acceso a ubicaciones', 'rutas');
