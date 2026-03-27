ALTER TABLE `pintegralco`.`categoria` 
RENAME TO  `pintegralco`.`inventario_familia` ;

CREATE TABLE inventario_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    inventario_familia_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_inventario_familia FOREIGN KEY (inventario_familia_id) REFERENCES inventario_familia(id)
);
ALTER TABLE inventario
ADD COLUMN inventario_categoria_id INTEGER;

ALTER TABLE inventario
ADD CONSTRAINT fk_inventario_categoria
FOREIGN KEY (inventario_categoria_id)
REFERENCES inventario_categoria(id)
ON DELETE SET NULL
ON UPDATE CASCADE;
