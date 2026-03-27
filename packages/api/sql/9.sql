ALTER TABLE `pintegralco`.`presupuesto` 
CHANGE COLUMN `presupuestoId` `id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `pintegralco`.`orden` 
CHANGE COLUMN `ordenId` `id` INT NOT NULL AUTO_INCREMENT ;




DROP TABLE IF EXISTS receta_inventario;
CREATE TABLE `receta_inventario` (
  `id` int NOT NULL AUTO_INCREMENT, -- Nueva columna id como clave primaria
  `receta_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `tipo` enum('SUMINISTROS', 'MATERIALES', 'MANO_DE_OBRA') NOT NULL,
  `cantidad` int NOT NULL,
  `etapa` enum('METALURGICA', 'PINTURA', 'GRAFICA', 'PLOTEO', 'TERMINACIONES', 'OBRA', 'MONTAJE', 'SERVICIO_PETROLERO') NOT NULL,
  `produccion_trabajo_id` int NOT NULL,
  PRIMARY KEY (`id`), -- id como clave primaria
  KEY `producto_id` (`producto_id`),
  KEY `receta_inventario_ibfk_3` (`produccion_trabajo_id`),
  CONSTRAINT `receta_inventario_ibfk_1` FOREIGN KEY (`receta_id`) REFERENCES `receta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `receta_inventario_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `inventario` (`inventarioId`) ON DELETE CASCADE,
  CONSTRAINT `receta_inventario_ibfk_3` FOREIGN KEY (`produccion_trabajo_id`) REFERENCES `produccion_trabajos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* ALTER TABLE presupuesto AUTO_INCREMENT = 6131; */ /*Revisar cual es el ultimo id al momento de crear*/

ALTER TABLE `pintegralco`.`presupuesto_h` 
CHANGE COLUMN `presupuestohId` `id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `pintegralco`.`presupuesto_h` 
CHANGE COLUMN `cantidad` `cantidad` INT NULL DEFAULT 0 ;


ALTER TABLE `pintegralco`.`presupuesto_suministros` 
CHANGE COLUMN `suministroId` `id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `pintegralco`.`presupuesto_materiales` 
CHANGE COLUMN `materialId` `id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
CHANGE COLUMN `manodeobraId` `id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
DROP FOREIGN KEY `fk_presupuesto_manodeobra_presupuestoh`;
ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
CHANGE COLUMN `presupuestohId` `presupuestoItemId` INT NULL DEFAULT NULL ;
ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
ADD CONSTRAINT `fk_presupuesto_manodeobra_presupuestoh`
  FOREIGN KEY (`presupuestoItemId`)
  REFERENCES `pintegralco`.`presupuesto_h` (`id`);

ALTER TABLE `pintegralco`.`presupuesto_materiales` 
DROP FOREIGN KEY `fk_presupuesto_materiales_presupuestoh`;
ALTER TABLE `pintegralco`.`presupuesto_materiales` 
CHANGE COLUMN `presupuestohId` `presupuestoItemId` INT NULL DEFAULT NULL ;
ALTER TABLE `pintegralco`.`presupuesto_materiales` 
ADD CONSTRAINT `fk_presupuesto_materiales_presupuestoh`
  FOREIGN KEY (`presupuestoItemId`)
  REFERENCES `pintegralco`.`presupuesto_h` (`id`);

ALTER TABLE `pintegralco`.`presupuesto_suministros` 
DROP FOREIGN KEY `fk_presupuesto_suministros_presupuestoh`;
ALTER TABLE `pintegralco`.`presupuesto_suministros` 
CHANGE COLUMN `presupuestohId` `presupuestoItemId` INT NULL DEFAULT NULL ;
ALTER TABLE `pintegralco`.`presupuesto_suministros` 
ADD CONSTRAINT `fk_presupuesto_suministros_presupuestoh`
  FOREIGN KEY (`presupuestoItemId`)
  REFERENCES `pintegralco`.`presupuesto_h` (`id`);

ALTER TABLE `pintegralco`.`presupuesto_materiales` 
CHANGE COLUMN `cantidad` `cantidad` INT NOT NULL DEFAULT 0 ,
CHANGE COLUMN `cantidad_real` `cantidad_real` INT NOT NULL DEFAULT 0 ;

ALTER TABLE `pintegralco`.`presupuesto_manodeobra` 
CHANGE COLUMN `cantidad` `cantidad` INT NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `cantidad_real` `cantidad_real` INT NOT NULL DEFAULT '0.00' ;

ALTER TABLE `pintegralco`.`presupuesto_suministros` 
CHANGE COLUMN `cantidad` `cantidad` INT NOT NULL DEFAULT '0.00' ,
CHANGE COLUMN `cantidad_real` `cantidad_real` INT NOT NULL DEFAULT '0.00' ;


ALTER TABLE presupuesto_h
ADD COLUMN receta_id INT NULL;

ALTER TABLE presupuesto_h
ADD CONSTRAINT fk_presupuesto_h_receta
FOREIGN KEY (receta_id) REFERENCES receta(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE presupuesto_manodeobra MODIFY COLUMN importe DECIMAL(18,2);
ALTER TABLE presupuesto_materiales MODIFY COLUMN importe DECIMAL(18,2);
ALTER TABLE presupuesto_suministros MODIFY COLUMN importe DECIMAL(18,2);



ALTER TABLE presupuesto_h 
MODIFY materiales_costo DECIMAL(20,2),
MODIFY suministros_costo DECIMAL(20,2),
MODIFY manodeobra_costo DECIMAL(20,2);

INSERT INTO `pintegralco`.`permiso` (`nombre`) VALUES ('Costeo Comercial');

ALTER TABLE presupuesto MODIFY estructura_costo DECIMAL(20,2) DEFAULT 0.0;
ALTER TABLE presupuesto MODIFY vendedor_costo DECIMAL(20,2) DEFAULT 0.0;
ALTER TABLE presupuesto MODIFY director_costo DECIMAL(20,2) DEFAULT 0.0;

CREATE TABLE presupuesto_leido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    presupuesto_id INT,
    fecha TIMESTAMP
);
