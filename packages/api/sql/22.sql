ALTER TABLE presupuesto
ADD COLUMN alquiler_recurso_id INTEGER,
ADD CONSTRAINT fk_presupuesto_alquiler_recurso
FOREIGN KEY (alquiler_recurso_id)
REFERENCES alquiler_recurso(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;


ALTER TABLE presupuesto
ADD COLUMN produccion_estatus VARCHAR(50);


UPDATE presupuesto
SET produccion_estatus = 'pendiente'
WHERE produccion_estatus IS NULL OR produccion_estatus = '';

ALTER TABLE alquiler ADD COLUMN periodicidad_actualizacion VARCHAR(10);
