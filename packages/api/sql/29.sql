ALTER TABLE `pintegralco`.`presupuesto` 
CHANGE COLUMN `fecha_entrega_estimada_serv` `fecha_fabricacion_estimada` DATE NULL DEFAULT NULL ,
CHANGE COLUMN `fecha_solicitud_serv` `fecha_fabricacion` DATE NULL DEFAULT NULL ;
