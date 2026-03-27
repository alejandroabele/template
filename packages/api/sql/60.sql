INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CONTACTO_CASO_VER', 'Ver casos de contacto', 'contacto_caso'),
('CONTACTO_CASO_CREAR', 'Crear casos de contacto', 'contacto_caso'),
('CONTACTO_CASO_EDITAR', 'Editar casos de contacto', 'contacto_caso'),
('CONTACTO_CASO_ELIMINAR', 'Eliminar casos de contacto', 'contacto_caso'),
('RUTA_CONTACTO_CASOS', 'Casos de contacto (CRM)', 'rutas');

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CONTACTO_VER', 'Ver contactos', 'contacto'),
('CONTACTO_CREAR', 'Crear contactos', 'contacto'),
('CONTACTO_EDITAR', 'Editar contactos', 'contacto'),
('CONTACTO_ELIMINAR', 'Eliminar contactos', 'contacto');

ALTER TABLE presupuesto ADD COLUMN contacto_caso_id INT NULL;

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_CALENDARIO_CONTACTOS', 'Calendario de Contactos', 'rutas');
