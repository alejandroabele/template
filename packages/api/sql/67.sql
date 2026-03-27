-- Simplificación del módulo de jornadas

-- 1. Crear tabla intermedia para relación Many-to-Many entre jornadas y personas
CREATE TABLE jornada_persona (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jornada_id INT NOT NULL,
  persona_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL,
  FOREIGN KEY (jornada_id) REFERENCES jornada(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE,
  INDEX idx_jornada_id (jornada_id),
  INDEX idx_persona_id (persona_id),
  UNIQUE KEY unique_jornada_persona (jornada_id, persona_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Agregar nuevo campo fecha
ALTER TABLE jornada
  ADD COLUMN fecha VARCHAR(100) NULL AFTER id;

-- 3. Eliminar columnas obsoletas de la tabla jornada
ALTER TABLE jornada
  DROP COLUMN fecha_inicio,
  DROP COLUMN fecha_fin,
  DROP COLUMN fecha_inicio_jornada,
  DROP COLUMN fecha_fin_jornada,
  DROP COLUMN persona_id;

-- 4. Eliminar permisos obsoletos
DELETE FROM role_permissions WHERE permission_id IN (
  SELECT id FROM permissions WHERE codigo IN ('JORNADA_VER_FECHAS', 'JORNADA_INICIAR_FINALIZAR')
);

DELETE FROM permissions WHERE codigo IN ('JORNADA_VER_FECHAS', 'JORNADA_INICIAR_FINALIZAR');
