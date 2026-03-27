-- Crear tabla cobro unificada
CREATE TABLE IF NOT EXISTS `cobro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelo` varchar(50) NOT NULL COMMENT 'presupuesto o alquiler',
  `modelo_id` int NOT NULL,
  `monto` varchar(255) NOT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  `factura_id` int DEFAULT NULL,
  `metodo_pago_id` int DEFAULT NULL,
  `retenciones` varchar(255) DEFAULT NULL,
  created_at TIMESTAMP NULL,
  created_by INT NULL,
  updated_at TIMESTAMP NULL,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL,
  origen_cobro_id INT NULL COMMENT 'ID original de presupuesto_cobro o alquiler_cobranzas',
  PRIMARY KEY (`id`),
  KEY `idx_cobro_modelo` (`modelo`, `modelo_id`),
  KEY `idx_cobro_factura` (`factura_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Migrar datos de presupuesto_cobro
INSERT INTO cobro
  (modelo, modelo_id, monto, fecha, factura_id, metodo_pago_id, retenciones, origen_cobro_id)
SELECT
  'presupuesto',
  pc.presupuesto_id,
  CAST(pc.monto AS CHAR),
  CAST(pc.fecha AS CHAR),
  f.id AS factura_id,
  pc.metodo_pago_id,
  CAST(pc.retenciones AS CHAR),
  pc.id
FROM presupuesto_cobro pc
JOIN presupuesto p
  ON p.id = pc.presupuesto_id
JOIN factura f
  ON f.modelo = 'presupuesto'
 AND f.origen_facturacion_id = pc.presupuesto_factura_id;


-- Migrar datos de alquiler_cobranzas
INSERT INTO cobro
  (modelo, modelo_id, monto, fecha, origen_cobro_id)
SELECT
  'alquiler',
  ac.alquiler_id,
  CAST(ac.monto AS CHAR),
  CAST(DATE(ac.fecha_cobro) AS CHAR),
  ac.id
FROM alquiler_cobranzas ac;


-- Migrar archivos de presupuesto_cobro a cobro (INSERT para preservar datos)
INSERT INTO archivo (modelo, modelo_id, nombre, nombre_archivo, nombre_archivo_original, url, extension, tipo)
SELECT
  'cobro',
  c.id,
  a.nombre,
  a.nombre_archivo,
  a.nombre_archivo_original,
  a.url,
  a.extension,
  a.tipo
FROM archivo a
JOIN cobro c ON c.origen_cobro_id = a.modelo_id AND c.modelo = 'presupuesto'
WHERE a.modelo = 'presupuesto_cobro';

-- Migrar archivos de alquiler_cobranzas a cobro (INSERT para preservar datos)
INSERT INTO archivo (modelo, modelo_id, nombre, nombre_archivo, nombre_archivo_original, url, extension, tipo)
SELECT
  'cobro',
  c.id,
  a.nombre,
  a.nombre_archivo,
  a.nombre_archivo_original,
  a.url,
  a.extension,
  a.tipo
FROM archivo a
JOIN cobro c ON c.origen_cobro_id = a.modelo_id AND c.modelo = 'alquiler'
WHERE a.modelo = 'alquiler_cobranzas';


-- Insertar permisos
INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('COBRO_VER', 'Ver cobros', 'cobro'),
('COBRO_CREAR', 'Crear cobros', 'cobro'),
('COBRO_EDITAR', 'Editar cobros', 'cobro'),
('COBRO_ELIMINAR', 'Eliminar cobros', 'cobro');
