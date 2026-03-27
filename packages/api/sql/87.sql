-- ============================================
-- MIGRACIÓN 87: PERMISOS JORNADA Y REFRIGERIO
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('JORNADA_INICIAR', 'Iniciar jornada de una persona', 'jornada'),
('JORNADA_FINALIZAR', 'Finalizar jornada de una persona', 'jornada'),
('REFRIGERIO_INICIAR', 'Iniciar refrigerio de una persona', 'refrigerio'),
('REFRIGERIO_FINALIZAR', 'Finalizar refrigerio de una persona', 'refrigerio');
