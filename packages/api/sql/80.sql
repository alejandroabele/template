    -- Agregar permisos para módulo de Cobros y ruta de Administración

    -- Insertar permiso de reportes en módulo cobro (consistente con COBRO_VER, COBRO_CREAR, etc.)
    INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
    ('RUTA_ADMINISTRACION_FACTURACION', 'Acceso a la página de facturación en administración', 'rutas');

-- Agregar campos a la tabla factura: importe_bruto, alicuota y estado

ALTER TABLE `factura`
ADD COLUMN `importe_bruto` VARCHAR(20) NULL COMMENT 'Importe bruto antes de impuestos' AFTER `monto`,
ADD COLUMN `alicuota` VARCHAR(100) NULL COMMENT 'Alícuota aplicada (porcentaje)' AFTER `importe_bruto`,
ADD COLUMN `estado` ENUM('pendiente', 'pagado', 'parcial') NOT NULL DEFAULT 'pendiente' COMMENT 'Estado de la factura' AFTER `alicuota`;

-- Migración de estados para facturas existentes
-- Nota: El DEFAULT 'pendiente' (FACTURA_ESTADO.PENDIENTE) ya se aplicó a todas las facturas
-- Ahora actualizamos las que deben ser 'pagado' (FACTURA_ESTADO.PAGADO)

-- Regla 1: Facturas sin fecha de vencimiento → FACTURA_ESTADO.PAGADO
UPDATE `factura`
SET `estado` = 'pagado'
WHERE `fecha_vencimiento` IS NULL
  AND `deleted_at` IS NULL;

-- Regla 2: Facturas con al menos un cobro asociado → FACTURA_ESTADO.PAGADO
UPDATE `factura`
SET `estado` = 'pagado'
WHERE `deleted_at` IS NULL
  AND EXISTS (
    SELECT 1
    FROM `cobro`
    WHERE `cobro`.`factura_id` = `factura`.`id`
      AND `cobro`.`deleted_at` IS NULL
  );

-- Las facturas restantes ya tienen FACTURA_ESTADO.PENDIENTE por el DEFAULT



