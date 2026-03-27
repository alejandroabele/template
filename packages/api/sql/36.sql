ALTER TABLE `pintegralco`.`inventario_reservas` 
CHANGE COLUMN `cantidad` `cantidad` VARCHAR(255) NOT NULL ;

ALTER TABLE pintegralco.presupuesto_facturacion
ADD COLUMN `fecha_vencimiento` VARCHAR(255);

ALTER TABLE pintegralco.presupuesto_cobro
ADD COLUMN `presupuesto_factura_id` INT NULL;

ALTER TABLE `pintegralco`.`presupuesto_cobro` 
CHANGE COLUMN `monto` `monto` VARCHAR(255) NOT NULL ;

ALTER TABLE `pintegralco`.`presupuesto_facturacion` 
CHANGE COLUMN `monto` `monto` VARCHAR(255) NOT NULL ;

ALTER TABLE pintegralco.presupuesto_cobro
ADD COLUMN `retenciones` VARCHAR(255) NULL ;

CREATE TABLE metodo_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cashflow_categoria_id INT NOT NULL
);

ALTER TABLE pintegralco.presupuesto_cobro
ADD COLUMN `metodo_pago_id` INT NULL;

ALTER TABLE presupuesto
CHANGE COLUMN monto_facturado monto_facturado VARCHAR(255) NULL,
CHANGE COLUMN monto_cobrado monto_cobrado VARCHAR(255) NULL,
ADD COLUMN monto_retenciones VARCHAR(255) NULL;

CREATE TABLE cashflow_categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('ingreso','egreso') NOT NULL,
    protegida TINYINT NULL DEFAULT FALSE
);

CREATE TABLE cashflow_transaccion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    fecha VARCHAR(255) NOT NULL,
    monto VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NULL,
    modelo VARCHAR(100) NULL,
    modelo_id INT NULL,
    tipo_transaccion VARCHAR(255) NULL,
    FOREIGN KEY (categoria_id) REFERENCES cashflow_categoria(id)
);

CREATE INDEX idx_cashflow_transaccion_fecha_categoria 
    ON cashflow_transaccion(fecha, categoria_id);

INSERT INTO cashflow_categoria (id, nombre, tipo, protegida)
VALUES (1, 'INGRESOS PROYECTADOS', 'ingreso', 1);

INSERT INTO cashflow_categoria (id, nombre, tipo, protegida)
VALUES (2, 'INGRESOS FUTUROS DE OTS', 'ingreso', 1);

INSERT INTO cashflow_categoria (id, nombre, tipo, protegida)
VALUES (5, 'TRANSFERENCIAS', 'ingreso', 1);

INSERT INTO cashflow_categoria (id, nombre, tipo, protegida)
VALUES (3, 'EFECTIVO', 'ingreso', 1);

INSERT INTO cashflow_categoria (id, nombre, tipo, protegida)
VALUES (4, 'CHEQUES DIFERIDOS', 'ingreso', 1);
ALTER TABLE `pintegralco`.`presupuesto_facturacion` 
CHANGE COLUMN `folio` `folio` VARCHAR(255) NOT NULL DEFAULT '0' ;
