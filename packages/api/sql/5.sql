ALTER TABLE pintegralco.mensaje ADD tipo varchar(100) NULL;
UPDATE pintegralco.mensaje SET tipo = "presupuesto" WHERE TRUE;

ALTER TABLE pintegralco.mensaje ADD fecha_visto DATETIME DEFAULT NULL NULL;

ALTER TABLE pintegralco.notificacion ADD fecha_visto DATETIME NULL;
UPDATE usuario
SET pwd = '$2a$12$uG36vFTYJ1wVOn7PG/V15eK5RUKFXewfPL4E13u6EOP/ambn4eMfe';
ALTER TABLE mensaje DROP FOREIGN KEY fk_presupuesto_mensaje;