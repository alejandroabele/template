CREATE TABLE `equipamiento` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `codigo` VARCHAR(100) NOT NULL,
    `modelo` VARCHAR(100) NULL,
    `numero_serie` VARCHAR(100) NULL,
    `tipo` ENUM('computadoras', 'herramientas', 'maquinarias', 'instalaciones', 'mobiliarios', 'insumos_informaticos') NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` INT NULL,
    `deleted_at` DATETIME NULL,
    `deleted_by` INT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `equipamiento_codigo_unique` (`codigo`),
    CONSTRAINT `fk_equipamiento_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuario` (`id`),
    CONSTRAINT `fk_equipamiento_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuario` (`id`),
    CONSTRAINT `fk_equipamiento_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jornada_equipamiento` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `jornada_id` INT NOT NULL,
    `equipamiento_id` INT NOT NULL,
    `persona_responsable_id` INT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` INT NULL,
    `deleted_at` DATETIME NULL,
    `deleted_by` INT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_je_jornada` FOREIGN KEY (`jornada_id`) REFERENCES `jornada` (`id`),
    CONSTRAINT `fk_je_equipamiento` FOREIGN KEY (`equipamiento_id`) REFERENCES `equipamiento` (`id`),
    CONSTRAINT `fk_je_persona_responsable` FOREIGN KEY (`persona_responsable_id`) REFERENCES `persona` (`id`),
    CONSTRAINT `fk_je_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuario` (`id`),
    CONSTRAINT `fk_je_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `usuario` (`id`),
    CONSTRAINT `fk_je_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('EQUIPAMIENTO_VER', 'Ver equipamiento', 'equipamiento'),
('EQUIPAMIENTO_CREAR', 'Crear equipamiento', 'equipamiento'),
('EQUIPAMIENTO_EDITAR', 'Editar equipamiento', 'equipamiento'),
('EQUIPAMIENTO_ELIMINAR', 'Eliminar equipamiento', 'equipamiento'),
('RUTA_EQUIPAMIENTO', 'Acceso a ruta equipamiento', 'rutas');
