-- Módulo: Plantillas de notificación para facturas

-- Tabla: plantilla_notificacion
-- La plantilla es agnóstica al canal de envío: define el contenido del mensaje.
-- El canal (email, whatsapp, etc.) se elige en el momento del envío.
CREATE TABLE IF NOT EXISTS `plantilla_notificacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL COMMENT 'Nombre interno de la plantilla',
  `descripcion` VARCHAR(500) NULL COMMENT 'Descripción interna',
  `asunto` VARCHAR(255) NULL COMMENT 'Asunto opcional (ej: para email)',
  `cuerpo` TEXT NOT NULL COMMENT 'Contenido del mensaje con {{variables}}',
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`)
);

-- Tabla: envio_notificacion
-- Sigue el patrón modelo/modelo_id del proyecto.
-- Un registro por factura incluida en el envío.
-- El cuerpo_resuelto puede contener la lista de todas las facturas del cliente
-- (usando {{lista_facturas}}) aunque el registro apunte a una factura específica.
CREATE TABLE IF NOT EXISTS `envio_notificacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `plantilla_notificacion_id` INT NULL COMMENT 'Plantilla usada (puede ser NULL)',
  `modelo` VARCHAR(50) NOT NULL COMMENT 'Tipo de entidad: factura',
  `modelo_id` INT NOT NULL COMMENT 'ID de la factura',
  `canal` ENUM('email','whatsapp') NOT NULL COMMENT 'Canal elegido al momento del envío',
  `estado` ENUM('pendiente','enviado','error') NOT NULL DEFAULT 'pendiente',
  `asunto_resuelto` VARCHAR(255) NULL COMMENT 'Asunto con variables ya interpoladas',
  `cuerpo_resuelto` TEXT NOT NULL COMMENT 'Mensaje final con variables reemplazadas',
  `fecha_envio` VARCHAR(100) NULL COMMENT 'Fecha cuando se marcó como enviado',
  `error` TEXT NULL COMMENT 'Detalle del error si el envío falló',
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_envio_notificacion_plantilla` FOREIGN KEY (`plantilla_notificacion_id`)
    REFERENCES `plantilla_notificacion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX `IDX_envio_notificacion_modelo` ON `envio_notificacion`(`modelo`, `modelo_id`);
CREATE INDEX `IDX_envio_notificacion_estado` ON `envio_notificacion`(`estado`);
CREATE INDEX `IDX_envio_notificacion_canal` ON `envio_notificacion`(`canal`);

-- Permisos
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('PLANTILLA_NOTIFICACION_VER', 'Ver plantillas de notificación', 'plantilla_notificacion'),
('PLANTILLA_NOTIFICACION_CREAR', 'Crear plantillas de notificación', 'plantilla_notificacion'),
('PLANTILLA_NOTIFICACION_EDITAR', 'Editar plantillas de notificación', 'plantilla_notificacion'),
('PLANTILLA_NOTIFICACION_ELIMINAR', 'Eliminar plantillas de notificación', 'plantilla_notificacion'),
('ENVIO_NOTIFICACION_VER', 'Ver historial de envíos de notificaciones', 'envio_notificacion'),
('ENVIO_NOTIFICACION_CREAR', 'Enviar notificaciones a clientes', 'envio_notificacion'),
('ENVIO_NOTIFICACION_ELIMINAR', 'Eliminar registros de envíos', 'envio_notificacion'),
('RUTA_NOTIFICACIONES_PLANTILLAS', 'Acceso a página de plantillas de notificación', 'rutas'),
('RUTA_ENVIOS_NOTIFICACION', 'Acceso a página de historial de envíos de notificaciones', 'rutas');

ALTER TABLE `cliente`
  ADD COLUMN `email_pago_proveedores` VARCHAR(100) NULL COMMENT 'Email para pagos a proveedores',
  ADD COLUMN `nombre_contacto_pago_proveedores` VARCHAR(100) NULL COMMENT 'Nombre del contacto para pagos a proveedores',
  ADD COLUMN `telefono_pago_proveedores` VARCHAR(50) NULL COMMENT 'Teléfono/WhatsApp para pagos a proveedores';


-- Migración 82: agregar email_destinatario en envio_notificacion
ALTER TABLE envio_notificacion
    ADD COLUMN email_destinatario VARCHAR(100) NULL COMMENT 'Email real al que se envía la notificación (null si es whatsapp)';


