ALTER TABLE presupuesto_h
ADD COLUMN created_at TIMESTAMP NULL,
ADD COLUMN created_by INT NULL,
ADD COLUMN updated_at TIMESTAMP NULL,
ADD COLUMN updated_by INT NULL,
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN deleted_by INT NULL;



ALTER TABLE `pintegralco`.`presupuesto` 
CHANGE COLUMN `costoadmin_total` `costoadmin_total` VARCHAR(100) NOT NULL DEFAULT '0.00' AFTER `jefeprod_comision`,
CHANGE COLUMN `total` `total` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `venta_total` `venta_total` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `costo_total` `costo_total` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `estructura_comision` `estructura_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `estructura_costo` `estructura_costo` VARCHAR(100) NULL DEFAULT '0.00' ,
CHANGE COLUMN `vendedor_comision` `vendedor_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `vendedor_costo` `vendedor_costo` VARCHAR(100) NULL DEFAULT '0.00' ,
CHANGE COLUMN `director_comision` `director_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `director_costo` `director_costo` VARCHAR(100) NULL DEFAULT '0.00' ,
CHANGE COLUMN `gerente_comision` `gerente_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `gerente_costo` `gerente_costo` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `jefeprod_comision` `jefeprod_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `jefeprod_costo` `jefeprod_costo` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_ingresos_comision` `tax_ingresos_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_ingresos_costo` `tax_ingresos_costo` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_transf_comision` `tax_transf_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_transf_costo` `tax_transf_costo` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_ganancias_comision` `tax_ganancias_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_ganancias_costo` `tax_ganancias_costo` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `tax_total` `tax_total` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `contrib_marginal` `contrib_marginal` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `margen_total` `margen_total` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `bab` `bab` VARCHAR(100) NOT NULL DEFAULT '0.00' ;

ALTER TABLE `pintegralco`.`presupuesto_h` 
CHANGE COLUMN `materiales_costo` `materiales_costo` VARCHAR(100) NULL DEFAULT NULL ,
CHANGE COLUMN `materiales_venta` `materiales_venta` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `suministros_costo` `suministros_costo` VARCHAR(100) NULL DEFAULT NULL ,
CHANGE COLUMN `suministros_venta` `suministros_venta` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `manodeobra_costo` `manodeobra_costo` VARCHAR(100) NULL DEFAULT NULL ,
CHANGE COLUMN `manodeobra_venta` `manodeobra_venta` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `trabajocampo_costo` `trabajocampo_costo` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `trabajocampo_comision` `trabajocampo_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `trabajocampo_venta` `trabajocampo_venta` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `iva_comision` `iva_comision` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `venta` `venta` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `producto_costo_estimado` `producto_costo_estimado` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `servicio_costo_estimado` `servicio_costo_estimado` VARCHAR(100) NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `total_costo_estimado` `total_costo_estimado` VARCHAR(100) NOT NULL DEFAULT '0.00' ;
