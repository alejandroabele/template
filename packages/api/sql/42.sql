-- Migración: Cambiar relación de movimiento_inventario de presupuesto_item_id a presupuesto_id
-- Fecha: 2025-10-19

-- Paso 1: Agregar columna presupuesto_id en movimiento_inventario
ALTER TABLE movimiento_inventario 
ADD COLUMN presupuesto_id INTEGER;

-- Paso 2: Actualizar los movimientos existentes con el presupuesto_id del presupuesto_h
UPDATE movimiento_inventario mi
SET presupuesto_id = (
    SELECT ph.presupuestoId 
    FROM presupuesto_h ph 
    WHERE ph.id = mi.presupuesto_item_id
)
WHERE mi.presupuesto_item_id IS NOT NULL;

-- Paso 3: Agregar columna presupuesto_id en inventario_reservas
ALTER TABLE inventario_reservas 
ADD COLUMN presupuesto_id INTEGER;

-- Paso 4: Actualizar las reservas existentes con el presupuesto_id del presupuesto_h
UPDATE inventario_reservas ir
SET presupuesto_id = (
    SELECT ph.presupuestoId 
    FROM presupuesto_h ph 
    WHERE ph.id = ir.presupuesto_item_id
)
WHERE ir.presupuesto_item_id IS NOT NULL;

-- Paso 5: Eliminar las columnas presupuesto_item_id (opcional, comentado por seguridad)
-- ALTER TABLE movimiento_inventario DROP COLUMN presupuesto_item_id;
-- ALTER TABLE inventario_reservas DROP COLUMN presupuesto_item_id;

-- Agregar índices para mejorar las consultas
CREATE INDEX idx_movimiento_inventario_presupuesto_id 
ON movimiento_inventario(presupuesto_id);

CREATE INDEX idx_inventario_reservas_presupuesto_id 
ON inventario_reservas(presupuesto_id);
