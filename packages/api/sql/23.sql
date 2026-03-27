CREATE TABLE proveedor_rubro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50),
    cuit VARCHAR(20),
    razon_social VARCHAR(100),
    domicilio VARCHAR(100),
    localidad VARCHAR(50),
    telefono_contacto_1 VARCHAR(20),
    telefono_contacto_2 VARCHAR(20),
    email VARCHAR(100),
    numero_ingresos_brutos VARCHAR(30),
    notas TEXT,
    condicion_frente_iva VARCHAR(50),
    proveedor_rubro_id INT,
    FOREIGN KEY (proveedor_rubro_id) REFERENCES proveedor_rubro(id)
);
