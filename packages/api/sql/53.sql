ALTER TABLE `pintegralco`.`metodo_pago`
DROP COLUMN `cashflow_categoria_id`;

-- Agregar campos de web y contacto de cobranzas al proveedor
ALTER TABLE `proveedor`
ADD COLUMN `web` VARCHAR(255) NULL COMMENT 'Página web del proveedor',
ADD COLUMN `contacto_cobranzas_nombre` VARCHAR(100) NULL COMMENT 'Nombre del contacto de cobranzas',
ADD COLUMN `contacto_cobranzas_email` VARCHAR(100) NULL COMMENT 'Email del contacto de cobranzas',
ADD COLUMN `contacto_cobranzas_telefono` VARCHAR(20) NULL COMMENT 'Teléfono del contacto de cobranzas';

-- Agregar campo descripcion a los items de oferta
ALTER TABLE `oferta_item`
ADD COLUMN `descripcion` VARCHAR(255) NULL COMMENT 'Descripción adicional del item';

-- Agregar campo descripcion a los items de orden de compra
ALTER TABLE `orden_compra_item`
ADD COLUMN `descripcion` VARCHAR(255) NULL COMMENT 'Descripción adicional del item';