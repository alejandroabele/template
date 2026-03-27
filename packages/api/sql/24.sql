CREATE TABLE unidad_medida (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);


-- ALTER TABLE inventario
-- ADD COLUMN unidad_medida_id INTEGER;

-- ALTER TABLE inventario
-- ADD CONSTRAINT fk_unidad_medida
-- FOREIGN KEY (unidad_medida_id) REFERENCES unidad_medida(id);

ALTER TABLE inventario
ADD COLUMN unidad_medida VARCHAR(50) NULL;
ALTER TABLE inventario
ADD COLUMN sku VARCHAR(50) NOT NULL;

ALTER TABLE inventario
ADD COLUMN descripcion VARCHAR(50) NULL;

ALTER TABLE inventario
ADD COLUMN stock_minimo FLOAT NULL;

ALTER TABLE inventario
ADD COLUMN stock_maximo FLOAT NULL;

ALTER TABLE inventario
ADD COLUMN stock_reservado FLOAT NULL;

CREATE TABLE movimiento_inventario (
	id SERIAL PRIMARY KEY,
	tipo_movimiento VARCHAR(30) NOT NULL,
    presupuesto_item_id INTEGER REFERENCES presupuesto_h(id),
	motivo VARCHAR(50) NOT NULL,
	producto_id INT NOT NULL,
	trabajo_id INT NULL,
	cantidad FLOAT NOT NULL,
    cantidad_antes FLOAT NOT NULL,
    cantidad_despues FLOAT NOT NULL,
	fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	origen VARCHAR(10) NULL,
	observaciones TEXT,
	created_at TIMESTAMP NULL,
	created_by INT NULL,
	updated_at TIMESTAMP NULL,
	updated_by INT NULL,
	deleted_at TIMESTAMP NULL,
	deleted_by INT NULL
);

ALTER TABLE movimiento_inventario
ADD CONSTRAINT fk_producto
FOREIGN KEY (producto_id)
REFERENCES inventario(inventarioId);


CREATE TABLE inventario_reservas (
    id SERIAL PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    presupuesto_item_id INTEGER REFERENCES presupuesto_h(id),
    estado VARCHAR(10) CHECK (estado IN ('usada', 'disponible')) NOT NULL,
	observaciones TEXT,
	trabajo_id INT NULL,
	producto_id INTEGER REFERENCES inventario(inventarioId),
    origen VARCHAR(10) NULL,
	created_at TIMESTAMP NULL,
	created_by INT NULL,
	updated_at TIMESTAMP NULL,
	updated_by INT NULL,
	deleted_at TIMESTAMP NULL,
	deleted_by INT NULL
);


ALTER TABLE inventario
ADD COLUMN created_at TIMESTAMP NULL,
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_at TIMESTAMP NULL,
ADD COLUMN updated_by INT NULL,
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN deleted_by INT NULL;

ALTER TABLE notificacion DROP FOREIGN KEY fk_presupuesto_notificacion;

CREATE TABLE auditoria (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tabla TEXT NOT NULL,
    columna TEXT NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    registro_id INT,
    usuario_id INT,
    fecha TIMESTAMP
);

ALTER TABLE categoria
ADD COLUMN created_at TIMESTAMP NULL,
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_at TIMESTAMP NULL,
ADD COLUMN updated_by INT NULL,
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN deleted_by INT NULL;
