-- Crear tabla cartel
CREATE TABLE IF NOT EXISTS `cartel` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `recurso_id` INT NOT NULL,
    `formato` VARCHAR(255) NULL,
    `alto` VARCHAR(255) NULL,
    `largo` VARCHAR(255) NULL,
    `localidad` VARCHAR(255) NULL,
    `zona` VARCHAR(255) NULL,
    `coordenadas` VARCHAR(100) NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` DATETIME(6) NULL,
    `created_by` INT NULL,
    `updated_by` INT NULL,
    `deleted_by` INT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_cartel_recurso` FOREIGN KEY (`recurso_id`) REFERENCES `alquiler_recurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX `IDX_cartel_recurso_id` ON `cartel`(`recurso_id`);

-- Crear tabla trailer
CREATE TABLE IF NOT EXISTS `trailer` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `recurso_id` INT NOT NULL,
    `formato` VARCHAR(255) NULL,
    `alto` VARCHAR(255) NULL,
    `largo` VARCHAR(255) NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` DATETIME(6) NULL,
    `created_by` INT NULL,
    `updated_by` INT NULL,
    `deleted_by` INT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_trailer_recurso` FOREIGN KEY (`recurso_id`) REFERENCES `alquiler_recurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX `IDX_trailer_recurso_id` ON `trailer`(`recurso_id`);

-- Migrar datos existentes de carteles
INSERT INTO `cartel` (`recurso_id`, `formato`, `alto`, `largo`, `localidad`, `zona`, `coordenadas`)
SELECT `id`, `formato`, `alto`, `largo`, `localidad`, `zona`, `coordenadas`
FROM `alquiler_recurso`
WHERE `tipo` = 'CARTELES';

-- Migrar datos existentes de trailers
INSERT INTO `trailer` (`recurso_id`, `formato`, `alto`, `largo`)
SELECT `id`, `formato`, `alto`, `largo`
FROM `alquiler_recurso`
WHERE `tipo` = 'TRAILERS';

-- Permisos módulo cartel
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('CARTELES_VER', 'Ver carteles', 'cartel'),
('CARTELES_CREAR', 'Crear carteles', 'cartel'),
('CARTELES_EDITAR', 'Editar carteles', 'cartel'),
('CARTELES_ELIMINAR', 'Eliminar carteles', 'cartel'),
('RUTA_CARTELES', 'Acceso a página carteles', 'rutas');

-- Permisos módulo trailer
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('TRAILERS_VER', 'Ver trailers', 'trailer'),
('TRAILERS_CREAR', 'Crear trailers', 'trailer'),
('TRAILERS_EDITAR', 'Editar trailers', 'trailer'),
('TRAILERS_ELIMINAR', 'Eliminar trailers', 'trailer'),
('RUTA_TRAILERS', 'Acceso a página trailers', 'rutas');

-- Eliminar columnas de especificación de alquiler_recurso (migradas a cartel y trailer)
ALTER TABLE `alquiler_recurso`
    DROP COLUMN `localidad`,
    DROP COLUMN `zona`,
    DROP COLUMN `coordenadas`,
    DROP COLUMN `alto`,
    DROP COLUMN `ancho`,
    DROP COLUMN `largo`,
    DROP COLUMN `modelo`,
    DROP COLUMN `formato`;
