ALTER TABLE presupuesto_manodeobra DROP FOREIGN KEY fk_presupuesto_manodeobra_presupuestoh;

ALTER TABLE presupuesto_manodeobra
ADD CONSTRAINT fk_presupuesto_manodeobra_presupuestoh
FOREIGN KEY (presupuestoItemId) REFERENCES presupuesto_h(id) ON DELETE CASCADE;

ALTER TABLE presupuesto_materiales DROP FOREIGN KEY fk_presupuesto_materiales_presupuestoh;
ALTER TABLE presupuesto_materiales
ADD CONSTRAINT fk_presupuesto_materiales_presupuestoh
FOREIGN KEY (presupuestoItemId) REFERENCES presupuesto_h(id) ON DELETE CASCADE;

ALTER TABLE presupuesto_suministros DROP FOREIGN KEY fk_presupuesto_suministros_presupuestoh;

ALTER TABLE presupuesto_suministros
ADD CONSTRAINT fk_presupuesto_suministros_presupuestoh
FOREIGN KEY (presupuestoItemId) REFERENCES presupuesto_h(id) ON DELETE CASCADE;

ALTER TABLE presupuesto
ADD COLUMN costeo_estatus VARCHAR(50),
ADD COLUMN costeo_comercial_estatus VARCHAR(50);
