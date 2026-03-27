ALTER TABLE pintegralco.alquiler_cobranzas
ADD COLUMN `metodo_pago_id` INT NULL;

ALTER TABLE pintegralco.alquiler_cobranzas
ADD COLUMN `alquiler_factura_id` INT NULL;

ALTER TABLE pintegralco.alquiler_facturacion
ADD COLUMN `fecha_vencimiento` VARCHAR(255);

ALTER TABLE pintegralco.banco_saldo
ADD COLUMN `descubierto_monto` VARCHAR(255) NULL,
ADD COLUMN `descubierto_uso` VARCHAR(255) NULL;

ALTER TABLE pintegralco.banco
ADD COLUMN `cbu` VARCHAR(255) NULL,
ADD COLUMN `nro_cuenta` VARCHAR(255) NULL,
ADD COLUMN `alias` VARCHAR(255) NULL;