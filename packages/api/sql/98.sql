-- Crear tabla de historial de precios de inventario
-- Registra cada cambio de precio unitario de un producto,
-- ya sea automático (vía ingreso de OC) o manual (desde la UI del producto).
CREATE TABLE precio_historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventario_id INT NOT NULL COMMENT 'Producto al que pertenece el historial',
    orden_compra_id INT NULL COMMENT 'OC que originó el cambio. NULL = cambio manual',
    precio_unitario VARCHAR(50) NOT NULL COMMENT 'Precio unitario en unidad base del producto',
    motivo TEXT NULL COMMENT 'Motivo del cambio. NULL si viene de OC, requerido si es manual',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    created_by INT NULL,
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    updated_by INT NULL,
    deleted_at DATETIME(6) NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_precio_historial_inventario FOREIGN KEY (inventario_id) REFERENCES inventario(inventarioId) ON DELETE CASCADE,
    CONSTRAINT fk_precio_historial_orden_compra FOREIGN KEY (orden_compra_id) REFERENCES orden_compra(id) ON DELETE SET NULL,
    CONSTRAINT fk_precio_historial_usuario FOREIGN KEY (created_by) REFERENCES usuario(id) ON DELETE SET NULL
);
