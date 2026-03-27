-- Migración: Agregar centro_costo_id a movimiento_inventario e inventario_reservas
-- Fecha: 2025-10-19

-- Agregar columna centro_costo_id a movimiento_inventario
ALTER TABLE movimiento_inventario 
ADD COLUMN centro_costo_id INT NULL AFTER inventario_conversion_id,
ADD CONSTRAINT fk_movimiento_inventario_centro_costo 
    FOREIGN KEY (centro_costo_id) REFERENCES centro_costo(id) ON DELETE SET NULL;

-- Agregar índice para mejorar consultas
CREATE INDEX idx_movimiento_inventario_centro_costo ON movimiento_inventario(centro_costo_id);

-- Agregar columna centro_costo_id a inventario_reservas
ALTER TABLE inventario_reservas 
ADD COLUMN centro_costo_id INT NULL AFTER origen,
ADD CONSTRAINT fk_inventario_reservas_centro_costo 
    FOREIGN KEY (centro_costo_id) REFERENCES centro_costo(id) ON DELETE SET NULL;

-- Agregar índice para mejorar consultas
CREATE INDEX idx_inventario_reservas_centro_costo ON inventario_reservas(centro_costo_id);

ALTER TABLE `pintegralco`.`inventario_reservas` 
CHANGE COLUMN `estado` `estado` VARCHAR(10) NULL DEFAULT NULL ;
