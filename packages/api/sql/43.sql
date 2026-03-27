-- Migración: Crear tabla centro_costo
-- Fecha: 2025-10-19

CREATE TABLE IF NOT EXISTS centro_costo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT NULL,
    updated_by INT NULL,
    deleted_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar las consultas
CREATE INDEX idx_centro_costo_codigo ON centro_costo(codigo);
CREATE INDEX idx_centro_costo_nombre ON centro_costo(nombre);
