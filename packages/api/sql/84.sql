-- Configuración de Notificaciones
INSERT INTO `config` (clave, valor, modulo, descripcion) VALUES
('notificaciones_email_from', '', 'administracion', 'Dirección de envío (From) para notificaciones por email. Debe estar configurada como alias en la cuenta SMTP.'),
('notificaciones_email_activo', '0', 'administracion', 'Activar envío real de emails de notificación. Si está desactivado, los envíos se redirigen al email de prueba.'),
('notificaciones_email_test', '', 'administracion', 'Email de prueba al que se redirigen los envíos cuando el envío real está desactivado.');

-- Permisos
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('NOTIFICACIONES_CONFIG', 'Configuración de notificaciones', 'configuracion'),
('RUTA_NOTIFICACIONES_CONFIG', 'Acceso a configuración de notificaciones', 'rutas');
