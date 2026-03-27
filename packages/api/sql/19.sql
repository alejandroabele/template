UPDATE presupuesto
SET facturacion_estatus = 'pendiente'
WHERE facturacion_estatus IS NULL OR facturacion_estatus = '';


UPDATE presupuesto
SET cobranza_estatus = 'pendiente'
WHERE cobranza_estatus IS NULL OR cobranza_estatus = '';

UPDATE presupuesto
SET costeo_estatus = 'pendiente'
WHERE costeo_estatus IS NULL OR costeo_estatus = '';

UPDATE presupuesto
SET costeo_comercial_estatus = 'pendiente'
WHERE costeo_comercial_estatus IS NULL OR costeo_comercial_estatus = '';