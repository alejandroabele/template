-- Crear tabla de subcategorías
CREATE TABLE IF NOT EXISTS inventario_subcategoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    inventario_categoria_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    FOREIGN KEY (inventario_categoria_id) REFERENCES inventario_categoria(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Agregar campo de subcategoría al inventario
ALTER TABLE inventario 
ADD COLUMN inventario_subcategoria_id INT,
ADD CONSTRAINT fk_inventario_subcategoria 
FOREIGN KEY (inventario_subcategoria_id) REFERENCES inventario_subcategoria(id);
