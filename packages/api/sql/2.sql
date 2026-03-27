ALTER TABLE usuario ADD refresh_token varchar(512) DEFAULT NULL NULL;
ALTER TABLE usuario ADD attemps INT DEFAULT 0 NOT NULL;

ALTER TABLE inventario MODIFY COLUMN punit INT NOT NULL;

CREATE TABLE receta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE receta_inventario (
    receta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    etapa ENUM('METALURGICA', 'PINTURA', 'GRAFICA', 'PLOTEO', 'TERMINACIONES', 'OBRA', 'MONTAJE', 'SERVICIO_PETROLERO') NOT NULL,
    tipo ENUM('SUMINISTROS', 'MATERIALES', 'MANO_DE_OBRA') NOT NULL,
    PRIMARY KEY (receta_id, producto_id),
    FOREIGN KEY (receta_id) REFERENCES receta(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES inventario(inventarioId) ON DELETE CASCADE
);
