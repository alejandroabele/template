CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    fecha_nacimiento VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    created_by INT NULL,
    updated_at TIMESTAMP NULL,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
);

CREATE TABLE jornada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio VARCHAR(100),
    fecha_fin VARCHAR(100),
    fecha_inicio_jornada VARCHAR(100),
    fecha_fin_jornada VARCHAR(100),
    detalle VARCHAR(255),
    anotaciones TEXT,
    cancelado TINYINT(1) DEFAULT 0,
    motivo_cancelacion VARCHAR(255),
    presupuesto_id INT,
    produccion_trabajo_id INT,
    persona_id INT,
    created_at TIMESTAMP NULL,
    created_by INT NULL,
    updated_at TIMESTAMP NULL,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
);

-- Permisos de Personas
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PERSONA_VER', 'Ver personas', 'persona'),
('PERSONA_CREAR', 'Crear personas', 'persona'),
('PERSONA_EDITAR', 'Editar personas', 'persona'),
('PERSONA_ELIMINAR', 'Eliminar personas', 'persona'),
('RUTA_PERSONAS', 'Acceso a la página de personas', 'rutas');

-- Permisos de Jornadas
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('JORNADA_VER', 'Permite Ver jornadas', 'jornada'),
('JORNADA_CREAR', 'Permite Crear jornadas', 'jornada'),
('JORNADA_EDITAR', 'Permite Editar jornadas', 'jornada'),
('JORNADA_ELIMINAR', 'Permite Eliminar jornadas', 'jornada'),
('JORNADA_VER_FECHAS', 'Permite ver fechas de inicio y fin de jornadas', 'jornada');

-- Permiso de ruta para planificaciones
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_PLANIFICACIONES', 'Acceso a la página de planificaciones', 'rutas');


-- Insertar configuraciones del módulo Cashflow
INSERT INTO `config` (clave, valor, modulo, descripcion) VALUES
('cashflow_dias_habiles_edicion', '5', 'cashflow', 'Cantidad de días hábiles hacia atrás que se permite modificar registros de cashflow'),
('cashflow_permitir_edicion_sin_limite', 'false', 'cashflow', 'Permitir edición de registros de cashflow sin restricción de días hábiles. Si está activado, no aplica el límite de días hábiles');

-- Insertar permisos del módulo Cashflow (para configuración)
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CASHFLOW_CONFIG', 'Configuración de cashflow', 'configuracion'),
('RUTA_CASHFLOW_CONFIG', 'Acceso a la página de configuración de cashflow', 'rutas');

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('JORNADA_INICIAR_FINALIZAR', 'Iniciar y finalizar jornadas', 'jornada');
