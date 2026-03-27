-- Migración 83: modelo_id nullable para soportar envíos agrupados por cliente
ALTER TABLE envio_notificacion
    MODIFY COLUMN modelo_id INT NULL COMMENT 'ID de la entidad (null si el envío agrupa múltiples)';


