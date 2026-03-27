-- ======================================
-- TABLA DE ESTADOS NORMALIZADA
-- ======================================

CREATE TABLE estado_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    tipo ENUM('SOLCOM','OFERTA','ORDEN_COMPRA') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

-- ======================================
-- PLAZOS DE PAGO
-- ======================================

CREATE TABLE plazo_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

-- ======================================
-- SOLICITUD DE COMPRA (SOLCOM)
-- ======================================

CREATE TABLE solcom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    presupuesto_id INT,
    centro_id INT,
    descripcion TEXT,
    fecha_creacion VARCHAR(20),
    fecha_limite VARCHAR(20),
    estado_id INT,
    usuario_solicitante INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

CREATE TABLE solcom_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solcom_id INT NOT NULL,
    inventario_id INT NOT NULL,
    inventario_conversion_id INT,
    descripcion VARCHAR(150),
    cantidad VARCHAR(50),
    minimo VARCHAR(50),
    maximo VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

-- ======================================
-- OFERTAS
-- ======================================

CREATE TABLE oferta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solcom_id INT,
    proveedor_id INT,
    metodo_id INT,
    plazo_id INT,
    fecha_disponibilidad VARCHAR(20),
    observaciones TEXT,
    estado_id INT,
    validez VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

CREATE TABLE oferta_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oferta_id INT NOT NULL,
    inventario_id INT NOT NULL,
    inventario_conversion_id INT,
    cantidad VARCHAR(50),
    precio VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

-- ======================================
-- ORDEN DE COMPRA
-- ======================================

CREATE TABLE orden_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oferta_id INT NOT NULL,
    metodo_id INT,
    plazo_id INT,
    estado_id INT,
    fecha_emision VARCHAR(20),
    obs TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

CREATE TABLE orden_compra_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_compra_id INT NOT NULL,
    inventario_id INT NOT NULL,
    inventario_conversion_id INT,
    cantidad VARCHAR(50),
    precio VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

-- ======================================
-- DATOS DE ESTADOS INICIALES
-- ======================================


-- ============================================
-- PERMISOS DEL MÓDULO DE COMPRAS
-- ============================================


-- ============================================
-- TABLA: plazo_pago (Plazos de pago)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PLAZO_PAGO_VER', 'Permite visualizar los plazos de pago disponibles', 'plazo_pago'),
('PLAZO_PAGO_CREAR', 'Permite crear nuevos plazos de pago', 'plazo_pago'),
('PLAZO_PAGO_EDITAR', 'Permite modificar plazos de pago existentes', 'plazo_pago'),
('PLAZO_PAGO_ELIMINAR', 'Permite eliminar plazos de pago', 'plazo_pago');

-- ============================================
-- PERMISOS DE NAVEGACIÓN (RUTAS)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_ESTADO_COMPRAS', 'Estados de Compras', 'rutas'),
('RUTA_PLAZO_PAGO', 'Plazos de Pago', 'rutas'),
('RUTA_SOLCOM', 'Ver Solicitudes de Compra', 'rutas'),
('RUTA_SOLCOM_CREAR', 'Crear Solicitud de Compra', 'rutas');

-- ============================================
-- TABLA: solcom (Solicitudes de Compra)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('SOLCOM_VER', 'Permite visualizar las solicitudes de compra del sistema', 'solcom'),
('SOLCOM_CREAR', 'Permite crear nuevas solicitudes de compra', 'solcom'),
('SOLCOM_EDITAR', 'Permite modificar solicitudes de compra existentes', 'solcom'),
('SOLCOM_ELIMINAR', 'Permite eliminar solicitudes de compra', 'solcom');

-- ============================================
-- TABLA: oferta (Ofertas)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('OFERTA_VER', 'Permite visualizar las ofertas del sistema', 'oferta'),
('OFERTA_CREAR', 'Permite crear nuevas ofertas', 'oferta'),
('OFERTA_EDITAR', 'Permite modificar ofertas existentes', 'oferta'),
('OFERTA_ELIMINAR', 'Permite eliminar ofertas', 'oferta');

-- ============================================
-- PERMISOS DE NAVEGACIÓN - OFERTAS
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_OFERTAS', 'Ver Ofertas', 'rutas'),
('RUTA_OFERTAS_CREAR', 'Crear Oferta', 'rutas');

CREATE TABLE IF NOT EXISTS `registro_leido` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `modelo` VARCHAR(100) NOT NULL,
  `modelo_id` INT NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_modelo_registro` (`usuario_id`, `modelo`, `modelo_id`),
  KEY `idx_usuario_modelo` (`usuario_id`, `modelo`),
  KEY `idx_modelo_id` (`modelo`, `modelo_id`)
);

CREATE TABLE cuenta_contable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    tipo ENUM('activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

-- ============================================
-- TABLA: cuenta_contable (Cuentas Contables)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CUENTA_CONTABLE_VER', 'Permite visualizar las cuentas contables del sistema', 'cuenta_contable'),
('CUENTA_CONTABLE_CREAR', 'Permite crear nuevas cuentas contables', 'cuenta_contable'),
('CUENTA_CONTABLE_EDITAR', 'Permite modificar cuentas contables existentes', 'cuenta_contable'),
('CUENTA_CONTABLE_ELIMINAR', 'Permite eliminar cuentas contables', 'cuenta_contable');

-- ============================================
-- PERMISOS DE NAVEGACIÓN - CUENTA CONTABLE
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_CUENTA_CONTABLE', 'Ver Cuentas Contables', 'rutas'),
('RUTA_CUENTA_CONTABLE_CREAR', 'Crear Cuenta Contable', 'rutas');

-- ============================================
-- TABLA: orden_compra (Órdenes de Compra)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ORDEN_COMPRA_VER', 'Permite visualizar las órdenes de compra del sistema', 'orden_compra'),
('ORDEN_COMPRA_CREAR', 'Permite crear nuevas órdenes de compra', 'orden_compra'),
('ORDEN_COMPRA_EDITAR', 'Permite modificar órdenes de compra existentes', 'orden_compra'),
('ORDEN_COMPRA_ELIMINAR', 'Permite eliminar órdenes de compra', 'orden_compra');

-- ============================================
-- PERMISOS DE NAVEGACIÓN - ORDEN DE COMPRA
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_ORDEN_COMPRA', 'Ver Órdenes de Compra', 'rutas');

-- ============================================
-- RELACIÓN INVENTARIO - CUENTA CONTABLE
-- ============================================

ALTER TABLE inventario ADD COLUMN cuenta_contable_id INT NULL;
ALTER TABLE inventario ADD CONSTRAINT fk_inventario_cuenta_contable FOREIGN KEY (cuenta_contable_id) REFERENCES cuenta_contable(id);



ALTER TABLE inventario
ADD COLUMN alicuota VARCHAR(10) NULL COMMENT 'Alícuota de IVA aplicable (21 o 10.5)';

-- ============================================
-- AGREGAR CAMPO BONIFICACIÓN A OFERTA Y ORDEN DE COMPRA
-- ============================================

ALTER TABLE oferta
ADD COLUMN bonificacion VARCHAR(50) NULL COMMENT 'Bonificación aplicada sobre el subtotal (sin IVA)';

ALTER TABLE orden_compra
ADD COLUMN bonificacion VARCHAR(50) NULL COMMENT 'Bonificación aplicada sobre el subtotal (sin IVA)';


ALTER TABLE oferta
ADD COLUMN moneda VARCHAR(50) NULL COMMENT 'Moneda en la que se expresa la oferta';

ALTER TABLE orden_compra
ADD COLUMN moneda VARCHAR(50) NULL COMMENT 'Moneda en la que se expresa la orden de compra';

-- ============================================
-- CHECKS DE CONTROL PARA ORDEN DE COMPRA
-- ============================================

ALTER TABLE oferta
ADD COLUMN control_articulos_extra BOOLEAN DEFAULT FALSE COMMENT 'Control de artículos que fueron pedidos extra a la solcom',
ADD COLUMN control_cantidades BOOLEAN DEFAULT FALSE COMMENT 'Control de las cantidades que se solicitaron en la oferta',
ADD COLUMN control_metodo_plazo_pago BOOLEAN DEFAULT FALSE COMMENT 'Control de los métodos de pago y plazo de pagos',
ADD COLUMN control_monto BOOLEAN DEFAULT FALSE COMMENT 'Control del monto';


-- ============================================
-- AGREGAR CAMPO DESCRIPCIÓN A INVENTARIO_CONVERSION
-- ============================================

ALTER TABLE inventario_conversion
ADD COLUMN descripcion VARCHAR(200) NULL COMMENT 'Descripción o rotulación de la presentación de conversión';

-- ============================================
-- TABLA GENÉRICA DE ESTADOS PERMITIDOS POR ROL
-- ============================================

CREATE TABLE rol_estado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    tabla_estado VARCHAR(100) NOT NULL COMMENT 'Nombre de la tabla de estado (ej: estado_compras, proceso_general)',
    estado_id INT NOT NULL COMMENT 'ID del estado que el rol puede asignar',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    UNIQUE KEY unique_rol_tabla_estado (rol_id, tabla_estado, estado_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    INDEX idx_rol_tabla (rol_id, tabla_estado)
) COMMENT 'Define qué estados puede asignar cada rol para cualquier tabla de estados';

-- ============================================
-- PERMISOS PARA GESTIONAR ESTADOS POR ROL
-- ============================================

-- ============================================
-- ASIGNAR TODOS LOS ESTADOS DE COMPRAS AL ROL ADMINISTRADOR (ID=1)
-- ============================================

-- Asignar todos los estados de compras al rol administrador
INSERT INTO rol_estado (rol_id, tabla_estado, estado_id)
SELECT 1, 'estado_compras', ec.id
FROM estado_compras ec
WHERE NOT EXISTS (
  SELECT 1
  FROM rol_estado re
  WHERE re.rol_id = 1 AND re.tabla_estado = 'estado_compras' AND re.estado_id = ec.id
);

-- ============================================
-- PERMISO DE AUTORIZACIÓN DE OFERTAS
-- ============================================


ALTER TABLE oferta
ADD COLUMN anotaciones_internas TEXT NULL COMMENT 'Anotaciones internas de la oferta para su posible aprobación (no va en la orden de compra)';

-- ============================================
-- AGREGAR CAMPO ALÍCUOTA A OFERTA_ITEM Y ORDEN_COMPRA_ITEM
-- ============================================

ALTER TABLE oferta_item
ADD COLUMN alicuota VARCHAR(10) NULL COMMENT 'Alícuota de IVA aplicable al item (21 o 10.5)';

ALTER TABLE orden_compra_item
ADD COLUMN alicuota VARCHAR(10) NULL COMMENT 'Alícuota de IVA aplicable al item (21 o 10.5)';

-- ============================================
-- AGREGAR PERMISOS PARA ENVIAR A VALIDAR Y RECHAZAR OFERTAS
-- ============================================
