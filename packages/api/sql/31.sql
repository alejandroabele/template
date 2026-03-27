-- 1. Elimina la foreign key actual
ALTER TABLE contrato_marco_presupuesto_item
DROP FOREIGN KEY fk_contrato_marco_presupuesto_item_presupuesto_item;

-- 2. Crea la foreign key con borrado en cascada
ALTER TABLE contrato_marco_presupuesto_item
ADD CONSTRAINT fk_contrato_marco_presupuesto_item_presupuesto_item
FOREIGN KEY (presupuesto_item_id)
REFERENCES presupuesto_h(id)
ON DELETE CASCADE;
