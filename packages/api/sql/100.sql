-- Módulo de Herramientas: permisos RBAC y rutas de menú
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('HERRAMIENTA_VER', 'Ver herramientas', 'herramienta'),
('HERRAMIENTA_GESTIONAR', 'Registrar préstamos y devoluciones de herramientas', 'herramienta'),
('RUTA_HERRAMIENTAS', 'Acceso a página de herramientas', 'rutas');