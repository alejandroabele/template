-- Crear tabla config
CREATE TABLE `config` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave varchar(100) NOT NULL,
  valor varchar(255) NULL,
  modulo varchar(100) NULL,
  descripcion varchar(255) NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at timestamp NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar configuración: límite de orden de compra
INSERT INTO `config` (clave, valor, modulo, descripcion) VALUES
('orden_compra_limite_monto', NULL, 'compras', 'Monto límite para órdenes de compra que requieren autorización adicional');

-- Insertar permisos del módulo Compras (para el formulario completo)
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('COMPRAS_CONFIG', 'Configuración de compras', 'configuracion'),
('RUTA_COMPRAS_CONFIG', 'Configuración de compras', 'rutas');
