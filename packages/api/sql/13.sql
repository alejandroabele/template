INSERT INTO `pintegralco`.`proceso_general` (`nombre`, `color`, `orden`) VALUES ('FACTURACION HABILITADA', '#ec4899', '20');
INSERT INTO `pintegralco`.`proceso_general` (`nombre`, `color`, `orden`) VALUES ('COBRADO', '#84cc16', '21');
INSERT INTO `pintegralco`.`proceso_general` (`nombre`, `color`, `orden`) VALUES ('CERTIFICACION PENDIENTE', '#ef4444', '22');
UPDATE `pintegralco`.`proceso_general` SET `color` = '#7c3aed' WHERE (`id` = '16');
UPDATE `pintegralco`.`proceso_general` SET `color` = '#16a34a' WHERE (`id` = '15');

ALTER TABLE presupuesto
ADD COLUMN facturacion_estatus VARCHAR(50),
ADD COLUMN cobranza_estatus VARCHAR(50);

ALTER TABLE factura RENAME TO presupuesto_facturacion;

ALTER TABLE presupuesto_facturacion RENAME COLUMN facturaId TO id;
ALTER TABLE presupuesto_facturacion RENAME COLUMN presupuestoId TO presupuesto_id;
ALTER TABLE presupuesto_facturacion RENAME COLUMN ptotal TO monto;


ALTER TABLE presupuesto
ADD COLUMN monto_facturado DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN monto_cobrado DECIMAL(15, 2) DEFAULT 0;
 
/*V.2*/

CREATE TABLE presupuesto_cobro (
    id SERIAL PRIMARY KEY,
    presupuesto_id INTEGER NOT NULL,
    monto INTEGER NOT NULL,
    fecha DATE,
    CONSTRAINT fk_presupuesto_cobro FOREIGN KEY (presupuesto_id) REFERENCES presupuesto(id) ON DELETE CASCADE
);
