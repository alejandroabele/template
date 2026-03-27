-- ============================================
-- AGREGAR CAMPO ANOTACIONES INTERNAS A OFERTA
-- ============================================


INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('OFERTA_ENVIAR_A_VALIDAR', 'Permite enviar una oferta a validación (cambiar estado a OF_PENDIENTE)', 'oferta'),
('OFERTA_RECHAZAR', 'Permite rechazar una oferta (cambiar estado a OF_RECHAZADA)', 'oferta'),
('OFERTA_APROBAR', 'Permite aprobar una aprobación de oferta', 'oferta'),
('OFERTA_VER_APROBACIONES', 'Permite ver las aprobaciones de una oferta', 'oferta');

CREATE TABLE oferta_aprobacion_tipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL
);

CREATE TABLE oferta_aprobacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oferta_id INT NOT NULL,
    oferta_aprobacion_tipo_id INT NOT NULL,
    aprobador_id INT NULL,
    fecha_aprobacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NULL,
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_oferta_aprobacion_oferta FOREIGN KEY (oferta_id) REFERENCES oferta(id) ON DELETE CASCADE,
    CONSTRAINT fk_oferta_aprobacion_tipo FOREIGN KEY (oferta_aprobacion_tipo_id) REFERENCES oferta_aprobacion_tipo(id)
);

-- ============================================
-- AGREGAR PERMISO PARA FINALIZAR SOLCOM
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('SOLCOM_FINALIZAR', 'Permite finalizar una SOLCOM (cambiar estado a SOLC_FIN)', 'solcom');
INSERT INTO oferta_aprobacion_tipo (codigo, nombre) VALUES
('APROB_TEC', 'TECNICA'),
('APROB_CAL', 'CALIDAD'),
('APROB_GER', 'GERENCIA'),
('APROB_ADM', 'ADMINISTRACION Y FINANZAS');

-- ============================================
-- CREAR PERMISOS PARA APROBAR/RECHAZAR CADA TIPO DE APROBACIÓN
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
-- Aprobación Técnica
('OFERTA_APROBAR_TECNICA', 'Permite aprobar o rechazar la aprobación técnica de una oferta', 'oferta'),
-- Aprobación de Calidad
('OFERTA_APROBAR_CALIDAD', 'Permite aprobar o rechazar la aprobación de calidad de una oferta', 'oferta'),
-- Aprobación de Gerencia
('OFERTA_APROBAR_GERENCIA', 'Permite aprobar o rechazar la aprobación de gerencia de una oferta', 'oferta'),
-- Aprobación de Administración y Finanzas
('OFERTA_APROBAR_ADMINISTRACION', 'Permite aprobar o rechazar la aprobación de administración y finanzas de una oferta', 'oferta');



INSERT INTO estado_compras (codigo, nombre, tipo) VALUES
('SOLC_INI', 'INICIADA', 'SOLCOM'),
('SOLC_RECH', 'RECHAZADA', 'SOLCOM'),
('SOLC_AP', 'APROBADA', 'SOLCOM'),
('SOLC_FIN', 'FINALIZADA', 'SOLCOM');

INSERT INTO estado_compras (codigo, nombre, tipo) VALUES
('OF_INICIADA', 'INICIADA', 'OFERTA'),
('OF_VALIDACION', 'VALIDACIÓN', 'OFERTA'),
('OF_RECHAZADA', 'RECHAZADA', 'OFERTA'),
('OF_ACEPTADA', 'ACEPTADA', 'OFERTA');

-- ============================================
-- PERMISOS PARA FILTROS DE SOLCOM POR ESTADO
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('SOLCOM_FILTRO_VER_PENDIENTES', 'Permite ver SOLCOM con estado SOLC_INI (Iniciada)', 'solcom'),
('SOLCOM_FILTRO_VER_APROBADAS', 'Permite ver SOLCOM con estado SOLC_AP (Aprobada)', 'solcom'),
('SOLCOM_FILTRO_VER_RECHAZADAS', 'Permite ver SOLCOM con estado SOLC_RECH (Rechazada)', 'solcom'),
('SOLCOM_FILTRO_VER_FINALIZADAS', 'Permite ver SOLCOM con estado SOLC_FIN (Finalizada)', 'solcom'),
('SOLCOM_MODIFICAR_ESTADO', 'Permite cambiar el estado de una SOLCOM', 'solcom');

-- ============================================
-- PERMISO Y RUTA PARA VER MIS OFERTAS
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_MIS_OFERTAS', 'Mis ofertas', 'rutas');

-- ============================================
-- PERMISOS PARA FILTROS DE SOLCOM (VER PROPIAS Y VER TODAS)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('SOLCOM_FILTRO_VER_PROPIAS', 'Permite ver solo SOLCOM creadas por mí (usuarioId)', 'solcom'),
('SOLCOM_FILTRO_VER_TODAS', 'Permite ver todas las SOLCOM sin restricción', 'solcom');

-- ============================================
-- PERMISO PARA LISTAR PRESUPUESTOS (usado en selectores)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_LISTAR', 'Permite listar presupuestos (usado en selectores)', 'presupuestos');