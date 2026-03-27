-- ============================================
-- MIGRACIÓN 86: PERMISO ESTADO DEL PERSONAL
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_ESTADO_PERSONAL', 'Acceso a la vista de estado del personal en producción', 'rutas');
