CREATE TABLE inventario_conversion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventario_id INT,
    unidad_origen VARCHAR(50),
    cantidad TEXT,
    unidad_destino VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    deleted_by INT NULL,
    FOREIGN KEY (inventario_id) REFERENCES inventario(inventarioId)
);


ALTER TABLE movimiento_inventario
ADD COLUMN inventario_conversion_id INTEGER;

ALTER TABLE movimiento_inventario
ADD CONSTRAINT fk_movimiento_inventario_conversion
FOREIGN KEY (inventario_conversion_id)
REFERENCES inventario_conversion(id)
ON DELETE SET NULL;
