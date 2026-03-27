-- ============================================
-- AGREGAR CAMPO COMPRADOR_ID A SOLCOM
-- ============================================

ALTER TABLE `solcom`
ADD COLUMN `comprador_id` INT NULL COMMENT 'Usuario comprador asignado a la SOLCOM';


-- ============================================
-- PERMISO PARA ASIGNAR SOLCOM A COMPRADOR
-- ============================================

INSERT INTO `permissions` (`codigo`, `descripcion`, `modulo`) VALUES
('SOLCOM_ASIGNAR', 'Permite asignar una SOLCOM a un comprador (asignarse a sí mismo)', 'solcom');
