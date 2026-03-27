INSERT INTO `pintegralco`.`permiso` (`id`, `nombre`, `color`, `icono`) VALUES ('12', 'Finanzas', '#0004FF', 'ChartLine');


CREATE TABLE configuracion_generica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seccion VARCHAR(100) NOT NULL,
    clave VARCHAR(100) NOT NULL,
    valor VARCHAR(255),
    UNIQUE (seccion, clave)
);

ALTER TABLE cashflow_transaccion 
ADD COLUMN proyectado TINYINT DEFAULT 0;


ALTER TABLE `pintegralco`.`cashflow_categoria` 
ADD COLUMN `metodo_pago_id` INT NULL;
