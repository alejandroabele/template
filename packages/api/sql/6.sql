ALTER TABLE alquiler_facturacion DROP FOREIGN KEY alquiler_facturacion_ibfk_1;
ALTER TABLE alquiler_facturacion ADD CONSTRAINT alquiler_facturacion_ibfk_1 
FOREIGN KEY (alquiler_id) REFERENCES alquiler(id) ON DELETE CASCADE;

ALTER TABLE alquiler_cobranzas DROP FOREIGN KEY alquiler_cobranzas_ibfk_1;
ALTER TABLE alquiler_cobranzas ADD CONSTRAINT alquiler_cobranzas_ibfk_1 
FOREIGN KEY (alquiler_id) REFERENCES alquiler(id) ON DELETE CASCADE;
/* Agregarmos cascada a la hora de eliminar los datos? */