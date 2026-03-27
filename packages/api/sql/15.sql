DELETE FROM presupuesto;
DELETE FROM presupuesto_facturacion;
DELETE FROM presupuesto_h;
DELETE FROM presupuesto_h_adicional;
DELETE FROM presupuesto_h_archs;
DELETE FROM presupuesto_h_trabajos;
DELETE FROM presupuesto_h_trabajos_imagen;
DELETE FROM presupuesto_manodeobra;
DELETE FROM presupuesto_materiales;
DELETE FROM presupuesto_suministros;
DELETE FROM presupuesto_produccion;
DELETE FROM presupuesto_trabajocampo;

ALTER TABLE presupuesto AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_h AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_facturacion AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_cobro AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_h_trabajos AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_leido AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_manodeobra AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_materiales AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_produccion AUTO_INCREMENT = 1;
ALTER TABLE presupuesto_suministros AUTO_INCREMENT = 1;
ALTER TABLE mensaje AUTO_INCREMENT = 1;
ALTER TABLE notificacion AUTO_INCREMENT = 1;

