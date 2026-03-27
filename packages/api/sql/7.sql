/**ALTER TABLE pintegralco.notificacion
 ADD COLUMN fecha_visto DATETIME NULL; **/

ALTER TABLE notificacion DROP FOREIGN KEY fk_presupuesto_notificacion;
ALTER TABLE notificacion DROP FOREIGN KEY fk_tipo_usuario_notificacion;
ALTER TABLE pintegralco.notificacion MODIFY COLUMN nota varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL;
ALTER TABLE pintegralco.notificacion ADD tipo varchar(100) NULL;
UPDATE pintegralco.notificacion SET tipo = "presupuesto" WHERE TRUE;
