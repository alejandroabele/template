-- Crear tabla factura unificada
CREATE TABLE IF NOT EXISTS `factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelo` varchar(50) NOT NULL COMMENT 'presupuesto o alquiler',
  `modelo_id` int NOT NULL,
  `monto` varchar(255) NOT NULL,
  `folio` varchar(100) DEFAULT NULL,
  `fecha` varchar(255) NULL,
  `fecha_vencimiento` varchar(255) DEFAULT NULL,
  `inicio_periodo` varchar(255) DEFAULT NULL,
  `fin_periodo` varchar(255) DEFAULT NULL,
  `cliente_id` int DEFAULT NULL,
  created_at TIMESTAMP NULL,
  created_by INT NULL,
  updated_at TIMESTAMP NULL,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL,
  origen_facturacion_id INT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_factura_modelo` (`modelo`, `modelo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO factura
  (modelo, modelo_id, monto, folio, fecha, fecha_vencimiento, cliente_id, origen_facturacion_id)
SELECT
  'presupuesto',
  pf.presupuesto_id,
  CAST(pf.monto AS CHAR),
  CAST(pf.folio AS CHAR),
  CAST(pf.fecha AS CHAR),
  CAST(pf.fecha_vencimiento AS CHAR),
  p.clienteId,
  pf.id
FROM presupuesto_facturacion pf
JOIN presupuesto p ON p.id = pf.presupuesto_id;

-- Migrar datos de alquiler_facturacion
INSERT INTO factura
  (modelo, modelo_id, monto, folio, inicio_periodo, fin_periodo, cliente_id, origen_facturacion_id)
SELECT
  'alquiler',
  af.alquiler_id,
  CAST(af.monto AS CHAR),
  NULL,
  CAST(af.inicio_periodo AS CHAR),
  CAST(af.fin_periodo AS CHAR),
  af.cliente_id,
  af.id
FROM alquiler_facturacion af;


-- Migrar archivos de presupuesto_facturacion a factura (INSERT para preservar datos)
INSERT INTO archivo (modelo, modelo_id, nombre, nombre_archivo, nombre_archivo_original, url, extension, tipo)
SELECT
  'factura',
  f.id,
  a.nombre,
  a.nombre_archivo,
  a.nombre_archivo_original,
  a.url,
  a.extension,
  a.tipo
FROM archivo a
JOIN factura f ON f.origen_facturacion_id = a.modelo_id AND f.modelo = 'presupuesto'
WHERE a.modelo = 'presupuesto_facturacion';

-- Migrar archivos de alquiler_facturacion a factura (INSERT para preservar datos)
INSERT INTO archivo (modelo, modelo_id, nombre, nombre_archivo, nombre_archivo_original, url, extension, tipo)
SELECT
  'factura',
  f.id,
  a.nombre,
  a.nombre_archivo,
  a.nombre_archivo_original,
  a.url,
  a.extension,
  a.tipo
FROM archivo a
JOIN factura f ON f.origen_facturacion_id = a.modelo_id AND f.modelo = 'alquiler'
WHERE a.modelo = 'alquiler_facturacion';


-- Insertar permisos
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('FACTURA_VER', 'Ver facturas', 'factura'),
('FACTURA_CREAR', 'Crear facturas', 'factura'),
('FACTURA_EDITAR', 'Editar facturas', 'factura'),
('FACTURA_ELIMINAR', 'Eliminar facturas', 'factura');
