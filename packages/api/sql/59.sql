CREATE TABLE contacto_tipo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  icono VARCHAR(50) NULL,
  color VARCHAR(50) NULL,
  created_at TIMESTAMP NULL,
  created_by INT NULL,
  updated_at TIMESTAMP NULL,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL
);

CREATE TABLE contacto_caso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  cliente_id INT NULL,
  nombre_contacto VARCHAR(255),
  email_contacto VARCHAR(255),
  telefono_contacto VARCHAR(50),
  vendedor_id INT NOT NULL,
  notas VARCHAR(255),

  created_at TIMESTAMP NULL,
  created_by INT NULL,
  updated_at TIMESTAMP NULL,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL
);

CREATE TABLE contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caso_id INT NOT NULL,
  tipo_id INT NOT NULL,
  descripcion VARCHAR(255),
  resultado VARCHAR(255),
  fecha VARCHAR(50),
  vendedor_id INT NOT NULL,
  created_at TIMESTAMP NULL,
  created_by INT NULL,
  updated_at TIMESTAMP NULL,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL
);

CREATE TABLE contacto_proximo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caso_id INT NOT NULL,
  fecha VARCHAR(50),
  tipo_id INT NOT NULL,
  nota VARCHAR(255),
  created_at TIMESTAMP NULL,
  created_by INT NULL,
  updated_at TIMESTAMP NULL,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL
);

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CONTACTO_TIPO_VER', 'Ver tipos de contacto', 'contacto_tipo'),
('CONTACTO_TIPO_CREAR', 'Crear tipos de contacto', 'contacto_tipo'),
('CONTACTO_TIPO_EDITAR', 'Editar tipos de contacto', 'contacto_tipo'),
('CONTACTO_TIPO_ELIMINAR', 'Eliminar tipos de contacto', 'contacto_tipo'),
('RUTA_CONTACTO_TIPO', 'Tipos de contacto (CRM)', 'rutas');
